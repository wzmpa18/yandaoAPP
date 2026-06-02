import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Onboarding, UserProfile } from './components/Onboarding';
import { MainHub } from './components/MainHub';
import PhoneVerify from './components/PhoneVerify';
import { UILanguageProvider } from './lib/UILanguageContext';
import { UILang } from './lib/i18n';

const SESSION_KEY = 'yandao_session_v5';
const PROFILE_KEY = 'yandao_profile_v5';
const PHONE_VERIFIED_KEY = 'yandao_phone_verified_v1';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

function getSessionKey(): string {
  let key = localStorage.getItem(SESSION_KEY);
  if (!key) {
    key = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, key);
  }
  return key;
}

function createDemoProfile(sessionKey: string): UserProfile {
  return {
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
}

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPhoneVerify, setShowPhoneVerify] = useState(false);
  const sessionKey = getSessionKey();

  useEffect(() => {
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

    if (DEMO_MODE) {
      const demoProfile = createDemoProfile(sessionKey);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(demoProfile));
      setProfile(demoProfile);
      setLoading(false);
      return;
    }

    supabase
      .from('user_profiles')
      .select('*')
      .eq('session_key', sessionKey)
      .eq('completed_onboarding', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.warn('Supabase connection failed, using demo mode');
          const demoProfile = createDemoProfile(sessionKey);
          localStorage.setItem(PROFILE_KEY, JSON.stringify(demoProfile));
          setProfile(demoProfile);
        } else if (data) {
          setProfile(data as UserProfile);
          localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
        }
        setLoading(false);
      })
      .catch(() => {
        console.warn('Network error, using demo mode');
        const demoProfile = createDemoProfile(sessionKey);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(demoProfile));
        setProfile(demoProfile);
        setLoading(false);
      });
  }, [sessionKey]);

  function handleOnboardingComplete(p: UserProfile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    setProfile(p);
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
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#F2EFE6',
        fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 700,
        color: '#9B9189', letterSpacing: 4,
      }}>
        言道
      </div>
    );
  }

  if (!profile) {
    return (
      <UILanguageProvider>
        <Onboarding sessionKey={sessionKey} onComplete={handleOnboardingComplete} />
      </UILanguageProvider>
    );
  }

  return (
    <UILanguageProvider initial={(profile.ui_language as UILang) || 'zh'}>
      <MainHub initialProfile={profile} onReset={handleReset} />
      {showPhoneVerify && (
        <PhoneVerify
          sessionKey={sessionKey}
          onVerified={dismissPhoneVerify}
          onSkip={dismissPhoneVerify}
        />
      )}
    </UILanguageProvider>
  );
};

export default App;
