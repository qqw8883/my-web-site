import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { RoomManager } from './src/server/roomManager.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const server = createServer(app);
const wss = new WebSocketServer({ server });

const roomManager = new RoomManager();

interface SocketClient {
  ws: WebSocket;
  roomId?: string;
  playerId?: string;
  isHost?: boolean;
}
const clients = new Map<WebSocket, SocketClient>();

let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI with provided key:', err);
  }
}

function broadcastRoom(roomId: string) {
  const room = roomManager.getRoom(roomId);
  if (!room) return;

  const msg = JSON.stringify({ type: 'SYNC_STATE', payload: room });
  for (const client of clients.values()) {
    if (client.roomId === room.id && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(msg);
    }
  }
}

function broadcastToRoom(roomId: string, message: any, excludeWs?: WebSocket) {
  const normId = (roomId || '').trim().toUpperCase();
  const payload = JSON.stringify(message);
  for (const client of clients.values()) {
    if (client.roomId === normId && client.ws !== excludeWs && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(payload);
    }
  }
}

async function generateAiRoast(context: string): Promise<string> {
  if (!aiClient) {
    const offlineRoasts = [
      '就这水平？我用脚趾头算出的代码都比你们有默契！',
      '别装了，卧底的眼神已经出卖了他的灵魂！',
      '这画的是猫？卢浮宫连夜买站票把你请出去！',
      '手速这么慢，平时群里抢红包肯定永远是谢谢参与！',
      '各位大侦探，你们的脑洞已经突破大气层了！',
    ];
    return offlineRoasts[Math.floor(Math.random() * offlineRoasts.length)];
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `你是一个线下聚会与线上连麦派对的毒舌搞笑AI裁判主持人（代号Bot-888）。
请根据当前现场局势说一句犀利、幽默、调侃玩家的台词（35字以内），不要官话，带点年轻聚会梗，让人捧腹大笑。
当前局势背景: ${context}`,
    });
    return (response.text ?? '').trim().replace(/^["']|["']$/g, '');
  } catch (err) {
    console.error('Gemini roast error:', err);
    return '本AI裁判正在高速运转吐槽CPU，你们先别得意！';
  }
}

