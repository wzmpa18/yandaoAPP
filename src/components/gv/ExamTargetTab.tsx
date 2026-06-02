import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

interface ExamTargetTabProps {
  sessionKey: string;
  languageCode: string;
  languageName: string;
}

interface ExamTarget {
  id: string;
  system_name: string;
  level_code: string;
  level_label: string;
  description: string;
}

interface UserGoal {
  id: string;
  exam_target_id: string;
  target_date: string | null;
  daily_goal_min: number;
}

// Hardcoded exam-frequency vocab samples per language+level (offline-first)
const EXAM_VOCAB: Record<string, Array<{ word: string; reading?: string; meaning: string; freq: number; examTag: string }>> = {
  ja_N5: [
    { word: '食べる', reading: 'たべる', meaning: '吃', freq: 98, examTag: 'N5必考' },
    { word: '水', reading: 'みず', meaning: '水', freq: 95, examTag: 'N5必考' },
    { word: '学校', reading: 'がっこう', meaning: '学校', freq: 94, examTag: 'N5必考' },
    { word: '電車', reading: 'でんしゃ', meaning: '电车', freq: 90, examTag: 'N5常考' },
    { word: '映画', reading: 'えいが', meaning: '电影', freq: 88, examTag: 'N5常考' },
  ],
  ja_N4: [
    { word: '説明する', reading: 'せつめいする', meaning: '说明', freq: 92, examTag: 'N4必考' },
    { word: '普通', reading: 'ふつう', meaning: '普通', freq: 89, examTag: 'N4必考' },
    { word: '場合', reading: 'ばあい', meaning: '情况', freq: 87, examTag: 'N4必考' },
    { word: '文化', reading: 'ぶんか', meaning: '文化', freq: 85, examTag: 'N4常考' },
    { word: '運動', reading: 'うんどう', meaning: '运动', freq: 82, examTag: 'N4常考' },
  ],
  ja_N3: [
    { word: '影響', reading: 'えいきょう', meaning: '影响', freq: 93, examTag: 'N3必考' },
    { word: '判断', reading: 'はんだん', meaning: '判断', freq: 90, examTag: 'N3必考' },
    { word: '環境', reading: 'かんきょう', meaning: '环境', freq: 88, examTag: 'N3必考' },
    { word: '経験', reading: 'けいけん', meaning: '经验', freq: 86, examTag: 'N3常考' },
    { word: '原因', reading: 'げんいん', meaning: '原因', freq: 84, examTag: 'N3常考' },
  ],
  ja_N2: [
    { word: '促進', reading: 'そくしん', meaning: '促进', freq: 91, examTag: 'N2必考' },
    { word: '抑制', reading: 'よくせい', meaning: '抑制', freq: 88, examTag: 'N2必考' },
    { word: '把握', reading: 'はあく', meaning: '掌握', freq: 85, examTag: 'N2必考' },
    { word: '概念', reading: 'がいねん', meaning: '概念', freq: 83, examTag: 'N2常考' },
    { word: '一方', reading: 'いっぽう', meaning: '另一方面', freq: 80, examTag: 'N2常考' },
  ],
  ja_N1: [
    { word: '懸念', reading: 'けねん', meaning: '担忧', freq: 89, examTag: 'N1必考' },
    { word: '是非', reading: 'ぜひ', meaning: '无论如何', freq: 86, examTag: 'N1必考' },
    { word: '皮肉', reading: 'ひにく', meaning: '讽刺', freq: 83, examTag: 'N1必考' },
    { word: '顕著', reading: 'けんちょ', meaning: '显著', freq: 80, examTag: 'N1常考' },
    { word: '妥当', reading: 'だとう', meaning: '妥当', freq: 77, examTag: 'N1常考' },
  ],
};

