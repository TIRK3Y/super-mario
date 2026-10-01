// Level generator and layout definitions for Super Mario
import { LevelData, Tile, Enemy, SceneryItem } from '@/types/game';

// Helper to create tile
let tileCounter = 0;
function createTile(x: number, y: number, type: Tile['type'], contents?: Tile['contents'], invisible?: boolean): Tile {
  return {
    id: `tile_${tileCounter++}_${x}_${y}`,
    x,
    y,
    type,
    contents,
    invisible,
    bumping: false,
    bumpOffset: 0,
    bumpVelocity: 0,
  };
}

// Helper to build pipe
function addPipe(tiles: Tile[], x: number, height: number, groundY: number = 13) {
  const topY = groundY - height;
  tiles.push(createTile(x, topY, 'pipe_top_left'));
  tiles.push(createTile(x + 1, topY, 'pipe_top_right'));
  for (let y = topY + 1; y < groundY; y++) {
    tiles.push(createTile(x, y, 'pipe_shaft_left'));
    tiles.push(createTile(x + 1, y, 'pipe_shaft_right'));
  }
}

// Helper to build staircase
function addStairs(tiles: Tile[], startX: number, height: number, direction: 'up' | 'down', groundY: number = 13) {
  for (let step = 0; step < height; step++) {
    const x = direction === 'up' ? startX + step : startX + step;
    const colHeight = direction === 'up' ? step + 1 : height - step;
    for (let h = 0; h < colHeight; h++) {
      tiles.push(createTile(x, groundY - 1 - h, 'stone'));
    }
  }
}

// Helper to build castle
function addCastle(tiles: Tile[], startX: number, groundY: number = 13) {
  // Main castle body 5x5
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      const tileY = groundY - 5 + y;
      const tileX = startX + x;
      if (x === 2 && (y === 3 || y === 4)) {
        tiles.push(createTile(tileX, tileY, 'castle_door'));
      } else if (y === 0) {
        if (x === 0 || x === 2 || x === 4) {
          tiles.push(createTile(tileX, tileY, 'castle_crenel'));
        }
      } else {
        tiles.push(createTile(tileX, tileY, 'castle_wall'));
      }
    }
  }
}

// Helper to build flagpole
function addFlagpole(tiles: Tile[], x: number, groundY: number = 13) {
  const poleTopY = groundY - 10;
  tiles.push(createTile(x, poleTopY, 'flagpole_top'));
  for (let y = poleTopY + 1; y < groundY; y++) {
    tiles.push(createTile(x, y, 'flagpole'));
  }
  tiles.push(createTile(x, groundY - 1, 'stone'));
}

