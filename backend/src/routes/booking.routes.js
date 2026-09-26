// ============================================================
// H/E Travellers CTF Platform - Booking Routes
// CTF Challenges: HE-011 (IDOR), HE-012 (price manipulation),
//                 HE-013 (race condition), HE-014 (cancel chain),
//                 HE-015 (predictable IDs)
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');

// ─── GET /api/v1/bookings ─────────────────────────────────────────────────────
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const result = await db.query(`
    SELECT b.*, s.departure_time, s.arrival_time, s.departure_date,
           r.from_city, r.to_city, bus.bus_name, bus.bus_type
    FROM bookings b
    JOIN schedules s ON b.schedule_id = s.id
    JOIN routes r ON s.route_id = r.id
    JOIN buses bus ON s.bus_id = bus.id
    WHERE b.user_id = $1
    ORDER BY b.created_at DESC
  `, [req.user.id]);

  res.json({ bookings: result.rows });
}));

// ─── GET /api/v1/bookings/:id ─────────────────────────────────────────────────
// HE-011: IDOR — no ownership check on booking
router.get('/:id', asyncHandler(async (req, res) => {
  // INTENTIONAL: No authentication or ownership check
  const result = await db.query(`
    SELECT b.*, s.departure_time, s.arrival_time, s.departure_date,
           r.from_city, r.to_city, bus.bus_name, bus.bus_type, bus.bus_number,
           u.name as passenger_name, u.email as passenger_email, u.phone as passenger_phone,
           array_agg(DISTINCT jsonb_build_object(
             'seat_number', bs.passenger_name, 'gender', bs.passenger_gender,
             'age', bs.passenger_age, 'seat', st.seat_number
           )) as passengers
    FROM bookings b
    JOIN schedules s ON b.schedule_id = s.id
    JOIN routes r ON s.route_id = r.id
    JOIN buses bus ON s.bus_id = bus.id
    LEFT JOIN users u ON b.user_id = u.id
    LEFT JOIN booking_seats bs ON bs.booking_id = b.id
    LEFT JOIN seats st ON bs.seat_id = st.id
    WHERE b.id = $1
    GROUP BY b.id, s.departure_time, s.arrival_time, s.departure_date,
             r.from_city, r.to_city, bus.bus_name, bus.bus_type, bus.bus_number,
             u.name, u.email, u.phone
  `, [req.params.id]);

  if (!result.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Booking not found' });
  }

  const booking = result.rows[0];
  
  // HE-011: Flag revealed when accessed without proper auth (IDOR condition)
  const ctfFlag = !req.headers['authorization'] ? 'HE{travellers_011_b00k1ng_1d0r}' : undefined;

  res.json({ booking, _ctf_flag: ctfFlag });
}));