const GRAMMAR_POINTS: Record<string, Array<{ pattern: string; meaning: string; example: string; freq: number }>> = {
  ja_N5: [
    { pattern: '〜は〜です', meaning: '…是…', example: 'これは本です', freq: 99 },
    { pattern: '〜を〜ます', meaning: '做…（礼貌体）', example: '水を飲みます', freq: 97 },
  ],
  ja_N4: [
    { pattern: '〜ようになる', meaning: '变得…', example: '日本語が話せるようになった', freq: 91 },
    { pattern: '〜ために', meaning: '为了…', example: '試験のために勉強する', freq: 89 },
  ],
  ja_N3: [
    { pattern: '〜に対して', meaning: '针对/对于…', example: '先生に対して敬意を示す', freq: 90 },
    { pattern: '〜にとって', meaning: '对…来说', example: '私にとって大切な人', freq: 87 },
  ],
  ja_N2: [
    { pattern: '〜に伴って', meaning: '伴随…', example: '経済成長に伴って物価が上がる', freq: 88 },
    { pattern: '〜をはじめ', meaning: '以…为首', example: '東京をはじめ多くの都市', freq: 85 },
  ],
  ja_N1: [
    { pattern: '〜いかんによらず', meaning: '不管…如何', example: '結果いかんによらず全力を尽くす', freq: 82 },
    { pattern: '〜ならではの', meaning: '只有…才有的', example: '日本ならではの文化', freq: 80 },
  ],
};

function getVocab(lang: string, level: string) {
  return EXAM_VOCAB[`${lang}_${level}`] ?? EXAM_VOCAB[`ja_N5`];
}
function getGrammar(lang: string, level: string) {
  return GRAMMAR_POINTS[`${lang}_${level}`] ?? GRAMMAR_POINTS[`ja_N5`];
}

// Fake quiz generator
function generateQuiz(vocab: typeof EXAM_VOCAB['ja_N5']) {
  const item = vocab[Math.floor(Math.random() * vocab.length)];
  const wrongs = vocab.filter((v) => v.meaning !== item.meaning).slice(0, 3).map((v) => v.meaning);
  const opts = [...wrongs, item.meaning].sort(() => Math.random() - 0.5);
  return { question: `「${item.word}」的意思是？`, answer: item.meaning, options: opts, word: item.word };
}

