// Main Super Mario Game Engine Orchestrator

import { 
  Mario, 
  LevelData, 
  Tile, 
  Enemy, 
  Item, 
  Fireball, 
  Particle, 
  InputState, 
  GameStatus 
} from '@/types/game';
import { getLevelById } from '@/engine/levels';
import { PhysicsEngine } from '@/engine/physics';
import { soundEngine } from '@/audio/soundEngine';
import { spriteEngine } from '@/engine/sprites';
import confetti from 'canvas-confetti';

export class GameEngine {
  public status: GameStatus = 'menu';
  public currentLevelId: string = 'world_1_1';
  public levelData: LevelData;
  public mario: Mario;
  public tiles: Tile[] = [];
  public enemies: Enemy[] = [];
  public items: Item[] = [];
  public fireballs: Fireball[] = [];
  public particles: Particle[] = [];

  public cameraX: number = 0;
  public viewportWidth: number = 256;
  public viewportHeight: number = 240;

  public inGameTimer: number = 400;
  public timerAccumulator: number = 0;
  public animFrame: number = 0;

  // Flagpole cutscene state
  public flagSlideProgress: number = 0;
  public flagY: number = 0;
  public castleWalkTargetX: number = 0;
  public stageClearTimer: number = 0;
  public deathRestartTimer: number = 0;

  public onStatsChange?: (stats: {
    score: number;
    coins: number;
    world: string;
    time: number;
    lives: number;
    status: GameStatus;
  }) => void;

  constructor(levelId: string = 'world_1_1') {
    this.currentLevelId = levelId;
    this.levelData = getLevelById(levelId);
    this.mario = this.createInitialMario();
    this.initLevel(this.levelData);
  }

  private createInitialMario(): Mario {
    return {
      x: 40,
      y: 192,
      vx: 0,
      vy: 0,
      width: 16,
      height: 16,
      power: 'small',
      state: 'idle',
      facing: 'right',
      grounded: true,
      canJump: true,
      jumpTimer: 0,
      invulnerableTimer: 0,
      starTimer: 0,
      growingTimer: 0,
      shrinkingTimer: 0,
      crouching: false,
      score: 0,
      coins: 0,
      lives: 3,
    };
  }

  public initLevel(level: LevelData, preserveMarioStats: boolean = false) {
    this.levelData = level;
    this.currentLevelId = level.id;
    this.tiles = JSON.parse(JSON.stringify(level.tiles));
    this.enemies = JSON.parse(JSON.stringify(level.enemies));
    this.items = [];
    this.fireballs = [];
    this.particles = [];
    this.cameraX = 0;
    this.inGameTimer = level.timeLimit;
    this.timerAccumulator = 0;
    this.flagSlideProgress = 0;
    this.flagY = (level.heightInTiles - 12) * 16;
    this.castleWalkTargetX = (level.castleTileX + 2.5) * 16;
    this.deathRestartTimer = 0;
    this.stageClearTimer = 0;

    const currentScore = preserveMarioStats ? this.mario.score : 0;
    const currentCoins = preserveMarioStats ? this.mario.coins : 0;
    const currentLives = preserveMarioStats ? this.mario.lives : 3;
    const currentPower = preserveMarioStats ? this.mario.power : 'small';

    this.mario = {
      ...this.createInitialMario(),
      x: level.playerStartX,
      y: level.playerStartY,
      score: currentScore,
      coins: currentCoins,
      lives: currentLives,
      power: currentPower,
      height: currentPower === 'small' ? 16 : 32,
    };

    if (this.status === 'playing') {
      soundEngine.playMusic(level.theme === 'underground' ? 'underground' : 'overworld');
    }
  }

  public start() {
    this.status = 'playing';
    soundEngine.playMusic(this.levelData.theme === 'underground' ? 'underground' : 'overworld');
    this.notifyStats();
  }

  public pause() {
    if (this.status === 'playing') {
      this.status = 'paused';
      soundEngine.stopMusic();
      soundEngine.playBump();
      this.notifyStats();
    } else if (this.status === 'paused') {
      this.status = 'playing';
      soundEngine.playMusic(this.levelData.theme === 'underground' ? 'underground' : 'overworld');
      this.notifyStats();
    }
  }

