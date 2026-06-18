-- Rentora Seed Data
-- Run after schema.sql in Supabase SQL Editor
-- DANGER: This generates fake users via Supabase Auth. For local/dev only.

-- Helper: Generate random UUID-like strings for references
-- Note: Real UUIDs come from auth.users. These are for unauthenticated seed data.
-- For a real demo, create users via the app first, then link their profile IDs here.

-- ============================================================
-- SAMPLE PROPERTIES (no auth dependency — insert directly)
-- ============================================================
INSERT INTO properties (id, landlord_id, title, description, property_type, price, address, city, state, location, bedrooms, bathrooms, area_sqft, images, amenities, availability, neighborhood_score, featured)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    NULL,
    'Modern Downtown Loft',
    'Stunning modern loft in the heart of downtown. Floor-to-ceiling windows, exposed brick, and hardwood floors throughout. Walking distance to restaurants, shops, and public transit.',
    'apartment', 2500.00, '123 Main St', 'San Francisco', 'CA', 'San Francisco, CA',
    2, 2, 1200,
    ARRAY[
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    ARRAY['wifi', 'parking', 'gym', 'laundry', 'dishwasher', 'air-conditioning', 'heating'],
    'available', 85, TRUE
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    NULL,
    'Cozy Studio Apartment',
    'Charming studio perfect for young professionals. Recently renovated with modern finishes, quartz countertops, and stainless steel appliances. Pet-friendly building.',
    'studio', 1500.00, '456 Oak Ave', 'Austin', 'TX', 'Austin, TX',
    1, 1, 550,
    ARRAY[
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800'
    ],
    ARRAY['wifi', 'pet-friendly', 'laundry', 'air-conditioning', 'heating'],
    'available', 78, FALSE
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    NULL,
    'Spacious Family Home',
    'Beautiful 4-bedroom home in a quiet suburban neighborhood with a large backyard, deck, and garden. Top-rated school district. Perfect for families.',
    'house', 3800.00, '789 Maple Dr', 'Denver', 'CO', 'Denver, CO',
    4, 3, 2400,
    ARRAY[
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    ARRAY['wifi', 'parking', 'laundry', 'dishwasher', 'backyard', 'garage', 'air-conditioning', 'heating', 'garden'],
    'available', 92, TRUE
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    NULL,
    'Luxury Waterfront Villa',
    'Exquisite waterfront villa with panoramic ocean views. Private pool, outdoor kitchen, and direct beach access. The ultimate luxury rental experience.',
    'villa', 8500.00, '1 Beachfront Rd', 'Miami', 'FL', 'Miami, FL',
    5, 4, 4500,
    ARRAY[
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
    ],
    ARRAY['wifi', 'parking', 'pool', 'gym', 'laundry', 'dishwasher', 'air-conditioning', 'heating', 'beach-access', 'outdoor-kitchen'],
    'available', 97, TRUE
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    NULL,
    'Urban Condo with Skyline View',
    'Sleek 2-bedroom condo on the 35th floor with breathtaking city skyline views. Building amenities include rooftop pool, concierge, and fitness center.',
    'condo', 3200.00, '500 Tower Blvd', 'New York', 'NY', 'New York, NY',
    2, 2, 1100,
    ARRAY[
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    ARRAY['wifi', 'parking', 'gym', 'pool', 'doorman', 'laundry', 'air-conditioning', 'heating'],
    'available', 90, TRUE
  ),
  (
    '00000000-0000-0000-0000-000000000006',
    NULL,
    'Charming Craftsman Bungalow',
    'Restored 1920s craftsman bungalow with original hardwood floors, built-in bookshelves, and a cozy fireplace. Large front porch with swing. Walking distance to downtown.',
    'house', 2200.00, '321 Elm St', 'Portland', 'OR', 'Portland, OR',
    3, 2, 1600,
    ARRAY[
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
    ],
    ARRAY['wifi', 'parking', 'fireplace', 'laundry', 'air-conditioning', 'heating', 'porch'],
    'available', 82, FALSE
  ),
  (
    '00000000-0000-0000-0000-000000000007',
    NULL,
    'Tech Hub Live-Work Loft',
    'Industrial-chic live-work loft in the tech district. 16-foot ceilings, polished concrete floors, and a dedicated office nook. Ideal for remote workers.',
    'apartment', 2800.00, '888 Innovation Way', 'Seattle', 'WA', 'Seattle, WA',
    1, 1, 1000,
    ARRAY[
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'
    ],
    ARRAY['wifi', 'parking', 'gym', 'laundry', 'air-conditioning', 'heating', 'co-working'],
    'available', 88, FALSE
  ),
  (
    '00000000-0000-0000-0000-000000000008',
    NULL,
    'Beachside Studio Retreat',
    'Quiet studio steps from the beach. Perfect for a seasonal getaway or remote work by the ocean. Recently updated with coastal-inspired decor.',
    'studio', 1800.00, '42 Shoreline Ave', 'Santa Monica', 'CA', 'Santa Monica, CA',
    1, 1, 450,
    ARRAY[
      'https://images.unsplash.com/photo-1560185007-c9704361e0f9?w=800',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800'
    ],
    ARRAY['wifi', 'parking', 'air-conditioning', 'beach-access', 'laundry'],
    'booked', 75, FALSE
  ),
  (
    '00000000-0000-0000-0000-000000000009',
    NULL,
    'Mountain View Lodge',
    'Rustic mountain lodge with stunning views of the Rockies. Grand stone fireplace, gourmet kitchen, and hot tub on the deck. Perfect for ski season.',
    'house', 4500.00, '7 Summit Dr', 'Aspen', 'CO', 'Aspen, CO',
    4, 3, 3200,
    ARRAY[
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    ],
    ARRAY['wifi', 'parking', 'fireplace', 'hot-tub', 'laundry', 'dishwasher', 'heating', 'ski-access'],
    'available', 94, TRUE
  ),
  (
    '00000000-0000-0000-0000-000000000010',
    NULL,
    'Affordable Mid-City Apartment',
    'Well-maintained 1-bedroom apartment in a convenient mid-city location. Close to public transit, grocery stores, and parks. Great starter home.',
    'apartment', 1200.00, '200 Central Ave', 'Chicago', 'IL', 'Chicago, IL',
    1, 1, 700,
    ARRAY[
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    ARRAY['wifi', 'laundry', 'air-conditioning', 'heating', 'public-transit'],
    'available', 72, FALSE
  ),
  (
    '00000000-0000-0000-0000-000000000011',
    NULL,
    'Penthouse Suite - NYC',
    'Breathtaking penthouse in Manhattan with panoramic city views, private terrace, and top-of-the-line finishes. Rooftop access with pool and lounge.',
    'condo', 12000.00, '1 Park Ave', 'New York', 'NY', 'New York, NY',
    3, 3, 2800,
    ARRAY[
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    ARRAY['wifi', 'parking', 'gym', 'pool', 'doorman', 'concierge', 'laundry', 'air-conditioning', 'heating', 'terrace'],
    'available', 99, TRUE
  ),
  (
    '00000000-0000-0000-0000-000000000012',
    NULL,
    'Garden Level Studio',
    'Cozy garden-level studio with private entrance and small patio. Quiet neighborhood near university campus. Ideal for students or interns.',
    'studio', 950.00, '55 College Rd', 'Berkeley', 'CA', 'Berkeley, CA',
    1, 1, 400,
    ARRAY[
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800'
    ],
    ARRAY['wifi', 'laundry', 'heating', 'patio'],
    'available', 65, FALSE
  );

-- ============================================================
-- SAMPLE BOOKINGS
-- ============================================================
INSERT INTO bookings (id, property_id, guest_name, guest_email, guest_phone, move_in_date, total_price, deposit_held, status, booking_reference)
VALUES
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000008',
    'Sarah Johnson', 'sarah@example.com', '+1 (555) 123-4567',
    '2026-07-01', 1800.00, 2700.00, 'confirmed', 'RENTORA-A1B2C3'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000003',
    'Michael Chen', 'michael@example.com', '+1 (555) 234-5678',
    '2026-08-15', 3800.00, 5700.00, 'pending', 'RENTORA-D4E5F6'
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000005',
    'Emily Rodriguez', 'emily@example.com', '+1 (555) 345-6789',
    '2026-09-01', 3200.00, 4800.00, 'confirmed', 'RENTORA-G7H8I9'
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    '00000000-0000-0000-0000-000000000001',
    'David Kim', 'david@example.com', '+1 (555) 456-7890',
    '2026-06-20', 2500.00, 3750.00, 'completed', 'RENTORA-J1K2L3'
  ),
  (
    '00000000-0000-0000-0000-000000000105',
    '00000000-0000-0000-0000-000000000007',
    'Lisa Thompson', 'lisa@example.com', '+1 (555) 567-8901',
    '2026-10-01', 2800.00, 4200.00, 'pending', 'RENTORA-M4N5O6'
  );

-- ============================================================
-- SAMPLE REVIEWS
-- ============================================================
INSERT INTO reviews (property_id, guest_name, rating, comment, is_verified, blockchain_hash)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Alex Turner', 5, 'Amazing loft! The location is perfect and the views are stunning. Would definitely recommend.', TRUE, 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1'),
  ('00000000-0000-0000-0000-000000000001', 'Jordan Lee', 4, 'Great space but parking was a bit tricky. The apartment itself is beautiful and well-maintained.', TRUE, 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'),
  ('00000000-0000-0000-0000-000000000003', 'Maria Santos', 5, 'Perfect family home! The backyard is huge and the neighborhood is so quiet and safe.', TRUE, 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3'),
  ('00000000-0000-0000-0000-000000000004', 'Chris Walker', 5, 'Absolutely incredible villa. The ocean views are breathtaking. Worth every penny!', FALSE, 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4'),
  ('00000000-0000-0000-0000-000000000005', 'Priya Patel', 4, 'Stunning views from the 35th floor. The building amenities are top-notch. Only minor issue was elevator wait times.', TRUE, 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5'),
  ('00000000-0000-0000-0000-000000000008', 'Sarah Johnson', 3, 'Great location near the beach but the studio is quite small. Clean and well-equipped though.', TRUE, 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6');

-- ============================================================
-- SAMPLE MAINTENANCE REQUESTS
-- ============================================================
INSERT INTO maintenance_requests (property_id, guest_email, issue_description, priority, status)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'david@example.com', 'Kitchen sink is leaking. Water pooling under the cabinet.', 'high', 'in_progress'),
  ('00000000-0000-0000-0000-000000000005', 'emily@example.com', 'AC unit is not cooling properly. Temperature stays at 78F.', 'medium', 'open'),
  ('00000000-0000-0000-0000-000000000003', 'michael@example.com', 'Garage door opener stopped working.', 'low', 'open');

-- ============================================================
-- SAMPLE PAYMENTS
-- ============================================================
INSERT INTO payments (booking_id, amount, type, status, payment_method, payment_ref)
VALUES
  ('00000000-0000-0000-0000-000000000101', 2700.00, 'deposit', 'completed', 'paypal', 'PAYPAL-DEMO-ABC123'),
  ('00000000-0000-0000-0000-000000000103', 4800.00, 'deposit', 'completed', 'bank_transfer', 'BANK-TRANSFER-001'),
  ('00000000-0000-0000-0000-000000000104', 3750.00, 'deposit', 'completed', 'mpesa', 'MPESA-DEMO-DEF456'),
  ('00000000-0000-0000-0000-000000000102', 5700.00, 'deposit', 'pending', 'mpesa', 'MPESA-DEMO-GHI789');

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

-- SAMPLE NOTIFICATIONS & SAVED SEARCHES omitted for seed data
-- They populate naturally when users interact with the app
