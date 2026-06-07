import React, { useState, useEffect } from 'react';
import { supabase } from '../data/supabase';
import { TaijiCompass } from './TaijiCompass';
import { LanguageSelector, Language, getLangZh } from './LanguageSelector';
import { HomePage } from './HomePage';
import { useUI } from '../lib/UILanguageContext';
import { GameArena } from './GameArena';
import { GrammarVocab } from './GrammarVocab';
import { CameraAI } from './CameraAI';
import { TravelTranslator } from './TravelTranslator';
import { ProfilePanel } from './ProfilePanel';
import { PartnerHub } from './PartnerHub';
import { StudyCircle } from './StudyCircle';
import { MemberCenter } from './MemberCenter';
import { PaywallModal } from './PaywallModal';
import { CheckoutModal } from './CheckoutModal';
import { UserProfile } from './Onboarding';
import { canAccessFeature, consumeCredit, FeatureType, UpsellPlan } from '../lib/featureGate';
import { MerchantHub } from './MerchantHub';
import { PrivacySettings } from './PrivacySettings';
import { AIAssistant } from './AIAssistant';
import { VirtualRadio } from './VirtualRadio';
import { GlobalAIChat } from './GlobalAIChat';
import DailyCheckin from './DailyCheckin';
import PhoneVerify from './PhoneVerify';
import { WeeklyLeaderboard } from './WeeklyLeaderboard';
import { DailyTasks } from './DailyTasks';
import { FriendSystem } from './FriendSystem';
import { AchievementWall } from './AchievementWall';
import { StreakShield } from './StreakShield';
import { NewFeatures } from './NewFeatures';
import { LearningPath } from './LearningPath';
import { mockLanguages } from '../data/mockData';

type HubView =
  | 'path' | 'game' | 'grammar' | 'camera' | 'translate'
  | 'profile' | 'partner' | 'circle' | 'member'
  | 'merchant' | 'privacy' | 'ai' | 'radio'
  | 'leaderboard' | 'daily_tasks' | 'friends' | 'achievements' | 'streak_shield'
  | 'new_features' | 'learning_path';

interface MainHubProps {
  initialProfile: UserProfile;
  onReset?: () => void;
}

interface GameState {
  streak: number;
  xp: number;
  hearts: number;
}

function loadGame(): GameState {
  try {
    const s = localStorage.getItem('v5_game');
    return s ? JSON.parse(s) : { streak: 7, xp: 120, hearts: 5 };
  } catch { return { streak: 7, xp: 120, hearts: 5 }; }
}

