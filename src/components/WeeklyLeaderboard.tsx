import React, { useState, useEffect, useCallback } from 'react';
import { FloatingBack } from './FloatingBack';
import { supabase } from '../lib/supabase';
import { useUI } from '../lib/UILanguageContext';

const SESSION_KEY_STORE = 'yandao_session_v5';
function getSessionKey() { return localStorage.getItem(SESSION_KEY_STORE) ?? 'anon'; }

const TIERS = [
  { key: 'bronze',    label: '青铜',  labelEn: 'Bronze',    icon: '🥉', color: '#CD7F32', minXP: 0   },
  { key: 'silver',    label: '白银',  labelEn: 'Silver',    icon: '🥈', color: '#9B9189', minXP: 200 },
  { key: 'gold',      label: '黄金',  labelEn: 'Gold',      icon: '🥇', color: '#C9A574', minXP: 500 },
  { key: 'sapphire',  label: '蓝宝石',labelEn: 'Sapphire',  icon: '💎', color: '#4A7FA5', minXP: 900 },
  { key: 'diamond',   label: '钻石',  labelEn: 'Diamond',   icon: '👑', color: '#C9553D', minXP: 1500},
];

function getTier(xp: number) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (xp >= TIERS[i].minXP) return TIERS[i];
  }
  return TIERS[0];
}

function getNextTier(xp: number) {
  for (let i = 0; i < TIERS.length; i++) {
    if (xp < TIERS[i].minXP) return TIERS[i];
  }
  return null;
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d.setDate(diff));
  return mon.toISOString().split('T')[0];
}

interface RankEntry {
  session_key: string;
  xp_earned: number;
  rank_tier: string;
  display_name?: string;
}

interface WeeklyLeaderboardProps {
  sessionKey?: string;
  currentWeekXP?: number;
  onBack: () => void;
}

export const WeeklyLeaderboard: React.FC<WeeklyLeaderboardProps> = ({
  sessionKey: propKey,
  currentWeekXP = 0,
  onBack,
}) => {
  const { uiLang } = useUI();
  const sessionKey = propKey ?? getSessionKey();
  const weekStart = getWeekStart();
  const [entries, setEntries] = useState<RankEntry[]>([]);
  const [myEntry, setMyEntry] = useState<RankEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'global' | 'friends'>('global');

  const upsertMyXP = useCallback(async () => {
    const tier = getTier(currentWeekXP);
    await supabase.from('weekly_xp').upsert({
      session_key: sessionKey,
      week_start: weekStart,
      xp_earned: currentWeekXP,
      rank_tier: tier.key,
    }, { onConflict: 'session_key,week_start' });
  }, [sessionKey, weekStart, currentWeekXP]);

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    await upsertMyXP();
    const { data } = await supabase
      .from('weekly_xp')
      .select('session_key, xp_earned, rank_tier')
      .eq('week_start', weekStart)
      .order('xp_earned', { ascending: false })
      .limit(50);

    const rows = (data ?? []) as RankEntry[];
    setEntries(rows);
    const me = rows.find((r) => r.session_key === sessionKey) ?? {
      session_key: sessionKey,
      xp_earned: currentWeekXP,
      rank_tier: getTier(currentWeekXP).key,
    };
    setMyEntry(me);
    setLoading(false);
  }, [sessionKey, weekStart, currentWeekXP, upsertMyXP]);

  useEffect(() => { loadLeaderboard(); }, [loadLeaderboard]);

  const myTier = getTier(myEntry?.xp_earned ?? 0);
  const nextTier = getNextTier(myEntry?.xp_earned ?? 0);
  const myRank = entries.findIndex((e) => e.session_key === sessionKey) + 1;

  const progress = nextTier
    ? Math.min(((myEntry?.xp_earned ?? 0) - myTier.minXP) / (nextTier.minXP - myTier.minXP) * 100, 100)
    : 100;

  const isZh = uiLang === 'zh' || uiLang === 'ja' || uiLang === 'ko';

  function tierLabel(tier: typeof TIERS[0]) {
    return isZh ? tier.label : tier.labelEn;
  }

  return (
    <div className="lb-wrap">
      <FloatingBack onClick={onBack} />

      <div className="lb-header">
        <div className="lb-header-crown">{myTier.icon}</div>
        <h1 className="lb-title">{isZh ? '本周排行榜' : 'Weekly Leaderboard'}</h1>
        <p className="lb-week-label">{isZh ? `本周起始：${weekStart}` : `Week of ${weekStart}`}</p>
      </div>

      {/* My rank card */}
      <div className="lb-my-card" style={{ borderColor: myTier.color }}>
        <div className="lb-my-left">
          <span className="lb-my-rank">#{myRank || '—'}</span>
          <div className="lb-my-info">
            <span className="lb-my-tier" style={{ color: myTier.color }}>
              {myTier.icon} {tierLabel(myTier)}
            </span>
            <span className="lb-my-xp">{myEntry?.xp_earned ?? 0} XP</span>
          </div>
        </div>
        <div className="lb-my-right">
          {nextTier ? (
            <>
              <div className="lb-progress-bar">
                <div className="lb-progress-fill" style={{ width: `${progress}%`, background: myTier.color }} />
              </div>
              <span className="lb-progress-label">
                {isZh ? `距${tierLabel(nextTier)}还需` : `To ${tierLabel(nextTier)}:`} {nextTier.minXP - (myEntry?.xp_earned ?? 0)} XP
              </span>
            </>
          ) : (
            <span className="lb-max-tier">{isZh ? '已达最高段位 👑' : 'Max rank reached 👑'}</span>
          )}
        </div>
      </div>

      {/* Tier legend */}
      <div className="lb-tier-strip">
        {TIERS.map((t) => (
          <div key={t.key} className={`lb-tier-chip ${myTier.key === t.key ? 'active' : ''}`} style={myTier.key === t.key ? { borderColor: t.color, color: t.color } : {}}>
            <span>{t.icon}</span>
            <span className="lb-tier-chip-label">{tierLabel(t)}</span>
            <span className="lb-tier-chip-xp">{t.minXP}+</span>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="lb-tabs">
        <button className={`lb-tab ${tab === 'global' ? 'active' : ''}`} onClick={() => setTab('global')}>
          {isZh ? '全球榜' : 'Global'}
        </button>
        <button className={`lb-tab ${tab === 'friends' ? 'active' : ''}`} onClick={() => setTab('friends')}>
          {isZh ? '好友榜' : 'Friends'}
        </button>
      </div>

      {loading ? (
        <div className="lb-loading">⏳</div>
      ) : (
        <div className="lb-list">
          {entries.length === 0 ? (
            <div className="lb-empty">{isZh ? '本周暂无排名数据' : 'No data this week yet'}</div>
          ) : (
            entries.slice(0, 30).map((entry, idx) => {
              const tier = getTier(entry.xp_earned);
              const isMe = entry.session_key === sessionKey;
              const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
              const shortKey = entry.session_key.slice(-6).toUpperCase();
              return (
                <div key={entry.session_key} className={`lb-entry ${isMe ? 'mine' : ''}`}>
                  <span className="lb-entry-rank">{medal}</span>
                  <div className="lb-entry-info">
                    <span className="lb-entry-name">{isMe ? (isZh ? '我' : 'Me') : `用户${shortKey}`}</span>
                    <span className="lb-entry-tier" style={{ color: tier.color }}>{tier.icon} {tierLabel(tier)}</span>
                  </div>
                  <span className="lb-entry-xp">{entry.xp_earned} XP</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
