-- Rentora Seed Data
-- Run after schema.sql in Supabase SQL Editor
-- DANGER: This generates fake users via Supabase Auth. For local/dev only.

-- ============================================================
-- SAMPLE PROPERTIES (no auth dependency — insert directly)
-- ============================================================
INSERT INTO properties (id, landlord_id, title, description, property_type, price, address, city, state, location, bedrooms, bathrooms, area_sqft, images, amenities, availability, neighborhood_score, featured, is_student_housing, near_campus, university_area)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    NULL,
    'Modern Downtown Apartment',
    'Modern 2-bedroom apartment in Nairobi CBD. Walking distance to restaurants, shops, and public transit. Secure building with 24hr security.',
    'apartment', 45000.00, '123 Moi Ave', 'Nairobi', 'Nairobi', 'Nairobi, Kenya',
    2, 2, 900,
    ARRAY[
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    ARRAY['wifi', 'parking', 'gym', 'laundry', 'air-conditioning', 'security', 'water'],
    'available', 85, TRUE, FALSE, FALSE, NULL
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    NULL,
    'Student Studio - Near UoN',
    'Affordable studio near University of Nairobi. Perfect for students. Fully furnished with WiFi, desk space, and shared kitchen. Walking distance to campus.',
    'studio', 15000.00, '456 State House Rd', 'Nairobi', 'Nairobi', 'Nairobi, Kenya',
    1, 1, 300,
    ARRAY[
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800'
    ],
    ARRAY['wifi', 'furnished', 'study-desk', 'security', 'water', 'electricity'],
    'available', 78, FALSE, TRUE, TRUE, 'University of Nairobi'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    NULL,
    'Family Home - Lavington',
    'Spacious 4-bedroom home in Lavington, secure gated community. Large compound, borehole water, backup generator. Near International School.',
    'house', 120000.00, '789 James Gichuru Rd', 'Nairobi', 'Nairobi', 'Nairobi, Kenya',
    4, 3, 2400,
    ARRAY[
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    ARRAY['wifi', 'parking', 'laundry', 'backyard', 'garage', 'generator', 'borehole', 'security'],
    'available', 92, TRUE, FALSE, FALSE, NULL
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    NULL,
    'Student Hostel - Kenyatta Uni',
    'Safe, clean student hostel near Kenyatta University main gate. Single rooms with shared common area. Meals included option. 24hr security and CCTV.',
    'hostel', 8000.00, '1 KU Rd', 'Nairobi', 'Nairobi', 'Nairobi, Kenya',
    1, 1, 150,
    ARRAY[
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
    ],
    ARRAY['wifi', 'meals-option', 'security', 'cctv', 'water', 'electricity', 'study-room', 'common-room'],
    'available', 88, TRUE, TRUE, TRUE, 'Kenyatta University'
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    NULL,
    'Luxury Condo - Westlands',
    'Sleek 2-bedroom condo in Westlands with rooftop pool, gym, and stunning city views. Open-plan living with modern finishes.',
    'condo', 85000.00, '500 Westlands Rd', 'Nairobi', 'Nairobi', 'Nairobi, Kenya',
    2, 2, 1100,
    ARRAY[
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    ARRAY['wifi', 'parking', 'gym', 'pool', 'doorman', 'laundry', 'air-conditioning', 'generator'],
    'available', 90, TRUE, FALSE, FALSE, NULL
  ),
  (
    '00000000-0000-0000-0000-000000000006',
    NULL,
    'Affordable Bedsitter - Ngara',
    'Clean bedsitter in Ngara area. Close to city center and KU buses. Ideal for students and young professionals. Water and security included.',
    'studio', 10000.00, '321 Ngara Rd', 'Nairobi', 'Nairobi', 'Nairobi, Kenya',
    1, 1, 200,
    ARRAY[
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
    ],
    ARRAY['wifi', 'security', 'water', 'electricity'],
    'available', 72, FALSE, TRUE, TRUE, 'University of Nairobi'
  ),
  (
    '00000000-0000-0000-0000-000000000007',
    NULL,
    'Tech Hub Live-Work Apartment',
    'Industrial-chic live-work apartment in Nairobi Tech Hub. 16-foot ceilings, dedicated office space. Ideal for remote workers and tech entrepreneurs.',
    'apartment', 55000.00, '888 Innovation Way', 'Nairobi', 'Nairobi', 'Nairobi, Kenya',
    1, 1, 800,
    ARRAY[
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'
    ],
    ARRAY['wifi', 'parking', 'gym', 'laundry', 'air-conditioning', 'co-working', 'generator'],
    'available', 88, FALSE, FALSE, FALSE, NULL
  ),
  (
    '00000000-0000-0000-0000-000000000008',
    NULL,
    'Student Bedsitter - JKUAT',
    'Affordable bedsitter 5min walk from JKUAT main campus. Secure compound with gatekeeper. Ideal for university students.',
    'studio', 7000.00, '42 JKUAT Rd', 'Juja', 'Nairobi', 'Juja, Kenya',
    1, 1, 180,
    ARRAY[
      'https://images.unsplash.com/photo-1560185007-c9704361e0f9?w=800',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800'
    ],
    ARRAY['wifi', 'security', 'water', 'electricity', 'furnished'],
    'booked', 75, FALSE, TRUE, TRUE, 'JKUAT'
  ),
  (
    '00000000-0000-0000-0000-000000000009',
    NULL,
    'Shared 3-Bed - Students Only',
    'Spacious 3-bedroom house in Kasarani, ideal for 3 students sharing. Each room has desk and wardrobe. Shared living room, kitchen, and compound.',
    'dorm', 25000.00, '7 Kasarani Rd', 'Nairobi', 'Nairobi', 'Nairobi, Kenya',
    3, 2, 1200,
    ARRAY[
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    ],
    ARRAY['wifi', 'parking', 'furnished', 'security', 'water', 'study-room', 'compound'],
    'available', 82, FALSE, TRUE, TRUE, 'Multiple Universities'
  ),
  (
    '00000000-0000-0000-0000-000000000010',
    NULL,
    'Affordable 1-Bed - Eastlands',
    'Well-maintained 1-bedroom apartment in convenient Eastlands location. Close to public transit, grocery stores, and markets.',
    'apartment', 18000.00, '200 Jogoo Rd', 'Nairobi', 'Nairobi', 'Nairobi, Kenya',
    1, 1, 400,
    ARRAY[
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    ARRAY['wifi', 'laundry', 'security', 'water', 'electricity'],
    'available', 70, FALSE, FALSE, FALSE, NULL
  ),
  (
    '00000000-0000-0000-0000-000000000011',
    NULL,
    'Penthouse - Nairobi Skyline',
    'Breathtaking penthouse with panoramic city views, private terrace, and top-of-the-line finishes. Rooftop pool and lounge access.',
    'condo', 200000.00, '1 Upperhill Dr', 'Nairobi', 'Nairobi', 'Nairobi, Kenya',
    3, 3, 2800,
    ARRAY[
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    ARRAY['wifi', 'parking', 'gym', 'pool', 'doorman', 'concierge', 'laundry', 'air-conditioning', 'generator', 'terrace'],
    'available', 99, TRUE, FALSE, FALSE, NULL
  ),
  (
    '00000000-0000-0000-0000-000000000012',
    NULL,
    'Student Room - Strathmore',
    'Single room in shared student house near Strathmore University. Quiet neighborhood, shared kitchen and bathroom. Ideal for serious students.',
    'dorm', 6000.00, '55 Madaraka Estate', 'Nairobi', 'Nairobi', 'Nairobi, Kenya',
    1, 1, 140,
    ARRAY[
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800'
    ],
    ARRAY['wifi', 'furnished', 'study-desk', 'security', 'water'],
    'available', 65, FALSE, TRUE, TRUE, 'Strathmore University'
  );

-- ============================================================
-- SAMPLE ROOMMATE REQUESTS
-- ============================================================
INSERT INTO roommate_requests (id, property_id, full_name, email, phone, university, budget_min, budget_max, move_in_date, gender_preference, bio, status)
VALUES
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000009',
    'James Kamau', 'james@student.email', '+254 712 345 678',
    'University of Nairobi', 8000.00, 12000.00, '2026-09-01', 'any',
    'Second-year engineering student looking for roommates to share a 3-bedroom. Clean, quiet, focused on studies.',
    'open'
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000009',
    'Mary Wanjiku', 'mary@student.email', '+254 723 456 789',
    'JKUAT', 8000.00, 10000.00, '2026-09-01', 'female',
    'Female student looking for female roommates. Prefer quiet environment for studying. Like cooking together on weekends.',
    'open'
  );

-- ============================================================
-- SAMPLE BOOKINGS
-- ============================================================
INSERT INTO bookings (id, property_id, guest_name, guest_email, guest_phone, move_in_date, total_price, deposit_held, status, booking_reference)
VALUES
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000008',
    'Sarah Johnson', 'sarah@example.com', '+254 712 123 456',
    '2026-07-01', 7000.00, 10500.00, 'confirmed', 'RENTORA-A1B2C3'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000003',
    'Michael Chen', 'michael@example.com', '+254 723 234 567',
    '2026-08-15', 120000.00, 180000.00, 'pending', 'RENTORA-D4E5F6'
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000005',
    'Emily Rodriguez', 'emily@example.com', '+254 734 345 678',
    '2026-09-01', 85000.00, 127500.00, 'confirmed', 'RENTORA-G7H8I9'
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    '00000000-0000-0000-0000-000000000001',
    'David Kim', 'david@example.com', '+254 745 456 789',
    '2026-06-20', 45000.00, 67500.00, 'completed', 'RENTORA-J1K2L3'
  ),
  (
    '00000000-0000-0000-0000-000000000105',
    '00000000-0000-0000-0000-000000000007',
    'Lisa Thompson', 'lisa@example.com', '+254 756 567 890',
    '2026-10-01', 55000.00, 82500.00, 'pending', 'RENTORA-M4N5O6'
  );

-- ============================================================
-- SAMPLE REVIEWS
-- ============================================================
INSERT INTO reviews (property_id, guest_name, rating, comment, is_verified, blockchain_hash)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Alex Turner', 5, 'Great apartment in a prime location. The amenities are top-notch and security is excellent.', TRUE, 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1'),
  ('00000000-0000-0000-0000-000000000001', 'Jordan Lee', 4, 'Beautiful space but parking can be tight. The apartment itself is well-maintained.', TRUE, 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'),
  ('00000000-0000-0000-0000-000000000003', 'Maria Santos', 5, 'Perfect family home! The compound is spacious and the neighborhood is quiet and safe.', TRUE, 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3'),
  ('00000000-0000-0000-0000-000000000004', 'Chris Walker', 5, 'Excellent student hostel. Clean, secure, and very close to campus. Highly recommend!', FALSE, 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4'),
  ('00000000-0000-0000-0000-000000000005', 'Priya Patel', 4, 'Stunning condo with amazing views. The rooftop pool is fantastic. Minor issue with elevator wait times.', TRUE, 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5'),
  ('00000000-0000-0000-0000-000000000009', 'Kevin Ochieng', 5, 'Perfect for students sharing. Each room has privacy, common areas are clean. Great value!', TRUE, 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6');

-- ============================================================
-- SAMPLE MAINTENANCE REQUESTS
-- ============================================================
INSERT INTO maintenance_requests (property_id, guest_email, issue_description, priority, status)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'david@example.com', 'Kitchen sink is leaking. Water pooling under the cabinet.', 'high', 'in_progress'),
  ('00000000-0000-0000-0000-000000000005', 'emily@example.com', 'AC unit is not cooling properly. Temperature stays at 28C.', 'medium', 'open'),
  ('00000000-0000-0000-0000-000000000003', 'michael@example.com', 'Electric gate motor stopped working.', 'low', 'open');

-- ============================================================
-- SAMPLE PAYMENTS
-- ============================================================
INSERT INTO payments (booking_id, amount, type, status, payment_method, payment_ref)
VALUES
  ('00000000-0000-0000-0000-000000000101', 10500.00, 'deposit', 'completed', 'mpesa', 'MPESA-DEMO-ABC123'),
  ('00000000-0000-0000-0000-000000000103', 127500.00, 'deposit', 'completed', 'bank_transfer', 'BANK-TRANSFER-001'),
  ('00000000-0000-0000-0000-000000000104', 67500.00, 'deposit', 'completed', 'mpesa', 'MPESA-DEMO-DEF456'),
  ('00000000-0000-0000-0000-000000000102', 180000.00, 'deposit', 'pending', 'mpesa', 'MPESA-DEMO-GHI789');

-- ============================================================
-- SAMPLE VISITOR TRACKING
-- ============================================================
INSERT INTO visitor_tracking (visitor_id, page_url, referrer, user_agent)
VALUES
  ('visitor-test-1', '/', 'https://google.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0'),
  ('visitor-test-1', '/properties', 'https://rentora.vercel.app/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0'),
  ('visitor-test-1', '/properties/00000000-0000-0000-0000-000000000001', 'https://rentora.vercel.app/properties', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0'),
  ('visitor-test-2', '/', NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile/15E148 Safari/604.1'),
  ('visitor-test-2', '/properties', NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile/15E148 Safari/604.1');
