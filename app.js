/**
 * TRILOK INFOTECH PRIVATE LIMITED - INTERACTIVE JAVASCRIPT ENGINE
 * Handles Canvas globe animation, typing counters, scroll reveals,
 * mobile drawer navigation, and WhatsApp form submission (+91 8639833447).
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initScrollNavbar();
    initMobileDrawer();
    initScrollReveal();
    initTypingCounters();
    initSmoothNavigation();
    initModalSystem();
    initWhatsAppForm();
    initPhoneMockupTabs();
    initServiceModalSystem();
});

/* ==========================================================================
   1. HERO CANVAS ANIMATED DIGITAL GLOBE / NETWORK
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
    const particleCount = Math.min(Math.floor(width / 15), 65);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.6 + 0.2;
            this.color = Math.random() > 0.4 ? '#00f2fe' : '#4364F7';
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
            ctx.shadowBlur = 10;
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

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = '#00f2fe';
                    ctx.globalAlpha = (1 - dist / 130) * 0.25;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }

        particles.forEach((p) => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   2. NAVBAR STICKY & ACTIVE HIGHLIGHT
   ========================================================================== */
function initScrollNavbar() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section, footer');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        let currentSection = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   3. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const drawerClose = document.getElementById('drawer-close');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', () => {
            mobileDrawer.classList.add('open');
        });
    }

    if (drawerClose && mobileDrawer) {
        drawerClose.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
        });
    }

    drawerLinks.forEach((link) => {
        link.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
        });
    });
}

/* ==========================================================================
   4. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   5. TYPING MODE & NUMBER COUNTERS
   ========================================================================== */
function initTypingCounters() {
    const numElements = document.querySelectorAll('.typing-num');
    const textElements = document.querySelectorAll('.typing-text');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const targetEl = entry.target;

                if (targetEl.classList.contains('typing-num')) {
                    animateNumber(targetEl);
                } else if (targetEl.classList.contains('typing-text')) {
                    animateTypingText(targetEl);
                }

                obs.unobserve(targetEl);
            }
        });
    }, { threshold: 0.3 });

    numElements.forEach((el) => observer.observe(el));
    textElements.forEach((el) => observer.observe(el));
}

function animateNumber(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    let current = 0;
    const duration = 1800; // ms
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;

    el.classList.add('typing-cursor');

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
            el.classList.remove('typing-cursor');
        }
        el.textContent = Math.floor(current) + suffix;
    }, stepTime);
}

function animateTypingText(el) {
    const text = el.getAttribute('data-text') || '';
    el.textContent = '';
    el.classList.add('typing-cursor');
    let index = 0;

    const timer = setInterval(() => {
        if (index < text.length) {
            el.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(timer);
            el.classList.remove('typing-cursor');
        }
    }, 120);
}

/* ==========================================================================
   6. SMOOTH BUTTON NAVIGATION
   ========================================================================== */
function initSmoothNavigation() {
    const smoothLinks = document.querySelectorAll('a[href^="#"]');

    smoothLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================================================
   7. CUSTOMER FORM MODAL SYSTEM
   ========================================================================== */
function initModalSystem() {
    const modal = document.getElementById('contact-modal');
    const closeBtn = document.getElementById('modal-close');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const formSubjectInput = document.getElementById('form-subject');
    const modalTitle = document.getElementById('modal-title');
    const serviceSelect = document.getElementById('cust-service');

    if (!modal) return;

    openBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const subject = btn.getAttribute('data-subject') || 'General Inquiry';
            
            if (formSubjectInput) formSubjectInput.value = subject;
            if (modalTitle) {
                modalTitle.textContent = subject.includes('Career') ? 'Submit Application Details' : 'Fill Customer Details';
            }

            // Auto select matching service if applicable
            if (serviceSelect) {
                if (subject.includes('Software')) serviceSelect.value = 'Software Development';
                else if (subject.includes('Cybersecurity')) serviceSelect.value = 'Cybersecurity Services';
                else if (subject.includes('eSaleAgreement')) serviceSelect.value = 'eSaleAgreement Platform';
                else if (subject.includes('Network')) serviceSelect.value = 'Network Infrastructure';
                else if (subject.includes('Cloud')) serviceSelect.value = 'Cloud Solutions';
                else if (subject.includes('AI')) serviceSelect.value = 'AI & Automation';
            }

            modal.classList.add('open');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('open');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            modal.classList.remove('open');
        }
    });
}

/* ==========================================================================
   8. WHATSAPP FORM SUBMISSION (+91 8639833447)
   ========================================================================== */
function initWhatsAppForm() {
    const form = document.getElementById('customer-inquiry-form');
    const modal = document.getElementById('contact-modal');
    const targetPhoneNumber = '918639833447';

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('cust-name').value.trim();
        const phone = document.getElementById('cust-phone').value.trim();
        const email = document.getElementById('cust-email').value.trim();
        const service = document.getElementById('cust-service').value;
        const company = document.getElementById('cust-company').value.trim() || 'N/A';
        const message = document.getElementById('cust-message').value.trim();
        const subject = document.getElementById('form-subject').value || 'Customer Inquiry';

        // Construct clean formatted WhatsApp text
        const waMessage = 
`*TRILOK INFOTECH WEBSITE INQUIRY* 🚀
----------------------------------------
📌 *Subject:* ${subject}
👤 *Name:* ${name}
📞 *Phone:* ${phone}
✉️ *Email:* ${email}
🏢 *Company/City:* ${company}
💼 *Interested In:* ${service}

📝 *Requirement Details:*
${message}
----------------------------------------
_Sent from Trilok Infotech Official Portal_`;

        const encodedText = encodeURIComponent(waMessage);
        const whatsappUrl = `https://wa.me/${targetPhoneNumber}?text=${encodedText}`;

        // Close modal
        if (modal) modal.classList.remove('open');

        // Reset form
        form.reset();

        // Redirect to WhatsApp
        window.open(whatsappUrl, '_blank');
    });
}

