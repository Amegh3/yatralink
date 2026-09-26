// ============================================================
// H/E Travellers CTF Platform - Route/Search Routes
// CTF Challenges: HE-009 (SQL injection), HE-010 (reflected XSS)
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

// Helper function to generate realistic dynamic bus schedules for ANY Indian route
function generateDynamicSchedules(from, to, dateStr) {
  const cleanFrom = from.replace(/['"\\]/g, '');
  const cleanTo = to.replace(/['"\\]/g, '');

  // Deterministic distance calculation based on city name lengths & characters
  const charSum = (cleanFrom + cleanTo).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const distanceKm = 180 + (charSum % 480); // Distance between 180 km and 660 km

  const operators = [
    { name: 'Thamarai Bus Transports', type: 'AC_SLEEPER', seats: 36, rateKm: 2.2, rating: 4.9, count: 1479 },
    { name: 'Vikram Travels Express', type: 'MULTI_AXLE', seats: 40, rateKm: 2.4, rating: 4.8, count: 892 },
    { name: 'SRM Transports', type: 'AC_SLEEPER', seats: 36, rateKm: 2.1, rating: 4.7, count: 2150 },
    { name: 'VRL Logistics', type: 'AC_SEATER', seats: 45, rateKm: 1.6, rating: 4.6, count: 3100 },
    { name: 'KSRTC Swift Deluxe', type: 'SEMI_SLEEPER', seats: 40, rateKm: 1.8, rating: 4.8, count: 640 },
    { name: 'Zingbus Primo', type: 'AC_SLEEPER', seats: 36, rateKm: 2.5, rating: 4.9, count: 1820 },
    { name: 'Orange Tours & Travels', type: 'MULTI_AXLE', seats: 40, rateKm: 2.3, rating: 4.7, count: 1140 },
    { name: 'Kallada Travels', type: 'NON_AC_SLEEPER', seats: 36, rateKm: 1.5, rating: 4.4, count: 950 },
  ];

  const departureTimes = ['06:30', '13:45', '19:15', '21:00', '21:30', '22:15', '23:00', '23:45'];

  return operators.map((op, idx) => {
    const dep = departureTimes[idx % departureTimes.length];
    const [depH, depM] = dep.split(':').map(Number);
    const durationHours = Math.round((distanceKm / 55) * 10) / 10;
    const totalDepMins = depH * 60 + depM;
    const totalArrMins = Math.round(totalDepMins + durationHours * 60) % 1440;
    const arrH = String(Math.floor(totalArrMins / 60)).padStart(2, '0');
    const arrM = String(totalArrMins % 60).padStart(2, '0');
    const arrTime = `${arrH}:${arrM}`;

    const basePrice = Math.round(distanceKm * op.rateKm / 10) * 10;
    const availableSeats = 4 + ((charSum + idx * 7) % (op.seats - 8));

    return {
      schedule_id: 1000 + idx,
      bus_id: 100 + idx,
      route_id: 50 + idx,
      from_city: cleanFrom,
      to_city: cleanTo,
      distance_km: distanceKm,
      operator_name: op.name,
      bus_name: `${op.name} ${op.type.replace('_', ' ')}`,
      bus_number: `IND-${(charSum + idx * 13) % 90 + 10}-AB-${1000 + idx * 77}`,
      bus_type: op.type,
      total_seats: op.seats,
      available_seats: availableSeats,
      base_price: basePrice,
      departure_time: dep,
      arrival_time: arrTime,
      duration: `${Math.floor(durationHours)}h ${Math.round((durationHours % 1) * 60)}m`,
      status: 'ACTIVE',
      rating: op.rating,
      review_count: op.count,
      amenities: ['AC', 'WiFi', 'Charging Point', 'Blanket', 'Reading Light', 'Water Bottle', 'Emergency Exit']
    };
  });
}

// ─── GET /api/v1/routes ───────────────────────────────────────────────────────
router.get('/', asyncHandler(async (req, res) => {
  const result = await db.query(
    'SELECT id, from_city, to_city, distance_km FROM routes WHERE is_active = true ORDER BY from_city'
  );
  res.json({ routes: result.rows, total: result.rows.length });
}));

// ─── GET /api/v1/routes/search ───────────────────────────────────────────────
// HE-009: SQL injection via raw string concatenation in 'from' param
router.get('/search', asyncHandler(async (req, res) => {
  const { from, to, date, bus_type, min_price, max_price, departure_after, departure_before } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: 'Validation', message: 'From and To cities are required' });
  }

  // HE-009: INTENTIONAL SQL INJECTION - raw string concatenation
  const rawQuery = `
    SELECT 
      s.id as schedule_id,
      s.departure_time,
      s.arrival_time,
      s.base_price,
      s.available_seats,
      s.status,
      b.id as bus_id,
      b.bus_name,
      b.bus_number,
      b.bus_type,
      b.total_seats,
      b.amenities,
      b.rating,
      r.id as route_id,
      r.from_city,
      r.to_city,
      r.distance_km,
      op.company_name as operator_name
    FROM schedules s
    JOIN buses b ON s.bus_id = b.id
    JOIN routes r ON s.route_id = r.id
    JOIN operators op ON b.operator_id = op.id
    WHERE r.from_city ILIKE '${from}'
      AND r.to_city ILIKE '${to}'
      AND s.status = 'ACTIVE'
      AND b.is_active = true
      ${date ? `AND s.departure_date::date = '${date}'::date` : ''}
      ${bus_type ? `AND b.bus_type = '${bus_type}'` : ''}
      ${min_price ? `AND s.base_price >= ${min_price}` : ''}
      ${max_price ? `AND s.base_price <= ${max_price}` : ''}
      ${departure_after ? `AND s.departure_time >= '${departure_after}'` : ''}
      ${departure_before ? `AND s.departure_time <= '${departure_before}'` : ''}
    ORDER BY s.departure_time ASC
  `;

  try {
    const result = await db.query(rawQuery);
    let schedulesList = result.rows;

    // Fallback dynamic generator so ANY searched route displays realistic buses
    if (!schedulesList || schedulesList.length === 0) {
      schedulesList = generateDynamicSchedules(from, to, date);
    }

    res.json({ 
      schedules: schedulesList,
      search: { from, to, date },
      total: schedulesList.length 
    });
  } catch (err) {
    // If database error occurs (e.g. invalid SQL syntax), fallback to dynamic results unless explicitly requested HTML error
    if (req.headers['accept']?.includes('text/html') && (from.includes("'") || to.includes("'"))) {
      return res.status(500).send(`
        <html><body>
          <h2>Search Error</h2>
          <p>Error searching for buses from <b>${from}</b> to <b>${to}</b>.</p>
          <p>Database error: ${err.message}</p>
        </body></html>
      `);
    }

    // Return dynamic schedules even on DB fallback
    const fallbackSchedules = generateDynamicSchedules(from, to, date);
    res.json({
      schedules: fallbackSchedules,
      search: { from, to, date },
      total: fallbackSchedules.length
    });
  }
}));

// ─── GET /api/v1/routes/cities ────────────────────────────────────────────────
router.get('/cities', asyncHandler(async (req, res) => {
  try {
    const result = await db.query(`
      SELECT DISTINCT city FROM (
        SELECT from_city as city FROM routes WHERE is_active = true
        UNION
        SELECT to_city as city FROM routes WHERE is_active = true
      ) cities ORDER BY city
    `);
    const dbCities = result.rows.map(r => r.city);
    const popularCities = ['Bangalore', 'Chennai', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Jaipur', 'Goa', 'Thalassery', 'Trivandrum', 'Kozhikode', 'Kochi', 'Coimbatore', 'Madurai'];
    const allCities = Array.from(new Set([...dbCities, ...popularCities])).sort();
    res.json({ cities: allCities });
  } catch (err) {
    res.json({ cities: ['Bangalore', 'Chennai', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Jaipur', 'Goa', 'Thalassery', 'Trivandrum', 'Kozhikode', 'Kochi', 'Coimbatore'] });
  }
}));

module.exports = router;
