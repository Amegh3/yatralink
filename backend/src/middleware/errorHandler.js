// ============================================================
// H/E Travellers CTF Platform - Middleware: Error Handler
// CTF: HE-033 - Verbose error disclosure with stack traces
// ============================================================
'use strict';

// CTF Challenge HE-033: Verbose error handler leaks stack traces and internals
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isDev = process.env.NODE_ENV === 'development';

  // CTF: In "development" mode (default), full stack traces are leaked
  const response = {
    error: err.name || 'InternalServerError',
    message: err.message || 'Something went wrong',
    status: statusCode,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };

  // HE-033: Stack trace and internals leaked even in production when debug header present
  if (isDev || req.headers['x-debug'] === 'true') {
    response.stack = err.stack;
    response.query = err.query;        // DB query leakage
    response.detail = err.detail;     // PG error detail
    response.hint = err.hint;         // PG hint
    response.file = err.file;         // Source file path
    response.routine = err.routine;
  }

  // Log to console (server-side)
  if (statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.path}:`, err);
  }

  res.status(statusCode).json(response);
};

// Async handler wrapper to avoid try-catch everywhere
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
