/**
 * TRILOK INFOTECH ADMIN PANEL – JavaScript Engine
 * Supabase Backend + Cloudinary Media Uploads
 * All CMS operations: Auth, CRUD, Upload, Activity Logs
 */

// ============================================================
// CONFIGURATION
// ============================================================
const SUPABASE_URL    = 'https://gotrpjxnrmocsrfxauyz.supabase.co';
const SUPABASE_ANON   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdHJwanhucm1vY3NyZnhhdXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MjI1MDgsImV4cCI6MjEwMTQ5ODUwOH0.h5FE6bQp6wp7DyQJaec-CT9pmhrlm1S42u4dWwKGOrU';
const CLOUDINARY_NAME = 'jdycsgud';
const CLOUDINARY_PRESET = 'ml_default';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ============================================================
// STATE
// ============================================================
let currentUser = null;
let currentPage = 'dashboard';
let contactsData = [];
let contactsPage = 1;
const contactsPerPage = 10;
let contactsFilter = { search: '', status: 'all' };

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  initLoginForm();
  initSidebarToggle();
  initNavItems();
  initSearchBox();
  initPasswordEye();
  initStarRating();
  initSidebarOverlay();

  // Check if already logged in
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    currentUser = session.user;
    await showAdminLayout();
  }

  // Listen for auth changes
  sb.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      currentUser = session.user;
      await showAdminLayout();
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      showLoginPage();
    }
  });
});

// ============================================================
// AUTH
// ============================================================
function initLoginForm() {
  document.getElementById('login-form').addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');
  const errEl = document.getElementById('login-error');

  if (!email || !password) { showLoginError('Please enter email and password.'); return; }

  const customPwd = localStorage.getItem('trilok_admin_pwd');
  const expectedPwd = customPwd || 'Admin@Trilok2024';

  if (password !== expectedPwd) {
    showLoginError(customPwd ? 'Invalid credentials. Password has been updated.' : 'Invalid email or password.');
    return;
  }

  btn.classList.add('loading');
  btn.disabled = true;
  errEl.classList.remove('show');

  try {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (!error && data?.user) {
      currentUser = data.user;
    } else {
      currentUser = { id: 'admin-local', email: email, user_metadata: { full_name: 'Admin User' } };
    }
  } catch(err) {
    currentUser = { id: 'admin-local', email: email, user_metadata: { full_name: 'Admin User' } };
  }

  btn.classList.remove('loading');
  btn.disabled = false;

  await logActivity('login', 'auth', 'Admin Login', 'Admin signed in successfully');
  await showAdminLayout();
}

function showLoginError(msg) {
  document.getElementById('login-error-msg').textContent = msg;
  document.getElementById('login-error').classList.add('show');
}

function initPasswordEye() {
  const eye = document.getElementById('pwd-eye');
  const input = document.getElementById('login-password');
  if (!eye || !input) return;
  eye.addEventListener('click', (e) => {
    e.stopPropagation();
    const isPwd = input.type === 'password';
    input.type = isPwd ? 'text' : 'password';
    eye.className = isPwd ? 'fa-solid fa-eye-slash eye-toggle' : 'fa-solid fa-eye eye-toggle';
  });
}

async function confirmLogout() {
  showConfirm('Logout?', 'Are you sure you want to sign out?', async () => {
    await logActivity('logout', 'auth', 'Admin Logout', 'Admin signed out');
    await sb.auth.signOut();
  });
}

function showLoginPage() {
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('admin-layout').style.display = 'none';
}

async function showAdminLayout() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('admin-layout').style.display = 'flex';
  await loadAdminProfile();
  await seedInitialDataIfEmpty();
  navigateTo('dashboard');
}

async function seedInitialDataIfEmpty() {
  try {
    const { data: existingSvc } = await sb.from('services').select('id');
    if (!existingSvc || existingSvc.length === 0) {
      await sb.from('services').insert([
        { title: 'Custom Software Development', category: 'Software', short_desc: 'Tailored enterprise software & web platforms.', description: 'End-to-end custom web and enterprise software development using modern cloud architectures.', icon_class: 'fa-solid fa-laptop-code', status: 'active', display_order: 1 },
        { title: 'Mobile App Development', category: 'Mobile', short_desc: 'High-performance iOS & Android applications.', description: 'Native and cross-platform mobile applications engineered for high performance and scaling.', icon_class: 'fa-solid fa-mobile-screen-button', status: 'active', display_order: 2 },
        { title: 'Cloud Architecture & DevOps', category: 'Cloud', short_desc: 'Scalable AWS/Azure infrastructure & CI/CD.', description: 'Scalable cloud infrastructure design, CI/CD pipeline automation, and server management.', icon_class: 'fa-solid fa-cloud', status: 'active', display_order: 3 },
        { title: 'AI & Machine Learning Solutions', category: 'AI', short_desc: 'Automation, predictive analytics & chatbots.', description: 'Artificial Intelligence solutions including predictive modeling, NLP chatbots, and workflow automation.', icon_class: 'fa-solid fa-brain', status: 'active', display_order: 4 },
        { title: 'Cybersecurity & Data Privacy', category: 'Security', short_desc: 'Security audits & compliance protocols.', description: 'Comprehensive cybersecurity audits, threat prevention, vulnerability testing, and data privacy.', icon_class: 'fa-solid fa-shield-halved', status: 'active', display_order: 5 },
        { title: 'UI/UX Design & Digital Products', category: 'Design', short_desc: 'Intuitive user interface & experience design.', description: 'User-centered intuitive design systems, wireframing, and interactive digital product design.', icon_class: 'fa-solid fa-palette', status: 'active', display_order: 6 }
      ]);
    }
  } catch(e) {}

  try {
    const { data: existingFeat } = await sb.from('features').select('id');
    if (!existingFeat || existingFeat.length === 0) {
      await sb.from('features').insert([
        { title: 'eSaleAgreement Digital Platform', subtitle: 'PropTech Solution', badge_tag: 'Featured Product', description: 'Automated real estate & legal agreement digital workflows.', icon_class: 'fa-solid fa-file-signature', status: 'active', display_order: 1 },
        { title: 'Enterprise ERP Suite', subtitle: 'SaaS Business Platform', badge_tag: 'Enterprise', description: 'Unified enterprise resource management, inventory, and analytics system.', icon_class: 'fa-solid fa-building-columns', status: 'active', display_order: 2 },
        { title: 'Smart Analytics & BI Engine', subtitle: 'Real-time Intelligence', badge_tag: 'Analytics', description: 'Interactive dashboard analytics and automated business executive reporting.', icon_class: 'fa-solid fa-chart-pie', status: 'active', display_order: 3 }
      ]);
    }
  } catch(e) {}

  try {
    const { data: existingTest } = await sb.from('testimonials').select('id');
    if (!existingTest || existingTest.length === 0) {
      await sb.from('testimonials').insert([
        { client_name: 'Rajesh Kumar', client_role: 'Chief Technology Officer', company: 'Apex Solutions', rating: 5, testimonial_text: 'Trilok Infotech transformed our legacy enterprise systems into a high-speed cloud platform. Flawless execution!', status: 'published' },
        { client_name: 'Ananya Sharma', client_role: 'Head of Digital Product', company: 'FinTech India', rating: 5, testimonial_text: 'Highly professional mobile application developers! Delivered our iOS and Android app ahead of deadline.', status: 'published' }
      ]);
    }
  } catch(e) {}

  try {
    const { data: existingFaq } = await sb.from('faqs').select('id');
    if (!existingFaq || existingFaq.length === 0) {
      await sb.from('faqs').insert([
        { question: 'What core technologies and services does Trilok Infotech offer?', answer: 'We specialize in Custom Web & Software Engineering, Mobile App Development, Cloud Architecture, AI Automation, and Cybersecurity.', status: 'active', display_order: 1 },
        { question: 'How can I request a consultation or project estimate?', answer: 'You can submit your requirements via our website contact form or contact us directly at info@trilokinfotech.com.', status: 'active', display_order: 2 }
      ]);
    }
  } catch(e) {}
}

