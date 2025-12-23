// PolarisONE ScriptWEAVER JavaScript
// Advanced Interactivity and Animations

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
    
    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counter animation
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            }
        });
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (nav) {
            if (scrollTop > 100) {
                nav.style.background = 'rgba(15, 23, 42, 0.95)';
                nav.style.boxShadow = '0 10px 30px rgba(6, 182, 212, 0.2)';
            } else {
                nav.style.background = 'rgba(15, 23, 42, 0.7)';
                nav.style.boxShadow = 'none';
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Parallax effect for floating elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Pricing Toggle (Monthly/Annual)
    const billingToggle = document.getElementById('billing-toggle');
    
    if (billingToggle) {
        billingToggle.addEventListener('change', function() {
            const isAnnual = this.checked;
            const monthlyPrices = document.querySelectorAll('.price-monthly');
            const annualPrices = document.querySelectorAll('.price-annual');
            const annualSavings = document.querySelectorAll('.annual-savings');
            
            if (isAnnual) {
                monthlyPrices.forEach(price => price.classList.add('hidden'));
                annualPrices.forEach(price => price.classList.remove('hidden'));
                annualSavings.forEach(saving => saving.classList.remove('hidden'));
            } else {
                monthlyPrices.forEach(price => price.classList.remove('hidden'));
                annualPrices.forEach(price => price.classList.add('hidden'));
                annualSavings.forEach(saving => saving.classList.add('hidden'));
            }
        });
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                // Close other FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-question i');
                        if (otherAnswer && !otherAnswer.classList.contains('hidden')) {
                            otherAnswer.classList.add('hidden');
                            if (otherIcon) {
                                otherIcon.classList.remove('fa-chevron-up');
                                otherIcon.classList.add('fa-chevron-down');
                            }
                        }
                    }
                });
                
                // Toggle current FAQ
                answer.classList.toggle('hidden');
                if (icon) {
                    icon.classList.toggle('fa-chevron-down');
                    icon.classList.toggle('fa-chevron-up');
                }
            });
        }
    });
    
    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual backend call)
            fetch('contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Show success message
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
            })
            .catch(error => {
                // Show error message
                showNotification('Error sending message. Please try again.', 'error');
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification fixed top-24 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-lg transform transition-all duration-500 ${
            type === 'success' ? 'bg-green-500/20 border-2 border-green-400 text-green-300' :
            type === 'error' ? 'bg-red-500/20 border-2 border-red-400 text-red-300' :
            'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
    
    // Play Demo Video
    const playButtons = document.querySelectorAll('.play-button');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            showNotification('Demo video coming soon!', 'info');
        });
    });
    
    // Pricing Plan Selection
    const pricingButtons = document.querySelectorAll('.pricing-card button');
    
    pricingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planName = this.closest('.pricing-card').querySelector('h3').textContent;
            showNotification(`Selected ${planName} plan! Redirecting to checkout...`, 'success');
            
            // Simulate redirect after 2 seconds
            setTimeout(() => {
                // window.location.href = '/checkout';
            }, 2000);
        });
    });
    
    // Cursor Effect (Optional advanced effect)
    let cursor = null;
    
    if (window.innerWidth > 768) {
        cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            width: 20px;
            height: 20px;
            border: 2px solid #06b6d4;
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            transform: translate(-50%, -50%);
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', function(e) {
            if (cursor) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            }
        });
        
        // Expand cursor on hover over interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .feature-card, .pricing-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                if (cursor) {
                    cursor.style.width = '40px';
                    cursor.style.height = '40px';
                    cursor.style.borderColor = '#a855f7';
                }
            });
            
            element.addEventListener('mouseleave', function() {
                if (cursor) {
                    cursor.style.width = '20px';
                    cursor.style.height = '20px';
                    cursor.style.borderColor = '#06b6d4';
                }
            });
        });
    }
    
    // Particles Effect (Simplified)
    function createParticles() {
        const particlesContainer = document.getElementById('particles-bg');
        if (!particlesContainer) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: ${['#06b6d4', '#a855f7', '#ec4899', '#10b981', '#f97316'][Math.floor(Math.random() * 5)]};
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.2};
                animation: particleMove ${Math.random() * 20 + 10}s linear infinite;
            `;
            particlesContainer.appendChild(particle);
        }
    }
    
    // Add particle animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleMove {
            0% {
                transform: translate(0, 0) scale(1);
            }
            50% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.5);
            }
            100% {
                transform: translate(0, 0) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize particles
    createParticles();
    
    // Animate elements on scroll
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });
    
    // Apply animation to various elements
    const elementsToAnimate = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card, .glass-card');
    
    elementsToAnimate.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.6s ease ${index * 0.1}s`;
        animateOnScroll.observe(element);
    });
    
    // Typing Effect for Hero Title (Optional)
    function typeWriter(element, text, speed = 100) {
        if (!element) return;
        
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Matrix Rain Effect for Background (Optional advanced effect)
    function createMatrixRain() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
            opacity: 0.05;
        `;
        document.body.insertBefore(canvas, document.body.firstChild);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = '01';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }
        
        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#06b6d4';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                drops[i]++;
            }
        }
        
        setInterval(draw, 50);
        
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    // Uncomment to enable matrix rain effect
    // createMatrixRain();
    
    // Page Load Animation
    document.body.style.opacity = '0';
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // Keyboard Shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search (if implemented)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // Focus search input if exists
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) searchInput.focus();
        }
    });
    
    // Console Easter Egg
    console.log('%c🚀 PolarisONE ScriptWEAVER', 'font-size: 20px; color: #06b6d4; font-weight: bold;');
    console.log('%cWelcome to the future of Roblox development!', 'font-size: 14px; color: #a855f7;');
    console.log('%cInterested in joining our team? Contact us at careers@scriptweaver.ai', 'font-size: 12px; color: #10b981;');
});
