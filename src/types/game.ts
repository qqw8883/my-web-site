export type GameType = 'LOBBY' | 'UNDERCOVER' | 'DOODLE' | 'BUZZER' | 'TURTLE_SOUP';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isHost: boolean;
  isBot?: boolean;
  connected: boolean;
  online?: boolean;
}

export type ReactionType = 'tomato' | 'egg' | 'clap' | 'bomb' | 'heart';

export interface FloatingReaction {
  id: string;
  senderId: string;
  senderName: string;
  type: ReactionType;
  targetPlayerId?: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  timestamp: number;
}

export interface QuickVoiceEvent {
  id: string;
  playerId: string;
  playerName: string;
  phrase: string;
  soundKey: string;
  timestamp: number;
}

export type ItemCardType = 'BOMB_STEAL' | 'SUPREME_BUZZ' | 'DOUBLE_COMBO';

export interface PlayerItemCards {
  bombSteal: number;
  supremeBuzz: number;
  doubleCombo: number;
}

export interface UndercoverStatement {
  playerId: string;
  playerName: string;
  playerAvatar: string;
  round: number;
  text: string;
  timestamp: number;
}

export interface UndercoverDuel {
  active: boolean;
  initiatorId: string;
  targetId: string;
  timer: number;
  trustVotes: Record<string, 'TRUST' | 'SUSPECT'>; // voterId -> choice
  aiVerdict?: string;
}

export interface UndercoverState {
  civilianWord: string;
  undercoverWord: string;
  undercoverPlayerIds: string[];
  playerWords: Record<string, string>; // playerId -> word
  round: number;
  phase: 'WORDS_REVEAL' | 'SPEAKING' | 'DUEL' | 'VOTING' | 'REVEAL_RESULT' | 'GAME_OVER';
  speakerOrder: string[]; // Ordered list of living player IDs for current round
  currentSpeakerIndex: number;
  statements: UndercoverStatement[];
  votes: Record<string, string>; // voterId -> targetPlayerId
  eliminatedPlayerIds: string[];
  lastEliminatedId?: string;
  winner?: 'CIVILIANS' | 'UNDERCOVER';
  aiCommentary?: string;
  duel?: UndercoverDuel;
}

export interface DoodleStroke {
  id?: string;
  x: number;
  y: number;
  type: 'start' | 'draw' | 'end';
  color: string;
  size: number;
  authorId?: string;
}

export interface DoodleAuction {
  active: boolean;
  estimatedPrice: number;
  currentBid: number;
  highestBidderId?: string;
  highestBidderName?: string;
  bidsCount: number;
  timer: number;
  ended: boolean;
}

export interface DoodleState {
  drawerOrder: string[];
  currentDrawerIndex: number;
  currentDrawerId: string;
  coOpMode?: boolean;
  prompt: string;
  category: string;
  hint: string;
  revealedHint?: string;
  round: number;
  maxRounds: number;
  phase: 'DRAWING' | 'AUCTION' | 'REVEAL' | 'ROAST' | 'GAME_OVER';
  timeLeft: number;
  strokes: DoodleStroke[];
  guessedPlayerIds: string[];
  guesses: {
    playerId: string;
    playerName: string;
    text: string;
    correct: boolean;
    close?: boolean;
    timestamp: number;
  }[];
  aiReview?: {
    score: number;
    title: string;
    critique: string;
    roast: string;
  };
  auction?: DoodleAuction;
}

export interface BuzzerQuestionItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BuzzerState {
  question: string;
  options: string[];
  correctIndex: number;
  answer: string;
  explanation: string;
  buzzedPlayerId: string | null;
  buzzedPlayerTime?: number;
  selectedOptionIndex?: number;
  isAnswerCorrect?: boolean;
  phase: 'QUESTION' | 'BUZZED' | 'ANSWER_REVEAL' | 'WHEEL_SPIN' | 'GAME_OVER';
  round: number;
  maxRounds: number;
  penaltyTargetPlayerId?: string;
  wheelResult?: string;
  wheelTargetIndex?: number;
  wheelSpinId?: number;
  aiRoast?: string;
  activeItemUsed?: {
    cardType: ItemCardType;
    playerId: string;
    playerName: string;
  };
}

export interface TurtleSoupQuestion {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  question: string;
  answer: '是' | '否' | '无关' | '关键线索';
  aiNote?: string;
  timestamp: number;
}

export interface TurtleSoupSuspect {
  id: string;
  name: string;
  role: string;
  avatar: string;
  secretAlibi: string;
  statement: string;
  interrogated: boolean;
}

export interface TurtleSoupState {
  soupTitle: string;
  soupFace: string;
  soupBottom: string;
  keywords: string[];
  quickQuestions: string[];
  deepQuestions?: string[];
  solvePrompts?: string[];
  clues: string[];
  unlockedClueCount: number;
  questions: TurtleSoupQuestion[];
  suspects: TurtleSoupSuspect[];
  solveAttempts: {
    playerId: string;
    playerName: string;
    text: string;
    success: boolean;
    aiComment?: string;
    matchedPillars?: string[];
    missingPillars?: string[];
  }[];
  phase: 'QUESTIONING' | 'SOLVED' | 'REVEAL_TRUTH';
  solvedByPlayerName?: string;
  aiComment?: string;
  blindBoxAuction?: {
    active: boolean;
    currentBid: number;
    highestBidderId?: string;
    highestBidderName?: string;
    unlockedClueIndex?: number;
  };
}

export interface PartyAward {
  id: string;
  title: string;
  badge: string;
  winnerId: string;
  winnerName: string;
  winnerAvatar: string;
  tag: string;
  reason: string;
  roast: string;
}

export interface PartyCeremonyState {
  active: boolean;
  awards: PartyAward[];
  mvpId: string;
  mvpName: string;
  mvpAvatar: string;
  mvpScore: number;
  totalRoundsPlayed: number;
  aiHostSpeech: string;
}

export interface RoomState {
  id: string;
  hostPlayerId: string;
  players: Record<string, Player>;
  gameType: GameType;
  playMode: 'LOCAL_PARTY' | 'ONLINE_PARTY';
  undercover?: UndercoverState;
  doodle?: DoodleState;
  buzzer?: BuzzerState;
  turtleSoup?: TurtleSoupState;
  aiMood: 'normal' | 'sarcastic' | 'shocked' | 'cheering' | 'laugh';
  aiQuip: string;
  reactions: FloatingReaction[];
  lastVoiceEvent?: QuickVoiceEvent;
  playerItems: Record<string, PlayerItemCards>;
  ceremony?: PartyCeremonyState;
  createdAt: number;
}
