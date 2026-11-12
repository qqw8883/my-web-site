import React, { useState, useRef, useEffect } from 'react';
import { RoomState, ItemCardType } from '../../types/game';
import { AIHostBot } from '../AIHostBot';
import { sound } from '../../utils/sound';
import { Zap, RotateCw, ArrowRight, Bomb, Crown, Flame, Clock, Radio, Trophy, Sparkles } from 'lucide-react';
import { PENALTY_WHEEL_ITEMS } from '../../server/roomManager';

interface BuzzerHostProps {
  room: RoomState;
  currentPlayerId: string;
  onAction: (action: string, payload?: any) => void;
  onBackToLobby: () => void;
  onUseItem?: (cardType: ItemCardType) => void;
}

const WHEEL_SLICE_CONFIG = [
  { color: '#EF4444', badge: '🎙️', shortLabel: '播音腔读广告' },
  { color: '#F97316', badge: '🖼️', shortLabel: '换抽象头像' },
  { color: '#EAB308', badge: '🐶', shortLabel: '模仿动物叫' },
  { color: '#10B981', badge: '💌', shortLabel: '深情土味情话' },
  { color: '#06B6D4', badge: '🏋️', shortLabel: '深蹲喊大聪明' },
  { color: '#3B82F6', badge: '🦆', shortLabel: '唐老鸭音请客' },
  { color: '#8B5CF6', badge: '🔥', shortLabel: '中二动漫语音' },
  { color: '#EC4899', badge: '😜', shortLabel: '搞笑鬼脸自拍' },
];

