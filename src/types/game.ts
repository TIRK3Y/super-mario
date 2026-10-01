export type MarioPower = 'small' | 'super' | 'fire';

export type MarioActionState = 
  | 'idle' 
  | 'walking' 
  | 'running' 
  | 'jumping' 
  | 'falling' 
  | 'skidding' 
  | 'crouching' 
  | 'flag' 
  | 'castle_walk' 
  | 'dying' 
  | 'dead';

export interface Mario {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  power: MarioPower;
  state: MarioActionState;
  facing: 'left' | 'right';
  grounded: boolean;
  canJump: boolean;
  jumpTimer: number;
  invulnerableTimer: number; // blinking when damaged
  starTimer: number; // Starman invincibility
  growingTimer: number; // transition animation
  shrinkingTimer: number; // transition animation
  crouching: boolean;
  score: number;
  coins: number;
  lives: number;
  flagScore?: number;
}

export type EnemyType = 'goomba' | 'koopa' | 'piranha';

export interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  grounded: boolean;
  dead: boolean;
  stompState?: 'flat' | 'shell' | 'shell_sliding';
  stompTimer?: number;
  facing: 'left' | 'right';
  animTimer: number;
  baseY?: number; // For piranha plant bobbing
  pipeId?: string;
  piranhaTimer?: number;
}

export type ItemType = 'coin' | 'mushroom' | 'fireflower' | 'star' | 'oneup';

export interface Item {
  id: string;
  type: ItemType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  grounded: boolean;
  collected: boolean;
  emerging: boolean;
  emergeDistance: number;
  spawnY: number;
  animTimer: number;
}

export interface Fireball {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  bounces: number;
  active: boolean;
}

export type TileType = 
  | 'ground' 
  | 'brick' 
  | 'question' 
  | 'empty_block' 
  | 'stone' 
  | 'pipe_top_left' 
  | 'pipe_top_right' 
  | 'pipe_shaft_left' 
  | 'pipe_shaft_right' 
  | 'flagpole' 
  | 'flagpole_top' 
  | 'castle_wall' 
  | 'castle_door' 
  | 'castle_crenel'
  | 'hidden_block';

export interface Tile {
  id: string;
  x: number; // Grid X in tiles (16px per tile)
  y: number; // Grid Y in tiles
  type: TileType;
  contents?: ItemType | 'multi_coin';
  coinCount?: number;
  bumping?: boolean;
  bumpOffset?: number;
  bumpVelocity?: number;
  invisible?: boolean; // For hidden blocks until bumped
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'brick_piece' | 'coin_sparkle' | 'score_popup' | 'smoke' | 'fire_burst';
  text?: string;
  timer: number;
  maxTimer: number;
  color?: string;
}

export interface SceneryItem {
  type: 'cloud_single' | 'cloud_double' | 'cloud_triple' | 'hill_small' | 'hill_large' | 'bush_single' | 'bush_double' | 'bush_triple';
  x: number;
  y: number;
}

export interface LevelData {
  id: string;
  name: string;
  worldNumber: string; // e.g. "1-1"
  theme: 'overworld' | 'underground' | 'castle';
  widthInTiles: number;
  heightInTiles: number;
  timeLimit: number;
  bgColor: string;
  tiles: Tile[];
  enemies: Enemy[];
  scenery: SceneryItem[];
  flagpoleTileX: number;
  castleTileX: number;
  playerStartX: number;
  playerStartY: number;
}

export interface GameStats {
  score: number;
  coins: number;
  world: string;
  time: number;
  lives: number;
}

export type GameStatus = 
  | 'menu' 
  | 'playing' 
  | 'paused' 
  | 'stage_clear' 
  | 'game_over' 
  | 'level_transition';

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  run: boolean; // Also fire
}

export interface HighScoreEntry {
  id: string;
  playerName: string;
  score: number;
  coins: number;
  world: string;
  date: string;
}
