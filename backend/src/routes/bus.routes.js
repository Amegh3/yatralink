// ============================================================
// H/E Travellers CTF Platform - Bus Routes
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── GET /api/v1/buses ────────────────────────────────────────────────────────
router.get('/', asyncHandler(async (req, res) => {
  const { type, operator_id, rating_min } = req.query;

  let query = `
    SELECT b.*, op.company_name as operator_name
    FROM buses b
    JOIN operators op ON b.operator_id = op.id
    WHERE b.is_active = true
  `;
  const params = [];

  if (type) { query += ` AND b.bus_type = $${params.length + 1}`; params.push(type); }
  if (operator_id) { query += ` AND b.operator_id = $${params.length + 1}`; params.push(operator_id); }
  if (rating_min) { query += ` AND b.rating >= $${params.length + 1}`; params.push(parseFloat(rating_min)); }

  query += ' ORDER BY b.rating DESC LIMIT 100';

  const result = await db.query(query, params);
  res.json({ buses: result.rows, total: result.rows.length });
}));

// ─── GET /api/v1/buses/:id ────────────────────────────────────────────────────
router.get('/:id', asyncHandler(async (req, res) => {
  const result = await db.query(`
    SELECT b.*, op.company_name as operator_name, op.contact_email,
      array_agg(DISTINCT jsonb_build_object(
        'id', s.id, 'seat_number', s.seat_number, 'seat_type', s.seat_type,
        'berth_type', s.berth_type, 'is_ladies', s.is_ladies
      )) as seats
    FROM buses b
    JOIN operators op ON b.operator_id = op.id
    LEFT JOIN seats s ON s.bus_id = b.id
    WHERE b.id = $1
    GROUP BY b.id, op.company_name, op.contact_email
  `, [req.params.id]);

  if (!result.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Bus not found' });
  }

  res.json({ bus: result.rows[0] });
}));

// ─── GET /api/v1/buses/:id/seats ─────────────────────────────────────────────
router.get('/:busId/seats/:scheduleId', asyncHandler(async (req, res) => {
  const { busId, scheduleId } = req.params;

  // Get all seats for this bus
  const seats = await db.query(
    'SELECT * FROM seats WHERE bus_id = $1 ORDER BY row_number, column_number',
    [busId]
  );

  // Get booked seats for this schedule
  const booked = await db.query(`
    SELECT bs.seat_id, bs.passenger_name, bs.passenger_gender
    FROM booking_seats bs
    JOIN bookings b ON bs.booking_id = b.id
    WHERE b.schedule_id = $1 AND b.booking_status NOT IN ('CANCELLED')
  `, [scheduleId]);

  const bookedIds = new Set(booked.rows.map(r => r.seat_id));

  const seatMap = seats.rows.map(seat => ({
    ...seat,
    status: bookedIds.has(seat.id) ? 'BOOKED' : 'AVAILABLE',
  }));

  res.json({ seats: seatMap, schedule_id: scheduleId });
}));

// ─── POST /api/v1/buses (operator/admin only) ─────────────────────────────────
router.post('/', authenticate, asyncHandler(async (req, res) => {
  if (!['operator', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden', message: 'Operator access required' });
  }

  const { bus_name, bus_number, bus_type, total_seats, amenities } = req.body;

  // Get operator_id for this user
  const opResult = await db.query('SELECT id FROM operators WHERE user_id = $1', [req.user.id]);
  if (!opResult.rows.length && req.user.role !== 'admin') {
    return res.status(404).json({ error: 'NotFound', message: 'Operator profile not found' });
  }

  const operator_id = req.user.role === 'admin' ? req.body.operator_id : opResult.rows[0].id;

  const result = await db.query(`
    INSERT INTO buses (operator_id, bus_name, bus_number, bus_type, total_seats, amenities, rating, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, 4.0, true)
    RETURNING *
  `, [operator_id, bus_name, bus_number, bus_type, total_seats, JSON.stringify(amenities || {})]);

  res.status(201).json({ success: true, bus: result.rows[0] });
}));

// ─── PUT /api/v1/buses/:id ────────────────────────────────────────────────────
router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  if (!['operator', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden', message: 'Operator access required' });
  }

  const { bus_name, bus_number, bus_type, total_seats, amenities, is_active } = req.body;

  const result = await db.query(`
    UPDATE buses SET
      bus_name = COALESCE($1, bus_name),
      bus_number = COALESCE($2, bus_number),
      bus_type = COALESCE($3, bus_type),
      total_seats = COALESCE($4, total_seats),
      amenities = COALESCE($5, amenities),
      is_active = COALESCE($6, is_active)
    WHERE id = $7
    RETURNING *
  `, [bus_name, bus_number, bus_type, total_seats, JSON.stringify(amenities), is_active, req.params.id]);

  res.json({ success: true, bus: result.rows[0] });
}));

module.exports = router;
