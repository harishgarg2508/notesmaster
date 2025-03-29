// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('menu-active');
        });
    }

    // Services Slider
    const sliderContainer = document.querySelector('.services-slider');
    const slides = document.querySelectorAll('.service-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    
    if (sliderContainer && slides.length && prevBtn && nextBtn) {
        let currentIndex = 0;
        const slideWidth = 300 + 32; // Width of slide + gap
        const maxIndex = Math.ceil(slides.length - sliderContainer.offsetWidth / slideWidth);
        
        // Update active dot
        function updateDots() {
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Scroll to slide
        function scrollToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            sliderContainer.scrollTo({
                left: currentIndex * slideWidth,
                behavior: 'smooth'
            });
            updateDots();
        }
        
        // Event listeners
        prevBtn.addEventListener('click', () => scrollToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => scrollToSlide(currentIndex + 1));
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => scrollToSlide(index));
        });
        
        // Initial setup
        updateDots();
        
        // Auto slide every 5 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % (maxIndex + 1);
            scrollToSlide(currentIndex);
        }, 5000);
    }
    
    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .service-slide, .testimonial-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animations
    const elementsToAnimate = document.querySelectorAll('.feature-card, .service-slide, .testimonial-card');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    
    // Trigger once on load
    animateOnScroll();
});