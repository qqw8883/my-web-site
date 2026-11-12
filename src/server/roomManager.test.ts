import test from 'node:test';
import assert from 'node:assert/strict';
import { RoomManager, UNDERCOVER_PAIRS } from './roomManager.js';

test('RoomManager creates room with host as active player and 4-letter code', () => {
  const rm = new RoomManager();
  const room = rm.createRoom({ id: 'host_1', name: '聚会王', avatar: '👑' });
  assert.equal(room.id.length, 4);
  assert.equal(room.gameType, 'LOBBY');
  assert.equal(room.hostPlayerId, 'host_1');
  assert.equal(room.players['host_1'].name, '聚会王');
  assert.equal(room.players['host_1'].isHost, true);
  assert.equal(room.playMode, 'ONLINE_PARTY');
  assert.ok(room.playerItems['host_1']);
});

test('RoomManager switches between online and local modes and manages reactions', () => {
  const rm = new RoomManager();
  const room = rm.createRoom({ id: 'host_1', name: 'Alice', avatar: '🐱' });
  rm.setPlayMode(room.id, 'LOCAL_PARTY');
  assert.equal(room.playMode, 'LOCAL_PARTY');

  const rx = rm.throwReaction(room.id, 'host_1', 'tomato');
  assert.ok(rx);
  assert.equal(rx.type, 'tomato');
  assert.equal(room.reactions.length, 1);
});

test('RoomManager adds players by room code and supports smart bots', () => {
  const rm = new RoomManager();
  const room = rm.createRoom({ id: 'host_1', name: 'Alice', avatar: '🐱' });
  rm.joinPlayer(room.id, { id: 'p2', name: 'Bob', avatar: '🐶' });
  assert.equal(Object.keys(room.players).length, 2);

  rm.addBotPlayers(room.id, 2);
  assert.equal(Object.keys(room.players).length, 4);
});

test('Undercover game runs full speaking, skip-to-vote, duel and voting cycle', () => {
  const rm = new RoomManager();
  const room = rm.createRoom({ id: 'host_1', name: 'Host', avatar: '👑' });
  rm.addBotPlayers(room.id, 3);

  const started = rm.startUndercover(room.id);
  assert.ok(started?.undercover);
  assert.equal(started.undercover.phase, 'WORDS_REVEAL');

  rm.advanceUndercoverToSpeaking(room.id);
  // Host speaks
  rm.submitUndercoverStatement(room.id, 'host_1', '这个东西非常好吃，外皮脆脆的');
  assert.equal(room.undercover?.phase, 'VOTING');
  assert.equal(room.undercover?.statements.length, 4);

  // Test duel
  const botId = Object.keys(room.players).find((id) => id !== 'host_1')!;
  rm.initiateUndercoverDuel(room.id, 'host_1', botId);
  assert.equal(room.undercover?.phase, 'DUEL');
  assert.equal(room.undercover?.duel?.active, true);

  rm.voteUndercoverDuel(room.id, 'host_1', 'SUSPECT');
  assert.equal(room.undercover?.duel?.trustVotes['host_1'], 'SUSPECT');

  rm.concludeUndercoverDuel(room.id, 'AI鉴定：嫌疑人语无伦次！');
  assert.equal(room.undercover?.phase, 'VOTING');

  // Cast vote
  rm.voteUndercover(room.id, 'host_1', botId);
  assert.ok(room.undercover?.phase === 'REVEAL_RESULT' || room.undercover?.phase === 'GAME_OVER');
});

