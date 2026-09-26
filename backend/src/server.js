// ============================================================
// H/E Travellers CTF Platform - Server Entry Point
// ============================================================
'use strict';

const http = require('http');
const WebSocket = require('ws');
const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// ─── WebSocket for live scoreboard ───────────────────────────────────────────
const wss = new WebSocket.Server({ server, path: '/ws/scoreboard' });

const clients = new Set();

wss.on('connection', (ws, req) => {
  clients.add(ws);

  ws.on('close', () => clients.delete(ws));

  // Send current scoreboard on connect
  sendScoreboard(ws);
});

async function sendScoreboard(ws) {
  try {
    const scoreboard = await db.query(`
      SELECT 
        t.id, t.name as team_name, t.code,
        COALESCE(SUM(s.points_awarded), 0) as total_points,
        COUNT(DISTINCT s.challenge_id) FILTER (WHERE s.is_correct = true) as solved_count,
        MAX(s.submitted_at) as last_submission
      FROM teams t
      LEFT JOIN submissions s ON s.team_id = t.id AND s.is_correct = true
      GROUP BY t.id, t.name, t.code
      ORDER BY total_points DESC, last_submission ASC
      LIMIT 50
    `);

    const soloboard = await db.query(`
      SELECT 
        u.id, u.name, u.email,
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

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'SCOREBOARD_UPDATE',
        data: { teams: scoreboard.rows, players: soloboard.rows },
        timestamp: new Date().toISOString()
      }));
    }
  } catch (err) {
    console.error('Scoreboard WS error:', err);
  }
}

// Broadcast scoreboard update to all clients
function broadcastScoreboard() {
  clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      sendScoreboard(ws);
    }
  });
}

// Export broadcast function for use in controllers
global.broadcastScoreboard = broadcastScoreboard;

// ─── Start Server ─────────────────────────────────────────────────────────────
server.listen(PORT, async () => {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   H/E Travellers CTF Platform - Backend    ║');
  console.log('║   Travel India. Find the Bug. Secure.     ║');
  console.log('╠════════════════════════════════════════════╣');
  console.log(`║  Server: http://localhost:${PORT}              ║`);
  console.log(`║  CTF Mode: ${process.env.CTF_MODE === 'true' ? '✓ ENABLED' : '✗ DISABLED'}                    ║`);
  console.log(`║  Environment: ${process.env.NODE_ENV}                   ║`);
  console.log('╠════════════════════════════════════════════╣');
  console.log('║  Powered by Hackers Era                    ║');
  console.log('╚════════════════════════════════════════════╝');

  try {
    await db.query('SELECT 1');
    console.log('✓ Database connected');
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
  }
});

module.exports = { server, broadcastScoreboard };
