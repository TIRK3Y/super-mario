// Physics, Collision Detection, and Entity Resolution Engine

import { Mario, Tile, Enemy, Item, Fireball, Particle } from '@/types/game';
import { soundEngine } from '@/audio/soundEngine';

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function checkAABB(b1: Box, b2: Box): boolean {
  return (
    b1.x < b2.x + b2.width &&
    b1.x + b1.width > b2.x &&
    b1.y < b2.y + b2.height &&
    b1.y + b1.height > b2.y
  );
}

export function isSolidTile(tile: Tile): boolean {
  if (tile.invisible) return false;
  return (
    tile.type === 'ground' ||
    tile.type === 'brick' ||
    tile.type === 'question' ||
    tile.type === 'empty_block' ||
    tile.type === 'stone' ||
    tile.type === 'pipe_top_left' ||
    tile.type === 'pipe_top_right' ||
    tile.type === 'pipe_shaft_left' ||
    tile.type === 'pipe_shaft_right' ||
    tile.type === 'castle_wall' ||
    tile.type === 'castle_crenel'
  );
}

// Bounding box of a tile in world coordinates
export function getTileBox(tile: Tile): Box {
  const yOffset = tile.bumpOffset || 0;
  return {
    x: tile.x * 16,
    y: tile.y * 16 + yOffset,
    width: 16,
    height: 16,
  };
}

export class PhysicsEngine {
  public static GRAVITY = 0.42;
  public static MAX_FALL_SPEED = 8.5;
  public static WALK_ACCEL = 0.15;
  public static RUN_ACCEL = 0.25;
  public static FRICTION = 0.88;
  public static MAX_WALK_SPEED = 2.4;
  public static MAX_RUN_SPEED = 4.0;
  public static JUMP_FORCE = -7.4;
  public static JUMP_HOLD_BOOST = -0.4;
  public static MAX_JUMP_TIME = 15;

