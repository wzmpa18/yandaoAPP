import React, { useState } from 'react';
import { FloatingBack } from './FloatingBack';
import { Confetti } from './Confetti';

interface Mnemonic {
  id: string;
  word: string;
  meaning: string;
  type: 'homophone' | 'image' | 'story' | 'association';
  content: string;
  visualFormula?: string;
  views: number;
  likes: number;
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  lessons: number;
  students: number;
  rating: number;
  status: 'draft' | 'published';
  createdAt: string;
}

const MNEMONICS: Mnemonic[] = [
  {
    id: 'm1',
    word: 'accomplish',
    meaning: '完成，实现',
    type: 'homophone',
    content: '发音类似 "a-com-plish"，可以记成 "一颗葡萄完成了它的使命"',
    visualFormula: 'a + com + plish',
    views: 1250,
    likes: 89,
    createdAt: '2024-01-15',
  },
  {
    id: 'm2',
    word: 'phenomenon',
    meaning: '现象',
    type: 'story',
    content: 'pheno（费诺）+ men（男人）+ on（在...上）→ 费诺男人站在现象上观察',
    views: 890,
    likes: 67,
    createdAt: '2024-01-18',
  },
  {
    id: 'm3',
    word: 'environment',
    meaning: '环境',
    type: 'image',
    content: '想象一个绿色的地球，周围有树木、河流、动物，这就是我们的环境',
    visualFormula: '🌍 + 🌳 + 💧',
    views: 2100,
    likes: 156,
    createdAt: '2024-01-20',
  },
];

const COURSES: Course[] = [
  {
    id: 'c1',
    title: '日语入门：从零开始学日语',
    description: '适合完全零基础的日语学习者，从五十音开始，循序渐进',
    category: '日语',
    level: 'A1-A2',
    lessons: 24,
    students: 3420,
    rating: 4.9,
    status: 'published',
    createdAt: '2024-01-01',
  },
  {
    id: 'c2',
    title: '英语词汇速记：谐音记忆法',
    description: '用有趣的谐音梗记忆英语单词，轻松记住1000+词汇',
    category: '英语',
    level: 'A2-B1',
    lessons: 16,
    students: 1890,
    rating: 4.8,
    status: 'published',
    createdAt: '2024-01-10',
  },
];

const MNEMONIC_TYPES = [
  { key: 'homophone', label: '谐音梗', icon: '🎵' },
  { key: 'image', label: '图像联想', icon: '🖼️' },
  { key: 'story', label: '故事记忆', icon: '📖' },
  { key: 'association', label: '关联记忆', icon: '🔗' },
];

