# Audio Files Setup - Instructions

## Required Audio Files

You need to place these two audio files in the same directory as your HTML file:

### 1. **kyrie.mp3**
- **Purpose**: Background music that loops continuously
- **Volume**: 50% (adjustable in code)
- **Behavior**: Starts playing when the game initializes after the loading screen
- **Controls**: Can be toggled on/off with the sound button (🔊/🔇)

### 2. **evil.mp3**
- **Purpose**: Sound effect that plays for 3 seconds on each guess
- **Volume**: 70% (adjustable in code)
- **Behavior**: 
  - Plays when you click during the READY state (correct timing)
  - Plays when you click during the WAITING state (too early)
  - Automatically stops after 3 seconds
  - Resets to the beginning for the next play

## File Location

Both files should be in:
```
f:\reaction time ict lab 15\
├── index.html
├── style.css
├── script.js
├── kyrie.mp3    ← Place here
└── evil.mp3     ← Place here
```

## How It Works

1. **Background Music (kyrie.mp3)**:
   - Starts automatically when the game loads (after age gate and loading screen)
   - Loops infinitely
   - Pauses when you click the sound toggle button
   - Resumes when you enable sound again

2. **Evil Sound (evil.mp3)**:
   - Plays EVERY time you make a guess (click the game box)
   - Plays for exactly 3 seconds then stops
   - Works for both correct clicks and early clicks
   - Controlled by the sound enabled/disabled setting

## Volume Adjustment

To change volumes, edit these lines in `script.js`:

```javascript
bgMusic.volume = 0.5;    // Background music (0.0 to 1.0)
evilSound.volume = 0.7;  // Evil sound effect (0.0 to 1.0)
```

## Notes

- If the audio files are not found, the game will still work but without those sounds
- The Web Audio API sound effects (demon screams, heartbeats, etc.) will still play
- Browser autoplay policies may block the background music initially - user interaction may be required
