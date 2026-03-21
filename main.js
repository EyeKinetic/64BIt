// Main Application Logic
// Handles Animations, Audio Routing, and Interactions

let audioContext;
let gainNode;
let audioInitialized = false;

/**
 * Initializes the Web Audio API synthesizer used for background ambience
 * and UI interaction sound effects.
 */
function initAudio() {
    if (audioInitialized) return;
    audioInitialized = true;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();

    // Create a deep ambient drone
    let osc1 = audioContext.createOscillator();
    let osc2 = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    let filter = audioContext.createBiquadFilter();

    osc1.frequency.value = 80;
    osc2.frequency.value = 160;
    
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    
    gainNode.gain.value = 0.05;

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(audioContext.destination);
    
    osc1.start();
    osc2.start();

    // Add a pulsing low-frequency oscillation for depth
    let lfo = audioContext.createOscillator();
    let lfoGain = audioContext.createGain();
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = 0.02;

    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);
    lfo.start();
}

/**
 * Triggers a quick synth "blip" sound effect. Usually used on clicks.
 */
function playBlipSound() {
    if (!audioContext) return;
    
    let osc = audioContext.createOscillator();
    let gain = audioContext.createGain();
    
    osc.frequency.setValueAtTime(600, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start();
    osc.stop(audioContext.currentTime + 0.1);
}

// Ensure audio (both the ambient synth & HTML5 Audio element) starts upon any user engagement
['click', 'mousemove', 'scroll', 'touchstart'].forEach(eventType => {
    document.body.addEventListener(eventType, () => {
        initAudio();
        
        // Let the welcome message play out if it's there
        const welcomeAudio = document.getElementById('welcomeAudio');
        if (welcomeAudio && welcomeAudio.paused && !welcomeAudio.ended) {
            welcomeAudio.play().catch(e => console.log("Browser blocked welcome audio on load."));
        }
    }, { once: true });
});

const welcomeAudio = document.getElementById('welcomeAudio');
const bgMusic = document.getElementById('bgMusic');
const audioBtn = document.getElementById('audio-btn');
let isMusicPlaying = false; 

// Chain ambient background to play endlessly right after the welcome message concludes
if (welcomeAudio && bgMusic) {
    welcomeAudio.addEventListener('ended', () => {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log("Awaiting interaction for ambient."));
        isMusicPlaying = true;
        if(audioBtn) audioBtn.innerHTML = '🔊';
    });
}

// Audio toggle button listener controls the endless ambient track
if (audioBtn && bgMusic) {
    audioBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            audioBtn.innerHTML = '🔇';
        } else {
            bgMusic.volume = 0.3;
            bgMusic.play().catch(e => console.error("Audio playback completely failed:", e));
            audioBtn.innerHTML = '🔊';
        }
        isMusicPlaying = !isMusicPlaying;
    });
}

// Attach ripple effects and sound to clickable stuff
document.querySelectorAll('.clk').forEach(element => {
    element.addEventListener('click', function(e) {
        playBlipSound();
        
        let ripple = document.createElement('span');
        ripple.className = 'ripple';
        let rect = this.getBoundingClientRect();
        
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        
        this.appendChild(ripple);
        
        // Clean up ripple element from DOM
        setTimeout(() => ripple.remove(), 600);
    });
});

/**
 * Custom Cursor Logic
 */
const dot = document.getElementById('dot');
const trail = document.getElementById('trail');
let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if(dot) dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
});

function animateTrail() {
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;
    if(trail) {
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
    }
    requestAnimationFrame(animateTrail);
}
// Start cursor animation loop
animateTrail();

// Expand cursor when hovering interactive elements
document.querySelectorAll('a, .btn, .int').forEach(element => {
    element.addEventListener('mouseenter', () => {
        if(trail) {
            trail.style.transform = 'translate(-50%, -50%) scale(1.5)';
            trail.style.borderColor = 'var(--c)';
        }
    });
    element.addEventListener('mouseleave', () => {
        if(trail) {
            trail.style.transform = 'translate(-50%, -50%) scale(1)';
            trail.style.borderColor = 'var(--p)';
        }
    });
});

// Navigation Progress Bar
window.addEventListener('scroll', () => {
    let scrollPos = document.body.scrollTop || document.documentElement.scrollTop;
    let viewHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let progressBar = document.getElementById('progress');
    if(progressBar) {
        progressBar.style.width = (scrollPos / viewHeight * 100) + '%';
    }
});

/**
 * Interactive Background Canvas Animation
 */
const cvs = document.getElementById('cvs');
let ctx, width, height, points = [];

if (cvs) {
    ctx = cvs.getContext('2d');
    
    function resizeCanvas() {
        width = cvs.width = window.innerWidth;
        height = cvs.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create random floating points
    for(let i = 0; i < 80; i++) {
        points.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }

    // Draw lines between close points
    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        for(let i = 0; i < points.length; i++) {
            let p = points[i];
            
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off walls
            if(p.x < 0 || p.x > width) p.vx *= -1;
            if(p.y < 0 || p.y > height) p.vy *= -1;
            
            for(let j = i + 1; j < points.length; j++) {
                let dist = Math.hypot(p.x - points[j].x, p.y - points[j].y);
                if(dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(157, 0, 255, ${1 - dist / 150})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.stroke();
                }
            }
            // Draw particle dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 243, 255, 0.5)';
            ctx.fill();
        } 
        requestAnimationFrame(animateParticles);
    } 
    animateParticles();
}

/**
 * Scroll Observer (Fades in elements as they scroll into view)
 */
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('act');
            
            // Trigger number counters
            let counters = entry.target.querySelectorAll('.cnt');
            if(counters.length && !entry.target.dataset.done) {
                entry.target.dataset.done = 'true';
                
                counters.forEach(counter => {
                    let targetVal = +counter.getAttribute('data-t');
                    let suffix = counter.getAttribute('data-s') || '';
                    let currentVal = 0;
                    
                    let updateCounter = () => {
                        if(currentVal < targetVal) {
                            currentVal += targetVal / 40;
                            counter.innerText = Math.ceil(currentVal) + suffix;
                            setTimeout(updateCounter, 40);
                        } else {
                            counter.innerText = targetVal + suffix;
                        }
                    };
                    updateCounter();
                });
            }
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

document.querySelectorAll('.rev').forEach(element => observer.observe(element));

/**
 * Typewriter Effect on Page Load
 */
window.addEventListener('load', () => {
    let text = "We Build Digital Experiences";
    let typewriterEl = document.getElementById('tw');
    let index = 0;
    
    if (typewriterEl) {
        typewriterEl.style.borderRightColor = 'var(--c)';
        
        function typeWriter() {
            if(index < text.length) {
                typewriterEl.innerHTML += text.charAt(index++);
                setTimeout(typeWriter, 80); // Typing speed
            } else {
                // Reveal other intro elements
                document.querySelectorAll('.intro').forEach((el, idx) => {
                    el.style.transition = 'all 0.8s ease ' + (idx * 0.2) + 's';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                });
                
                // Hide cursor blink after 2 seconds
                setTimeout(() => { typewriterEl.style.borderRightColor = 'transparent'; }, 2000);
            }
        } 
        // Delay start slightly
        setTimeout(typeWriter, 500);
    }
});

/**
 * Parallax shape movement on mouse move
 */
document.addEventListener('mousemove', e => {
    const shapes = document.querySelector('.shapes');
    if (shapes) {
        let x = (window.innerWidth - e.pageX * 2) / 90;
        let y = (window.innerHeight - e.pageY * 2) / 90;
        shapes.style.transform = `translate(${x}px, ${y}px)`;
    }
});
