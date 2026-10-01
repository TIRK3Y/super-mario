// High performance NES-accurate pixel sprite generator & renderer
// All sprites are pre-rendered into offscreen canvas buffers for maximum 60fps performance

import { MarioPower } from '@/types/game';

// NES Color Palette Constants
export const PALETTE = {
  SKY_BLUE: '#5C94FC',
  UNDERGROUND_BG: '#000000',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  
  // Mario Colors (Small & Super)
  MARIO_RED: '#E52521',
  MARIO_BROWN: '#8B4513',
  MARIO_SKIN: '#FFCCA0',
  MARIO_BLUE: '#0045AD',
  
  // Fire Mario Colors
  FIRE_WHITE: '#FFFFFF',
  FIRE_RED: '#E52521',
  
  // Scenery & Overworld Tiles
  GROUND_TOP: '#E45C10',
  GROUND_MAIN: '#D04000',
  GROUND_DARK: '#882000',
  
  BRICK_MAIN: '#C84C0C',
  BRICK_LINE: '#000000',
  BRICK_LIGHT: '#E47C38',
  
  BRICK_UG_MAIN: '#0070AC',
  BRICK_UG_LIGHT: '#00A8F8',
  BRICK_UG_DARK: '#003854',
  
  QUESTION_BG: '#FC9838',
  QUESTION_MARK: '#000000',
  QUESTION_SHINE: '#FFFFFF',
  QUESTION_BORDER: '#803000',
  
  EMPTY_BLOCK: '#8B4513',
  EMPTY_DARK: '#4A2508',
  
  PIPE_LIGHT: '#88D800',
  PIPE_MAIN: '#00A800',
  PIPE_DARK: '#005000',
  PIPE_BORDER: '#000000',
  
  // Enemies
  GOOMBA_MAIN: '#A84000',
  GOOMBA_SKIN: '#FFCCA0',
  GOOMBA_FEET: '#000000',
  
  KOOPA_SHELL: '#00A800',
  KOOPA_SKIN: '#FFCCA0',
  KOOPA_BELLY: '#F8F878',
  
  PIRANHA_RED: '#E52521',
  PIRANHA_LIPS: '#FFFFFF',
  PIRANHA_STEM: '#00A800',

  // Items
  MUSHROOM_RED: '#E52521',
  MUSHROOM_WHITE: '#FFFFFF',
  MUSHROOM_STEM: '#FFCCA0',
  
  ONEUP_GREEN: '#00A800',
  
  COIN_GOLD: '#F8B800',
  COIN_LIGHT: '#FCE0A8',
  COIN_DARK: '#A85800',

  // Castle
  CASTLE_BRICK: '#8B4513',
  CASTLE_DOOR: '#000000',
  CASTLE_FLAG: '#FFFFFF',
};

class SpriteEngine {
  private cache: Map<string, HTMLCanvasElement> = new Map();
  private initialized: boolean = false;

  public init() {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;
    this.generateAllSprites();
  }

  private createBuffer(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    return [canvas, ctx];
  }

  private generateAllSprites() {
    this.generateTiles();
    this.generateMarioSprites();
    this.generateEnemySprites();
    this.generateItemSprites();
    this.generateScenerySprites();
  }

  // --- TILES ---
  private generateTiles() {
    // 1. Ground Overworld
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.GROUND_MAIN;
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = PALETTE.GROUND_TOP;
      ctx.fillRect(0, 0, 16, 3);
      ctx.fillStyle = PALETTE.GROUND_DARK;
      // stone texture specs
      ctx.fillRect(2, 6, 3, 3);
      ctx.fillRect(9, 5, 4, 3);
      ctx.fillRect(4, 11, 4, 3);
      ctx.fillRect(11, 12, 3, 2);
      ctx.fillStyle = PALETTE.GROUND_TOP;
      ctx.fillRect(1, 8, 2, 2);
      ctx.fillRect(8, 10, 2, 2);
      this.cache.set('tile_ground', canvas);
    }

