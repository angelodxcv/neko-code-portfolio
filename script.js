// Pixel Cat Exploration System
document.addEventListener('DOMContentLoaded', () => {
    const catContainer = document.getElementById('cat-container');
    const pixelCat = document.getElementById('pixel-cat');
    
    // Sections the cat can explore
    const sections = [
        { id: 'hero-section', name: 'Hero' },
        { id: 'about-section', name: 'About' },
        { id: 'skills-section', name: 'Skills' },
        { id: 'projects-section', name: 'Projects' },
        { id: 'contact-section', name: 'Contact' }
    ];
    
    let currentTarget = null;
    let isWalking = false;
    let isPaused = false;
    let pauseTimer = 0;
    let catState = 'idle'; // idle, walking, exploring, sitting
    
    // Cat position
    let catX = 50;
    let catY = window.innerHeight * 0.7;
    let facingRight = true;
    
    // Initialize cat position
    updateCatPosition();
    
    // Natural cat behaviors
    const behaviors = {
        walkToSection: (sectionId) => {
            const section = document.getElementById(sectionId);
            if (!section) return;
            
            const rect = section.getBoundingClientRect();
            const targetX = rect.left + rect.width / 2 - 24; // Center of section
            const targetY = rect.top + rect.height - 100; // Near bottom of section
            
            currentTarget = { x: targetX, y: targetY };
            isWalking = true;
            catState = 'walking';
            catContainer.classList.add('walking');
            
            // Face the right direction
            if (targetX > catX) {
                facingRight = true;
                catContainer.classList.remove('facing-left');
            } else {
                facingRight = false;
                catContainer.classList.add('facing-left');
            }
        },
        
        pauseAndExplore: () => {
            isPaused = true;
            isWalking = false;
            catState = 'exploring';
            catContainer.classList.remove('walking');
            
            // Random exploration time (2-5 seconds)
            pauseTimer = 2000 + Math.random() * 3000;
            
            // Sometimes look around (slight movement)
            setTimeout(() => {
                if (catState === 'exploring') {
                    const lookX = catX + (Math.random() * 100 - 50);
                    const lookY = catY + (Math.random() * 20 - 10);
                    smoothMoveTo(lookX, lookY, 1000);
                }
            }, pauseTimer / 2);
        },
        
        sit: () => {
            catState = 'sitting';
            isWalking = false;
            catContainer.classList.remove('walking');
            
            // Sit for 1-3 seconds
            setTimeout(() => {
                if (catState === 'sitting') {
                    catState = 'idle';
                    chooseNextAction();
                }
            }, 1000 + Math.random() * 2000);
        }
    };
    
    // Smooth movement function
    function smoothMoveTo(targetX, targetY, duration = 2000) {
        const startX = catX;
        const startY = catY;
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for natural movement
            const ease = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            catX = startX + (targetX - startX) * ease;
            catY = startY + (targetY - startY) * ease;
            
            updateCatPosition();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Arrived at destination
                if (isWalking && currentTarget && 
                    Math.abs(catX - currentTarget.x) < 10 && 
                    Math.abs(catY - currentTarget.y) < 10) {
                    currentTarget = null;
                    isWalking = false;
                    catContainer.classList.remove('walking');
                    
                    // Decide what to do next
                    setTimeout(() => {
                        if (Math.random() > 0.5) {
                            behaviors.sit();
                        } else {
                            behaviors.pauseAndExplore();
                        }
                    }, 500);
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    function updateCatPosition() {
        catContainer.style.left = `${catX}px`;
        catContainer.style.bottom = `${window.innerHeight - catY}px`;
    }
    
    function chooseNextAction() {
        if (isPaused) {
            pauseTimer -= 100;
            if (pauseTimer <= 0) {
                isPaused = false;
                chooseNextAction();
            }
            return;
        }
        
        // Randomly choose a section to visit
        const randomSection = sections[Math.floor(Math.random() * sections.length)];
        behaviors.walkToSection(randomSection.id);
    }
    
    // Start exploring
    setTimeout(() => {
        chooseNextAction();
    }, 1000);
    
    // Continuous exploration loop
    setInterval(() => {
        if (!isWalking && !isPaused && catState === 'idle') {
            chooseNextAction();
        }
    }, 8000); // Check every 8 seconds
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Adjust cat position if needed
        if (catY > window.innerHeight * 0.9) {
            catY = window.innerHeight * 0.7;
            updateCatPosition();
        }
    });
    
    // Interactive: Cat follows mouse (optional, can be disabled)
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseMove = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        lastMouseMove = Date.now();
        
        // Occasionally look at mouse (20% chance)
        if (Math.random() > 0.8 && !isWalking && catState === 'idle') {
            const lookX = mouseX - 24;
            const lookY = mouseY;
            
            // Face mouse
            if (lookX > catX) {
                facingRight = true;
                catContainer.classList.remove('facing-left');
            } else {
                facingRight = false;
                catContainer.classList.add('facing-left');
            }
        }
    });
    
    // Scroll parallax for sections
    window.addEventListener('scroll', () => {
        // Cat adjusts position slightly based on scroll
        const scrollY = window.pageYOffset;
        const adjustedY = window.innerHeight * 0.7 - scrollY * 0.1;
        
        if (adjustedY > window.innerHeight * 0.3 && adjustedY < window.innerHeight * 0.9) {
            catY = adjustedY;
            updateCatPosition();
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Cat walks to the clicked section
                setTimeout(() => {
                    behaviors.walkToSection(target.id);
                }, 500);
            }
        });
    });
});
