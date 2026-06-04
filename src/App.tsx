import React, { useState, useEffect } from 'react';
import { hasRealSupabase } from './lib/supabase';
import { Onboarding, UserProfile } from './components/Onboarding';
import { MainHub } from './components/MainHub';
import PhoneVerify from './components/PhoneVerify';
import { UILanguageProvider } from './lib/UILanguageContext';
import { UILang } from './lib/i18n';
import { setOfflineMode } from './lib/offlineData';
import { initProvider } from './providers';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initContentPreloader, preloadVoiceEngine } from './lib/contentPreloader';
import { ToastProvider } from './components/GlobalToast';

const SESSION_KEY = 'yandao_session_v5';
const PROFILE_KEY = 'yandao_profile_v5';
const PHONE_VERIFIED_KEY = 'yandao_phone_verified_v1';

// When true, skip Onboarding and auto-create demo profile for quick testing
// Set to false for production — users will see the full onboarding flow first
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// Auto-detect if Supabase is configured with real credentials
const HAS_REAL_SUPABASE =
  import.meta.env.VITE_SUPABASE_URL &&
  !import.meta.env.VITE_SUPABASE_URL.includes('your-supabase-url');

function getSessionKey(): string {
  let key = localStorage.getItem(SESSION_KEY);
  if (!key) {
    key = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, key);
  }
  return key;
}

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPhoneVerify, setShowPhoneVerify] = useState(false);
  const sessionKey = getSessionKey();

  useEffect(() => {
    // Initialize the data provider — but don't block UI on it
    // Components use getProviderSync() which returns LocalAdapter as fallback
    initProvider().catch(() => {
      setOfflineMode(true);
    });

    // If Supabase is not configured, go straight to offline mode — no network wait
    if (!HAS_REAL_SUPABASE) {
      setOfflineMode(true);
    }

    // Step 1: Check localStorage for existing profile (returning user)
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      try {
        const p = JSON.parse(saved) as UserProfile;
        if (p.completed_onboarding) {
          setProfile(p);
          setLoading(false);
          return;
        }
      } catch { /* corrupt — fall through */ }
    }

    // Step 2: DEMO_MODE shortcut — skip onboarding for quick testing
    if (DEMO_MODE) {
      setOfflineMode(true);
      const demoProfile: UserProfile = {
        session_key: sessionKey,
        language_code: 'ja',
        ui_language: 'zh',
        goal: 'daily',
        level: 'beginner',
        placement_score: 0,
        completed_onboarding: true,
        age_group: 'professional',
        interest_tags: ['anime', 'travel'],
        profession: 'tech',
      };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(demoProfile));
      setProfile(demoProfile);
      setLoading(false);
      return;
    }

    // Step 3: Try backend for returning user profile (only if configured)
    if (HAS_REAL_SUPABASE) {
      import('./data/supabase').then(({ supabase }) => {
        const timeout = setTimeout(() => {
          setLoading(false);
        }, 5000);

        supabase
          .from('user_profiles')
          .select('*')
          .eq('session_key', sessionKey)
          .eq('completed_onboarding', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
          .then(({ data, error }) => {
            clearTimeout(timeout);
            if (!error && data) {
              setProfile(data as UserProfile);
              localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
            }
            setLoading(false);
          })
          .catch(() => {
            clearTimeout(timeout);
            setLoading(false);
          });
      });
    } else {
      // No backend configured → skip network, show Onboarding for new users
      setLoading(false);
    }
  }, [sessionKey]);

  function handleOnboardingComplete(p: UserProfile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    setProfile(p);

    // 启动内容预加载：根据用户选择的语言自动下载学习资料
    if (p.language_code) {
      initContentPreloader(p.language_code);
      // 预热语音引擎
      preloadVoiceEngine(p.language_code);
    }

    if (!localStorage.getItem(PHONE_VERIFIED_KEY)) {
      setShowPhoneVerify(true);
    }
  }

  function dismissPhoneVerify() {
    localStorage.setItem(PHONE_VERIFIED_KEY, '1');
    setShowPhoneVerify(false);
  }

  function handleReset() {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('v5_game');
    localStorage.removeItem('v5_completed');
    setProfile(null);
  }

  if (loading) {
    return (
      <div className="zen-app-loading">
        <div style={{ fontSize: 36, fontWeight: 700, color: '#9B9189', letterSpacing: 6, marginBottom: 4 }}>
          言道
        </div>
        <div style={{ fontSize: 14, color: '#B8B0A8', letterSpacing: 2, marginBottom: 28 }}>
          Gendou · Language Learning
        </div>
        <div className="zen-loading-dots">
          <div className="zen-loading-dot" />
          <div className="zen-loading-dot" />
          <div className="zen-loading-dot" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <ErrorBoundary>
        <UILanguageProvider>
          <Onboarding sessionKey={sessionKey} onComplete={handleOnboardingComplete} />
        </UILanguageProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <UILanguageProvider initial={(profile.ui_language as UILang) || 'zh'}>
        <ToastProvider>
          <MainHub initialProfile={profile} onReset={handleReset} />
          {showPhoneVerify && (
            <PhoneVerify
              sessionKey={sessionKey}
              onVerified={dismissPhoneVerify}
              onSkip={dismissPhoneVerify}
            />
          )}
        </ToastProvider>
      </UILanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
