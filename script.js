// Total number of pages
const totalPages = 8; // Update this to match your actual number of pages
        
// DOM elements
const flipper = $('#flipper');
const pageInfo = document.getElementById('page-info');
const tip = document.getElementById('tip');
const flipSound = document.getElementById('flip-sound');

// Auto-flip timer
let autoFlipTimer;

// Initialize turn.js
$(document).ready(function() {
    flipper.turn({
        width: $('.flipper-container').width(),
        height: $('.flipper-container').height(),
        elevation: 50,
        gradients: true,
        autoCenter: true,
        display: 'single', // Show only one page at a time
        when: {
            turning: function(event, page, pageObject) {
                updatePageInfo(page);
                // Play flip sound
                playFlipSound();
                // Reset auto-flip timer when manually flipped
                resetAutoFlipTimer();
            },
            turned: function(event, page, pageObject) {
                // Hide tip after first flip
                setTimeout(() => {
                    tip.classList.add('hidden');
                }, 7000);
            }
        }
    });
    
    // Initial page info
    updatePageInfo(flipper.turn('page'));
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            flipper.turn('previous');
        } else if (e.key === 'ArrowRight') {
            flipper.turn('next');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        flipper.turn('size', 
            $('.flipper-container').width(),
            $('.flipper-container').height());
    });
    
    // Start auto-flip
    startAutoFlip();
});

// Update page info
function updatePageInfo(page) {
    pageInfo.textContent = `Page ${page} of ${totalPages}`;
}

// Play flip sound
function playFlipSound() {
    flipSound.currentTime = 0;
    flipSound.play().catch(err => {
        console.log('Audio play failed:', err);
        // Some browsers require user interaction before playing audio
    });
}

// Auto-flip functionality
function startAutoFlip() {
    autoFlipTimer = setInterval(() => {
        if (flipper.turn('page') >= totalPages) {
            flipper.turn('page', 1); // Loop back to first page
        } else {
            flipper.turn('next');
            playFlipSound();
        }
    }, 7000); // Flip every 7 seconds (changed from 4 to 7)
}

// Reset auto-flip timer
function resetAutoFlipTimer() {
    clearInterval(autoFlipTimer);
    startAutoFlip();
}