// -------------------------------------------------------------
// WORLD 1-1
// -------------------------------------------------------------
export function createWorld1_1(): LevelData {
  const widthInTiles = 214;
  const heightInTiles = 15;
  const groundY = 13;
  const tiles: Tile[] = [];
  const enemies: Enemy[] = [];
  const scenery: SceneryItem[] = [];

  // 1. Ground floor with pits
  const pits = [
    { start: 69, end: 71 },
    { start: 86, end: 89 },
    { start: 153, end: 155 },
  ];

  for (let x = 0; x < widthInTiles; x++) {
    const inPit = pits.some(p => x >= p.start && x <= p.end);
    if (!inPit) {
      tiles.push(createTile(x, groundY, 'ground'));
      tiles.push(createTile(x, groundY + 1, 'ground'));
    }
  }

  // 2. Scenery (Bushes, Clouds, Hills)
  for (let x = 0; x < widthInTiles; x += 48) {
    scenery.push({ type: 'cloud_single', x: x + 8, y: 3 });
    scenery.push({ type: 'cloud_triple', x: x + 28, y: 2 });
    scenery.push({ type: 'cloud_double', x: x + 36, y: 4 });
    scenery.push({ type: 'hill_large', x: x + 0, y: 10 });
    scenery.push({ type: 'hill_small', x: x + 16, y: 11 });
    scenery.push({ type: 'bush_triple', x: x + 11, y: 12 });
    scenery.push({ type: 'bush_single', x: x + 23, y: 12 });
    scenery.push({ type: 'bush_double', x: x + 41, y: 12 });
  }

  // 3. Question blocks & Bricks
  // First cluster
  tiles.push(createTile(16, 9, 'question', 'coin'));
  tiles.push(createTile(20, 9, 'brick'));
  tiles.push(createTile(21, 9, 'question', 'mushroom'));
  tiles.push(createTile(22, 9, 'brick'));
  tiles.push(createTile(23, 9, 'question', 'coin'));
  tiles.push(createTile(24, 9, 'brick'));
  tiles.push(createTile(22, 5, 'question', 'coin'));

  // 4. Pipes
  addPipe(tiles, 28, 2, groundY);
  addPipe(tiles, 38, 3, groundY);
  addPipe(tiles, 46, 4, groundY);
  addPipe(tiles, 57, 4, groundY);

  // Hidden 1-UP block
  tiles.push(createTile(64, 9, 'hidden_block', 'oneup', true));

  // Second brick cluster
  tiles.push(createTile(77, 9, 'brick'));
  tiles.push(createTile(78, 9, 'question', 'mushroom'));
  tiles.push(createTile(79, 9, 'brick'));

  // Elevated brick platform
  for (let x = 80; x <= 87; x++) {
    tiles.push(createTile(x, 5, 'brick'));
  }

  // Double question block
  tiles.push(createTile(91, 5, 'brick'));
  tiles.push(createTile(92, 5, 'brick'));
  tiles.push(createTile(93, 5, 'brick'));
  tiles.push(createTile(94, 9, 'question', 'coin'));
  tiles.push(createTile(100, 9, 'brick'));
  tiles.push(createTile(101, 9, 'question', 'star'));
  tiles.push(createTile(106, 9, 'question', 'coin'));
  tiles.push(createTile(109, 9, 'question', 'coin'));
  tiles.push(createTile(112, 9, 'question', 'coin'));
  tiles.push(createTile(109, 5, 'question', 'mushroom'));

  // Multi-brick row
  for (let x = 118; x <= 122; x++) {
    tiles.push(createTile(x, 9, 'brick'));
  }
  for (let x = 123; x <= 126; x++) {
    tiles.push(createTile(x, 5, 'brick'));
  }
  for (let x = 128; x <= 130; x++) {
    tiles.push(createTile(x, 5, 'brick'));
  }
  tiles.push(createTile(129, 9, 'brick'));
  tiles.push(createTile(130, 9, 'brick'));

  // Stairs Section 1
  addStairs(tiles, 134, 4, 'up', groundY);
  addStairs(tiles, 140, 4, 'down', groundY);

  // Stairs Section 2 (over pit)
  addStairs(tiles, 148, 4, 'up', groundY);
  addStairs(tiles, 155, 4, 'down', groundY);

  // Final Pipe
  addPipe(tiles, 163, 2, groundY);

  // High brick & question
  tiles.push(createTile(168, 9, 'brick'));
  tiles.push(createTile(169, 9, 'question', 'coin'));
  tiles.push(createTile(170, 9, 'brick'));

  // Final Giant Staircase leading to Flagpole
  addStairs(tiles, 181, 8, 'up', groundY);
  tiles.push(createTile(189, groundY - 8, 'stone')); // Top landing step

  // Flagpole & Castle
  const flagpoleX = 198;
  addFlagpole(tiles, flagpoleX, groundY);
  const castleX = 202;
  addCastle(tiles, castleX, groundY);

  // 5. Enemies
  let enemyCounter = 0;
  const createGoomba = (x: number, y: number = groundY - 1): Enemy => ({
    id: `goomba_${enemyCounter++}`,
    type: 'goomba',
    x: x * 16,
    y: y * 16,
    vx: -0.6,
    vy: 0,
    width: 16,
    height: 16,
    grounded: true,
    dead: false,
    facing: 'left',
    animTimer: 0,
  });

  const createKoopa = (x: number, y: number = groundY - 1.5): Enemy => ({
    id: `koopa_${enemyCounter++}`,
    type: 'koopa',
    x: x * 16,
    y: y * 16,
    vx: -0.6,
    vy: 0,
    width: 16,
    height: 24,
    grounded: true,
    dead: false,
    facing: 'left',
    animTimer: 0,
  });

  // Spawn iconic enemies
  enemies.push(createGoomba(22));
  enemies.push(createGoomba(40));
  enemies.push(createGoomba(51));
  enemies.push(createGoomba(53));
  enemies.push(createGoomba(80, 4));
  enemies.push(createGoomba(82, 4));
  enemies.push(createGoomba(97));
  enemies.push(createGoomba(99));
  enemies.push(createKoopa(107));
  enemies.push(createGoomba(114));
  enemies.push(createGoomba(116));
  enemies.push(createGoomba(124));
  enemies.push(createGoomba(126));
  enemies.push(createGoomba(174));
  enemies.push(createGoomba(176));

  return {
    id: 'world_1_1',
    name: 'WORLD 1-1',
    worldNumber: '1-1',
    theme: 'overworld',
    widthInTiles,
    heightInTiles,
    timeLimit: 400,
    bgColor: '#5C94FC',
    tiles,
    enemies,
    scenery,
    flagpoleTileX: flagpoleX,
    castleTileX: castleX,
    playerStartX: 40,
    playerStartY: (groundY - 1) * 16,
  };
}

