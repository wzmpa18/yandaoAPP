import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../data/supabase';
import { InfiniteGameGenerator } from '../lib/InfiniteGameGenerator';
import { FloatingBack } from './FloatingBack';

interface SeasonRankingProps {
  sessionKey: string;
  onBack: () => void;
}

interface RankEntry {
  user_id: string;
  total_score: number;
  rank: number;
  rewards_claimed: boolean;
}

interface SeasonInfo {
  id: string;
  season_number: number;
  end_date: string;
  reward_tiers: Record<string, { badge?: string; diamonds?: number; xp?: number }>;
}

function daysLeft(endDate: string): number {
  return Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000));
}

function shortId(userId: string): string {
  return `玩家${userId.slice(-4).toUpperCase()}`;
}

function medalFor(rank: number, total: number): { icon: string; tier: string } {
  const pct = rank / Math.max(total, 1);
  if (pct <= 0.1) return { icon: '🥇', tier: '金牌' };
  if (pct <= 0.3) return { icon: '🥈', tier: '银牌' };
  if (pct <= 0.6) return { icon: '🥉', tier: '铜牌' };
  return { icon: '🎗', tier: '参与' };
}

export const SeasonRanking: React.FC<SeasonRankingProps> = ({ sessionKey, onBack }) => {
  const [tab, setTab] = useState<'global' | 'friends'>('global');
  const [season, setSeason] = useState<SeasonInfo | null>(null);
  const [rankings, setRankings] = useState<RankEntry[]>([]);
  const [myRank, setMyRank] = useState<RankEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const s = await InfiniteGameGenerator.getSeasonInfo();
    if (s) setSeason(s as SeasonInfo);

    if (s) {
      const { data } = await supabase
        .from('season_rankings')
        .select('user_id,total_score,rank,rewards_claimed')
        .eq('season_id', s.id)
        .order('total_score', { ascending: false })
        .limit(50);

      const entries = (data ?? []) as RankEntry[];
      // Assign ranks in memory
      entries.forEach((e, i) => { e.rank = i + 1; });
      setRankings(entries);
      setMyRank(entries.find((e) => e.user_id === sessionKey) ?? null);
    }
    setLoading(false);
  }, [sessionKey]);

  useEffect(() => { load(); }, [load]);

  const totalPlayers = rankings.length;

  return (
    <div className="sr-shell">
      <FloatingBack onClick={onBack} />

      <div className="sr-header">
        <h2 className="sr-title">赛季排行榜</h2>
        {season && (
          <div className="sr-season-info">
            <span className="sr-season-badge">S{season.season_number}</span>
            <span className="sr-season-days">剩余 {daysLeft(season.end_date)} 天</span>
          </div>
        )}
      </div>

      {/* Reward tiers */}
      {season && (
        <div className="sr-tiers">
          <div className="sr-tier gold"><span>🥇</span><span>前10%</span><span>金牌 + 500💎</span></div>
          <div className="sr-tier silver"><span>🥈</span><span>前30%</span><span>银牌 + 200💎</span></div>
          <div className="sr-tier bronze"><span>🥉</span><span>前60%</span><span>铜牌 + 50💎</span></div>
          <div className="sr-tier part"><span>🎗</span><span>参与</span><span>1000 XP</span></div>
        </div>
      )}

      {/* My rank */}
      {myRank && (
        <div className="sr-my-rank">
          <span className="sr-my-rank-label">我的排名</span>
          <span className="sr-my-rank-num">#{myRank.rank}</span>
          <span className="sr-my-score">{myRank.total_score} 分</span>
          <span className="sr-my-medal">{medalFor(myRank.rank, totalPlayers).icon}</span>
        </div>
      )}

      <div className="sr-tabs">
        <button className={`sr-tab ${tab === 'global' ? 'active' : ''}`} onClick={() => setTab('global')}>全服榜</button>
        <button className={`sr-tab ${tab === 'friends' ? 'active' : ''}`} onClick={() => setTab('friends')}>好友榜</button>
      </div>

      {loading && <div className="sr-loading">加载排行榜…</div>}

      {!loading && tab === 'global' && (
        <div className="sr-list">
          {rankings.length === 0 && <div className="sr-empty">还没有人上榜，快去刷分吧！</div>}
          {rankings.map((entry, i) => {
            const medal = medalFor(entry.rank, totalPlayers);
            const isMe = entry.user_id === sessionKey;
            return (
              <div key={entry.user_id} className={`sr-row ${isMe ? 'mine' : ''}`}>
                <span className="sr-rank-num">#{entry.rank}</span>
                <span className="sr-medal">{medal.icon}</span>
                <span className="sr-name">{isMe ? '我' : shortId(entry.user_id)}</span>
                <span className="sr-score">{entry.total_score} 分</span>
              </div>
            );
          })}
        </div>
      )}

      {!loading && tab === 'friends' && (
        <div className="sr-empty-friends">
          <p>邀请好友加入后，可以在这里看到好友排名</p>
        </div>
      )}
    </div>
  );
};
