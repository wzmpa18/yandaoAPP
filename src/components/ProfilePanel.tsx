import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FloatingBack } from './FloatingBack';
import { TaijiCompass } from './TaijiCompass';
import { UserProfile } from './Onboarding';
import { ThemePicker } from './ThemePicker';
import { LangPackAdmin } from './LangPackAdmin';
import { AICostDashboard } from './AICostDashboard';
import { AIModelConfigPanel } from './AIModelConfig';
import { VoicePicker } from './VoicePicker';
import { VoicePreset, loadVoicePreset } from '../lib/voiceProfile';
import { supabase } from '../lib/supabase';
import { useUI } from '../lib/UILanguageContext';
import { UILang, UI_LANG_OPTIONS } from '../lib/i18n';

interface ProfilePanelProps {
  profile: UserProfile;
  xp: number;
  streak: number;
  onBack: () => void;
  onReset: () => void;
  onPrivacy?: () => void;
  onMerchant?: () => void;
  onAchievements?: () => void;
  onStreakShield?: () => void;
}

const AFFY_KEY = 'yandao_affy_v1';
const ADMIN_KEY = 'yandao_admin_v1';

interface AffyData { code: string; referrals: number; cash: number; coins: number }
interface AdminCfg {
  reward: number;
  adFreq: number;
  commissionPct: number;
  ptsCorrection: number;
  ptsConversation: number;
  ptsExercise: number;
  groupMidFee: number;
  groupLargeFee: number;
  groupVipFee: number;
  shopCommissionPct: number;
  minWithdrawalYuan: number;
  dissolvePenaltyPct: number;
  // GrammarVocab v2
  mnemonicAutoApprove: boolean;
  tipCommissionPct: number;
  examQuizCount: number;
}

function generateCode(sk: string): string { return `YD-${sk.slice(-6).toUpperCase()}`; }
function loadAffy(code: string): AffyData {
  try { const s = localStorage.getItem(AFFY_KEY); if (s) return JSON.parse(s); } catch { /* */ }
  return { code, referrals: 3, cash: 6.00, coins: 450 };
}
function loadAdmin(): AdminCfg {
  try { const s = localStorage.getItem(ADMIN_KEY); if (s) return JSON.parse(s); } catch { /* */ }
  return { reward: 2, adFreq: 3, commissionPct: 30, ptsCorrection: 5, ptsConversation: 10, ptsExercise: 15, groupMidFee: 29.9, groupLargeFee: 99.9, groupVipFee: 299.9, shopCommissionPct: 20, minWithdrawalYuan: 10, dissolvePenaltyPct: 50, mnemonicAutoApprove: false, tipCommissionPct: 20, examQuizCount: 10 };
}

const LANG_FLAG: Record<string, string> = {
  ja:'🇯🇵', en:'🇺🇸', ko:'🇰🇷', fr:'🇫🇷', es:'🇪🇸',
  de:'🇩🇪', it:'🇮🇹', pt:'🇧🇷', ar:'🇸🇦', zh:'🇨🇳',
};
const LEVEL_LABEL: Record<string, string> = {
  beginner: '🌱 初级', intermediate: '🌿 进阶', advanced: '🎋 高级',
};
const GOAL_LABEL: Record<string, string> = {
  daily: '日常交流与旅游', exam: '专业国际考级', professional: '职场行业外语',
};