/* ==========================================================================
   9. INTERACTIVE PHONE MOCKUP TABS
   ========================================================================== */
function initPhoneMockupTabs() {
    const tabItems = document.querySelectorAll('.phone-tabs .tab-item');
    tabItems.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabItems.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

/* ==========================================================================
   10. INTERACTIVE SERVICE & OPTION DETAILS POPUP
   ========================================================================== */
function initServiceModalSystem() {
    const serviceCards = document.querySelectorAll('.service-card, .service-arrow');
    const serviceModal = document.getElementById('service-details-modal');
    const closeBtn = document.getElementById('service-modal-close');
    const titleEl = document.getElementById('svc-modal-title');
    const descEl = document.getElementById('svc-modal-desc');
    const iconEl = document.getElementById('svc-modal-icon');
    const featuresList = document.getElementById('svc-modal-features-list');
    const inquireBtn = document.getElementById('svc-modal-inquire-btn');

    const serviceData = {
        'Software Development': {
            icon: 'fa-solid fa-code',
            category: 'CUSTOM SOFTWARE & SAAS',
            desc: 'Custom enterprise web applications, cross-platform mobile apps, cloud microservices architectures, and scalable SaaS platforms built with high security and performance.',
            features: [
                'Custom Full-Stack Web & Mobile App Development',
                'Scalable Microservices & Cloud-Native Architectures',
                'API Integration, DevOps & Continuous Delivery'
            ]
        },
        'Cybersecurity Services': {
            icon: 'fa-solid fa-shield-halved',
            category: 'CYBER DEFENSE & COMPLIANCE',
            desc: 'Comprehensive security audits, Vulnerability Assessment & Penetration Testing (VAPT), SIEM monitoring, SOC consulting, and ISO 27001 / SOC2 compliance.',
            features: [
                'Vulnerability Assessment & Penetration Testing (VAPT)',
                '24/7 Security Operations Center (SOC) & SIEM Monitoring',
                'Cloud Security Audits, Encryption & Regulatory Compliance'
            ]
        },
        'Network Infrastructure': {
            icon: 'fa-solid fa-network-wired',
            category: 'ENTERPRISE NETWORKING',
            desc: 'Robust enterprise data center setups, secure Wi-Fi deployment, high-throughput VPNs, next-gen firewalls, and SD-WAN network architecture.',
            features: [
                'Enterprise Data Center & Server Infrastructure',
                'Next-Gen Firewalls, VPN & Secure SD-WAN Solutions',
                'High-Speed Managed Wi-Fi & Network Topology Design'
            ]
        },
        'Cloud Solutions': {
            icon: 'fa-solid fa-cloud',
            category: 'CLOUD MIGRATION & MANAGEMENT',
            desc: 'End-to-end cloud strategy, AWS/Azure/GCP migration, hybrid cloud management, containerization with Docker/Kubernetes, and cost optimization.',
            features: [
                'AWS, Azure & Google Cloud Migration & Optimization',
                'Kubernetes & Docker Microservices Orchestration',
                'Disaster Recovery, High Availability & Automated Backups'
            ]
        },
        'AI & Automation': {
            icon: 'fa-solid fa-robot',
            category: 'INTELLIGENT AUTOMATION',
            desc: 'Custom AI chatbots, robotic process automation (RPA), intelligent predictive workflow automation, LLM integrations, and business analytics engines.',
            features: [
                'Custom AI Chatbots & Natural Language Processing',
                'Robotic Process Automation (RPA) for Enterprise Workflows',
                'Predictive Data Analytics & Automated Business Insights'
            ]
        }
    };

    serviceCards.forEach((card) => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.open-modal-btn') && !e.target.closest('.service-arrow')) return;

            const cardTitleEl = card.querySelector('.service-title') || card.closest('.service-card')?.querySelector('.service-title');
            const title = cardTitleEl ? cardTitleEl.textContent.trim() : 'Software Development';
            const data = serviceData[title] || serviceData['Software Development'];

            if (titleEl) titleEl.textContent = title;
            if (descEl) descEl.textContent = data.desc;
            if (iconEl) iconEl.innerHTML = `<i class="${data.icon}"></i>`;
            if (inquireBtn) inquireBtn.setAttribute('data-subject', `${title} Direct Inquiry`);

            if (featuresList) {
                featuresList.innerHTML = data.features
                    .map((f) => `<li><i class="fa-solid fa-circle-check text-green"></i> ${f}</li>`)
                    .join('');
            }

            if (serviceModal) serviceModal.classList.add('open');
        });
    });

    if (closeBtn && serviceModal) {
        closeBtn.addEventListener('click', () => serviceModal.classList.remove('open'));
    }

    if (serviceModal) {
        serviceModal.addEventListener('click', (e) => {
            if (e.target === serviceModal) serviceModal.classList.remove('open');
        });
    }
}
