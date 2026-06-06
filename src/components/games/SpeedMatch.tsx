import React, { useState, useEffect, useCallback, useRef } from 'react';
import { InfiniteGameGenerator } from '../../lib/InfiniteGameGenerator';

interface SpeedMatchProps {
  langCode: string;
  langName?: string;
  onXP: (delta: number) => void;
  onHeartLost: () => void;
  onBack: () => void;
}

interface Pair {
  id: number;
  word: string;
  translation: string;
  matched: boolean;
}

const FALLBACK_PAIRS: Record<string, [string, string][]> = {
  ja: [['りんご','苹果'],['ねこ','猫'],['いぬ','狗'],['みず','水'],['ほん','书'],['がっこう','学校'],['せんせい','老师'],['ともだち','朋友']],
  en: [['apple','苹果'],['cat','猫'],['dog','狗'],['water','水'],['book','书'],['school','学校'],['teacher','老师'],['friend','朋友']],
  ko: [['사과','苹果'],['고양이','猫'],['개','狗'],['물','水'],['책','书'],['학교','学校'],['선생님','老师'],['친구','朋友']],
  fr: [['pomme','苹果'],['chat','猫'],['chien','狗'],['eau','水'],['livre','书'],['école','学校'],['professeur','老师'],['ami','朋友']],
  es: [['manzana','苹果'],['gato','猫'],['perro','狗'],['agua','水'],['libro','书'],['escuela','学校'],['profesor','老师'],['amigo','朋友']],
  de: [['Apfel','苹果'],['Katze','猫'],['Hund','狗'],['Wasser','水'],['Buch','书'],['Schule','学校'],['Lehrer','老师'],['Freund','朋友']],
  it: [['mela','苹果'],['gatto','猫'],['cane','狗'],['acqua','水'],['libro','书'],['scuola','学校'],['insegnante','老师'],['amico','朋友']],
  pt: [['maçã','苹果'],['gato','猫'],['cão','狗'],['água','水'],['livro','书'],['escola','学校'],['professor','老师'],['amigo','朋友']],
  ar: [['تفاحة','苹果'],['قطة','猫'],['كلب','狗'],['ماء','水'],['كتاب','书'],['مدرسة','学校'],['معلم','老师'],['صديق','朋友']],
  zh: [['hello','你好'],['cat','猫'],['dog','狗'],['water','水'],['book','书'],['school','学校'],['teacher','老师'],['friend','朋友']],
};

export const SpeedMatch: React.FC<SpeedMatchProps> = ({ langCode, langName = '', onXP, onHeartLost, onBack }) => {
  const pairs_raw = FALLBACK_PAIRS[langCode] || FALLBACK_PAIRS.en;
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [leftCards, setLeftCards] = useState<Pair[]>([]);
  const [rightCards, setRightCards] = useState<Pair[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongPair, setWrongPair] = useState<{ left: number; right: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameOver, setGameOver] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateRound = useCallback(() => {
    const count = Math.min(4 + round, pairs_raw.length);
    const shuffled = [...pairs_raw].sort(() => Math.random() - 0.5).slice(0, count);
    const pairs: Pair[] = shuffled.map(([w, t], i) => ({ id: i, word: w, translation: t, matched: false }));
    const left = [...pairs].sort(() => Math.random() - 0.5);
    const right = [...pairs].sort(() => Math.random() - 0.5);
    setLeftCards(left);
    setRightCards(right);
    setMatched(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
    setRoundComplete(false);
    setTimeLeft(45 - round + 5);
  }, [round, pairs_raw]);

  useEffect(() => {
    generateRound();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [round, generateRound]);

  const handleLeftClick = (id: number) => {
    if (matched.has(id)) return;
    setSelectedLeft(id);
    setWrongPair(null);
    if (selectedRight !== null) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id: number) => {
    if (matched.has(id)) return;
    setSelectedRight(id);
    setWrongPair(null);
    if (selectedLeft !== null) {
      checkMatch(selectedLeft, id);
    }
  };

  const checkMatch = (leftId: number, rightId: number) => {
    if (leftId === rightId) {
      const newMatched = new Set(matched);
      newMatched.add(leftId);
      setMatched(newMatched);
      const newCombo = combo + 1;
      setCombo(newCombo);
      const earned = 10 + newCombo * 3;
      setScore(s => s + earned);
      onXP(earned);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (newMatched.size === leftCards.length) {
        setRoundComplete(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    } else {
      setWrongPair({ left: leftId, right: rightId });
      setCombo(0);
      onHeartLost();
      setTimeout(() => setWrongPair(null), 600);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const nextRound = () => {
    setRound(r => r + 1);
    setCombo(0);
  };

  const resetGame = () => {
    setRound(1);
    setScore(0);
    setCombo(0);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div className="sm-wrap">
        <div className="sm-gameover">
          <h2>⏰ 时间到！</h2>
          <p>第 {round} 关 | 得分: {score}</p>
          <div className="sm-go-btns">
            <button className="sm-restart-btn" onClick={resetGame}>🔄 重新开始</button>
            <button className="sm-back-btn" onClick={onBack}>🏠 返回大厅</button>
          </div>
        </div>
      </div>
    );
  }

  if (roundComplete) {
    return (
      <div className="sm-wrap">
        <div className="sm-round-done">
          <h2>🎉 第 {round} 关完成！</h2>
          <p>得分: {score} | 最高连击: {combo}</p>
          <div className="sm-go-btns">
            <button className="sm-next-btn" onClick={nextRound}>▶ 下一关</button>
            <button className="sm-back-btn" onClick={onBack}>🏠 返回大厅</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sm-wrap">
      <div className="sm-header">
        <button className="sm-back" onClick={onBack}>← 返回</button>
        <div className="sm-stats">
          <span>⚡ Lv.{round}</span>
          <span>⭐ {score}分</span>
          {combo > 0 && <span className="sm-combo">🔥 {combo}连击</span>}
        </div>
        <div className="sm-timer" style={{ color: timeLeft <= 10 ? '#e74c3c' : '#333' }}>⏱ {timeLeft}s</div>
      </div>

      <div className="sm-game-area">
        <h3 className="sm-title">速度匹配 · Speed Match</h3>
        <p className="sm-sub">点击左右匹配单词和翻译，越快越好！</p>

        <div className="sm-cards-grid">
          <div className="sm-col">
            {leftCards.map((card) => (
              <button
                key={`l-${card.id}`}
                className={`sm-card left ${matched.has(card.id) ? 'matched' : ''} ${selectedLeft === card.id ? 'selected' : ''} ${wrongPair?.left === card.id ? 'wrong' : ''}`}
                onClick={() => handleLeftClick(card.id)}
                disabled={matched.has(card.id)}
              >
                {card.word}
              </button>
            ))}
          </div>
          <div className="sm-col">
            {rightCards.map((card) => (
              <button
                key={`r-${card.id}`}
                className={`sm-card right ${matched.has(card.id) ? 'matched' : ''} ${selectedRight === card.id ? 'selected' : ''} ${wrongPair?.right === card.id ? 'wrong' : ''}`}
                onClick={() => handleRightClick(card.id)}
                disabled={matched.has(card.id)}
              >
                {card.translation}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
