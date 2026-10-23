# Super Mario Bros. Browser Recreation

A browser recreation of the NES game Super Mario Bros., built with Next.js 14, TypeScript and the HTML5 Canvas API. All sprites are generated procedurally in code and all music and sound effects are synthesized at runtime with the Web Audio API, so the game ships with no image or audio asset files. The project is exported as a static site and deployed to GitHub Pages through a GitHub Actions workflow.

## Features

- Canvas renderer at NES resolution (256x240) with pixelated scaling to the browser window
- Procedurally generated sprites cached on offscreen canvases (Mario in small, super and fire forms, Goombas, Koopa Troopas, Piranha Plants, blocks, pipes, flagpole, castle)
- Platformer physics: acceleration, momentum, skidding, variable jump height and tile-based AABB collision
- Enemy interactions: stomping, kicking Koopa shells, fireballs, Starman invincibility
- Power-ups: Super Mushroom, Fire Flower, Starman and 1-UP Mushroom
- Three levels: World 1-1 (overworld), World 1-2 (underground) and World 1-3 (sky platforms)
- 8-bit chiptune music and sound effects synthesized with the Web Audio API, with volume control and mute
- NES-style HUD with score, coins, world, timer and lives
- Optional CRT scanline effect, fullscreen mode and a level-clear confetti effect
- On-screen virtual gamepad for touch devices
- High score table persisted in the browser's `localStorage`
- In-game instructions screen

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 14.2 (App Router, static export) |
| UI | React 18, Tailwind CSS 3.4, lucide-react |
| Language | TypeScript 5 |
| Rendering | HTML5 Canvas 2D |
| Audio | Web Audio API |
| Effects | canvas-confetti |
| CI/CD | GitHub Actions, GitHub Pages |

## Getting started

### Prerequisites

- Node.js 18 or later (the CI workflow uses Node.js 20)
- npm

### Install and run

```bash
npm install
npm run dev
```

Open http://localhost:3000 in a browser.

### Build

```bash
npm run build
```

`next.config.mjs` sets `output: 'export'`, so the build writes a static site to `out/`. When the `GITHUB_ACTIONS` environment variable is `true`, the base path is set to `/super-mario` for hosting on GitHub Pages.

## Controls

| Action | Keyboard | Virtual gamepad |
| --- | --- | --- |
| Move left / right | Left / Right arrows, A / D | D-pad |
| Crouch | Down arrow, S | D-pad down |
| Jump (hold for a higher jump) | Space, Up arrow, W, Z, K | A |
| Run / throw fireball | Shift, X, J | B |
| Pause / resume | P, Escape | Start |
| Restart level | R | Select |
| Mute | M | Toolbar |

## Project structure

```
src/
  app/            Next.js layout, main page and global styles (CRT effect)
  audio/          Web Audio chiptune synthesizer
  components/     Game canvas, HUD, virtual gamepad, high score and instructions modals
  engine/         Game loop, level data, physics and procedural sprite generation
  types/          Shared TypeScript types
.github/workflows/deploy.yml   Build and deploy to GitHub Pages
```

## License

No license has been specified for this project.
