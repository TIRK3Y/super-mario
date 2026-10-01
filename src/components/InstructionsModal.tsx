'use client';

import React from 'react';
import { X, Keyboard, Sparkles, Shield, Flame, Heart } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border-2 border-neutral-700 rounded-2xl shadow-2xl p-6 text-neutral-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold font-mono tracking-wider text-white">
              HOW TO PLAY & CONTROLS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-6 max-h-[70vh] overflow-y-auto pr-2 text-sm">
          
          {/* Keyboard Controls */}
          <div>
            <h3 className="font-mono font-bold text-red-400 mb-3 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <span>⌨️</span> KEYBOARD CONTROLS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded bg-neutral-800/80 border border-neutral-700">
                <span className="text-neutral-400">Move Left / Right</span>
                <span className="bg-neutral-700 px-2 py-1 rounded text-white font-bold">← / → or A / D</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-neutral-800/80 border border-neutral-700">
                <span className="text-neutral-400">Jump / High Jump</span>
                <span className="bg-neutral-700 px-2 py-1 rounded text-yellow-300 font-bold">SPACE or W or Z</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-neutral-800/80 border border-neutral-700">
                <span className="text-neutral-400">Crouch (Super Mario)</span>
                <span className="bg-neutral-700 px-2 py-1 rounded text-white font-bold">↓ or S</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-neutral-800/80 border border-neutral-700">
                <span className="text-neutral-400">Dash / Shoot Fire</span>
                <span className="bg-neutral-700 px-2 py-1 rounded text-red-400 font-bold">SHIFT or X</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-neutral-800/80 border border-neutral-700">
                <span className="text-neutral-400">Pause / Resume</span>
                <span className="bg-neutral-700 px-2 py-1 rounded text-green-400 font-bold">P or ESC</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-neutral-800/80 border border-neutral-700">
                <span className="text-neutral-400">Mute Audio</span>
                <span className="bg-neutral-700 px-2 py-1 rounded text-white font-bold">M</span>
              </div>
            </div>
          </div>

          {/* Powerups & Items */}
          <div>
            <h3 className="font-mono font-bold text-yellow-400 mb-3 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> ITEMS & POWER-UPS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-neutral-800/50 rounded-xl border border-neutral-700/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-red-600/30 border border-red-500 flex items-center justify-center shrink-0 text-red-400 font-bold">
                  🍄
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Super Mushroom</h4>
                  <p className="text-neutral-400 text-xs mt-0.5">Turns Mario into Super Mario. Break bricks from below and take an extra hit.</p>
                </div>
              </div>

              <div className="p-3 bg-neutral-800/50 rounded-xl border border-neutral-700/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-orange-600/30 border border-orange-500 flex items-center justify-center shrink-0 text-orange-400 font-bold">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Fire Flower</h4>
                  <p className="text-neutral-400 text-xs mt-0.5">Grants fireballs! Press Shift or X to throw bouncing fireballs at enemies.</p>
                </div>
              </div>

              <div className="p-3 bg-neutral-800/50 rounded-xl border border-neutral-700/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-yellow-600/30 border border-yellow-500 flex items-center justify-center shrink-0 text-yellow-400 font-bold">
                  ⭐
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Starman</h4>
                  <p className="text-neutral-400 text-xs mt-0.5">Temporary invincibility! Defeat any enemy simply by touching them.</p>
                </div>
              </div>

              <div className="p-3 bg-neutral-800/50 rounded-xl border border-neutral-700/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-green-600/30 border border-green-500 flex items-center justify-center shrink-0 text-green-400 font-bold">
                  <Heart className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">1-UP Mushroom</h4>
                  <p className="text-neutral-400 text-xs mt-0.5">Hidden in mystery blocks. Grants an extra life!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gameplay Tips */}
          <div>
            <h3 className="font-mono font-bold text-blue-400 mb-2 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> PRO TIPS
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-300 text-xs leading-relaxed">
              <li><strong>Hold Jump</strong> longer to perform high jumps. Quick tap gives a short hop.</li>
              <li><strong>Stomp Koopa Troopas</strong> to knock them into their shell, then run into the shell to kick it and eliminate rows of enemies!</li>
              <li><strong>Jump higher on flagpoles</strong> to earn up to 5,000 bonus points!</li>
              <li>Remaining stage time converts directly into bonus points upon entering the castle.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-mono font-bold rounded-lg text-xs tracking-wider transition-colors"
          >
            LET&apos;S PLAY!
          </button>
        </div>

      </div>
    </div>
  );
};
