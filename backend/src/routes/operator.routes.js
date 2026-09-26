'use strict';
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const requireOperator = (req, res, next) => {
  if (!req.user || !['operator','admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden', message: 'Operator access required' });
  }
  next();
};

router.get('/dashboard', authenticate, requireOperator, asyncHandler(async (req, res) => {
  const opResult = await db.query('SELECT id FROM operators WHERE user_id = $1', [req.user.id]);
  const opId = opResult.rows.length ? opResult.rows[0].id : null;
  const [buses, bookings, revenue] = await Promise.all([
    db.query('SELECT COUNT(*) FROM buses WHERE operator_id = $1', [opId]),
    db.query('SELECT COUNT(*) FROM bookings b JOIN schedules s ON b.schedule_id = s.id JOIN buses bus ON s.bus_id = bus.id WHERE bus.operator_id = $1 AND b.booking_status = $2', [opId, 'CONFIRMED']),
    db.query('SELECT COALESCE(SUM(b.net_amount),0) as total FROM bookings b JOIN schedules s ON b.schedule_id = s.id JOIN buses bus ON s.bus_id = bus.id WHERE bus.operator_id = $1 AND b.booking_status = $2', [opId, 'CONFIRMED']),
  ]);
  res.json({ stats: { buses: parseInt(buses.rows[0].count), bookings: parseInt(bookings.rows[0].count), revenue: parseFloat(revenue.rows[0].total) } });
}));

router.get('/buses', authenticate, requireOperator, asyncHandler(async (req, res) => {
  const opResult = await db.query('SELECT id FROM operators WHERE user_id = $1', [req.user.id]);
  const opId = opResult.rows.length ? opResult.rows[0].id : null;
  const result = await db.query('SELECT * FROM buses WHERE operator_id = $1 ORDER BY created_at DESC', [opId]);
  res.json({ buses: result.rows });
}));

router.get('/bookings', authenticate, requireOperator, asyncHandler(async (req, res) => {
  const opResult = await db.query('SELECT id FROM operators WHERE user_id = $1', [req.user.id]);
  const opId = opResult.rows.length ? opResult.rows[0].id : null;
  const result = await db.query(`
    SELECT b.*, r.from_city, r.to_city, s.departure_time, bus.bus_name, u.name as passenger_name, u.email as passenger_email
    FROM bookings b JOIN schedules s ON b.schedule_id = s.id
    JOIN buses bus ON s.bus_id = bus.id JOIN routes r ON s.route_id = r.id
    LEFT JOIN users u ON b.user_id = u.id
    WHERE bus.operator_id = $1 ORDER BY b.created_at DESC LIMIT 100
  `, [opId]);
  res.json({ bookings: result.rows });
}));

router.post('/schedules', authenticate, requireOperator, asyncHandler(async (req, res) => {
  const { bus_id, route_id, departure_time, arrival_time, departure_date, base_price } = req.body;
  const result = await db.query(`
    INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, departure_date, base_price, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVE')
    RETURNING *
  `, [bus_id, route_id, departure_time, arrival_time, departure_date, base_price]);
  res.status(201).json({ success: true, schedule: result.rows[0] });
}));

module.exports = router;
