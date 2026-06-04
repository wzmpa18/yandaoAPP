import { data as dp, realtime as rp } from '../providers';

export interface GameRoom {
  id: string;
  room_code: string;
  game_type: string;
  mode: 'pk' | 'coop' | 'chat';
  lang_code: string;
  players: RoomPlayer[];
  status: 'waiting' | 'playing' | 'finished';
  created_at: string;
}

export interface RoomPlayer {
  user_id: string;
  nickname: string;
  score: number;
  ready: boolean;
  joined_at: string;
}

function generateRoomCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export class MatchmakingSystem {
  static async findMatch(
    userId: string,
    nickname: string,
    gameType: string,
    langCode: string,
    mode: 'pk' | 'coop' | 'chat' = 'pk',
  ): Promise<GameRoom> {
    // Look for a waiting room with same settings and < 2 players
    const existing = await dp.select('game_rooms', {
      eq: { game_type: gameType, lang_code: langCode, mode, status: 'waiting' },
      order: { column: 'created_at', ascending: true },
      limit: 10,
    });

    const openRoom = (existing ?? []).find((r) => {
      const players = (r.players as RoomPlayer[]) ?? [];
      return players.length < 2 && !players.find((p) => p.user_id === userId);
    });

    if (openRoom) {
      return this.joinRoom(openRoom.room_code, userId, nickname);
    }

    // Create a new room
    return this.createRoom(userId, nickname, gameType, langCode, mode);
  }

  static async createRoom(
    userId: string,
    nickname: string,
    gameType: string,
    langCode: string,
    mode: 'pk' | 'coop' | 'chat' = 'pk',
  ): Promise<GameRoom> {
    const player: RoomPlayer = {
      user_id: userId,
      nickname,
      score: 0,
      ready: false,
      joined_at: new Date().toISOString(),
    };
    const code = generateRoomCode();
    const result = await dp.insert('game_rooms', [{
      room_code: code,
      game_type: gameType,
      mode,
      lang_code: langCode,
      players: [player],
      status: 'waiting',
    }]);

    if (!result || result.length === 0) throw new Error('创建房间失败');
    const data = result[0];
    return { ...data, players: (data.players as RoomPlayer[]), room_code: data.room_code as string } as GameRoom;
  }

  static async joinRoom(roomCode: string, userId: string, nickname: string): Promise<GameRoom> {
    const room = await dp.selectOne('game_rooms', { eq: { room_code: roomCode } });

    if (!room) throw new Error('房间不存在');
    const players = (room.players as RoomPlayer[]) ?? [];
    if (players.find((p) => p.user_id === userId)) {
      return { ...room, players } as GameRoom;
    }
    if (players.length >= 2) throw new Error('房间已满');

    const newPlayer: RoomPlayer = {
      user_id: userId,
      nickname,
      score: 0,
      ready: false,
      joined_at: new Date().toISOString(),
    };
    const updatedPlayers = [...players, newPlayer];
    const newStatus = updatedPlayers.length >= 2 ? 'playing' : 'waiting';

    await dp.update('game_rooms', { players: updatedPlayers, status: newStatus, updated_at: new Date().toISOString() }, { eq: { id: room.id as string } });

    return { ...room, players: updatedPlayers } as GameRoom;
  }

  static async leaveRoom(roomId: string, userId: string): Promise<void> {
    const room = await dp.selectOne('game_rooms', { eq: { id: roomId } });
    if (!room) return;
    const players = ((room.players as RoomPlayer[]) ?? []).filter((p) => p.user_id !== userId);
    const newStatus = players.length === 0 ? 'finished' : 'waiting';
    await dp.update('game_rooms', { players, status: newStatus, updated_at: new Date().toISOString() }, { eq: { id: roomId } });
  }

  static async updateScore(roomId: string, userId: string, score: number): Promise<void> {
    const room = await dp.selectOne('game_rooms', { eq: { id: roomId } });
    if (!room) return;
    const players = (room.players as RoomPlayer[]).map((p) =>
      p.user_id === userId ? { ...p, score } : p
    );
    await dp.update('game_rooms', { players }, { eq: { id: roomId } });
  }

  static async finishRoom(roomId: string): Promise<void> {
    await dp.update('game_rooms', { status: 'finished', updated_at: new Date().toISOString() }, { eq: { id: roomId } });
  }

  static subscribeToRoom(roomId: string, onUpdate: (room: GameRoom) => void) {
    return rp.subscribe('game_rooms', { column: 'id', value: roomId }, (_event, payload) => {
      const room = payload as GameRoom;
      onUpdate({ ...room, players: (room.players as unknown as RoomPlayer[]) });
    });
  }
}
