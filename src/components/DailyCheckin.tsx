import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../data/supabase';
import { getTodayCheckin, getStreakCount, getReferralFrozenCount, isOfflineMode } from '../lib/offlineData';

interface DailyCheckinProps {
  sessionKey: string;
  languageCode: string;
  onCheckin: (xp: number) => void;
}

interface FrozenEarning {
  id: string;
  invitee_key: string;
  invitee_checkin_days: number;
  is_frozen: boolean;
}

const DailyCheckin: React.FC<DailyCheckinProps> = ({ sessionKey, languageCode, onCheckin }) => {
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [streak, setStreak] = useState(0);
  const [frozenCount, setFrozenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const thawEligibleEarnings = useCallback(async (rows: FrozenEarning[]) => {
    const toThaw = rows.filter(
      (r) => r.is_frozen && r.invitee_checkin_days >= 3
    );
    if (toThaw.length === 0) return;

    await supabase
      .from('referral_earnings')
      .update({ is_frozen: false, unfreeze_at: new Date().toISOString() })
      .in('id', toThaw.map((r) => r.id));
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);

    if (isOfflineMode()) {
      // Use offline data
      const todayRow = getTodayCheckin(sessionKey);
      setCheckedInToday(!!todayRow);
      setStreak(getStreakCount(sessionKey));
      setFrozenCount(getReferralFrozenCount());
      setLoading(false);
      return;
    }

    // Check today's checkin
    const { data: todayRow } = await supabase
      .from('user_learning_daily')
      .select('id')
      .eq('session_key', sessionKey)
      .eq('checkin_date', today)
      .maybeSingle();

    setCheckedInToday(!!todayRow);

    // Count distinct checkin dates for streak
    const { data: allDates } = await supabase
      .from('user_learning_daily')
      .select('checkin_date')
      .eq('session_key', sessionKey);

    const distinctDates = allDates
      ? [...new Set(allDates.map((r: { checkin_date: string }) => r.checkin_date))]
      : [];
    setStreak(distinctDates.length);

    // Load frozen referral earnings where this user is the invitee
    const { data: frozenRows } = await supabase
      .from('referral_earnings')
      .select('id, invitee_key, invitee_checkin_days, is_frozen')
      .eq('invitee_key', sessionKey)
      .eq('is_frozen', true);

    if (frozenRows && frozenRows.length > 0) {
      await thawEligibleEarnings(frozenRows as FrozenEarning[]);
    }

    // Count still-frozen earnings for this user as referrer
    const { data: referrerFrozen } = await supabase
      .from('referral_earnings')
      .select('id')
      .eq('referrer_key', sessionKey)
      .eq('is_frozen', true);

    setFrozenCount(referrerFrozen?.length ?? 0);

    setLoading(false);
  }, [sessionKey, today, thawEligibleEarnings]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const doCheckin = async () => {
    if (checkedInToday || checking) return;
    setChecking(true);

    const { error: insertError } = await supabase
      .from('user_learning_daily')
      .insert({
        session_key: sessionKey,
        checkin_date: today,
        lang_code: languageCode,
        xp_earned: 10,
      });

    if (insertError) {
      setChecking(false);
      return;
    }

    // Increment invitee_checkin_days on any referral_earnings rows where this user is the invitee
    const { data: inviteeRows } = await supabase
      .from('referral_earnings')
      .select('id, invitee_checkin_days, is_frozen')
      .eq('invitee_key', sessionKey);

    if (inviteeRows && inviteeRows.length > 0) {
      for (const row of inviteeRows as { id: string; invitee_checkin_days: number; is_frozen: boolean }[]) {
        const newDays = (row.invitee_checkin_days ?? 0) + 1;
        const shouldUnfreeze = row.is_frozen && newDays >= 3;
        await supabase
          .from('referral_earnings')
          .update({
            invitee_checkin_days: newDays,
            ...(shouldUnfreeze
              ? { is_frozen: false, unfreeze_at: new Date().toISOString() }
              : {}),
          })
          .eq('id', row.id);
      }
    }

    onCheckin(10);
    setCheckedInToday(true);
    setStreak((prev) => prev + 1);
    setChecking(false);

    // Refresh frozen count after checkin
    const { data: referrerFrozen } = await supabase
      .from('referral_earnings')
      .select('id')
      .eq('referrer_key', sessionKey)
      .eq('is_frozen', true);
    setFrozenCount(referrerFrozen?.length ?? 0);
  };

  if (loading) {
    return (
      <div className="dc-wrap">
        <span className="dc-streak" style={{ opacity: 0.4 }}>加载中…</span>
      </div>
    );
  }

  return (
    <div className="dc-wrap">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {checkedInToday ? (
          <span className="dc-checked-badge">已打卡 ✓</span>
        ) : (
          <button
            className="dc-checkin-btn"
            onClick={doCheckin}
            disabled={checking}
          >
            {checking ? '打卡中…' : '🔥 今日打卡'}
          </button>
        )}

        <span className="dc-streak">连续 {streak} 天</span>
      </div>

      {frozenCount > 0 && (
        <p className="dc-frozen-note">
          邀请佣金冻结中：{frozenCount} 笔 · 好友打卡满3天解冻
        </p>
      )}
    </div>
  );
};

export default DailyCheckin;