export const ExamTargetTab: React.FC<ExamTargetTabProps> = ({ sessionKey, languageCode, languageName }) => {
  const [targets, setTargets] = useState<ExamTarget[]>([]);
  const [userGoal, setUserGoal] = useState<UserGoal | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<ExamTarget | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [quizItem, setQuizItem] = useState<ReturnType<typeof generateQuiz> | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  const loadData = useCallback(async () => {
    const [targetsRes, goalRes] = await Promise.all([
      supabase.from('exam_targets').select('*').eq('lang_code', languageCode).eq('is_active', true).order('order_index'),
      supabase.from('user_exam_goals').select('*,exam_targets(*)').eq('session_key', sessionKey).eq('is_active', true).maybeSingle(),
    ]);
    const ts = (targetsRes.data ?? []) as ExamTarget[];
    setTargets(ts);
    if (goalRes.data) {
      setUserGoal(goalRes.data as UserGoal);
      const et = (goalRes.data as { exam_targets: ExamTarget }).exam_targets;
      setSelectedTarget(et);
    }
  }, [sessionKey, languageCode]);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  async function saveGoal(target: ExamTarget) {
    setSaving(true);
    if (userGoal) {
      await supabase.from('user_exam_goals').update({ exam_target_id: target.id, is_active: true }).eq('id', userGoal.id);
    } else {
      await supabase.from('user_exam_goals').insert({ session_key: sessionKey, exam_target_id: target.id });
    }
    setSelectedTarget(target);
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
    loadData();
  }

  function startQuiz() {
    const vocab = getVocab(languageCode, selectedTarget?.level_code ?? 'N5');
    setQuizItem(generateQuiz(vocab));
    setQuizAnswer(null);
  }

  function answerQuiz(ans: string) {
    setQuizAnswer(ans);
    if (quizItem && ans === quizItem.answer) setStreak((s) => s + 1);
    else setStreak(0);
    setTimeout(() => { setQuizItem(null); startQuiz(); }, 1200);
  }

  const vocab = selectedTarget ? getVocab(languageCode, selectedTarget.level_code) : [];
  const grammar = selectedTarget ? getGrammar(languageCode, selectedTarget.level_code) : [];

  if (loading) return <div className="gv-tab-loading">加载考试体系…</div>;

  return (
    <div className="et-wrap">
      {/* Goal selector */}
      <div className="et-goal-section">
        <h3 className="et-section-title">设定目标考试</h3>
        <div className="et-targets-grid">
          {targets.map((t) => (
            <button key={t.id}
              className={`et-target-btn ${selectedTarget?.id === t.id ? 'active' : ''}`}
              onClick={() => saveGoal(t)}
              disabled={saving}
            >
              {t.level_label}
            </button>
          ))}
        </div>
        {targets.length === 0 && <p className="et-no-targets">该语言暂无考试体系配置</p>}
        {savedMsg && <p className="et-saved">✓ 目标已保存！</p>}
      </div>

      {selectedTarget && (
        <>
          {/* Progress card */}
          <div className="et-progress-card">
            <div className="et-progress-top">
              <span className="et-progress-label">当前目标：{selectedTarget.level_label}</span>
              <span className="et-streak">🔥 连对 {streak} 题</span>
            </div>
            <div className="et-progress-bar-wrap">
              <div className="et-progress-fill" style={{ width: `${Math.min(streak * 10, 100)}%` }} />
            </div>
            <p className="et-progress-hint">连对10题解锁成就徽章</p>
          </div>

          {/* Quiz */}
          <div className="et-quiz-section">
            <div className="et-quiz-header">
              <h3 className="et-section-title">针对性模拟题</h3>
              <button className="et-quiz-start" onClick={startQuiz}>开始练习</button>
            </div>
            {quizItem && (
              <div className="et-quiz-card">
                <p className="et-quiz-q">{quizItem.question}</p>
                <div className="et-quiz-opts">
                  {quizItem.options.map((opt) => (
                    <button key={opt}
                      className={`et-quiz-opt ${quizAnswer === opt ? (opt === quizItem.answer ? 'correct' : 'wrong') : ''} ${quizAnswer && opt === quizItem.answer ? 'correct' : ''}`}
                      onClick={() => !quizAnswer && answerQuiz(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* High-freq vocab */}
          <div className="et-freq-section">
            <h3 className="et-section-title">高频词汇（按考试频率排序）</h3>
            <div className="et-vocab-list">
              {vocab.map((v) => (
                <div className="et-vocab-card" key={v.word}>
                  <div className="et-vocab-left">
                    <span className="et-vocab-word">{v.word}</span>
                    {v.reading && <span className="et-vocab-reading">{v.reading}</span>}
                    <span className="et-vocab-meaning">{v.meaning}</span>
                  </div>
                  <div className="et-vocab-right">
                    <span className="et-exam-tag">{v.examTag}</span>
                    <div className="et-freq-bar-wrap">
                      <div className="et-freq-fill" style={{ width: `${v.freq}%` }} />
                    </div>
                    <span className="et-freq-num">考频 {v.freq}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grammar points */}
          <div className="et-freq-section">
            <h3 className="et-section-title">核心语法点</h3>
            {grammar.map((g) => (
              <div className="et-grammar-card" key={g.pattern}>
                <div className="et-grammar-top">
                  <span className="et-grammar-pattern">{g.pattern}</span>
                  <div className="et-freq-bar-wrap small">
                    <div className="et-freq-fill" style={{ width: `${g.freq}%` }} />
                  </div>
                </div>
                <p className="et-grammar-meaning">{g.meaning}</p>
                <p className="et-grammar-example">{g.example}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
