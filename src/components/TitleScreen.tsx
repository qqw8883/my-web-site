import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, PlusCircle, LogIn } from 'lucide-react';
import { sound } from '../utils/sound';

interface TitleScreenProps {
  initialRoomCode?: string;
  onCreateRoom: (name: string, avatar: string) => void;
  onJoinRoom: (roomId: string, name: string, avatar: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const AVATAR_OPTIONS = ['👑', '😎', '🐱', '🐶', '🦊', '🤖', '🦄', '🐼', '🐸', '🦁'];

export const TitleScreen: React.FC<TitleScreenProps> = ({
  initialRoomCode = '',
  onCreateRoom,
  onJoinRoom,
  isMuted,
  onToggleMute,
}) => {
  const [name, setName] = useState('派对达人');
  const [avatar, setAvatar] = useState('👑');
  const [roomCode, setRoomCode] = useState(initialRoomCode.toUpperCase());

  useEffect(() => {
    // Check url search params on mount
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get('room') || params.get('r');
      if (urlRoom && urlRoom.trim()) {
        const cleaned = urlRoom.trim().toUpperCase().slice(0, 4);
        setRoomCode(cleaned);
        setName('开黑好友');
        setAvatar('😎');
      }
    }
    if (initialRoomCode) {
      setRoomCode(initialRoomCode.toUpperCase());
      setAvatar('😎');
      setName('神秘玩家');
    }
  }, [initialRoomCode]);

  // Enter / Space shortcut when not typing in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        sound.playSuccess();
        if (roomCode.trim().length === 4) {
          onJoinRoom(roomCode.trim().toUpperCase(), name.trim() || '神秘玩家', avatar);
        } else {
          onCreateRoom(name.trim() || '派对房主', avatar);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [roomCode, name, avatar, onCreateRoom, onJoinRoom]);

  const handleQuickCreate = () => {
    sound.playSuccess();
    onCreateRoom(name.trim() || '派对房主', avatar);
  };

  const handleQuickJoin = () => {
    if (!roomCode.trim()) return;
    sound.playSuccess();
    onJoinRoom(roomCode.trim().toUpperCase(), name.trim() || '神秘玩家', avatar);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-5 md:p-10 overflow-hidden bg-[#070a13] select-none">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_40%,#000_70%,transparent_100%)]" />

      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-400">
          <span>PARTYHUB AI · 一人建房 · 填房间号或扫码即玩</span>
        </div>

        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? '取消静音' : '静音'}
          className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full my-4">
        {/* Bespoke Inline SVG Title Lockup */}
        <div className="w-full max-w-xl mb-4">
          <svg viewBox="0 0 600 120" className="w-full h-auto drop-shadow-[0_0_30px_rgba(34,211,238,0.28)]">
            <defs>
              <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="50%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            <path
              d="M 65 65 L 20 42 L 85 32 Z M 535 65 L 580 42 L 515 32 Z"
              fill="rgba(168, 85, 247, 0.25)"
              stroke="#A855F7"
              strokeWidth="1.5"
            />
            <text
              x="300"
              y="28"
              textAnchor="middle"
              fill="#38BDF8"
              fontSize="13"
              fontFamily="Outfit, sans-serif"
              fontWeight="800"
              letterSpacing="5"
            >
              MULTI-PLAYER PARTY BOX
            </text>
            <text
              x="300"
              y="80"
              textAnchor="middle"
              fill="url(#neonGrad)"
              fontSize="46"
              fontFamily="Outfit, sans-serif"
              fontWeight="900"
              letterSpacing="4"
            >
              派对AI狂欢盒
            </text>
            <text
              x="300"
              y="108"
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="12"
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="2"
            >
              谁是卧底 · 灵魂画手 · 手速抢答 · AI海龟汤
            </text>
          </svg>
        </div>

        {/* Player Identity Bar (Nickname + Avatar) */}
        <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-5 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-56 flex flex-col gap-1">
              <label htmlFor="player-nickname" className="text-xs font-semibold text-slate-400">
                你的聚会昵称
              </label>
              <input
                id="player-nickname"
                type="text"
                maxLength={10}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入你的昵称"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-bold text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1 w-full">
              <span className="text-xs font-semibold text-slate-400">选择专属头像</span>
              <div className="grid grid-cols-10 gap-1.5">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setAvatar(av);
                    }}
                    className={`text-xl py-1.5 rounded-lg border transition cursor-pointer flex items-center justify-center ${
                      avatar === av
                        ? 'bg-cyan-500/20 border-cyan-400 scale-105 shadow'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dual Action Cards: Create Room (Host) OR Enter 4-Letter Code (Join) */}
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Create Room */}
          <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-base font-extrabold text-cyan-300">我是房主 · 创立房间</span>
                <span className="text-xs font-mono text-cyan-400">HOST</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                一键创建房间并生成4位房间暗号与二维码，你既可以自己直接参战，也可以投屏当公共大屏！
              </p>
            </div>

            <button
              type="button"
              data-start="true"
              onClick={handleQuickCreate}
              className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 shadow-lg shadow-cyan-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>立即创立房间 (Enter)</span>
            </button>
          </div>

          {/* Card 2: Join Room by Code */}
          <div className="bg-slate-900/90 border border-pink-500/40 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-base font-extrabold text-pink-300">我是朋友 · 填号加入</span>
                <span className="text-xs font-mono text-pink-400">JOIN</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                输入房主屏幕上的 4 位房间号码（或直接用手机相机扫码）即可同步连线对战！
              </p>

              <input
                type="text"
                maxLength={4}
                aria-label="4位房间号码"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="输入4位房间号 (如 PLAY)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-center text-lg font-mono font-black tracking-widest text-pink-400 placeholder:text-slate-600 placeholder:text-xs placeholder:font-sans placeholder:tracking-normal focus:outline-none focus:border-pink-400"
              />
            </div>

            <button
              type="button"
              disabled={roomCode.trim().length < 2}
              onClick={handleQuickJoin}
              className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-300 hover:to-rose-300 disabled:opacity-40 shadow-lg shadow-pink-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>填入房间号加入</span>
            </button>
          </div>
        </div>
      </div>

      {/* Flat Control Hint Line */}
      <div className="relative z-10 w-full text-center text-xs font-mono text-slate-500 tracking-wider">
        <span>Enter / Space 快速创立房间 · 其余人输入4位房间号或扫码加入 · 支持召唤AI陪玩</span>
      </div>
    </div>
  );
};
