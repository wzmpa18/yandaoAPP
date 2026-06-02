import React, { useState, useEffect } from 'react';
import { MatchmakingSystem, GameRoom } from '../lib/MatchmakingSystem';

interface MatchmakingProps {
  sessionKey: string;
  gameType: string;
  langCode: string;
  mode: 'pk' | 'coop';
  onRoomReady: (room: GameRoom) => void;
  onCancel: () => void;
}

const DOTS = ['·', '··', '···'];

export const Matchmaking: React.FC<MatchmakingProps> = ({
  sessionKey, gameType, langCode, mode, onRoomReady, onCancel,
}) => {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [error, setError] = useState('');
  const [dots, setDots] = useState(0);
  const [copied, setCopied] = useState(false);
  const nickname = `玩家${sessionKey.slice(-4).toUpperCase()}`;

  useEffect(() => {
    let cancelled = false;
    MatchmakingSystem.findMatch(sessionKey, nickname, gameType, langCode, mode)
      .then((r) => { if (!cancelled) { setRoom(r); if (r.players.length >= 2) onRoomReady(r); } })
      .catch((e) => { if (!cancelled) setError(String(e)); });

    const t = setInterval(() => setDots((d) => (d + 1) % 3), 600);
    return () => { cancelled = true; clearInterval(t); };
  }, [sessionKey, nickname, gameType, langCode, mode, onRoomReady]);

  // Poll for room updates
  useEffect(() => {
    if (!room) return;
    const sub = MatchmakingSystem.subscribeToRoom(room.id, (updated) => {
      setRoom(updated);
      if (updated.players.length >= 2 || updated.status === 'playing') {
        onRoomReady(updated);
      }
    });
    return () => { sub.unsubscribe(); };
  }, [room?.id, onRoomReady]);

  function copyCode() {
    if (!room) return;
    navigator.clipboard?.writeText(room.room_code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mm-overlay">
      <div className="mm-card">
        <button className="mm-cancel" onClick={onCancel}>✕</button>

        <div className="mm-anim">
          <div className="mm-ring r1" />
          <div className="mm-ring r2" />
          <div className="mm-ring r3" />
          <span className="mm-center-icon">{mode === 'pk' ? '⚔️' : '🤝'}</span>
        </div>

        <h3 className="mm-title">
          {mode === 'pk' ? 'PK 匹配中' : '合作匹配中'}{DOTS[dots]}
        </h3>

        {room && (
          <>
            <p className="mm-hint">或分享房间码邀请好友</p>
            <div className="mm-code-row">
              <span className="mm-code">{room.room_code}</span>
              <button className="mm-copy" onClick={copyCode}>
                {copied ? '已复制' : '复制'}
              </button>
            </div>

            <div className="mm-players">
              <p className="mm-players-label">已加入玩家：</p>
              {room.players.map((p, i) => (
                <div key={i} className="mm-player-row">
                  <span className="mm-player-dot" />
                  <span className="mm-player-name">{p.nickname}</span>
                  <span className="mm-player-status">{p.ready ? '✓ 就绪' : '等待中…'}</span>
                </div>
              ))}
              {room.players.length < 2 && (
                <div className="mm-player-row pending">
                  <span className="mm-player-dot pending" />
                  <span className="mm-player-name">等待对手…</span>
                </div>
              )}
            </div>
          </>
        )}

        {error && <p className="mm-error">{error}</p>}
      </div>
    </div>
  );
};
