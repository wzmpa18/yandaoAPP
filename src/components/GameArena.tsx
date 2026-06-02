import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FloatingBack } from './FloatingBack';
import { Confetti } from './Confetti';
import dynamicContent from '../data/dynamic_content.json';
import { useAudio } from '../lib/useAudio';
import { WordHunter } from './games/WordHunter';
import { GrammarCube } from './games/GrammarCube';
import { EscapeRoom } from './games/EscapeRoom';
import { GrammarPlanet } from './games/GrammarPlanet';
import { BuddyChat } from './games/BuddyChat';
import { SeasonRanking } from './SeasonRanking';
import { InfiniteGameGenerator } from '../lib/InfiniteGameGenerator';

// Merge dynamic vocab pairs for each language
const _dynVocab: Record<string, Array<[string, string]>> = {};
(dynamicContent.vocab_pairs as Array<{ lang: string; zh: string; target: string }>).forEach((item) => {
  if (!_dynVocab[item.lang]) _dynVocab[item.lang] = [];
  _dynVocab[item.lang].push([item.zh, item.target]);
});

// Merge dynamic puzzles for each language
const _dynPuzzles: Record<string, Array<{ words: string[]; answer: string[]; zh: string }>> = {};
(dynamicContent.sentence_puzzles as Array<{ lang: string; words: string[]; answer: string[]; zh: string }>).forEach((p) => {
  if (!_dynPuzzles[p.lang]) _dynPuzzles[p.lang] = [];
  _dynPuzzles[p.lang].push({ words: p.words, answer: p.answer, zh: p.zh });
});

interface GameArenaProps {
  languageCode: string;
  languageName: string;
  hearts: number;
  sessionKey?: string;
  onHeartLost: () => void;
  onXP: (delta: number) => void;
  onBack: () => void;
}

type Vibe = 'pure' | 'flirt';

/* ── vocab pairs ── */
const VOCAB_DATA: Record<string, Array<[string, string]>> = {
  ja: [['你好','こんにちは'],['谢谢','ありがとう'],['对不起','すみません'],['再见','さようなら'],['水','みず'],['美味','おいしい'],['好的','はい'],['不行','だめ']],
  en: [['你好','Hello'],['谢谢','Thank you'],['对不起','Sorry'],['再见','Goodbye'],['水','Water'],['美味','Delicious'],['好的','OK'],['不行','No way']],
  ko: [['你好','안녕하세요'],['谢谢','감사합니다'],['对不起','죄송합니다'],['再见','안녕히 가세요'],['水','물'],['美味','맛있어요'],['好的','네'],['不行','안돼요']],
  fr: [['你好','Bonjour'],['谢谢','Merci'],['对不起','Pardon'],['再见','Au revoir'],['水','Eau'],['美味','Délicieux'],['好的','D\'accord'],['不行','Non']],
  es: [['你好','Hola'],['谢谢','Gracias'],['对不起','Perdón'],['再见','Adiós'],['水','Agua'],['美味','Delicioso'],['好的','Vale'],['不行','No']],
  de: [['你好','Hallo'],['谢谢','Danke'],['对不起','Entschuldigung'],['再见','Tschüss'],['水','Wasser'],['美味','Lecker'],['好的','Okay'],['不行','Nein']],
  it: [['你好','Ciao'],['谢谢','Grazie'],['对不起','Scusa'],['再见','Arrivederci'],['水','Acqua'],['美味','Delizioso'],['好的','Va bene'],['不行','No']],
  pt: [['你好','Olá'],['谢谢','Obrigado'],['对不起','Desculpe'],['再见','Tchau'],['水','Água'],['美味','Delicioso'],['好的','Tudo bem'],['不行','Não']],
  ar: [['你好','مرحبا'],['谢谢','شكراً'],['对不起','آسف'],['再见','مع السلامة'],['水','ماء'],['美味','لذيذ'],['好的','حسنا'],['不行','لا']],
  zh: [['Hello','你好'],['Thank you','谢谢'],['Sorry','对不起'],['Goodbye','再见'],['Water','水'],['Delicious','美味'],['OK','好的'],['No way','不行']],
};

