import React, { useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { TaijiCompass } from './TaijiCompass';
import { UILang, UI_LANG_OPTIONS, setStoredUILang } from '../lib/i18n';

export type AgeGroup = 'primary' | 'secondary' | 'university' | 'professional';
export type InterestTag = 'anime' | 'gaming' | 'sports' | 'music' | 'tech' | 'food' | 'travel';
export type Profession = '' | 'finance' | 'medical' | 'tech' | 'law' | 'education' | 'travel';

export interface UserProfile {
  id?: string;
  session_key: string;
  language_code: string;
  ui_language?: UILang;
  goal: 'daily' | 'exam' | 'professional';
  level: 'beginner' | 'intermediate' | 'advanced';
  placement_score: number;
  completed_onboarding: boolean;
  age_group?: AgeGroup;
  interest_tags?: InterestTag[];
  profession?: Profession;
}

interface OnboardingProps {
  sessionKey: string;
  onComplete: (profile: UserProfile) => void;
}

const TARGET_LANGS = [
  { code: 'ja', flag: '🇯🇵', name: '日本語', sub: '日语' },
  { code: 'en', flag: '🇺🇸', name: 'English', sub: '英语' },
  { code: 'ko', flag: '🇰🇷', name: '한국어', sub: '韩语' },
  { code: 'fr', flag: '🇫🇷', name: 'Français', sub: '法语' },
  { code: 'es', flag: '🇪🇸', name: 'Español', sub: '西班牙语' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch', sub: '德语' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano', sub: '意大利语' },
  { code: 'pt', flag: '🇧🇷', name: 'Português', sub: '葡萄牙语' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية', sub: '阿拉伯语' },
  { code: 'zh', flag: '🇨🇳', name: '普通话进阶', sub: '中文进阶' },
];

const GOALS = [
  { key: 'daily',        icon: '✈️', title: '日常交流与旅游',  desc: '生存短语 · 旅游实战 · 日常对话' },
  { key: 'exam',         icon: '📜', title: '专业国际考级',    desc: 'JLPT · IELTS · DELF · TOPIK' },
  { key: 'professional', icon: '💼', title: '职场行业外语',    desc: '商务 · IT · 医疗 · 法律' },
];

const AGE_GROUPS = [
  { key: 'primary',      icon: '🎒', title: '小学生',   desc: '趣味游戏学语言' },
  { key: 'secondary',    icon: '📚', title: '中学生',   desc: '考级+兴趣两不误' },
  { key: 'university',   icon: '🎓', title: '大学生',   desc: '深度学习+出国准备' },
  { key: 'professional', icon: '💼', title: '职场人士', desc: '商务外语+效率优先' },
];

interface PlacementQ {
  type: 'choice' | 'audio' | 'pronunciation';
  q: string;
  opts: string[];
  ans: string;
  audioText?: string;
}

// 5 questions per language (mix of choice / audio / pronunciation)
const PLACEMENT_QS: Record<string, PlacementQ[]> = {
  ja: [
    { type: 'choice', q: '下面哪个日语词是"谢谢"？', opts: ['ありがとう', 'すみません', 'おはよう', 'さようなら'], ans: 'ありがとう' },
    { type: 'choice', q: '日语的"你好"怎么说？', opts: ['こんにちは', 'おやすみ', 'いただきます', 'ただいま'], ans: 'こんにちは' },
    { type: 'audio',  q: '听音频，选出听到的词', opts: ['ありがとう', 'さようなら', 'おはよう', 'こんばんは'], ans: 'ありがとう', audioText: 'ありがとう' },
    { type: 'choice', q: '"〜てもいいですか"用于？', opts: ['请求许可', '否定拒绝', '表达愤怒', '询问价格'], ans: '请求许可' },
    { type: 'pronunciation', q: '跟读练习', opts: ['ありがとうございます'], ans: 'ありがとうございます', audioText: 'ありがとうございます' },
  ],
  en: [
    { type: 'choice', q: '"Thank you"是什么意思？', opts: ['谢谢', '你好', '再见', '对不起'], ans: '谢谢' },
    { type: 'choice', q: '"Excuse me"通常用于？', opts: ['礼貌打招呼或道歉', '表达愤怒', '点餐时喊服务员', '以上都错'], ans: '礼貌打招呼或道歉' },
    { type: 'audio',  q: '听音频，选出听到的句子', opts: ['How are you?', 'Where are you from?', 'What time is it?', 'How much is this?'], ans: 'How are you?', audioText: 'How are you?' },
    { type: 'choice', q: 'Present continuous用于？', opts: ['正在进行的动作', '过去发生的事', '将来的计划', '习惯性动作'], ans: '正在进行的动作' },
    { type: 'pronunciation', q: '跟读练习', opts: ['Nice to meet you'], ans: 'Nice to meet you', audioText: 'Nice to meet you' },
  ],
  ko: [
    { type: 'choice', q: '哪个韩语词是"谢谢"？', opts: ['감사합니다', '안녕하세요', '죄송합니다', '잘 먹겠습니다'], ans: '감사합니다' },
    { type: 'choice', q: '"화장실이 어디에요?"是什么意思？', opts: ['厕所在哪里？', '多少钱？', '你好吗？', '这个怎么做？'], ans: '厕所在哪里？' },
    { type: 'audio',  q: '听音频，选出听到的词', opts: ['감사합니다', '안녕하세요', '죄송합니다', '어디예요'], ans: '감사합니다', audioText: '감사합니다' },
    { type: 'choice', q: '"맛있어요"是什么意思？', opts: ['很好吃', '很贵', '好的', '谢谢'], ans: '很好吃' },
    { type: 'pronunciation', q: '跟读练习', opts: ['안녕하세요'], ans: '안녕하세요', audioText: '안녕하세요' },
  ],
  fr: [
    { type: 'choice', q: '"Merci beaucoup"是什么意思？', opts: ['非常感谢', '你好', '再见', '对不起'], ans: '非常感谢' },
    { type: 'choice', q: '"Où sont les toilettes?"是什么意思？', opts: ['厕所在哪里？', '多少钱？', '车站怎么走？', '几点了？'], ans: '厕所在哪里？' },
    { type: 'audio',  q: '听音频，选出听到的词', opts: ['Bonjour', 'Au revoir', 'Merci', 'Pardon'], ans: 'Bonjour', audioText: 'Bonjour' },
    { type: 'choice', q: '"Je voudrais"这个短语用于？', opts: ['礼貌地表达想要', '否定', '疑问', '命令'], ans: '礼貌地表达想要' },
    { type: 'pronunciation', q: '跟读练习', opts: ['Bonjour, comment allez-vous?'], ans: 'Bonjour, comment allez-vous?', audioText: 'Bonjour, comment allez-vous?' },
  ],
  es: [
    { type: 'choice', q: '"Muchas gracias"是什么意思？', opts: ['非常感谢', '你好', '对不起', '再见'], ans: '非常感谢' },
    { type: 'choice', q: '"¿Dónde está el baño?"是什么意思？', opts: ['厕所在哪里？', '多少钱？', '你叫什么名字？', '车站在哪里？'], ans: '厕所在哪里？' },
    { type: 'audio',  q: '听音频，选出听到的词', opts: ['Hola', 'Gracias', 'Perdón', 'Adiós'], ans: 'Hola', audioText: 'Hola' },
    { type: 'choice', q: '"¿Hablas español?"是什么意思？', opts: ['你说西班牙语吗？', '你去西班牙吗？', '你学西班牙语吗？', '西班牙语怎么说？'], ans: '你说西班牙语吗？' },
    { type: 'pronunciation', q: '跟读练习', opts: ['Hola, ¿cómo estás?'], ans: 'Hola, ¿cómo estás?', audioText: 'Hola, ¿cómo estás?' },
  ],
  de: [
    { type: 'choice', q: '"Danke schön"是什么意思？', opts: ['非常感谢', '你好', '再见', '没关系'], ans: '非常感谢' },
    { type: 'choice', q: '"Wo ist die Toilette?"是什么意思？', opts: ['厕所在哪里？', '火车站在哪里？', '多少钱？', '请再说一遍'], ans: '厕所在哪里？' },
    { type: 'audio',  q: '听音频，选出听到的词', opts: ['Hallo', 'Danke', 'Bitte', 'Entschuldigung'], ans: 'Hallo', audioText: 'Hallo' },
    { type: 'choice', q: '"Ich möchte"这个短语用于？', opts: ['礼貌地表达想要', '询问方向', '表示感谢', '否定'], ans: '礼貌地表达想要' },
    { type: 'pronunciation', q: '跟读练习', opts: ['Guten Morgen'], ans: 'Guten Morgen', audioText: 'Guten Morgen' },
  ],
  it: [
    { type: 'choice', q: '"Grazie mille"是什么意思？', opts: ['非常感谢', '你好', '再见', '抱歉'], ans: '非常感谢' },
    { type: 'choice', q: '"Dov\'è il bagno?"是什么意思？', opts: ['厕所在哪里？', '多少钱？', '出口在哪里？', '几点了？'], ans: '厕所在哪里？' },
    { type: 'audio',  q: '听音频，选出听到的词', opts: ['Ciao', 'Grazie', 'Prego', 'Scusa'], ans: 'Ciao', audioText: 'Ciao' },
    { type: 'choice', q: '"Vorrei"这个词用于？', opts: ['礼貌地表达想要', '询问价格', '打招呼', '道别'], ans: '礼貌地表达想要' },
    { type: 'pronunciation', q: '跟读练习', opts: ['Buongiorno'], ans: 'Buongiorno', audioText: 'Buongiorno' },
  ],
  pt: [
    { type: 'choice', q: '"Muito obrigado"是什么意思？', opts: ['非常感谢', '你好', '再见', '打扰了'], ans: '非常感谢' },
    { type: 'choice', q: '"Onde fica o banheiro?"是什么意思？', opts: ['厕所在哪里？', '多少钱？', '怎么走？', '请问现在几点？'], ans: '厕所在哪里？' },
    { type: 'audio',  q: '听音频，选出听到的词', opts: ['Olá', 'Obrigado', 'Desculpe', 'Tchau'], ans: 'Olá', audioText: 'Olá' },
    { type: 'choice', q: '"Por favor"用于？', opts: ['礼貌请求', '感谢', '道歉', '再见'], ans: '礼貌请求' },
    { type: 'pronunciation', q: '跟读练习', opts: ['Bom dia'], ans: 'Bom dia', audioText: 'Bom dia' },
  ],
  ar: [
    { type: 'choice', q: '"شكراً جزيلاً"是什么意思？', opts: ['非常感谢', '你好', '再见', '不客气'], ans: '非常感谢' },
    { type: 'choice', q: '"أين الحمام؟"是什么意思？', opts: ['厕所在哪里？', '多少钱？', '医院怎么走？', '你好吗？'], ans: '厕所在哪里？' },
    { type: 'audio',  q: '听音频，选出听到的词', opts: ['مرحبا', 'شكراً', 'عفواً', 'من فضلك'], ans: 'مرحبا', audioText: 'مرحبا' },
    { type: 'choice', q: '"أنا طالب"是什么意思？', opts: ['我是学生', '我有书', '我去学校', '我喜欢学习'], ans: '我是学生' },
    { type: 'pronunciation', q: '跟读练习', opts: ['مرحبا'], ans: 'مرحبا', audioText: 'مرحبا' },
  ],
  zh: [
    { type: 'choice', q: '"请问"通常用于？', opts: ['礼貌提问', '表示愤怒', '打招呼告别', '以上都错'], ans: '礼貌提问' },
    { type: 'choice', q: '"把"字句的基本语序是？', opts: ['主语+把+宾语+动词', '主语+动词+把+宾语', '把+主语+动词+宾语', '宾语+把+主语+动词'], ans: '主语+把+宾语+动词' },
    { type: 'audio',  q: '听音频，选出听到的词', opts: ['谢谢', '你好', '再见', '对不起'], ans: '谢谢', audioText: '谢谢' },
    { type: 'choice', q: '普通话有几个声调？', opts: ['4个声调+轻声', '3个声调', '5个声调', '2个声调'], ans: '4个声调+轻声' },
    { type: 'pronunciation', q: '跟读练习', opts: ['你好，很高兴认识你'], ans: '你好，很高兴认识你', audioText: '你好，很高兴认识你' },
  ],
};

const LEVEL_CONFIG = {
  beginner:     { icon: '🌱', label: '零基础 / 初级', color: '#7A9B71', paths: ['✅ 生存短语 · 日常打招呼', '✅ 核心500词汇', '✅ 基础句型图解', '🔒 考试专区（解锁后开放）'] },
  intermediate: { icon: '🌿', label: '进阶学习者',    color: '#C9A574', paths: ['✅ 高阶语法精讲', '✅ 行业专项词汇', '✅ 阅读理解训练', '✅ 模拟题专项练习'] },
  advanced:     { icon: '🎋', label: '高级学习者',    color: '#C9553D', paths: ['✅ 全真模拟考试', '✅ 高阶语法深挖', '✅ 商务与学术写作', '✅ 母语级内容精读'] },
};

const LANG_SR_CODE: Record<string, string> = {
  ja: 'ja-JP', ko: 'ko-KR', fr: 'fr-FR', es: 'es-ES',
  de: 'de-DE', it: 'it-IT', pt: 'pt-BR', ar: 'ar-SA', zh: 'zh-CN', en: 'en-US',
};

// Step 1 of 5 → 5 of 5
type Step = 1 | 2 | 3 | 4 | 5 | 'result';
const TOTAL_STEPS = 5;

/* ─────────────────────────────────── step bar ── */
function StepBar({ current }: { current: number }) {
  return (
    <div className="ob-step-bar">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`ob-step-seg ${i + 1 < current ? 'done' : i + 1 === current ? 'active' : ''}`}
        />
      ))}
    </div>
  );
}

