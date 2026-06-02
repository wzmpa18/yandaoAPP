import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { FloatingBack } from './FloatingBack';
import { Confetti } from './Confetti';

interface Question {
  id: string;
  language_code: string;
  level: string;
  type: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  audio_text: string;
}

interface ExamEngineProps {
  languageCode: string;
  languageName: string;
  level: string;
  onBack: () => void;
}

const TYPE_LABELS: Record<string, { icon: string; label: string }> = {
  listening_choice:      { icon: '🎧', label: 'Listening' },
  grammar_error:         { icon: '✏️', label: 'Grammar Fix' },
  sentence_build:        { icon: '🔤', label: 'Sentence Build' },
  reading_comprehension: { icon: '📖', label: 'Reading' },
};

const EXAM_DURATION = 600;

// Template question generators — produce infinite unique questions per language/level
// Each generator returns a Question object with a unique id derived from seed
function makeGrammarQ(lang: string, level: string, seed: number): Question {
  const banks: Record<string, Array<{ q: string; opts: string[]; ans: string; exp: string }>> = {
    ja: [
      { q: '「食べる」の丁寧形は？', opts: ['食べます', '食べた', '食べない', '食べよう'], ans: '食べます', exp: '丁寧形（ます形）は食べます。日常会話で最もよく使われます。' },
      { q: '「私___学生です」に入る助詞は？', opts: ['は', 'が', 'を', 'に'], ans: 'は', exp: 'トピックマーカー「は」を使います。例：私は学生です。' },
      { q: '「どこ___行きますか」の正しい助詞は？', opts: ['に', 'を', 'が', 'で'], ans: 'に', exp: '方向・目的地を示す助詞「に」を使います。' },
    ],
    fr: [
      { q: 'Quel est le pluriel de "cheval" ?', opts: ['chevals', 'chevaux', 'chevales', 'cheval'], ans: 'chevaux', exp: 'Cheval → chevaux. Les mots en -al font leur pluriel en -aux.' },
      { q: 'Comment dit-on "I am happy" en français ?', opts: ['Je suis heureux', 'Je suis content', 'Je suis bien', 'Je suis bon'], ans: 'Je suis heureux', exp: '"Je suis heureux/heureuse" est la traduction directe de "I am happy".' },
    ],
    ko: [
      { q: '"먹다"의 존댓말은?', opts: ['먹어요', '드세요', '드십니다', '드세요'], ans: '드세요', exp: '먹다의 존댓말은 드시다입니다. 드세요는 부탁/권유 형태입니다.' },
      { q: '"어디에 가세요?"에서 "에"의 역할은?', opts: ['방향', '시간', '원인', '수단'], ans: '방향', exp: '조사 "에"는 장소나 방향을 나타냅니다.' },
    ],
    es: [
      { q: '¿Cuál es el pretérito de "hablar" (yo)?', opts: ['hablé', 'habló', 'hablaba', 'hable'], ans: 'hablé', exp: 'El pretérito indefinido de hablar en primera persona es "hablé".' },
      { q: '¿Cuál es el plural de "el lápiz"?', opts: ['los lápizes', 'los lápices', 'los lapis', 'los lápiz'], ans: 'los lápices', exp: 'Los sustantivos en -z forman el plural cambiando -z por -ces: lápiz → lápices.' },
    ],
    de: [
      { q: 'Was ist der Artikel von "Haus"?', opts: ['der', 'die', 'das', 'ein'], ans: 'das', exp: 'Haus ist ein Neutrum: das Haus. Neutrale Nomen haben den Artikel "das".' },
      { q: 'Wie konjugiert man "gehen" für "ich"?', opts: ['gehe', 'gehst', 'geht', 'gehen'], ans: 'gehe', exp: '"ich gehe" — regelmäßige Konjugation. Ich gehe, du gehst, er/sie/es geht.' },
    ],
    en: [
      { q: 'Choose the correct form: "She ___ to the store."', opts: ['go', 'goes', 'going', 'gone'], ans: 'goes', exp: 'Third person singular (she/he/it) takes -s in simple present: goes.' },
      { q: 'Which is correct: "fewer" or "less"?', opts: ['less problems', 'fewer problems', 'less problem', 'fewer problem'], ans: 'fewer problems', exp: 'Use "fewer" with countable nouns (problems) and "less" with uncountable nouns (water).' },
    ],
    it: [
      { q: 'Come si forma il plurale di "libro"?', opts: ['libros', 'libri', 'libre', 'libra'], ans: 'libri', exp: 'In italiano, i nomi maschili in -o formano il plurale in -i: libro → libri.' },
    ],
    pt: [
      { q: 'Qual é o plural de "irmão"?', opts: ['irmãos', 'irmões', 'irmanos', 'irmâos'], ans: 'irmãos', exp: 'A maioria das palavras em -ão forma o plural em -ãos: irmão → irmãos.' },
    ],
    zh: [
      { q: '"把"字句的基本结构是？', opts: ['主+把+宾+动', '主+动+把+宾', '把+主+动+宾', '主+宾+把+动'], ans: '主+把+宾+动', exp: '把字句结构：主语+把+宾语+动词（+其他）。例：我把书放在桌上。' },
    ],
    ar: [
      { q: 'ما جمع كلمة "كتاب"؟', opts: ['كتابات', 'كتب', 'كتبان', 'كاتبون'], ans: 'كتب', exp: 'جمع "كتاب" هو "كتب" — وهو جمع تكسير شائع في العربية.' },
    ],
  };
  const pool = banks[lang] || banks.en;
  const item = pool[seed % pool.length];
  const levelSuffix = level === 'advanced' ? ' (Advanced)' : level === 'intermediate' ? ' (Int.)' : '';
  return {
    id: `gen-grammar-${lang}-${seed}`,
    language_code: lang,
    level,
    type: 'grammar_error',
    question_text: item.q + (seed >= pool.length ? ` #${Math.floor(seed / pool.length) + 1}` : '') + levelSuffix,
    options: item.opts,
    correct_answer: item.ans,
    explanation: item.exp,
    audio_text: '',
  };
}

