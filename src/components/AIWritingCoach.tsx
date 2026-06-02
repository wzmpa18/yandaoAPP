import React, { useState, useCallback } from 'react';
import { FloatingBack } from './FloatingBack';
import { Confetti } from './Confetti';

interface GrammarError {
  start: number;
  end: number;
  message: string;
  suggestion: string;
  type: 'grammar' | 'spelling' | 'style' | 'punctuation';
}

interface SentenceImprovement {
  original: string;
  improved: string;
  explanation: string;
}

const GRAMMAR_ERROR_TYPES: Record<string, { color: string; label: string }> = {
  grammar: { color: '#ef4444', label: '语法错误' },
  spelling: { color: '#f97316', label: '拼写错误' },
  style: { color: '#3b82f6', label: '表达优化' },
  punctuation: { color: '#8b5cf6', label: '标点问题' },
};

function mockGrammarCheck(text: string): GrammarError[] {
  const errors: GrammarError[] = [];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('he go') || lowerText.includes('she go')) {
    errors.push({
      start: text.toLowerCase().indexOf('go'),
      end: text.toLowerCase().indexOf('go') + 2,
      message: '主谓不一致',
      suggestion: '应使用 goes',
      type: 'grammar',
    });
  }
  
  if (lowerText.includes('i am') && text.charAt(0) !== 'I') {
    errors.push({
      start: 0,
      end: 1,
      message: '人称代词 I 需要大写',
      suggestion: '改为 I',
      type: 'style',
    });
  }
  
  if (lowerText.includes('very good') || lowerText.includes('very happy')) {
    errors.push({
      start: text.toLowerCase().indexOf('very'),
      end: text.toLowerCase().indexOf('very') + 4,
      message: '表达过于基础',
      suggestion: '可改为 excellent / delighted',
      type: 'style',
    });
  }
  
  if (lowerText.includes('because') && text.includes('so')) {
    errors.push({
      start: text.toLowerCase().indexOf('because'),
      end: text.toLowerCase().indexOf('because') + 7,
      message: '关联词重复',
      suggestion: 'because 和 so 只需用一个',
      type: 'grammar',
    });
  }
  
  if (!text.endsWith('.') && !text.endsWith('!') && !text.endsWith('?')) {
    errors.push({
      start: text.length - 1,
      end: text.length,
      message: '缺少句末标点',
      suggestion: '添加句号',
      type: 'punctuation',
    });
  }
  
  const spellingErrors = ['teh', 'wanna', 'gonna', 'u', 'r', 'ur'];
  spellingErrors.forEach(err => {
    const idx = lowerText.indexOf(err);
    if (idx >= 0) {
      errors.push({
        start: idx,
        end: idx + err.length,
        message: '拼写不规范',
        suggestion: err === 'teh' ? '改为 the' : err === 'wanna' ? '改为 want to' : 
                   err === 'gonna' ? '改为 going to' : err === 'u' ? '改为 you' :
                   err === 'r' ? '改为 are' : '改为 your',
        type: 'spelling',
      });
    }
  });
  
  return errors;
}

function mockImproveSentences(text: string): SentenceImprovement[] {
  const improvements: SentenceImprovement[] = [];
  
  if (text.includes('I think')) {
    improvements.push({
      original: 'I think...',
      improved: 'In my opinion... / From my perspective...',
      explanation: '使用更正式的表达替代 I think',
    });
  }
  
  if (text.includes('very important')) {
    improvements.push({
      original: 'very important',
      improved: 'crucial / essential / vital',
      explanation: '用更精准的形容词替代 very + 形容词',
    });
  }
  
  if (text.includes('a lot of')) {
    improvements.push({
      original: 'a lot of',
      improved: 'numerous / a multitude of / plenty of',
      explanation: '使用更丰富的量词表达',
    });
  }
  
  if (text.includes('can not')) {
    improvements.push({
      original: 'can not',
      improved: 'cannot',
      explanation: '标准写法是 cannot 连写',
    });
  }
  
  if (text.includes('it is')) {
    improvements.push({
      original: 'it is',
      improved: "it's",
      explanation: '非正式语境可使用缩写',
    });
  }
  
  return improvements;
}