  public restartGame() {
    this.mario = this.createInitialMario();
    this.initLevel(getLevelById('world_1_1'));
    this.status = 'playing';
    soundEngine.playMusic('overworld');
    this.notifyStats();
  }

  public selectLevel(levelId: string) {
    this.currentLevelId = levelId;
    this.initLevel(getLevelById(levelId), true);
    this.status = 'playing';
    this.notifyStats();
  }

  public spawnFireball() {
    if (this.mario.power !== 'fire' || this.status !== 'playing') return;
    const activeFireballs = this.fireballs.filter(f => f.active);
    if (activeFireballs.length >= 2) return;

    soundEngine.playFireball();
    const dir = this.mario.facing === 'right' ? 1 : -1;
    this.fireballs.push({
      id: `fb_${Date.now()}`,
      x: this.mario.facing === 'right' ? this.mario.x + 16 : this.mario.x - 6,
      y: this.mario.y + 8,
      vx: dir * 4.5,
      vy: 1,
      width: 8,
      height: 8,
      bounces: 0,
      active: true,
    });
  }

  // Main tick loop
  public update(input: InputState) {
    this.animFrame++;

    if (this.status === 'paused' || this.status === 'menu') {
      return;
    }

    // Timer countdown
    if (this.status === 'playing') {
      this.timerAccumulator += 0.016;
      if (this.timerAccumulator >= 0.4) { // roughly 2.5 time units per second
        this.timerAccumulator = 0;
        this.inGameTimer--;
        if (this.inGameTimer <= 0) {
          this.inGameTimer = 0;
          this.mario.state = 'dying';
          this.mario.vy = -9;
          soundEngine.playDie();
        }
        this.notifyStats();
      }
    }

    // Check Death state
    if (this.mario.state === 'dying') {
      PhysicsEngine.updateMario(this.mario, input, this.tiles, (it) => this.items.push(it), (p) => this.particles.push(...p));
      this.deathRestartTimer++;
      if (this.deathRestartTimer > 180) { // ~3 seconds
        this.mario.lives--;
        if (this.mario.lives <= 0) {
          this.status = 'game_over';
        } else {
          this.initLevel(getLevelById(this.currentLevelId), true);
        }
        this.notifyStats();
      }
      return;
    }

    // Flagpole slide cutscene
    if (this.mario.state === 'flag') {
      this.handleFlagpoleCutscene();
      PhysicsEngine.updateParticles(this.particles);
      this.particles = this.particles.filter(p => p.timer > 0);
      return;
    }

    // Castle walk cutscene
    if (this.mario.state === 'castle_walk') {
      this.handleCastleWalk();
      PhysicsEngine.updateParticles(this.particles);
      this.particles = this.particles.filter(p => p.timer > 0);
      return;
    }

    // Stage clear score countdown
    if (this.status === 'stage_clear') {
      this.handleStageClearTally();
      return;
    }

    // Standard Gameplay Update
    PhysicsEngine.updateMario(
      this.mario, 
      input, 
      this.tiles, 
      (item) => this.items.push(item), 
      (p) => this.particles.push(...p)
    );

    PhysicsEngine.updateTiles(this.tiles);
    PhysicsEngine.updateItems(this.items, this.tiles, this.mario, (p) => this.particles.push(...p));
    PhysicsEngine.updateEnemies(this.enemies, this.tiles, this.mario, this.cameraX, (p) => this.particles.push(...p));
    PhysicsEngine.updateFireballs(this.fireballs, this.tiles, this.enemies, this.mario, (p) => this.particles.push(...p));
    PhysicsEngine.updateParticles(this.particles);

    // Clean up dead/collected entities
    this.items = this.items.filter(it => !it.collected);
    this.fireballs = this.fireballs.filter(f => f.active);
    this.particles = this.particles.filter(p => p.timer > 0);

    // Check Flagpole Collision
    const flagpoleWorldX = this.levelData.flagpoleTileX * 16;
    if (
      this.mario.x + this.mario.width >= flagpoleWorldX + 6 &&
      this.mario.x <= flagpoleWorldX + 12 &&
      this.mario.y < 13 * 16
    ) {
      this.startFlagpoleSequence();
    }

    // Camera follow (locks Mario around 35%-40% of viewport, only scrolls right)
    const targetCameraX = this.mario.x - 100;
    if (targetCameraX > this.cameraX) {
      this.cameraX = targetCameraX;
    }
    const maxCameraX = (this.levelData.widthInTiles * 16) - this.viewportWidth;
    if (this.cameraX > maxCameraX) {
      this.cameraX = maxCameraX;
    }
    if (this.cameraX < 0) this.cameraX = 0;
  }