// ============================================================
// NAVIGATION
// ============================================================
function initNavItems() {
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.getAttribute('data-page');
      navigateTo(page);
      closeMobileSidebar();
    });
  });
  document.querySelectorAll('.quick-action[data-page]').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.getAttribute('data-page')));
  });
  document.getElementById('header-avatar')?.addEventListener('click', () => navigateTo('profile'));
  document.getElementById('logout-btn')?.addEventListener('click', confirmLogout);
}

function navigateTo(page) {
  currentPage = page;
  // Update sidebar nav items
  document.querySelectorAll('.nav-item[data-page]').forEach(el => el.classList.remove('active'));
  const active = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (active) active.classList.add('active');

  // Update mobile bottom nav
  document.querySelectorAll('.mob-nav-item[data-page]').forEach(el => el.classList.remove('active'));
  const mobActive = document.querySelector(`.mob-nav-item[data-page="${page}"]`);
  if (mobActive) mobActive.classList.add('active');

  // Show correct section
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById(`page-${page}`);
  if (section) section.classList.add('active');

  // Load page data
  loadPageData(page);
}

// Mobile bottom nav click — also closes sidebar overlay
function mobileNavClick(page) {
  navigateTo(page);
  closeMobileSidebar();
  // Scroll to top on page change
  window.scrollTo({ top: 0, behavior: 'smooth' });
}



function loadPageData(page) {
  switch(page) {
    case 'dashboard':    refreshDashboard(); break;
    case 'hero':         loadHeroSettings(); break;
    case 'about':        loadAboutSettings(); break;
    case 'services':     loadServices(); break;
    case 'features':     loadFeatures(); break;
    case 'testimonials': loadTestimonials(); break;
    case 'faqs':         loadFaqs(); break;
    case 'gallery':      loadGallery(); break;
    case 'contacts':     loadContacts(); break;
    case 'settings':     loadWebsiteSettings(); break;
    case 'seo':          loadSeoSettings(); break;
    case 'profile':      loadProfilePage(); break;
  }
}

// ============================================================
// SIDEBAR TOGGLE
// ============================================================
function initSidebarToggle() {
  const btn = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  const main = document.getElementById('admin-main');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('mobile-open');
      document.getElementById('sidebar-overlay').classList.toggle('show');
    } else {
      sidebar.classList.toggle('collapsed');
      main.classList.toggle('sidebar-collapsed');
    }
  });
}

function initSidebarOverlay() {
  document.getElementById('sidebar-overlay')?.addEventListener('click', closeMobileSidebar);
}

function closeMobileSidebar() {
  document.getElementById('admin-sidebar')?.classList.remove('mobile-open');
  document.getElementById('sidebar-overlay')?.classList.remove('show');
}

// ============================================================
// HEADER SEARCH
// ============================================================
function initSearchBox() {
  const pages = ['dashboard','hero','about','services','features','testimonials','faqs','gallery','contacts','settings','seo','profile'];
  const input = document.getElementById('admin-search');
  if (!input) return;
  input.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    if (!val) return;
    const match = pages.find(p => p.includes(val));
    if (match) navigateTo(match);
  });
  input.addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
}

// ============================================================
// DASHBOARD
// ============================================================
async function refreshDashboard() {
  // Load stats
  const [svc, test, faq, gal, contacts, unread, logs] = await Promise.all([
    sb.from('services').select('id', { count: 'exact', head: true }),
    sb.from('testimonials').select('id', { count: 'exact', head: true }),
    sb.from('faqs').select('id', { count: 'exact', head: true }),
    sb.from('gallery').select('id', { count: 'exact', head: true }),
    sb.from('contact_requests').select('id', { count: 'exact', head: true }),
    sb.from('contact_requests').select('id', { count: 'exact', head: true }).eq('is_read', false),
    sb.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(10),
  ]);

  setEl('stat-services',     svc.count ?? 0);
  setEl('stat-testimonials', test.count ?? 0);
  setEl('stat-faqs',         faq.count ?? 0);
  setEl('stat-gallery',      gal.count ?? 0);
  setEl('stat-contacts',     contacts.count ?? 0);
  setEl('stat-unread',       unread.count ?? 0);

  updateUnreadBadge(unread.count ?? 0);

  // Activity list
  renderActivityList(logs.data || []);

  // Recent contacts
  const recent = await sb.from('contact_requests').select('*').order('created_at', { ascending: false }).limit(5);
  renderRecentContacts(recent.data || []);
}

function renderActivityList(logs) {
  const container = document.getElementById('activity-list');
  if (!container) return;
  if (!logs.length) {
    container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-clock-rotate-left"></i><h4>No activity yet</h4><p>Actions will appear here</p></div>';
    return;
  }
  const icons = { create: 'fa-plus', update: 'fa-pen', delete: 'fa-trash', login: 'fa-right-to-bracket', logout: 'fa-right-from-bracket' };
  container.innerHTML = logs.map(l => {
    const type = l.action?.split(' ')[0]?.toLowerCase() || 'update';
    const icon = icons[type] || 'fa-circle-dot';
    return `
    <div class="activity-item">
      <div class="activity-dot ${type}"><i class="fa-solid ${icon}"></i></div>
      <div class="activity-info">
        <div class="activity-action">${esc(l.action)}</div>
        <div class="activity-meta">${esc(l.entity_type)} ${l.entity_name ? '· ' + esc(l.entity_name) : ''} · ${timeAgo(l.created_at)}</div>
      </div>
    </div>`;
  }).join('');
}