  // Resolve Mario movement and collisions with tiles
  public static updateMario(
    mario: Mario,
    input: { left: boolean; right: boolean; jump: boolean; run: boolean; down: boolean },
    tiles: Tile[],
    spawnItem: (item: Item) => void,
    spawnParticles: (particles: Particle[]) => void
  ) {
    if (mario.state === 'dying' || mario.state === 'dead') {
      mario.vy += PhysicsEngine.GRAVITY * 0.9;
      mario.y += mario.vy;
      return;
    }

    if (mario.state === 'flag' || mario.state === 'castle_walk') {
      return; // Handled specially in game loop
    }

    // Timers
    if (mario.invulnerableTimer > 0) mario.invulnerableTimer -= 0.016;
    if (mario.starTimer > 0) {
      mario.starTimer -= 0.016;
      if (mario.starTimer <= 0) {
        soundEngine.playMusic('overworld');
      }
    }
    if (mario.growingTimer > 0) mario.growingTimer -= 0.016;
    if (mario.shrinkingTimer > 0) mario.shrinkingTimer -= 0.016;

    // Crouching (Super & Fire Mario)
    mario.crouching = input.down && mario.grounded && mario.power !== 'small';
    if (mario.crouching) {
      mario.height = 20;
    } else {
      mario.height = mario.power === 'small' ? 16 : 32;
    }

    // Horizontal Acceleration
    const accel = input.run ? PhysicsEngine.RUN_ACCEL : PhysicsEngine.WALK_ACCEL;
    const maxSpeed = input.run ? PhysicsEngine.MAX_RUN_SPEED : PhysicsEngine.MAX_WALK_SPEED;

    if (!mario.crouching) {
      if (input.left) {
        mario.facing = 'left';
        if (mario.vx > 0.5 && mario.grounded) {
          mario.state = 'skidding';
        }
        mario.vx -= accel;
        if (mario.vx < -maxSpeed) mario.vx = -maxSpeed;
      } else if (input.right) {
        mario.facing = 'right';
        if (mario.vx < -0.5 && mario.grounded) {
          mario.state = 'skidding';
        }
        mario.vx += accel;
        if (mario.vx > maxSpeed) mario.vx = maxSpeed;
      } else {
        mario.vx *= PhysicsEngine.FRICTION;
        if (Math.abs(mario.vx) < 0.05) mario.vx = 0;
      }
    } else {
      // Crouch friction
      mario.vx *= 0.92;
      if (Math.abs(mario.vx) < 0.05) mario.vx = 0;
    }

    // Jump Physics
    if (input.jump) {
      if (mario.grounded && mario.canJump) {
        mario.vy = PhysicsEngine.JUMP_FORCE;
        mario.grounded = false;
        mario.canJump = false;
        mario.jumpTimer = PhysicsEngine.MAX_JUMP_TIME;
        if (mario.power === 'small') {
          soundEngine.playJumpSmall();
        } else {
          soundEngine.playJumpSuper();
        }
      } else if (mario.jumpTimer > 0) {
        mario.vy += PhysicsEngine.JUMP_HOLD_BOOST;
        mario.jumpTimer--;
      }
    } else {
      mario.jumpTimer = 0;
      if (mario.grounded) {
        mario.canJump = true;
      }
    }

    // Gravity
    mario.vy += PhysicsEngine.GRAVITY;
    if (mario.vy > PhysicsEngine.MAX_FALL_SPEED) mario.vy = PhysicsEngine.MAX_FALL_SPEED;

    // Determine Action State
    if (!mario.grounded) {
      mario.state = mario.vy < 0 ? 'jumping' : 'falling';
    } else if (mario.crouching) {
      mario.state = 'crouching';
    } else if (Math.abs(mario.vx) > 0.3) {
      if ((input.left && mario.vx > 0.4) || (input.right && mario.vx < -0.4)) {
        mario.state = 'skidding';
      } else {
        mario.state = input.run ? 'running' : 'walking';
      }
    } else {
      mario.state = 'idle';
    }

    // Horizontal Movement & Collisions
    mario.x += mario.vx;
    if (mario.x < 0) {
      mario.x = 0;
      mario.vx = 0;
    }

    let marioBox = { x: mario.x, y: mario.y, width: mario.width, height: mario.height };
    for (const tile of tiles) {
      if (!isSolidTile(tile)) continue;
      const tileBox = getTileBox(tile);
      if (checkAABB(marioBox, tileBox)) {
        if (mario.vx > 0) {
          mario.x = tileBox.x - mario.width;
          mario.vx = 0;
        } else if (mario.vx < 0) {
          mario.x = tileBox.x + tileBox.width;
          mario.vx = 0;
        }
        marioBox.x = mario.x;
      }
    }

    // Vertical Movement & Collisions
    mario.y += mario.vy;
    mario.grounded = false;
    marioBox = { x: mario.x, y: mario.y, width: mario.width, height: mario.height };

    for (const tile of tiles) {
      // Check hidden block bump from below
      if (tile.invisible && mario.vy < 0) {
        const tileBox = getTileBox(tile);
        if (checkAABB(marioBox, tileBox) && mario.y + mario.height / 2 > tileBox.y + tileBox.height / 2) {
          tile.invisible = false;
          PhysicsEngine.bumpTile(tile, mario, spawnItem, spawnParticles);
          mario.y = tileBox.y + tileBox.height;
          mario.vy = 0;
          marioBox.y = mario.y;
          continue;
        }
      }

      if (!isSolidTile(tile)) continue;
      const tileBox = getTileBox(tile);
      if (checkAABB(marioBox, tileBox)) {
        if (mario.vy > 0) {
          // Landing on top of tile
          mario.y = tileBox.y - mario.height;
          mario.vy = 0;
          mario.grounded = true;
          mario.canJump = true;
        } else if (mario.vy < 0) {
          // Bumping tile from underneath!
          mario.y = tileBox.y + tileBox.height;
          mario.vy = 1;
          PhysicsEngine.bumpTile(tile, mario, spawnItem, spawnParticles);
        }
        marioBox.y = mario.y;
      }
    }

    // Check pit fall
    if (mario.y > 260) {
      mario.state = 'dying';
      mario.vy = -10;
      soundEngine.playDie();
    }
  }

