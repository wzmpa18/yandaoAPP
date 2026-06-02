import React, { useState, useEffect, useCallback } from 'react';
import { FloatingBack } from './FloatingBack';
import { supabase } from '../lib/supabase';
import { Confetti } from './Confetti';
import { useUI } from '../lib/UILanguageContext';

const SESSION_KEY_STORE = 'yandao_session_v5';
function getSessionKey() { return localStorage.getItem(SESSION_KEY_STORE) ?? 'anon'; }

interface DailyTask {
  id?: string;
  task_type: string;
  task_label: string;
  target_value: number;
  current_value: number;
  completed: boolean;
  reward_claimed: boolean;
  xp_reward: number;
  diamond_reward: number;
}

const TASK_TEMPLATES = [
  { task_type: 'play_games',     task_label: '完成 2 局游戏',     target_value: 2,  xp_reward: 30, diamond_reward: 0 },
  { task_type: 'earn_xp',        task_label: '获得 50 XP',        target_value: 50, xp_reward: 20, diamond_reward: 5 },
  { task_type: 'checkin_streak', task_label: '今日打卡',           target_value: 1,  xp_reward: 10, diamond_reward: 3 },
];

const MONTHLY_BADGE_CONFIGS = [
  { days: 7,  key: 'monthly_7',  name: '一周坚持', icon: '🌱' },
  { days: 15, key: 'monthly_15', name: '半月勤学', icon: '🌿' },
  { days: 20, key: 'monthly_20', name: '月度精英', icon: '🌟' },
  { days: 28, key: 'monthly_28', name: '满勤先锋', icon: '🏆' },
];

interface DailyTasksProps {
  currentXP?: number;
  gamesPlayedToday?: number;
  checkedInToday?: boolean;
  onReward?: (xp: number, diamonds: number) => void;
  onBack?: () => void;
  inline?: boolean;
}

