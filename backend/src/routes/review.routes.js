// ============================================================
// H/E Travellers CTF Platform - Review Routes
// CTF Challenges: HE-020 (stored XSS), HE-021 (review IDOR)
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── GET /api/v1/reviews ─────────────────────────────────────────────────────
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { bus_id, limit = 20 } = req.query;

  let query = `
    SELECT r.*, u.name as reviewer_name, u.profile_picture as reviewer_avatar,
           b.bus_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    JOIN buses b ON r.bus_id = b.id
    WHERE r.is_approved = true
  `;
  const params = [];

  if (bus_id) {
    query += ` AND r.bus_id = $${params.length + 1}`;
    params.push(bus_id);
  }

  query += ` ORDER BY r.created_at DESC LIMIT ${parseInt(limit)}`;

  const result = await db.query(query, params);
  
  // HE-020: review content returned as-is (no sanitization) — stored XSS
  res.json({ reviews: result.rows });
}));

// ─── POST /api/v1/reviews ─────────────────────────────────────────────────────
// HE-020: Stored XSS in review content
// HE-021: No booking ownership check — can review any booking
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { bus_id, booking_id, rating, title, content } = req.body;

  if (!bus_id || !rating || !content) {
    return res.status(400).json({ error: 'Validation', message: 'bus_id, rating, and content required' });
  }

  // HE-021: INTENTIONAL — no check that booking_id belongs to this user
  if (booking_id) {
    const booking = await db.query('SELECT id FROM bookings WHERE id = $1', [booking_id]);
    if (!booking.rows.length) {
      return res.status(404).json({ error: 'NotFound', message: 'Booking not found' });
    }
    // Missing: check that booking.user_id === req.user.id
  }

  // HE-020: INTENTIONAL — content not sanitized before storing
  // XSS payloads in content/title will be stored and served as-is
  const result = await db.query(`
    INSERT INTO reviews (user_id, bus_id, booking_id, rating, title, content, is_approved)
    VALUES ($1, $2, $3, $4, $5, $6, true)
    RETURNING *
  `, [req.user.id, bus_id, booking_id || null, rating, title, content]);

  res.status(201).json({ 
    success: true, 
    review: result.rows[0],
    // Flag revealed if XSS payload detected
    _ctf_note: 'Review saved. Content is displayed directly to other users.',
  });
}));

// ─── GET /api/v1/reviews/:id ─────────────────────────────────────────────────
router.get('/:id', asyncHandler(async (req, res) => {
  const result = await db.query(`
    SELECT r.*, u.name as reviewer_name, b.bus_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    JOIN buses b ON r.bus_id = b.id
    WHERE r.id = $1
  `, [req.params.id]);

  if (!result.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Review not found' });
  }

  res.json({ review: result.rows[0] });
}));

// ─── DELETE /api/v1/reviews/:id ──────────────────────────────────────────────
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const review = await db.query('SELECT * FROM reviews WHERE id = $1', [req.params.id]);
  
  if (!review.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Review not found' });
  }

  if (review.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden', message: 'Cannot delete this review' });
  }

  await db.query('DELETE FROM reviews WHERE id = $1', [req.params.id]);
  res.json({ success: true, message: 'Review deleted' });
}));

module.exports = router;
