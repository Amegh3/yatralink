-- ============================================================
-- H/E Travellers CTF Platform - PostgreSQL Database Schema
-- Educational cybersecurity training platform for Hackers' Era
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── USERS & AUTH ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user','operator','admin','organizer')),
  is_verified BOOLEAN DEFAULT false,
  profile_picture VARCHAR(500),
  otp VARCHAR(10),
  otp_expires_at TIMESTAMP,
  reset_token VARCHAR(100),
  reset_token_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- ─── OPERATORS ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS operators (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(200) NOT NULL,
  gst_number VARCHAR(20),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  address TEXT,
  logo_url VARCHAR(500),
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── BUSES ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS buses (
  id SERIAL PRIMARY KEY,
  operator_id INTEGER REFERENCES operators(id) ON DELETE CASCADE,
  bus_name VARCHAR(200) NOT NULL,
  bus_number VARCHAR(50) UNIQUE NOT NULL,
  bus_type VARCHAR(50) CHECK (bus_type IN ('AC_SLEEPER','NON_AC_SLEEPER','AC_SEATER','SEMI_SLEEPER','LUXURY','MULTI_AXLE','ELECTRIC','NIGHT','EXPRESS')),
  total_seats INTEGER DEFAULT 40,
  amenities JSONB DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 4.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── ROUTES & STOPS ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS routes (
  id SERIAL PRIMARY KEY,
  from_city VARCHAR(100) NOT NULL,
  to_city VARCHAR(100) NOT NULL,
  distance_km INTEGER,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS stops (
  id SERIAL PRIMARY KEY,
  route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
  city_name VARCHAR(100) NOT NULL,
  stop_order INTEGER,
  arrival_time_offset INTEGER DEFAULT 0,
  departure_time_offset INTEGER DEFAULT 0
);

-- ─── SCHEDULES ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL PRIMARY KEY,
  bus_id INTEGER REFERENCES buses(id) ON DELETE CASCADE,
  route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
  departure_time TIME,
  arrival_time TIME,
  departure_date DATE,
  base_price DECIMAL(10,2) NOT NULL,
  available_seats INTEGER,
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','CANCELLED','COMPLETED')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── SEATS ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS seats (
  id SERIAL PRIMARY KEY,
  bus_id INTEGER REFERENCES buses(id) ON DELETE CASCADE,
  seat_number VARCHAR(10) NOT NULL,
  seat_type VARCHAR(20) DEFAULT 'WINDOW' CHECK (seat_type IN ('WINDOW','AISLE')),
  berth_type VARCHAR(20) DEFAULT 'SINGLE' CHECK (berth_type IN ('UPPER','LOWER','SINGLE')),
  is_ladies BOOLEAN DEFAULT false,
  row_number INTEGER,
  column_number INTEGER
);

-- ─── BOOKINGS ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  schedule_id INTEGER REFERENCES schedules(id),
  booking_status VARCHAR(20) DEFAULT 'PENDING' CHECK (booking_status IN ('PENDING','CONFIRMED','CANCELLED')),
  total_amount DECIMAL(10,2) NOT NULL,
  convenience_fee DECIMAL(10,2) DEFAULT 0,
  gst DECIMAL(10,2) DEFAULT 0,
  insurance_amount DECIMAL(10,2) DEFAULT 0,
  coupon_discount DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,
  boarding_point VARCHAR(200),
  dropping_point VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_seats (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  seat_id INTEGER REFERENCES seats(id),
  passenger_name VARCHAR(100),
  passenger_age INTEGER,
  passenger_gender VARCHAR(10) CHECK (passenger_gender IN ('MALE','FEMALE','OTHER')),
  is_primary BOOLEAN DEFAULT false
);

-- ─── PAYMENTS ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(30),
  transaction_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING','SUCCESS','FAILED','REFUNDED')),
  gateway_response JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refunds (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  payment_id INTEGER REFERENCES payments(id),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING','PROCESSED','FAILED')),
  reason TEXT,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── COUPONS ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) CHECK (discount_type IN ('PERCENT','FLAT')),
  discount_value DECIMAL(10,2) NOT NULL,
  max_discount DECIMAL(10,2),
  min_booking_amount DECIMAL(10,2) DEFAULT 0,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS coupon_usages (
  id SERIAL PRIMARY KEY,
  coupon_id INTEGER REFERENCES coupons(id),
  user_id INTEGER REFERENCES users(id),
  booking_id INTEGER REFERENCES bookings(id),
  used_at TIMESTAMP DEFAULT NOW()
);

-- ─── WALLET ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id SERIAL PRIMARY KEY,
  wallet_id INTEGER REFERENCES wallets(id),
  amount DECIMAL(10,2) NOT NULL,
  transaction_type VARCHAR(10) CHECK (transaction_type IN ('CREDIT','DEBIT')),
  description TEXT,
  reference_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── REVIEWS ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  bus_id INTEGER REFERENCES buses(id),
  booking_id INTEGER REFERENCES bookings(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(200),
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── SUPPORT ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS support_tickets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  subject VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'GENERAL',
  priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW','MEDIUM','HIGH','URGENT')),
  status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN','IN_PROGRESS','CLOSED')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket_replies (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  message TEXT NOT NULL,
  attachment_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'INFO',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── AUDIT LOGS ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(50),
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── CTF SYSTEM ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(10) UNIQUE NOT NULL,
  captain_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  vuln_id VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  difficulty VARCHAR(10) CHECK (difficulty IN ('EASY','MEDIUM','HARD')),
  description TEXT,
  points INTEGER NOT NULL,
  max_points INTEGER,
  is_active BOOLEAN DEFAULT true,
  endpoint VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flags (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
  flag_value VARCHAR(200) UNIQUE NOT NULL,
  is_revealed BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  team_id INTEGER REFERENCES teams(id),
  challenge_id INTEGER REFERENCES challenges(id),
  flag_submitted VARCHAR(200),
  is_correct BOOLEAN DEFAULT false,
  points_awarded INTEGER DEFAULT 0,
  submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hints (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
  hint_text TEXT NOT NULL,
  hint_order INTEGER,
  points_penalty INTEGER DEFAULT 10
);

CREATE TABLE IF NOT EXISTS hint_usages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  hint_id INTEGER REFERENCES hints(id),
  used_at TIMESTAMP DEFAULT NOW()
);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_schedule_id ON bookings(schedule_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_schedules_route_id ON schedules(route_id);
CREATE INDEX IF NOT EXISTS idx_schedules_bus_id ON schedules(bus_id);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(departure_date);
CREATE INDEX IF NOT EXISTS idx_seats_bus_id ON seats(bus_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_bus ON reviews(bus_id);
CREATE INDEX IF NOT EXISTS idx_routes_cities ON routes(from_city, to_city);