  // Handle bumping a tile from below
  private static bumpTile(
    tile: Tile,
    mario: Mario,
    spawnItem: (item: Item) => void,
    spawnParticles: (particles: Particle[]) => void
  ) {
    tile.bumping = true;
    tile.bumpOffset = -7;
    tile.bumpVelocity = 2.5;

    // Question Block hit
    if (tile.type === 'question') {
      tile.type = 'empty_block';
      soundEngine.playBump();

      if (tile.contents === 'coin' || !tile.contents) {
        mario.score += 200;
        mario.coins += 1;
        soundEngine.playCoin();
        // Spawn bouncing coin particle
        spawnParticles([{
          id: `coin_pop_${Date.now()}`,
          x: tile.x * 16 + 3,
          y: tile.y * 16 - 16,
          vx: 0,
          vy: -4.5,
          type: 'coin_sparkle',
          timer: 30,
          maxTimer: 30,
        }, {
          id: `score_pop_${Date.now()}`,
          x: tile.x * 16,
          y: tile.y * 16 - 20,
          vx: 0,
          vy: -0.8,
          type: 'score_popup',
          text: '200',
          timer: 40,
          maxTimer: 40,
        }]);
      } else if (tile.contents === 'mushroom') {
        const itemType = mario.power === 'small' ? 'mushroom' : 'fireflower';
        soundEngine.playPowerupSpawn();
        spawnItem({
          id: `item_${Date.now()}`,
          type: itemType,
          x: tile.x * 16,
          y: tile.y * 16,
          vx: 1.0,
          vy: 0,
          width: 16,
          height: 16,
          grounded: false,
          collected: false,
          emerging: true,
          emergeDistance: 0,
          spawnY: tile.y * 16,
          animTimer: 0,
        });
      } else if (tile.contents === 'star') {
        soundEngine.playPowerupSpawn();
        spawnItem({
          id: `item_star_${Date.now()}`,
          type: 'star',
          x: tile.x * 16,
          y: tile.y * 16,
          vx: 1.2,
          vy: -3.5,
          width: 16,
          height: 16,
          grounded: false,
          collected: false,
          emerging: true,
          emergeDistance: 0,
          spawnY: tile.y * 16,
          animTimer: 0,
        });
      } else if (tile.contents === 'oneup') {
        soundEngine.playPowerupSpawn();
        spawnItem({
          id: `item_oneup_${Date.now()}`,
          type: 'oneup',
          x: tile.x * 16,
          y: tile.y * 16,
          vx: 1.0,
          vy: 0,
          width: 16,
          height: 16,
          grounded: false,
          collected: false,
          emerging: true,
          emergeDistance: 0,
          spawnY: tile.y * 16,
          animTimer: 0,
        });
      }
    } else if (tile.type === 'brick') {
      if (mario.power === 'small') {
        soundEngine.playBump();
      } else {
        // Super/Fire Mario shatters brick!
        tile.type = 'empty_block'; // replaced
        tile.invisible = true; // remove from collision
        mario.score += 50;
        soundEngine.playBrickBreak();

        // Spawn 4 spinning brick pieces
        const bx = tile.x * 16;
        const by = tile.y * 16;
        spawnParticles([
          { id: `brk1_${Date.now()}`, x: bx, y: by, vx: -2, vy: -5, type: 'brick_piece', timer: 45, maxTimer: 45 },
          { id: `brk2_${Date.now()}`, x: bx + 8, y: by, vx: 2, vy: -5, type: 'brick_piece', timer: 45, maxTimer: 45 },
          { id: `brk3_${Date.now()}`, x: bx, y: by + 8, vx: -1.5, vy: -3, type: 'brick_piece', timer: 45, maxTimer: 45 },
          { id: `brk4_${Date.now()}`, x: bx + 8, y: by + 8, vx: 1.5, vy: -3, type: 'brick_piece', timer: 45, maxTimer: 45 },
        ]);
      }
    }
  }