  private startFlagpoleSequence() {
    this.mario.state = 'flag';
    this.mario.vx = 0;
    this.mario.vy = 0;
    this.mario.x = this.levelData.flagpoleTileX * 16 - 8;
    soundEngine.stopMusic();
    soundEngine.playFlagpole();

    // Calculate score based on height caught
    const poleHeightTiles = 10;
    const heightFraction = Math.max(0, Math.min(1, (13 * 16 - this.mario.y) / (poleHeightTiles * 16)));
    const flagPoints = heightFraction > 0.8 ? 5000 : heightFraction > 0.5 ? 2000 : heightFraction > 0.2 ? 800 : 400;
    this.mario.score += flagPoints;

    this.particles.push({
      id: `flag_score_${Date.now()}`,
      x: this.mario.x + 16,
      y: this.mario.y,
      vx: 0,
      vy: -1,
      type: 'score_popup',
      text: `${flagPoints}`,
      timer: 50,
      maxTimer: 50,
    });
  }

  private handleFlagpoleCutscene() {
    const groundY = 12 * 16; // bottom of pole
    if (this.mario.y < groundY) {
      this.mario.y += 2.5;
      this.flagY += 2.5;
    } else {
      this.mario.y = groundY;
      this.flagY = groundY;
      this.stageClearTimer++;
      if (this.stageClearTimer === 20) {
        // Hop around to right side of pole
        this.mario.x = this.levelData.flagpoleTileX * 16 + 12;
        this.mario.facing = 'right';
      } else if (this.stageClearTimer > 40) {
        // Start walking to castle
        this.mario.state = 'castle_walk';
        soundEngine.playStageClear();
        this.stageClearTimer = 0;
      }
    }
  }

