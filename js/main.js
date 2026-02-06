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
    const magneticElements = document.querySelectorAll('.btn:not(.stack-card .btn), .nav-link, .magnetic, .skill-tag, .skill-pill, .aurora-card');

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


    // --- FLOATING MENU TOGGLE (ROBUST VERSION) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebarMenu = document.querySelector('.sidebar-menu');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const toggleIcon = menuToggle ? menuToggle.querySelector('i') : null;

    if (menuToggle && sidebarMenu) {
        let menuTimeline = gsap.timeline({ paused: true });

        // Build the reveal timeline once
        menuTimeline
            .to(sidebarMenu, {
                opacity: 1,
                visibility: 'visible',
                y: 0,
                duration: 0.5,
                ease: "power4.out"
            })
            .fromTo(sidebarLinks,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: "power2.out" },
                "-=0.3"
            );

        let isMenuOpen = false;

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            isMenuOpen = !isMenuOpen;

            if (isMenuOpen) {
                sidebarMenu.classList.add('active');
                menuTimeline.play();
                if (toggleIcon) {
                    toggleIcon.classList.replace('fa-bars', 'fa-xmark');
                    gsap.to(toggleIcon, { rotation: 90, duration: 0.3 });
                }
            } else {
                sidebarMenu.classList.remove('active');
                menuTimeline.reverse();
                if (toggleIcon) {
                    toggleIcon.classList.replace('fa-xmark', 'fa-bars');
                    gsap.to(toggleIcon, { rotation: 0, duration: 0.3 });
                }
            }
        });

        // Auto-Active Navigation Link detection
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        sidebarLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }

            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    isMenuOpen = false;
                    sidebarMenu.classList.remove('active');
                    menuTimeline.reverse();
                    if (toggleIcon) {
                        toggleIcon.classList.replace('fa-xmark', 'fa-bars');
                        gsap.to(toggleIcon, { rotation: 0, duration: 0.3 });
                    }
                }
            });
        });

        // Close on Click Outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !sidebarMenu.contains(e.target)) {
                isMenuOpen = false;
                sidebarMenu.classList.remove('active');
                menuTimeline.reverse();
                if (toggleIcon) {
                    toggleIcon.classList.replace('fa-xmark', 'fa-bars');
                    gsap.to(toggleIcon, { rotation: 0, duration: 0.3 });
                }
            }
        });
    }

    // --- TYPEWRITER EFFECT ---
    const typewriterElement = document.getElementById('typewriter');
    let type; // Define type variable in DOMContentLoaded scope

    if (typewriterElement) {
        const words = ["Muhammed K", "UI/UX Designer", "Front-End Developer"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 150;

        type = function () {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 60;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100 + Math.random() * 80;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2500;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };
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

    // C3. Skills Matrix Reveal
    const skillsMatrix = document.querySelector('.matrix-grid');
    const matrixItems = document.querySelectorAll('.m-item');
    if (skillsMatrix && matrixItems.length > 0) {
        gsap.fromTo(matrixItems,
            { y: 60, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: skillsMatrix,
                    start: 'top 85%',
                },
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.15,
                ease: 'expo.out'
            }
        );
    }

    // C4. Aurora Card Interactive Glow
    const auroraCards = document.querySelectorAll('.aurora-card');
    auroraCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            gsap.to(card, {
                '--x': `${x}px`,
                '--y': `${y}px`,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // C5. perspective Works Reveal & Parallax
    const pItems = gsap.utils.toArray('.p-item');
    if (pItems.length > 0) {
        pItems.forEach((item) => {
            const visual = item.querySelector('.p-visual img');
            const content = item.querySelector('.p-content');

            // 1. Content Reveal
            if (content) {
                gsap.fromTo(content,
                    { opacity: 0, x: item.classList.contains('p-split-left') ? -50 : 50 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1.2,
                        ease: "power4.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 80%",
                        }
                    }
                );
            }

            // 2. Visual Mask Reveal
            if (visual) {
                gsap.fromTo(visual.parentElement,
                    { clipPath: "inset(0 100% 0 0)" },
                    {
                        clipPath: "inset(0 0% 0 0)",
                        duration: 1.5,
                        ease: "expo.inOut",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 80%",
                        }
                    }
                );

                // 3. Image Parallax
                gsap.to(visual, {
                    yPercent: 15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: item,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }
        });
    }

    // D. [REMOVED OLD STACK]

    // E. Kinetic Typography Wall (GSAP Loops)
    const kineticTracks = document.querySelectorAll('.kinetic-track');
    kineticTracks.forEach((track, i) => {
        const isRight = track.parentElement.classList.contains('row-right');

        // Continuous Loop
        const loop = gsap.to(track, {
            xPercent: -50,
            repeat: -1,
            duration: 20,
            ease: "none"
        }).totalProgress(0.5);

        if (isRight) loop.reverse();

        // Scroll Velocity Boost
        ScrollTrigger.create({
            trigger: ".kinetic-marquee-section",
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
                const velocity = Math.abs(self.getVelocity() / 500);
                gsap.to(loop, {
                    timeScale: isRight ? -(1 + velocity) : (1 + velocity),
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });
    });

    // --- 4. ACCORDION (FAQ) ---
    const accordions = document.querySelectorAll('.u-faq-trigger');
    accordions.forEach(acc => {
        acc.addEventListener('click', function () {
            const item = this.closest('.u-faq-item');
            const body = item.querySelector('.u-faq-body');

            // Close others 
            document.querySelectorAll('.u-faq-item').forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                    other.querySelector('.u-faq-body').style.height = 0;
                }
            });

            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                body.style.height = body.scrollHeight + 'px';
            } else {
                body.style.height = 0;
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
    // --- 6. FOOTER REMOVED (Pending New Design) ---

    // Final refresh to ensure markers and positions are correct
    ScrollTrigger.refresh();
});
