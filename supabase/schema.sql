-- Rentora Complete Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Safe re-run: drop dependent objects first (order matters for FKs)
DROP POLICY IF EXISTS "Users view own profile" ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone insert profile" ON profiles;
DROP POLICY IF EXISTS "Admins view all" ON profiles;
DROP POLICY IF EXISTS "Admins update any" ON profiles;
DROP POLICY IF EXISTS "Anyone view properties" ON properties;
DROP POLICY IF EXISTS "Landlords insert" ON properties;
DROP POLICY IF EXISTS "Owners/admins update" ON properties;
DROP POLICY IF EXISTS "Owners/admins delete" ON properties;
DROP POLICY IF EXISTS "Anyone view bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone insert booking" ON bookings;
DROP POLICY IF EXISTS "Admins update bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone view messages" ON chat_messages;
DROP POLICY IF EXISTS "Anyone insert messages" ON chat_messages;
DROP POLICY IF EXISTS "Anyone insert" ON visitor_tracking;
DROP POLICY IF EXISTS "Admins view" ON visitor_tracking;
DROP POLICY IF EXISTS "Users manage own saved searches" ON saved_searches;
DROP POLICY IF EXISTS "Anyone view reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone insert reviews" ON reviews;
DROP POLICY IF EXISTS "Admins update reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone view maintenance" ON maintenance_requests;
DROP POLICY IF EXISTS "Anyone insert maintenance" ON maintenance_requests;
DROP POLICY IF EXISTS "Admins update maintenance" ON maintenance_requests;
DROP POLICY IF EXISTS "Landlords update own" ON maintenance_requests;
DROP POLICY IF EXISTS "Users view own referrals" ON referrals;
DROP POLICY IF EXISTS "Users insert referrals" ON referrals;
DROP POLICY IF EXISTS "Users view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone insert payments" ON payments;
DROP POLICY IF EXISTS "Users view own payments" ON payments;
DROP POLICY IF EXISTS "Admins view all payments" ON payments;
DROP POLICY IF EXISTS "Admins update payments" ON payments;
DROP POLICY IF EXISTS "Anyone insert" ON tenant_screenings;
DROP POLICY IF EXISTS "Admin view all" ON tenant_screenings;
DROP POLICY IF EXISTS "Anyone insert leases" ON leases;
DROP POLICY IF EXISTS "Admin view all" ON leases;
DROP POLICY IF EXISTS "Admin update" ON leases;
DROP POLICY IF EXISTS "Anyone insert rent" ON rent_payments;
DROP POLICY IF EXISTS "Admin view all rent" ON rent_payments;

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS generate_referral_code_trigger ON profiles;

DROP INDEX IF EXISTS idx_properties_location;
DROP INDEX IF EXISTS idx_properties_price;
DROP INDEX IF EXISTS idx_properties_type;
DROP INDEX IF EXISTS idx_properties_availability;
DROP INDEX IF EXISTS idx_properties_city;
DROP INDEX IF EXISTS idx_bookings_property;
DROP INDEX IF EXISTS idx_bookings_email;
DROP INDEX IF EXISTS idx_bookings_ref;
DROP INDEX IF EXISTS idx_chat_messages_created;
DROP INDEX IF EXISTS idx_visitor_tracking_id;
DROP INDEX IF EXISTS idx_visitor_tracking_time;
DROP INDEX IF EXISTS idx_profiles_banned;
DROP INDEX IF EXISTS idx_profiles_referral;
DROP INDEX IF EXISTS idx_reviews_property;
DROP INDEX IF EXISTS idx_maintenance_property;
DROP INDEX IF EXISTS idx_notifications_user;
DROP INDEX IF EXISTS idx_saved_searches_user;

-- Drop tables for clean re-run (order respects FK constraints)
DROP TABLE IF EXISTS rent_payments CASCADE;
DROP TABLE IF EXISTS leases CASCADE;
DROP TABLE IF EXISTS tenant_screenings CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS maintenance_requests CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS saved_searches CASCADE;
DROP TABLE IF EXISTS visitor_tracking CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- === PROFILES ===
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'landlord' CHECK (role IN ('landlord', 'admin', 'tenant')),
  banned BOOLEAN DEFAULT FALSE,
  banned_at TIMESTAMPTZ,
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES profiles(id),
  reward_credits DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone insert profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins view all" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins update any" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- === PROPERTIES ===
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  landlord_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('house','apartment','condo','studio','villa')),
  price DECIMAL(10,2) NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  location TEXT NOT NULL,
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  area_sqft INTEGER,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  availability TEXT NOT NULL DEFAULT 'available' CHECK (availability IN ('available','booked')),
  instant_book BOOLEAN DEFAULT FALSE,
  video_tour_url TEXT,
  matterport_embed TEXT,
  neighborhood_score INTEGER,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view properties" ON properties FOR SELECT USING (TRUE);
