// ============================================================
// H/E Travellers CTF Platform - User Routes
// CTF Challenges: HE-006 (IDOR profile), HE-007 (mass assign),
//                 HE-008 (user list), HE-031 (hash exposure)
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── GET /api/v1/users ───────────────────────────────────────────────────────
// HE-008: No pagination / auth check — lists all users with sensitive data
router.get('/', asyncHandler(async (req, res) => {
  // INTENTIONAL: No authentication check — any request can list users
  const { page = 1, limit = 50, search } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT id, email, name, phone, role, is_verified, created_at
    FROM users
  `;
  const params = [];

  if (search) {
    query += ` WHERE name ILIKE $1 OR email ILIKE $1`;
    params.push(`%${search}%`);
  }

  query += ` ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;

  const result = await db.query(query, params);
  const count = await db.query('SELECT COUNT(*) FROM users');

  res.json({
    users: result.rows,
    total: parseInt(count.rows[0].count),
    page: parseInt(page),
    limit: parseInt(limit),
    // HE-008: Flag embedded in API response metadata
    _ctf_flag: 'HE{travellers_008_4p1_us3r_l1st}',
  });
}));

// ─── GET /api/v1/users/:id ────────────────────────────────────────────────────
// HE-006: IDOR — no ownership check, returns any user's profile
// HE-031: Returns password hash in response
router.get('/:id', asyncHandler(async (req, res) => {
  // INTENTIONAL: No authentication or ownership check
  const { id } = req.params;

  const result = await db.query(
    `SELECT id, email, name, phone, role, is_verified, profile_picture, 
            password_hash, reset_token, created_at
     FROM users WHERE id = $1`,
    [id]
  );

  if (!result.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'User not found' });
  }

  const user = result.rows[0];

  // HE-031: password_hash returned in response (not filtered)
  // HE-006: Any user can see any other user's profile including sensitive fields
  res.json({ 
    user,
    // Flag revealed when accessing another user's profile (IDOR condition)
    _ctf_note: user.id !== req.headers['x-user-id'] ? 'HE{travellers_006_1d0r_pr0f1l3}' : undefined,
  });
}));

// ─── PUT /api/v1/users/:id ────────────────────────────────────────────────────
// HE-007: Mass assignment — allows setting 'role' field to escalate privileges
router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Weak ownership check — only compares string
  if (req.user.id.toString() !== id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden', message: 'You can only update your own profile' });
  }

  // INTENTIONAL: No field whitelist — accepts any field including 'role'
  const allowedFields = ['name', 'phone', 'profile_picture', 'role', 'is_verified']; // role should NOT be here
  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Validation', message: 'No fields to update' });
  }

  const setClause = Object.keys(updates).map((k, i) => `${k} = $${i + 2}`).join(', ');
  const values = [id, ...Object.values(updates)];

  const result = await db.query(
    `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING id, email, name, role`,
    values
  );

  const updatedUser = result.rows[0];
  
  // Reveal flag if user successfully escalated to admin role
  const ctfFlag = (updates.role === 'admin' || updates.role === 'operator') 
    ? 'HE{travellers_007_m4ss_4ss1gnm3nt}' 
    : undefined;

  res.json({ 
    success: true, 
    user: updatedUser,
    _ctf_flag: ctfFlag,
  });
}));

// ─── GET /api/v1/users/:id/bookings ──────────────────────────────────────────
// No ownership check — HE-006 extension
router.get('/:id/bookings', authenticate, asyncHandler(async (req, res) => {
  const result = await db.query(
    `SELECT b.*, s.departure_time, r.from_city, r.to_city
     FROM bookings b
     JOIN schedules s ON b.schedule_id = s.id
     JOIN routes r ON s.route_id = r.id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [req.params.id]
  );

  res.json({ bookings: result.rows });
}));

// ─── DELETE /api/v1/users/:id ────────────────────────────────────────────────
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden', message: 'Admin access required' });
  }

  await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  res.json({ success: true, message: 'User deleted' });
}));

module.exports = router;
