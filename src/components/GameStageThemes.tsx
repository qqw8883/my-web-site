import React from 'react';
import { GameType } from '../types/game';

interface GameStageThemeProps {
  gameType: GameType;
  children: React.ReactNode;
}

/**
  * 谁是卧底专属界面舞台：冷色调悬疑风格 (Cold Suspense Noir)
  * 暗夜冷蓝钢灰、机密雷达扫描弧、暗红警报防线、特工档案十字准星
  */
export function UndercoverStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen bg-[#050812] text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-rose-500/30">
      {/* 悬疑网格与机密雷达背景 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* 顶部机密警报红蓝冷光环境光晕 */}
      <div className="pointer-events-none absolute -top-32 left-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl animate-laser" />

      {/* 扫描线动画 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
        <div className="w-full h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline" />
      </div>

      {/* 专属沉浸式悬疑顶栏 HUD */}
      <div className="relative z-20 w-full border-b border-cyan-500/20 bg-[#070c1a]/80 backdrop-blur-md px-4 py-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="text-cyan-400 font-bold tracking-wider">LEVEL-4 CLASSIFIED</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-medium">🕵️ 匿名审讯室 · 谁是卧底深度推演</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-400">
          <span className="text-rose-400/80">● 实时录音与微表情分析</span>
          <span className="text-slate-600 font-mono">SEC-CH://08</span>
        </div>
      </div>

      {/* 主游戏内容容器 */}
      <div className="relative z-10 w-full flex-1 flex flex-col p-3 sm:p-6 md:p-8">
        {children}
      </div>

      {/* 底部悬疑质感水印栏 */}
      <div className="relative z-20 w-full border-t border-slate-800/80 bg-[#060a14]/90 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>TOP SECRET // 只有平民与卧底的心理博弈</span>
        <span>SECURITY PROTOCOL ACTIVE</span>
      </div>
    </div>
  );
}

/**
  * 手速抢答专属界面舞台：高频闪烁竞速/电竞赛事风格 (High-Octane Nitro Speedway)
  * 频闪霓虹光束、高能黄色/青色赛车条纹、电竞赛事爆灯冲击光晕
  */
export function BuzzerStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen bg-[#030612] text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-amber-400/30">
      {/* 竞速赛道发光斜切背景 */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(245,158,11,0.03)_0%,rgba(6,182,212,0.05)_50%,rgba(239,68,68,0.03)_100%)]" />

      {/* 高频闪烁光晕粒子 */}
      <div className="pointer-events-none absolute -top-20 left-1/3 w-[500px] h-72 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute bottom-10 -right-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />

      {/* 赛道高能光束横扫 */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-1 overflow-hidden">
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-strobe" />
      </div>

      {/* 专属沉浸式电竞赛事顶栏 */}
      <div className="relative z-20 w-full border-b border-amber-500/30 bg-[#060a1e]/85 backdrop-blur-md px-4 py-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
          <span className="text-amber-400 font-black tracking-wider">SPEED ARENA LIVE</span>
          <span className="text-slate-600">|</span>
          <span className="text-white font-bold tracking-wide">⚡ 极限手速竞技场 · 毫秒级闪电抢答</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-400">
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
            NITRO BOOST 激活
          </span>
          <span className="text-slate-500 font-mono">PING: 8ms</span>
        </div>
      </div>

      {/* 主游戏内容容器 */}
      <div className="relative z-10 w-full flex-1 flex flex-col p-3 sm:p-6 md:p-8">
        {children}
      </div>

      {/* 底部电竞计分台氛围栏 */}
      <div className="relative z-20 w-full border-t border-amber-500/20 bg-[#040816]/95 px-4 py-1.5 flex items-center justify-between text-[11px] text-amber-400/70 font-mono">
        <span>ELECTRO STADIUM · 全员手速毫秒竞技</span>
        <span>RAPID BUZZER SYSTEM READY</span>
      </div>
    </div>
  );
}

/**
  * 灵魂画手专属界面舞台：潮玩赛博工坊/灵魂画廊风格 (Cyberpunk Atelier & Neon Gallery)
  * 柔和霓虹色调（紫红/青蓝）、装裱画廊展台背光、创意画室艺术氛围
  */
