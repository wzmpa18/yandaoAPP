import React, { useState, useCallback, useRef } from 'react';
import { FloatingBack } from './FloatingBack';
import { Confetti } from './Confetti';
import { callAI } from '../lib/aiClient';
import { speakWithPreset, stopSpeaking } from '../lib/voiceProfile';
import { supabase } from '../data/supabase';

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

/** 用正则/规则做本地语法检查，速度快，覆盖常见错误 */
function localGrammarCheck(text: string): GrammarError[] {
  const errors: GrammarError[] = [];
  const lowerText = text.toLowerCase();
  
  // 主谓一致
  if (/\b(he|she|it)\s+(go|do|have|make|take|come)\b/i.test(text)) {
    const m = text.match(/\b(he|she|it)\s+(go|do|have|make|take|come)\b/i)?.[0] ?? '';
    if (m) {
      const mIdx = text.indexOf(m);
      errors.push({
        start: mIdx + m.split(/\s+/)[0].length + 1,
        end: mIdx + m.length,
        message: '主谓不一致',
        suggestion: `第三人称单数应使用 ${m.split(/\s+/)[1]}es/does/has/makes/takes/comes`,
        type: 'grammar',
      });
    }
  }
  
  // I 小写
  if (/\bi\s+(am|have|will|can|do|like|think|want|need|know)\b/.test(text)) {
    const m = text.match(/\bi\s+(am|have|will|can|do|like|think|want|need|know)\b/i)?.[0] ?? '';
    if (m) {
      errors.push({
        start: text.indexOf(m),
        end: text.indexOf(m) + 1,
        message: '人称代词 I 需要大写',
        suggestion: '改为 I',
        type: 'style',
      });
    }
  }
  
  // very + 形容词 (简单表达)
  const veryMatch = lowerText.match(/\bvery\s+(\w+)\b/g);
  if (veryMatch) {
    veryMatch.forEach((vm, vi) => {
      const idx = lowerText.indexOf(vm, vi === 0 ? 0 : lowerText.indexOf(veryMatch[vi - 1]) + 1);
      if (idx >= 0) {
        errors.push({
          start: idx,
          end: idx + vm.length,
          message: '表达过于基础',
          suggestion: `可改为更精准的形容词（如 extremely, remarkably 等）`,
          type: 'style',
        });
      }
    });
  }
  
  // because...so 重复
  if (lowerText.includes('because') && text.match(/\bso\b/i)) {
    errors.push({
      start: text.toLowerCase().indexOf('because'),
      end: text.toLowerCase().indexOf('because') + 7,
      message: '关联词重复',
      suggestion: 'because 和 so 只需用一个',
      type: 'grammar',
    });
  }
  
  // 缺少标点
  if (!/[.!?。！？]$/.test(text.trim())) {
    errors.push({
      start: text.trim().length - 1,
      end: text.trim().length,
      message: '缺少句末标点',
      suggestion: '添加句号',
      type: 'punctuation',
    });
  }
  
  // 拼写不规范 (expanded)
  const spellingMap: Record<string, string> = {
    teh: 'the', wanna: 'want to', gonna: 'going to', u: 'you', r: 'are',
    ur: 'your', im: "I'm", dont: "don't", cant: "can't", wont: "won't",
    didnt: "didn't", couldnt: "couldn't", shouldnt: "shouldn't", wouldnt: "wouldn't",
    its: 'it is', their: 'there', alot: 'a lot', everytime: 'every time',
    noone: 'no one', infact: 'in fact', ofcourse: 'of course',
  };
  Object.entries(spellingMap).forEach(([err, fix]) => {
    const re = new RegExp(`\\b${err}\\b`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      errors.push({
        start: m.index,
        end: m.index + err.length,
        message: '拼写不规范',
        suggestion: `改为 ${fix}`,
        type: 'spelling',
      });
    }
  });
  
  // their/there/they're confusion
  const theirMatch = text.match(/\btheir\s+(is|are|was|were|has|have|will|can|should|must|go|come|make|take|do|get|see|know|think|want|need)\b/gi);
  if (theirMatch) {
    errors.push({
      start: text.toLowerCase().indexOf('their'),
      end: text.toLowerCase().indexOf('their') + 5,
      message: 'their/there 混淆',
      suggestion: '此处应使用 there',
      type: 'grammar',
    });
  }
  
  // Double negative
  if (/\b(don't|doesn't|didn't|won't|can't|couldn't|shouldn't|wouldn't)\s+\w+\s+no\b/i.test(text)) {
    errors.push({
      start: 0, end: 5,
      message: '双重否定',
      suggestion: '英语中双重否定通常不正确，请检查',
      type: 'grammar',
    });
  }
  
  // Article missing before singular countable noun
  if (/\b(i|you|he|she|we|they)\s+(am|is|are|was|were)\s+(teacher|student|doctor|pilot|lawyer|engineer|scientist|chef|artist|musician)\b/i.test(text)) {
    errors.push({
      start: 0, end: 5,
      message: '缺少冠词',
      suggestion: '单数可数名词前需要冠词 (a/an/the)',
      type: 'grammar',
    });
  }
  
  // 去重
  const seen = new Set<string>();
  return errors.filter(e => {
    const key = `${e.start}-${e.end}-${e.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => a.start - b.start);
}

/** 用真实 AI 做深度语法+句式分析，返回 JSON */
async function aiWritingCheck(text: string): Promise<{ errors: GrammarError[]; improvements: SentenceImprovement[]; summary: string }> {
  const prompt = `你是一个专业的英语写作教练。请对以下英文文本进行语法检查和句式优化分析。
请严格按以下JSON格式返回（不要包含任何其他文字）：

{
  "errors": [
    {"start": 起始字符位置(数字), "end": 结束字符位置(数字), "message": "中文错误说明", "suggestion": "修改建议", "type": "grammar|spelling|style|punctuation"}
  ],
  "improvements": [
    {"original": "原文片段", "improved": "优化后版本", "explanation": "优化原因"}
  ],
  "summary": "一句话总体评价"
}

文本内容："""${text}"""`;

  try {
    const response = await callAI(prompt, { max_tokens: 1000 });
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        errors: parsed.errors || [],
        improvements: parsed.improvements || [],
        summary: parsed.summary || 'AI 分析完成',
      };
    }
  } catch {
    // AI 不可用时静默降级
  }
  return { errors: [], improvements: [], summary: '' };
}

export const AIWritingCoach: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [improvements, setImprovements] = useState<SentenceImprovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [analyzedText, setAnalyzedText] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [speakingIdx, setSpeakingIdx] = useState(-1);
  const writingHistoryRef = useRef<string[]>([]);

  const analyzeText = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setAiSummary('');
    setSpeakingIdx(-1);
    stopSpeaking();

    // 先做本地快速检查（无延迟）
    const localErrors = localGrammarCheck(input);
    
    // 异步调用 AI 做深度分析
    const aiPromise = aiWritingCheck(input);
    
    // 本地结果立即展示
    setErrors(localErrors);
    setAnalyzedText(input);
    
    // AI 结果增强
    try {
      const aiResult = await aiPromise;
      if (aiResult.errors.length > 0 || aiResult.improvements.length > 0) {
        // 合并 AI 和本地错误（AI 优先）
        const mergedErrors = [...aiResult.errors];
        localErrors.forEach(le => {
          if (!mergedErrors.some(ae => Math.abs(ae.start - le.start) < 3 && ae.type === le.type)) {
            mergedErrors.push(le);
          }
        });
        setErrors(mergedErrors.sort((a, b) => a.start - b.start));
        if (aiResult.improvements.length > 0) setImprovements(aiResult.improvements);
        setAiSummary(aiResult.summary);
      }
    } catch {
      // AI 不可用，本地结果已展示
    }
    
    setLoading(false);
    
    // 保存写作历史
    writingHistoryRef.current = [...writingHistoryRef.current.slice(-19), input];
    try {
      await supabase.from('writing_history').upsert({
        user_id: 'default',
        text: input,
        error_count: errors.length,
        created_at: new Date().toISOString(),
      });
    } catch { /* 静默 */ }

    if (localErrors.length === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }, [input, errors.length]);

  const applySuggestion = useCallback((suggestion: string) => {
    setInput(prev => prev + ' ' + suggestion);
  }, []);

  const speakSuggestion = useCallback((idx: number, text: string) => {
    if (speakingIdx === idx) { stopSpeaking(); setSpeakingIdx(-1); return; }
    setSpeakingIdx(idx);
    speakWithPreset(text, 'en').finally(() => setSpeakingIdx(-1));
  }, [speakingIdx]);

  const renderHighlightedText = () => {
    if (!analyzedText) return null;
    const parts: React.ReactNode[] = [];
    let lastEnd = 0;
    const sortedErrors = [...errors].sort((a, b) => a.start - b.start);
    sortedErrors.forEach((err, idx) => {
      if (err.start > lastEnd) {
        parts.push(<span key={`text-${idx}`}>{analyzedText.slice(lastEnd, err.start)}</span>);
      }
      parts.push(
        <span key={`error-${idx}`} className="writing-error-highlight"
          style={{ backgroundColor: GRAMMAR_ERROR_TYPES[err.type].color + '30' }}
          title={`${GRAMMAR_ERROR_TYPES[err.type].label}: ${err.message}`}>
          {analyzedText.slice(err.start, err.end)}
        </span>
      );
      lastEnd = err.end;
    });
    if (lastEnd < analyzedText.length) parts.push(<span key="text-end">{analyzedText.slice(lastEnd)}</span>);
    return <p className="writing-analyzed-text">{parts}</p>;
  };

  return (
    <div className="writing-coach">
      <Confetti active={showConfetti} />
      <FloatingBack onClick={onBack} />

      <div className="writing-header">
        <h1 className="writing-title">✍️ AI 作文教练</h1>
        <p className="writing-sub">智能语法批改 · 句式优化建议 · AI深度分析</p>
      </div>

      <div className="writing-input-section">
        <textarea
          className="writing-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入你想要检查的英文作文或句子...&#10;&#10;示例：&#10;I think learning English is very important.&#10;She go to school every day."
          onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) analyzeText(); }}
        />
        <div className="writing-actions">
          <button className="writing-btn writing-btn-primary" onClick={analyzeText} disabled={loading || !input.trim()}>
            {loading ? '⏳ 分析中...' : '🔍 开始分析'}
          </button>
          <button className="writing-btn writing-btn-secondary" onClick={() => { setInput(''); setErrors([]); setImprovements([]); setAnalyzedText(''); setAiSummary(''); }}>
            清空
          </button>
        </div>
        <p className="writing-hint">按 Ctrl + Enter 快速分析 | 本地规则 + AI 深度检查</p>
      </div>

      {aiSummary && (
        <div className="writing-ai-summary">
          <span className="writing-ai-badge">🤖 AI 点评</span>
          <p>{aiSummary}</p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="writing-errors">
          <h2 className="writing-section-title">📝 语法检查结果 ({errors.length} 个问题)</h2>
          {renderHighlightedText()}
          <div className="writing-error-list">
            {errors.map((err, idx) => (
              <div key={idx} className="writing-error-item" style={{ borderLeftColor: GRAMMAR_ERROR_TYPES[err.type].color }}>
                <div className="writing-error-header">
                  <span className="writing-error-type" style={{ backgroundColor: GRAMMAR_ERROR_TYPES[err.type].color }}>
                    {GRAMMAR_ERROR_TYPES[err.type].label}
                  </span>
                  <span className="writing-error-message">{err.message}</span>
                </div>
                <p className="writing-error-suggestion">💡 建议：{err.suggestion}</p>
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
                  <button className="writing-speak-btn" onClick={() => speakSuggestion(idx, imp.improved.split(' / ')[0])}>
                    {speakingIdx === idx ? '🔊' : '🔈'}
                  </button>
                </div>
                <p className="writing-improvement-explanation">📚 {imp.explanation}</p>
                <button className="writing-apply-btn" onClick={() => applySuggestion(imp.improved.split(' / ')[0])}>
                  使用此表达
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {analyzedText && errors.length === 0 && improvements.length === 0 && !loading && (
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
          <li>写作历史已自动保存，支持持续改进</li>
        </ul>
      </div>
    </div>
  );
};