    // 2. Ground Underground
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.BRICK_UG_MAIN;
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = PALETTE.BRICK_UG_LIGHT;
      ctx.fillRect(0, 0, 16, 3);
      ctx.fillStyle = PALETTE.BRICK_UG_DARK;
      ctx.fillRect(2, 6, 3, 3);
      ctx.fillRect(9, 5, 4, 3);
      ctx.fillRect(4, 11, 4, 3);
      ctx.fillRect(11, 12, 3, 2);
      this.cache.set('tile_ground_ug', canvas);
    }

    // 3. Brick Overworld
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.BRICK_MAIN;
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = PALETTE.BRICK_LINE;
      // horizontal lines
      ctx.fillRect(0, 0, 16, 1);
      ctx.fillRect(0, 4, 16, 1);
      ctx.fillRect(0, 8, 16, 1);
      ctx.fillRect(0, 12, 16, 1);
      // vertical brick separators
      ctx.fillRect(8, 0, 1, 4);
      ctx.fillRect(4, 4, 1, 4);
      ctx.fillRect(12, 4, 1, 4);
      ctx.fillRect(8, 8, 1, 4);
      ctx.fillRect(4, 12, 1, 4);
      ctx.fillRect(12, 12, 1, 4);
      // Highlights
      ctx.fillStyle = PALETTE.BRICK_LIGHT;
      ctx.fillRect(0, 1, 8, 1);
      ctx.fillRect(9, 1, 7, 1);
      ctx.fillRect(0, 5, 4, 1);
      ctx.fillRect(5, 5, 7, 1);
      ctx.fillRect(13, 5, 3, 1);
      this.cache.set('tile_brick', canvas);
    }

    // 4. Brick Underground
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.BRICK_UG_MAIN;
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = PALETTE.BLACK;
      ctx.fillRect(0, 0, 16, 1);
      ctx.fillRect(0, 4, 16, 1);
      ctx.fillRect(0, 8, 16, 1);
      ctx.fillRect(0, 12, 16, 1);
      ctx.fillRect(8, 0, 1, 4);
      ctx.fillRect(4, 4, 1, 4);
      ctx.fillRect(12, 4, 1, 4);
      ctx.fillRect(8, 8, 1, 4);
      ctx.fillRect(4, 12, 1, 4);
      ctx.fillRect(12, 12, 1, 4);
      ctx.fillStyle = PALETTE.BRICK_UG_LIGHT;
      ctx.fillRect(0, 1, 8, 1);
      ctx.fillRect(9, 1, 7, 1);
      this.cache.set('tile_brick_ug', canvas);
    }

    // 5. Question Blocks (4 animation frames)
    for (let f = 0; f < 4; f++) {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.QUESTION_BG;
      ctx.fillRect(0, 0, 16, 16);
      // Border
      ctx.fillStyle = PALETTE.QUESTION_BORDER;
      ctx.strokeRect(0.5, 0.5, 15, 15);
      // Corner rivets
      ctx.fillStyle = PALETTE.QUESTION_BORDER;
      ctx.fillRect(1, 1, 2, 2);
      ctx.fillRect(13, 1, 2, 2);
      ctx.fillRect(1, 13, 2, 2);
      ctx.fillRect(13, 13, 2, 2);

      // Question Mark (or shine on frame 3)
      const qColor = f === 3 ? PALETTE.QUESTION_SHINE : PALETTE.QUESTION_MARK;
      ctx.fillStyle = qColor;
      ctx.fillRect(5, 3, 6, 2);
      ctx.fillRect(9, 5, 2, 2);
      ctx.fillRect(7, 7, 2, 2);
      ctx.fillRect(7, 10, 2, 2);

      // Outer highlight
      ctx.fillStyle = f === 3 ? PALETTE.WHITE : PALETTE.QUESTION_SHINE;
      ctx.fillRect(1, 1, 14, 1);
      ctx.fillRect(1, 1, 1, 14);

      this.cache.set(`tile_question_${f}`, canvas);
    }

    // 6. Empty Block (bumped question block)
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.EMPTY_BLOCK;
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = PALETTE.EMPTY_DARK;
      ctx.strokeRect(0.5, 0.5, 15, 15);
      ctx.fillRect(2, 2, 2, 2);
      ctx.fillRect(12, 2, 2, 2);
      ctx.fillRect(2, 12, 2, 2);
      ctx.fillRect(12, 12, 2, 2);
      this.cache.set('tile_empty_block', canvas);
    }

    // 7. Stone Block
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = '#C8C8C8';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 16, 2);
      ctx.fillRect(0, 0, 2, 16);
      ctx.fillStyle = '#606060';
      ctx.fillRect(0, 14, 16, 2);
      ctx.fillRect(14, 0, 2, 16);
      ctx.fillStyle = '#000000';
      ctx.fillRect(4, 4, 8, 8);
      this.cache.set('tile_stone', canvas);
    }

    // 8. Pipes
    // Top Left
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.PIPE_MAIN;
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = PALETTE.PIPE_LIGHT;
      ctx.fillRect(2, 0, 4, 16);
      ctx.fillStyle = PALETTE.PIPE_BORDER;
      ctx.strokeRect(0.5, 0.5, 15.5, 15);
      this.cache.set('tile_pipe_top_left', canvas);
    }
    // Top Right
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.PIPE_MAIN;
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = PALETTE.PIPE_DARK;
      ctx.fillRect(10, 0, 4, 16);
      ctx.fillStyle = PALETTE.PIPE_BORDER;
      ctx.strokeRect(0, 0.5, 15.5, 15);
      this.cache.set('tile_pipe_top_right', canvas);
    }
    // Shaft Left
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.PIPE_MAIN;
      ctx.fillRect(2, 0, 14, 16);
      ctx.fillStyle = PALETTE.PIPE_LIGHT;
      ctx.fillRect(4, 0, 3, 16);
      ctx.fillStyle = PALETTE.PIPE_BORDER;
      ctx.fillRect(2, 0, 1, 16);
      this.cache.set('tile_pipe_shaft_left', canvas);
    }
    // Shaft Right
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.PIPE_MAIN;
      ctx.fillRect(0, 0, 14, 16);
      ctx.fillStyle = PALETTE.PIPE_DARK;
      ctx.fillRect(9, 0, 4, 16);
      ctx.fillStyle = PALETTE.PIPE_BORDER;
      ctx.fillRect(13, 0, 1, 16);
      this.cache.set('tile_pipe_shaft_right', canvas);
    }

    // 9. Flagpole
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = '#509050';
      ctx.fillRect(7, 0, 2, 16);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(7, 0, 1, 16);
      this.cache.set('tile_flagpole', canvas);
    }
    // Flagpole Top
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = '#509050';
      ctx.fillRect(7, 4, 2, 12);
      ctx.fillStyle = '#00A800';
      ctx.beginPath();
      ctx.arc(8, 4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#88D800';
      ctx.beginPath();
      ctx.arc(7, 3, 2, 0, Math.PI * 2);
      ctx.fill();
      this.cache.set('tile_flagpole_top', canvas);
    }
    // Flag (Green triangle with NES logo)
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = '#00A800';
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(0, 8);
      ctx.lineTo(15, 16);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(10, 8, 3, 0, Math.PI * 2);
      ctx.fill();
      this.cache.set('sprite_flag', canvas);
    }

    // 10. Castle Elements
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.CASTLE_BRICK;
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#5A2A08';
      ctx.strokeRect(0, 0, 16, 8);
      ctx.strokeRect(0, 8, 16, 8);
      this.cache.set('tile_castle_wall', canvas);
    }
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.CASTLE_DOOR;
      ctx.fillRect(0, 0, 16, 16);
      this.cache.set('tile_castle_door', canvas);
    }
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.CASTLE_BRICK;
      ctx.fillRect(2, 4, 12, 12);
      this.cache.set('tile_castle_crenel', canvas);
    }
  }

  // --- MARIO SPRITES ---
  private drawPixelGrid(
    ctx: CanvasRenderingContext2D, 
    pixels: string[][], 
    colors: Record<string, string>, 
    scaleX = 1, 
    scaleY = 1,
    offsetX = 0,
    offsetY = 0
  ) {
    for (let r = 0; r < pixels.length; r++) {
      for (let c = 0; c < pixels[r].length; c++) {
        const key = pixels[r][c];
        if (key && colors[key]) {
          ctx.fillStyle = colors[key];
          ctx.fillRect(offsetX + c * scaleX, offsetY + r * scaleY, scaleX, scaleY);
        }
      }
    }
  }

  private generateMarioSprites() {
    // 16x16 Pixel Art Matrices for Small Mario
    // R: Red, S: Skin, B: Brown/Blue
    const marioIdleSmall = [
      '    RRRRR       ',
      '    RRRRRRRRR   ',
      '    BBBSSBS     ',
      '   BSBSSSBS     ',
      '   BSBBSSSSS    ',
      '   BBSBSSSSS    ',
      '    BSSSSSSS    ',
      '     SSSSSSS    ',
      '    RRRRRRR     ',
      '   RRRBRRRRR    ',
      '  RRRRBBRRRRR   ',
      '  SSRBBBBRRSS   ',
      '  SSSSBBBSSSS   ',
      '  SS BBBBB SS   ',
      '     BB BB      ',
      '    BBB BBB     ',
    ];

    const marioRun1Small = [
      '    RRRRR       ',
      '    RRRRRRRRR   ',
      '    BBBSSBS     ',
      '   BSBSSSBS     ',
      '   BSBBSSSSS    ',
      '   BBSBSSSSS    ',
      '    BSSSSSSS    ',
      '     SSSSSSS    ',
      '    RRRBR       ',
      '   RRRRBBR      ',
      '  RRRRRBBBR     ',
      '  SSRBBBBRRSS   ',
      '  SSSSBBBSSSS   ',
      '  SS BBBBB      ',
      '     BBB        ',
      '    BBBB        ',
    ];

    const marioRun2Small = [
      '    RRRRR       ',
      '    RRRRRRRRR   ',
      '    BBBSSBS     ',
      '   BSBSSSBS     ',
      '   BSBBSSSSS    ',
      '   BBSBSSSSS    ',
      '    BSSSSSSS    ',
      '     SSSSSSS    ',
      '    RRRBRRR     ',
      '   RRRBBBRRR    ',
      '  RRRRBBBBRRR   ',
      '  SSR BBB  SS   ',
      '  SS  BBB   SS  ',
      '      BBBB      ',
      '     BBB BBB    ',
      '    BBB   BBB   ',
    ];

    const marioJumpSmall = [
      '    RRRRR       ',
      '    RRRRRRRRR   ',
      '    BBBSSBS     ',
      '   BSBSSSBS     ',
      '   BSBBSSSSS    ',
      '   BBSBSSSSS    ',
      '    BSSSSSSS    ',
      '   SSSSSSSSS    ',
      '  SS RRRRR  SS  ',
      '  SSRRBRRRRSS   ',
      '   RRRBBBRRR    ',
      '   RRBBBBBBR    ',
      '   BBBBBBBB     ',
      '  BBBB  BBBB    ',
      '  BBB    BBB    ',
      ' BBB      BBB   ',
    ];

    const marioSkidSmall = [
      '    RRRRR       ',
      '    RRRRRRRRR   ',
      '    BBBSSBS     ',
      '   BSBSSSBS     ',
      '   BSBBSSSSS    ',
      '   BBSBSSSSS    ',
      '    BSSSSSSS    ',
      '     SSSSSSS    ',
      '    RRRRBRRR    ',
      '   RRRRBBBRRR   ',
      '   RRRBBBBBRR   ',
      '  SSR BBB  SS   ',
      '  SSSSBBB       ',
      '  SS BBBBB      ',
      '    BBBBBB      ',
      '   BBBB  BBB    ',
    ];

    const marioDieSmall = [
      '    RRRRR       ',
      '    RRRRRRRRR   ',
      '    BBBSSBS     ',
      '   BSBSSSBS     ',
      '   BSBBSSSSS    ',
      '   BBSBSSSSS    ',
      '    BSSSSSSS    ',
      '   SSSSSSSSSS   ',
      '  RRRRRRRRRRRR  ',
      ' RRRRRBBBRRRRRR ',
      ' RRR BBBBB RRR  ',
      ' SS  BBBBB  SS  ',
      '     BBBBB      ',
      '    BBBBBBB     ',
      '    BBB BBB     ',
      '   BBB   BBB    ',
    ];

    const smallColorMap: Record<MarioPower, Record<string, string>> = {
      small: {
        R: PALETTE.MARIO_RED,
        S: PALETTE.MARIO_SKIN,
        B: PALETTE.MARIO_BROWN,
      },
      super: {
        R: PALETTE.MARIO_RED,
        S: PALETTE.MARIO_SKIN,
        B: PALETTE.MARIO_BLUE,
      },
      fire: {
        R: PALETTE.FIRE_WHITE,
        S: PALETTE.MARIO_SKIN,
        B: PALETTE.FIRE_RED,
      },
    };

    const smallPoses: Record<string, string[]> = {
      idle: marioIdleSmall,
      run1: marioRun1Small,
      run2: marioRun2Small,
      jump: marioJumpSmall,
      skid: marioSkidSmall,
      die: marioDieSmall,
      flag: marioJumpSmall,
    };

    // Render Small Mario variants
    (['small', 'super', 'fire'] as MarioPower[]).forEach(power => {
      Object.entries(smallPoses).forEach(([pose, matrix]) => {
        const [canvas, ctx] = this.createBuffer(16, 16);
        this.drawPixelGrid(ctx, matrix.map(r => r.split('')), smallColorMap[power]);
        this.cache.set(`mario_small_${power}_${pose}`, canvas);
      });
    });

    // Super Mario (16x32)
    // We compose head (16x16) + tall body (16x16)
    const superHead = [
      '     RRRRRR     ',
      '    RRRRRRRRRR  ',
      '    BBBSSBS     ',
      '   BSBSSSBS     ',
      '   BSBBSSSSS    ',
      '   BBSBSSSSS    ',
      '    BSSSSSSS    ',
      '     SSSSSSS    ',
      '    RRRRRRRR    ',
      '   RRRRRRRRRR   ',
      '  RRRRRRRRRRRR  ',
      '  RRRBRRRRBRRR  ',
      '  RRRBRRRRBRRR  ',
      '  RRRBBBBBRRRR  ',
      '  SS RBBBBR SS  ',
      '  SS RRRRRR SS  ',
    ];

    const superLegsWalk1 = [
      '    BBBBBBBB    ',
      '   BBBBBBBBBB   ',
      '   BBBBBBBBBB   ',
      '  SSBBBBBBBBSS  ',
      '  SSSSBBBBSSSS  ',
      '  SSSSBBBBSSSS  ',
      '   SSBBBBBBSS   ',
      '     BBBBBB     ',
      '     BB  BB     ',
      '    BBB  BBB    ',
      '    BBB  BBB    ',
      '   BBBB  BBBB   ',
      '   BBBB  BBBB   ',
      '   BBBB  BBBB   ',
      '   BBBB         ',
      '  BBBBB         ',
    ];

    const superLegsWalk2 = [
      '    BBBBBBBB    ',
      '   BBBBBBBBBB   ',
      '   BBBBBBBBBB   ',
      '  SSBBBBBBBBSS  ',
      '  SSSSBBBBSSSS  ',
      '  SSSSBBBBSSSS  ',
      '   SSBBBBBBSS   ',
      '     BBBBBB     ',
      '     BB  BB     ',
      '    BBB  BBB    ',
      '    BBB  BBB    ',
      '   BBBB  BBBB   ',
      '   BBBB  BBBB   ',
      '  BBBBB  BBBBB  ',
      ' BBBBB    BBBBB ',
      'BBBB        BBBB',
    ];

    const superLegsJump = [
      '    BBBBBBBB    ',
      '   BBBBBBBBBB   ',
      '   BBBBBBBBBB   ',
      '  SSBBBBBBBBSS  ',
      '  SSSSBBBBSSSS  ',
      '  SSSSBBBBSSSS  ',
      '   SSBBBBBBSS   ',
      '     BBBBBB     ',
      '    BBBBBBBB    ',
      '   BBBB  BBBB   ',
      '  BBBB    BBBB  ',
      '  BBBB    BBBB  ',
      '  BBB      BBB  ',
      '  BBB      BBB  ',
      ' BBBB      BBBB ',
      'BBBB        BBBB',
    ];

    const superCrouch = [
      '                ',
      '                ',
      '                ',
      '                ',
      '                ',
      '                ',
      '                ',
      '                ',
      '     RRRRRR     ',
      '    RRRRRRRRRR  ',
      '    BBBSSBS     ',
      '   BSBSSSBS     ',
      '   BSBBSSSSS    ',
      '   BBSBSSSSS    ',
      '    BSSSSSSS    ',
      '   SSSSSSSSSS   ',
      '  RRRRRRRRRRRR  ',
      '  RRRBBBBBBRRR  ',
      '  SS BBBBBB SS  ',
      '  SS BBBBBB SS  ',
      '   SSBBBBBBSS   ',
      '    BBBBBBBB    ',
      '   BBBBBBBBBB   ',
      '  BBBBBBBBBBBB  ',
      '  BBBBBBBBBBBB  ',
      '  BBBBBBBBBBBB  ',
      '  BBBBBBBBBBBB  ',
      '  BBBBBBBBBBBB  ',
      '  BBBB    BBBB  ',
      '  BBBB    BBBB  ',
      '  BBBB    BBBB  ',
      ' BBBBBB  BBBBBB ',
    ];

    const superPoses: Record<string, { top: string[]; bottom?: string[]; full?: string[] }> = {
      idle: { top: superHead, bottom: superLegsWalk1 },
      run1: { top: superHead, bottom: superLegsWalk1 },
      run2: { top: superHead, bottom: superLegsWalk2 },
      jump: { top: superHead, bottom: superLegsJump },
      skid: { top: superHead, bottom: superLegsWalk2 },
      crouch: { top: [], full: superCrouch },
      flag: { top: superHead, bottom: superLegsJump },
    };

    (['super', 'fire'] as MarioPower[]).forEach(power => {
      Object.entries(superPoses).forEach(([pose, parts]) => {
        const [canvas, ctx] = this.createBuffer(16, 32);
        if (parts.full) {
          this.drawPixelGrid(ctx, parts.full.map(r => r.split('')), smallColorMap[power]);
        } else {
          this.drawPixelGrid(ctx, parts.top.map(r => r.split('')), smallColorMap[power], 1, 1, 0, 0);
          if (parts.bottom) {
            this.drawPixelGrid(ctx, parts.bottom.map(r => r.split('')), smallColorMap[power], 1, 1, 0, 16);
          }
        }
        this.cache.set(`mario_super_${power}_${pose}`, canvas);
      });
    });
  }

  // --- ENEMIES ---
  private generateEnemySprites() {
    // 1. Goomba Walk 1
    const goomba1 = [
      '     BBBBBB     ',
      '    BBBBBBBB    ',
      '   BBBBBBBBBB   ',
      '  BBBBBBBBBBBB  ',
      '  BBWWBSSBWWBB  ',
      '  BBWWBSSBWWBB  ',
      '  BBWWBSSBWWBB  ',
      '  BBBSSSSSSBBB  ',
      '   SSSSSSSSSS   ',
      '   SSSSSSSSSS   ',
      '   SSSSSSSSSS   ',
      '    SSSSSSSS    ',
      '    FF    FF    ',
      '   FFF    FFF   ',
      '  FFFF    FFFF  ',
      '  FFFF    FFFF  ',
    ];

    // Goomba Walk 2
    const goomba2 = [
      '     BBBBBB     ',
      '    BBBBBBBB    ',
      '   BBBBBBBBBB   ',
      '  BBBBBBBBBBBB  ',
      '  BBWWBSSBWWBB  ',
      '  BBWWBSSBWWBB  ',
      '  BBWWBSSBWWBB  ',
      '  BBBSSSSSSBBB  ',
      '   SSSSSSSSSS   ',
      '   SSSSSSSSSS   ',
      '   SSSSSSSSSS   ',
      '    SSSSSSSS    ',
      '     FF  FF     ',
      '    FFF  FFF    ',
      '   FFFF  FFFF   ',
      '   FFFF  FFFF   ',
    ];

    // Goomba Flat / Stomped
    const goombaFlat = [
      '                ',
      '                ',
      '                ',
      '                ',
      '                ',
      '                ',
      '                ',
      '                ',
      '                ',
      '                ',
      '    BBBBBBBB    ',
      '  BBBWWBSSBWWBB ',
      '  BBBSSSSSSSSBB ',
      '  SSSSSSSSSSSS  ',
      ' FFFFFFFFFFFFFF ',
      ' FFFFFFFFFFFFFF ',
    ];

    const goombaColors = {
      B: PALETTE.GOOMBA_MAIN,
      S: PALETTE.GOOMBA_SKIN,
      W: PALETTE.WHITE,
      F: PALETTE.GOOMBA_FEET,
    };

    [
      ['goomba_walk1', goomba1],
      ['goomba_walk2', goomba2],
      ['goomba_flat', goombaFlat],
    ].forEach(([name, matrix]) => {
      const [canvas, ctx] = this.createBuffer(16, 16);
      this.drawPixelGrid(ctx, (matrix as string[]).map(r => r.split('')), goombaColors);
      this.cache.set(name as string, canvas);
    });

    // 2. Koopa Troopa (16x24)
    const koopaWalk1 = [
      '     SSSS       ',
      '    SSSSSS      ',
      '    SWBSSS      ',
      '    SWBSSS      ',
      '    SSSSSS      ',
      '     SSSS       ',
      '    GGGGGG      ',
      '   GGGGGGGG     ',
      '  GGWGGGGWGG    ',
      '  GGWGGGGWGG    ',
      '  GGWGGGGWGG    ',
      '  GGGGGGGGGG    ',
      '  GGGGGGGGGG    ',
      '  GGGGGGGGGG    ',
      '   GGGGGGGG     ',
      '   YYYYYYYY     ',
      '   YYYYYYYY     ',
      '    YYYYYY      ',
      '     FF FF      ',
      '    FFF FFF     ',
      '   FFFF FFFF    ',
      '   FFFF FFFF    ',
      '   FFFF FFFF    ',
      '  FFFFF FFFFF   ',
    ];

    const koopaWalk2 = [
      '     SSSS       ',
      '    SSSSSS      ',
      '    SWBSSS      ',
      '    SWBSSS      ',
      '    SSSSSS      ',
      '     SSSS       ',
      '    GGGGGG      ',
      '   GGGGGGGG     ',
      '  GGWGGGGWGG    ',
      '  GGWGGGGWGG    ',
      '  GGWGGGGWGG    ',
      '  GGGGGGGGGG    ',
      '  GGGGGGGGGG    ',
      '  GGGGGGGGGG    ',
      '   GGGGGGGG     ',
      '   YYYYYYYY     ',
      '   YYYYYYYY     ',
      '    YYYYYY      ',
      '    FF   FF     ',
      '   FFF   FFF    ',
      '  FFFF   FFFF   ',
      '  FFFF   FFFF   ',
      '  FFFF   FFFF   ',
      ' FFFFF   FFFFF  ',
    ];

    const koopaColors = {
      S: PALETTE.KOOPA_SKIN,
      W: PALETTE.WHITE,
      B: PALETTE.BLACK,
      G: PALETTE.KOOPA_SHELL,
      Y: PALETTE.KOOPA_BELLY,
      F: '#E58000',
    };

    [
      ['koopa_walk1', koopaWalk1],
      ['koopa_walk2', koopaWalk2],
    ].forEach(([name, matrix]) => {
      const [canvas, ctx] = this.createBuffer(16, 24);
      this.drawPixelGrid(ctx, (matrix as string[]).map(r => r.split('')), koopaColors);
      this.cache.set(name as string, canvas);
    });

    // Koopa Shell (16x16)
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.KOOPA_SHELL;
      ctx.beginPath();
      ctx.arc(8, 9, 7, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(1, 9, 14, 5);
      ctx.fillStyle = PALETTE.WHITE;
      ctx.fillRect(4, 5, 2, 4);
      ctx.fillRect(10, 5, 2, 4);
      ctx.fillStyle = PALETTE.KOOPA_BELLY;
      ctx.fillRect(2, 13, 12, 2);
      ctx.fillStyle = PALETTE.BLACK;
      ctx.strokeRect(1, 3, 14, 12);
      this.cache.set('koopa_shell', canvas);
    }

    // 3. Piranha Plant (16x24)
    {
      const [canvas, ctx] = this.createBuffer(16, 24);
      // Head
      ctx.fillStyle = PALETTE.PIRANHA_RED;
      ctx.beginPath();
      ctx.arc(8, 8, 7, 0, Math.PI * 2);
      ctx.fill();
      // White Polka Dots
      ctx.fillStyle = PALETTE.WHITE;
      ctx.fillRect(4, 4, 2, 2);
      ctx.fillRect(10, 4, 2, 2);
      ctx.fillRect(6, 9, 2, 2);
      // White Lips / Teeth
      ctx.fillStyle = PALETTE.PIRANHA_LIPS;
      ctx.fillRect(2, 6, 4, 4);
      ctx.fillRect(10, 6, 4, 4);
      // Stem
      ctx.fillStyle = PALETTE.PIRANHA_STEM;
      ctx.fillRect(7, 15, 2, 9);
      // Leaves
      ctx.fillRect(4, 17, 3, 3);
      ctx.fillRect(9, 17, 3, 3);
      this.cache.set('piranha_plant', canvas);
    }
  }

  // --- ITEMS ---
  private generateItemSprites() {
    // 1. Super Mushroom (16x16)
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      // Cap
      ctx.fillStyle = PALETTE.MUSHROOM_RED;
      ctx.beginPath();
      ctx.arc(8, 8, 7, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(1, 8, 14, 2);
      // White spots
      ctx.fillStyle = PALETTE.MUSHROOM_WHITE;
      ctx.fillRect(6, 3, 4, 4);
      ctx.fillRect(2, 6, 2, 3);
      ctx.fillRect(12, 6, 2, 3);
      // Stem
      ctx.fillStyle = PALETTE.MUSHROOM_STEM;
      ctx.fillRect(4, 9, 8, 6);
      // Eyes
      ctx.fillStyle = PALETTE.BLACK;
      ctx.fillRect(5, 10, 1, 3);
      ctx.fillRect(10, 10, 1, 3);
      this.cache.set('item_mushroom', canvas);
    }

    // 2. 1-UP Mushroom (Green)
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.ONEUP_GREEN;
      ctx.beginPath();
      ctx.arc(8, 8, 7, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(1, 8, 14, 2);
      ctx.fillStyle = PALETTE.MUSHROOM_WHITE;
      ctx.fillRect(6, 3, 4, 4);
      ctx.fillRect(2, 6, 2, 3);
      ctx.fillRect(12, 6, 2, 3);
      ctx.fillStyle = PALETTE.MUSHROOM_STEM;
      ctx.fillRect(4, 9, 8, 6);
      ctx.fillStyle = PALETTE.BLACK;
      ctx.fillRect(5, 10, 1, 3);
      ctx.fillRect(10, 10, 1, 3);
      this.cache.set('item_oneup', canvas);
    }

    // 3. Fire Flower (16x16)
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      // Outer red petals
      ctx.fillStyle = PALETTE.MARIO_RED;
      ctx.fillRect(3, 1, 10, 10);
      // Inner yellow
      ctx.fillStyle = PALETTE.COIN_GOLD;
      ctx.fillRect(4, 2, 8, 8);
      // Center white
      ctx.fillStyle = PALETTE.WHITE;
      ctx.fillRect(6, 4, 4, 4);
      // Eyes
      ctx.fillStyle = PALETTE.BLACK;
      ctx.fillRect(6, 5, 1, 2);
      ctx.fillRect(9, 5, 1, 2);
      // Stem & Leaves
      ctx.fillStyle = PALETTE.PIPE_MAIN;
      ctx.fillRect(7, 10, 2, 6);
      ctx.fillRect(4, 12, 3, 2);
      ctx.fillRect(9, 12, 3, 2);
      this.cache.set('item_fireflower', canvas);
    }

    // 4. Starman (16x16)
    {
      const [canvas, ctx] = this.createBuffer(16, 16);
      ctx.fillStyle = PALETTE.COIN_GOLD;
      ctx.beginPath();
      ctx.moveTo(8, 1);
      ctx.lineTo(10, 6);
      ctx.lineTo(15, 6);
      ctx.lineTo(11, 10);
      ctx.lineTo(13, 15);
      ctx.lineTo(8, 12);
      ctx.lineTo(3, 15);
      ctx.lineTo(5, 10);
      ctx.lineTo(1, 6);
      ctx.lineTo(6, 6);
      ctx.closePath();
      ctx.fill();
      // Eyes
      ctx.fillStyle = PALETTE.BLACK;
      ctx.fillRect(6, 7, 1, 2);
      ctx.fillRect(9, 7, 1, 2);
      this.cache.set('item_star', canvas);
    }

    // 5. Coins (4 spinning animation frames)
    const coinWidths = [10, 6, 3, 6];
    coinWidths.forEach((w, idx) => {
      const [canvas, ctx] = this.createBuffer(16, 16);
      const x = (16 - w) / 2;
      ctx.fillStyle = PALETTE.COIN_GOLD;
      ctx.fillRect(x, 2, w, 12);
      ctx.fillStyle = PALETTE.COIN_LIGHT;
      ctx.fillRect(x + 1, 3, Math.max(1, w - 2), 10);
      ctx.fillStyle = PALETTE.COIN_DARK;
      ctx.strokeRect(x + 0.5, 2.5, w - 1, 11);
      this.cache.set(`item_coin_${idx}`, canvas);
    });

    // 6. Fireball (8x8)
    {
      const [canvas, ctx] = this.createBuffer(8, 8);
      ctx.fillStyle = PALETTE.MARIO_RED;
      ctx.beginPath();
      ctx.arc(4, 4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PALETTE.COIN_GOLD;
      ctx.beginPath();
      ctx.arc(3, 3, 1.5, 0, Math.PI * 2);
      ctx.fill();
      this.cache.set('fireball', canvas);
    }
  }

  // --- SCENERY ---
  private generateScenerySprites() {
    // 1. Cloud (Single 32x24)
    {
      const [canvas, ctx] = this.createBuffer(32, 24);
      ctx.fillStyle = PALETTE.WHITE;
      ctx.beginPath();
      ctx.arc(10, 14, 8, 0, Math.PI * 2);
      ctx.arc(18, 10, 10, 0, Math.PI * 2);
      ctx.arc(24, 14, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(4, 14, 24, 8);
      // Soft blue outline
      ctx.strokeStyle = '#B0D0FF';
      ctx.lineWidth = 1;
      ctx.stroke();
      this.cache.set('scenery_cloud', canvas);
    }

    // 2. Bush (Single 32x16)
    {
      const [canvas, ctx] = this.createBuffer(32, 16);
      ctx.fillStyle = PALETTE.PIPE_MAIN;
      ctx.beginPath();
      ctx.arc(10, 10, 6, 0, Math.PI * 2);
      ctx.arc(16, 7, 7, 0, Math.PI * 2);
      ctx.arc(22, 10, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(4, 10, 24, 6);
      // Highlights
      ctx.fillStyle = PALETTE.PIPE_LIGHT;
      ctx.beginPath();
      ctx.arc(15, 6, 3, 0, Math.PI * 2);
      ctx.fill();
      this.cache.set('scenery_bush', canvas);
    }

    // 3. Hill (Small 32x24)
    {
      const [canvas, ctx] = this.createBuffer(32, 24);
      ctx.fillStyle = PALETTE.PIPE_MAIN;
      ctx.beginPath();
      ctx.moveTo(16, 2);
      ctx.lineTo(31, 23);
      ctx.lineTo(1, 23);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = PALETTE.PIPE_BORDER;
      ctx.stroke();
      // Polka dot highlights
      ctx.fillStyle = PALETTE.PIPE_LIGHT;
      ctx.fillRect(14, 6, 2, 2);
      ctx.fillRect(10, 12, 2, 2);
      ctx.fillRect(20, 14, 2, 2);
      ctx.fillRect(8, 18, 2, 2);
      ctx.fillRect(24, 18, 2, 2);
      this.cache.set('scenery_hill', canvas);
    }
  }

  // --- PUBLIC RENDER METHOD ---
  public draw(
    ctx: CanvasRenderingContext2D, 
    key: string, 
    x: number, 
    y: number, 
    flipX: boolean = false,
    alpha: number = 1
  ) {
    if (!this.initialized) this.init();
    const canvas = this.cache.get(key);
    if (!canvas) return;

    ctx.save();
    if (alpha < 1) ctx.globalAlpha = alpha;

    if (flipX) {
      ctx.translate(Math.round(x) + canvas.width, Math.round(y));
      ctx.scale(-1, 1);
      ctx.drawImage(canvas, 0, 0);
    } else {
      ctx.drawImage(canvas, Math.round(x), Math.round(y));
    }
    ctx.restore();
  }

  public getSpriteCanvas(key: string): HTMLCanvasElement | undefined {
    return this.cache.get(key);
  }
}

export const spriteEngine = new SpriteEngine();