export const ProfilePanel: React.FC<ProfilePanelProps> = ({
  profile, xp, streak, onBack, onReset, onPrivacy, onMerchant, onAchievements, onStreakShield,
}) => {
  const { s, uiLang, setUILang } = useUI();
  const code = generateCode(profile.session_key);
  const [affy, setAffy]                 = useState<AffyData>(() => loadAffy(code));
  const [admin, setAdmin]               = useState<AdminCfg>(loadAdmin);
  const [copied, setCopied]             = useState(false);
  const [withdrawing, setWithdrawing]   = useState(false);
  const [withdrawDone, setWithdrawDone] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAdmin, setShowAdmin]       = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminTab, setAdminTab]          = useState<'ops' | 'ai_cost' | 'ai_cfg'>('ops');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [activeVoice, setActiveVoice] = useState<VoicePreset>(loadVoicePreset);
  const [showLangPackAdmin, setShowLangPackAdmin] = useState(false);
  const [showUILangPicker, setShowUILangPicker] = useState(false);

  // Promotion center and team management
  const [showPromoCenter, setShowPromoCenter] = useState(false);
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  interface ReferralUser {
    id: string;
    name: string;
    level: number;
    joinedAt: string;
    referrals: number;
    isActive: boolean;
  }

  const mockReferralUsers: ReferralUser[] = [
    { id: 'ref_1', name: '日语爱好者', level: 12, joinedAt: '2024-01-10', referrals: 3, isActive: true },
    { id: 'ref_2', name: '英语学霸', level: 18, joinedAt: '2024-01-08', referrals: 5, isActive: true },
    { id: 'ref_3', name: '韩语小达人', level: 10, joinedAt: '2024-01-05', referrals: 0, isActive: true },
    { id: 'ref_4', name: '法语初学者', level: 5, joinedAt: '2024-01-03', referrals: 1, isActive: false },
    { id: 'ref_5', name: '语言探险家', level: 15, joinedAt: '2024-01-01', referrals: 8, isActive: true },
    { id: 'ref_6', name: '游戏玩家', level: 9, joinedAt: '2023-12-28', referrals: 2, isActive: true },
  ];

  const getTotalTeamMembers = () => mockReferralUsers.length;
  const getActiveMembers = () => mockReferralUsers.filter(u => u.isActive).length;
  const getTotalSecondLevel = () => mockReferralUsers.reduce((sum, u) => sum + u.referrals, 0);

  // Admin group management
  const [adminGroups, setAdminGroups] = useState<Array<{
    id: string; name: string; lang_focus: string; member_count: number;
    status: string; deposit_fen: number; deposit_forfeited: boolean; ban_reason: string;
  }>>([]);
  const [adminGroupsLoading, setAdminGroupsLoading] = useState(false);
  const [showGroupPanel, setShowGroupPanel] = useState(false);
  const [banTarget, setBanTarget] = useState<{ id: string; name: string; deposit_fen: number } | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banning, setBanning] = useState(false);
  const [banDone, setBanDone] = useState(false);

  const loadAdminGroups = useCallback(async () => {
    setAdminGroupsLoading(true);
    const { data } = await supabase
      .from('study_groups')
      .select('id,name,lang_focus,member_count,status,deposit_fen,deposit_forfeited,ban_reason')
      .order('created_at', { ascending: false })
      .limit(50);
    setAdminGroups((data ?? []) as typeof adminGroups);
    setAdminGroupsLoading(false);
  }, []);

  async function adminBanGroup() {
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
    loadAdminGroups();
    setTimeout(() => { setBanTarget(null); setBanDone(false); }, 2000);
  }
  const versionTapCount                 = useRef(0);
  const versionTapTimer                 = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { localStorage.setItem(AFFY_KEY, JSON.stringify(affy)); }, [affy]);
  useEffect(() => { localStorage.setItem(ADMIN_KEY, JSON.stringify(admin)); }, [admin]);

  const referralLink = `https://gendou.app/join?ref=${code}`;

  function copyLink() {
    navigator.clipboard?.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function simulateReferral() {
    setAffy((a) => ({ ...a, referrals: a.referrals + 1, cash: parseFloat((a.cash + admin.reward).toFixed(2)), coins: a.coins + 100 }));
  }

  function simulateWithdraw() {
    if (affy.cash < 1) return;
    setWithdrawing(true);
    setTimeout(() => { setWithdrawing(false); setWithdrawDone(true); }, 1800);
  }

  // Secret: tap version 5 times to open admin console
  function handleVersionTap() {
    versionTapCount.current += 1;
    if (versionTapTimer.current) clearTimeout(versionTapTimer.current);
    versionTapTimer.current = setTimeout(() => { versionTapCount.current = 0; }, 2000);
    if (versionTapCount.current >= 5) {
      versionTapCount.current = 0;
      setAdminUnlocked(true);
      setShowAdmin(true);
    }
  }

  const levelPct = Math.min((xp % 200) / 2, 100);

  if (showLangPackAdmin) {
    return <LangPackAdmin onBack={() => setShowLangPackAdmin(false)} />;
  }

  return (
    <div className="pp-wrap">
      <FloatingBack onClick={onBack} />
      {showThemePicker && <ThemePicker onClose={() => setShowThemePicker(false)} />}
      {showVoicePicker && (
        <VoicePicker
          currentId={activeVoice.id}
          onSelect={(p) => setActiveVoice(p)}
          onClose={() => setShowVoicePicker(false)}
        />
      )}

      {/* Admin ban group modal */}
      {banTarget && (
        <div className="sc-modal-overlay" onClick={() => setBanTarget(null)}>
          <div className="sc-modal" onClick={(e) => e.stopPropagation()}>
            {banDone ? (
              <div className="sc-ban-done">
                <div className="sc-ban-done-icon">🔒</div>
                <p>群已封禁，保证金已全额没收</p>
              </div>
            ) : (
              <>
                <h4 className="sc-modal-title">封禁群：{banTarget.name}</h4>
                <p className="sc-modal-warn">
                  保证金将被全额没收，此操作不可逆。
                </p>
                <textarea
                  className="sc-ban-reason-input"
                  value={banReason}
                  placeholder="封禁原因（必填）"
                  onChange={(e) => setBanReason(e.target.value)}
                />
                <div className="sc-modal-actions">
                  <button
                    className="sc-modal-confirm danger"
                    disabled={banning || !banReason.trim()}
                    onClick={adminBanGroup}
                  >
                    {banning ? '处理中…' : '确认封禁 + 没收保证金'}
                  </button>
                  <button className="sc-modal-cancel" onClick={() => setBanTarget(null)}>取消</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Admin console modal */}
      {showAdmin && adminUnlocked && (
        <div className="admin-overlay" onClick={() => setShowAdmin(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-header">
              <TaijiCompass size={22} />
              <h3 className="admin-title">言道 · 运营控制台</h3>
              <button className="admin-close" onClick={() => setShowAdmin(false)}>✕</button>
            </div>

            {/* Tab bar */}
            <div className="admin-tabs">
              <button className={`admin-tab ${adminTab === 'ops' ? 'active' : ''}`} onClick={() => setAdminTab('ops')}>
                运营配置
              </button>
              <button className={`admin-tab ${adminTab === 'ai_cfg' ? 'active' : ''}`} onClick={() => setAdminTab('ai_cfg')}>
                🤖 AI配置
              </button>
              <button className={`admin-tab ${adminTab === 'ai_cost' ? 'active' : ''}`} onClick={() => setAdminTab('ai_cost')}>
                ⚡ AI成本
              </button>
            </div>

            {adminTab === 'ai_cfg' && (
              <AIModelConfigPanel />
            )}

            {adminTab === 'ai_cost' && (
              <AICostDashboard />
            )}

            {adminTab === 'ops' && <>
            <div className="admin-row">
              <label className="admin-label">现金奖励 (每邀请1人)</label>
              <div className="admin-slider-wrap">
                <span className="admin-slider-val">${admin.reward.toFixed(1)}</span>
                <input type="range" min="0.5" max="2" step="0.5"
                  value={admin.reward}
                  onChange={(e) => setAdmin((a) => ({ ...a, reward: parseFloat(e.target.value) }))}
                  className="admin-slider"
                />
                <div className="admin-slider-labels"><span>$0.5</span><span>$2.0</span></div>
              </div>
            </div>

            <div className="admin-row">
              <label className="admin-label">广告展示频率 (每N题)</label>
              <div className="admin-slider-wrap">
                <span className="admin-slider-val">{admin.adFreq} 题/次</span>
                <input type="range" min="1" max="10" step="1"
                  value={admin.adFreq}
                  onChange={(e) => setAdmin((a) => ({ ...a, adFreq: parseInt(e.target.value) }))}
                  className="admin-slider"
                />
                <div className="admin-slider-labels"><span>1题</span><span>10题</span></div>
              </div>
            </div>

            <div className="admin-row">
              <label className="admin-label">机构合作抽成比例</label>
              <div className="admin-slider-wrap">
                <span className="admin-slider-val">{admin.commissionPct}%</span>
                <input type="range" min="20" max="30" step="5"
                  value={admin.commissionPct}
                  onChange={(e) => setAdmin((a) => ({ ...a, commissionPct: parseInt(e.target.value) }))}
                  className="admin-slider"
                />
                <div className="admin-slider-labels"><span>20%</span><span>30%</span></div>
              </div>
            </div>

            <div className="admin-section-divider">语伴积分规则</div>

            <div className="admin-row admin-row-triple">
              <div className="admin-triple-item">
                <label className="admin-label-sm">纠正对方</label>
                <input type="number" min="1" max="50" className="admin-num-input"
                  value={admin.ptsCorrection}
                  onChange={(e) => setAdmin((a) => ({ ...a, ptsCorrection: parseInt(e.target.value) || 5 }))} />
                <span className="admin-label-sm">分</span>
              </div>
              <div className="admin-triple-item">
                <label className="admin-label-sm">完成对话</label>
                <input type="number" min="1" max="50" className="admin-num-input"
                  value={admin.ptsConversation}
                  onChange={(e) => setAdmin((a) => ({ ...a, ptsConversation: parseInt(e.target.value) || 10 }))} />
                <span className="admin-label-sm">分</span>
              </div>
              <div className="admin-triple-item">
                <label className="admin-label-sm">出练习题</label>
                <input type="number" min="1" max="50" className="admin-num-input"
                  value={admin.ptsExercise}
                  onChange={(e) => setAdmin((a) => ({ ...a, ptsExercise: parseInt(e.target.value) || 15 }))} />
                <span className="admin-label-sm">分</span>
              </div>
            </div>

            <div className="admin-section-divider">群组建群费 (元)</div>

            <div className="admin-row admin-row-triple">
              <div className="admin-triple-item">
                <label className="admin-label-sm">中群</label>
                <input type="number" min="0" step="0.1" className="admin-num-input"
                  value={admin.groupMidFee}
                  onChange={(e) => setAdmin((a) => ({ ...a, groupMidFee: parseFloat(e.target.value) || 29.9 }))} />
                <span className="admin-label-sm">元</span>
              </div>
              <div className="admin-triple-item">
                <label className="admin-label-sm">大群</label>
                <input type="number" min="0" step="0.1" className="admin-num-input"
                  value={admin.groupLargeFee}
                  onChange={(e) => setAdmin((a) => ({ ...a, groupLargeFee: parseFloat(e.target.value) || 99.9 }))} />
                <span className="admin-label-sm">元</span>
              </div>
              <div className="admin-triple-item">
                <label className="admin-label-sm">VIP群</label>
                <input type="number" min="0" step="0.1" className="admin-num-input"
                  value={admin.groupVipFee}
                  onChange={(e) => setAdmin((a) => ({ ...a, groupVipFee: parseFloat(e.target.value) || 299.9 }))} />
                <span className="admin-label-sm">元</span>
              </div>
            </div>

            <div className="admin-section-divider">商家与投放管理</div>

            <div className="admin-row admin-row-with-toggle">
              <label className="admin-label">商家申请自动审核</label>
              <label className="admin-toggle">
                <input type="checkbox"
                  checked={(admin as AdminCfg & { merchantAutoApprove?: boolean }).merchantAutoApprove ?? false}
                  onChange={(e) => setAdmin((a) => ({ ...a, merchantAutoApprove: e.target.checked } as AdminCfg))} />
                <span className="admin-toggle-track" />
              </label>
            </div>

            <div className="admin-row admin-row-triple">
              <div className="admin-triple-item">
                <label className="admin-label-sm">日投放上限</label>
                <input type="number" min="100" max="10000" className="admin-num-input"
                  value={(admin as AdminCfg & { merchantDailyAdLimit?: number }).merchantDailyAdLimit ?? 500}
                  onChange={(e) => setAdmin((a) => ({ ...a, merchantDailyAdLimit: parseInt(e.target.value) || 500 } as AdminCfg))} />
                <span className="admin-label-sm">次</span>
              </div>
              <div className="admin-triple-item">
                <label className="admin-label-sm">周投放上限</label>
                <input type="number" min="500" max="50000" className="admin-num-input"
                  value={(admin as AdminCfg & { merchantWeeklyAdLimit?: number }).merchantWeeklyAdLimit ?? 2000}
                  onChange={(e) => setAdmin((a) => ({ ...a, merchantWeeklyAdLimit: parseInt(e.target.value) || 2000 } as AdminCfg))} />
                <span className="admin-label-sm">次</span>
              </div>
              <div className="admin-triple-item">
                <label className="admin-label-sm">屏蔽预警</label>
                <input type="number" min="5" max="80" className="admin-num-input"
                  value={(admin as AdminCfg & { adBlockRatioWarning?: number }).adBlockRatioWarning ?? 30}
                  onChange={(e) => setAdmin((a) => ({ ...a, adBlockRatioWarning: parseInt(e.target.value) || 30 } as AdminCfg))} />
                <span className="admin-label-sm">%</span>
              </div>
            </div>

            <div className="admin-section-divider">语法词汇 · 智能学习</div>

            <div className="admin-row admin-row-with-toggle">
              <label className="admin-label">记忆梗自动审核（免人工）</label>
              <label className="admin-toggle">
                <input type="checkbox" checked={admin.mnemonicAutoApprove}
                  onChange={(e) => setAdmin((a) => ({ ...a, mnemonicAutoApprove: e.target.checked }))} />
                <span className="admin-toggle-track" />
              </label>
            </div>

            <div className="admin-row admin-row-triple">
              <div className="admin-triple-item">
                <label className="admin-label-sm">秘籍打赏抽成</label>
                <input type="number" min="0" max="50" className="admin-num-input"
                  value={admin.tipCommissionPct}
                  onChange={(e) => setAdmin((a) => ({ ...a, tipCommissionPct: parseInt(e.target.value) || 20 }))} />
                <span className="admin-label-sm">%</span>
              </div>
              <div className="admin-triple-item">
                <label className="admin-label-sm">模拟题数</label>
                <input type="number" min="5" max="50" className="admin-num-input"
                  value={admin.examQuizCount}
                  onChange={(e) => setAdmin((a) => ({ ...a, examQuizCount: parseInt(e.target.value) || 10 }))} />
                <span className="admin-label-sm">题</span>
              </div>
              <div className="admin-triple-item">
                <label className="admin-label-sm" style={{ opacity: .4 }}>预留</label>
                <input type="number" className="admin-num-input" disabled value={0} style={{ opacity: .3 }} />
              </div>
            </div>

            <div className="admin-section-divider">橱窗 &amp; 提现 &amp; 保证金</div>

            <div className="admin-row admin-row-triple">
              <div className="admin-triple-item">
                <label className="admin-label-sm">橱窗抽成</label>
                <input type="number" min="5" max="50" className="admin-num-input"
                  value={admin.shopCommissionPct}
                  onChange={(e) => setAdmin((a) => ({ ...a, shopCommissionPct: parseInt(e.target.value) || 20 }))} />
                <span className="admin-label-sm">%</span>
              </div>
              <div className="admin-triple-item">
                <label className="admin-label-sm">最低提现</label>
                <input type="number" min="1" step="1" className="admin-num-input"
                  value={admin.minWithdrawalYuan}
                  onChange={(e) => setAdmin((a) => ({ ...a, minWithdrawalYuan: parseFloat(e.target.value) || 10 }))} />
                <span className="admin-label-sm">元</span>
              </div>
              <div className="admin-triple-item">
                <label className="admin-label-sm">解散扣押</label>
                <input type="number" min="0" max="100" className="admin-num-input"
                  value={admin.dissolvePenaltyPct}
                  onChange={(e) => setAdmin((a) => ({ ...a, dissolvePenaltyPct: parseInt(e.target.value) || 50 }))} />
                <span className="admin-label-sm">%</span>
              </div>
            </div>

            <div className="admin-section-divider">群管理列表</div>

            <button
              className="admin-group-load-btn"
              onClick={() => { setShowGroupPanel(!showGroupPanel); if (!showGroupPanel) loadAdminGroups(); }}
            >
              {showGroupPanel ? '收起群列表' : '展开群管理列表'}
            </button>

            {showGroupPanel && (
              <div className="admin-group-list">
                {adminGroupsLoading && <p className="admin-group-loading">加载中…</p>}
                {!adminGroupsLoading && adminGroups.length === 0 && <p className="admin-group-loading">暂无群组</p>}
                {adminGroups.map((g) => (
                  <div className="admin-group-row" key={g.id}>
                    <div className="admin-group-info">
                      <span className={`admin-group-status ${g.status === 'banned' ? 'banned' : 'active'}`}>
                        {g.status === 'banned' ? '已封禁' : '正常'}
                      </span>
                      <span className="admin-group-name">{g.name}</span>
                      <span className="admin-group-meta">{g.lang_focus?.toUpperCase()} · {g.member_count}人</span>
                      {g.deposit_forfeited && <span className="admin-group-forfeited">保证金已没收</span>}
                    </div>
                    {g.status !== 'banned' && (
                      <button
                        className="admin-group-ban-btn"
                        onClick={(e) => { e.stopPropagation(); setBanTarget(g); setBanDone(false); }}
                      >
                        封禁群
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="admin-stats">
              <div className="admin-stat-item"><span>总注册用户</span><strong>12,847</strong></div>
              <div className="admin-stat-item"><span>本月收入</span><strong>$3,240</strong></div>
              <div className="admin-stat-item"><span>广告收益</span><strong>$820</strong></div>
              <div className="admin-stat-item"><span>佣金支出</span><strong>$460</strong></div>
            </div>

            <button className="admin-save" onClick={() => setShowAdmin(false)}>保存并关闭</button>
            </>}
          </div>
        </div>
      )}

      {/* Profile hero */}
      <div className="pp-hero">
        <div className="pp-avatar"><TaijiCompass size={44} /></div>
        <div className="pp-hero-info">
          <div className="pp-lang-row">
            <span className="pp-lang-flag">{LANG_FLAG[profile.language_code] || '🌐'}</span>
            <span className="pp-lang-name">正在学习 {profile.language_code.toUpperCase()}</span>
          </div>
          <p className="pp-level">{LEVEL_LABEL[profile.level] || profile.level}</p>
          <p className="pp-goal">{GOAL_LABEL[profile.goal] || profile.goal}</p>
        </div>
      </div>

      {/* XP */}
      <div className="pp-xp-section">
        <div className="pp-xp-top">
          <span className="pp-xp-label">经验值 · Level {Math.floor(xp / 200) + 1}</span>
          <span className="pp-xp-val">✨ {xp} XP</span>
        </div>
        <div className="pp-xp-track"><div className="pp-xp-fill" style={{ width: `${levelPct}%` }} /></div>
        <div className="pp-stats-row">
          <div className="pp-stat-chip">🔥 {streak} 天连续</div>
          <div className="pp-stat-chip">✨ {xp} XP</div>
          <div className="pp-stat-chip">💎 {affy.coins} 钻石</div>
        </div>
      </div>

      {/* Quick links */}
      <div className="pp-quick-links">
        <button className="pp-quick-btn" onClick={onAchievements}>
          <span className="pp-quick-icon">🎖️</span>
          <span className="pp-quick-label">成就墙</span>
          <span className="pp-quick-arrow">›</span>
        </button>
        <button className="pp-quick-btn" onClick={onStreakShield}>
          <span className="pp-quick-icon">🛡️</span>
          <span className="pp-quick-label">连胜冻结</span>
          <span className="pp-quick-arrow">›</span>
        </button>
        <button className="pp-quick-btn" onClick={onPrivacy}>
          <span className="pp-quick-icon">🔒</span>
          <span className="pp-quick-label">{s.profile_privacy}</span>
          <span className="pp-quick-arrow">›</span>
        </button>
        <button className="pp-quick-btn" onClick={onMerchant}>
          <span className="pp-quick-icon">🏪</span>
          <span className="pp-quick-label">商家入驻</span>
          <span className="pp-quick-arrow">›</span>
        </button>
        <button className="pp-quick-btn" onClick={() => setShowVoicePicker(true)}>
          <span className="pp-quick-icon">🔊</span>
          <span className="pp-quick-label">声音选择 · {activeVoice.name}</span>
          <span className="pp-quick-arrow">›</span>
        </button>
        <button className="pp-quick-btn" onClick={() => setShowThemePicker(true)}>
          <span className="pp-quick-icon">🎨</span>
          <span className="pp-quick-label">{s.profile_theme}</span>
          <span className="pp-quick-arrow">›</span>
        </button>
        <button className="pp-quick-btn" onClick={() => setShowUILangPicker(!showUILangPicker)}>
          <span className="pp-quick-icon">🌐</span>
          <span className="pp-quick-label">{s.profile_ui_lang}</span>
          <span className="pp-quick-arrow">{showUILangPicker ? '▲' : '›'}</span>
        </button>
        {showUILangPicker && (
          <div className="pp-uilang-picker">
            {UI_LANG_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                className={`pp-uilang-option ${uiLang === opt.code ? 'selected' : ''}`}
                onClick={() => { setUILang(opt.code as UILang); setShowUILangPicker(false); }}
              >
                <span className="pp-uilang-native">{opt.native}</span>
                {uiLang === opt.code && <span className="pp-uilang-check">✓</span>}
              </button>
            ))}
          </div>
        )}
        {adminUnlocked && (
          <button className="pp-quick-btn" onClick={() => setShowLangPackAdmin(true)}>
            <span className="pp-quick-icon">📦</span>
            <span className="pp-quick-label">语言包管理</span>
            <span className="pp-quick-arrow">›</span>
          </button>
        )}
        <button className="pp-quick-btn" onClick={() => setShowPromoCenter(true)}>
          <span className="pp-quick-icon">🎁</span>
          <span className="pp-quick-label">推广中心</span>
          <span className="pp-quick-arrow">›</span>
        </button>
        <button className="pp-quick-btn" onClick={() => setShowTeamManagement(true)}>
          <span className="pp-quick-icon">👥</span>
          <span className="pp-quick-label">学习团队管理</span>
          <span className="pp-quick-arrow">›</span>
        </button>
      </div>

      {/* Honor Wall */}
      <div className="pp-honor-wall">
        <h3 className="pp-honor-title">荣誉墙</h3>
        <div className="pp-honor-badges">
          {xp >= 0 && (
            <div className="pp-honor-badge">
              <span className="pp-badge-icon">🌱</span>
              <span className="pp-badge-name">学习启程</span>
            </div>
          )}
          {xp >= 200 && (
            <div className="pp-honor-badge earned">
              <span className="pp-badge-icon">⚡</span>
              <span className="pp-badge-name">百题达人</span>
            </div>
          )}
          {xp >= 500 && (
            <div className="pp-honor-badge earned">
              <span className="pp-badge-icon">🔥</span>
              <span className="pp-badge-name">连胜闯关</span>
            </div>
          )}
          {streak >= 7 && (
            <div className="pp-honor-badge earned">
              <span className="pp-badge-icon">📅</span>
              <span className="pp-badge-name">七日连打</span>
            </div>
          )}
          {streak >= 30 && (
            <div className="pp-honor-badge earned">
              <span className="pp-badge-icon">🏆</span>
              <span className="pp-badge-name">月度坚持</span>
            </div>
          )}
          {xp >= 1000 && (
            <div className="pp-honor-badge earned">
              <span className="pp-badge-icon">💎</span>
              <span className="pp-badge-name">语言精英</span>
            </div>
          )}
          {xp < 200 && streak < 7 && (
            <div className="pp-honor-locked">
              <span className="pp-honor-locked-text">继续学习解锁更多勋章</span>
            </div>
          )}
        </div>
      </div>

      {/* Earn hub */}
      <div className="pp-section-header">
        <h2 className="pp-section-title">即学即赚 · Earn While You Learn</h2>
        <p className="pp-section-sub">邀请好友，终身分佣</p>
      </div>

      {/* Invite card */}
      <div className="pp-invite-card">
        <div className="pp-invite-top">
          <div className="pp-invite-left">
            <p className="pp-invite-code-label">你的专属邀请码</p>
            <p className="pp-invite-code">{code}</p>
          </div>
          <div className="pp-invite-right"><TaijiCompass size={36} /></div>
        </div>
        <p className="pp-invite-link">{referralLink}</p>
        <div className="pp-invite-actions">
          <button className={`pp-copy-btn ${copied ? 'copied' : ''}`} onClick={copyLink}>
            {copied ? '✓ 已复制' : '复制专属推荐链接'}
          </button>
          <button className="pp-share-btn" onClick={simulateReferral} title="分享（演示+1邀请）">
            分享海报
          </button>
        </div>
      </div>

      {/* Dashboard */}
      <div className="pp-dashboard">
        <div className="pp-dash-card referrals">
          <span className="pp-dash-icon">👥</span>
          <span className="pp-dash-val">{affy.referrals}</span>
          <span className="pp-dash-label">成功邀请好友</span>
        </div>
        <div className="pp-dash-card cash">
          <span className="pp-dash-icon">💵</span>
          <span className="pp-dash-val">${affy.cash.toFixed(2)}</span>
          <span className="pp-dash-label">已赚取现金</span>
        </div>
        <div className="pp-dash-card coins">
          <span className="pp-dash-icon">💎</span>
          <span className="pp-dash-val">{affy.coins}</span>
          <span className="pp-dash-label">钻石奖励</span>
        </div>
      </div>

      {/* Partner ad banner */}
      <div className="pp-ad-banner">
        <div className="pp-ad-left">
          <span className="pp-ad-tag">合作推荐</span>
          <p className="pp-ad-title">新东方在线 · JLPT N2 冲刺班</p>
          <p className="pp-ad-sub">限时特惠 · 原价 ¥1980，现价 ¥580</p>
        </div>
        <button className="pp-ad-btn">立即了解 →</button>
      </div>

      {/* Withdraw */}
      {!withdrawDone ? (
        <button
          className={`pp-withdraw-btn ${withdrawing ? 'loading' : ''}`}
          disabled={affy.cash < 1 || withdrawing}
          onClick={simulateWithdraw}
        >
          {withdrawing ? '处理中…' : `一键提现 $${affy.cash.toFixed(2)}`}
        </button>
      ) : (
        <div className="pp-withdraw-done">✅ 提现申请已提交！预计1-3工作日到账。</div>
      )}

      {/* Promotion Center Modal */}
      {showPromoCenter && (
        <div className="pp-modal-overlay" onClick={() => setShowPromoCenter(false)}>
          <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pp-modal-header">
              <h3 className="pp-modal-title">🎁 推广中心</h3>
              <button className="pp-modal-close" onClick={() => setShowPromoCenter(false)}>✕</button>
            </div>
            
            <div className="pp-promo-content">
              <div className="pp-promo-card">
                <div className="pp-promo-code-section">
                  <p className="pp-promo-code-label">你的专属邀请码</p>
                  <p className="pp-promo-code">{code}</p>
                  <p className="pp-promo-link">{referralLink}</p>
                </div>
                
                <div className="pp-promo-qr-section">
                  {showQrCode ? (
                    <div className="pp-qr-code">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(referralLink)}`} 
                        alt="推广二维码" 
                        className="pp-qr-image"
                      />
                    </div>
                  ) : (
                    <button className="pp-generate-qr-btn" onClick={() => setShowQrCode(true)}>
                      📱 生成推广二维码
                    </button>
                  )}
                </div>
                
                <div className="pp-promo-actions">
                  <button className={`pp-copy-btn ${copied ? 'copied' : ''}`} onClick={copyLink}>
                    {copied ? '✓ 已复制' : '复制推广链接'}
                  </button>
                  {showQrCode && (
                    <button className="pp-download-qr-btn" onClick={() => setShowQrCode(false)}>
                      收起二维码
                    </button>
                  )}
                </div>
              </div>
              
              <div className="pp-promo-stats">
                <div className="pp-promo-stat-item">
                  <span className="pp-promo-stat-icon">👥</span>
                  <span className="pp-promo-stat-val">{getTotalTeamMembers()}</span>
                  <span className="pp-promo-stat-label">直接邀请</span>
                </div>
                <div className="pp-promo-stat-item">
                  <span className="pp-promo-stat-icon">🌳</span>
                  <span className="pp-promo-stat-val">{getTotalSecondLevel()}</span>
                  <span className="pp-promo-stat-label">二级裂变</span>
                </div>
                <div className="pp-promo-stat-item">
                  <span className="pp-promo-stat-icon">💵</span>
                  <span className="pp-promo-stat-val">${affy.cash.toFixed(2)}</span>
                  <span className="pp-promo-stat-label">累计收益</span>
                </div>
              </div>
              
              <div className="pp-promo-rules">
                <h4>💰 推广奖励规则</h4>
                <ul>
                  <li>• 每邀请1位好友注册并学习3天，奖励 ${admin.reward} 现金</li>
                  <li>• 好友充值内购，你终身享有 {admin.commissionPct}% 分成</li>
                  <li>• 邀请满10人解锁钻石会员，全站免费</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Management Modal */}
      {showTeamManagement && (
        <div className="pp-modal-overlay" onClick={() => setShowTeamManagement(false)}>
          <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pp-modal-header">
              <h3 className="pp-modal-title">👥 学习团队管理</h3>
              <button className="pp-modal-close" onClick={() => setShowTeamManagement(false)}>✕</button>
            </div>
            
            <div className="pp-team-content">
              <div className="pp-team-summary">
                <div className="pp-team-summary-item">
                  <span className="pp-team-summary-val">{getTotalTeamMembers()}</span>
                  <span className="pp-team-summary-label">团队总人数</span>
                </div>
                <div className="pp-team-summary-item">
                  <span className="pp-team-summary-val">{getActiveMembers()}</span>
                  <span className="pp-team-summary-label">活跃成员</span>
                </div>
                <div className="pp-team-summary-item">
                  <span className="pp-team-summary-val">{getTotalSecondLevel()}</span>
                  <span className="pp-team-summary-label">二级成员数</span>
                </div>
              </div>
              
              <div className="pp-team-list">
                <h4>我的直推成员</h4>
                {mockReferralUsers.map((user) => (
                  <div key={user.id} className={`pp-team-member ${user.isActive ? '' : 'inactive'}`}>
                    <div className="pp-team-member-info">
                      <span className="pp-team-member-avatar">👤</span>
                      <div className="pp-team-member-details">
                        <span className="pp-team-member-name">{user.name}</span>
                        <span className="pp-team-member-meta">
                          Lv.{user.level} · {user.joinedAt}加入
                        </span>
                      </div>
                    </div>
                    <div className="pp-team-member-stats">
                      <span className="pp-team-member-referrals">
                        裂变 {user.referrals} 人
                      </span>
                      {user.isActive ? (
                        <span className="pp-team-member-status active">活跃</span>
                      ) : (
                        <span className="pp-team-member-status inactive">已流失</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Anti-fraud notice */}
      <p className="pp-anti-fraud">
        ⚠️ 提现安全守护：每位被邀请的好友必须通过手机验证、且在应用内打卡学习满 3 天，奖金方可解冻提现。每个设备限领一次。
      </p>

      {/* Rules */}
      <div className="pp-rules">
        <h3 className="pp-rules-title">💰 赚钱规则</h3>
        <div className="pp-rule-item">
          <span className="pp-rule-num">1</span>
          <p className="pp-rule-text">每成功邀请 1 位好友下载打卡，立即获得 <strong>${admin.reward} 现金奖励</strong></p>
        </div>
        <div className="pp-rule-item">
          <span className="pp-rule-num">2</span>
          <p className="pp-rule-text">好友未来充值任何内购或去广告会员，你<strong>终身享有 {admin.commissionPct}% 现金裂变抽成</strong></p>
        </div>
        <div className="pp-rule-item">
          <span className="pp-rule-num">3</span>
          <p className="pp-rule-text">邀请满 10 位好友解锁 <strong>钻石会员 💎</strong>，全站内容永久免费</p>
        </div>
      </div>

      {/* Reset */}
      <div className="pp-reset-section">
        {!showResetConfirm ? (
          <button className="pp-reset-btn" onClick={() => setShowResetConfirm(true)}>{s.profile_reset}</button>
        ) : (
          <div className="pp-reset-confirm">
            <span>{s.btn_confirm}?</span>
            <button className="pp-reset-yes" onClick={onReset}>{s.btn_confirm}</button>
            <button className="pp-reset-no" onClick={() => setShowResetConfirm(false)}>{s.btn_cancel}</button>
          </div>
        )}
      </div>

      {/* Version (secret tap zone) */}
      <p className="pp-version" onClick={handleVersionTap}>
        言道 v5.1.0 · {adminUnlocked ? '🔓 后台已解锁' : ''}
      </p>
    </div>
  );
};