export const Onboarding: React.FC<OnboardingProps> = ({ sessionKey, onComplete }) => {
  const [step, setStep]             = useState<Step>(1);
  const [uiLang, setUILangState]    = useState<UILang>('zh');
  const [targetLang, setTargetLang] = useState('ja');
  const [goal, setGoal]             = useState<'daily' | 'exam' | 'professional'>('daily');
  const [ageGroup, setAgeGroup]     = useState<AgeGroup>('university');
  const [answers, setAnswers]       = useState<string[]>(Array(5).fill(''));
  const [saving, setSaving]         = useState(false);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [pronRecording, setPronRecording] = useState<number | null>(null);
  const [pronResult, setPronResult] = useState<Record<number, 'ok' | 'fail'>>({});
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const langInfo = TARGET_LANGS.find((l) => l.code === targetLang) ?? TARGET_LANGS[0];
  const qs       = PLACEMENT_QS[targetLang] ?? PLACEMENT_QS.ja;

  const playAudio = useCallback((text: string, qi: number) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setPlayingAudio(qi);
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = LANG_SR_CODE[targetLang] ?? 'zh-CN';
    utt.rate = 0.9;
    utt.onend = () => setPlayingAudio(null);
    utt.onerror = () => setPlayingAudio(null);
    window.speechSynthesis.speak(utt);
  }, [targetLang]);

  const startPronunciation = useCallback((audioText: string, qi: number) => {
    const SpeechRecognitionAPI =
      (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      || (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      const next = [...answers]; next[qi] = audioText; setAnswers(next);
      setPronResult((r) => ({ ...r, [qi]: 'ok' }));
      return;
    }
    setPronRecording(qi);
    const rec = new SpeechRecognitionAPI();
    rec.lang = LANG_SR_CODE[targetLang] ?? 'zh-CN';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript ?? '';
      const ref = audioText.toLowerCase().replace(/[，。？！,.?!]/g, '');
      const words = ref.split(/\s+/).filter((w) => w.length > 1);
      const matched = words.filter((w) => transcript.toLowerCase().includes(w)).length;
      const ok = matched / Math.max(words.length, 1) >= 0.4;
      const next = [...answers]; next[qi] = ok ? audioText : ''; setAnswers(next);
      setPronResult((r) => ({ ...r, [qi]: ok ? 'ok' : 'fail' }));
    };
    rec.onend  = () => setPronRecording(null);
    rec.onerror = () => setPronRecording(null);
    recognitionRef.current = rec;
    rec.start();
  }, [targetLang, answers]);

  const allAnswered = answers.every((a, i) => {
    const q = qs[i];
    if (q.type === 'pronunciation') return pronResult[i] !== undefined || a !== '';
    return a !== '';
  });

  const score    = answers.reduce((s, a, i) => s + (a === qs[i]?.ans ? 3 : a !== '' ? 1 : 0), 0);
  const maxScore = qs.length * 3;
  const level: 'beginner' | 'intermediate' | 'advanced' =
    score <= maxScore * 0.35 ? 'beginner' : score <= maxScore * 0.65 ? 'intermediate' : 'advanced';

  async function saveProfile(lvl: 'beginner' | 'intermediate' | 'advanced', sc: number) {
    setSaving(true);
    setStoredUILang(uiLang);
    const profile: UserProfile = {
      session_key: sessionKey,
      language_code: targetLang,
      ui_language: uiLang,
      goal,
      level: lvl,
      placement_score: sc,
      completed_onboarding: true,
      age_group: ageGroup,
      interest_tags: [],
      profession: goal === 'professional' ? 'tech' : '',
    };
    const { data } = await supabase.from('user_profiles').insert(profile).select().maybeSingle();
    setSaving(false);
    onComplete({ ...profile, id: data?.id });
  }

  /* ══════════════════════════════════════════════════════
     STEP 1 — Native language
  ══════════════════════════════════════════════════════ */
  if (step === 1) {
    return (
      <div className="ob-fullscreen">
        <div className="ob-inner">
          <div className="ob-brand-row">
            <TaijiCompass size={40} />
            <span className="ob-brand-text">言道</span>
          </div>
          <StepBar current={1} />

          <div className="ob-step-heading">
            <h1 className="ob-heading">欢迎 · Welcome · ようこそ</h1>
            <p className="ob-subheading">选择你的母语 / Choose your native language</p>
          </div>

          <div className="ob-native-grid">
            {UI_LANG_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                className={`ob-native-card ${uiLang === opt.code ? 'selected' : ''}`}
                onClick={() => setUILangState(opt.code)}
              >
                <span className="ob-native-card-label">{opt.native}</span>
                {uiLang === opt.code && <span className="ob-native-card-check">✓</span>}
              </button>
            ))}
          </div>

          <button className="ob-btn-primary" onClick={() => setStep(2)}>
            {uiLang === 'zh' ? '确认，继续 →' :
             uiLang === 'en' ? 'Confirm & Continue →' :
             uiLang === 'ja' ? '確認して続ける →' :
             uiLang === 'ko' ? '확인 후 계속 →' :
             uiLang === 'fr' ? 'Confirmer et continuer →' :
             uiLang === 'es' ? 'Confirmar y continuar →' :
             'Bestätigen und weiter →'}
          </button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     STEP 2 — Target language
  ══════════════════════════════════════════════════════ */
  if (step === 2) {
    return (
      <div className="ob-fullscreen">
        <div className="ob-inner">
          <div className="ob-brand-row">
            <TaijiCompass size={40} />
            <span className="ob-brand-text">言道</span>
          </div>
          <StepBar current={2} />

          <div className="ob-step-heading">
            <h1 className="ob-heading">我想学习的语言</h1>
            <p className="ob-subheading">10 种语言，一个平台搞定</p>
          </div>

          <div className="ob-lang-grid">
            {TARGET_LANGS.map((l) => (
              <button
                key={l.code}
                className={`ob-lang-tile ${targetLang === l.code ? 'selected' : ''}`}
                onClick={() => setTargetLang(l.code)}
              >
                <span className="ob-lang-tile-flag">{l.flag}</span>
                <span className="ob-lang-tile-name">{l.name}</span>
                <span className="ob-lang-tile-sub">{l.sub}</span>
                {targetLang === l.code && <span className="ob-lang-tile-check">✓</span>}
              </button>
            ))}
          </div>

          <button className="ob-btn-primary" onClick={() => setStep(3)}>
            已选 {langInfo.flag} {langInfo.sub}，继续 →
          </button>
          <button className="ob-btn-ghost" onClick={() => setStep(1)}>← 返回</button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     STEP 3 — Learning goal
  ══════════════════════════════════════════════════════ */
  if (step === 3) {
    return (
      <div className="ob-fullscreen">
        <div className="ob-inner">
          <div className="ob-brand-row">
            <TaijiCompass size={40} />
            <span className="ob-brand-text">言道</span>
          </div>
          <StepBar current={3} />

          <div className="ob-step-heading">
            <span className="ob-lang-badge">{langInfo.flag} {langInfo.sub}</span>
            <h1 className="ob-heading">学习目标是什么？</h1>
          </div>

          <div className="ob-choice-list">
            {GOALS.map((g) => (
              <button
                key={g.key}
                className={`ob-choice-card ${goal === g.key ? 'selected' : ''}`}
                onClick={() => setGoal(g.key as typeof goal)}
              >
                <span className="ob-choice-icon">{g.icon}</span>
                <div className="ob-choice-text">
                  <span className="ob-choice-title">{g.title}</span>
                  <span className="ob-choice-desc">{g.desc}</span>
                </div>
                <span className={`ob-choice-check ${goal === g.key ? 'visible' : ''}`}>✓</span>
              </button>
            ))}
          </div>

          <button className="ob-btn-primary" onClick={() => setStep(4)}>继续 →</button>
          <button className="ob-btn-ghost" onClick={() => setStep(2)}>← 返回</button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     STEP 4 — Age group
  ══════════════════════════════════════════════════════ */
  if (step === 4) {
    return (
      <div className="ob-fullscreen">
        <div className="ob-inner">
          <div className="ob-brand-row">
            <TaijiCompass size={40} />
            <span className="ob-brand-text">言道</span>
          </div>
          <StepBar current={4} />

          <div className="ob-step-heading">
            <span className="ob-lang-badge">{langInfo.flag} {langInfo.sub}</span>
            <h1 className="ob-heading">你属于哪个年龄段？</h1>
            <p className="ob-subheading">帮助我们定制最适合的学习风格</p>
          </div>

          <div className="ob-choice-list">
            {AGE_GROUPS.map((a) => (
              <button
                key={a.key}
                className={`ob-choice-card ${ageGroup === a.key ? 'selected' : ''}`}
                onClick={() => setAgeGroup(a.key as AgeGroup)}
              >
                <span className="ob-choice-icon">{a.icon}</span>
                <div className="ob-choice-text">
                  <span className="ob-choice-title">{a.title}</span>
                  <span className="ob-choice-desc">{a.desc}</span>
                </div>
                <span className={`ob-choice-check ${ageGroup === a.key ? 'visible' : ''}`}>✓</span>
              </button>
            ))}
          </div>

          <button className="ob-btn-primary" onClick={() => setStep(5)}>继续 →</button>
          <button className="ob-btn-ghost" onClick={() => setStep(3)}>← 返回</button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     STEP 5 — Placement test (5 questions)
  ══════════════════════════════════════════════════════ */
  if (step === 5) {
    const answeredCount = answers.filter((a, i) => a !== '' || pronResult[i] !== undefined).length;
    return (
      <div className="ob-fullscreen">
        <div className="ob-inner ob-inner-wide">
          <div className="ob-brand-row">
            <TaijiCompass size={40} />
            <span className="ob-brand-text">言道</span>
          </div>
          <StepBar current={5} />

          <div className="ob-step-heading">
            <span className="ob-lang-badge">{langInfo.flag} {langInfo.sub}</span>
            <h1 className="ob-heading">快速定级测试</h1>
            <p className="ob-subheading">
              5道小题 · 含听力题与跟读 · 已完成 {answeredCount}/{qs.length}
            </p>
          </div>

          <div className="ob-questions">
            {qs.map((q, qi) => (
              <div key={qi} className="ob-question">
                <div className="ob-q-header">
                  <span className="ob-q-num">{qi + 1}</span>
                  <span className={`ob-q-badge ob-q-badge-${q.type}`}>
                    {q.type === 'choice' ? '选择题' : q.type === 'audio' ? '🔊 听力题' : '🎙️ 跟读题'}
                  </span>
                </div>
                <p className="ob-q-text">{q.q}</p>

                {(q.type === 'audio' || q.type === 'pronunciation') && q.audioText && (
                  <button
                    className={`ob-audio-btn ${playingAudio === qi ? 'playing' : ''}`}
                    onClick={() => playAudio(q.audioText!, qi)}
                    disabled={playingAudio === qi}
                  >
                    {playingAudio === qi ? '▶ 播放中…' : '▶ 播放音频'}
                  </button>
                )}

                {q.type === 'pronunciation' ? (
                  <div className="ob-pron-area">
                    <p className="ob-pron-ref">参考句：<strong>{q.opts[0]}</strong></p>
                    <button
                      className={`ob-pron-btn ${pronRecording === qi ? 'recording' : ''}`}
                      onClick={() =>
                        pronRecording === qi
                          ? recognitionRef.current?.stop()
                          : startPronunciation(q.opts[0], qi)
                      }
                    >
                      {pronRecording === qi ? '🔴 录音中… 点击停止' : '🎙️ 点击朗读'}
                    </button>
                    {pronResult[qi] !== undefined && (
                      <div className={`ob-pron-result ${pronResult[qi] === 'ok' ? 'ok' : 'fail'}`}>
                        {pronResult[qi] === 'ok' ? '✓ 发音良好！' : '× 再试一次（或跳过）'}
                      </div>
                    )}
                    {pronResult[qi] === 'fail' && (
                      <button
                        className="ob-pron-skip"
                        onClick={() => {
                          const next = [...answers]; next[qi] = '__skipped__'; setAnswers(next);
                        }}
                      >
                        跳过此题
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="ob-options">
                    {q.opts.map((opt) => (
                      <button
                        key={opt}
                        className={`ob-option ${answers[qi] === opt ? 'selected' : ''}`}
                        onClick={() => { const next = [...answers]; next[qi] = opt; setAnswers(next); }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            className="ob-btn-primary"
            disabled={!allAnswered}
            onClick={() => setStep('result')}
          >
            查看我的水平 →
          </button>
          <button className="ob-btn-ghost" onClick={() => setStep(4)}>← 返回</button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     RESULT
  ══════════════════════════════════════════════════════ */
  const lc = LEVEL_CONFIG[level];
  const correctCount = answers.filter((a, i) => a === qs[i]?.ans).length;
  return (
    <div className="ob-fullscreen">
      <div className="ob-inner">
        <div className="ob-brand-row">
          <TaijiCompass size={40} />
          <span className="ob-brand-text">言道</span>
        </div>

        <div className="ob-result-hero">
          <div className="ob-result-rings">
            <div className="ob-result-ring r1" />
            <div className="ob-result-ring r2" />
          </div>
          <div className="ob-result-center">
            <span className="ob-result-icon">{lc.icon}</span>
          </div>
        </div>

        <div className="ob-result-info">
          <h2 className="ob-result-level" style={{ color: lc.color }}>{lc.label}</h2>
          <p className="ob-result-score">答对 {correctCount} / {qs.length} 题</p>
          <p className="ob-result-lang">{langInfo.flag} {langInfo.sub} 专属学习路线已就绪</p>
        </div>

        <div className="ob-result-path">
          <h3 className="ob-result-path-title">为你推荐的学习路线</h3>
          <ul className="ob-path-list">
            {lc.paths.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>

        <button className="ob-btn-primary" disabled={saving} onClick={() => saveProfile(level, score)}>
          {saving ? '保存中…' : '立即开始学习 →'}
        </button>
      </div>
    </div>
  );
};
