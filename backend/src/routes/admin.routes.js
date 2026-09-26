// ============================================================
// H/E Travellers CTF Platform - Admin Routes
// CTF Challenges: HE-028 (frontend-only auth), HE-029 (audit log exposure),
//                 HE-030 (CSRF)
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/ctf');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── GET /api/v1/admin/dashboard ─────────────────────────────────────────────
router.get('/dashboard', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const [users, bookings, revenue, buses, tickets] = await Promise.all([
    db.query('SELECT COUNT(*) FROM users'),
    db.query('SELECT COUNT(*) FROM bookings WHERE booking_status = $1', ['CONFIRMED']),
    db.query('SELECT COALESCE(SUM(net_amount), 0) as total FROM bookings WHERE booking_status = $1', ['CONFIRMED']),
    db.query('SELECT COUNT(*) FROM buses WHERE is_active = true'),
    db.query("SELECT COUNT(*) FROM support_tickets WHERE status = 'OPEN'"),
  ]);

  res.json({
    stats: {
      total_users: parseInt(users.rows[0].count),
      confirmed_bookings: parseInt(bookings.rows[0].count),
      total_revenue: parseFloat(revenue.rows[0].total),
      active_buses: parseInt(buses.rows[0].count),
      open_tickets: parseInt(tickets.rows[0].count),
    }
  });
}));

// ─── GET /api/v1/admin/users ─────────────────────────────────────────────────
// HE-028: Some admin endpoints lack proper server-side auth
router.get('/users', asyncHandler(async (req, res) => {
  // HE-028: INTENTIONAL — authenticate middleware not applied here
  // Frontend shows this only to admins, but backend has no check
  const { page = 1, limit = 20, search, role } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT id, email, name, phone, role, is_verified, created_at FROM users WHERE 1=1`;
  const params = [];

  if (search) { query += ` AND (name ILIKE $${params.length+1} OR email ILIKE $${params.length+1})`; params.push(`%${search}%`); }
  if (role) { query += ` AND role = $${params.length+1}`; params.push(role); }

  query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

  const result = await db.query(query, params);
  const count = await db.query('SELECT COUNT(*) FROM users');

  res.json({ 
    users: result.rows, 
    total: parseInt(count.rows[0].count),
    _ctf_flag: 'HE{travellers_028_fr0nt3nd_4uth}',
  });
}));

// ─── GET /api/v1/admin/bookings ───────────────────────────────────────────────
router.get('/bookings', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const result = await db.query(`
    SELECT b.*, u.name as user_name, u.email as user_email,
           r.from_city, r.to_city, s.departure_time
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN schedules s ON b.schedule_id = s.id
    JOIN routes r ON s.route_id = r.id
    ORDER BY b.created_at DESC
    LIMIT 100
  `);
  res.json({ bookings: result.rows });
}));

// ─── GET /api/v1/admin/audit-logs ─────────────────────────────────────────────
// HE-029: Audit logs accessible without admin role
router.get('/audit-logs', asyncHandler(async (req, res) => {
  // HE-029: INTENTIONAL — no role check, any authenticated (or unauthenticated) user can read
  const result = await db.query(`
    SELECT al.*, u.email as user_email
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT 200
  `);
  res.json({ 
    logs: result.rows,
    _ctf_flag: 'HE{travellers_029_4ud1t_l0g_3xp0s3}',
  });
}));

// ─── GET /api/v1/admin/config ─────────────────────────────────────────────────
// HE-032: Config/environment exposure
router.get('/config', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  res.json({
    config: {
      ctf_mode: process.env.CTF_MODE,
      node_env: process.env.NODE_ENV,
      allow_external_network: process.env.ALLOW_EXTERNAL_NETWORK,
      app_url: process.env.APP_URL,
    }
  });
}));

// ─── POST /api/v1/admin/users/:id/role ────────────────────────────────────────
// HE-030: No CSRF protection
router.post('/users/:id/role', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  // HE-030: INTENTIONAL — no CSRF token validation
  // This endpoint changes user roles without verifying request origin
  const { role } = req.body;
  const validRoles = ['user', 'operator', 'admin', 'organizer'];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Validation', message: 'Invalid role' });
  }

  const result = await db.query(
    'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, name, role',
    [role, req.params.id]
  );

  if (!result.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'User not found' });
  }

  await db.query(`
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_data, ip_address)
    VALUES ($1, 'ROLE_CHANGE', 'user', $2, $3, $4)
  `, [req.user.id, req.params.id, JSON.stringify({ role }), req.ip]);

  res.json({ success: true, user: result.rows[0] });
}));

// ─── GET /api/v1/admin/payments ───────────────────────────────────────────────
router.get('/payments', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const result = await db.query(`
    SELECT p.*, b.user_id, u.name as user_name, u.email as user_email
    FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    JOIN users u ON b.user_id = u.id
    ORDER BY p.created_at DESC
    LIMIT 100
  `);
  res.json({ payments: result.rows });
}));

// ─── GET /api/v1/admin/reports/revenue ────────────────────────────────────────
router.get('/reports/revenue', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const result = await db.query(`
    SELECT 
      DATE_TRUNC('day', created_at) as date,
      COUNT(*) as bookings,
      SUM(net_amount) as revenue
    FROM bookings
    WHERE booking_status = 'CONFIRMED'
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY date DESC
    LIMIT 30
  `);
  res.json({ revenue: result.rows });
}));

// ─── POST /api/v1/admin/reset-ctf ────────────────────────────────────────────
router.post('/reset-ctf', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Reset CTF submissions and scores only (preserve main app data)
  await db.query('TRUNCATE TABLE submissions RESTART IDENTITY CASCADE');
  await db.query('TRUNCATE TABLE hint_usages RESTART IDENTITY CASCADE');
  await db.query('TRUNCATE TABLE teams RESTART IDENTITY CASCADE');
  await db.query('TRUNCATE TABLE team_members RESTART IDENTITY CASCADE');

  // Re-enable all challenges
  await db.query('UPDATE challenges SET is_active = true');

  res.json({ success: true, message: 'CTF environment reset successfully' });
}));

// ─── DELETE /api/v1/admin/users/:id ──────────────────────────────────────────
router.delete('/users/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  await db.query('DELETE FROM users WHERE id = $1 AND role != $2', [req.params.id, 'admin']);
  res.json({ success: true, message: 'User deleted' });
}));

module.exports = router;
