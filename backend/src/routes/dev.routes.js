// ============================================================
// H/E Travellers CTF Platform - Dev/Debug Routes
// CTF Challenges: HE-032 (config leak), HE-033 (log exposure)
// These endpoints simulate a "developer forgot to remove debug routes"
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

// HE-032: /dev/config leaks environment variables
router.get('/config', asyncHandler(async (req, res) => {
  // INTENTIONAL: Dev endpoint left in production that leaks env vars
  res.json({
    warning: 'DEBUG ENDPOINT - DO NOT EXPOSE IN PRODUCTION',
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      CTF_MODE: process.env.CTF_MODE,
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_NAME: process.env.DB_NAME,
      DB_USER: process.env.DB_USER,
      // DB_PASSWORD intentionally redacted but other sensitive vals exposed
      REDIS_HOST: process.env.REDIS_HOST,
      JWT_SECRET: process.env.JWT_SECRET, // Secret key leakage!
      SESSION_SECRET: process.env.SESSION_SECRET,
      APP_URL: process.env.APP_URL,
    },
    _ctf_flag: 'HE{travellers_032_d3v_c0nf1g}',
  });
}));

// HE-033: /dev/logs exposes server logs with sensitive data
router.get('/logs', asyncHandler(async (req, res) => {
  const logs = await db.query(`
    SELECT al.*, u.email, u.role
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT 100
  `);

  res.json({
    warning: 'DEBUG ENDPOINT - SERVER AUDIT LOGS',
    logs: logs.rows,
    server_info: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      platform: process.platform,
    },
    _ctf_flag: 'HE{travellers_033_l0g_3xp0sur3}',
  });
}));

// Hidden endpoint - discoverable via fuzzing/enumeration
router.get('/phpinfo', (req, res) => {
  // Simulates a PHP info page that might be found by attackers
  res.send(`
    <html>
    <head><title>PHP Info - HE Travellers Dev</title></head>
    <body>
    <h1>PHP Version 8.1.12 (Fake - CTF Challenge)</h1>
    <table>
      <tr><td>System</td><td>Linux hetravellers-dev 5.15.0 #1 SMP x86_64</td></tr>
      <tr><td>Server API</td><td>Apache 2.4</td></tr>
      <tr><td>DB_PASSWORD</td><td>ctf_secret_2024</td></tr>
      <tr><td>Internal API</td><td>http://internal-api.hetravellers.local:8080</td></tr>
    </table>
    <!-- CTF Note: HE{travellers_035_h1dd3n_php1nf0} -->
    </body>
    </html>
  `);
});

// Swagger/API docs endpoint with sensitive info
router.get('/swagger', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'H/E Travellers Internal API',
      version: '1.0.0',
      description: 'Internal API documentation - NOT FOR PUBLIC ACCESS',
    },
    servers: [
      { url: 'http://api.hetravellers.local', description: 'Production' },
      { url: 'http://internal-api.hetravellers.local:8080', description: 'Internal' },
      { url: 'http://staging.hetravellers.local', description: 'Staging' },
    ],
    // Sensitive internal endpoint paths exposed
    x_internal_endpoints: [
      '/internal/admin/reset',
      '/internal/config',
      '/internal/health',
      '/internal/secret-flag',
    ],
    x_debug_credentials: {
      admin_key: 'INTERNAL_ADMIN_KEY_2024',
      internal_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiJ9.',
    },
  });
});

// Git exposure simulation
router.get('/.git/config', (req, res) => {
  res.type('text/plain').send(`[core]
\trepositoryformatversion = 0
\tfilemode = true
[remote "origin"]
\turl = https://github.com/hackersera/he-travellers-internal.git
\tfetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
\tremote = origin
\tmerge = refs/heads/main
# CTF: HE{travellers_036_g1t_3xp0sur3}`);
});

module.exports = router;
