import React, { useRef, useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAudio } from '../../lib/useAudio';

interface GrammarPlanetProps {
  langCode: string;
  onXP: (delta: number) => void;
  onHeartLost: () => void;
  onBack: () => void;
}

interface Question {
  id: string;
  pattern: string;
  question: string;
  options: string[];
  answer: string;
  category: string;
}

interface Planet {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  color: string;
  q: Question;
  alive: boolean;
  isBoss: boolean;
  hp: number;
  maxHp: number;
  flash: number;
}

interface Bullet { id: number; x: number; y: number; vy: number }
interface Particle { id: number; x: number; y: number; vx: number; vy: number; alpha: number; color: string }

const TIME_LIMIT = 90;
const PLANETS_TO_WIN = 10;

const CATEGORY_COLORS: Record<string, string> = {
  grammar: '#3B82FF', tense: '#FF9500', particle: '#FF3B6B',
  vocab: '#36CC8A', default: '#C9A574',
};

const FALLBACK_Q: Record<string, Question[]> = {
  ja: [
    { id:'j1', pattern:'〜ます', question:'「食べます」是什么时态？', options:['礼貌现在时','过去时','否定形','命令形'], answer:'礼貌现在时', category:'tense' },
    { id:'j2', pattern:'〜て', question:'「食べて」的用法是？', options:['连接形/请求','否定','过去时','尊敬语'], answer:'连接形/请求', category:'grammar' },
    { id:'j3', pattern:'は vs が', question:'「私は学生です」中，は的作用是？', options:['主题助词','主格助词','宾格助词','方向助词'], answer:'主题助词', category:'particle' },
    { id:'j4', pattern:'〜ない', question:'「食べない」表示什么？', options:['否定','过去','命令','可能'], answer:'否定', category:'grammar' },
    { id:'j5', pattern:'〜でした', question:'「学生でした」的时态是？', options:['过去礼貌','现在礼貌','将来时','条件形'], answer:'过去礼貌', category:'tense' },
    { id:'j6', pattern:'〜たい', question:'「食べたい」表达什么？', options:['愿望/想要','命令','可能','进行'], answer:'愿望/想要', category:'grammar' },
    { id:'j7', pattern:'〜てから', question:'「食べてから」表示什么？', options:['先…后…','同时','或者','因为'], answer:'先…后…', category:'grammar' },
    { id:'j8', pattern:'〜のに', question:'「来るのに」的用法是？', options:['逆接/尽管','目的','条件','原因'], answer:'逆接/尽管', category:'grammar' },
  ],
  en: [
    { id:'e1', pattern:'Present Perfect', question:'"I have eaten" uses which tense?', options:['Present Perfect','Past Simple','Present Continuous','Future'], answer:'Present Perfect', category:'tense' },
    { id:'e2', pattern:'a vs an', question:'Which is correct?', options:['an apple','a apple','a egg','an book'], answer:'an apple', category:'grammar' },
    { id:'e3', pattern:'-ing form', question:'"She is running" is which tense?', options:['Present Continuous','Present Simple','Past Continuous','Future'], answer:'Present Continuous', category:'tense' },
    { id:'e4', pattern:'Modal: can', question:'"Can you help?" - can expresses?', options:['Ability/Request','Obligation','Certainty','Habit'], answer:'Ability/Request', category:'grammar' },
    { id:'e5', pattern:'Passive', question:'"The cake was eaten" is?', options:['Passive Voice','Active Voice','Interrogative','Imperative'], answer:'Passive Voice', category:'grammar' },
    { id:'e6', pattern:'3rd Conditional', question:'"If I had known" expresses?', options:['Unreal Past','Unreal Present','Real Future','Habit'], answer:'Unreal Past', category:'grammar' },
    { id:'e7', pattern:'Articles', question:'Zero article used with?', options:['Proper nouns','Countable','Uncountable','All nouns'], answer:'Proper nouns', category:'grammar' },
    { id:'e8', pattern:'Gerund', question:'"I enjoy swimming" - swimming is?', options:['Gerund','Infinitive','Participle','Adjective'], answer:'Gerund', category:'grammar' },
  ],
  ko: [
    { id:'k1', pattern:'이에요/예요', question:'「저는 학생이에요」의 끝말은?', options:['礼貌现在时','过去时','命令形','否定'], answer:'礼貌现在时', category:'tense' },
    { id:'k2', pattern:'을/를', question:'목적격 조사는?', options:['을/를','이/가','은/는','에서'], answer:'을/를', category:'particle' },
    { id:'k3', pattern:'이/가', question:'주격 조사는?', options:['이/가','을/를','에/에서','의'], answer:'이/가', category:'particle' },
    { id:'k4', pattern:'〜았/었', question:'「먹었어요」의 시제는?', options:['过去时','现在时','将来时','否定'], answer:'过去时', category:'tense' },
    { id:'k5', pattern:'안 vs 못', question:'能力否定用?', options:['못','안','없','고'], answer:'못', category:'grammar' },
    { id:'k6', pattern:'〜겠', question:'「가겠어요」는?', options:['意志/推测','过去','否定','命令'], answer:'意志/推测', category:'grammar' },
  ],
  fr: [
    { id:'f1', pattern:'Passé Composé', question:'「J\'ai mangé」est quel temps?', options:['Passé Composé','Imparfait','Futur','Présent'], answer:'Passé Composé', category:'tense' },
    { id:'f2', pattern:'le/la/les', question:'Article défini pluriel?', options:['les','la','le','un'], answer:'les', category:'grammar' },
    { id:'f3', pattern:'être vs avoir', question:'「Je suis allé」utilise?', options:['être','avoir','aller','venir'], answer:'être', category:'grammar' },
    { id:'f4', pattern:'Subjonctif', question:'「Il faut que tu ___」quel mode?', options:['Subjonctif','Indicatif','Conditionnel','Impératif'], answer:'Subjonctif', category:'grammar' },
    { id:'f5', pattern:'Imparfait', question:'Description dans le passé = ?', options:['Imparfait','Passé Composé','Futur','Présent'], answer:'Imparfait', category:'tense' },
  ],
  es: [
    { id:'s1', pattern:'ser vs estar', question:'「Soy estudiante」usa?', options:['ser','estar','tener','haber'], answer:'ser', category:'grammar' },
    { id:'s2', pattern:'Pretérito', question:'「Comí」es qué tiempo?', options:['Pretérito Indefinido','Imperfecto','Futuro','Presente'], answer:'Pretérito Indefinido', category:'tense' },
    { id:'s3', pattern:'Subjuntivo', question:'「Quiero que vengas」requiere?', options:['Subjuntivo','Indicativo','Condicional','Imperativo'], answer:'Subjuntivo', category:'grammar' },
    { id:'s4', pattern:'por vs para', question:'「Gracias por tu ayuda」usa?', options:['por','para','a','de'], answer:'por', category:'grammar' },
    { id:'s5', pattern:'Reflexivo', question:'「Me llamo」es verbo?', options:['Reflexivo','Transitivo','Intransitivo','Impersonal'], answer:'Reflexivo', category:'grammar' },
  ],
  de: [
    { id:'d1', pattern:'der/die/das', question:'「das Mädchen」- warum Neutrum?', options:['Gramm. Geschlecht','Biologisch weiblich','Plural','Akkusativ'], answer:'Gramm. Geschlecht', category:'grammar' },
    { id:'d2', pattern:'Akkusativ', question:'「Ich sehe den Mann」- den ist?', options:['Akkusativ','Nominativ','Dativ','Genitiv'], answer:'Akkusativ', category:'grammar' },
    { id:'d3', pattern:'Perfekt', question:'「Ich habe gegessen」ist welche Zeit?', options:['Perfekt','Präteritum','Futur','Präsens'], answer:'Perfekt', category:'tense' },
    { id:'d4', pattern:'Konjunktiv II', question:'「Ich würde gern」expresses?', options:['Wunsch/Hypothese','Befehl','Vergangenheit','Zukunft'], answer:'Wunsch/Hypothese', category:'grammar' },
    { id:'d5', pattern:'Trennbare V.', question:'「aufmachen」- trennbar als?', options:['auf + machen','aufmach+en','a+ufmachen','aufm+achen'], answer:'auf + machen', category:'grammar' },
  ],
  it: [
    { id:'i1', pattern:'Passato Prossimo', question:'「Ho mangiato」è quale tempo?', options:['Passato Prossimo','Imperfetto','Futuro','Presente'], answer:'Passato Prossimo', category:'tense' },
    { id:'i2', pattern:'Congiuntivo', question:'「Voglio che tu venga」richiede?', options:['Congiuntivo','Indicativo','Condizionale','Imperativo'], answer:'Congiuntivo', category:'grammar' },
    { id:'i3', pattern:'il/la/i/le', question:'Articolo det. plurale maschile?', options:['i','le','il','la'], answer:'i', category:'grammar' },
    { id:'i4', pattern:'Riflessivo', question:'「Mi chiamo」è verbo?', options:['Riflessivo','Transitivo','Intransitivo','Impersonale'], answer:'Riflessivo', category:'grammar' },
    { id:'i5', pattern:'Imperfetto', question:'Azione ripetuta nel passato?', options:['Imperfetto','Passato Prossimo','Futuro','Presente'], answer:'Imperfetto', category:'tense' },
  ],
  pt: [
    { id:'p1', pattern:'Pretérito Perf.', question:'「Comi」é qual tempo?', options:['Pretérito Perfeito','Imperfeito','Futuro','Presente'], answer:'Pretérito Perfeito', category:'tense' },
    { id:'p2', pattern:'ser vs estar', question:'「Sou estudante」usa?', options:['ser','estar','ter','haver'], answer:'ser', category:'grammar' },
    { id:'p3', pattern:'Subjuntivo', question:'「Quero que venhas」requer?', options:['Conjuntivo','Indicativo','Condicional','Imperativo'], answer:'Conjuntivo', category:'grammar' },
    { id:'p4', pattern:'Futuro', question:'「Comerei」é qual tempo?', options:['Futuro do Indicativo','Presente','Pretérito','Condicional'], answer:'Futuro do Indicativo', category:'tense' },
    { id:'p5', pattern:'por vs para', question:'「Obrigado pela ajuda」usa?', options:['por','para','a','de'], answer:'por', category:'grammar' },
  ],
  ar: [
    { id:'a1', pattern:'المضارع', question:'「يأكل」ما هو الزمن؟', options:['المضارع','الماضي','الأمر','المستقبل'], answer:'المضارع', category:'tense' },
    { id:'a2', pattern:'ال التعريف', question:'أداة التعريف في العربية؟', options:['ال','أل','ةل','لا'], answer:'ال', category:'grammar' },
    { id:'a3', pattern:'الجمع', question:'「كتب」جمع ماذا؟', options:['كتاب','قلم','بيت','باب'], answer:'كتاب', category:'grammar' },
    { id:'a4', pattern:'الإضافة', question:'「كتاب الطالب」نوع التركيب؟', options:['إضافة','نعت','حال','بدل'], answer:'إضافة', category:'grammar' },
    { id:'a5', pattern:'فعل ماضٍ', question:'「أكل」ما نوعه؟', options:['فعل ماضٍ','فعل مضارع','فعل أمر','مصدر'], answer:'فعل ماضٍ', category:'tense' },
  ],
  zh: [
    { id:'z1', pattern:'把字句', question:'「我把苹果吃了」中，把的作用是？', options:['处置式','被动式','比较','双宾'], answer:'处置式', category:'grammar' },
    { id:'z2', pattern:'被字句', question:'「苹果被我吃了」是什么句式？', options:['被动句','把字句','存在句','连动句'], answer:'被动句', category:'grammar' },
    { id:'z3', pattern:'了 (le)', question:'「我吃了」中，了的用法是？', options:['完成体','进行时','将来时','否定'], answer:'完成体', category:'tense' },
    { id:'z4', pattern:'的/地/得', question:'「他跑得很快」的"得"用法是？', options:['程度补语','结构助词','状语标记','定语标记'], answer:'程度补语', category:'grammar' },
    { id:'z5', pattern:'吗 vs 呢', question:'一般疑问句末尾用？', options:['吗','呢','啊','嘛'], answer:'吗', category:'grammar' },
    { id:'z6', pattern:'连…都/也', question:'「连小孩都知道」表达什么？', options:['强调','转折','假设','比较'], answer:'强调', category:'grammar' },
  ],
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function lighten(hex: string): string {
  try {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, ((n >> 16) & 0xff) + 55);
    const g = Math.min(255, ((n >> 8) & 0xff) + 55);
    const b = Math.min(255, (n & 0xff) + 55);
    return `rgb(${r},${g},${b})`;
  } catch { return hex; }
}

