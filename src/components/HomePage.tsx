import React, { useState, useEffect } from 'react';
import { supabase } from '../data/supabase';
import { TaijiCompass, KoiFish } from './TaijiCompass';
import { Language, getLangZh } from './LanguageSelector';
import { FlipCard } from './FlipCard';
import { AudioShadow } from './AudioShadow';
import { FloatingBack } from './FloatingBack';
import { Confetti } from './Confetti';
import { GridSkeleton, PageLoading } from './Skeleton';
import { getCache, setCache } from '../lib/cache';
import { getScenarios, getPhrases, getHacks, isOfflineMode, OfflineScenario, OfflinePhrase, OfflineHack } from '../lib/offlineData';

/* 学习模式 */
type StudyMode = 'daily' | 'exam' | 'interest';
const STUDY_MODES: { key: StudyMode; label: string; icon: string; desc: string }[] = [
  { key: 'daily', label: '日常交流', icon: '💬', desc: '旅行、购物、餐厅等日常场景' },
  { key: 'exam', label: '能力考试', icon: '📝', desc: 'JLPT/TOEFL/HSK 备考强化' },
  { key: 'interest', label: '兴趣学习', icon: '🎯', desc: '动漫、音乐、文化等兴趣驱动' },
];

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
  onNavigateToAI?: (context: string) => void;
  onNavigateToView?: (view: string) => void;  // 导航到其他功能模块
}

/* ──────────────────── Root ──────────────────── */