export const CreatorDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'mnemonics' | 'courses' | 'analytics'>('mnemonics');
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newMnemonic, setNewMnemonic] = useState({
    word: '',
    meaning: '',
    type: 'homophone' as 'homophone' | 'image' | 'story' | 'association',
    content: '',
    visualFormula: '',
  });

  const handleSubmitMnemonic = () => {
    if (!newMnemonic.word || !newMnemonic.meaning || !newMnemonic.content) {
      alert('请填写完整信息');
      return;
    }
    setShowModal(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    setNewMnemonic({
      word: '',
      meaning: '',
      type: 'homophone',
      content: '',
      visualFormula: '',
    });
  };

  return (
    <div className="creator-dashboard">
      <Confetti active={showConfetti} />
      <FloatingBack onClick={onBack} />

      <div className="creator-header">
        <h1 className="creator-title">👑 创作者后台</h1>
        <p className="creator-sub">分享你的记忆法，帮助更多学习者</p>
      </div>

      <div className="creator-stats">
        <div className="creator-stat">
          <span className="stat-value">3</span>
          <span className="stat-label">记忆法</span>
        </div>
        <div className="creator-stat">
          <span className="stat-value">2</span>
          <span className="stat-label">课程</span>
        </div>
        <div className="creator-stat">
          <span className="stat-value">5,310</span>
          <span className="stat-label">总浏览</span>
        </div>
        <div className="creator-stat">
          <span className="stat-value">¥1,280</span>
          <span className="stat-label">累计收益</span>
        </div>
      </div>

      <div className="creator-tabs">
        <button 
          className={`tab-btn ${activeTab === 'mnemonics' ? 'active' : ''}`}
          onClick={() => setActiveTab('mnemonics')}
        >
          📝 记忆法
        </button>
        <button 
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          📚 课程
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 数据分析
        </button>
      </div>

      {activeTab === 'mnemonics' && (
        <div className="tab-content">
          <div className="content-header">
            <h2 className="content-title">我的记忆法</h2>
            <button className="add-btn" onClick={() => setShowModal(true)}>
              + 上传记忆法
            </button>
          </div>

          <div className="mnemonic-list">
            {MNEMONICS.map(m => (
              <div key={m.id} className="mnemonic-card">
                <div className="mnemonic-header">
                  <span className="mnemonic-word">{m.word}</span>
                  <span className="mnemonic-type">
                    {MNEMONIC_TYPES.find(t => t.key === m.type)?.icon} {MNEMONIC_TYPES.find(t => t.key === m.type)?.label}
                  </span>
                </div>
                <p className="mnemonic-meaning">{m.meaning}</p>
                <p className="mnemonic-content">{m.content}</p>
                {m.visualFormula && (
                  <div className="mnemonic-formula">
                    <span className="formula-label">记忆公式：</span>
                    <span className="formula-content">{m.visualFormula}</span>
                  </div>
                )}
                <div className="mnemonic-stats">
                  <span className="stat-item">👁️ {m.views}</span>
                  <span className="stat-item">❤️ {m.likes}</span>
                  <span className="stat-item">📅 {m.createdAt}</span>
                </div>
                <div className="mnemonic-actions">
                  <button className="action-btn edit">编辑</button>
                  <button className="action-btn delete">删除</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="tab-content">
          <div className="content-header">
            <h2 className="content-title">我的课程</h2>
            <button className="add-btn">+ 创建课程</button>
          </div>

          <div className="course-list">
            {COURSES.map(c => (
              <div key={c.id} className="course-card">
                <div className="course-info">
                  <h3 className="course-title">{c.title}</h3>
                  <p className="course-desc">{c.description}</p>
                  <div className="course-meta">
                    <span className="course-category">{c.category}</span>
                    <span className="course-level">{c.level}</span>
                    <span className={`course-status ${c.status}`}>
                      {c.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </div>
                </div>
                <div className="course-stats">
                  <div className="stat-row">
                    <span className="stat-icon">📖</span>
                    <span className="stat-num">{c.lessons}</span>
                    <span className="stat-label">课时</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-icon">👥</span>
                    <span className="stat-num">{c.students}</span>
                    <span className="stat-label">学员</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-icon">⭐</span>
                    <span className="stat-num">{c.rating}</span>
                    <span className="stat-label">评分</span>
                  </div>
                </div>
                <div className="course-actions">
                  <button className="action-btn edit">编辑</button>
                  <button className="action-btn stats">数据</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="tab-content">
          <h2 className="content-title">数据分析</h2>
          
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3 className="analytics-title">总浏览量</h3>
              <div className="analytics-chart">
                <div className="chart-bars-vertical">
                  {[65, 89, 72, 95, 88, 105, 92].map((val, idx) => (
                    <div key={idx} className="bar-item">
                      <div className="bar" style={{ height: `${val}%` }} />
                      <span className="bar-label">{['1月', '2月', '3月', '4月', '5月', '6月', '7月'][idx]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <h3 className="analytics-title">收益统计</h3>
              <div className="revenue-info">
                <div className="revenue-item">
                  <span className="revenue-label">本月收益</span>
                  <span className="revenue-value">¥520</span>
                </div>
                <div className="revenue-item">
                  <span className="revenue-label">累计收益</span>
                  <span className="revenue-value">¥1,280</span>
                </div>
                <div className="revenue-item">
                  <span className="revenue-label">分成比例</span>
                  <span className="revenue-value">70%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="analytics-card">
            <h3 className="analytics-title">热门内容</h3>
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>排名</th>
                  <th>内容</th>
                  <th>浏览</th>
                  <th>点赞</th>
                  <th>收益</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>environment</td>
                  <td>2,100</td>
                  <td>156</td>
                  <td>¥320</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>accomplish</td>
                  <td>1,250</td>
                  <td>89</td>
                  <td>¥180</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>phenomenon</td>
                  <td>890</td>
                  <td>67</td>
                  <td>¥120</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">📝 上传记忆法</h3>
            
            <div className="form-group">
              <label className="form-label">单词</label>
              <input 
                type="text" 
                className="form-input"
                value={newMnemonic.word}
                onChange={(e) => setNewMnemonic(prev => ({ ...prev, word: e.target.value }))}
                placeholder="输入要记忆的单词"
              />
            </div>

            <div className="form-group">
              <label className="form-label">中文含义</label>
              <input 
                type="text" 
                className="form-input"
                value={newMnemonic.meaning}
                onChange={(e) => setNewMnemonic(prev => ({ ...prev, meaning: e.target.value }))}
                placeholder="单词的中文意思"
              />
            </div>

            <div className="form-group">
              <label className="form-label">记忆类型</label>
              <div className="type-selector">
                {MNEMONIC_TYPES.map(t => (
                  <button
                    key={t.key}
                    className={`type-btn ${newMnemonic.type === t.key ? 'active' : ''}`}
                    onClick={() => setNewMnemonic(prev => ({ ...prev, type: t.key as any }))}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">记忆方法</label>
              <textarea 
                className="form-textarea"
                value={newMnemonic.content}
                onChange={(e) => setNewMnemonic(prev => ({ ...prev, content: e.target.value }))}
                placeholder="详细描述你的记忆方法..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">记忆公式（可选）</label>
              <input 
                type="text" 
                className="form-input"
                value={newMnemonic.visualFormula}
                onChange={(e) => setNewMnemonic(prev => ({ ...prev, visualFormula: e.target.value }))}
                placeholder="例如：a + com + plish"
              />
            </div>

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowModal(false)}>取消</button>
              <button className="modal-btn confirm" onClick={handleSubmitMnemonic}>发布</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};