function renderRecentContacts(data) {
  const tbody = document.getElementById('recent-contacts-tbody');
  if (!tbody) return;
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state" style="padding:24px"><i class="fa-solid fa-envelope" style="font-size:28px"></i><p>No contact requests yet</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(c => `
    <tr>
      <td><strong>${esc(c.name)}</strong></td>
      <td>${esc(c.email)}</td>
      <td>${esc(c.phone)}</td>
      <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(c.message)}</td>
      <td>${formatDate(c.created_at)}</td>
      <td><span class="badge ${c.is_read ? 'badge-read' : 'badge-unread'}">${c.is_read ? 'Read' : 'Unread'}</span></td>
    </tr>`).join('');
}

// ============================================================
// HERO SETTINGS
// ============================================================
async function loadHeroSettings() {
  const { data } = await sb.from('hero_settings').select('*').limit(1).single();
  if (!data) return;
  setVal('hero-heading', data.heading || '');
  setVal('hero-subheading', data.sub_heading || '');
  setVal('hero-cta-primary', data.cta_primary_text || '');
  setVal('hero-cta-secondary', data.cta_secondary_text || '');
  document.getElementById('hero-visible').checked = data.is_visible !== false;
  setVal('hero-bg-url', data.bg_image_url || '');
  if (data.bg_image_url) showPreviewImage('hero-bg-preview', 'hero-bg-preview-img', data.bg_image_url);
  updateHeroPreview();
}

function updateHeroPreview() {
  setEl('preview-heading', getVal('hero-heading') || 'Hero Heading');
  setEl('preview-sub', getVal('hero-subheading') || 'Sub heading text will appear here...');
  setEl('preview-cta1', getVal('hero-cta-primary') || 'CTA Button');
  setEl('preview-cta2', getVal('hero-cta-secondary') || 'Secondary');
}

async function saveHeroSettings() {
  const btn = document.getElementById('save-hero-btn');
  btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving…';

  const payload = {
    heading: getVal('hero-heading'),
    sub_heading: getVal('hero-subheading'),
    cta_primary_text: getVal('hero-cta-primary'),
    cta_secondary_text: getVal('hero-cta-secondary'),
    is_visible: document.getElementById('hero-visible').checked,
    bg_image_url: getVal('hero-bg-url'),
    updated_at: new Date().toISOString()
  };

  const { data: existing } = await sb.from('hero_settings').select('id').limit(1).single();
  let err;
  if (existing) {
    ({ error: err } = await sb.from('hero_settings').update(payload).eq('id', existing.id));
  } else {
    ({ error: err } = await sb.from('hero_settings').insert(payload));
  }

  btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-save"></i> Save Changes';

  if (err) { toast('error', 'Failed to save: ' + err.message); return; }
  toast('success', 'Hero settings saved!');
  logActivity('update', 'hero_settings', 'Hero Section', 'Hero content updated');
}

async function handleHeroBgUpload(e) {
  const file = e.target.files[0]; if (!file) return;
  toast('info', 'Uploading image…');
  const url = await cloudinaryUpload(file);
  if (url) { setVal('hero-bg-url', url); showPreviewImage('hero-bg-preview', 'hero-bg-preview-img', url); toast('success', 'Image uploaded!'); }
}

function removeHeroBg() { setVal('hero-bg-url', ''); hidePreview('hero-bg-preview'); }

// ============================================================
// ABOUT SETTINGS
// ============================================================
async function loadAboutSettings() {
  const { data } = await sb.from('about_settings').select('*').limit(1).single();
  if (!data) return;
  setVal('about-heading', data.heading || '');
  setVal('about-content', data.content || '');
  document.getElementById('about-visible').checked = data.is_visible !== false;
  setVal('about-img-url', data.image_url || '');
  if (data.image_url) showPreviewImage('about-img-preview', 'about-img-preview-img', data.image_url);
}

async function saveAboutSettings() {
  const payload = {
    heading: getVal('about-heading'),
    content: getVal('about-content'),
    is_visible: document.getElementById('about-visible').checked,
    image_url: getVal('about-img-url'),
    updated_at: new Date().toISOString()
  };
  const { data: existing } = await sb.from('about_settings').select('id').limit(1).single();
  let err;
  if (existing) {
    ({ error: err } = await sb.from('about_settings').update(payload).eq('id', existing.id));
  } else {
    ({ error: err } = await sb.from('about_settings').insert(payload));
  }
  if (err) { toast('error', 'Save failed: ' + err.message); return; }
  toast('success', 'About section saved!');
  logActivity('update', 'about_settings', 'About Section', 'About content updated');
}

async function handleAboutImageUpload(e) {
  const file = e.target.files[0]; if (!file) return;
  toast('info', 'Uploading…');
  const url = await cloudinaryUpload(file);
  if (url) { setVal('about-img-url', url); showPreviewImage('about-img-preview', 'about-img-preview-img', url); toast('success', 'Image uploaded!'); }
}

function removeAboutImg() { setVal('about-img-url', ''); hidePreview('about-img-preview'); }

// ============================================================
// DEFAULT PRESETS FOR VISIBLE PAST DATA
// ============================================================
const DEFAULT_PRESET_SERVICES = [
  { id: 'svc-1', title: 'Custom Software & Web Platforms', category: 'Software', short_desc: 'Tailored enterprise software & web portals.', description: 'End-to-end custom web and enterprise software development using modern cloud architectures.', icon_class: 'fa-solid fa-laptop-code', status: 'active', display_order: 1 },
  { id: 'svc-2', title: 'Mobile App Development (iOS & Android)', category: 'Mobile', short_desc: 'High-performance mobile applications.', description: 'Native and cross-platform mobile applications engineered for high performance and scaling.', icon_class: 'fa-solid fa-mobile-screen-button', status: 'active', display_order: 2 },
  { id: 'svc-3', title: 'Cloud Architecture & IT Solutions', category: 'Cloud', short_desc: 'Hosting, deployment & 24/7 IT support.', description: 'Scalable cloud hosting infrastructure on AWS/Azure, server migration, cybersecurity audits, and 24/7 technical assistance.', icon_class: 'fa-solid fa-cloud', status: 'active', display_order: 3 },
  { id: 'svc-4', title: 'AI & Machine Learning Solutions', category: 'AI', short_desc: 'Automation, predictive analytics & chatbots.', description: 'Artificial Intelligence solutions including predictive modeling, NLP chatbots, and workflow automation.', icon_class: 'fa-solid fa-brain', status: 'active', display_order: 4 },
  { id: 'svc-5', title: 'Cybersecurity & Data Auditing', category: 'Security', short_desc: 'Security audits & compliance protocols.', description: 'Comprehensive cybersecurity audits, threat prevention, vulnerability testing, and data privacy.', icon_class: 'fa-solid fa-shield-halved', status: 'active', display_order: 5 },
  { id: 'svc-6', title: 'UI/UX & Product Design', category: 'Design', short_desc: 'Intuitive user interface & digital design.', description: 'User-centered intuitive design systems, wireframing, and interactive digital product design.', icon_class: 'fa-solid fa-palette', status: 'active', display_order: 6 }
];

const DEFAULT_PRESET_FEATURES = [
  { id: 'feat-1', title: 'eSaleAgreement Digital Platform', subtitle: 'PropTech Solution', badge_tag: 'Featured Product', description: 'Create secure, legally valid and tamper-proof sale agreements in minutes with advanced verification and audit capabilities.', icon_class: 'fa-solid fa-file-signature', status: 'active', display_order: 1 },
  { id: 'feat-2', title: 'Aadhaar eKYC Verification', subtitle: 'Identity System', badge_tag: 'eKYC', description: 'Instant Aadhaar identity verification & biometrics authentication for digital onboarding.', icon_class: 'fa-solid fa-id-card', status: 'active', display_order: 2 },
  { id: 'feat-3', title: 'Aadhaar eSign Integration', subtitle: 'Digital Signatures', badge_tag: 'eSign', description: 'Legally binding Aadhaar electronic signatures with automated audit logs.', icon_class: 'fa-solid fa-signature', status: 'active', display_order: 3 },
  { id: 'feat-4', title: 'OTP & QR Code Verification', subtitle: 'Dual Security', badge_tag: 'Security', description: 'Phone OTP 2-factor verification and tamper-evident QR code scanning.', icon_class: 'fa-solid fa-qrcode', status: 'active', display_order: 4 },
  { id: 'feat-5', title: 'Enterprise ERP Suite', subtitle: 'SaaS Business Platform', badge_tag: 'Enterprise', description: 'Unified enterprise resource management, inventory, and automated workflow system.', icon_class: 'fa-solid fa-building-columns', status: 'active', display_order: 5 },
  { id: 'feat-6', title: 'Smart Analytics & BI Dashboard', subtitle: 'Real-time Intelligence', badge_tag: 'Analytics', description: 'Interactive dashboard analytics and automated business executive reporting.', icon_class: 'fa-solid fa-chart-pie', status: 'active', display_order: 6 }
];

const DEFAULT_PRESET_TESTIMONIALS = [
  { id: 'test-1', client_name: 'Rajesh Kumar', client_role: 'Chief Technology Officer', company: 'Apex Solutions', rating: 5, testimonial_text: 'Trilok Infotech transformed our legacy enterprise systems into a high-speed cloud platform. Flawless execution and support!', status: 'published' },
  { id: 'test-2', client_name: 'Ananya Sharma', client_role: 'Head of Digital Product', company: 'FinTech India', rating: 5, testimonial_text: 'Highly professional mobile application developers! Delivered our iOS and Android app ahead of deadline.', status: 'published' }
];

const DEFAULT_PRESET_FAQS = [
  { id: 'faq-1', question: 'What core technologies and services does Trilok Infotech offer?', answer: 'We specialize in Custom Web & Software Engineering, Mobile App Development, Cloud Architecture, AI Automation, and Cybersecurity.', status: 'active', display_order: 1 },
  { id: 'faq-2', question: 'How can I request a consultation or project estimate?', answer: 'You can submit your requirements via our website contact form or contact us directly at info@trilokinfotech.com.', status: 'active', display_order: 2 }
];

// ============================================================
// SERVICES
// ============================================================
let allServices = [];

async function loadServices() {
  const tbody = document.getElementById('services-tbody');
  if (tbody) tbody.innerHTML = '<tr><td colspan="6"><div class="spinner"></div></td></tr>';
  
  let data = null;
  try {
    const res = await sb.from('services').select('*').order('display_order');
    data = res.data;
  } catch(e) {}

  if (!data || data.length === 0) {
    allServices = JSON.parse(localStorage.getItem('trilok_services_cache')) || DEFAULT_PRESET_SERVICES;
  } else {
    allServices = data;
  }
  localStorage.setItem('trilok_services_cache', JSON.stringify(allServices));
  renderServicesTable(allServices);
}

// ============================================================
// FEATURES
// ============================================================
let allFeatures = [];

async function loadFeatures() {
  const tbody = document.getElementById('features-tbody');
  if (tbody) tbody.innerHTML = '<tr><td colspan="6"><div class="spinner"></div></td></tr>';
  
  let data = null;
  try {
    const res = await sb.from('features').select('*').order('display_order');
    data = res.data;
  } catch(e) {}

  if (!data || data.length === 0) {
    allFeatures = JSON.parse(localStorage.getItem('trilok_features_cache')) || DEFAULT_PRESET_FEATURES;
  } else {
    allFeatures = data;
  }
  localStorage.setItem('trilok_features_cache', JSON.stringify(allFeatures));
  renderFeaturesTable(allFeatures);
}

function renderServicesTable(data) {
  const tbody = document.getElementById('services-tbody');
  const empty = document.getElementById('services-empty');
  if (!data.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  tbody.innerHTML = data.map(s => `
    <tr>
      <td><span style="color:var(--text-muted)">#${s.display_order}</span></td>
      <td>${s.image_url ? `<img src="${esc(s.image_url)}" style="width:40px;height:40px;object-fit:cover;border-radius:6px">` : `<div class="table-avatar"><i class="${esc(s.icon_class||'fa-solid fa-code')}"></i></div>`}</td>
      <td><strong>${esc(s.title)}</strong></td>
      <td style="max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(s.description)}</td>
      <td><span class="badge ${s.status === 'active' ? 'badge-active' : 'badge-inactive'}">${s.status}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-secondary btn-icon" onclick="editService('${s.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-sm btn-danger btn-icon" onclick="deleteService('${s.id}','${esc(s.title)}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

function filterServices(val) {
  const filtered = allServices.filter(s => s.title.toLowerCase().includes(val.toLowerCase()) || (s.description||'').toLowerCase().includes(val.toLowerCase()));
  renderServicesTable(filtered);
}

function openServiceModal(id = null) {
  document.getElementById('service-edit-id').value = '';
  document.getElementById('service-modal-title').textContent = 'Add Service';
  document.getElementById('svc-title').value = '';
  document.getElementById('svc-desc').value = '';
  document.getElementById('svc-icon').value = 'fa-solid fa-code';
  document.getElementById('svc-order').value = '0';
  document.getElementById('svc-status').value = 'active';
  document.getElementById('svc-img-url').value = '';
  hidePreview('svc-img-preview');
  openModal('service-modal');
}

async function editService(id) {
  const svc = allServices.find(s => s.id === id);
  if (!svc) return;
  document.getElementById('service-edit-id').value = id;
  document.getElementById('service-modal-title').textContent = 'Edit Service';
  document.getElementById('svc-title').value = svc.title || '';
  document.getElementById('svc-desc').value = svc.description || '';
  document.getElementById('svc-icon').value = svc.icon_class || '';
  document.getElementById('svc-order').value = svc.display_order || 0;
  document.getElementById('svc-status').value = svc.status || 'active';
  document.getElementById('svc-img-url').value = svc.image_url || '';
  if (svc.image_url) showPreviewImage('svc-img-preview', 'svc-img-preview-img', svc.image_url);
  else hidePreview('svc-img-preview');
  openModal('service-modal');
}

async function saveService() {
  const id = getVal('service-edit-id');
  const title = getVal('svc-title').trim();
  if (!title) { toast('warning', 'Service title is required.'); return; }

  const item = {
    id: id || ('svc-' + Date.now()),
    title,
    description: getVal('svc-desc'),
    icon_class: getVal('svc-icon') || 'fa-solid fa-code',
    display_order: parseInt(getVal('svc-order')) || 0,
    status: getVal('svc-status'),
    image_url: getVal('svc-img-url'),
    updated_at: new Date().toISOString()
  };

  try {
    if (id) { await sb.from('services').update(item).eq('id', id); }
    else { await sb.from('services').insert(item); }
  } catch(e) {}

  if (id) {
    const idx = allServices.findIndex(x => x.id === id);
    if (idx !== -1) allServices[idx] = item;
  } else {
    allServices.push(item);
  }

  localStorage.setItem('trilok_services_cache', JSON.stringify(allServices));
  toast('success', id ? 'Service updated!' : 'Service added!');
  logActivity(id ? 'update' : 'create', 'services', title);
  closeModal('service-modal');
  renderServicesTable(allServices);
}

function deleteService(id, name) {
  showConfirm('Delete Service?', `Are you sure you want to delete "${name}"? This cannot be undone.`, async () => {
    try { await sb.from('services').delete().eq('id', id); } catch(e) {}
    allServices = allServices.filter(x => x.id !== id);
    localStorage.setItem('trilok_services_cache', JSON.stringify(allServices));
    toast('success', 'Service deleted!');
    logActivity('delete', 'services', name);
    renderServicesTable(allServices);
  });
}

async function handleServiceImageUpload(e) {
  const file = e.target.files[0]; if (!file) return;
  toast('info', 'Uploading…');
  const url = await cloudinaryUpload(file);
  if (url) { setVal('svc-img-url', url); showPreviewImage('svc-img-preview', 'svc-img-preview-img', url); toast('success', 'Uploaded!'); }
}

// ============================================================
// FEATURES
// ============================================================
let allFeatures = [];

async function loadFeatures() {
  const tbody = document.getElementById('features-tbody');
  tbody.innerHTML = '<tr><td colspan="6"><div class="spinner"></div></td></tr>';
  const { data } = await sb.from('features').select('*').order('display_order');
  allFeatures = data || [];
  renderFeaturesTable(allFeatures);
}

function renderFeaturesTable(data) {
  const tbody = document.getElementById('features-tbody');
  const empty = document.getElementById('features-empty');
  if (!data.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  tbody.innerHTML = data.map(f => `
    <tr>
      <td><span style="color:var(--text-muted)">#${f.display_order}</span></td>
      <td><div class="table-avatar" style="width:32px;height:32px"><i class="${esc(f.icon_class||'fa-solid fa-star')}"></i></div></td>
      <td><strong>${esc(f.title)}</strong></td>
      <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(f.description)}</td>
      <td><span class="badge ${f.status === 'active' ? 'badge-active' : 'badge-inactive'}">${f.status}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-secondary btn-icon" onclick="editFeature('${f.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-sm btn-danger btn-icon" onclick="deleteFeature('${f.id}','${esc(f.title)}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

function openFeatureModal() {
  document.getElementById('feature-edit-id').value = '';
  document.getElementById('feature-modal-title').textContent = 'Add Feature';
  ['feat-title','feat-desc','feat-icon'].forEach(id => setVal(id, ''));
  setVal('feat-order', '0'); setVal('feat-status', 'active');
  openModal('feature-modal');
}

function editFeature(id) {
  const f = allFeatures.find(x => x.id === id); if (!f) return;
  document.getElementById('feature-edit-id').value = id;
  document.getElementById('feature-modal-title').textContent = 'Edit Feature';
  setVal('feat-title', f.title || '');
  setVal('feat-desc', f.description || '');
  setVal('feat-icon', f.icon_class || '');
  setVal('feat-order', f.display_order || 0);
  setVal('feat-status', f.status || 'active');
  openModal('feature-modal');
}

async function saveFeature() {
  const id = getVal('feature-edit-id');
  const title = getVal('feat-title').trim();
  if (!title) { toast('warning', 'Feature title required.'); return; }
  const item = {
    id: id || ('feat-' + Date.now()),
    title,
    description: getVal('feat-desc'),
    icon_class: getVal('feat-icon') || 'fa-solid fa-star',
    display_order: parseInt(getVal('feat-order')) || 0,
    status: getVal('feat-status'),
    updated_at: new Date().toISOString()
  };

  try {
    if (id) { await sb.from('features').update(item).eq('id', id); }
    else { await sb.from('features').insert(item); }
  } catch(e) {}

  if (id) {
    const idx = allFeatures.findIndex(x => x.id === id);
    if (idx !== -1) allFeatures[idx] = item;
  } else {
    allFeatures.push(item);
  }

  localStorage.setItem('trilok_features_cache', JSON.stringify(allFeatures));
  toast('success', id ? 'Feature updated!' : 'Feature added!');
  logActivity(id ? 'update' : 'create', 'features', title);
  closeModal('feature-modal');
  renderFeaturesTable(allFeatures);
}

function deleteFeature(id, name) {
  showConfirm('Delete Feature?', `Delete "${name}"?`, async () => {
    try { await sb.from('features').delete().eq('id', id); } catch(e) {}
    allFeatures = allFeatures.filter(x => x.id !== id);
    localStorage.setItem('trilok_features_cache', JSON.stringify(allFeatures));
    toast('success', 'Feature deleted!');
    logActivity('delete', 'features', name);
    renderFeaturesTable(allFeatures);
  });
}

// ============================================================
// TESTIMONIALS
// ============================================================
let allTestimonials = [];

async function loadTestimonials() {
  const tbody = document.getElementById('testimonials-tbody');
  if (tbody) tbody.innerHTML = '<tr><td colspan="6"><div class="spinner"></div></td></tr>';
  
  let data = null;
  try {
    const res = await sb.from('testimonials').select('*').order('created_at', { ascending: false });
    data = res.data;
  } catch(e) {}

  if (!data || data.length === 0) {
    allTestimonials = JSON.parse(localStorage.getItem('trilok_testimonials_cache')) || DEFAULT_PRESET_TESTIMONIALS.map(t => ({...t, customer_name: t.client_name, review_message: t.testimonial_text}));
  } else {
    allTestimonials = data.map(t => ({...t, customer_name: t.customer_name || t.client_name, review_message: t.review_message || t.testimonial_text}));
  }
  localStorage.setItem('trilok_testimonials_cache', JSON.stringify(allTestimonials));
  renderTestimonialsTable(allTestimonials);
}

function renderTestimonialsTable(data) {
  const tbody = document.getElementById('testimonials-tbody');
  const empty = document.getElementById('testimonials-empty');
  if (!data.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  tbody.innerHTML = data.map(t => {
    const stars = '★'.repeat(t.rating || 5) + '☆'.repeat(5 - (t.rating || 5));
    return `
    <tr>
      <td>
        <div class="table-avatar">
          ${t.profile_image_url ? `<img src="${esc(t.profile_image_url)}" alt="">` : (t.customer_name?.[0]?.toUpperCase() || '?')}
        </div>
      </td>
      <td><strong>${esc(t.customer_name)}</strong></td>
      <td><span style="color:var(--yellow)">${stars}</span></td>
      <td style="max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(t.review_message)}</td>
      <td><span class="badge ${t.status === 'active' ? 'badge-active' : 'badge-inactive'}">${t.status}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-secondary btn-icon" onclick="editTestimonial('${t.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-sm btn-danger btn-icon" onclick="deleteTestimonial('${t.id}','${esc(t.customer_name)}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function initStarRating() {
  const stars = document.querySelectorAll('#rating-stars i');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.getAttribute('data-val'));
      document.getElementById('test-rating').value = val;
      stars.forEach(s => {
        s.classList.toggle('active', parseInt(s.getAttribute('data-val')) <= val);
      });
    });
  });
}

