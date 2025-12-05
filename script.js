// ===================================
// GAME STATE MANAGEMENT
// ===================================

/**
 * Game states enum for clear state management
 */
const GameState = {
    IDLE: 'idle',
    WAITING: 'waiting',
    READY: 'ready',
    SUCCESS: 'success',
    EARLY: 'early'
};

/**
 * Main game object to manage all game logic and state
 */
const game = {
    state: GameState.IDLE,
    startTime: null,
    timeoutId: null,
    reactionTimes: [],
    bestTime: localStorage.getItem('bestTime') || null,
    soundEnabled: localStorage.getItem('soundEnabled') !== 'false', // Default true
    
    // Configuration
    config: {
        minDelay: 500,      // Minimum delay before color change (ms)
        maxDelay: 2000,     // Maximum delay before color change (ms)
        maxAttempts: 100    // For average calculation
    }
};

// ===================================
// SOUND EFFECTS (Web Audio API)
// ===================================

/**
 * Create sound effects using Web Audio API
 */
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const sounds = {
    /**
     * Play creepy ambient sound
     */
    ambient: () => {
        if (!game.soundEnabled) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 2);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 2);
    },
    
    /**
     * Play heartbeat sound
     */
    heartbeat: () => {
        if (!game.soundEnabled) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    },
    
    /**
     * Play scream/alert sound
     */
    scream: () => {
        if (!game.soundEnabled) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    },
    
    /**
     * Play success/escape sound
     */
    escape: () => {
        if (!game.soundEnabled) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    },
    
    /**
     * Play error/death sound
     */
    death: () => {
        if (!game.soundEnabled) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }
};

// ===================================
// DOM ELEMENTS
// ===================================

const elements = {
    gameBox: document.getElementById('gameBox'),
    gameContent: document.getElementById('gameContent'),
    gameTitle: document.getElementById('gameTitle'),
    gameMessage: document.getElementById('gameMessage'),
    startBtn: document.getElementById('startBtn'),
    currentTime: document.getElementById('currentTime'),
    bestTime: document.getElementById('bestTime'),
    avgTime: document.getElementById('avgTime'),
    soundToggle: document.getElementById('soundToggle')
};

// ===================================
// INITIALIZATION
// ===================================

/**
 * Initialize the game when DOM is loaded
 */
function init() {
    // Display best time if it exists
    updateStatsDisplay();
    
    // Set up event listeners
    elements.startBtn.addEventListener('click', startGame);
    elements.gameBox.addEventListener('click', handleGameBoxClick);
    elements.soundToggle.addEventListener('click', toggleSound);
    
    // Update sound toggle button
    updateSoundButton();
    
    // Play ambient sound on init
    sounds.ambient();
    
    console.log('👻 Haunted Reaction Game initialized!');
}

// ===================================
// SOUND CONTROL
// ===================================

/**
 * Toggle sound on/off
 */
function toggleSound() {
    game.soundEnabled = !game.soundEnabled;
    localStorage.setItem('soundEnabled', game.soundEnabled);
    updateSoundButton();
    
    if (game.soundEnabled) {
        sounds.ambient();
    }
}

/**
 * Update sound button appearance
 */
function updateSoundButton() {
    if (game.soundEnabled) {
        elements.soundToggle.textContent = '🔊';
        elements.soundToggle.classList.remove('muted');
    } else {
        elements.soundToggle.textContent = '🔇';
        elements.soundToggle.classList.add('muted');
    }
}

// ===================================
// GAME FLOW FUNCTIONS
// ===================================

/**
 * Start a new game round
 */
function startGame(event) {
    // Prevent event bubbling to game box
    if (event) {
        event.stopPropagation();
    }
    
    // Clear any existing timeout
    if (game.timeoutId) {
        clearTimeout(game.timeoutId);
    }
    
    // Play heartbeat sound
    sounds.heartbeat();
    
    // Set state to waiting
    game.state = GameState.WAITING;
    updateGameUI({
        icon: '👁️',
        title: 'The Spirit Awakens...',
        message: 'Wait for the darkness to turn green... then ESCAPE!',
        showButton: false
    });
    
    // Generate random delay
    const delay = getRandomDelay();
    
    // Set timeout to change to ready state
    game.timeoutId = setTimeout(() => {
        if (game.state === GameState.WAITING) {
            setReadyState();
        }
    }, delay);
    
    console.log(`⏱️ Delay set to: ${delay}ms`);
}

