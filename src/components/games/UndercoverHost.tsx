import React, { useState } from 'react';
import { RoomState } from '../../types/game';
import { AIHostBot } from '../AIHostBot';
import { sound } from '../../utils/sound';
import {
  Eye,
  Send,
  Vote,
  RotateCcw,
  ArrowRight,
  MessageSquare,
  ShieldAlert,
  Swords,
  HeartHandshake,
  CheckCircle2,
  Gavel,
  Radio,
  Fingerprint,
  Activity,
  Crosshair,
  Volume2,
} from 'lucide-react';

interface UndercoverHostProps {
  room: RoomState;
  currentPlayerId: string;
  onAction: (action: string, payload?: any) => void;
  onBackToLobby: () => void;
}

export const UndercoverHost: React.FC<UndercoverHostProps> = ({
  room,
  currentPlayerId,
  onAction,
  onBackToLobby,
}) => {
  const [isHoldingPeek, setIsHoldingPeek] = useState(false);
  const [statementInput, setStatementInput] = useState('');
  const [selectedSuspectTag, setSelectedSuspectTag] = useState<Record<string, string>>({});

  const allPlayerIds = Object.keys(room.players);
  const myId = currentPlayerId || room.hostPlayerId || allPlayerIds[0] || '';

  const undercover = room.undercover || {
    civilianWord: '炸鸡',
    undercoverWord: '烤鸭',
    undercoverPlayerIds: [allPlayerIds[0] || 'bot_1'],
    playerWords: { [myId]: '炸鸡' },
    round: 1,
    phase: 'WORDS_REVEAL' as const,
    speakerOrder: allPlayerIds,
    currentSpeakerIndex: 0,
    statements: [],
    votes: {},
    eliminatedPlayerIds: [],
    aiCommentary: '机密代号已下发！按住指纹锁接收情报，全员就位后开启第一轮特工盘问！',
  };

  const myWord = undercover.playerWords[myId] || undercover.civilianWord || '炸鸡';
  const isMeEliminated = undercover.eliminatedPlayerIds.includes(myId);

  const activePlayers = Object.values(room.players).filter(
    (p) => !undercover.eliminatedPlayerIds.includes(p.id)
  );

  const currentSpeakerId =
    undercover.speakerOrder?.[undercover.currentSpeakerIndex] || activePlayers[0]?.id;
  const currentSpeaker = room.players[currentSpeakerId];
  const isMyTurnToSpeak =
    currentSpeakerId === myId || room.playMode === 'LOCAL_PARTY' || room.hostPlayerId === myId;

  const handleSubmitStatement = (e?: React.FormEvent, isOralPass: boolean = false) => {
    if (e) e.preventDefault();
    sound.playPop();
    const finalTxt = isOralPass ? '' : statementInput.trim();
    onAction('SUBMIT_STATEMENT', {
      playerId: currentSpeakerId === myId ? myId : currentSpeakerId || myId,
      text: finalTxt,
    });
    setStatementInput('');
  };


  const handleSkipToVote = () => {
    sound.playPop();
    onAction('SKIP_TO_VOTE');
  };

  const handleResolveVotes = () => {
    sound.playGavel();
    onAction('RESOLVE_VOTES');
  };

  const handleStartDuel = (targetId: string) => {
    sound.playSiren();
    onAction('INITIATE_DUEL', { targetId });
  };

  const handleVoteDuel = (choice: 'TRUST' | 'SUSPECT') => {
    sound.playPop();
    onAction('VOTE_DUEL', { choice });
  };

  const handleConcludeDuel = () => {
    sound.playSuccess();
    onAction('CONCLUDE_DUEL');
  };

  const totalVotesCast = Object.keys(undercover.votes || {}).length;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 py-2">
      {/* Top AI Host Companion */}
      <AIHostBot
        mood={room.aiMood === 'laugh' ? 'sarcastic' : room.aiMood}
        quip={room.aiQuip}
      />

      {/* Main Game Stage Container - Cyber Interrogation Theme */}
      <div className="relative bg-[#090d16] border border-rose-950/80 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden">
        {/* Subtle Radar Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        {/* Header HUD */}
        <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-rose-900/40 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-mono text-xl shadow-inner">
              🕵️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-wide text-rose-100 flex items-center gap-2">
                  <span>谁是卧底 · 特工审讯室</span>
                  <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-700/50 uppercase">
                    Cyber Inquest
                  </span>
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span>
                  代号频段: <strong className="font-mono text-rose-400 font-bold">{room.id}</strong>
                </span>
                <span>·</span>
                <span>
                  存活特工: <strong className="text-white font-bold">{activePlayers.length}</strong> / {Object.keys(room.players).length} 人
                </span>
                <span>·</span>
                <span>
                  盘问轮次: <strong className="text-amber-400 font-mono font-bold">ROUND 0{undercover.round}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onAction('RESET_ROUND');
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/70 border border-rose-800/80 cursor-pointer transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重启密令</span>
            </button>
            <button
              type="button"
              onClick={onBackToLobby}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 cursor-pointer transition"
            >
              撤回大厅
            </button>
          </div>
        </div>

        {/* Fingerprint Scanner Secret Dock */}
        {!isMeEliminated && (
          <div className="relative mb-5 p-3.5 rounded-xl bg-gradient-to-r from-rose-950/30 via-slate-900/60 to-rose-950/30 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2 text-xs text-rose-200/90">
              <Fingerprint className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>绝密特工词汇：长按右侧扫描指纹鉴权（松手即物理销毁，严防窥视）：</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onMouseDown={() => {
                  sound.playPop();
                  setIsHoldingPeek(true);
                }}
                onMouseUp={() => setIsHoldingPeek(false)}
                onMouseLeave={() => setIsHoldingPeek(false)}
                onTouchStart={() => {
                  sound.playPop();
                  setIsHoldingPeek(true);
                }}
                onTouchEnd={() => setIsHoldingPeek(false)}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition shadow-lg cursor-pointer select-none flex items-center gap-2 ${
                  isHoldingPeek
                    ? 'bg-rose-500 text-white shadow-rose-500/40 ring-2 ring-rose-400'
                    : 'bg-rose-950/90 hover:bg-rose-900 text-rose-200 border border-rose-500/50'
                }`}
              >
                <Fingerprint className="w-4 h-4" />
                <span>{isHoldingPeek ? '机密显影中...' : '长按指纹解锁'}</span>
              </button>

              <div className="px-5 py-2.5 rounded-xl bg-[#06090e] border border-rose-500/40 min-w-32 text-center shadow-inner">
                <span className="font-mono font-black text-sm tracking-widest text-rose-300">
                  {isHoldingPeek ? myWord : '••••••'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 1: WORDS REVEAL READY */}
        {undercover.phase === 'WORDS_REVEAL' && (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-rose-500/10 border-2 border-rose-500/40 flex items-center justify-center text-4xl shadow-lg">
                🔐
              </div>
              <div className="absolute inset-0 rounded-full border-t-2 border-rose-400 animate-radar pointer-events-none" />
            </div>

            <div className="max-w-md">
              <h4 className="text-xl font-black text-white tracking-wide">
                代号密令已下发到各特工终端！
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                全员按住上方【长按指纹解锁】查看自己的词。卧底拿到的是与平民相似的高仿词，发言切记保持镇定，若隐若现！
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onAction('START_SPEAKING');
              }}
              className="mt-2 px-8 py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:brightness-110 shadow-xl shadow-rose-600/30 active:scale-95 transition flex items-center gap-2.5 cursor-pointer"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>全员就位 · 开启首轮声波盘问</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* PHASE 2: SPEAKING & CHALLENGE DUEL */}
        {undercover.phase === 'SPEAKING' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 7 Cols: Statement Input & Feed */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <form
                onSubmit={handleSubmitStatement}
                className="flex flex-col gap-3 p-4 rounded-xl bg-slate-950/80 border border-rose-900/40 shadow-inner"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                    <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <span>
                        {currentSpeakerId === myId
                          ? '🎙️ 麦克风已移交！轮到你陈述描述！'
                          : `当前陈词特工：${currentSpeaker?.name || '未知特工'}`}
                      </span>
                      <span className="text-base">{currentSpeaker?.avatar}</span>
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    进度: {Math.min(undercover.currentSpeakerIndex + 1, undercover.speakerOrder.length)} / {undercover.speakerOrder.length}
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={statementInput}
                    onChange={(e) => setStatementInput(e.target.value)}
                    disabled={!isMyTurnToSpeak}
                    placeholder={
                      currentSpeakerId === myId
                        ? '用一句巧妙的话描述你的词，切忌直接出现原词...'
                        : isMyTurnToSpeak
                        ? `代【${currentSpeaker?.name || '当前特工'}】录入证言...`
                        : `等待【${currentSpeaker?.name}】录入陈词...`
                    }
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-400 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!statementInput.trim() || !isMyTurnToSpeak}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shrink-0 shadow transition active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>提交录入</span>
                  </button>

                  {/* Offline Oral Pass Button */}
                  <button
                    type="button"
                    disabled={!isMyTurnToSpeak}
                    onClick={() => handleSubmitStatement(undefined, true)}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs text-amber-300 bg-amber-950/70 hover:bg-amber-900 border border-amber-600/60 disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shrink-0 shadow transition active:scale-95"
                    title="线下聚会面对面发言完毕后，直接点此传麦给下一位，无需打字！"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>线下已发言 · 直接传麦</span>
                  </button>
                </div>


                {/* Quick Fill Hints */}
                {isMyTurnToSpeak && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-500">快速速记词:</span>
                    {[
                      '日常生活中常常能接触到',
                      '跟吃喝或社交聚会息息相关',
                      '它的外表特征有很鲜明的特点',
                      '大家一般在特定的时段享用它',
                    ].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => setStatementInput(sample)}
                        className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-300 hover:border-rose-800 cursor-pointer transition"
                      >
                        + {sample}
                      </button>
                    ))}
                  </div>
                )}
              </form>

              {/* Statements History Feed */}
              <div className="bg-[#070b12] border border-slate-800 rounded-xl p-4 flex flex-col gap-2.5 max-h-72 overflow-y-auto">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                    特工录音卷宗档案 ({undercover.statements?.length || 0})
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">RECORDED LOGS</span>
                </div>

                {!undercover.statements || undercover.statements.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    暂无证词记录。提交证词后，AI特工也会即时接龙展开博弈！
                  </p>
                ) : (
                  undercover.statements.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start justify-between gap-2.5 hover:border-rose-900/60 transition"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="text-xl shrink-0 p-1 rounded-lg bg-slate-800 border border-slate-700">
                          {st.playerAvatar}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-rose-300">{st.playerName}</span>
                            <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.2 rounded bg-slate-950">
                              R0{st.round}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 mt-1 break-words leading-relaxed font-sans">
                            “{st.text}”
                          </p>
                        </div>
                      </div>

                      {/* Duel Trigger Button next to statement */}
                      {st.playerId !== myId && !isMeEliminated && (
                        <button
                          type="button"
                          onClick={() => handleStartDuel(st.playerId)}
                          className="shrink-0 px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-[11px] font-bold text-rose-300 flex items-center gap-1.5 cursor-pointer transition active:scale-95 shadow"
                        >
                          <Swords className="w-3.5 h-3.5 text-rose-400" />
                          <span>对质</span>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right 5 Cols: Suspect Grid & Duel Launcher */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="bg-[#070b12] border border-rose-900/40 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5 text-rose-400" />
                    现场嫌疑特工雷达
                  </span>
                  <span className="text-[10px] text-rose-400 font-mono">15S DUEL READY</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.values(room.players).map((p) => {
                    const isEliminated = undercover.eliminatedPlayerIds.includes(p.id);
                    const isSpeaking = p.id === currentSpeakerId;
                    return (
                      <div
                        key={p.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition ${
                          isEliminated
                            ? 'bg-rose-950/20 border-rose-900/30 opacity-40'
                            : isSpeaking
                            ? 'bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/50 shadow-lg'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xl">{p.avatar}</span>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-slate-200 truncate">{p.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {isEliminated ? '已除名' : isSpeaking ? '正在陈词...' : '待审中'}
                            </span>
                          </div>
                        </div>

                        {!isEliminated && p.id !== myId && (
                          <button
                            type="button"
                            onClick={() => handleStartDuel(p.id)}
                            aria-label={`对 ${p.name} 发起质询对峙`}
                            title="发起15秒极速辩论对峙"
                            className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 cursor-pointer shrink-0 transition"
                          >
                            <Swords className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleSkipToVote}
                  className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 cursor-pointer flex items-center justify-center gap-2 transition"
                >
                  <Vote className="w-4 h-4 text-amber-400" />
                  <span>跳过本轮剩余发言 · 启动全员处决投票</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PHASE: DUEL (公堂质询对峙 & 测谎心电图) */}
        {undercover.phase === 'DUEL' && undercover.duel && (
          <div className="relative flex flex-col items-center justify-center py-6 gap-5 bg-gradient-to-b from-rose-950/70 via-slate-950 to-slate-950 border-2 border-rose-500/70 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
            <div className="absolute top-3 right-4 flex items-center gap-1.5 text-xs text-rose-400 font-mono">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>测谎分析仪运作中</span>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-600/30 border border-rose-400 text-rose-300 font-black text-xs uppercase mb-2 animate-pulse shadow">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                公堂对质 · 15秒生死自证
              </div>
              <h4 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                【{room.players[undercover.duel.initiatorId]?.name || '质询方'}】 VS 【{room.players[undercover.duel.targetId]?.name || '被嫌疑人'}】
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-lg">
                嫌疑人正在回答质询，全员可随时按下信任或怀疑测谎，AI法官正在记录微表情破绽！
              </p>
            </div>

            {/* Duel Heartbeat Lie Detector Meter */}
            <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col gap-2 shadow-inner">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-400 flex items-center gap-1">
                  <HeartHandshake className="w-4 h-4" />
                  信任 (好人)
                </span>
                <span className="text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4" />
                  怀疑 (伪装卧底)
                </span>
              </div>
              {(() => {
                const votes = Object.values(undercover.duel.trustVotes || {});
                const trustCount = votes.filter((v) => v === 'TRUST').length;
                const suspectCount = votes.filter((v) => v === 'SUSPECT').length;
                const total = Math.max(1, trustCount + suspectCount);
                const trustPercent = Math.round((trustCount / total) * 100);
                return (
                  <div>
                    <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden flex border border-slate-700 shadow-inner">
                      <div style={{ width: `${trustPercent}%` }} className="bg-emerald-500 transition-all duration-300" />
                      <div style={{ width: `${100 - trustPercent}%` }} className="bg-rose-600 transition-all duration-300" />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                      <span>信任度: {trustCount} 票 ({trustPercent}%)</span>
                      <span>嫌疑度: {suspectCount} 票 ({100 - trustPercent}%)</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Interactive Trust vs Suspect Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleVoteDuel('TRUST')}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>我保他 · 逻辑严密是平民</span>
              </button>
              <button
                type="button"
                onClick={() => handleVoteDuel('SUSPECT')}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>我踩他 · 眼神游离是卧底</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleConcludeDuel}
              className="mt-2 text-xs font-bold text-rose-300 hover:text-white underline cursor-pointer"
            >
              结束质询，由AI法官下达结案指令并进入投票 👉
            </button>
          </div>
        )}

        {/* PHASE 3: VOTING (全员激光锁定投票) */}
        {undercover.phase === 'VOTING' && (
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-rose-950/50 via-slate-900 to-rose-950/50 p-4 rounded-xl border border-rose-500/40 shadow">
              <div>
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-rose-400" />
                  <span>全员指决阶段：点击锁定你怀疑的卧底玩家！</span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  已投票: <strong className="text-rose-400 font-mono font-bold">{totalVotesCast} / {activePlayers.length}</strong> 人 · 票数持平则无人出局
                </p>
              </div>

              <button
                type="button"
                onClick={handleResolveVotes}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:brightness-110 text-white font-black text-xs flex items-center gap-2 cursor-pointer shrink-0 shadow-lg"
              >
                <Gavel className="w-4 h-4" />
                <span>立即封箱开票</span>
              </button>
            </div>

            {/* Interactive Voting Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {activePlayers.map((target) => {
                const myVotedTarget = undercover.votes[myId];
                const isSelected = myVotedTarget === target.id;
                const hasTargetVoted = Boolean(undercover.votes[target.id]);
                const receivedVotes = Object.values(undercover.votes || {}).filter(
                  (tid) => tid === target.id
                ).length;
                const latestStmt = [...(undercover.statements || [])]
                  .reverse()
                  .find((s) => s.playerId === target.id);

                return (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      onAction('VOTE', { voterId: myId, targetId: target.id });
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden ${
                      isSelected
                        ? 'bg-rose-950/60 border-rose-500 ring-2 ring-rose-500 shadow-xl scale-102'
                        : 'bg-[#06090e] border-slate-800 hover:border-rose-900 hover:bg-slate-900/60'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/20 blur-xl pointer-events-none" />
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{target.avatar}</span>
                        <div>
                          <div className="text-sm font-black text-white">{target.name}</div>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            {hasTargetVoted ? (
                              <span className="text-emerald-400 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> 已封锁选票
                              </span>
                            ) : (
                              '推测研判中...'
                            )}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-500 text-white">
                          已锁定
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 line-clamp-2">
                      {latestStmt ? `“${latestStmt.text}”` : '（暂无陈词记录）'}
                    </div>

                    <div className="text-[11px] font-bold flex items-center justify-between px-2.5 py-1.5 rounded bg-rose-950/40 border border-rose-900/50 text-rose-300">
                      <span className="flex items-center gap-1.5">
                        <Crosshair className="w-3.5 h-3.5 text-rose-400" />
                        <span>{isSelected ? '已投此人' : '匿名指决投他'}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        🔒 匿名封存
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}


        {/* PHASE 4 & 5: REVEAL RESULT & GAME OVER */}
        {(undercover.phase === 'REVEAL_RESULT' || undercover.phase === 'GAME_OVER') && (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-5">
            {undercover.winner ? (
              <div className="flex flex-col items-center gap-3">
                <span className="text-6xl animate-bounce">
                  {undercover.winner === 'CIVILIANS' ? '🏆' : '🎭'}
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">
                  {undercover.winner === 'CIVILIANS'
                    ? '平民特工大获全胜！卧底全军落网！'
                    : '卧底演技封神！成功瞒天过海逆风翻盘！'}
                </h4>
                <div className="p-3 rounded-xl bg-slate-950 border border-rose-900/50 text-xs text-slate-200">
                  真实机密密电：平民词【<strong className="text-cyan-400 font-bold">{undercover.civilianWord}</strong>】 vs 卧底词【<strong className="text-rose-400 font-bold">{undercover.undercoverWord}</strong>】
                </div>

                {/* Full Identity Reveal Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mt-2">
                  {Object.values(room.players).map((p) => {
                    const isSpy = undercover.undercoverPlayerIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 ${
                          isSpy
                            ? 'bg-rose-950/60 border-rose-500/80 shadow-lg'
                            : 'bg-[#070b12] border-slate-800'
                        }`}
                      >
                        <span className="text-2xl">{p.avatar}</span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-black text-white truncate">{p.name}</span>
                          <span
                            className={`text-[10px] font-bold ${
                              isSpy ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {isSpy ? `卧底 (${undercover.undercoverWord})` : `平民 (${undercover.civilianWord})`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/40 flex items-center justify-center text-3xl">
                  ⚖️
                </div>
                <h4 className="text-xl font-black text-white">
                  {undercover.lastEliminatedId
                    ? `【${room.players[undercover.lastEliminatedId]?.name}】被全员投票处决出局！`
                    : '票数持平！无人被处决！'}
                </h4>
                <p className="text-xs text-slate-400 max-w-md">{room.aiQuip}</p>
              </div>
            )}

            {/* Reveal Detailed Vote Breakdown Table (Only shown when revealed) */}
            <div className="w-full max-w-2xl bg-[#06090e] border border-rose-900/60 rounded-xl p-3.5 flex flex-col gap-2">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
                <span>📊 开箱验票 · 真实得票全公开</span>
                <span className="text-[10px] text-rose-400">VOTE TALLIES REVEALED</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.values(room.players).map((p) => {
                  const voteCount = Object.values(undercover.votes || {}).filter(
                    (tid) => tid === p.id
                  ).length;
                  const isEliminated = p.id === undercover.lastEliminatedId;
                  return (
                    <div
                      key={p.id}
                      className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                        isEliminated
                          ? 'bg-rose-950/80 border-rose-500 font-bold text-rose-200 ring-1 ring-rose-400'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="truncate">{p.avatar} {p.name}</span>
                      <span className="font-mono font-black text-rose-400 shrink-0">{voteCount} 票</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PDD Slash Style Truth or Dare Penalty Card */}
            {undercover.penaltyCard && (
              <div className="w-full max-w-md relative animate-pdd-slash overflow-hidden rounded-2xl bg-gradient-to-br from-rose-600 via-red-600 to-amber-600 p-0.5 shadow-[0_0_50px_rgba(239,68,68,0.6)]">
                {/* Diagonal Laser Light Sweeper */}
                <div className="absolute inset-0 w-1/3 bg-white/30 blur-md pointer-events-none animate-pdd-shine" />

                <div className="relative bg-[#10070b] p-5 rounded-[15px] flex flex-col items-center gap-2.5 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/30 border border-rose-400 text-[11px] font-black text-rose-300 uppercase tracking-wider">
                    <span>{undercover.penaltyCard.badge}</span>
                    <span>输家行刑令 · {undercover.penaltyCard.type === 'TRUTH' ? '真心话拷问' : '疯狂大冒险'}</span>
                  </div>

                  <span className="text-sm font-black text-white">
                    由【{undercover.penaltyCard.targetPlayerAvatar} {undercover.penaltyCard.targetPlayerName}】当众受罚：
                  </span>

                  <h5 className="text-base sm:text-lg font-black text-amber-300 font-sans leading-snug">
                    {undercover.penaltyCard.title}
                  </h5>

                  <p className="text-xs sm:text-sm text-rose-100 bg-rose-950/60 border border-rose-500/40 p-3 rounded-xl leading-relaxed w-full font-serif font-bold">
                    “{undercover.penaltyCard.content}”
                  </p>

                  <span className="text-[10px] text-rose-300/80">
                    完成惩罚后全场玩家点赞即可开启下一轮！
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mt-3">
              {undercover.winner ? (
                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    onAction('RESET_ROUND');
                  }}
                  className="px-6 py-3 rounded-xl font-black text-xs text-white bg-rose-600 hover:bg-rose-500 flex items-center gap-2 cursor-pointer shadow-lg transition active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>重开一局特工潜伏</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    onAction('NEXT_ROUND');
                  }}
                  className="px-6 py-3 rounded-xl font-black text-xs text-white bg-rose-600 hover:bg-rose-500 flex items-center gap-2 cursor-pointer shadow-lg transition active:scale-95"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>进入下一轮盘问</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