export const AIWritingCoach: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [improvements, setImprovements] = useState<SentenceImprovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [analyzedText, setAnalyzedText] = useState('');

  const analyzeText = useCallback(() => {
    if (!input.trim()) return;
    
    setLoading(true);
    setTimeout(() => {
      setErrors(mockGrammarCheck(input));
      setImprovements(mockImproveSentences(input));
      setAnalyzedText(input);
      setLoading(false);
      if (mockGrammarCheck(input).length === 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
    }, 800);
  }, [input]);

  const applySuggestion = useCallback((suggestion: string) => {
    setInput(prev => prev + ' ' + suggestion);
  }, []);

  const renderHighlightedText = () => {
    if (!analyzedText) return null;
    
    const parts: React.ReactNode[] = [];
    let lastEnd = 0;
    
    const sortedErrors = [...errors].sort((a, b) => a.start - b.start);
    
    sortedErrors.forEach((err, idx) => {
      if (err.start > lastEnd) {
        parts.push(
          <span key={`text-${idx}`}>
            {analyzedText.slice(lastEnd, err.start)}
          </span>
        );
      }
      parts.push(
        <span
          key={`error-${idx}`}
          className="writing-error-highlight"
          style={{ backgroundColor: GRAMMAR_ERROR_TYPES[err.type].color + '30' }}
          title={`${GRAMMAR_ERROR_TYPES[err.type].label}: ${err.message}`}
        >
          {analyzedText.slice(err.start, err.end)}
        </span>
      );
      lastEnd = err.end;
    });
    
    if (lastEnd < analyzedText.length) {
      parts.push(
        <span key="text-end">
          {analyzedText.slice(lastEnd)}
        </span>
      );
    }
    
    return <p className="writing-analyzed-text">{parts}</p>;
  };

  return (
    <div className="writing-coach">
      <Confetti active={showConfetti} />
      <FloatingBack onClick={onBack} />

      <div className="writing-header">
        <h1 className="writing-title">✍️ AI 作文教练</h1>
        <p className="writing-sub">智能语法批改 · 句式优化建议</p>
      </div>

      <div className="writing-input-section">
        <textarea
          className="writing-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入你想要检查的英文作文或句子...\n\n示例：\nI think learning English is very important.\nShe go to school every day."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              analyzeText();
            }
          }}
        />
        <div className="writing-actions">
          <button 
            className="writing-btn writing-btn-primary"
            onClick={analyzeText}
            disabled={loading || !input.trim()}
          >
            {loading ? '分析中...' : '🔍 开始分析'}
          </button>
          <button 
            className="writing-btn writing-btn-secondary"
            onClick={() => setInput('')}
          >
            清空
          </button>
        </div>
        <p className="writing-hint">按 Ctrl + Enter 快速分析</p>
      </div>

      {errors.length > 0 && (
        <div className="writing-errors">
          <h2 className="writing-section-title">
            📝 语法检查结果 ({errors.length} 个问题)
          </h2>
          {renderHighlightedText()}
          <div className="writing-error-list">
            {errors.map((err, idx) => (
              <div 
                key={idx} 
                className="writing-error-item"
                style={{ borderLeftColor: GRAMMAR_ERROR_TYPES[err.type].color }}
              >
                <div className="writing-error-header">
                  <span 
                    className="writing-error-type"
                    style={{ backgroundColor: GRAMMAR_ERROR_TYPES[err.type].color }}
                  >
                    {GRAMMAR_ERROR_TYPES[err.type].label}
                  </span>
                  <span className="writing-error-message">{err.message}</span>
                </div>
                <p className="writing-error-suggestion">
                  💡 建议：{err.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {improvements.length > 0 && (
        <div className="writing-improvements">
          <h2 className="writing-section-title">✨ 句式优化建议</h2>
          <div className="writing-improvement-list">
            {improvements.map((imp, idx) => (
              <div key={idx} className="writing-improvement-item">
                <div className="writing-improvement-original">
                  <span className="writing-label">原文：</span>
                  <span className="writing-text">{imp.original}</span>
                </div>
                <div className="writing-improvement-improved">
                  <span className="writing-label">优化：</span>
                  <span className="writing-text writing-text-improved">{imp.improved}</span>
                </div>
                <p className="writing-improvement-explanation">
                  📚 {imp.explanation}
                </p>
                <button 
                  className="writing-apply-btn"
                  onClick={() => applySuggestion(imp.improved.split(' / ')[0])}
                >
                  使用此表达
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {analyzedText && errors.length === 0 && improvements.length === 0 && (
        <div className="writing-perfect">
          <div className="writing-perfect-icon">🎉</div>
          <h2>太棒了！</h2>
          <p>你的文字表达准确无误，继续保持！</p>
        </div>
      )}

      <div className="writing-tips">
        <h3 className="writing-tips-title">📌 写作小贴士</h3>
        <ul className="writing-tips-list">
          <li>避免重复使用 very + 形容词，尝试使用更精准的词汇</li>
          <li>注意主谓一致，第三人称单数动词需加 s/es</li>
          <li>句末记得添加标点符号</li>
          <li>正式写作中避免使用 wanna, gonna 等非正式缩写</li>
        </ul>
      </div>
    </div>
  );
};