async function fetchQuestions(langCode: string): Promise<Question[]> {
  const result: Question[] = [];

  const { data: gp } = await supabase
    .from('grammar_patterns')
    .select('id, pattern, meaning, lang_code')
    .eq('lang_code', langCode)
    .limit(60);

  if (gp && gp.length > 0) {
    const wrongPool = ['否定形', '过去时', '礼貌体', '命令形', '连接形', '进行时', '将来时', '条件形', '尊敬语', '谦让语'];
    for (const row of gp as Array<{ id: string; pattern: string; meaning: string }>) {
      if (!row.meaning) continue;
      const wrong = wrongPool.filter((s) => s !== row.meaning).slice(0, 3);
      result.push({
        id: row.id,
        pattern: row.pattern.slice(0, 8),
        question: `「${row.pattern}」的意思是？`,
        options: shuffle([row.meaning, ...wrong]),
        answer: row.meaning,
        category: 'grammar',
      });
    }
  }

  const { data: eq } = await supabase
    .from('exam_questions')
    .select('id, question_text, options, correct_answer')
    .eq('lang_code', langCode)
    .limit(40);

  if (eq && eq.length > 0) {
    for (const row of eq as Array<{ id: string; question_text: string; options: unknown; correct_answer: string }>) {
      let opts: string[] = [];
      if (Array.isArray(row.options)) opts = row.options as string[];
      else { try { opts = JSON.parse(row.options as string); } catch { continue; } }
      if (opts.length < 2) continue;
      result.push({
        id: `eq_${row.id}`,
        pattern: String(row.question_text).slice(0, 8),
        question: String(row.question_text),
        options: shuffle(opts).slice(0, 4),
        answer: String(row.correct_answer),
        category: 'tense',
      });
    }
  }

  if (result.length >= 5) return shuffle(result);
  return shuffle([...result, ...(FALLBACK_Q[langCode] ?? FALLBACK_Q.en)]);
}

