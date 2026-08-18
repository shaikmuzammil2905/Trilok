-- ============================================================
-- TRILOK INFOTECH ADMIN CMS - SUPABASE COMPLETE DATABASE SETUP
-- Safe migrations & column additions for all existing tables
-- ============================================================

-- 1. HERO SETTINGS
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

ALTER TABLE hero_settings ADD COLUMN IF NOT EXISTS cta_primary_url TEXT DEFAULT '#services';
ALTER TABLE hero_settings ADD COLUMN IF NOT EXISTS cta_secondary_url TEXT DEFAULT '#products';

-- 2. ABOUT SETTINGS
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

ALTER TABLE about_settings ADD COLUMN IF NOT EXISTS paragraphs TEXT DEFAULT '';
ALTER TABLE about_settings ADD COLUMN IF NOT EXISTS mission TEXT DEFAULT '';
ALTER TABLE about_settings ADD COLUMN IF NOT EXISTS vision TEXT DEFAULT '';
ALTER TABLE about_settings ADD COLUMN IF NOT EXISTS values TEXT DEFAULT '';

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

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS position_company TEXT DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

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

-- 12. WEBSITE SETTINGS
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

ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS footer_content TEXT DEFAULT 'Building Digital Solutions. Driving Growth.';
ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS copyright_text TEXT DEFAULT '© 2026 Trilok Infotech Private Limited. All Rights Reserved.';

-- 13. SEO SETTINGS
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

ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS og_title TEXT DEFAULT 'Trilok Infotech | Software & Digital Trust';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS og_description TEXT DEFAULT '';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS og_image_url TEXT DEFAULT '';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS favicon_url TEXT DEFAULT '';
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS robots_settings TEXT DEFAULT 'index, follow';

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
-- ROW LEVEL SECURITY (RLS) POLICIES
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

-- PUBLIC READ POLICIES
DROP POLICY IF EXISTS "Public read hero_settings" ON hero_settings;
CREATE POLICY "Public read hero_settings" ON hero_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read about_settings" ON about_settings;
CREATE POLICY "Public read about_settings" ON about_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read services" ON services;
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read projects" ON projects;
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read industries" ON industries;
CREATE POLICY "Public read industries" ON industries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read careers" ON careers;
CREATE POLICY "Public read careers" ON careers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read faqs" ON faqs;
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read gallery" ON gallery;
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read website_settings" ON website_settings;
CREATE POLICY "Public read website_settings" ON website_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read seo_settings" ON seo_settings;
CREATE POLICY "Public read seo_settings" ON seo_settings FOR SELECT USING (true);

-- PUBLIC FORM SUBMISSION
DROP POLICY IF EXISTS "Public insert contact_requests" ON contact_requests;
CREATE POLICY "Public insert contact_requests" ON contact_requests FOR INSERT WITH CHECK (true);

-- AUTHENTICATED ADMIN FULL ACCESS
DROP POLICY IF EXISTS "Admin full access hero_settings" ON hero_settings;
CREATE POLICY "Admin full access hero_settings" ON hero_settings FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access about_settings" ON about_settings;
CREATE POLICY "Admin full access about_settings" ON about_settings FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access services" ON services;
CREATE POLICY "Admin full access services" ON services FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access projects" ON projects;
CREATE POLICY "Admin full access projects" ON projects FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access products" ON products;
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access industries" ON industries;
CREATE POLICY "Admin full access industries" ON industries FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access careers" ON careers;
CREATE POLICY "Admin full access careers" ON careers FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access testimonials" ON testimonials;
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access faqs" ON faqs;
CREATE POLICY "Admin full access faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access gallery" ON gallery;
CREATE POLICY "Admin full access gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access contact_requests" ON contact_requests;
CREATE POLICY "Admin full access contact_requests" ON contact_requests FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access website_settings" ON website_settings;
CREATE POLICY "Admin full access website_settings" ON website_settings FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access seo_settings" ON seo_settings;
CREATE POLICY "Admin full access seo_settings" ON seo_settings FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access admin_profiles" ON admin_profiles;
CREATE POLICY "Admin full access admin_profiles" ON admin_profiles FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin full access activity_logs" ON activity_logs;
CREATE POLICY "Admin full access activity_logs" ON activity_logs FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================
INSERT INTO hero_settings (heading, sub_heading, cta_primary_text, cta_secondary_text, is_visible)
VALUES ('Build. Innovate. Grow.', 'Digital solutions that help businesses move faster.', 'Get Free Quote', 'View Our Work', true)
ON CONFLICT DO NOTHING;