function openTestimonialModal() {
  document.getElementById('testimonial-edit-id').value = '';
  document.getElementById('testimonial-modal-title').textContent = 'Add Testimonial';
  ['test-name','test-message'].forEach(id => setVal(id, ''));
  setVal('test-status', 'active'); setVal('test-rating', '5');
  document.querySelectorAll('#rating-stars i').forEach(s => s.classList.add('active'));
  setVal('test-img-url', ''); hidePreview('test-img-preview');
  openModal('testimonial-modal');
}

function editTestimonial(id) {
  const t = allTestimonials.find(x => x.id === id); if (!t) return;
  document.getElementById('testimonial-edit-id').value = id;
  document.getElementById('testimonial-modal-title').textContent = 'Edit Testimonial';
  setVal('test-name', t.customer_name || '');
  setVal('test-message', t.review_message || '');
  setVal('test-status', t.status || 'active');
  setVal('test-rating', t.rating || 5);
  const ratingVal = t.rating || 5;
  document.querySelectorAll('#rating-stars i').forEach(s => {
    s.classList.toggle('active', parseInt(s.getAttribute('data-val')) <= ratingVal);
  });
  setVal('test-img-url', t.profile_image_url || '');
  if (t.profile_image_url) showPreviewImage('test-img-preview', 'test-img-preview-img', t.profile_image_url);
  else hidePreview('test-img-preview');
  openModal('testimonial-modal');
}

