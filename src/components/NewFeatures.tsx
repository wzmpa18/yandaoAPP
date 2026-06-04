import React, { useState } from 'react';
import { AIWritingCoach } from './AIWritingCoach';
import { AIBookReader } from './AIBookReader';
import { PhonemeCoach } from './PhonemeCoach';
import { LearningDashboard } from './LearningDashboard';
import { CreatorDashboard } from './CreatorDashboard';
import { FamilyDashboard } from './FamilyDashboard';

type FeatureView = 'home' | 'writing' | 'reading' | 'phoneme' | 'dashboard' | 'creator' | 'family';

/* 学习模式分类 */
type StudyMode = 'daily' | 'exam' | 'interest';

const STUDY_MODES: { key: StudyMode; label: string; icon: string; desc: string }[] = [
  { key: 'daily', label: '日常交流', icon: '💬', desc: '旅行、购物、餐厅等日常场景' },
  { key: 'exam', label: '能力考试', icon: '📝', desc: 'JLPT/TOEFL/HSK 备考强化' },
  { key: 'interest', label: '兴趣学习', icon: '🎯', desc: '动漫、音乐、文化等兴趣驱动' },
];

/* 新功能卡片 */
const FEATURES = [
  { key: 'writing', icon: '✍️', title: 'AI作文教练', desc: '智能语法批改 · 句式优化建议' },
  { key: 'reading', icon: '📚', title: 'AI选词阅读', desc: '智能分级读物推荐' },
  { key: 'phoneme', icon: '🎯', title: '音素级纠音', desc: '精准发音分析与改进建议' },
  { key: 'dashboard', icon: '📊', title: '学习数据板', desc: '可视化学习进度追踪' },
  { key: 'creator', icon: '👑', title: '创作者后台', desc: '分享记忆法，帮助更多人' },
  { key: 'family', icon: '🏠', title: '家庭账户', desc: '管理孩子的学习进度' },
] as const;

export const NewFeatures: React.FC = () => {
  const [view, setView] = useState<FeatureView>('home');
  const [studyMode, setStudyMode] = useState<StudyMode>('daily');
  const [toastMsg, setToastMsg] = useState('');

  /* 显示 toast 提示 */
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  if (view !== 'home') {
    const back = () => setView('home');
    
    switch (view) {
      case 'writing':
        return <AIWritingCoach onBack={back} />;
      case 'reading':
        return <AIBookReader onBack={back} />;
      case 'phoneme':
        return <PhonemeCoach onBack={back} />;
      case 'dashboard':
        return <LearningDashboard onBack={back} />;
      case 'creator':
        return <CreatorDashboard onBack={back} />;
      case 'family':
        return <FamilyDashboard onBack={back} />;
      default:
        break;
    }
  }

  return (
    <div className="new-features">
      {/* Toast 提示 */}
      {toastMsg && (
        <div className="ai-toast">
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="features-header">
        <h1 className="features-title">✨ 新功能体验</h1>
        <p className="features-sub">探索言道的强大学习功能</p>
      </div>

      {/* 学习模式切换 */}
      <div className="study-mode-section">
        <h2 className="intro-title">🎯 选择你的学习模式</h2>
        <div className="study-mode-selector">
          {STUDY_MODES.map(mode => (
            <button
              key={mode.key}
              className={`study-mode-btn ${studyMode === mode.key ? 'active' : ''}`}
              onClick={() => {
                setStudyMode(mode.key);
                showToast(`已切换到「${mode.label}」模式 — AI 将据此调整推荐内容`);
              }}
            >
              <span className="study-mode-icon">{mode.icon}</span>
              <div className="study-mode-info">
                <span className="study-mode-label">{mode.label}</span>
                <span className="study-mode-desc">{mode.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 新功能卡片网格 */}
      <div className="features-grid">
        {FEATURES.map(feature => (
          <button
            key={feature.key}
            className="feature-card"
            onClick={() => setView(feature.key)}
          >
            <span className="feature-icon">{feature.icon}</span>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-desc">{feature.desc}</p>
          </button>
        ))}
      </div>

      {/* AI 补充内容 (已激活) */}
      <div className="ai-supplement-section">
        <h2 className="intro-title">🤖 AI 智能辅助</h2>
        <div className="ai-supplement-grid">
          <button
            className="ai-supplement-btn"
            onClick={() => showToast('切换到底部"AI助手"标签，输入"帮我生成练习题"即可！')}
          >
            <span className="ai-supplement-icon">📝</span>
            <div className="ai-supplement-info">
              <span className="ai-supplement-label">AI 帮我生成更多练习题</span>
              <span className="ai-supplement-desc">打开AI助手 → 输入需求</span>
            </div>
            <span className="ai-supplement-badge active">已激活</span>
          </button>
          <button
            className="ai-supplement-btn"
            onClick={() => showToast('切换到底部"AI助手"标签，AI 会根据你的学习情况智能推荐！')}
          >
            <span className="ai-supplement-icon">🎯</span>
            <div className="ai-supplement-info">
              <span className="ai-supplement-label">AI 根据我的水平推荐内容</span>
              <span className="ai-supplement-desc">Open AI助手 → 个性化推荐</span>
            </div>
            <span className="ai-supplement-badge active">已激活</span>
          </button>
          <button
            className="ai-supplement-btn"
            onClick={() => showToast('切换到底部"AI助手"标签，输入场景关键词获取更多对话！')}
          >
            <span className="ai-supplement-icon">💬</span>
            <div className="ai-supplement-info">
              <span className="ai-supplement-label">AI 补充场景对话</span>
              <span className="ai-supplement-desc">在AI助手中输入场景即可</span>
            </div>
            <span className="ai-supplement-badge active">已激活</span>
          </button>
        </div>
      </div>

      <div className="features-intro">
        <h2 className="intro-title">🎯 AI学习助手升级</h2>
        <div className="intro-cards">
          <div className="intro-card">
            <span className="intro-icon">✍️</span>
            <div className="intro-content">
              <h4>AI作文教练</h4>
              <p>智能语法批改，优化句式表达</p>
            </div>
          </div>
          <div className="intro-card">
            <span className="intro-icon">📚</span>
            <div className="intro-content">
              <h4>AI选词阅读</h4>
              <p>根据词汇量推荐分级读物</p>
            </div>
          </div>
          <div className="intro-card">
            <span className="intro-icon">🎯</span>
            <div className="intro-content">
              <h4>音素级纠音</h4>
              <p>精准分析发音，给出改进建议</p>
            </div>
          </div>
        </div>
      </div>

      <div className="features-intro">
        <h2 className="intro-title">👑 创作者内容生态</h2>
        <div className="intro-cards">
          <div className="intro-card">
            <span className="intro-icon">🖋️</span>
            <div className="intro-content">
              <h4>创作者后台</h4>
              <p>分享记忆法，帮助更多学习者</p>
            </div>
          </div>
          <div className="intro-card">
            <span className="intro-icon">📊</span>
            <div className="intro-content">
              <h4>数据分析</h4>
              <p>查看内容表现和收益统计</p>
            </div>
          </div>
        </div>
      </div>

      <div className="features-intro">
        <h2 className="intro-title">🏠 家庭与社交功能</h2>
        <div className="intro-cards">
          <div className="intro-card">
            <span className="intro-icon">👨‍👩‍👧</span>
            <div className="intro-content">
              <h4>家庭账户</h4>
              <p>管理孩子学习，查看学习报告</p>
            </div>
          </div>
          <div className="intro-card">
            <span className="intro-icon">📈</span>
            <div className="intro-content">
              <h4>学习数据板</h4>
              <p>可视化追踪学习进度</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};