  // Update tiles bump animation
  public static updateTiles(tiles: Tile[]) {
    for (const tile of tiles) {
      if (tile.bumping) {
        tile.bumpOffset = (tile.bumpOffset || 0) + (tile.bumpVelocity || 0);
        if ((tile.bumpOffset || 0) >= 0) {
          tile.bumpOffset = 0;
          tile.bumping = false;
        }
      }
    }
  }

  // Update items (mushrooms, stars, etc.)
  public static updateItems(items: Item[], tiles: Tile[], mario: Mario, spawnParticles: (p: Particle[]) => void) {
    for (const item of items) {
      if (item.collected) continue;

      if (item.emerging) {
        item.emergeDistance += 0.8;
        item.y = item.spawnY - item.emergeDistance;
        if (item.emergeDistance >= 16) {
          item.emerging = false;
          item.y = item.spawnY - 16;
        }
        continue;
      }

      // Physics
      item.vy += PhysicsEngine.GRAVITY * 0.8;
      if (item.vy > 6) item.vy = 6;

      item.x += item.vx;
      let itemBox: Box = { x: item.x, y: item.y, width: item.width, height: item.height };
      for (const tile of tiles) {
        if (!isSolidTile(tile)) continue;
        const tb = getTileBox(tile);
        if (checkAABB(itemBox, tb)) {
          if (item.vx > 0) {
            item.x = tb.x - item.width;
            item.vx = -item.vx;
          } else if (item.vx < 0) {
            item.x = tb.x + tb.width;
            item.vx = -item.vx;
          }
          itemBox.x = item.x;
        }
      }

      item.y += item.vy;
      itemBox = { x: item.x, y: item.y, width: item.width, height: item.height };
      item.grounded = false;

      for (const tile of tiles) {
        if (!isSolidTile(tile)) continue;
        const tb = getTileBox(tile);
        if (checkAABB(itemBox, tb)) {
          if (item.vy > 0) {
            item.y = tb.y - item.height;
            item.vy = item.type === 'star' ? -4.5 : 0; // Stars bounce!
            item.grounded = true;
          } else if (item.vy < 0) {
            item.y = tb.y + tb.height;
            item.vy = 0;
          }
          itemBox.y = item.y;
        }
      }

      // Check collision with Mario
      const marioBox: Box = { x: mario.x, y: mario.y, width: mario.width, height: mario.height };
      if (checkAABB(marioBox, itemBox)) {
        item.collected = true;
        if (item.type === 'mushroom') {
          soundEngine.playPowerup();
          mario.power = 'super';
          mario.growingTimer = 0.8;
          mario.score += 1000;
        } else if (item.type === 'fireflower') {
          soundEngine.playPowerup();
          mario.power = 'fire';
          mario.growingTimer = 0.8;
          mario.score += 1000;
        } else if (item.type === 'star') {
          soundEngine.playPowerup();
          mario.starTimer = 10;
          soundEngine.playMusic('star');
          mario.score += 1000;
        } else if (item.type === 'oneup') {
          soundEngine.playPowerup();
          mario.lives += 1;
          mario.score += 1000;
        }

        spawnParticles([{
          id: `score_item_${Date.now()}`,
          x: item.x,
          y: item.y - 12,
          vx: 0,
          vy: -1,
          type: 'score_popup',
          text: '1000',
          timer: 40,
          maxTimer: 40,
        }]);
      }
    }
  }

