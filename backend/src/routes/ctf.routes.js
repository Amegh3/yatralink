// ============================================================
// H/E Travellers CTF Platform - CTF Routes
// Flag submission, scoreboard, team management, hints
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { requireOrganizer } = require('../middleware/ctf');
const { asyncHandler } = require('../middleware/errorHandler');

// ─── GET /api/ctf/challenges ─────────────────────────────────────────────────
router.get('/challenges', optionalAuth, asyncHandler(async (req, res) => {
  const result = await db.query(`
    SELECT c.id, c.vuln_id, c.title, c.category, c.difficulty, c.description,
           c.points, c.is_active, c.endpoint,
           COUNT(DISTINCT s.id) FILTER (WHERE s.is_correct = true) as solve_count,
           EXISTS(
             SELECT 1 FROM submissions s2 
             WHERE s2.challenge_id = c.id AND s2.user_id = $1 AND s2.is_correct = true
           ) as is_solved
    FROM challenges c
    LEFT JOIN submissions s ON s.challenge_id = c.id
    WHERE c.is_active = true
    GROUP BY c.id
    ORDER BY c.difficulty ASC, c.points ASC
  `, [req.user?.id || null]);

  const grouped = {};
  for (const ch of result.rows) {
    if (!grouped[ch.category]) grouped[ch.category] = [];
    grouped[ch.category].push(ch);
  }

  res.json({ challenges: result.rows, categories: grouped });
}));

function optionalAuth(req, res, next) {
  const { authenticate: auth } = require('../middleware/auth');
  const { optionalAuth: optAuth } = require('../middleware/auth');
  optAuth(req, res, next);
}