export const BuzzerHost: React.FC<BuzzerHostProps> = ({
  room,
  currentPlayerId,
  onAction,
  onBackToLobby,
  onUseItem,
}) => {
  const allPlayerIds = Object.keys(room.players);
  const myId = currentPlayerId || room.hostPlayerId || allPlayerIds[0] || 'host';

  const buzzer = room.buzzer || {
    question: '一头猪在雪地里走，回头为什么看不到自己的脚印？',
    options: ['因为雪下得太大掩盖了', '因为它是倒着走的', '因为猪蹄太轻没留印', '因为它戴了鞋套'],
    correctIndex: 1,
    answer: '因为它是倒着走的',
    explanation: '脑筋急转弯：既然是倒着走的，脚印当然在它前面，回头自然看不到！',
    buzzedPlayerId: null,
    phase: 'QUESTION' as const,
    round: 1,
    maxRounds: 5,
  };

  const myItems = room.playerItems?.[myId] || { bombSteal: 1, supremeBuzz: 1, doubleCombo: 1 };
  const buzzedPlayer = buzzer.buzzedPlayerId ? room.players[buzzer.buzzedPlayerId] : null;
  const penaltyPlayer = buzzer.penaltyTargetPlayerId
    ? room.players[buzzer.penaltyTargetPlayerId]
    : buzzedPlayer;

  const canISelectOption =
    buzzer.buzzedPlayerId === myId ||
    room.playMode === 'LOCAL_PARTY' ||
    room.hostPlayerId === myId ||
    Object.keys(room.players).length <= 1;

  const [wheelDeg, setWheelDeg] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWheelResultCard, setShowWheelResultCard] = useState(false);
  const [answerTimer, setAnswerTimer] = useState(12);

  const lastSpinIdRef = useRef<number | undefined>(undefined);
  const currentDegRef = useRef<number>(0);
  const spinTimeoutRef = useRef<any>(null);
  const tickIntervalRef = useRef<any>(null);

  // 12s countdown when BUZZED
  useEffect(() => {
    if (buzzer.phase !== 'BUZZED') return;
    setAnswerTimer(12);
    const interval = setInterval(() => {
      setAnswerTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [buzzer.phase, buzzer.buzzedPlayerId]);

  const startVisualWheelSpin = (targetIdx: number) => {
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);

    setIsSpinning(true);
    setShowWheelResultCard(false);

    const totalItems = PENALTY_WHEEL_ITEMS.length;
    const sliceDeg = 360 / totalItems;
    const safeIdx = ((targetIdx % totalItems) + totalItems) % totalItems;
    const desiredMod = (360 - safeIdx * sliceDeg) % 360;
    const currentMod = ((currentDegRef.current % 360) + 360) % 360;
    let delta = desiredMod - currentMod;
    if (delta <= 0) delta += 360;

    const nextDeg = currentDegRef.current + 360 * 6 + delta;
    currentDegRef.current = nextDeg;

    requestAnimationFrame(() => {
      setWheelDeg(nextDeg);
    });

    let ticks = 0;
    tickIntervalRef.current = setInterval(() => {
      ticks++;
      if (ticks <= 16) {
        sound.playWheelClick();
      }
    }, 140);

    spinTimeoutRef.current = setTimeout(() => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      setIsSpinning(false);
      setShowWheelResultCard(true);
      sound.playFanfare();
    }, 2500);
  };

  useEffect(() => {
    if (buzzer.phase !== 'WHEEL_SPIN') {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      setIsSpinning(false);
      setShowWheelResultCard(false);
      return;
    }

    const spinId = buzzer.wheelSpinId || 1;
    if (lastSpinIdRef.current !== spinId) {
      lastSpinIdRef.current = spinId;
      const targetIdx = buzzer.wheelTargetIndex ?? 0;
      startVisualWheelSpin(targetIdx);
    }
  }, [buzzer.phase, buzzer.wheelSpinId, buzzer.wheelTargetIndex]);

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  const handleTriggerSpinWheel = () => {
    if (isSpinning) return;
    sound.playWheelClick();
    onAction('BUZZER_ACTION', { action: 'SPIN_WHEEL' });
  };

  const handleUseCard = (cardType: ItemCardType) => {
    sound.playItemCard();
    if (onUseItem) {
      onUseItem(cardType);
    } else {
      onAction('USE_ITEM_CARD', { cardType });
    }
  };

  const totalSlices = PENALTY_WHEEL_ITEMS.length;
  const sliceAngle = 360 / totalSlices;
  const cx = 160;
  const cy = 160;
  const r = 140;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 py-2 pb-16">
      {/* Top AI Host Companion */}
      <AIHostBot
        mood={room.aiMood === 'laugh' ? 'sarcastic' : room.aiMood}
        quip={room.aiQuip}
      />

      {/* Main Game Stage - Electric Game Show Arena Theme */}
      <div className="relative bg-[#090e17] border-2 border-cyan-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden">
        {/* Stadium lighting glow beams */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-b from-cyan-500/15 to-transparent pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header HUD */}
        <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-cyan-900/40 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-mono text-xl shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-wide text-white flex items-center gap-2">
                  <span>手速抢答 · 王牌电视答题秀</span>
                  <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 uppercase">
                    Stage Arena
                  </span>
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span>
                  演播厅代码: <strong className="font-mono text-cyan-400 font-bold">{room.id}</strong>
                </span>
                <span>·</span>
                <span>
                  进度: <strong className="text-white font-mono font-bold">第 {buzzer.round} / {buzzer.maxRounds} 题</strong>
                </span>
                <span>·</span>
                <span className="text-amber-400 font-bold">💥 先拍先得 · 答错受刑</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onAction('BUZZER_ACTION', { action: 'NEXT' });
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700/80 cursor-pointer transition flex items-center gap-1.5"
            >
              <span>换下一题</span>
            </button>
            <button
              type="button"
              onClick={onBackToLobby}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 cursor-pointer transition"
            >
              返回大厅
            </button>
          </div>
        </div>

        {/* Tactical Item Cards Deck Bar */}
        <div className="relative mb-5 bg-[#05070d] p-3 rounded-xl border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-black text-amber-300">战术道具库:</span>
            <span className="text-[11px] text-slate-400">（拍灯前扔出，打破对局平衡）</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={myItems.bombSteal <= 0 || buzzer.phase !== 'QUESTION'}
              onClick={() => handleUseCard('BOMB_STEAL')}
              className="px-3.5 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer transition active:scale-95 shadow"
            >
              <Bomb className="w-3.5 h-3.5 text-rose-400" />
              <span>炸弹偷分卡 ({myItems.bombSteal})</span>
            </button>

            <button
              type="button"
              disabled={myItems.supremeBuzz <= 0 || buzzer.phase !== 'QUESTION'}
              onClick={() => handleUseCard('SUPREME_BUZZ')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer transition active:scale-95 shadow"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>霸权强抢卡 ({myItems.supremeBuzz})</span>
            </button>

            <button
              type="button"
              disabled={myItems.doubleCombo <= 0 || buzzer.phase !== 'QUESTION'}
              onClick={() => handleUseCard('DOUBLE_COMBO')}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-300 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer transition active:scale-95 shadow"
            >
              <Flame className="w-3.5 h-3.5 text-indigo-400" />
              <span>双倍连击卡 ({myItems.doubleCombo})</span>
            </button>
          </div>
        </div>

        {/* Active Item Used Banner */}
        {buzzer.activeItemUsed && (
          <div className="mb-4 bg-gradient-to-r from-purple-900/70 to-pink-900/70 border border-pink-400/60 rounded-xl px-4 py-2 flex items-center gap-2 animate-pulse text-xs text-white shadow-lg">
            <span className="font-extrabold text-amber-300">【{buzzer.activeItemUsed.playerName}】触发特权道具：</span>
            <span className="font-black">
              {buzzer.activeItemUsed.cardType === 'BOMB_STEAL' && '💥 炸弹偷分卡（若答对立即顺走榜首50分！）'}
              {buzzer.activeItemUsed.cardType === 'SUPREME_BUZZ' && '👑 绝对霸权卡（强行锁死本题抢答优先权！）'}
              {buzzer.activeItemUsed.cardType === 'DOUBLE_COMBO' && '🔥 连击双倍卡（答对得分x2，答错受刑惩罚翻倍！）'}
            </span>
          </div>
        )}

        {/* Phase 1: QUESTION Active (Waiting for Buzz) */}
        {buzzer.phase === 'QUESTION' && (
          <div className="flex flex-col items-center gap-7 py-8 text-center max-w-2xl mx-auto w-full">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                ROUND 0{buzzer.round} · 脑洞爆笑问答
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-snug tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                {buzzer.question}
              </h2>
            </div>

            {/* Giant 3D Game Show Buzzer Button */}
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition animate-pulse" />
              <button
                type="button"
                onClick={() => {
                  sound.playBuzzer();
                  onAction('BUZZER_ACTION', { action: 'BUZZ', playerId: myId });
                }}
                className="relative w-48 h-48 rounded-full border-4 border-cyan-100 bg-gradient-to-tr from-cyan-600 via-sky-400 to-cyan-200 text-slate-950 shadow-[0_10px_35px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer select-none"
              >
                <Zap className="w-14 h-14 fill-current transition-transform group-hover:scale-115 drop-shadow" />
                <span className="text-2xl font-black tracking-widest uppercase">拍灯抢答!</span>
                <span className="text-xs font-extrabold opacity-90 font-mono">HIT TO BUZZ</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>全员手机端与大屏幕同步开放抢灯，毫秒级定格首位答题手！</span>
            </div>
          </div>
        )}

        {/* Phase 2: Player Buzzed -> 4 Multiple-Choice Options */}
        {buzzer.phase === 'BUZZED' && (
          <div className="flex flex-col items-center gap-6 py-6 max-w-2xl mx-auto w-full animate-in zoom-in-95">
            <div className="text-center flex flex-col gap-2">
              <div className="inline-flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 font-bold">
                  ⚡ 抢答权已锁定
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-rose-600 text-white font-black animate-pulse">
                  <Clock className="w-3.5 h-3.5" /> 剩余 {answerTimer}s
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {buzzedPlayer?.avatar || '⚡'} 【{buzzedPlayer?.name || '本机玩家'}】拿下首发答题权！
              </h3>
              <p className="text-sm text-cyan-200/90 mt-1 font-sans">
                {buzzer.question}
              </p>
            </div>

            {/* 4 Interactive Options */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {(buzzer.options || []).map((opt, idx) => {
                const labels = ['A', 'B', 'C', 'D'];
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!canISelectOption}
                    onClick={() => {
                      if (idx === buzzer.correctIndex) {
                        sound.playSuccess();
                      } else {
                        sound.playBuzzer();
                      }
                      onAction('BUZZER_ACTION', { action: 'SELECT_OPTION', optionIndex: idx });
                    }}
                    className="p-4 rounded-xl bg-[#060a12] border-2 border-slate-800 hover:border-cyan-400 hover:bg-cyan-950/40 disabled:opacity-50 text-left flex items-center gap-3.5 transition-all cursor-pointer group shadow-lg"
                  >
                    <span className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-cyan-400 group-hover:text-slate-950 font-mono font-black text-base flex items-center justify-center shrink-0 transition">
                      {labels[idx]}
                    </span>
                    <span className="text-sm font-bold text-slate-100 group-hover:text-cyan-100 leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Phase 3: Answer Correct Reveal */}
        {buzzer.phase === 'ANSWER_REVEAL' && (
          <div className="flex flex-col items-center gap-6 py-8 text-center max-w-xl mx-auto animate-in zoom-in-95">
            <div className="text-6xl animate-bounce">🏆</div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-400">
                答对全场起立！【{buzzedPlayer?.name || '抢答选手'}】成功斩获积分！
              </h3>
              <div className="text-sm text-slate-200 mt-4 p-5 rounded-2xl bg-[#060a12] border border-emerald-500/40 shadow-xl">
                正确答案：<strong className="text-emerald-300 text-base">{buzzer.answer}</strong>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{buzzer.explanation}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onAction('BUZZER_ACTION', { action: 'NEXT' });
              }}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-xl shadow-cyan-400/30 cursor-pointer transition active:scale-95"
            >
              <ArrowRight className="w-4 h-4" />
              <span>进入下一题争霸</span>
            </button>
          </div>
        )}

        {/* Phase 4: Wheel of Doom (惩罚大转盘 - 8色高清SVG硬件加速旋转) */}
        {buzzer.phase === 'WHEEL_SPIN' && (
          <div className="flex flex-col items-center gap-5 py-4 text-center">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold">
                WHEEL OF DOOM · 答错触发命运惩罚行刑台
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                受罚行刑者：【{penaltyPlayer?.name || '抢答选手'}】
              </h3>
              <span className="text-xs text-slate-300">
                本题真实答案：<strong className="text-cyan-300">{buzzer.answer}</strong>（{buzzer.explanation}）
              </span>
            </div>

            {/* High-Contrast Colorful 8-Slice SVG Wheel + Top Golden Pointer */}
            <div className="relative flex items-center justify-center my-3">
              {/* Top Golden Pointer Arrow */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] animate-bounce">
                <svg width="42" height="44" viewBox="0 0 40 42">
                  <polygon
                    points="20,40 4,6 36,6"
                    fill="#FBBF24"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <circle cx="20" cy="12" r="4" fill="#B45309" />
                </svg>
              </div>

              {/* Outer Casino Rim */}
              <div className="relative p-3.5 rounded-full bg-gradient-to-b from-amber-400 via-amber-600 to-amber-900 shadow-[0_0_55px_rgba(245,158,11,0.5)] border-4 border-amber-200">
                {/* Rotating SVG Wheel */}
                <div
                  data-testid="penalty-wheel-rotor"
                  style={{
                    transform: `rotate(${wheelDeg}deg)`,
                    transition: isSpinning
                      ? 'transform 2.45s cubic-bezier(0.14, 0.82, 0.18, 1)'
                      : 'none',
                  }}
                  className="w-68 h-68 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-inner"
                >
                  <svg
                    viewBox="0 0 320 320"
                    className="w-full h-full block select-none"
                  >
                    <circle cx={cx} cy={cy} r={156} fill="#0f172a" />

                    {PENALTY_WHEEL_ITEMS.map((_, i) => {
                      const cfg = WHEEL_SLICE_CONFIG[i % WHEEL_SLICE_CONFIG.length];
                      const startAngleDeg = i * sliceAngle - sliceAngle / 2 - 90;
                      const endAngleDeg = i * sliceAngle + sliceAngle / 2 - 90;
                      const startRad = (startAngleDeg * Math.PI) / 180;
                      const endRad = (endAngleDeg * Math.PI) / 180;

                      const x1 = cx + r * Math.cos(startRad);
                      const y1 = cy + r * Math.sin(startRad);
                      const x2 = cx + r * Math.cos(endRad);
                      const y2 = cy + r * Math.sin(endRad);

                      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;

                      return (
                        <g key={i}>
                          <path
                            d={d}
                            fill={cfg.color}
                            stroke="#0f172a"
                            strokeWidth="3"
                          />
                          <g transform={`translate(${cx}, ${cy}) rotate(${i * sliceAngle})`}>
                            <text
                              x="0"
                              y="-106"
                              textAnchor="middle"
                              fontSize="18"
                            >
                              {cfg.badge}
                            </text>
                            <text
                              x="0"
                              y="-82"
                              textAnchor="middle"
                              fill="#ffffff"
                              fontSize="10.5"
                              fontWeight="900"
                              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.85)' }}
                            >
                              {cfg.shortLabel}
                            </text>
                          </g>
                        </g>
                      );
                    })}

                    {/* Decorative Rim Dots */}
                    {Array.from({ length: 16 }).map((_, idx) => {
                      const deg = idx * (360 / 16);
                      const rad = (deg * Math.PI) / 180;
                      const lx = cx + 148 * Math.cos(rad);
                      const ly = cy + 148 * Math.sin(rad);
                      return (
                        <circle
                          key={idx}
                          cx={lx}
                          cy={ly}
                          r="3.5"
                          fill={idx % 2 === 0 ? '#FEF08A' : '#FFFFFF'}
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* Center Spin Hub Button */}
                <button
                  type="button"
                  disabled={isSpinning}
                  onClick={handleTriggerSpinWheel}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 border-4 border-white shadow-[0_0_25px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center text-slate-950 font-black cursor-pointer hover:scale-105 active:scale-95 transition disabled:opacity-80"
                >
                  <span className="text-xs leading-none">{isSpinning ? '旋转中' : '点我'}</span>
                  <span className="text-base font-black leading-tight">{isSpinning ? '🎰' : '开转'}</span>
                </button>
              </div>
            </div>

            {buzzer.wheelResult && !isSpinning && showWheelResultCard ? (
              <div className="p-5 rounded-2xl bg-[#080408] border-2 border-rose-500 text-rose-200 max-w-md shadow-2xl animate-in zoom-in-95">
                <span className="text-xs uppercase tracking-wider text-amber-300 font-black block mb-1">
                  🎰 指针定格 · 【{penaltyPlayer?.name || '抢答选手'}】接受惩罚执行：
                </span>
                <span className="text-lg sm:text-xl font-black text-white block">
                  “{buzzer.wheelResult}”
                </span>
              </div>
            ) : (
              <div className="px-5 py-2.5 rounded-xl bg-amber-500/15 border border-amber-400/50 text-xs text-amber-300 font-bold animate-pulse">
                {isSpinning
                  ? '🎰 命运大转盘正在高速旋转中，全员屏息以待...'
                  : '👇 点击转盘中心或下方按钮旋转抽取惩罚！'}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isSpinning}
                onClick={handleTriggerSpinWheel}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:brightness-110 disabled:opacity-40 shadow-xl cursor-pointer transition active:scale-95"
              >
                <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>
                  {isSpinning ? '高速旋转中...' : '再转一次大转盘'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  onAction('BUZZER_ACTION', { action: 'NEXT' });
                }}
                className="px-7 py-3.5 rounded-xl font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 cursor-pointer transition"
              >
                惩罚执行完毕 · 进入下一题
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