  // Update enemies
  public static updateEnemies(
    enemies: Enemy[],
    tiles: Tile[],
    mario: Mario,
    cameraX: number,
    spawnParticles: (p: Particle[]) => void
  ) {
    for (const enemy of enemies) {
      if (enemy.dead && enemy.stompState !== 'flat' && enemy.stompState !== 'shell_sliding') continue;

      // Only activate when within 320px of camera view
      if (enemy.x > cameraX + 340 || enemy.x < cameraX - 100) continue;

      // Flat Goomba timer
      if (enemy.stompState === 'flat') {
        enemy.stompTimer = (enemy.stompTimer || 0) + 1;
        if (enemy.stompTimer > 35) {
          enemy.dead = true;
        }
        continue;
      }

      // Shell sliding physics
      if (enemy.stompState === 'shell_sliding') {
        enemy.x += enemy.vx;
        const eBox: Box = { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height };

        for (const tile of tiles) {
          if (!isSolidTile(tile)) continue;
          const tb = getTileBox(tile);
          if (checkAABB(eBox, tb)) {
            enemy.vx = -enemy.vx;
            soundEngine.playBump();
            break;
          }
        }

        // Eliminate other enemies in path!
        for (const other of enemies) {
          if (other.id === enemy.id || other.dead) continue;
          if (checkAABB(eBox, { x: other.x, y: other.y, width: other.width, height: other.height })) {
            other.dead = true;
            other.vy = -6;
            soundEngine.playKick();
            mario.score += 500;
            spawnParticles([{
              id: `combo_${Date.now()}`,
              x: other.x,
              y: other.y - 10,
              vx: 0,
              vy: -1,
              type: 'score_popup',
              text: '500',
              timer: 35,
              maxTimer: 35,
            }]);
          }
        }
        continue;
      }

      // Normal enemy movement & gravity
      enemy.vy += PhysicsEngine.GRAVITY;
      if (enemy.vy > 6) enemy.vy = 6;

      // Horizontal movement
      enemy.x += enemy.vx;
      let eBox: Box = { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height };

      for (const tile of tiles) {
        if (!isSolidTile(tile)) continue;
        const tb = getTileBox(tile);
        if (checkAABB(eBox, tb)) {
          if (enemy.vx > 0) {
            enemy.x = tb.x - enemy.width;
            enemy.vx = -enemy.vx;
            enemy.facing = 'left';
          } else if (enemy.vx < 0) {
            enemy.x = tb.x + tb.width;
            enemy.vx = -enemy.vx;
            enemy.facing = 'right';
          }
          eBox.x = enemy.x;
        }
      }

      // Vertical movement
      enemy.y += enemy.vy;
      eBox = { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height };
      enemy.grounded = false;

      for (const tile of tiles) {
        if (!isSolidTile(tile)) continue;
        const tb = getTileBox(tile);
        if (checkAABB(eBox, tb)) {
          if (enemy.vy > 0) {
            enemy.y = tb.y - enemy.height;
            enemy.vy = 0;
            enemy.grounded = true;
          }
          eBox.y = enemy.y;
        }
      }

      // Mario vs Enemy Collision
      if (mario.state === 'dying' || mario.state === 'dead' || mario.state === 'flag' || mario.state === 'castle_walk') continue;

      const mBox: Box = { x: mario.x, y: mario.y, width: mario.width, height: mario.height };
      if (checkAABB(mBox, eBox)) {
        // Starman touch: instant defeat
        if (mario.starTimer > 0) {
          enemy.dead = true;
          enemy.vy = -6;
          soundEngine.playKick();
          mario.score += 200;
          continue;
        }

        // Mario stomps enemy from above
        const stomping = mario.vy > 0 && (mario.y + mario.height - mario.vy <= enemy.y + 8);
        if (stomping) {
          mario.vy = -5.5; // Bounce Mario up
          if (enemy.type === 'goomba') {
            enemy.stompState = 'flat';
            enemy.stompTimer = 0;
            soundEngine.playStomp();
            mario.score += 100;
            spawnParticles([{
              id: `stomp_${Date.now()}`,
              x: enemy.x,
              y: enemy.y - 10,
              vx: 0,
              vy: -1,
              type: 'score_popup',
              text: '100',
              timer: 30,
              maxTimer: 30,
            }]);
          } else if (enemy.type === 'koopa') {
            soundEngine.playStomp();
            if (enemy.stompState !== 'shell') {
              enemy.stompState = 'shell';
              enemy.height = 16;
              enemy.vx = 0;
              mario.score += 100;
            } else {
              // Kick shell
              enemy.stompState = 'shell_sliding';
              enemy.vx = mario.facing === 'right' ? 6 : -6;
              soundEngine.playKick();
              mario.score += 400;
            }
          }
        } else {
          // Stationary shell kick
          if (enemy.type === 'koopa' && enemy.stompState === 'shell') {
            enemy.stompState = 'shell_sliding';
            enemy.vx = mario.x < enemy.x ? 6 : -6;
            soundEngine.playKick();
            mario.score += 400;
          } else {
            // Mario takes damage!
            if (mario.invulnerableTimer <= 0) {
              if (mario.power === 'fire' || mario.power === 'super') {
                mario.power = 'small';
                mario.shrinkingTimer = 1.0;
                mario.invulnerableTimer = 2.5;
                soundEngine.playPipe();
              } else {
                mario.state = 'dying';
                mario.vy = -9.0;
                soundEngine.playDie();
              }
            }
          }
        }
      }
    }
  }