/**
 * Set the game to ready state (user should click now)
 */
function setReadyState() {
    game.state = GameState.READY;
    game.startTime = performance.now(); // High precision timestamp
    
    // Play scream sound
    sounds.scream();
    
    updateGameUI({
        icon: '💀',
        title: 'ESCAPE NOW!',
        message: 'Click to escape the haunted chamber!',
        showButton: false
    });
    
    console.log('✅ Ready state activated!');
}

/**
 * Handle successful click (user clicked at the right time)
 */
function handleSuccessfulClick() {
    const endTime = performance.now();
    const reactionTime = Math.round(endTime - game.startTime);
    
    // Play escape sound
    sounds.escape();
    
    // Store reaction time
    game.reactionTimes.push(reactionTime);
    if (game.reactionTimes.length > game.config.maxAttempts) {
        game.reactionTimes.shift(); // Keep only last N attempts
    }
    
    // Update best time
    if (!game.bestTime || reactionTime < game.bestTime) {
        game.bestTime = reactionTime;
        localStorage.setItem('bestTime', game.bestTime);
        console.log('🏆 New best time!');
    }
    
    // Set success state
    game.state = GameState.SUCCESS;
    
    // Determine performance message
    const performanceMessage = getPerformanceMessage(reactionTime);
    
    updateGameUI({
        icon: getPerformanceIcon(reactionTime),
        title: `${reactionTime}ms`,
        message: performanceMessage,
        showButton: true,
        buttonText: '🎃 FACE YOUR FEARS AGAIN 🎃'
    });
    
    // Update stats display
    updateStatsDisplay(reactionTime);
    
    console.log(`⚡ Reaction time: ${reactionTime}ms`);
}

/**
 * Handle early click (user clicked before color change)
 */
function handleEarlyClick() {
    // Clear the timeout
    if (game.timeoutId) {
        clearTimeout(game.timeoutId);
    }
    
    // Play death sound
    sounds.death();
    
    game.state = GameState.EARLY;
    
    updateGameUI({
        icon: '☠️',
        title: 'TOO EARLY!',
        message: 'The spirits caught you! Wait for the green light before escaping!',
        showButton: true,
        buttonText: '🔄 TRY TO ESCAPE AGAIN'
    });
    
    console.log('❌ Early click detected!');
}

/**
 * Handle click on the game box
 */
function handleGameBoxClick(event) {
    // Ignore clicks on buttons or other interactive elements
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
        return;
    }
    
    // Only handle clicks when in READY or WAITING state
    if (game.state === GameState.READY) {
        handleSuccessfulClick();
    } else if (game.state === GameState.WAITING) {
        handleEarlyClick();
    }
    // Ignore clicks in all other states (IDLE, SUCCESS, EARLY)
}

// ===================================
// UI UPDATE FUNCTIONS
// ===================================

/**
 * Update the game UI with new content and state
 * @param {Object} options - UI configuration options
 */
function updateGameUI(options) {
    const {
        icon = '🕷️',
        title = '',
        message = '',
        showButton = false,
        buttonText = '🎃 ENTER IF YOU DARE 🎃'
    } = options;
    
    // Update content
    elements.gameContent.innerHTML = `
        <div class="icon">${icon}</div>
        <h2 id="gameTitle">${title}</h2>
        <p id="gameMessage">${message}</p>
        ${showButton ? `<button class="btn btn-primary" id="startBtn"><span>${buttonText}</span></button>` : ''}
    `;
    
    // Re-attach event listener if button exists
    if (showButton) {
        const newBtn = document.getElementById('startBtn');
        newBtn.addEventListener('click', startGame);
    }
    
    // Update game box state class
    elements.gameBox.className = 'game-box';
    elements.gameBox.classList.add(`state-${game.state}`);
}

/**
 * Update the statistics display
 * @param {number} currentTime - Current reaction time (optional)
 */
