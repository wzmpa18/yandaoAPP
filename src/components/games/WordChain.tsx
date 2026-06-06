import React, { useState, useEffect, useCallback, useRef } from 'react';
import { InfiniteGameGenerator, type GameContent } from '../../lib/InfiniteGameGenerator';

interface WordChainProps {
  langCode: string;
  langName?: string;
  onXP: (delta: number) => void;
  onHeartLost: () => void;
  onBack: () => void;
}

const WORD_POOL: Record<string, string[]> = {
  ja: ['りんご', 'ごりら', 'らっぱ', 'ぱんだ', 'だるま', 'まくら', 'らーめん', 'めんたい', 'いちご', 'ごはん', 'はんばーぐ', 'ぐらす', 'すし', 'しんかんせん'],
  en: ['apple', 'elephant', 'tiger', 'rabbit', 'turtle', 'eagle', 'eleven', 'nest', 'tree', 'egg', 'grape', 'energy', 'yellow', 'water'],
  ko: ['사과', '과일', '일기', '기차', '차이', '이름', '름이', '이야기', '기린', '린스', '스키', '키위', '위험', '험담'],
  fr: ['pomme', 'enfant', 'table', 'livre', 'école', 'oiseau', 'arbre', 'rue', 'été', 'hiver', 'rose', 'souris', 'serpent'],
  es: ['manzana', 'amigo', 'gato', 'oso', 'árbol', 'luna', 'agua', 'amarillo', 'oro', 'elefante', 'estrella', 'azul', 'lápiz'],
  de: ['Apfel', 'Elefant', 'Tiger', 'Rose', 'Ente', 'Eis', 'Sonne', 'Esel', 'Lampe', 'Erde', 'Engel', 'Lehrer', 'Regen'],
  it: ['mela', 'amico', 'orso', 'oro', 'albero', 'onda', 'ape', 'estate', 'elefante', 'erba', 'aria', 'isola', 'arancio'],
  pt: ['maçã', 'amigo', 'ovo', 'olho', 'ouro', 'urso', 'anel', 'lua', 'água', 'amor', 'rio', 'ilha', 'ave'],
  ar: ['تفاح', 'حب', 'بحر', 'رمل', 'ليمون', 'نور', 'رجل', 'ليل', 'لبن', 'نمر', 'رمان', 'نار', 'ريح'],
  zh: ['苹果', '果树', '树林', '林子', '子女', '女孩', '孩子', '子夜', '夜晚', '晚安', '安静', '静默', '默认'],
};

function getLastChar(word: string, langCode: string): string {
  if (['ja', 'zh', 'ko', 'ar'].includes(langCode)) {
    return word.slice(-1);
  }
  return word.slice(-1).toLowerCase();
}

function getFirstChar(word: string, langCode: string): string {
  if (['ja', 'zh', 'ko', 'ar'].includes(langCode)) {
    return word.slice(0, 1);
  }
  return word.slice(0, 1).toLowerCase();
}

function getRandomWord(pool: string[], used: Set<string>, prevLastChar: string, langCode: string): string {
  const available = pool.filter(w => getFirstChar(w, langCode) === prevLastChar && !used.has(w));
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }
  // Fallback: any unused word
  const remainder = pool.filter(w => !used.has(w));
  return remainder.length > 0 ? remainder[Math.floor(Math.random() * remainder.length)] : pool[Math.floor(Math.random() * pool.length)];
}

