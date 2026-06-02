import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { InfiniteGameGenerator, GameContent } from '../../lib/InfiniteGameGenerator';
import { useAudio } from '../../lib/useAudio';

interface EscapeRoomProps {
  langCode: string;
  onXP: (delta: number) => void;
  onHeartLost: () => void;
  onBack: () => void;
}

interface Puzzle {
  type: 'choice' | 'fill' | 'speech';
  question: string;
  answer: string;
  hint: string;
  options?: string[];
}

interface Scene {
  name: string;
  icon: string;
  puzzles: Puzzle[];
  keys: number; // keys collected so far
}

const SCENE_ICONS: Record<string, string> = {
  コンビニ: '🏪', Airport: '✈️', Restaurant: '🍽', 편의점: '🏪',
  Café: '☕', Bahnhof: '🚂', Mercado: '🛒', Ristorante: '🍕',
  面试: '💼', المطعم: '🍴',
  default: '🏠',
};

function buildPuzzle(c: GameContent): Puzzle {
  const d = c.data as { clue?: string; answer?: string; hint?: string; scene?: string };
  const clue = String(d.clue ?? '请回答以下问题');
  const answer = String(d.answer ?? '');
  const hint = String(d.hint ?? '');
  const distractors = ['不好意思', '我不知道', '对不起打扰了'];
  const options = [answer, ...distractors].sort(() => Math.random() - 0.5);
  return { type: 'choice', question: clue, answer, hint, options };
}

