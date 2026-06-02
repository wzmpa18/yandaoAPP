import React, { useState, useRef, useEffect } from 'react';

export interface Language {
  code: string;
  name: string;
  name_native: string;
  name_zh: string;
  flag: string;
  color: string;
  order_index: number;
}

// Fallback Chinese display names when DB name_zh is missing
export const LANG_ZH: Record<string, string> = {
  ja: '日语',
  en: '英语',
  ko: '韩语',
  fr: '法语',
  es: '西班牙语',
  de: '德语',
  it: '意大利语',
  pt: '葡萄牙语',
  ar: '阿拉伯语',
  zh: '中文进阶',
};

export function getLangZh(lang: Language): string {
  return lang.name_zh || LANG_ZH[lang.code] || lang.name;
}

interface LanguageSelectorProps {
  languages: Language[];
  selected: string;
  onSelect: (code: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languages.find((l) => l.code === selected);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  return (
    <div className="lang-selector" ref={ref}>
      <button className="lang-selector-trigger" onClick={() => setOpen(!open)}>
        <span className="lang-flag">{current?.flag}</span>
        <span className="lang-native">{current ? getLangZh(current) : ''}</span>
        <svg
          className={`lang-chevron ${open ? 'open' : ''}`}
          width="12" height="12" viewBox="0 0 12 12" fill="none"
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="lang-dropdown">
          <p className="lang-dropdown-label">选择学习语言</p>
          {[...languages].sort((a, b) => a.order_index - b.order_index).map((lang) => (
            <button
              key={lang.code}
              className={`lang-option ${lang.code === selected ? 'selected' : ''}`}
              onClick={() => { onSelect(lang.code); setOpen(false); }}
            >
              <span className="lang-flag">{lang.flag}</span>
              <span className="lang-option-text">
                <span className="lang-option-native">{getLangZh(lang)}</span>
                <span className="lang-option-zh">{lang.name_native}</span>
              </span>
              {lang.code === selected && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7L6 11L12 3" stroke={lang.color || 'var(--gold)'} strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
