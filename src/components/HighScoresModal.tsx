'use client';

import React, { useState, useEffect } from 'react';
import { X, Trophy, Medal } from 'lucide-react';
import { HighScoreEntry } from '@/types/game';

interface HighScoresModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore: number;
  currentCoins: number;
  currentWorld: string;
}

const DEFAULT_SCORES: HighScoreEntry[] = [
  { id: '1', playerName: 'MAR', score: 25400, coins: 42, world: '1-3', date: '2026-09-28' },
  { id: '2', playerName: 'LGI', score: 18200, coins: 29, world: '1-2', date: '2026-09-27' },
  { id: '3', playerName: 'PCH', score: 14500, coins: 21, world: '1-2', date: '2026-09-25' },
  { id: '4', playerName: 'TOD', score: 9800, coins: 15, world: '1-1', date: '2026-09-24' },
  { id: '5', playerName: 'YSH', score: 6200, coins: 9, world: '1-1', date: '2026-09-20' },
];

export const HighScoresModal: React.FC<HighScoresModalProps> = ({
  isOpen,
  onClose,
  currentScore,
  currentCoins,
  currentWorld,
}) => {
  const [scores, setScores] = useState<HighScoreEntry[]>([]);
  const [initials, setInitials] = useState<string>('AAA');
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('mario_high_scores');
    if (saved) {
      try {
        setScores(JSON.parse(saved));
      } catch {
        setScores(DEFAULT_SCORES);
      }
    } else {
      setScores(DEFAULT_SCORES);
    }
  }, [isOpen]);

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initials.trim() || submitted) return;

    const newEntry: HighScoreEntry = {
      id: `score_${Date.now()}`,
      playerName: initials.trim().toUpperCase().slice(0, 3),
      score: currentScore,
      coins: currentCoins,
      world: currentWorld,
      date: new Date().toISOString().split('T')[0],
    };

    const updated = [...scores, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setScores(updated);
    localStorage.setItem('mario_high_scores', JSON.stringify(updated));
    setSubmitted(true);
  };

  const handleResetScores = () => {
    setScores(DEFAULT_SCORES);
    localStorage.setItem('mario_high_scores', JSON.stringify(DEFAULT_SCORES));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-neutral-900 border-2 border-neutral-700 rounded-2xl shadow-2xl p-6 text-neutral-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold font-mono tracking-wider text-white">
              HALL OF FAME
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Submit Form if have score */}
        {currentScore > 0 && !submitted && (
          <form onSubmit={handleSubmitScore} className="mt-4 p-4 bg-neutral-800/80 rounded-xl border border-yellow-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-neutral-400">YOUR SCORE:</span>
              <p className="text-xl font-mono font-bold text-yellow-400">{currentScore}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={3}
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                placeholder="AAA"
                className="w-20 px-3 py-1.5 bg-neutral-900 border border-neutral-600 rounded text-center font-mono font-bold text-white text-lg tracking-widest focus:ring-1 focus:ring-yellow-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-mono font-bold text-xs rounded transition-colors"
              >
                SUBMIT
              </button>
            </div>
          </form>
        )}

        {/* Scores List */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between px-3 py-1 text-xs font-mono text-neutral-500 border-b border-neutral-800">
            <span>RANK / NAME</span>
            <span>WORLD</span>
            <span>COINS</span>
            <span>SCORE</span>
          </div>

          {scores.map((entry, idx) => {
            const isTop3 = idx < 3;
            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg font-mono text-xs ${
                  idx === 0 
                    ? 'bg-amber-950/40 border border-amber-600/50 text-amber-200' 
                    : isTop3 
                    ? 'bg-neutral-800/60 border border-neutral-700/60 text-white' 
                    : 'bg-neutral-800/30 text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-neutral-400 font-bold flex items-center">
                    {idx === 0 ? <Medal className="w-4 h-4 text-amber-400" /> : `#${idx + 1}`}
                  </span>
                  <span className="font-bold tracking-widest text-sm text-yellow-300">
                    {entry.playerName}
                  </span>
                </div>

                <span className="text-neutral-400">{entry.world}</span>
                <span className="text-yellow-400">🪙 {entry.coins}</span>
                <span className="font-bold text-sm tracking-wider">{entry.score}</span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
          <button
            onClick={handleResetScores}
            className="text-neutral-500 hover:text-neutral-400 text-xs font-mono underline transition-colors"
          >
            Reset Scores
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-mono font-bold rounded-lg text-xs tracking-wider transition-colors"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
