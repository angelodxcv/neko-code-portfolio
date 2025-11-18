// Cat sprite animation - cycles through frames like the extension
document.addEventListener('DOMContentLoaded', () => {
    const catSprite = document.getElementById('cat-sprite');
    const catContainer = document.querySelector('.cat-container');
    
    if (catSprite) {
        const frames = [
            'assets/tabby-1.svg',
            'assets/tabby-2.svg',
            'assets/tabby-3.svg',
            'assets/tabby-4.svg',
            'assets/tabby-5.svg'
        ];
        
        let currentFrame = 0;
        let lastFrameTime = 0;
        const frameInterval = 150; // milliseconds between frames
        
        function animateCat(timestamp) {
            if (!lastFrameTime) lastFrameTime = timestamp;
            const elapsed = timestamp - lastFrameTime;
            
            if (elapsed >= frameInterval) {
                // Cycle through frames
                currentFrame = (currentFrame + 1) % frames.length;
                catSprite.src = frames[currentFrame];
                lastFrameTime = timestamp;
            }
            
            requestAnimationFrame(animateCat);
        }
        
        // Start animation
        requestAnimationFrame(animateCat);
        
        // Randomize the cat's vertical position slightly
        if (catContainer) {
            const randomY = Math.random() * 50 - 25;
            catContainer.style.bottom = `${20 + randomY}px`;
            
            // Randomize animation duration
            const randomDuration = 15 + Math.random() * 10;
            catContainer.style.animationDuration = `${randomDuration}s`;
        }
    }
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = 1 - scrolled / 500;
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
            }
        });
    });
});

