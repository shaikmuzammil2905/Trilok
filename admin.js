/**
 * TRILOK INFOTECH ADMIN CMS — CONTROLLER ENGINE
 * Production-grade Supabase Auth, Row Level Security, Cloudinary Uploads & Complete CRUD
 */

// ============================================================
// CONFIGURATION & INITIALIZATION
// ============================================================
const SUPABASE_URL    = 'https://gotrpjxnrmocsrfxauyz.supabase.co';
const SUPABASE_ANON   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdHJwanhucm1vY3NyZnhhdXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MjI1MDgsImV4cCI6MjEwMTQ5ODUwOH0.h5FE6bQp6wp7DyQJaec-CT9pmhrlm1S42u4dWwKGOrU';
const CLOUDINARY_NAME = 'jdycsgud';
const CLOUDINARY_PRESET = 'ml_default';

let sb = null;
try {
  if (typeof supabase !== 'undefined' && supabase.createClient) {
    sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }
} catch(e) {
  console.error("Supabase client init error:", e);
}

// Global State
let currentUser = null;
let currentPage = 'dashboard';
let currentConfirmCallback = null;

// ============================================================
// DOM READY & AUTHENTICATION STATE CHECK
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  initUIListeners();
  await checkAuthState();
});

function initUIListeners() {
  // Password eye toggle
  const eye = document.getElementById('pwd-eye');
  if (eye) eye.addEventListener('click', togglePasswordVisibility);

  // Mobile sidebar drawer DOM elements
  const toggleBtn = document.getElementById('sidebar-toggle');
  const closeBtn = document.getElementById('sidebar-close-btn');
  const overlay = document.getElementById('sidebar-overlay');
  const sidebar = document.getElementById('admin-sidebar');
  window.toggleAdminSidebar = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) {
      const isOpen = sidebar.classList.contains('open') || sidebar.classList.contains('mobile-open');
      if (isOpen) {
        sidebar.classList.remove('open');
        sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
      } else {
        sidebar.classList.add('open');
        sidebar.classList.add('mobile-open');
        if (overlay) overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }
  };

  window.openAdminSidebar = function() {
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) {
      sidebar.classList.add('open');
      sidebar.classList.add('mobile-open');
    }
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeAdminSidebar = function() {
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) {
      sidebar.classList.remove('open');
      sidebar.classList.remove('mobile-open');
    }
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (toggleBtn) toggleBtn.addEventListener('click', window.toggleAdminSidebar);
  if (closeBtn) closeBtn.addEventListener('click', window.closeAdminSidebar);
  if (overlay) overlay.addEventListener('click', window.closeAdminSidebar);

  // Sidebar navigation click handlers
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.getAttribute('data-page');
      if (page) {
        navigateTo(page);
        window.closeAdminSidebar();
      }
    });
  });
}

function togglePasswordVisibility() {
  const pwdInput = document.getElementById('login-password');
  const eyeIcon = document.getElementById('pwd-eye');
  if (!pwdInput) return;
  const isPassword = pwdInput.type === 'password';
  pwdInput.type = isPassword ? 'text' : 'password';
  if (eyeIcon) {
    eyeIcon.className = isPassword ? 'fa-solid fa-eye-slash eye-toggle' : 'fa-solid fa-eye eye-toggle';
  }
}

async function checkAuthState() {
  if (!sb || !sb.auth) {
    showLoginPage();
    return;
  }

  try {
    const { data: { session } } = await sb.auth.getSession();
    if (session && session.user) {
      currentUser = session.user;
      await showAdminLayout();
    } else {
      showLoginPage();
    }

    sb.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        currentUser = session.user;
        await showAdminLayout();
      } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        showLoginPage();
      }
    });
  } catch (err) {
    console.error("Auth check failed:", err);
    showLoginPage();
  }
}

function showLoginPage() {
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('admin-layout').style.display = 'none';
}

async function showAdminLayout() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('admin-layout').style.display = 'flex';
  
  if (currentUser) {
    const emailEl = document.getElementById('profile-email');
    const nameEl = document.getElementById('header-admin-name');
    if (emailEl) emailEl.value = currentUser.email || '';
    if (nameEl) nameEl.textContent = currentUser.user_metadata?.full_name || currentUser.email || 'Admin';
  }

  await loadAllCmsData();
}

async function executeAdminLogin(e) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById('login-email');
  const pwdInput = document.getElementById('login-password');
  const btn = document.getElementById('login-btn');
  const errBox = document.getElementById('login-error');
  const errMsg = document.getElementById('login-error-msg');

  const email = emailInput ? emailInput.value.trim() : '';
  const password = pwdInput ? pwdInput.value : '';

  if (!email || !password) {
    if (errMsg) errMsg.textContent = 'Please enter email and password.';
    if (errBox) errBox.classList.add('show');
    return;
  }

  if (errBox) errBox.classList.remove('show');
  if (btn) { btn.classList.add('loading'); btn.disabled = true; }

  try {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      if (errMsg) errMsg.textContent = error.message || 'Invalid authentication credentials.';
      if (errBox) errBox.classList.add('show');
    } else if (data?.user) {
      currentUser = data.user;
      await showAdminLayout();
      showToast('Successfully logged in!', 'success');
    }
  } catch (err) {
    if (errMsg) errMsg.textContent = err.message || 'Authentication failed.';
    if (errBox) errBox.classList.add('show');
  } finally {
    if (btn) { btn.classList.remove('loading'); btn.disabled = false; }
  }
}

async function executeLogout() {
  showConfirm('Logout Admin Session?', 'Are you sure you want to log out of the admin panel?', async () => {
    if (sb && sb.auth) {
      await sb.auth.signOut();
    }
    currentUser = null;
    showLoginPage();
    showToast('Signed out successfully', 'info');
  }, 'Logout', 'btn-danger', 'fa-solid fa-right-from-bracket');
}

// ============================================================
// PAGE NAVIGATION CONTROLLER & HISTORY STACK
// ============================================================
let adminPageHistory = [];

