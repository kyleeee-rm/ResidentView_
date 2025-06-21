document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuIcon = document.getElementById('mobile-menu-icon');
    const mobileMenu = document.getElementById('mobile-menu');

    // Toggle mobile menu and icon
    function toggleMobileMenu() {
        const isOpen = !mobileMenu.classList.toggle('hidden');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        if (mobileMenuIcon) {
            mobileMenuIcon.className = isOpen
                ? 'ri-close-line text-2xl transition-all'
                : 'ri-menu-line text-2xl transition-all';
        }
    }

    // Close menu and reset icon
    function closeMobileMenu() {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
        if (mobileMenuIcon) {
            mobileMenuIcon.className = 'ri-menu-line text-2xl transition-all';
        }
    }

    // Event listeners
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }

    // Close menu when clicking on a link
    if (mobileMenu) {
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // Close menu when clicking outside of it
    document.addEventListener('click', function (event) {
        if (
            mobileMenu &&
            !mobileMenu.classList.contains('hidden') &&
            !mobileMenu.contains(event.target) &&
            !mobileMenuButton.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', function (event) {
        if (
            event.key === 'Escape' &&
            mobileMenu &&
            !mobileMenu.classList.contains('hidden')
        ) {
            closeMobileMenu();
        }
    });

    // Smooth refresh function for the logo link
    window.smoothRefresh = function (event) {
        event.preventDefault();
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.location.href = event.target.closest('a').href;
        }, 300);
    };
});

// Navbar hide on scroll
document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('header');
    let lastScroll = 0;
    const scrollThreshold = 10;
    navbar.style.transition = 'transform 0.3s ease-in-out';

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll <= 0) {
            navbar.style.transform = 'translateY(0)';
            return;
        }
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            navbar.style.transform = 'translateY(-100%)';
        } else if (currentScroll < lastScroll) {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });
});

// Section smooth scroll and zoom animation
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        const validTargets = ['#section1', '#section2', '#section3', '#section4', '#contact'];
        const targetId = this.getAttribute('href');
        if (!validTargets.includes(targetId)) return;
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            targetElement.style.transition = 'transform 0.9s cubic-bezier(0.4,0,0.2,1)';
            targetElement.style.transform = 'scale(1.08)';
            setTimeout(() => {
                targetElement.style.transform = 'scale(1)';
            }, 900); // how long it stays zoomed
            setTimeout(() => {
                targetElement.style.transition = '';
            }, 900); // matches the transition duration
        }
    });
});

// About: animate cards on scroll
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.rounded-4xl');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 0.1}s`;
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-8');
            }
        });
    }, { threshold: 0.1 });
    cards.forEach(card => {
        card.classList.add('transition-all', 'duration-300', 'ease-out', 'opacity-0', 'translate-y-8');
        observer.observe(card);
    });
});

// Process: animate step cards on scroll
document.addEventListener('DOMContentLoaded', function () {
    const stepCards = document.querySelectorAll('.step-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 0.1}s`;
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-8');
            }
        });
    }, { threshold: 0.1 });
    stepCards.forEach(card => {
        card.classList.add('transition-all', 'duration-300', 'ease-out', 'opacity-0', 'translate-y-8');
        observer.observe(card);
    });
});