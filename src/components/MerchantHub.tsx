import React, { useState, useEffect, useCallback } from 'react';
import { FloatingBack } from './FloatingBack';
import { supabase } from '../data/supabase';

const SESSION_KEY_STORE = 'yandao_session_v5';
function getSessionKey(): string { return localStorage.getItem(SESSION_KEY_STORE) ?? 'anon'; }

interface MerchantHubProps {
  onBack: () => void;
}

interface Merchant {
  id: string;
  session_key: string;
  business_name: string;
  contact_email: string;
  description: string;
  category: string;
  website_url: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string;
  daily_ad_limit: number;
  weekly_ad_limit: number;
  total_impressions: number;
  total_joins: number;
  created_at: string;
}

interface AdCampaign {
  id: string;
  merchant_id: string;
  campaign_name: string;
  target_lang_codes: string[];
  target_regions: string[];
  target_activity_level: string;
  group_id: string | null;
  status: 'active' | 'paused' | 'ended';
  daily_budget_impressions: number;
  impressions: number;
  joins: number;
  created_at: string;
}

interface StudyGroup {
  id: string;
  name: string;
  lang_code: string;
  size_tier: string;
}

const LANG_OPTIONS = [
  { code: 'ja', label: '日语' },
  { code: 'ko', label: '韩语' },
  { code: 'fr', label: '法语' },
  { code: 'es', label: '西班牙语' },
  { code: 'de', label: '德语' },
  { code: 'en', label: '英语' },
];
const REGION_OPTIONS = ['中国大陆', '香港', '台湾', '日本', '韩国', '东南亚', '北美', '欧洲'];
const ACTIVITY_OPTIONS = [
  { value: 'any', label: '全部用户' },
  { value: 'high', label: '高活跃（近7日打卡≥5）' },
  { value: 'mid', label: '中活跃（近7日打卡≥2）' },
  { value: 'low', label: '低活跃（近7日打卡<2）' },
];
const CATEGORY_OPTIONS = [
  { value: 'education', label: '教育机构' },
  { value: 'media', label: '学习媒体/博主' },
  { value: 'tools', label: '学习工具' },
  { value: 'tutoring', label: '家教/辅导' },
  { value: 'other', label: '其他' },
];

type MHTab = 'overview' | 'apply' | 'campaigns' | 'new_campaign' | 'stats';

