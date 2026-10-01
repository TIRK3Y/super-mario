'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameEngine } from '@/engine/gameEngine';
import { GameCanvas } from '@/components/GameCanvas';
import { GameUI } from '@/components/GameUI';
import { VirtualGamepad } from '@/components/VirtualGamepad';
import { InstructionsModal } from '@/components/InstructionsModal';
import { HighScoresModal } from '@/components/HighScoresModal';
import { GameStatus, InputState } from '@/types/game';
import { soundEngine } from '@/audio/soundEngine';
import { Music, Zap, Award } from 'lucide-react';

export default function SuperMarioPage() {
  const [engine] = useState<GameEngine>(() => new GameEngine('world_1_1'));
  
  // Game reactive state
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [world, setWorld] = useState<string>('1-1');
  const [time, setTime] = useState<number>(400);
  const [lives, setLives] = useState<number>(3);
  const [status, setStatus] = useState<GameStatus>('menu');
  const [currentLevelId, setCurrentLevelId] = useState<string>('world_1_1');

  // UI state
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [enableCrt, setEnableCrt] = useState<boolean>(true);
  const [showGamepad, setShowGamepad] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);

  // Virtual controller state
  const [virtualInput, setVirtualInput] = useState<InputState>({
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    run: false,
  });

  const mainContainerRef = useRef<HTMLDivElement | null>(null);

  // Bind engine stats listener
  useEffect(() => {
    engine.onStatsChange = (stats) => {
      setScore(stats.score);
      setCoins(stats.coins);
      setWorld(stats.world);
      setTime(stats.time);
      setLives(stats.lives);
      setStatus(stats.status);
    };

    // Auto-detect mobile devices to display gamepad by default
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setShowGamepad(true);
    }
  }, [engine]);

  // Actions
  const handleVirtualInputChange = useCallback((key: keyof InputState, active: boolean) => {
    setVirtualInput(prev => ({ ...prev, [key]: active }));
  }, []);

  const handleLevelSelect = (levelId: string) => {
    setCurrentLevelId(levelId);
    engine.selectLevel(levelId);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMute(nextMuted);
  };

  const handleToggleCrt = () => {
    setEnableCrt(prev => !prev);
  };

  const handleToggleGamepad = () => {
    setShowGamepad(prev => !prev);
  };

  const handlePause = () => {
    engine.pause();
  };

  const handleRestart = () => {
    engine.restartGame();
  };

  const handleStart = () => {
    engine.start();
  };

  const handleNextLevel = () => {
    engine.advanceToNextLevel();
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mainContainerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <main 
      ref={mainContainerRef}
      className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-between p-3 sm:p-6 selection:bg-red-500 selection:text-white"
    >
      {/* Top Header */}
      <header className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/40 border border-red-400">
            <span className="font-mono font-black text-xl text-white">M</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-mono tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-400 to-red-600">
              SUPER MARIO BROS.
            </h1>
            <p className="text-xs text-neutral-400 font-mono">
              Next.js 14 • TypeScript • Tailwind CSS • Web Audio Synthesizer
            </p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
            <Zap className="w-3 h-3 text-yellow-400" /> 60 FPS
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
            <Music className="w-3 h-3 text-green-400" /> Chiptune Audio
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
            <Award className="w-3 h-3 text-red-400" /> 3 Worlds
          </span>
        </div>
      </header>

      {/* Main Game Screen & Console Frame */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* HUD & Utilities */}
        <GameUI
          score={score}
          coins={coins}
          world={world}
          time={time}
          lives={lives}
          status={status}
          currentLevelId={currentLevelId}
          isMuted={isMuted}
          enableCrt={enableCrt}
          showGamepad={showGamepad}
          onLevelSelect={handleLevelSelect}
          onToggleMute={handleToggleMute}
          onToggleCrt={handleToggleCrt}
          onToggleGamepad={handleToggleGamepad}
          onOpenInstructions={() => setShowInstructions(true)}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onPause={handlePause}
          onRestart={handleRestart}
          onStart={handleStart}
          onNextLevel={handleNextLevel}
          onToggleFullscreen={handleToggleFullscreen}
        />

        {/* Canvas Display Viewport */}
        <div className="relative w-full arcade-glow rounded-xl">
          <GameCanvas
            engine={engine}
            enableCrt={enableCrt}
            virtualInput={virtualInput}
          />
        </div>

        {/* Virtual Gamepad for Mobile or Touch */}
        {showGamepad && (
          <div className="w-full mt-2 animate-fade-in">
            <VirtualGamepad
              onInputChange={handleVirtualInputChange}
              onPause={handlePause}
              onRestart={handleRestart}
            />
          </div>
        )}
      </div>

      {/* Footer Info & Quick Key Reference */}
      <footer className="w-full max-w-4xl mx-auto mt-6 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 font-mono">
        <div className="flex items-center gap-2">
          <span>Controls:</span>
          <span className="text-neutral-300 font-bold bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">Arrows / WASD</span>
          <span>Jump:</span>
          <span className="text-neutral-300 font-bold bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">Space / Z</span>
          <span>Dash/Fire:</span>
          <span className="text-neutral-300 font-bold bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">Shift / X</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowInstructions(true)}
            className="text-neutral-400 hover:text-white transition-colors underline"
          >
            Manual & Tips
          </button>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="text-neutral-400 hover:text-yellow-400 transition-colors underline"
          >
            High Scores
          </button>
        </div>
      </footer>

      {/* Modals */}
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      <HighScoresModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        currentScore={score}
        currentCoins={coins}
        currentWorld={world}
      />
    </main>
  );
}