/* ── sentence puzzles ── */
const PUZZLES: Record<string, Array<{ words: string[]; answer: string[]; zh: string }>> = {
  ja: [
    { words: ['私','は','学生','です','。'], answer: ['私','は','学生','です','。'], zh: '我是学生。' },
    { words: ['どこ','トイレ','は','ですか','？'], answer: ['トイレ','は','どこ','ですか','？'], zh: '厕所在哪里？' },
    { words: ['食べ','ます','ラーメン','を','私は'], answer: ['私は','ラーメン','を','食べ','ます'], zh: '我吃拉面。' },
  ],
  en: [
    { words: ['Where','the','is','toilet','?'], answer: ['Where','is','the','toilet','?'], zh: '厕所在哪里？' },
    { words: ['I','student','a','am','.'], answer: ['I','am','a','student','.'], zh: '我是学生。' },
    { words: ['much','How','this','is','?'], answer: ['How','much','is','this','?'], zh: '这个多少钱？' },
  ],
  ko: [
    { words: ['어디에','화장실이','있어요','?'], answer: ['화장실이','어디에','있어요','?'], zh: '厕所在哪里？' },
    { words: ['학생','나는','이에요','.'], answer: ['나는','학생','이에요','.'], zh: '我是学生。' },
  ],
  fr: [
    { words: ['les','Où','toilettes','sont','?'], answer: ['Où','sont','les','toilettes','?'], zh: '厕所在哪里？' },
    { words: ['suis','Je','étudiant','un','.'], answer: ['Je','suis','un','étudiant','.'], zh: '我是学生。' },
  ],
  es: [
    { words: ['están','Dónde','baños','los','?'], answer: ['Dónde','están','los','baños','?'], zh: '厕所在哪里？' },
    { words: ['soy','Yo','estudiante','un','.'], answer: ['Yo','soy','un','estudiante','.'], zh: '我是学生。' },
  ],
  de: [
    { words: ['die','Wo','Toilette','ist','?'], answer: ['Wo','ist','die','Toilette','?'], zh: '厕所在哪里？' },
    { words: ['bin','Ich','Student','ein','.'], answer: ['Ich','bin','ein','Student','.'], zh: '我是学生。' },
  ],
  default: [
    { words: ['Hello',',','world','!'], answer: ['Hello',',','world','!'], zh: '你好，世界！' },
  ],
};

/* ── Master tips ── */
const TIPS: Record<string, { title: string; body: string }> = {
  ja: { title: '💡 大咖窍门 · 日语', body: '日语句子结构跟中文相反，动词永远在最后！\n例：我（私は）拉面（ラーメンを）吃（食べます）\n先找动词，消消乐事半功倍！' },
  en: { title: '💡 大咖窍门 · 英语', body: '英语语序是"主语→动词→宾语"，\n跟中文一样！\n关键：第三人称单数动词加 -s，别忘了！' },
  ko: { title: '💡 大咖窍门 · 韩语', body: '韩语和日语一样，动词在最后！\n而且有"敬语尾（요）"，加上就礼貌了。\n记住：助词"은/는"=是，"이/가"=主语标记' },
  fr: { title: '💡 大咖窍门 · 法语', body: '法语名词有阴阳性！\n男性用 le/un，女性用 la/une。\n记单词时一定要连着冠词一起背！' },
  es: { title: '💡 大咖窍门 · 西班牙语', body: '西班牙语动词变位超多，但有规律！\n-ar结尾：hablar（说话）\n我说 hablo，你说 hablas，他说 habla' },
  de: { title: '💡 大咖窍门 · 德语', body: '德语有4个格（主/宾/与格/所有格）！\n先搞定"der/die/das"（阳/阴/中性），\n动词第二位法则：V2 语序是核心！' },
  it: { title: '💡 大咖窍门 · 意大利语', body: '意大利语音调超美！名词-o结尾多为男性，-a结尾多为女性。\n动词变位跟西班牙语很像，学了一门赚到了！' },
  pt: { title: '💡 大咖窍门 · 葡萄牙语', body: '巴西葡语和葡萄牙葡语有区别！\n巴西更接近西班牙语，更容易上手。\n重音在倒数第二音节，读起来很有节奏感！' },
  ar: { title: '💡 大咖窍门 · 阿拉伯语', body: '阿拉伯语从右往左读！\n动词通常放在句首（VSO语序）。\n三个辅音字母根（词根）是整个词汇系统的核心！' },
  zh: { title: '💡 大咖窍门 · 中文进阶', body: '"把"字句是外国人最难的！\n结构：主语 + 把 + 宾语 + 动词 + 其他\n例：我把书放在桌上。（动词必须带补语！）' },
};

