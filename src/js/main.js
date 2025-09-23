// Main JavaScript for Personal Website
document.addEventListener('DOMContentLoaded', function() {
    // Adding loaded class for fade-in effect
    document.body.classList.add('loaded');
    
    // Navigation functionality
    initNavigation();
    // Carousel functionality
    initCarousel();
    // Modal functionality
    initModals();
    // Smooth scrolling
    initSmoothScrolling();
});

// Navigation Functions
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const progressBar = document.querySelector('.nav-progress-bar');
    const sections = document.querySelectorAll('section');
    
    // Navbar scroll effects
    window.addEventListener('scroll', () => {
        handleNavbarResize();
        updateProgressBar();
        updateActiveNavLink();
    });
    
    function handleNavbarResize() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    function updateProgressBar() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.scrollY;
        const progress = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
    
    function updateActiveNavLink() {
        let current = '';
        const offset = navbar.offsetHeight + 50;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Special case for when we're at the bottom of the page
        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10) {
            current = sections[sections.length - 1].getAttribute('id');
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// Carousel Functions
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn--right');
    const prevButton = document.querySelector('.carousel-btn--left');
    
    let currentSlideIndex = 0;
    const slideWidth = slides[0].getBoundingClientRect().width;
    
    // Arrange slides next to each other
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);
    
    const moveToSlide = (targetIndex) => {
        track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
        
        // Update current slide class
        slides.forEach(slide => slide.classList.remove('current-slide'));
        slides[targetIndex].classList.add('current-slide');
        
        currentSlideIndex = targetIndex;
    };
    
    // Next button
    nextButton.addEventListener('click', () => {
        const nextIndex = currentSlideIndex === slides.length - 1 ? 0 : currentSlideIndex + 1;
        moveToSlide(nextIndex);
    });
    
    // Previous button
    prevButton.addEventListener('click', () => {
        const prevIndex = currentSlideIndex === 0 ? slides.length - 1 : currentSlideIndex - 1;
        moveToSlide(prevIndex);
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaX = startX - currentX;
        const threshold = 50; // Minimum swipe distance
        
        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
                // Swipe left - next slide
                const nextIndex = currentSlideIndex === slides.length - 1 ? 0 : currentSlideIndex + 1;
                moveToSlide(nextIndex);
            } else {
                // Swipe right - previous slide
                const prevIndex = currentSlideIndex === 0 ? slides.length - 1 : currentSlideIndex - 1;
                moveToSlide(prevIndex);
            }
        }
    });
}

// Modal Functions
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('.project-btn');
    const closeButtons = document.querySelectorAll('.close');
    
    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                // Close any open modals first
                modals.forEach(m => m.classList.remove('show'));
                
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                
                // Force modal to appear on top
                modal.style.zIndex = '5000';
            }
        });
    });
    
    // Close modal functions
    const closeModal = (modal) => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scrolling
        modal.style.zIndex = '';
    };
    
    // Close button click
    closeButtons.forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = closeBtn.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Click outside modal to close
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

// Smooth Scrolling Functions
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
    
    [...navLinks, ...heroButtons].forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Additional Animations and Effects
window.addEventListener('scroll', () => {
    // Fade in elements on scroll
    const elementsToAnimate = document.querySelectorAll('.project-card, .skill-tag, .contact-item');
    
    elementsToAnimate.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.project-card, .skill-tag, .contact-item');
    
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

// Skills section animation
const observeSkills = () => {
    const skillsSection = document.querySelector('.skills');
    const skillTags = document.querySelectorAll('.skill-tag');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillTags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
                    }, index * 100);
                });
                observer.unobserve(skillsSection);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(skillsSection);
};

// Initialize skills animation
document.addEventListener('DOMContentLoaded', observeSkills);

// Video background handling
const initVideoBackground = () => {
    const video = document.querySelector('.skills-video-background video');
    
    if (video) {
        // Ensure video plays
        video.play().catch(error => {
            console.log('Video autoplay failed:', error);
        });
        
        // Pause video when not in view to save resources
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        });
        
        observer.observe(video);
    }
};

// Initialize video background
document.addEventListener('DOMContentLoaded', initVideoBackground);

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger hero animations
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons, .hero-image');
    heroElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
    });
});

console.log('Personal website loaded successfully!');
