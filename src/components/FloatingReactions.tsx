import React, { useEffect } from 'react';
import { FloatingReaction, ReactionType } from '../types/game.js';
import { sound } from '../utils/sound.js';

interface FloatingReactionsProps {
  reactions: FloatingReaction[];
  onThrow: (type: ReactionType) => void;
}

const REACTION_CONFIG: Record<ReactionType, { emoji: string; label: string; soundType: 'splat' | 'clap' | 'bomb' | 'pop' }> = {
  tomato: { emoji: '🍅', label: '扔番茄', soundType: 'splat' },
  egg: { emoji: '🥚', label: '砸鸡蛋', soundType: 'splat' },
  clap: { emoji: '👏', label: '喝彩鼓掌', soundType: 'clap' },
  bomb: { emoji: '💣', label: '丢炸弹', soundType: 'bomb' },
  heart: { emoji: '💖', label: '比心点赞', soundType: 'pop' },
};

export const FloatingReactions: React.FC<FloatingReactionsProps> = ({ reactions, onThrow }) => {
  // Play sound for new incoming reactions
  useEffect(() => {
    if (!reactions || reactions.length === 0) return;
    const latest = reactions[reactions.length - 1];
    const isRecent = Date.now() - latest.timestamp < 1000;
    if (isRecent) {
      const cfg = REACTION_CONFIG[latest.type];
      if (cfg) {
        if (cfg.soundType === 'splat') sound.playSplat();
        else if (cfg.soundType === 'clap') sound.playClap();
        else if (cfg.soundType === 'bomb') sound.playBomb();
        else sound.playPop();
      }
    }
  }, [reactions]);

  // Keep only reactions from the last 4 seconds for visual animation
  const visibleReactions = (reactions || []).filter((r) => Date.now() - r.timestamp < 3500);

  return (
    <>
      {/* Floating particles layer */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {visibleReactions.map((r) => {
          const cfg = REACTION_CONFIG[r.type] || { emoji: '✨' };
          return (
            <div
              key={r.id}
              className="absolute flex flex-col items-center animate-bounce transition-all duration-700"
              style={{
                left: `${r.x}%`,
                top: `${r.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="text-4xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] filter">
                {cfg.emoji}
              </span>
              <span className="text-[10px] font-bold text-amber-300 bg-black/80 px-2 py-0.5 rounded-full border border-amber-500/30 whitespace-nowrap mt-1 shadow-lg">
                {r.senderName}
              </span>
            </div>
          );
        })}
      </div>

      {/* Persistent Reaction Trigger Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 rounded-full px-3 py-1.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-1.5 sm:gap-2">
        <span className="text-[11px] text-cyan-400 font-bold px-1 hidden sm:inline">互动开火:</span>
        {(Object.keys(REACTION_CONFIG) as ReactionType[]).map((type) => {
          const item = REACTION_CONFIG[type];
          return (
            <button
              key={type}
              onClick={() => {
                onThrow(type);
                if (item.soundType === 'splat') sound.playSplat();
                else if (item.soundType === 'clap') sound.playClap();
                else if (item.soundType === 'bomb') sound.playBomb();
                else sound.playPop();
              }}
              title={item.label}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-90 border border-slate-700 hover:border-cyan-400 transition-all flex items-center justify-center text-xl shadow cursor-pointer"
            >
              {item.emoji}
            </button>
          );
        })}
      </div>
    </>
  );
};
