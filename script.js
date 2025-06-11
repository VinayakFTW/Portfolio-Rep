document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.documentElement.classList.add('light-mode');
            document.body.classList.add('light-mode');
        }
        
        updateThemeIcon();
        
        themeToggle.addEventListener('click', function() {
            console.log('Theme toggle clicked');
            
            document.documentElement.classList.toggle('light-mode');
            document.body.classList.toggle('light-mode');
            
            const isLightMode = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
            
            updateThemeIcon();
            
            console.log('Theme changed to:', isLightMode ? 'light' : 'dark');
        });
    }
    
    function updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-toggle i');
        if (themeIcon) {
            const isLightMode = document.body.classList.contains('light-mode');
            
            if (isLightMode) {
                themeIcon.className = '';
                themeIcon.className = 'fas fa-sun';
            } else {
                themeIcon.className = '';
                themeIcon.className = 'fas fa-moon';
            }
            
            console.log('Icon updated to:', themeIcon.className);
        }
    }
    
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    const texts = [
        "A student of Artificial Intelligence and Machine Learning",
        "I am Currently a Second Year in Symbiosis Institute Of Technology Pune pursuing my B.Tech",
        "I did my 12th grade from Delhi Public School Vasant Kunj"
    ];
    
    const typingText = document.getElementById('typing-text');
    
    if (typingText) {
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 100;
        let newTextDelay = 2000;
        let deleteDelay = 50;
        
        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingDelay = deleteDelay;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingDelay = 100;
            }
            
            // Ensure proper cursor placement
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.style.display = 'inline-block';
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingDelay = newTextDelay;
            } 
            else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingDelay = 500;
            }
            
            setTimeout(type, typingDelay);
        }
        
        setTimeout(type, 1000);
    }
});