// -------------------------------------------------------------
// WORLD 1-2 (Underground)
// -------------------------------------------------------------
export function createWorld1_2(): LevelData {
  const widthInTiles = 190;
  const heightInTiles = 15;
  const groundY = 13;
  const tiles: Tile[] = [];
  const enemies: Enemy[] = [];
  const scenery: SceneryItem[] = [];

  // Ceiling across entire level
  for (let x = 0; x < widthInTiles; x++) {
    tiles.push(createTile(x, 0, 'brick'));
    tiles.push(createTile(x, 1, 'brick'));
  }

  // Floor with pits
  const pits = [
    { start: 40, end: 43 },
    { start: 80, end: 84 },
    { start: 130, end: 133 },
  ];

  for (let x = 0; x < widthInTiles; x++) {
    const inPit = pits.some(p => x >= p.start && x <= p.end);
    if (!inPit) {
      tiles.push(createTile(x, groundY, 'ground'));
      tiles.push(createTile(x, groundY + 1, 'ground'));
    }
  }

  // Underground brick platforms & question blocks
  for (let x = 12; x <= 22; x++) {
    tiles.push(createTile(x, 9, 'brick'));
  }
  tiles.push(createTile(15, 9, 'question', 'mushroom'));
  tiles.push(createTile(19, 9, 'question', 'coin'));

  // Elevator-style stepped bricks
  for (let x = 28; x <= 35; x++) {
    tiles.push(createTile(x, 6, 'brick'));
  }
  tiles.push(createTile(30, 6, 'question', 'star'));

  // Pipe obstacles
  addPipe(tiles, 48, 3, groundY);
  addPipe(tiles, 58, 4, groundY);
  addPipe(tiles, 68, 5, groundY);

  // Brick bridges
  for (let x = 74; x <= 88; x++) {
    if (x % 2 === 0) tiles.push(createTile(x, 8, 'brick'));
    else tiles.push(createTile(x, 8, 'question', 'coin'));
  }

  for (let x = 95; x <= 110; x++) {
    tiles.push(createTile(x, 5, 'brick'));
    tiles.push(createTile(x, 9, 'brick'));
  }
  tiles.push(createTile(102, 5, 'question', 'mushroom'));

  // Stairs
  addStairs(tiles, 115, 5, 'up', groundY);
  addStairs(tiles, 122, 5, 'down', groundY);

  // Exit staircase to pipe
  addStairs(tiles, 140, 6, 'up', groundY);
  addPipe(tiles, 150, 4, groundY);

  // Flagpole & Castle outside
  const flagpoleX = 175;
  addFlagpole(tiles, flagpoleX, groundY);
  const castleX = 179;
  addCastle(tiles, castleX, groundY);

  // Enemies
  let enemyCounter = 100;
  const createEnemy = (type: Enemy['type'], x: number, y: number = groundY - 1): Enemy => ({
    id: `ug_enemy_${enemyCounter++}`,
    type,
    x: x * 16,
    y: y * 16,
    vx: -0.7,
    vy: 0,
    width: 16,
    height: type === 'koopa' ? 24 : 16,
    grounded: true,
    dead: false,
    facing: 'left',
    animTimer: 0,
  });

  enemies.push(createEnemy('goomba', 16, 8));
  enemies.push(createEnemy('goomba', 20, 8));
  enemies.push(createEnemy('koopa', 32, 5));
  enemies.push(createEnemy('goomba', 52));
  enemies.push(createEnemy('goomba', 62));
  enemies.push(createEnemy('koopa', 78));
  enemies.push(createEnemy('goomba', 100, 4));
  enemies.push(createEnemy('goomba', 105, 8));
  enemies.push(createEnemy('koopa', 125));

  return {
    id: 'world_1_2',
    name: 'WORLD 1-2',
    worldNumber: '1-2',
    theme: 'underground',
    widthInTiles,
    heightInTiles,
    timeLimit: 400,
    bgColor: '#000000',
    tiles,
    enemies,
    scenery,
    flagpoleTileX: flagpoleX,
    castleTileX: castleX,
    playerStartX: 40,
    playerStartY: (groundY - 1) * 16,
  };
}