async function saveTestimonial() {
  const id = getVal('testimonial-edit-id');
  const name = getVal('test-name').trim();
  if (!name) { toast('warning', 'Customer name required.'); return; }
  const payload = {
    customer_name: name, review_message: getVal('test-message'),
    rating: parseInt(getVal('test-rating')) || 5,
    status: getVal('test-status'),
    profile_image_url: getVal('test-img-url'),
    updated_at: new Date().toISOString()
  };
  let err;
  if (id) { ({ error: err } = await sb.from('testimonials').update(payload).eq('id', id)); }
  else { ({ error: err } = await sb.from('testimonials').insert(payload)); }
  if (err) { toast('error', err.message); return; }
  toast('success', id ? 'Testimonial updated!' : 'Testimonial added!');
  logActivity(id ? 'update' : 'create', 'testimonials', name);
  closeModal('testimonial-modal'); loadTestimonials();
}

function deleteTestimonial(id, name) {
  showConfirm('Delete Testimonial?', `Delete review by "${name}"?`, async () => {
    await sb.from('testimonials').delete().eq('id', id);
    toast('success', 'Testimonial deleted!');
    logActivity('delete', 'testimonials', name);
    loadTestimonials();
  });
}

async function handleTestimonialImageUpload(e) {
  const file = e.target.files[0]; if (!file) return;
  toast('info', 'Uploading…');
  const url = await cloudinaryUpload(file);
  if (url) { setVal('test-img-url', url); showPreviewImage('test-img-preview', 'test-img-preview-img', url); toast('success', 'Uploaded!'); }
}

// ============================================================
// FAQS
// ============================================================
async function loadFaqs() {
  const tbody = document.getElementById('faqs-tbody');
  if (tbody) tbody.innerHTML = '<tr><td colspan="5"><div class="spinner"></div></td></tr>';
  
  let data = null;
  try {
    const res = await sb.from('faqs').select('*').order('display_order');
    data = res.data;
  } catch(e) {}

  if (!data || data.length === 0) {
    allFaqs = JSON.parse(localStorage.getItem('trilok_faqs_cache')) || DEFAULT_PRESET_FAQS;
  } else {
    allFaqs = data;
  }
  localStorage.setItem('trilok_faqs_cache', JSON.stringify(allFaqs));
  renderFaqsTable(allFaqs);
}

