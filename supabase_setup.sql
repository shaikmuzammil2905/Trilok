-- ============================================================
-- TRILOK INFOTECH ADMIN CMS - SUPABASE DATABASE SETUP
-- Run this entire script once in your Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. HERO SETTINGS (single row)
-- ============================================================
CREATE TABLE IF NOT EXISTS hero_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  heading TEXT DEFAULT 'Building the Future of Software, Cybersecurity & Digital Trust',
  sub_heading TEXT DEFAULT 'Trilok Infotech delivers innovative software solutions, cybersecurity services, networking solutions and digital transformation.',
  cta_primary_text TEXT DEFAULT 'Explore Services',
  cta_secondary_text TEXT DEFAULT 'Our Products',
  bg_image_url TEXT DEFAULT '',
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default hero row
INSERT INTO hero_settings (heading, sub_heading, cta_primary_text, cta_secondary_text, is_visible)
VALUES (
  'Building the Future of Software, Cybersecurity & Digital Trust',
  'Trilok Infotech Private Limited delivers innovative software solutions, cybersecurity services, networking solutions and digital transformation services to help businesses grow securely and sustainably.',
  'Explore Services',
  'Our Products',
  true
) ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. ABOUT SETTINGS (single row)
-- ============================================================
CREATE TABLE IF NOT EXISTS about_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  heading TEXT DEFAULT 'About Trilok Infotech',
  content TEXT DEFAULT 'We are a technology company dedicated to delivering innovative solutions.',
  image_url TEXT DEFAULT '',
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO about_settings (heading, content, is_visible)
VALUES (
  'About Trilok Infotech',
  'We are a technology-first company dedicated to delivering innovative software, cybersecurity, and digital solutions that empower businesses of all sizes to operate securely and efficiently in the digital age.',
  true
) ON CONFLICT DO NOTHING;

-- ============================================================
-- 3. SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  icon_class TEXT DEFAULT 'fa-solid fa-code',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. FEATURES
-- ============================================================
CREATE TABLE IF NOT EXISTS features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon_class TEXT DEFAULT 'fa-solid fa-star',
  image_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  profile_image_url TEXT DEFAULT '',
  review_message TEXT DEFAULT '',
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. FAQS
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. GALLERY / MEDIA
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT DEFAULT 'Untitled',
  image_url TEXT NOT NULL,
  public_id TEXT DEFAULT '',
  file_size INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. CONTACT REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  message TEXT DEFAULT '',
  subject TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. WEBSITE SETTINGS (single row)
-- ============================================================
CREATE TABLE IF NOT EXISTS website_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT DEFAULT 'Trilok Infotech Private Limited',
  logo_url TEXT DEFAULT '',
  contact_number TEXT DEFAULT '',
  email_address TEXT DEFAULT '',
  business_address TEXT DEFAULT '',
  facebook_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  whatsapp_number TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO website_settings (company_name, contact_number, email_address)
VALUES ('Trilok Infotech Private Limited', '+91 8639833447', 'contact@trilokinfotech.com')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 10. SEO SETTINGS (single row)
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meta_title TEXT DEFAULT 'Trilok Infotech Private Limited | Software, Cybersecurity & Digital Trust',
  meta_description TEXT DEFAULT 'Trilok Infotech delivers innovative software solutions, cybersecurity services, networking, cloud solutions, and digital transformation.',
  keywords TEXT DEFAULT 'software development, cybersecurity, digital transformation, cloud solutions, networking',
  og_image_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO seo_settings (meta_title, meta_description)
VALUES (
  'Trilok Infotech Private Limited | Software, Cybersecurity & Digital Trust',
  'Trilok Infotech delivers innovative software solutions, cybersecurity services, networking, cloud solutions, and digital transformation services.'
) ON CONFLICT DO NOTHING;

-- ============================================================
-- 11. ADMIN PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT DEFAULT 'Admin User',
  email TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. ACTIVITY LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT DEFAULT '',
  entity_name TEXT DEFAULT '',
  details TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES: Public READ for website content
-- ============================================================
CREATE POLICY "Public read hero_settings" ON hero_settings FOR SELECT USING (true);
CREATE POLICY "Public read about_settings" ON about_settings FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read features" ON features FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read website_settings" ON website_settings FOR SELECT USING (true);
CREATE POLICY "Public read seo_settings" ON seo_settings FOR SELECT USING (true);

-- Contact requests: anyone can INSERT (from website form)
CREATE POLICY "Public insert contact_requests" ON contact_requests FOR INSERT WITH CHECK (true);

-- ============================================================
-- RLS POLICIES: Authenticated admin FULL ACCESS
-- ============================================================
CREATE POLICY "Admin full access hero_settings" ON hero_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access about_settings" ON about_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access features" ON features FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access contact_requests" ON contact_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access website_settings" ON website_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access seo_settings" ON seo_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access admin_profiles" ON admin_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admin full access activity_logs" ON activity_logs FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hero_settings_updated_at BEFORE UPDATE ON hero_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_settings_updated_at BEFORE UPDATE ON about_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_features_updated_at BEFORE UPDATE ON features FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_website_settings_updated_at BEFORE UPDATE ON website_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON seo_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON admin_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- AUTO CREATE ADMIN PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Admin User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- DONE! Tables created successfully.
-- Next step: Go to Supabase > Authentication > Users > Add User
-- Create: admin@trilokinfotech.com / Admin@Trilok2024
-- ============================================================