// -------------------------------------------------------------
// WORLD 1-3 (Treetops / Athletic Sky)
// -------------------------------------------------------------
export function createWorld1_3(): LevelData {
  const widthInTiles = 180;
  const heightInTiles = 15;
  const groundY = 13;
  const tiles: Tile[] = [];
  const enemies: Enemy[] = [];
  const scenery: SceneryItem[] = [];

  // Scenery (Lots of clouds in the sky)
  for (let x = 0; x < widthInTiles; x += 30) {
    scenery.push({ type: 'cloud_triple', x: x + 4, y: 1 });
    scenery.push({ type: 'cloud_single', x: x + 16, y: 3 });
    scenery.push({ type: 'cloud_double', x: x + 24, y: 2 });
  }

  // Floating platforms over bottomless abyss!
  // Starting island
  for (let x = 0; x < 25; x++) {
    tiles.push(createTile(x, groundY, 'ground'));
    tiles.push(createTile(x, groundY + 1, 'ground'));
  }

  // Floating treetop platforms
  const platforms = [
    { start: 28, len: 6, y: 10 },
    { start: 37, len: 7, y: 7 },
    { start: 47, len: 5, y: 5 },
    { start: 55, len: 8, y: 8 },
    { start: 66, len: 4, y: 6 },
    { start: 73, len: 9, y: 4 },
    { start: 85, len: 6, y: 7 },
    { start: 94, len: 5, y: 9 },
    { start: 102, len: 10, y: 6 },
    { start: 115, len: 7, y: 8 },
    { start: 125, len: 8, y: 5 },
    { start: 136, len: 6, y: 8 },
  ];

  platforms.forEach(p => {
    for (let i = 0; i < p.len; i++) {
      const tileX = p.start + i;
      if (i === 1 || i === p.len - 2) {
        tiles.push(createTile(tileX, p.y, 'question', (i % 2 === 0 ? 'mushroom' : 'coin')));
      } else {
        tiles.push(createTile(tileX, p.y, 'brick'));
      }
    }
  });

  // Ending island
  for (let x = 145; x < widthInTiles; x++) {
    tiles.push(createTile(x, groundY, 'ground'));
    tiles.push(createTile(x, groundY + 1, 'ground'));
  }

  // Final Staircase to flag
  addStairs(tiles, 150, 7, 'up', groundY);
  const flagpoleX = 165;
  addFlagpole(tiles, flagpoleX, groundY);
  const castleX = 169;
  addCastle(tiles, castleX, groundY);

  // Enemies
  let enemyCounter = 200;
  const createKoopa = (x: number, y: number): Enemy => ({
    id: `sky_koopa_${enemyCounter++}`,
    type: 'koopa',
    x: x * 16,
    y: (y - 1.5) * 16,
    vx: -0.6,
    vy: 0,
    width: 16,
    height: 24,
    grounded: true,
    dead: false,
    facing: 'left',
    animTimer: 0,
  });

  const createGoomba = (x: number, y: number): Enemy => ({
    id: `sky_goomba_${enemyCounter++}`,
    type: 'goomba',
    x: x * 16,
    y: (y - 1) * 16,
    vx: -0.6,
    vy: 0,
    width: 16,
    height: 16,
    grounded: true,
    dead: false,
    facing: 'left',
    animTimer: 0,
  });

  enemies.push(createGoomba(16, groundY));
  enemies.push(createKoopa(39, 7));
  enemies.push(createGoomba(58, 8));
  enemies.push(createKoopa(76, 4));
  enemies.push(createGoomba(87, 7));
  enemies.push(createKoopa(105, 6));
  enemies.push(createGoomba(128, 5));

  return {
    id: 'world_1_3',
    name: 'WORLD 1-3',
    worldNumber: '1-3',
    theme: 'overworld',
    widthInTiles,
    heightInTiles,
    timeLimit: 400,
    bgColor: '#5C94FC',
    tiles,
    enemies,
    scenery,
    flagpoleTileX: flagpoleX,
    castleTileX: castleX,
    playerStartX: 40,
    playerStartY: (groundY - 1) * 16,
  };
}

export function getLevelById(id: string): LevelData {
  if (id === 'world_1_2') return createWorld1_2();
  if (id === 'world_1_3') return createWorld1_3();
  return createWorld1_1();
}