test('Doodle syncs strokes, supports co-op mode, smart guessing and auction house', () => {
  const rm = new RoomManager();
  const room = rm.createRoom({ id: 'p1', name: 'Picasso', avatar: '🎨' });
  rm.joinPlayer(room.id, { id: 'p2', name: 'Buyer', avatar: '💰' });

  rm.startDoodle(room.id);
  assert.ok(room.doodle);
  room.doodle.prompt = '猫咪偷吃';

  // Sync strokes batch
  rm.addDoodleStrokesBatch(room.id, [
    { x: 0.2, y: 0.2, type: 'start', color: '#22D3EE', size: 5 },
    { x: 0.5, y: 0.5, type: 'draw', color: '#22D3EE', size: 5 },
    { x: 0.5, y: 0.5, type: 'end', color: '#22D3EE', size: 5 },
  ]);
  assert.equal(room.doodle.strokes.length, 3);

  // Toggle Co-Op mode
  rm.toggleDoodleCoOp(room.id, true);
  assert.equal(room.doodle.coOpMode, true);

  // Partial guess "猫" should mark close=true, not false-positive exact win
  rm.submitDoodleGuess(room.id, 'p2', '猫');
  assert.equal(room.doodle.guesses[0].correct, false);
  assert.equal(room.doodle.guesses[0].close, true);
  assert.equal(room.doodle.phase, 'DRAWING');

  // Single particle "的" should NOT trigger correct or close
  rm.submitDoodleGuess(room.id, 'p2', '的');
  assert.equal(room.doodle.guesses[0].correct, false);
  assert.equal(room.doodle.guesses[0].close, false);

  // Exact guess awards +80 pts and triggers auction
  rm.submitDoodleGuess(room.id, 'p2', '猫咪偷吃');
  assert.equal(room.doodle.guesses[0].correct, true);
  assert.equal(room.doodle.phase, 'AUCTION');


  rm.bidDoodleAuction(room.id, 'p2', 300);
  assert.equal(room.doodle.auction?.currentBid, 300);
  assert.equal(room.doodle.auction?.highestBidderId, 'p2');

  rm.finishDoodleAuction(room.id);
  assert.equal(room.doodle.phase, 'REVEAL');
  assert.equal(room.doodle.auction?.ended, true);
});

test('Buzzer supports item cards, multiple-choice evaluation and synced wheel spin', () => {
  const rm = new RoomManager();
  const room = rm.createRoom({ id: 'p1', name: 'Speedy', avatar: '⚡' });
  rm.joinPlayer(room.id, { id: 'p2', name: 'Slow', avatar: '🐢' });

  rm.startBuzzer(room.id);
  assert.equal(room.buzzer?.phase, 'QUESTION');

  // p1 uses double combo item card
  rm.useItemCard(room.id, 'p1', 'DOUBLE_COMBO');
  assert.equal(room.buzzer?.activeItemUsed?.cardType, 'DOUBLE_COMBO');

  const buzz1 = rm.triggerBuzz(room.id, 'p1');
  assert.equal(buzz1?.success, true);
  assert.equal(room.buzzer?.buzzedPlayerId, 'p1');

  // Submit correct option index
  const correctIdx = room.buzzer!.correctIndex;
  const initScore = room.players['p1'].score;
  rm.submitBuzzerAnswer(room.id, correctIdx);
  assert.equal(room.buzzer?.phase, 'ANSWER_REVEAL');
  assert.equal(room.players['p1'].score, initScore + 120);

  // Next question -> wrong answer -> auto-spin wheel
  rm.nextBuzzerQuestion(room.id);
  rm.triggerBuzz(room.id, 'p2');
  const wrongIdx = (room.buzzer!.correctIndex + 1) % 4;
  rm.submitBuzzerAnswer(room.id, wrongIdx);
  assert.equal(room.buzzer?.phase, 'WHEEL_SPIN');
  assert.ok(room.buzzer?.wheelResult);
  assert.equal(typeof room.buzzer?.wheelTargetIndex, 'number');
  assert.equal(typeof room.buzzer?.wheelSpinId, 'number');

  rm.spinBuzzerWheel(room.id);
  assert.ok(room.buzzer?.wheelResult);
  assert.equal(typeof room.buzzer?.wheelTargetIndex, 'number');
});

