import React, { useState, useEffect, useCallback } from 'react';
import { FloatingBack } from './FloatingBack';
import { supabase } from '../lib/supabase';
import { useUI } from '../lib/UILanguageContext';

const SESSION_KEY_STORE = 'yandao_session_v5';
function getSessionKey(): string { return localStorage.getItem(SESSION_KEY_STORE) ?? 'anon'; }

interface PrivacySettingsProps {
  onBack: () => void;
}

interface PrivacySettings {
  id?: string;
  session_key: string;
  allow_discovery: boolean;
  allow_merchant_push: boolean;
  allow_group_invite: boolean;
  group_message_notify: boolean;
  pause_all_strangers: boolean;
  group_invite_warned: boolean;
}

const DEFAULT_SETTINGS: Omit<PrivacySettings, 'id'> = {
  session_key: '',
  allow_discovery: true,
  allow_merchant_push: true,
  allow_group_invite: true,
  group_message_notify: true,
  pause_all_strangers: false,
  group_invite_warned: false,
};

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({ onBack }) => {
  const { s } = useUI();
  const sessionKey = getSessionKey();
  const [settings, setSettings] = useState<PrivacySettings>({ ...DEFAULT_SETTINGS, session_key: sessionKey });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);

  const loadSettings = useCallback(async () => {
    const { data } = await supabase.from('user_privacy_settings')
      .select('*').eq('session_key', sessionKey).maybeSingle();
    if (data) {
      setSettings(data as PrivacySettings);
    }
  }, [sessionKey]);

  useEffect(() => {
    setLoading(true);
    loadSettings().finally(() => setLoading(false));
  }, [loadSettings]);

  async function save(updated: PrivacySettings) {
    setSaving(true);
    if (updated.id) {
      await supabase.from('user_privacy_settings')
        .update({ ...updated, updated_at: new Date().toISOString() })
        .eq('id', updated.id);
    } else {
      const { data } = await supabase.from('user_privacy_settings')
        .insert({ ...updated, session_key: sessionKey })
        .select().maybeSingle();
      if (data) setSettings(data as PrivacySettings);
    }
    setSaving(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  function toggle(key: keyof Omit<PrivacySettings, 'id' | 'session_key' | 'group_invite_warned'>) {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    save(updated);
  }

  async function activatePauseAll() {
    const updated = {
      ...settings,
      pause_all_strangers: true,
      allow_discovery: false,
      allow_merchant_push: false,
      allow_group_invite: false,
    };
    setSettings(updated);
    setShowPauseConfirm(false);
    await save(updated);
  }

  async function deactivatePauseAll() {
    const updated = {
      ...settings,
      pause_all_strangers: false,
      allow_discovery: true,
      allow_merchant_push: true,
      allow_group_invite: true,
    };
    setSettings(updated);
    await save(updated);
  }

  if (loading) return (
    <div className="ps-wrap">
      <FloatingBack onClick={onBack} />
      <div className="ps-loading">加载隐私设置…</div>
    </div>
  );

  const pauseActive = settings.pause_all_strangers;

  return (
    <div className="ps-wrap">
      <FloatingBack onClick={onBack} />

      <div className="ps-header">
        <h2 className="ps-title">隐私与安全</h2>
        <p className="ps-sub">掌控你的个人数据与社交边界</p>
      </div>

      {savedFlash && <div className="ps-saved-flash">已保存 ✓</div>}

      {/* Pause all banner */}
      {pauseActive && (
        <div className="ps-pause-banner">
          <span className="ps-pause-icon">🔕</span>
          <div className="ps-pause-text">
            <strong>陌生互动已暂停</strong>
            <p>商家推送、陌生发现、拉群邀请均已屏蔽</p>
          </div>
          <button className="ps-pause-resume" onClick={deactivatePauseAll}>恢复</button>
        </div>
      )}

      {/* Main switches */}
      <div className="ps-card">
        <div className="ps-card-title">社交发现</div>

        <div className="ps-row">
          <div className="ps-row-info">
            <span className="ps-row-label">{s.privacy_discover}</span>
            <span className="ps-row-desc">关闭后不出现在"附近学习者"等推荐列表</span>
          </div>
          <button
            className={`ps-toggle ${settings.allow_discovery ? 'on' : 'off'} ${pauseActive ? 'disabled' : ''}`}
            onClick={() => !pauseActive && toggle('allow_discovery')}
          >
            <span className="ps-toggle-knob" />
          </button>
        </div>

        <div className="ps-divider" />

        <div className="ps-row">
          <div className="ps-row-info">
            <span className="ps-row-label">{s.privacy_merchant_push}</span>
            <span className="ps-row-desc">关闭后商家投放将自动屏蔽你</span>
          </div>
          <button
            className={`ps-toggle ${settings.allow_merchant_push ? 'on' : 'off'} ${pauseActive ? 'disabled' : ''}`}
            onClick={() => !pauseActive && toggle('allow_merchant_push')}
          >
            <span className="ps-toggle-knob" />
          </button>
        </div>

        <div className="ps-divider" />

        <div className="ps-row">
          <div className="ps-row-info">
            <span className="ps-row-label">{s.privacy_group_invite}</span>
            <span className="ps-row-desc">关闭后只有好友可邀请入群</span>
          </div>
          <button
            className={`ps-toggle ${settings.allow_group_invite ? 'on' : 'off'} ${pauseActive ? 'disabled' : ''}`}
            onClick={() => !pauseActive && toggle('allow_group_invite')}
          >
            <span className="ps-toggle-knob" />
          </button>
        </div>
      </div>

      <div className="ps-card">
        <div className="ps-card-title">通知设置</div>

        <div className="ps-row">
          <div className="ps-row-info">
            <span className="ps-row-label">{s.privacy_notifications}</span>
            <span className="ps-row-desc">关闭后群组新消息不推送通知</span>
          </div>
          <button
            className={`ps-toggle ${settings.group_message_notify ? 'on' : 'off'}`}
            onClick={() => toggle('group_message_notify')}
          >
            <span className="ps-toggle-knob" />
          </button>
        </div>
      </div>

      {/* Status indicators */}
      <div className="ps-effect-card">
        <div className="ps-effect-title">当前隐私状态</div>
        <div className="ps-effect-row">
          <span className={`ps-effect-dot ${settings.allow_discovery ? 'green' : 'gray'}`} />
          <span>被陌生人发现：{settings.allow_discovery ? '已开启' : '已关闭'}</span>
        </div>
        <div className="ps-effect-row">
          <span className={`ps-effect-dot ${settings.allow_merchant_push ? 'green' : 'gray'}`} />
          <span>商家推送：{settings.allow_merchant_push ? '已开启' : '已屏蔽'}</span>
        </div>
        <div className="ps-effect-row">
          <span className={`ps-effect-dot ${settings.allow_group_invite ? 'green' : 'gray'}`} />
          <span>拉群邀请：{settings.allow_group_invite ? '接受任意' : '仅好友'}</span>
        </div>
        <div className="ps-effect-row">
          <span className={`ps-effect-dot ${settings.group_message_notify ? 'green' : 'gray'}`} />
          <span>消息通知：{settings.group_message_notify ? '开启' : '静音'}</span>
        </div>
      </div>

      {/* One-tap pause */}
      {!pauseActive ? (
        <button className="ps-pause-btn" onClick={() => setShowPauseConfirm(true)}>
          🔕 {s.privacy_pause_all}
        </button>
      ) : (
        <button className="ps-resume-btn" onClick={deactivatePauseAll}>
          🔔 {s.btn_confirm}
        </button>
      )}

      <div className="ps-footnote">
        关闭任意开关不影响你主动加好友或主动加群。商家无法获取你的手机号或微信。
      </div>

      {/* Pause confirm modal */}
      {showPauseConfirm && (
        <div className="ps-modal-overlay" onClick={() => setShowPauseConfirm(false)}>
          <div className="ps-modal" onClick={(e) => e.stopPropagation()}>
            <h4 className="ps-modal-title">暂停所有陌生互动？</h4>
            <p className="ps-modal-body">
              将同时关闭：被陌生人发现 / 商家推送 / 拉群邀请。你仍可主动联系他人。
            </p>
            <div className="ps-modal-actions">
              <button className="ps-modal-confirm" onClick={activatePauseAll}>确认暂停</button>
              <button className="ps-modal-cancel" onClick={() => setShowPauseConfirm(false)}>取消</button>
            </div>
          </div>
        </div>
      )}

      {saving && <div className="ps-saving-indicator">保存中…</div>}
    </div>
  );
};

// Utility: check if a user allows merchant push (call before showing ad cards)
export async function userAllowsMerchantPush(sessionKey: string): Promise<boolean> {
  const { data } = await supabase.from('user_privacy_settings')
    .select('allow_merchant_push, pause_all_strangers')
    .eq('session_key', sessionKey)
    .maybeSingle();
  if (!data) return true; // default ON when no record
  return data.allow_merchant_push && !data.pause_all_strangers;
}

// Utility: check if a user allows group invite (call before group invite)
export async function userAllowsGroupInvite(sessionKey: string): Promise<{ allowed: boolean; warned: boolean }> {
  const { data } = await supabase.from('user_privacy_settings')
    .select('allow_group_invite, pause_all_strangers, group_invite_warned')
    .eq('session_key', sessionKey)
    .maybeSingle();
  if (!data) return { allowed: true, warned: false };
  return {
    allowed: data.allow_group_invite && !data.pause_all_strangers,
    warned: data.group_invite_warned,
  };
}
