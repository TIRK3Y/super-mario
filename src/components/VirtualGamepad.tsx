'use client';

import React from 'react';
import { InputState } from '@/types/game';

interface VirtualGamepadProps {
  onInputChange: (key: keyof InputState, active: boolean) => void;
  onPause: () => void;
  onRestart: () => void;
}

export const VirtualGamepad: React.FC<VirtualGamepadProps> = ({
  onInputChange,
  onPause,
  onRestart,
}) => {
  const handleTouch = (key: keyof InputState, active: boolean) => (e: React.SyntheticEvent) => {
    e.preventDefault();
    onInputChange(key, active);
  };

  return (
    <div className="w-full max-w-[800px] mx-auto mt-4 p-4 bg-neutral-900 border-2 border-neutral-700 rounded-2xl shadow-xl select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* D-PAD */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <div className="absolute w-12 h-36 bg-neutral-800 rounded-lg shadow-inner border border-neutral-600" />
          <div className="absolute w-36 h-12 bg-neutral-800 rounded-lg shadow-inner border border-neutral-600" />

          {/* Up */}
          <button
            aria-label="Up"
            onMouseDown={handleTouch('up', true)}
            onMouseUp={handleTouch('up', false)}
            onTouchStart={handleTouch('up', true)}
            onTouchEnd={handleTouch('up', false)}
            className="absolute top-0 w-12 h-12 flex items-center justify-center text-neutral-400 active:bg-neutral-700 rounded-t-lg z-10 transition-colors"
          >
            ▲
          </button>

          {/* Left */}
          <button
            aria-label="Left"
            onMouseDown={handleTouch('left', true)}
            onMouseUp={handleTouch('left', false)}
            onTouchStart={handleTouch('left', true)}
            onTouchEnd={handleTouch('left', false)}
            className="absolute left-0 w-12 h-12 flex items-center justify-center text-neutral-400 active:bg-neutral-700 rounded-l-lg z-10 transition-colors"
          >
            ◀
          </button>

          {/* Center Pivot */}
          <div className="w-6 h-6 rounded-full bg-neutral-900 z-10 shadow-inner" />

          {/* Right */}
          <button
            aria-label="Right"
            onMouseDown={handleTouch('right', true)}
            onMouseUp={handleTouch('right', false)}
            onTouchStart={handleTouch('right', true)}
            onTouchEnd={handleTouch('right', false)}
            className="absolute right-0 w-12 h-12 flex items-center justify-center text-neutral-400 active:bg-neutral-700 rounded-r-lg z-10 transition-colors"
          >
            ▶
          </button>

          {/* Down */}
          <button
            aria-label="Down"
            onMouseDown={handleTouch('down', true)}
            onMouseUp={handleTouch('down', false)}
            onTouchStart={handleTouch('down', true)}
            onTouchEnd={handleTouch('down', false)}
            className="absolute bottom-0 w-12 h-12 flex items-center justify-center text-neutral-400 active:bg-neutral-700 rounded-b-lg z-10 transition-colors"
          >
            ▼
          </button>
        </div>

        {/* Center Utility Buttons (Select & Start) */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <button
              onClick={onRestart}
              className="w-14 h-5 bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500 rounded-full shadow border border-neutral-500 transform -rotate-12 transition-transform active:scale-95"
            />
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 mt-2 font-bold">RESTART</span>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={onPause}
              className="w-14 h-5 bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500 rounded-full shadow border border-neutral-500 transform -rotate-12 transition-transform active:scale-95"
            />
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 mt-2 font-bold">START / PAUSE</span>
          </div>
        </div>

        {/* Action Buttons: B and A */}
        <div className="flex items-center gap-5">
          {/* B Button (Run / Dash / Fire) */}
          <div className="flex flex-col items-center">
            <button
              aria-label="B Button (Run / Fire)"
              onMouseDown={handleTouch('run', true)}
              onMouseUp={handleTouch('run', false)}
              onTouchStart={handleTouch('run', true)}
              onTouchEnd={handleTouch('run', false)}
              className="w-16 h-16 rounded-full bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-black text-xl shadow-lg border-2 border-red-500 flex items-center justify-center active:scale-90 transition-transform"
            >
              B
            </button>
            <span className="text-xs font-mono font-bold text-neutral-400 mt-1">DASH/FIRE</span>
          </div>

          {/* A Button (Jump) */}
          <div className="flex flex-col items-center">
            <button
              aria-label="A Button (Jump)"
              onMouseDown={handleTouch('jump', true)}
              onMouseUp={handleTouch('jump', false)}
              onTouchStart={handleTouch('jump', true)}
              onTouchEnd={handleTouch('jump', false)}
              className="w-16 h-16 rounded-full bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-black text-xl shadow-lg border-2 border-red-500 flex items-center justify-center active:scale-90 transition-transform"
            >
              A
            </button>
            <span className="text-xs font-mono font-bold text-neutral-400 mt-1">JUMP</span>
          </div>
        </div>

      </div>
    </div>
  );
};