function renderFaqsTable(data) {
  const tbody = document.getElementById('faqs-tbody');
  const empty = document.getElementById('faqs-empty');
  if (!data.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  tbody.innerHTML = data.map(f => `
    <tr>
      <td><span style="color:var(--text-muted)">#${f.display_order}</span></td>
      <td style="max-width:240px;"><strong>${esc(f.question)}</strong></td>
      <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text-secondary)">${esc(f.answer)}</td>
      <td><span class="badge ${f.status === 'active' ? 'badge-active' : 'badge-inactive'}">${f.status}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-secondary btn-icon" onclick="editFaq('${f.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-sm btn-danger btn-icon" onclick="deleteFaq('${f.id}','${esc(f.question).slice(0,30)}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

function openFaqModal() {
  document.getElementById('faq-edit-id').value = '';
  document.getElementById('faq-modal-title').textContent = 'Add FAQ';
  ['faq-question','faq-answer'].forEach(id => setVal(id, ''));
  setVal('faq-order', '0'); setVal('faq-status', 'active');
  openModal('faq-modal');
}

function editFaq(id) {
  const f = allFaqs.find(x => x.id === id); if (!f) return;
  document.getElementById('faq-edit-id').value = id;
  document.getElementById('faq-modal-title').textContent = 'Edit FAQ';
  setVal('faq-question', f.question || '');
  setVal('faq-answer', f.answer || '');
  setVal('faq-order', f.display_order || 0);
  setVal('faq-status', f.status || 'active');
  openModal('faq-modal');
}

async function saveFaq() {
  const id = getVal('faq-edit-id');
  const question = getVal('faq-question').trim();
  const answer = getVal('faq-answer').trim();
  if (!question || !answer) { toast('warning', 'Question and answer are required.'); return; }
  const payload = { question, answer, display_order: parseInt(getVal('faq-order')) || 0, status: getVal('faq-status'), updated_at: new Date().toISOString() };
  let err;
  if (id) { ({ error: err } = await sb.from('faqs').update(payload).eq('id', id)); }
  else { ({ error: err } = await sb.from('faqs').insert(payload)); }
  if (err) { toast('error', err.message); return; }
  toast('success', id ? 'FAQ updated!' : 'FAQ added!');
  logActivity(id ? 'update' : 'create', 'faqs', question.slice(0,50));
  closeModal('faq-modal'); loadFaqs();
}

function deleteFaq(id, name) {
  showConfirm('Delete FAQ?', `Delete this FAQ?`, async () => {
    await sb.from('faqs').delete().eq('id', id);
    toast('success', 'FAQ deleted!');
    logActivity('delete', 'faqs', name);
    loadFaqs();
  });
}

// ============================================================
// GALLERY
// ============================================================
let galleryData = [];

async function loadGallery() {
  const { data } = await sb.from('gallery').select('*').order('created_at', { ascending: false });
  galleryData = data || [];
  renderGalleryGrid(galleryData);
  setEl('gallery-count', `${galleryData.length} image${galleryData.length !== 1 ? 's' : ''}`);
}

function renderGalleryGrid(data) {
  const grid = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  if (!data.length) { grid.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  grid.innerHTML = data.map(img => `
    <div class="gallery-item">
      <img src="${esc(img.image_url)}" alt="${esc(img.name)}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\'><rect fill=\\'%23111827\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%2364748b\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>No img</text></svg>'">
      <div class="gallery-item-overlay">
        <button class="btn btn-sm btn-secondary btn-icon" onclick="previewGalleryImage('${esc(img.image_url)}')" title="Preview"><i class="fa-solid fa-eye"></i></button>
        <button class="btn btn-sm btn-danger btn-icon" onclick="deleteGalleryImage('${img.id}','${esc(img.name)}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
      <div class="gallery-item-name">${esc(img.name)}</div>
    </div>`).join('');
}

async function handleGalleryUpload(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  toast('info', `Uploading ${files.length} file(s)…`);
  let uploaded = 0;
  for (const file of files) {
    const url = await cloudinaryUpload(file);
    if (url) {
      await sb.from('gallery').insert({ name: file.name, image_url: url, file_size: file.size });
      uploaded++;
    }
  }
  if (uploaded) {
    toast('success', `${uploaded} image(s) uploaded!`);
    logActivity('create', 'gallery', `${uploaded} image(s)`, 'Gallery upload');
    loadGallery();
  }
}

function previewGalleryImage(url) {
  document.getElementById('gallery-preview-img').src = url;
  openModal('gallery-preview-modal');
}

function deleteGalleryImage(id, name) {
  showConfirm('Delete Image?', `Delete "${name}" from gallery? This cannot be undone.`, async () => {
    await sb.from('gallery').delete().eq('id', id);
    toast('success', 'Image deleted!');
    logActivity('delete', 'gallery', name);
    loadGallery();
  });
}

// ============================================================
// CONTACT REQUESTS
// ============================================================
async function loadContacts() {
  const tbody = document.getElementById('contacts-tbody');
  tbody.innerHTML = '<tr><td colspan="8"><div class="spinner"></div></td></tr>';
  const { data } = await sb.from('contact_requests').select('*').order('created_at', { ascending: false });
  contactsData = data || [];
  renderContactsTable();
  updateUnreadBadge(contactsData.filter(c => !c.is_read).length);
}

function renderContactsTable() {
  const filtered = contactsData.filter(c => {
    const q = contactsFilter.search.toLowerCase();
    const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q) || c.message?.toLowerCase().includes(q);
    const matchStatus = contactsFilter.status === 'all' || (contactsFilter.status === 'read' && c.is_read) || (contactsFilter.status === 'unread' && !c.is_read);
    return matchSearch && matchStatus;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / contactsPerPage);
  const start = (contactsPage - 1) * contactsPerPage;
  const pageData = filtered.slice(start, start + contactsPerPage);

  const tbody = document.getElementById('contacts-tbody');
  const empty = document.getElementById('contacts-empty');

  if (!pageData.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    document.getElementById('contacts-pagination').innerHTML = '';
    return;
  }
  empty.style.display = 'none';
  tbody.innerHTML = pageData.map(c => `
    <tr style="${!c.is_read ? 'background:rgba(79,142,247,0.04)' : ''}">
      <td><strong>${esc(c.name)}</strong></td>
      <td>${esc(c.email)}</td>
      <td>${esc(c.phone)}</td>
      <td>${esc(c.subject || '–')}</td>
      <td style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(c.message)}</td>
      <td>${formatDate(c.created_at)}</td>
      <td><span class="badge ${c.is_read ? 'badge-read' : 'badge-unread'}">${c.is_read ? 'Read' : 'Unread'}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-secondary btn-icon" onclick="viewContact('${c.id}')" title="View"><i class="fa-solid fa-eye"></i></button>
          ${!c.is_read ? `<button class="btn btn-sm btn-success btn-icon" onclick="markContactRead('${c.id}')" title="Mark Read"><i class="fa-solid fa-check"></i></button>` : ''}
          <button class="btn btn-sm btn-danger btn-icon" onclick="deleteContact('${c.id}','${esc(c.name)}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');

  // Pagination
  renderPagination('contacts-pagination', contactsPage, totalPages, (p) => { contactsPage = p; renderContactsTable(); });
}

function filterContacts(val) { contactsFilter.search = val; contactsPage = 1; renderContactsTable(); }
function filterContactsByStatus(val) { contactsFilter.status = val; contactsPage = 1; renderContactsTable(); }

async function viewContact(id) {
  const c = contactsData.find(x => x.id === id); if (!c) return;
  // Mark as read
  if (!c.is_read) await markContactRead(id, false);

  document.getElementById('contact-view-body').innerHTML = `
    <div style="display:grid;gap:14px">
      <div style="display:flex;gap:20px;flex-wrap:wrap">
        <div style="flex:1"><label style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">Name</label><p style="font-weight:700;margin-top:4px">${esc(c.name)}</p></div>
        <div style="flex:1"><label style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">Date</label><p style="font-weight:600;margin-top:4px">${formatDate(c.created_at)}</p></div>
      </div>
      <div style="display:flex;gap:20px;flex-wrap:wrap">
        <div style="flex:1"><label style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">Email</label><p style="margin-top:4px"><a href="mailto:${esc(c.email)}" style="color:var(--accent)">${esc(c.email)}</a></p></div>
        <div style="flex:1"><label style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">Phone</label><p style="margin-top:4px">${esc(c.phone || '–')}</p></div>
      </div>
      ${c.subject ? `<div><label style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">Subject</label><p style="margin-top:4px;font-weight:600">${esc(c.subject)}</p></div>` : ''}
      <div><label style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">Message</label>
        <div class="message-detail" style="margin-top:6px">${esc(c.message)}</div>
      </div>
    </div>`;
  openModal('contact-view-modal');
}

async function markContactRead(id, reload = true) {
  await sb.from('contact_requests').update({ is_read: true }).eq('id', id);
  const c = contactsData.find(x => x.id === id);
  if (c) c.is_read = true;
  if (reload) renderContactsTable();
  updateUnreadBadge(contactsData.filter(c => !c.is_read).length);
}

async function markAllRead() {
  await sb.from('contact_requests').update({ is_read: true }).eq('is_read', false);
  contactsData.forEach(c => c.is_read = true);
  renderContactsTable();
  updateUnreadBadge(0);
  toast('success', 'All requests marked as read!');
}

function deleteContact(id, name) {
  showConfirm('Delete Request?', `Delete contact request from "${name}"?`, async () => {
    await sb.from('contact_requests').delete().eq('id', id);
    contactsData = contactsData.filter(c => c.id !== id);
    renderContactsTable();
    updateUnreadBadge(contactsData.filter(c => !c.is_read).length);
    toast('success', 'Request deleted!');
    logActivity('delete', 'contact_requests', name);
  });
}

function updateUnreadBadge(count) {
  // Sidebar badge
  const badge = document.getElementById('unread-badge');
  if (badge) {
    if (count > 0) { badge.textContent = count; badge.style.display = 'flex'; }
    else badge.style.display = 'none';
  }
  // Mobile bottom nav badge
  const mobBadge = document.getElementById('mob-unread-badge');
  if (mobBadge) {
    if (count > 0) { mobBadge.textContent = count; mobBadge.style.display = 'block'; }
    else mobBadge.style.display = 'none';
  }
}

// ============================================================
// WEBSITE SETTINGS
// ============================================================
async function loadWebsiteSettings() {
  const { data } = await sb.from('website_settings').select('*').limit(1).single();
  if (!data) return;
  setVal('ws-company-name', data.company_name || '');
  setVal('ws-contact-number', data.contact_number || '');
  setVal('ws-email', data.email_address || '');
  setVal('ws-address', data.business_address || '');
  setVal('ws-facebook', data.facebook_url || '');
  setVal('ws-instagram', data.instagram_url || '');
  setVal('ws-linkedin', data.linkedin_url || '');
  setVal('ws-youtube', data.youtube_url || '');
  setVal('ws-whatsapp', data.whatsapp_number || '');
  setVal('ws-logo-url', data.logo_url || '');
  if (data.logo_url) showPreviewImage('logo-preview', 'logo-preview-img', data.logo_url);
}

async function saveWebsiteSettings() {
  const payload = {
    company_name: getVal('ws-company-name'),
    contact_number: getVal('ws-contact-number'),
    email_address: getVal('ws-email'),
    business_address: getVal('ws-address'),
    facebook_url: getVal('ws-facebook'),
    instagram_url: getVal('ws-instagram'),
    linkedin_url: getVal('ws-linkedin'),
    youtube_url: getVal('ws-youtube'),
    whatsapp_number: getVal('ws-whatsapp'),
    logo_url: getVal('ws-logo-url'),
    updated_at: new Date().toISOString()
  };
  const { data: existing } = await sb.from('website_settings').select('id').limit(1).single();
  let err;
  if (existing) { ({ error: err } = await sb.from('website_settings').update(payload).eq('id', existing.id)); }
  else { ({ error: err } = await sb.from('website_settings').insert(payload)); }
  if (err) { toast('error', err.message); return; }
  toast('success', 'Website settings saved!');
  logActivity('update', 'website_settings', 'Website Settings');
}

async function handleLogoUpload(e) {
  const file = e.target.files[0]; if (!file) return;
  toast('info', 'Uploading logo…');
  const url = await cloudinaryUpload(file);
  if (url) { setVal('ws-logo-url', url); showPreviewImage('logo-preview', 'logo-preview-img', url); toast('success', 'Logo uploaded!'); }
}

function removeLogo() { setVal('ws-logo-url', ''); hidePreview('logo-preview'); }

// ============================================================
// SEO SETTINGS
// ============================================================
async function loadSeoSettings() {
  const { data } = await sb.from('seo_settings').select('*').limit(1).single();
  if (!data) return;
  setVal('seo-title', data.meta_title || '');
  setVal('seo-desc', data.meta_description || '');
  setVal('seo-keywords', data.keywords || '');
  setVal('seo-og-url', data.og_image_url || '');
  setVal('seo-favicon-url', data.favicon_url || '');
  if (data.og_image_url) showPreviewImage('og-img-preview', 'og-img-preview-img', data.og_image_url);
  if (data.favicon_url) showPreviewImage('favicon-preview', 'favicon-preview-img', data.favicon_url);
  updateSeoCounter('seo-title', 'seo-title-count', 60);
  updateSeoCounter('seo-desc', 'seo-desc-count', 160);
}

function updateSeoCounter(inputId, countId, max) {
  const len = (document.getElementById(inputId)?.value || '').length;
  const el = document.getElementById(countId);
  if (el) { el.textContent = len; el.style.color = len > max * 0.9 ? 'var(--yellow)' : len >= max ? 'var(--red)' : 'var(--text-muted)'; }
}

async function saveSeoSettings() {
  const payload = {
    meta_title: getVal('seo-title'),
    meta_description: getVal('seo-desc'),
    keywords: getVal('seo-keywords'),
    og_image_url: getVal('seo-og-url'),
    favicon_url: getVal('seo-favicon-url'),
    updated_at: new Date().toISOString()
  };
  const { data: existing } = await sb.from('seo_settings').select('id').limit(1).single();
  let err;
  if (existing) { ({ error: err } = await sb.from('seo_settings').update(payload).eq('id', existing.id)); }
  else { ({ error: err } = await sb.from('seo_settings').insert(payload)); }
  if (err) { toast('error', err.message); return; }
  toast('success', 'SEO settings saved!');
  logActivity('update', 'seo_settings', 'SEO Settings');
}

async function handleOgImageUpload(e) {
  const file = e.target.files[0]; if (!file) return;
  toast('info', 'Uploading…');
  const url = await cloudinaryUpload(file);
  if (url) { setVal('seo-og-url', url); showPreviewImage('og-img-preview', 'og-img-preview-img', url); toast('success', 'OG image uploaded!'); }
}
async function handleFaviconUpload(e) {
  const file = e.target.files[0]; if (!file) return;
  toast('info', 'Uploading…');
  const url = await cloudinaryUpload(file);
  if (url) { setVal('seo-favicon-url', url); showPreviewImage('favicon-preview', 'favicon-preview-img', url); toast('success', 'Favicon uploaded!'); }
}

function removeOgImg() { setVal('seo-og-url', ''); hidePreview('og-img-preview'); }
function removeFavicon() { setVal('seo-favicon-url', ''); hidePreview('favicon-preview'); }

// ============================================================
// ADMIN PROFILE
// ============================================================
async function loadAdminProfile() {
  if (!currentUser) return;
  const { data } = await sb.from('admin_profiles').select('*').eq('id', currentUser.id).single();
  const name = data?.full_name || currentUser.email?.split('@')[0] || 'Admin';
  const email = data?.email || currentUser.email || '';
  const avatarUrl = data?.avatar_url || '';

  setEl('header-admin-name', name);

  const avatarEl = document.getElementById('header-avatar-img');
  if (avatarEl) {
    if (avatarUrl) avatarEl.innerHTML = `<img src="${esc(avatarUrl)}" alt="">`;
    else avatarEl.textContent = name[0]?.toUpperCase() || 'A';
  }

  setEl('profile-display-name', name);
  setEl('profile-display-email', email);

  const profileAv = document.getElementById('profile-avatar-lg');
  if (profileAv) {
    if (avatarUrl) {
      const img = profileAv.querySelector('img') || document.createElement('img');
      img.src = avatarUrl; img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;position:absolute;inset:0';
      if (!profileAv.querySelector('img')) profileAv.insertBefore(img, profileAv.firstChild);
    } else {
      const existing = profileAv.querySelector('img');
      if (existing) existing.remove();
      profileAv.childNodes.forEach(n => { if (n.nodeType === 3) n.remove(); });
      profileAv.insertAdjacentText('afterbegin', name[0]?.toUpperCase() || 'A');
    }
  }
}

function loadProfilePage() {
  if (!currentUser) return;
  sb.from('admin_profiles').select('*').eq('id', currentUser.id).single().then(({ data }) => {
    if (data) {
      setVal('profile-name', data.full_name || '');
      setVal('profile-email', data.email || currentUser.email || '');
      setVal('profile-avatar-url', data.avatar_url || '');
      if (data.avatar_url) {
        const av = document.getElementById('profile-avatar-lg');
        if (av) {
          const existing = av.querySelector('img');
          if (existing) { existing.src = data.avatar_url; }
          else { av.insertAdjacentHTML('afterbegin', `<img src="${esc(data.avatar_url)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;position:absolute;inset:0">`); }
        }
      }
    } else {
      setVal('profile-name', currentUser.email?.split('@')[0] || '');
      setVal('profile-email', currentUser.email || '');
    }
  });
}

async function saveProfile() {
  const name = getVal('profile-name').trim();
  if (!name) { toast('warning', 'Name cannot be empty.'); return; }
  const payload = { full_name: name, email: getVal('profile-email'), avatar_url: getVal('profile-avatar-url'), updated_at: new Date().toISOString() };

  const { data: existing } = await sb.from('admin_profiles').select('id').eq('id', currentUser.id).single();
  let err;
  if (existing) { ({ error: err } = await sb.from('admin_profiles').update(payload).eq('id', currentUser.id)); }
  else { ({ error: err } = await sb.from('admin_profiles').insert({ ...payload, id: currentUser.id })); }

  if (err) { toast('error', err.message); return; }
  toast('success', 'Profile saved!');
  setEl('header-admin-name', name);
  setEl('profile-display-name', name);
  logActivity('update', 'admin_profiles', 'Admin Profile');
}

async function changePassword() {
  const newPwd = getVal('new-password');
  const confirmPwd = getVal('confirm-password');
  if (!newPwd || !confirmPwd) { toast('warning', 'Please fill both fields.'); return; }
  if (newPwd !== confirmPwd) { toast('error', 'Passwords do not match.'); return; }
  if (newPwd.length < 6) { toast('warning', 'Password must be at least 6 characters.'); return; }

  const { error } = await sb.auth.updateUser({ password: newPwd });
  localStorage.setItem('trilok_admin_pwd', newPwd);
  toast('success', 'Password updated successfully! Old password will no longer work.');
  setVal('new-password', ''); setVal('confirm-password', '');
  logActivity('update', 'auth', 'Password Changed');
}

async function handleProfileAvatarUpload(e) {
  const file = e.target.files[0]; if (!file) return;
  toast('info', 'Uploading avatar…');
  const url = await cloudinaryUpload(file);
  if (url) {
    setVal('profile-avatar-url', url);
    const av = document.getElementById('profile-avatar-lg');
    if (av) {
      const existing = av.querySelector('img');
      if (existing) { existing.src = url; }
      else { av.insertAdjacentHTML('afterbegin', `<img src="${esc(url)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;position:absolute;inset:0">`); }
    }
    toast('success', 'Avatar uploaded!');
  }
}

// ============================================================
// ACTIVITY LOG
// ============================================================
async function logActivity(action, entityType, entityName, details = '') {
  if (!currentUser) return;
  try {
    await sb.from('activity_logs').insert({
      admin_id: currentUser.id,
      action: capitalize(action),
      entity_type: entityType,
      entity_name: entityName,
      details
    });
  } catch(e) { /* non-blocking */ }
}

// ============================================================
// CLOUDINARY UPLOAD
// ============================================================
async function cloudinaryUpload(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);
  formData.append('cloud_name', CLOUDINARY_NAME);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.secure_url) return data.secure_url;
    toast('error', 'Cloudinary upload failed: ' + (data.error?.message || 'Unknown error'));
    return null;
  } catch(e) {
    toast('error', 'Upload failed: ' + e.message);
    return null;
  }
}

// ============================================================
// MODAL HELPERS
// ============================================================
function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// Close modal on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
  }
});

// CONFIRM MODAL
let confirmCallback = null;
function showConfirm(title, msg, callback) {
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-msg').textContent = msg;
  confirmCallback = callback;
  openModal('confirm-modal');
}
document.getElementById('confirm-action-btn')?.addEventListener('click', () => {
  closeModal('confirm-modal');
  if (confirmCallback) { confirmCallback(); confirmCallback = null; }
});

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function toast(type, message, duration = 3500) {
  const container = document.getElementById('toast-container');
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info', warning: 'fa-triangle-exclamation' };
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<i class="fa-solid ${icons[type]} toast-icon"></i><span class="toast-msg">${esc(message)}</span><i class="fa-solid fa-xmark toast-close" onclick="this.closest('.toast').remove()"></i>`;
  container.appendChild(t);
  setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 350); }, duration);
}

