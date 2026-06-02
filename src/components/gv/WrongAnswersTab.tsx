import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

interface WrongAnswersTabProps {
  sessionKey: string;
  languageCode: string;
}

type ErrType = 'vocab' | 'grammar' | 'listening' | 'reading' | 'other';

interface WrongAnswer {
  id: string;
  session_key: string;
  lang_code: string;
  question_text: string;
  correct_answer: string;
  user_answer: string;
  error_type: ErrType;
  source_module: string;
  is_mastered: boolean;
  review_count: number;
  created_at: string;
  notes: string | null;
}

const ERR_LABEL: Record<ErrType, string> = {
  vocab: '词汇', grammar: '语法', listening: '听力', reading: '阅读', other: '其他',
};
const ERR_COLOR: Record<ErrType, string> = {
  vocab: '#3b82f6', grammar: '#f59e0b', listening: '#10b981', reading: '#8b5cf6', other: '#6b7280',
};

export const WrongAnswersTab: React.FC<WrongAnswersTabProps> = ({ sessionKey, languageCode }) => {
  const [answers, setAnswers] = useState<WrongAnswer[]>([]);
  const [filterType, setFilterType] = useState<ErrType | 'all'>('all');
  const [showMastered, setShowMastered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const loadData = useCallback(async () => {
    const { data } = await supabase.from('wrong_answers')
      .select('*')
      .eq('session_key', sessionKey)
      .eq('lang_code', languageCode)
      .order('created_at', { ascending: false })
      .limit(100);
    setAnswers((data ?? []) as WrongAnswer[]);
  }, [sessionKey, languageCode]);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  async function markMastered(wa: WrongAnswer) {
    await supabase.from('wrong_answers').update({ is_mastered: true }).eq('id', wa.id);
    setAnswers((prev) => prev.map((a) => a.id === wa.id ? { ...a, is_mastered: true } : a));
  }

  async function incrementReview(wa: WrongAnswer) {
    await supabase.from('wrong_answers').update({ review_count: wa.review_count + 1 }).eq('id', wa.id);
    setAnswers((prev) => prev.map((a) => a.id === wa.id ? { ...a, review_count: a.review_count + 1 } : a));
  }

  async function saveNote(id: string) {
    await supabase.from('wrong_answers').update({ notes: noteText }).eq('id', id);
    setAnswers((prev) => prev.map((a) => a.id === id ? { ...a, notes: noteText } : a));
    setEditNoteId(null);
  }

  const displayed = answers.filter((a) => {
    if (!showMastered && a.is_mastered) return false;
    if (filterType !== 'all' && a.error_type !== filterType) return false;
    return true;
  });

  const reviewList = displayed.filter((a) => !a.is_mastered);
  const currentReview = reviewList[reviewIdx] ?? null;

  const errCounts = answers.reduce((acc, a) => {
    if (!a.is_mastered) acc[a.error_type] = (acc[a.error_type] ?? 0) + 1;
    return acc;
  }, {} as Partial<Record<ErrType, number>>);

  const totalPending = answers.filter((a) => !a.is_mastered).length;
  const masteredCount = answers.filter((a) => a.is_mastered).length;

  if (reviewMode && currentReview) {
    return (
      <div className="wa-wrap">
        <div className="wa-review-header">
          <button className="wa-back-btn" onClick={() => { setReviewMode(false); setReviewIdx(0); setRevealed(false); }}>
            ← 退出复习
          </button>
          <span className="wa-review-progress">{reviewIdx + 1} / {reviewList.length}</span>
        </div>
        <div className="wa-review-card">
          <div className="wa-review-type" style={{ color: ERR_COLOR[currentReview.error_type] }}>
            {ERR_LABEL[currentReview.error_type]} · 第{currentReview.review_count + 1}次复习
          </div>
          <p className="wa-review-source">来源：{currentReview.source_module}</p>
          <div className="wa-review-question">{currentReview.question_text}</div>
          {!revealed ? (
            <button className="wa-reveal-btn" onClick={() => { setRevealed(true); incrementReview(currentReview); }}>
              揭晓答案
            </button>
          ) : (
            <>
              <div className="wa-answer-box">
                <div className="wa-wrong-ans">
                  <span className="wa-ans-label">你的答案</span>
                  <span className="wa-ans-val wrong">{currentReview.user_answer}</span>
                </div>
                <div className="wa-correct-ans">
                  <span className="wa-ans-label">正确答案</span>
                  <span className="wa-ans-val correct">{currentReview.correct_answer}</span>
                </div>
              </div>
              {currentReview.notes && (
                <div className="wa-review-note">{currentReview.notes}</div>
              )}
              <div className="wa-review-actions">
                <button className="wa-still-wrong-btn" onClick={() => {
                  setRevealed(false);
                  setReviewIdx((i) => (i + 1) % reviewList.length);
                }}>还没掌握</button>
                <button className="wa-mastered-btn" onClick={async () => {
                  await markMastered(currentReview);
                  setRevealed(false);
                  const next = reviewIdx >= reviewList.length - 1 ? 0 : reviewIdx;
                  setReviewIdx(next);
                }}>已掌握 ✓</button>
              </div>
            </>
          )}
        </div>
        <div className="wa-review-nav">
          <button className="wa-nav-btn" disabled={reviewIdx === 0}
            onClick={() => { setReviewIdx((i) => i - 1); setRevealed(false); }}>上一题</button>
          <button className="wa-nav-btn" disabled={reviewIdx >= reviewList.length - 1}
            onClick={() => { setReviewIdx((i) => i + 1); setRevealed(false); }}>下一题</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wa-wrap">
      {/* Stats row */}
      <div className="wa-stats-row">
        <div className="wa-stat-card">
          <span className="wa-stat-num">{totalPending}</span>
          <span className="wa-stat-label">待复习</span>
        </div>
        <div className="wa-stat-card">
          <span className="wa-stat-num">{masteredCount}</span>
          <span className="wa-stat-label">已掌握</span>
        </div>
        <div className="wa-stat-card">
          <span className="wa-stat-num">{answers.length}</span>
          <span className="wa-stat-label">总计</span>
        </div>
      </div>

      {/* Error type breakdown */}
      {totalPending > 0 && (
        <div className="wa-breakdown">
          {(Object.keys(ERR_LABEL) as ErrType[]).map((t) => errCounts[t] ? (
            <div className="wa-breakdown-item" key={t}>
              <div className="wa-bd-bar-wrap">
                <div className="wa-bd-fill" style={{ width: `${Math.min((errCounts[t]! / totalPending) * 100, 100)}%`, background: ERR_COLOR[t] }} />
              </div>
              <span className="wa-bd-label">{ERR_LABEL[t]}</span>
              <span className="wa-bd-count">{errCounts[t]}</span>
            </div>
          ) : null)}
        </div>
      )}

      {/* Controls */}
      <div className="wa-controls">
        <div className="wa-filter-row">
          <button className={`wa-filter-btn ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>全部</button>
          {(Object.keys(ERR_LABEL) as ErrType[]).map((t) => (
            <button key={t} className={`wa-filter-btn ${filterType === t ? 'active' : ''}`}
              style={filterType === t ? { background: ERR_COLOR[t] } : {}}
              onClick={() => setFilterType(t)}>
              {ERR_LABEL[t]}
            </button>
          ))}
        </div>
        <div className="wa-control-row">
          <label className="wa-toggle-label">
            <input type="checkbox" checked={showMastered} onChange={(e) => setShowMastered(e.target.checked)} />
            显示已掌握
          </label>
          {reviewList.length > 0 && (
            <button className="wa-review-btn" onClick={() => { setReviewMode(true); setReviewIdx(0); setRevealed(false); }}>
              开始复习 ({reviewList.length}题)
            </button>
          )}
        </div>
      </div>

      {loading && <div className="wa-loading">加载错题数据…</div>}
      {!loading && displayed.length === 0 && (
        <div className="wa-empty">
          <div className="wa-empty-icon">📌</div>
          <p>{answers.length === 0 ? '错题本是空的，继续练习吧！' : '没有符合筛选条件的错题'}</p>
        </div>
      )}

      {displayed.map((wa) => (
        <div className={`wa-card ${wa.is_mastered ? 'mastered' : ''}`} key={wa.id}>
          <div className="wa-card-top">
            <span className="wa-err-tag" style={{ background: ERR_COLOR[wa.error_type] }}>{ERR_LABEL[wa.error_type]}</span>
            <span className="wa-source">{wa.source_module}</span>
            <span className="wa-review-count">复习{wa.review_count}次</span>
            {wa.is_mastered && <span className="wa-mastered-tag">已掌握</span>}
          </div>
          <p className="wa-question">{wa.question_text}</p>
          <div className="wa-answers">
            <span className="wa-your-ans">你答：<span className="wrong-text">{wa.user_answer}</span></span>
            <span className="wa-correct">正解：<span className="correct-text">{wa.correct_answer}</span></span>
          </div>
          {editNoteId === wa.id ? (
            <div className="wa-note-edit">
              <textarea className="wa-note-input" rows={2} value={noteText}
                placeholder="添加笔记…" onChange={(e) => setNoteText(e.target.value)} />
              <div className="wa-note-btns">
                <button className="wa-note-save" onClick={() => saveNote(wa.id)}>保存</button>
                <button className="wa-note-cancel" onClick={() => setEditNoteId(null)}>取消</button>
              </div>
            </div>
          ) : (
            wa.notes
              ? <p className="wa-note-text" onClick={() => { setEditNoteId(wa.id); setNoteText(wa.notes ?? ''); }}>📝 {wa.notes}</p>
              : <button className="wa-add-note-btn" onClick={() => { setEditNoteId(wa.id); setNoteText(''); }}>+ 添加笔记</button>
          )}
          {!wa.is_mastered && (
            <button className="wa-mark-mastered" onClick={() => markMastered(wa)}>标记已掌握</button>
          )}
        </div>
      ))}
    </div>
  );
};