export const MainHub: React.FC<MainHubProps> = ({ initialProfile, onReset }) => {
  const { s } = useUI();
  const [view, setView]           = useState<HubView>('path');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [lang, setLang]           = useState(initialProfile.language_code || 'ja');
  const [game, setGame]           = useState<GameState>(loadGame);
  const [profile]                 = useState<UserProfile>(initialProfile);

  // Paywall state
  const [paywallBlock, setPaywallBlock] = useState<{ reason: string; plan?: UpsellPlan } | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<UpsellPlan | null>(null);
  // Pending gated navigation after payment
  const [pendingView, setPendingView]   = useState<HubView | null>(null);
  // Phone verify (show once on first load if not verified)
  const [showPhoneVerify, setShowPhoneVerify] = useState(false);
  // AI context pre-fill from other pages
  const [aiContext, setAiContext] = useState<string | undefined>(undefined);
  // Global AI chat visibility
  const [showGlobalAI, setShowGlobalAI] = useState(false);

  useEffect(() => {
    supabase.from('languages').select('*').order('order_index').then(({ data, error }) => {
      if (data && data.length > 0) {
        setLanguages(data);
      } else {
        setLanguages(mockLanguages);
      }
    }).catch(() => {
      setLanguages(mockLanguages);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('v5_game', JSON.stringify(game));
  }, [game]);

  useEffect(() => {
    setLang(initialProfile.language_code || 'ja');
  }, [initialProfile.language_code]);

  const currentLang = languages.find((l) => l.code === lang);

  function handleXP(delta: number) {
    setGame((g) => ({ ...g, xp: Math.max(0, g.xp + delta) }));
  }
  function handleHeartLost() {
    setGame((g) => ({ ...g, hearts: Math.max(0, g.hearts - 1) }));
  }
  function handleReset() {
    if (onReset) onReset();
  }

  /** Navigate to a view, checking feature access first if it's gated. */
  async function navigateTo(target: HubView) {
    const featureMap: Partial<Record<HubView, FeatureType>> = {
      // 'game' uses per-question gating inside GameArena; no top-level gate
    };
    const ft = featureMap[target];
    if (!ft) { setView(target); return; }

    const result = await canAccessFeature(profile.session_key, ft);
    if (result.granted) {
      setView(target);
    } else {
      setPendingView(target);
      setPaywallBlock({ reason: result.blockReason ?? '功能受限', plan: result.upsellPlan });
    }
  }

  function handlePaywallBuy(plan: UpsellPlan) {
    setPaywallBlock(null);
    setCheckoutPlan(plan);
  }

  function handlePaywallUpgradeVip() {
    setPaywallBlock(null);
    setCheckoutPlan({
      planKey: 'vip_monthly',
      label: '会员月卡',
      priceLabel: '$3.9/月',
      description: '免广告 · 无限考试 · 不限搭子 · 高级题库8折',
    });
  }

  function handleCheckoutSuccess() {
    setCheckoutPlan(null);
    if (pendingView) {
      setView(pendingView);
      setPendingView(null);
    }
  }

  const NAV = [
    { key: 'path',    icon: '🗺',  label: s.nav_path },
    { key: 'game',    icon: '🎮',  label: s.nav_game },
    { key: 'ai',      icon: '🤖',  label: s.nav_ai },
    { key: 'radio',   icon: '🎙️', label: s.nav_radio },
    { key: 'circle',  icon: '👥',  label: s.nav_circle },
  ] as const;

  const isSubView = view !== 'path';

  // 返回按钮：非首页时显示，回到上一个视图（path 或 profile）
  const [viewStack, setViewStack] = useState<HubView[]>(['path']);

  function pushView(target: HubView) {
    setViewStack((s) => [...s, target]);
    setView(target);
  }

  function popView() {
    setViewStack((s) => {
      if (s.length <= 1) return ['path'];
      const next = [...s];
      next.pop();
      const prev = next[next.length - 1];
      setView(prev);
      return next;
    });
  }

  // 当底部导航直接跳转时，重置栈
  function navigateToWithStack(target: HubView) {
    setViewStack([target]);
    navigateTo(target);
  }

  return (
    <div className="hub-shell">
      {/* ── Global Top Bar ── */}
      <header className="hub-topbar">
        {/* 一键返回按钮：非首页时固定显示在最左侧 */}
        {isSubView && (
          <button className="hub-back-btn" onClick={popView} title="返回上一页">
            <span className="hub-back-icon">←</span>
            <span className="hub-back-text">返回</span>
          </button>
        )}
        {!isSubView && (
          <div className="hub-brand">
            <TaijiCompass size={26} />
            <span className="hub-brand-name">言道</span>
          </div>
        )}

        {languages.length > 0 && (
          <LanguageSelector
            languages={languages}
            selected={lang}
            onSelect={(code) => { setLang(code); setView('path'); setViewStack(['path']); }}
          />
        )}

        <div className="hub-topbar-right">
          <div className="hub-stats">
            <span className="hub-stat" title="连续天数">🔥 {game.streak}</span>
            <span className="hub-stat" title="经验值">✨ {game.xp}</span>
            <span className={`hub-stat hearts ${game.hearts === 0 ? 'empty' : ''}`} title="生命值">
              {game.hearts > 0 ? `❤️ ${game.hearts}` : '🖤 0'}
            </span>
          </div>
          <button
            className="hub-avatar-btn"
            onClick={() => {
              if (view === 'profile') {
                setView('path');
                setViewStack(['path']);
              } else {
                pushView('profile');
              }
            }}
            title="用户中心"
          >
            <span className="hub-avatar-icon">{view === 'profile' ? '✕' : '👤'}</span>
          </button>
        </div>
      </header>

      {/* ── View Content ── */}
      <main className="hub-main">
        {view === 'path' && (
          <>
            <DailyCheckin
              key={`checkin-${lang}`}
              sessionKey={profile.session_key}
              languageCode={lang}
              onCheckin={(xp) => { handleXP(xp); }}
            />
            {/* Quick action bar */}
            <div className="hub-quick-bar">
              <button className="hub-quick-tile" onClick={() => pushView('leaderboard')}>
                <span className="hqt-icon">🏆</span>
                <span className="hqt-label">{s.nav_leaderboard ?? '排行榜'}</span>
              </button>
              <button className="hub-quick-tile" onClick={() => pushView('daily_tasks')}>
                <span className="hqt-icon">📋</span>
                <span className="hqt-label">{s.nav_daily_tasks ?? '每日任务'}</span>
              </button>
              <button className="hub-quick-tile" onClick={() => pushView('friends')}>
                <span className="hqt-icon">👫</span>
                <span className="hqt-label">{s.nav_friends ?? '好友'}</span>
              </button>
              <button className="hub-quick-tile" onClick={() => pushView('achievements')}>
                <span className="hqt-icon">🎖️</span>
                <span className="hqt-label">{s.nav_achievements ?? '成就'}</span>
              </button>
            </div>
            <HomePage
              externalLang={lang}
              externalLanguages={languages}
              onXP={handleXP}
              onNavigateToAI={(context) => {
                setAiContext(context);
                navigateToWithStack('ai' as HubView);
              }}
              onNavigateToView={(view: string) => pushView(view as HubView)}
            />
          </>
        )}
        {view === 'game' && (
          <GameArena
            key={`game-${lang}`}
            languageCode={lang}
            languageName={currentLang ? getLangZh(currentLang) : lang}
            hearts={game.hearts}
            sessionKey={profile.session_key}
            onHeartLost={handleHeartLost}
            onXP={handleXP}
            onBack={() => setView('path')}
          />
        )}
        {view === 'grammar' && (
          <GrammarVocab
            key={`grammar-${lang}`}
            languageCode={lang}
            languageName={currentLang ? getLangZh(currentLang) : lang}
            onBack={() => setView('path')}
          />
        )}
        {view === 'camera' && (
          <CameraAI
            key={`camera-${lang}`}
            languageCode={lang}
            languageName={currentLang ? getLangZh(currentLang) : lang}
            onBack={() => setView('path')}
          />
        )}
        {view === 'translate' && (
          <TravelTranslator
            key={`translate-${lang}`}
            languageCode={lang}
            languageName={currentLang ? getLangZh(currentLang) : lang}
            onBack={() => setView('path')}
          />
        )}
        {view === 'partner' && (
          <PartnerHub
            sessionKey={profile.session_key}
            onBack={() => setView('path')}
            onPaywall={(reason, plan) => setPaywallBlock({ reason, plan })}
          />
        )}
        {view === 'circle' && (
          <StudyCircle
            sessionKey={profile.session_key}
            onBack={() => setView('path')}
          />
        )}
        {view === 'member' && (
          <MemberCenter
            sessionKey={profile.session_key}
            onBack={() => setView('path')}
          />
        )}
        {view === 'profile' && (
          <ProfilePanel
            profile={profile}
            xp={game.xp}
            streak={game.streak}
            onBack={() => setView('path')}
            onReset={handleReset}
            onPrivacy={() => setView('privacy')}
            onMerchant={() => setView('merchant')}
            onAchievements={() => setView('achievements')}
            onStreakShield={() => setView('streak_shield')}
          />
        )}
        {view === 'merchant' && (
          <MerchantHub onBack={() => setView('profile')} />
        )}
        {view === 'privacy' && (
          <PrivacySettings onBack={() => setView('profile')} />
        )}
        {view === 'ai' && (
          <AIAssistant
            key={`ai-${lang}`}
            languageCode={lang}
            languageName={currentLang ? getLangZh(currentLang) : lang}
            sessionKey={profile.session_key}
            onBack={() => { setView('path'); setViewStack(['path']); setAiContext(undefined); }}
            prefillContext={aiContext}
          />
        )}
        {view === 'radio' && (
          <VirtualRadio
            key={`radio-${lang}`}
            languageCode={lang}
            languageName={currentLang ? getLangZh(currentLang) : lang}
            profession={(profile as UserProfile & { profession?: string }).profession}
            onBack={() => setView('path')}
          />
        )}
        {view === 'leaderboard' && (
          <WeeklyLeaderboard
            sessionKey={profile.session_key}
            currentWeekXP={game.xp}
            onBack={() => setView('path')}
          />
        )}
        {view === 'daily_tasks' && (
          <DailyTasks
            currentXP={game.xp}
            onReward={(xp, _diamonds) => handleXP(xp)}
            onBack={() => setView('path')}
          />
        )}
        {view === 'friends' && (
          <FriendSystem
            sessionKey={profile.session_key}
            weekXP={game.xp}
            onBack={() => setView('path')}
          />
        )}
        {view === 'achievements' && (
          <AchievementWall
            sessionKey={profile.session_key}
            xp={game.xp}
            streak={game.streak}
            onBack={() => setView('profile')}
          />
        )}
        {view === 'streak_shield' && (
          <div className="hub-subpage-wrap">
            <StreakShield
              diamonds={0}
              streak={game.streak}
              onBack={() => setView('profile')}
            />
          </div>
        )}
        {view === 'new_features' && (
          <NewFeatures />
        )}
        {view === 'learning_path' && (
          <LearningPath
            languageCode={lang}
            languageName={currentLang ? getLangZh(currentLang) : lang}
            userLevel={profile.level ?? 'beginner'}
            onBack={() => popView()}
          />
        )}
      </main>

      {/* ── Global Bottom Nav ── */}
      <nav className="hub-bottomnav">
        {NAV.map((item) => (
          <button
            key={item.key}
            className={`hub-nav-item ${view === item.key ? 'active' : ''}`}
            onClick={() => navigateToWithStack(item.key as HubView)}
          >
            <span className="hub-nav-icon">{item.icon}</span>
            <span className="hub-nav-label">{item.label}</span>
          </button>
        ))}
        <button
          className={`hub-nav-item ${view === 'profile' ? 'active' : ''}`}
          onClick={() => {
            if (view === 'profile') {
              setView('path');
              setViewStack(['path']);
            } else {
              pushView('profile');
            }
          }}
        >
          <span className="hub-nav-icon">👤</span>
          <span className="hub-nav-label">{s.nav_profile}</span>
        </button>
      </nav>

      {/* ── Feature strip (path view only) ── */}
      {view === 'path' && (
        <div className="hub-feature-strip">
          <button className="hub-feature-card game-card" onClick={() => pushView('game')}>
            <span className="hfc-icon">🎮</span>
            <span className="hfc-title">{s.feature_game}</span>
            <span className="hfc-sub">{s.feature_game_sub}</span>
          </button>
          <button className="hub-feature-card grammar-card" onClick={() => pushView('grammar')}>
            <span className="hfc-icon">📐</span>
            <span className="hfc-title">{s.feature_grammar}</span>
            <span className="hfc-sub">{s.feature_grammar_sub}</span>
          </button>
          <button className="hub-feature-card radio-card" onClick={() => pushView('radio')}>
            <span className="hfc-icon">🎙️</span>
            <span className="hfc-title">{s.feature_radio}</span>
            <span className="hfc-sub">{s.feature_radio_sub}</span>
          </button>
          <button className="hub-feature-card partner-card" onClick={() => pushView('partner')}>
            <span className="hfc-icon">🤝</span>
            <span className="hfc-title">{s.feature_partner}</span>
            <span className="hfc-sub">{s.feature_partner_sub}</span>
          </button>
          <button className="hub-feature-card member-card" onClick={() => pushView('member')}>
            <span className="hfc-icon">💎</span>
            <span className="hfc-title">{s.feature_member}</span>
            <span className="hfc-sub">{s.feature_member_sub}</span>
          </button>
        </div>
      )}

      {!isSubView && game.hearts === 0 && (
        <div className="hub-hearts-warn">
          🖤 {s.hearts_empty}
        </div>
      )}

      {/* ── Global Paywall Modal ── */}
      {paywallBlock && (
        <PaywallModal
          blockReason={paywallBlock.reason}
          upsellPlan={paywallBlock.plan}
          onBuy={handlePaywallBuy}
          onUpgradeVip={handlePaywallUpgradeVip}
          onClose={() => { setPaywallBlock(null); setPendingView(null); }}
        />
      )}

      {/* ── Global Checkout Modal ── */}
      {checkoutPlan && (
        <CheckoutModal
          sessionKey={profile.session_key}
          plan={checkoutPlan}
          onSuccess={handleCheckoutSuccess}
          onClose={() => { setCheckoutPlan(null); setPendingView(null); }}
        />
      )}

      {/* ── Phone Verify Modal ── */}
      {showPhoneVerify && (
        <PhoneVerify
          sessionKey={profile.session_key}
          onVerified={() => setShowPhoneVerify(false)}
          onSkip={() => setShowPhoneVerify(false)}
        />
      )}

      {/* ── Global AI Floating Chat ── */}
      {view !== 'ai' && (
        <GlobalAIChat
          languageCode={lang}
          languageName={currentLang ? getLangZh(currentLang) : lang}
        />
      )}
    </div>
  );
};