  private handleCastleWalk() {
    if (this.mario.x < this.castleWalkTargetX) {
      this.mario.x += 1.3;
      this.mario.state = 'walking';
    } else {
      // Reached inside castle door
      this.mario.state = 'idle';
      this.status = 'stage_clear';
      // Trigger confetti celebration!
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore if confetti not ready
      }
    }
  }

  private handleStageClearTally() {
    this.stageClearTimer++;
    // Rapidly countdown remaining time to bonus points
    if (this.inGameTimer > 0) {
      const step = Math.min(this.inGameTimer, 3);
      this.inGameTimer -= step;
      this.mario.score += step * 50;
      if (this.stageClearTimer % 3 === 0) {
        soundEngine.playCoin();
      }
      this.notifyStats();
    } else {
      // Completed level
      if (this.stageClearTimer > 240) { // ~4 seconds after tally
        this.advanceToNextLevel();
      }
    }
  }

  public advanceToNextLevel() {
    if (this.currentLevelId === 'world_1_1') {
      this.currentLevelId = 'world_1_2';
    } else if (this.currentLevelId === 'world_1_2') {
      this.currentLevelId = 'world_1_3';
    } else {
      // Loop back to 1-1 with bonus
      this.currentLevelId = 'world_1_1';
    }
    this.initLevel(getLevelById(this.currentLevelId), true);
    this.status = 'playing';
    this.notifyStats();
  }

  private notifyStats() {
    if (this.onStatsChange) {
      this.onStatsChange({
        score: this.mario.score,
        coins: this.mario.coins,
        world: this.levelData.worldNumber,
        time: this.inGameTimer,
        lives: this.mario.lives,
        status: this.status,
      });
    }
  }

  // --- RENDER PIPELINE ---
  public render(ctx: CanvasRenderingContext2D) {
    spriteEngine.init();

    // 1. Background Fill
    ctx.fillStyle = this.levelData.bgColor;
    ctx.fillRect(0, 0, this.viewportWidth, this.viewportHeight);

    // Save camera transform
    ctx.save();
    ctx.translate(-Math.round(this.cameraX), 0);

    // 2. Scenery
    for (const sc of this.levelData.scenery) {
      const scX = sc.x * 16;
      const scY = sc.y * 16;
      if (scX + 64 < this.cameraX || scX - 32 > this.cameraX + this.viewportWidth) continue;

      if (sc.type.startsWith('cloud')) {
        spriteEngine.draw(ctx, 'scenery_cloud', scX, scY);
      } else if (sc.type.startsWith('bush')) {
        spriteEngine.draw(ctx, 'scenery_bush', scX, scY);
      } else if (sc.type.startsWith('hill')) {
        spriteEngine.draw(ctx, 'scenery_hill', scX, scY);
      }
    }

    // 3. Flag on Flagpole
    const flagpoleWorldX = this.levelData.flagpoleTileX * 16;
    spriteEngine.draw(ctx, 'sprite_flag', flagpoleWorldX - 14, this.flagY);

    // 4. Tiles
    const minTileX = Math.floor(this.cameraX / 16) - 1;
    const maxTileX = Math.ceil((this.cameraX + this.viewportWidth) / 16) + 1;

    for (const tile of this.tiles) {
      if (tile.x < minTileX || tile.x > maxTileX || tile.invisible) continue;

      const tx = tile.x * 16;
      const ty = tile.y * 16 + (tile.bumpOffset || 0);

      if (tile.type === 'ground') {
        const sprite = this.levelData.theme === 'underground' ? 'tile_ground_ug' : 'tile_ground';
        spriteEngine.draw(ctx, sprite, tx, ty);
      } else if (tile.type === 'brick') {
        const sprite = this.levelData.theme === 'underground' ? 'tile_brick_ug' : 'tile_brick';
        spriteEngine.draw(ctx, sprite, tx, ty);
      } else if (tile.type === 'question') {
        const qFrame = Math.floor(this.animFrame / 15) % 4;
        spriteEngine.draw(ctx, `tile_question_${qFrame}`, tx, ty);
      } else if (tile.type === 'empty_block') {
        spriteEngine.draw(ctx, 'tile_empty_block', tx, ty);
      } else if (tile.type === 'stone') {
        spriteEngine.draw(ctx, 'tile_stone', tx, ty);
      } else if (tile.type === 'pipe_top_left') {
        spriteEngine.draw(ctx, 'tile_pipe_top_left', tx, ty);
      } else if (tile.type === 'pipe_top_right') {
        spriteEngine.draw(ctx, 'tile_pipe_top_right', tx, ty);
      } else if (tile.type === 'pipe_shaft_left') {
        spriteEngine.draw(ctx, 'tile_pipe_shaft_left', tx, ty);
      } else if (tile.type === 'pipe_shaft_right') {
        spriteEngine.draw(ctx, 'tile_pipe_shaft_right', tx, ty);
      } else if (tile.type === 'flagpole') {
        spriteEngine.draw(ctx, 'tile_flagpole', tx, ty);
      } else if (tile.type === 'flagpole_top') {
        spriteEngine.draw(ctx, 'tile_flagpole_top', tx, ty);
      } else if (tile.type === 'castle_wall') {
        spriteEngine.draw(ctx, 'tile_castle_wall', tx, ty);
      } else if (tile.type === 'castle_door') {
        spriteEngine.draw(ctx, 'tile_castle_door', tx, ty);
      } else if (tile.type === 'castle_crenel') {
        spriteEngine.draw(ctx, 'tile_castle_crenel', tx, ty);
      }
    }

    // 5. Items (Mushrooms, Stars, etc.)
    for (const item of this.items) {
      if (item.collected) continue;
      if (item.type === 'mushroom') {
        spriteEngine.draw(ctx, 'item_mushroom', item.x, item.y);
      } else if (item.type === 'fireflower') {
        spriteEngine.draw(ctx, 'item_fireflower', item.x, item.y);
      } else if (item.type === 'star') {
        spriteEngine.draw(ctx, 'item_star', item.x, item.y);
      } else if (item.type === 'oneup') {
        spriteEngine.draw(ctx, 'item_oneup', item.x, item.y);
      }
    }

    // 6. Enemies
    for (const enemy of this.enemies) {
      if (enemy.dead && enemy.stompState !== 'flat' && enemy.stompState !== 'shell_sliding') continue;
      if (enemy.x + 32 < this.cameraX || enemy.x > this.cameraX + this.viewportWidth + 32) continue;

      if (enemy.type === 'goomba') {
        if (enemy.stompState === 'flat') {
          spriteEngine.draw(ctx, 'goomba_flat', enemy.x, enemy.y);
        } else {
          const walkFrame = Math.floor(this.animFrame / 10) % 2 === 0 ? 'walk1' : 'walk2';
          spriteEngine.draw(ctx, `goomba_${walkFrame}`, enemy.x, enemy.y);
        }
      } else if (enemy.type === 'koopa') {
        if (enemy.stompState === 'shell' || enemy.stompState === 'shell_sliding') {
          spriteEngine.draw(ctx, 'koopa_shell', enemy.x, enemy.y);
        } else {
          const walkFrame = Math.floor(this.animFrame / 10) % 2 === 0 ? 'walk1' : 'walk2';
          spriteEngine.draw(ctx, `koopa_${walkFrame}`, enemy.x, enemy.y, enemy.facing === 'right');
        }
      }
    }

    // 7. Fireballs
    for (const fb of this.fireballs) {
      if (!fb.active) continue;
      spriteEngine.draw(ctx, 'fireball', fb.x, fb.y);
    }

    // 8. Mario
    if (this.mario.state !== 'castle_walk' || this.mario.x < this.castleWalkTargetX) {
      this.renderMario(ctx);
    }

    // 9. Particles & Popups
    for (const p of this.particles) {
      if (p.type === 'brick_piece') {
        ctx.fillStyle = '#C84C0C';
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 4, 4);
      } else if (p.type === 'coin_sparkle') {
        const cFrame = Math.floor(this.animFrame / 6) % 4;
        spriteEngine.draw(ctx, `item_coin_${cFrame}`, p.x, p.y);
      } else if (p.type === 'score_popup' && p.text) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '8px monospace';
        ctx.fillText(p.text, Math.round(p.x), Math.round(p.y));
      } else if (p.type === 'fire_burst') {
        ctx.fillStyle = '#F8B800';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  private renderMario(ctx: CanvasRenderingContext2D) {
    // Invulnerability blinking
    if (this.mario.invulnerableTimer > 0 && Math.floor(this.animFrame / 4) % 2 === 0) {
      return;
    }

    // Starman rainbow color flashing
    let powerForSprite = this.mario.power;
    if (this.mario.starTimer > 0) {
      const flash = Math.floor(this.animFrame / 4) % 3;
      powerForSprite = flash === 0 ? 'fire' : flash === 1 ? 'super' : 'small';
    }

    const isSmall = this.mario.power === 'small';

    let pose = 'idle';
    if (this.mario.state === 'dying') {
      pose = 'die';
    } else if (this.mario.state === 'crouching' && !isSmall) {
      pose = 'crouch';
    } else if (this.mario.state === 'jumping' || this.mario.state === 'falling') {
      pose = 'jump';
    } else if (this.mario.state === 'skidding') {
      pose = 'skid';
    } else if (this.mario.state === 'flag') {
      pose = 'flag';
    } else if (this.mario.state === 'walking' || this.mario.state === 'running') {
      const runSpeedDiv = this.mario.state === 'running' ? 4 : 7;
      const stepFrame = Math.floor(this.animFrame / runSpeedDiv) % 2;
      pose = stepFrame === 0 ? 'run1' : 'run2';
    }

    const spriteKey = isSmall 
      ? `mario_small_${powerForSprite}_${pose}`
      : `mario_super_${powerForSprite}_${pose}`;

    const flip = this.mario.facing === 'left';
    spriteEngine.draw(ctx, spriteKey, this.mario.x, this.mario.y, flip);
  }
}
