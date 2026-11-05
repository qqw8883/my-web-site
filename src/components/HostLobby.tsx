import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Users, Bot, Play, LogOut, QrCode, Globe, Tv, Trophy } from 'lucide-react';
import { RoomState, GameType } from '../types/game';
import { AIHostBot } from './AIHostBot';
import { sound } from '../utils/sound';

interface HostLobbyProps {
  room: RoomState;
  currentPlayerId: string;
  onStartGame: (gameType: GameType) => void;
  onAddBots: () => void;
  onTriggerRoast: () => void;
  onLeaveRoom: () => void;
  onTogglePlayMode?: (mode: 'LOCAL_PARTY' | 'ONLINE_PARTY') => void;
  onTriggerCeremony?: () => void;
}

export const HostLobby: React.FC<HostLobbyProps> = ({
  room,
  currentPlayerId,
  onStartGame,
  onAddBots,
  onTriggerRoast,
  onLeaveRoom,
  onTogglePlayMode,
  onTriggerCeremony,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<GameType>('UNDERCOVER');
  const [copied, setCopied] = useState(false);

  const playersList = Object.values(room.players);
  const currentPlayer = room.players[currentPlayerId];
  const isHost = currentPlayer?.isHost || room.hostPlayerId === currentPlayerId || playersList.length <= 1;
  const joinUrl = `${window.location.origin}/?room=${room.id}`;
  const playMode = room.playMode || 'ONLINE_PARTY';

  useEffect(() => {
    QRCode.toDataURL(joinUrl, {
      width: 180,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation failed:', err));
  }, [joinUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(joinUrl);
    sound.playPop();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const games = [
    {
      id: 'UNDERCOVER' as GameType,
      title: '谁是卧底 · 心机战',
      tag: '公堂对峙 · 测谎心电图',
      desc: '暗中下发秘密词，长按防窥看词！轮流隐晦描述，支持「15秒质询对峙」与全员测谎弹幕，AI法官当庭定罪！',
      icon: '🕵️',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300',
    },
    {
      id: 'DOODLE' as GameType,
      title: '灵魂画手 · 毒舌画廊',
      tag: '接龙作画 · AI艺术拍卖行',
      desc: '超流畅极速涂鸦板！画完触发「AI艺术拍卖行」，全员使用手头积分疯狂竞拍加价，AI鉴定师夸张估值！',
      icon: '🎨',
      color: 'from-pink-500/20 to-purple-500/10 border-pink-500/40 text-pink-300',
    },
    {
      id: 'BUZZER' as GameType,
      title: '手速抢答 · 命运大转盘',
      tag: '道具卡轰炸 · 线上大冒险',
      desc: '脑洞神题ABCD抢答！拥有「炸弹偷分卡」「绝对霸权卡」「连击双倍卡」！答错触发线上群聊搞怪大冒险！',
      icon: '⚡',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-300',
    },
    {
      id: 'TURTLE_SOUP' as GameType,
      title: 'AI海龟汤 · 案发现场',
      tag: '嫌疑人审讯 · 关键物证竞拍',
      desc: '离奇表面汤面！可向AI法官提问，亦可直接提审「3位带口供嫌疑人」，破案成功触发金色探照灯名侦探特效！',
      icon: '🐢',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 py-2">
      {/* Top Banner: AI Host Robot */}
      <AIHostBot mood={room.aiMood === 'laugh' ? 'sarcastic' : room.aiMood} quip={room.aiQuip} onPoke={onTriggerRoast} />

      {/* Mode Switcher Banner: Online Remote vs Local Party */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {playMode === 'ONLINE_PARTY' ? (
            <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
          ) : (
            <Tv className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">
              当前场景模式：
              <span className={playMode === 'ONLINE_PARTY' ? 'text-cyan-400' : 'text-amber-400'}>
                {playMode === 'ONLINE_PARTY' ? '线上远程开黑联机' : '线下客厅大屏聚会'}
              </span>
            </span>
            <span className="text-[11px] text-slate-400">
              {playMode === 'ONLINE_PARTY'
                ? '朋友分散在各地微信群/连麦，一键发链接秒入，一人一屏全自适应！'
                : '朋友围坐在客厅面对面，大屏幕展示主舞台，手机扫码当无线手柄！'}
            </span>
          </div>
        </div>

        {onTogglePlayMode && (
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => onTogglePlayMode('ONLINE_PARTY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                playMode === 'ONLINE_PARTY'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>线上开黑</span>
            </button>
            <button
              onClick={() => onTogglePlayMode('LOCAL_PARTY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                playMode === 'LOCAL_PARTY'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>线下大屏</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Split: Left (Room Code, QR & Players), Right (Game Selector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Invite Friends via 4-Letter Code or QR */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                邀请好友极速加入
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer font-bold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? '已复制链接！' : '复制专属邀请链接'}</span>
              </button>
              <button
                type="button"
                onClick={onLeaveRoom}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>退出</span>
              </button>
            </div>
          </div>

          {/* Room Code & QR Code Box */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/90 border border-slate-800">
            {qrDataUrl ? (
              <div className="shrink-0 p-1.5 bg-white rounded-lg shadow-md">
                <img
                  src={qrDataUrl}
                  alt="扫码加入房间"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-slate-800 animate-pulse rounded-lg" />
            )}

            <div className="flex flex-col justify-center gap-1">
              <span className="text-[11px] text-slate-400 font-medium">
                朋友点链接或输入房间号秒进：
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold tracking-widest font-mono text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
                {room.id}
              </span>
              <span className="text-[11px] text-slate-400 leading-tight">
                支持微信群发链接或手机扫码
              </span>
            </div>
          </div>

          {/* Player Roster */}
          <div className="flex flex-col gap-2.5 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-slate-200">
                  房间成员 ({playersList.length}人)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onAddBots();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-800/80 cursor-pointer transition"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>+ 召唤3位AI陪玩</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {playersList.map((player) => {
                const isMe = player.id === currentPlayerId;
                return (
                  <div
                    key={player.id}
                    className={`flex items-center gap-2 p-2 rounded-xl border ${
                      isMe
                        ? 'bg-cyan-950/30 border-cyan-500/50'
                        : 'bg-slate-950/60 border-slate-800/80'
                    }`}
                  >
                    <span className="text-xl shrink-0 p-1 bg-slate-900 rounded-lg">
                      {player.avatar}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-100 truncate">
                          {player.name}
                        </span>
                        {player.isHost && (
                          <span className="text-[10px] font-mono text-amber-400 shrink-0">
                            · 房主
                          </span>
                        )}
                        {isMe && !player.isHost && (
                          <span className="text-[10px] font-mono text-cyan-400 shrink-0">
                            · 我
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-cyan-400 tabular-nums">
                        积分: {player.score}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Game Selector Cards & Start Action */}
        <div className="lg:col-span-7 flex flex-col gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200">选择要开的聚会游戏</span>
            <span className="text-xs text-slate-400">
              {isHost ? '你是房主，选好后点击下方发车' : '点击选择，全员同屏狂欢'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {games.map((g) => {
              const isSelected = selectedGame === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setSelectedGame(g.id);
                  }}
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? `bg-gradient-to-br ${g.color} ring-2 ring-cyan-400 shadow-lg scale-[1.01]`
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <span className="text-2xl">{g.icon}</span>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      {g.tag}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{g.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {g.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Row & Party Finale Button */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
            {onTriggerCeremony && (
              <button
                type="button"
                onClick={() => {
                  sound.playFanfare();
                  onTriggerCeremony();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/70 border border-amber-500/40 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>结算派对 · AI颁奖盛典</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onStartGame(selectedGame);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 shadow-lg shadow-cyan-500/20 active:scale-95 transition cursor-pointer ml-auto"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>立即发车开启本局！</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
