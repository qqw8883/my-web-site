/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { HostLobby } from './components/HostLobby';
import { UndercoverHost } from './components/games/UndercoverHost';
import { DoodleHost } from './components/games/DoodleHost';
import { BuzzerHost } from './components/games/BuzzerHost';
import { TurtleSoupHost } from './components/games/TurtleSoupHost';
import { FloatingReactions } from './components/FloatingReactions';
import { QuickVoiceBar } from './components/QuickVoiceBar';
import { AwardCeremonyModal } from './components/AwardCeremonyModal';
import { RoomState, GameType, ItemCardType } from './types/game';
import { sound } from './utils/sound';

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function getOrCreatePlayerId(): string {
  try {
    const saved = sessionStorage.getItem('partyhub_player_id');
    if (saved) return saved;
    const created = `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    sessionStorage.setItem('partyhub_player_id', created);
    return created;
  } catch {
    return `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  }
}

export default function App() {
  const [viewMode, setViewMode] = useState<'TITLE' | 'LOBBY' | 'GAME'>('TITLE');
  const [room, setRoom] = useState<RoomState | null>(null);
  const [playerId, setPlayerId] = useState<string>(getOrCreatePlayerId);
  const [initialRoomCode, setInitialRoomCode] = useState<string>('');
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [isConnected, setIsConnected] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const roomRef = useRef<RoomState | null>(null);
  const playerIdRef = useRef<string>(playerId);
  const lastLocalStrokeTimeRef = useRef<number>(0);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  useEffect(() => {
    playerIdRef.current = playerId;
  }, [playerId]);

  // Sync state attribute to body for verification
  useEffect(() => {
    document.body.dataset.state = viewMode === 'TITLE' ? 'title' : 'playing';
  }, [viewMode]);

  const applyServerRoom = useCallback((nextRoom: RoomState) => {
    if (!nextRoom || !nextRoom.id) return;
    setRoom((prev) => {
      // If we are actively drawing within the last 300ms, preserve local strokes if our local stroke array is ahead
      if (
        prev?.gameType === 'DOODLE' &&
        nextRoom.gameType === 'DOODLE' &&
        prev.doodle &&
        nextRoom.doodle &&
        Date.now() - lastLocalStrokeTimeRef.current < 350 &&
        prev.doodle.strokes.length > nextRoom.doodle.strokes.length &&
        nextRoom.doodle.strokes.length > 0
      ) {
        return {
          ...nextRoom,
          doodle: {
            ...nextRoom.doodle,
            strokes: prev.doodle.strokes,
          },
        };
      }
      return nextRoom;
    });
    setViewMode(nextRoom.gameType === 'LOBBY' ? 'LOBBY' : 'GAME');
  }, []);

  // Connect WebSocket once on mount with keep-alive heartbeat and auto reconnection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    let pingInterval: any = null;

    const connect = () => {
      try {
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          setIsConnected(true);
          clearInterval(pingInterval);
          pingInterval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ type: 'PING' }));
            }
          }, 18000);

          if (roomRef.current && playerIdRef.current) {
            const currentP = roomRef.current.players[playerIdRef.current];
            socket.send(
              JSON.stringify({
                type: 'RECONNECT_ROOM',
                payload: {
                  roomId: roomRef.current.id,
                  playerId: playerIdRef.current,
                  name: currentP?.name,
                  avatar: currentP?.avatar,
                },
              })
            );
          } else {
            const params = new URLSearchParams(window.location.search);
            const roomParam = params.get('room') || params.get('r');
            const autostart = params.get('autostart');
            if (roomParam) {
              setInitialRoomCode(roomParam.toUpperCase());
            } else if (autostart === '1') {
              handleCreateRoom('派对房主', '👑');
            }
          }
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'PONG') return;

            if (data.type === 'ROOM_JOINED') {
              setPlayerId(data.payload.playerId);
              applyServerRoom(data.payload.room);
            } else if (data.type === 'SYNC_STATE') {
              applyServerRoom(data.payload);
            } else if (data.type === 'DOODLE_STROKE_STREAM') {
              setRoom((prev) => {
                if (!prev || !prev.doodle) return prev;
                return {
                  ...prev,
                  doodle: {
                    ...prev.doodle,
                    strokes: [...prev.doodle.strokes, data.payload],
                  },
                };
              });
            }
          } catch (e) {
            console.error('Error parsing WS message:', e);
          }
        };

        socket.onclose = () => {
          setIsConnected(false);
          clearInterval(pingInterval);
          reconnectTimeoutRef.current = setTimeout(connect, 1500);
        };
      } catch (err) {
        setIsConnected(false);
        clearInterval(pingInterval);
        reconnectTimeoutRef.current = setTimeout(connect, 2500);
      }
    };

    connect();

    return () => {
      clearInterval(pingInterval);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [applyServerRoom]);

  // Fallback HTTP polling every 1200ms while inside a room so multi-player state & strokes never desync
  useEffect(() => {
    if (!room?.id || viewMode === 'TITLE') return;
    const roomId = room.id;

    const timer = setInterval(async () => {
      // Skip polling while user is mid-stroke to avoid jitter
      if (Date.now() - lastLocalStrokeTimeRef.current < 400) return;
      try {
        const res = await fetch(`/api/room/${encodeURIComponent(roomId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.room) {
            applyServerRoom(data.room);
            setIsConnected(true);
          }
        }
      } catch {
        // Ignore transient network poll error
      }
    }, 1200);

    return () => clearInterval(timer);
  }, [room?.id, viewMode, applyServerRoom]);

  // Check URL parameters immediately on first render
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room') || params.get('r');
    if (roomParam) {
      setInitialRoomCode(roomParam.toUpperCase());
    }
  }, []);

  const dispatchAction = useCallback(
    async (type: string, payload: any = {}) => {
      const activeRoomId = payload.roomId || roomRef.current?.id;
      const activePlayerId = payload.playerId || playerIdRef.current;
      const fullPayload = { roomId: activeRoomId, playerId: activePlayerId, ...payload };

      if (type === 'DOODLE_STROKE' && payload.stroke) {
        lastLocalStrokeTimeRef.current = Date.now();
        setRoom((prev) => {
          if (!prev || !prev.doodle) return prev;
          return {
            ...prev,
            doodle: {
              ...prev.doodle,
              strokes: [...prev.doodle.strokes, payload.stroke],
            },
          };
        });
      }

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type, payload: fullPayload }));
        // For non-high-frequency actions or stroke end, also ensure HTTP fallback if needed
        if (type === 'DOODLE_STROKE' && payload.stroke?.type !== 'end') {
          return;
        }
      }

      // If WebSocket wasn't open, or for critical state transitions, send via HTTP POST to guarantee delivery
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || type === 'CREATE_ROOM' || type === 'JOIN_ROOM') {
        try {
          const res = await fetch('/api/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, payload: fullPayload }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.room) {
              applyServerRoom(data.room);
            }
          }
        } catch (err) {
          console.warn('Action fallback error:', err);
        }
      }
    },
    [applyServerRoom]
  );

  const handleCreateRoom = (name: string, avatar: string) => {
    const newPlayerId = playerId || getOrCreatePlayerId();
    setPlayerId(newPlayerId);
    const newRoomCode = generateRoomCode();

    const optimisticRoom: RoomState = {
      id: newRoomCode,
      hostPlayerId: newPlayerId,
      players: {
        [newPlayerId]: {
          id: newPlayerId,
          name: name || '派对房主',
          avatar: avatar || '👑',
          score: 100,
          isHost: true,
          connected: true,
          online: true,
        },
      },
      gameType: 'LOBBY',
      playMode: 'ONLINE_PARTY',
      aiMood: 'normal',
      aiQuip: `房间【${newRoomCode}】已创立！无论是线上发链接到群里，还是线下扫码大屏，大家都能一键秒入！`,
      reactions: [],
      playerItems: {
        [newPlayerId]: { bombSteal: 1, supremeBuzz: 1, doubleCombo: 1 },
      },
      createdAt: Date.now(),
    };
    roomRef.current = optimisticRoom;
    setRoom(optimisticRoom);
    setViewMode('LOBBY');

    dispatchAction('CREATE_ROOM', {
      roomId: newRoomCode,
      playerId: newPlayerId,
      name: name || '派对房主',
      avatar: avatar || '👑',
      playMode: 'ONLINE_PARTY',
    });
  };

  const handleJoinRoom = (roomCode: string, name: string, avatar: string) => {
    const code = roomCode.trim().toUpperCase();
    const newPlayerId = playerId || getOrCreatePlayerId();
    setPlayerId(newPlayerId);

    const optimisticRoom: RoomState = {
      id: code,
      hostPlayerId: newPlayerId,
      players: {
        [newPlayerId]: {
          id: newPlayerId,
          name: name || '开黑好友',
          avatar: avatar || '😎',
          score: 100,
          isHost: false,
          connected: true,
          online: true,
        },
      },
      gameType: 'LOBBY',
      playMode: 'ONLINE_PARTY',
      aiMood: 'cheering',
      aiQuip: `已加入房间【${code}】！随时可以开启聚会游戏！`,
      reactions: [],
      playerItems: {
        [newPlayerId]: { bombSteal: 1, supremeBuzz: 1, doubleCombo: 1 },
      },
      createdAt: Date.now(),
    };
    roomRef.current = optimisticRoom;
    setRoom(optimisticRoom);
    setViewMode('LOBBY');

    dispatchAction('JOIN_ROOM', {
      roomId: code,
      playerId: newPlayerId,
      name: name || '开黑好友',
      avatar: avatar || '😎',
    });
  };

  const handleStartGame = (gameType: GameType) => {
    dispatchAction('START_GAME', { gameType });
    setViewMode(gameType === 'LOBBY' ? 'LOBBY' : 'GAME');
  };

  const handleBackToLobby = () => {
    sound.playPop();
    dispatchAction('START_GAME', { gameType: 'LOBBY' });
    setViewMode('LOBBY');
  };

  const handleLeaveRoom = () => {
    sound.playPop();
    roomRef.current = null;
    setRoom(null);
    setViewMode('TITLE');
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  if (viewMode === 'TITLE' || !room) {
    return (
      <TitleScreen
        initialRoomCode={initialRoomCode}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#070a13] text-slate-100 flex flex-col justify-between p-3 sm:p-6 md:p-8 select-none relative overflow-x-hidden">
      {/* Network reconnecting banner */}
      {!isConnected && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 bg-rose-600/90 backdrop-blur text-white text-xs px-3.5 py-1 rounded-full shadow-lg border border-rose-300/40 flex items-center gap-2 animate-pulse pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>正在通过双通道同步房间数据...</span>
        </div>
      )}

      {/* Global Interactive Floating Reactions Overlay */}
      <FloatingReactions
        reactions={room.reactions || []}
        onThrow={(type) => dispatchAction('THROW_REACTION', { type })}
      />

      {/* Global Quick Voice Phrasing Dock */}
      <QuickVoiceBar
        onSendVoice={(phrase, soundKey) => dispatchAction('QUICK_VOICE', { phrase, soundKey })}
        lastVoiceEvent={room.lastVoiceEvent}
      />

      {/* Grand Party Climax: AI Award Ceremony Modal */}
      {room.ceremony && room.ceremony.active && (
        <AwardCeremonyModal
          ceremony={room.ceremony}
          players={room.players}
          onClose={() => dispatchAction('PARTY_ACTION', { action: 'CLOSE_CEREMONY' })}
        />
      )}

      {/* Router: Lobby vs Games */}
      {viewMode === 'LOBBY' && (
        <HostLobby
          room={room}
          currentPlayerId={playerId}
          onStartGame={handleStartGame}
          onAddBots={() => dispatchAction('ADD_BOTS', {})}
          onTriggerRoast={() =>
            dispatchAction('TRIGGER_AI_ROAST', {
              context: `当前房间【${room.id}】有${Object.keys(room.players).length}位玩家准备开玩`,
            })
          }
          onLeaveRoom={handleLeaveRoom}
          onTogglePlayMode={(mode) => dispatchAction('SET_PLAY_MODE', { mode })}
          onTriggerCeremony={() => dispatchAction('PARTY_ACTION', { action: 'TRIGGER_CEREMONY' })}
        />
      )}

      {viewMode === 'GAME' && room.gameType === 'UNDERCOVER' && (
        <UndercoverHost
          room={room}
          currentPlayerId={playerId}
          onAction={(action, payload) => dispatchAction('UNDERCOVER_ACTION', { action, ...payload })}
          onBackToLobby={handleBackToLobby}
        />
      )}

      {viewMode === 'GAME' && room.gameType === 'DOODLE' && (
        <DoodleHost
          room={room}
          currentPlayerId={playerId}
          onAction={(action, payload) => dispatchAction(action, payload)}
          onBackToLobby={handleBackToLobby}
        />
      )}

      {viewMode === 'GAME' && room.gameType === 'BUZZER' && (
        <BuzzerHost
          room={room}
          currentPlayerId={playerId}
          onAction={(action, payload) => dispatchAction(action, payload)}
          onBackToLobby={handleBackToLobby}
          onUseItem={(cardType: ItemCardType) => dispatchAction('USE_ITEM_CARD', { cardType })}
        />
      )}

      {viewMode === 'GAME' && room.gameType === 'TURTLE_SOUP' && (
        <TurtleSoupHost
          room={room}
          currentPlayerId={playerId}
          onAction={(action, payload) => dispatchAction(action, payload)}
          onBackToLobby={handleBackToLobby}
        />
      )}

      <div className="w-full text-center text-xs text-slate-500 font-mono py-2">
        PartyHub AI · 房间号: {room.id} · 线上连麦开黑 & 线下大屏聚会双模 · 毒舌AI裁判 Bot-888 在线
      </div>
    </div>
  );
}