let _uid = 0;
function makePlanet(q: Question, W: number, isBoss = false): Planet {
  return {
    id: _uid++,
    x: 60 + Math.random() * (W - 120),
    y: -70,
    vx: (Math.random() - 0.5) * (isBoss ? 0.5 : 1.3),
    vy: isBoss ? 0.3 : (0.5 + Math.random() * 0.9),
    radius: isBoss ? 54 : (30 + Math.floor(Math.random() * 16)),
    color: isBoss ? '#cc2222' : (CATEGORY_COLORS[q.category] ?? CATEGORY_COLORS.default),
    q, alive: true, isBoss,
    hp: isBoss ? 3 : 1, maxHp: isBoss ? 3 : 1,
    flash: 0,
  };
}

export const GrammarPlanet: React.FC<GrammarPlanetProps> = ({ langCode, onXP, onHeartLost, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planetsRef = useRef<Planet[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const shipXRef = useRef(180);
  const frameRef = useRef(0);
  const poolRef = useRef<Question[]>([]);
  const spawnRef = useRef(0);

  const [gameState, setGameState] = useState<'loading' | 'playing' | 'question' | 'won' | 'lost'>('loading');
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [destroyed, setDestroyed] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState<string | null>(null);
  const [activeQ, setActiveQ] = useState<{ planet: Planet; question: Question } | null>(null);
  const [bossHp, setBossHp] = useState(3);
  const isBossRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { playSuccess, playFailure } = useAudio();

  const loadLevel = useCallback(async (lv: number) => {
    setGameState('loading');
    const isBoss = lv % 5 === 0;
    isBossRef.current = isBoss;
    const pool = await fetchQuestions(langCode);
    poolRef.current = pool;
    planetsRef.current = [];
    bulletsRef.current = [];
    particlesRef.current = [];
    spawnRef.current = 0;
    setDestroyed(0);
    setScore((s) => s); // keep score across levels
    setStreak(0);
    setBossHp(3);
    setTimeLeft(isBoss ? 120 : TIME_LIMIT);
    setGameState('playing');
  }, [langCode]);

  useEffect(() => { loadLevel(level); }, [loadLevel, level]);

  useEffect(() => {
    if (gameState !== 'playing') { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); setGameState('lost'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    let running = true;
    const isBoss = isBossRef.current;

    // Spawn boss once immediately
    if (isBoss && poolRef.current.length > 0 && planetsRef.current.length === 0) {
      const q = poolRef.current[Math.floor(Math.random() * poolRef.current.length)];
      planetsRef.current.push(makePlanet(q, W, true));
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#060b12';
      ctx.fillRect(0, 0, W, H);
      // Stars
      for (let i = 0; i < 55; i++) {
        const a = 0.15 + ((i * 17) % 5) * 0.12;
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fillRect((i * 73 + 11) % W, (i * 43 + 7) % H, i % 4 === 0 ? 2 : 1, i % 4 === 0 ? 2 : 1);
      }

      // Spawn regular planets
      spawnRef.current++;
      if (!isBoss && spawnRef.current % 85 === 0 && poolRef.current.length > 0) {
        const q = poolRef.current[Math.floor(Math.random() * poolRef.current.length)];
        planetsRef.current.push(makePlanet(q, W, false));
      }

      // Update planets
      planetsRef.current = planetsRef.current.filter((p) => {
        if (!p.alive) return false;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < p.radius || p.x > W - p.radius) p.vx *= -1;
        if (p.y > H + p.radius) return false;
        if (p.flash > 0) p.flash--;

        if (p.isBoss) { ctx.shadowBlur = 22; ctx.shadowColor = '#ff3333'; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(p.x - p.radius * 0.3, p.y - p.radius * 0.3, 2, p.x, p.y, p.radius);
        grad.addColorStop(0, p.flash > 0 ? '#fff' : lighten(p.color));
        grad.addColorStop(1, p.color);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (p.isBoss) {
          const bw = p.radius * 2, bh = 7;
          const bx = p.x - p.radius, by = p.y + p.radius + 5;
          ctx.fillStyle = '#111'; ctx.fillRect(bx, by, bw, bh);
          ctx.fillStyle = p.hp > 1 ? '#ff3333' : '#ff8c00';
          ctx.fillRect(bx, by, bw * (p.hp / p.maxHp), bh);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('BOSS', p.x, by + 4.5);
        }

        ctx.fillStyle = '#fff';
        ctx.font = `bold ${p.isBoss ? 13 : 10}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(p.q.pattern).slice(0, 7), p.x, p.y);
        return true;
      });

      // Bullets
      bulletsRef.current = bulletsRef.current.filter((b) => {
        b.y += b.vy;
        if (b.y < -10) return false;
        ctx.beginPath();
        ctx.arc(b.x, b.y + 7, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,215,0,0.35)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        let hit = false;
        for (const p of planetsRef.current) {
          if (!p.alive) continue;
          const dx = b.x - p.x, dy = b.y - p.y;
          if (Math.sqrt(dx * dx + dy * dy) < p.radius + 4) {
            p.flash = 8;
            if (p.isBoss) {
              p.hp--;
              setBossHp(p.hp);
              if (p.hp <= 0) {
                p.alive = false;
                spawnParticles(p.x, p.y, p.color);
                setActiveQ({ planet: { ...p }, question: p.q });
                setGameState('question');
              }
            } else {
              p.alive = false;
              spawnParticles(p.x, p.y, p.color);
              setActiveQ({ planet: { ...p }, question: p.q });
              setGameState('question');
            }
            hit = true;
            break;
          }
        }
        return !hit;
      });

      // Particles
      particlesRef.current = particlesRef.current.filter((pt) => {
        pt.x += pt.vx; pt.y += pt.vy; pt.alpha -= 0.028;
        if (pt.alpha <= 0) return false;
        ctx.globalAlpha = pt.alpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = pt.color; ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });

      // Ship
      const sx = shipXRef.current;
      ctx.shadowBlur = 10; ctx.shadowColor = '#58A6FF';
      ctx.fillStyle = '#58A6FF';
      ctx.beginPath();
      ctx.moveTo(sx, H - 22);
      ctx.lineTo(sx - 15, H - 4);
      ctx.lineTo(sx + 15, H - 4);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,140,0,0.75)';
      ctx.beginPath();
      ctx.moveTo(sx - 7, H - 4);
      ctx.lineTo(sx, H + 10);
      ctx.lineTo(sx + 7, H - 4);
      ctx.closePath();
      ctx.fill();

      frameRef.current = requestAnimationFrame(draw);
    }
    frameRef.current = requestAnimationFrame(draw);
    return () => { running = false; cancelAnimationFrame(frameRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  function spawnParticles(x: number, y: number, color: string) {
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14;
      particlesRef.current.push({ id: _uid++, x, y, vx: Math.cos(angle) * (1 + Math.random() * 3), vy: Math.sin(angle) * (1 + Math.random() * 3), alpha: 1, color });
    }
  }

  function fire(clientX: number) {
    if (gameState !== 'playing') return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 360;
    shipXRef.current = x;
    bulletsRef.current.push({ id: _uid++, x, y: 355, vy: -11 });
  }

  function answerQuestion(chosen: string) {
    if (!activeQ) return;
    const correct = chosen === activeQ.question.answer;
    const isBoss = activeQ.planet.isBoss;
    if (correct) {
      playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = newStreak >= 3 ? Math.floor(newStreak / 3) * 5 : 0;
      const pts = (isBoss ? 40 : 10) + bonus;
      setScore((s) => s + pts);
      onXP(pts);
      const newD = destroyed + 1;
      setDestroyed(newD);
      if (bonus > 0) { setCombo(`连击 ×${newStreak}  +${bonus}XP`); setTimeout(() => setCombo(null), 1600); }
      if (isBoss || newD >= PLANETS_TO_WIN) {
        setGameState('won');
        onXP(isBoss ? 150 : 80);
        setActiveQ(null);
        return;
      }
    } else {
      playFailure();
      setStreak(0);
      onHeartLost();
      if (activeQ.planet) {
        const restored = { ...activeQ.planet, alive: true, y: 80, vy: 0.5, hp: activeQ.planet.isBoss ? 1 : 1 };
        planetsRef.current.push(restored);
        if (isBoss) setBossHp(1);
      }
    }
    setActiveQ(null);
    setGameState('playing');
  }

  const isBoss = isBossRef.current;

  if (gameState === 'loading') {
    return (
      <div className="gp-shell">
        <div className="gp-loading">正在加载语法星球…</div>
      </div>
    );
  }

  return (
    <div className="gp-shell">
      <div className="gp-topbar">
        <button className="gp-back" onClick={onBack}>←</button>
        <span className="gp-title">
          {isBoss ? '⚠️ Boss战' : '语法星球'}
          <span className="gp-level-badge">Lv.{level}</span>
        </span>
        <span className="gp-info">
          {isBoss ? `Boss HP: ${bossHp}` : `${destroyed}/${PLANETS_TO_WIN}`} · {timeLeft}s
        </span>
      </div>

      {combo && <div className="gp-combo">{combo}</div>}

      <canvas
        ref={canvasRef}
        width={360} height={380}
        className={`gp-canvas ${isBoss ? 'boss-canvas' : ''}`}
        onClick={(e) => fire(e.clientX)}
        onTouchStart={(e) => { e.preventDefault(); fire(e.touches[0].clientX); }}
      />
      <p className="gp-hint">{isBoss ? '击中Boss 3次后答题击败它！' : '点击/触摸发射 · 击中星球答题'}</p>

      {gameState === 'question' && activeQ && (
        <div className="gp-q-overlay">
          <div className={`gp-q-card ${activeQ.planet.isBoss ? 'boss-q-card' : ''}`}>
            {activeQ.planet.isBoss && <div className="gp-boss-banner">BOSS 决战题</div>}
            <p className="gp-q-pattern">「{activeQ.question.pattern}」</p>
            <p className="gp-q-text">{activeQ.question.question}</p>
            <div className="gp-q-options">
              {activeQ.question.options.map((opt, i) => (
                <button key={i} className="gp-q-option" onClick={() => answerQuestion(opt)}>{opt}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(gameState === 'won' || gameState === 'lost') && (
        <div className="gp-overlay">
          <div className="gp-result-box">
            <span className="gp-result-icon">{gameState === 'won' ? (isBoss ? '👑' : '🚀') : '💥'}</span>
            <h3>{gameState === 'won' ? (isBoss ? 'Boss击败！' : `第${level}关通关！`) : '时间到！'}</h3>
            <p>击毁：{destroyed} · 得分：{score}</p>
            {gameState === 'won' && (
              <button className="gp-next-btn" onClick={() => setLevel((l) => l + 1)}>下一关 →</button>
            )}
            <button className="gp-next-btn" style={{ background: 'rgba(255,255,255,.12)' }} onClick={() => loadLevel(level)}>再来一局</button>
            <button className="gp-quit-btn" onClick={onBack}>退出</button>
          </div>
        </div>
      )}
    </div>
  );
};
