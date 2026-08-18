/**
 * TRILOK INFOTECH PRIVATE LIMITED — INTERACTIVE JAVASCRIPT ENGINE
 * Handles animated hero canvas particles, scroll reveals, navbar scroll,
 * interactive flagship phone mockups (image copy 34 & 35 screen switching),
 * mobile drawer navigation, portfolio tab filtering, statistics counters,
 * testimonial carousel slider, modals, and WhatsApp inquiry.
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
    initPhoneMockupClick();
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
   2. INTERACTIVE FLAGSHIP PHONE MOCKUP CLICK (IMAGE COPY 34 & 35)
   ========================================================================== */
function initPhoneMockupClick() {
    const box = document.getElementById('phones-interactive-box');
    const frontPhone = document.getElementById('phone-front');
    const backPhone = document.getElementById('phone-back');

    if (!box || !frontPhone || !backPhone) return;

    let isSwapped = false;

    function togglePhones() {
        isSwapped = !isSwapped;
        if (isSwapped) {
            backPhone.classList.add('active-front');
            frontPhone.classList.add('active-back');
        } else {
            backPhone.classList.remove('active-front');
            frontPhone.classList.remove('active-back');
        }
    }

    box.addEventListener('click', togglePhones);
}

/* ==========================================================================
   3. SCROLL REVEAL ANIMATIONS
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
   4. NAVBAR SCROLL EFFECT & ACTIVE STATE
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
   5. MOBILE DRAWER NAVIGATION
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
   6. STATISTICS COUNTER ANIMATION
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
   7. PORTFOLIO TAB FILTERING
   ========================================================================== */
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length === 0 || projectCards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter') || 'all';

            projectCards.forEach(card => {
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
   8. CLIENT TESTIMONIALS CAROUSEL SLIDER
   ========================================================================== */
function initTestimonialCarousel() {
    const quoteEl = document.getElementById('t-quote');
    const nameEl = document.getElementById('t-name');
    const roleEl = document.getElementById('t-role');
    const dots = document.querySelectorAll('.carousel-indicators .dot');

    if (!quoteEl || !nameEl) return;

    const testimonials = [
        {
            quote: '"Trilok Infotech delivered our corporate website and web platform beyond expectations. Great team, excellent support!"',
            name: 'Srinivas P',
            role: 'Business Owner & Founder'
        },
        {
            quote: '"The eSaleAgreement platform completely transformed our legal documentation process. Aadhaar eKYC and eSign are seamless!"',
            name: 'Rajesh Kumar',
            role: 'Real Estate Developer'
        },
        {
            quote: '"Exceptional mobile app development service. Clean code, beautiful UI, and 24/7 technical support from Trilok Infotech."',
            name: 'Anusha Rao',
            role: 'Tech Lead & Client'
        }
    ];

    let currentIndex = 0;

    function showTestimonial(index) {
        currentIndex = index;
        const item = testimonials[currentIndex];

        quoteEl.style.opacity = '0';
        setTimeout(() => {
            quoteEl.textContent = item.quote;
            nameEl.textContent = item.name;
            roleEl.textContent = item.role;
            quoteEl.style.opacity = '1';
        }, 150);

        dots.forEach((d, idx) => {
            if (idx === currentIndex) d.classList.add('active');
            else d.classList.remove('active');
        });
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => showTestimonial(idx));
    });

    setInterval(() => {
        let nextIdx = (currentIndex + 1) % testimonials.length;
        showTestimonial(nextIdx);
    }, 6000);
}

/* ==========================================================================
   9. MODAL POPUP & INQUIRY FORM (WHATSAPP INTEGRATION)
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
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('cust-name')?.value || '';
            const phone = document.getElementById('cust-phone')?.value || '';
            const email = document.getElementById('cust-email')?.value || '';
            const service = document.getElementById('cust-service')?.value || 'General Inquiry';
            const message = document.getElementById('cust-message')?.value || '';
            const subject = subjectInput?.value || 'Website Inquiry';

            const whatsappText = `Hello Trilok Infotech,\n\nInquiry: ${subject}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`;

            window.open(`https://wa.me/918639833447?text=${encodeURIComponent(whatsappText)}`, '_blank');

            alert('Thank you! Your inquiry details have been captured and opened on WhatsApp (+91 8639833447).');
            closeModal();
            form.reset();
        });
    }
}

/* ==========================================================================
   10. SERVICE DETAIL POPUP MODAL
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
