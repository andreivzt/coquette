// WhatsApp Contact Configuration
const WA_PHONE_NUMBER = '40770141977';

// DOM Elements
const navbar = document.getElementById('navbar');
const mobileBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');
const cursorGlow = document.querySelector('.cursor-glow');

// Update copyright year
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Custom Cursor Glow effect (runs only on non-touch devices)
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;

        const target = e.target;
        if (target.tagName.toLowerCase() === 'a' ||
            target.tagName.toLowerCase() === 'button' ||
            target.closest('a') ||
            target.closest('button') ||
            target.closest('.flower-card') ||
            target.closest('.event-card')) {
            cursorGlow.style.opacity = '0.75';
            cursorGlow.style.background = 'radial-gradient(circle, rgba(240, 142, 165, 0.45) 0%, transparent 60%)';
            cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.2)';
        } else {
            cursorGlow.style.opacity = '1';
            cursorGlow.style.background = 'radial-gradient(circle, rgba(240, 142, 165, 0.28) 0%, transparent 70%)';
            cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorGlow.style.opacity = '1';
    });
} else if (cursorGlow) {
    cursorGlow.style.display = 'none';
}

// Intersection Observer for Scroll Animations
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
    });

    const elementsToAnimate = document.querySelectorAll('.fade-up, .fade-in, .fade-left, .fade-right');
    elementsToAnimate.forEach(el => observer.observe(el));
};

// Catalog Category Filtering
const initCatalogFilters = () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.flower-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    // Add animate class so it stays visible
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, 50);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
};

// Product Lightbox Modal
const initProductModal = () => {
    const modal = document.getElementById('product-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalBadge = document.getElementById('modal-badge');
    const modalDesc = document.getElementById('modal-desc');
    const modalWaBtn = document.getElementById('modal-wa-btn');

    if (!modal) return;

    const openModal = (data) => {
        modalImg.src = data.img;
        modalImg.alt = data.title;
        modalTitle.textContent = data.title;
        modalBadge.textContent = data.badge || 'Florăria Coquette';
        modalDesc.textContent = data.desc;

        // Compose WhatsApp message
        const messageText = `Bună ziua! Aș dori să comand sau să aflu mai multe detalii despre produsul "${data.title}" de pe site-ul Florăria Coquette.`;
        const waLink = `https://wa.me/${WA_PHONE_NUMBER}?text=${encodeURIComponent(messageText)}`;
        modalWaBtn.href = waLink;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // prevent scroll
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Attach click listeners to "Detalii" buttons
    const detailBtns = document.querySelectorAll('.btn-details');
    detailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.flower-card');
            const badgeEl = card.querySelector('.product-badge');
            openModal({
                img: btn.getAttribute('data-img'),
                title: btn.getAttribute('data-title'),
                desc: btn.getAttribute('data-desc'),
                badge: badgeEl ? badgeEl.textContent : 'Florăria Coquette'
            });
        });
    });

    // Clicking image wrapper also opens modal
    const imgWrappers = document.querySelectorAll('.img-wrapper');
    imgWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const card = wrapper.closest('.flower-card');
            const btn = card ? card.querySelector('.btn-details') : null;
            if (btn) {
                const badgeEl = card.querySelector('.product-badge');
                openModal({
                    img: btn.getAttribute('data-img'),
                    title: btn.getAttribute('data-title'),
                    desc: btn.getAttribute('data-desc'),
                    badge: badgeEl ? badgeEl.textContent : 'Florăria Coquette'
                });
            }
        });
    });

    // Clicking event image wrapper opens modal with event details
    const eventImgWrappers = document.querySelectorAll('.event-img-wrap');
    eventImgWrappers.forEach(wrap => {
        wrap.addEventListener('click', () => {
            const card = wrap.closest('.event-card');
            const badgeEl = card ? card.querySelector('.event-badge') : null;
            openModal({
                img: wrap.getAttribute('data-img'),
                title: wrap.getAttribute('data-title'),
                desc: wrap.getAttribute('data-desc'),
                badge: badgeEl ? badgeEl.textContent : 'Organizare Evenimente'
            });
        });
    });
};

// Form submission - Redirect to WhatsApp
const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const typeEl = document.getElementById('product_type');
        const productType = typeEl ? typeEl.value : 'Comandă Florală';
        const message = document.getElementById('message').value.trim();

        // Format WhatsApp text
        const waText = `Bună ziua! Mă numesc ${name} (Tel: ${phone}).\nTip solicitare: ${productType}\n\nMesaj comandă:\n${message}`;
        const waUrl = `https://wa.me/${WA_PHONE_NUMBER}?text=${encodeURIComponent(waText)}`;

        // Change button visual state temporarily
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.textContent = 'Se redirecționează către WhatsApp...';
        btn.style.opacity = '0.8';

        // Open WhatsApp in a new tab
        window.open(waUrl, '_blank');

        // Reset form and button after a short delay
        setTimeout(() => {
            contactForm.reset();
            btn.innerHTML = originalText;
            btn.style.opacity = '1';
        }, 2500);
    });
};

// Initialize everything on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    observeElements();
    initCatalogFilters();
    initProductModal();
    initContactForm();
});
