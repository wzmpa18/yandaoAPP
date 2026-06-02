import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

interface TextbookTabProps {
  sessionKey: string;
  languageCode: string;
  languageName: string;
}

interface Textbook {
  id: string;
  lang_code: string;
  series_name: string;
  publisher: string;
  level_range: string;
  total_units: number;
  cover_emoji: string;
  description: string;
}

interface UserProgress {
  id: string;
  textbook_id: string;
  current_unit: number;
  completed_units: number[];
  notes: string;
}

interface UnitContent {
  unit: number;
  title: string;
  vocab: Array<{ word: string; reading?: string; meaning: string; notes?: string }>;
  grammar: Array<{ pattern: string; meaning: string; example: string }>;
  dialogue?: string;
}

const UNIT_DATA: Record<string, UnitContent[]> = {
  minna_ja: [
    {
      unit: 1, title: 'はじめまして',
      vocab: [
        { word: '名前', reading: 'なまえ', meaning: '名字' },
        { word: '学生', reading: 'がくせい', meaning: '学生' },
        { word: '先生', reading: 'せんせい', meaning: '老师' },
        { word: '会社員', reading: 'かいしゃいん', meaning: '公司职员' },
        { word: '医者', reading: 'いしゃ', meaning: '医生' },
      ],
      grammar: [
        { pattern: '〜は〜です', meaning: '…是…', example: '私は学生です' },
        { pattern: '〜は〜ですか', meaning: '…是…吗？', example: 'あなたは学生ですか' },
      ],
      dialogue: '田中：はじめまして、田中です。どうぞよろしく。\nリー：はじめまして、リーです。こちらこそよろしく。',
    },
    {
      unit: 2, title: 'これはなんですか',
      vocab: [
        { word: 'これ', meaning: '这个' },
        { word: 'それ', meaning: '那个' },
        { word: 'あれ', meaning: '那个（远）' },
        { word: '本', reading: 'ほん', meaning: '书' },
        { word: '辞書', reading: 'じしょ', meaning: '词典' },
      ],
      grammar: [
        { pattern: 'これ/それ/あれは〜です', meaning: '这/那是…', example: 'これは本です' },
        { pattern: '〜の〜', meaning: '…的…', example: '私の本' },
      ],
    },
    {
      unit: 3, title: 'ここはどこですか',
      vocab: [
        { word: 'ここ', meaning: '这里' },
        { word: 'そこ', meaning: '那里' },
        { word: 'あそこ', meaning: '那里（远）' },
        { word: 'デパート', meaning: '百货公司' },
        { word: '銀行', reading: 'ぎんこう', meaning: '银行' },
      ],
      grammar: [
        { pattern: '〜はどこですか', meaning: '…在哪里？', example: 'トイレはどこですか' },
        { pattern: '〜の〜に〜があります', meaning: '在…的…有…', example: '駅の前に銀行があります' },
      ],
    },
  ],
  genki_ja: [
    {
      unit: 1, title: 'New Friends',
      vocab: [
        { word: '大学', reading: 'だいがく', meaning: '大学' },
        { word: '一年生', reading: 'いちねんせい', meaning: '大一' },
        { word: '専攻', reading: 'せんこう', meaning: '专业' },
        { word: '出身', reading: 'しゅっしん', meaning: '出身/来自' },
        { word: '趣味', reading: 'しゅみ', meaning: '爱好' },
      ],
      grammar: [
        { pattern: 'X は Y です', meaning: 'X是Y', example: '私はメアリーです' },
        { pattern: 'X の Y', meaning: 'X的Y', example: 'メアリーさんの専攻' },
      ],
      dialogue: 'メアリー：すみません、留学生ですか。\nたけし：はい、そうです。アメリカから来ました。',
    },
    {
      unit: 2, title: 'Shopping',
      vocab: [
        { word: 'いくら', meaning: '多少钱' },
        { word: '円', reading: 'えん', meaning: '日元' },
        { word: '安い', reading: 'やすい', meaning: '便宜' },
        { word: '高い', reading: 'たかい', meaning: '贵/高' },
        { word: '買う', reading: 'かう', meaning: '买' },
      ],
      grammar: [
        { pattern: '〜をください', meaning: '请给我…', example: 'これをください' },
        { pattern: 'いくらですか', meaning: '多少钱？', example: 'このシャツはいくらですか' },
      ],
    },
  ],
  topik_ko: [
    {
      unit: 1, title: '인사 - 问候',
      vocab: [
        { word: '안녕하세요', meaning: '你好' },
        { word: '감사합니다', meaning: '谢谢' },
        { word: '이름', meaning: '名字' },
        { word: '학생', meaning: '学生' },
        { word: '선생님', meaning: '老师' },
      ],
      grammar: [
        { pattern: '저는 〜입니다', meaning: '我是…', example: '저는 학생입니다' },
        { pattern: '〜이/가 있어요', meaning: '有…', example: '책이 있어요' },
      ],
    },
  ],
};

