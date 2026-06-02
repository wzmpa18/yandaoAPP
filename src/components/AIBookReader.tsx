import React, { useState, useEffect, useCallback } from 'react';
import { FloatingBack } from './FloatingBack';

interface ReadingMaterial {
  id: string;
  title: string;
  title_zh: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: string;
  length: number;
  estimatedTime: string;
  content: string;
  vocabulary: { word: string; meaning: string; level: string }[];
  grammarPoints: string[];
  summary?: string;
}

const READING_LEVELS = [
  { key: 'A1', label: '入门级', color: '#22c55e', desc: '简单对话，基础词汇' },
  { key: 'A2', label: '初级', color: '#84cc16', desc: '日常话题，常用表达' },
  { key: 'B1', label: '中级', color: '#eab308', desc: '复杂句子，多种时态' },
  { key: 'B2', label: '中高级', color: '#f97316', desc: '抽象话题，流畅表达' },
  { key: 'C1', label: '高级', color: '#ef4444', desc: '专业内容，深度讨论' },
  { key: 'C2', label: '精通级', color: '#8b5cf6', desc: '学术写作，母语水平' },
];

const READING_MATERIALS: ReadingMaterial[] = [
  {
    id: 'article_001',
    title: 'My Morning Routine',
    title_zh: '我的早晨日常',
    level: 'A1',
    category: '生活',
    length: 120,
    estimatedTime: '3分钟',
    content: `I wake up at 7 o'clock every morning. First, I make the bed and brush my teeth. Then I drink a glass of water. After that, I do some exercise for 15 minutes. I usually eat toast and eggs for breakfast. Sometimes I read the news on my phone. At 8:30, I leave home and walk to work. I enjoy my morning routine because it helps me start the day well.`,
    vocabulary: [
      { word: 'routine', meaning: '日常，常规', level: 'A1' },
      { word: 'brush', meaning: '刷', level: 'A1' },
      { word: 'exercise', meaning: '锻炼', level: 'A1' },
      { word: 'breakfast', meaning: '早餐', level: 'A1' },
      { word: 'enjoy', meaning: '享受', level: 'A1' },
    ],
    grammarPoints: ['一般现在时', '时间顺序连接词'],
  },
  {
    id: 'article_002',
    title: 'A Trip to Kyoto',
    title_zh: '京都之旅',
    level: 'A2',
    category: '旅行',
    length: 250,
    estimatedTime: '5分钟',
    content: `Last summer, I went to Kyoto with my family. We stayed in a traditional ryokan near the famous Fushimi Inari shrine. On the first day, we visited Kinkaku-ji, the Golden Pavilion. The building was covered in gold leaf and reflected beautifully in the pond. We also tried matcha tea and traditional Japanese sweets. In the evening, we walked through the Gion district and saw geisha walking in their beautiful kimono. It was an unforgettable experience.`,
    vocabulary: [
      { word: 'traditional', meaning: '传统的', level: 'A2' },
      { word: 'reflect', meaning: '反射，倒映', level: 'A2' },
      { word: 'experience', meaning: '经历，体验', level: 'A2' },
      { word: 'district', meaning: '地区，街区', level: 'A2' },
      { word: 'unforgettable', meaning: '难忘的', level: 'B1' },
    ],
    grammarPoints: ['一般过去时', '形容词顺序', '被动语态'],
  },
  {
    id: 'article_003',
    title: 'The Benefits of Learning Languages',
    title_zh: '学习语言的好处',
    level: 'B1',
    category: '教育',
    length: 380,
    estimatedTime: '7分钟',
    content: `Learning a second language offers numerous benefits that extend far beyond communication. Studies have shown that bilingual individuals have better cognitive abilities, including improved memory and problem-solving skills. Language learning also enhances cultural understanding and empathy, as learners gain insight into different ways of thinking and living. Furthermore, it can boost career opportunities, as many employers value multilingual employees. Whether for personal growth or professional advancement, investing time in language learning is a valuable endeavor.`,
    vocabulary: [
      { word: 'numerous', meaning: '众多的', level: 'B1' },
      { word: 'cognitive', meaning: '认知的', level: 'B2' },
      { word: 'empathy', meaning: '同理心', level: 'B1' },
      { word: 'endeavor', meaning: '努力，尝试', level: 'B2' },
      { word: 'enhance', meaning: '增强，提升', level: 'B1' },
    ],
    grammarPoints: ['现在完成时', '宾语从句', '条件状语从句'],
  },
  {
    id: 'article_004',
    title: 'Artificial Intelligence in Daily Life',
    title_zh: '日常生活中的人工智能',
    level: 'B2',
    category: '科技',
    length: 450,
    estimatedTime: '8分钟',
    content: `Artificial intelligence has become an integral part of modern life, often operating unseen in the background. From personalized recommendations on streaming platforms to voice assistants that respond to our commands, AI enhances convenience and efficiency. Machine learning algorithms analyze vast amounts of data to predict weather patterns, optimize traffic flow, and even assist in medical diagnoses. While concerns about privacy and job displacement persist, there is no denying that AI continues to transform how we live, work, and interact with the world around us.`,
    vocabulary: [
      { word: 'integral', meaning: '不可或缺的', level: 'B2' },
      { word: 'algorithms', meaning: '算法', level: 'B2' },
      { word: 'optimize', meaning: '优化', level: 'B2' },
      { word: 'displacement', meaning: '取代，替代', level: 'C1' },
      { word: 'transform', meaning: '转变，改变', level: 'B1' },
    ],
    grammarPoints: ['被动语态', '分词作状语', '让步状语从句'],
  },
  {
    id: 'article_005',
    title: 'Climate Change and Its Impact',
    title_zh: '气候变化及其影响',
    level: 'C1',
    category: '环境',
    length: 520,
    estimatedTime: '10分钟',
    content: `Climate change poses one of the most significant challenges of our time. Rising global temperatures, melting polar ice caps, and extreme weather events are just some of the consequences of greenhouse gas emissions. The scientific consensus is clear: human activity, particularly the burning of fossil fuels, is the primary driver of this phenomenon. Addressing climate change requires collective action, from reducing carbon footprints to developing sustainable technologies. The urgency of this issue cannot be overstated, as the decisions we make today will determine the planet's future for generations to come.`,
    vocabulary: [
      { word: 'consequences', meaning: '后果，结果', level: 'C1' },
      { word: 'consensus', meaning: '共识', level: 'C1' },
      { word: 'phenomenon', meaning: '现象', level: 'C1' },
      { word: 'sustainable', meaning: '可持续的', level: 'B2' },
      { word: 'urgency', meaning: '紧迫性', level: 'C1' },
    ],
    grammarPoints: ['分词作定语', '名词性从句', '虚拟语气'],
  },
];