function makeListeningQ(lang: string, level: string, seed: number): Question {
  const banks: Record<string, Array<{ audio: string; q: string; opts: string[]; ans: string; exp: string }>> = {
    ja: [
      { audio: 'ありがとうございます', q: 'What does the speaker say?', opts: ['Thank you', 'Good morning', 'Excuse me', 'Goodbye'], ans: 'Thank you', exp: 'ありがとうございます means "Thank you very much" — the most formal expression of gratitude.' },
      { audio: 'すみません、トイレはどこですか', q: 'What is the speaker asking for?', opts: ['The toilet', 'The exit', 'The restaurant', 'The hotel'], ans: 'The toilet', exp: 'トイレはどこですか means "Where is the toilet?" — an essential travel phrase.' },
    ],
    fr: [
      { audio: "Où est la gare, s'il vous plaît ?", q: 'What is the speaker asking?', opts: ['Where is the station?', 'Where is the hotel?', 'Where is the restaurant?', 'Where is the airport?'], ans: 'Where is the station?', exp: "La gare = the (train) station. S'il vous plaît = please." },
    ],
    ko: [
      { audio: '화장실이 어디에 있어요?', q: 'What is the speaker looking for?', opts: ['The bathroom', 'The exit', 'The bus stop', 'The pharmacy'], ans: 'The bathroom', exp: '화장실 = bathroom/toilet. 어디에 있어요 = where is it?' },
    ],
    es: [
      { audio: '¿Cuánto cuesta esto?', q: 'What is the speaker asking?', opts: ['How much does this cost?', 'Where is this?', 'What time is it?', 'How far is it?'], ans: 'How much does this cost?', exp: '¿Cuánto cuesta? = How much does it cost? Essential shopping phrase.' },
    ],
    de: [
      { audio: 'Wo ist der Bahnhof?', q: 'What is the speaker asking?', opts: ['Where is the train station?', 'Where is the bus stop?', 'Where is the hotel?', 'Where is the airport?'], ans: 'Where is the train station?', exp: 'Bahnhof = train station. Wo ist = where is.' },
    ],
    en: [
      { audio: 'Could you repeat that, please?', q: 'What is the speaker requesting?', opts: ['Repetition', 'Help', 'Directions', 'A menu'], ans: 'Repetition', exp: '"Could you repeat that?" is a polite way to ask someone to say something again.' },
    ],
    default: [
      { audio: 'Hello, how are you?', q: 'What did the speaker say?', opts: ['A greeting', 'A farewell', 'A question about directions', 'An apology'], ans: 'A greeting', exp: '"Hello, how are you?" is the most common English greeting.' },
    ],
  };
  const pool = banks[lang] || banks.default;
  const item = pool[seed % pool.length];
  return {
    id: `gen-listen-${lang}-${seed}`,
    language_code: lang,
    level,
    type: 'listening_choice',
    question_text: item.q,
    options: item.opts,
    correct_answer: item.ans,
    explanation: item.exp,
    audio_text: item.audio,
  };
}

