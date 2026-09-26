// ============================================================
// H/E Travellers CTF Platform - Main Express Application
// Educational cybersecurity training platform for Hackers' Era
// ============================================================
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');

const { errorHandler } = require('./middleware/errorHandler');
const { ctfModeCheck } = require('./middleware/ctf');
const routes = require('./routes/index');

const app = express();

// ─── Security Headers (intentionally misconfigured for CTF) ──────────────────
// HE-034: CORS misconfiguration - wildcard with credentials
app.use(cors({
  origin: (origin, callback) => {
    // Intentional: allows any origin (CTF challenge HE-034)
    callback(null, origin || '*');
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CTF-Token']
}));

// Intentional: helmet with reduced security for CTF (missing clickjacking protection etc.)
app.use(helmet({
  contentSecurityPolicy: false,       // CTF: allows XSS challenges
  frameguard: false,                  // CTF: allows clickjacking challenge
  hsts: false,                        // CTF: HSTS missing
  xssFilter: false,                   // CTF: no XSS filter header
}));

app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  // HE-033: morgan logs contain sensitive request data
  app.use(morgan(':method :url :status :response-time ms - :req[authorization] - :req[cookie]'));
}

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// CTF mode enforcement
app.use(ctfModeCheck);

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api', routes);

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'he-travellers-api',
    version: '1.0.0',
    ctf_mode: process.env.CTF_MODE === 'true',
    timestamp: new Date().toISOString(),
    // HE-032: dev info leak in health endpoint
    environment: process.env.NODE_ENV,
    db_host: process.env.CTF_MODE === 'true' ? '[CTF_REDACTED]' : process.env.DB_HOST,
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
