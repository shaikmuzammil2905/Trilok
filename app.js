/**
 * TRILOK INFOTECH PRIVATE LIMITED — INTERACTIVE JAVASCRIPT ENGINE
 * Handles animated hero canvas particles, scroll reveals, navbar scroll,
 * mobile drawer navigation, portfolio tab filtering, statistics counters,
 * testimonial carousel slider, modals, and WhatsApp inquiry.
 * Live Supabase Database Sync for single source of truth website CMS data.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initScrollReveal();
    initNavbarScroll();
    initMobileDrawer();
    initStatsCounters();
    initPortfolioFilters();
    initTestimonialCarousel();
    initModalSystem();
    initServiceModals();
    initLiveCmsSync();
});

/* ==========================================================================
   1. HERO ANIMATED DYNAMIC BRIGHT CANVAS PARTICLES & GLOWING NETWORK
   ========================================================================== */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight || window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 14), 70);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.2;
            this.vy = (Math.random() - 0.5) * 1.2;
            this.radius = Math.random() * 3 + 1.5;
            this.alpha = Math.random() * 0.8 + 0.2;
            this.color = Math.random() > 0.35 ? '#00f2fe' : '#1688f7';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.shadowBlur = 16;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 145) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = '#00f2fe';
                    ctx.globalAlpha = (1 - dist / 145) * 0.45;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   2. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. NAVBAR SCROLL EFFECT & ACTIVE STATE
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   4. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const closeBtn = document.getElementById('drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (!toggleBtn || !drawer) return;

    function openDrawer() {
        drawer.classList.add('open');
        if (overlay) overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });
}

/* ==========================================================================
   5. STATISTICS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounters() {
    const counters = document.querySelectorAll('.counter-num');
    if (counters.length === 0) return;

    let animated = false;

    function startCounting() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target') || '0', 10);
            let count = 0;
            const speed = Math.max(10, Math.floor(2000 / target));

            const update = () => {
                count += Math.ceil(target / 50);
                if (count >= target) {
                    counter.textContent = target;
                } else {
                    counter.textContent = count;
                    setTimeout(update, speed);
                }
            };
            update();
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                startCounting();
            }
        });
    }, { threshold: 0.3 });

    const statsBar = document.querySelector('.stats-counter-bar');
    if (statsBar) observer.observe(statsBar);
    else startCounting();
}

/* ==========================================================================
   6. PORTFOLIO TAB FILTERING
   ========================================================================== */
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter') || 'all';

            document.querySelectorAll('.project-card').forEach(card => {
                const category = card.getAttribute('data-category') || '';
                
                if (filter === 'all' || category.toLowerCase().includes(filter.toLowerCase())) {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });
}

/* ==========================================================================
   7. CLIENT TESTIMONIALS CAROUSEL SLIDER
   ========================================================================== */
function initTestimonialCarousel() {
    const quoteEl = document.getElementById('t-quote');
    const nameEl = document.getElementById('t-name');
    const roleEl = document.getElementById('t-role');
    const dots = document.querySelectorAll('.carousel-indicators .dot');

    if (!quoteEl || !nameEl) return;

    window.updateTestimonialsCarousel = function(testimonials) {
        if (!testimonials || testimonials.length === 0) return;
        let currentIndex = 0;

        function showTestimonial(index) {
            currentIndex = index % testimonials.length;
            const item = testimonials[currentIndex];

            quoteEl.style.opacity = '0';
            setTimeout(() => {
                quoteEl.textContent = `"${item.review_message || item.quote || ''}"`;
                nameEl.textContent = item.customer_name || item.name || '';
                roleEl.textContent = item.position_company || item.role || '';
                quoteEl.style.opacity = '1';
            }, 150);

            dots.forEach((d, idx) => {
                if (idx === currentIndex) d.classList.add('active');
                else d.classList.remove('active');
            });
        }

        dots.forEach((dot, idx) => {
            dot.onclick = () => showTestimonial(idx);
        });

        if (window.tCarouselInterval) clearInterval(window.tCarouselInterval);
        window.tCarouselInterval = setInterval(() => {
            showTestimonial(currentIndex + 1);
        }, 6000);

        showTestimonial(0);
    };
}

/* ==========================================================================
   8. MODAL POPUP & INQUIRY FORM (SUPABASE + WHATSAPP INTEGRATION)
   ========================================================================== */
