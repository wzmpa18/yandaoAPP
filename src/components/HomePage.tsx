import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TaijiCompass, KoiFish } from './TaijiCompass';
import { Language, getLangZh } from './LanguageSelector';
import { FlipCard } from './FlipCard';
import { AudioShadow } from './AudioShadow';
import { FloatingBack } from './FloatingBack';
import { Confetti } from './Confetti';

/* ──────────────────── Types ──────────────────── */

interface Scenario {
  id: string;
  title: string;
  title_zh: string;
  description: string;
  icon: string;
  grid_position: number;
  category: string;
  color: string;
  order_index: number;
  language_code: string;
  phrase_count?: number;
}

interface Phrase {
  id: string;
  target_lang: string;
  native_lang: string;
  pronunciation: string;
  context_note: string;
  order_index: number;
}

interface Hack {
  id: string;
  phrase_id: string;
  title: string;
  content: string;
  type: string;
  visual_formula: string;
  chinese_homophone: string;
}

type Route = { view: 'home' } | { view: 'scenario'; id: string };

function loadCompleted(): Set<string> {
  try {
    const s = localStorage.getItem('v5_completed');
    return s ? new Set(JSON.parse(s)) : new Set();
  } catch { return new Set(); }
}

function saveCompleted(s: Set<string>) {
  localStorage.setItem('v5_completed', JSON.stringify([...s]));
}

function darkenHex(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (n >> 16) - 40);
  const g = Math.max(0, ((n >> 8) & 0xff) - 40);
  const b = Math.max(0, (n & 0xff) - 40);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/* ──────────────────── Props ──────────────────── */

interface HomePageProps {
  externalLang?: string;
  externalLanguages?: Language[];
  onXP?: (delta: number) => void;
}

/* ──────────────────── Root ──────────────────── */

export const HomePage: React.FC<HomePageProps> = ({
  externalLang,
  externalLanguages,
  onXP,
}) => {
  const activeLang = externalLang || 'ja';
  const [scenarios, setScenarios]     = useState<Scenario[]>([]);
  const [loadingScen, setLoadingScen] = useState(true);
  const [route, setRoute]             = useState<Route>({ view: 'home' });
  const [completed, setCompleted]     = useState<Set<string>>(loadCompleted);
  const [confetti, setConfetti]       = useState(false);

  const currentLang = (externalLanguages ?? []).find((l) => l.code === activeLang);

  // Re-fetch scenarios when external lang changes
  useEffect(() => {
    setLoadingScen(true);
    setRoute({ view: 'home' });
    supabase
      .from('scenarios')
      .select('*')
      .eq('language_code', externalLang || 'ja')
      .order('order_index')
      .then(async ({ data }) => {
        const rows = data ?? [];
        const withCounts = await Promise.all(
          rows.map(async (s: Scenario) => {
            const { count } = await supabase
              .from('phrases')
              .select('*', { count: 'exact', head: true })
              .eq('scenario_id', s.id);
            return { ...s, phrase_count: count ?? 0 };
          })
        );
        setScenarios(withCounts);
        setLoadingScen(false);
      });
  }, [externalLang]);

  function fireConfetti(ms = 2400) {
    setConfetti(true);
    setTimeout(() => setConfetti(false), ms);
  }

  function markPhrase(phraseId: string, total: number) {
    setCompleted((prev) => {
      const next = new Set(prev);
      const wasNew = !next.has(phraseId);
      if (wasNew) {
        next.add(phraseId);
        onXP?.(10);
        if (next.size % 5 === 0) fireConfetti();
        if (total > 0 && [...next].length % total === 0) fireConfetti(3000);
      } else {
        next.delete(phraseId);
        onXP?.(-10);
      }
      saveCompleted(next);
      return next;
    });
  }

  function navigate(r: Route) {
    setRoute(r);
    window.scrollTo({ top: 0 });
  }

  if (route.view === 'scenario') {
    return (
      <>
        <Confetti active={confetti} />
        <ScenarioPage
          scenarioId={route.id}
          completed={completed}
          onMark={(id, total) => markPhrase(id, total)}
          onComplete={fireConfetti}
          onBack={() => navigate({ view: 'home' })}
        />
      </>
    );
  }

  return (
    <>
      <Confetti active={confetti} />
      <div className="zen-page">

        {/* Hero */}
        <section className="zen-hero">
          <div className="zen-hero-content">
            <KoiFish size={48} />
            <h1 className="zen-hero-title">{currentLang ? getLangZh(currentLang) : '语言'} 学习路线</h1>
            <p className="zen-hero-sub">{currentLang?.name_native ?? ''} · 真实场景对话</p>
          </div>
          <div className="zen-hero-taiji">
            <TaijiCompass size={80} />
          </div>
        </section>

        {/* Compass Grid */}
        <section className="zen-compass-section">
          <h2 className="zen-section-title">Situational Compass</h2>
          <p className="zen-section-desc">Choose your real-world scenario</p>

          {loadingScen ? (
            <div className="zen-grid-loading"><TaijiCompass size={36} /></div>
          ) : (
            <CompassGrid
              scenarios={scenarios}
              completed={completed}
              onOpen={(id) => navigate({ view: 'scenario', id })}
            />
          )}
        </section>
      </div>
    </>
  );
};

