// ===================================
// GAME STATE MANAGEMENT
// ===================================

const GameState = {
    IDLE: 'idle',
    WAITING: 'waiting',
    READY: 'ready',
    SUCCESS: 'success',
    EARLY: 'early'
};

const game = {
    state: GameState.IDLE,
    startTime: null,
    timeoutId: null,
    reactionTimes: [],
    bestTime: localStorage.getItem('bestTime') || null,
    soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
    ageVerified: false,
    
    // Audio elements
    bgMusic: null,
    evilSound: null,
    
    config: {
        minDelay: 500,
        maxDelay: 2000,
        maxAttempts: 100
    }
};

// ===================================
// AUDIO FILES SETUP
// ===================================

// Get the HTML audio element for background music
const bgMusic = document.getElementById('bgMusicElement');
if (bgMusic) {
    bgMusic.volume = 0.5; // 50% volume for background
    // Unmute immediately to start playing
    bgMusic.muted = false;
}

// Create evil sound effect audio element
const evilSound = new Audio('evil.mp3');
evilSound.volume = 0.7; // 70% volume for effect

// Store in game object
game.bgMusic = bgMusic;
game.evilSound = evilSound;



// ===================================
// DOM ELEMENTS
// ===================================

const elements = {
    gameBox: null,
    gameContent: null,
    gameTitle: null,
    gameMessage: null,
    startBtn: null,
    currentTime: null,
    bestTime: null,
    avgTime: null,
    soundToggle: null
};

// ===================================
// INITIALIZATION
// ===================================

function init() {
    // Start background music immediately
    if (game.soundEnabled) {
        game.bgMusic.play().catch(err => {
            console.log('Background music autoplay blocked. Will retry on user interaction.');
            // Retry on first user interaction
            document.addEventListener('click', () => {
                if (game.soundEnabled && game.bgMusic.paused) {
                    game.bgMusic.play().catch(e => console.log('Still blocked:', e));
                }
            }, { once: true });
        });
    }
    
    setupAgeGate();
}

// ===================================
// AGE GATE & LOADING SCREEN
// ===================================

