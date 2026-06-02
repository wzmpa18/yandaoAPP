import React, { useState, useCallback } from 'react';
import { MatchmakingSystem, GameRoom } from '../../lib/MatchmakingSystem';
import { AICoach } from '../AICoach';

interface BuddyChatProps {
  langCode: string;
  langName: string;
  sessionKey: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  onXP: (delta: number) => void;
  onBack: () => void;
}

type ChatMode = 'menu' | 'ai' | 'matching' | 'room';

interface ChatMessage {
  userId: string;
  nickname: string;
  text: string;
  ts: number;
}

const AI_ROLES = [
  { key: 'panda',    emoji: '🐼', name: '熊猫老师', desc: '温柔耐心，鼓励为主' },
  { key: 'tsundere', emoji: '😤', name: '毒舌傲娇', desc: '刻薄但有用，刺激型' },
  { key: 'funny',    emoji: '🤡', name: '搞笑搭档', desc: '欢乐气氛，轻松学习' },
  { key: 'sweet',    emoji: '🥰', name: '甜蜜陪练', desc: '贴心鼓励，甜甜软软' },
];

function rateConversation(messages: ChatMessage[], userId: string): number {
  const mine = messages.filter((m) => m.userId === userId);
  if (mine.length === 0) return 1;
  const avgLen = mine.reduce((s, m) => s + m.text.length, 0) / mine.length;
  return Math.min(5, Math.max(1, Math.round(avgLen / 8)));
}

export const BuddyChat: React.FC<BuddyChatProps> = ({
  langCode, langName, sessionKey, userLevel, onXP, onBack,
}) => {
  const [mode, setMode] = useState<ChatMode>('menu');
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [matching, setMatching] = useState(false);
  const [matchError, setMatchError] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [roomCodeInput, setRoomCodeInput] = useState('');

  const nickname = `玩家${sessionKey.slice(-4).toUpperCase()}`;

  const startMatching = useCallback(async () => {
    setMatching(true);
    setMatchError('');
    try {
      const r = await MatchmakingSystem.findMatch(sessionKey, nickname, 'buddy_chat', langCode, 'chat');
      setRoom(r);
      setMessages([{ userId: 'system', nickname: '系统', text: `${nickname} 进入了房间 (${r.room_code})，等待对方…`, ts: Date.now() }]);
      setMode('room');
    } catch (e) {
      setMatchError(String(e));
    } finally {
      setMatching(false);
    }
  }, [sessionKey, nickname, langCode]);

  const joinByCode = useCallback(async () => {
    if (!roomCodeInput.trim()) return;
    setMatching(true);
    setMatchError('');
    try {
      const r = await MatchmakingSystem.joinRoom(roomCodeInput.trim().toUpperCase(), sessionKey, nickname);
      setRoom(r);
      setMessages([{ userId: 'system', nickname: '系统', text: `成功加入房间 ${r.room_code}！开始练习吧！`, ts: Date.now() }]);
      setMode('room');
    } catch (e) {
      setMatchError(String(e));
    } finally {
      setMatching(false);
    }
  }, [roomCodeInput, sessionKey, nickname]);

  function sendMessage() {
    if (!input.trim() || !room) return;
    setMessages((m) => [...m, { userId: sessionKey, nickname, text: input.trim(), ts: Date.now() }]);
    setInput('');
  }

  function endChat() {
    if (!room) { setMode('menu'); return; }
    const stars = rateConversation(messages, sessionKey);
    setRating(stars);
    onXP(stars * 10);
    MatchmakingSystem.leaveRoom(room.id, sessionKey);
  }

  if (mode === 'ai') {
    return <AICoach langCode={langCode} langName={langName} userLevel={userLevel} onBack={() => setMode('menu')} />;
  }

  if (mode === 'menu') {
    return (
      <div className="bc-shell">
        <div className="bc-topbar">
          <button className="bc-back" onClick={onBack}>←</button>
          <span className="bc-title">语伴对话 · {langName}</span>
        </div>

        <div className="bc-section-label">AI 陪练 · 选择角色</div>
        <div className="bc-role-grid">
          {AI_ROLES.map((role) => (
            <button key={role.key} className="bc-role-card" onClick={() => setMode('ai')}>
              <span className="bc-role-emoji">{role.emoji}</span>
              <span className="bc-role-name">{role.name}</span>
              <span className="bc-role-desc">{role.desc}</span>
            </button>
          ))}
        </div>

        <div className="bc-section-label">真人匹配</div>
        <div className="bc-mode-cards">
          <button className="bc-mode-card" onClick={startMatching} disabled={matching}>
            <span className="bc-mode-icon">🎲</span>
            <span className="bc-mode-name">随机匹配</span>
            <span className="bc-mode-desc">寻找同水平语伴</span>
          </button>
          <div className="bc-mode-card join-card">
            <span className="bc-mode-icon">🔗</span>
            <span className="bc-mode-name">加入房间</span>
            <div className="bc-join-row">
              <input
                className="bc-code-input"
                value={roomCodeInput}
                placeholder="输入6位房间码"
                maxLength={6}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
              />
              <button className="bc-join-btn" onClick={joinByCode}>加入</button>
            </div>
          </div>
        </div>

        {matching && <div className="bc-matching">匹配中…</div>}
        {matchError && <div className="bc-error">{matchError}</div>}
      </div>
    );
  }

  if (mode === 'room' && room) {
    return (
      <div className="bc-shell">
        <div className="bc-topbar">
          <button className="bc-back" onClick={() => { MatchmakingSystem.leaveRoom(room.id, sessionKey); setMode('menu'); }}>←</button>
          <span className="bc-title">房间 {room.room_code}</span>
          <button className="bc-end-btn" onClick={endChat}>结束</button>
        </div>

        <div className="bc-chat">
          {messages.map((m, i) => (
            <div key={i} className={`bc-msg ${m.userId === sessionKey ? 'mine' : m.userId === 'system' ? 'system' : 'other'}`}>
              {m.userId !== sessionKey && m.userId !== 'system' && (
                <span className="bc-msg-name">{m.nickname}</span>
              )}
              <div className="bc-msg-bubble">{m.text}</div>
            </div>
          ))}
        </div>

        <div className="bc-input-row">
          <input
            className="bc-input"
            value={input}
            placeholder={`用${langName}说点什么…`}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button className="bc-send" onClick={sendMessage}>发送</button>
        </div>

        {rating !== null && (
          <div className="bc-rating-overlay">
            <div className="bc-rating-box">
              <h3>对话评分</h3>
              <div className="bc-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < rating ? 'star-on' : 'star-off'}>★</span>
                ))}
              </div>
              <p>{rating >= 4 ? '精彩！' : rating >= 3 ? '不错！' : '继续加油！'}</p>
              <button className="bc-close-rating" onClick={() => { setRating(null); setMode('menu'); }}>返回</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
