// Professional Pixel Cat Sprite Sheet Animation System
// Ready to use with actual sprite sheets from itch.io or other sources

document.addEventListener('DOMContentLoaded', () => {
    const catContainer = document.getElementById('cat-container');
    const catSprite = document.getElementById('cat-sprite');
    
    // Configuration for sprite sheet (update when you add actual sprite sheet)
    const spriteConfig = {
        // Example: 32x32 sprites, 4 frames for walking
        frameWidth: 32,
        frameHeight: 32,
        framesPerRow: 4,
        totalFrames: 4,
        // Update this path when you download sprite sheet
        spriteSheet: 'assets/cat-sprite-sheet.png', // Set to null to use fallback
        useSpriteSheet: false // Set to true when you add sprite sheet
    };
    
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
    let catState = 'idle';
    let currentFrame = 0;
    
    // Cat position
    let catX = 50;
    let catY = window.innerHeight * 0.7;
    let facingRight = true;
    
    // Initialize sprite sheet if available
    if (spriteConfig.useSpriteSheet && spriteConfig.spriteSheet) {
        catSprite.style.backgroundImage = `url('${spriteConfig.spriteSheet}')`;
        catSprite.style.backgroundSize = `auto ${spriteConfig.frameHeight}px`;
        catSprite.style.width = `${spriteConfig.frameWidth}px`;
        catSprite.style.height = `${spriteConfig.frameHeight}px`;
    }
    
    // Update sprite frame
    function updateSpriteFrame(frame) {
        if (spriteConfig.useSpriteSheet) {
            const x = -(frame % spriteConfig.framesPerRow) * spriteConfig.frameWidth;
            const y = -Math.floor(frame / spriteConfig.framesPerRow) * spriteConfig.frameHeight;
            catSprite.style.backgroundPosition = `${x}px ${y}px`;
        }
        currentFrame = frame;
    }
    
    // Initialize cat position
    updateCatPosition();
    
    // Natural cat behaviors
    const behaviors = {
        walkToSection: (sectionId) => {
            const section = document.getElementById(sectionId);
            if (!section) return;
            
            const rect = section.getBoundingClientRect();
            const targetX = rect.left + rect.width / 2 - spriteConfig.frameWidth / 2;
            const targetY = rect.top + rect.height - 100;
            
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
            updateSpriteFrame(0); // Idle frame
            
            pauseTimer = 2000 + Math.random() * 3000;
            
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
            updateSpriteFrame(0); // Idle/sit frame
            
            setTimeout(() => {
                if (catState === 'sitting') {
                    catState = 'idle';
                    chooseNextAction();
                }
            }, 1000 + Math.random() * 2000);
        }
    };
    
    // Animate sprite frames during walking
    function animateWalkFrames() {
        if (isWalking && spriteConfig.useSpriteSheet) {
            currentFrame = (currentFrame + 1) % spriteConfig.totalFrames;
            updateSpriteFrame(currentFrame);
        }
    }
    
    // Run frame animation
    setInterval(animateWalkFrames, 150); // 150ms per frame
    
    // Smooth movement function
    function smoothMoveTo(targetX, targetY, duration = 2000) {
        const startX = catX;
        const startY = catY;
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const ease = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            catX = startX + (targetX - startX) * ease;
            catY = startY + (targetY - startY) * ease;
            
            updateCatPosition();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (isWalking && currentTarget && 
                    Math.abs(catX - currentTarget.x) < 10 && 
                    Math.abs(catY - currentTarget.y) < 10) {
                    currentTarget = null;
                    isWalking = false;
                    catContainer.classList.remove('walking');
                    updateSpriteFrame(0);
                    
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
    }, 8000);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (catY > window.innerHeight * 0.9) {
            catY = window.innerHeight * 0.7;
            updateCatPosition();
        }
    });
    
    // Interactive: Cat occasionally looks at mouse
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (Math.random() > 0.8 && !isWalking && catState === 'idle') {
            const lookX = mouseX - spriteConfig.frameWidth / 2;
            
            if (lookX > catX) {
                facingRight = true;
                catContainer.classList.remove('facing-left');
            } else {
                facingRight = false;
                catContainer.classList.add('facing-left');
            }
        }
    });
    
    // Scroll parallax
    window.addEventListener('scroll', () => {
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
                
                setTimeout(() => {
                    behaviors.walkToSection(target.id);
                }, 500);
            }
        });
    });
});