INSERT INTO about_settings (heading, content, mission, vision, values, is_visible)
VALUES ('Why Businesses Choose Trilok', 'We are a technology-first company dedicated to delivering innovative software, cybersecurity, and digital solutions that empower businesses of all sizes to operate securely and efficiently in the digital age.', 'To empower enterprises with scalable, secure and high-performance digital solutions.', 'To become a globally recognized benchmark in software engineering and cybersecurity innovation.', 'Transparency, Quality, Client Focus, On-Time Delivery', true)
ON CONFLICT DO NOTHING;

INSERT INTO services (title, description, icon_class, status, display_order)
VALUES 
  ('Website Development', 'Business, eCommerce & custom websites built for high performance and conversions.', 'fa-solid fa-globe', 'active', 1),
  ('Mobile App Development', 'Android & iOS applications engineered with modern cross-platform mobile frameworks.', 'fa-solid fa-mobile-screen-button', 'active', 2),
  ('Custom Software', 'Business automation & web applications tailored to streamline operations and workflows.', 'fa-solid fa-code', 'active', 3),
  ('Digital Marketing', 'SEO, social media & brand growth strategies that drive targeted organic lead acquisition.', 'fa-solid fa-bullhorn', 'active', 4),
  ('Cloud & IT Solutions', 'Hosting, deployment & support guaranteeing high availability, data security, and compliance.', 'fa-solid fa-cloud', 'active', 5)
ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description, category, project_link, image_url, status, display_order)
VALUES 
  ('eSaleAgreement', 'Digital Agreement Platform • Verify • Create • eSign • Secure. Flagship digital sale agreement registration platform.', 'Legal & Corporate', 'https://esaleagreement.com/', 'image copy 9.png', 'active', 1),
  ('Rockers Entertainers', 'Premier event management, live concerts, stage shows, and entertainment booking portal.', 'Media & Entertainment', 'https://www.rockersentertainers.com/', 'image copy 10.png', 'active', 2),
  ('Zenesix Pharmaceuticals', 'Global pharmaceutical product formulation, manufacturing catalog, and distribution corporate site.', 'Healthcare & Pharma', 'https://www.zenesixpharmaceuticals.com/', 'image copy 12.png', 'active', 3),
  ('Shees Steel Doors', 'Modern security steel doors manufacturer catalog and custom door website.', 'Services & Industrial', 'https://www.sheessteeldoors.com/', 'image copy 14.png', 'active', 4),
  ('Almas Indian Cuisine', 'Authentic Indian restaurant portal in Canada with online menu & reservations.', 'E-Commerce & Food', 'https://almasindiancuisine.ca/', 'image copy 15.png', 'active', 5),
  ('IT Bees Global', 'Enterprise software development agency specializing in SaaS products.', 'Services & Industrial', 'https://itbeesglobal.com/', 'image copy 16.png', 'active', 6)
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, category, features, product_link, image_url, status, display_order)
VALUES 
  ('eSaleAgreement Platform', 'Create secure, legally valid and tamper-proof sale agreements in minutes with advanced verification and audit capabilities.', 'Flagship Legal Platform', 'Aadhaar eKYC, Aadhaar eSign, OTP Verification, QR Verification, Audit Trails, Cloud Storage', 'https://esaleagreement.com/', 'image copy 35.png', 'active', 1)
ON CONFLICT DO NOTHING;

INSERT INTO industries (title, description, icon_class, status, display_order)
VALUES 
  ('Retail & E-commerce', 'Custom shopping web apps, payment gateway integrations and inventory automation.', 'fa-solid fa-cart-shopping', 'active', 1),
  ('Education & EdTech', 'Interactive learning management portals, online exam modules and student management.', 'fa-solid fa-graduation-cap', 'active', 2),
  ('Healthcare & HealthTech', 'HIPAA compliant patient portals, appointment scheduling, and telemedicine software.', 'fa-solid fa-heart-pulse', 'active', 3),
  ('Finance & FinTech', 'Secure digital payment gateways, eKYC verification, and financial reporting dashboards.', 'fa-solid fa-landmark', 'active', 4),
  ('Manufacturing & Logistics', 'Supply chain management, real-time tracking systems, and warehouse automation software.', 'fa-solid fa-industry', 'active', 5),
  ('Startups & SMEs', 'Rapid MVP engineering, scalable architecture, and full-stack digital launching.', 'fa-solid fa-rocket', 'active', 6)
