import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { FloatingBack } from './FloatingBack';
import { GroupShop } from './GroupShop';
import { userAllowsMerchantPush } from './PrivacySettings';
import { mockUserProfiles, interestTags, locationTags } from '../data/mockData';

interface FilterOptions {
  locations: string[];
  interests: string[];
  minLevel: number;
  maxLevel: number;
}

interface MerchantCard {
  id: string;
  campaign_name: string;
  group_id: string | null;
  group_name?: string;
  group_lang?: string;
  merchant_name: string;
}

interface StudyCircleProps {
  sessionKey: string;
  onBack: () => void;
}

type TabKey = 'browse' | 'mine' | 'create';

const LANG_FLAG: Record<string, string> = {
  ja: '🇯🇵', en: '🇺🇸', ko: '🇰🇷', fr: '🇫🇷', es: '🇪🇸',
  de: '🇩🇪', it: '🇮🇹', pt: '🇧🇷', ar: '🇸🇦', zh: '🇨🇳',
};
const LANG_NAME: Record<string, string> = {
  ja: '日语', en: '英语', ko: '韩语', fr: '法语', es: '西班牙语',
  de: '德语', it: '意大利语', pt: '葡语', ar: '阿语', zh: '中文',
};
const ALL_LANGS = Object.keys(LANG_FLAG);

interface GroupConfig {
  type: 'small' | 'mid' | 'large' | 'vip';
  label: string;
  maxMembers: number;
  fee: number;
  deposit: number;
  icon: string;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  group_type: string;
  lang_focus: string;
  owner_key: string;
  member_count: number;
  max_members: number;
  fee_paid_fen: number;
  deposit_fen: number;
  deposit_status: string;
  shop_enabled: boolean;
  status: string;
  is_active: boolean;
  deposit_forfeited: boolean;
  ban_reason: string;
  banned_at: string | null;
  creator_key: string;
  created_at: string;
}

interface GroupMember {
  id: string;
  group_id: string;
  session_key: string;
  display_name: string;
  role: string;
  joined_at: string;
}

function fenToYuan(fen: number): string {
  if (fen === 0) return '免费';
  return `¥${(fen / 100).toFixed(1)}`;
}

