// ============================================================
// H/E Travellers CTF Platform - Payment Routes
// CTF Challenges: HE-016 (amount not validated), HE-017 (payment IDOR),
//                 HE-018 (negative wallet), HE-019 (free ticket)
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// Fake payment gateway simulation
const fakePay = (method, amount) => ({
  transaction_id: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
  status: 'SUCCESS',
  gateway: 'HE_DEMO_GATEWAY',
  method,
  amount,
  timestamp: new Date().toISOString(),
  message: 'Demo payment processed successfully',
  disclaimer: 'This is a synthetic CTF payment. No real money involved.',
});

// ─── POST /api/v1/payment/process ─────────────────────────────────────────────
// HE-016: Amount in request body not validated against booking
router.post('/process', authenticate, asyncHandler(async (req, res) => {
  const { booking_id, payment_method, amount, card_number, upi_id, wallet_balance } = req.body;

  if (!booking_id || !payment_method) {
    return res.status(400).json({ error: 'Validation', message: 'booking_id and payment_method required' });
  }

  const booking = await db.query('SELECT * FROM bookings WHERE id = $1', [booking_id]);
  if (!booking.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Booking not found' });
  }

  const bookingData = booking.rows[0];
  const realAmount = bookingData.net_amount;

  // HE-016: INTENTIONAL — use client-supplied amount instead of booking amount
  const chargedAmount = amount !== undefined ? parseFloat(amount) : realAmount;

  // HE-018: Negative amount check missing for DEMO_WALLET top-up path
  if (payment_method === 'DEMO_WALLET') {
    const wallet = await db.query('SELECT * FROM wallets WHERE user_id = $1', [req.user.id]);
    if (wallet.rows.length) {
      const walletBalance = parseFloat(wallet.rows[0].balance);
      // INTENTIONAL: No check for negative chargedAmount
      if (walletBalance < chargedAmount && chargedAmount > 0) {
        return res.status(400).json({ error: 'InsufficientBalance', message: 'Insufficient wallet balance' });
      }
    }
  }

  const fakeResponse = fakePay(payment_method, chargedAmount);

  // Record payment
  const paymentResult = await db.query(`
    INSERT INTO payments (booking_id, user_id, amount, payment_method, transaction_id, status, gateway_response)
    VALUES ($1, $2, $3, $4, $5, 'SUCCESS', $6)
    RETURNING *
  `, [booking_id, req.user.id, chargedAmount, payment_method, fakeResponse.transaction_id, JSON.stringify(fakeResponse)]);

  // Mark booking as confirmed
  await db.query(
    'UPDATE bookings SET booking_status = $1, updated_at = NOW() WHERE id = $2',
    ['CONFIRMED', booking_id]
  );

  const priceManipulated = chargedAmount < realAmount;

  res.json({
    success: true,
    payment: paymentResult.rows[0],
    gateway_response: fakeResponse,
    booking_id,
    _ctf_flag: priceManipulated ? 'HE{travellers_016_p4ym3nt_4m0unt}' : undefined,
  });
}));

// ─── GET /api/v1/payment/status/:bookingId ────────────────────────────────────
// HE-017: Payment status IDOR — returns payment for any booking
router.get('/status/:bookingId', asyncHandler(async (req, res) => {
  // INTENTIONAL: No authentication check
  const result = await db.query(`
    SELECT p.*, b.user_id as booking_user_id, b.net_amount as booking_amount
    FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    WHERE p.booking_id = $1
    ORDER BY p.created_at DESC
    LIMIT 1
  `, [req.params.bookingId]);

  if (!result.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Payment not found' });
  }

  res.json({ 
    payment: result.rows[0],
    _ctf_flag: 'HE{travellers_017_p4ym3nt_1d0r}',
  });
}));

// ─── GET /api/v1/payment/success ──────────────────────────────────────────────
// HE-019: Marks booking as paid without verifying actual payment
router.get('/success', asyncHandler(async (req, res) => {
  const { booking_id, transaction_id } = req.query;

  if (!booking_id) {
    return res.status(400).json({ error: 'Validation', message: 'booking_id required' });
  }

  // HE-019: INTENTIONAL — no verification that payment actually occurred
  // Simply marks booking as confirmed based on query param
  const booking = await db.query('SELECT * FROM bookings WHERE id = $1', [booking_id]);
  
  if (!booking.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Booking not found' });
  }

  // Mark as confirmed regardless of payment status
  await db.query(
    'UPDATE bookings SET booking_status = $1, updated_at = NOW() WHERE id = $2',
    ['CONFIRMED', booking_id]
  );

  res.json({
    success: true,
    message: 'Booking confirmed successfully',
    booking_id,
    status: 'CONFIRMED',
    _ctf_flag: 'HE{travellers_019_fr33_t1ck3t}',
  });
}));

// ─── GET /api/v1/payment/failure ──────────────────────────────────────────────
router.get('/failure', asyncHandler(async (req, res) => {
  const { booking_id, error } = req.query;
  res.json({
    success: false,
    message: 'Payment failed. Please try again.',
    booking_id,
    error: error || 'Payment declined',
  });
}));

// ─── GET /api/v1/payment/refunds ──────────────────────────────────────────────
router.get('/refunds', authenticate, asyncHandler(async (req, res) => {
  const result = await db.query(`
    SELECT r.*, b.user_id, p.amount as original_amount
    FROM refunds r
    JOIN bookings b ON r.booking_id = b.id
    LEFT JOIN payments p ON r.payment_id = p.id
    WHERE b.user_id = $1
    ORDER BY r.created_at DESC
  `, [req.user.id]);

  res.json({ refunds: result.rows });
}));

// ─── GET /api/v1/payment/methods ─────────────────────────────────────────────
router.get('/methods', (req, res) => {
  res.json({
    methods: [
      { id: 'DEMO_CARD', name: 'Demo Card', description: 'Use any 16-digit number', icon: 'credit-card' },
      { id: 'DEMO_UPI', name: 'Demo UPI', description: 'Use format: test@upi', icon: 'smartphone' },
      { id: 'DEMO_WALLET', name: 'H/E Wallet', description: 'Pay from your H/E Wallet balance', icon: 'wallet' },
      { id: 'CASH', name: 'Cash at Boarding', description: 'Pay cash when you board', icon: 'banknote' },
    ],
    disclaimer: 'All payments are simulated. No real money is processed.',
  });
});

module.exports = router;
