# Reaction Time Challenge Game

## Project Overview
Create a sleek, modern browser-based reaction time game that measures how fast users can click a box after it changes color. The game should have a polished, contemporary design with smooth animations and an engaging user experience.

## Core Functionality

### Game Mechanics
1. **Start State**: Display a "Start Game" button and game area
2. **Waiting Phase**: After clicking start, show a box that will change color after a random delay (500-2000ms)
3. **Action Phase**: Box changes color - user must click as fast as possible
4. **Results**: Display reaction time in milliseconds
5. **Reset**: Allow user to play again

### Key Features Required
- Random delay before color change (500-2000ms range)
- Accurate reaction time measurement using timestamps
- Cheat prevention (clicking before color change resets attempt with warning)
- Clear visual feedback for all game states
- Responsive design that works on all screen sizes

## Design Requirements

### Modern Aesthetic
- **Style**: Contemporary, minimal, sleek
- **Color Scheme**: Use a modern palette (consider dark mode aesthetic or vibrant gradients)
- **Typography**: Clean, readable fonts (Google Fonts recommended)
- **Animations**: Smooth transitions and micro-interactions
- **Layout**: Centered, spacious, breathing room

### Visual Elements
- Prominent game area with clear boundaries
- Large, easily clickable target box
- Bold, readable reaction time display
- Polished button designs with hover effects
- Professional color transitions (not just simple color swaps)

### User Experience
- Intuitive interface - no instructions needed
- Clear visual hierarchy
- Immediate feedback for all actions
- Smooth state transitions
- Mobile-friendly touch targets

## Technical Requirements

### File Structure
```
reaction-time-game/
├── index.html
├── style.css
└── script.js
```

### HTML (index.html)
- Semantic HTML5 structure
- Clean, organized markup
- Accessibility considerations (ARIA labels where needed)

### CSS (style.css)
- Modern CSS features (flexbox/grid, custom properties, transforms)
- Smooth animations and transitions
- Responsive design (mobile-first approach)
- Consistent spacing and sizing
- Professional color palette

### JavaScript (script.js)
- Clean, readable code with comments
- Event-driven architecture
- Accurate timing using `Date.now()` or `performance.now()`
- State management for game phases
- Cheat detection logic

## Bonus Features (Optional)

### Enhanced Functionality
- **Best Score Tracking**: Store and display personal best using localStorage
- **Randomized Position**: Box appears in different locations each round
- **Difficulty Levels**: Fast mode (shorter delays), Slow mode (longer delays)
- **Sound Effects**: Subtle audio feedback for actions
- **Animation Effects**: Particle effects, glow effects, or pulsing animations
- **Statistics**: Average reaction time over multiple attempts
- **Dark/Light Mode Toggle**: User preference for theme

### Advanced Enhancements
- Multiple rounds with running average
- Leaderboard display (local only)
- Countdown timer before color change
- Achievement system
- Share results functionality

## Game Flow

### State Transitions
1. **Idle**: "Start Game" button visible
2. **Waiting**: "Wait for color change..." message, box is initial color
3. **Ready**: Box changes to target color, user should click now
4. **Result**: Display reaction time, show "Play Again" button
5. **Early Click**: Show warning "Too early! Wait for the color change"

### Visual States
- **Idle**: Neutral, inviting design
- **Waiting**: Subtle animation or pulse to maintain engagement
- **Ready**: Bold color change with possible glow/emphasis
- **Success**: Celebration animation, prominent time display
- **Failure**: Clear but not harsh warning

## Design Inspiration Keywords
- Glassmorphism
- Neumorphism
- Gradient backgrounds
- Smooth shadows
- Vibrant color transitions
- Micro-interactions
- Fluid animations
- Modern card design
- Minimalist UI
- Premium feel

## Testing Checklist
- [ ] Game starts correctly on button click
- [ ] Random delay works (500-2000ms range)
- [ ] Reaction time calculated accurately
- [ ] Early clicks are detected and handled
- [ ] Results display clearly
- [ ] Reset/replay works smoothly
- [ ] Responsive on mobile devices
- [ ] Accessible keyboard navigation
- [ ] Smooth animations without lag
- [ ] Works across modern browsers

## Performance Goals
- Fast load time
- Smooth 60fps animations
- No layout shifts
- Immediate interaction feedback
- Clean console (no errors)

## Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Submission Format
Single ZIP file containing all three files. Game must run by opening `index.html` directly in a browser - no build process or server required.

---

**Goal**: Create a polished, professional-looking reaction time game that feels premium and engaging while maintaining clean, understandable code. Focus on both aesthetics and functionality to deliver an experience that users want to play multiple times.