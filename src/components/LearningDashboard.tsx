import React, { useState, useEffect } from 'react';
import { FloatingBack } from './FloatingBack';
import { Confetti } from './Confetti';

interface DayStats {
  date: string;
  xp: number;
  words: number;
  time: number;
}

interface ForgottenWord {
  word: string;
  meaning: string;
  lastReview: string;
  strength: number;
}

const DEFAULT_WEEK_DATA: DayStats[] = [
  { date: '周一', xp: 120, words: 15, time: 25 },
  { date: '周二', xp: 85, words: 10, time: 18 },
  { date: '周三', xp: 200, words: 25, time: 35 },
  { date: '周四', xp: 95, words: 12, time: 22 },
  { date: '周五', xp: 150, words: 20, time: 30 },
  { date: '周六', xp: 180, words: 22, time: 38 },
  { date: '周日', xp: 130, words: 18, time: 28 },
];

const FORGOTTEN_WORDS: ForgottenWord[] = [
  { word: 'accomplish', meaning: '完成，实现', lastReview: '3天前', strength: 25 },
  { word: 'consequence', meaning: '后果，结果', lastReview: '5天前', strength: 15 },
  { word: 'phenomenon', meaning: '现象', lastReview: '4天前', strength: 20 },
  { word: 'environment', meaning: '环境', lastReview: '6天前', strength: 10 },
];

const TODAY_TASKS = [
  { id: '1', title: '学习10个单词', progress: 70, reward: '+20 XP' },
  { id: '2', title: '完成1局游戏', progress: 100, reward: '+30 XP', completed: true },
  { id: '3', title: 'AI对话练习', progress: 0, reward: '+15 XP' },
  { id: '4', title: '阅读一篇文章', progress: 50, reward: '+25 XP' },
];

function loadUserStats() {
  try {
    const xp = parseInt(localStorage.getItem('yandao_total_xp') || '0', 10);
    const streak = parseInt(localStorage.getItem('yandao_streak') || '0', 10);
    const todayXP = parseInt(localStorage.getItem('yandao_today_xp') || '0', 10);
    const level = Math.floor(xp / 200) + 1;
    return { xp: xp || 2450, streak: streak || 7, todayXP: todayXP || 130, level: level || 12 };
  } catch { return { xp: 2450, streak: 7, todayXP: 130, level: 12 }; }
}

function getCurrentWeekData(todayXP: number): DayStats[] {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const today = new Date().getDay();
  const result: DayStats[] = [];
  for (let i = 0; i < 7; i++) {
    const dayIdx = (today - 6 + i + 7) % 7;
    result.push({
      date: days[dayIdx],
      xp: Math.round(50 + Math.random() * 180),
      words: Math.round(5 + Math.random() * 25),
      time: Math.round(10 + Math.random() * 40),
    });
  }
  result[6] = { date: days[today], xp: todayXP, words: Math.round(todayXP / 7), time: Math.round(todayXP / 5) };
  return result;
}

