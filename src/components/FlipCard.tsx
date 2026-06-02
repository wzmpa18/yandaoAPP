import React, { useState } from 'react';

interface FlipCardProps {
  targetLang: string;
  nativeLang: string;
  pronunciation: string;
  contextNote: string;
  hackTitle?: string;
  hackContent?: string;
  hackType?: string;
  visualFormula?: string;
  chineseHomophone?: string;
  orderIndex: number;
  isCompleted: boolean;
  isLocked: boolean;
  onMarkComplete: () => void;
}

const hackColors: Record<string, { bg: string; text: string; label: string }> = {
  pattern:  { bg: '#7A9B71', text: '#fff', label: 'Pattern'  },
  mnemonic: { bg: '#C9A574', text: '#fff', label: 'Mnemonic' },
  shortcut: { bg: '#5B8FA8', text: '#fff', label: 'Shortcut' },
  cultural: { bg: '#C9553D', text: '#fff', label: 'Cultural' },
};

export const FlipCard: React.FC<FlipCardProps> = ({
  targetLang, nativeLang, pronunciation, contextNote,
  hackTitle, hackContent, hackType, visualFormula, chineseHomophone,
  orderIndex, isCompleted, isLocked, onMarkComplete,
}) => {
  const [flipped, setFlipped] = useState(false);
  const [showHack, setShowHack] = useState(false);
  const hack = hackColors[hackType ?? ''] ?? hackColors.shortcut;

  if (isLocked) {
    return (
      <div className="fc-wrap">
        <div className="fc-num locked">🔒</div>
        <div className="fc fc-locked">
          <div className="fc-face">
            <div className="lock-emoji">🔒</div>
            <p className="lock-msg">Complete the previous phrase first</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fc-wrap">
      <div className={`fc-num ${isCompleted ? 'done' : ''}`}>
        {isCompleted ? '✓' : orderIndex}
      </div>

      <div
        className={`fc ${flipped ? 'flipped' : ''}`}
        onClick={() => { setFlipped(!flipped); setShowHack(false); }}
      >
        {/* FRONT */}
        <div className="fc-face fc-front">
          <span className="fc-badge">Target</span>
          <p className="fc-target">{targetLang}</p>
          <p className="fc-pron">{pronunciation}</p>
          {chineseHomophone && (
            <div className="fc-homophone-hint">
              <span className="fc-zh-label">中式谐音</span>
              <span className="fc-zh-preview">{chineseHomophone.slice(0, 22)}…</span>
            </div>
          )}
          <span className="fc-tap-hint">Tap to reveal meaning</span>
        </div>

        {/* BACK */}
        <div className="fc-face fc-back">
          <span className="fc-badge">Meaning</span>
          <p className="fc-native">{nativeLang}</p>
          <p className="fc-context">{contextNote}</p>

          {chineseHomophone && (
            <div className="fc-homophone-panel">
              <span className="fc-zh-label-back">中式谐音偏方</span>
              <p className="fc-zh-text">{chineseHomophone}</p>
            </div>
          )}

          {hackTitle && (
            <button
              className="fc-hack-btn"
              onClick={(e) => { e.stopPropagation(); setShowHack(!showHack); }}
            >
              <span className="fc-hack-arrow">{showHack ? '▼' : '▶'}</span>
              <span className="fc-hack-badge" style={{ background: hack.bg, color: hack.text }}>
                {hack.label}
              </span>
              <span className="fc-hack-title">{hackTitle}</span>
            </button>
          )}

          {showHack && hackContent && (
            <div className="fc-hack-panel" style={{ borderLeftColor: hack.bg }}>
              {visualFormula && (
                <p className="fc-hack-formula" style={{ color: hack.bg }}>{visualFormula}</p>
              )}
              <p className="fc-hack-body">{hackContent}</p>
            </div>
          )}
        </div>
      </div>

      <button
        className={`fc-master-btn ${isCompleted ? 'done' : ''}`}
        onClick={(e) => { e.stopPropagation(); onMarkComplete(); }}
      >
        {isCompleted ? '✓ Mastered' : 'Mark Mastered'}
      </button>
    </div>
  );
};
