'use strict';
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/', asyncHandler(async (req, res) => {
  const result = await db.query(`
    SELECT c.id, c.code, c.discount_type, c.discount_value, c.max_discount,
           c.min_booking_amount, c.expires_at,
           'offer_' || c.id as image_name
    FROM coupons c WHERE c.is_active = true AND c.expires_at > NOW()
    ORDER BY c.discount_value DESC LIMIT 12
  `);
  res.json({ offers: result.rows });
}));

module.exports = router;