export const EscapeRoom: React.FC<EscapeRoomProps> = ({ langCode, onXP, onHeartLost, onBack }) => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [keysCollected, setKeysCollected] = useState(0);
  const [speechInput, setSpeechInput] = useState('');
  const [fillInput, setFillInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [state, setState] = useState<'loading' | 'playing' | 'scene_clear' | 'won'>('loading');
  const [score, setScore] = useState(0);
  const [badge, setBadge] = useState(false);
  const { playSuccess, playFailure } = useAudio();

  const load = useCallback(async () => {
    setState('loading');

    // Try DB scenarios first
    let contents: GameContent[] = [];
    const { data } = await supabase
      .from('scenarios')
      .select('id,title,title_zh,description')
      .limit(9);

    if (data && data.length >= 3) {
      // Build 3 scenes from scenarios
      const scenarioItems = data.sort(() => Math.random() - 0.5).slice(0, 3);
      const extraContent = await InfiniteGameGenerator.getRandomContent('escape_room', langCode, 5, 9);
      contents = extraContent;
      const newScenes: Scene[] = scenarioItems.map((s, si) => {
        const puzzleContent = extraContent.slice(si * 3, si * 3 + 3);
        return {
          name: String(s.title_zh ?? s.title ?? '场景'),
          icon: SCENE_ICONS[String(s.title ?? '')] ?? SCENE_ICONS.default,
          puzzles: puzzleContent.map(buildPuzzle),
          keys: 0,
        };
      });
      setScenes(newScenes);
    } else {
      // Fallback: 3 scenes from DB escape_room content
      contents = await InfiniteGameGenerator.getRandomContent('escape_room', langCode, 5, 9);
      const sceneNames = ['便利店', '机场', '餐厅'];
      const newScenes: Scene[] = sceneNames.map((name, si) => ({
        name,
        icon: SCENE_ICONS[name] ?? SCENE_ICONS.default,
        puzzles: contents.slice(si * 3, si * 3 + 3).map(buildPuzzle),
        keys: 0,
      }));
      setScenes(newScenes);
    }

    setSceneIdx(0);
    setPuzzleIdx(0);
    setKeysCollected(0);
    setScore(0);
    setState('playing');
  }, [langCode]);

  useEffect(() => { load(); }, [load]);

  function checkAnswer(userAnswer: string) {
    const scene = scenes[sceneIdx];
    if (!scene) return;
    const puzzle = scene.puzzles[puzzleIdx];
    if (!puzzle) return;

    const correct = userAnswer.trim().toLowerCase().includes(puzzle.answer.toLowerCase().slice(0, 4));

    if (correct) {
      playSuccess();
      setFeedback('correct');
      setScore((s) => s + 20);
      onXP(20);
      const newKeys = keysCollected + 1;
      setKeysCollected(newKeys);

      setTimeout(() => {
        setFeedback(null);
        setFillInput('');
        setSpeechInput('');

        const nextPuzzle = puzzleIdx + 1;
        if (nextPuzzle >= 3) {
          // Scene cleared
          if (sceneIdx >= 2) {
            setState('won');
            setBadge(true);
            onXP(100);
          } else {
            setState('scene_clear');
          }
        } else {
          setPuzzleIdx(nextPuzzle);
        }
      }, 800);
    } else {
      playFailure();
      setFeedback('wrong');
      onHeartLost();
      setTimeout(() => setFeedback(null), 700);
    }
  }

  function startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechInput(scenes[sceneIdx]?.puzzles[puzzleIdx]?.answer ?? '');
      return;
    }
    const SRClass = (window as Window & { webkitSpeechRecognition?: new() => SpeechRecognition; SpeechRecognition?: new() => SpeechRecognition }).webkitSpeechRecognition ?? (window as Window & { SpeechRecognition?: new() => SpeechRecognition }).SpeechRecognition;
    if (!SRClass) return;
    const sr = new SRClass();
    sr.lang = langCode === 'ja' ? 'ja-JP' : langCode === 'ko' ? 'ko-KR' : langCode === 'zh' ? 'zh-CN' : 'en-US';
    sr.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript;
      setSpeechInput(transcript);
      checkAnswer(transcript);
    };
    sr.onerror = () => setSpeechInput('识别失败，请重试');
    sr.start();
  }

  const scene = scenes[sceneIdx];
  const puzzle = scene?.puzzles[puzzleIdx];

  if (state === 'loading' || !scene || !puzzle) {
    return <div className="er-shell"><div className="er-loading">加载场景…</div></div>;
  }

  return (
    <div className="er-shell">
      <div className="er-topbar">
        <button className="er-back" onClick={onBack}>←</button>
        <span className="er-title">密室逃脱</span>
        <span className="er-score">分: {score}</span>
      </div>

      {/* Scene header */}
      <div className="er-scene-header">
        <span className="er-scene-icon">{scene.icon}</span>
        <div>
          <span className="er-scene-name">{scene.name}</span>
          <div className="er-scene-progress">
            场景 {sceneIdx + 1}/3 · 谜题 {puzzleIdx + 1}/3
          </div>
        </div>
        <div className="er-keys">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`er-key ${i < (puzzleIdx) ? 'got' : ''}`}>🔑</span>
          ))}
        </div>
      </div>

      {/* Puzzle card */}
      <div className={`er-puzzle-card ${feedback === 'correct' ? 'flash-ok' : feedback === 'wrong' ? 'flash-err' : ''}`}>
        <p className="er-puzzle-type">
          {puzzle.type === 'speech' ? '🎤 跟读题' : puzzle.type === 'fill' ? '✍️ 填空题' : '📋 选择题'}
        </p>
        <p className="er-puzzle-q">{puzzle.question}</p>
        <p className="er-puzzle-hint">提示：{puzzle.hint}</p>

        {puzzle.type === 'choice' && puzzle.options && (
          <div className="er-options">
            {puzzle.options.map((opt, i) => (
              <button key={i} className="er-option" onClick={() => checkAnswer(opt)}>{opt}</button>
            ))}
          </div>
        )}

        {puzzle.type === 'fill' && (
          <div className="er-fill-wrap">
            <input
              className="er-fill-input"
              value={fillInput}
              placeholder="请输入答案…"
              onChange={(e) => setFillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer(fillInput)}
            />
            <button className="er-submit" onClick={() => checkAnswer(fillInput)}>提交</button>
          </div>
        )}

        {puzzle.type === 'speech' && (
          <div className="er-speech-wrap">
            <button className="er-speech-btn" onClick={startSpeechRecognition}>🎤 开始跟读</button>
            {speechInput && <p className="er-speech-result">识别：{speechInput}</p>}
          </div>
        )}
      </div>

      {/* Scene cleared overlay */}
      {state === 'scene_clear' && (
        <div className="er-overlay">
          <div className="er-result-box">
            <span className="er-result-icon">🔓</span>
            <h3>场景{sceneIdx + 1}通关！</h3>
            <p>收集了3把钥匙</p>
            <button className="er-next-btn" onClick={() => {
              setSceneIdx((i) => i + 1);
              setPuzzleIdx(0);
              setState('playing');
            }}>进入下一场景 →</button>
          </div>
        </div>
      )}

      {state === 'won' && (
        <div className="er-overlay">
          <div className="er-result-box">
            <span className="er-result-icon">🏅</span>
            <h3>逃脱成功！</h3>
            {badge && <div className="er-badge">🎖️ 逃脱大师 徽章已获得</div>}
            <p>总得分：{score}</p>
            <button className="er-next-btn" onClick={load}>再来一次</button>
            <button className="er-quit-btn" onClick={onBack}>退出</button>
          </div>
        </div>
      )}
    </div>
  );
};