/* ── Vibe feedback messages ── */
interface VibeFeedback { emoji: string; title: string; body: string }

const FEEDBACK: Record<Vibe, { correct: VibeFeedback[]; wrong: VibeFeedback[] }> = {
  pure: {
    correct: [
      { emoji: '🐱', title: '针不戳！', body: '智商占领高地了！猫猫为你骄傲～' },
      { emoji: '🎉', title: '满分宝贝！', body: '你是班里最靓的那颗星！' },
      { emoji: '🏆', title: '太强了！', body: '继续！本喵看好你哦～' },
    ],
    wrong: [
      { emoji: '🐕', title: '大意了没有闪！', body: '柴犬已流泪，快跟本喵大声朗读正确答案！' },
      { emoji: '😹', title: '哎呀这道题！', body: '没关系，失败是成功它妈！再来！' },
      { emoji: '🙈', title: '啊这...', body: '猴子捂眼了，要不要再想想？' },
    ],
  },
  flirt: {
    correct: [
      { emoji: '😏', title: '哎哟不错哦～', body: '看来你除了长得好看，脑子也挺好使的嘛❤️' },
      { emoji: '🥰', title: '果然是我看上的人！', body: '太聪明了，让人怎么不喜欢呢～' },
      { emoji: '😉', title: '早就猜到你会的！', body: '你这家伙，总是让我刮目相看～ 继续！' },
    ],
    wrong: [
      { emoji: '😤', title: '笨蛋！', body: '这都能选错？罚你大声朗读正确答案三遍，不然今晚不理你了哼！💢' },
      { emoji: '🙄', title: '无语子...', body: '我就知道你不会，所以才陪你练嘛～ 快看正确答案！' },
      { emoji: '😒', title: '你这人啊～', body: '再错一次我可真生气了，正确答案在这里，仔细看清楚！💢' },
    ],
  },
};

const LANG_BCP: Record<string, string> = {
  ja: 'ja-JP', fr: 'fr-FR', ko: 'ko-KR', es: 'es-ES',
  en: 'en-US', de: 'de-DE', it: 'it-IT', pt: 'pt-BR',
  zh: 'zh-CN', ar: 'ar-SA',
};

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }
function pickVocab(lang: string, n = 4): Array<[string, string]> {
  const staticPairs = VOCAB_DATA[lang] || VOCAB_DATA.ja;
  const dynPairs = _dynVocab[lang] || [];
  const merged = [...staticPairs, ...dynPairs.filter(p => !staticPairs.some(s => s[0] === p[0]))];
  return shuffle(merged).slice(0, n);
}
function pickPuzzle(lang: string) {
  const staticPool = PUZZLES[lang] || PUZZLES.default;
  const dynPool = _dynPuzzles[lang] || [];
  const pool = [...staticPool, ...dynPool];
  return pool[Math.floor(Math.random() * pool.length)];
}
function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

/* ── XP float ── */
interface XPFloat { id: number; x: number; y: number }

