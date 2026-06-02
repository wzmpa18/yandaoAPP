import React, { useState } from 'react';
import { THEMES, ThemeKey, applyTheme, getStoredTheme } from '../lib/theme';

interface ThemePickerProps {
  onClose: () => void;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({ onClose }) => {
  const [active, setActive] = useState<ThemeKey>(getStoredTheme);

  function select(key: ThemeKey) {
    setActive(key);
    applyTheme(key);
  }

  return (
    <div className="tp-overlay" onClick={onClose}>
      <div className="tp-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="tp-header">
          <span className="tp-title">选择主题皮肤</span>
          <button className="tp-close" onClick={onClose}>✕</button>
        </div>
        <div className="tp-grid">
          {THEMES.map((t) => (
            <button
              key={t.key}
              className={`tp-card ${active === t.key ? 'active' : ''}`}
              data-theme-preview={t.key}
              onClick={() => select(t.key)}
            >
              <span className="tp-emoji">{t.emoji}</span>
              <span className="tp-label">{t.label}</span>
              <span className="tp-desc">{t.desc}</span>
              {active === t.key && <span className="tp-check">✓</span>}
              <div className="tp-swatches">
                {t.previewColors.map((c, i) => (
                  <span key={i} className="tp-swatch" style={{ background: c }} />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