ON CONFLICT DO NOTHING;

INSERT INTO careers (job_title, department, location, employment_type, experience, salary, description, status, display_order)
VALUES 
  ('Senior Full Stack Developer', 'Engineering', 'Hyderabad, India (Hybrid)', 'Full Time', '3+ Years', 'Competitive', 'Lead engineering of web and mobile software platforms using React, Node.js, and cloud architectures.', 'active', 1),
  ('Cybersecurity Analyst', 'Security', 'Hyderabad, India (On-site)', 'Full Time', '2+ Years', 'Competitive', 'Perform Vulnerability Assessment & Penetration Testing (VAPT), security audits, and threat monitoring.', 'active', 2),
  ('Cloud & DevOps Engineer', 'Infrastructure', 'Hyderabad, India (Hybrid)', 'Full Time', '2+ Years', 'Competitive', 'Manage cloud hosting infrastructure, CI/CD deployment pipelines, containerization, and monitoring.', 'active', 3)
ON CONFLICT DO NOTHING;

INSERT INTO testimonials (customer_name, review_message, profile_image_url, rating, status, display_order)
VALUES 
  ('Srinivas P', 'Trilok Infotech delivered our corporate website and web platform beyond expectations. Great team, excellent support!', 'trilok-logo-icon.png', 5, 'active', 1),
  ('Rajesh Kumar', 'The eSaleAgreement platform completely transformed our legal documentation process. Aadhaar eKYC and eSign are seamless!', 'trilok-logo-icon.png', 5, 'active', 2),
  ('Anusha Rao', 'Exceptional mobile app development service. Clean code, beautiful UI, and 24/7 technical support from Trilok Infotech.', 'trilok-logo-icon.png', 5, 'active', 3)
ON CONFLICT DO NOTHING;

INSERT INTO faqs (question, answer, status, display_order)
VALUES 
  ('What services does Trilok Infotech Private Limited offer?', 'Trilok Infotech delivers end-to-end digital solutions including Custom Website Development, Mobile App Development (Android & iOS), Custom Software/ERP Automation, Digital Marketing, Cloud Hosting, and India flagship eSaleAgreement digital legal documentation platform.', 'active', 1),
  ('How long does it take to develop a custom website or mobile application?', 'Standard corporate websites take 1 to 2 weeks. Custom web applications, eCommerce systems, and mobile apps typically require 3 to 6 weeks depending on requirements and custom integrations.', 'active', 2),
  ('What is eSaleAgreement and how does it work?', 'eSaleAgreement is Trilok Infotech flagship digital platform designed to create legally valid, tamper-proof sale agreements integrated with Aadhaar eKYC, digital signatures (eSign), OTP validation, and audit tracking.', 'active', 3),
  ('Do you provide post-launch technical maintenance and support?', 'Yes! All Trilok Infotech projects include dedicated post-launch support, regular security updates, server monitoring, and feature upgrades.', 'active', 4)
ON CONFLICT DO NOTHING;

INSERT INTO website_settings (company_name, contact_number, email_address, business_address, whatsapp_number, footer_content, copyright_text)
VALUES ('Trilok Infotech Private Limited', '+91 8639833447', 'info@trilokinfotech.com', 'Hyderabad, India', '+918639833447', 'Building Digital Solutions. Driving Growth.', '© 2026 Trilok Infotech Private Limited. All Rights Reserved.')
ON CONFLICT DO NOTHING;

INSERT INTO seo_settings (meta_title, meta_description, keywords)
VALUES ('Trilok Infotech Private Limited | Digital Solutions & eSaleAgreement', 'Trilok Infotech Private Limited delivers website development, mobile apps, custom software, digital marketing, and India flagship eSaleAgreement platform.', 'software development, cybersecurity, digital transformation, eSaleAgreement, cloud solutions')
ON CONFLICT DO NOTHING;