export const StudyCircle: React.FC<StudyCircleProps> = ({ sessionKey, onBack }) => {
  const [tab, setTab] = useState<TabKey>('browse');
  const [configs, setConfigs] = useState<GroupConfig[]>([]);
  const [dissolveRefundPct, setDissolveRefundPct] = useState(50);
  const [allGroups, setAllGroups] = useState<StudyGroup[]>([]);
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [shopGroupId, setShopGroupId] = useState<string | null>(null);

  // Transfer state
  const [transferTarget, setTransferTarget] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferDone, setTransferDone] = useState(false);
  const [transferring, setTransferring] = useState(false);

  // Dissolve / ban state
  const [showDissolve, setShowDissolve] = useState(false);
  const [dissolving, setDissolving] = useState(false);
  const [dissolveDone, setDissolveDone] = useState(false);

  // Shop toggle
  const [shopToggling, setShopToggling] = useState(false);

  // Admin ban
  const [allGroupsAdmin, setAllGroupsAdmin] = useState<StudyGroup[]>([]);
  const [showAdminBan, setShowAdminBan] = useState(false);
  const [banTarget, setBanTarget] = useState<StudyGroup | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banning, setBanning] = useState(false);
  const [banDone, setBanDone] = useState(false);
  const isAdmin = sessionKey === (localStorage.getItem('yandao_admin_session') ?? '__never__')
    || (localStorage.getItem('yandao_admin_v1') !== null && JSON.parse(localStorage.getItem('yandao_admin_v1') ?? '{}').adFreq !== undefined);

  // Merchant recommendation cards
  const [merchantCards, setMerchantCards] = useState<MerchantCard[]>([]);

  // Create form
  const [createType, setCreateType] = useState<'small' | 'mid' | 'large' | 'vip'>('small');
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createLang, setCreateLang] = useState('ja');
  const [createNickname, setCreateNickname] = useState('群主');
  const [creating, setCreating] = useState(false);
  const [createDone, setCreateDone] = useState(false);
  const [payConfirm, setPayConfirm] = useState(false);

  // One-click group creation with user filtering
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    locations: [],
    interests: [],
    minLevel: 0,
    maxLevel: 20,
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState(mockUserProfiles.filter(u => u.privacy.allowDiscover));
  const [showUserList, setShowUserList] = useState(false);

  const loadConfigs = useCallback(async () => {
    const { data } = await supabase.from('platform_configs').select('key,value');
    if (!data) return;
    const map: Record<string, number> = {};
    data.forEach((r) => { map[r.key] = parseInt(r.value) || 0; });

    setDissolveRefundPct(100 - (map['dissolve_penalty_pct'] || 50));
    setConfigs([
      { type: 'small', label: '小群', icon: '🌱', maxMembers: map['group_small_max'] || 10,  fee: map['group_small_fee'] || 0,     deposit: map['group_small_deposit'] || 0 },
      { type: 'mid',   label: '中群', icon: '🌿', maxMembers: map['group_mid_max'] || 50,    fee: map['group_mid_fee'] || 2990,   deposit: map['group_mid_deposit'] || 9900 },
      { type: 'large', label: '大群', icon: '🎋', maxMembers: map['group_large_max'] || 200,  fee: map['group_large_fee'] || 9990,  deposit: map['group_large_deposit'] || 29900 },
      { type: 'vip',   label: 'VIP群', icon: '🏯', maxMembers: map['group_vip_max'] || 500,  fee: map['group_vip_fee'] || 29990,  deposit: map['group_vip_deposit'] || 99900 },
    ]);
  }, []);

  const loadAllGroups = useCallback(async () => {
    const { data } = await supabase.from('study_groups').select('*').eq('is_active', true).eq('status', 'active').order('created_at', { ascending: false });
    setAllGroups((data ?? []) as StudyGroup[]);
  }, []);

  const loadMyGroups = useCallback(async () => {
    const { data: memberRows } = await supabase.from('study_group_members').select('group_id').eq('session_key', sessionKey);
    if (!memberRows || memberRows.length === 0) { setMyGroups([]); return; }
    const ids = memberRows.map((r) => r.group_id);
    const { data } = await supabase.from('study_groups').select('*').in('id', ids).eq('is_active', true);
    setMyGroups((data ?? []) as StudyGroup[]);
  }, [sessionKey]);

  const loadMerchantCards = useCallback(async () => {
    const allowed = await userAllowsMerchantPush(sessionKey);
    if (!allowed) { setMerchantCards([]); return; }
    const { data: campaigns } = await supabase
      .from('ad_campaigns')
      .select('id, campaign_name, group_id, merchants(business_name)')
      .eq('status', 'active')
      .limit(3);
    if (!campaigns) { setMerchantCards([]); return; }
    const cards: MerchantCard[] = (campaigns as Array<{
      id: string; campaign_name: string; group_id: string | null;
      merchants: { business_name: string } | null;
    }>).map((c) => ({
      id: c.id,
      campaign_name: c.campaign_name,
      group_id: c.group_id,
      merchant_name: c.merchants?.business_name ?? '官方商家',
    }));
    // Enrich with group names
    const groupIds = cards.map((c) => c.group_id).filter(Boolean) as string[];
    if (groupIds.length > 0) {
      const { data: grps } = await supabase.from('study_groups').select('id,name,lang_focus').in('id', groupIds);
      const grpMap: Record<string, { name: string; lang: string }> = {};
      (grps ?? []).forEach((g: { id: string; name: string; lang_focus: string }) => { grpMap[g.id] = { name: g.name, lang: g.lang_focus }; });
      cards.forEach((c) => {
        if (c.group_id && grpMap[c.group_id]) {
          c.group_name = grpMap[c.group_id].name;
          c.group_lang = grpMap[c.group_id].lang;
        }
      });
    }
    setMerchantCards(cards);
    // Log impressions
    cards.forEach((c) => {
      supabase.from('ad_impressions').insert({ campaign_id: c.id, session_key: sessionKey });
    });
  }, [sessionKey]);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadConfigs(), loadAllGroups(), loadMerchantCards()]).finally(() => setLoading(false));
  }, [loadConfigs, loadAllGroups, loadMerchantCards]);

  useEffect(() => {
    if (tab === 'mine') loadMyGroups();
  }, [tab, loadMyGroups]);

  async function openGroup(g: StudyGroup) {
    setSelectedGroup(g);
    setShowTransfer(false); setTransferDone(false); setShowDissolve(false); setDissolveDone(false);
    const { data } = await supabase.from('study_group_members').select('*').eq('group_id', g.id);
    setGroupMembers((data ?? []) as GroupMember[]);
  }

  async function joinGroup(g: StudyGroup) {
    const already = await supabase.from('study_group_members').select('id').eq('group_id', g.id).eq('session_key', sessionKey).maybeSingle();
    if (already.data) { setTab('mine'); setSelectedGroup(null); return; }
    await supabase.from('study_group_members').insert({ group_id: g.id, session_key: sessionKey, display_name: '学员', role: 'member' });
    await supabase.from('study_groups').update({ member_count: g.member_count + 1 }).eq('id', g.id);
    setSelectedGroup(null);
    setTab('mine');
    loadMyGroups(); loadAllGroups();
  }

  async function createGroup() {
    if (!createName.trim()) return;
    const cfg = configs.find((c) => c.type === createType);
    if (!cfg) return;
    if (cfg.fee > 0 && !payConfirm) { setPayConfirm(true); return; }
    setCreating(true);
    const { data: newGroup } = await supabase.from('study_groups').insert({
      name: createName.trim(),
      description: createDesc.trim(),
      group_type: createType,
      lang_focus: createLang,
      owner_key: sessionKey,
      member_count: 1,
      max_members: cfg.maxMembers,
      fee_paid_fen: cfg.fee,
      deposit_fen: cfg.deposit,
      deposit_status: cfg.deposit > 0 ? 'held' : 'refunded',
      status: 'active',
    }).select().maybeSingle();
    if (newGroup) {
      await supabase.from('study_group_members').insert({
        group_id: newGroup.id,
        session_key: sessionKey,
        display_name: createNickname || '群主',
        role: 'owner',
      });
      // Add selected users to the group
      for (const userId of selectedUsers) {
        const user = mockUserProfiles.find(u => u.id === userId);
        if (user) {
          await supabase.from('study_group_members').insert({
            group_id: newGroup.id,
            session_key: userId,
            display_name: user.nickname,
            role: 'member',
          });
        }
      }
      if (selectedUsers.length > 0) {
        await supabase.from('study_groups').update({ member_count: 1 + selectedUsers.length }).eq('id', newGroup.id);
      }
    }
    setCreating(false);
    setCreateDone(true);
    setCreateName(''); setCreateDesc(''); setPayConfirm(false);
    setSelectedUsers([]);
    setShowQuickCreate(false);
    loadAllGroups(); loadMyGroups();
    setTimeout(() => { setCreateDone(false); setTab('mine'); }, 2000);
  }

  function filterUsers() {
    let users = mockUserProfiles.filter(u => u.privacy.allowDiscover);
    
    if (filterOptions.locations.length > 0) {
      users = users.filter(u => filterOptions.locations.includes(u.locationCode));
    }
    
    if (filterOptions.interests.length > 0) {
      users = users.filter(u => 
        u.interests.some(interest => filterOptions.interests.includes(interest))
      );
    }
    
    users = users.filter(u => 
      u.level >= filterOptions.minLevel && u.level <= filterOptions.maxLevel
    );
    
    setFilteredUsers(users);
  }

  function toggleUserSelection(userId: string) {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      const cfg = configs.find(c => c.type === createType);
      if (cfg && selectedUsers.length < cfg.maxMembers - 1) {
        setSelectedUsers([...selectedUsers, userId]);
      }
    }
  }

  function selectAllUsers() {
    const cfg = configs.find(c => c.type === createType);
    const maxSelect = cfg ? cfg.maxMembers - 1 : 9;
    const availableUsers = filteredUsers.filter(u => !selectedUsers.includes(u.id));
    const toAdd = availableUsers.slice(0, maxSelect - selectedUsers.length);
    setSelectedUsers([...selectedUsers, ...toAdd.map(u => u.id)]);
  }

  function clearSelection() {
    setSelectedUsers([]);
  }

  async function dissolveGroup() {
    if (!selectedGroup) return;
    setDissolving(true);
    const cfg = configs.find((c) => c.type === selectedGroup.group_type);
    const refundFen = Math.round((cfg?.deposit ?? 0) * dissolveRefundPct / 100);
    await supabase.from('study_groups').update({
      is_active: false,
      status: 'dissolved',
      dissolved_at: new Date().toISOString(),
    }).eq('id', selectedGroup.id);
    // Record deposit partial refund (simulated — actual payout via withdrawal flow)
    if (refundFen > 0) {
      const existing = await supabase.from('platform_wallets').select('*').eq('owner_key', sessionKey).maybeSingle();
      if (existing.data) {
        await supabase.from('platform_wallets').update({
          balance_fen: existing.data.balance_fen + refundFen,
          total_earned: existing.data.total_earned + refundFen,
          updated_at: new Date().toISOString(),
        }).eq('owner_key', sessionKey);
      } else {
        await supabase.from('platform_wallets').insert({ owner_key: sessionKey, wallet_type: 'seller', balance_fen: refundFen, total_earned: refundFen });
      }
    }
    setDissolving(false);
    setDissolveDone(true);
    loadMyGroups(); loadAllGroups();
    setTimeout(() => { setSelectedGroup(null); setDissolveDone(false); }, 2500);
  }

  async function submitTransfer() {
    if (!selectedGroup || !transferTarget.trim()) return;
    setTransferring(true);
    const cfg = configs.find((c) => c.type === selectedGroup.group_type);
    const freezeDays = 7;
    const unfreezeAt = new Date(Date.now() + freezeDays * 86400 * 1000).toISOString();
    await supabase.from('group_transfer_requests').insert({
      group_id: selectedGroup.id,
      from_owner_key: sessionKey,
      to_owner_key: transferTarget.trim(),
      deposit_topup_fen: cfg?.deposit ?? 0,
      original_deposit_unfreeze_at: unfreezeAt,
      status: 'completed',
      completed_at: new Date().toISOString(),
    });
    await supabase.from('study_groups').update({ owner_key: transferTarget.trim() }).eq('id', selectedGroup.id);
    const memberRow = await supabase.from('study_group_members').select('id').eq('group_id', selectedGroup.id).eq('session_key', transferTarget.trim()).maybeSingle();
    if (!memberRow.data) {
      await supabase.from('study_group_members').insert({ group_id: selectedGroup.id, session_key: transferTarget.trim(), display_name: '新群主', role: 'owner' });
    } else {
      await supabase.from('study_group_members').update({ role: 'owner' }).eq('group_id', selectedGroup.id).eq('session_key', transferTarget.trim());
    }
    await supabase.from('study_group_members').update({ role: 'member' }).eq('group_id', selectedGroup.id).eq('session_key', sessionKey);
    setTransferring(false);
    setTransferDone(true);
    loadMyGroups(); loadAllGroups();
    setTimeout(() => { setSelectedGroup(null); setTransferDone(false); }, 2500);
  }

  async function loadAdminGroups() {
    const { data } = await supabase.from('study_groups').select('*').order('created_at', { ascending: false }).limit(50);
    setAllGroupsAdmin((data ?? []) as StudyGroup[]);
  }

  async function banGroup() {
    if (!banTarget) return;
    setBanning(true);
    await supabase.from('study_groups').update({
      status: 'banned',
      is_active: false,
      deposit_forfeited: true,
      ban_reason: banReason.trim() || '违反平台规定',
      banned_at: new Date().toISOString(),
    }).eq('id', banTarget.id);
    setBanning(false);
    setBanDone(true);
    setBanReason('');
    loadAllGroups(); loadAdminGroups();
    setTimeout(() => { setBanTarget(null); setBanDone(false); }, 2000);
  }

  async function toggleShop(g: StudyGroup) {
    setShopToggling(true);
    await supabase.from('study_groups').update({ shop_enabled: !g.shop_enabled }).eq('id', g.id);
    setSelectedGroup({ ...g, shop_enabled: !g.shop_enabled });
    loadMyGroups(); loadAllGroups();
    setShopToggling(false);
  }

  const selectedCfg = configs.find((c) => c.type === createType);
  const isOwner = selectedGroup?.owner_key === sessionKey;

  // Show GroupShop fullscreen
  if (shopGroupId) {
    const g = [...allGroups, ...myGroups].find((g) => g.id === shopGroupId);
    if (g) return (
      <GroupShop
        groupId={g.id}
        groupName={g.name}
        ownerKey={g.owner_key}
        sessionKey={sessionKey}
        groupType={g.group_type}
        onClose={() => setShopGroupId(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="sc-wrap">
        <FloatingBack onClick={onBack} />
        <div className="sc-loading">加载学习圈…</div>
      </div>
    );
  }

  return (
    <div className="sc-wrap">
      <FloatingBack onClick={onBack} />

      <div className="sc-header">
        <h1 className="sc-title">学习圈</h1>
        <p className="sc-sub">组建语言学习小圈子，共同打卡</p>
      </div>

      <div className="sc-tabs">
        <button className={`sc-tab ${tab === 'browse' ? 'active' : ''}`} onClick={() => setTab('browse')}>浏览群组</button>
        <button className={`sc-tab ${tab === 'mine' ? 'active' : ''}`} onClick={() => setTab('mine')}>我的群组</button>
        <button className={`sc-tab ${tab === 'create' ? 'active' : ''}`} onClick={() => setTab('create')}>+ 创建群组</button>
        {isAdmin && (
          <button className={`sc-tab admin-tab`} onClick={() => { setShowAdminBan(!showAdminBan); if (!showAdminBan) loadAdminGroups(); }}>
            🔐 管理
          </button>
        )}
      </div>

      {/* Types strip */}
      <div className="sc-types-strip">
        {configs.map((cfg) => (
          <div className="sc-type-card" key={cfg.type}>
            <span className="sc-type-icon">{cfg.icon}</span>
            <span className="sc-type-label">{cfg.label}</span>
            <span className="sc-type-max">≤ {cfg.maxMembers}人</span>
            <span className="sc-type-fee">{fenToYuan(cfg.fee)}</span>
            {cfg.deposit > 0 && <span className="sc-type-deposit">押金 {fenToYuan(cfg.deposit)}</span>}
            {cfg.type !== 'small' && <span className="sc-type-shop-tag">橱窗✓</span>}
          </div>
        ))}
      </div>

      {/* ── ADMIN BAN PANEL ── */}
      {isAdmin && showAdminBan && (
        <div className="sc-admin-panel">
          <div className="sc-admin-header">
            <span className="sc-admin-title">群管理列表</span>
            <span className="sc-admin-sub">{allGroupsAdmin.length} 个群组</span>
          </div>
          {allGroupsAdmin.length === 0 && <div className="sc-admin-empty">加载中…</div>}
          {allGroupsAdmin.map((g) => (
            <div className="sc-admin-row" key={g.id}>
              <div className="sc-admin-row-info">
                <span className={`sc-admin-status ${g.status}`}>{g.status === 'banned' ? '已封禁' : g.status === 'active' ? '正常' : g.status}</span>
                <span className="sc-admin-gname">{g.name}</span>
                <span className="sc-admin-gmeta">{g.lang_focus?.toUpperCase()} · {g.member_count}人</span>
                {g.deposit_forfeited && <span className="sc-admin-forfeited">保证金已没收</span>}
              </div>
              {g.status !== 'banned' && (
                <button className="sc-admin-ban-btn" onClick={() => { setBanTarget(g); setBanDone(false); }}>
                  封禁群
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ban confirmation modal */}
      {banTarget && (
        <div className="sc-modal-overlay" onClick={() => setBanTarget(null)}>
          <div className="sc-modal" onClick={(e) => e.stopPropagation()}>
            {banDone ? (
              <div className="sc-ban-done">群已封禁，保证金已全额没收</div>
            ) : (
              <>
                <h4 className="sc-modal-title">封禁群：{banTarget.name}</h4>
                <p className="sc-modal-warn">保证金 {fenToYuan(banTarget.deposit_fen)} 将被全额没收，此操作不可逆。</p>
                <input className="sc-ban-reason-input" value={banReason} placeholder="封禁原因（必填）"
                  onChange={(e) => setBanReason(e.target.value)} />
                <div className="sc-modal-actions">
                  <button className="sc-modal-confirm danger" disabled={banning || !banReason.trim()} onClick={banGroup}>
                    {banning ? '处理中…' : '确认封禁 + 没收'}
                  </button>
                  <button className="sc-modal-cancel" onClick={() => setBanTarget(null)}>取消</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── BROWSE ── */}
      {tab === 'browse' && (
        <div className="sc-list">
          {/* Merchant recommendation cards */}
          {merchantCards.length > 0 && (
            <div className="sc-merchant-section">
              <div className="sc-merchant-header">
                <span className="sc-merchant-label">商家推荐</span>
                <span className="sc-merchant-sub">官方认证学习圈</span>
              </div>
              {merchantCards.map((mc) => (
                <div className="sc-merchant-card" key={mc.id}>
                  <div className="sc-merchant-badge">官方 / 商家</div>
                  <div className="sc-merchant-content">
                    <span className="sc-merchant-name">{mc.merchant_name}</span>
                    <span className="sc-merchant-campaign">{mc.campaign_name}</span>
                    {mc.group_name && (
                      <div className="sc-merchant-group">
                        {mc.group_lang && <span className="sc-merchant-flag">{LANG_FLAG[mc.group_lang] ?? '🌐'}</span>}
                        <span>{mc.group_name}</span>
                      </div>
                    )}
                  </div>
                  <button className="sc-merchant-join" onClick={async () => {
                    if (mc.group_id) {
                      const g = allGroups.find((x) => x.id === mc.group_id);
                      if (g) { openGroup(g); }
                    }
                    // Update join count
                    await supabase.from('ad_impressions')
                      .update({ joined: true })
                      .eq('campaign_id', mc.id)
                      .eq('session_key', sessionKey);
                    await supabase.from('ad_campaigns')
                      .update({ joins: (merchantCards.find((c) => c.id === mc.id) ? 1 : 0) })
                      .eq('id', mc.id);
                  }}>了解加入</button>
                </div>
              ))}
            </div>
          )}

          {allGroups.length === 0 && <div className="sc-empty">暂无公开群组，快去创建第一个！</div>}
          {allGroups.map((g) => {
            const cfg = configs.find((c) => c.type === g.group_type);
            return (
              <div className="sc-group-card" key={g.id} onClick={() => openGroup(g)}>
                <div className="sc-group-left">
                  <span className="sc-group-icon">{cfg?.icon ?? '📚'}</span>
                  <div className="sc-group-info">
                    <span className="sc-group-name">{g.name}</span>
                    <div className="sc-group-meta">
                      <span>{LANG_FLAG[g.lang_focus]} {LANG_NAME[g.lang_focus]}</span>
                      <span className="sc-dot">·</span>
                      <span>{cfg?.label}</span>
                      <span className="sc-dot">·</span>
                      <span>{g.member_count}/{g.max_members}人</span>
                      {g.shop_enabled && <span className="sc-shop-dot">🛍️</span>}
                    </div>
                    {g.description && <p className="sc-group-desc">{g.description}</p>}
                  </div>
                </div>
                <div className="sc-group-right">
                  <div className="sc-member-bar">
                    <div className="sc-member-fill" style={{ width: `${Math.min(g.member_count / g.max_members * 100, 100)}%` }} />
                  </div>
                  <span className="sc-view-hint">查看 →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MINE ── */}
      {tab === 'mine' && (
        <div className="sc-list">
          {myGroups.length === 0 && <div className="sc-empty">还未加入任何群组，去浏览或创建吧！</div>}
          {myGroups.map((g) => {
            const cfg = configs.find((c) => c.type === g.group_type);
            const amOwner = g.owner_key === sessionKey;
            return (
              <div className="sc-group-card" key={g.id} onClick={() => openGroup(g)}>
                <div className="sc-group-left">
                  <span className="sc-group-icon">{cfg?.icon ?? '📚'}</span>
                  <div className="sc-group-info">
                    <div className="sc-group-name-row">
                      <span className="sc-group-name">{g.name}</span>
                      {amOwner && <span className="sc-owner-badge">群主</span>}
                      {g.shop_enabled && <span className="sc-shop-badge">橱窗</span>}
                    </div>
                    <div className="sc-group-meta">
                      <span>{LANG_FLAG[g.lang_focus]} {LANG_NAME[g.lang_focus]}</span>
                      <span className="sc-dot">·</span>
                      <span>{g.member_count}/{g.max_members}人</span>
                    </div>
                    {amOwner && g.deposit_fen > 0 && (
                      <span className="sc-deposit-tag">保证金 {fenToYuan(g.deposit_fen)} 托管中</span>
                    )}
                  </div>
                </div>
                <span className="sc-view-hint">管理 →</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CREATE ── */}
      {tab === 'create' && (
        <div className="sc-create-form">
          {createDone ? (
            <div className="sc-create-done">
              <span className="sc-done-icon">✅</span>
              <p>群组创建成功！</p>
              <p className="sc-done-hint">正在跳转到我的群组…</p>
            </div>
          ) : (
            <>
              <h3 className="sc-form-title">创建学习圈</h3>

              <div className="sc-field">
                <label className="sc-label">群组类型</label>
                <div className="sc-type-selector">
                  {configs.map((cfg) => (
                    <button key={cfg.type}
                      className={`sc-type-btn ${createType === cfg.type ? 'active' : ''}`}
                      onClick={() => { setCreateType(cfg.type); setPayConfirm(false); }}
                    >
                      <span>{cfg.icon} {cfg.label}</span>
                      <span className="sc-type-btn-sub">≤{cfg.maxMembers}人</span>
                      <span className="sc-type-btn-fee">{fenToYuan(cfg.fee)}</span>
                      {cfg.type !== 'small' && <span className="sc-type-btn-shop">🛍️橱窗</span>}
                    </button>
                  ))}
                </div>
                {selectedCfg && (
                  <div className="sc-fee-breakdown">
                    <div className="sc-fee-row">
                      <span>建群费</span>
                      <span>{fenToYuan(selectedCfg.fee)}</span>
                    </div>
                    {selectedCfg.deposit > 0 && (
                      <div className="sc-fee-row deposit">
                        <span>保证金（可退）</span>
                        <span>{fenToYuan(selectedCfg.deposit)}</span>
                      </div>
                    )}
                    {selectedCfg.deposit > 0 && (
                      <p className="sc-deposit-notice">
                        主动解散退还 {dissolveRefundPct}% 保证金 · 违规封禁全额没收 · 转让后7天解冻退还
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="sc-field">
                <label className="sc-label">群名称</label>
                <input className="sc-input" value={createName} maxLength={30} placeholder="例：日语N2 冲刺小队"
                  onChange={(e) => { setCreateName(e.target.value); setPayConfirm(false); }} />
              </div>

              <div className="sc-field">
                <label className="sc-label">学习语言</label>
                <select className="sc-select" value={createLang} onChange={(e) => setCreateLang(e.target.value)}>
                  {ALL_LANGS.map((l) => <option key={l} value={l}>{LANG_FLAG[l]} {LANG_NAME[l]}</option>)}
                </select>
              </div>

              <div className="sc-field">
                <label className="sc-label">群介绍（可选）</label>
                <textarea className="sc-textarea" value={createDesc} maxLength={100} rows={2}
                  placeholder="介绍群的目标和要求…"
                  onChange={(e) => setCreateDesc(e.target.value)} />
              </div>

              <div className="sc-field">
                <label className="sc-label">我的群内昵称</label>
                <input className="sc-input" value={createNickname} maxLength={20} placeholder="群主"
                  onChange={(e) => setCreateNickname(e.target.value)} />
              </div>

              <div className="sc-field">
                <button className="sc-quick-create-btn" onClick={() => setShowQuickCreate(!showQuickCreate)}>
                  {showQuickCreate ? '✕ 收起一键建群' : '⚡ 一键建群（按条件筛选成员）'}
                </button>
              </div>

              {showQuickCreate && (
                <div className="sc-quick-create-panel">
                  <h4 className="sc-quick-title">🔍 筛选成员条件</h4>
                  
                  <div className="sc-filter-row">
                    <label className="sc-filter-label">📍 地区</label>
                    <div className="sc-filter-tags">
                      {locationTags.map(loc => (
                        <button
                          key={loc.code}
                          className={`sc-filter-tag ${filterOptions.locations.includes(loc.code) ? 'active' : ''}`}
                          onClick={() => {
                            const locs = filterOptions.locations.includes(loc.code)
                              ? filterOptions.locations.filter(l => l !== loc.code)
                              : [...filterOptions.locations, loc.code];
                            setFilterOptions({ ...filterOptions, locations: locs });
                          }}
                        >
                          {loc.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sc-filter-row">
                    <label className="sc-filter-label">🎯 兴趣标签</label>
                    <div className="sc-filter-tags">
                      {interestTags.slice(0, 8).map(tag => (
                        <button
                          key={tag}
                          className={`sc-filter-tag ${filterOptions.interests.includes(tag) ? 'active' : ''}`}
                          onClick={() => {
                            const ints = filterOptions.interests.includes(tag)
                              ? filterOptions.interests.filter(i => i !== tag)
                              : [...filterOptions.interests, tag];
                            setFilterOptions({ ...filterOptions, interests: ints });
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sc-filter-row">
                    <label className="sc-filter-label">📊 等级范围</label>
                    <div className="sc-level-range">
                      <input
                        type="number"
                        className="sc-level-input"
                        min="0"
                        max="20"
                        value={filterOptions.minLevel}
                        onChange={(e) => setFilterOptions({ ...filterOptions, minLevel: parseInt(e.target.value) || 0 })}
                        placeholder="最低等级"
                      />
                      <span className="sc-level-separator">~</span>
                      <input
                        type="number"
                        className="sc-level-input"
                        min="0"
                        max="20"
                        value={filterOptions.maxLevel}
                        onChange={(e) => setFilterOptions({ ...filterOptions, maxLevel: parseInt(e.target.value) || 20 })}
                        placeholder="最高等级"
                      />
                    </div>
                  </div>

                  <button className="sc-filter-btn" onClick={filterUsers}>应用筛选</button>

                  <button className="sc-toggle-user-list" onClick={() => setShowUserList(!showUserList)}>
                    {showUserList ? '收起用户列表' : `查看符合条件的用户 (${filteredUsers.length}人)`}
                  </button>

                  {showUserList && (
                    <div className="sc-user-list">
                      <div className="sc-user-list-header">
                        <span>已选择 {selectedUsers.length}/{selectedCfg?.maxMembers - 1 || 9} 人</span>
                        <div className="sc-user-list-actions">
                          <button className="sc-select-all-btn" onClick={selectAllUsers}>全选</button>
                          <button className="sc-clear-btn" onClick={clearSelection}>清空</button>
                        </div>
                      </div>
                      {filteredUsers.length === 0 ? (
                        <div className="sc-no-users">没有符合条件的用户</div>
                      ) : (
                        <div className="sc-users-container">
                          {filteredUsers.map(user => (
                            <div
                              key={user.id}
                              className={`sc-user-card ${selectedUsers.includes(user.id) ? 'selected' : ''}`}
                              onClick={() => toggleUserSelection(user.id)}
                            >
                              <span className="sc-user-avatar">{user.avatar}</span>
                              <div className="sc-user-info">
                                <span className="sc-user-name">{user.nickname}</span>
                                <span className="sc-user-meta">
                                  {user.privacy.showLocation && user.location} · Lv.{user.level}
                                </span>
                                {user.privacy.showInterests && user.interests.slice(0, 2).map((i, idx) => (
                                  <span key={idx} className="sc-user-tag">{i}</span>
                                ))}
                              </div>
                              <span className={`sc-user-checkbox ${selectedUsers.includes(user.id) ? 'checked' : ''}`}>
                                {selectedUsers.includes(user.id) ? '✓' : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {selectedUsers.length > 0 && (
                <div className="sc-selected-users-hint">
                  ✨ 已选择 {selectedUsers.length} 位用户加入群组
                </div>
              )}

              {payConfirm && selectedCfg && (
                <div className="sc-pay-confirm">
                  <p className="sc-pay-confirm-text">
                    即将支付（模拟）：建群费 {fenToYuan(selectedCfg.fee)}
                    {selectedCfg.deposit > 0 && ` + 保证金 ${fenToYuan(selectedCfg.deposit)}`}
                  </p>
                </div>
              )}

              <button className="sc-create-btn" disabled={creating || !createName.trim()} onClick={createGroup}>
                {creating ? '创建中…' :
                 payConfirm ? '确认付款并创建' :
                 selectedCfg && selectedCfg.fee > 0 ? `支付 ${fenToYuan(selectedCfg.fee + (selectedCfg.deposit || 0))} 并创建` :
                 '免费创建群组'}
              </button>
              <p className="sc-create-hint">当前为模拟支付，正式上线后接入真实支付。</p>
            </>
          )}
        </div>
      )}

      {/* ── GROUP DETAIL MODAL ── */}
      {selectedGroup && (
        <div className="sc-modal-overlay" onClick={() => { setSelectedGroup(null); setShowTransfer(false); setShowDissolve(false); }}>
          <div className="sc-modal" onClick={(e) => e.stopPropagation()}>
            <button className="sc-modal-close" onClick={() => { setSelectedGroup(null); setShowTransfer(false); setShowDissolve(false); }}>✕</button>

            <h3 className="sc-modal-title">{selectedGroup.name}</h3>
            <div className="sc-modal-meta">
              <span>{LANG_FLAG[selectedGroup.lang_focus]} {LANG_NAME[selectedGroup.lang_focus]}</span>
              <span className="sc-dot">·</span>
              <span>{selectedGroup.member_count}/{selectedGroup.max_members}人</span>
              {isOwner && <span className="sc-owner-badge">群主</span>}
              {selectedGroup.shop_enabled && <span className="sc-shop-badge">橱窗开启</span>}
            </div>
            {selectedGroup.description && <p className="sc-modal-desc">{selectedGroup.description}</p>}

            {/* Deposit */}
            {selectedGroup.deposit_fen > 0 && (
              <div className="sc-modal-deposit">
                <span>💰 保证金 {fenToYuan(selectedGroup.deposit_fen)}</span>
                <span className="sc-deposit-status">{selectedGroup.deposit_status === 'held' ? '托管中' : selectedGroup.deposit_status === 'refunding' ? '退款中' : '已退款'}</span>
              </div>
            )}

            {/* Members */}
            <div className="sc-members-list">
              <h4 className="sc-members-title">成员 ({groupMembers.length})</h4>
              {groupMembers.map((m) => (
                <div className="sc-member-row" key={m.id}>
                  <span className="sc-member-name">{m.display_name}</span>
                  <span className={`sc-member-role ${m.role}`}>{
                    m.role === 'owner' ? '群主' : m.role === 'admin' ? '管理员' : '成员'
                  }</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="sc-modal-actions">
              {/* Shop button — anyone can view */}
              {(selectedGroup.shop_enabled || isOwner) && (
                <button className="sc-shop-btn" onClick={() => { setShopGroupId(selectedGroup.id); setSelectedGroup(null); }}>
                  🛍️ {selectedGroup.shop_enabled ? '进入橱窗' : '开启橱窗（仅预览）'}
                </button>
              )}

              {/* Join */}
              {!isOwner && selectedGroup.member_count < selectedGroup.max_members && (
                <button className="sc-join-btn" onClick={() => joinGroup(selectedGroup)}>加入群组</button>
              )}

              {/* Owner controls */}
              {isOwner && (
                <>
                  {/* Toggle shop — only mid+ */}
                  {selectedGroup.group_type !== 'small' && (
                    <button className="sc-shop-toggle-btn" disabled={shopToggling} onClick={() => toggleShop(selectedGroup)}>
                      {shopToggling ? '切换中…' : selectedGroup.shop_enabled ? '关闭橱窗' : '开启橱窗'}
                    </button>
                  )}

                  {/* Transfer */}
                  {!showDissolve && !transferDone && !dissolveDone && (
                    <button className="sc-transfer-btn" onClick={() => { setShowTransfer(!showTransfer); setShowDissolve(false); }}>
                      转让群主
                    </button>
                  )}

                  {showTransfer && !transferDone && (
                    <div className="sc-transfer-form">
                      <p className="sc-transfer-notice">
                        新群主需补足保证金 {fenToYuan(selectedGroup.deposit_fen)}，你的保证金将在 7 天后自动解冻退还。
                      </p>
                      <input className="sc-input" value={transferTarget} placeholder="新群主的 Session Key"
                        onChange={(e) => setTransferTarget(e.target.value)} />
                      <div className="sc-transfer-btns">
                        <button className="sc-transfer-confirm" onClick={submitTransfer} disabled={!transferTarget.trim() || transferring}>
                          {transferring ? '处理中…' : '确认转让'}
                        </button>
                        <button className="sc-transfer-cancel" onClick={() => setShowTransfer(false)}>取消</button>
                      </div>
                    </div>
                  )}
                  {transferDone && <div className="sc-transfer-done">✅ 群主已转让，保证金7天后解冻</div>}

                  {/* Dissolve */}
                  {!showTransfer && !transferDone && !dissolveDone && (
                    <button className="sc-dissolve-btn" onClick={() => { setShowDissolve(!showDissolve); setShowTransfer(false); }}>
                      解散群组
                    </button>
                  )}

                  {showDissolve && !dissolveDone && (
                    <div className="sc-dissolve-form">
                      <p className="sc-dissolve-notice">
                        解散后，保证金扣除 {100 - dissolveRefundPct}%，退还 {dissolveRefundPct}%（约 {fenToYuan(Math.round(selectedGroup.deposit_fen * dissolveRefundPct / 100))}）到你的钱包。此操作不可撤销。
                      </p>
                      <div className="sc-transfer-btns">
                        <button className="sc-dissolve-confirm" onClick={dissolveGroup} disabled={dissolving}>
                          {dissolving ? '解散中…' : '确认解散'}
                        </button>
                        <button className="sc-transfer-cancel" onClick={() => setShowDissolve(false)}>取消</button>
                      </div>
                    </div>
                  )}
                  {dissolveDone && <div className="sc-transfer-done">✅ 群组已解散，退款将入账到钱包</div>}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
