import React, { useState } from 'react';
import { RoomState } from '../../types/game';
import { AIHostBot } from '../AIHostBot';
import { sound } from '../../utils/sound';
import {
  Eye,
  Key,
  Send,
  Award,
  UserCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface TurtleSoupHostProps {
  room: RoomState;
  currentPlayerId: string;
  onAction: (action: string, payload?: any) => void;
  onBackToLobby: () => void;
}

export const TurtleSoupHost: React.FC<TurtleSoupHostProps> = ({
  room,
  currentPlayerId,
  onAction,
  onBackToLobby,
}) => {
  const allPlayerIds = Object.keys(room.players);
  const myId = currentPlayerId || room.hostPlayerId || allPlayerIds[0] || 'detective';

  const soup = room.turtleSoup || {
    soupTitle: '半根火柴',
    soupFace:
      '一个男人赤身裸体死在茫茫荒漠中，手里紧紧攥着半根折断的火柴。周围没有任何车痕或脚印。他是怎么死的？',
    soupBottom:
      '他和同伴乘坐的热气球在荒漠上空发生故障急速下坠。为了减轻重量，大家扔掉了所有行李并脱光了衣服，但依然超重。最后大家抽火柴决定谁跳下去牺牲，他抽中了那根折断的短火柴，跳下高空摔死。',
    keywords: ['热气球', '减重', '抽签'],
    quickQuestions: [
      '他是自己走路进入荒漠的吗？',
      '他是被人谋杀害死的吗？',
      '当时现场还有其他同伴吗？',
      '他脱光衣服是出于自愿吗？',
      '手里的火柴是用来点火取暖的吗？',
    ],
    deepQuestions: [
      '他是从高空交通工具上掉下来的吗？',
      '他们乘坐的是热气球或飞艇吗？',
      '脱掉衣服是为了给载具减轻重量吗？',
      '半根火柴是用来抽签决定谁跳下去的吗？',
    ],
    solvePrompts: [
      '① 死者为什么会出现在没有脚印的荒漠里？',
      '② 死者为什么全身赤裸？',
      '③ 手里半根折断的火柴是怎么回事？',
    ],
    clues: [
      '提示一（空间方向）：死者周围没有脚印，说明他不是从地面走进去的，请抬头往高空想！',
      '提示二（反常行为）：当时不止他一人，大家脱掉衣服和扔行李是为了给某个正在下坠的载具“减轻重量”。',
      '提示三（核心物证）：减重后依然超重，手里的半根短火柴是同行者之间“生死抽签”的工具！',
    ],
    suspects: [],
    unlockedClueCount: 0,
    questions: [],
    solveAttempts: [],
    phase: 'QUESTIONING' as const,
    aiComment: '案发现场已封锁！请先向AI法官提问或提审嫌疑人收集线索，再还原完整真相！',
  };

  const [questionInput, setQuestionInput] = useState('');
  const [solveInput, setSolveInput] = useState('');
  const [showSolvePanel, setShowSolvePanel] = useState(true);

  const handleAskQuestion = (e?: React.FormEvent, customQuestion?: string) => {
    if (e) e.preventDefault();
    const q = (customQuestion ?? questionInput).trim();
    if (!q) return;
    sound.playPop();
    onAction('TURTLE_SOUP_ACTION', {
      action: 'ASK',
      playerId: myId,
      question: q,
    });
    if (!customQuestion) {
      setQuestionInput('');
    }
  };

  const handleInterrogate = (suspectId: string) => {
    sound.playSplat();
    onAction('TURTLE_SOUP_ACTION', {
      action: 'INTERROGATE_SUSPECT',
      suspectId,
    });
  };

  const handleAttemptSolve = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!solveInput.trim()) return;
    sound.playSuccess();
    onAction('TURTLE_SOUP_ACTION', {
      action: 'SOLVE',
      playerId: myId,
      solveText: solveInput.trim(),
    });
  };

  const unlockedCount = soup.unlockedClueCount ?? 0;
  const visibleClues = (soup.clues || []).slice(0, unlockedCount);
  const interrogatedCount = (soup.suspects || []).filter((s) => s.interrogated).length;
  const askedQuestionsSet = new Set((soup.questions || []).map((q) => q.question));

  const stage1Questions =
    soup.quickQuestions && soup.quickQuestions.length > 0
      ? soup.quickQuestions
      : [
          '他是自己走路进入荒漠的吗？',
          '他是被人谋杀害死的吗？',
          '当时现场还有其他同伴吗？',
          '他脱光衣服是出于自愿吗？',
          '手里的火柴是用来点火取暖的吗？',
        ];

  const stage2Questions = soup.deepQuestions || [];
  const showDeepQuestions =
    (soup.questions?.length || 0) >= 1 || interrogatedCount >= 1 || unlockedCount >= 1;

  const solvePrompts =
    soup.solvePrompts && soup.solvePrompts.length > 0
      ? soup.solvePrompts
      : [
          '① 核心起因：事件发生的真实背景与原因是什么？',
          '② 关键反常点：汤面中最反常的细节作何解释？',
        ];

  const latestAttempt = soup.solveAttempts?.[0];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 py-2 pb-16">
      {/* Top AI Host Companion */}
      <AIHostBot
        mood={room.aiMood === 'laugh' ? 'sarcastic' : room.aiMood}
        quip={room.aiQuip}
      />

      {/* Main Crime Case File */}
      <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4">
        {/* Header HUD */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              🐢
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-100">AI海龟汤 · 案发现场</h3>
              <span className="text-xs text-slate-400">
                房间号: <strong className="font-mono text-cyan-400">{room.id}</strong> · 案卷：《{soup.soupTitle}》 · 先提问/提审收集证据，再串联真相破案！
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {soup.phase === 'QUESTIONING' && (
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onAction('TURTLE_SOUP_ACTION', { action: 'REVEAL_TRUTH' });
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 cursor-pointer flex items-center gap-1 transition"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>直接看汤底答案</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setSolveInput('');
                onAction('TURTLE_SOUP_ACTION', { action: 'NEXT_SOUP' });
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/80 cursor-pointer transition"
            >
              换一碗海龟汤
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

        {/* Crime Narrative: The Surface Soup (汤面) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 flex flex-col gap-2 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              CASE NARRATIVE 表面案情（汤面）：《{soup.soupTitle}》
            </span>
            <span className="text-xs text-slate-400">
              法官仅回答「是 / 否 / 无关 / 关键线索」，问出关键线索 +30 分
            </span>
          </div>

          <p className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
            {soup.soupFace}
          </p>
        </div>

        {/* 3 Suspects Interrogation Dock */}
        {soup.suspects && soup.suspects.length > 0 && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                案发关联人物 · 点击「提审」突破心理防线获取关键证词:
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                已提审 {interrogatedCount} / {soup.suspects.length} 人
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {soup.suspects.map((suspect) => (
                <div
                  key={suspect.id}
                  className={`p-3 rounded-xl border transition flex flex-col justify-between gap-2 ${
                    suspect.interrogated
                      ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{suspect.avatar}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{suspect.name}</div>
                        <div className="text-[10px] text-slate-400">{suspect.role}</div>
                      </div>
                    </div>

                    {!suspect.interrogated ? (
                      <button
                        type="button"
                        onClick={() => handleInterrogate(suspect.id)}
                        className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold text-[11px] cursor-pointer transition active:scale-95"
                      >
                        提审取证
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        ✓ 已突破口供
                      </span>
                    )}
                  </div>

                  {suspect.interrogated ? (
                    <div className="text-xs text-cyan-200 bg-slate-950/90 p-2.5 rounded-lg border border-cyan-500/30 leading-relaxed">
                      <strong className="text-cyan-400">【突破证词】</strong>“{suspect.secretAlibi}”
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic bg-slate-950/40 p-2 rounded-lg">
                      <span className="text-slate-500 not-italic">【表面说辞】</span>“{suspect.statement}”
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Solved or Truth Reveal Banner */}
        {(soup.phase === 'SOLVED' || soup.phase === 'REVEAL_TRUTH') && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border-2 border-yellow-400/60 text-center flex flex-col items-center gap-2.5 animate-in zoom-in-95">
            <span className="text-5xl">{soup.phase === 'SOLVED' ? '🕵️‍♂️✨' : '📂🔍'}</span>
            <h3 className="text-2xl font-black text-amber-300">
              {soup.phase === 'SOLVED'
                ? `🎉 破案成功！【${soup.solvedByPlayerName || '大侦探'}】完整还原真相 (+120分)！`
                : `案件档案已解密：《${soup.soupTitle}》完整汤底`}
            </h3>
            {soup.aiComment && (
              <p className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3.5 py-1.5 rounded-lg border border-emerald-400/40">
                {soup.aiComment}
              </p>
            )}
            <p className="text-sm text-amber-100 max-w-2xl bg-black/50 p-4 rounded-xl border border-amber-400/30 mt-1 leading-relaxed text-left">
              <strong className="text-amber-300 block mb-1">📜 隐藏真相（完整汤底）：</strong>
              {soup.soupBottom}
            </p>
            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                setSolveInput('');
                onAction('TURTLE_SOUP_ACTION', { action: 'NEXT_SOUP' });
              }}
              className="mt-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-400 text-slate-950 hover:bg-amber-300 cursor-pointer shadow"
            >
              挑战下一碗海龟汤
            </button>
          </div>
        )}

        {/* Phase: Questioning & Deducing */}
        {soup.phase === 'QUESTIONING' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 7 Cols: Question Input, Progressive Quick Questions & Ruling Stream */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Question Input Form */}
              <form
                onSubmit={(e) => handleAskQuestion(e)}
                className="flex flex-col gap-2.5 p-4 rounded-xl bg-slate-950 border border-slate-800"
              >
                <span className="text-xs font-bold text-emerald-400">
                  第一步：向AI法官发问求证（输入是非疑问句，或点下方侦探追问）：
                </span>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    placeholder="例如：他是被人谋杀的吗？火柴是用来抽签的吗？"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="submit"
                    disabled={!questionInput.trim()}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-400 text-slate-950 hover:bg-emerald-300 disabled:opacity-40 cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>提问</span>
                  </button>
                </div>

                {/* Stage 1 Exploratory Prompts */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 font-semibold">
                    🔎 初步排查追问（点击直接提问）：
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {stage1Questions.map((presetQ) => {
                      const alreadyAsked = askedQuestionsSet.has(presetQ);
                      return (
                        <button
                          key={presetQ}
                          type="button"
                          onClick={() => handleAskQuestion(undefined, presetQ)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border cursor-pointer transition ${
                            alreadyAsked
                              ? 'bg-slate-900/40 border-slate-800 text-slate-500'
                              : 'bg-slate-900 hover:bg-emerald-950/60 border-slate-700 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300'
                          }`}
                        >
                          {alreadyAsked ? '✓ ' : '🔍 '}
                          {presetQ}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stage 2 Deep Breakthrough Prompts */}
                {showDeepQuestions && stage2Questions.length > 0 && (
                  <div className="flex flex-col gap-1.5 pt-1.5 border-t border-slate-800/80">
                    <span className="text-[11px] text-amber-400 font-bold">
                      🔥 进阶关键追问（根据已有线索深入锁定）：
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {stage2Questions.map((deepQ) => {
                        const alreadyAsked = askedQuestionsSet.has(deepQ);
                        return (
                          <button
                            key={deepQ}
                            type="button"
                            onClick={() => handleAskQuestion(undefined, deepQ)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border cursor-pointer transition ${
                              alreadyAsked
                                ? 'bg-slate-900/40 border-slate-800 text-slate-500'
                                : 'bg-amber-950/30 hover:bg-amber-900/50 border-amber-500/40 text-amber-200 hover:text-amber-100'
                            }`}
                          >
                            {alreadyAsked ? '✓ ' : '⚡ '}
                            {deepQ}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </form>

              {/* Questions & AI Judge Ruling Stream */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-2.5 max-h-80 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    AI法官庭审问答记录 ({soup.questions?.length || 0})
                  </span>
                  <span className="text-[11px] text-slate-500">
                    绿=是 · 红=否 · 灰=无关 · 金=关键线索
                  </span>
                </div>

                {!soup.questions || soup.questions.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    尚无提问记录，请点击上方「初步排查追问」按钮或输入疑问句开始破案！
                  </p>
                ) : (
                  soup.questions.map((q) => {
                    const badgeStyles = {
                      是: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                      否: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
                      无关: 'bg-slate-800 text-slate-400 border-slate-700',
                      关键线索:
                        'bg-amber-500/25 text-amber-300 border-amber-400/60 font-black shadow',
                    };

                    return (
                      <div
                        key={q.id}
                        className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/90 flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className="text-lg shrink-0">{q.playerAvatar}</span>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-slate-300">
                              {q.playerName} 提问：
                            </span>
                            <p className="text-xs text-slate-100 font-medium mt-0.5">
                              “{q.question}”
                            </p>
                            {q.aiNote && (
                              <span className="text-[11px] text-cyan-300/90 mt-1 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                                💡 AI法官提示：{q.aiNote}
                              </span>
                            )}
                          </div>
                        </div>

                        <span
                          className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                            badgeStyles[q.answer] || badgeStyles['无关']
                          }`}
                        >
                          {q.answer}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right 5 Cols: Progressive AI Hints & Multi-Pillar Truth Deduction */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Progressive Clues Archive Box */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    AI法官破案锦囊提示 ({visibleClues.length} / {soup.clues?.length || 3})
                  </span>
                  {visibleClues.length < (soup.clues?.length || 3) && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        onAction('TURTLE_SOUP_ACTION', { action: 'UNLOCK_CLUE' });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-[11px] font-bold text-amber-300 flex items-center gap-1 cursor-pointer transition active:scale-95"
                    >
                      <Lightbulb className="w-3 h-3 text-amber-400" />
                      <span>请求AI发放第 {visibleClues.length + 1} 条提示</span>
                    </button>
                  )}
                </div>

                {visibleClues.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">
                    遇到瓶颈了吗？点击右上角「请求AI发放第 1 条提示」获取方向指引（共3条渐进提示，不直接剧透汤底）！
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {visibleClues.map((clue, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 leading-relaxed"
                      >
                        {clue}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Solve Truth Action Box */}
              <div className="bg-gradient-to-br from-emerald-950/40 to-slate-950 border border-emerald-500/40 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    第二步：真相推理结案申报 (+120分)
                  </span>
                </div>

                {/* Required Mystery Questions to Answer */}
                <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    破案通过标准（请用一句话把以下要点连起来）：
                  </span>
                  {solvePrompts.map((sp, i) => (
                    <span key={i} className="text-[11px] text-slate-300 leading-snug">
                      {sp.replace(/（.*?）/g, '')}
                    </span>
                  ))}
                </div>

                {!showSolvePanel ? (
                  <button
                    type="button"
                    onClick={() => setShowSolvePanel(true)}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 shadow-lg cursor-pointer transition active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>我想通了 · 我要破案！</span>
                  </button>
                ) : (
                  <form onSubmit={handleAttemptSolve} className="flex flex-col gap-2">
                    <textarea
                      rows={3}
                      value={solveInput}
                      onChange={(e) => setSolveInput(e.target.value)}
                      placeholder={`请完整阐述《${soup.soupTitle}》的来龙去脉（例如：因为...所以...最后...）`}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/50 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={!solveInput.trim()}
                        className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-emerald-400 text-slate-950 hover:bg-emerald-300 disabled:opacity-40 cursor-pointer transition active:scale-95"
                      >
                        提交破案推断（AI判案）
                      </button>
                    </div>
                  </form>
                )}

                {/* Prominent Latest Solve Attempt Verdict & Pillar Checklist */}
                {latestAttempt && (
                  <div
                    className={`p-3 rounded-xl border flex flex-col gap-2 ${
                      latestAttempt.success
                        ? 'bg-emerald-950/50 border-emerald-400/60 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black flex items-center gap-1">
                        {latestAttempt.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        )}
                        <span>
                          {latestAttempt.playerName} 的破案裁定：
                          {latestAttempt.success ? '破案成功' : '尚未完整破案'}
                        </span>
                      </span>
                    </div>

                    <div className="text-xs text-slate-200 bg-black/30 p-2 rounded-lg">
                      提交内容：“{latestAttempt.text}”
                    </div>

                    {latestAttempt.aiComment && (
                      <div className="text-xs font-bold text-amber-200 leading-relaxed">
                        {latestAttempt.aiComment}
                      </div>
                    )}

                    {/* Pillar Breakdown Badges */}
                    {((latestAttempt.matchedPillars && latestAttempt.matchedPillars.length > 0) ||
                      (latestAttempt.missingPillars && latestAttempt.missingPillars.length > 0)) && (
                      <div className="flex flex-col gap-1 pt-1 border-t border-white/10">
                        {latestAttempt.matchedPillars &&
                          latestAttempt.matchedPillars.map((mp, i) => (
                            <span
                              key={`m_${i}`}
                              className="text-[11px] text-emerald-300 flex items-center gap-1"
                            >
                              <span>✅ 已推理正确：</span>
                              <strong>{mp}</strong>
                            </span>
                          ))}
                        {latestAttempt.missingPillars &&
                          latestAttempt.missingPillars.map((mis, i) => (
                            <span
                              key={`mis_${i}`}
                              className="text-[11px] text-rose-300 flex items-center gap-1"
                            >
                              <span>❓ 尚未答出：</span>
                              <strong>{mis}</strong>
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
