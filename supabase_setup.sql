-- ============================================================
-- TRILOK INFOTECH ADMIN CMS - SUPABASE COMPLETE DATABASE SETUP
-- Single Source of Truth database schema with RLS security
-- ============================================================

-- 1. HERO SETTINGS (single row)
CREATE TABLE IF NOT EXISTS hero_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  heading TEXT DEFAULT 'Building the Future of Software, Cybersecurity & Digital Trust',
  sub_heading TEXT DEFAULT 'Trilok Infotech delivers innovative software solutions, cybersecurity services, networking solutions and digital transformation.',
  cta_primary_text TEXT DEFAULT 'Explore Services',
  cta_primary_url TEXT DEFAULT '#services',
  cta_secondary_text TEXT DEFAULT 'Our Products',
  cta_secondary_url TEXT DEFAULT '#products',
  bg_image_url TEXT DEFAULT '',
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ABOUT SETTINGS (single row)
CREATE TABLE IF NOT EXISTS about_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  heading TEXT DEFAULT 'Why Businesses Choose Trilok',
  content TEXT DEFAULT 'We are a technology-first company dedicated to delivering innovative software, cybersecurity, and digital solutions that empower businesses of all sizes to operate securely and efficiently.',
  paragraphs TEXT DEFAULT '',
  mission TEXT DEFAULT 'To empower enterprises with scalable, secure and high-performance digital solutions.',
  vision TEXT DEFAULT 'To become a globally recognized benchmark in software engineering and cybersecurity innovation.',
  values TEXT DEFAULT 'Transparency, Quality, Client Focus, On-Time Delivery.',
  image_url TEXT DEFAULT '',
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICES
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  short_desc TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  icon_class TEXT DEFAULT 'fa-solid fa-code',
  button_text TEXT DEFAULT 'Learn More',
  button_link TEXT DEFAULT '',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROJECTS (VIEW OUR WORK)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'Websites',
  project_link TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'Flagship Product',
  features TEXT DEFAULT '',
  product_link TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INDUSTRIES
CREATE TABLE IF NOT EXISTS industries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon_class TEXT DEFAULT 'fa-solid fa-industry',
  image_url TEXT DEFAULT '',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CAREERS
CREATE TABLE IF NOT EXISTS careers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_title TEXT NOT NULL,
  department TEXT DEFAULT '',
  location TEXT DEFAULT '',
  employment_type TEXT DEFAULT 'Full Time',
  experience TEXT DEFAULT '',
  salary TEXT DEFAULT 'Competitive',
  description TEXT DEFAULT '',
  requirements TEXT DEFAULT '',
  skills TEXT DEFAULT '',
  application_link TEXT DEFAULT '',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  position_company TEXT DEFAULT '',
  review_message TEXT DEFAULT '',
  profile_image_url TEXT DEFAULT '',
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FAQS
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. GALLERY / MEDIA
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT DEFAULT 'Untitled',
  category TEXT DEFAULT 'General',
  image_url TEXT NOT NULL,
  public_id TEXT DEFAULT '',
  file_size INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CONTACT REQUESTS
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  subject TEXT DEFAULT '',
  message TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. WEBSITE SETTINGS (single row)
CREATE TABLE IF NOT EXISTS website_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT DEFAULT 'Trilok Infotech Private Limited',
  logo_url TEXT DEFAULT 'trilok-logo-light.png',
  contact_number TEXT DEFAULT '+91 8639833447',
  email_address TEXT DEFAULT 'info@trilokinfotech.com',
  business_address TEXT DEFAULT 'Hyderabad, India',
  whatsapp_number TEXT DEFAULT '+918639833447',
  facebook_url TEXT DEFAULT 'https://facebook.com',
  instagram_url TEXT DEFAULT 'https://instagram.com',
  linkedin_url TEXT DEFAULT 'https://linkedin.com',
  youtube_url TEXT DEFAULT 'https://youtube.com',
  footer_content TEXT DEFAULT 'Building Digital Solutions. Driving Growth.',
  copyright_text TEXT DEFAULT '© 2026 Trilok Infotech Private Limited. All Rights Reserved.',
  google_maps_link TEXT DEFAULT '',
  business_hours TEXT DEFAULT 'Mon - Sat: 9:00 AM - 7:00 PM',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SEO SETTINGS (single row)
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meta_title TEXT DEFAULT 'Trilok Infotech Private Limited | Digital Solutions & eSaleAgreement',
  meta_description TEXT DEFAULT 'Trilok Infotech Private Limited delivers website development, mobile apps, custom software, digital marketing, and India flagship eSaleAgreement platform.',
  keywords TEXT DEFAULT 'software development, cybersecurity, digital transformation, eSaleAgreement, cloud solutions',
  og_title TEXT DEFAULT 'Trilok Infotech | Software & Digital Trust',
  og_description TEXT DEFAULT 'Innovative software, mobile apps, and eSaleAgreement platform.',
  og_image_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  robots_settings TEXT DEFAULT 'index, follow',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ADMIN PROFILES
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT DEFAULT 'Admin User',
  email TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. ACTIVITY LOGS
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
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES FOR WEBSITE CONTENT
CREATE POLICY "Public read hero_settings" ON hero_settings FOR SELECT USING (true);
CREATE POLICY "Public read about_settings" ON about_settings FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read industries" ON industries FOR SELECT USING (true);
CREATE POLICY "Public read careers" ON careers FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read website_settings" ON website_settings FOR SELECT USING (true);
CREATE POLICY "Public read seo_settings" ON seo_settings FOR SELECT USING (true);

-- PUBLIC INSERT ONLY POLICY FOR CONTACT REQUESTS (FORM SUBMISSION)
CREATE POLICY "Public insert contact_requests" ON contact_requests FOR INSERT WITH CHECK (true);

-- AUTHENTICATED ADMIN FULL ACCESS POLICIES
CREATE POLICY "Admin full access hero_settings" ON hero_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access about_settings" ON about_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access industries" ON industries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access careers" ON careers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access contact_requests" ON contact_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access website_settings" ON website_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access seo_settings" ON seo_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access admin_profiles" ON admin_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admin full access activity_logs" ON activity_logs FOR ALL USING (auth.role() = 'authenticated');
