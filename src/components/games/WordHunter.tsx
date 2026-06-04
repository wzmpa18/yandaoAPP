/**
 * 单词爆破者 — Balloon Shooter
 * Balloons float up carrying words. Tap the balloon that matches the prompt.
 * Words loaded from vocabulary_items DB table; fallback to static data.
 * 60s limit · combo multiplier · 10-language support.
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { supabase } from '../../data/supabase';
import { useAudio } from '../../lib/useAudio';

interface WordHunterProps {
  langCode: string;
  onXP: (delta: number) => void;
  onHeartLost: () => void;
  onBack: () => void;
}

interface WordPair {
  word: string;      // target language word (on balloon)
  meaning: string;   // Chinese meaning (shown as prompt)
}

// ── Static fallback vocabulary ────────────────────────────────────────────────
const FALLBACK: Record<string, WordPair[]> = {
  ja: [
    {word:'ねこ',meaning:'猫'},{word:'いぬ',meaning:'狗'},{word:'さかな',meaning:'鱼'},
    {word:'みず',meaning:'水'},{word:'そら',meaning:'天空'},{word:'はな',meaning:'花'},
    {word:'やま',meaning:'山'},{word:'かわ',meaning:'河'},{word:'たべる',meaning:'吃'},
    {word:'のむ',meaning:'喝'},{word:'いく',meaning:'去'},{word:'くる',meaning:'来'},
    {word:'あかい',meaning:'红色的'},{word:'おおきい',meaning:'大的'},{word:'ちいさい',meaning:'小的'},
    {word:'がっこう',meaning:'学校'},{word:'ともだち',meaning:'朋友'},{word:'せんせい',meaning:'老师'},
  ],
  en: [
    {word:'apple',meaning:'苹果'},{word:'book',meaning:'书'},{word:'cat',meaning:'猫'},
    {word:'door',meaning:'门'},{word:'eat',meaning:'吃'},{word:'flower',meaning:'花'},
    {word:'garden',meaning:'花园'},{word:'happy',meaning:'快乐的'},{word:'island',meaning:'岛屿'},
    {word:'jump',meaning:'跳'},{word:'kind',meaning:'善良的'},{word:'light',meaning:'光/轻的'},
    {word:'moon',meaning:'月亮'},{word:'night',meaning:'夜晚'},{word:'ocean',meaning:'海洋'},
    {word:'paper',meaning:'纸'},{word:'queen',meaning:'女王'},{word:'river',meaning:'河流'},
  ],
  ko: [
    {word:'사과',meaning:'苹果'},{word:'고양이',meaning:'猫'},{word:'강아지',meaning:'小狗'},
    {word:'학교',meaning:'学校'},{word:'선생님',meaning:'老师'},{word:'친구',meaning:'朋友'},
    {word:'물',meaning:'水'},{word:'밥',meaning:'饭'},{word:'책',meaning:'书'},
    {word:'집',meaning:'家'},{word:'하늘',meaning:'天空'},{word:'바다',meaning:'大海'},
    {word:'먹다',meaning:'吃'},{word:'가다',meaning:'去'},{word:'오다',meaning:'来'},
    {word:'크다',meaning:'大的'},{word:'작다',meaning:'小的'},{word:'예쁘다',meaning:'漂亮'},
  ],
  fr: [
    {word:'pomme',meaning:'苹果'},{word:'chat',meaning:'猫'},{word:'école',meaning:'学校'},
    {word:'ami',meaning:'朋友'},{word:'eau',meaning:'水'},{word:'manger',meaning:'吃'},
    {word:'soleil',meaning:'太阳'},{word:'lune',meaning:'月亮'},{word:'maison',meaning:'房子'},
    {word:'livre',meaning:'书'},{word:'grand',meaning:'大的'},{word:'petit',meaning:'小的'},
    {word:'rouge',meaning:'红色'},{word:'bleu',meaning:'蓝色'},{word:'vert',meaning:'绿色'},
    {word:'chien',meaning:'狗'},{word:'fleur',meaning:'花'},{word:'arbre',meaning:'树'},
  ],
  es: [
    {word:'manzana',meaning:'苹果'},{word:'gato',meaning:'猫'},{word:'escuela',meaning:'学校'},
    {word:'amigo',meaning:'朋友'},{word:'agua',meaning:'水'},{word:'comer',meaning:'吃'},
    {word:'sol',meaning:'太阳'},{word:'luna',meaning:'月亮'},{word:'casa',meaning:'房子'},
    {word:'libro',meaning:'书'},{word:'grande',meaning:'大的'},{word:'pequeño',meaning:'小的'},
    {word:'rojo',meaning:'红色'},{word:'azul',meaning:'蓝色'},{word:'verde',meaning:'绿色'},
    {word:'perro',meaning:'狗'},{word:'flor',meaning:'花'},{word:'árbol',meaning:'树'},
  ],
  de: [
    {word:'Apfel',meaning:'苹果'},{word:'Katze',meaning:'猫'},{word:'Schule',meaning:'学校'},
    {word:'Freund',meaning:'朋友'},{word:'Wasser',meaning:'水'},{word:'essen',meaning:'吃'},
    {word:'Sonne',meaning:'太阳'},{word:'Mond',meaning:'月亮'},{word:'Haus',meaning:'房子'},
    {word:'Buch',meaning:'书'},{word:'groß',meaning:'大的'},{word:'klein',meaning:'小的'},
    {word:'rot',meaning:'红色'},{word:'blau',meaning:'蓝色'},{word:'grün',meaning:'绿色'},
    {word:'Hund',meaning:'狗'},{word:'Blume',meaning:'花'},{word:'Baum',meaning:'树'},
  ],
  it: [
    {word:'mela',meaning:'苹果'},{word:'gatto',meaning:'猫'},{word:'scuola',meaning:'学校'},
    {word:'amico',meaning:'朋友'},{word:'acqua',meaning:'水'},{word:'mangiare',meaning:'吃'},
    {word:'sole',meaning:'太阳'},{word:'luna',meaning:'月亮'},{word:'casa',meaning:'房子'},
    {word:'libro',meaning:'书'},{word:'grande',meaning:'大的'},{word:'piccolo',meaning:'小的'},
    {word:'rosso',meaning:'红色'},{word:'blu',meaning:'蓝色'},{word:'verde',meaning:'绿色'},
    {word:'cane',meaning:'狗'},{word:'fiore',meaning:'花'},{word:'albero',meaning:'树'},
  ],
  pt: [
    {word:'maçã',meaning:'苹果'},{word:'gato',meaning:'猫'},{word:'escola',meaning:'学校'},
    {word:'amigo',meaning:'朋友'},{word:'água',meaning:'水'},{word:'comer',meaning:'吃'},
    {word:'sol',meaning:'太阳'},{word:'lua',meaning:'月亮'},{word:'casa',meaning:'房子'},
    {word:'livro',meaning:'书'},{word:'grande',meaning:'大的'},{word:'pequeno',meaning:'小的'},
    {word:'vermelho',meaning:'红色'},{word:'azul',meaning:'蓝色'},{word:'verde',meaning:'绿色'},
    {word:'cão',meaning:'狗'},{word:'flor',meaning:'花'},{word:'árvore',meaning:'树'},
  ],
  ar: [
    {word:'تفاحة',meaning:'苹果'},{word:'قطة',meaning:'猫'},{word:'مدرسة',meaning:'学校'},
    {word:'صديق',meaning:'朋友'},{word:'ماء',meaning:'水'},{word:'أكل',meaning:'吃'},
    {word:'شمس',meaning:'太阳'},{word:'قمر',meaning:'月亮'},{word:'بيت',meaning:'房子'},
    {word:'كتاب',meaning:'书'},{word:'كبير',meaning:'大的'},{word:'صغير',meaning:'小的'},
    {word:'أحمر',meaning:'红色'},{word:'أزرق',meaning:'蓝色'},{word:'أخضر',meaning:'绿色'},
    {word:'كلب',meaning:'狗'},{word:'زهرة',meaning:'花'},{word:'شجرة',meaning:'树'},
  ],
  zh: [
    {word:'apple',meaning:'苹果'},{word:'cat',meaning:'猫'},{word:'school',meaning:'学校'},
    {word:'friend',meaning:'朋友'},{word:'water',meaning:'水'},{word:'eat',meaning:'吃'},
    {word:'sun',meaning:'太阳'},{word:'moon',meaning:'月亮'},{word:'house',meaning:'房子'},
    {word:'book',meaning:'书'},{word:'big',meaning:'大的'},{word:'small',meaning:'小的'},
    {word:'red',meaning:'红色'},{word:'blue',meaning:'蓝色'},{word:'green',meaning:'绿色'},
    {word:'dog',meaning:'狗'},{word:'flower',meaning:'花'},{word:'tree',meaning:'树'},
  ],
};

async function fetchVocab(langCode: string, count: number): Promise<WordPair[]> {
  const { data } = await supabase
    .from('vocabulary_items')
    .select('word, meaning, reading')
    .eq('lang_code', langCode)
    .limit(count * 3);

  if (data && data.length >= count) {
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((r: { word: string; meaning: string }) => ({
      word: String(r.word),
      meaning: String(r.meaning),
    }));
  }

  const fb = FALLBACK[langCode] ?? FALLBACK.en;
  const merged = data
    ? [...data.map((r: { word: string; meaning: string }) => ({ word: String(r.word), meaning: String(r.meaning) })), ...fb]
    : fb;
  return [...merged].sort(() => Math.random() - 0.5).slice(0, count);
}

// ── Balloon ──────────────────────────────────────────────────────────────────
const BALLOON_COLORS = ['#e05580','#3B82FF','#36CC8A','#FF9500','#C9A574','#9B59B6','#1ABC9C'];

interface Balloon {
  id: number;
  x: number; y: number;
  vy: number;
  color: string;
  pair: WordPair;
  isTarget: boolean;
  popped: boolean;
  popAlpha: number;
}

let _bid = 0;

function makeBalloon(pair: WordPair, isTarget: boolean, W: number, H: number): Balloon {
  return {
    id: _bid++,
    x: 40 + Math.random() * (W - 80),
    y: H + 40 + Math.random() * 80,
    vy: -(0.6 + Math.random() * 0.8),
    color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
    pair, isTarget,
    popped: false, popAlpha: 1,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
const TIME_LIMIT = 60;
const BALLOONS_ON_SCREEN = 4;
const ROUNDS_TO_WIN = 10;

export const WordHunter: React.FC<WordHunterProps> = ({ langCode, onXP, onHeartLost, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const balloonsRef = useRef<Balloon[]>([]);
  const frameRef = useRef(0);

  const [gameState, setGameState] = useState<'loading' | 'playing' | 'won' | 'lost'>('loading');
  const [vocabPool, setVocabPool] = useState<WordPair[]>([]);
  const [currentTarget, setCurrentTarget] = useState<WordPair | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [comboLabel, setComboLabel] = useState<string | null>(null);
  const [roundsWon, setRoundsWon] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const poolIdxRef = useRef(0);
  const { playSuccess, playFailure } = useAudio();

  const loadLevel = useCallback(async (lv: number) => {
    setGameState('loading');
    const pool = await fetchVocab(langCode, 20 + lv * 2);
    setVocabPool(pool);
    poolIdxRef.current = 0;
    balloonsRef.current = [];
    setRoundsWon(0);
    setCombo(0);
    setTimeLeft(TIME_LIMIT);
    setGameState('playing');
  }, [langCode]);

  useEffect(() => { loadLevel(level); }, [loadLevel, level]);

  // Pick next target and fill balloons
  const spawnRound = useCallback((pool: WordPair[], idx: number) => {
    const targetIdx = idx % pool.length;
    const target = pool[targetIdx];
    setCurrentTarget(target);

    // Pick 3 distractors
    const others = pool.filter((_, i) => i !== targetIdx);
    const distractors = [...others].sort(() => Math.random() - 0.5).slice(0, BALLOONS_ON_SCREEN - 1);
    const all = [...distractors, target].sort(() => Math.random() - 0.5);

    const W = 360, H = 480;
    balloonsRef.current = all.map((p, i) => ({
      ...makeBalloon(p, p === target, W, H),
      x: 40 + (i * (W - 80)) / (BALLOONS_ON_SCREEN - 1),
    }));
    poolIdxRef.current = targetIdx + 1;
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && vocabPool.length > 0 && balloonsRef.current.length === 0) {
      spawnRound(vocabPool, poolIdxRef.current);
    }
  }, [gameState, vocabPool, spawnRound]);

  // Timer
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

  // Canvas render loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    let running = true;

    function drawBalloon(b: Balloon) {
      const r = 36;
      ctx.globalAlpha = b.popped ? b.popAlpha : 1;

      // Balloon body
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, r, r * 1.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = b.popped ? '#ffffff' : b.color;
      ctx.fill();

      // Shine
      if (!b.popped) {
        ctx.beginPath();
        ctx.ellipse(b.x - r * 0.3, b.y - r * 0.4, r * 0.28, r * 0.22, -0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fill();
      }

      // Knot
      ctx.beginPath();
      ctx.arc(b.x, b.y + r * 1.2, 4, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();

      // String
      ctx.beginPath();
      ctx.moveTo(b.x, b.y + r * 1.2 + 4);
      ctx.lineTo(b.x + Math.sin(b.id) * 6, b.y + r * 1.2 + 30);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Word label
      if (!b.popped) {
        ctx.fillStyle = '#fff';
        ctx.font = `bold 13px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const text = b.pair.word.length > 8 ? b.pair.word.slice(0, 8) + '…' : b.pair.word;
        ctx.fillText(text, b.x, b.y);
      }
      ctx.globalAlpha = 1;
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      // Sky gradient background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#1a3a5c');
      bg.addColorStop(1, '#2d6a9f');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Clouds
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      [[80,100,60],[200,60,80],[300,140,50]].forEach(([cx,cy,cw]) => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, cw, 22, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update & draw balloons
      balloonsRef.current.forEach((b) => {
        if (b.popped) {
          b.popAlpha -= 0.05;
        } else {
          b.y += b.vy;
          // Gentle sway
          b.x += Math.sin(Date.now() / 1200 + b.id) * 0.3;
        }
        drawBalloon(b);
      });
      // Remove fully faded pops
      balloonsRef.current = balloonsRef.current.filter((b) => !b.popped || b.popAlpha > 0);

      frameRef.current = requestAnimationFrame(draw);
    }
    frameRef.current = requestAnimationFrame(draw);
    return () => { running = false; cancelAnimationFrame(frameRef.current); };
  }, [gameState]);

  function handleTap(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (gameState !== 'playing' || !currentTarget) return;
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 360 / rect.width;
    const scaleY = 480 / rect.height;
    let cx: number, cy: number;
    if ('touches' in e) {
      cx = (e.touches[0].clientX - rect.left) * scaleX;
      cy = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
      cx = (e.clientX - rect.left) * scaleX;
      cy = (e.clientY - rect.top) * scaleY;
    }

    for (const b of balloonsRef.current) {
      if (b.popped) continue;
      const dx = cx - b.x, dy = cy - b.y;
      const r = 36 * 1.2;
      if (dx * dx + dy * dy < r * r * 1.5) {
        b.popped = true;
        b.popAlpha = 1;

        if (b.isTarget) {
          playSuccess();
          const newCombo = combo + 1;
          setCombo(newCombo);
          const xp = 15 + (newCombo >= 3 ? newCombo * 3 : 0);
          setScore((s) => s + xp);
          onXP(xp);
          if (newCombo >= 3) {
            setComboLabel(`COMBO ×${newCombo}!`);
            setTimeout(() => setComboLabel(null), 1200);
          }
          setFeedback({ text: '正确！', ok: true });
          setTimeout(() => setFeedback(null), 700);
          const newRounds = roundsWon + 1;
          setRoundsWon(newRounds);
          if (newRounds >= ROUNDS_TO_WIN) {
            setTimeout(() => { setGameState('won'); onXP(60); }, 500);
          } else {
            setTimeout(() => spawnRound(vocabPool, poolIdxRef.current), 600);
          }
        } else {
          playFailure();
          setCombo(0);
          onHeartLost();
          setFeedback({ text: `错！是「${currentTarget.word}」`, ok: false });
          setTimeout(() => {
            setFeedback(null);
            spawnRound(vocabPool, poolIdxRef.current);
          }, 900);
        }
        return;
      }
    }
  }

  if (gameState === 'loading') {
    return (
      <div className="wh-shell">
        <div className="wh-loading">正在加载词汇…</div>
      </div>
    );
  }

  const timePct = (timeLeft / TIME_LIMIT) * 100;

  return (
    <div className="wh-shell">
      <div className="wh-topbar">
        <button className="wh-back" onClick={onBack}>←</button>
        <span className="wh-title">单词爆破者 Lv.{level}</span>
        <span className="wh-score">{score}分</span>
      </div>

      <div className="wh-timer-track">
        <div className="wh-timer-fill" style={{ width: `${timePct}%`, background: timeLeft < 15 ? '#e05580' : '#36CC8A' }} />
      </div>
      <div className="wh-hud-row">
        <span className="wh-timer-label">{timeLeft}s</span>
        <span className="wh-rounds">{roundsWon}/{ROUNDS_TO_WIN} 关</span>
        {combo >= 3 && <span className="wh-combo">⚡ ×{combo}</span>}
      </div>

      {/* Prompt */}
      {currentTarget && (
        <div className="wh-prompt">
          <span className="wh-prompt-label">射击表示</span>
          <span className="wh-prompt-word">「{currentTarget.meaning}」</span>
          <span className="wh-prompt-label">的气球</span>
        </div>
      )}

      {comboLabel && <div className="wh-combo-pop">{comboLabel}</div>}
      {feedback && (
        <div className={`wh-feedback ${feedback.ok ? 'ok' : 'err'}`}>{feedback.text}</div>
      )}

      <canvas
        ref={canvasRef}
        width={360} height={480}
        className="wh-canvas"
        onClick={handleTap}
        onTouchStart={(e) => { e.preventDefault(); handleTap(e); }}
        style={{ touchAction: 'none' }}
      />

      {(gameState === 'won' || gameState === 'lost') && (
        <div className="wh-overlay">
          <div className="wh-result-box">
            <span className="wh-result-icon">{gameState === 'won' ? '🏆' : '💔'}</span>
            <h3>{gameState === 'won' ? `第${level}关通过！` : '时间到！'}</h3>
            <p>击中：{roundsWon} · 得分：{score}</p>
            {gameState === 'won' && (
              <button className="wh-next-btn" onClick={() => setLevel((l) => l + 1)}>下一关 →</button>
            )}
            <button className="wh-next-btn" style={{ background: 'rgba(255,255,255,.12)' }} onClick={() => loadLevel(level)}>再来一局</button>
            <button className="wh-quit-btn" onClick={onBack}>退出</button>
          </div>
        </div>
      )}
    </div>
  );
};
