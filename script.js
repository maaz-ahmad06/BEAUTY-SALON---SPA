/**
 * Aura Spa & Salon Interactive Script
 * Handles preloader, scroll-reveal transitions, sticky navbar, mobile drawer, testimonial slider, and booking forms.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. PRELOADER LOGIC (2.5 Seconds Display)
    // ==========================================================================
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.progress-bar');

    // Enforce 2.5 seconds minimum load screen
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('preloader-hidden');
            
            // Clean up the DOM from preloader after transition finishes
            setTimeout(() => {
                preloader.style.display = 'none';
                
                // Trigger initial scroll reveals once preloader is gone
                triggerScrollReveal();
            }, 800);
        }
    }, 2500);


    // ==========================================================================
    // 2. SCROLL REVEAL (Intersection Observer)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve once revealed to keep layout performant
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    function triggerScrollReveal() {
        revealElements.forEach(element => {
            revealOnScroll.observe(element);
        });
    }


    // ==========================================================================
    // 3. STICKY NAV & ACTIVE LINKS ON SCROLL
    // ==========================================================================
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link tracking
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset for nav height
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // ==========================================================================
    // 4. MOBILE NAVIGATION DRAWER
    // ==========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    const toggleIcon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('open');
        
        // Toggle icon states
        if (navbar.classList.contains('open')) {
            toggleIcon.className = 'fa-solid fa-xmark';
        } else {
            toggleIcon.className = 'fa-solid fa-bars-staggered';
        }
    });

    // Close menu when links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('open');
            toggleIcon.className = 'fa-solid fa-bars-staggered';
        });
    });


    // ==========================================================================
    // 5. TESTIMONIALS SLIDER
    // ==========================================================================
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    // Auto-slide loop
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    // Nav Dot event listeners
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const targetIndex = parseInt(e.target.getAttribute('data-target')) - 1;
            showSlide(targetIndex);
            resetAutoSlide();
        });
    });

    // Initialize auto rotation
    startAutoSlide();


    // ==========================================================================
    // 6. BOOKING FORM VALIDATION & SUBMISSION
    // ==========================================================================
    const form = document.getElementById('appointment-form');
    const successOverlay = document.getElementById('form-success');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    // Prevent past dates from being selectable
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;

        // Validation helper
        function validateField(inputElement, condition) {
            const formGroup = inputElement.closest('.form-group');
            if (condition) {
                formGroup.classList.remove('invalid');
            } else {
                formGroup.classList.add('invalid');
                isFormValid = false;
            }
        }

        // 1. Validate Name
        const name = document.getElementById('booking-name');
        validateField(name, name.value.trim().length > 1);

        // 2. Validate Email
        const email = document.getElementById('booking-email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField(email, emailRegex.test(email.value.trim()));

        // 3. Validate Phone
        const phone = document.getElementById('booking-phone');
        validateField(phone, phone.value.trim().length > 5);

        // 4. Validate Service Selection
        const service = document.getElementById('booking-service');
        validateField(service, service.value !== '');

        // 5. Validate Date
        validateField(dateInput, dateInput.value !== '');

        // 6. Validate Time
        const timeInput = document.getElementById('booking-time');
        validateField(timeInput, timeInput.value !== '');

        // If form is valid, trigger success feedback animation
        if (isFormValid) {
            successOverlay.classList.add('active');
            form.reset();
        }
    });

    // Clear validation error highlights on user typing/input
    form.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('input', () => {
            const group = element.closest('.form-group');
            if (group.classList.contains('invalid')) {
                group.classList.remove('invalid');
            }
        });
    });

    // Close success overlay
    closeSuccessBtn.addEventListener('click', () => {
        successOverlay.classList.remove('active');
    });

});
