import React, { useState } from 'react';
import { AIWritingCoach } from './AIWritingCoach';
import { AIBookReader } from './AIBookReader';
import { PhonemeCoach } from './PhonemeCoach';
import { LearningDashboard } from './LearningDashboard';
import { CreatorDashboard } from './CreatorDashboard';
import { FamilyDashboard } from './FamilyDashboard';

type FeatureView = 'home' | 'writing' | 'reading' | 'phoneme' | 'dashboard' | 'creator' | 'family';

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
      <div className="features-header">
        <h1 className="features-title">✨ 新功能体验</h1>
        <p className="features-sub">探索言道的强大学习功能</p>
      </div>

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