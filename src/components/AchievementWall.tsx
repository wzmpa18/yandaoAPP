import React, { useState, useEffect, useCallback } from 'react';
import { FloatingBack } from './FloatingBack';
import { supabase } from '../data/supabase';
import { useUI } from '../lib/UILanguageContext';
import { getAchievements, isOfflineMode } from '../lib/offlineData';

const SESSION_KEY_STORE = 'yandao_session_v5';
function getSessionKey() { return localStorage.getItem(SESSION_KEY_STORE) ?? 'anon'; }

interface Achievement {
  achievement_key: string;
  achievement_name: string;
  achievement_icon: string;
  achievement_desc: string;
  earned_at: string;
}

interface AchievementWallProps {
  sessionKey?: string;
  xp?: number;
  streak?: number;
  onBack: () => void;
}

const ALL_ACHIEVEMENTS = [
  { key: 'first_step',     icon: '🌱', name: '学习启程',   desc: '完成第一次打卡',          threshold: (xp: number) => xp >= 1 },
  { key: 'xp_100',         icon: '⚡', name: '百题达人',   desc: '累计获得 100 XP',          threshold: (xp: number) => xp >= 100 },
  { key: 'xp_500',         icon: '🔥', name: '五百斗士',   desc: '累计获得 500 XP',          threshold: (xp: number) => xp >= 500 },
  { key: 'xp_1000',        icon: '💎', name: '千题精英',   desc: '累计获得 1000 XP',         threshold: (xp: number) => xp >= 1000 },
  { key: 'xp_5000',        icon: '👑', name: '万里长征',   desc: '累计获得 5000 XP',         threshold: (xp: number) => xp >= 5000 },
  { key: 'streak_3',       icon: '🔥', name: '三日不辍',   desc: '连续学习 3 天',             threshold: (_: number, s: number) => s >= 3 },
  { key: 'streak_7',       icon: '🌟', name: '一周坚持',   desc: '连续学习 7 天',             threshold: (_: number, s: number) => s >= 7 },
  { key: 'streak_30',      icon: '🏆', name: '月度常青',   desc: '连续学习 30 天',            threshold: (_: number, s: number) => s >= 30 },
  { key: 'streak_100',     icon: '🦅', name: '百日精进',   desc: '连续学习 100 天',           threshold: (_: number, s: number) => s >= 100 },
  { key: 'multilingual',   icon: '🌍', name: '多语先锋',   desc: '更换过目标语言',            threshold: (xp: number) => xp >= 300 },
  { key: 'game_master',    icon: '🎮', name: '游戏大师',   desc: '累计获得 2000 XP',         threshold: (xp: number) => xp >= 2000 },
  { key: 'social_butterfly',icon: '🤝',name: '社交达人',   desc: '累计获得 3000 XP',         threshold: (xp: number) => xp >= 3000 },
  { key: 'silver_rank',    icon: '🥈', name: '白银晋级',   desc: '首次达到白银段位',          threshold: (xp: number) => xp >= 200 },
  { key: 'gold_rank',      icon: '🥇', name: '黄金晋级',   desc: '首次达到黄金段位',          threshold: (xp: number) => xp >= 500 },
  { key: 'diamond_rank',   icon: '💎', name: '钻石封神',   desc: '首次达到钻石段位',          threshold: (xp: number) => xp >= 1500 },
];

