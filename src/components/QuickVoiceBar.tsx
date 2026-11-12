import React, { useState } from 'react';
import { QuickVoiceEvent } from '../types/game.js';
import { sound } from '../utils/sound.js';
import { MessageSquarePlus, ChevronUp, ChevronDown } from 'lucide-react';

interface QuickVoiceBarProps {
  onSendVoice: (phrase: string, soundKey: string) => void;
  lastVoiceEvent?: QuickVoiceEvent;
}

const VOICE_PRESETS = [
  { phrase: '你不对劲！🧐', soundKey: 'suspicious' },
  { phrase: '他在硬编！🤥', soundKey: 'lying' },
  { phrase: '赶紧的急急急！⚡', soundKey: 'hurry' },
  { phrase: '这画的是啥外星生物？👾', soundKey: 'alien' },
  { phrase: '盲猜选C！🎲', soundKey: 'guess_c' },
  { phrase: '我才是名侦探！🔍', soundKey: 'detective' },
];

export const QuickVoiceBar: React.FC<QuickVoiceBarProps> = ({ onSendVoice, lastVoiceEvent }) => {
  const [expanded, setExpanded] = useState(false);

  // Show banner if a voice event arrived recently (< 4s)
  const isRecentVoice = lastVoiceEvent && Date.now() - lastVoiceEvent.timestamp < 4000;

  return (
    <>
      {/* Live Voiceline Banner Alert */}
      {isRecentVoice && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
          <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.6)] border border-pink-300/40 flex items-center gap-2">
            <span className="font-bold text-xs text-amber-300">【{lastVoiceEvent.playerName}】大喊:</span>
            <span className="font-extrabold text-sm">{lastVoiceEvent.phrase}</span>
          </div>
        </div>
      )}

      {/* Backdrop to dismiss when expanded */}
      {expanded && (
        <div
          className="fixed inset-0 z-30 bg-black/20"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Floating Quick Voice Button & Drawer */}
      <div className="fixed bottom-20 right-3 sm:right-5 z-40 flex flex-col items-end pointer-events-auto">
        {expanded && (
          <div className="mb-2 bg-slate-900/95 backdrop-blur-md border border-pink-500/40 rounded-2xl p-2.5 shadow-2xl flex flex-col gap-1.5 max-w-[200px] animate-in fade-in slide-in-from-bottom-2">
            <div className="text-[11px] font-bold text-pink-400 px-1 border-b border-pink-500/20 pb-1">
              线上嘴炮开黑语音台:
            </div>
            {VOICE_PRESETS.map((v) => (
              <button
                key={v.phrase}
                onClick={() => {
                  onSendVoice(v.phrase, v.soundKey);
                  sound.playPop();
                  setExpanded(false);
                }}
                className="text-left text-xs font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-pink-600/50 px-2.5 py-1.5 rounded-lg border border-slate-700/50 hover:border-pink-400 transition-all cursor-pointer"
              >
                {v.phrase}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            sound.playPop();
            setExpanded(!expanded);
          }}
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-3 py-2 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-400/40 flex items-center gap-1.5 font-bold text-xs transition-transform active:scale-95 cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>嘴炮台</span>
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    </>
  );
};