function navigateTo(pageId, pushHistory = true) {
  if (!pageId) return;

  // Don't duplicate if already on the same page
  if (pageId === currentPage) {
    if (typeof window.closeAdminSidebar === 'function') {
      window.closeAdminSidebar();
    }
    return;
  }

  // Push previous page to history stack
  if (pushHistory && currentPage) {
    if (adminPageHistory[adminPageHistory.length - 1] !== currentPage) {
      adminPageHistory.push(currentPage);
    }
  }

  currentPage = pageId;
  document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-page') === pageId);
  });

  const pageSec = document.getElementById(`page-${pageId}`);
  if (pageSec) pageSec.classList.add('active');

  const titleEl = document.getElementById('header-page-title');
  if (titleEl) {
    const titles = {
      dashboard: 'Dashboard Overview',
      hero: 'Hero Section Management',
      about: 'About Us Management',
      services: 'Services Management',
      features: 'Key Features & Highlights',
      projects: 'View Our Work (Projects)',
      products: 'Products Management',
      industries: 'Industries We Serve',
      careers: 'Careers & Job Openings',
      testimonials: 'Testimonials Management',
      faqs: 'FAQs Management',
      gallery: 'Gallery & Media Library',
      contacts: 'Contact Requests & Leads',
      settings: 'Website Settings',
      seo: 'SEO Settings',
      profile: 'Admin Profile'
    };
    titleEl.textContent = titles[pageId] || 'Admin Dashboard';
  }

  // Auto-close mobile sidebar drawer
  if (typeof window.closeAdminSidebar === 'function') {
    window.closeAdminSidebar();
  } else {
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) {
      sidebar.classList.remove('open');
      sidebar.classList.remove('mobile-open');
    }
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.navigateBackAdmin = function() {
  if (adminPageHistory.length > 0) {
    const prevPage = adminPageHistory.pop();
    navigateTo(prevPage, false);
  } else {
    navigateTo('dashboard', false);
  }
};

// ============================================================
// CMS DATA LOADER & STATISTICS
// ============================================================
async function loadAllCmsData() {
  await Promise.all([
    loadDashboardStats(),
    loadHeroSettings(),
    loadAboutSettings(),
    loadServices(),
    loadFeatures(),
    loadProjects(),
    loadProducts(),
    loadIndustries(),
    loadCareers(),
    loadTestimonials(),
    loadFaqs(),
    loadGallery(),
    loadContacts(),
    loadWebsiteSettings(),
    loadSeoSettings()
  ]);
}

async function loadDashboardStats() {
  if (!sb) return;
  try {
    const counts = {};
    const tables = ['services', 'features', 'projects', 'products', 'industries', 'careers', 'testimonials', 'faqs', 'gallery', 'contact_requests'];
    
    for (const tbl of tables) {
      try {
        const { count, error } = await sb.from(tbl).select('*', { count: 'exact', head: true });
        counts[tbl] = error ? 0 : (count || 0);
      } catch(e) { counts[tbl] = 0; }
    }

    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setVal('stat-services', counts['services'] || 0);
    setVal('stat-features', counts['features'] || 0);
    setVal('stat-projects', counts['projects'] || 0);
    setVal('stat-products', counts['products'] || 0);
    setVal('stat-industries', counts['industries'] || 0);
    setVal('stat-careers', counts['careers'] || 0);
    setVal('stat-testimonials', counts['testimonials'] || 0);
    setVal('stat-faqs', counts['faqs'] || 0);
    setVal('stat-gallery', counts['gallery'] || 0);
    setVal('stat-contacts', counts['contact_requests'] || 0);
  } catch(err) {
    console.error("Failed to load dashboard stats:", err);
  }
}

// ============================================================
// 1. HERO CMS MANAGEMENT
// ============================================================
async function loadHeroSettings() {
  if (!sb) return;
  try {
    const { data } = await sb.from('hero_settings').select('*').limit(1).single();
    if (data) {
      const setV = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
      setV('hero-heading', data.heading);
      setV('hero-subheading', data.sub_heading || data.subheading);
      setV('hero-cta-primary', data.cta_primary_text);
      setV('hero-cta-primary-url', data.cta_primary_url);
      setV('hero-cta-secondary', data.cta_secondary_text);
      setV('hero-cta-secondary-url', data.cta_secondary_url);
      setV('hero-bg-url', data.bg_image_url);
      const chk = document.getElementById('hero-visible');
      if (chk) chk.checked = data.is_visible !== false;

      if (data.bg_image_url) {
        showImagePreview('hero-bg-url', 'hero-bg-preview', data.bg_image_url);
      }
    }
  } catch(e) {}
}

async function saveHeroSettings() {
  if (!sb) return;
  const payload = {
    heading: document.getElementById('hero-heading')?.value || '',
    sub_heading: document.getElementById('hero-subheading')?.value || '',
    cta_primary_text: document.getElementById('hero-cta-primary')?.value || '',
    cta_primary_url: document.getElementById('hero-cta-primary-url')?.value || '',
    cta_secondary_text: document.getElementById('hero-cta-secondary')?.value || '',
    cta_secondary_url: document.getElementById('hero-cta-secondary-url')?.value || '',
    bg_image_url: document.getElementById('hero-bg-url')?.value || '',
    is_visible: document.getElementById('hero-visible')?.checked !== false
  };

  try {
    const { data: existing } = await sb.from('hero_settings').select('id').limit(1);
    if (existing && existing.length > 0) {
      await sb.from('hero_settings').update(payload).eq('id', existing[0].id);
    } else {
      await sb.from('hero_settings').insert([payload]);
    }
    showToast('Hero settings saved successfully!', 'success');
  } catch(e) {
    showToast('Error saving hero settings: ' + e.message, 'error');
  }
}

// ============================================================
// 2. ABOUT US CMS MANAGEMENT
// ============================================================
async function loadAboutSettings() {
  if (!sb) return;
  try {
    const { data } = await sb.from('about_settings').select('*').limit(1).single();
    if (data) {
      const setV = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
      setV('about-heading', data.heading);
      setV('about-content', data.content);
      setV('about-mission', data.mission);
      setV('about-vision', data.vision);
      setV('about-values', data.values);
      setV('about-img-url', data.image_url);
      const chk = document.getElementById('about-visible');
      if (chk) chk.checked = data.is_visible !== false;

      if (data.image_url) {
        showImagePreview('about-img-url', 'about-img-preview', data.image_url);
      }
    }
  } catch(e) {}
}

async function saveAboutSettings() {
  if (!sb) return;
  const payload = {
    heading: document.getElementById('about-heading')?.value || '',
    content: document.getElementById('about-content')?.value || '',
    mission: document.getElementById('about-mission')?.value || '',
    vision: document.getElementById('about-vision')?.value || '',
    values: document.getElementById('about-values')?.value || '',
    image_url: document.getElementById('about-img-url')?.value || '',
    is_visible: document.getElementById('about-visible')?.checked !== false
  };

  try {
    const { data: existing } = await sb.from('about_settings').select('id').limit(1);
    if (existing && existing.length > 0) {
      await sb.from('about_settings').update(payload).eq('id', existing[0].id);
    } else {
      await sb.from('about_settings').insert([payload]);
    }
    showToast('About Us settings saved successfully!', 'success');
  } catch(e) {
    showToast('Error saving about settings: ' + e.message, 'error');
  }
}

