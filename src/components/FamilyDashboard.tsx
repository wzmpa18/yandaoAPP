import React, { useState } from 'react';
import { FloatingBack } from './FloatingBack';

interface ChildAccount {
  id: string;
  name: string;
  avatar: string;
  level: number;
  totalWords: number;
  streak: number;
  todayMinutes: number;
  weakAreas: string[];
  lastActive: string;
}

interface ChildReport {
  childId: string;
  date: string;
  wordsLearned: number;
  timeSpent: number;
  accuracy: number;
  completedTasks: number;
}

const CHILDREN: ChildAccount[] = [
  {
    id: 'c1',
    name: '小明',
    avatar: '👦',
    level: 8,
    totalWords: 320,
    streak: 12,
    todayMinutes: 25,
    weakAreas: ['动词变位', '时态'],
    lastActive: '10分钟前',
  },
  {
    id: 'c2',
    name: '小红',
    avatar: '👧',
    level: 5,
    totalWords: 180,
    streak: 5,
    todayMinutes: 15,
    weakAreas: ['发音', '词汇'],
    lastActive: '1小时前',
  },
];

const TASK_TEMPLATES = [
  { id: 't1', title: '学习10个新单词', xp: 20, time: 15 },
  { id: 't2', title: '完成1局语法游戏', xp: 30, time: 10 },
  { id: 't3', title: '阅读一篇文章', xp: 25, time: 20 },
  { id: 't4', title: '口语练习10分钟', xp: 35, time: 10 },
];