async function processRoomMessage(msg: any, ws?: WebSocket, client?: SocketClient) {
  const targetRoomId = (msg.payload?.roomId || client?.roomId || '').trim().toUpperCase();
  const senderPlayerId = msg.payload?.playerId || client?.playerId || '';

  // Automatically bind roomId & playerId on client whenever present so no socket misses broadcasts
  if (client && targetRoomId) {
    client.roomId = targetRoomId;
  }
  if (client && senderPlayerId) {
    client.playerId = senderPlayerId;
  }

  switch (msg.type) {
    case 'CREATE_ROOM': {
      const { playerId, name, avatar, roomId: customRoomId, playMode } = msg.payload || {};
      const pId = playerId || `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const room = roomManager.createRoom(
        { id: pId, name: name || '派对房主', avatar: avatar || '👑' },
        customRoomId,
        playMode || 'ONLINE_PARTY'
      );
      if (client) {
        client.roomId = room.id;
        client.playerId = pId;
        client.isHost = room.hostPlayerId === pId;
      }
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'ROOM_JOINED',
            payload: { roomId: room.id, playerId: pId, room },
          })
        );
      }
      broadcastRoom(room.id);
      return room;
    }

    case 'JOIN_ROOM': {
      const { roomId, name, avatar, playerId } = msg.payload || {};
      const code = (roomId || '').trim().toUpperCase();
      const pId = playerId || `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      let room = roomManager.getRoom(code);
      if (!room) {
        room = roomManager.createRoom({ id: pId, name: name || '神秘玩家', avatar: avatar || '😎' }, code);
      } else {
        room = roomManager.joinPlayer(code, { id: pId, name, avatar }) || undefined;
      }

      if (!room) {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ERROR', payload: '无法加入该房间，请检查4位房间码' }));
        }
        return null;
      }

      if (client) {
        client.roomId = room.id;
        client.playerId = pId;
        client.isHost = room.hostPlayerId === pId;
      }
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'ROOM_JOINED',
            payload: { roomId: room.id, playerId: pId, room },
          })
        );
      }
      broadcastRoom(room.id);
      return room;
    }

    case 'PING': {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
      }
      return null;
    }

    case 'RECONNECT_ROOM': {
      const { roomId, playerId, name, avatar } = msg.payload || {};
      if (!roomId || !playerId) return null;
      const code = roomId.trim().toUpperCase();
      const room = roomManager.reconnectPlayer(code, { id: playerId, name, avatar });
      if (room) {
        if (client) {
          client.roomId = code;
          client.playerId = playerId;
          client.isHost = room.hostPlayerId === playerId;
        }
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: 'ROOM_JOINED',
              payload: { roomId: code, playerId, room },
            })
          );
        }
        broadcastRoom(code);
      }
      return room;
    }

    case 'SET_PLAY_MODE': {
      if (!targetRoomId) return null;
      const { mode } = msg.payload || {};
      const room = roomManager.setPlayMode(targetRoomId, mode);
      broadcastRoom(targetRoomId);
      return room;
    }

    case 'ADD_BOTS': {
      if (!targetRoomId) return null;
      const room = roomManager.addBotPlayers(targetRoomId, 3);
      broadcastRoom(targetRoomId);
      return room;
    }

    case 'THROW_REACTION': {
      if (!targetRoomId) return null;
      const { type, targetPlayerId } = msg.payload || {};
      const rx = roomManager.throwReaction(
        targetRoomId,
        senderPlayerId || 'unknown',
        type,
        targetPlayerId
      );
      if (rx) {
        broadcastRoom(targetRoomId);
      }
      return roomManager.getRoom(targetRoomId);
    }

    case 'QUICK_VOICE': {
      if (!targetRoomId) return null;
      const { phrase, soundKey } = msg.payload || {};
      roomManager.playQuickVoice(
        targetRoomId,
        senderPlayerId || 'unknown',
        phrase || '我不信！',
        soundKey || 'voice_sfx'
      );
      broadcastRoom(targetRoomId);
      return roomManager.getRoom(targetRoomId);
    }

    case 'USE_ITEM_CARD': {
      if (!targetRoomId) return null;
      const { cardType } = msg.payload || {};
      const room = roomManager.useItemCard(targetRoomId, senderPlayerId || 'unknown', cardType);
      broadcastRoom(targetRoomId);
      return room;
    }

    case 'START_GAME': {
      if (!targetRoomId) return null;
      const { gameType } = msg.payload || {};
      let updated = null;

      if (gameType === 'UNDERCOVER') {
        updated = roomManager.startUndercover(targetRoomId);
      } else if (gameType === 'DOODLE') {
        updated = roomManager.startDoodle(targetRoomId);
      } else if (gameType === 'BUZZER') {
        updated = roomManager.startBuzzer(targetRoomId);
      } else if (gameType === 'TURTLE_SOUP') {
        updated = roomManager.startTurtleSoup(targetRoomId);
      } else if (gameType === 'LOBBY') {
        const room = roomManager.getRoom(targetRoomId);
        if (room) {
          room.gameType = 'LOBBY';
          room.aiMood = 'normal';
          room.aiQuip = '回到派对大厅！房主可以随时切换下一个聚会游戏！';
          updated = room;
        }
      }

      if (updated) {
        broadcastRoom(targetRoomId);
      }
      return updated;
    }

    case 'UNDERCOVER_ACTION': {
      if (!targetRoomId) return null;
      const { action, playerId, text, voterId, targetId, choice } = msg.payload || {};
      if (action === 'START_SPEAKING') {
        roomManager.advanceUndercoverToSpeaking(targetRoomId);
      } else if (action === 'SUBMIT_STATEMENT') {
        roomManager.submitUndercoverStatement(targetRoomId, playerId || senderPlayerId, text || '');
      } else if (action === 'SKIP_TO_VOTE') {
        roomManager.skipUndercoverToVoting(targetRoomId);
      } else if (action === 'RESOLVE_VOTES') {
        roomManager.forceResolveUndercoverVotes(targetRoomId);
      } else if (action === 'INITIATE_DUEL') {
        roomManager.initiateUndercoverDuel(targetRoomId, senderPlayerId || playerId, targetId);
      } else if (action === 'VOTE_DUEL') {
        roomManager.voteUndercoverDuel(targetRoomId, senderPlayerId || voterId, choice);
      } else if (action === 'CONCLUDE_DUEL') {
        roomManager.concludeUndercoverDuel(targetRoomId);
      } else if (action === 'VOTE') {
        roomManager.voteUndercover(targetRoomId, voterId || senderPlayerId, targetId);
      } else if (action === 'NEXT_ROUND') {
        roomManager.nextUndercoverRound(targetRoomId);
      } else if (action === 'RESET_ROUND') {
        roomManager.startUndercover(targetRoomId);
      }
      broadcastRoom(targetRoomId);
      return roomManager.getRoom(targetRoomId);
    }

    case 'DOODLE_STROKE': {
      if (!targetRoomId) return null;
      const { stroke } = msg.payload || {};
      if (!stroke) return null;
      roomManager.addDoodleStroke(targetRoomId, stroke);
      broadcastToRoom(targetRoomId, { type: 'DOODLE_STROKE_STREAM', payload: stroke }, ws);
      // On stroke end, broadcast full state reconciliation so no client ever misses a stroke
      if (stroke.type === 'end') {
        broadcastRoom(targetRoomId);
      }
      return roomManager.getRoom(targetRoomId);
    }

    case 'DOODLE_STROKE_BATCH': {
      if (!targetRoomId) return null;
      const { strokes } = msg.payload || {};
      if (Array.isArray(strokes) && strokes.length > 0) {
        roomManager.addDoodleStrokesBatch(targetRoomId, strokes);
        broadcastRoom(targetRoomId);
      }
      return roomManager.getRoom(targetRoomId);
    }

    case 'DOODLE_CLEAR': {
      if (!targetRoomId) return null;
      roomManager.clearDoodleCanvas(targetRoomId);
      broadcastRoom(targetRoomId);
      return roomManager.getRoom(targetRoomId);
    }

    case 'DOODLE_GUESS': {
      if (!targetRoomId) return null;
      const { playerId, text } = msg.payload || {};
      roomManager.submitDoodleGuess(targetRoomId, playerId || senderPlayerId, text);
      broadcastRoom(targetRoomId);
      return roomManager.getRoom(targetRoomId);
    }

    case 'DOODLE_NEXT_TURN': {
      if (!targetRoomId) return null;
      roomManager.nextDoodleTurn(targetRoomId);
      broadcastRoom(targetRoomId);
      return roomManager.getRoom(targetRoomId);
    }

    case 'DOODLE_ACTION': {
      if (!targetRoomId) return null;
      const { action, estimatedPrice, bidAmount, targetDrawerId, coOpMode } = msg.payload || {};
      if (action === 'START_AUCTION') {
        roomManager.startDoodleAuction(targetRoomId, estimatedPrice || 600);
      } else if (action === 'BID_AUCTION') {
        roomManager.bidDoodleAuction(targetRoomId, senderPlayerId || 'unknown', bidAmount);
      } else if (action === 'FINISH_AUCTION') {
        roomManager.finishDoodleAuction(targetRoomId);
      } else if (action === 'SET_DRAWER') {
        roomManager.setDoodleDrawer(targetRoomId, targetDrawerId || senderPlayerId);
      } else if (action === 'TOGGLE_COOP') {
        roomManager.toggleDoodleCoOp(targetRoomId, coOpMode);
      } else if (action === 'REVEAL_HINT') {
        roomManager.revealDoodleHintChar(targetRoomId);
      }
      broadcastRoom(targetRoomId);
      return roomManager.getRoom(targetRoomId);
    }

    case 'DOODLE_AI_ROAST': {
      if (!targetRoomId) return null;
      const room = roomManager.getRoom(targetRoomId);
      if (!room || !room.doodle) return null;

      const prompt = room.doodle.prompt;
      const drawerName = room.players[room.doodle.currentDrawerId]?.name || '这位灵魂画手';

      let reviewData = {
        score: Math.floor(Math.random() * 45) + 45,
        title: '后现代抽象野兽派杰作',
        critique: `线条奔放不羁，寥寥数笔精准避开了【${prompt}】的所有常规解剖学特征。`,
        roast: '梵高看了会沉默，毕加索看了直呼内行！',
      };

      if (aiClient) {
        try {
          const res = await aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `作为毒舌AI裁判，给画手【${drawerName}】绘制的【${prompt}】（共画了${room.doodle.strokes.length}笔）打分并点评。
请直接返回JSON格式：
{
  "score": number(10到99之间整数),
  "title": string(搞笑艺术流派头衔，10字以内),
  "critique": string(一本正经胡说八道的艺术评论，35字以内),
  "roast": string(毒舌搞笑吐槽一句话，25字以内)
}`,
            config: { responseMimeType: 'application/json' },
          });
          const parsed = JSON.parse(res.text || '{}');
          if (parsed.score) reviewData = parsed;
        } catch (e) {
          console.error('AI doodle roast err:', e);
        }
      }

      room.doodle.phase = 'ROAST';
      room.doodle.aiReview = reviewData;
      room.aiMood = 'laugh';
      room.aiQuip = `AI艺术馆馆长锐评《${prompt}》：【${reviewData.title}】得分 ${reviewData.score} 分！“${reviewData.roast}”`;
      broadcastRoom(targetRoomId);
      return room;
    }

    case 'BUZZER_ACTION': {
      if (!targetRoomId) return null;
      const { action, playerId, optionIndex } = msg.payload || {};
      const room = roomManager.getRoom(targetRoomId);
      if (!room || !room.buzzer) return null;

      if (action === 'BUZZ') {
        roomManager.triggerBuzz(targetRoomId, playerId || senderPlayerId);
      } else if (action === 'SELECT_OPTION') {
        roomManager.submitBuzzerAnswer(targetRoomId, Number(optionIndex));
      } else if (action === 'SPIN_WHEEL') {
        roomManager.spinBuzzerWheel(targetRoomId);
      } else if (action === 'NEXT') {
        roomManager.nextBuzzerQuestion(targetRoomId);
      }
      broadcastRoom(targetRoomId);
      return room;
    }

    case 'TURTLE_SOUP_ACTION': {
      if (!targetRoomId) return null;
      const { action, playerId, question, solveText, suspectId } = msg.payload || {};
      const room = roomManager.getRoom(targetRoomId);
      if (!room || !room.turtleSoup) return null;
      const soup = room.turtleSoup;

      if (action === 'INTERROGATE_SUSPECT') {
        roomManager.interrogateSuspect(targetRoomId, suspectId);
        broadcastRoom(targetRoomId);
      } else if (action === 'ASK') {
        const offlineEval = roomManager.evaluateTurtleSoupQuestionOffline(targetRoomId, question || '');
        let answer: '是' | '否' | '无关' | '关键线索' = offlineEval.answer;
        let aiNote = offlineEval.aiNote;

        // Only call LLM if our deterministic rule matrix returned '无关' for a custom free-form question
        if (aiClient && offlineEval.answer === '无关') {
          try {
            const aiPromise = aiClient.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: `你是海龟汤游戏的权威AI法官。
汤名：${soup.soupTitle}
表面汤面：${soup.soupFace}
隐藏真相（汤底）：${soup.soupBottom}
核心线索：${soup.clues.join(' ')}

玩家提问：“${question}”

请判断这个问题与真相的关系，从以下4个词中选一个作为answer：
- "是" (提问假设符合真相)
- "否" (提问假设违背真相)
- "无关" (提问与案情核心因果无关)
- "关键线索" (提问精准切中了核心真相要素)

输出严格JSON格式：
{
  "answer": "是" | "否" | "无关" | "关键线索",
  "aiNote": "AI法官的一句简短点拨，严禁直接剧透未提及的汤底（20字以内）"
}`,
              config: { responseMimeType: 'application/json' },
            });
            const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2200));
            const res = await Promise.race([aiPromise, timeoutPromise]);
            if (res && res.text) {
              const parsed = JSON.parse(res.text || '{}');
              if (['是', '否', '无关', '关键线索'].includes(parsed.answer)) {
                answer = parsed.answer;
                aiNote = parsed.aiNote || aiNote;
              }
            }
          } catch (e) {
            console.error('Turtle soup AI evaluate err:', e);
          }
        }

        roomManager.addTurtleSoupQuestion(targetRoomId, playerId || senderPlayerId, question, answer, aiNote);
        broadcastRoom(targetRoomId);
      } else if (action === 'SOLVE') {
        const text = (solveText || '').trim();
        const offlineSolve = roomManager.evaluateTurtleSoupSolveOffline(targetRoomId, text);
        roomManager.attemptSolveTurtleSoup(
          targetRoomId,
          playerId || senderPlayerId,
          text,
          offlineSolve.isSolved,
          offlineSolve.aiComment,
          offlineSolve.matchedPillars,
          offlineSolve.missingPillars
        );
        broadcastRoom(targetRoomId);
      } else if (action === 'UNLOCK_CLUE') {
        roomManager.unlockTurtleSoupClue(targetRoomId);
        broadcastRoom(targetRoomId);
      } else if (action === 'REVEAL_TRUTH') {
        soup.phase = 'REVEAL_TRUTH';
        room.aiMood = 'shocked';
        room.aiQuip = `汤底揭晓！看完真相是不是恍然大悟？准备好挑战下一碗海龟汤了吗？`;
        broadcastRoom(targetRoomId);
      } else if (action === 'NEXT_SOUP') {
        roomManager.startTurtleSoup(targetRoomId);
        broadcastRoom(targetRoomId);
      }
      return room;
    }

    case 'PARTY_ACTION': {
      if (!targetRoomId) return null;
      const { action } = msg.payload || {};
      if (action === 'TRIGGER_CEREMONY') {
        roomManager.triggerPartyCeremony(targetRoomId);
      } else if (action === 'CLOSE_CEREMONY') {
        roomManager.closePartyCeremony(targetRoomId);
      }
      broadcastRoom(targetRoomId);
      return roomManager.getRoom(targetRoomId);
    }

    case 'TRIGGER_AI_ROAST': {
      if (!targetRoomId) return null;
      const { context } = msg.payload || {};
      const roast = await generateAiRoast(context || '聚会现场气氛火热');
      const room = roomManager.getRoom(targetRoomId);
      if (room) {
        room.aiQuip = roast;
        room.aiMood = 'sarcastic';
        broadcastRoom(targetRoomId);
      }
      return room;
    }
  }
  return null;
}