export function DoodleStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen bg-[#0a0515] text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-purple-500/30">
      {/* 柔和潮玩霓虹渐变与画廊聚光灯 */}
      <div className="pointer-events-none absolute -top-24 left-1/6 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[100px]" />
      <div className="pointer-events-none absolute top-1/2 -right-20 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-[90px]" />

      {/* 画布微孔柔光肌理 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#3b0764_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />

      {/* 专属沉浸式画廊顶栏 */}
      <div className="relative z-20 w-full border-b border-purple-500/25 bg-[#0f0721]/80 backdrop-blur-md px-4 py-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
          <span className="text-fuchsia-400 font-bold tracking-wider">NEON GALLERY</span>
          <span className="text-slate-600">|</span>
          <span className="text-purple-200 font-medium">🎨 赛博创意工坊 · 灵魂画手实时同屏画廊</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-400">
          <span className="text-purple-300">● 毫秒笔触全端无缝同屏</span>
          <span className="text-slate-500 font-mono">CANVAS-HD</span>
        </div>
      </div>

      {/* 主游戏内容容器 */}
      <div className="relative z-10 w-full flex-1 flex flex-col p-3 sm:p-6 md:p-8">
        {children}
      </div>

      {/* 底部画廊名片栏 */}
      <div className="relative z-20 w-full border-t border-purple-500/20 bg-[#0d061c]/90 px-4 py-1.5 flex items-center justify-between text-[11px] text-purple-300/60 font-mono">
        <span>SOUL DOODLE · 抽象大师与神级脑洞拍卖行</span>
        <span>REALTIME VECTOR SYNC ACTIVE</span>
      </div>
    </div>
  );
}

/**
  * AI海龟汤专属界面舞台：复古案卷档案室/硬核侦探推理风格 (Vintage Detective Archive)
  * 羊皮纸案卷色系、暖暗桌灯光影、红线物证破案图钉板、旧案卷盖印质感
  */
export function TurtleSoupStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen bg-[#0d0907] text-amber-100 flex flex-col justify-between overflow-x-hidden selection:bg-amber-600/30">
      {/* 侦探台灯聚光灯暖影 */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[380px] bg-gradient-to-b from-amber-500/15 via-amber-800/8 to-transparent rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -left-20 w-80 h-80 bg-orange-700/10 rounded-full blur-3xl" />

      {/* 复古软木板与案卷质感网格 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#451a03_1px,transparent_1px)] [background-size:28px_28px] opacity-35" />

      {/* 专属沉浸式侦探档案室顶栏 */}
      <div className="relative z-20 w-full border-b border-amber-900/40 bg-[#140e0a]/85 backdrop-blur-md px-4 py-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
          <span className="text-amber-400 font-bold tracking-wider">CASE DOSSIER</span>
          <span className="text-amber-900">|</span>
          <span className="text-amber-200 font-medium">🔎 深夜悬案档案局 · 逻辑推演与线索桌面</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-amber-400/70">
          <span className="border border-amber-700/50 bg-amber-950/40 px-2 py-0.5 rounded text-[11px] font-bold text-amber-300">
            绝密封存 / 未破奇案
          </span>
          <span className="text-amber-600 font-mono">ARCHIVE-NOIR</span>
        </div>
      </div>

      {/* 主游戏内容容器 */}
      <div className="relative z-10 w-full flex-1 flex flex-col p-3 sm:p-6 md:p-8">
        {children}
      </div>

      {/* 底部物证侦探桌面栏 */}
      <div className="relative z-20 w-full border-t border-amber-900/40 bg-[#120c08]/95 px-4 py-1.5 flex items-center justify-between text-[11px] text-amber-500/60 font-mono">
        <span>TURTLE SOUP DETECTIVE · 追寻不可思议真相背后的隐秘悲歌</span>
        <span>DOSSIER VERIFIED BY AI BOT-888</span>
      </div>
    </div>
  );
}

/**
  * 大厅/默认专属舞台：派对综合大厅 (Neon Party Lounge)
  */
export function LobbyStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen bg-[#070a13] text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* 活力派对彩色光晕 */}
      <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/3 -right-20 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl" />

      {/* 主大厅内容容器 */}
      <div className="relative z-10 w-full flex-1 flex flex-col p-3 sm:p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}

/**
  * 根据当前房间的 gameType 动态选择渲染对应的游戏主题舞台
  */
export function GameStageRouter({ gameType, children }: GameStageThemeProps) {
  switch (gameType) {
    case 'UNDERCOVER':
      return <UndercoverStage>{children}</UndercoverStage>;
    case 'BUZZER':
      return <BuzzerStage>{children}</BuzzerStage>;
    case 'DOODLE':
      return <DoodleStage>{children}</DoodleStage>;
    case 'TURTLE_SOUP':
      return <TurtleSoupStage>{children}</TurtleSoupStage>;
    default:
      return <LobbyStage>{children}</LobbyStage>;
  }
}