export const WordChain: React.FC<WordChainProps> = ({ langCode, langName = '', onXP, onHeartLost, onBack }) => {
  const pool = WORD_POOL[langCode] || WORD_POOL.en;
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [chain, setChain] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [content, setContent] = useState<GameContent[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load game content
  useEffect(() => {
    InfiniteGameGenerator.getRandomContent('word_chain', langCode, level, 5)
      .then(setContent)
      .catch(() => {});
  }, [langCode, level]);

  // Initialize game
  useEffect(() => {
    const first = pool[Math.floor(Math.random() * pool.length)];
    setChain([first]);
    setUsed(new Set([first]));
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(30 + level * 5);
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
  };

  const handleSubmit = useCallback(() => {
    const input = currentInput.trim().toLowerCase();
    if (!input) return;

    const lastWord = chain[chain.length - 1];
    const lastChar = getLastChar(lastWord, langCode);
    const firstChar = getFirstChar(input, langCode);

    if (firstChar !== lastChar) {
      setMessage(`❌ 需要以「${lastChar}」开头！上一词「${lastWord}」尾字母是「${lastChar}」`);
      setCombo(0);
      onHeartLost();
      return;
    }

    if (used.has(input)) {
      setMessage('❌ 这个词已经用过了！');
      setCombo(0);
      onHeartLost();
      return;
    }

    // Valid!
    const newChain = [...chain, input];
    const newUsed = new Set(used);
    newUsed.add(input);
    setChain(newChain);
    setUsed(newUsed);
    setCurrentInput('');
    const newCombo = combo + 1;
    setCombo(newCombo);
    const earnedXP = 5 + newCombo * 2;
    setScore(s => s + earnedXP);
    onXP(earnedXP);
    setMessage(`✅ 正确！+${earnedXP} XP${newCombo > 1 ? ` (${newCombo}连击!)` : ''}`);

    // Level up
    if (newChain.length >= level * 5) {
      setLevel(l => l + 1);
      setMessage(`🎉 升级！进入第 ${level + 1} 关，时间+${(level + 1) * 5}秒`);
    }

    // AI responds after a delay
    setIsAIThinking(true);
    setTimeout(() => {
      const aiWord = getRandomWord(pool, new Set([...newUsed, input]), getLastChar(input, langCode), langCode);
      const aiNewChain = [...newChain, aiWord];
      const aiNewUsed = new Set([...newUsed, input, aiWord]);
      setChain(aiNewChain);
      setUsed(aiNewUsed);
      setIsAIThinking(false);
      setMessage(message => message + `\n🤖 AI出招：「${aiWord}」`);
      // Reset timer
      if (timerRef.current) clearInterval(timerRef.current);
      startTimer();
    }, 1000 + Math.random() * 1500);

    startTimer();
  }, [currentInput, chain, used, combo, langCode, level, pool, onXP, onHeartLost]);

  const resetGame = () => {
    const first = pool[Math.floor(Math.random() * pool.length)];
    setChain([first]);
    setUsed(new Set([first]));
    setScore(0);
    setLevel(1);
    setCombo(0);
    setMessage('');
    setGameOver(false);
    setCurrentInput('');
    startTimer();
  };

  return (
    <div className="wc-wrap">
      <div className="wc-header">
        <button className="wc-back" onClick={onBack}>← 返回</button>
        <div className="wc-stats">
          <span className="wc-stat">⚡ Lv.{level}</span>
          <span className="wc-stat">⭐ {score}分</span>
          {combo > 0 && <span className="wc-stat-combo">🔥 {combo}连击</span>}
        </div>
        <div className="wc-timer" style={{ color: timeLeft <= 10 ? '#e74c3c' : '#333' }}>
          ⏱ {timeLeft}s
        </div>
      </div>

      {gameOver ? (
        <div className="wc-gameover">
          <div className="wc-go-icon">🏁</div>
          <h2>时间到！</h2>
          <p>你完成了 {chain.length} 个词语接龙</p>
          <p>达到第 {level} 关，获得 {score} 分</p>
          <div className="wc-go-btns">
            <button className="wc-restart-btn" onClick={resetGame}>🔄 再来一局</button>
            <button className="wc-back-btn" onClick={onBack}>🏠 返回大厅</button>
          </div>
        </div>
      ) : (
        <>
          <div className="wc-chain-area">
            <h3 className="wc-chain-title">词语接龙 · Word Chain</h3>
            <p className="wc-chain-sub">接上前一个词的最后一个字母/字</p>
            <div className="wc-chain-list">
              {chain.map((w, i) => (
                <span key={i} className={`wc-chain-word ${i === chain.length - 1 && !isAIThinking ? 'last' : ''} ${i === chain.length - 2 && isAIThinking ? 'ai-thinking' : ''}`}>
                  {w}
                  {i < chain.length - 1 && <span className="wc-chain-arrow">→</span>}
                </span>
              ))}
              {isAIThinking && <span className="wc-chain-thinking">🤔 AI思考中...</span>}
            </div>
          </div>

          {message && <div className="wc-message" dangerouslySetInnerHTML={{__html: message.replace(/\n/g, '<br/>')}} />}

          <div className="wc-input-area">
            <input
              className="wc-input"
              value={currentInput}
              placeholder={`请输入以「${getLastChar(chain[chain.length - 1], langCode)}」开头的词...`}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
              disabled={isAIThinking}
              autoFocus
            />
            <button className="wc-submit" onClick={handleSubmit} disabled={isAIThinking || !currentInput.trim()}>
              提交
            </button>
          </div>

          <div className="wc-tip">
            💡 提示：上一词「{chain[chain.length - 1]}」以「{getLastChar(chain[chain.length - 1], langCode)}」结尾
          </div>
        </>
      )}
    </div>
  );
};