/* ── Feedback modal ── */
interface FeedbackModalProps {
  fb: VibeFeedback;
  correct: boolean;
  answer: string;
  lang: string;
  onClose: () => void;
}
const FeedbackModal: React.FC<FeedbackModalProps> = ({ fb, correct, answer, lang, onClose }) => {
  useEffect(() => {
    // Auto speak the answer on wrong
    if (!correct && answer && window.speechSynthesis) {
      const utt = new SpeechSynthesisUtterance(answer);
      utt.lang = LANG_BCP[lang] || 'en-US';
      utt.rate = 0.8;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utt);
    }
    const t = setTimeout(onClose, 2800);
    return () => { clearTimeout(t); window.speechSynthesis?.cancel(); };
  }, [correct, answer, lang, onClose]);

  return (
    <div className="fb-overlay" onClick={onClose}>
      <div className={`fb-modal ${correct ? 'fb-ok' : 'fb-err'}`}>
        <div className="fb-emoji">{fb.emoji}</div>
        <p className="fb-title">{fb.title}</p>
        <p className="fb-body">{fb.body}</p>
        {!correct && answer && (
          <div className="fb-answer-reveal">
            <span className="fb-answer-label">正确答案</span>
            <span className="fb-answer-val">{answer}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Tip Modal ── */
interface TipModalProps { tip: { title: string; body: string }; onClose: () => void }
const TipModal: React.FC<TipModalProps> = ({ tip, onClose }) => {
  const [countdown, setCountdown] = useState(10);
  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => { if (c <= 1) { clearInterval(t); onClose(); return 0; } return c - 1; }), 1000);
    return () => clearInterval(t);
  }, [onClose]);

  return (
    <div className="tip-overlay">
      <div className="tip-modal">
        <h3 className="tip-title">{tip.title}</h3>
        <p className="tip-body">{tip.body}</p>
        <div className="tip-footer">
          <div className="tip-countdown-bar"><div className="tip-countdown-fill" style={{ width: `${(countdown / 10) * 100}%` }} /></div>
          <button className="tip-skip" onClick={onClose}>跳过 ({countdown}s)</button>
        </div>
      </div>
    </div>
  );
};

/* ── Vocab Match ── */
interface MatchProps {
  pairs: Array<[string, string]>;
  vibe: Vibe;
  lang: string;
  onCorrect: (ans: string) => void;
  onWrong: (ans: string) => void;
}
const VocabMatch: React.FC<MatchProps> = ({ pairs, vibe, lang, onCorrect, onWrong }) => {
  const [leftSel, setLeftSel]     = useState<number | null>(null);
  const [rightSel, setRightSel]   = useState<number | null>(null);
  const [matched, setMatched]     = useState<Set<number>>(new Set());
  const [cardState, setCardState] = useState<Record<string, 'jelly' | 'shake' | 'pop' | ''>>({});
  const [xpFloats, setXpFloats]   = useState<XPFloat[]>([]);
  const [confetti, setConfetti]   = useState(false);
  const rightOrder = useRef(shuffle(pairs.map((_, i) => i)));

  function setCard(key: string, state: 'jelly' | 'shake' | 'pop' | '') {
    setCardState((s) => ({ ...s, [key]: state }));
    setTimeout(() => setCardState((s) => ({ ...s, [key]: '' })), 600);
  }

  function spawnXP(e: React.MouseEvent) {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const id = Date.now();
    setXpFloats((f) => [...f, { id, x: rect.left + rect.width / 2, y: rect.top }]);
    setTimeout(() => setXpFloats((f) => f.filter((x) => x.id !== id)), 1000);
  }

  useEffect(() => {
    if (leftSel === null || rightSel === null) return;
    const rIdx = rightOrder.current[rightSel];
    if (leftSel === rIdx) {
      setCard(`l${leftSel}`, 'pop');
      setCard(`r${rightSel}`, 'pop');
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1000);
      setMatched((m) => new Set(m).add(leftSel));
      onCorrect(pairs[leftSel][1]);
      setLeftSel(null);
      setRightSel(null);
    } else {
      setCard(`l${leftSel}`, 'shake');
      setCard(`r${rightSel}`, 'shake');
      onWrong(pairs[rIdx][1]);
      setTimeout(() => { setLeftSel(null); setRightSel(null); }, 700);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftSel, rightSel]);

  return (
    <>
      <Confetti active={confetti} />
      {xpFloats.map((f) => (
        <div key={f.id} className="xp-float" style={{ left: f.x, top: f.y }}>+20 XP</div>
      ))}
      <div className="gm-match-grid">
        <div className="gm-match-col">
          {pairs.map(([zh], i) => {
            const isMatched = matched.has(i);
            const isSel = leftSel === i;
            const state = cardState[`l${i}`] || '';
            return (
              <button
                key={i}
                className={`gm-card zh ${isSel ? 'sel' : ''} ${isMatched ? 'matched' : ''} ${state ? `card-${state}` : ''}`}
                onClick={(e) => { if (!isMatched) { setCard(`l${i}`, 'jelly'); setLeftSel(i); if (isSel && rightSel !== null) spawnXP(e); } }}
                disabled={isMatched}
              >{zh}</button>
            );
          })}
        </div>
        <div className="gm-match-col">
          {rightOrder.current.map((pairIdx, i) => {
            const isMatched = matched.has(pairIdx);
            const isSel = rightSel === i;
            const state = cardState[`r${i}`] || '';
            return (
              <button
                key={i}
                className={`gm-card tgt ${isSel ? 'sel' : ''} ${isMatched ? 'matched' : ''} ${state ? `card-${state}` : ''}`}
                onClick={() => { if (!isMatched) { setCard(`r${i}`, 'jelly'); setRightSel(i); } }}
                disabled={isMatched}
              >{pairs[pairIdx][1]}</button>
            );
          })}
        </div>
      </div>
    </>
  );
};

