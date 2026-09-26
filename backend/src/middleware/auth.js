// ============================================================
// H/E Travellers CTF Platform - Middleware: Authentication
// CTF Challenges: HE-005 (JWT 'none' alg), HE-035 (token reuse)
// ============================================================
'use strict';

const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Standard JWT verification
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Access token required' });
    }

    // Standard verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'he_travellers_jwt_secret_ctf_2024');
    
    // Fetch user from DB
    const result = await db.query(
      'SELECT id, email, name, role, is_verified FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not found' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'TokenExpired', message: 'Token has expired' });
    }
    return res.status(401).json({ error: 'InvalidToken', message: 'Invalid access token' });
  }
};

// CTF Challenge HE-005: Weak JWT verification - accepts 'none' algorithm
// Used in the /api/v1/profile/legacy endpoint
const authenticateWeak = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Access token required' });
    }

    // INTENTIONAL VULNERABILITY: Manual base64 decode without algorithm verification
    // This allows 'none' algorithm attack
    let decoded;
    try {
      // Try standard verification first
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'he_travellers_jwt_secret_ctf_2024');
    } catch (verifyErr) {
      // INTENTIONAL: Fallback to decode without verify if standard fails
      // This is the CTF vulnerability - 'none' algorithm bypass
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
          if (header.alg === 'none' || header.alg === 'HS256') {
            decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString());
          } else {
            throw verifyErr;
          }
        } catch {
          throw verifyErr;
        }
      } else {
        throw verifyErr;
      }
    }

    const result = await db.query(
      'SELECT id, email, name, role FROM users WHERE id = $1',
      [decoded.userId || decoded.id]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not found' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'InvalidToken', message: 'Invalid access token' });
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'he_travellers_jwt_secret_ctf_2024');
    const result = await db.query(
      'SELECT id, email, name, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    req.user = result.rows.length ? result.rows[0] : null;
  } catch {
    req.user = null;
  }
  next();
};

module.exports = { authenticate, authenticateWeak, optionalAuth };