function initModalSystem() {
    const contactModal = document.getElementById('contact-modal');
    const modalClose = document.getElementById('modal-close');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const form = document.getElementById('customer-inquiry-form');
    const subjectInput = document.getElementById('form-subject');

    if (!contactModal) return;

    function openModal(subject = 'General Inquiry') {
        if (subjectInput) subjectInput.value = subject;
        contactModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        contactModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const subject = btn.getAttribute('data-subject') || 'General Inquiry';
            openModal(subject);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);

    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal.classList.contains('open')) {
            closeModal();
        }
    });

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('cust-name')?.value || '';
            const phone = document.getElementById('cust-phone')?.value || '';
            const email = document.getElementById('cust-email')?.value || '';
            const service = document.getElementById('cust-service')?.value || 'General Inquiry';
            const message = document.getElementById('cust-message')?.value || '';
            const subject = subjectInput?.value || 'Website Inquiry';

            // Insert into Supabase contact_requests table
            if (window.sbClient) {
                try {
                    await window.sbClient.from('contact_requests').insert([{
                        name, phone, email, subject: `${subject} - ${service}`, message, is_read: false
                    }]);
                } catch(err) {
                    console.error("Failed to save contact request to database:", err);
                }
            }

            const whatsappText = `Hello Trilok Infotech,\n\nInquiry: ${subject}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`;
            window.open(`https://wa.me/918639833447?text=${encodeURIComponent(whatsappText)}`, '_blank');

            alert('Thank you! Your inquiry has been sent. Our team will contact you shortly.');
            closeModal();
            form.reset();
        });
    }
}

/* ==========================================================================
   9. SERVICE DETAIL POPUP MODAL
   ========================================================================== */
function initServiceModals() {
    const serviceModal = document.getElementById('service-modal');
    const serviceClose = document.getElementById('service-modal-close');
    const serviceBtns = document.querySelectorAll('.open-service-modal');
    const titleEl = document.getElementById('svc-modal-title');
    const descEl = document.getElementById('svc-modal-desc');

    if (!serviceModal) return;

    serviceBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const title = btn.getAttribute('data-title') || 'Service Detail';
            const desc = btn.getAttribute('data-desc') || '';

            if (titleEl) titleEl.textContent = title;
            if (descEl) descEl.textContent = desc;

            serviceModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeServiceModal() {
        serviceModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (serviceClose) serviceClose.addEventListener('click', closeServiceModal);

    serviceModal.addEventListener('click', (e) => {
        if (e.target === serviceModal) closeServiceModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && serviceModal.classList.contains('open')) {
            closeServiceModal();
        }
    });
}

/* ==========================================================================
   LIVE SUPABASE CMS SYNC — SINGLE SOURCE OF TRUTH FOR MAIN WEBSITE
   ========================================================================== */
