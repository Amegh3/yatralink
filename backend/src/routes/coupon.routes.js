// ============================================================
// H/E Travellers CTF Platform - Coupon Routes
// CTF Challenges: HE-022 (coupon reuse), HE-023 (negative discount),
//                 HE-024 (coupon enumeration)
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── GET /api/v1/coupons ─────────────────────────────────────────────────────
router.get('/', asyncHandler(async (req, res) => {
  const result = await db.query(`
    SELECT id, code, discount_type, discount_value, max_discount, 
           min_booking_amount, expires_at, usage_limit, used_count
    FROM coupons 
    WHERE is_active = true AND expires_at > NOW()
    ORDER BY id ASC
  `);
  // HE-024: IDs are sequential — makes enumeration trivial
  res.json({ coupons: result.rows });
}));

// ─── GET /api/v1/coupons/:id ─────────────────────────────────────────────────
// HE-024: Direct ID lookup reveals coupon even if not publicly listed
router.get('/:id', asyncHandler(async (req, res) => {
  const result = await db.query(
    'SELECT * FROM coupons WHERE id = $1',
    [req.params.id]
  );
  if (!result.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Coupon not found' });
  }
  res.json({ 
    coupon: result.rows[0],
    _ctf_flag: 'HE{travellers_024_c0up0n_3num}',
  });
}));

// ─── POST /api/v1/coupons/apply ───────────────────────────────────────────────
// HE-022: No per-user coupon tracking — can be applied multiple times
// HE-023: Negative discount value not checked
router.post('/apply', authenticate, asyncHandler(async (req, res) => {
  const { code, booking_amount, booking_id } = req.body;

  if (!code || !booking_amount) {
    return res.status(400).json({ error: 'Validation', message: 'Coupon code and booking amount required' });
  }

  const coupon = await db.query(
    `SELECT * FROM coupons WHERE code = $1 AND is_active = true`,
    [code.toUpperCase()]
  );

  if (!coupon.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Invalid coupon code' });
  }

  const c = coupon.rows[0];

  // Check overall usage limit
  if (c.usage_limit && c.used_count >= c.usage_limit) {
    return res.status(400).json({ error: 'CouponExpired', message: 'Coupon usage limit reached' });
  }

  if (c.expires_at && new Date() > new Date(c.expires_at)) {
    return res.status(400).json({ error: 'CouponExpired', message: 'Coupon has expired' });
  }

  if (c.min_booking_amount && parseFloat(booking_amount) < parseFloat(c.min_booking_amount)) {
    return res.status(400).json({ 
      error: 'MinimumNotMet', 
      message: `Minimum booking amount of ₹${c.min_booking_amount} required` 
    });
  }

  // HE-022: INTENTIONAL — No per-user usage check
  // Missing: Check coupon_usages table for this user

  // HE-023: INTENTIONAL — discount_value can be negative (set at creation time by admin)
  // No validation that discount_value > 0
  let discountAmount;
  if (c.discount_type === 'PERCENT') {
    discountAmount = (parseFloat(booking_amount) * parseFloat(c.discount_value)) / 100;
    if (c.max_discount) {
      discountAmount = Math.min(discountAmount, parseFloat(c.max_discount));
    }
  } else {
    discountAmount = parseFloat(c.discount_value);
  }

  // Increment usage count
  await db.query('UPDATE coupons SET used_count = used_count + 1 WHERE id = $1', [c.id]);

  // Record usage (but doesn't prevent same user from using again)
  if (booking_id) {
    await db.query(
      'INSERT INTO coupon_usages (coupon_id, user_id, booking_id) VALUES ($1, $2, $3)',
      [c.id, req.user.id, booking_id]
    );
  }

  const isNegativeDiscount = discountAmount < 0;
  const finalAmount = parseFloat(booking_amount) - discountAmount;

  res.json({
    success: true,
    coupon_code: c.code,
    discount_amount: discountAmount,
    original_amount: parseFloat(booking_amount),
    final_amount: finalAmount,
    // Flags for CTF conditions
    _ctf_flag: isNegativeDiscount ? 'HE{travellers_023_n3g_d1sc0unt}' : undefined,
  });
}));

module.exports = router;