CREATE POLICY "Landlords insert" ON properties FOR INSERT WITH CHECK (
  auth.uid() = landlord_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Owners/admins update" ON properties FOR UPDATE USING (
  auth.uid() = landlord_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Owners/admins delete" ON properties FOR DELETE USING (
  auth.uid() = landlord_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- === BOOKINGS ===
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) NOT NULL,
  tenant_id UUID REFERENCES profiles(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  move_in_date DATE NOT NULL,
  lease_end_date DATE,
  total_price DECIMAL(10,2) NOT NULL,
  deposit_held DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  booking_reference TEXT NOT NULL UNIQUE,
  payment_intent_id TEXT,
  instant_book BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view bookings" ON bookings FOR SELECT USING (TRUE);
CREATE POLICY "Anyone insert booking" ON bookings FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins update bookings" ON bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- === CHAT MESSAGES ===
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_name TEXT NOT NULL,
  sender_email TEXT,
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view messages" ON chat_messages FOR SELECT USING (TRUE);
CREATE POLICY "Anyone insert messages" ON chat_messages FOR INSERT WITH CHECK (TRUE);

-- === VISITOR TRACKING ===
CREATE TABLE IF NOT EXISTS visitor_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE visitor_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone insert" ON visitor_tracking FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins view" ON visitor_tracking FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- === SAVED SEARCHES ===
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  search_params JSONB NOT NULL,
  email_alerts BOOLEAN DEFAULT TRUE,
  last_alert_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saved searches" ON saved_searches FOR ALL USING (auth.uid() = user_id);

-- === REVIEWS ===
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) NOT NULL,
  user_id UUID REFERENCES profiles(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  blockchain_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view reviews" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Anyone insert reviews" ON reviews FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins update reviews" ON reviews FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- === MAINTENANCE REQUESTS ===
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) NOT NULL,
  tenant_id UUID REFERENCES profiles(id),
  guest_email TEXT,
  issue_description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','emergency')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
  image_urls TEXT[] DEFAULT '{}',
  assigned_contractor TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view maintenance" ON maintenance_requests FOR SELECT USING (TRUE);
CREATE POLICY "Anyone insert maintenance" ON maintenance_requests FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins update maintenance" ON maintenance_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Landlords update own" ON maintenance_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM properties WHERE properties.id = maintenance_requests.property_id AND properties.landlord_id = auth.uid())
);

-- === REFERRALS ===
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID REFERENCES profiles(id) NOT NULL,
  referee_email TEXT NOT NULL,
  referee_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','joined','rewarded','expired')),
  reward_amount DECIMAL(10,2) DEFAULT 0,
  reward_issued BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Users insert referrals" ON referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- === NOTIFICATIONS ===
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL CHECK (type IN ('booking','review','maintenance','referral','alert')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- === PAYMENTS ===
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL DEFAULT 'deposit' CHECK (type IN ('deposit','rent','fee')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  payment_method TEXT CHECK (payment_method IN ('mpesa','paypal','bank_transfer')),
  payment_ref TEXT,
  mpesa_phone TEXT,
  mpesa_receipt TEXT,
  paypal_order_id TEXT,
  bank_account_name TEXT,
  bank_transfer_ref TEXT,
  proof_image_url TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone insert payments" ON payments FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users view own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings WHERE bookings.id = payments.booking_id AND bookings.guest_email = auth.jwt()->>'email')
);
CREATE POLICY "Admins view all payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins update payments" ON payments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- === TENANT SCREENING ===
CREATE TABLE IF NOT EXISTS tenant_screenings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  ssn_last_four TEXT,
  current_address TEXT,
  employer TEXT,
  annual_income DECIMAL(10,2),
  previous_landlord_phone TEXT,
  emergency_contact TEXT,
  screening_status TEXT NOT NULL DEFAULT 'pending' CHECK (screening_status IN ('pending','approved','rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tenant_screenings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone insert" ON tenant_screenings FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin view all" ON tenant_screenings FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- === DIGITAL LEASES ===
CREATE TABLE IF NOT EXISTS leases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  lease_pdf_url TEXT,
  signed_by_landlord BOOLEAN DEFAULT FALSE,
  signed_by_tenant BOOLEAN DEFAULT FALSE,
  landlord_signed_at TIMESTAMPTZ,
  tenant_signed_at TIMESTAMPTZ,
  lease_start_date DATE NOT NULL,
  lease_end_date DATE NOT NULL,
  monthly_rent DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) NOT NULL,
  terms TEXT,
  signature_landlord TEXT,
  signature_tenant TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','signed','active','expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone insert leases" ON leases FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin view all" ON leases FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin update" ON leases FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- === RENT PAYMENTS ===
CREATE TABLE IF NOT EXISTS rent_payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lease_id UUID REFERENCES leases(id) NOT NULL,
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  month DATE NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('mpesa','paypal','bank_transfer')),
  payment_ref TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone insert rent" ON rent_payments FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin view all rent" ON rent_payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- === INDEXES ===
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_availability ON properties(availability);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_bookings_email ON bookings(guest_email);
CREATE INDEX idx_bookings_ref ON bookings(booking_reference);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);
CREATE INDEX idx_visitor_tracking_id ON visitor_tracking(visitor_id);
CREATE INDEX idx_visitor_tracking_time ON visitor_tracking(visited_at);
CREATE INDEX idx_profiles_banned ON profiles(banned);
CREATE INDEX idx_profiles_referral ON profiles(referral_code);
CREATE INDEX idx_reviews_property ON reviews(property_id);
CREATE INDEX idx_maintenance_property ON maintenance_requests(property_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_saved_searches_user ON saved_searches(user_id);

-- === TRIGGERS ===
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate referral code on profile insert
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code = UPPER(SUBSTR(MD5(NEW.id::TEXT || CLOCK_TIMESTAMP()::TEXT), 1, 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_referral_code_trigger
  BEFORE INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION generate_referral_code();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
