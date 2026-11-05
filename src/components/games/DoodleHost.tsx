import React, { useRef, useEffect, useState } from 'react';
import { RoomState, DoodleStroke } from '../../types/game';
import { AIHostBot } from '../AIHostBot';
import { sound } from '../../utils/sound';
import {
  Sparkles,
  Eraser,
  Send,
  RotateCcw,
  Eye,
  EyeOff,
  Gavel,
  DollarSign,
  Users,
  Paintbrush,
  Lightbulb,
} from 'lucide-react';

interface DoodleHostProps {
  room: RoomState;
  currentPlayerId: string;
  onAction: (action: string, payload?: any) => void;
  onBackToLobby: () => void;
}

const BRUSH_COLORS = ['#22D3EE', '#EC4899', '#FBBF24', '#4ADE80', '#A855F7', '#F87171', '#FFFFFF'];

export const DoodleHost: React.FC<DoodleHostProps> = ({
  room,
  currentPlayerId,
  onAction,
  onBackToLobby,
}) => {
  const allPlayerIds = Object.keys(room.players);
  const myId = currentPlayerId || room.hostPlayerId || allPlayerIds[0] || 'drawer';

  const doodle = room.doodle || {
    drawerOrder: allPlayerIds,
    currentDrawerIndex: 0,
    currentDrawerId: myId,
    coOpMode: false,
    prompt: '偷吃外卖的猫',
    category: '搞笑动物',
    hint: '6个字 · 搞笑动物',
    round: 1,
    maxRounds: 3,
    phase: 'DRAWING' as const,
    timeLeft: 60,
    strokes: [],
    guessedPlayerIds: [],
    guesses: [],
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [timer, setTimer] = useState(60);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#22D3EE');
  const [brushSize, setBrushSize] = useState(5);
  const [guessInput, setGuessInput] = useState('');
  const [showPromptSecret, setShowPromptSecret] = useState(true);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const isMePrimaryDrawer =
    doodle.currentDrawerId === myId || Object.keys(room.players).length <= 1;
  const canIDraw = isMePrimaryDrawer || !!doodle.coOpMode;
  const drawer = room.players[doodle.currentDrawerId];

  // Redraw canvas whenever doodle.strokes changes (multi-author & missing-start resilient)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const strokes = doodle.strokes || [];
    const lastPosByAuthor: Record<string, { x: number; y: number }> = {};

    strokes.forEach((s) => {
      const authorKey = s.authorId || 'default';
      const px = s.x * canvas.width;
      const py = s.y * canvas.height;
      const lineWidth = (s.size || 5) * (canvas.width / 400);
      const color = s.color || '#22D3EE';

      if (s.type === 'start') {
        lastPosByAuthor[authorKey] = { x: px, y: py };
        // Draw initial dot so single taps are always visible
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(px, py, lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (s.type === 'draw') {
        const prev = lastPosByAuthor[authorKey];
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        if (prev) {
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(px, py);
          ctx.stroke();
        } else {
          // Resilient fallback if 'start' packet was missed
          ctx.arc(px, py, lineWidth / 2, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
        lastPosByAuthor[authorKey] = { x: px, y: py };
      } else if (s.type === 'end') {
        const prev = lastPosByAuthor[authorKey];
        if (prev) {
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = lineWidth;
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
        delete lastPosByAuthor[authorKey];
      }
    });
  }, [doodle.strokes]);

  // Round countdown
  useEffect(() => {
    setTimer(60);
  }, [doodle.round, doodle.prompt]);

  useEffect(() => {
    if (doodle.phase !== 'DRAWING') return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [doodle.phase]);

  const emitStroke = (type: 'start' | 'draw' | 'end', clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Number(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)).toFixed(4));
    const y = Number(Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)).toFixed(4));

    // Filter out tiny duplicate move events to keep WebSocket stream ultra-fast
    if (type === 'draw' && lastPointRef.current) {
      const dx = x - lastPointRef.current.x;
      const dy = y - lastPointRef.current.y;
      if (dx * dx + dy * dy < 0.00004) return;
    }
    lastPointRef.current = type === 'end' ? null : { x, y };

    const stroke: DoodleStroke = {
      x,
      y,
      type,
      color: brushColor,
      size: brushSize,
      authorId: myId,
    };
    onAction('DOODLE_STROKE', { stroke });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canIDraw) return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore pointer capture error on synthetic events
    }
    setIsDrawing(true);
    emitStroke('start', e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canIDraw) return;
    e.preventDefault();
    emitStroke('draw', e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canIDraw) return;
    e.preventDefault();
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
    setIsDrawing(false);
    emitStroke('end', e.clientX, e.clientY);
  };

  const handleClear = () => {
    sound.playPop();
    onAction('DOODLE_CLEAR');
  };

  const handleTakeBrush = () => {
    sound.playSuccess();
    onAction('DOODLE_ACTION', { action: 'SET_DRAWER', targetDrawerId: myId });
  };

  const handleToggleCoOp = () => {
    sound.playPop();
    onAction('DOODLE_ACTION', { action: 'TOGGLE_COOP', coOpMode: !doodle.coOpMode });
  };

  const handleRevealHint = () => {
    sound.playPop();
    onAction('DOODLE_ACTION', { action: 'REVEAL_HINT' });
  };

  const handleSubmitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim()) return;
    sound.playPop();
    onAction('DOODLE_GUESS', {
      playerId: myId,
      text: guessInput.trim(),
    });
    setGuessInput('');
  };

  const handleStartAuction = () => {
    sound.playGavel();
    onAction('DOODLE_ACTION', { action: 'START_AUCTION', estimatedPrice: 660 });
  };

  const handleBid = (amount: number) => {
    sound.playGavel();
    onAction('DOODLE_ACTION', { action: 'BID_AUCTION', bidAmount: amount });
  };

  const handleFinishAuction = () => {
    sound.playSuccess();
    onAction('DOODLE_ACTION', { action: 'FINISH_AUCTION' });
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 py-2">
      {/* Top AI Host Companion */}
      <AIHostBot
        mood={room.aiMood === 'laugh' ? 'sarcastic' : room.aiMood}
        quip={room.aiQuip}
      />

      {/* Main Game Container */}
      <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4">
        {/* Header HUD */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
              🎨
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-100">灵魂画手 · 毒舌画廊</h3>
              <span className="text-xs text-slate-400">
                房间号: <strong className="font-mono text-cyan-400">{room.id}</strong> · 第 {doodle.round} 轮 · 当前主笔：
                <strong className="text-pink-400">{drawer?.name || '神秘画手'}</strong>
                {doodle.coOpMode && (
                  <strong className="text-emerald-400 ml-1">（全员同屏合画已开启）</strong>
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleToggleCoOp}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer flex items-center gap-1.5 transition ${
                doodle.coOpMode
                  ? 'text-emerald-300 bg-emerald-950/70 border-emerald-500/50'
                  : 'text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border-cyan-500/40'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{doodle.coOpMode ? '同屏合画中 (点此切单人)' : '开启全员同屏合画'}</span>
            </button>

            {!isMePrimaryDrawer && (
              <button
                type="button"
                onClick={handleTakeBrush}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-pink-200 bg-pink-600/30 hover:bg-pink-600/50 border border-pink-400/50 cursor-pointer flex items-center gap-1 transition"
              >
                <Paintbrush className="w-3.5 h-3.5" />
                <span>我来当主笔</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleStartAuction}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 cursor-pointer flex items-center gap-1.5 transition"
            >
              <Gavel className="w-3.5 h-3.5 text-amber-400" />
              <span>进AI拍卖行</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onAction('DOODLE_NEXT_TURN');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-pink-300 bg-pink-950/60 hover:bg-pink-900 border border-pink-800/80 cursor-pointer transition"
            >
              换人画新题
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

        {/* Secret Word Prompt Bar (For Primary Drawer) vs Guesser Hint Bar */}
        {isMePrimaryDrawer ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/30">
            <div className="flex items-center gap-2">
              <span className="text-xs text-pink-300 font-bold">
                你是本轮灵魂画手！你画的每一笔都会实时同步到所有玩家的屏幕上：
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRevealHint}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>给全场发字词提示</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPromptSecret(!showPromptSecret)}
                className="p-1.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                aria-label={showPromptSecret ? '隐藏词汇' : '显示词汇'}
                title={showPromptSecret ? '隐藏词汇' : '显示词汇'}
              >
                {showPromptSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              <div className="px-4 py-1.5 rounded-xl bg-slate-950 border border-pink-500/50">
                <span className="font-bold text-base text-pink-300">
                  {showPromptSecret ? doodle.prompt : '••••••'}
                </span>
                <span className="text-xs text-slate-400 ml-2">({doodle.category})</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-300">
              【{drawer?.name || '画手'}】正在作画！谜底提示：
              <strong className="text-cyan-400 font-mono ml-1">{doodle.hint}</strong>
            </span>
            <div className="flex items-center gap-3">
              {!doodle.coOpMode && (
                <button
                  type="button"
                  onClick={handleTakeBrush}
                  className="text-xs text-pink-400 hover:text-pink-300 underline cursor-pointer font-bold"
                >
                  抢过画笔我来画
                </button>
              )}
              <span className="text-xs font-mono font-bold text-amber-400">
                剩余时间: {timer}s
              </span>
            </div>
          </div>
        )}

        {/* Phase 1: DRAWING Canvas & Live Guess Feed */}
        {doodle.phase === 'DRAWING' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 8 Cols: Canvas Arena & Palette */}
            <div className="lg:col-span-8 flex flex-col gap-3">
              <div className="relative w-full aspect-[4/3] bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden shadow-inner touch-none">
                <canvas
                  ref={canvasRef}
                  data-testid="doodle-canvas"
                  width={600}
                  height={450}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className={`w-full h-full ${canIDraw ? 'cursor-crosshair' : 'cursor-default'}`}
                />

                {!canIDraw && (
                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl border border-cyan-500/40 text-xs text-cyan-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>正在实时同步【{drawer?.name}】的画板（笔迹数: {doodle.strokes.length}）</span>
                  </div>
                )}
              </div>

              {/* Drawing Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                {canIDraw ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">画笔色彩:</span>
                      <div className="flex items-center gap-1.5">
                        {BRUSH_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            aria-label={`画笔颜色 ${c}`}
                            onClick={() => {
                              sound.playPop();
                              setBrushColor(c);
                            }}
                            style={{ backgroundColor: c }}
                            className={`w-6 h-6 rounded-full border-2 transition cursor-pointer ${
                              brushColor === c ? 'scale-125 border-white shadow' : 'border-transparent hover:scale-110'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400">粗细:</span>
                        {[3, 6, 12].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => {
                              sound.playPop();
                              setBrushSize(sz);
                            }}
                            className={`px-2 py-1 rounded text-xs font-mono font-bold border transition cursor-pointer ${
                              brushSize === sz
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                                : 'bg-slate-900 text-slate-400 border-slate-800'
                            }`}
                          >
                            {sz === 3 ? '细' : sz === 6 ? '中' : '粗'}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleClear}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-900/50 cursor-pointer"
                      >
                        <Eraser className="w-3.5 h-3.5" />
                        <span>清空画布</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                    <span>当前你是【猜词玩家】，请在右侧输入框猜词抢分！如果想一起画：</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTakeBrush}
                        className="px-3 py-1 rounded-lg bg-pink-500/20 border border-pink-500/40 text-pink-300 font-bold cursor-pointer"
                      >
                        🙋 换我当主笔
                      </button>
                      <button
                        type="button"
                        onClick={handleToggleCoOp}
                        className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold cursor-pointer"
                      >
                        🤝 开启同屏合画
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action: Reveal & Call AI Roast or Start Auction */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleStartAuction}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 shadow-lg cursor-pointer"
                >
                  <Gavel className="w-3.5 h-3.5 text-slate-950" />
                  <span>画好了 · 开启【AI艺术拍卖行】疯狂竞拍！</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    onAction('DOODLE_AI_ROAST');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>召唤AI毒舌鉴宝</span>
                </button>
              </div>
            </div>

            {/* Right 4 Cols: Guess Input & Live Guesses Feed */}
            <div className="lg:col-span-4 bg-slate-950/85 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-full min-h-[420px] gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    输入猜测抢答 (+80分)
                  </span>
                  <span className="text-[11px] font-mono text-pink-400">{doodle.hint}</span>
                </div>
                <form onSubmit={handleSubmitGuess} className="flex gap-2">
                  <input
                    type="text"
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    placeholder={`猜猜画的是什么 (${doodle.category})...`}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-pink-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-pink-400 text-slate-950 hover:bg-pink-300 cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>抢猜</span>
                  </button>
                </form>
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 border-t border-slate-800/80 pt-3 max-h-80">
                <span className="text-[11px] font-semibold text-slate-400">
                  实时竞猜弹幕 ({doodle.guesses.length})
                </span>
                {doodle.guesses.length === 0 ? (
                  <div className="my-auto text-xs text-slate-500 text-center py-8">
                    在上方输入框猜猜画的是什么，猜对直接加 80 分！
                  </div>
                ) : (
                  doodle.guesses.map((g, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                        g.correct
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                          : g.close
                          ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold text-slate-400 shrink-0">{g.playerName}:</span>
                        <span className="font-bold truncate">{g.text}</span>
                      </div>
                      {g.correct ? (
                        <span className="text-emerald-400 font-bold shrink-0">🎉 +80分</span>
                      ) : g.close ? (
                        <span className="text-amber-400 font-bold shrink-0">🔥 接近答案</span>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Phase: AUCTION HOUSE (AI艺术拍卖行) */}
        {doodle.phase === 'AUCTION' && (
          <div className="flex flex-col items-center justify-center py-6 px-4 gap-5 bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/40 rounded-2xl shadow-2xl animate-in zoom-in-95">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-xs uppercase mb-2 animate-pulse">
                <Gavel className="w-4 h-4 text-amber-400" />
                AI艺术拍卖行 · 现场举牌加价中
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                《{doodle.prompt}》抽象旷世神作
              </h3>
              <p className="text-xs text-amber-200/80 mt-1">
                AI艺术馆官方估值：<strong className="text-amber-400 font-mono text-base">{doodle.auction?.estimatedPrice || 660}万</strong> 虚拟估价！
              </p>
            </div>

            {/* Current Highest Bid Box */}
            <div className="w-full max-w-md bg-slate-900 border border-amber-500/50 rounded-2xl p-5 text-center flex flex-col gap-2 shadow-xl">
              <span className="text-xs text-slate-400 uppercase tracking-widest">当前最高出价</span>
              <div className="text-4xl sm:text-5xl font-black text-amber-300 font-mono drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                {doodle.auction?.currentBid || 200} <span className="text-sm font-sans text-amber-400">分</span>
              </div>
              <div className="text-xs text-slate-300">
                出价藏家：<strong className="text-cyan-300 font-bold">{doodle.auction?.highestBidderName || '尚无藏家举牌'}</strong>
              </div>
              <div className="text-[11px] text-slate-500">
                累计叫价 {doodle.auction?.bidsCount || 0} 次 · 竞拍胜出者与画手均获 +50 荣耀分！
              </div>
            </div>

            {/* Live Bidding Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[20, 50, 100].map((increment) => {
                const targetPrice = (doodle.auction?.currentBid || 200) + increment;
                return (
                  <button
                    key={increment}
                    type="button"
                    onClick={() => handleBid(targetPrice)}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-lg active:scale-95 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <DollarSign className="w-4 h-4 text-slate-950" />
                    <span>加价 +{increment} (出价{targetPrice})</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleFinishAuction}
              className="mt-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-slate-200 cursor-pointer flex items-center gap-2"
            >
              <Gavel className="w-4 h-4 text-amber-400" />
              <span>一锤定音 · 立即敲钟成交并揭晓答案</span>
            </button>
          </div>
        )}

        {/* Phase: Reveal & AI Roast */}
        {(doodle.phase === 'REVEAL' || doodle.phase === 'ROAST') && (
          <div className="flex flex-col items-center gap-5 py-4 text-center max-w-3xl mx-auto w-full">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono uppercase tracking-wider text-pink-400">
                ANSWER REVEAL 本轮真实词条
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-pink-300">
                【{doodle.prompt}】
              </h2>
            </div>

            {doodle.aiReview ? (
              <div className="w-full bg-slate-950/90 border border-pink-500/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🏛️</span>
                    <div>
                      <h4 className="text-base font-bold text-pink-300">
                        {doodle.aiReview.title}
                      </h4>
                      <span className="text-xs text-slate-400">AI艺术馆毒舌馆长鉴定报告</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-400">灵魂艺术评分</span>
                    <span className="text-3xl font-black font-mono text-cyan-400 tabular-nums">
                      {doodle.aiReview.score}
                      <span className="text-sm text-slate-500">/100</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm text-slate-200 leading-relaxed">
                    “{doodle.aiReview.critique}”
                  </p>
                  <p className="text-xs text-pink-400 font-bold">
                    🔥 馆长锐评：“{doodle.aiReview.roast}”
                  </p>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onAction('DOODLE_AI_ROAST');
                }}
                className="px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-300 cursor-pointer shadow-lg"
              >
                召唤AI馆长毒舌打分
              </button>
            )}

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  onAction('DOODLE_NEXT_TURN');
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-950 bg-pink-400 hover:bg-pink-300 shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>下一位画手接力作画</span>
              </button>

              <button
                type="button"
                onClick={onBackToLobby}
                className="px-6 py-3 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                返回大厅
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
