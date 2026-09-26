// ============================================================
// H/E Travellers CTF Platform - Middleware: CTF Mode
// Enforces CTF-safe operation - no real external calls
// ============================================================
'use strict';

const ctfModeCheck = (req, res, next) => {
  if (process.env.CTF_MODE !== 'true') {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'CTF Mode is not enabled. This platform requires CTF_MODE=true.',
    });
  }
  // Attach CTF flag to request for use in controllers
  req.ctfMode = true;
  next();
};

// Blocks real external network calls when ALLOW_EXTERNAL_NETWORK=false
const blockExternalNetwork = (url) => {
  if (process.env.ALLOW_EXTERNAL_NETWORK === 'true') return false;
  
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    
    // Allow only local/CTF domains
    const allowed = [
      'localhost',
      '127.0.0.1',
      'hetravellers.local',
      'internal-api.hetravellers.local',
      'metadata.hetravellers.local',
    ];
    
    return !allowed.some(h => hostname === h || hostname.endsWith('.' + h.replace(/^\./, '')));
  } catch {
    return true; // block invalid URLs
  }
};

// Admin-only middleware (proper)
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden', message: 'Admin access required' });
  }
  next();
};

// Organizer-only middleware
const requireOrganizer = (req, res, next) => {
  if (!req.user || !['admin', 'organizer'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden', message: 'Organizer access required' });
  }
  next();
};

module.exports = { ctfModeCheck, blockExternalNetwork, requireAdmin, requireOrganizer };