async function initLiveCmsSync() {
    const SUPABASE_URL = 'https://gotrpjxnrmocsrfxauyz.supabase.co';
    const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdHJwanhucm1vY3NyZnhhdXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MjI1MDgsImV4cCI6MjEwMTQ5ODUwOH0.h5FE6bQp6wp7DyQJaec-CT9pmhrlm1S42u4dWwKGOrU';
    
    let sb = null;
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
        window.sbClient = sb;
    } else {
        return;
    }

    // 1. Website Settings & SEO
    try {
        const { data: ws } = await sb.from('website_settings').select('*').limit(1).single();
        if (ws) {
            if (ws.contact_number) {
                document.querySelectorAll('.footer-contact-info div:nth-child(2), .contact-phone-text').forEach(el => {
                    el.innerHTML = `<i class="fa-solid fa-phone text-cyan"></i> ${ws.contact_number}`;
                });
            }
            if (ws.email_address || ws.email) {
                const em = ws.email_address || ws.email;
                document.querySelectorAll('.footer-contact-info div:nth-child(3), .contact-email-text').forEach(el => {
                    el.innerHTML = `<i class="fa-solid fa-envelope text-cyan"></i> ${em}`;
                });
            }
            if (ws.business_address || ws.address) {
                const addr = ws.business_address || ws.address;
                document.querySelectorAll('.footer-contact-info div:nth-child(1), .contact-address-text').forEach(el => {
                    el.innerHTML = `<i class="fa-solid fa-location-dot text-cyan"></i> ${addr}`;
                });
            }
            if (ws.logo_url) {
                document.querySelectorAll('.logo-header-img, .logo-footer-img').forEach(img => {
                    img.src = ws.logo_url;
                });
            }
            if (ws.footer_content) {
                const fDesc = document.querySelector('.footer-brand-desc');
                if (fDesc) fDesc.textContent = ws.footer_content;
            }
            if (ws.copyright_text) {
                const copyEl = document.querySelector('.footer-bottom p');
                if (copyEl) copyEl.textContent = ws.copyright_text;
            }
        }
    } catch(e) {}

    // 2. SEO Settings
    try {
        const { data: seo } = await sb.from('seo_settings').select('*').limit(1).single();
        if (seo) {
            if (seo.meta_title) document.title = seo.meta_title;
            if (seo.meta_description) {
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) metaDesc.setAttribute('content', seo.meta_description);
            }
        }
    } catch(e) {}

    // 3. Hero Section
    try {
        const { data: hero } = await sb.from('hero_settings').select('*').limit(1).single();
        if (hero) {
            const hSec = document.querySelector('.hero-section');
            if (hSec && hero.is_visible === false) {
                hSec.style.display = 'none';
            } else if (hSec) {
                hSec.style.display = 'block';
                const hTitle = document.querySelector('.hero-title');
                if (hTitle && hero.heading) hTitle.innerHTML = hero.heading.replace(/\n/g, '<br>');
                const hSub = document.querySelector('.hero-subtitle');
                if (hSub && (hero.sub_heading || hero.subheading)) hSub.innerHTML = `"${hero.sub_heading || hero.subheading}"`;
                const cta1 = document.querySelector('.hero-buttons .btn-primary');
                if (cta1 && hero.cta_primary_text) cta1.innerHTML = `${hero.cta_primary_text} <i class="fa-solid fa-arrow-right"></i>`;
                const cta2 = document.querySelector('.hero-buttons .btn-outline-white');
                if (cta2 && hero.cta_secondary_text) cta2.innerHTML = `${hero.cta_secondary_text} <i class="fa-solid fa-desktop"></i>`;
            }
        }
    } catch(e) {}

    // 4. About Us Section
    try {
        const { data: about } = await sb.from('about_settings').select('*').limit(1).single();
        if (about) {
            const whySec = document.querySelector('.why-section');
            if (whySec && about.is_visible === false) {
                whySec.style.display = 'none';
            } else if (whySec) {
                const titleEl = whySec.querySelector('.main-title');
                if (titleEl && about.heading) titleEl.textContent = about.heading;
                const subEl = whySec.querySelector('.section-subtitle');
                if (subEl && about.content) subEl.textContent = about.content;
            }
        }
    } catch(e) {}

    // 5. Services Section
    try {
        const { data: services } = await sb.from('services').select('*').eq('status', 'active').order('display_order');
        if (services && services.length > 0) {
            const sGrid = document.querySelector('.services-grid');
            if (sGrid) {
                sGrid.innerHTML = services.map(s => `
                    <div class="service-card scroll-reveal visible" data-service-id="${s.id}">
                        <div class="service-icon-box">
                            ${s.image_url ? `<img src="${s.image_url}" alt="${s.title}" style="width:36px;height:36px;object-fit:contain;">` : `<i class="${s.icon_class || 'fa-solid fa-laptop-code'}"></i>`}
                        </div>
                        <h3 class="service-title">${s.title}</h3>
                        <p class="service-desc">${s.short_desc || s.description || ''}</p>
                        <button class="service-card-btn open-service-modal" data-title="${s.title}" data-desc="${s.description || s.short_desc || ''}">
                            Learn More <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                `).join('');
                initServiceModals();
            }
        }
    } catch(e) {}

    // 5.5 Features Section
    try {
        const { data: features } = await sb.from('features').select('*').eq('status', 'active').order('display_order');
        if (features && features.length > 0) {
            const fGrid = document.querySelector('.features-grid, .why-features-grid');
            if (fGrid) {
                fGrid.innerHTML = features.map(f => `
                    <div class="feature-card scroll-reveal visible">
                        <div class="feature-icon"><i class="${f.icon_class || 'fa-solid fa-star'}"></i></div>
                        <h3>${f.title}</h3>
                        <p>${f.description || ''}</p>
                    </div>
                `).join('');
            }
        }
    } catch(e) {}

    // 6. View Our Work / Projects Section
    try {
        const { data: projects } = await sb.from('projects').select('*').eq('status', 'active').order('display_order');
        if (projects && projects.length > 0) {
            const pGrids = document.querySelectorAll('.portfolio-grid, #works-grid, #portfolio-grid');
            pGrids.forEach(pGrid => {
                pGrid.innerHTML = projects.map(p => `
                    <div class="project-card scroll-reveal visible" data-category="${p.category || 'Websites'}">
                        <div class="project-card-header">
                            <span class="project-badge">${p.category ? p.category.toUpperCase() : 'PROJECT'}</span>
                            <i class="fa-solid fa-file-contract text-blue" style="font-size:1.4rem;"></i>
                        </div>
                        <div class="project-body">
                            <h3 class="project-title">${p.title}</h3>
                            <div class="project-domain"><i class="fa-solid fa-globe"></i> ${p.project_link ? p.project_link.replace('https://','').replace('http://','').replace(/\/$/,'') : 'trilokinfotech.com'}</div>
                            <p class="project-desc">${p.description || ''}</p>
                            ${p.project_link ? `<a href="${p.project_link}" target="_blank" rel="noopener noreferrer" class="project-btn">View Project <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
                        </div>
                    </div>
                `).join('');
            });
            initPortfolioFilters();
        }
    } catch(e) {}

    // 7. Products Section
    try {
        const { data: products } = await sb.from('products').select('*').eq('status', 'active').order('display_order');
        if (products && products.length > 0) {
            const prod = products[0];
            const pTitle = document.querySelector('.product-banner-card .product-subtitle');
            if (pTitle && prod.name) pTitle.textContent = prod.name;
            const pDesc = document.querySelector('.product-banner-card .product-desc');
            if (pDesc && prod.description) pDesc.textContent = prod.description;
        }
    } catch(e) {}

    // 8. Industries Section
    try {
        const { data: industries } = await sb.from('industries').select('*').eq('status', 'active').order('display_order');
        if (industries && industries.length > 0) {
            const iGrid = document.querySelector('.industries-grid');
            if (iGrid) {
                iGrid.innerHTML = industries.map(ind => `
                    <div class="industry-card scroll-reveal visible">
                        <i class="${ind.icon_class || 'fa-solid fa-industry'}"></i>
                        <h4>${ind.title}</h4>
                    </div>
                `).join('');
            }
        }
    } catch(e) {}

    // 9. Careers Section
    try {
        const { data: careers } = await sb.from('careers').select('*').eq('status', 'active').order('display_order');
        if (careers && careers.length > 0) {
            const cGrid = document.querySelector('#careers .services-grid');
            if (cGrid) {
                cGrid.innerHTML = careers.map(c => `
                    <div class="service-card scroll-reveal visible">
                        <span class="project-badge" style="width:max-content; margin-bottom:12px;">${c.employment_type || 'Full Time'}</span>
                        <h3 class="service-title">${c.job_title}</h3>
                        <p class="service-desc"><i class="fa-solid fa-location-dot text-blue"></i> ${c.location || 'Hyderabad'}<br>${c.description || ''}</p>
                        <button class="btn btn-primary open-modal-btn" data-subject="Career Application: ${c.job_title}">Apply Now</button>
                    </div>
                `).join('');
            }
        }
    } catch(e) {}

    // 10. Testimonials
    try {
        const { data: testimonials } = await sb.from('testimonials').select('*').eq('status', 'active').order('created_at', { ascending: false });
        if (testimonials && testimonials.length > 0 && typeof window.updateTestimonialsCarousel === 'function') {
            window.updateTestimonialsCarousel(testimonials);
        }
    } catch(e) {}

    // 11. FAQs
    try {
        const { data: faqs } = await sb.from('faqs').select('*').eq('status', 'active').order('display_order');
        if (faqs && faqs.length > 0) {
            const faqWrap = document.querySelector('.faq-accordion');
            if (faqWrap) {
                faqWrap.innerHTML = faqs.map(f => `
                    <div class="faq-item">
                        <div class="faq-header">
                            <h4>${f.question}</h4>
                            <i class="fa-solid fa-chevron-down"></i>
                        </div>
                        <div class="faq-body">
                            <p>${f.answer}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch(e) {}
}
