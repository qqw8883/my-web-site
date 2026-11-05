import React, { useState, useRef, useEffect } from 'react';
import { RoomState, ItemCardType } from '../../types/game';
import { AIHostBot } from '../AIHostBot';
import { sound } from '../../utils/sound';
import { Zap, RotateCw, ArrowRight, Bomb, Crown, Flame, Clock } from 'lucide-react';
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
    const sliceDeg = 360 / totalItems; // 45 deg per slice
    const safeIdx = ((targetIdx % totalItems) + totalItems) % totalItems;
    // Slice safeIdx is at +safeIdx * 45 deg clockwise from top (12 o'clock).
    // To bring it to 0 deg (12 o'clock pointer), wheel rotation mod 360 must be (360 - safeIdx * sliceDeg) % 360.
    const desiredMod = (360 - safeIdx * sliceDeg) % 360;
    const currentMod = ((currentDegRef.current % 360) + 360) % 360;
    let delta = desiredMod - currentMod;
    if (delta <= 0) delta += 360;

    // Spin 6 full turns (2160 deg) + delta
    const nextDeg = currentDegRef.current + 360 * 6 + delta;
    currentDegRef.current = nextDeg;

    // Force next frame so CSS transition always triggers cleanly
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

  // Trigger synchronized wheel spin whenever entering WHEEL_SPIN or when wheelSpinId updates
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

  // Precompute 8 SVG sector paths for a 320x320 wheel
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

      {/* Main Game Stage Container */}
      <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4">
        {/* Header HUD */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              ⚡
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-100">手速抢答 · 命运大转盘</h3>
              <span className="text-xs text-slate-400">
                房间号: <strong className="font-mono text-cyan-400">{room.id}</strong> · 第 {buzzer.round} / {buzzer.maxRounds} 题
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onAction('BUZZER_ACTION', { action: 'NEXT' });
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/80 cursor-pointer transition"
            >
              换一题
            </button>
            <button
              type="button"
              onClick={onBackToLobby}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer transition"
            >
              返回大厅
            </button>
          </div>
        </div>

        {/* Tactical Item Cards Deck Bar */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400">你的战术道具卡:</span>
            <span className="text-[11px] text-slate-400">（抢答前甩出，抢占绝地先机）</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={myItems.bombSteal <= 0 || buzzer.phase !== 'QUESTION'}
              onClick={() => handleUseCard('BOMB_STEAL')}
              className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer transition active:scale-95"
            >
              <Bomb className="w-3.5 h-3.5 text-rose-400" />
              <span>炸弹偷分卡 ({myItems.bombSteal})</span>
            </button>

            <button
              type="button"
              disabled={myItems.supremeBuzz <= 0 || buzzer.phase !== 'QUESTION'}
              onClick={() => handleUseCard('SUPREME_BUZZ')}
              className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer transition active:scale-95"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>绝对霸权卡 ({myItems.supremeBuzz})</span>
            </button>

            <button
              type="button"
              disabled={myItems.doubleCombo <= 0 || buzzer.phase !== 'QUESTION'}
              onClick={() => handleUseCard('DOUBLE_COMBO')}
              className="px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer transition active:scale-95"
            >
              <Flame className="w-3.5 h-3.5 text-indigo-400" />
              <span>连击双倍卡 ({myItems.doubleCombo})</span>
            </button>
          </div>
        </div>

        {/* Active Item Used Notification */}
        {buzzer.activeItemUsed && (
          <div className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 border border-pink-400/50 rounded-xl px-4 py-2 flex items-center gap-2 animate-pulse text-xs text-white">
            <span className="font-extrabold text-amber-300">【{buzzer.activeItemUsed.playerName}】已启用道具：</span>
            <span className="font-black">
              {buzzer.activeItemUsed.cardType === 'BOMB_STEAL' && '💥 炸弹偷分卡（若答对顺走榜首50分！）'}
              {buzzer.activeItemUsed.cardType === 'SUPREME_BUZZ' && '👑 绝对霸权卡（强行锁死抢答特权！）'}
              {buzzer.activeItemUsed.cardType === 'DOUBLE_COMBO' && '🔥 连击双倍卡（答对得分x2，答错受刑x2！）'}
            </span>
          </div>
        )}

        {/* Phase 1: QUESTION Active (Waiting for Buzz) */}
        {buzzer.phase === 'QUESTION' && (
          <div className="flex flex-col items-center gap-6 py-6 text-center max-w-2xl mx-auto w-full">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                ROUND {buzzer.round} · 脑洞神题竞猜
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-100 leading-snug">
                {buzzer.question}
              </h2>
            </div>

            {/* Giant Interactive Buzzer Button */}
            <button
              type="button"
              onClick={() => {
                sound.playBuzzer();
                onAction('BUZZER_ACTION', { action: 'BUZZ', playerId: myId });
              }}
              className="group relative w-44 h-44 rounded-full border-4 border-cyan-200 bg-gradient-to-tr from-cyan-600 via-sky-500 to-cyan-300 text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.45)] hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-12 h-12 fill-current transition-transform group-hover:scale-110" />
              <span className="text-xl font-black tracking-widest">拍下抢麦!</span>
              <span className="text-[11px] font-bold opacity-80">点击立刻锁定答题权</span>
            </button>

            <span className="text-xs text-slate-400">
              所有已加入房间的手机与当前屏幕均可拍击抢答，先拍先得！
            </span>
          </div>
        )}

        {/* Phase 2: Player Buzzed -> 4 Multiple-Choice Options */}
        {buzzer.phase === 'BUZZED' && (
          <div className="flex flex-col items-center gap-5 py-4 max-w-2xl mx-auto w-full">
            <div className="text-center flex flex-col gap-1.5">
              <div className="inline-flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
                <span>BUZZ LOCKED 抢麦成功</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300">
                  <Clock className="w-3 h-3" /> {answerTimer}s
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-100">
                {buzzedPlayer?.avatar || '⚡'} 【{buzzedPlayer?.name || '本机玩家'}】抢到了答题权！
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                题目：{buzzer.question}
              </p>
            </div>

            {/* 4 Interactive Options */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
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
                    className="p-4 rounded-xl bg-slate-950/90 border-2 border-slate-800 hover:border-cyan-400 hover:bg-cyan-950/30 disabled:opacity-50 text-left flex items-center gap-3 transition cursor-pointer group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-cyan-400 group-hover:text-slate-950 font-mono font-bold text-sm flex items-center justify-center shrink-0 transition">
                      {labels[idx]}
                    </span>
                    <span className="text-sm font-bold text-slate-100">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Phase 3: Answer Correct Reveal */}
        {buzzer.phase === 'ANSWER_REVEAL' && (
          <div className="flex flex-col items-center gap-5 py-6 text-center max-w-xl mx-auto">
            <div className="text-5xl">🎉</div>
            <div>
              <h3 className="text-2xl font-black text-emerald-400">
                回答正确！【{buzzedPlayer?.name || '抢答选手'}】拿下积分！
              </h3>
              <p className="text-sm text-slate-200 mt-3 p-4 rounded-xl bg-slate-950 border border-emerald-500/30">
                正确答案：<strong className="text-emerald-300">{buzzer.answer}</strong>
                <br />
                <span className="text-xs text-slate-400 mt-1 block">{buzzer.explanation}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onAction('BUZZER_ACTION', { action: 'NEXT' });
              }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-lg cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>继续下一题抢答</span>
            </button>
          </div>
        )}

        {/* Phase 4: Wheel of Doom (惩罚大转盘 - 8色高清SVG硬件加速旋转) */}
        {buzzer.phase === 'WHEEL_SPIN' && (
          <div className="flex flex-col items-center gap-4 py-3 text-center">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400">
                WHEEL OF DOOM 答错触发命运惩罚大转盘
              </span>
              <h3 className="text-2xl font-black text-slate-100">
                受罚玩家：【{penaltyPlayer?.name || '抢答选手'}】
              </h3>
              <span className="text-xs text-slate-400">
                本题正确答案：<strong className="text-cyan-300">{buzzer.answer}</strong>（{buzzer.explanation}）
              </span>
            </div>

            {/* High-Contrast Colorful 8-Slice SVG Wheel + Top Golden Pointer */}
            <div className="relative flex items-center justify-center my-2">
              {/* Top Golden Pointer Arrow */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                <svg width="40" height="42" viewBox="0 0 40 42">
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
              <div className="relative p-3 rounded-full bg-gradient-to-b from-amber-400 via-amber-600 to-amber-900 shadow-[0_0_45px_rgba(245,158,11,0.45)] border-4 border-amber-200">
                {/* Rotating SVG Wheel */}
                <div
                  data-testid="penalty-wheel-rotor"
                  style={{
                    transform: `rotate(${wheelDeg}deg)`,
                    transition: isSpinning
                      ? 'transform 2.45s cubic-bezier(0.14, 0.82, 0.18, 1)'
                      : 'none',
                  }}
                  className="w-64 h-64 sm:w-76 sm:h-76 rounded-full overflow-hidden shadow-inner"
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
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-18 h-18 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 border-4 border-white shadow-[0_0_20px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center text-slate-950 font-black cursor-pointer hover:scale-105 active:scale-95 transition disabled:opacity-80"
                >
                  <span className="text-xs leading-none">{isSpinning ? '旋转中' : '点我'}</span>
                  <span className="text-sm font-black leading-tight">{isSpinning ? '🎰' : '重转'}</span>
                </button>
              </div>
            </div>

            {buzzer.wheelResult && !isSpinning && showWheelResultCard ? (
              <div className="p-4 rounded-xl bg-rose-950/80 border-2 border-rose-400/70 text-rose-200 max-w-md shadow-xl animate-in zoom-in-95">
                <span className="text-xs uppercase tracking-wider text-amber-300 font-bold block mb-1">
                  🎰 指针定格 · 【{penaltyPlayer?.name || '抢答选手'}】请接受大冒险惩罚：
                </span>
                <span className="text-base sm:text-lg font-extrabold text-white block">
                  {buzzer.wheelResult}
                </span>
              </div>
            ) : (
              <div className="px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-xs text-amber-300 font-bold animate-pulse">
                {isSpinning
                  ? '🎰 命运大转盘正在高速旋转中，全员屏息以待...'
                  : '👇 点击转盘中心或下方按钮立即旋转抽取惩罚！'}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                type="button"
                disabled={isSpinning}
                onClick={handleTriggerSpinWheel}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 disabled:opacity-40 shadow-lg cursor-pointer transition active:scale-95"
              >
                <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>
                  {isSpinning ? '命运之轮高速旋转中...' : '再转一次大转盘'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  onAction('BUZZER_ACTION', { action: 'NEXT' });
                }}
                className="px-6 py-3 rounded-xl font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer transition"
              >
                惩罚完毕 · 下一题
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
