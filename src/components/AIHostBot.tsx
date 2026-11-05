import React, { useState } from 'react';
import { sound } from '../utils/sound';

interface AIHostBotProps {
  mood?: 'normal' | 'sarcastic' | 'shocked' | 'cheering';
  quip: string;
  onPoke?: () => void;
  compact?: boolean;
}

export const AIHostBot: React.FC<AIHostBotProps> = ({
  mood = 'normal',
  quip,
  onPoke,
  compact = false,
}) => {
  const [isPoked, setIsPoked] = useState(false);

  const handlePoke = () => {
    sound.playPop();
    setIsPoked(true);
    setTimeout(() => setIsPoked(false), 500);
    if (onPoke) onPoke();
  };

  // Face SVG expressions based on mood
  const renderEyes = () => {
    switch (mood) {
      case 'shocked':
        return (
          <>
            <circle cx="16" cy="18" r="7" fill="#38BDF8" className="animate-pulse" />
            <circle cx="16" cy="18" r="3" fill="#0369A1" />
            <circle cx="48" cy="18" r="7" fill="#38BDF8" className="animate-pulse" />
            <circle cx="48" cy="18" r="3" fill="#0369A1" />
          </>
        );
      case 'sarcastic':
        return (
          <>
            <path d="M 10 16 Q 16 12 22 18" stroke="#FBBF24" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="16" cy="20" r="3" fill="#FBBF24" />
            <path d="M 42 18 Q 48 12 54 16" stroke="#FBBF24" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="48" cy="20" r="3" fill="#FBBF24" />
          </>
        );
      case 'cheering':
        return (
          <>
            <path d="M 10 20 Q 16 12 22 20" stroke="#4ADE80" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 42 20 Q 48 12 54 20" stroke="#4ADE80" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </>
        );
      case 'normal':
      default:
        return (
          <>
            <rect x="11" y="14" width="10" height="10" rx="3" fill="#22D3EE" />
            <rect x="43" y="14" width="10" height="10" rx="3" fill="#22D3EE" />
          </>
        );
    }
  };

  const renderMouth = () => {
    switch (mood) {
      case 'shocked':
        return <ellipse cx="32" cy="36" rx="5" ry="7" fill="#38BDF8" />;
      case 'sarcastic':
        return <path d="M 22 36 Q 30 38 42 32" stroke="#FBBF24" strokeWidth="3" fill="none" strokeLinecap="round" />;
      case 'cheering':
        return (
          <path d="M 20 33 Q 32 44 44 33" stroke="#4ADE80" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        );
      case 'normal':
      default:
        return (
          <line x1="22" y1="36" x2="42" y2="36" stroke="#22D3EE" strokeWidth="3" strokeLinecap="round" />
        );
    }
  };

  return (
    <div
      className={`relative flex items-center gap-4 transition-transform ${
        isPoked ? 'scale-105' : ''
      } ${compact ? 'py-1' : 'py-3'}`}
    >
      {/* Bot Robot Avatar */}
      <button
        type="button"
        onClick={handlePoke}
        title="点击调戏AI裁判"
        className="relative shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border border-cyan-500/40 p-1 shadow-lg shadow-cyan-950/40 hover:border-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer group"
      >
        {/* Antennas */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center flex-col">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping opacity-75" />
          <div className="w-1 h-3 bg-slate-600 rounded-t" />
        </div>

        {/* Screen Bezel */}
        <div className="w-full h-full rounded-xl bg-slate-900 border border-slate-700/60 overflow-hidden relative flex items-center justify-center">
          {/* CRT scanlines effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

          {/* Face Vector */}
          <svg viewBox="0 0 64 48" className="w-12 h-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            {renderEyes()}
            {renderMouth()}
          </svg>
        </div>

        {/* Name Tag */}
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-wider text-cyan-300 bg-slate-900 px-1.5 py-0.2 rounded border border-cyan-800/80 uppercase shadow">
          BOT-888
        </span>
      </button>

      {/* Comic Speech Bubble */}
      <div className="relative flex-1 bg-slate-900/90 border border-cyan-500/30 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-sm">
        {/* Pointer Triangle */}
        <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[8px] border-r-slate-900" />

        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-cyan-400 tracking-wide">毒舌裁判 · 贾维斯分斯</span>
            <span className="text-[10px] text-slate-400">
              {mood === 'sarcastic' ? '阴阳怪气中' : mood === 'shocked' ? '大受震撼' : mood === 'cheering' ? '假装鼓掌' : '在线看戏'}
            </span>
          </div>
          <button
            type="button"
            onClick={handlePoke}
            className="text-[11px] text-cyan-400/80 hover:text-cyan-300 hover:underline cursor-pointer"
          >
            催促吐槽
          </button>
        </div>

        <p className="text-sm font-medium text-slate-100 leading-snug break-words">
          "{quip}"
        </p>
      </div>
    </div>
  );
};