export const LearningDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const userStats = loadUserStats();
  const [streak, setStreak] = useState(userStats.streak);
  const [totalXP, setTotalXP] = useState(userStats.xp);
  const [level, setLevel] = useState(userStats.level);
  const WEEK_DATA = getCurrentWeekData(userStats.todayXP);

  const totalWords = WEEK_DATA.reduce((sum, d) => sum + d.words, 0);
  const totalTime = WEEK_DATA.reduce((sum, d) => sum + d.time, 0);
  const todayXP = WEEK_DATA[WEEK_DATA.length - 1].xp;
  const avgXP = Math.round(totalXP / 7);

  const maxXP = WEEK_DATA.reduce((max, d) => Math.max(max, d.xp), 0);
  const maxTime = WEEK_DATA.reduce((max, d) => Math.max(max, d.time), 0);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleReviewWord = (word: string) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1500);
    setTotalXP(prev => prev + 5);
  };

  return (
    <div className="learning-dashboard">
      <Confetti active={showConfetti} />
      <FloatingBack onClick={onBack} />

      <div className="dashboard-header">
        <h1 className="dashboard-title">📊 学习数据板</h1>
        <p className="dashboard-sub">追踪你的学习进度</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <span className="stat-value">{totalXP}</span>
            <span className="stat-label">总 XP</span>
          </div>
          <div className="stat-level">Lv.{level}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <span className="stat-value">{streak}</span>
            <span className="stat-label">连续天数</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <span className="stat-value">{totalWords}</span>
            <span className="stat-label">本周学词</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <span className="stat-value">{totalTime}</span>
            <span className="stat-label">本周时长(分)</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">📈 今日学习</h2>
        <div className="today-summary">
          <div className="today-item">
            <span className="today-label">今日已学 XP</span>
            <span className="today-value">{todayXP}</span>
          </div>
          <div className="today-divider" />
          <div className="today-item">
            <span className="today-label">平均每日</span>
            <span className="today-value">{avgXP} XP</span>
          </div>
          <div className="today-divider" />
          <div className="today-item">
            <span className="today-label">距离目标</span>
            <span className="today-value">{Math.max(0, 500 - todayXP)} XP</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">📊 本周学习曲线</h2>
        <div className="chart-container">
          <div className="chart-bars">
            {WEEK_DATA.map((day, idx) => (
              <div key={idx} className="chart-bar-wrapper">
                <div 
                  className="chart-bar xp-bar"
                  style={{ height: `${(day.xp / maxXP) * 100}%` }}
                >
                  <span className="bar-value">{day.xp}</span>
                </div>
                <span className="chart-label">{day.date}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-color xp-color" /> XP
            </span>
          </div>
        </div>

        <h3 className="section-subtitle">⏱️ 学习时长分布</h3>
        <div className="chart-container">
          <div className="chart-bars">
            {WEEK_DATA.map((day, idx) => (
              <div key={idx} className="chart-bar-wrapper">
                <div 
                  className="chart-bar time-bar"
                  style={{ height: `${(day.time / maxTime) * 100}%` }}
                >
                  <span className="bar-value">{day.time}m</span>
                </div>
                <span className="chart-label">{day.date}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-color time-color" /> 分钟
            </span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">🔔 遗忘曲线提醒</h2>
        <div className="forgotten-list">
          <p className="forgotten-hint">以下单词需要复习，点击卡片进行复习</p>
          {FORGOTTEN_WORDS.map((item, idx) => (
            <div 
              key={idx} 
              className="forgotten-item"
              onClick={() => handleReviewWord(item.word)}
            >
              <div className="forgotten-word">
                <span className="word-text">{item.word}</span>
                <span className="word-meaning">{item.meaning}</span>
              </div>
              <div className="forgotten-meta">
                <span className="forgotten-date">{item.lastReview}</span>
                <div className="strength-bar">
                  <div 
                    className="strength-fill"
                    style={{ 
                      width: `${item.strength}%`,
                      backgroundColor: item.strength > 20 ? '#22c55e' : item.strength > 10 ? '#eab308' : '#ef4444'
                    }}
                  />
                </div>
                <span className="strength-text">{item.strength}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">✅ 今日任务</h2>
        <div className="task-list">
          {TODAY_TASKS.map(task => (
            <div key={task.id} className="task-item">
              <div className="task-info">
                <span className="task-title">{task.title}</span>
                <span className="task-reward">{task.reward}</span>
              </div>
              <div className="task-progress-wrapper">
                <div 
                  className={`task-progress ${task.completed ? 'completed' : ''}`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              {task.completed && (
                <span className="task-check">✓</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">🎯 学习目标</h2>
        <div className="goal-cards">
          <div className="goal-card">
            <div className="goal-icon">📚</div>
            <div className="goal-content">
              <span className="goal-label">本月目标</span>
              <span className="goal-value">学习 500 单词</span>
              <div className="goal-progress-bar">
                <div className="goal-progress-fill" style={{ width: '68%' }} />
              </div>
              <span className="goal-progress-text">已完成 340 / 500</span>
            </div>
          </div>
          <div className="goal-card">
            <div className="goal-icon">🔥</div>
            <div className="goal-content">
              <span className="goal-label">连续打卡</span>
              <span className="goal-value">保持 30 天</span>
              <div className="goal-progress-bar">
                <div className="goal-progress-fill" style={{ width: `${(streak / 30) * 100}%` }} />
              </div>
              <span className="goal-progress-text">已连续 {streak} 天</span>
            </div>
          </div>
        </div>
      </div>

      <div className="motivation-section">
        <div className="motivation-card">
          <span className="motivation-quote">
            "学习一门语言就是打开一扇通往新世界的大门"
          </span>
          <span className="motivation-author">— 谚语</span>
        </div>
      </div>
    </div>
  );
};