wss.on('connection', (ws) => {
  clients.set(ws, { ws });

  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data.toString());
      const client = clients.get(ws);
      await processRoomMessage(msg, ws, client);
    } catch (e) {
      console.error('WebSocket message parsing error:', e);
    }
  });

  ws.on('close', () => {
    const client = clients.get(ws);
    if (client && client.roomId && client.playerId) {
      const rId = client.roomId;
      const pId = client.playerId;
      setTimeout(() => {
        let stillActive = false;
        for (const c of clients.values()) {
          if (c.roomId === rId && c.playerId === pId && c.ws.readyState === WebSocket.OPEN) {
            stillActive = true;
            break;
          }
        }
        if (!stillActive) {
          roomManager.removePlayer(rId, pId);
          broadcastRoom(rId);
        }
      }, 30000);
    }
    clients.delete(ws);
  });
});

// REST Endpoints for HTTP Fallback Sync & Multi-Device Resilience
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

app.get('/api/room/:roomId', (req, res) => {
  const room = roomManager.getRoom(req.params.roomId);
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }
  res.json({ room });
});

app.post('/api/action', async (req, res) => {
  try {
    const { type, payload } = req.body || {};
    const room = await processRoomMessage({ type, payload });
    res.json({ ok: true, room });
  } catch (err) {
    console.error('HTTP /api/action error:', err);
    res.status(500).json({ ok: false });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`PartyHub AI Server running at http://localhost:${PORT}`);
  });
}

startServer();