export const MerchantHub: React.FC<MerchantHubProps> = ({ onBack }) => {
  const sessionKey = getSessionKey();
  const [tab, setTab] = useState<MHTab>('overview');
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Apply form
  const [appName, setAppName] = useState('');
  const [appEmail, setAppEmail] = useState('');
  const [appDesc, setAppDesc] = useState('');
  const [appCat, setAppCat] = useState('education');
  const [appUrl, setAppUrl] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyDone, setApplyDone] = useState(false);

  // Campaign form
  const [cpName, setCpName] = useState('');
  const [cpLangs, setCpLangs] = useState<string[]>([]);
  const [cpRegions, setCpRegions] = useState<string[]>([]);
  const [cpActivity, setCpActivity] = useState('any');
  const [cpGroupId, setCpGroupId] = useState('');
  const [cpBudget, setCpBudget] = useState(100);
  const [cpSaving, setCpSaving] = useState(false);
  const [cpDone, setCpDone] = useState(false);

  const loadData = useCallback(async () => {
    const [mRes, gRes] = await Promise.all([
      supabase.from('merchants').select('*').eq('session_key', sessionKey).maybeSingle(),
      supabase.from('study_groups').select('id,name,lang_code,size_tier').eq('creator_key', sessionKey),
    ]);
    const m = mRes.data as Merchant | null;
    setMerchant(m);
    setMyGroups((gRes.data ?? []) as StudyGroup[]);

    if (m) {
      const cRes = await supabase.from('ad_campaigns').select('*').eq('merchant_id', m.id).order('created_at', { ascending: false });
      setCampaigns((cRes.data ?? []) as AdCampaign[]);
    }
  }, [sessionKey]);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  async function applyMerchant() {
    if (!appName.trim() || !appEmail.trim()) return;
    setApplying(true);
    await supabase.from('merchants').insert({
      session_key: sessionKey,
      business_name: appName.trim(),
      contact_email: appEmail.trim(),
      description: appDesc.trim(),
      category: appCat,
      website_url: appUrl.trim(),
    });
    setApplying(false);
    setApplyDone(true);
    loadData();
  }

  async function createCampaign() {
    if (!merchant || !cpName.trim()) return;
    setCpSaving(true);
    await supabase.from('ad_campaigns').insert({
      merchant_id: merchant.id,
      campaign_name: cpName.trim(),
      target_lang_codes: cpLangs,
      target_regions: cpRegions,
      target_activity_level: cpActivity,
      group_id: cpGroupId || null,
      daily_budget_impressions: cpBudget,
    });
    setCpSaving(false);
    setCpDone(true);
    setCpName(''); setCpLangs([]); setCpRegions([]); setCpActivity('any'); setCpGroupId(''); setCpBudget(100);
    setTimeout(() => { setCpDone(false); setTab('campaigns'); loadData(); }, 1500);
  }

  async function toggleCampaign(cp: AdCampaign) {
    const next = cp.status === 'active' ? 'paused' : 'active';
    await supabase.from('ad_campaigns').update({ status: next }).eq('id', cp.id);
    loadData();
  }

  function toggleLang(code: string) {
    setCpLangs((prev) => prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]);
  }
  function toggleRegion(r: string) {
    setCpRegions((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);
  }

  if (loading) return (
    <div className="mh-wrap">
      <FloatingBack onClick={onBack} />
      <div className="mh-loading">加载商家数据…</div>
    </div>
  );

  // No application yet
  if (!merchant && !applyDone) {
    return (
      <div className="mh-wrap">
        <FloatingBack onClick={onBack} />
        <div className="mh-hero">
          <div className="mh-hero-icon">🏪</div>
          <h2 className="mh-hero-title">商家入驻</h2>
          <p className="mh-hero-sub">触达数万语言学习者 · 精准投放学习圈推广卡片</p>
        </div>

        <div className="mh-benefits">
          <div className="mh-benefit-item"><span className="mh-benefit-icon">🎯</span><div><strong>精准定向</strong><p>按注册地、学习语言、活跃度投放</p></div></div>
          <div className="mh-benefit-item"><span className="mh-benefit-icon">📊</span><div><strong>实时数据</strong><p>曝光量、加群率全掌握</p></div></div>
          <div className="mh-benefit-item"><span className="mh-benefit-icon">🔒</span><div><strong>合规保护</strong><p>不获取用户隐私，建立信任</p></div></div>
        </div>

        <div className="mh-apply-form">
          <h3 className="mh-form-title">申请成为商家</h3>
          <div className="mh-field">
            <label className="mh-label">机构/品牌名称 *</label>
            <input className="mh-input" value={appName} placeholder="如：新东方在线" onChange={(e) => setAppName(e.target.value)} />
          </div>
          <div className="mh-field">
            <label className="mh-label">联系邮箱 *</label>
            <input className="mh-input" type="email" value={appEmail} placeholder="business@example.com" onChange={(e) => setAppEmail(e.target.value)} />
          </div>
          <div className="mh-field">
            <label className="mh-label">机构类型</label>
            <select className="mh-select" value={appCat} onChange={(e) => setAppCat(e.target.value)}>
              {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="mh-field">
            <label className="mh-label">机构简介</label>
            <textarea className="mh-textarea" rows={3} value={appDesc} placeholder="简要介绍你的机构/品牌和主要产品…" onChange={(e) => setAppDesc(e.target.value)} />
          </div>
          <div className="mh-field">
            <label className="mh-label">官网（选填）</label>
            <input className="mh-input" value={appUrl} placeholder="https://" onChange={(e) => setAppUrl(e.target.value)} />
          </div>
          <div className="mh-notice">
            <strong>商家须知：</strong>商家不可主动私聊用户，不可获取用户手机号/微信。投放须通过平台审核，违规将永久封禁。
          </div>
          <button className="mh-submit-btn" disabled={applying || !appName.trim() || !appEmail.trim()} onClick={applyMerchant}>
            {applying ? '提交中…' : '提交申请'}
          </button>
        </div>
      </div>
    );
  }

  // Applied but pending
  if (merchant?.status === 'pending' || applyDone) {
    return (
      <div className="mh-wrap">
        <FloatingBack onClick={onBack} />
        <div className="mh-status-card pending">
          <span className="mh-status-icon">⏳</span>
          <h3>申请审核中</h3>
          <p>平台将在 1-3 个工作日内完成审核，结果将通过邮件通知</p>
          {merchant && <p className="mh-status-name">{merchant.business_name}</p>}
        </div>
      </div>
    );
  }

  // Rejected
  if (merchant?.status === 'rejected') {
    return (
      <div className="mh-wrap">
        <FloatingBack onClick={onBack} />
        <div className="mh-status-card rejected">
          <span className="mh-status-icon">❌</span>
          <h3>申请未通过</h3>
          <p>{merchant.rejection_reason || '请联系平台客服了解详情'}</p>
        </div>
      </div>
    );
  }

  // Approved merchant full UI
  const joinRate = merchant!.total_impressions > 0
    ? ((merchant!.total_joins / merchant!.total_impressions) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="mh-wrap">
      <FloatingBack onClick={onBack} />

      {/* Header */}
      <div className="mh-approved-header">
        <div className="mh-approved-badge">官方商家 ✓</div>
        <h2 className="mh-approved-name">{merchant!.business_name}</h2>
        <p className="mh-approved-cat">{CATEGORY_OPTIONS.find((c) => c.value === merchant!.category)?.label}</p>
      </div>

      {/* Tabs */}
      <div className="mh-tabs">
        {([['overview','总览'],['campaigns','投放管理'],['new_campaign','新建投放'],['stats','数据报告']] as [MHTab,string][]).map(([k,l]) => (
          <button key={k} className={`mh-tab ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div className="mh-tab-body">
          <div className="mh-kpi-grid">
            <div className="mh-kpi"><span className="mh-kpi-val">{merchant!.total_impressions.toLocaleString()}</span><span className="mh-kpi-label">累计曝光</span></div>
            <div className="mh-kpi"><span className="mh-kpi-val">{merchant!.total_joins.toLocaleString()}</span><span className="mh-kpi-label">累计加群</span></div>
            <div className="mh-kpi"><span className="mh-kpi-val">{joinRate}%</span><span className="mh-kpi-label">加群率</span></div>
            <div className="mh-kpi"><span className="mh-kpi-val">{campaigns.filter((c) => c.status === 'active').length}</span><span className="mh-kpi-label">活跃投放</span></div>
          </div>
          <div className="mh-section-title">我的学习圈群组</div>
          {myGroups.length === 0 && <div className="mh-empty">尚未创建学习圈群组，前往学习圈页面创建</div>}
          {myGroups.map((g) => (
            <div className="mh-group-row" key={g.id}>
              <span className="mh-group-badge merchant">官方商家</span>
              <span className="mh-group-name">{g.name}</span>
              <span className="mh-group-lang">{g.lang_code.toUpperCase()}</span>
            </div>
          ))}
          <div className="mh-notice">
            <strong>商家须知：</strong>不可主动私聊用户 · 不可获取手机号/微信 · 违规投诉将封号
          </div>
        </div>
      )}

      {/* ── CAMPAIGNS ── */}
      {tab === 'campaigns' && (
        <div className="mh-tab-body">
          {campaigns.length === 0 && (
            <div className="mh-empty">还没有投放计划，点击「新建投放」开始</div>
          )}
          {campaigns.map((cp) => {
            const rate = cp.impressions > 0 ? ((cp.joins / cp.impressions) * 100).toFixed(1) : '0.0';
            return (
              <div className="mh-cp-card" key={cp.id}>
                <div className="mh-cp-top">
                  <span className={`mh-cp-status ${cp.status}`}>{cp.status === 'active' ? '投放中' : cp.status === 'paused' ? '已暂停' : '已结束'}</span>
                  <span className="mh-cp-name">{cp.campaign_name}</span>
                  <button className="mh-cp-toggle" onClick={() => toggleCampaign(cp)}>
                    {cp.status === 'active' ? '暂停' : '启动'}
                  </button>
                </div>
                <div className="mh-cp-targets">
                  {cp.target_lang_codes.map((l) => <span key={l} className="mh-cp-tag">{l.toUpperCase()}</span>)}
                  {cp.target_regions.map((r) => <span key={r} className="mh-cp-tag">{r}</span>)}
                  <span className="mh-cp-tag activity">{ACTIVITY_OPTIONS.find((a) => a.value === cp.target_activity_level)?.label ?? cp.target_activity_level}</span>
                </div>
                <div className="mh-cp-stats">
                  <span>曝光 <strong>{cp.impressions}</strong></span>
                  <span>加群 <strong>{cp.joins}</strong></span>
                  <span>加群率 <strong>{rate}%</strong></span>
                  <span>日预算 <strong>{cp.daily_budget_impressions}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── NEW CAMPAIGN ── */}
      {tab === 'new_campaign' && (
        <div className="mh-tab-body">
          {cpDone ? (
            <div className="mh-done-msg">投放计划已创建！</div>
          ) : (
            <>
              <div className="mh-field">
                <label className="mh-label">投放计划名称 *</label>
                <input className="mh-input" value={cpName} placeholder="如：日语N2学习圈春季推广" onChange={(e) => setCpName(e.target.value)} />
              </div>
              <div className="mh-field">
                <label className="mh-label">目标学习语言（多选）</label>
                <div className="mh-chip-row">
                  {LANG_OPTIONS.map((l) => (
                    <button key={l.code} className={`mh-chip ${cpLangs.includes(l.code) ? 'active' : ''}`} onClick={() => toggleLang(l.code)}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mh-field">
                <label className="mh-label">目标地区（多选）</label>
                <div className="mh-chip-row">
                  {REGION_OPTIONS.map((r) => (
                    <button key={r} className={`mh-chip ${cpRegions.includes(r) ? 'active' : ''}`} onClick={() => toggleRegion(r)}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mh-field">
                <label className="mh-label">目标活跃度</label>
                <select className="mh-select" value={cpActivity} onChange={(e) => setCpActivity(e.target.value)}>
                  {ACTIVITY_OPTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
              <div className="mh-field">
                <label className="mh-label">关联学习圈群组（选填）</label>
                <select className="mh-select" value={cpGroupId} onChange={(e) => setCpGroupId(e.target.value)}>
                  <option value="">-- 不关联群组 --</option>
                  {myGroups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                {myGroups.length === 0 && <p className="mh-hint">请先在学习圈页面创建群组</p>}
              </div>
              <div className="mh-field">
                <label className="mh-label">日曝光预算</label>
                <div className="mh-slider-row">
                  <input type="range" min="50" max="2000" step="50" value={cpBudget}
                    onChange={(e) => setCpBudget(parseInt(e.target.value))} className="mh-slider" />
                  <span className="mh-slider-val">{cpBudget} 次/天</span>
                </div>
              </div>
              <button className="mh-submit-btn" disabled={cpSaving || !cpName.trim()} onClick={createCampaign}>
                {cpSaving ? '创建中…' : '创建投放计划'}
              </button>
            </>
          )}
        </div>
      )}

      {/* ── STATS ── */}
      {tab === 'stats' && (
        <div className="mh-tab-body">
          <div className="mh-section-title">近7日投放数据</div>
          {campaigns.length === 0 && <div className="mh-empty">暂无投放数据</div>}
          {campaigns.map((cp) => {
            const rate = cp.impressions > 0 ? ((cp.joins / cp.impressions) * 100).toFixed(1) : '0.0';
            const barW = Math.min(cp.impressions / Math.max(...campaigns.map((c) => c.impressions), 1) * 100, 100);
            return (
              <div className="mh-stat-row" key={cp.id}>
                <div className="mh-stat-label-row">
                  <span className="mh-stat-name">{cp.campaign_name}</span>
                  <span className="mh-stat-rate">{rate}% 加群率</span>
                </div>
                <div className="mh-stat-bar-wrap">
                  <div className="mh-stat-fill" style={{ width: `${barW}%` }} />
                </div>
                <div className="mh-stat-nums">
                  <span>曝光 {cp.impressions}</span>
                  <span>加群 {cp.joins}</span>
                  <span>日预算 {cp.daily_budget_impressions}</span>
                </div>
              </div>
            );
          })}
          <div className="mh-stats-note">
            数据每日0点更新。用户屏蔽商家推送不计入曝光。
          </div>
        </div>
      )}
    </div>
  );
};
