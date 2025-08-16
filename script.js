document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all buttons and sections
            navButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked button and corresponding section
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });

    // Music functionality
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    let isPlaying = false;
    let hasUserInteracted = false;

    // Check if audio file exists
    function checkAudioFile() {
        const audio = new Audio();
        audio.src = 'Shadow Grip.mp3';
        
        audio.addEventListener('canplaythrough', () => {
            console.log('Audio file loaded successfully');
        });
        
        audio.addEventListener('error', (e) => {
            console.log('Audio file not found - showing instructions');
            showAudioInstructions();
        });
    }

    // Show instructions for adding music file
    function showAudioInstructions() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 212, 255, 0.95);
            color: white;
            padding: 20px 25px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
            z-index: 1001;
            font-size: 14px;
            max-width: 350px;
            font-family: 'JetBrains Mono', monospace;
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        message.innerHTML = `
            <strong>🎵 Music Setup</strong><br><br>
            To enable "Shadow Grip":<br>
            1. Download the MP3 file<br>
            2. Rename it to "Shadow Grip.mp3"<br>
            3. Place it in the website folder<br>
            4. Refresh the page
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 8000);
        
        // Allow manual dismissal
        message.addEventListener('click', () => {
            message.remove();
        });
    }

    musicToggle.addEventListener('click', function() {
        hasUserInteracted = true;
        
        if (isPlaying) {
            backgroundMusic.pause();
            musicToggle.textContent = '🎵';
            musicToggle.classList.remove('playing');
            isPlaying = false;
        } else {
            // Reset currentTime to start from beginning if ended
            if (backgroundMusic.ended) {
                backgroundMusic.currentTime = 0;
            }
            
            // Try to play music
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicToggle.textContent = '⏸️';
                    musicToggle.classList.add('playing');
                    isPlaying = true;
                }).catch(error => {
                    console.log('Playback failed:', error);
                    if (error.name === 'NotSupportedError' || error.name === 'NotAllowedError') {
                        showMusicError('Audio file not found or format not supported');
                    } else {
                        showMusicError('Could not play audio: ' + error.message);
                    }
                });
            }
        }
    });

    // Handle music ended event
    backgroundMusic.addEventListener('ended', function() {
        musicToggle.textContent = '🎵';
        musicToggle.classList.remove('playing');
        isPlaying = false;
    });

    // Handle music loading errors
    backgroundMusic.addEventListener('error', function(e) {
        console.log('Audio error:', e);
        if (hasUserInteracted) {
            showAudioInstructions();
        }
    });

    // Show error message
    function showMusicError(errorMsg) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(231, 76, 60, 0.95);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
            z-index: 1001;
            font-size: 14px;
            max-width: 300px;
            font-family: 'JetBrains Mono', monospace;
        `;
        message.textContent = errorMsg;
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }

    // Check audio file on load
    checkAudioFile();

    // Smooth scrolling for better UX
    function smoothScrollToSection(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.experience-item, .education-item, .skill-category, .contact-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add typing animation to the tagline
    const tagline = document.querySelector('.tagline');
    const originalText = tagline.textContent;
    tagline.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            tagline.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing animation after a brief delay
    setTimeout(typeWriter, 1000);

    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    });

    // Easter egg: Konami code
    let konamiCode = '';
    const konami = '38384040373937396665';
    
    document.addEventListener('keydown', function(e) {
        konamiCode += e.keyCode;
        if (konamiCode.length > konami.length) {
            konamiCode = konamiCode.substr(konamiCode.length - konami.length);
        }
        if (konamiCode === konami) {
            showEasterEgg();
        }
    });

    function showEasterEgg() {
        const colors = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6'];
        let colorIndex = 0;
        
        const interval = setInterval(() => {
            document.body.style.background = `linear-gradient(135deg, ${colors[colorIndex]} 0%, ${colors[(colorIndex + 1) % colors.length]} 100%)`;
            colorIndex = (colorIndex + 1) % colors.length;
        }, 200);
        
        setTimeout(() => {
            clearInterval(interval);
            document.body.style.background = 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
        }, 3000);
    }

    // Add loading animation
    function addLoadingAnimation() {
        const elements = document.querySelectorAll('.section-content > *');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Initialize loading animation
    addLoadingAnimation();

    // Handle music volume and setup
    function setMusicVolume() {
        const hour = new Date().getHours();
        let volume = 0.4; // Default volume
        
        if (hour >= 22 || hour <= 6) {
            volume = 0.2; // Quieter at night
        } else if (hour >= 9 && hour <= 17) {
            volume = 0.3; // Moderate during work hours
        }
        
        backgroundMusic.volume = volume;
    }

    // Initialize music settings
    setMusicVolume();
    backgroundMusic.preload = 'metadata';
    
    // Add country flag click animations
    document.querySelectorAll('.country-flag').forEach(flag => {
        flag.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Create floating country info
            const info = document.createElement('div');
            const rect = this.getBoundingClientRect();
            
            info.style.cssText = `
                position: fixed;
                top: ${rect.top - 50}px;
                left: ${rect.left - 20}px;
                background: rgba(0, 212, 255, 0.95);
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 12px;
                z-index: 1002;
                font-family: 'JetBrains Mono', monospace;
                box-shadow: 0 5px 15px rgba(0, 212, 255, 0.3);
                pointer-events: none;
                animation: fadeInOut 2s ease-in-out;
            `;
            
            const countryCode = this.closest('[data-country]')?.getAttribute('data-country');
            const countryNames = {
                'us': '🇺🇸 United States',
                'sg': '🇸🇬 Singapore', 
                'cn': '🇨🇳 China',
                'jp': '🇯🇵 Japan',
                'de': '🇩🇪 Germany',
                'uk': '🇬🇧 United Kingdom',
                'es': '🇪🇸 Spain',
                'hk': '🇭🇰 Hong Kong',
                'global': '🌍 Global Program'
            };
            
            info.textContent = countryNames[countryCode] || 'Global Experience';
            document.body.appendChild(info);
            
            setTimeout(() => {
                if (info.parentNode) {
                    info.remove();
                }
            }, 2000);
        });
    });
    
    // Add CSS for fadeInOut animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(10px); }
            50% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
});