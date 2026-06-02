import { useState } from 'react';
import type { GameMode, GameType } from '../lib/gameService';

interface GameModeSelectorProps {
  gameType: GameType;
  language: string;
  onStart: (mode: GameMode, questionCount: number) => void;
}

const GAME_TYPES: { type: GameType; name: string; icon: string; description: string }[] = [
  { type: 'word_hunter', name: '单词猎人', icon: '🔍', description: '找出正确的翻译' },
  { type: 'grammar_planet', name: '语法星球', icon: '📚', description: '练习语法知识' },
  { type: 'sentence_builder', name: '连词成句', icon: '📝', description: '排列单词成句子' },
  { type: 'vocab_quiz', name: '词汇测验', icon: '✅', description: '测试词汇掌握' },
];

const QUESTION_COUNTS = [5, 10, 15, 20];

export function GameModeSelector({ gameType, language, onStart }: GameModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('infinite');
  const [selectedCount, setSelectedCount] = useState(10);

  const handleStart = () => {
    onStart(selectedMode, selectedCount);
  };

  return (
    <div className="game-mode-selector">
      <div className="selector-header">
        <h2>选择游戏模式</h2>
        <p className="subtitle">语言: {language}</p>
      </div>

      <div className="mode-section">
        <h3>游戏模式</h3>
        <div className="mode-options">
          <button
            className={`mode-option ${selectedMode === 'infinite' ? 'selected' : ''}`}
            onClick={() => setSelectedMode('infinite')}
          >
            <div className="mode-icon">🔄</div>
            <div className="mode-info">
              <h4>无限模式</h4>
              <p>每次题目都不同，挑战无限可能</p>
            </div>
          </button>
          <button
            className={`mode-option ${selectedMode === 'repeat' ? 'selected' : ''}`}
            onClick={() => setSelectedMode('repeat')}
          >
            <div className="mode-icon">📖</div>
            <div className="mode-info">
              <h4>重复模式</h4>
              <p>重复练习同一套题，直到掌握</p>
            </div>
          </button>
        </div>
      </div>

      <div className="count-section">
        <h3>题目数量</h3>
        <div className="count-options">
          {QUESTION_COUNTS.map((count) => (
            <button
              key={count}
              className={`count-option ${selectedCount === count ? 'selected' : ''}`}
              onClick={() => setSelectedCount(count)}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div className="game-type-section">
        <h3>游戏类型</h3>
        <div className="game-type-grid">
          {GAME_TYPES.map((game) => (
            <div
              key={game.type}
              className={`game-type-card ${game.type === gameType ? 'selected' : ''}`}
            >
              <span className="game-icon">{game.icon}</span>
              <span className="game-name">{game.name}</span>
              <span className="game-desc">{game.description}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="start-btn" onClick={handleStart}>
        开始游戏
      </button>
    </div>
  );
}

export default GameModeSelector;