function setupAgeGate() {
    const ageGate = document.getElementById('ageGate');
    const ageYes = document.getElementById('ageYes');
    const ageNo = document.getElementById('ageNo');
    
    ageYes.addEventListener('click', () => {
        game.ageVerified = true;
        ageGate.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => {
            ageGate.style.display = 'none';
            showLoadingScreen();
        }, 500);
    });
    
    ageNo.addEventListener('click', () => {
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #000; color: #fff; text-align: center; font-family: Georgia, serif;">
                <div>
                    <h1 style="font-size: 3rem; margin-bottom: 2rem;">👋 Goodbye</h1>
                    <p style="font-size: 1.5rem;">This content is not suitable for you.</p>
                    <p style="margin-top: 2rem; color: #888;">You can close this tab now.</p>
                </div>
            </div>
        `;
    });
}

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');
    
    const horrorMessages = [
        'Awakening the demons...',
        'Opening the gates of hell...',
        'Summoning dark spirits...',
        'Preparing your nightmare...',
        'The dead are rising...',
        'Blood is boiling...',
        'Darkness approaches...',
        'Your soul is ours...'
    ];
    
    let progress = 0;
    let messageIndex = 0;
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            // Sound removed
            setTimeout(() => {
                loadingScreen.style.animation = 'fadeOut 0.8s ease forwards';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    initializeGame();
                }, 800);
            }, 500);
        }
        
        loadingBar.style.width = progress + '%';
        
        if (progress > (messageIndex + 1) * 12.5 && messageIndex < horrorMessages.length - 1) {
            messageIndex++;
            loadingText.textContent = horrorMessages[messageIndex];
            // Sound effects removed
        }
    }, 200);
}

function initializeGame() {
    const mainContent = document.getElementById('mainContent');
    mainContent.style.display = 'block';
    mainContent.style.animation = 'fadeIn 1s ease';
    
    // Initialize DOM elements
    elements.gameBox = document.getElementById('gameBox');
    elements.gameContent = document.getElementById('gameContent');
    elements.gameTitle = document.getElementById('gameTitle');
    elements.gameMessage = document.getElementById('gameMessage');
    elements.startBtn = document.getElementById('startBtn');
    elements.currentTime = document.getElementById('currentTime');
    elements.bestTime = document.getElementById('bestTime');
    elements.avgTime = document.getElementById('avgTime');
    elements.soundToggle = document.getElementById('soundToggle');
    
    updateStatsDisplay();
    elements.startBtn.addEventListener('click', startGame);
    elements.gameBox.addEventListener('click', handleGameBoxClick);
    elements.soundToggle.addEventListener('click', toggleSound);
    updateSoundButton();
    
    // Start background music
    if (game.soundEnabled) {
        game.bgMusic.play().catch(err => console.log('Background music autoplay blocked:', err));
    }
    
    console.log('💀 EXTREME HORROR GAME INITIALIZED 💀');
}

// ===================================
// SOUND CONTROL
// ===================================

function toggleSound() {
    game.soundEnabled = !game.soundEnabled;
    localStorage.setItem('soundEnabled', game.soundEnabled);
    updateSoundButton();
    
    if (game.soundEnabled) {
        // Sound removed
        game.bgMusic.play().catch(err => console.log('Background music blocked:', err));
    } else {
        game.bgMusic.pause();
    }
}

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

function startGame(event) {
    if (event) {
        event.stopPropagation();
    }
    
    if (game.timeoutId) {
        clearTimeout(game.timeoutId);
    }
    
    // Sound effects removed
    
    game.state = GameState.WAITING;
    updateGameUI({
        icon: '👁️',
        title: 'THE DEMON AWAKENS...',
        message: 'Wait for the blood to turn green... or face eternal damnation!',
        showButton: false
    });
    
    const delay = getRandomDelay();
    
    game.timeoutId = setTimeout(() => {
        if (game.state === GameState.WAITING) {
            setReadyState();
        }
    }, delay);
}

function setReadyState() {
    game.state = GameState.READY;
    game.startTime = performance.now();
    // Sound removed
    
    updateGameUI({
        icon: '💀',
        title: 'ESCAPE NOW OR DIE!',
        message: 'CLICK TO SAVE YOUR SOUL!',
        showButton: false
    });
}

function handleSuccessfulClick() {
    const endTime = performance.now();
    const reactionTime = Math.round(endTime - game.startTime);
    
    // Sound removed
    
    // Play evil.mp3 for 3 seconds
    if (game.soundEnabled) {
        game.evilSound.currentTime = 0; // Reset to start
        game.evilSound.play().catch(err => console.log('Evil sound blocked:', err));
        
        // Stop after 3 seconds
        setTimeout(() => {
            game.evilSound.pause();
            game.evilSound.currentTime = 0;
        }, 3000);
    }
    
    game.reactionTimes.push(reactionTime);
    if (game.reactionTimes.length > game.config.maxAttempts) {
        game.reactionTimes.shift();
    }
    
    if (!game.bestTime || reactionTime < game.bestTime) {
        game.bestTime = reactionTime;
        localStorage.setItem('bestTime', game.bestTime);
    }
    
    game.state = GameState.SUCCESS;
    
    updateGameUI({
        icon: getPerformanceIcon(reactionTime),
        title: `${reactionTime}ms`,
        message: getPerformanceMessage(reactionTime),
        showButton: true,
        buttonText: '🎃 FACE DEATH AGAIN 🎃'
    });
    
    updateStatsDisplay(reactionTime);
}

function handleEarlyClick() {
    if (game.timeoutId) {
        clearTimeout(game.timeoutId);
    }
    
    // Sound effects removed
    
    // Play evil.mp3 for 3 seconds
    if (game.soundEnabled) {
        game.evilSound.currentTime = 0; // Reset to start
        game.evilSound.play().catch(err => console.log('Evil sound blocked:', err));
        
        // Stop after 3 seconds
        setTimeout(() => {
            game.evilSound.pause();
            game.evilSound.currentTime = 0;
        }, 3000);
    }
    
    game.state = GameState.EARLY;
    
    updateGameUI({
        icon: '☠️',
        title: 'YOU DIED!',
        message: 'The demons devoured your soul! Wait for the GREEN light before clicking!',
        showButton: true,
        buttonText: '🔄 RISE FROM THE DEAD'
    });
}

function handleGameBoxClick(event) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
        return;
    }
    
    if (game.state === GameState.READY) {
        handleSuccessfulClick();
    } else if (game.state === GameState.WAITING) {
        handleEarlyClick();
    }
}

// ===================================
// UI UPDATE FUNCTIONS
// ===================================

function updateGameUI(options) {
    const {
        icon = '🕷️',
        title = '',
        message = '',
        showButton = false,
        buttonText = '🎃 ENTER THE NIGHTMARE 🎃'
    } = options;
    
    elements.gameContent.innerHTML = `
        <div class="icon">${icon}</div>
        <h2 id="gameTitle">${title}</h2>
        <p id="gameMessage">${message}</p>
        ${showButton ? `<button class="btn btn-primary" id="startBtn"><span>${buttonText}</span></button>` : ''}
    `;
    
    if (showButton) {
        const newBtn = document.getElementById('startBtn');
        newBtn.addEventListener('click', startGame);
    }
    
    elements.gameBox.className = 'game-box';
    elements.gameBox.classList.add(`state-${game.state}`);
}

function updateStatsDisplay(currentTime = null) {
    if (currentTime !== null) {
        elements.currentTime.textContent = `${currentTime}ms`;
    }
    
    if (game.bestTime) {
        elements.bestTime.textContent = `${game.bestTime}ms`;
    } else {
        elements.bestTime.textContent = '---';
    }
    
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

function getRandomDelay() {
    const { minDelay, maxDelay } = game.config;
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
}

function getPerformanceMessage(time) {
    if (time < 150) {
        return '👻 SUPERNATURAL! You escaped death with godlike reflexes!';
    } else if (time < 200) {
        return '⚡ INCREDIBLE! The demons couldn\'t catch your soul!';
    } else if (time < 250) {
        return '🦇 EXCELLENT! You\'re faster than a vampire\'s strike!';
    } else if (time < 300) {
        return '🕷️ DECENT! The spiders are crawling closer...';
    } else if (time < 400) {
        return '🧟 TOO SLOW! The zombies almost feasted on you!';
    } else {
        return '☠️ PATHETIC! Death is laughing at your weakness...';
    }
}

function getPerformanceIcon(time) {
    if (time < 150) return '👻';
    else if (time < 200) return '⚡';
    else if (time < 250) return '🦇';
    else if (time < 300) return '🕷️';
    else if (time < 400) return '🧟';
    else return '☠️';
}

function resetStats() {
    game.reactionTimes = [];
    game.bestTime = null;
    localStorage.removeItem('bestTime');
    updateStatsDisplay();
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', (event) => {
    if ((event.code === 'Space' || event.code === 'Enter') && 
        (game.state === GameState.IDLE || game.state === GameState.SUCCESS || game.state === GameState.EARLY)) {
        event.preventDefault();
        startGame();
    }
    
    if (event.code === 'Space' && game.state === GameState.READY) {
        event.preventDefault();
        handleSuccessfulClick();
    }
    
    if (event.code === 'KeyR' && event.ctrlKey) {
        event.preventDefault();
        resetStats();
    }
    
    if (event.code === 'KeyM') {
        event.preventDefault();
        toggleSound();
    }
});

// ===================================
// VISIBILITY CHANGE HANDLER
// ===================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.state === GameState.WAITING) {
        if (game.timeoutId) {
            clearTimeout(game.timeoutId);
        }
        game.state = GameState.IDLE;
        updateGameUI({
            icon: '🦇',
            title: 'THE DARKNESS AWAITS...',
            message: 'Click below to re-enter the nightmare realm',
            showButton: true,
            buttonText: '🎃 ENTER THE NIGHTMARE 🎃'
        });
    }
});

// ===================================
// START THE GAME
// ===================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Add fadeOut animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('%c💀 EXTREME HORROR REACTION GAME 💀', 'font-size: 24px; font-weight: bold; color: #ff0000; text-shadow: 0 0 10px #ff0000;');
console.log('%c⚰️ ENTER IF YOU DARE ⚰️', 'font-size: 16px; font-weight: bold; color: #8b0000;');
console.log('%c🩸 WARNING: EXTREME ADULT HORROR 🩸', 'font-size: 14px; color: #ff0000;');
console.log('Your soul belongs to us now... 💀');