function getUnits(textbookId: string): UnitContent[] {
  if (textbookId.includes('minna')) return UNIT_DATA['minna_ja'] ?? [];
  if (textbookId.includes('genki')) return UNIT_DATA['genki_ja'] ?? [];
  if (textbookId.includes('topik')) return UNIT_DATA['topik_ko'] ?? [];
  return UNIT_DATA['minna_ja'] ?? [];
}

function generateUnitQuiz(unit: UnitContent) {
  if (!unit.vocab.length) return null;
  const item = unit.vocab[Math.floor(Math.random() * unit.vocab.length)];
  const others = unit.vocab.filter((v) => v.meaning !== item.meaning).slice(0, 3).map((v) => v.meaning);
  if (others.length < 3) return null;
  const opts = [...others, item.meaning].sort(() => Math.random() - 0.5);
  return { question: `「${item.word}」的意思是？`, answer: item.meaning, options: opts };
}

export const TextbookTab: React.FC<TextbookTabProps> = ({ sessionKey, languageCode, languageName }) => {
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selectedBook, setSelectedBook] = useState<Textbook | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'book' | 'unit'>('list');

  const [quizItem, setQuizItem] = useState<ReturnType<typeof generateUnitQuiz>>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  const loadData = useCallback(async () => {
    const [bRes, pRes] = await Promise.all([
      supabase.from('textbook_index').select('*').eq('lang_code', languageCode).order('sort_order'),
      supabase.from('user_textbook_progress').select('*').eq('session_key', sessionKey).maybeSingle(),
    ]);
    const books = (bRes.data ?? []) as Textbook[];
    setTextbooks(books);
    if (pRes.data) setProgress(pRes.data as UserProgress);
  }, [sessionKey, languageCode]);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  async function selectBook(book: Textbook) {
    setSelectedBook(book);
    setView('book');
    setSelectedUnit(null);
    const units = getUnits(book.id);
    if (!progress) {
      await supabase.from('user_textbook_progress').insert({
        session_key: sessionKey,
        textbook_id: book.id,
        current_unit: 1,
        completed_units: [],
        notes: '',
      });
      loadData();
    }
  }

  async function markUnitComplete(unitNum: number) {
    if (!progress || !selectedBook) return;
    const completed = [...(progress.completed_units ?? [])];
    if (!completed.includes(unitNum)) completed.push(unitNum);
    const next = Math.max(progress.current_unit, unitNum + 1);
    await supabase.from('user_textbook_progress')
      .update({ completed_units: completed, current_unit: next })
      .eq('id', progress.id);
    setProgress({ ...progress, completed_units: completed, current_unit: next });
  }

  function openUnit(unit: UnitContent) {
    setSelectedUnit(unit);
    setView('unit');
    setQuizItem(null);
    setQuizAnswer(null);
    setQuizScore(0);
  }

  function startQuiz() {
    if (!selectedUnit) return;
    const q = generateUnitQuiz(selectedUnit);
    setQuizItem(q);
    setQuizAnswer(null);
  }

  function answerQuiz(ans: string) {
    if (!quizItem || quizAnswer) return;
    setQuizAnswer(ans);
    if (ans === quizItem.answer) setQuizScore((s) => s + 1);
    setTimeout(() => {
      if (selectedUnit) {
        setQuizItem(generateUnitQuiz(selectedUnit));
        setQuizAnswer(null);
      }
    }, 1200);
  }

  const units = selectedBook ? getUnits(selectedBook.id) : [];

  if (loading) return <div className="tb-loading">加载教材数据…</div>;

  if (view === 'unit' && selectedUnit && selectedBook) {
    const isCompleted = progress?.completed_units?.includes(selectedUnit.unit);
    return (
      <div className="tb-wrap">
        <div className="tb-breadcrumb">
          <button className="tb-back-link" onClick={() => setView('book')}>← {selectedBook.series_name}</button>
          <span className="tb-sep">/</span>
          <span>第{selectedUnit.unit}课</span>
        </div>
        <div className="tb-unit-header">
          <h3 className="tb-unit-title">第{selectedUnit.unit}课 · {selectedUnit.title}</h3>
          {isCompleted
            ? <span className="tb-done-badge">已完成 ✓</span>
            : <button className="tb-complete-btn" onClick={() => markUnitComplete(selectedUnit.unit)}>标记完成</button>
          }
        </div>

        {selectedUnit.vocab.length > 0 && (
          <div className="tb-section">
            <h4 className="tb-section-title">本课词汇</h4>
            <div className="tb-vocab-grid">
              {selectedUnit.vocab.map((v, i) => (
                <div className="tb-vocab-card" key={i}>
                  <span className="tb-vocab-word">{v.word}</span>
                  {v.reading && <span className="tb-vocab-reading">{v.reading}</span>}
                  <span className="tb-vocab-meaning">{v.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedUnit.grammar.length > 0 && (
          <div className="tb-section">
            <h4 className="tb-section-title">语法要点</h4>
            {selectedUnit.grammar.map((g, i) => (
              <div className="tb-grammar-card" key={i}>
                <span className="tb-grammar-pattern">{g.pattern}</span>
                <span className="tb-grammar-meaning">{g.meaning}</span>
                <p className="tb-grammar-example">{g.example}</p>
              </div>
            ))}
          </div>
        )}

        {selectedUnit.dialogue && (
          <div className="tb-section">
            <h4 className="tb-section-title">对话示例</h4>
            <div className="tb-dialogue">{selectedUnit.dialogue}</div>
          </div>
        )}

        <div className="tb-section">
          <div className="tb-quiz-header">
            <h4 className="tb-section-title">单元测验</h4>
            <span className="tb-score">得分 {quizScore}</span>
            <button className="tb-quiz-btn" onClick={startQuiz}>开始</button>
          </div>
          {quizItem && (
            <div className="tb-quiz-card">
              <p className="tb-quiz-q">{quizItem.question}</p>
              <div className="tb-quiz-opts">
                {quizItem.options.map((opt) => (
                  <button key={opt}
                    className={`tb-quiz-opt ${quizAnswer === opt ? (opt === quizItem!.answer ? 'correct' : 'wrong') : ''} ${quizAnswer && opt === quizItem!.answer ? 'correct' : ''}`}
                    onClick={() => answerQuiz(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'book' && selectedBook) {
    const completedCount = progress?.completed_units?.length ?? 0;
    const pct = units.length > 0 ? Math.round((completedCount / units.length) * 100) : 0;
    return (
      <div className="tb-wrap">
        <button className="tb-back-link" onClick={() => setView('list')}>← 教材列表</button>
        <div className="tb-book-header">
          <span className="tb-book-cover">{selectedBook.cover_emoji}</span>
          <div>
            <h3 className="tb-book-title">{selectedBook.series_name}</h3>
            <p className="tb-book-meta">{selectedBook.publisher} · {selectedBook.level_range}</p>
            <div className="tb-prog-bar-wrap">
              <div className="tb-prog-fill" style={{ width: `${pct}%` }} />
            </div>
            <p className="tb-prog-text">{completedCount}/{units.length} 课 ({pct}%)</p>
          </div>
        </div>
        <div className="tb-units-list">
          {units.map((unit) => {
            const done = progress?.completed_units?.includes(unit.unit);
            const current = progress?.current_unit === unit.unit;
            return (
              <div className={`tb-unit-row ${current ? 'current' : ''} ${done ? 'done' : ''}`} key={unit.unit}
                onClick={() => openUnit(unit)}>
                <div className="tb-unit-num-box">
                  {done ? <span className="tb-unit-check">✓</span> : <span className="tb-unit-num">{unit.unit}</span>}
                </div>
                <div className="tb-unit-info">
                  <span className="tb-unit-name">第{unit.unit}课 · {unit.title}</span>
                  <span className="tb-unit-stats">{unit.vocab.length}词 · {unit.grammar.length}语法</span>
                </div>
                {current && <span className="tb-unit-badge">学习中</span>}
                <span className="tb-unit-arrow">›</span>
              </div>
            );
          })}
          {units.length === 0 && (
            <div className="tb-empty">该教材课程内容即将上线，敬请期待</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="tb-wrap">
      <div className="tb-list-header">
        <h3 className="tb-list-title">{languageName} 教材同步</h3>
        <p className="tb-list-sub">选择你的教材，与课程进度同步学习</p>
      </div>
      {textbooks.length === 0 && (
        <div className="tb-empty">该语言暂无教材配置，管理员可在后台添加</div>
      )}
      <div className="tb-book-grid">
        {textbooks.map((book) => (
          <div className="tb-book-card" key={book.id} onClick={() => selectBook(book)}>
            <span className="tb-book-emoji">{book.cover_emoji}</span>
            <div className="tb-book-card-info">
              <span className="tb-book-card-name">{book.series_name}</span>
              <span className="tb-book-card-pub">{book.publisher}</span>
              <span className="tb-book-card-level">{book.level_range}</span>
            </div>
            <span className="tb-book-units">{book.total_units}课</span>
          </div>
        ))}
      </div>
    </div>
  );
};
