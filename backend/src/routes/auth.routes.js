// ============================================================
// H/E Travellers CTF Platform - Auth Routes
// CTF Challenges: HE-001 (brute force), HE-002 (email enum),
//                 HE-003 (predictable OTP), HE-004 (token no expiry)
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── POST /api/v1/auth/register ──────────────────────────────────────────────
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Validation', message: 'Email, password, and name are required' });
  }

  // Check if email exists
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length) {
    return res.status(409).json({ error: 'Conflict', message: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // HE-003: Predictable OTP - uses Math.random (seeded, predictable in JS)
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  const result = await db.query(`
    INSERT INTO users (email, password_hash, name, phone, role, otp, otp_expires_at)
    VALUES ($1, $2, $3, $4, 'user', $5, $6)
    RETURNING id, email, name, role
  `, [email.toLowerCase(), passwordHash, name, phone || null, otp, otpExpiry]);

  // Create wallet for user
  await db.query('INSERT INTO wallets (user_id, balance) VALUES ($1, 0)', [result.rows[0].id]);

  // Simulate OTP send (CTF: In real app this would send SMS/email)
  // For CTF demo, OTP is returned in response for testing
  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email.',
    user: result.rows[0],
    // CTF: OTP exposed in response body for testing purposes
    _dev_otp: process.env.NODE_ENV === 'development' ? otp : undefined,
  });
}));

// ─── POST /api/v1/auth/verify-otp ────────────────────────────────────────────
router.post('/verify-otp', asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const result = await db.query(
    'SELECT id, otp, otp_expires_at FROM users WHERE email = $1',
    [email?.toLowerCase()]
  );

  if (!result.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'User not found' });
  }

  const user = result.rows[0];

  if (user.otp !== otp) {
    return res.status(400).json({ error: 'InvalidOTP', message: 'Invalid OTP' });
  }

  if (new Date() > new Date(user.otp_expires_at)) {
    return res.status(400).json({ error: 'ExpiredOTP', message: 'OTP has expired' });
  }

  await db.query(
    'UPDATE users SET is_verified = true, otp = NULL, otp_expires_at = NULL WHERE id = $1',
    [user.id]
  );

  res.json({ success: true, message: 'Email verified successfully' });
}));

// ─── POST /api/v1/auth/login ──────────────────────────────────────────────────
// HE-001: No rate limiting on login endpoint (brute force possible)
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password, remember_me } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Validation', message: 'Email and password required' });
  }

  const result = await db.query(
    'SELECT id, email, password_hash, name, role, is_verified FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (!result.rows.length) {
    // HE-002: Intentionally different message for non-existent email (email enumeration)
    return res.status(401).json({ 
      error: 'AuthFailed', 
      message: 'No account found with this email address' 
    });
  }

  const user = result.rows[0];
  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    return res.status(401).json({ 
      error: 'AuthFailed', 
      message: 'Incorrect password. Please try again.' 
    });
  }

  const tokenExpiry = remember_me ? '30d' : '24h';
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'he_travellers_jwt_secret_ctf_2024',
    { expiresIn: tokenExpiry, algorithm: 'HS256' }
  );

  // Log login event
  await db.query(`
    INSERT INTO audit_logs (user_id, action, entity_type, ip_address)
    VALUES ($1, 'LOGIN', 'user', $2)
  `, [user.id, req.ip]);

  res.cookie('auth_token', token, {
    httpOnly: true,
    maxAge: remember_me ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });

  res.json({
    success: true,
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    expires_in: tokenExpiry,
  });
}));

// ─── POST /api/v1/auth/forgot-password ───────────────────────────────────────
// HE-002: Email enumeration via different responses
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await db.query('SELECT id, email FROM users WHERE email = $1', [email?.toLowerCase()]);

  if (!result.rows.length) {
    // HE-002: INTENTIONAL - different response reveals email doesn't exist
    return res.status(404).json({ 
      error: 'NotFound', 
      message: 'No account registered with this email address.' 
    });
  }

  const user = result.rows[0];
  // HE-004: Reset token without proper expiry in legacy path
  const resetToken = uuidv4().replace(/-/g, ''); // Not cryptographically bound to user state
  const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.query(
    'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
    [resetToken, resetExpiry, user.id]
  );

  // CTF: Return token in response for demo (real app would email it)
  res.json({
    success: true,
    message: 'Password reset instructions sent to your email.',
    // HE-004: token exposed in response (dev mode leak)
    _dev_reset_link: process.env.NODE_ENV === 'development' 
      ? `http://www.hetravellers.local/reset-password?token=${resetToken}&email=${email}`
      : undefined,
  });
}));

// ─── POST /api/v1/auth/reset-password ────────────────────────────────────────
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { token, email, password } = req.body;

  if (!token || !email || !password) {
    return res.status(400).json({ error: 'Validation', message: 'Token, email and password required' });
  }

  // HE-004: Legacy path - token checked but expiry ignored if using ?legacy=true
  const checkExpiry = req.query.legacy !== 'true';

  const query = checkExpiry
    ? 'SELECT id FROM users WHERE email = $1 AND reset_token = $2 AND reset_token_expires > NOW()'
    : 'SELECT id FROM users WHERE email = $1 AND reset_token = $2'; // No expiry check

  const result = await db.query(query, [email.toLowerCase(), token]);

  if (!result.rows.length) {
    return res.status(400).json({ error: 'InvalidToken', message: 'Invalid or expired reset token' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.query(
    'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
    [passwordHash, result.rows[0].id]
  );

  res.json({ success: true, message: 'Password reset successfully' });
}));

// ─── POST /api/v1/auth/logout ─────────────────────────────────────────────────
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  res.clearCookie('auth_token');
  
  await db.query(
    'INSERT INTO audit_logs (user_id, action, entity_type, ip_address) VALUES ($1, $2, $3, $4)',
    [req.user.id, 'LOGOUT', 'user', req.ip]
  );

  res.json({ success: true, message: 'Logged out successfully' });
}));

// ─── GET /api/v1/auth/me ─────────────────────────────────────────────────────
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const result = await db.query(
    'SELECT id, email, name, phone, role, is_verified, profile_picture, created_at FROM users WHERE id = $1',
    [req.user.id]
  );
  res.json({ user: result.rows[0] });
}));

// ─── POST /api/v1/auth/change-password ───────────────────────────────────────
router.post('/change-password', authenticate, asyncHandler(async (req, res) => {
  const { current_password, new_password } = req.body;

  const result = await db.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
  const valid = await bcrypt.compare(current_password, result.rows[0].password_hash);

  if (!valid) {
    return res.status(400).json({ error: 'AuthFailed', message: 'Current password is incorrect' });
  }

  const newHash = await bcrypt.hash(new_password, 10);
  await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, req.user.id]);

  res.json({ success: true, message: 'Password changed successfully' });
}));

module.exports = router;
