import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../data/supabase';
import { FloatingBack } from './FloatingBack';
import { canAccessFeature, UpsellPlan } from '../lib/featureGate';
import { getPartnerCandidates, isOfflineMode } from '../lib/offlineData';

interface PartnerHubProps {
  sessionKey: string;
  onBack: () => void;
  onPaywall?: (reason: string, plan?: UpsellPlan) => void;
}

type TabKey = 'find' | 'mine';

const LANG_FLAG: Record<string, string> = {
  ja: '🇯🇵', en: '🇺🇸', ko: '🇰🇷', fr: '🇫🇷', es: '🇪🇸',
  de: '🇩🇪', it: '🇮🇹', pt: '🇧🇷', ar: '🇸🇦', zh: '🇨🇳',
};
const LANG_NAME: Record<string, string> = {
  ja: '日语', en: '英语', ko: '韩语', fr: '法语', es: '西班牙语',
  de: '德语', it: '意大利语', pt: '葡语', ar: '阿语', zh: '中文',
};
const ALL_LANGS = Object.keys(LANG_FLAG);

interface PartnerProfile {
  id: string;
  session_key: string;
  display_name: string;
  native_lang: string;
  learning_lang: string;
  proficiency: number;
  bio: string;
  total_points: number;
  is_looking_partner: boolean;
}

interface MatchRecord {
  id: string;
  requester_key: string;
  receiver_key: string;
  status: string;
  created_at: string;
  partner?: PartnerProfile;
  interactions?: InteractionRecord[];
}

interface InteractionRecord {
  id: string;
  interaction_type: string;
  points_earned: number;
  note: string;
  created_at: string;
}

const INTERACTION_LABEL: Record<string, { label: string; pts: number; icon: string }> = {
  correction:   { label: '纠正对方',       pts: 5,  icon: '✏️' },
  conversation: { label: '完成5分钟对话',  pts: 10, icon: '💬' },
  exercise:     { label: '出练习题',       pts: 15, icon: '📝' },
};

function roleLabel(myKey: string, profile: PartnerProfile): string {
  if (profile.native_lang === 'ja') return '师父 Master';
  return '学徒 Apprentice';
}

function proficiencyBar(n: number) {
  return Array.from({ length: 10 }, (_, i) => (
    <span key={i} className={`ph-prof-dot ${i < n ? 'filled' : ''}`} />
  ));
}

