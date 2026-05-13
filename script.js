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
                if (id !== 'hero') {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });
    }, observerOptions);

    panels.forEach(panel => observer.observe(panel));

    function updateActiveState(id) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
        
        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.dataset.id === id) {
                dot.classList.add('active');
            }
        });
    }

    // Smooth scroll for dots and nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Si el enlace es interno (empieza por #) hacemos scroll suave
            if (href.startsWith('#')) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
            // De lo contrario, dejamos que el navegador navegue normalmente a la URL
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = mobileMenuOverlay.querySelectorAll('a');

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        // Prevent scrolling when menu is open
        document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMenu();
            
            const targetId = link.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