export const HomePage: React.FC<HomePageProps> = ({
  externalLang,
  externalLanguages,
  onXP,
  onNavigateToAI,
  onNavigateToView,
}) => {
  const activeLang = externalLang || 'ja';
  const [scenarios, setScenarios]     = useState<Scenario[]>([]);
  const [loadingScen, setLoadingScen] = useState(true);
  const [route, setRoute]             = useState<Route>({ view: 'home' });
  const [completed, setCompleted]     = useState<Set<string>>(loadCompleted);
  const [confetti, setConfetti]       = useState(false);
  const [studyMode, setStudyMode]     = useState<StudyMode>('daily');
  const [toastMsg, setToastMsg]       = useState('');

  const currentLang = (externalLanguages ?? []).find((l) => l.code === activeLang);

  /* 显示 toast */
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  // Re-fetch scenarios when external lang changes
  useEffect(() => {
    const cacheKey = `scenarios_${externalLang || 'ja'}`;
    const cached = getCache<Scenario[]>(cacheKey, 300000); // 5 min cache
    if (cached) {
      setScenarios(cached);
      setLoadingScen(false);
      return;
    }

    setLoadingScen(true);
    setRoute({ view: 'home' });

    // ── 超时保护：6秒后强制使用离线数据 ──
    const safetyTimer = setTimeout(() => {
      setLoadingScen(false);
      const offline = getScenarios(externalLang || 'ja') as unknown as Scenario[];
      setScenarios(offline);
      setCache(cacheKey, offline);
    }, 6000);

    supabase
      .from('scenarios')
      .select('*')
      .eq('language_code', externalLang || 'ja')
      .order('order_index')
      .then(async ({ data }) => {
        clearTimeout(safetyTimer);
        const rows = (data ?? []) as Scenario[];
        // If Supabase returned empty or in offline mode, use offline data
        if (rows.length === 0 || isOfflineMode()) {
          const offline = getScenarios(externalLang || 'ja') as unknown as Scenario[];
          setScenarios(offline);
          setCache(cacheKey, offline);
          setLoadingScen(false);
          return;
        }
        const withCounts = await Promise.all(
          rows.map(async (s: Scenario) => {
            const countKey = `phrase_count_${s.id}`;
            const cachedCount = getCache<number>(countKey, 600000);
            if (cachedCount !== null) {
              return { ...s, phrase_count: cachedCount };
            }
            const { count } = await supabase
              .from('phrases')
              .select('*', { count: 'exact', head: true })
              .eq('scenario_id', s.id);
            const c = count ?? (isOfflineMode() ? 10 : 0);
            setCache(countKey, c);
            return { ...s, phrase_count: c };
          })
        );
        setScenarios(withCounts);
        setCache(cacheKey, withCounts);
        setLoadingScen(false);
      })
      .catch(() => {
        clearTimeout(safetyTimer);
        // Supabase connection error — use offline data
        const offline = getScenarios(externalLang || 'ja') as unknown as Scenario[];
        setScenarios(offline);
        setCache(cacheKey, offline);
        setLoadingScen(false);
      });
  }, [externalLang]);

  function fireConfetti(ms = 2400) {
    setConfetti(true);
    setTimeout(() => setConfetti(false), ms);
  }

  function markPhrase(phraseId: string, total: number, scenarioId?: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      const wasNew = !next.has(phraseId);
      if (wasNew) {
        next.add(phraseId);
        onXP?.(10);
        if (next.size % 5 === 0) fireConfetti();
        // 同时标记场景ID为完成（用于解锁判断）
        if (scenarioId) next.add(scenarioId);
        // 整个场景完成时3秒庆祝
        if (total > 0 && [...next].filter(id => id.startsWith('phrase_')).length % total === 0) fireConfetti(3000);
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
          onMark={(id, total) => markPhrase(id, total, route.id)}
          onComplete={fireConfetti}
          onBack={() => navigate({ view: 'home' })}
        />
      </>
    );
  }

  return (
    <>
      <Confetti active={confetti} />
      {/* Toast */}
      {toastMsg && (
        <div className="ai-toast">
          <span>{toastMsg}</span>
        </div>
      )}
      <div className="zen-page page-fade-in">

        {/* Hero */}
        <section className="zen-hero">
          <div className="zen-hero-content">
            <KoiFish size={48} />
            <h1 className="zen-hero-title">{currentLang ? getLangZh(currentLang) : '语言'} 学习路线</h1>
            <p className="zen-hero-sub">{currentLang?.name_native ?? ''} · 真实场景对话</p>
            <p className="zen-hero-ai-note">✨ 区别于多邻国：AI 实时动态生成专属学习素材</p>
          </div>
          <div className="zen-hero-taiji">
            <TaijiCompass size={80} />
          </div>
        </section>

        {/* 学习模式切换 */}
        <section className="zen-mode-section">
          <h2 className="zen-section-title">学习模式</h2>
          <div className="study-mode-selector">
            {STUDY_MODES.map(mode => (
              <button
                key={mode.key}
                className={`study-mode-btn ${studyMode === mode.key ? 'active' : ''}`}
                onClick={() => {
                  setStudyMode(mode.key);
                  // 根据模式调整场景筛选逻辑
                  if (mode.key === 'exam') {
                    // 考试模式：优先展示语法/考试类场景
                    const examScenarios = scenarios.filter(s =>
                      s.title?.includes('语法') || s.title?.includes('考试') || s.title?.includes('测试')
                    );
                    if (examScenarios.length > 0) setScenarios(examScenarios);
                    else showToast(`已切换到「${mode.label}」模式 — 聚焦考试备考内容`);
                  } else if (mode.key === 'interest') {
                    // 兴趣模式：优先展示趣味/文化/生活场景
                    const interestScenarios = scenarios.filter(s =>
                      s.title?.includes('文化') || s.title?.includes('美食') || s.title?.includes('旅行') ||
                      s.title?.includes('电影') || s.title?.includes('音乐') || s.title?.includes('动漫')
                    );
                    if (interestScenarios.length > 0) setScenarios(interestScenarios);
                    else showToast(`已切换到「${mode.label}」模式 — 展示兴趣导向内容`);
                  } else {
                    // 日常模式：恢复全部场景（从缓存或重新加载）
                    const cached = getCache<Scenario[]>(`scenarios_${externalLang || 'ja'}`, 300000);
                    if (cached) {
                      setScenarios(cached);
                    } else {
                      // 缓存过期，重新从Supabase/离线数据加载
                      supabase.from('scenarios').select('*')
                        .eq('language_code', externalLang || 'ja')
                        .order('order_index')
                        .then(({ data }) => {
                          if (data && data.length > 0) setScenarios(data as Scenario[]);
                          else setScenarios(getScenarios(externalLang || 'ja') as unknown as Scenario[]);
                        })
                        .catch(() => setScenarios(getScenarios(externalLang || 'ja') as unknown as Scenario[]));
                    }
                    showToast(`已切换到「${mode.label}」模式 — 全部学习内容`);
                  }
                }}
              >
                <span className="study-mode-icon">{mode.icon}</span>
                <div className="study-mode-info">
                  <span className="study-mode-label">{mode.label}</span>
                  <span className="study-mode-desc">{mode.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* AI 补充内容 — 已激活！直达 AI 助手 */}
        <section className="zen-ai-section">
          <h2 className="zen-section-title">🤖 AI 智能辅助</h2>
          <div className="ai-supplement-grid">
            <button
              className="ai-supplement-btn"
              onClick={() => onNavigateToAI?.('帮我根据当前学习进度，生成10道配套练习题，包含选择题和填空题')}
            >
              <span className="ai-supplement-icon">📝</span>
              <div className="ai-supplement-info">
                <span className="ai-supplement-label">AI 帮我生成更多练习题</span>
                <span className="ai-supplement-desc">根据当前进度智能出题</span>
              </div>
              <span className="ai-supplement-badge active">已激活</span>
            </button>
            <button
              className="ai-supplement-btn"
              onClick={() => onNavigateToAI?.('根据我的学习情况，推荐接下来应该学习什么内容，为什么？')}
            >
              <span className="ai-supplement-icon">🎯</span>
              <div className="ai-supplement-info">
                <span className="ai-supplement-label">AI 根据我的水平推荐内容</span>
                <span className="ai-supplement-desc">个性化难度匹配</span>
              </div>
              <span className="ai-supplement-badge active">已激活</span>
            </button>
            <button
              className="ai-supplement-btn"
              onClick={() => onNavigateToAI?.('请为我生成更多类似场景的实用对话，包含不同语境和难度')}
            >
              <span className="ai-supplement-icon">💬</span>
              <div className="ai-supplement-info">
                <span className="ai-supplement-label">AI 补充这个场景的更多对话</span>
                <span className="ai-supplement-desc">扩展真实语境表达</span>
              </div>
              <span className="ai-supplement-badge active">已激活</span>
            </button>
          </div>
        </section>

        {/* ── 功能中心 Feature Hub ── 替代空洞的场景罗盘，直接展示核心功能模块 */}
        <section className="feature-hub-section">
          <h2 className="zen-section-title">🎯 学习中心</h2>
          <p className="zen-section-desc">选择你的学习方式 — 每个模块都由AI驱动</p>

          <div className="feature-hub-grid">
            {/* 核心功能：学习路线 */}
            <button className="feature-tile feature-tile-primary" onClick={() => onNavigateToView?.('learning_path')}>
              <span className="ft-icon">🗺️</span>
              <div className="ft-body">
                <span className="ft-title">AI 学习路线</span>
                <span className="ft-desc">个性化规划 · 参考权威教材 · 8阶段进阶</span>
              </div>
              <span className="ft-badge ft-hot">推荐</span>
            </button>

            {/* AI 助手 - 已在上方有快捷入口，这里作为完整入口 */}
            <button className="feature-tile" onClick={() => onNavigateToAI?.('你好，我是你的AI语言教练。请帮我制定今天的学习计划。')}>
              <span className="ft-icon">🤖</span>
              <div className="ft-body">
                <span className="ft-title">AI 智能助手</span>
                <span className="ft-desc">拍照翻译 · 语音对话 · 文字问答 · 聊天</span>
              </div>
              <span className="ft-badge ft-active">在线</span>
            </button>

            {/* 分级阅读 */}
            <button className="feature-tile" onClick={() => onNavigateToView?.('bookshelf')}>
              <span className="ft-icon">📚</span>
              <div className="ft-body">
                <span className="ft-title">分级阅读</span>
                <span className="ft-desc">AI智能选书 · 难度匹配 · 深度分析总结</span>
              </div>
            </button>

            {/* 模拟考试 */}
            <button className="feature-tile" onClick={() => onNavigateToView?.('exam_engine')}>
              <span className="ft-icon">📝</span>
              <div className="ft-body">
                <span className="ft-title">模拟考试</span>
                <span className="ft-desc">JLPT · TOEFL · HSK · 商务 · 日常</span>
              </div>
            </button>

            {/* 虚拟电台 */}
            <button className="feature-tile" onClick={() => onNavigateToView?.('radio')}>
              <span className="ft-icon">📻</span>
              <div className="ft-body">
                <span className="ft-title">虚拟电台</span>
                <span className="ft-desc">新闻 · 文化 · 音乐 · 多难度级别</span>
              </div>
            </button>

            {/* 发音/跟读练习 */}
            <button className="feature-tile" onClick={() => onNavigateToView?.('phoneme_coach')}>
              <span className="ft-icon">🎤</span>
              <div className="ft-body">
                <span className="ft-title">发音教练</span>
                <span className="ft-desc">音标纠正 · 跟读打分 · AI实时反馈</span>
              </div>
            </button>

            {/* 趣味游戏 */}
            <button className="feature-tile" onClick={() => onNavigateToView?.('game')}>
              <span className="ft-icon">🎮</span>
              <div className="ft-body">
                <span className="ft-title">趣味闯关</span>
                <span className="ft-desc">单词猎人 · 语法魔方 · 密室逃脱</span>
              </div>
            </button>

            {/* AI 写作教练 */}
            <button className="feature-tile" onClick={() => onNavigateToView?.('ai_writing')}>
              <span className="ft-icon">✍️</span>
              <div className="ft-body">
                <span className="ft-title">AI 写作教练</span>
                <span className="ft-desc">作文批改 · 语法优化 · 风格建议</span>
              </div>
            </button>

            {/* 场景对话（保留原功能但缩小为入口） */}
            <button className="feature-tile" onClick={() => {
              // 如果有场景数据才展示场景选择
              if (scenarios.length > 0 && scenarios[0]?.phrase_count && scenarios[0].phrase_count > 0) {
                navigate({ view: 'scenario', id: scenarios[0].id });
              } else {
                showToast('场景内容正在准备中，推荐使用「AI学习路线」开始学习');
              }
            }}>
              <span className="ft-icon">💬</span>
              <div className="ft-body">
                <span className="ft-title">场景对话</span>
                <span className="ft-desc">真实场景 · 翻转卡片 · 记忆技巧</span>
              </div>
              {scenarios.length > 0 ? <span className="ft-count">{scenarios.reduce((s, c) => s + (c.phrase_count ?? 0), 0)}句</span> : null}
            </button>
          </div>
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

const CompassGrid: React.FC<CompassGridProps> = ({ scenarios, completed, onOpen }) => {
  const positions = Array.from({ length: 9 }, (_, i) => i + 1);
  const sorted = [...scenarios].sort((a, b) => a.order_index - b.order_index);

  function isUnlocked(s: Scenario) {
    if (s.order_index <= 1) return true;
    // 必须前一关卡已完成才能解锁
    const prevScenario = sorted.find((x) => x.order_index === s.order_index - 1);
    return prevScenario ? completed.has(prevScenario.id) : false;
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
  onMark: (phraseId: string, total: number, scenarioId: string) => void;
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
    // Try cache first
    const cachedScenario = getCache<Scenario>(`scenario_${scenarioId}`, 300000);
    const cachedPhrases = getCache<Phrase[]>(`phrases_${scenarioId}`, 300000);
    const cachedHacks = getCache<Hack[]>(`hacks_${scenarioId}`, 300000);
    if (cachedScenario && cachedPhrases) {
      setScenario(cachedScenario);
      setPhrases(cachedPhrases);
      setHacks(cachedHacks ?? []);
      setLoading(false);
      return;
    }

    setLoading(true);
    setIdx(0);
    setShadow(false);

    // Try Supabase, fallback to offline data
    Promise.all([
      supabase.from('scenarios').select('*').eq('id', scenarioId).maybeSingle(),
      supabase.from('phrases').select('*').eq('scenario_id', scenarioId).order('order_index'),
      supabase.from('hacks').select('*'),
    ]).then(([sRes, pRes, hRes]) => {
      let s = sRes.data as Scenario | null;
      let p = (pRes.data ?? []) as Phrase[];
      let h = (hRes.data ?? []) as Hack[];

      // If Supabase returned empty, use offline data
      if (!s || isOfflineMode()) {
        const offlineScenarios = getScenarios(scenarioId.split('_')[1] || 'ja');
        s = offlineScenarios.find(sc => sc.id === scenarioId) as unknown as Scenario || null;
      }
      if (p.length === 0 || isOfflineMode()) {
        p = getPhrases(scenarioId) as unknown as Phrase[];
      }
      if (h.length === 0 || isOfflineMode()) {
        h = getHacks() as unknown as Hack[];
      }

      setScenario(s);
      setPhrases(p);
      setHacks(h);
      if (s) setCache(`scenario_${scenarioId}`, s);
      if (p.length) setCache(`phrases_${scenarioId}`, p);
      if (h.length) setCache(`hacks_${scenarioId}`, h);
      setLoading(false);
    }).catch(() => {
      // Network error — use offline data
      const langCode = scenarioId.split('_')[1] || 'ja';
      const offlineScenarios = getScenarios(langCode);
      const s = offlineScenarios.find(sc => sc.id === scenarioId) as unknown as Scenario || null;
      const p = getPhrases(scenarioId) as unknown as Phrase[];
      const h = getHacks() as unknown as Hack[];
      setScenario(s);
      setPhrases(p);
      setHacks(h);
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
      <div className="zen-page page-fade-in">
        <FloatingBack onClick={onBack} />
        <PageLoading message="Loading scenario…" />
      </div>
    );
  }

  return (
    <div className="zen-page page-fade-in">
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

      {/* AI 补充按钮 — 场景内 — 已激活！ */}
      <div className="zen-scene-ai-bar">
        <button
          className="zen-scene-ai-btn"
          onClick={() => onNavigateToAI?.(`请基于"${scenario?.title}"这个场景，帮我生成5句类似的${currentLang ? '' : ''}实用对话，从简单到困难排列`)}
        >
          🤖 AI 帮我生成更多同类对话
        </button>
        <button
          className="zen-scene-ai-btn"
          onClick={() => onNavigateToAI?.(`我刚刚学完了"${scenario?.title}"，根据我的学习进度，AI推荐下一个适合的场景`) }
        >
          🎯 AI 推荐下一个学习场景
        </button>
      </div>

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
            onMarkComplete={() => onMark(phrase.id, phrases.length, scenarioId)}
            langCode={scenario.language_code}
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
          <AudioShadow phrase={phrase.target_lang} pronunciation={phrase.pronunciation} langCode={scenario.language_code} />
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