/* ── Sentence Puzzle ── */
interface PuzzleProps {
  puzzle: { words: string[]; answer: string[]; zh: string };
  vibe: Vibe;
  lang: string;
  onCorrect: (ans: string) => void;
  onWrong: (ans: string) => void;
}
const SentencePuzzle: React.FC<PuzzleProps> = ({ puzzle, lang, onCorrect, onWrong }) => {
  const [bank, setBank]   = useState(() => shuffle(puzzle.words).map((w, i) => ({ w, id: i, used: false })));
  const [built, setBuilt] = useState<Array<{ w: string; id: number }>>([]);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  function addWord(id: number, w: string) {
    if (checked) return;
    setBank((b) => b.map((x) => x.id === id ? { ...x, used: true } : x));
    setBuilt((b) => [...b, { w, id }]);
  }
  function removeWord(id: number) {
    if (checked) return;
    setBuilt((b) => b.filter((x) => x.id !== id));
    setBank((b) => b.map((x) => x.id === id ? { ...x, used: false } : x));
  }
  function check() {
    const answer = built.map((x) => x.w);
    const ok = JSON.stringify(answer) === JSON.stringify(puzzle.answer);
    setCorrect(ok);
    setChecked(true);
    const sentenceStr = puzzle.answer.join(' ');
    if (ok) { setTimeout(() => onCorrect(sentenceStr), 600); }
    else onWrong(sentenceStr);
  }
  function reset() {
    setBank(shuffle(puzzle.words).map((w, i) => ({ w, id: i, used: false })));
    setBuilt([]); setChecked(false); setCorrect(false);
  }

  return (
    <div className="gm-puzzle">
      <p className="gm-puzzle-zh">中文：{puzzle.zh}</p>
      <div className="gm-puzzle-slots">
        {built.length === 0
          ? <span className="gm-puzzle-placeholder">点击下方词块拼出完整句子</span>
          : built.map(({ w, id }) => (
            <button key={id} className={`gm-bubble built ${checked ? (correct ? 'ok' : 'err') : ''}`} onClick={() => removeWord(id)}>{w}</button>
          ))
        }
      </div>
      <div className="gm-puzzle-bank">
        {bank.map(({ w, id, used }) => (
          <button key={id} className={`gm-bubble bank ${used ? 'used' : ''}`} onClick={() => !used && addWord(id, w)} disabled={used}>{w}</button>
        ))}
      </div>
      <div className="gm-puzzle-actions">
        {!checked ? (
          <button className="gm-check-btn" disabled={built.length === 0} onClick={check}>确认答案</button>
        ) : correct ? (
          <p className="gm-result-ok">✓ 句子正确！</p>
        ) : (
          <div className="gm-result-err-wrap">
            <p className="gm-result-err">✗ 顺序有误</p>
            <button className="gm-retry-btn" onClick={reset}>重试</button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Combo Flash ── */
const ComboFlash: React.FC<{ combo: number }> = ({ combo }) => {
  if (combo < 3) return null;
  return (
    <div className="gm-combo-flash" key={combo}>
      <span className="gm-combo-text">{combo >= 5 ? '🔥 BLAZING x' + combo : '⚡ COMBO x' + combo}</span>
    </div>
  );
};

/* ── Main Arena ── */
type ArenaMode = 'menu' | 'match' | 'puzzle' | 'matchDone' | 'puzzleDone' | 'wordHunter' | 'grammarCube' | 'escapeRoom' | 'grammarPlanet' | 'buddyChat' | 'season';

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  reward_xp: number;
  reward_diamonds: number;
}

const GAME_CARDS = [
  { key: 'wordHunter', icon: '🔍', title: '单词猎人', desc: '字母矩阵中找出单词', xp: '+30 XP', color: '#5B8FA8' },
  { key: 'grammarCube', icon: '🎲', title: '语法魔方', desc: '旋转魔方答题解锁', xp: '+25 XP', color: '#7A9B71' },
  { key: 'escapeRoom', icon: '🚪', title: '密室逃脱', desc: '语言解谜，逃出密室', xp: '+50 XP', color: '#C9553D' },
  { key: 'grammarPlanet', icon: '🚀', title: '语法星球', desc: '射击星球，答题得分', xp: '+40 XP', color: '#8B5CF6' },
  { key: 'buddyChat', icon: '💬', title: '语伴对话', desc: 'AI陪练 · 真人匹配', xp: '+20 XP', color: '#C9A574' },
];

export const GameArena: React.FC<GameArenaProps> = ({
  languageCode, languageName, hearts, sessionKey = 'guest', onHeartLost, onXP, onBack,
}) => {
  const { playSuccess, playFailure } = useAudio();
  const [mode, setMode]           = useState<ArenaMode>('menu');
  const [vibe, setVibe]           = useState<Vibe>('pure');
  const [pairs, setPairs]         = useState<Array<[string, string]>>([]);
  const [puzzle, setPuzzle]       = useState(() => pickPuzzle(languageCode));
  const [combo, setCombo]         = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [xpGained, setXpGained]   = useState(0);
  const [feedback, setFeedback]   = useState<{ fb: VibeFeedback; correct: boolean; answer: string } | null>(null);
  const [showTip, setShowTip]     = useState(false);
  const [pendingMode, setPendingMode] = useState<'match' | 'puzzle' | null>(null);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const comboTimer                = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    InfiniteGameGenerator.getDailyChallenge(languageCode).then((dc) => {
      if (dc) setDailyChallenge(dc as DailyChallenge);
    });
  }, [languageCode]);

  const tip = TIPS[languageCode] || TIPS.ja;

  function triggerCombo(streak: number) {
    if (comboTimer.current) clearTimeout(comboTimer.current);
    setShowCombo(true);
    comboTimer.current = setTimeout(() => setShowCombo(false), 1200);
  }

  const handleCorrect = useCallback((ans: string) => {
    onXP(20);
    setXpGained((x) => x + 20);
    setCombo((c) => { const next = c + 1; triggerCombo(next); return next; });
    playSuccess();
    const fb = rand(FEEDBACK[vibe].correct);
    setFeedback({ fb, correct: true, answer: ans });
  }, [vibe, onXP]);

  const handleWrong = useCallback((ans: string) => {
    onHeartLost();
    setCombo(0);
    playFailure();
    const fb = rand(FEEDBACK[vibe].wrong);
    setFeedback({ fb, correct: false, answer: ans });
  }, [vibe, onHeartLost]);

  function enterMode(m: 'match' | 'puzzle') {
    setPendingMode(m);
    setShowTip(true);
  }

  function launchMode() {
    setShowTip(false);
    if (pendingMode === 'match') {
      setPairs(pickVocab(languageCode, 4));
      setMode('match');
    } else {
      setPuzzle(pickPuzzle(languageCode));
      setMode('puzzle');
    }
    setPendingMode(null);
  }

  const heartDisplay = Array.from({ length: 5 }).map((_, i) => i < hearts ? '❤️' : '🖤');

  return (
    <>
      {showCombo && <ComboFlash combo={combo} />}
      {feedback && (
        <FeedbackModal
          fb={feedback.fb}
          correct={feedback.correct}
          answer={feedback.answer}
          lang={languageCode}
          onClose={() => setFeedback(null)}
        />
      )}
      {showTip && <TipModal tip={tip} onClose={launchMode} />}

      <div className="ga-wrap">
        <FloatingBack onClick={onBack} />

        {/* Top bar */}
        <div className="ga-topbar">
          <div className="ga-lang-tag">{languageName}</div>
          <div className="ga-hearts">{heartDisplay.join(' ')}</div>
          <div className="ga-xp-tag">+{xpGained} XP</div>
        </div>

        {/* Vibe selector */}
        <div className="ga-vibe-row">
          <button className={`ga-vibe-btn ${vibe === 'pure' ? 'active' : ''}`} onClick={() => setVibe('pure')}>
            🧸 纯真搞笑
          </button>
          <button className={`ga-vibe-btn ${vibe === 'flirt' ? 'active' : ''}`} onClick={() => setVibe('flirt')}>
            🔥 欢喜冤家
          </button>
        </div>

        {/* Combo bar */}
        {combo > 0 && (
          <div className="ga-combo-bar">
            <div className="ga-combo-fill" style={{ width: `${Math.min(combo * 20, 100)}%` }} />
            <span className="ga-combo-label">{combo >= 5 ? '🔥' : '⚡'} {combo} 连胜</span>
          </div>
        )}

        {mode === 'menu' && (
          <div className="ga-menu">
            <div className="ga-menu-hero">
              <span className="ga-menu-trophy">🏆</span>
              <h1 className="ga-menu-title">游戏学习场</h1>
              <p className="ga-menu-sub">{languageName} · Game-Based Learning Arena</p>
            </div>

            {/* Daily challenge + season quick-entry */}
            <div className="ga-quick-row">
              {dailyChallenge && (
                <button className="ga-quick-card daily" onClick={() => setMode('wordHunter')}>
                  <span className="ga-quick-icon">⚡</span>
                  <div className="ga-quick-text">
                    <span className="ga-quick-label">每日挑战</span>
                    <span className="ga-quick-sub">+{dailyChallenge.reward_xp} XP · +{dailyChallenge.reward_diamonds}💎</span>
                  </div>
                </button>
              )}
              <button className="ga-quick-card season" onClick={() => setMode('season')}>
                <span className="ga-quick-icon">🏅</span>
                <div className="ga-quick-text">
                  <span className="ga-quick-label">赛季排行</span>
                  <span className="ga-quick-sub">查看本赛季榜单</span>
                </div>
              </button>
            </div>

            {/* New 5-game horizontal scroll selector */}
            <div className="ga-game-selector-label">精选游戏</div>
            <div className="ga-game-selector">
              {GAME_CARDS.map((g) => (
                <button
                  key={g.key}
                  className="ga-game-card"
                  style={{ '--game-color': g.color } as React.CSSProperties}
                  onClick={() => setMode(g.key as ArenaMode)}
                >
                  <span className="ga-game-icon">{g.icon}</span>
                  <span className="ga-game-title">{g.title}</span>
                  <span className="ga-game-desc">{g.desc}</span>
                  <span className="ga-game-xp">{g.xp}</span>
                </button>
              ))}
            </div>

            <div className="ga-section-divider">经典游戏</div>
            <div className="ga-mode-cards">
              <button className="ga-mode-card match-card" onClick={() => enterMode('match')}>
                <span className="ga-mode-icon">🔗</span>
                <div className="ga-mode-text">
                  <span className="ga-mode-title">连线消消乐</span>
                  <span className="ga-mode-name">Vocab Match-Up</span>
                  <span className="ga-mode-desc">点击配对 · 闪消得分 · 金色粒子特效</span>
                </div>
                <span className="ga-mode-xp">+20 XP</span>
              </button>
              <button className="ga-mode-card puzzle-card" onClick={() => enterMode('puzzle')}>
                <span className="ga-mode-icon">🧩</span>
                <div className="ga-mode-text">
                  <span className="ga-mode-title">拼图连词成句</span>
                  <span className="ga-mode-name">Sentence Puzzle</span>
                  <span className="ga-mode-desc">词块气泡 · 语序挑战</span>
                </div>
                <span className="ga-mode-xp">+20 XP</span>
              </button>
            </div>

            {hearts === 0 && (
              <div className="ga-no-hearts">
                <span>❤️ 生命值已耗尽</span>
                <p>邀请好友获得钻石补血，或等待自动恢复</p>
              </div>
            )}
          </div>
        )}

        {mode === 'match' && (
          <div className="ga-game-section">
            <div className="ga-game-header">
              <h2 className="ga-game-title">🔗 连线消消乐</h2>
              <p className="ga-game-sub">将左列中文与右列{languageName}配对</p>
            </div>
            <VocabMatch
              pairs={pairs}
              vibe={vibe}
              lang={languageCode}
              onCorrect={(ans) => { handleCorrect(ans); if (pairs.every((_, i) => i < pairs.length)) setMode('matchDone'); }}
              onWrong={handleWrong}
            />
            <button className="ga-exit-btn" onClick={() => setMode('menu')}>退出本关</button>
          </div>
        )}

        {mode === 'matchDone' && (
          <div className="ga-done-screen">
            <span className="ga-done-star">⭐</span>
            <h2 className="ga-done-title">全部配对成功！</h2>
            <p className="ga-done-sub">+20 XP · {combo} 连胜</p>
            <div className="ga-done-actions">
              <button className="ga-btn-primary" onClick={() => enterMode('match')}>再来一局</button>
              <button className="ga-btn-sec" onClick={() => enterMode('puzzle')}>挑战拼句</button>
              <button className="ga-btn-back" onClick={() => setMode('menu')}>返回大厅</button>
            </div>
          </div>
        )}

        {mode === 'puzzle' && (
          <div className="ga-game-section">
            <div className="ga-game-header">
              <h2 className="ga-game-title">🧩 拼图连词成句</h2>
              <p className="ga-game-sub">按正确语法顺序点击词块</p>
            </div>
            <SentencePuzzle
              puzzle={puzzle}
              vibe={vibe}
              lang={languageCode}
              onCorrect={(ans) => { handleCorrect(ans); setMode('puzzleDone'); }}
              onWrong={handleWrong}
            />
            <button className="ga-exit-btn" onClick={() => setMode('menu')}>退出本关</button>
          </div>
        )}

        {mode === 'puzzleDone' && (
          <div className="ga-done-screen">
            <span className="ga-done-star">🎉</span>
            <h2 className="ga-done-title">句子拼对了！</h2>
            <p className="ga-done-sub">+20 XP · {combo} 连胜</p>
            <div className="ga-done-actions">
              <button className="ga-btn-primary" onClick={() => enterMode('puzzle')}>下一句</button>
              <button className="ga-btn-sec" onClick={() => enterMode('match')}>挑战连线</button>
              <button className="ga-btn-back" onClick={() => setMode('menu')}>返回大厅</button>
            </div>
          </div>
        )}
      </div>

      {/* New game modes – rendered outside ga-wrap to use their own shell */}
      {mode === 'wordHunter' && (
        <WordHunter
          langCode={languageCode}
          onXP={(d) => { onXP(d); setXpGained((x) => x + d); }}
          onHeartLost={onHeartLost}
          onBack={() => setMode('menu')}
        />
      )}
      {mode === 'grammarCube' && (
        <GrammarCube
          langCode={languageCode}
          onXP={(d) => { onXP(d); setXpGained((x) => x + d); }}
          onHeartLost={onHeartLost}
          onBack={() => setMode('menu')}
        />
      )}
      {mode === 'escapeRoom' && (
        <EscapeRoom
          langCode={languageCode}
          onXP={(d) => { onXP(d); setXpGained((x) => x + d); }}
          onBack={() => setMode('menu')}
        />
      )}
      {mode === 'grammarPlanet' && (
        <GrammarPlanet
          langCode={languageCode}
          onXP={(d) => { onXP(d); setXpGained((x) => x + d); }}
          onHeartLost={onHeartLost}
          onBack={() => setMode('menu')}
        />
      )}
      {mode === 'buddyChat' && (
        <BuddyChat
          langCode={languageCode}
          langName={languageName}
          sessionKey={sessionKey}
          userLevel="beginner"
          onXP={(d) => { onXP(d); setXpGained((x) => x + d); }}
          onBack={() => setMode('menu')}
        />
      )}
      {mode === 'season' && (
        <SeasonRanking
          sessionKey="demo-session"
          onBack={() => setMode('menu')}
        />
      )}
    </>
  );
};