export const DailyTasks: React.FC<DailyTasksProps> = ({
  currentXP = 0,
  gamesPlayedToday = 0,
  checkedInToday = false,
  onReward,
  onBack,
  inline = false,
}) => {
  const { uiLang } = useUI();
  const isZh = ['zh', 'ja', 'ko'].includes(uiLang);
  const sessionKey = getSessionKey();
  const today = new Date().toISOString().split('T')[0];
  const yearMonth = today.slice(0, 7);

  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [monthBadges, setMonthBadges] = useState<{ badge_key: string; badge_name: string; checkin_days: number }[]>([]);
  const [checkinDays, setCheckinDays] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    // Check existing tasks for today
    const { data: existing } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('session_key', sessionKey)
      .eq('task_date', today);

    if (!existing || existing.length === 0) {
      // Generate today's tasks
      const inserts = TASK_TEMPLATES.map((t) => ({
        session_key: sessionKey,
        task_date: today,
        ...t,
        current_value: 0,
        completed: false,
        reward_claimed: false,
      }));
      const { data: inserted } = await supabase.from('daily_tasks').insert(inserts).select();
      setTasks((inserted ?? []) as DailyTask[]);
    } else {
      setTasks(existing as DailyTask[]);
    }

    // Load monthly checkin count
    const { count } = await supabase
      .from('user_learning_daily')
      .select('*', { count: 'exact', head: true })
      .eq('session_key', sessionKey)
      .gte('checkin_date', `${yearMonth}-01`)
      .lte('checkin_date', `${yearMonth}-31`);
    setCheckinDays(count ?? 0);

    // Load monthly badges
    const { data: badges } = await supabase
      .from('monthly_badges')
      .select('badge_key, badge_name, checkin_days')
      .eq('session_key', sessionKey)
      .eq('year_month', yearMonth);
    setMonthBadges((badges ?? []) as typeof monthBadges);

    setLoading(false);
  }, [sessionKey, today, yearMonth]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  // Auto-update task progress based on props
  useEffect(() => {
    if (tasks.length === 0) return;
    const updateProgress = async () => {
      for (const task of tasks) {
        if (task.completed) continue;
        let newVal = task.current_value;
        if (task.task_type === 'play_games') newVal = Math.min(gamesPlayedToday, task.target_value);
        if (task.task_type === 'earn_xp') newVal = Math.min(currentXP, task.target_value);
        if (task.task_type === 'checkin_streak') newVal = checkedInToday ? 1 : 0;

        if (newVal !== task.current_value) {
          const completed = newVal >= task.target_value;
          await supabase.from('daily_tasks')
            .update({ current_value: newVal, completed })
            .eq('session_key', sessionKey)
            .eq('task_date', today)
            .eq('task_type', task.task_type);
        }
      }
      loadTasks();
    };
    updateProgress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentXP, gamesPlayedToday, checkedInToday]);

  async function claimReward(task: DailyTask) {
    if (!task.id || !task.completed || task.reward_claimed) return;
    await supabase.from('daily_tasks')
      .update({ reward_claimed: true })
      .eq('id', task.id);
    onReward?.(task.xp_reward, task.diamond_reward);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2000);
    loadTasks();

    // Check if all tasks completed to give bonus
    const allDone = tasks.every((t) => t.id === task.id ? true : t.reward_claimed);
    if (allDone) {
      onReward?.(50, 10); // All-complete bonus
    }
  }

  async function checkMonthlyBadge() {
    for (const cfg of MONTHLY_BADGE_CONFIGS) {
      const alreadyEarned = monthBadges.some((b) => b.badge_key === cfg.key);
      if (!alreadyEarned && checkinDays >= cfg.days) {
        await supabase.from('monthly_badges').upsert({
          session_key: sessionKey,
          year_month: yearMonth,
          checkin_days: checkinDays,
          badge_key: cfg.key,
          badge_name: cfg.name,
          earned_at: new Date().toISOString(),
        }, { onConflict: 'session_key,year_month' });
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
        loadTasks();
        break;
      }
    }
  }

  useEffect(() => {
    if (checkinDays > 0) checkMonthlyBadge();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkinDays]);

  const allClaimed = tasks.length > 0 && tasks.every((t) => t.reward_claimed);
  const nextBadge = MONTHLY_BADGE_CONFIGS.find((c) => checkinDays < c.days);
  const earnedBadge = MONTHLY_BADGE_CONFIGS.filter((c) => checkinDays >= c.days).at(-1);

  const inner = (
    <>
      <Confetti active={confetti} />
      {/* Daily tasks */}
      <div className="dt-section">
        <h3 className="dt-section-title">{isZh ? '今日任务' : "Today's Tasks"}</h3>
        {loading ? (
          <div className="dt-loading">⏳</div>
        ) : (
          <div className="dt-task-list">
            {tasks.map((task, i) => {
              const pct = Math.min(task.current_value / task.target_value * 100, 100);
              return (
                <div key={i} className={`dt-task-card ${task.completed ? 'done' : ''}`}>
                  <div className="dt-task-left">
                    <div className="dt-task-label">{task.task_label}</div>
                    <div className="dt-task-bar">
                      <div className="dt-task-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="dt-task-progress">
                      {task.current_value} / {task.target_value}
                    </div>
                  </div>
                  <div className="dt-task-right">
                    <div className="dt-task-reward">
                      +{task.xp_reward} XP
                      {task.diamond_reward > 0 && ` · +${task.diamond_reward} 💎`}
                    </div>
                    {task.completed && !task.reward_claimed && (
                      <button className="dt-claim-btn" onClick={() => claimReward(task)}>
                        {isZh ? '领取' : 'Claim'}
                      </button>
                    )}
                    {task.reward_claimed && <span className="dt-claimed">✓</span>}
                    {!task.completed && <span className="dt-pending">⏳</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {allClaimed && (
          <div className="dt-all-done">
            🎉 {isZh ? '今日任务全部完成！额外奖励：+50 XP · +10 💎' : 'All tasks done! Bonus: +50 XP · +10 💎'}
          </div>
        )}
      </div>

      {/* Monthly badge progress */}
      <div className="dt-section">
        <h3 className="dt-section-title">{isZh ? '月度徽章' : 'Monthly Badges'}</h3>
        <div className="dt-month-info">
          <span className="dt-month-days">
            {isZh ? `本月已打卡 ${checkinDays} 天` : `${checkinDays} days this month`}
          </span>
          {earnedBadge && (
            <span className="dt-earned-badge">
              {MONTHLY_BADGE_CONFIGS.find((c) => c.key === earnedBadge.key)?.icon} {earnedBadge.name}
            </span>
          )}
        </div>
        <div className="dt-badge-track">
          {MONTHLY_BADGE_CONFIGS.map((cfg) => {
            const earned = checkinDays >= cfg.days;
            return (
              <div key={cfg.key} className={`dt-badge-chip ${earned ? 'earned' : ''}`}>
                <span className="dt-badge-icon">{cfg.icon}</span>
                <span className="dt-badge-name">{cfg.name}</span>
                <span className="dt-badge-req">{cfg.days}{isZh ? '天' : 'd'}</span>
              </div>
            );
          })}
        </div>
        {nextBadge && (
          <div className="dt-next-badge">
            {isZh
              ? `再打卡 ${nextBadge.days - checkinDays} 天解锁 ${nextBadge.icon} ${nextBadge.name}`
              : `${nextBadge.days - checkinDays} more days to unlock ${nextBadge.icon} ${nextBadge.name}`}
          </div>
        )}
      </div>
    </>
  );

  if (inline) return <div className="dt-inline">{inner}</div>;

  return (
    <div className="dt-wrap">
      <FloatingBack onClick={onBack!} />
      <div className="dt-page-header">
        <h1 className="dt-page-title">{isZh ? '每日任务' : 'Daily Tasks'}</h1>
      </div>
      {inner}
    </div>
  );
};
