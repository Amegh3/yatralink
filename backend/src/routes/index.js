// ============================================================
// H/E Travellers CTF Platform - Central Route Registry
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth.routes');
const busRoutes = require('./bus.routes');
const routeRoutes = require('./route.routes');
const bookingRoutes = require('./booking.routes');
const paymentRoutes = require('./payment.routes');
const userRoutes = require('./user.routes');
const reviewRoutes = require('./review.routes');
const couponRoutes = require('./coupon.routes');
const supportRoutes = require('./support.routes');
const adminRoutes = require('./admin.routes');
const operatorRoutes = require('./operator.routes');
const ctfRoutes = require('./ctf.routes');
const devRoutes = require('./dev.routes');
const notificationRoutes = require('./notification.routes');
const walletRoutes = require('./wallet.routes');
const offerRoutes = require('./offer.routes');

// v1 API
router.use('/v1/auth', authRoutes);
router.use('/v1/buses', busRoutes);
router.use('/v1/routes', routeRoutes);
router.use('/v1/bookings', bookingRoutes);
router.use('/v1/payment', paymentRoutes);
router.use('/v1/users', userRoutes);
router.use('/v1/reviews', reviewRoutes);
router.use('/v1/coupons', couponRoutes);
router.use('/v1/support', supportRoutes);
router.use('/v1/admin', adminRoutes);
router.use('/v1/operator', operatorRoutes);
router.use('/v1/notifications', notificationRoutes);
router.use('/v1/wallet', walletRoutes);
router.use('/v1/offers', offerRoutes);

// CTF system
router.use('/ctf', ctfRoutes);

// Dev/debug endpoints (CTF: info disclosure challenges)
router.use('/dev', devRoutes);

// API info endpoint
router.get('/v1', (req, res) => {
  res.json({
    name: 'H/E Travellers API',
    version: '1.0.0',
    description: 'Bus booking platform API',
    endpoints: {
      auth: '/api/v1/auth',
      buses: '/api/v1/buses',
      routes: '/api/v1/routes',
      bookings: '/api/v1/bookings',
      payment: '/api/v1/payment',
      users: '/api/v1/users',
      reviews: '/api/v1/reviews',
      coupons: '/api/v1/coupons',
      support: '/api/v1/support',
      admin: '/api/v1/admin',
      operator: '/api/v1/operator',
      ctf: '/api/ctf',
    },
    powered_by: 'Hackers Era',
  });
});

module.exports = router;
