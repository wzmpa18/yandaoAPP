import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../data/supabase';

const SESSION_KEY_STORE = 'yandao_session_v5';
const SHIELD_COST_DIAMONDS = 50;

function getSessionKey() { return localStorage.getItem(SESSION_KEY_STORE) ?? 'anon'; }

interface StreakShieldProps {
  diamonds: number;
  streak: number;
  onPurchase?: (newDiamonds: number, newShields: number) => void;
  compact?: boolean;
}

export const StreakShield: React.FC<StreakShieldProps> = ({
  diamonds, streak, onPurchase, compact = false,
}) => {
  const sessionKey = getSessionKey();
  const [shields, setShields] = useState(0);
  const [buying, setBuying] = useState(false);
  const [msg, setMsg] = useState('');

  const loadShields = useCallback(async () => {
    const { data } = await supabase
      .from('streak_shields')
      .select('shields_count')
      .eq('session_key', sessionKey)
      .maybeSingle();
    if (data) setShields(data.shields_count);
  }, [sessionKey]);

  useEffect(() => { loadShields(); }, [loadShields]);

  async function buyShield() {
    if (diamonds < SHIELD_COST_DIAMONDS) {
      setMsg('钻石不足');
      setTimeout(() => setMsg(''), 2000);
      return;
    }
    setBuying(true);
    const newDiamonds = diamonds - SHIELD_COST_DIAMONDS;
    const newShields = shields + 1;

    await supabase.from('streak_shields').upsert({
      session_key: sessionKey,
      shields_count: newShields,
      total_purchased: newShields,
    }, { onConflict: 'session_key' });

    setShields(newShields);
    onPurchase?.(newDiamonds, newShields);
    setMsg('连胜冻结已购入 ✓');
    setTimeout(() => setMsg(''), 2500);
    setBuying(false);
  }

  if (compact) {
    return (
      <div className="ss-compact">
        <span className="ss-compact-icon">🛡️</span>
        <span className="ss-compact-count">{shields}</span>
      </div>
    );
  }

  return (
    <div className="ss-card">
      <div className="ss-header">
        <span className="ss-icon">🛡️</span>
        <div className="ss-info">
          <h3 className="ss-title">连胜冻结</h3>
          <p className="ss-desc">断卡时自动消耗一枚，保留连胜天数</p>
        </div>
        <div className="ss-count-badge">{shields} 枚</div>
      </div>

      <div className="ss-stats-row">
        <div className="ss-stat">
          <span className="ss-stat-icon">🔥</span>
          <span className="ss-stat-val">{streak}</span>
          <span className="ss-stat-label">当前连胜</span>
        </div>
        <div className="ss-stat">
          <span className="ss-stat-icon">💎</span>
          <span className="ss-stat-val">{diamonds}</span>
          <span className="ss-stat-label">我的钻石</span>
        </div>
        <div className="ss-stat">
          <span className="ss-stat-icon">🛡️</span>
          <span className="ss-stat-val">{shields}</span>
          <span className="ss-stat-label">冻结道具</span>
        </div>
      </div>

      <div className="ss-how-it-works">
        <div className="ss-how-step">
          <span className="ss-how-num">1</span>
          <span>今天忘记打卡或游戏失误</span>
        </div>
        <div className="ss-how-step">
          <span className="ss-how-num">2</span>
          <span>系统自动消耗一枚冻结道具</span>
        </div>
        <div className="ss-how-step">
          <span className="ss-how-num">3</span>
          <span>连胜天数保留，明天继续</span>
        </div>
      </div>

      <button
        className="ss-buy-btn"
        onClick={buyShield}
        disabled={buying || diamonds < SHIELD_COST_DIAMONDS}
      >
        {buying ? '购买中…' : `购买 1 枚 · 消耗 ${SHIELD_COST_DIAMONDS} 💎`}
      </button>

      {msg && <div className="ss-msg">{msg}</div>}
    </div>
  );
};

/** Call this on daily check to auto-consume a shield if streak would break */
export async function tryConsumeShield(sessionKey: string): Promise<boolean> {
  const { data } = await supabase
    .from('streak_shields')
    .select('shields_count')
    .eq('session_key', sessionKey)
    .maybeSingle();

  if (!data || data.shields_count <= 0) return false;

  const newCount = data.shields_count - 1;
  await supabase
    .from('streak_shields')
    .update({ shields_count: newCount })
    .eq('session_key', sessionKey);

  return true;
}
