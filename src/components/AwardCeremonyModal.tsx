import React, { useState } from 'react';
import { PartyCeremonyState, Player } from '../types/game.js';
import { sound } from '../utils/sound.js';
import { Trophy, Crown, Sparkles, Share2, RotateCcw, Check, Flame } from 'lucide-react';

interface AwardCeremonyModalProps {
  ceremony: PartyCeremonyState;
  players: Record<string, Player>;
  onClose: () => void;
}

export const AwardCeremonyModal: React.FC<AwardCeremonyModalProps> = ({ ceremony, players, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    sound.playSuccess();
    const rankText = Object.values(players)
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => `${idx + 1}. ${p.name}: ${p.score}分`)
      .join('\n');

    const shareContent = `🏆【派对AI狂欢盒 · 终局战报】🏆\n` +
      `👑 显眼包之王: ${ceremony.mvpName} (${ceremony.mvpScore}分)\n` +
      `AI评语: ${ceremony.aiHostSpeech}\n\n` +
      `【全场积分排行榜】:\n${rankText}\n\n` +
      `快来下一场开黑决一胜负！🔥`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 border-2 border-amber-400/60 rounded-3xl p-5 sm:p-8 shadow-[0_0_60px_rgba(251,191,36,0.3)] text-white animate-in zoom-in-95 duration-300 my-auto">
        {/* Floating Confetti / Crown Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black mb-3 shadow-[0_0_30px_rgba(245,158,11,0.6)] animate-pulse">
            <Trophy className="w-9 h-9" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
            派对终局 · AI毒舌颁奖盛典
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1 flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            基于全局积分、手速、潜伏演技与自爆表现权威认证
          </p>
        </div>

        {/* MVP Spotlight Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border border-amber-400/50 rounded-2xl p-4 sm:p-5 mb-6 text-center relative overflow-hidden">
          <div className="absolute -top-6 -right-6 text-amber-400/10 text-8xl font-black pointer-events-none">
            MVP
          </div>
          <div className="flex items-center justify-center gap-2 text-amber-300 font-extrabold text-sm uppercase tracking-widest mb-1">
            <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            本场最强显眼包之王
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white flex items-center justify-center gap-2 my-2">
            <span className="text-4xl">{ceremony.mvpAvatar}</span>
            <span>{ceremony.mvpName}</span>
          </div>
          <div className="text-lg font-bold text-amber-400 mb-2">
            最终得分：<span className="text-2xl font-black text-yellow-300">{ceremony.mvpScore}</span> 分
          </div>
          <div className="text-xs sm:text-sm text-amber-100 bg-black/40 px-3 py-2 rounded-xl border border-amber-500/30 italic">
            “{ceremony.aiHostSpeech}”
          </div>
        </div>

        {/* Awards 4-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {ceremony.awards.map((award) => (
            <div
              key={award.id}
              className="bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/60 transition-all rounded-xl p-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-amber-300 flex items-center gap-1.5">
                    <span>{award.badge}</span>
                    <span>{award.title}</span>
                  </span>
                  <span className="text-xs font-bold text-white bg-purple-900/70 border border-purple-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span>{award.winnerAvatar}</span>
                    <span>{award.winnerName}</span>
                  </span>
                </div>
                <div className="text-[11px] font-medium text-slate-300 mt-1">
                  {award.reason}
                </div>
              </div>
              <div className="mt-2 text-[10px] text-pink-300 bg-pink-950/40 border border-pink-500/30 px-2.5 py-1 rounded-lg">
                💬 {award.roast}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleShare}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-extrabold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-green-300" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? '已复制战报到剪贴板！' : '复制派对战报发群聊'}</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 font-extrabold text-sm text-slate-950 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-slate-950" />
            <span>再开一局派对狂欢</span>
          </button>
        </div>
      </div>
    </div>
  );
};
