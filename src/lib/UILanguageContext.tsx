import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  UILang, Strings, TRANSLATIONS, getStoredUILang, setStoredUILang,
} from './i18n';

interface UILanguageContextValue {
  uiLang: UILang;
  setUILang: (lang: UILang) => void;
  s: Strings;  // shorthand: all translated strings for current uiLang
}

const UILanguageContext = createContext<UILanguageContextValue>({
  uiLang: 'zh',
  setUILang: () => {},
  s: TRANSLATIONS.zh,
});

export const UILanguageProvider: React.FC<{ children: React.ReactNode; initial?: UILang }> = ({
  children,
  initial,
}) => {
  const [uiLang, setUILangState] = useState<UILang>(initial ?? getStoredUILang());

  const setUILang = useCallback((lang: UILang) => {
    setStoredUILang(lang);
    setUILangState(lang);
  }, []);

  const value: UILanguageContextValue = {
    uiLang,
    setUILang,
    s: TRANSLATIONS[uiLang],
  };

  return (
    <UILanguageContext.Provider value={value}>
      {children}
    </UILanguageContext.Provider>
  );
};

/** Primary hook — use this in any component to get translated strings. */
export function useUI() {
  return useContext(UILanguageContext);
}
