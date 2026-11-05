import React, { useState, useRef, useEffect } from 'react';
import { RoomState } from '../types/game';
import { sound } from '../utils/sound';
import { Zap, Send, Eraser, Check, ArrowLeft, Eye, ShieldAlert, Sparkles } from 'lucide-react';

interface MobileControllerProps {
  room: RoomState | null;
  playerId: string;
  initialRoomId?: string;
  onJoinRoom: (roomId: string, name: string, avatar: string) => void;
  onSendAction: (type: string, payload: any) => void;
  onSwitchToHost: () => void;
}

const AVATAR_OPTIONS = ['😎', '🐱', '🐶', '🦊', '🤖', '🦄', '🐼', '🐸', '🐵', '🦁'];

export const MobileController: React.FC<MobileControllerProps> = ({
  room,
  playerId,
  initialRoomId = '',
  onJoinRoom,
  onSendAction,
  onSwitchToHost,
}) => {
  const [inputRoomId, setInputRoomId] = useState(initialRoomId || '');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('😎');

  // Doodle state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#22D3EE');
  const [brushSize, setBrushSize] = useState(4);
  const [guessInput, setGuessInput] = useState('');

  // Undercover hold-to-peek state
  const [isHoldingPeek, setIsHoldingPeek] = useState(false);

  // Turtle Soup state
  const [soupQuestionInput, setSoupQuestionInput] = useState('');

  const player = room && playerId ? room.players[playerId] : null;

  // Touch drawing logic for Mobile Drawer
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;

    setIsDrawing(true);
    const stroke = { x, y, type: 'start' as const, color: brushColor, size: brushSize };
    onSendAction('DOODLE_STROKE', { stroke });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;

    const stroke = { x, y, type: 'draw' as const, color: brushColor, size: brushSize };
    onSendAction('DOODLE_STROKE', { stroke });
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
    const stroke = { x: 0, y: 0, type: 'end' as const, color: brushColor, size: brushSize };
    onSendAction('DOODLE_STROKE', { stroke });
  };

  // Join Room Screen
  if (!room || !player) {
    return (
      <div className="min-h-screen w-full bg-[#0a0f1d] flex flex-col justify-between p-6 select-none text-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-wider text-pink-400">
            CONTROLLER 手机控制器
          </span>
          <button
            type="button"
            onClick={onSwitchToHost}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>切换回大屏主机</span>
          </button>
        </div>

        <div className="w-full max-w-sm mx-auto flex flex-col gap-5 my-auto">
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
              加入聚会房间
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              免密快速连线，手机秒变专属手柄
            </p>
          </div>

          <div className="flex flex-col gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
            {/* Room Code Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">4位房间暗号</label>
              <input
                type="text"
                maxLength={4}
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                placeholder="例如 COOL"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-center text-xl font-mono font-bold tracking-widest text-cyan-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Name Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">你的玩家昵称</label>
              <input
                type="text"
                maxLength={10}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="比如 麦霸阿强"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Avatar Picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">挑选搞怪头像</label>
              <div className="grid grid-cols-5 gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setSelectedAvatar(av);
                    }}
                    className={`text-2xl p-2 rounded-xl border transition cursor-pointer ${
                      selectedAvatar === av
                        ? 'bg-pink-500/20 border-pink-400 scale-105 shadow-md shadow-pink-500/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={!inputRoomId.trim()}
              onClick={() => {
                sound.playSuccess();
                onJoinRoom(inputRoomId.trim(), name || '神秘玩家', selectedAvatar);
              }}
              className="w-full mt-2 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-pink-400 to-cyan-400 hover:from-pink-300 hover:to-cyan-300 shadow-lg disabled:opacity-50 cursor-pointer active:scale-95 transition"
            >
              立刻加入房间！
            </button>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-500 font-mono">
          PartyHub Mobile Gamepad · Powered by Gemini
        </div>
      </div>
    );
  }

  // --- In-Game Connected Controller View ---
  return (
    <div className="min-h-screen w-full bg-[#070a13] flex flex-col justify-between p-4 select-none text-slate-100">
      {/* Mobile Top HUD */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl p-1 bg-slate-900 rounded-lg">{player.avatar}</span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-200">{player.name}</span>
            <span className="text-[10px] font-mono text-cyan-400">积分: {player.score}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            房间: {room.id}
          </span>
          <button
            type="button"
            onClick={onSwitchToHost}
            className="text-[11px] text-slate-500 hover:text-slate-300 cursor-pointer"
          >
            切大屏
          </button>
        </div>
      </div>

      {/* Controller Mode Body based on GameType */}
      <div className="flex-1 flex flex-col justify-center my-4">
        {/* 1. LOBBY STATE */}
        {room.gameType === 'LOBBY' && (
          <div className="flex flex-col items-center gap-5 text-center p-6 bg-slate-900/60 border border-slate-800 rounded-3xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl animate-pulse">
              🎮
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">已就位，等待大屏开始！</h3>
              <p className="text-xs text-slate-400 mt-1">
                房主正在大屏幕挑选心仪的聚会游戏，请盯紧大屏~
              </p>
            </div>
          </div>
        )}

        {/* 2. UNDERCOVER CONTROLLER */}
        {room.gameType === 'UNDERCOVER' && room.undercover && (
          <div className="flex flex-col gap-4">
            {/* Hold to Peek Secret Word */}
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                SECRET WORD 秘密词条
              </span>

              <button
                type="button"
                onMouseDown={() => setIsHoldingPeek(true)}
                onMouseUp={() => setIsHoldingPeek(false)}
                onTouchStart={() => setIsHoldingPeek(true)}
                onTouchEnd={() => setIsHoldingPeek(false)}
                className={`w-full py-8 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isHoldingPeek
                    ? 'bg-amber-950/80 border-amber-400 shadow-lg scale-95'
                    : 'bg-slate-950 border-dashed border-slate-700 hover:border-amber-500/50'
                }`}
              >
                {isHoldingPeek ? (
                  <>
                    <span className="text-xs text-amber-300">你的词语是：</span>
                    <span className="text-3xl font-black text-amber-300">
                      【{room.undercover.playerWords[player.id] || '平民'}】
                    </span>
                  </>
                ) : (
                  <>
                    <Eye className="w-6 h-6 text-slate-400 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-300">
                      按住此区域偷看秘密词语（松开即隐藏）
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Voting buttons if in VOTING phase */}
            {room.undercover.phase === 'VOTING' && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-300">投出你怀疑的卧底：</span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(room.players)
                    .filter((p) => p.id !== player.id && !room.undercover?.eliminatedPlayerIds.includes(p.id))
                    .map((target) => {
                      const voted = room.undercover?.votes[player.id] === target.id;
                      return (
                        <button
                          key={target.id}
                          type="button"
                          onClick={() => {
                            sound.playPop();
                            onSendAction('UNDERCOVER_ACTION', {
                              action: 'VOTE',
                              voterId: player.id,
                              targetId: target.id,
                            });
                          }}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition ${
                            voted
                              ? 'bg-rose-500/20 border-rose-400 ring-2 ring-rose-400 text-rose-300'
                              : 'bg-slate-900 border-slate-800 text-slate-200'
                          }`}
                        >
                          <span className="text-xl">{target.avatar}</span>
                          <span className="text-xs font-bold truncate">{target.name}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. DOODLE CONTROLLER */}
        {room.gameType === 'DOODLE' && room.doodle && (
          <div className="flex flex-col gap-3">
            {room.doodle.currentDrawerId === player.id ? (
              // Drawer Mode: Touch Drawing Canvas
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-pink-950/40 border border-pink-500/40 rounded-xl text-center">
                  <span className="text-xs text-pink-300">你要画的词条：</span>
                  <span className="text-xl font-black text-pink-300 block">
                    【{room.doodle.prompt}】
                  </span>
                </div>

                {/* Touch Canvas */}
                <div className="w-full aspect-[4/3] bg-slate-950 rounded-2xl border-2 border-pink-500/40 shadow-inner overflow-hidden touch-none relative">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={300}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="w-full h-full cursor-crosshair"
                  />
                </div>

                {/* Brush Colors Palette */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    {['#22D3EE', '#EC4899', '#FBBF24', '#4ADE80', '#FFFFFF'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setBrushColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-7 h-7 rounded-full border-2 transition ${
                          brushColor === c ? 'border-white scale-110 shadow' : 'border-slate-800'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      onSendAction('DOODLE_AI_ROAST', {});
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-pink-400 text-slate-950 cursor-pointer"
                  >
                    画好了！提交AI点评
                  </button>
                </div>
              </div>
            ) : (
              // Guesser Mode: Text guess input
              <div className="flex flex-col gap-4 py-8">
                <div className="text-center p-4 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400">盯着大屏幕上的实时笔迹！</span>
                  <h4 className="text-base font-bold text-slate-100 mt-1">你觉得画的是什么？</h4>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    placeholder="输入你的猜测..."
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:border-pink-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!guessInput.trim()) return;
                      sound.playPop();
                      onSendAction('DOODLE_GUESS', { playerId: player.id, text: guessInput.trim() });
                      setGuessInput('');
                    }}
                    className="px-5 py-3 rounded-xl font-bold bg-pink-400 text-slate-950 hover:bg-pink-300 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. BUZZER CONTROLLER */}
        {room.gameType === 'BUZZER' && room.buzzer && (
          <div className="flex flex-col items-center justify-center py-6 gap-6">
            <span className="text-xs font-mono text-cyan-400 tracking-wider">
              {room.buzzer.phase === 'QUESTION' ? '准备抢麦！' : '抢答已锁定'}
            </span>

            {/* Giant Electro Buzzer Button */}
            <button
              type="button"
              disabled={room.buzzer.phase !== 'QUESTION'}
              onClick={() => {
                sound.playBuzzer();
                if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
                onSendAction('BUZZER_ACTION', { action: 'BUZZ', playerId: player.id });
              }}
              className={`w-60 h-60 rounded-full border-4 flex flex-col items-center justify-center gap-2 font-black transition-all cursor-pointer shadow-2xl ${
                room.buzzer.phase === 'QUESTION'
                  ? 'bg-gradient-to-tr from-cyan-600 via-sky-500 to-cyan-400 border-cyan-200 text-slate-950 shadow-cyan-500/50 hover:scale-105 active:scale-95 animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-slate-500 opacity-60'
              }`}
            >
              <Zap className="w-16 h-16 fill-current" />
              <span className="text-2xl tracking-widest">抢 答 !</span>
            </button>

            <span className="text-xs text-slate-400">
              毫秒级手速竞争，答错即转动命运惩罚转盘！
            </span>
          </div>
        )}

        {/* 5. TURTLE SOUP CONTROLLER */}
        {room.gameType === 'TURTLE_SOUP' && room.turtleSoup && (
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-slate-300">
              <span className="font-bold text-emerald-400">汤面案情：</span>
              {room.turtleSoup.soupFace}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300">
                向AI法官提问（必须是一般疑问句）：
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={soupQuestionInput}
                  onChange={(e) => setSoupQuestionInput(e.target.value)}
                  placeholder="例如：死者认识酒保吗？"
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!soupQuestionInput.trim()) return;
                    sound.playPop();
                    onSendAction('TURTLE_SOUP_ACTION', {
                      action: 'ASK',
                      playerId: player.id,
                      question: soupQuestionInput.trim(),
                    });
                    setSoupQuestionInput('');
                  }}
                  className="px-5 py-3 rounded-xl font-bold bg-emerald-400 text-slate-950 hover:bg-emerald-300 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Template Questions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['与职业有关吗？', '是自杀吗？', '有第三方在场吗？', '与光线有关吗？'].map((tmpl) => (
                  <button
                    key={tmpl}
                    type="button"
                    onClick={() => setSoupQuestionInput(tmpl)}
                    className="text-[11px] px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    + {tmpl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-[10px] text-slate-600 font-mono">
        PartyHub Mobile · 线下派对无线控制器
      </div>
    </div>
  );
};