/* ──────────────────── Compass Grid ──────────────────── */

interface CompassGridProps {
  scenarios: Scenario[];
  completed: Set<string>;
  onOpen: (id: string) => void;
}

const CompassGrid: React.FC<CompassGridProps> = ({ scenarios, onOpen }) => {
  const positions = Array.from({ length: 9 }, (_, i) => i + 1);
  const sorted = [...scenarios].sort((a, b) => a.order_index - b.order_index);

  function isUnlocked(s: Scenario) {
    if (s.order_index <= 1) return true;
    return !!sorted.find((x) => x.order_index === s.order_index - 1);
  }

  return (
    <div className="zen-compass-grid">
      {positions.map((pos) => {
        const s = scenarios.find((x) => x.grid_position === pos);
        if (!s) return <div key={pos} className="zen-grid-cell zen-grid-empty" />;
        const unlocked = isUnlocked(s);
        return (
          <button
            key={pos}
            className={`zen-grid-cell ${unlocked ? '' : 'locked'}`}
            style={{ '--accent': s.color } as React.CSSProperties}
            onClick={() => unlocked && onOpen(s.id)}
            disabled={!unlocked}
          >
            {!unlocked && <span className="zen-grid-lock-badge">🔒</span>}
            <span className="zen-grid-icon">{s.icon}</span>
            <span className="zen-grid-title">{s.title}</span>
            <span className="zen-grid-zh">{s.title_zh}</span>
            {(s.phrase_count ?? 0) > 0 && (
              <span className="zen-grid-count">{s.phrase_count} phrases</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

/* ──────────────────── Scenario Page ──────────────────── */

interface ScenarioPageProps {
  scenarioId: string;
  completed: Set<string>;
  onMark: (phraseId: string, total: number) => void;
  onComplete: () => void;
  onBack: () => void;
}

const ScenarioPage: React.FC<ScenarioPageProps> = ({
  scenarioId, completed, onMark, onComplete, onBack,
}) => {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [phrases, setPhrases]   = useState<Phrase[]>([]);
  const [hacks, setHacks]       = useState<Hack[]>([]);
  const [idx, setIdx]           = useState(0);
  const [shadow, setShadow]     = useState(false);
  const [loading, setLoading]   = useState(true);
  const prevComplete            = React.useRef(false);

  useEffect(() => {
    setLoading(true);
    setIdx(0);
    setShadow(false);
    Promise.all([
      supabase.from('scenarios').select('*').eq('id', scenarioId).maybeSingle(),
      supabase.from('phrases').select('*').eq('scenario_id', scenarioId).order('order_index'),
      supabase.from('hacks').select('*'),
    ]).then(([sRes, pRes, hRes]) => {
      setScenario(sRes.data);
      setPhrases(pRes.data ?? []);
      setHacks(hRes.data ?? []);
      setLoading(false);
    });
  }, [scenarioId]);

  const phrase  = phrases[idx];
  const hack    = hacks.find((h) => h.phrase_id === phrase?.id);
  const doneN   = phrases.filter((p) => completed.has(p.id)).length;
  const allDone = phrases.length > 0 && doneN === phrases.length;

  useEffect(() => {
    if (allDone && !prevComplete.current) { onComplete(); prevComplete.current = true; }
    if (!allDone) prevComplete.current = false;
  }, [allDone, onComplete]);

  function isLocked(i: number) {
    if (i === 0) return false;
    return !completed.has(phrases[i - 1]?.id ?? '');
  }

  if (loading || !scenario) {
    return (
      <div className="zen-loading">
        <FloatingBack onClick={onBack} />
        <TaijiCompass size={56} />
        <p className="zen-loading-text">Loading…</p>
      </div>
    );
  }

  return (
    <div className="zen-page">
      <FloatingBack onClick={onBack} />

      <header className="zen-scenario-header" style={{ '--accent': scenario.color } as React.CSSProperties}>
        <div className="zen-scenario-icon">{scenario.icon}</div>
        <div>
          <h1 className="zen-scenario-title">{scenario.title}</h1>
          <p className="zen-scenario-sub">{scenario.title_zh} · {scenario.description}</p>
        </div>
      </header>

      <div className="zen-progress-wrap">
        <div className="zen-progress-track">
          <div
            className="zen-progress-fill"
            style={{
              width: `${phrases.length ? (doneN / phrases.length) * 100 : 0}%`,
              background: scenario.color,
            }}
          />
        </div>
        <span className="zen-progress-label">{doneN}/{phrases.length} mastered</span>
      </div>

      {allDone && (
        <div className="zen-complete-banner" style={{ borderColor: scenario.color }}>
          <span className="zen-complete-star">⭐</span>
          <p>Scenario complete! Keep going!</p>
        </div>
      )}

      {phrase && (
        <div className="zen-flip-section">
          <FlipCard
            targetLang={phrase.target_lang}
            nativeLang={phrase.native_lang}
            pronunciation={phrase.pronunciation}
            contextNote={phrase.context_note}
            hackTitle={hack?.title}
            hackContent={hack?.content}
            hackType={hack?.type}
            visualFormula={hack?.visual_formula}
            chineseHomophone={hack?.chinese_homophone}
            orderIndex={phrase.order_index}
            isCompleted={completed.has(phrase.id)}
            isLocked={isLocked(idx)}
            onMarkComplete={() => onMark(phrase.id, phrases.length)}
          />
        </div>
      )}

      {phrase && !shadow && !isLocked(idx) && (
        <button
          className="zen-shadow-btn"
          style={{ background: scenario.color, boxShadow: `0 4px 0 ${darkenHex(scenario.color)}` }}
          onClick={() => setShadow(true)}
        >
          🎤 Listen & Shadow
        </button>
      )}

      {phrase && shadow && (
        <div className="zen-shadow-section">
          <AudioShadow phrase={phrase.target_lang} pronunciation={phrase.pronunciation} />
          <button className="zen-shadow-close" onClick={() => setShadow(false)}>Close</button>
        </div>
      )}

      <div className="zen-phrase-nav">
        <button className="zen-nav-arrow" disabled={idx === 0}
          onClick={() => { setIdx(Math.max(0, idx - 1)); setShadow(false); }}>← Prev</button>
        <span className="zen-nav-counter">{idx + 1} / {phrases.length}</span>
        <button className="zen-nav-arrow" disabled={idx === phrases.length - 1}
          onClick={() => { setIdx(Math.min(phrases.length - 1, idx + 1)); setShadow(false); }}>Next →</button>
      </div>

      <div className="zen-dot-row">
        {phrases.map((p, i) => (
          <button
            key={p.id}
            className={['zen-dot', i === idx ? 'active' : '', completed.has(p.id) ? 'done' : '', isLocked(i) ? 'locked' : ''].join(' ')}
            style={i === idx ? { background: scenario.color } : {}}
            onClick={() => { if (!isLocked(i)) { setIdx(i); setShadow(false); } }}
            disabled={isLocked(i)}
          />
        ))}
      </div>
    </div>
  );
};