// ============================================================
// 3. SERVICES CMS MANAGEMENT
// ============================================================
async function loadServices() {
  if (!sb) return;
  const tbody = document.getElementById('services-tbody');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:20px"><i class="fa-solid fa-spinner fa-spin"></i> Loading services...</td></tr>`;

  try {
    const { data, error } = await sb.from('services').select('*').order('display_order', { ascending: true });
    if (error || !data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:24px">No services found in database. Click "Add New Service" above.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.map(item => `
      <tr>
        <td><strong>${item.display_order || 0}</strong></td>
        <td><i class="${item.icon_class || 'fa-solid fa-code'}" style="font-size:20px;color:var(--cyan)"></i></td>
        <td><strong>${escapeHtml(item.title)}</strong></td>
        <td class="text-muted" style="max-width:260px">${escapeHtml(item.description || item.short_desc || '')}</td>
        <td><span class="status-badge ${item.status === 'active' ? 'active' : 'inactive'}">${item.status || 'active'}</span></td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit" onclick="editService('${item.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn toggle" onclick="toggleServiceStatus('${item.id}', '${item.status}')" title="Toggle Status"><i class="fa-solid fa-eye"></i></button>
            <button class="action-btn delete" onclick="confirmDeleteService('${item.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error loading services: ${e.message}</td></tr>`;
  }
}

function openServiceModal(id = null) {
  document.getElementById('svc-edit-id').value = id || '';
  document.getElementById('svc-title').value = '';
  document.getElementById('svc-short-desc').value = '';
  document.getElementById('svc-desc').value = '';
  document.getElementById('svc-icon').value = 'fa-solid fa-code';
  document.getElementById('svc-order').value = '0';
  document.getElementById('svc-status').value = 'active';

  document.getElementById('svc-modal-title').textContent = id ? 'Edit Service' : 'Add Service';
  openModal('service-modal');
}

async function editService(id) {
  try {
    const { data } = await sb.from('services').select('*').eq('id', id).single();
    if (data) {
      document.getElementById('svc-edit-id').value = data.id;
      document.getElementById('svc-title').value = data.title || '';
      document.getElementById('svc-short-desc').value = data.short_desc || data.description || '';
      document.getElementById('svc-desc').value = data.description || '';
      document.getElementById('svc-icon').value = data.icon_class || 'fa-solid fa-code';
      document.getElementById('svc-order').value = data.display_order || 0;
      document.getElementById('svc-status').value = data.status || 'active';
      document.getElementById('svc-modal-title').textContent = 'Edit Service';
      openModal('service-modal');
    }
  } catch(e) {}
}

async function saveService() {
  const id = document.getElementById('svc-edit-id')?.value;
  const title = document.getElementById('svc-title')?.value.trim();
  if (!title) { showToast('Service Title is required', 'error'); return; }

  const payload = {
    title,
    description: document.getElementById('svc-desc')?.value || document.getElementById('svc-short-desc')?.value || '',
    icon_class: document.getElementById('svc-icon')?.value || 'fa-solid fa-code',
    display_order: parseInt(document.getElementById('svc-order')?.value || '0', 10),
    status: document.getElementById('svc-status')?.value || 'active'
  };

  try {
    if (id) {
      await sb.from('services').update(payload).eq('id', id);
      showToast('Service updated successfully', 'success');
    } else {
      await sb.from('services').insert([payload]);
      showToast('New service added successfully', 'success');
    }
    closeModal('service-modal');
    await loadServices();
    await loadDashboardStats();
  } catch(e) {
    showToast('Error saving service: ' + e.message, 'error');
  }
}

function confirmDeleteService(id) {
  showConfirm('Delete Service?', 'Are you sure you want to permanently delete this service?', async () => {
    try {
      await sb.from('services').delete().eq('id', id);
      showToast('Service deleted successfully', 'success');
      await loadServices();
      await loadDashboardStats();
    } catch(e) { showToast('Delete failed: ' + e.message, 'error'); }
  });
}

async function toggleServiceStatus(id, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  try {
    await sb.from('services').update({ status: newStatus }).eq('id', id);
    showToast(`Service set to ${newStatus}`, 'info');
    await loadServices();
  } catch(e) {}
}

// ============================================================
// FEATURES CMS MANAGEMENT
// ============================================================
async function loadFeatures() {
  if (!sb) return;
  const tbody = document.getElementById('features-tbody');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:20px"><i class="fa-solid fa-spinner fa-spin"></i> Loading features...</td></tr>`;

  try {
    const { data, error } = await sb.from('features').select('*').order('display_order', { ascending: true });
    if (error || !data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:24px">No features found in database. Click "Add New Feature" above.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.map(item => `
      <tr>
        <td><strong>${item.display_order || 0}</strong></td>
        <td><i class="${item.icon_class || 'fa-solid fa-star'}" style="font-size:20px;color:var(--cyan)"></i></td>
        <td><strong>${escapeHtml(item.title)}</strong></td>
        <td class="text-muted" style="max-width:300px">${escapeHtml(item.description || '')}</td>
        <td><span class="status-badge ${item.status === 'active' ? 'active' : 'inactive'}">${item.status || 'active'}</span></td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit" onclick="editFeature('${item.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn toggle" onclick="toggleFeatureStatus('${item.id}', '${item.status}')" title="Toggle Status"><i class="fa-solid fa-eye"></i></button>
            <button class="action-btn delete" onclick="confirmDeleteFeature('${item.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error loading features: ${e.message}</td></tr>`;
  }
}

function openFeatureModal(id = null) {
  document.getElementById('feature-edit-id').value = id || '';
  document.getElementById('feature-title').value = '';
  document.getElementById('feature-desc').value = '';
  document.getElementById('feature-icon').value = 'fa-solid fa-star';
  document.getElementById('feature-order').value = '0';
  document.getElementById('feature-status').value = 'active';

  document.getElementById('feature-modal-title').textContent = id ? 'Edit Feature' : 'Add Key Feature';
  openModal('feature-modal');
}

async function editFeature(id) {
  try {
    const { data } = await sb.from('features').select('*').eq('id', id).single();
    if (data) {
      document.getElementById('feature-edit-id').value = data.id;
      document.getElementById('feature-title').value = data.title || '';
      document.getElementById('feature-desc').value = data.description || '';
      document.getElementById('feature-icon').value = data.icon_class || 'fa-solid fa-star';
      document.getElementById('feature-order').value = data.display_order || 0;
      document.getElementById('feature-status').value = data.status || 'active';
      document.getElementById('feature-modal-title').textContent = 'Edit Feature';
      openModal('feature-modal');
    }
  } catch(e) {}
}

async function saveFeature() {
  const id = document.getElementById('feature-edit-id')?.value;
  const title = document.getElementById('feature-title')?.value.trim();
  if (!title) { showToast('Feature Title is required', 'error'); return; }

  const payload = {
    title,
    description: document.getElementById('feature-desc')?.value || '',
    icon_class: document.getElementById('feature-icon')?.value || 'fa-solid fa-star',
    display_order: parseInt(document.getElementById('feature-order')?.value || '0', 10),
    status: document.getElementById('feature-status')?.value || 'active'
  };

  try {
    if (id) {
      await sb.from('features').update(payload).eq('id', id);
      showToast('Feature updated successfully', 'success');
    } else {
      await sb.from('features').insert([payload]);
      showToast('New feature added successfully', 'success');
    }
    closeModal('feature-modal');
    await loadFeatures();
    await loadDashboardStats();
  } catch(e) {
    showToast('Error saving feature: ' + e.message, 'error');
  }
}

function confirmDeleteFeature(id) {
  showConfirm('Delete Feature?', 'Are you sure you want to delete this feature highlight?', async () => {
    try {
      await sb.from('features').delete().eq('id', id);
      showToast('Feature deleted successfully', 'success');
      await loadFeatures();
      await loadDashboardStats();
    } catch(e) { showToast('Delete failed: ' + e.message, 'error'); }
  });
}

async function toggleFeatureStatus(id, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  try {
    await sb.from('features').update({ status: newStatus }).eq('id', id);
    showToast(`Feature set to ${newStatus}`, 'info');
    await loadFeatures();
  } catch(e) {}
}

// ============================================================
// 4. VIEW OUR WORK / PROJECTS CMS MANAGEMENT
// ============================================================
async function loadProjects() {
  if (!sb) return;
  const tbody = document.getElementById('projects-tbody');
  if (!tbody) return;

  try {
    const { data, error } = await sb.from('projects').select('*').order('display_order', { ascending: true });
    if (error || !data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:24px">No projects recorded yet. Click "Add New Project" above.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.map(item => `
      <tr>
        <td><strong>${item.display_order || 0}</strong></td>
        <td>${item.image_url ? `<img src="${item.image_url}" style="width:36px;height:36px;object-fit:cover;border-radius:6px">` : `<i class="fa-solid fa-globe" style="font-size:20px;color:var(--accent)"></i>`}</td>
        <td><strong>${escapeHtml(item.title)}</strong></td>
        <td><span class="category-badge">${escapeHtml(item.category || 'General')}</span></td>
        <td>${item.project_link ? `<a href="${item.project_link}" target="_blank" class="table-link">${escapeHtml(item.project_link)}</a>` : '—'}</td>
        <td><span class="status-badge ${item.status === 'active' ? 'active' : 'inactive'}">${item.status || 'active'}</span></td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit" onclick="editProject('${item.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn toggle" onclick="toggleProjectStatus('${item.id}', '${item.status}')" title="Toggle Status"><i class="fa-solid fa-eye"></i></button>
            <button class="action-btn delete" onclick="confirmDeleteProject('${item.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:24px">Click "Add New Project" above to create your first portfolio project.</td></tr>`;
  }
}

function openProjectModal(id = null) {
  document.getElementById('project-edit-id').value = id || '';
  document.getElementById('project-title').value = '';
  document.getElementById('project-desc').value = '';
  document.getElementById('project-category').value = 'Websites';
  document.getElementById('project-link').value = '';
  document.getElementById('project-image-url').value = '';
  const prev = document.getElementById('project-image-preview');
  if (prev) { prev.style.display = 'none'; prev.innerHTML = ''; }
  document.getElementById('project-order').value = '0';
  document.getElementById('project-status').value = 'active';
  document.getElementById('project-modal-title').textContent = id ? 'Edit Project' : 'Add Project';
  openModal('project-modal');
}

async function editProject(id) {
  try {
    const { data } = await sb.from('projects').select('*').eq('id', id).single();
    if (data) {
      document.getElementById('project-edit-id').value = data.id;
      document.getElementById('project-title').value = data.title || '';
      document.getElementById('project-desc').value = data.description || '';
      document.getElementById('project-category').value = data.category || 'Websites';
      document.getElementById('project-link').value = data.project_link || '';
      document.getElementById('project-image-url').value = data.image_url || '';
      if (data.image_url) {
        showImagePreview('project-image-url', 'project-image-preview', data.image_url);
      } else {
        const prev = document.getElementById('project-image-preview');
        if (prev) { prev.style.display = 'none'; prev.innerHTML = ''; }
      }
      document.getElementById('project-order').value = data.display_order || 0;
      document.getElementById('project-status').value = data.status || 'active';
      document.getElementById('project-modal-title').textContent = 'Edit Project';
      openModal('project-modal');
    }
  } catch(e) {
    showToast('Error fetching project details: ' + e.message, 'error');
  }
}

async function saveProject() {
  const id = document.getElementById('project-edit-id')?.value;
  const title = document.getElementById('project-title')?.value.trim();
  if (!title) { showToast('Project Title is required', 'error'); return; }

  const payload = {
    title,
    description: document.getElementById('project-desc')?.value || '',
    category: document.getElementById('project-category')?.value || 'Websites',
    project_link: document.getElementById('project-link')?.value || '',
    image_url: document.getElementById('project-image-url')?.value || '',
    display_order: parseInt(document.getElementById('project-order')?.value || '0', 10),
    status: document.getElementById('project-status')?.value || 'active'
  };

  try {
    if (id) {
      const { error } = await sb.from('projects').update(payload).eq('id', id);
      if (error) throw error;
      showToast('Project updated successfully', 'success');
    } else {
      const { error } = await sb.from('projects').insert([payload]);
      if (error) throw error;
      showToast('New project added successfully', 'success');
    }
    closeModal('project-modal');
    await loadProjects();
    await loadDashboardStats();
  } catch(e) { showToast('Error saving project: ' + e.message, 'error'); }
}

function confirmDeleteProject(id) {
  showConfirm('Delete Project?', 'Are you sure you want to delete this project?', async () => {
    try {
      await sb.from('projects').delete().eq('id', id);
      showToast('Project deleted successfully', 'success');
      await loadProjects();
      await loadDashboardStats();
    } catch(e) { showToast('Delete failed: ' + e.message, 'error'); }
  });
}

async function toggleProjectStatus(id, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  try {
    await sb.from('projects').update({ status: newStatus }).eq('id', id);
    showToast(`Project status set to ${newStatus}`, 'info');
    await loadProjects();
  } catch(e) {}
}

// ============================================================
// 5. PRODUCTS CMS MANAGEMENT
// ============================================================
async function loadProducts() {
  if (!sb) return;
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;

  try {
    const { data, error } = await sb.from('products').select('*').order('display_order', { ascending: true });
    if (error || !data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:24px">No products recorded yet. Click "Add New Product" above.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.map(item => `
      <tr>
        <td><strong>${item.display_order || 0}</strong></td>
        <td><i class="fa-solid fa-box-open" style="font-size:20px;color:var(--cyan)"></i></td>
        <td><strong>${escapeHtml(item.name)}</strong></td>
        <td><span class="category-badge">${escapeHtml(item.category || 'SaaS Product')}</span></td>
        <td class="text-muted" style="max-width:240px">${escapeHtml(item.features || '')}</td>
        <td><span class="status-badge ${item.status === 'active' ? 'active' : 'inactive'}">${item.status || 'active'}</span></td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit" onclick="editProduct('${item.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn delete" onclick="confirmDeleteProduct('${item.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:24px">Click "Add New Product" above to add your first product.</td></tr>`;
  }
}

function openProductModal(id = null) {
  document.getElementById('product-edit-id').value = id || '';
  document.getElementById('product-name').value = '';
  document.getElementById('product-desc').value = '';
  document.getElementById('product-features').value = '';
  document.getElementById('product-link').value = '';
  document.getElementById('product-status').value = 'active';
  openModal('product-modal');
}

async function editProduct(id) {
  try {
    const { data } = await sb.from('products').select('*').eq('id', id).single();
    if (data) {
      document.getElementById('product-edit-id').value = data.id;
      document.getElementById('product-name').value = data.name || '';
      document.getElementById('product-desc').value = data.description || '';
      document.getElementById('product-features').value = data.features || '';
      document.getElementById('product-link').value = data.product_link || '';
      document.getElementById('product-status').value = data.status || 'active';
      openModal('product-modal');
    }
  } catch(e) {}
}

async function saveProduct() {
  const id = document.getElementById('product-edit-id')?.value;
  const name = document.getElementById('product-name')?.value.trim();
  if (!name) { showToast('Product Name is required', 'error'); return; }

  const payload = {
    name,
    description: document.getElementById('product-desc')?.value || '',
    features: document.getElementById('product-features')?.value || '',
    product_link: document.getElementById('product-link')?.value || '',
    status: document.getElementById('product-status')?.value || 'active'
  };

  try {
    if (id) {
      await sb.from('products').update(payload).eq('id', id);
      showToast('Product updated successfully', 'success');
    } else {
      await sb.from('products').insert([payload]);
      showToast('New product added successfully', 'success');
    }
    closeModal('product-modal');
    await loadProducts();
    await loadDashboardStats();
  } catch(e) { showToast('Error saving product: ' + e.message, 'error'); }
}

function confirmDeleteProduct(id) {
  showConfirm('Delete Product?', 'Are you sure you want to delete this product?', async () => {
    try {
      await sb.from('products').delete().eq('id', id);
      showToast('Product deleted', 'success');
      await loadProducts();
      await loadDashboardStats();
    } catch(e) { showToast('Delete failed: ' + e.message, 'error'); }
  });
}

// ============================================================
// 6. INDUSTRIES CMS MANAGEMENT
// ============================================================
async function loadIndustries() {
  if (!sb) return;
  const tbody = document.getElementById('industries-tbody');
  if (!tbody) return;

  try {
    const { data } = await sb.from('industries').select('*').order('display_order', { ascending: true });
    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:24px">No industries recorded. Click "Add Industry" above.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.map(item => `
      <tr>
        <td><strong>${item.display_order || 0}</strong></td>
        <td><i class="${item.icon_class || 'fa-solid fa-industry'}" style="font-size:20px;color:var(--accent)"></i></td>
        <td><strong>${escapeHtml(item.title)}</strong></td>
        <td class="text-muted">${escapeHtml(item.description || '')}</td>
        <td><span class="status-badge ${item.status === 'active' ? 'active' : 'inactive'}">${item.status || 'active'}</span></td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit" onclick="editIndustry('${item.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn delete" onclick="confirmDeleteIndustry('${item.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:24px">Click "Add Industry" above to record industries.</td></tr>`;
  }
}

function openIndustryModal(id = null) {
  document.getElementById('industry-edit-id').value = id || '';
  document.getElementById('ind-title').value = '';
  document.getElementById('ind-desc').value = '';
  document.getElementById('ind-icon').value = 'fa-solid fa-industry';
  document.getElementById('ind-status').value = 'active';
  openModal('industry-modal');
}

async function editIndustry(id) {
  try {
    const { data } = await sb.from('industries').select('*').eq('id', id).single();
    if (data) {
      document.getElementById('industry-edit-id').value = data.id;
      document.getElementById('ind-title').value = data.title || '';
      document.getElementById('ind-desc').value = data.description || '';
      document.getElementById('ind-icon').value = data.icon_class || 'fa-solid fa-industry';
      document.getElementById('ind-status').value = data.status || 'active';
      openModal('industry-modal');
    }
  } catch(e) {}
}

async function saveIndustry() {
  const id = document.getElementById('industry-edit-id')?.value;
  const title = document.getElementById('ind-title')?.value.trim();
  if (!title) { showToast('Industry Title is required', 'error'); return; }

  const payload = {
    title,
    description: document.getElementById('ind-desc')?.value || '',
    icon_class: document.getElementById('ind-icon')?.value || 'fa-solid fa-industry',
    status: document.getElementById('ind-status')?.value || 'active'
  };

  try {
    if (id) {
      await sb.from('industries').update(payload).eq('id', id);
    } else {
      await sb.from('industries').insert([payload]);
    }
    showToast('Industry saved successfully', 'success');
    closeModal('industry-modal');
    await loadIndustries();
    await loadDashboardStats();
  } catch(e) { showToast('Error: ' + e.message, 'error'); }
}

function confirmDeleteIndustry(id) {
  showConfirm('Delete Industry?', 'Are you sure you want to delete this industry?', async () => {
    try {
      await sb.from('industries').delete().eq('id', id);
      showToast('Industry deleted', 'success');
      await loadIndustries();
      await loadDashboardStats();
    } catch(e) {}
  });
}

// ============================================================
// 7. CAREERS CMS MANAGEMENT
// ============================================================
async function loadCareers() {
  if (!sb) return;
  const tbody = document.getElementById('careers-tbody');
  if (!tbody) return;

  try {
    const { data } = await sb.from('careers').select('*').order('display_order', { ascending: true });
    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:24px">No job openings recorded. Click "Add Job Opening" above.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.map(item => `
      <tr>
        <td><strong>${item.display_order || 0}</strong></td>
        <td><strong>${escapeHtml(item.job_title)}</strong></td>
        <td>${escapeHtml(item.department || 'Engineering')}</td>
        <td>${escapeHtml(item.location || 'Remote')}</td>
        <td><span class="category-badge">${escapeHtml(item.employment_type || 'Full Time')}</span></td>
        <td><span class="status-badge ${item.status === 'active' ? 'active' : 'inactive'}">${item.status || 'active'}</span></td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit" onclick="editCareer('${item.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn delete" onclick="confirmDeleteCareer('${item.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:24px">Click "Add Job Opening" above to create career opportunities.</td></tr>`;
  }
}

function openCareerModal(id = null) {
  document.getElementById('career-edit-id').value = id || '';
  document.getElementById('career-title').value = '';
  document.getElementById('career-dept').value = '';
  document.getElementById('career-loc').value = '';
  document.getElementById('career-type').value = 'Full Time';
  document.getElementById('career-exp').value = '';
  document.getElementById('career-desc').value = '';
  document.getElementById('career-status').value = 'active';
  openModal('career-modal');
}

async function editCareer(id) {
  try {
    const { data } = await sb.from('careers').select('*').eq('id', id).single();
    if (data) {
      document.getElementById('career-edit-id').value = data.id;
      document.getElementById('career-title').value = data.job_title || '';
      document.getElementById('career-dept').value = data.department || '';
      document.getElementById('career-loc').value = data.location || '';
      document.getElementById('career-type').value = data.employment_type || 'Full Time';
      document.getElementById('career-exp').value = data.experience || '';
      document.getElementById('career-desc').value = data.description || '';
      document.getElementById('career-status').value = data.status || 'active';
      openModal('career-modal');
    }
  } catch(e) {}
}

async function saveCareer() {
  const id = document.getElementById('career-edit-id')?.value;
  const job_title = document.getElementById('career-title')?.value.trim();
  if (!job_title) { showToast('Job Title is required', 'error'); return; }

  const payload = {
    job_title,
    department: document.getElementById('career-dept')?.value || '',
    location: document.getElementById('career-loc')?.value || '',
    employment_type: document.getElementById('career-type')?.value || 'Full Time',
    experience: document.getElementById('career-exp')?.value || '',
    description: document.getElementById('career-desc')?.value || '',
    status: document.getElementById('career-status')?.value || 'active'
  };

  try {
    if (id) {
      await sb.from('careers').update(payload).eq('id', id);
    } else {
      await sb.from('careers').insert([payload]);
    }
    showToast('Job opening saved', 'success');
    closeModal('career-modal');
    await loadCareers();
    await loadDashboardStats();
  } catch(e) { showToast('Error: ' + e.message, 'error'); }
}

function confirmDeleteCareer(id) {
  showConfirm('Delete Job Opening?', 'Are you sure you want to delete this job opening?', async () => {
    try {
      await sb.from('careers').delete().eq('id', id);
      showToast('Career opening deleted', 'success');
      await loadCareers();
      await loadDashboardStats();
    } catch(e) {}
  });
}

// ============================================================
// 8. TESTIMONIALS CMS MANAGEMENT
// ============================================================
async function loadTestimonials() {
  if (!sb) return;
  const tbody = document.getElementById('testimonials-tbody');
  if (!tbody) return;

  try {
    const { data } = await sb.from('testimonials').select('*').order('created_at', { ascending: false });
    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:24px">No testimonials found. Click "Add Testimonial" above.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.map(item => `
      <tr>
        <td><i class="fa-solid fa-user-circle" style="font-size:24px;color:var(--cyan)"></i></td>
        <td><strong>${escapeHtml(item.customer_name)}</strong></td>
        <td>${escapeHtml(item.position_company || item.client_role || 'Client')}</td>
        <td><span style="color:#f59e0b">${'★'.repeat(item.rating || 5)}</span></td>
        <td><span class="status-badge ${item.status === 'active' ? 'active' : 'inactive'}">${item.status || 'active'}</span></td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit" onclick="editTestimonial('${item.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn delete" onclick="confirmDeleteTestimonial('${item.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {}
}

function openTestimonialModal(id = null) {
  document.getElementById('test-edit-id').value = id || '';
  document.getElementById('test-name').value = '';
  document.getElementById('test-pos').value = '';
  document.getElementById('test-rating').value = '5';
  document.getElementById('test-message').value = '';
  document.getElementById('test-status').value = 'active';
  openModal('testimonial-modal');
}

async function editTestimonial(id) {
  try {
    const { data } = await sb.from('testimonials').select('*').eq('id', id).single();
    if (data) {
      document.getElementById('test-edit-id').value = data.id;
      document.getElementById('test-name').value = data.customer_name || '';
      document.getElementById('test-pos').value = data.position_company || '';
      document.getElementById('test-rating').value = data.rating || 5;
      document.getElementById('test-message').value = data.review_message || '';
      document.getElementById('test-status').value = data.status || 'active';
      openModal('testimonial-modal');
    }
  } catch(e) {}
}

async function saveTestimonial() {
  const id = document.getElementById('test-edit-id')?.value;
  const customer_name = document.getElementById('test-name')?.value.trim();
  if (!customer_name) { showToast('Customer Name is required', 'error'); return; }

  const payload = {
    customer_name,
    review_message: document.getElementById('test-message')?.value || '',
    rating: parseInt(document.getElementById('test-rating')?.value || '5', 10),
    status: document.getElementById('test-status')?.value || 'active'
  };

  try {
    if (id) {
      await sb.from('testimonials').update(payload).eq('id', id);
    } else {
      await sb.from('testimonials').insert([payload]);
    }
    showToast('Testimonial saved successfully', 'success');
    closeModal('testimonial-modal');
    await loadTestimonials();
    await loadDashboardStats();
  } catch(e) { showToast('Error: ' + e.message, 'error'); }
}

function confirmDeleteTestimonial(id) {
  showConfirm('Delete Testimonial?', 'Are you sure you want to delete this review?', async () => {
    try {
      await sb.from('testimonials').delete().eq('id', id);
      showToast('Testimonial deleted', 'success');
      await loadTestimonials();
      await loadDashboardStats();
    } catch(e) {}
  });
}

// ============================================================
// 9. FAQS CMS MANAGEMENT
// ============================================================
async function loadFaqs() {
  if (!sb) return;
  const tbody = document.getElementById('faqs-tbody');
  if (!tbody) return;

  try {
    const { data } = await sb.from('faqs').select('*').order('display_order', { ascending: true });
    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding:24px">No FAQs recorded. Click "Add New FAQ" above.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.map(item => `
      <tr>
        <td><strong>${item.display_order || 0}</strong></td>
        <td><strong>${escapeHtml(item.question)}</strong></td>
        <td class="text-muted" style="max-width:320px">${escapeHtml(item.answer)}</td>
        <td><span class="status-badge ${item.status === 'active' ? 'active' : 'inactive'}">${item.status || 'active'}</span></td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit" onclick="editFaq('${item.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn delete" onclick="confirmDeleteFaq('${item.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {}
}

function openFaqModal(id = null) {
  document.getElementById('faq-edit-id').value = id || '';
  document.getElementById('faq-question').value = '';
  document.getElementById('faq-answer').value = '';
  document.getElementById('faq-status').value = 'active';
  openModal('faq-modal');
}

async function editFaq(id) {
  try {
    const { data } = await sb.from('faqs').select('*').eq('id', id).single();
    if (data) {
      document.getElementById('faq-edit-id').value = data.id;
      document.getElementById('faq-question').value = data.question || '';
      document.getElementById('faq-answer').value = data.answer || '';
      document.getElementById('faq-status').value = data.status || 'active';
      openModal('faq-modal');
    }
  } catch(e) {}
}

async function saveFaq() {
  const id = document.getElementById('faq-edit-id')?.value;
  const question = document.getElementById('faq-question')?.value.trim();
  const answer = document.getElementById('faq-answer')?.value.trim();

  if (!question || !answer) { showToast('Question and Answer are required', 'error'); return; }

  const payload = { question, answer, status: document.getElementById('faq-status')?.value || 'active' };

  try {
    if (id) {
      await sb.from('faqs').update(payload).eq('id', id);
    } else {
      await sb.from('faqs').insert([payload]);
    }
    showToast('FAQ saved successfully', 'success');
    closeModal('faq-modal');
    await loadFaqs();
    await loadDashboardStats();
  } catch(e) { showToast('Error: ' + e.message, 'error'); }
}

function confirmDeleteFaq(id) {
  showConfirm('Delete FAQ?', 'Are you sure you want to delete this FAQ?', async () => {
    try {
      await sb.from('faqs').delete().eq('id', id);
      showToast('FAQ deleted', 'success');
      await loadFaqs();
      await loadDashboardStats();
    } catch(e) {}
  });
}

// ============================================================
// 10. GALLERY & MEDIA MANAGEMENT
// ============================================================
async function loadGallery() {
  if (!sb) return;
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  try {
    const { data } = await sb.from('gallery').select('*').order('created_at', { ascending: false });
    if (!data || data.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="padding:32px"><i class="fa-solid fa-images" style="font-size:32px"></i><h4>No gallery media uploaded yet</h4></div>`;
      return;
    }

    grid.innerHTML = data.map(item => `
      <div class="gallery-item">
        <img src="${item.image_url}" alt="${escapeHtml(item.name || 'Media')}">
        <div class="gallery-item-overlay">
          <button onclick="confirmDeleteGallery('${item.id}')" title="Delete Image"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `).join('');
  } catch(e) {}
}

async function handleGalleryUpload(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  showToast(`Uploading ${files.length} image(s)...`, 'info');

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.secure_url) {
        await sb.from('gallery').insert([{
          name: file.name,
          image_url: data.secure_url,
          public_id: data.public_id || '',
          file_size: file.size || 0
        }]);
      }
    } catch(err) {}
  }

  showToast('Gallery images uploaded successfully', 'success');
  await loadGallery();
  await loadDashboardStats();
}

function confirmDeleteGallery(id) {
  showConfirm('Delete Gallery Image?', 'Are you sure you want to delete this media asset?', async () => {
    try {
      await sb.from('gallery').delete().eq('id', id);
      showToast('Media image deleted', 'success');
      await loadGallery();
      await loadDashboardStats();
    } catch(e) {}
  });
}

// ============================================================
// 11. CONTACT REQUESTS CMS MANAGEMENT
// ============================================================
async function loadContacts() {
  if (!sb) return;
  const tbody = document.getElementById('contacts-tbody');
  const badge = document.getElementById('unread-badge');
  if (!tbody) return;

  try {
    const { data } = await sb.from('contact_requests').select('*').order('created_at', { ascending: false });
    const unreadCount = data ? data.filter(c => !c.is_read).length : 0;

    if (badge) {
      badge.textContent = unreadCount;
      badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }

    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding:24px">No contact inquiries received yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.map(item => `
      <tr class="${item.is_read ? '' : 'unread-row'}">
        <td><strong>${escapeHtml(item.name)}</strong></td>
        <td><a href="mailto:${item.email}" class="table-link">${escapeHtml(item.email || '—')}</a></td>
        <td>${escapeHtml(item.phone || '—')}</td>
        <td>${escapeHtml(item.subject || 'Inquiry')}</td>
        <td class="text-muted" style="max-width:200px">${escapeHtml(item.message || '')}</td>
        <td style="font-size:12px">${new Date(item.created_at).toLocaleDateString()}</td>
        <td><span class="status-badge ${item.is_read ? 'active' : 'inactive'}">${item.is_read ? 'Read' : 'Unread'}</span></td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit" onclick="viewContactDetails('${item.id}')" title="View Full Request"><i class="fa-solid fa-eye"></i></button>
            <button class="action-btn delete" onclick="confirmDeleteContact('${item.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {}
}

async function viewContactDetails(id) {
  try {
    const { data } = await sb.from('contact_requests').select('*').eq('id', id).single();
    if (data) {
      if (!data.is_read) {
        await sb.from('contact_requests').update({ is_read: true }).eq('id', id);
        await loadContacts();
      }
      const body = document.getElementById('contact-view-body');
      if (body) {
        body.innerHTML = `
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${escapeHtml(data.email)}</a></p>
          <p><strong>Phone:</strong> ${escapeHtml(data.phone || 'N/A')}</p>
          <p><strong>Subject:</strong> ${escapeHtml(data.subject || 'Website Inquiry')}</p>
          <p><strong>Received Date:</strong> ${new Date(data.created_at).toLocaleString()}</p>
          <hr style="border:none;border-top:1px solid var(--border);margin:12px 0;">
          <p><strong>Message:</strong></p>
          <div style="background:var(--bg-input);padding:14px;border-radius:8px;line-height:1.6">${escapeHtml(data.message || 'No message content.')}</div>
        `;
      }
      openModal('contact-view-modal');
    }
  } catch(e) {}
}

function confirmDeleteContact(id) {
  showConfirm('Delete Contact Inquiry?', 'Are you sure you want to delete this contact request?', async () => {
    try {
      await sb.from('contact_requests').delete().eq('id', id);
      showToast('Contact request deleted', 'success');
      await loadContacts();
      await loadDashboardStats();
    } catch(e) {}
  });
}

function filterContacts(query) {
  filterTable('contacts-tbody', query);
}

// ============================================================
// 12. WEBSITE SETTINGS MANAGEMENT
// ============================================================
async function loadWebsiteSettings() {
  if (!sb) return;
  try {
    const { data } = await sb.from('website_settings').select('*').limit(1).single();
    if (data) {
      const setV = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
      setV('ws-company-name', data.company_name);
      setV('ws-contact-number', data.contact_number);
      setV('ws-email', data.email_address || data.email);
      setV('ws-address', data.business_address || data.address);
      setV('ws-whatsapp', data.whatsapp_number);
      setV('ws-facebook', data.facebook_url);
      setV('ws-instagram', data.instagram_url);
      setV('ws-linkedin', data.linkedin_url);
      setV('ws-youtube', data.youtube_url);
      setV('ws-footer-content', data.footer_content);
      setV('ws-copyright', data.copyright_text);
    }
  } catch(e) {}
}

async function saveWebsiteSettings() {
  if (!sb) return;
  const payload = {
    company_name: document.getElementById('ws-company-name')?.value || '',
    contact_number: document.getElementById('ws-contact-number')?.value || '',
    email_address: document.getElementById('ws-email')?.value || '',
    business_address: document.getElementById('ws-address')?.value || '',
    whatsapp_number: document.getElementById('ws-whatsapp')?.value || '',
    facebook_url: document.getElementById('ws-facebook')?.value || '',
    instagram_url: document.getElementById('ws-instagram')?.value || '',
    linkedin_url: document.getElementById('ws-linkedin')?.value || '',
    youtube_url: document.getElementById('ws-youtube')?.value || '',
    footer_content: document.getElementById('ws-footer-content')?.value || '',
    copyright_text: document.getElementById('ws-copyright')?.value || ''
  };

  try {
    const { data: existing } = await sb.from('website_settings').select('id').limit(1);
    if (existing && existing.length > 0) {
      await sb.from('website_settings').update(payload).eq('id', existing[0].id);
    } else {
      await sb.from('website_settings').insert([payload]);
    }
    showToast('Website settings saved successfully!', 'success');
  } catch(e) { showToast('Error saving settings: ' + e.message, 'error'); }
}

// ============================================================
// 13. SEO SETTINGS MANAGEMENT
// ============================================================
async function loadSeoSettings() {
  if (!sb) return;
  try {
    const { data } = await sb.from('seo_settings').select('*').limit(1).single();
    if (data) {
      const setV = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
      setV('seo-title', data.meta_title);
      setV('seo-desc', data.meta_description);
      setV('seo-keywords', data.keywords);
      setV('seo-og-title', data.og_title);
      setV('seo-og-desc', data.og_description);
    }
  } catch(e) {}
}

async function saveSeoSettings() {
  if (!sb) return;
  const payload = {
    meta_title: document.getElementById('seo-title')?.value || '',
    meta_description: document.getElementById('seo-desc')?.value || '',
    keywords: document.getElementById('seo-keywords')?.value || '',
    og_title: document.getElementById('seo-og-title')?.value || '',
    og_description: document.getElementById('seo-og-desc')?.value || ''
  };

  try {
    const { data: existing } = await sb.from('seo_settings').select('id').limit(1);
    if (existing && existing.length > 0) {
      await sb.from('seo_settings').update(payload).eq('id', existing[0].id);
    } else {
      await sb.from('seo_settings').insert([payload]);
    }
    showToast('SEO Settings saved successfully!', 'success');
  } catch(e) { showToast('Error: ' + e.message, 'error'); }
}

// ============================================================
// 14. ADMIN PROFILE & ACCOUNT MANAGEMENT
// ============================================================
async function saveProfile() {
  const fullName = document.getElementById('profile-name')?.value.trim();
  if (!fullName) { showToast('Name is required', 'error'); return; }

  try {
    if (sb && sb.auth) {
      await sb.auth.updateUser({ data: { full_name: fullName } });
      const headerName = document.getElementById('header-admin-name');
      if (headerName) headerName.textContent = fullName;
      showToast('Admin profile updated', 'success');
    }
  } catch(e) { showToast('Profile update failed: ' + e.message, 'error'); }
}

async function changePassword() {
  const newPwd = document.getElementById('new-password')?.value;
  const confirmPwd = document.getElementById('confirm-password')?.value;

  if (!newPwd || newPwd.length < 6) {
    showToast('Password must be at least 6 characters long', 'error');
    return;
  }
  if (newPwd !== confirmPwd) {
    showToast('Passwords do not match', 'error');
    return;
  }

  try {
    const { error } = await sb.auth.updateUser({ password: newPwd });
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Password updated successfully in Supabase Auth!', 'success');
      document.getElementById('new-password').value = '';
      document.getElementById('confirm-password').value = '';
    }
  } catch(e) {
    showToast('Password change error: ' + e.message, 'error');
  }
}

// ============================================================
// CLOUDINARY MEDIA UPLOADER UTILITY
// ============================================================
async function uploadImageCloudinary(e, targetInputId, previewBoxId) {
  const file = e.target.files ? e.target.files[0] : null;
  if (!file) return;

  showToast('Uploading image to Cloudinary...', 'info');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.secure_url) {
      const input = document.getElementById(targetInputId);
      if (input) input.value = data.secure_url;
      showImagePreview(targetInputId, previewBoxId, data.secure_url);
      showToast('Image uploaded successfully!', 'success');
    } else {
      showToast('Upload failed: ' + (data.error?.message || 'Unknown error'), 'error');
    }
  } catch(err) {
    showToast('Cloudinary upload error: ' + err.message, 'error');
  }
}

function showImagePreview(inputId, previewId, url) {
  const box = document.getElementById(previewId);
  if (!box) return;
  if (url && url.trim()) {
    box.innerHTML = `<div style="position:relative;display:inline-block;"><img src="${escapeHtml(url)}" style="max-height:120px;border-radius:8px;object-fit:cover;border:1px solid var(--border-color)"><button type="button" onclick="removeImage('${inputId}', '${previewId}')" style="position:absolute;top:-6px;right:-6px;background:#ef4444;color:#fff;border:none;border-radius:50%;width:22px;height:22px;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center"><i class="fa-solid fa-xmark"></i></button></div>`;
    box.style.display = 'block';
  } else {
    box.style.display = 'none';
    box.innerHTML = '';
  }
}

function removeImage(inputId, previewId) {
  const input = document.getElementById(inputId);
  const box = document.getElementById(previewId);
  if (input) input.value = '';
  if (box) { box.style.display = 'none'; box.innerHTML = ''; }
}

// ============================================================
// UI UTILITIES: MODALS, CONFIRMS, TOASTS, FILTER
// ============================================================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

function showConfirm(title, message, onConfirm, confirmBtnText = 'Delete Item', btnClass = 'btn-danger', iconClass = 'fa-solid fa-trash') {
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-msg').textContent = message;
  currentConfirmCallback = onConfirm;

  const iconEl = document.querySelector('#confirm-modal .confirm-icon');
  if (iconEl) {
    if (confirmBtnText === 'Logout') {
      iconEl.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i>`;
      iconEl.style.color = '#ef4444';
    } else {
      iconEl.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
      iconEl.style.color = '#ef4444';
    }
  }

  const btn = document.getElementById('confirm-action-btn');
  if (btn) {
    btn.className = `btn ${btnClass}`;
    btn.innerHTML = `<i class="${iconClass}"></i> ${confirmBtnText}`;
    btn.onclick = async () => {
      closeModal('confirm-modal');
      if (currentConfirmCallback) await currentConfirmCallback();
    };
  }
  openModal('confirm-modal');
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info'}"></i> <span>${escapeHtml(msg)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function filterTable(tbodyId, query) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const q = (query || '').toLowerCase().trim();
  const rows = tbody.querySelectorAll('tr');
  rows.forEach(r => {
    const text = r.textContent.toLowerCase();
    r.style.display = text.includes(q) ? '' : 'none';
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
