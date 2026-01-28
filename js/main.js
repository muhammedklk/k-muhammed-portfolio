// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // --- 0. PRELOADER (Final Model: Staggered Curtain) ---
    const preloader = document.querySelector('.preloader');
    const counter = document.querySelector('.preloader-counter');
    const strips = document.querySelectorAll('.preloader-strip');

    if (preloader) {
        let progress = 0;

        const loadingInterval = setInterval(() => {
            progress += Math.floor(Math.random() * 5) + 1;

            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);

                // Finalize loading and start reveal
                setTimeout(() => {
                    const tl = gsap.timeline({
                        onComplete: () => {
                            preloader.style.display = 'none';
                            startSiteAnimations();
                        }
                    });

                    // 1. Hide the loader content first
                    tl.to(['.preloader-counter', '.preloader-tagline'], {
                        opacity: 0,
                        y: -40,
                        duration: 0.8,
                        ease: "power4.inOut"
                    });

                    // 2. Staggered strip reveal (Upwards slide)
                    tl.to(strips, {
                        yPercent: -100,
                        duration: 1.2,
                        stagger: 0.1,
                        ease: "expo.inOut"
                    }, "-=0.4");

                }, 400);
            }

            // Sync visual elements
            if (counter) counter.textContent = progress;

        }, 40);
    } else {
        setTimeout(startSiteAnimations, 100);
    }




    function startSiteAnimations() {
        // B. Hero Reveals (Moved from section 3)
        const heroTexts = document.querySelectorAll('.hero-reveal');
        if (heroTexts.length > 0) {
            gsap.fromTo(heroTexts,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: 'power3.out',
                    delay: 0.2
                }
            );
        }

        // Start Typewriter
        if (typeof type === 'function') {
            setTimeout(type, 1000);
        }
    }

    // --- 1. SMOOTH SCROLL (LENIS) ---

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        direction: 'vertical',
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);


    // --- 2. CUSTOM CURSOR (Cinema Lens Model) ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        // Move the cursor with high-end inertia
        window.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;

            gsap.to(cursorDot, {
                x: x,
                y: y,
                duration: 0.1,
                ease: "power2.out"
            });

            gsap.to(cursorOutline, {
                x: x,
                y: y,
                duration: 0.6, // High inertia
                ease: "expo.out"
            });
        });

        // Hover Effects (Interactive Snap)
        const hoverItems = document.querySelectorAll('a, button, .hover-target, .skill-badge, .accordion-header');

        hoverItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            item.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            gsap.to([cursorDot, cursorOutline], { opacity: 0, duration: 0.3 });
        });
        document.addEventListener('mouseenter', () => {
            gsap.to([cursorDot, cursorOutline], { opacity: 1, duration: 0.3 });
        });
    }

    // --- MAGNEITC BUTTON EFFECT ---
    const magneticElements = document.querySelectorAll('.btn:not(.stack-card .btn), .nav-link, .magnetic, .skill-tag');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            // Calculate distance from center of the link
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move element towards mouse (magnetic pull)
            gsap.to(el, {
                x: x * 0.3, // Strength of magnet
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Move children (text) slightly more for parallax if desired, or keep simple
        });

        el.addEventListener('mouseleave', () => {
            // Reset position
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });


    // --- MOBILE MENU TOGGLE ---
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-overlay a');

    if (menuToggle && menuOverlay) {
        menuToggle.addEventListener('click', () => {
            menuOverlay.classList.toggle('active');
            // Animate hamburger to X
            const lines = menuToggle.querySelectorAll('span');
            if (menuOverlay.classList.contains('active')) {
                gsap.to(lines[0], { rotate: 45, y: 8, duration: 0.3 });
                gsap.to(lines[1], { opacity: 0, duration: 0.3 });
                gsap.to(lines[2], { rotate: -45, y: -8, duration: 0.3 });
            } else {
                gsap.to(lines[0], { rotate: 0, y: 0, duration: 0.3 });
                gsap.to(lines[1], { opacity: 1, duration: 0.3 });
                gsap.to(lines[2], { rotate: 0, y: 0, duration: 0.3 });
            }
        });

        // Close menu on link click
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuOverlay.classList.remove('active');
                const lines = menuToggle.querySelectorAll('span');
                gsap.to(lines[0], { rotate: 0, y: 0, duration: 0.3 });
                gsap.to(lines[1], { opacity: 1, duration: 0.3 });
                gsap.to(lines[2], { rotate: 0, y: 0, duration: 0.3 });
            });
        });
    }

    // --- TYPEWRITER EFFECT ---
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const words = ["Muhammed K", "Front-End Developer", "UI/UX Designer"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 150;

        function type() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 60; // Faster deletion
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100 + Math.random() * 100; // Natural randomized typing
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2500; // Wait longer at the end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        // Start typing is now called from startSiteAnimations
        // setTimeout(type, 2000);
    }

    // --- HERO ARROW SMOOTH SCROLL ---
    const heroArrow = document.getElementById('hero-arrow');
    if (heroArrow) {
        heroArrow.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(heroArrow.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, { offset: 0, duration: 1.5 });
            }
        });
    }

    // --- 3. GSAP ANIMATIONS ---

    // A. Header Scroll Effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // B. Hero Reveals - [MOVED TO startSiteAnimations]

    // C. Section Titles Fade Up
    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => {
        gsap.fromTo(el,
            { y: 40, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out'
            }
        );
    });

    // D. Works Stack Animation
    const stackWrapper = document.querySelector('.stack-wrapper');
    const cards = document.querySelectorAll('.stack-card');

    if (stackWrapper && cards.length > 0) {
        const isMobile = window.innerWidth <= 992;

        // We pin the wrapper
        ScrollTrigger.create({
            trigger: '.stack-wrapper',
            start: 'top top',
            end: isMobile ? '+=150%' : '+=200%',
            pin: true,
            scrub: 1,
            animation: gsap.timeline()
                .fromTo(cards[1],
                    { y: '100vh', scale: 0.9 },
                    { y: isMobile ? '30px' : '40px', scale: 1, duration: 1 }
                )
                .fromTo(cards[2],
                    { y: '100vh', scale: 0.9 },
                    { y: isMobile ? '60px' : '80px', scale: 1, duration: 1 }
                )
        });
    }

    // E. Marquee
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        // Endless loop logic
        const clone = marqueeContent.innerHTML;
        marqueeContent.innerHTML += clone; // Duplicate for loop

        let tween = gsap.to(marqueeContent, {
            xPercent: -50,
            repeat: -1,
            duration: 15,
            ease: 'linear'
        }).totalProgress(0.5);

        // Link speed to scroll
        gsap.set(marqueeContent, { xPercent: -50 });

        ScrollTrigger.create({
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                const scrollVelocity = self.getVelocity();
                const direction = self.direction; // 1 or -1
                // Dynamic speed (not fully implemented to keep it simple and bug-free for now)
                // Just keeping the constant linear movement is safer for this request level
            }
        });
    }

    // --- 4. ACCORDION (FAQ) ---
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(acc => {
        acc.addEventListener('click', function () {
            const item = this.parentElement;
            const content = this.nextElementSibling;

            // Close others (optional, but requested "accordion style")
            document.querySelectorAll('.accordion-item').forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                    other.querySelector('.accordion-content').style.height = 0;
                }
            });

            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.height = content.scrollHeight + 'px';
            } else {
                content.style.height = 0;
            }
        });
    });

    // --- 5. CONTACT FORM (Dummy Submit) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // WhatsApp redirection
            // Use format: https://wa.me/PHONE?text=MESSAGE
            const phoneNumber = "919656216086";
            const text = `Hi, I am ${name} (${email}). ${message}`;
            const encodedText = encodeURIComponent(text);

            // Open WA
            window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');

            // "Also sent to Email" - we can open mailto as well or just alert
            // window.location.href = `mailto:muhammedklkm@gmail.com?subject=Portfolio Inquiry&body=${encodedText}`;

            alert('Redirecting to WhatsApp to send your message!');
            contactForm.reset();
        });
    }

});