export const FamilyDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedChild, setSelectedChild] = useState<ChildAccount | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskDate, setTaskDate] = useState('today');

  const generateReport = (child: ChildAccount): ChildReport => {
    return {
      childId: child.id,
      date: new Date().toISOString().split('T')[0],
      wordsLearned: Math.floor(Math.random() * 20) + 5,
      timeSpent: child.todayMinutes,
      accuracy: Math.floor(Math.random() * 30) + 70,
      completedTasks: Math.floor(Math.random() * 3) + 1,
    };
  };

  return (
    <div className="family-dashboard">
      <FloatingBack onClick={onBack} />

      <div className="family-header">
        <h1 className="family-title">🏠 家庭账户</h1>
        <p className="family-sub">管理孩子的学习进度</p>
      </div>

      <div className="family-summary">
        <div className="summary-item">
          <span className="summary-value">{CHILDREN.length}</span>
          <span className="summary-label">孩子账户</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{CHILDREN.reduce((sum, c) => sum + c.totalWords, 0)}</span>
          <span className="summary-label">累计学词</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{CHILDREN.reduce((sum, c) => sum + c.streak, 0)}</span>
          <span className="summary-label">总连续天数</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{CHILDREN.reduce((sum, c) => sum + c.todayMinutes, 0)}</span>
          <span className="summary-label">今日学习(分)</span>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">👧 我的孩子</h2>
        <div className="children-list">
          {CHILDREN.map(child => (
            <div 
              key={child.id}
              className={`child-card ${selectedChild?.id === child.id ? 'selected' : ''}`}
              onClick={() => setSelectedChild(child)}
            >
              <div className="child-avatar">{child.avatar}</div>
              <div className="child-info">
                <h3 className="child-name">{child.name}</h3>
                <div className="child-meta">
                  <span className="child-level">Lv.{child.level}</span>
                  <span className="child-streak">🔥 {child.streak}天</span>
                </div>
                <div className="child-stats">
                  <span className="stat">📚 {child.totalWords}词</span>
                  <span className="stat">⏱️ {child.todayMinutes}分钟</span>
                  <span className="stat">🕐 {child.lastActive}</span>
                </div>
              </div>
              {child.weakAreas.length > 0 && (
                <div className="child-weak">
                  <span className="weak-label">薄弱环节:</span>
                  {child.weakAreas.map((area, idx) => (
                    <span key={idx} className="weak-tag">{area}</span>
                  ))}
                </div>
              )}
              <button className="child-action">查看报告 →</button>
            </div>
          ))}
        </div>
      </div>

      {selectedChild && (() => {
        const report = generateReport(selectedChild);
        return (
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">📊 {selectedChild.name} 的学习报告</h2>
            <button className="close-report" onClick={() => setSelectedChild(null)}>✕</button>
          </div>

          <div className="report-card">
            <div className="report-header">
              <div className="report-avatar">{selectedChild.avatar}</div>
              <div className="report-info">
                <span className="report-name">{selectedChild.name}</span>
                <span className="report-date">{report.date}</span>
              </div>
            </div>

            <div className="report-stats">
              <div className="report-stat">
                <span className="stat-icon">📚</span>
                <span className="stat-value">{report.wordsLearned}</span>
                <span className="stat-label">今日学词</span>
              </div>
              <div className="report-stat">
                <span className="stat-icon">⏱️</span>
                <span className="stat-value">{report.timeSpent}</span>
                <span className="stat-label">学习时长(分)</span>
              </div>
              <div className="report-stat">
                <span className="stat-icon">🎯</span>
                <span className="stat-value">{report.accuracy}%</span>
                <span className="stat-label">正确率</span>
              </div>
              <div className="report-stat">
                <span className="stat-icon">✅</span>
                <span className="stat-value">{report.completedTasks}</span>
                <span className="stat-label">完成任务</span>
              </div>
            </div>

            <div className="report-section">
              <h3 className="report-section-title">📈 学习趋势</h3>
              <div className="trend-chart">
                {[65, 72, 85, 78, 92, 88, 95].map((val, idx) => (
                  <div key={idx} className="trend-bar-wrapper">
                    <div 
                      className="trend-bar"
                      style={{ height: `${val}%` }}
                    />
                    <span className="trend-label">{['周一', '周二', '周三', '周四', '周五', '周六', '周日'][idx]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="report-section">
              <h3 className="report-section-title">🎯 学习目标进度</h3>
              <div className="goal-progress">
                <div className="goal-item">
                  <span className="goal-text">本周目标：学习70个单词</span>
                  <div className="goal-bar">
                    <div className="goal-fill" style={{ width: '64%' }} />
                  </div>
                  <span className="goal-percent">已完成 45 / 70</span>
                </div>
                <div className="goal-item">
                  <span className="goal-text">连续打卡14天</span>
                  <div className="goal-bar">
                    <div className="goal-fill" style={{ width: `${(selectedChild.streak / 14) * 100}%` }} />
                  </div>
                  <span className="goal-percent">已连续 {selectedChild.streak} 天</span>
                </div>
              </div>
            </div>

            {selectedChild.weakAreas.length > 0 && (
              <div className="report-section">
                <h3 className="report-section-title">💡 薄弱环节建议</h3>
                <div className="weak-suggestions">
                  {selectedChild.weakAreas.map((area, idx) => (
                    <div key={idx} className="weak-suggestion">
                      <span className="weak-icon">📌</span>
                      <span className="weak-area">{area}</span>
                      <span className="weak-tip">建议多做相关练习</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        );
      })()}

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">📋 布置任务</h2>
          <button className="add-task-btn" onClick={() => setShowTaskModal(true)}>
            + 布置任务
          </button>
        </div>

        <div className="task-templates">
          {TASK_TEMPLATES.map(task => (
            <div key={task.id} className="task-template">
              <div className="task-info">
                <span className="task-title">{task.title}</span>
                <div className="task-meta">
                  <span className="task-xp">+{task.xp} XP</span>
                  <span className="task-time">约{task.time}分钟</span>
                </div>
              </div>
              <button className="assign-btn">分配</button>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">🔒 家长控制</h2>
        <div className="control-settings">
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-title">每日学习时长限制</span>
              <span className="setting-desc">设置孩子每天最多学习时间</span>
            </div>
            <select className="setting-select">
              <option>30分钟</option>
              <option>60分钟</option>
              <option>90分钟</option>
              <option>120分钟</option>
              <option>无限制</option>
            </select>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-title">启用护眼模式</span>
              <span className="setting-desc">夜间自动切换深色模式</span>
            </div>
            <div className="toggle-switch">
              <div className="toggle-track">
                <div className="toggle-thumb" />
              </div>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-title">学习提醒</span>
              <span className="setting-desc">每天定时提醒孩子学习</span>
            </div>
            <select className="setting-select">
              <option>关闭</option>
              <option>每天 19:00</option>
              <option>每天 20:00</option>
              <option>每天 21:00</option>
            </select>
          </div>
        </div>
      </div>

      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">📋 布置任务</h3>

            <div className="form-group">
              <label className="form-label">选择孩子</label>
              <div className="child-selector">
                {CHILDREN.map(child => (
                  <button key={child.id} className="child-option">
                    <span className="option-avatar">{child.avatar}</span>
                    <span className="option-name">{child.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">任务类型</label>
              <div className="task-type-selector">
                {TASK_TEMPLATES.map(task => (
                  <button key={task.id} className="task-type-btn">
                    {task.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">任务日期</label>
              <div className="date-selector">
                <button 
                  className={`date-btn ${taskDate === 'today' ? 'active' : ''}`}
                  onClick={() => setTaskDate('today')}
                >
                  今天
                </button>
                <button 
                  className={`date-btn ${taskDate === 'tomorrow' ? 'active' : ''}`}
                  onClick={() => setTaskDate('tomorrow')}
                >
                  明天
                </button>
                <button 
                  className={`date-btn ${taskDate === 'custom' ? 'active' : ''}`}
                  onClick={() => setTaskDate('custom')}
                >
                  自定义
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">附加消息（可选）</label>
              <textarea 
                className="form-textarea"
                placeholder="给孩子写一句鼓励的话..."
              />
            </div>

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowTaskModal(false)}>取消</button>
              <button className="modal-btn confirm" onClick={() => setShowTaskModal(false)}>发送任务</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};