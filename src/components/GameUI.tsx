'use client';

import React from 'react';
import { GameStatus } from '@/types/game';
import { 
  Volume2, 
  VolumeX, 
  Tv, 
  HelpCircle, 
  Trophy, 
  RotateCcw, 
  Play, 
  Pause as PauseIcon,
  Maximize,
  Gamepad2
} from 'lucide-react';

interface GameUIProps {
  score: number;
  coins: number;
  world: string;
  time: number;
  lives: number;
  status: GameStatus;
  currentLevelId: string;
  isMuted: boolean;
  enableCrt: boolean;
  showGamepad: boolean;
  onLevelSelect: (levelId: string) => void;
  onToggleMute: () => void;
  onToggleCrt: () => void;
  onToggleGamepad: () => void;
  onOpenInstructions: () => void;
  onOpenLeaderboard: () => void;
  onPause: () => void;
  onRestart: () => void;
  onStart: () => void;
  onNextLevel: () => void;
  onToggleFullscreen: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({
  score,
  coins,
  world,
  time,
  lives,
  status,
  currentLevelId,
  isMuted,
  enableCrt,
  showGamepad,
  onLevelSelect,
  onToggleMute,
  onToggleCrt,
  onToggleGamepad,
  onOpenInstructions,
  onOpenLeaderboard,
  onPause,
  onRestart,
  onStart,
  onNextLevel,
  onToggleFullscreen,
}) => {
  // Format numbers to zero-padded strings
  const formattedScore = String(score).padStart(6, '0');
  const formattedCoins = String(coins).padStart(2, '0');
  const formattedTime = String(time).padStart(3, '0');

  return (
    <div className="w-full max-w-[800px] mx-auto mb-3">
      {/* Top Navbar / Utility Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-neutral-900 border border-neutral-800 rounded-xl shadow-md mb-3 text-sm text-neutral-300">
        
        {/* World / Level Selector */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold">STAGE:</span>
          <select
            value={currentLevelId}
            onChange={(e) => onLevelSelect(e.target.value)}
            className="bg-neutral-800 text-white font-mono text-xs px-2.5 py-1.5 rounded border border-neutral-700 hover:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="world_1_1">World 1-1 (Overworld)</option>
            <option value="world_1_2">World 1-2 (Underground)</option>
            <option value="world_1_3">World 1-3 (Treetops)</option>
          </select>
        </div>

        {/* Action Tool Buttons */}
        <div className="flex items-center gap-2">
          {/* Pause / Resume */}
          <button
            onClick={onPause}
            title={status === 'paused' ? 'Resume' : 'Pause'}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
          >
            {status === 'paused' ? <Play className="w-4 h-4 text-green-400" /> : <PauseIcon className="w-4 h-4" />}
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            title="Restart Level"
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-yellow-400" />
          </button>

          {/* Audio Mute */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
          </button>

          {/* CRT Monitor Overlay */}
          <button
            onClick={onToggleCrt}
            title="Toggle CRT Retro Filter"
            className={`p-1.5 rounded-lg border transition-colors ${
              enableCrt 
                ? 'bg-amber-950/60 border-amber-600 text-amber-300' 
                : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Toggle Virtual Gamepad */}
          <button
            onClick={onToggleGamepad}
            title="Toggle On-Screen Gamepad"
            className={`p-1.5 rounded-lg border transition-colors ${
              showGamepad 
                ? 'bg-red-950/60 border-red-600 text-red-300' 
                : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
          </button>

          {/* How to Play */}
          <button
            onClick={onOpenInstructions}
            title="How to Play"
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-blue-400" />
          </button>

          {/* Leaderboard */}
          <button
            onClick={onOpenLeaderboard}
            title="Hall of Fame High Scores"
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={onToggleFullscreen}
            title="Fullscreen Mode"
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
          >
            <Maximize className="w-4 h-4 text-neutral-300" />
          </button>
        </div>
      </div>

      {/* Classic NES HUD Top Bar */}
      <div className="w-full bg-black/90 p-4 rounded-t-xl border-t-2 border-x-2 border-neutral-700 flex items-center justify-between font-mono font-bold text-white tracking-widest text-xs sm:text-sm select-none shadow-md">
        
        {/* Mario & Score */}
        <div className="flex flex-col items-center">
          <span className="text-white drop-shadow">MARIO</span>
          <span className="text-yellow-300 tracking-wider font-extrabold">{formattedScore}</span>
        </div>

        {/* Coins */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-4 bg-yellow-400 rounded-sm inline-block animate-pulse border border-yellow-200" />
          <span className="text-white">x</span>
          <span className="text-yellow-300 font-extrabold">{formattedCoins}</span>
        </div>

        {/* World */}
        <div className="flex flex-col items-center">
          <span className="text-white drop-shadow">WORLD</span>
          <span className="text-white font-extrabold">{world}</span>
        </div>

        {/* Time */}
        <div className="flex flex-col items-center">
          <span className="text-white drop-shadow">TIME</span>
          <span className={`font-extrabold ${time < 50 ? 'text-red-500 animate-bounce' : 'text-white'}`}>
            {formattedTime}
          </span>
        </div>

        {/* Lives */}
        <div className="flex items-center gap-1.5 bg-neutral-800/80 px-2 py-1 rounded border border-neutral-700">
          <span className="text-red-500 text-base leading-none">❤️</span>
          <span className="text-white text-xs">x</span>
          <span className="text-red-400 font-bold">{lives}</span>
        </div>
      </div>

      {/* Overlays for Game States */}
      {status === 'menu' && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-red-500 to-red-700 tracking-wider mb-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            SUPER MARIO
          </h1>
          <p className="font-mono text-neutral-400 text-sm mb-6 tracking-widest">
            NEXT.JS RETRO RECREATION
          </p>
          <button
            onClick={onStart}
            className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-mono font-bold tracking-widest rounded-xl text-lg shadow-xl shadow-red-600/30 transform hover:scale-105 active:scale-95 transition-all border-2 border-red-400"
          >
            START GAME
          </button>
        </div>
      )}

      {status === 'paused' && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="bg-neutral-900 border-2 border-yellow-500/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h2 className="text-2xl font-black font-mono text-yellow-400 tracking-widest mb-4">
              PAUSED
            </h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={onPause}
                className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-mono font-bold rounded-lg transition-colors border border-green-400"
              >
                RESUME
              </button>
              <button
                onClick={onRestart}
                className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono font-bold rounded-lg transition-colors border border-neutral-600"
              >
                RESTART LEVEL
              </button>
              <button
                onClick={onOpenInstructions}
                className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-blue-300 font-mono font-bold rounded-lg transition-colors border border-neutral-600"
              >
                CONTROLS GUIDE
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'game_over' && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="bg-neutral-900 border-2 border-red-600 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-black font-mono text-red-500 tracking-widest mb-2 animate-pulse">
              GAME OVER
            </h2>
            <p className="font-mono text-neutral-400 text-sm mb-4">
              FINAL SCORE: <span className="text-yellow-400 font-bold">{formattedScore}</span>
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={onRestart}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-mono font-bold tracking-widest rounded-xl transition-all shadow-lg shadow-red-600/30 border border-red-400"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={onOpenLeaderboard}
                className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-mono font-bold rounded-lg transition-colors border border-neutral-700"
              >
                SAVE TO HALL OF FAME
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'stage_clear' && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="bg-neutral-900 border-2 border-green-500 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-3xl font-black font-mono text-green-400 tracking-widest mb-2">
              STAGE CLEAR!
            </h2>
            <p className="font-mono text-yellow-400 text-lg font-bold mb-4">
              SCORE: {formattedScore}
            </p>
            <button
              onClick={onNextLevel}
              className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-mono font-bold tracking-widest rounded-xl transition-all shadow-lg shadow-green-600/30 border border-green-400"
            >
              NEXT WORLD ➔
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