export const AchievementWall: React.FC<AchievementWallProps> = ({
  sessionKey: propKey,
  xp = 0,
  streak = 0,
  onBack,
}) => {
  const { uiLang } = useUI();
  const isZh = ['zh', 'ja', 'ko'].includes(uiLang);
  const sessionKey = propKey ?? getSessionKey();
  const [earned, setEarned] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAchievements = useCallback(async () => {
    setLoading(true);

    if (isOfflineMode()) {
      // Use offline achievement data
      setEarned(getAchievements() as Achievement[]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('session_key', sessionKey)
      .order('earned_at', { ascending: false });

    if (!data || data.length === 0) {
      // Supabase empty — use offline data
      setEarned(getAchievements() as Achievement[]);
      setLoading(false);
      return;
    }

    setEarned(data as Achievement[]);

    // Auto-grant achievements based on current stats
    const toGrant = ALL_ACHIEVEMENTS.filter((a) => {
      const alreadyEarned = data.some((e: Achievement) => e.achievement_key === a.key);
      return !alreadyEarned && a.threshold(xp, streak);
    });

    if (toGrant.length > 0) {
      await supabase.from('user_achievements').upsert(
        toGrant.map((a) => ({
          session_key: sessionKey,
          achievement_key: a.key,
          achievement_name: a.name,
          achievement_icon: a.icon,
          achievement_desc: a.desc,
          earned_at: new Date().toISOString(),
        })),
        { onConflict: 'session_key,achievement_key' }
      );
      // Reload
      const { data: fresh } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('session_key', sessionKey)
        .order('earned_at', { ascending: false });
      setEarned((fresh ?? []) as Achievement[]);
    }

    setLoading(false);
  }, [sessionKey, xp, streak]);

  useEffect(() => { loadAchievements(); }, [loadAchievements]);

  const earnedKeys = new Set(earned.map((e) => e.achievement_key));
  const earnedCount = earned.length;
  const totalCount = ALL_ACHIEVEMENTS.length;

  return (
    <div className="aw-wrap">
      <FloatingBack onClick={onBack} />
      <div className="aw-header">
        <h1 className="aw-title">{isZh ? '成就墙' : 'Achievement Wall'}</h1>
        <p className="aw-subtitle">
          {isZh ? `已解锁 ${earnedCount} / ${totalCount}` : `Unlocked ${earnedCount} / ${totalCount}`}
        </p>
      </div>

      {/* Stats summary */}
      <div className="aw-stats">
        <div className="aw-stat">
          <span className="aw-stat-icon">✨</span>
          <span className="aw-stat-val">{xp}</span>
          <span className="aw-stat-label">XP</span>
        </div>
        <div className="aw-stat">
          <span className="aw-stat-icon">🔥</span>
          <span className="aw-stat-val">{streak}</span>
          <span className="aw-stat-label">{isZh ? '连胜天数' : 'Streak'}</span>
        </div>
        <div className="aw-stat">
          <span className="aw-stat-icon">🏆</span>
          <span className="aw-stat-val">{earnedCount}</span>
          <span className="aw-stat-label">{isZh ? '成就' : 'Achieved'}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="aw-progress-wrap">
        <div className="aw-progress-bar">
          <div className="aw-progress-fill" style={{ width: `${(earnedCount / totalCount) * 100}%` }} />
        </div>
        <span className="aw-progress-pct">{Math.round((earnedCount / totalCount) * 100)}%</span>
      </div>

      {loading ? (
        <div className="aw-loading">⏳</div>
      ) : (
        <div className="aw-grid">
          {ALL_ACHIEVEMENTS.map((a) => {
            const isEarned = earnedKeys.has(a.key);
            const earnedEntry = earned.find((e) => e.achievement_key === a.key);
            return (
              <div key={a.key} className={`aw-badge ${isEarned ? 'earned' : 'locked'}`}>
                <div className="aw-badge-icon">{a.icon}</div>
                <div className="aw-badge-name">{a.name}</div>
                <div className="aw-badge-desc">{a.desc}</div>
                {isEarned && earnedEntry && (
                  <div className="aw-badge-date">
                    {new Date(earnedEntry.earned_at).toLocaleDateString('zh-CN')}
                  </div>
                )}
                {!isEarned && <div className="aw-badge-lock">🔒</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/** Utility: grant a specific achievement */
export async function grantAchievement(sessionKey: string, key: string) {
  const a = ALL_ACHIEVEMENTS.find((a) => a.key === key);
  if (!a) return;
  await supabase.from('user_achievements').upsert({
    session_key: sessionKey,
    achievement_key: a.key,
    achievement_name: a.name,
    achievement_icon: a.icon,
    achievement_desc: a.desc,
    earned_at: new Date().toISOString(),
  }, { onConflict: 'session_key,achievement_key' });
}
