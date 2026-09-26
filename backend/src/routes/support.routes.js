// ============================================================
// H/E Travellers CTF Platform - Support Routes
// CTF Challenges: HE-025 (IDOR), HE-026 (stored XSS), HE-027 (path traversal)
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// HE-027: Insecure multer storage — preserves original filename (path traversal)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/support'));
  },
  filename: (req, file, cb) => {
    // HE-027: INTENTIONAL — uses original filename without sanitization
    // An attacker can use ../../../ in filename to write to arbitrary paths
    cb(null, file.originalname);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ─── GET /api/v1/support ────────────────────────────────────────────────────
router.get('/', authenticate, asyncHandler(async (req, res) => {
  // Admins see all tickets; users see only their own
  let query;
  let params;

  if (req.user.role === 'admin') {
    query = `SELECT t.*, u.name as user_name, u.email as user_email
             FROM support_tickets t JOIN users u ON t.user_id = u.id
             ORDER BY t.created_at DESC`;
    params = [];
  } else {
    query = `SELECT * FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC`;
    params = [req.user.id];
  }

  const result = await db.query(query, params);
  res.json({ tickets: result.rows });
}));

// ─── GET /api/v1/support/:id ─────────────────────────────────────────────────
// HE-025: IDOR — no ownership check
router.get('/:id', asyncHandler(async (req, res) => {
  // INTENTIONAL: No authentication or ownership check
  const result = await db.query(`
    SELECT t.*, u.name as user_name, u.email as user_email, u.phone as user_phone,
           array_agg(DISTINCT jsonb_build_object(
             'id', r.id, 'message', r.message, 'created_at', r.created_at,
             'attachment', r.attachment_path
           )) as replies
    FROM support_tickets t
    JOIN users u ON t.user_id = u.id
    LEFT JOIN ticket_replies r ON r.ticket_id = t.id
    WHERE t.id = $1
    GROUP BY t.id, u.name, u.email, u.phone
  `, [req.params.id]);

  if (!result.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Ticket not found' });
  }

  res.json({ 
    ticket: result.rows[0],
    _ctf_flag: 'HE{travellers_025_supp0rt_1d0r}',
  });
}));

// ─── POST /api/v1/support ────────────────────────────────────────────────────
// HE-026: Stored XSS in ticket description
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { subject, description, category, priority } = req.body;

  if (!subject || !description) {
    return res.status(400).json({ error: 'Validation', message: 'Subject and description required' });
  }

  // HE-026: INTENTIONAL — description not sanitized
  const result = await db.query(`
    INSERT INTO support_tickets (user_id, subject, description, category, priority, status)
    VALUES ($1, $2, $3, $4, $5, 'OPEN')
    RETURNING *
  `, [req.user.id, subject, description, category || 'GENERAL', priority || 'MEDIUM']);

  res.status(201).json({ success: true, ticket: result.rows[0] });
}));

// ─── POST /api/v1/support/:id/reply ──────────────────────────────────────────
// HE-026: Stored XSS in reply message
// HE-027: Path traversal via file upload
router.post('/:id/reply', authenticate, upload.single('attachment'), asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Validation', message: 'Reply message required' });
  }

  let attachmentPath = null;
  if (req.file) {
    // HE-027: original filename used as path — can contain ../ sequences
    attachmentPath = `/uploads/support/${req.file.filename}`;
  }

  // HE-026: message not sanitized (stored XSS)
  const result = await db.query(`
    INSERT INTO ticket_replies (ticket_id, user_id, message, attachment_path)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [req.params.id, req.user.id, message, attachmentPath]);

  res.status(201).json({ 
    success: true, 
    reply: result.rows[0],
    attachment: attachmentPath,
    _ctf_note: attachmentPath ? `File saved at: ${attachmentPath}` : undefined,
  });
}));

// ─── PUT /api/v1/support/:id ─────────────────────────────────────────────────
router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const { status, priority } = req.body;

  if (!['admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden', message: 'Admin access required' });
  }

  const result = await db.query(
    'UPDATE support_tickets SET status = COALESCE($1, status), priority = COALESCE($2, priority) WHERE id = $3 RETURNING *',
    [status, priority, req.params.id]
  );

  res.json({ success: true, ticket: result.rows[0] });
}));

module.exports = router;
