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
    aiCommentary: '秘密词已下发到各位设备！先长按查看自己的词，准备好后开启第一轮发言！',
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

  const handleSubmitStatement = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!statementInput.trim()) return;
    sound.playPop();
    onAction('SUBMIT_STATEMENT', {
      playerId: currentSpeakerId === myId ? myId : currentSpeakerId || myId,
      text: statementInput.trim(),
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

      {/* Main Game Stage Container */}
      <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4">
        {/* Header HUD */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              🕵️
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-100">谁是卧底 · 心机战</h3>
              <span className="text-xs text-slate-400">
                房间号: <strong className="font-mono text-cyan-400">{room.id}</strong> · 存活玩家: {activePlayers.length} / {Object.keys(room.players).length} 人 · 第 {undercover.round} 轮
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onAction('RESET_ROUND');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/70 border border-amber-800/80 cursor-pointer transition"
            >
              重新发词开局
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

        {/* Secret Word Peek Dock (Always Available to Living Players) */}
        {!isMeEliminated && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center gap-2 text-xs text-amber-200">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>按住右侧按钮偷看你的专属秘密词（松手即隐藏，防旁人偷看）：</span>
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
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition shadow cursor-pointer select-none"
              >
                {isHoldingPeek ? '👀 正在查看...' : '长按查看我的词汇'}
              </button>

              <div className="px-4 py-2 rounded-xl bg-slate-950 border border-amber-500/40 min-w-28 text-center">
                <span className="font-mono font-black text-sm tracking-widest text-amber-300">
                  {isHoldingPeek ? myWord : '••••••'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 1: WORDS REVEAL READY */}
        {undercover.phase === 'WORDS_REVEAL' && (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
            <h4 className="text-xl font-bold text-amber-300">
              秘密词汇已下发！长按上方按钮看清自己的词！
            </h4>
            <p className="text-xs text-slate-400 max-w-md">
              平民与卧底拿到相似但不相同的词汇。切记发言时既不能直接暴露原词，也不能描述得太偏让大家怀疑！
            </p>
            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onAction('START_SPEAKING');
              }}
              className="mt-2 px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center gap-2 cursor-pointer"
            >
              <span>准备完毕 · 开启第 1 轮发言</span>
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
                className="flex flex-col gap-2 p-4 rounded-xl bg-slate-950 border border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span>
                      {currentSpeakerId === myId
                        ? '🎙️ 轮到你发言了！'
                        : `当前发言人：${currentSpeaker?.name || '未知玩家'}`}
                    </span>
                    <span className="text-base">{currentSpeaker?.avatar}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    发言进度: {Math.min(undercover.currentSpeakerIndex + 1, undercover.speakerOrder.length)} / {undercover.speakerOrder.length}
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
                        ? '输入一句话隐晦描述你的词语（千万别直接打出原词）...'
                        : isMyTurnToSpeak
                        ? `代【${currentSpeaker?.name || '当前玩家'}】输入发言描述...`
                        : `正在等待【${currentSpeaker?.name}】输入发言...`
                    }
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!statementInput.trim() || !isMyTurnToSpeak}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>提交发言</span>
                  </button>
                </div>

                {/* Quick Fill Hints */}
                {isMyTurnToSpeak && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-500">快捷灵感:</span>
                    {[
                      '平时生活中经常能见到它',
                      '跟吃喝或者日常休闲有关',
                      '每次聚会大家都会提起它',
                      '外表或特征非常明显大家都懂',
                    ].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => setStatementInput(sample)}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-300 cursor-pointer"
                      >
                        + {sample}
                      </button>
                    ))}
                  </div>
                )}
              </form>

              {/* Statements History Feed */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-2.5 max-h-64 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    本局玩家发言记录 ({undercover.statements?.length || 0})
                  </span>
                </div>

                {!undercover.statements || undercover.statements.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    暂无发言记录，提交发言后AI陪玩也会自动接龙描述！
                  </p>
                ) : (
                  undercover.statements.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/90 flex items-start justify-between gap-2.5"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="text-lg shrink-0">{st.playerAvatar}</span>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-amber-300">{st.playerName}</span>
                            <span className="text-[10px] font-mono text-slate-500">第{st.round}轮</span>
                          </div>
                          <p className="text-xs text-slate-200 mt-0.5 break-words">“{st.text}”</p>
                        </div>
                      </div>

                      {/* Duel Trigger Button next to statement */}
                      {st.playerId !== myId && !isMeEliminated && (
                        <button
                          type="button"
                          onClick={() => handleStartDuel(st.playerId)}
                          className="shrink-0 px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-[10px] font-bold text-rose-300 flex items-center gap-1 cursor-pointer transition active:scale-95"
                        >
                          <Swords className="w-3 h-3 text-rose-400" />
                          <span>对质</span>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right 5 Cols: Players Status & Duel Actions */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-300">场上玩家 · 可随时发起公堂对峙</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.values(room.players).map((p) => {
                    const isEliminated = undercover.eliminatedPlayerIds.includes(p.id);
                    const isSpeaking = p.id === currentSpeakerId;
                    return (
                      <div
                        key={p.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition ${
                          isEliminated
                            ? 'bg-rose-950/20 border-rose-900/40 opacity-40'
                            : isSpeaking
                            ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xl">{p.avatar}</span>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-slate-200 truncate">{p.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {isEliminated ? '已淘汰' : isSpeaking ? '发言中' : '存活'}
                            </span>
                          </div>
                        </div>

                        {!isEliminated && p.id !== myId && (
                          <button
                            type="button"
                            onClick={() => handleStartDuel(p.id)}
                            aria-label={`对 ${p.name} 发起质询对峙`}
                            title="发起15秒公堂质询对峙"
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs cursor-pointer shrink-0"
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
                  className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Vote className="w-3.5 h-3.5 text-amber-400" />
                  <span>跳过剩余发言 · 直接进入全员处决投票</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PHASE: DUEL (公堂质询对峙 & 测谎心电图) */}
        {undercover.phase === 'DUEL' && undercover.duel && (
          <div className="flex flex-col items-center justify-center py-5 gap-5 bg-gradient-to-b from-rose-950/40 to-slate-950 border border-rose-500/40 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600/30 border border-rose-400/50 text-rose-300 font-extrabold text-xs uppercase mb-2 animate-pulse">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                公堂对峙质询中 · 15秒极速辩论
              </div>
              <h4 className="text-2xl font-black text-white">
                【{room.players[undercover.duel.initiatorId]?.name || '质询方'}】 VS 【{room.players[undercover.duel.targetId]?.name || '被嫌疑人'}】
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                被质询者正在回答自证！全员可实时按键测谎，AI法官正在同步记录破绽！
              </p>
            </div>

            {/* Duel Heartbeat Lie Detector Meter */}
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-400 flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  保他 (平民好人)
                </span>
                <span className="text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  踩他 (卧底假话)
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
                    <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden flex border border-slate-700">
                      <div style={{ width: `${trustPercent}%` }} className="bg-emerald-500 transition-all duration-300" />
                      <div style={{ width: `${100 - trustPercent}%` }} className="bg-rose-500 transition-all duration-300" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>信任度: {trustCount} 票</span>
                      <span>嫌疑度: {suspectCount} 票</span>
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
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>保他 · 我信他是平民</span>
              </button>
              <button
                type="button"
                onClick={() => handleVoteDuel('SUSPECT')}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>踩他 · 语无伦次是卧底</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleConcludeDuel}
              className="mt-2 text-xs font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer"
            >
              结束质询，让AI法官当庭裁决并进入投票 👉
            </button>
          </div>
        )}

        {/* PHASE 3: VOTING */}
        {undercover.phase === 'VOTING' && (
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div>
                <h4 className="text-base font-bold text-amber-300">
                  全员投票处决阶段：点击你怀疑是卧底的玩家！
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  已投票进度: <strong className="text-cyan-400 font-mono">{totalVotesCast} / {activePlayers.length}</strong> 人 · 全员投完自动开票，房主也可随时点击右侧开票
                </p>
              </div>

              <button
                type="button"
                onClick={handleResolveVotes}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow"
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>立即开票结算</span>
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
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400 shadow-lg scale-102'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{target.avatar}</span>
                        <div>
                          <div className="text-sm font-bold text-slate-100">{target.name}</div>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            {hasTargetVoted ? (
                              <span className="text-emerald-400 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> 已投票
                              </span>
                            ) : (
                              '思考中...'
                            )}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                          已选此人
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 line-clamp-2">
                      {latestStmt ? `“${latestStmt.text}”` : '（本轮尚未单独记录发言）'}
                    </div>

                    <div className="text-[11px] text-amber-400 font-bold flex items-center justify-between px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                      <span className="flex items-center gap-1">
                        <Vote className="w-3.5 h-3.5" />
                        <span>投他出局</span>
                      </span>
                      {receivedVotes > 0 && (
                        <span className="font-mono text-rose-400">{receivedVotes} 票</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PHASE 4 & 5: REVEAL RESULT & GAME OVER */}
        {(undercover.phase === 'REVEAL_RESULT' || undercover.phase === 'GAME_OVER') && (
          <div className="flex flex-col items-center justify-center py-6 text-center gap-4">
            {undercover.winner ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-5xl">
                  {undercover.winner === 'CIVILIANS' ? '🏆' : '🎭'}
                </span>
                <h4 className="text-2xl font-black text-amber-300">
                  {undercover.winner === 'CIVILIANS'
                    ? '平民阵营大获全胜！卧底全军覆没！'
                    : '卧底演技逆天！成功潜伏翻盘！'}
                </h4>
                <p className="text-xs text-slate-300">
                  真实词汇揭晓：平民词【<strong className="text-cyan-300">{undercover.civilianWord}</strong>】 vs 卧底词【<strong className="text-rose-400">{undercover.undercoverWord}</strong>】
                </p>

                {/* Full Identity Reveal Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-2xl mt-2">
                  {Object.values(room.players).map((p) => {
                    const isSpy = undercover.undercoverPlayerIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                          isSpy
                            ? 'bg-rose-950/40 border-rose-500/50'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <span className="text-xl">{p.avatar}</span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white truncate">{p.name}</span>
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
                <span className="text-4xl">⚖️</span>
                <h4 className="text-xl font-bold text-slate-100">
                  {undercover.lastEliminatedId
                    ? `【${room.players[undercover.lastEliminatedId]?.name}】被票决出局！`
                    : '平票！无人被处决！'}
                </h4>
                <p className="text-xs text-slate-400 max-w-md">{room.aiQuip}</p>
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
                  className="px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 flex items-center gap-2 cursor-pointer shadow"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>再来一局谁是卧底</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    onAction('NEXT_ROUND');
                  }}
                  className="px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 flex items-center gap-2 cursor-pointer shadow"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>进入下一轮发言</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
