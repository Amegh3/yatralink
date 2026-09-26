-- ============================================================
-- H/E Travellers CTF Platform - Seed Data
-- All data is synthetic and fictional
-- ============================================================

-- ─── USERS ───────────────────────────────────────────────────────────────────
-- Passwords: Demo@1234 = $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.
-- Admin@secure2024 = $2a$10$EIXJSvpZkdXqZ4YN5MHzMOGt6yz7HXBqLV3uf2kO5mWpQ8jtsDni.

INSERT INTO users (email, password_hash, name, phone, role, is_verified) VALUES
('admin@hetravellers.local', '$2a$10$EIXJSvpZkdXqZ4YN5MHzMOGt6yz7HXBqLV3uf2kO5mWpQ8jtsDni.', 'Admin User', '9000000001', 'admin', true),
('organizer@hetravellers.local', '$2a$10$EIXJSvpZkdXqZ4YN5MHzMOGt6yz7HXBqLV3uf2kO5mWpQ8jtsDni.', 'CTF Organizer', '9000000002', 'organizer', true),
('operator@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'VayuRath Admin', '9000000003', 'operator', true),
('op2@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Deccan Swift Admin', '9000000004', 'operator', true),
('op3@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Coastal Cruiser Admin', '9000000005', 'operator', true),
('op4@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'RajPath Admin', '9000000006', 'operator', true),
('op5@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'NightRider Admin', '9000000007', 'operator', true),
('demo.user@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Demo User', '9876543210', 'user', true),
('traveller01@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Arjun Sharma', '9876543201', 'user', true),
('traveller02@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Priya Nair', '9876543202', 'user', true),
('traveller03@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Rahul Mehta', '9876543203', 'user', true),
('traveller04@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Ananya Krishnan', '9876543204', 'user', true),
('traveller05@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Vikram Singh', '9876543205', 'user', true),
('traveller06@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Meera Pillai', '9876543206', 'user', true),
('traveller07@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Suresh Patel', '9876543207', 'user', true),
('traveller08@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Divya Reddy', '9876543208', 'user', true),
('traveller09@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Arun Kumar', '9876543209', 'user', true),
('traveller10@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Sneha Varma', '9876543200', 'user', true),
('user11@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Kiran Bose', '9876500011', 'user', true),
('user12@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Lakshmi Devi', '9876500012', 'user', true),
('user13@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Mohan Das', '9876500013', 'user', true),
('user14@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Nisha Rao', '9876500014', 'user', true),
('user15@hetravellers.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9.', 'Prakash Iyer', '9876500015', 'user', true);

-- ─── OPERATORS ───────────────────────────────────────────────────────────────
INSERT INTO operators (user_id, company_name, gst_number, contact_email, contact_phone, address, is_approved) VALUES
(3, 'VayuRath Travels', '29AABCU9603R1ZX', 'contact@vayurath.in', '9000100001', 'No. 45, MG Road, Bengaluru - 560001', true),
(4, 'Deccan Swift Express', '36AADCD3456R1ZY', 'info@deccanswift.in', '9000100002', '12 Nampally, Hyderabad - 500001', true),
(5, 'Coastal Cruiser Travels', '32AACCC7890R1ZZ', 'ops@coastalcruiser.in', '9000100003', 'NH-66, Kochi - 682001', true),
(6, 'RajPath Express Pvt Ltd', '08AABCR5678R1ZX', 'support@rajpath.in', '9000100004', 'Sindhi Camp, Jaipur - 302001', true),
(7, 'NightRider Premium', '29AABCN2345R1ZP', 'care@nightrider.in', '9000100005', 'Shivaji Nagar, Pune - 411005', true);

-- ─── ROUTES ──────────────────────────────────────────────────────────────────
INSERT INTO routes (from_city, to_city, distance_km, is_active) VALUES
('Bengaluru', 'Hyderabad', 570, true),
('Bengaluru', 'Chennai', 350, true),
('Bengaluru', 'Kochi', 550, true),
('Bengaluru', 'Mangaluru', 360, true),
('Bengaluru', 'Mumbai', 1000, true),
('Bengaluru', 'Pune', 840, true),
('Bengaluru', 'Goa', 560, true),
('Bengaluru', 'Mysuru', 150, true),
('Bengaluru', 'Coimbatore', 360, true),
('Bengaluru', 'Madurai', 450, true),
('Chennai', 'Bengaluru', 350, true),
('Chennai', 'Kochi', 700, true),
('Chennai', 'Hyderabad', 630, true),
('Chennai', 'Coimbatore', 500, true),
('Chennai', 'Madurai', 460, true),
('Hyderabad', 'Bengaluru', 570, true),
('Hyderabad', 'Chennai', 630, true),
('Hyderabad', 'Mumbai', 710, true),
('Hyderabad', 'Pune', 560, true),
('Hyderabad', 'Goa', 670, true),
('Mumbai', 'Pune', 150, true),
('Mumbai', 'Goa', 590, true),
('Mumbai', 'Ahmedabad', 530, true),
('Mumbai', 'Bengaluru', 1000, true),
('Mumbai', 'Nashik', 160, true),
('Delhi', 'Jaipur', 280, true),
('Delhi', 'Chandigarh', 250, true),
('Delhi', 'Lucknow', 550, true),
('Delhi', 'Dehradun', 300, true),
('Delhi', 'Agra', 200, true),
('Delhi', 'Haridwar', 220, true),
('Kochi', 'Bengaluru', 550, true),
('Kochi', 'Chennai', 700, true),
('Kochi', 'Hyderabad', 1200, true),
('Kochi', 'Kozhikode', 190, true),
('Kochi', 'Thiruvananthapuram', 220, true),
('Kochi', 'Mangaluru', 360, true),
('Kozhikode', 'Bengaluru', 400, true),
('Kozhikode', 'Kochi', 190, true),
('Kozhikode', 'Chennai', 870, true),
('Kannur', 'Bengaluru', 450, true),
('Kannur', 'Kochi', 290, true),
('Thiruvananthapuram', 'Bengaluru', 750, true),
('Thiruvananthapuram', 'Kochi', 220, true),
('Thiruvananthapuram', 'Chennai', 700, true),
('Kollam', 'Bengaluru', 720, true),
('Kottayam', 'Bengaluru', 640, true),
('Coimbatore', 'Bengaluru', 360, true),
('Coimbatore', 'Kochi', 200, true),
('Coimbatore', 'Chennai', 500, true),
('Madurai', 'Chennai', 460, true),
('Madurai', 'Bengaluru', 450, true),
('Madurai', 'Kochi', 350, true),
('Goa', 'Bengaluru', 560, true),
('Goa', 'Mumbai', 590, true),
('Goa', 'Pune', 450, true),
('Pune', 'Bengaluru', 840, true),
('Pune', 'Hyderabad', 560, true),
('Pune', 'Mumbai', 150, true),
('Pune', 'Goa', 450, true),
('Ahmedabad', 'Mumbai', 530, true),
('Ahmedabad', 'Surat', 270, true),
('Jaipur', 'Delhi', 280, true),
('Jaipur', 'Udaipur', 390, true),
('Lucknow', 'Delhi', 550, true),
('Lucknow', 'Varanasi', 320, true),
('Mysuru', 'Bengaluru', 150, true),
('Mysuru', 'Ooty', 100, true),
('Mangaluru', 'Bengaluru', 360, true),
('Mangaluru', 'Kochi', 360, true),
('Vijayawada', 'Hyderabad', 280, true),
('Vijayawada', 'Chennai', 470, true),
('Vishakhapatnam', 'Hyderabad', 590, true),
('Tirupati', 'Chennai', 180, true),
('Tirupati', 'Bengaluru', 290, true),
('Nashik', 'Mumbai', 160, true),
('Nashik', 'Pune', 210, true),
('Surat', 'Ahmedabad', 270, true),
('Surat', 'Mumbai', 290, true);

-- ─── BUSES ───────────────────────────────────────────────────────────────────
INSERT INTO buses (operator_id, bus_name, bus_number, bus_type, total_seats, amenities, rating) VALUES
(1, 'VayuRath AC Sleeper Deluxe', 'KA01AB1001', 'AC_SLEEPER', 36, '{"wifi":true,"usb":true,"blanket":true,"water":true,"reading_light":true}', 4.5),
(1, 'VayuRath Night Cruiser', 'KA01AB1002', 'NON_AC_SLEEPER', 40, '{"blanket":true,"water":true,"reading_light":true}', 4.1),
(1, 'VayuRath Express Seater', 'KA01AB1003', 'AC_SEATER', 45, '{"wifi":true,"usb":true,"water":true}', 4.3),
(1, 'VayuRath Luxury Volvo', 'KA01AB1004', 'LUXURY', 30, '{"wifi":true,"usb":true,"blanket":true,"water":true,"entertainment":true,"meal":true}', 4.8),
(1, 'VayuRath Semi Sleeper', 'KA01AB1005', 'SEMI_SLEEPER', 40, '{"usb":true,"water":true}', 4.0),
(2, 'Deccan Swift AC Plus', 'TS01CD2001', 'AC_SLEEPER', 36, '{"wifi":true,"usb":true,"blanket":true,"water":true}', 4.4),
(2, 'Deccan Super Express', 'TS01CD2002', 'EXPRESS', 50, '{"usb":true,"water":true}', 3.9),
(2, 'Deccan Multi-Axle', 'TS01CD2003', 'MULTI_AXLE', 54, '{"wifi":true,"usb":true,"water":true,"reading_light":true}', 4.2),
(2, 'Deccan Night Rider', 'TS01CD2004', 'NON_AC_SLEEPER', 40, '{"blanket":true,"water":true}', 3.8),
(2, 'Deccan Electric Green', 'TS01CD2005', 'ELECTRIC', 45, '{"wifi":true,"usb":true,"water":true,"ac":true}', 4.6),
(3, 'Coastal AC Sleeper', 'KL01EF3001', 'AC_SLEEPER', 36, '{"wifi":true,"usb":true,"blanket":true,"water":true}', 4.3),
(3, 'Coastal Luxury Cruise', 'KL01EF3002', 'LUXURY', 28, '{"wifi":true,"usb":true,"blanket":true,"water":true,"entertainment":true}', 4.7),
(3, 'Coastal Night Express', 'KL01EF3003', 'NIGHT', 42, '{"blanket":true,"water":true,"reading_light":true}', 4.0),
(3, 'Coastal Semi Sleeper', 'KL01EF3004', 'SEMI_SLEEPER', 40, '{"usb":true,"water":true}', 3.9),
(4, 'RajPath AC Sleeper', 'RJ01GH4001', 'AC_SLEEPER', 36, '{"wifi":true,"usb":true,"blanket":true,"water":true}', 4.2),
(4, 'RajPath Express', 'RJ01GH4002', 'EXPRESS', 50, '{"usb":true,"water":true}', 3.8),
(4, 'RajPath Luxury Volvo', 'RJ01GH4003', 'LUXURY', 30, '{"wifi":true,"usb":true,"blanket":true,"water":true,"entertainment":true}', 4.7),
(5, 'NightRider Premium Sleeper', 'MH01IJ5001', 'AC_SLEEPER', 36, '{"wifi":true,"usb":true,"blanket":true,"water":true,"meal":true}', 4.6),
(5, 'NightRider Seater AC', 'MH01IJ5002', 'AC_SEATER', 45, '{"wifi":true,"usb":true,"water":true}', 4.3),
(5, 'NightRider Electric', 'MH01IJ5003', 'ELECTRIC', 45, '{"wifi":true,"usb":true,"water":true,"ac":true}', 4.5);

-- ─── SCHEDULES (multiple dates) ───────────────────────────────────────────────
-- We'll insert schedules for routes 1-20 with buses 1-20 for the next 30 days
INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, departure_date, base_price, available_seats, status) VALUES
-- Bengaluru to Hyderabad
(1, 1, '20:00', '06:00', CURRENT_DATE + 1, 850, 30, 'ACTIVE'),
(1, 1, '21:00', '07:00', CURRENT_DATE + 2, 850, 36, 'ACTIVE'),
(6, 1, '22:00', '08:00', CURRENT_DATE + 1, 780, 36, 'ACTIVE'),
(6, 1, '23:00', '09:00', CURRENT_DATE + 2, 780, 36, 'ACTIVE'),
(4, 1, '19:00', '05:30', CURRENT_DATE + 1, 1500, 28, 'ACTIVE'),
-- Bengaluru to Chennai
(2, 2, '21:00', '05:00', CURRENT_DATE + 1, 650, 38, 'ACTIVE'),
(3, 2, '22:00', '06:30', CURRENT_DATE + 1, 580, 45, 'ACTIVE'),
(11, 2, '20:30', '04:30', CURRENT_DATE + 2, 700, 36, 'ACTIVE'),
-- Bengaluru to Kochi
(11, 3, '20:00', '07:00', CURRENT_DATE + 1, 900, 36, 'ACTIVE'),
(12, 3, '21:00', '08:00', CURRENT_DATE + 1, 1400, 28, 'ACTIVE'),
(13, 3, '22:00', '09:00', CURRENT_DATE + 2, 800, 42, 'ACTIVE'),
-- Bengaluru to Mumbai
(5, 5, '16:00', '08:00', CURRENT_DATE + 1, 1100, 38, 'ACTIVE'),
(18, 5, '17:00', '09:00', CURRENT_DATE + 1, 1800, 36, 'ACTIVE'),
-- Chennai to Bengaluru
(8, 11, '20:00', '04:00', CURRENT_DATE + 1, 650, 54, 'ACTIVE'),
(3, 11, '21:00', '05:30', CURRENT_DATE + 1, 580, 45, 'ACTIVE'),
-- Hyderabad to Bengaluru
(6, 16, '20:00', '06:00', CURRENT_DATE + 1, 780, 36, 'ACTIVE'),
(10, 16, '21:00', '07:00', CURRENT_DATE + 1, 1200, 45, 'ACTIVE'),
-- Kochi to Bengaluru
(11, 32, '18:00', '06:00', CURRENT_DATE + 1, 900, 36, 'ACTIVE'),
(12, 32, '19:00', '07:00', CURRENT_DATE + 1, 1400, 28, 'ACTIVE'),
-- Delhi to Jaipur
(15, 26, '06:00', '11:00', CURRENT_DATE + 1, 450, 36, 'ACTIVE'),
(17, 26, '08:00', '13:00', CURRENT_DATE + 1, 1200, 30, 'ACTIVE'),
(16, 26, '14:00', '19:00', CURRENT_DATE + 1, 380, 50, 'ACTIVE'),
-- Mumbai to Pune
(19, 21, '06:00', '10:00', CURRENT_DATE + 1, 280, 45, 'ACTIVE'),
(18, 21, '09:00', '13:00', CURRENT_DATE + 1, 600, 36, 'ACTIVE'),
(20, 21, '18:00', '22:00', CURRENT_DATE + 1, 450, 45, 'ACTIVE'),
-- Kozhikode to Bengaluru
(14, 38, '20:00', '08:00', CURRENT_DATE + 1, 750, 40, 'ACTIVE'),
(11, 38, '21:00', '09:00', CURRENT_DATE + 2, 850, 36, 'ACTIVE'),
-- More schedules
(1, 1, '20:00', '06:00', CURRENT_DATE + 3, 850, 36, 'ACTIVE'),
(1, 1, '20:00', '06:00', CURRENT_DATE + 5, 950, 36, 'ACTIVE'),
(1, 1, '20:00', '06:00', CURRENT_DATE + 7, 1050, 36, 'ACTIVE'),
(6, 1, '22:00', '08:00', CURRENT_DATE + 3, 780, 36, 'ACTIVE'),
(4, 1, '19:00', '05:30', CURRENT_DATE + 3, 1500, 28, 'ACTIVE'),
(11, 3, '20:00', '07:00', CURRENT_DATE + 3, 900, 36, 'ACTIVE'),
(12, 3, '21:00', '08:00', CURRENT_DATE + 3, 1400, 28, 'ACTIVE'),
(18, 5, '17:00', '09:00', CURRENT_DATE + 3, 1800, 36, 'ACTIVE'),
(5, 5, '16:00', '08:00', CURRENT_DATE + 3, 1100, 38, 'ACTIVE');

-- Update available_seats to match total_seats initially
UPDATE schedules s SET available_seats = b.total_seats FROM buses b WHERE s.bus_id = b.id AND s.available_seats IS NULL;

-- ─── COUPONS ─────────────────────────────────────────────────────────────────
INSERT INTO coupons (code, discount_type, discount_value, max_discount, min_booking_amount, usage_limit, is_active, expires_at, created_by) VALUES
('FIRST10', 'PERCENT', 10, 150, 300, 1000, true, NOW() + INTERVAL '90 days', 1),
('SUMMER50', 'FLAT', 50, NULL, 200, 500, true, NOW() + INTERVAL '60 days', 1),
('HACKERS20', 'PERCENT', 20, 300, 500, 200, true, NOW() + INTERVAL '30 days', 1),
('NEWUSER', 'PERCENT', 15, 200, 400, 2000, true, NOW() + INTERVAL '90 days', 1),
('DIWALI100', 'FLAT', 100, NULL, 500, 300, true, NOW() + INTERVAL '30 days', 1),
('KERALA25', 'PERCENT', 25, 400, 600, 150, true, NOW() + INTERVAL '45 days', 1),
('MUMBAI75', 'FLAT', 75, NULL, 300, 400, true, NOW() + INTERVAL '60 days', 1),
('NIGHTBR', 'PERCENT', 30, 500, 800, 100, true, NOW() + INTERVAL '20 days', 1),
('MONSOON', 'FLAT', 120, NULL, 600, 250, true, NOW() + INTERVAL '30 days', 1),
('WEEKEND20', 'PERCENT', 20, 250, 400, 800, true, NOW() + INTERVAL '90 days', 1),
('LUXURY15', 'PERCENT', 15, 600, 1200, 200, true, NOW() + INTERVAL '60 days', 1),
('EARLYBIRD', 'FLAT', 80, NULL, 500, 300, true, NOW() + INTERVAL '90 days', 1),
('SUPERDEV', 'PERCENT', 50, 1000, 100, NULL, true, NOW() + INTERVAL '365 days', 1),
('HIDDEN99', 'FLAT', 999, NULL, 0, NULL, true, NOW() + INTERVAL '365 days', 1),
('NEGTEST', 'FLAT', -50, NULL, 0, NULL, true, NOW() + INTERVAL '365 days', 1);

-- ─── CHALLENGES (CTF) ────────────────────────────────────────────────────────
INSERT INTO challenges (vuln_id, title, category, difficulty, description, points, max_points, is_active, endpoint) VALUES
('HE-001', 'Brute Force Login', 'Authentication', 'EASY', 'The login endpoint has no rate limiting. Can you brute force the admin credentials?', 100, 100, true, 'POST /api/v1/auth/login'),
('HE-002', 'Email Enumeration', 'Authentication', 'EASY', 'The forgot-password endpoint reveals whether an email is registered. Find a valid user email.', 75, 75, true, 'POST /api/v1/auth/forgot-password'),
('HE-003', 'Predictable OTP', 'Authentication', 'MEDIUM', 'The OTP generation uses Math.random(). Can you predict the next OTP?', 150, 150, true, 'POST /api/v1/auth/verify-otp'),
('HE-004', 'Token Without Expiry', 'Authentication', 'MEDIUM', 'The password reset token check can be bypassed in legacy mode. Reset another user password.', 200, 200, true, 'POST /api/v1/auth/reset-password?legacy=true'),
('HE-005', 'JWT Algorithm Confusion', 'Authentication', 'HARD', 'The legacy authentication endpoint accepts JWT with algorithm=none. Can you forge an admin token?', 400, 400, true, 'GET /api/v1/users/me (with legacy auth)'),
('HE-006', 'IDOR Profile Access', 'Authorization', 'EASY', 'Access another user''s profile without authorization. Find the admin user''s details.', 100, 100, true, 'GET /api/v1/users/:id'),
('HE-007', 'Mass Assignment Privilege Escalation', 'Authorization', 'MEDIUM', 'The user update endpoint accepts a role field. Can you make yourself admin?', 200, 200, true, 'PUT /api/v1/users/:id'),
('HE-008', 'Unauthenticated User Listing', 'Authorization', 'EASY', 'List all users without authentication. How many users are registered?', 75, 75, true, 'GET /api/v1/users'),
('HE-009', 'SQL Injection in Search', 'Web', 'MEDIUM', 'The bus search endpoint uses string concatenation. Can you dump database contents?', 300, 300, true, 'GET /api/v1/routes/search?from='),
('HE-010', 'Reflected XSS in Search', 'Client Side', 'EASY', 'Search results reflect input in HTML without sanitization. Find the XSS vector.', 100, 100, true, 'GET /api/v1/routes/search (Accept: text/html)'),
('HE-011', 'Booking IDOR', 'Authorization', 'EASY', 'Access any booking without authentication. What is the total amount of booking #1?', 100, 100, true, 'GET /api/v1/bookings/:id'),
('HE-012', 'Price Manipulation', 'Business Logic', 'MEDIUM', 'The booking API accepts client-supplied totalAmount. Book a trip for ₹1.', 250, 250, true, 'POST /api/v1/bookings'),
('HE-013', 'Race Condition Seat Booking', 'Business Logic', 'MEDIUM', 'There''s no pessimistic locking. Book the same seat twice simultaneously.', 200, 200, true, 'POST /api/v1/bookings'),
('HE-014', 'Booking Cancel Chain', 'Authorization', 'HARD', 'Cancel another user''s booking and claim the refund. Chain IDOR + cancellation.', 350, 350, true, 'PUT /api/v1/bookings/:id/cancel'),
('HE-015', 'Predictable Booking IDs', 'Web', 'EASY', 'Booking IDs are sequential integers. Enumerate and find a confirmed booking.', 75, 75, true, 'GET /api/v1/bookings/:id'),
('HE-016', 'Payment Amount Manipulation', 'Business Logic', 'MEDIUM', 'The payment API uses client-supplied amount. Pay ₹0 for a booking.', 250, 250, true, 'POST /api/v1/payment/process'),
('HE-017', 'Payment Status IDOR', 'Authorization', 'MEDIUM', 'Check payment status of any booking without authentication.', 150, 150, true, 'GET /api/v1/payment/status/:bookingId'),
('HE-018', 'Negative Wallet Top-Up', 'Business Logic', 'MEDIUM', 'The wallet top-up accepts negative amounts. Can you drain the platform?', 200, 200, true, 'POST /api/v1/wallet/topup'),
('HE-019', 'Free Ticket Bypass', 'Business Logic', 'EASY', 'The payment success endpoint confirms bookings without verifying payment. Get a free ticket!', 150, 150, true, 'GET /api/v1/payment/success?booking_id='),
('HE-020', 'Stored XSS in Reviews', 'Client Side', 'EASY', 'Reviews are stored without sanitization. Inject a persistent XSS payload.', 150, 150, true, 'POST /api/v1/reviews'),
('HE-021', 'Review IDOR', 'Authorization', 'EASY', 'Post a review for a booking that isn''t yours.', 100, 100, true, 'POST /api/v1/reviews'),
('HE-022', 'Coupon Reuse', 'Business Logic', 'EASY', 'No per-user coupon tracking. Apply the same coupon 10 times.', 100, 100, true, 'POST /api/v1/coupons/apply'),
('HE-023', 'Negative Discount Coupon', 'Business Logic', 'MEDIUM', 'A coupon with negative discount_value exists. Apply it to increase your booking total... wait, that doesn''t make sense. Find the flag.', 200, 200, true, 'POST /api/v1/coupons/apply'),
('HE-024', 'Coupon Enumeration', 'Web', 'EASY', 'Coupon IDs are sequential. Find the hidden coupon with id=15.', 75, 75, true, 'GET /api/v1/coupons/:id'),
('HE-025', 'Support Ticket IDOR', 'Authorization', 'EASY', 'View another user''s support ticket without authentication.', 100, 100, true, 'GET /api/v1/support/:id'),
('HE-026', 'Stored XSS in Tickets', 'Client Side', 'MEDIUM', 'Support ticket replies are stored without sanitization. Inject an XSS payload that fires for admin.', 200, 200, true, 'POST /api/v1/support/:id/reply'),
('HE-027', 'Path Traversal Upload', 'Files', 'MEDIUM', 'File upload uses original filename. Can you write to an arbitrary path?', 250, 250, true, 'POST /api/v1/support/:id/reply (multipart)'),
('HE-028', 'Frontend-Only Admin Auth', 'Authorization', 'EASY', 'Admin users endpoint skips server-side auth check. Access admin user list without admin role.', 100, 100, true, 'GET /api/v1/admin/users'),
('HE-029', 'Audit Log Exposure', 'Authorization', 'MEDIUM', 'Audit logs accessible without admin role. Find the flag in the logs.', 150, 150, true, 'GET /api/v1/admin/audit-logs'),
('HE-030', 'CSRF Admin Action', 'Web', 'HARD', 'Admin role changes have no CSRF protection. Craft a CSRF payload to change a user''s role.', 300, 300, true, 'POST /api/v1/admin/users/:id/role'),
('HE-031', 'Password Hash Exposure', 'Web', 'EASY', 'The user profile API returns the bcrypt password hash. Find user #1 hash.', 100, 100, true, 'GET /api/v1/users/:id'),
('HE-032', 'Dev Config Leak', 'Web', 'EASY', 'A debug endpoint leaks environment variables including JWT secret.', 75, 75, true, 'GET /api/dev/config'),
('HE-033', 'Server Log Exposure', 'Web', 'EASY', 'Debug log endpoint leaks server audit logs.', 75, 75, true, 'GET /api/dev/logs'),
('HE-034', 'CORS Misconfiguration', 'Web', 'MEDIUM', 'CORS is configured to reflect any origin with credentials. Craft a cross-origin request.', 200, 200, true, 'GET /api/v1/auth/me (with CORS headers)');

-- ─── FLAGS ────────────────────────────────────────────────────────────────────
INSERT INTO flags (challenge_id, flag_value, is_revealed) VALUES
(1, 'HE{travellers_001_br0force_n0_l1m1t}', false),
(2, 'HE{travellers_002_em41l_3num3r4t10n}', false),
(3, 'HE{travellers_003_pr3d1ct4bl3_0tp}', false),
(4, 'HE{travellers_004_t0k3n_n0_exp1ry}', false),
(5, 'HE{travellers_005_jwt_n0n3_4lg0}', false),
(6, 'HE{travellers_006_1d0r_pr0f1l3}', false),
(7, 'HE{travellers_007_m4ss_4ss1gnm3nt}', false),
(8, 'HE{travellers_008_4p1_us3r_l1st}', false),
(9, 'HE{travellers_009_sql_1nj3ct10n}', false),
(10, 'HE{travellers_010_r3fl3ct3d_xss}', false),
(11, 'HE{travellers_011_b00k1ng_1d0r}', false),
(12, 'HE{travellers_012_pr1c3_m4n1pul4t10n}', false),
(13, 'HE{travellers_013_r4c3_c0nd1t10n}', false),
(14, 'HE{travellers_014_c4nc3l_ch41n}', false),
(15, 'HE{travellers_015_pr3d1ct4bl3_1d}', false),
(16, 'HE{travellers_016_p4ym3nt_4m0unt}', false),
(17, 'HE{travellers_017_p4ym3nt_1d0r}', false),
(18, 'HE{travellers_018_n3g4t1v3_w4ll3t}', false),
(19, 'HE{travellers_019_fr33_t1ck3t}', false),
(20, 'HE{travellers_020_st0r3d_xss_r3v13w}', false),
(21, 'HE{travellers_021_r3v13w_1d0r}', false),
(22, 'HE{travellers_022_c0up0n_r3us3}', false),
(23, 'HE{travellers_023_n3g_d1sc0unt}', false),
(24, 'HE{travellers_024_c0up0n_3num}', false),
(25, 'HE{travellers_025_supp0rt_1d0r}', false),
(26, 'HE{travellers_026_t1ck3t_xss}', false),
(27, 'HE{travellers_027_p4th_tr4v3rs4l}', false),
(28, 'HE{travellers_028_fr0nt3nd_4uth}', false),
(29, 'HE{travellers_029_4ud1t_l0g_3xp0s3}', false),
(30, 'HE{travellers_030_csrf_4dm1n}', false),
(31, 'HE{travellers_031_h4sh_3xp0sur3}', false),
(32, 'HE{travellers_032_d3v_c0nf1g}', false),
(33, 'HE{travellers_033_l0g_3xp0sur3}', false),
(34, 'HE{travellers_034_c0rs_m1sc0nf1g}', false);

-- ─── HINTS ────────────────────────────────────────────────────────────────────
INSERT INTO hints (challenge_id, hint_text, hint_order, points_penalty) VALUES
(1, 'Try sending many login requests. Does the server slow you down?', 1, 10),
(1, 'Tools like Hydra or Burp Intruder can automate credential testing.', 2, 15),
(1, 'Admin email is admin@hetravellers.local. You just need the password.', 3, 25),
(9, 'The "from" parameter in the search URL is directly concatenated into SQL.', 1, 30),
(9, 'Try: from=Bengaluru'' OR ''1''=''1', 2, 45),
(9, 'Use UNION SELECT to extract data from other tables.', 3, 75),
(5, 'JWT tokens have three parts separated by dots. What if the algorithm is none?', 1, 40),
(5, 'Create a JWT with {"alg":"none","typ":"JWT"} header and {"userId":1,"role":"admin"} payload.', 2, 70),
(5, 'The signature part should be empty. The legacy auth endpoint does not verify the signature when alg=none.', 3, 100);

-- ─── WALLETS FOR USERS ────────────────────────────────────────────────────────
INSERT INTO wallets (user_id, balance) VALUES
(1, 5000), (2, 2000), (3, 10000), (4, 8000), (5, 3000),
(6, 500), (7, 1200), (8, 750), (9, 300), (10, 0),
(11, 200), (12, 100), (13, 450), (14, 800), (15, 150),
(16, 0), (17, 0), (18, 0), (19, 0), (20, 0),
(21, 0), (22, 0), (23, 0), (24, 0), (25, 0);

-- ─── SAMPLE NOTIFICATIONS ────────────────────────────────────────────────────
INSERT INTO notifications (user_id, title, message, type) VALUES
(8, 'Welcome to H/E Travellers!', 'Thanks for joining! Use code NEWUSER for 15% off your first booking.', 'INFO'),
(9, 'Booking Confirmed', 'Your booking HET00000001 is confirmed. Have a safe journey!', 'SUCCESS'),
(10, 'Offer Available', 'Use code HACKERS20 for 20% off this week!', 'OFFER');

-- ─── SAMPLE BOOKINGS ─────────────────────────────────────────────────────────
INSERT INTO bookings (user_id, schedule_id, booking_status, total_amount, convenience_fee, gst, insurance_amount, coupon_discount, net_amount, boarding_point, dropping_point) VALUES
(9, 1, 'CONFIRMED', 850, 42, 42, 49, 0, 983, 'Hebbal, Bengaluru', 'Uppal, Hyderabad'),
(10, 2, 'CONFIRMED', 850, 42, 42, 0, 85, 849, 'Silk Board, Bengaluru', 'Paradise, Hyderabad'),
(11, 6, 'CONFIRMED', 650, 32, 32, 49, 0, 763, 'Jayanagar, Bengaluru', 'Koyambedu, Chennai'),
(12, 9, 'CONFIRMED', 900, 45, 45, 0, 0, 990, 'Electronic City, Bengaluru', 'Kaloor, Kochi'),
(8, 3, 'CANCELLED', 780, 39, 39, 0, 0, 858, 'KR Puram, Bengaluru', 'LB Nagar, Hyderabad');

-- ─── SAMPLE REVIEWS ──────────────────────────────────────────────────────────
INSERT INTO reviews (user_id, bus_id, booking_id, rating, title, content, is_approved) VALUES
(9, 1, 1, 5, 'Excellent AC Sleeper Experience', 'Very comfortable sleeper seats. WiFi worked throughout the journey. Staff was helpful and punctual. Highly recommended for night travel from Bengaluru to Hyderabad!', true),
(10, 6, 2, 4, 'Good journey, minor delays', 'The AC was good and seats were clean. Bus was delayed by 30 minutes but driver made up for it. Would travel again.', true),
(11, 2, 3, 4, 'Comfortable overnight bus', 'Non-AC sleeper was surprisingly comfortable. Blankets were clean. Journey was smooth.', true),
(12, 11, 4, 5, 'Best coastal route service', 'Coastal Cruiser is excellent! Seats were premium quality, bus was very clean, and they served water and snacks. 5 stars easily!', true),
(8, 3, NULL, 3, 'Average experience', 'Seater bus was okay. Nothing exceptional but nothing bad either. The bus arrived on time.', true);

-- ─── SAMPLE SUPPORT TICKETS ──────────────────────────────────────────────────
INSERT INTO support_tickets (user_id, subject, description, category, priority, status) VALUES
(9, 'Booking Cancellation Refund', 'I cancelled my booking HET00000005 two days ago but have not received the refund yet. Please process urgently.', 'REFUND', 'HIGH', 'IN_PROGRESS'),
(10, 'Seat Selection Issue', 'During booking I selected seat 12A but was assigned seat 14B. Please help resolve.', 'BOOKING', 'MEDIUM', 'OPEN'),
(11, 'Coupon Not Applied', 'I used code HACKERS20 but discount was not applied to my booking. I have screenshot proof.', 'PAYMENT', 'MEDIUM', 'OPEN');

-- ─── SAMPLE AUDIT LOGS ───────────────────────────────────────────────────────
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address) VALUES
(1, 'LOGIN', 'user', '1', '127.0.0.1'),
(8, 'LOGIN', 'user', '8', '192.168.1.105'),
(9, 'BOOKING', 'booking', '1', '192.168.1.110'),
(1, 'ROLE_CHANGE', 'user', '8', '127.0.0.1');
