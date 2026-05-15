document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.scroll-container');
    const panels = document.querySelectorAll('.panel');
    const navLinks = document.querySelectorAll('#desktop-nav a, .side-dots a');
    const dots = document.querySelectorAll('.dot');
    const header = document.getElementById('main-header');
    
    // Intersection Observer for Active Panels
    const observerOptions = {
        threshold: 0.5 // Trigger when 50% of the panel is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                
                // Update Panels
                panels.forEach(p => p.classList.remove('active'));
                entry.target.classList.add('active');
                
                // Update Nav
                updateActiveState(id);
                
                // Update Header Style
                if (header) {
                    if (id !== 'hero') {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                }
            }
        });
    }, observerOptions);

    if (panels.length > 0) {
        panels.forEach(panel => observer.observe(panel));
    }

    function updateActiveState(id) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
        
        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.dataset && dot.dataset.id === id) {
                dot.classList.add('active');
            }
        });
    }

    // Smooth scroll for dots and nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Si el enlace es interno (empieza por #) hacemos scroll suave
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(href);
                if (targetEl) {
                    targetEl.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
            // De lo contrario, dejamos que el navegador navegue normalmente a la URL
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = mobileMenuOverlay ? mobileMenuOverlay.querySelectorAll('a') : [];

    function toggleMenu() {
        if (menuToggle && mobileMenuOverlay) {
            menuToggle.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            // Prevent scrolling when menu is open
            document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                toggleMenu();
                
                const targetEl = document.querySelector(href);
                if (targetEl) {
                    targetEl.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Multi-language (i18n) Handler
    const savedLang = localStorage.getItem('app_lang') || 'es';
    document.documentElement.lang = savedLang;
    applyLanguage(savedLang);

    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = savedLang;

        langSelect.addEventListener('change', (e) => {
            const newLang = e.target.value;
            localStorage.setItem('app_lang', newLang);
            document.documentElement.lang = newLang;
            applyLanguage(newLang);
        });
    }

    function applyLanguage(lang) {
        if (typeof translations !== 'undefined' && translations[lang]) {
            const dict = translations[lang];
            // Buscar todos los elementos que tengan el atributo data-i18n
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (dict[key]) {
                    el.innerHTML = dict[key];
                }
            });
        }
    }

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const zoomableImgs = document.querySelectorAll('.zoom-hint');

    if (lightbox && lightboxImg) {
        zoomableImgs.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            });
        });

        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
            // If on a subpage where scrolling is handled by body (not scroll-container)
            if (!document.querySelector('.scroll-container')) {
                document.body.style.overflow = 'auto';
            }
        });
    }
});