// Generate a batch of N synthesized questions from templates
function generateQuestions(lang: string, level: string, startSeed: number, count: number): Question[] {
  const out: Question[] = [];
  for (let i = 0; i < count; i++) {
    const seed = startSeed + i;
    out.push(seed % 2 === 0 ? makeGrammarQ(lang, level, seed) : makeListeningQ(lang, level, seed));
  }
  return out;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({ languageCode, languageName, level, onBack }) => {
  const [questions, setQuestions]   = useState<Question[]>([]);
  const [qIndex, setQIndex]         = useState(0);
  const [selected, setSelected]     = useState<string | null>(null);
  const [revealed, setRevealed]     = useState(false);
  const [score, setScore]           = useState(0);
  const [wrongLog, setWrongLog]     = useState<Array<{ q: Question; chosen: string }>>([]);
  const [timeLeft, setTimeLeft]     = useState(EXAM_DURATION);
  const [phase, setPhase]           = useState<'loading' | 'exam' | 'done'>('loading');
  const [showAnalysis, setShowAnalysis] = useState<string | null>(null);
  const [confetti, setConfetti]     = useState(false);
  const [levelFilter, setLevelFilter] = useState(level);
  const [loadingMore, setLoadingMore] = useState(false);
  const seedRef                     = useRef(0);
  const timerRef                    = useRef<ReturnType<typeof setInterval> | null>(null);
  const synthRef                    = useRef<SpeechSynthesisUtterance | null>(null);
  const sentinelRef                 = useRef<HTMLDivElement>(null);

  const loadQuestions = useCallback(async () => {
    setPhase('loading');
    seedRef.current = 0;

    const { data } = await supabase
      .from('exam_questions')
      .select('*')
      .eq('language_code', languageCode)
      .eq('level', levelFilter)
      .order('order_hint');

    let qs: Question[] = (data || []).map((r: Question & { options: unknown }) => ({
      ...r,
      options: Array.isArray(r.options) ? r.options : JSON.parse(r.options as string || '[]'),
    }));

    // Pad with generated questions to ensure at least 10
    if (qs.length < 10) {
      const fill = generateQuestions(languageCode, levelFilter, 0, 10 - qs.length);
      qs = [...qs, ...fill];
      seedRef.current = fill.length;
    }

    qs.sort(() => Math.random() - 0.5);
    setQuestions(qs);
    setQIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setWrongLog([]);
    setTimeLeft(EXAM_DURATION);
    setPhase('exam');
  }, [languageCode, levelFilter]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  // Countdown
  useEffect(() => {
    if (phase !== 'exam') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); setPhase('done'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // Infinite scroll: observe sentinel near bottom
  useEffect(() => {
    if (phase !== 'exam') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          loadMoreQuestions();
        }
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  });

  function loadMoreQuestions() {
    setLoadingMore(true);
    const newBatch = generateQuestions(languageCode, levelFilter, seedRef.current, 5);
    seedRef.current += 5;
    setTimeout(() => {
      setQuestions((prev) => [...prev, ...newBatch]);
      setLoadingMore(false);
    }, 400);
  }

  function speakText(text: string) {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = {
      ja: 'ja-JP', fr: 'fr-FR', ko: 'ko-KR', es: 'es-ES',
      en: 'en-US', de: 'de-DE', it: 'it-IT', pt: 'pt-BR',
      zh: 'zh-CN', ar: 'ar-SA',
    };
    utt.lang = langMap[languageCode] || 'en-US';
    utt.rate = 0.85;
    synthRef.current = utt;
    window.speechSynthesis.speak(utt);
  }

  function handleSelect(opt: string) {
    if (revealed) return;
    setSelected(opt);
  }

  function handleReveal() {
    if (!selected || revealed) return;
    const q = questions[qIndex];
    setRevealed(true);
    if (selected === q.correct_answer) {
      setScore((s) => s + 1);
    } else {
      setWrongLog((w) => [...w, { q, chosen: selected }]);
    }
  }

  function handleNext() {
    if (qIndex + 1 >= questions.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('done');
      const pct = Math.round((score / Math.max(questions.length, 1)) * 100);
      if (pct >= 70) { setConfetti(true); setTimeout(() => setConfetti(false), 3000); }
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  }

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  if (phase === 'loading') {
    return (
      <div className="exam-loading">
        <FloatingBack onClick={onBack} />
        <div className="exam-spinner" />
        <p>Loading questions…</p>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <>
        <Confetti active={confetti} />
        <div className="exam-result-wrap">
          <FloatingBack onClick={onBack} />
          <div className="exam-result-card">
            <div className="exam-result-score-ring">
              <svg viewBox="0 0 80 80" width="120" height="120">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#CFC9BF" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke={pct >= 70 ? '#7A9B71' : pct >= 40 ? '#C9A574' : '#C9553D'}
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${(pct / 100) * 213.6} 213.6`}
                  transform="rotate(-90 40 40)"
                />
                <text x="40" y="44" textAnchor="middle" fontSize="16" fontWeight="800" fill="#3F3C37">
                  {pct}%
                </text>
              </svg>
            </div>
            <h2 className="exam-result-title">
              {pct >= 70 ? '🎉 Excellent!' : pct >= 40 ? '👍 Good effort' : '💪 Keep going'}
            </h2>
            <p className="exam-result-sub">{score} / {questions.length} correct · {languageName}</p>

            {wrongLog.length > 0 && (
              <div className="exam-wrong-section">
                <h3 className="exam-wrong-title">AI Error Analysis · 错题解析</h3>
                {wrongLog.map(({ q, chosen }, i) => (
                  <div key={i} className="exam-wrong-card">
                    <div className="exam-wrong-q">
                      <span className={`exam-type-chip ${q.type}`}>{TYPE_LABELS[q.type]?.icon} {TYPE_LABELS[q.type]?.label}</span>
                      <p className="exam-wrong-qtext">{q.question_text}</p>
                    </div>
                    <div className="exam-wrong-answers">
                      <span className="exam-wrong-yours">✗ Your answer: {chosen}</span>
                      <span className="exam-wrong-correct">✓ Correct: {q.correct_answer}</span>
                    </div>
                    <button
                      className="exam-analysis-toggle"
                      onClick={() => setShowAnalysis(showAnalysis === q.id ? null : q.id)}
                    >
                      {showAnalysis === q.id ? 'Hide' : 'AI Deep Analysis 🤖'}
                    </button>
                    {showAnalysis === q.id && (
                      <div className="exam-analysis-panel"><p>{q.explanation}</p></div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="exam-result-actions">
              <button className="exam-retry-btn" onClick={loadQuestions}>Retry Exam 重新测试</button>
              <button className="exam-back-btn" onClick={onBack}>Back to Home</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const q = questions[qIndex];
  const typeInfo = TYPE_LABELS[q.type] || { icon: '❓', label: q.type };

  return (
    <>
      <Confetti active={confetti} />
      <div className="exam-wrap">
        <FloatingBack onClick={onBack} />

        <div className="exam-topbar">
          <div className="exam-meta">
            <span className="exam-lang">{languageName}</span>
            <span className="exam-level-chip">{levelFilter}</span>
          </div>
          <div className={`exam-timer ${timeLeft < 60 ? 'urgent' : ''}`}>⏱ {fmt(timeLeft)}</div>
          <div className="exam-score-display">✨ {score}/{questions.length}</div>
        </div>

        <div className="exam-level-row">
          {(['beginner', 'intermediate', 'advanced'] as const).map((lv) => (
            <button
              key={lv}
              className={`exam-lv-btn ${levelFilter === lv ? 'active' : ''}`}
              onClick={() => setLevelFilter(lv)}
            >
              {lv === 'beginner' ? '🌱' : lv === 'intermediate' ? '🌿' : '🎋'} {lv}
            </button>
          ))}
        </div>

        <div className="exam-progress-bar">
          <div
            className="exam-progress-fill"
            style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="exam-progress-text">{qIndex + 1} / {questions.length}</p>

        <div className="exam-question-card">
          <div className="exam-type-row">
            <span className={`exam-type-chip ${q.type}`}>
              {typeInfo.icon} {typeInfo.label}
            </span>
            {q.audio_text && (
              <button className="exam-speak-btn" onClick={() => speakText(q.audio_text)}>
                🔊 Play
              </button>
            )}
          </div>

          <p className="exam-q-text">{q.question_text}</p>

          <div className="exam-options">
            {q.options.map((opt: string) => {
              let cls = 'exam-opt';
              if (revealed) {
                if (opt === q.correct_answer) cls += ' correct';
                else if (opt === selected) cls += ' wrong';
              } else if (opt === selected) {
                cls += ' chosen';
              }
              return (
                <button key={opt} className={cls} onClick={() => handleSelect(opt)}>
                  {opt}
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className="exam-explanation">
              <span className="exam-exp-label">💡 Explanation</span>
              <p>{q.explanation}</p>
            </div>
          )}
        </div>

        <div className="exam-action-row">
          {!revealed ? (
            <button className="exam-confirm-btn" disabled={!selected} onClick={handleReveal}>
              Confirm Answer
            </button>
          ) : (
            <button className="exam-next-btn" onClick={handleNext}>
              {qIndex + 1 >= questions.length ? 'See Results 查看结果' : 'Next Question →'}
            </button>
          )}
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="exam-sentinel">
          {loadingMore && <div className="exam-load-more-row"><div className="exam-spinner-sm" /> Loading more…</div>}
        </div>
      </div>
    </>
  );
};