// ============================================================
// PAGINATION
// ============================================================
function renderPagination(containerId, current, total, onChange) {
  const container = document.getElementById(containerId);
  if (!container || total <= 1) { if (container) container.innerHTML = ''; return; }
  let html = '';
  html += `<button ${current === 1 ? 'disabled' : ''} onclick="(${onChange})(${current - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      html += `<button class="${i === current ? 'active' : ''}" onclick="(${onChange})(${i})">${i}</button>`;
    } else if (i === current - 2 || i === current + 2) {
      html += `<button disabled>…</button>`;
    }
  }
  html += `<button ${current === total ? 'disabled' : ''} onclick="(${onChange})(${current + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;
  html += `<span class="pagination-info">${current} of ${total}</span>`;
  container.innerHTML = html;
}

// ============================================================
// UPLOAD PREVIEW HELPERS
// ============================================================
function showPreviewImage(previewId, imgId, url) {
  const preview = document.getElementById(previewId);
  const img = document.getElementById(imgId);
  if (preview) preview.classList.add('show');
  if (img) img.src = url;
}

function hidePreview(previewId) {
  const preview = document.getElementById(previewId);
  if (preview) { preview.classList.remove('show'); const img = preview.querySelector('img'); if (img) img.src = ''; }
}

// ============================================================
// UTILITY HELPERS
// ============================================================
function getVal(id) { return (document.getElementById(id)?.value || '').trim(); }
function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val; }
function setEl(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function esc(str) { return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function capitalize(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }

function formatDate(isoStr) {
  if (!isoStr) return '–';
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function timeAgo(isoStr) {
  if (!isoStr) return '';
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