// ─── POST /api/v1/bookings ────────────────────────────────────────────────────
// HE-012: Price manipulation — client-supplied totalAmount accepted
// HE-015: Sequential/predictable booking IDs
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const {
    schedule_id,
    seat_ids,
    passengers, // Array of { name, age, gender, is_primary }
    boarding_point,
    dropping_point,
    coupon_code,
    insurance,
    // HE-012: INTENTIONAL — client can supply these values
    totalAmount,
    convenience_fee,
    gst,
    insurance_amount,
    coupon_discount,
    net_amount,
  } = req.body;

  if (!schedule_id || !seat_ids?.length || !passengers?.length) {
    return res.status(400).json({ error: 'Validation', message: 'schedule_id, seat_ids, and passengers required' });
  }

  // Fetch schedule to get real price
  const schedResult = await db.query(
    'SELECT * FROM schedules WHERE id = $1 AND status = $2',
    [schedule_id, 'ACTIVE']
  );

  if (!schedResult.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Schedule not found or unavailable' });
  }

  const schedule = schedResult.rows[0];

  // HE-013: Race condition — no pessimistic locking on seat check
  // Check seat availability (without transaction lock)
  const bookedSeats = await db.query(`
    SELECT bs.seat_id FROM booking_seats bs
    JOIN bookings b ON bs.booking_id = b.id
    WHERE b.schedule_id = $1 AND b.booking_status NOT IN ('CANCELLED')
    AND bs.seat_id = ANY($2::int[])
  `, [schedule_id, seat_ids]);

  if (bookedSeats.rows.length > 0) {
    return res.status(409).json({ 
      error: 'SeatUnavailable', 
      message: 'One or more selected seats are no longer available',
      conflicting_seats: bookedSeats.rows.map(r => r.seat_id),
    });
  }

  // Calculate server-side price (real price)
  const realBaseAmount = schedule.base_price * seat_ids.length;
  const realConvFee = Math.round(realBaseAmount * 0.05);
  const realGST = Math.round(realBaseAmount * 0.05);
  const realInsurance = insurance ? 49 * seat_ids.length : 0;
  const realNetAmount = realBaseAmount + realConvFee + realGST + realInsurance;

  // HE-012: INTENTIONAL — use client-supplied amount instead of server-calculated
  // In a real app, you'd always use server-calculated amounts
  const finalAmount = totalAmount !== undefined ? parseFloat(totalAmount) : realNetAmount;
  const finalNet = net_amount !== undefined ? parseFloat(net_amount) : realNetAmount;

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // Create booking (HE-015: sequential auto-increment ID is predictable)
    const bookingResult = await client.query(`
      INSERT INTO bookings (
        user_id, schedule_id, booking_status, total_amount, 
        convenience_fee, gst, insurance_amount, coupon_discount, net_amount,
        boarding_point, dropping_point
      ) VALUES ($1, $2, 'PENDING', $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      req.user.id, schedule_id, finalAmount,
      convenience_fee ?? realConvFee, gst ?? realGST,
      insurance_amount ?? realInsurance, coupon_discount ?? 0,
      finalNet, boarding_point, dropping_point,
    ]);

    const booking = bookingResult.rows[0];

    // Insert booking seats
    for (let i = 0; i < seat_ids.length; i++) {
      const passenger = passengers[i] || passengers[0];
      await client.query(`
        INSERT INTO booking_seats (booking_id, seat_id, passenger_name, passenger_age, passenger_gender, is_primary)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [booking.id, seat_ids[i], passenger.name, passenger.age, passenger.gender, i === 0]);
    }

    // Update available seats
    await client.query(
      'UPDATE schedules SET available_seats = available_seats - $1 WHERE id = $2',
      [seat_ids.length, schedule_id]
    );

    await client.query('COMMIT');

    // Check if price was manipulated
    const priceManipulated = finalAmount < realNetAmount;
    const ctfFlag = priceManipulated ? 'HE{travellers_012_pr1c3_m4n1pul4t10n}' : undefined;

    res.status(201).json({
      success: true,
      booking: { ...booking, booking_id: `HET${booking.id.toString().padStart(8, '0')}` },
      price_summary: {
        base_amount: realBaseAmount,
        client_supplied_amount: totalAmount,
        final_amount: finalAmount,
        server_calculated: realNetAmount,
      },
      _ctf_flag: ctfFlag,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}));

// ─── PUT /api/v1/bookings/:id/cancel ─────────────────────────────────────────
// HE-014: Cancel other users' bookings + claim refund
router.put('/:id/cancel', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // INTENTIONAL: Ownership check is bypassable via admin role check that can be forged
  const booking = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);

  if (!booking.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Booking not found' });
  }

  const bookingData = booking.rows[0];

  // HE-014: INTENTIONAL weak ownership check
  // Checks user_id but uses string comparison that fails for uuid vs int mismatches
  if (bookingData.user_id != req.user.id && req.user.role !== 'admin') {
    // Bypass: if the booking's user_id is not an integer and ours is, the loose comparison fails
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'You can only cancel your own bookings',
    });
  }

  if (bookingData.booking_status === 'CANCELLED') {
    return res.status(400).json({ error: 'AlreadyCancelled', message: 'Booking is already cancelled' });
  }

  // Calculate refund
  const hoursUntilDeparture = 24; // simplified
  const refundPercent = hoursUntilDeparture > 24 ? 100 : hoursUntilDeparture > 12 ? 75 : 50;
  const refundAmount = Math.round(bookingData.net_amount * refundPercent / 100);

  await db.query(
    'UPDATE bookings SET booking_status = $1, updated_at = NOW() WHERE id = $2',
    ['CANCELLED', id]
  );

  await db.query(
    `INSERT INTO refunds (booking_id, amount, status, reason) VALUES ($1, $2, 'PENDING', $3)`,
    [id, refundAmount, req.body.reason || 'Customer requested cancellation']
  );

  // Restore available seats
  await db.query(
    'UPDATE schedules SET available_seats = available_seats + (SELECT COUNT(*) FROM booking_seats WHERE booking_id = $1) WHERE id = $2',
    [id, bookingData.schedule_id]
  );

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    refund: { amount: refundAmount, percent: refundPercent, status: 'PENDING' },
  });
}));

module.exports = router;
