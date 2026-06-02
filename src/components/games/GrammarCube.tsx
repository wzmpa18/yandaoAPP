import React, { useState, useEffect, useCallback } from 'react';
import { InfiniteGameGenerator, GameContent } from '../../lib/InfiniteGameGenerator';
import { useAudio } from '../../lib/useAudio';

interface GrammarCubeProps {
  langCode: string;
  onXP: (delta: number) => void;
  onHeartLost: () => void;
  onBack: () => void;
}

interface Face {
  id: number;
  content: GameContent;
  solved: boolean;
  color: string;
}

const FACE_LABELS = ['前', '后', '左', '右', '上', '下'];
const FACE_ROTATIONS = [
  'rotateY(0deg)',
  'rotateY(180deg)',
  'rotateY(-90deg)',
  'rotateY(90deg)',
  'rotateX(90deg)',
  'rotateX(-90deg)',
];

export const GrammarCube: React.FC<GrammarCubeProps> = ({ langCode, onXP, onHeartLost, onBack }) => {
  const [faces, setFaces] = useState<Face[]>([]);
  const [activeFace, setActiveFace] = useState(0);
  const [rotation, setRotation] = useState({ x: -20, y: 30 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [state, setState] = useState<'loading' | 'playing' | 'won'>('loading');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const { playSuccess, playFailure } = useAudio();

  const load = useCallback(async () => {
    setState('loading');
    const items = await InfiniteGameGenerator.getRandomContent('grammar_cube', langCode, 5, 6);
    const newFaces: Face[] = items.slice(0, 6).map((item, i) => ({
      id: i,
      content: item,
      solved: false,
      color: 'var(--xuan-card)',
    }));
    setFaces(newFaces);
    setActiveFace(0);
    setScore(0);
    setState('playing');
  }, [langCode]);

  useEffect(() => { load(); }, [load]);

  function handleAnswer(optionIndex: number, options: string[], correctMeaning: string) {
    const chosen = options[optionIndex];
    const correct = chosen === correctMeaning;
    if (correct) {
      playSuccess();
      setFeedback('correct');
      setScore((s) => s + 15);
      onXP(15);
      setFaces((prev) => {
        const updated = prev.map((f, i) =>
          i === activeFace ? { ...f, solved: true, color: 'var(--bamboo)' } : f
        );
        const allSolved = updated.every((f) => f.solved);
        if (allSolved) setTimeout(() => setState('won'), 800);
        return updated;
      });
      setTimeout(() => {
        setFeedback(null);
        setActiveFace((a) => (a + 1) % 6);
        setRotation((r) => ({ x: r.x, y: r.y + 90 }));
      }, 700);
    } else {
      playFailure();
      setFeedback('wrong');
      onHeartLost();
      setTimeout(() => setFeedback(null), 700);
    }
  }

  const face = faces[activeFace];
  const options = face ? (face.content.data.options as string[]) ?? [] : [];
  const meaning = face ? String(face.content.data.meaning ?? '') : '';

  if (state === 'loading') return <div className="gc-shell"><div className="gc-loading">加载语法题…</div></div>;

  return (
    <div className="gc-shell">
      <div className="gc-topbar">
        <button className="gc-back" onClick={onBack}>←</button>
        <span className="gc-title">语法魔方</span>
        <span className="gc-score">分: {score}</span>
      </div>

      <p className="gc-sub">解开6个语法面，全对通关</p>

      {/* Progress dots */}
      <div className="gc-progress">
        {faces.map((f, i) => (
          <span key={i} className={`gc-dot ${f.solved ? 'solved' : i === activeFace ? 'active' : ''}`} />
        ))}
      </div>

      {/* 3D cube visualization */}
      <div
        className="gc-cube-wrap"
        onMouseDown={(e) => { setDragging(true); setDragStart({ x: e.clientX, y: e.clientY }); }}
        onMouseMove={(e) => {
          if (!dragging) return;
          setRotation((r) => ({
            x: r.x - (e.clientY - dragStart.y) * 0.3,
            y: r.y + (e.clientX - dragStart.x) * 0.3,
          }));
          setDragStart({ x: e.clientX, y: e.clientY });
        }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
      >
        <div
          className="gc-cube"
          style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
        >
          {faces.map((f, i) => (
            <div
              key={f.id}
              className={`gc-face gc-face-${i} ${f.solved ? 'solved' : i === activeFace ? 'active' : ''}`}
              style={{ transform: FACE_ROTATIONS[i] + ' translateZ(60px)', background: f.color }}
            >
              <span className="gc-face-label">{FACE_LABELS[i]}</span>
              <span className="gc-face-pattern">{String(f.content.data.pattern ?? '')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active question card */}
      {face && state === 'playing' && (
        <div className={`gc-question-card ${feedback === 'correct' ? 'correct' : feedback === 'wrong' ? 'wrong' : ''}`}>
          <p className="gc-q-pattern">"{String(face.content.data.pattern ?? '')}"</p>
          <p className="gc-q-example">例：{String(face.content.data.example ?? '')}</p>
          <p className="gc-q-ask">这个语法的意思是？</p>
          <div className="gc-options">
            {options.map((opt, i) => (
              <button
                key={i}
                className="gc-option"
                onClick={() => handleAnswer(i, options, meaning)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {state === 'won' && (
        <div className="gc-overlay">
          <div className="gc-result-box">
            <span className="gc-result-icon">🌟</span>
            <h3>语法魔方通关！</h3>
            <p>得分：{score}</p>
            <button className="gc-next-btn" onClick={load}>再来一局</button>
            <button className="gc-quit-btn" onClick={onBack}>退出</button>
          </div>
        </div>
      )}
    </div>
  );
};
