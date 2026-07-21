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
    const particleCount = Math.min(Math.floor(width / 14), 70);
    let globeAngle = 0;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
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

    function drawGlowingGlobeWithIndia(cx, cy, radius, angle) {
        ctx.save();
        ctx.translate(cx, cy);

        // Globe atmosphere glow
        const grad = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius * 1.15);
        grad.addColorStop(0, 'rgba(0, 242, 254, 0.22)');
        grad.addColorStop(0.6, 'rgba(67, 100, 247, 0.12)');
        grad.addColorStop(1, 'rgba(7, 11, 22, 0)');

        ctx.beginPath();
        ctx.arc(0, 0, radius * 1.15, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Sphere boundary
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 20;
        ctx.stroke();

        // Latitude & Longitude grid lines
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.2)';
        ctx.lineWidth = 1;

        for (let lat = -60; lat <= 60; lat += 20) {
            const rLat = radius * Math.cos((lat * Math.PI) / 180);
            const yLat = radius * Math.sin((lat * Math.PI) / 180);
            ctx.beginPath();
            ctx.ellipse(0, yLat, rLat, rLat * 0.3, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        for (let lon = 0; lon < 360; lon += 30) {
            const rLon = (lon * Math.PI) / 180 + angle;
            const xLon = radius * Math.cos(rLon);
            if (Math.sin(rLon) > -0.2) {
                ctx.beginPath();
                ctx.ellipse(0, 0, Math.abs(xLon), radius, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        // DRAW GLOWING INDIA MAP CONTOUR IN CENTER (MATCHING IMAGE COPY 3)
        ctx.save();
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 16;
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 2.2;
        ctx.fillStyle = 'rgba(0, 242, 254, 0.25)';

        const scaleS = radius / 120;
        const offsetX = Math.sin(angle * 0.8) * 20;
        const offsetY = -radius * 0.05;

        // India map polygon points
        const indiaPoints = [
            [0, -65],   // North tip (Kashmir)
            [16, -45],  // Himalayas / Nepal border
            [35, -35],  // Northeast / Arunachal
            [28, -10],  // Assam / East
            [18, 15],   // Odisha coast
            [12, 45],   // Tamil Nadu / East coast
            [0, 68],    // Kanyakumari South tip
            [-15, 35],  // Kerala / West coast
            [-25, 10],  // Goa / Mumbai coast
            [-38, -15], // Gujarat peninsula
            [-22, -35], // Rajasthan
            [-12, -50]  // Punjab / West border
        ];

        ctx.beginPath();
        indiaPoints.forEach((pt, idx) => {
            const px = pt[0] * scaleS + offsetX;
            const py = pt[1] * scaleS + offsetY;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pulsing India Tech Hub Nodes
        const hubNodes = [
            [0, -35],  // North (Delhi)
            [-18, 12], // West (Mumbai)
            [5, 30],   // South (Hyderabad / Bangalore)
            [15, 0]    // East (Kolkata)
        ];

        hubNodes.forEach(([nx, ny]) => {
            ctx.beginPath();
            ctx.arc(nx * scaleS + offsetX, ny * scaleS + offsetY, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#38ef7d';
            ctx.shadowColor = '#38ef7d';
            ctx.shadowBlur = 10;
            ctx.fill();
        });

        ctx.restore();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        globeAngle += 0.005;

        // Center coordinates for Globe (Desktop right half, Mobile centered)
        const isMobile = width <= 768;
        const gx = isMobile ? width * 0.5 : width * 0.72;
        const gy = isMobile ? height * 0.72 : height * 0.5;
        const gRadius = isMobile ? Math.min(width, height) * 0.28 : Math.min(width, height) * 0.32;

        // Draw animated globe with India
        drawGlowingGlobeWithIndia(gx, gy, Math.max(120, gRadius), globeAngle);

        // Draw particle connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = '#00f2fe';
                    ctx.globalAlpha = (1 - dist / 120) * 0.22;
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
    const serviceModal = document.getElementById('service-details-modal');
    const closeBtn = document.getElementById('modal-close');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const formSubjectInput = document.getElementById('form-subject');
    const modalTitle = document.getElementById('modal-title');
    const serviceSelect = document.getElementById('cust-service');
    const messageInput = document.getElementById('cust-message');

    if (!modal) return;

    openBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const subject = btn.getAttribute('data-subject') || 'General Inquiry';

            // Automatically close the option details modal if open
            if (serviceModal && serviceModal.classList.contains('open')) {
                serviceModal.classList.remove('open');
            }

            if (formSubjectInput) formSubjectInput.value = subject;
            if (modalTitle) {
                modalTitle.textContent = subject.includes('Career') ? 'Submit Application Details' : `Inquire: ${subject}`;
            }

            // Auto pre-fill message requirement with specific option details
            if (messageInput) {
                messageInput.value = `Hello Trilok Infotech Team,\nI am interested in ${subject}. Please provide more details and consultation.`;
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
    const interactiveElements = document.querySelectorAll('.service-card, .service-arrow, .interactive-option');
    const serviceModal = document.getElementById('service-details-modal');
    const closeBtn = document.getElementById('service-modal-close');
    const titleEl = document.getElementById('svc-modal-title');
    const descEl = document.getElementById('svc-modal-desc');
    const iconEl = document.getElementById('svc-modal-icon');
    const categoryEl = document.getElementById('svc-modal-category');
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
        },
        // WHY CHOOSE US OPTIONS
        'Enterprise-grade Security': {
            icon: 'fa-solid fa-shield-halved',
            category: 'WHY CHOOSE TRILOK INFOTECH',
            desc: 'We embed zero-trust architectures, end-to-end data encryption, and compliance controls into every software solution we build for maximum reliability.',
            features: [
                'Zero-Trust Security & Multi-Layer Encryption',
                'Regulatory Compliance (ISO 27001, SOC 2, HIPAA, GDPR)',
                'Proactive Threat Intelligence & Continuous Security Monitoring'
            ]
        },
        'Innovative Solutions': {
            icon: 'fa-solid fa-lightbulb',
            category: 'WHY CHOOSE TRILOK INFOTECH',
            desc: 'Leveraging cutting-edge technologies like AI, modern web frameworks, and cloud-native microservices to drive competitive advantage for your business.',
            features: [
                'State-of-the-Art Technology Stack & Frameworks',
                'AI-Driven Business Intelligence & Automation',
                'Future-Proof Architecture Designed for Growth'
            ]
        },
        'Scalable Infrastructure': {
            icon: 'fa-solid fa-server',
            category: 'WHY CHOOSE TRILOK INFOTECH',
            desc: 'High-availability infrastructure solutions designed to seamlessly handle high traffic spikes, distributed enterprise workloads, and zero-downtime deployments.',
            features: [
                'Auto-scaling Microservices & Container Orchestration',
                'Multi-Region Cloud Redundancy & Load Balancing',
                '99.99% Uptime Guarantee & High-Throughput Databases'
            ]
        },
        'Digital Transformation Experts': {
            icon: 'fa-solid fa-chart-line',
            category: 'WHY CHOOSE TRILOK INFOTECH',
            desc: 'Empowering legacy businesses with modern digital tools, cloud migration, automated workflows, and customer-centric digital platforms.',
            features: [
                'Legacy System Modernization & Cloud Migration',
                'End-to-End Process Automation & Workflow Digitization',
                'Data-Driven Decision Making & Business Analytics'
            ]
        },
        '24x7 Technical Support': {
            icon: 'fa-solid fa-headset',
            category: 'WHY CHOOSE TRILOK INFOTECH',
            desc: 'Round-the-clock dedicated technical assistance, system monitoring, incident management, and proactive maintenance by senior engineers.',
            features: [
                '24/7/365 Rapid Response Helpdesk & Support Team',
                'SLA-Backed Incident Resolution & Real-Time Alerting',
                'Continuous Health Checks & Automated Security Patching'
            ]
        },
        'Customer Centric Approach': {
            icon: 'fa-solid fa-handshake-angle',
            category: 'WHY CHOOSE TRILOK INFOTECH',
            desc: 'We prioritize customer success with transparent agile collaboration, tailored product roadmaps, and dedicated account management.',
            features: [
                'Agile Development Sprints with Regular Deliverable Reviews',
                'Dedicated Account Managers & Transparent Project Tracking',
                'Customized Tech Solutions Tailored Exactly to Business Goals'
            ]
        },
        // PROCESS STEPS
        'Discover': {
            icon: 'fa-solid fa-magnifying-glass',
            category: 'OUR METHODOLOGY - PHASE 1',
            desc: 'Comprehensive requirement gathering, stakeholder interviews, technical feasibility analysis, and architecture blueprinting.',
            features: [
                'Business Needs Analysis & Technical Scope Definition',
                'Security & Compliance Requirement Mapping',
                'Project Timeline, Budget & Resource Allocation Blueprint'
            ]
        },
        'Design': {
            icon: 'fa-solid fa-pencil',
            category: 'OUR METHODOLOGY - PHASE 2',
            desc: 'UI/UX wireframing, high-fidelity interactive design prototypes, database schema modeling, and system architecture specification.',
            features: [
                'User-Centric UI/UX Prototyping & Visual Guidelines',
                'Scalable Database & Microservices Architecture Design',
                'Security Protocol & Data Flow Specification'
            ]
        },
        'Develop': {
            icon: 'fa-solid fa-code',
            category: 'OUR METHODOLOGY - PHASE 3',
            desc: 'Agile code execution using clean architecture standards, automated unit testing, continuous integration, and secure code audits.',
            features: [
                'Full-Stack Agile Sprint Development & Code Reviews',
                'Automated Testing, CI/CD Pipeline Implementation',
                'Code Security Audits & Performance Optimization'
            ]
        },
        'Deploy': {
            icon: 'fa-solid fa-rocket',
            category: 'OUR METHODOLOGY - PHASE 4',
            desc: 'Seamless zero-downtime deployment to cloud environments, staging verification, load testing, and go-live launch management.',
            features: [
                'Automated Cloud Staging & Production Deployment',
                'Load & Stress Testing under Simulated Traffic Spikes',
                'Go-Live Operations & Real-Time Performance Telemetry'
            ]
        },
        'Support': {
            icon: 'fa-solid fa-headset',
            category: 'OUR METHODOLOGY - PHASE 5',
            desc: 'Long-term system maintenance, SLA support, continuous security upgrades, and feature enhancements to ensure business growth.',
            features: [
                'Ongoing Maintenance, System Patching & Updates',
                '24/7 Performance Monitoring & Issue Remediation',
                'Continuous Feature Scaling & Tech Stack Upgrades'
            ]
        }
    };

    interactiveElements.forEach((el) => {
        el.addEventListener('click', (e) => {
            if (e.target.closest('.open-modal-btn') && !e.target.closest('.service-arrow') && !e.target.closest('.interactive-option')) return;

            const titleKey = 
                el.getAttribute('data-why') ||
                el.getAttribute('data-industry') ||
                el.getAttribute('data-tech') ||
                el.getAttribute('data-process') ||
                el.querySelector('.service-title')?.textContent.trim() ||
                el.querySelector('h4')?.textContent.trim() ||
                el.textContent.trim();

            const data = serviceData[titleKey] || {
                icon: 'fa-solid fa-layer-group',
                category: 'TRILOK INFOTECH CAPABILITY',
                desc: `Trilok Infotech Private Limited delivers specialized ${titleKey} solutions customized to meet your enterprise goals with high efficiency, security, and scalability.`,
                features: [
                    `Tailored ${titleKey} Strategy & Implementation`,
                    `Enterprise Security, Quality Assurance & 24/7 Monitoring`,
                    `Dedicated Expert Team & SLA Guarantees`
                ]
            };

            if (titleEl) titleEl.textContent = titleKey;
            if (descEl) descEl.textContent = data.desc;
            if (categoryEl) categoryEl.textContent = data.category;
            if (iconEl) iconEl.innerHTML = `<i class="${data.icon}"></i>`;
            if (inquireBtn) inquireBtn.setAttribute('data-subject', `${titleKey} Inquiry`);

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
