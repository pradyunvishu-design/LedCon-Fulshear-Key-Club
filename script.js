const canvas = document.getElementById('hero-lightpass');
const context = canvas.getContext('2d', { alpha: true });
const video = document.getElementById('source-video');
const messageOverlay = document.getElementById('message-overlay');
const loadingText = document.getElementById('loading-text');

let isVideoLoaded = false;
let targetTime = 0;
let currentTime = 0;

// Setup canvas bounds the moment the video metadata is readable
video.addEventListener('loadedmetadata', () => {
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;
    isVideoLoaded = true;
    loadingText.textContent = "Scroll down to experience the 3D depth.";
});

video.addEventListener('canplay', () => {
    // Initial draw to get it painted on screen
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
});

// Force the video to begin buffering so it scrubs smoothly
video.load();
video.pause();

// Expose a global function to allow our UI to change the blend mode!
window.setBlendMode = function(mode) {
    canvas.style.mixBlendMode = mode;
    
    // Adjust shadow dynamically based on blend mode for the perfect floating effect
    if (mode === 'normal') {
        canvas.style.filter = 'drop-shadow(0px 30px 40px rgba(0, 0, 0, 0.5))'; // Normal shadow
    } else if (mode === 'screen' || mode === 'color-dodge') {
        // If they remove black background, standard black shadows look weird, so we give it a gold glow shadow.
        canvas.style.filter = 'drop-shadow(0px 20px 40px rgba(197, 160, 89, 0.3))';
    } else {
        canvas.style.filter = 'none';
    }
}

// By default, assuming the video has a black background
setBlendMode('screen');

function updateAnimations() {
    if (!isVideoLoaded || isNaN(video.duration)) {
        requestAnimationFrame(updateAnimations);
        return;
    }

    // Smooth ease (Lerp) towards the target timestamp
    currentTime += (targetTime - currentTime) * 0.1;
    
    // Cap the time to the bounds of the video
    const timeToApply = Math.max(0, Math.min(currentTime, video.duration - 0.001));

    // Force the video element to seek to this calculated time
    if (Math.abs(video.currentTime - timeToApply) > 0.005) {
        video.currentTime = timeToApply;
    }
    
    // Repost the latest video pixel state to our master canvas view!
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Parallax fade for the intro text overlay
    if (window.scrollY > 50) {
        messageOverlay.style.opacity = '0';
        messageOverlay.style.transform = 'translate(-50%, -60%) scale(0.95)';
    } else {
        messageOverlay.style.opacity = '1';
        messageOverlay.style.transform = 'translate(-50%, -50%) scale(1)';
    }

    requestAnimationFrame(updateAnimations);
}

// Kick off the 60fps loop!
requestAnimationFrame(updateAnimations);

// Update Target Frame Timestamp whenever the mouse wheels/scrolls!
window.addEventListener('scroll', () => {  
    if (!isVideoLoaded) return;
    
    // How much space can we functionally scroll?
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    // Percentage ratio (0 to 1) multiplied by video total time
    const scrollProgress = window.scrollY / maxScroll;
    
    targetTime = scrollProgress * video.duration;
});

// A tiny safeguard for browsers that prevent programmatic video interaction before a user click
window.addEventListener('click', () => {
    if(video.paused && video.currentTime === 0) {
        video.play().then(() => video.pause()).catch(e => console.info("Autoplay rules block play.", e));
    }
}, { once: true });