test('Turtle soup supports case-specific offline rulings, interrogating 3 suspects and multi-pillar solve checks', () => {
  const rm = new RoomManager();
  const room = rm.createRoom({ id: 'detective', name: 'Conan', avatar: '🕵️' });
  rm.startTurtleSoup(room.id, 0);

  assert.equal(room.gameType, 'TURTLE_SOUP');
  assert.equal(room.turtleSoup?.suspects.length, 3);
  assert.equal(room.turtleSoup?.unlockedClueCount, 0);
  assert.ok((room.turtleSoup?.quickQuestions.length || 0) >= 4);

  // Offline evaluation accuracy & polarity
  const eval1 = rm.evaluateTurtleSoupQuestionOffline(room.id, '他是被人谋杀害死的吗？');
  assert.equal(eval1.answer, '否');

  const evalAlone = rm.evaluateTurtleSoupQuestionOffline(room.id, '他是一个人去的吗？');
  assert.equal(evalAlone.answer, '否');

  const evalCompanions = rm.evaluateTurtleSoupQuestionOffline(room.id, '当时现场还有其他同伴吗？');
  assert.equal(evalCompanions.answer, '是');

  const evalPlane = rm.evaluateTurtleSoupQuestionOffline(room.id, '他是坐飞机掉下来的吗？');
  assert.equal(evalPlane.answer, '否');

  const eval2 = rm.evaluateTurtleSoupQuestionOffline(room.id, '他们乘坐的是热气球或飞艇吗？');
  assert.equal(eval2.answer, '关键线索');

  // Interrogate suspect
  const s1 = room.turtleSoup!.suspects[0];
  rm.interrogateSuspect(room.id, s1.id);
  assert.equal(s1.interrogated, true);

  rm.addTurtleSoupQuestion(room.id, 'detective', '他们乘坐的是热气球或飞艇吗？', eval2.answer, eval2.aiNote);
  assert.equal(room.turtleSoup?.questions.length, 1);

  rm.unlockTurtleSoupClue(room.id);
  assert.equal(room.turtleSoup?.unlockedClueCount, 1);

  // Wrong or partial 1-pillar text should NOT false-positive solve
  const wrongSolve = rm.evaluateTurtleSoupSolveOffline(room.id, '我觉得他是在沙漠里口渴迷路走不动了');
  assert.equal(wrongSolve.isSolved, false);

  const partialSolve = rm.evaluateTurtleSoupSolveOffline(room.id, '他是坐热气球掉下来摔死的');
  assert.equal(partialSolve.isSolved, false);
  assert.equal(partialSolve.matchedPillars.length, 1);
  assert.equal(partialSolve.missingPillars.length, 2);

  // Multi-pillar complete deduction solves the case
  const rightSolve = rm.evaluateTurtleSoupSolveOffline(
    room.id,
    '他和同伴坐热气球故障超重，脱掉衣服减轻重量，最后抽火柴决定谁跳下去牺牲'
  );
  assert.equal(rightSolve.isSolved, true);
  assert.ok(rightSolve.matchedPillars.length >= 2);

  rm.attemptSolveTurtleSoup(
    room.id,
    'detective',
    '他和同伴坐热气球故障超重，脱掉衣服减轻重量，最后抽火柴决定谁跳下去牺牲',
    rightSolve.isSolved,
    rightSolve.aiComment,
    rightSolve.matchedPillars,
    rightSolve.missingPillars
  );
  assert.equal(room.turtleSoup?.phase, 'SOLVED');
});

test('Grand party finale awards ceremony calculates MVP and roast titles', () => {
  const rm = new RoomManager();
  const room = rm.createRoom({ id: 'p1', name: 'Superstar', avatar: '🌟' });
  rm.joinPlayer(room.id, { id: 'p2', name: 'Actor', avatar: '🎭' });
  rm.joinPlayer(room.id, { id: 'p3', name: 'Artist', avatar: '🎨' });
  room.players['p1'].score = 500;
  room.players['p2'].score = 300;
  room.players['p3'].score = 150;

  rm.triggerPartyCeremony(room.id);
  assert.ok(room.ceremony?.active);
  assert.equal(room.ceremony?.mvpId, 'p1');
  assert.equal(room.ceremony?.awards.length, 4);
  assert.ok(room.ceremony?.awards.some((a) => a.title.includes('显眼包之王')));
});

test('RoomManager handles disconnect and seamless reconnect without losing score', () => {
  const rm = new RoomManager();
  const room = rm.createRoom({ id: 'p1', name: 'Gamer', avatar: '🎮' });
  room.players['p1'].score = 150;

  // Simulate network disconnect
  rm.removePlayer(room.id, 'p1');
  assert.equal(room.players['p1'].connected, false);

  // Reconnect player with same ID
  rm.reconnectPlayer(room.id, { id: 'p1', name: 'Gamer', avatar: '🎮' });
  assert.equal(room.players['p1'].connected, true);
  assert.equal(room.players['p1'].online, true);
  assert.equal(room.players['p1'].score, 150);
});

test('UNDERCOVER_PAIRS library contains at least 200 rich distinct pairs', () => {
  assert.ok(UNDERCOVER_PAIRS.length >= 200, `Expected >= 200 pairs, found ${UNDERCOVER_PAIRS.length}`);
  const keys = new Set();
  for (const pair of UNDERCOVER_PAIRS) {
    assert.ok(pair.civilian && pair.civilian.trim().length > 0);
    assert.ok(pair.undercover && pair.undercover.trim().length > 0);
    assert.ok(Array.isArray(pair.botHints) && pair.botHints.length >= 2);
    const key = `${pair.civilian}_${pair.undercover}`;
    assert.ok(!keys.has(key), `Duplicate pair found: ${key}`);
    keys.add(key);
  }
});