export const PartnerHub: React.FC<PartnerHubProps> = ({ sessionKey, onBack, onPaywall }) => {
  const [tab, setTab] = useState<TabKey>('find');
  const [myProfile, setMyProfile] = useState<PartnerProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [draftProfile, setDraftProfile] = useState<Partial<PartnerProfile>>({});
  const [candidates, setCandidates] = useState<PartnerProfile[]>([]);
  const [myMatches, setMyMatches] = useState<MatchRecord[]>([]);
  const [inviteTarget, setInviteTarget] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logTarget, setLogTarget] = useState<MatchRecord | null>(null);
  const [logType, setLogType] = useState<string>('correction');
  const [logNote, setLogNote] = useState('');

  const loadMyProfile = useCallback(async () => {
    const { data } = await supabase
      .from('user_partner_profiles')
      .select('*')
      .eq('session_key', sessionKey)
      .maybeSingle();
    if (data) {
      setMyProfile(data as PartnerProfile);
      setDraftProfile(data as PartnerProfile);
    } else {
      const defaults: Partial<PartnerProfile> = {
        native_lang: 'zh', learning_lang: 'ja', proficiency: 3,
        display_name: '语伴学员', bio: '', is_looking_partner: true,
      };
      setDraftProfile(defaults);
      setEditMode(true);
    }
  }, [sessionKey]);

  const loadCandidates = useCallback(async (profile: PartnerProfile) => {
    if (isOfflineMode()) {
      const offline = getPartnerCandidates();
      setCandidates(offline as unknown as PartnerProfile[]);
      return;
    }
    const { data } = await supabase
      .from('user_partner_profiles')
      .select('*')
      .eq('is_looking_partner', true)
      .eq('native_lang', profile.learning_lang)
      .eq('learning_lang', profile.native_lang)
      .neq('session_key', sessionKey)
      .limit(20);
    if (data && data.length > 0) {
      setCandidates(data as PartnerProfile[]);
    } else {
      // Fallback to offline data
      const offline = getPartnerCandidates();
      setCandidates(offline as unknown as PartnerProfile[]);
    }
  }, [sessionKey]);

  const loadMyMatches = useCallback(async () => {
    const { data: matchRows } = await supabase
      .from('partner_matches')
      .select('*')
      .or(`requester_key.eq.${sessionKey},receiver_key.eq.${sessionKey}`)
      .order('created_at', { ascending: false });

    if (!matchRows) return;
    const enriched: MatchRecord[] = [];
    for (const m of matchRows) {
      try {
        const partnerKey = m.requester_key === sessionKey ? m.receiver_key : m.requester_key;
        const { data: pData } = await supabase
          .from('user_partner_profiles')
          .select('*')
          .eq('session_key', partnerKey)
          .maybeSingle();
        const { data: interactions } = await supabase
          .from('partner_interactions')
          .select('*')
          .eq('match_id', m.id)
          .order('created_at', { ascending: false })
          .limit(10);
        enriched.push({ ...m, partner: pData ?? undefined, interactions: interactions ?? [] });
      } catch {
        enriched.push({ ...m, partner: undefined, interactions: [] });
      }
    }
    setMyMatches(enriched);
  }, [sessionKey]);

  useEffect(() => {
    setLoading(true);
    loadMyProfile().finally(() => setLoading(false));
  }, [loadMyProfile]);

  useEffect(() => {
    if (myProfile && tab === 'find') loadCandidates(myProfile);
    if (tab === 'mine') loadMyMatches();
  }, [myProfile, tab, loadCandidates, loadMyMatches]);

  async function saveProfile() {
    if (!draftProfile.display_name?.trim()) return;
    setSaving(true);
    if (myProfile) {
      await supabase.from('user_partner_profiles')
        .update({ ...draftProfile, updated_at: new Date().toISOString() })
        .eq('session_key', sessionKey);
    } else {
      await supabase.from('user_partner_profiles')
        .insert({ ...draftProfile, session_key: sessionKey });
    }
    await loadMyProfile();
    setEditMode(false);
    setSaving(false);
  }

  async function sendInvite(target: PartnerProfile) {
    // Check partner slot quota before allowing invite
    const access = await canAccessFeature(sessionKey, 'partner_slot');
    if (!access.granted) {
      setInviteTarget(null);
      if (onPaywall) onPaywall(access.blockReason ?? '搭子名额已满', access.upsellPlan);
      return;
    }
    await supabase.from('partner_matches').insert({
      requester_key: sessionKey,
      receiver_key: target.session_key,
      status: 'accepted',
      accepted_at: new Date().toISOString(),
    });
    setInviteTarget(null);
    setTab('mine');
    loadMyMatches();
  }

  async function logInteraction() {
    if (!logTarget) return;
    const pts = INTERACTION_LABEL[logType].pts;
    await supabase.from('partner_interactions').insert({
      match_id: logTarget.id,
      actor_key: sessionKey,
      interaction_type: logType,
      points_earned: pts,
      note: logNote,
    });
    await supabase.from('user_partner_profiles')
      .update({ total_points: (myProfile?.total_points ?? 0) + pts })
      .eq('session_key', sessionKey);
    setLogTarget(null);
    setLogNote('');
    loadMyMatches();
    loadMyProfile();
  }

  if (loading) {
    return (
      <div className="ph-wrap">
        <FloatingBack onClick={onBack} />
        <div className="ph-loading">加载语伴系统…</div>
      </div>
    );
  }

  return (
    <div className="ph-wrap">
      <FloatingBack onClick={onBack} />

      {/* Header */}
      <div className="ph-header">
        <h1 className="ph-title">语伴匹配</h1>
        <p className="ph-sub">双向互教 · 积分兑币 · 学得更快</p>
        {myProfile && (
          <div className="ph-my-pts">
            <span className="ph-pts-icon">⭐</span>
            <span className="ph-pts-val">{myProfile.total_points} 积分</span>
            <span className="ph-pts-hint">≈ {Math.floor(myProfile.total_points / 10)} 金币</span>
          </div>
        )}
      </div>

      {/* My profile card / edit */}
      {editMode ? (
        <div className="ph-edit-card">
          <h3 className="ph-edit-title">完善语伴档案</h3>
          <div className="ph-field">
            <label className="ph-label">昵称</label>
            <input className="ph-input" value={draftProfile.display_name ?? ''} maxLength={20}
              onChange={(e) => setDraftProfile((d) => ({ ...d, display_name: e.target.value }))} />
          </div>
          <div className="ph-field-row">
            <div className="ph-field half">
              <label className="ph-label">我的母语</label>
              <select className="ph-select" value={draftProfile.native_lang ?? 'zh'}
                onChange={(e) => setDraftProfile((d) => ({ ...d, native_lang: e.target.value }))}>
                {ALL_LANGS.map((l) => <option key={l} value={l}>{LANG_FLAG[l]} {LANG_NAME[l]}</option>)}
              </select>
            </div>
            <div className="ph-field half">
              <label className="ph-label">我在学</label>
              <select className="ph-select" value={draftProfile.learning_lang ?? 'ja'}
                onChange={(e) => setDraftProfile((d) => ({ ...d, learning_lang: e.target.value }))}>
                {ALL_LANGS.map((l) => <option key={l} value={l}>{LANG_FLAG[l]} {LANG_NAME[l]}</option>)}
              </select>
            </div>
          </div>
          <div className="ph-field">
            <label className="ph-label">熟练度 {draftProfile.proficiency ?? 1}/10</label>
            <input type="range" min="1" max="10" value={draftProfile.proficiency ?? 1}
              onChange={(e) => setDraftProfile((d) => ({ ...d, proficiency: parseInt(e.target.value) }))}
              className="ph-range" />
          </div>
          <div className="ph-field">
            <label className="ph-label">一句话介绍（可选）</label>
            <input className="ph-input" value={draftProfile.bio ?? ''} maxLength={50} placeholder="例：日语N3，想找中文母语搭子互练…"
              onChange={(e) => setDraftProfile((d) => ({ ...d, bio: e.target.value }))} />
          </div>
          <div className="ph-field ph-toggle-row">
            <label className="ph-label">开放匹配</label>
            <button
              className={`ph-toggle ${draftProfile.is_looking_partner ? 'on' : 'off'}`}
              onClick={() => setDraftProfile((d) => ({ ...d, is_looking_partner: !d.is_looking_partner }))}
            >
              {draftProfile.is_looking_partner ? '✓ 寻找语伴中' : '暂不寻找'}
            </button>
          </div>
          <button className="ph-save-btn" disabled={saving} onClick={saveProfile}>
            {saving ? '保存中…' : '保存档案'}
          </button>
        </div>
      ) : myProfile && (
        <div className="ph-my-card" onClick={() => setEditMode(true)}>
          <div className="ph-my-left">
            <span className="ph-my-name">{myProfile.display_name}</span>
            <div className="ph-my-langs">
              <span>{LANG_FLAG[myProfile.native_lang]} 母语</span>
              <span className="ph-arrow">→</span>
              <span>{LANG_FLAG[myProfile.learning_lang]} 学习中</span>
            </div>
            <div className="ph-prof-row">{proficiencyBar(myProfile.proficiency)}</div>
          </div>
          <div className="ph-my-right">
            <span className={`ph-badge ${myProfile.is_looking_partner ? 'looking' : 'idle'}`}>
              {myProfile.is_looking_partner ? '匹配中' : '未开放'}
            </span>
            <span className="ph-edit-hint">点击编辑</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="ph-tabs">
        <button className={`ph-tab ${tab === 'find' ? 'active' : ''}`} onClick={() => setTab('find')}>
          找搭子
        </button>
        <button className={`ph-tab ${tab === 'mine' ? 'active' : ''}`} onClick={() => setTab('mine')}>
          我的搭子 {myMatches.length > 0 && <span className="ph-badge-count">{myMatches.length}</span>}
        </button>
      </div>

      {/* ── FIND TAB ── */}
      {tab === 'find' && (
        <div className="ph-list">
          {!myProfile && (
            <div className="ph-empty">请先完善语伴档案，才能查看推荐搭子</div>
          )}
          {myProfile && candidates.length === 0 && (
            <div className="ph-empty">
              <p>暂无匹配的语伴</p>
              <p className="ph-empty-hint">系统会为你匹配：母语={LANG_NAME[myProfile.learning_lang]}、学习={LANG_NAME[myProfile.native_lang]} 的用户</p>
            </div>
          )}
          {candidates.map((c) => (
            <div className="ph-candidate-card" key={c.id}>
              <div className="ph-cand-top">
                <div className="ph-cand-avatar">{LANG_FLAG[c.native_lang]}</div>
                <div className="ph-cand-info">
                  <span className="ph-cand-name">{c.display_name}</span>
                  <div className="ph-cand-langs">
                    <span>{LANG_FLAG[c.native_lang]} 母语 {LANG_NAME[c.native_lang]}</span>
                    <span className="ph-arrow">·</span>
                    <span>正学 {LANG_FLAG[c.learning_lang]} {LANG_NAME[c.learning_lang]}</span>
                  </div>
                  {c.bio && <p className="ph-cand-bio">{c.bio}</p>}
                </div>
              </div>
              <div className="ph-cand-bottom">
                <div className="ph-prof-row">{proficiencyBar(c.proficiency)}<span className="ph-prof-num">{c.proficiency}/10</span></div>
                <div className="ph-cand-meta">
                  <span className="ph-cand-role">{c.native_lang === 'ja' ? '🎓 师父 Master' : '📖 学徒 Apprentice'}</span>
                  <span className="ph-cand-pts">⭐ {c.total_points}</span>
                </div>
                <button className="ph-invite-btn" onClick={() => setInviteTarget(c)}>发送邀请</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MINE TAB ── */}
      {tab === 'mine' && (
        <div className="ph-list">
          {myMatches.length === 0 && (
            <div className="ph-empty">还没有搭子，去"找搭子"发邀请吧！</div>
          )}
          {myMatches.map((m) => (
            <div className="ph-match-card" key={m.id}>
              <div className="ph-match-top">
                <div className="ph-match-avatar">
                  {m.partner ? LANG_FLAG[m.partner.native_lang] : '👤'}
                </div>
                <div className="ph-match-info">
                  <span className="ph-match-name">{m.partner?.display_name ?? '未知用户'}</span>
                  {m.partner && (
                    <span className="ph-match-role">
                      {m.partner.native_lang === 'ja' ? '🎓 师父 Master' : '📖 学徒 Apprentice'}
                    </span>
                  )}
                  <span className={`ph-status-badge ${m.status}`}>{
                    m.status === 'pending' ? '等待确认' :
                    m.status === 'accepted' ? '✓ 已匹配' :
                    m.status === 'declined' ? '已婉拒' : '已结束'
                  }</span>
                </div>
                {m.status === 'accepted' && (
                  <button className="ph-log-btn" onClick={() => setLogTarget(m)}>记录互动</button>
                )}
              </div>

              {/* Interaction history */}
              {m.interactions && m.interactions.length > 0 && (
                <div className="ph-interactions">
                  {m.interactions.slice(0, 3).map((it) => (
                    <div className="ph-interaction-row" key={it.id}>
                      <span className="ph-it-icon">{INTERACTION_LABEL[it.interaction_type]?.icon}</span>
                      <span className="ph-it-label">{INTERACTION_LABEL[it.interaction_type]?.label}</span>
                      <span className="ph-it-pts">+{it.points_earned}分</span>
                      {it.note && <span className="ph-it-note">{it.note}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Points rules banner */}
      <div className="ph-rules-banner">
        <h4 className="ph-rules-title">积分规则</h4>
        <div className="ph-rules-grid">
          {Object.entries(INTERACTION_LABEL).map(([k, v]) => (
            <div className="ph-rule-chip" key={k}>
              <span>{v.icon} {v.label}</span>
              <span className="ph-rule-pts">+{v.pts}分</span>
            </div>
          ))}
          <div className="ph-rule-chip">
            <span>🪙 积分兑换</span>
            <span className="ph-rule-pts">10分=1金币</span>
          </div>
        </div>
      </div>

      {/* ── Invite modal ── */}
      {inviteTarget && (
        <div className="ph-modal-overlay" onClick={() => setInviteTarget(null)}>
          <div className="ph-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="ph-modal-title">邀请语伴</h3>
            <div className="ph-modal-avatar">{LANG_FLAG[inviteTarget.native_lang]}</div>
            <p className="ph-modal-name">{inviteTarget.display_name}</p>
            <p className="ph-modal-detail">
              {LANG_FLAG[inviteTarget.native_lang]} 母语 {LANG_NAME[inviteTarget.native_lang]}
              {' '}·{' '}
              正学 {LANG_FLAG[inviteTarget.learning_lang]} {LANG_NAME[inviteTarget.learning_lang]}
            </p>
            <p className="ph-modal-role">
              {inviteTarget.native_lang === 'ja' ? '🎓 将担任：师父 Master（日语母语方）' : '📖 将担任：学徒 Apprentice'}
            </p>
            <p className="ph-modal-hint">双方互教母语，共同成长，积分可兑换金币提现</p>
            <div className="ph-modal-actions">
              <button className="ph-modal-confirm" onClick={() => sendInvite(inviteTarget)}>确认邀请</button>
              <button className="ph-modal-cancel" onClick={() => setInviteTarget(null)}>取消</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Log interaction modal ── */}
      {logTarget && (
        <div className="ph-modal-overlay" onClick={() => setLogTarget(null)}>
          <div className="ph-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="ph-modal-title">记录互动得分</h3>
            <div className="ph-log-types">
              {Object.entries(INTERACTION_LABEL).map(([k, v]) => (
                <button
                  key={k}
                  className={`ph-log-type-btn ${logType === k ? 'active' : ''}`}
                  onClick={() => setLogType(k)}
                >
                  <span>{v.icon}</span>
                  <span>{v.label}</span>
                  <span className="ph-log-pts">+{v.pts}分</span>
                </button>
              ))}
            </div>
            <input className="ph-input" value={logNote} placeholder="备注（可选）"
              onChange={(e) => setLogNote(e.target.value)} />
            <div className="ph-modal-actions">
              <button className="ph-modal-confirm" onClick={logInteraction}>记录 +{INTERACTION_LABEL[logType].pts}分</button>
              <button className="ph-modal-cancel" onClick={() => setLogTarget(null)}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