export const AIBookReader: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<ReadingMaterial | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useState(0);
  const [bookmarkedWords, setBookmarkedWords] = useState<Set<string>>(new Set());

  const filteredMaterials = selectedLevel === 'all' 
    ? READING_MATERIALS 
    : READING_MATERIALS.filter(m => m.level === selectedLevel);

  const handleWordClick = useCallback((word: string) => {
    setActiveWord(activeWord === word ? null : word);
  }, [activeWord]);

  useEffect(() => {
    if (selectedMaterial) {
      const contentLength = selectedMaterial.content.length;
      const interval = setInterval(() => {
        setReadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + (100 / (contentLength / 5));
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [selectedMaterial]);

  const toggleBookmark = useCallback((word: string) => {
    setBookmarkedWords(prev => {
      const next = new Set(prev);
      if (next.has(word)) {
        next.delete(word);
      } else {
        next.add(word);
      }
      return next;
    });
  }, []);

  if (!selectedMaterial) {
    return (
      <div className="book-reader">
        <FloatingBack onClick={onBack} />
        
        <div className="reader-header">
          <h1 className="reader-title">📚 AI 选词阅读</h1>
          <p className="reader-sub">根据你的词汇量，智能推荐分级读物</p>
        </div>

        <div className="reader-level-filter">
          <button
            className={`level-btn ${selectedLevel === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedLevel('all')}
          >
            全部
          </button>
          {READING_LEVELS.map(l => (
            <button
              key={l.key}
              className={`level-btn ${selectedLevel === l.key ? 'active' : ''}`}
              onClick={() => setSelectedLevel(l.key)}
              style={{ 
                backgroundColor: selectedLevel === l.key ? l.color + '20' : 'transparent',
                borderColor: selectedLevel === l.key ? l.color : undefined
              }}
              title={l.desc}
            >
              {l.key}
            </button>
          ))}
        </div>

        <div className="reader-library">
          {filteredMaterials.map(material => (
            <div 
              key={material.id}
              className="book-card"
              onClick={() => setSelectedMaterial(material)}
            >
              <div className="book-card-header">
                <span 
                  className="book-level-badge"
                  style={{ backgroundColor: READING_LEVELS.find(l => l.key === material.level)?.color }}
                >
                  {material.level}
                </span>
                <span className="book-category">{material.category}</span>
              </div>
              <h3 className="book-title">{material.title}</h3>
              <p className="book-title-zh">{material.title_zh}</p>
              <div className="book-meta">
                <span className="book-meta-item">📖 {material.length} 词</span>
                <span className="book-meta-item">⏱️ {material.estimatedTime}</span>
              </div>
              <div className="book-preview">
                {material.content.slice(0, 80)}...
              </div>
              <div className="book-words-preview">
                {material.vocabulary.slice(0, 3).map(v => (
                  <span key={v.word} className="book-word-tag">{v.word}</span>
                ))}
                {material.vocabulary.length > 3 && (
                  <span className="book-word-more">+{material.vocabulary.length - 3}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="reader-stats">
          <div className="stat-item">
            <span className="stat-value">5</span>
            <span className="stat-label">精选文章</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">20+</span>
            <span className="stat-label">核心词汇</span>
            <span className="stat-label">每篇</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">3</span>
            <span className="stat-label">语法要点</span>
            <span className="stat-label">每篇</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-reader-detail">
      <FloatingBack onClick={() => {
        setSelectedMaterial(null);
        setShowSummary(false);
        setReadProgress(0);
      }} />

      <div className="reader-detail-header">
        <div className="detail-level-row">
          <span 
            className="detail-level-badge"
            style={{ backgroundColor: READING_LEVELS.find(l => l.key === selectedMaterial.level)?.color }}
          >
            {selectedMaterial.level}
          </span>
          <span className="detail-category">{selectedMaterial.category}</span>
        </div>
        <h1 className="detail-title">{selectedMaterial.title}</h1>
        <p className="detail-title-zh">{selectedMaterial.title_zh}</p>
        <div className="detail-meta">
          <span className="detail-meta-item">📖 {selectedMaterial.length} 词</span>
          <span className="detail-meta-item">⏱️ {selectedMaterial.estimatedTime}</span>
        </div>
      </div>

      <div className="reader-progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${readProgress}%` }}
        />
        <span className="progress-text">{Math.round(readProgress)}%</span>
      </div>

      <div className="reader-content">
        {selectedMaterial.content.split(/\s+/).map((word, idx) => {
          const vocabItem = selectedMaterial.vocabulary.find(v => v.word.toLowerCase() === word.toLowerCase().replace(/[.,!?]/g, ''));
          return (
            <span key={idx}>
              {vocabItem ? (
                <span 
                  className={`reader-word vocab-word ${activeWord === vocabItem.word ? 'active' : ''}`}
                  onClick={() => handleWordClick(vocabItem.word)}
                >
                  {word}
                </span>
              ) : (
                <span className="reader-word">{word}</span>
              )}
              {' '}
            </span>
          );
        })}
      </div>

      {activeWord && (
        <div className="word-popup">
          {(() => {
            const vocab = selectedMaterial.vocabulary.find(v => v.word.toLowerCase() === activeWord.toLowerCase());
            if (!vocab) return null;
            return (
              <div className="word-popup-content">
                <div className="word-popup-header">
                  <span className="word-popup-word">{vocab.word}</span>
                  <span 
                    className="word-popup-level"
                    style={{ backgroundColor: READING_LEVELS.find(l => l.key === vocab.level)?.color }}
                  >
                    {vocab.level}
                  </span>
                  <button 
                    className="word-popup-bookmark"
                    onClick={() => toggleBookmark(vocab.word)}
                  >
                    {bookmarkedWords.has(vocab.word) ? '★' : '☆'}
                  </button>
                </div>
                <p className="word-popup-meaning">{vocab.meaning}</p>
              </div>
            );
          })()}
        </div>
      )}

      <div className="reader-vocab-section">
        <h3 className="vocab-section-title">📝 核心词汇</h3>
        <div className="vocab-grid">
          {selectedMaterial.vocabulary.map(v => (
            <div 
              key={v.word}
              className={`vocab-card ${bookmarkedWords.has(v.word) ? 'bookmarked' : ''}`}
            >
              <div className="vocab-word-row">
                <span className="vocab-word">{v.word}</span>
                <span 
                  className="vocab-level"
                  style={{ backgroundColor: READING_LEVELS.find(l => l.key === v.level)?.color }}
                >
                  {v.level}
                </span>
                <button 
                  className="vocab-bookmark"
                  onClick={() => toggleBookmark(v.word)}
                >
                  {bookmarkedWords.has(v.word) ? '★' : '☆'}
                </button>
              </div>
              <p className="vocab-meaning">{v.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="reader-grammar-section">
        <h3 className="grammar-section-title">📚 语法要点</h3>
        <ul className="grammar-list">
          {selectedMaterial.grammarPoints.map((point, idx) => (
            <li key={idx} className="grammar-item">
              <span className="grammar-bullet">✓</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="reader-summary-section">
        <button 
          className={`summary-btn ${showSummary ? 'active' : ''}`}
          onClick={() => setShowSummary(!showSummary)}
        >
          🤖 {showSummary ? '收起' : 'AI 总结'}
        </button>
        {showSummary && (
          <div className="summary-content">
            <h4 className="summary-title">📌 文章总结</h4>
            <p className="summary-text">
              本文主要讲述了{selectedMaterial.title_zh}的相关内容，适合{READING_LEVELS.find(l => l.key === selectedMaterial.level)?.label}学习者阅读。通过阅读本文，你可以学习到{selectedMaterial.vocabulary.length}个核心词汇和{selectedMaterial.grammarPoints.length}个语法要点。建议重点掌握：{selectedMaterial.vocabulary.slice(0, 2).map(v => v.word).join('、')}等词汇，以及{selectedMaterial.grammarPoints.slice(0, 1)}等语法结构。
            </p>
            <div className="summary-highlights">
              <h5>重点词汇：</h5>
              {selectedMaterial.vocabulary.map(v => (
                <span key={v.word} className="summary-word">
                  {v.word} ({v.meaning})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="reader-footer">
        <button className="footer-btn" onClick={() => {
          setSelectedMaterial(null);
          setShowSummary(false);
          setReadProgress(0);
        }}>
          返回书架
        </button>
      </div>
    </div>
  );
};