  // Update fireballs
  public static updateFireballs(
    fireballs: Fireball[],
    tiles: Tile[],
    enemies: Enemy[],
    mario: Mario,
    spawnParticles: (p: Particle[]) => void
  ) {
    for (const fb of fireballs) {
      if (!fb.active) continue;

      fb.vy += PhysicsEngine.GRAVITY * 0.9;
      fb.x += fb.vx;

      let fBox: Box = { x: fb.x, y: fb.y, width: fb.width, height: fb.height };
      for (const tile of tiles) {
        if (!isSolidTile(tile)) continue;
        const tb = getTileBox(tile);
        if (checkAABB(fBox, tb)) {
          fb.active = false;
          spawnParticles([{
            id: `fb_burst_${Date.now()}`,
            x: fb.x,
            y: fb.y,
            vx: 0,
            vy: 0,
            type: 'fire_burst',
            timer: 15,
            maxTimer: 15,
          }]);
          break;
        }
      }

      fb.y += fb.vy;
      fBox = { x: fb.x, y: fb.y, width: fb.width, height: fb.height };
      for (const tile of tiles) {
        if (!isSolidTile(tile)) continue;
        const tb = getTileBox(tile);
        if (checkAABB(fBox, tb)) {
          if (fb.vy > 0) {
            fb.y = tb.y - fb.height;
            fb.vy = -3.5; // Fireball bounces!
            fb.bounces++;
            if (fb.bounces > 4) fb.active = false;
          } else {
            fb.active = false;
          }
          break;
        }
      }

      // Check collision with enemies
      for (const enemy of enemies) {
        if (enemy.dead) continue;
        if (checkAABB(fBox, { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height })) {
          enemy.dead = true;
          enemy.vy = -6;
          fb.active = false;
          soundEngine.playKick();
          mario.score += 200;
          spawnParticles([{
            id: `fb_kill_${Date.now()}`,
            x: enemy.x,
            y: enemy.y - 10,
            vx: 0,
            vy: -1,
            type: 'score_popup',
            text: '200',
            timer: 30,
            maxTimer: 30,
          }]);
          break;
        }
      }
    }
  }

  // Update particles (brick debris, popups, sparkles)
  public static updateParticles(particles: Particle[]) {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.type === 'brick_piece') {
        p.vy += PhysicsEngine.GRAVITY;
      }
      p.timer--;
    }
  }
}
