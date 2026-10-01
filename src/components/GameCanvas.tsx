'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { GameEngine } from '@/engine/gameEngine';
import { InputState } from '@/types/game';
import { soundEngine } from '@/audio/soundEngine';

interface GameCanvasProps {
  engine: GameEngine;
  enableCrt: boolean;
  virtualInput: InputState;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  engine,
  enableCrt,
  virtualInput,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const animationFrameIdRef = useRef<number | null>(null);

  // Key event handlers
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default scroll actions for game keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }

    keysRef.current[e.code] = true;

    // Hotkeys
    if (e.code === 'KeyP' || e.code === 'Escape') {
      engine.pause();
    } else if (e.code === 'KeyM') {
      soundEngine.setMute(!soundEngine.getMuted());
    } else if (e.code === 'KeyR') {
      engine.restartGame();
    } else if (e.code === 'KeyX' || e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyJ') {
      engine.spawnFireball();
    }
  }, [engine]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current[e.code] = false;
  }, []);

  // Listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Main 60fps Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;

      const keys = keysRef.current;
      // Merge physical keyboard and virtual gamepad inputs
      const input: InputState = {
        left: Boolean(keys['ArrowLeft'] || keys['KeyA'] || virtualInput.left),
        right: Boolean(keys['ArrowRight'] || keys['KeyD'] || virtualInput.right),
        up: Boolean(keys['ArrowUp'] || keys['KeyW'] || virtualInput.up),
        down: Boolean(keys['ArrowDown'] || keys['KeyS'] || virtualInput.down),
        jump: Boolean(keys['Space'] || keys['ArrowUp'] || keys['KeyZ'] || keys['KeyK'] || virtualInput.jump),
        run: Boolean(keys['ShiftLeft'] || keys['ShiftRight'] || keys['KeyX'] || keys['KeyJ'] || virtualInput.run),
      };

      // Engine update & render
      engine.update(input);
      engine.render(ctx);

      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    animationFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [engine, virtualInput]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-[256/240] max-w-[800px] mx-auto rounded-lg overflow-hidden shadow-2xl bg-black border-4 border-neutral-800 transition-all ${
        enableCrt ? 'crt-monitor' : ''
      }`}
    >
      <canvas
        ref={canvasRef}
        width={256}
        height={240}
        className="w-full h-full block pixelated"
        tabIndex={0}
      />

      {/* CRT Scanline Overlay Effect */}
      {enableCrt && (
        <div className="pointer-events-none absolute inset-0 crt-overlay" />
      )}
    </div>
  );
};