// ─── POST /api/ctf/submit ─────────────────────────────────────────────────────
router.post('/submit', authenticate, asyncHandler(async (req, res) => {
  const { challenge_id, flag } = req.body;

  if (!challenge_id || !flag) {
    return res.status(400).json({ error: 'Validation', message: 'challenge_id and flag required' });
  }

  // Check if already solved
  const alreadySolved = await db.query(
    'SELECT id FROM submissions WHERE user_id = $1 AND challenge_id = $2 AND is_correct = true',
    [req.user.id, challenge_id]
  );

  if (alreadySolved.rows.length) {
    return res.status(400).json({ error: 'AlreadySolved', message: 'You already solved this challenge!' });
  }

  // Get challenge and flag
  const challenge = await db.query(
    'SELECT c.*, f.flag_value FROM challenges c JOIN flags f ON f.challenge_id = c.id WHERE c.id = $1',
    [challenge_id]
  );

  if (!challenge.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Challenge not found' });
  }

  const ch = challenge.rows[0];
  const isCorrect = flag.trim() === ch.flag_value;
  const pointsAwarded = isCorrect ? ch.points : 0;

  // Get team_id if user is in a team
  const teamResult = await db.query(
    'SELECT team_id FROM team_members WHERE user_id = $1', [req.user.id]
  );
  const teamId = teamResult.rows.length ? teamResult.rows[0].team_id : null;

  // Record submission
  await db.query(`
    INSERT INTO submissions (user_id, team_id, challenge_id, flag_submitted, is_correct, points_awarded)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [req.user.id, teamId, challenge_id, flag.trim(), isCorrect, pointsAwarded]);

  // Log to audit
  await db.query(`
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_data, ip_address)
    VALUES ($1, 'FLAG_SUBMIT', 'challenge', $2, $3, $4)
  `, [req.user.id, challenge_id, JSON.stringify({ flag, is_correct: isCorrect }), req.ip]);

  if (isCorrect && global.broadcastScoreboard) {
    global.broadcastScoreboard();
  }

  res.json({
    success: true,
    correct: isCorrect,
    points_awarded: pointsAwarded,
    message: isCorrect ? '🎉 Correct! Flag accepted!' : '❌ Wrong flag. Keep trying!',
  });
}));

// ─── GET /api/ctf/scoreboard ─────────────────────────────────────────────────
router.get('/scoreboard', asyncHandler(async (req, res) => {
  const teams = await db.query(`
    SELECT t.id, t.name, t.code,
           COALESCE(SUM(s.points_awarded), 0) as total_points,
           COUNT(DISTINCT s.challenge_id) FILTER (WHERE s.is_correct = true) as solved_count,
           MAX(s.submitted_at) as last_submission
    FROM teams t
    LEFT JOIN submissions s ON s.team_id = t.id AND s.is_correct = true
    GROUP BY t.id, t.name, t.code
    ORDER BY total_points DESC, last_submission ASC
    LIMIT 50
  `);

  const players = await db.query(`
    SELECT u.id, u.name, u.email,
           COALESCE(SUM(s.points_awarded), 0) as total_points,
           COUNT(DISTINCT s.challenge_id) FILTER (WHERE s.is_correct = true) as solved_count,
           MAX(s.submitted_at) as last_submission
    FROM users u
    LEFT JOIN submissions s ON s.user_id = u.id AND s.is_correct = true
    WHERE u.role = 'user'
    GROUP BY u.id, u.name, u.email
    ORDER BY total_points DESC, last_submission ASC
    LIMIT 50
  `);

  res.json({
    teams: teams.rows.map((t, i) => ({ ...t, rank: i + 1 })),
    players: players.rows.map((p, i) => ({ ...p, rank: i + 1 })),
    updated_at: new Date().toISOString(),
  });
}));

// ─── POST /api/ctf/teams ─────────────────────────────────────────────────────
router.post('/teams', authenticate, asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Validation', message: 'Team name required' });
  }

  // Check if user already in team
  const existing = await db.query('SELECT id FROM team_members WHERE user_id = $1', [req.user.id]);
  if (existing.rows.length) {
    return res.status(409).json({ error: 'Conflict', message: 'You are already in a team' });
  }

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const team = await db.query(
    'INSERT INTO teams (name, code, captain_id) VALUES ($1, $2, $3) RETURNING *',
    [name, code, req.user.id]
  );

  await db.query(
    'INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)',
    [team.rows[0].id, req.user.id]
  );

  res.status(201).json({ success: true, team: team.rows[0] });
}));

// ─── POST /api/ctf/teams/join ─────────────────────────────────────────────────
router.post('/teams/join', authenticate, asyncHandler(async (req, res) => {
  const { code } = req.body;

  const existing = await db.query('SELECT id FROM team_members WHERE user_id = $1', [req.user.id]);
  if (existing.rows.length) {
    return res.status(409).json({ error: 'Conflict', message: 'You are already in a team' });
  }

  const team = await db.query('SELECT * FROM teams WHERE code = $1', [code?.toUpperCase()]);
  if (!team.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Team not found with this code' });
  }

  await db.query(
    'INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)',
    [team.rows[0].id, req.user.id]
  );

  res.json({ success: true, team: team.rows[0], message: `Joined team: ${team.rows[0].name}` });
}));

// ─── GET /api/ctf/teams/my ────────────────────────────────────────────────────
router.get('/teams/my', authenticate, asyncHandler(async (req, res) => {
  const result = await db.query(`
    SELECT t.*, 
           array_agg(DISTINCT jsonb_build_object('id', u.id, 'name', u.name, 'email', u.email)) as members,
           COALESCE(SUM(s.points_awarded), 0) as total_points
    FROM teams t
    JOIN team_members tm ON tm.team_id = t.id
    JOIN users u ON tm.user_id = u.id
    LEFT JOIN submissions s ON s.team_id = t.id AND s.is_correct = true
    WHERE t.id = (SELECT team_id FROM team_members WHERE user_id = $1)
    GROUP BY t.id
  `, [req.user.id]);

  if (!result.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Not in any team' });
  }

  res.json({ team: result.rows[0] });
}));

// ─── POST /api/ctf/hints/:challengeId/:hintOrder ─────────────────────────────
router.post('/hints/:challengeId/:hintOrder', authenticate, asyncHandler(async (req, res) => {
  const { challengeId, hintOrder } = req.params;

  const hint = await db.query(
    'SELECT * FROM hints WHERE challenge_id = $1 AND hint_order = $2',
    [challengeId, hintOrder]
  );

  if (!hint.rows.length) {
    return res.status(404).json({ error: 'NotFound', message: 'Hint not found' });
  }

  // Record hint usage
  const existing = await db.query(
    'SELECT id FROM hint_usages WHERE user_id = $1 AND hint_id = $2',
    [req.user.id, hint.rows[0].id]
  );

  if (!existing.rows.length) {
    await db.query(
      'INSERT INTO hint_usages (user_id, hint_id) VALUES ($1, $2)',
      [req.user.id, hint.rows[0].id]
    );
  }

  res.json({
    hint: hint.rows[0].hint_text,
    points_penalty: hint.rows[0].points_penalty,
    hint_order: parseInt(hintOrder),
  });
}));

// ─── GET /api/ctf/my-progress ────────────────────────────────────────────────
router.get('/my-progress', authenticate, asyncHandler(async (req, res) => {
  const result = await db.query(`
    SELECT s.*, c.title, c.category, c.difficulty, c.points
    FROM submissions s
    JOIN challenges c ON s.challenge_id = c.id
    WHERE s.user_id = $1
    ORDER BY s.submitted_at DESC
  `, [req.user.id]);

  const total = result.rows.filter(r => r.is_correct).reduce((sum, r) => sum + r.points_awarded, 0);

  res.json({
    submissions: result.rows,
    solved: result.rows.filter(r => r.is_correct).length,
    total_points: total,
  });
}));

// ─── Organizer endpoints ──────────────────────────────────────────────────────
router.get('/organizer/all-submissions', authenticate, requireOrganizer, asyncHandler(async (req, res) => {
  const result = await db.query(`
    SELECT s.*, u.name as user_name, u.email as user_email,
           c.title as challenge_title, c.difficulty
    FROM submissions s
    JOIN users u ON s.user_id = u.id
    JOIN challenges c ON s.challenge_id = c.id
    ORDER BY s.submitted_at DESC
    LIMIT 500
  `);
  res.json({ submissions: result.rows });
}));

router.post('/organizer/challenges/:id/toggle', authenticate, requireOrganizer, asyncHandler(async (req, res) => {
  const result = await db.query(
    'UPDATE challenges SET is_active = NOT is_active WHERE id = $1 RETURNING *',
    [req.params.id]
  );
  res.json({ success: true, challenge: result.rows[0] });
}));

module.exports = router;