function updateStatsDisplay(currentTime = null) {
    // Update current time
    if (currentTime !== null) {
        elements.currentTime.textContent = `${currentTime}ms`;
        elements.currentTime.style.animation = 'none';
        setTimeout(() => {
            elements.currentTime.style.animation = 'iconFloat 3s ease-in-out infinite';
        }, 10);
    }
    
    // Update best time
    if (game.bestTime) {
        elements.bestTime.textContent = `${game.bestTime}ms`;
    } else {
        elements.bestTime.textContent = '---';
    }
    
    // Update average time
    if (game.reactionTimes.length > 0) {
        const average = Math.round(
            game.reactionTimes.reduce((sum, time) => sum + time, 0) / game.reactionTimes.length
        );
        elements.avgTime.textContent = `${average}ms`;
    } else {
        elements.avgTime.textContent = '---';
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Generate a random delay between min and max
 * @returns {number} Random delay in milliseconds
 */
function getRandomDelay() {
    const { minDelay, maxDelay } = game.config;
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
}

/**
 * Get performance message based on reaction time (Horror themed)
 * @param {number} time - Reaction time in milliseconds
 * @returns {string} Performance message
 */
function getPerformanceMessage(time) {
    if (time < 150) {
        return '� LEGENDARY! You escaped the spirits with supernatural speed!';
    } else if (time < 200) {
        return '⚡ AMAZING! The darkness couldn\'t catch you!';
    } else if (time < 250) {
        return '🦇 GREAT! You\'re faster than a vampire\'s bite!';
    } else if (time < 300) {
        return '�️ GOOD! The spiders are getting closer...';
    } else if (time < 400) {
        return '🧟 SLOW! The zombies almost got you!';
    } else {
        return '☠️ TOO SLOW! The spirits are laughing at you...';
    }
}

/**
 * Get performance icon based on reaction time (Horror themed)
 * @param {number} time - Reaction time in milliseconds
 * @returns {string} Performance icon
 */
function getPerformanceIcon(time) {
    if (time < 150) {
        return '👻';
    } else if (time < 200) {
        return '⚡';
    } else if (time < 250) {
        return '🦇';
    } else if (time < 300) {
        return '�️';
    } else if (time < 400) {
        return '🧟';
    } else {
        return '☠️';
    }
}

/**
 * Reset game statistics (for debugging or user request)
 */
function resetStats() {
    game.reactionTimes = [];
    game.bestTime = null;
    localStorage.removeItem('bestTime');
    updateStatsDisplay();
    console.log('📊 Statistics reset!');
}

// ===================================
// KEYBOARD SHORTCUTS (BONUS FEATURE)
// ===================================

/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', (event) => {
    // Space or Enter to start game when idle
    if ((event.code === 'Space' || event.code === 'Enter') && 
        (game.state === GameState.IDLE || game.state === GameState.SUCCESS || game.state === GameState.EARLY)) {
        event.preventDefault();
        startGame();
    }
    
    // Space to click when ready
    if (event.code === 'Space' && game.state === GameState.READY) {
        event.preventDefault();
        handleSuccessfulClick();
    }
    
    // R to reset stats (hidden feature)
    if (event.code === 'KeyR' && event.ctrlKey) {
        event.preventDefault();
        resetStats();
    }
    
    // M to toggle sound
    if (event.code === 'KeyM') {
        event.preventDefault();
        toggleSound();
    }
});

// ===================================
// VISIBILITY CHANGE HANDLER
// ===================================

/**
 * Handle page visibility changes (pause game if user switches tabs)
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.state === GameState.WAITING) {
        // User switched tabs while waiting - reset to avoid unfair advantage
        if (game.timeoutId) {
            clearTimeout(game.timeoutId);
        }
        game.state = GameState.IDLE;
        updateGameUI({
            icon: '🦇',
            title: 'The Spirits Await...',
            message: 'Click below to re-enter the haunted chamber',
            showButton: true,
            buttonText: '🎃 ENTER IF YOU DARE 🎃'
        });
        console.log('⏸️ Game paused due to tab switch');
    }
});

// ===================================
// START THE GAME
// ===================================

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===================================
// CONSOLE EASTER EGG
// ===================================

console.log('%c👻 HAUNTED REACTION GAME 👻', 'font-size: 20px; font-weight: bold; color: #8b0000;');
console.log('%c⚰️ Dare to enter? ⚰️', 'font-size: 14px; font-weight: bold; color: #ff0000;');
console.log('• Press Space or Enter to start the game');
console.log('• Press M to toggle sound effects');
console.log('• Press Ctrl+R to reset your statistics');
console.log('• Can you escape the spirits in under 150ms?');
console.log('\n%cGood luck... you\'ll need it! 💀', 'font-size: 14px; color: #8b0000;');
