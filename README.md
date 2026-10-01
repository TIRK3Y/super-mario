# Super Mario Bros - Next.js 14 Retro Recreation

A fully functional, professional recreation of the iconic NES **Super Mario Bros.** built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, HTML5 Canvas pixel rendering, and a custom **Web Audio API 8-bit Chiptune Synthesizer**.

![Super Mario Banner](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png) *(Retro Arcade Experience)*

---

## 🌟 Key Highlights & Features

- **Pixel-Perfect Canvas Engine**:
  - Crisp integer pixel rendering (`image-rendering: pixelated`) at authentic NES resolution (256x240) scaled to modern displays.
  - Authentic procedural sprite generation with NES color palettes: Small Mario, Super Mario, Fire Mario, Starman rainbow invincibility, Goombas, Koopa Troopas, Piranha Plants, Bricks, Question Blocks, Coins, Pipes, Flagpoles, and Castle geometry.
  - Zero external image or audio HTTP dependencies — guaranteed 100% offline functionality with zero broken URLs or CORS errors.

- **Authentic Physics & Controls**:
  - Variable jump heights (short tap vs. sustained hold for maximum reach).
  - Acceleration, momentum, skidding when reversing direction, and sliding friction.
  - Stomping Goombas (squished state) and Koopas (knocked into shell).
  - Kicking shells: slide across platforms to eliminate rows of enemies with combo score multipliers!
  - Brick shattering for Super/Fire Mario with 4 spinning fragment physics particles.
  - Mystery Question Blocks bumping upward with coin sparkles or mushroom/flower/star power-ups.
  - Iconic Flagpole slide cutscene with bonus height scoring and autonomous castle entrance fanfare.

- **Pure Web Audio API Chiptune Synthesizer**:
  - Overworld theme song melody & bassline loops synthesized via square and triangle wave oscillators.
  - Underground subterranean theme music loop.
  - Starman invincibility high-tempo theme.
  - Full suite of classic sound effects: Small Jump, Super Jump, Coin pickup, Goomba Stomp, Shell Kick, Brick Break, Block Bump, Power-Up Spawn & Collect, Pipe descent, Fireball chirp, Flagpole slide, Stage Clear fanfare, and Game Over melody.
  - Master volume slider and instant mute toggle (`M`).

- **Multi-World Support**:
  - **World 1-1**: Classic Overworld with clouds, bushes, hills, question blocks, pipes, Goombas, Koopas, staircase, flagpole, and castle.
  - **World 1-2**: Subterranean level with brick ceiling, cyan underground blocks, tricky pits, and piranha pipes.
  - **World 1-3**: Athletic treetop sky level with floating mushroom platforms and precision jumping.

- **Arcade Bezel & Retro UI**:
  - Authentic NES top HUD: `MARIO`, Score (zero-padded), Coins counter, `WORLD`, `TIME` countdown timer, and `LIVES`.
  - Toggleable **CRT Scanline & Phosphor Flicker Shader** with monitor curvature aesthetics.
  - On-screen touch / virtual gamepad for mobile, tablet, or mouse play.
  - Fullscreen immersion mode.
  - Local persistent Hall of Fame High Scores leaderboard.
  - How-to-Play interactive game manual with item and controls breakdown.

---

## 🕹️ Controls Guide

| Action | Keyboard Primary | Alternative | Virtual Gamepad |
| :--- | :--- | :--- | :--- |
| **Move Left** | `←` Left Arrow | `A` | D-Pad Left |
| **Move Right** | `→` Right Arrow | `D` | D-Pad Right |
| **Crouch** | `↓` Down Arrow | `S` | D-Pad Down |
| **Jump / High Jump** | `Space` | `W` / `Z` / `K` | **A** Button |
| **Dash / Fireball** | `Shift` | `X` / `J` | **B** Button |
| **Pause / Resume** | `P` | `Escape` | START Button |
| **Restart Level** | `R` | Top Toolbar | SELECT / RESTART |
| **Mute Sound** | `M` | Top Toolbar | Audio Icon |

---

## 🚀 Getting Started

### 1. Requirements
- Node.js 18+ (tested on Node v24)
- npm 9+

### 2. Installation & Run
```bash
# Navigate to project folder
cd super-mario

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
# OR run optimized production server
npm run build
npm run start -p 3005
```

Open [http://localhost:3005](http://localhost:3005) (or the port specified) in your browser.

---

## 📂 Project Architecture

```
super-mario/
├── src/
│   ├── app/
│   │   ├── globals.css         # Custom CRT scanline effects, pixelated rendering & animations
│   │   ├── layout.tsx          # Root layout & retro metadata
│   │   └── page.tsx            # Main game page & reactive UI state coordinator
│   ├── audio/
│   │   └── soundEngine.ts      # Pure Web Audio API 8-bit chiptune sound & music synthesizer
│   ├── components/
│   │   ├── GameCanvas.tsx      # 60 FPS HTML5 Canvas loop, CRT monitor container & keyboard input
│   │   ├── GameUI.tsx          # Authentic NES HUD, toolbar & modal overlays (Pause/GameOver/Clear)
│   │   ├── HighScoresModal.tsx # LocalStorage Hall of Fame leaderboard
│   │   ├── InstructionsModal.tsx# Game guide, power-ups, tips & controls
│   │   └── VirtualGamepad.tsx  # Responsive touch D-Pad and action buttons for mobile
│   ├── engine/
│   │   ├── gameEngine.ts       # World state machine, camera tracking, cutscenes & rendering pipeline
│   │   ├── levels.ts           # World 1-1, World 1-2, and World 1-3 level map definitions
│   │   ├── physics.ts          # Momentum, AABB tile collisions, stomping & shell kick mechanics
│   │   └── sprites.ts          # Procedural NES pixel art sprite generator & offscreen canvas cache
│   └── types/
│       └── game.ts             # TypeScript interfaces for entities, tiles, items & game state
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```
