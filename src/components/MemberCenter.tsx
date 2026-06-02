import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { FloatingBack } from './FloatingBack';
import { CheckoutModal } from './CheckoutModal';
import { UpsellPlan } from '../lib/featureGate';

interface ExchangeRateData {
  currency: string;
  rate: number;
  prices: Record<string, { cents: number; display: string; currency: string }>;
  allRates: Record<string, number>;
}

async function fetchExchangeRates(currency: string): Promise<ExchangeRateData | null> {
  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/exchange-rates?currency=${currency}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
    });
    if (!res.ok) return null;
    return await res.json() as ExchangeRateData;
  } catch {
    return null;
  }
}

interface MemberCenterProps {
  sessionKey: string;
  onBack: () => void;
}

interface ProfilePayment {
  vip_expiry: string | null;
  exam_credits: number;
  ai_speech_credits: number;
  extra_partner_count: number;
  unlocked_lang_packs: string[];
  default_currency: string;
}

interface Subscription {
  id: string;
  plan_key: string;
  status: string;
  currency: string;
  amount_cents: number;
  is_simulated: boolean;
  payment_provider: string;
  started_at: string;
  current_period_end: string;
  cancelled_at: string | null;
}

interface PaymentOrder {
  id: string;
  plan_key: string;
  currency: string;
  amount_cents: number;
  status: string;
  is_simulated: boolean;
  paid_at: string | null;
  created_at: string;
}

const PLAN_LABEL: Record<string, string> = {
  exam_single:  '单次模拟考试',
  vip_monthly:  '会员月卡',
  vip_yearly:   '会员年卡',
  partner_slot: '搭子槽位 +1',
  langpack:     '高级题库',
  ai_speech:    'AI口语评测',
};
const CURRENCY_SYMBOL: Record<string, string> = {
  USD: '$', EUR: '€', JPY: '¥', KRW: '₩', GBP: '£', CAD: 'CA$', AUD: 'A$',
};
const LANG_FLAG: Record<string, string> = {
  ja: '🇯🇵', en: '🇺🇸', ko: '🇰🇷', fr: '🇫🇷', es: '🇪🇸',
  de: '🇩🇪', it: '🇮🇹', pt: '🇧🇷', ar: '🇸🇦', zh: '🇨🇳',
};

function formatPrice(cents: number, currency: string): string {
  const sym = CURRENCY_SYMBOL[currency] ?? currency;
  if (currency === 'JPY' || currency === 'KRW') return `${sym}${cents}`;
  return `${sym}${(cents / 100).toFixed(2)}`;
}
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' });
}
function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

const CURRENCY_LIST = ['USD','EUR','GBP','JPY','KRW','CAD','AUD','CNY','SGD','HKD'];

type MCTab = 'overview' | 'plans' | 'orders';

export const MemberCenter: React.FC<MemberCenterProps> = ({ sessionKey, onBack }) => {
  const [tab, setTab] = useState<MCTab>('overview');
  const [profile, setProfile] = useState<ProfilePayment | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState<UpsellPlan | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Subscription | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    () => profile?.default_currency ?? 'USD'
  );
  const [rateData, setRateData] = useState<ExchangeRateData | null>(null);
  const [rateLoading, setRateLoading] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState<Subscription | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  const loadAll = useCallback(async () => {
    const [profileRes, subsRes, ordersRes] = await Promise.all([
      supabase.from('user_profiles')
        .select('vip_expiry,exam_credits,ai_speech_credits,extra_partner_count,unlocked_lang_packs,default_currency')
        .eq('session_key', sessionKey).maybeSingle(),
      supabase.from('user_subscriptions')
        .select('*').eq('session_key', sessionKey)
        .order('created_at', { ascending: false }),
      supabase.from('payment_orders')
        .select('*').eq('session_key', sessionKey)
        .order('created_at', { ascending: false }).limit(30),
    ]);
    setProfile(profileRes.data as ProfilePayment | null);
    setSubscriptions((subsRes.data ?? []) as Subscription[]);
    setOrders((ordersRes.data ?? []) as PaymentOrder[]);
  }, [sessionKey]);

  useEffect(() => {
    setLoading(true);
    loadAll().finally(() => setLoading(false));
  }, [loadAll]);

  useEffect(() => {
    if (profile?.default_currency) setSelectedCurrency(profile.default_currency);
  }, [profile?.default_currency]);

  useEffect(() => {
    setRateLoading(true);
    fetchExchangeRates(selectedCurrency)
      .then((d) => setRateData(d))
      .finally(() => setRateLoading(false));
  }, [selectedCurrency]);

  const activeSub = subscriptions.find((s) => s.status === 'active');
  const isVip = profile?.vip_expiry ? new Date(profile.vip_expiry) > new Date() : false;
  const vipDaysLeft = profile?.vip_expiry ? daysUntil(profile.vip_expiry) : 0;
  const expiryWarning = isVip && vipDaysLeft <= 3;

  async function cancelSubscription(sub: Subscription) {
    setCancelling(true);
    // In live mode this would call Stripe cancel subscription API via Edge Function
    await supabase.from('user_subscriptions').update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    }).eq('id', sub.id);
    // Keep VIP until current_period_end
    await loadAll();
    setCancelling(false);
    setCancelTarget(null);
  }

  async function upgradeWithRefund(sub: Subscription) {
    setUpgrading(true);
    // Calculate pro-rated refund: remaining days / total days × amount paid
    const periodStart = new Date(sub.started_at).getTime();
    const periodEnd   = new Date(sub.current_period_end).getTime();
    const now         = Date.now();
    const totalDays   = Math.max(1, (periodEnd - periodStart) / 86400000);
    const remainDays  = Math.max(0, (periodEnd - now) / 86400000);
    const refundCents = Math.round(sub.amount_cents * (remainDays / totalDays));

    // Mark current sub as cancelled and write wallet credit
    await supabase.from('user_subscriptions').update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    }).eq('id', sub.id);

    if (refundCents > 0) {
      await supabase.from('payment_orders').insert({
        session_key: sessionKey,
        plan_key: 'refund_credit',
        currency: sub.currency,
        amount_cents: refundCents,
        status: 'refunded',
        is_simulated: sub.is_simulated,
        paid_at: new Date().toISOString(),
      });
    }

    await loadAll();
    setUpgrading(false);
    setUpgradeTarget(null);

    // Open yearly checkout
    openVipCheckout('vip_yearly');
  }

  function openVipCheckout(planKey: 'vip_monthly' | 'vip_yearly') {
    setCheckoutPlan({
      planKey,
      label: planKey === 'vip_monthly' ? '会员月卡' : '会员年卡',
      priceLabel: planKey === 'vip_monthly' ? '$3.9/月' : '$29/年',
      description: '免广告 · 无限考试 · 不限搭子 · 高级题库8折',
    });
  }

  if (loading) {
    return (
      <div className="mc-wrap">
        <FloatingBack onClick={onBack} />
        <div className="mc-loading">加载会员中心…</div>
      </div>
    );
  }

  return (
    <div className="mc-wrap">
      <FloatingBack onClick={onBack} />

      {/* VIP Hero */}
      <div className={`mc-hero ${isVip ? 'vip' : 'free'}`}>
        <div className="mc-hero-left">
          <span className="mc-hero-badge">{isVip ? '💎 会员' : '免费用户'}</span>
          {isVip && profile?.vip_expiry && (
            <p className={`mc-hero-expiry ${expiryWarning ? 'warn' : ''}`}>
              {expiryWarning ? '⚠️ ' : ''}到期：{formatDate(profile.vip_expiry)}（剩 {vipDaysLeft} 天）
            </p>
          )}
          {!isVip && <p className="mc-hero-sub">升级解锁全部功能</p>}
        </div>
        <div className="mc-hero-right">
          {isVip
            ? <span className="mc-vip-crown">👑</span>
            : <button className="mc-upgrade-btn" onClick={() => openVipCheckout('vip_monthly')}>立即升级</button>
          }
        </div>
      </div>

      {/* Tabs */}
      <div className="mc-tabs">
        {(['overview', 'plans', 'orders'] as MCTab[]).map((t) => (
          <button key={t} className={`mc-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'overview' ? '我的权益' : t === 'plans' ? '订阅管理' : '消费记录'}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div className="mc-section">
          <div className="mc-entitlements">
            {/* VIP status */}
            <div className={`mc-ent-card ${isVip ? 'unlocked' : 'locked'}`}>
              <span className="mc-ent-icon">💎</span>
              <div className="mc-ent-info">
                <span className="mc-ent-label">会员状态</span>
                <span className="mc-ent-val">{isVip ? `有效至 ${formatDate(profile!.vip_expiry!)}` : '未开通'}</span>
              </div>
              {!isVip && (
                <button className="mc-ent-buy" onClick={() => openVipCheckout('vip_monthly')}>购买</button>
              )}
            </div>

            {/* Exam credits */}
            <div className="mc-ent-card unlocked">
              <span className="mc-ent-icon">📝</span>
              <div className="mc-ent-info">
                <span className="mc-ent-label">模拟考试次数</span>
                <span className="mc-ent-val">
                  {isVip ? '无限次（会员）' : `剩余 ${profile?.exam_credits ?? 0} 次`}
                </span>
              </div>
              {!isVip && (
                <button className="mc-ent-buy" onClick={() => setCheckoutPlan({
                  planKey: 'exam_single', label: '单次考试', priceLabel: '$0.99/次',
                  description: '购买单次模拟考试机会',
                })}>+购买</button>
              )}
            </div>

            {/* AI Speech credits */}
            <div className="mc-ent-card unlocked">
              <span className="mc-ent-icon">🎙️</span>
              <div className="mc-ent-info">
                <span className="mc-ent-label">AI口语评测</span>
                <span className="mc-ent-val">
                  {isVip ? '无限次（会员）' : `今日剩余 ${profile?.ai_speech_credits ?? 0} 次`}
                </span>
              </div>
              {!isVip && (
                <button className="mc-ent-buy" onClick={() => setCheckoutPlan({
                  planKey: 'ai_speech', label: 'AI口语评测 ×5', priceLabel: '$0.2/次',
                  description: '购买5次AI深度口语评测',
                })}>+购买</button>
              )}
            </div>

            {/* Partner slots */}
            <div className="mc-ent-card unlocked">
              <span className="mc-ent-icon">🤝</span>
              <div className="mc-ent-info">
                <span className="mc-ent-label">搭子槽位</span>
                <span className="mc-ent-val">
                  {isVip ? '不限（会员）' : `免费2个 + 额外${profile?.extra_partner_count ?? 0}个`}
                </span>
              </div>
              {!isVip && (
                <button className="mc-ent-buy" onClick={() => setCheckoutPlan({
                  planKey: 'partner_slot', label: '搭子槽位 +1', priceLabel: '$0.49',
                  description: '永久增加1个搭子名额',
                })}>+扩充</button>
              )}
            </div>

            {/* Unlocked langpacks */}
            <div className="mc-ent-card unlocked">
              <span className="mc-ent-icon">📚</span>
              <div className="mc-ent-info">
                <span className="mc-ent-label">高级题库</span>
                <div className="mc-langpacks">
                  {(profile?.unlocked_lang_packs ?? []).length === 0
                    ? <span className="mc-ent-val">未解锁</span>
                    : (profile!.unlocked_lang_packs).map((l) => (
                        <span key={l} className="mc-lang-chip">{LANG_FLAG[l] ?? l} {l.toUpperCase()}</span>
                      ))
                  }
                </div>
              </div>
              <button className="mc-ent-buy" onClick={() => setCheckoutPlan({
                planKey: 'langpack', label: '日语高级题库', priceLabel: isVip ? '$1.52（8折）' : '$1.9',
                description: '永久解锁该语言全部高级题目', meta: { lang: 'ja' },
              })}>解锁</button>
            </div>
          </div>

          {/* VIP benefits */}
          <div className="mc-benefits">
            <h4 className="mc-benefits-title">会员全部权益</h4>
            {[
              { icon: '🚫', text: '全平台无广告' },
              { icon: '📝', text: '模拟考试无限次' },
              { icon: '🤝', text: '语伴数量不限' },
              { icon: '📚', text: '高级题库8折优惠' },
              { icon: '🎙️', text: 'AI口语评测无限次' },
            ].map((b) => (
              <div className="mc-benefit-row" key={b.text}>
                <span className="mc-benefit-icon">{b.icon}</span>
                <span className="mc-benefit-text">{b.text}</span>
                {isVip && <span className="mc-benefit-check">✓</span>}
              </div>
            ))}
          </div>

          {!isVip && (
            <div className="mc-plan-cards">
              <div className="mc-plan-card monthly" onClick={() => openVipCheckout('vip_monthly')}>
                <span className="mc-plan-icon">🌙</span>
                <span className="mc-plan-name">月度会员</span>
                <span className="mc-plan-price">$3.9<span>/月</span></span>
                <button className="mc-plan-btn">立即开通</button>
              </div>
              <div className="mc-plan-card yearly" onClick={() => openVipCheckout('vip_yearly')}>
                <span className="mc-plan-badge">最划算</span>
                <span className="mc-plan-icon">⭐</span>
                <span className="mc-plan-name">年度会员</span>
                <span className="mc-plan-price">$29<span>/年</span></span>
                <span className="mc-plan-save">省 $17.8</span>
                <button className="mc-plan-btn">立即开通</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── PLANS ── */}
      {tab === 'plans' && (
        <div className="mc-section">
          {subscriptions.length === 0 && (
            <div className="mc-empty">
              <p>暂无订阅记录</p>
              <button className="mc-upgrade-btn" style={{ marginTop: 12 }} onClick={() => setTab('overview')}>
                查看套餐
              </button>
            </div>
          )}
          {subscriptions.map((s) => (
            <div className="mc-sub-card" key={s.id}>
              <div className="mc-sub-top">
                <span className="mc-sub-name">{PLAN_LABEL[s.plan_key] ?? s.plan_key}</span>
                <span className={`mc-sub-status ${s.status}`}>{
                  s.status === 'active' ? '✓ 生效中' :
                  s.status === 'cancelled' ? '已取消' :
                  s.status === 'expired' ? '已过期' : '逾期'
                }</span>
              </div>
              <div className="mc-sub-meta">
                <span>{formatPrice(s.amount_cents, s.currency)}/{s.plan_key === 'vip_monthly' ? '月' : '年'}</span>
                <span className="mc-dot">·</span>
                <span>到期：{formatDate(s.current_period_end)}</span>
                {s.is_simulated && <span className="mc-sim-tag">模拟</span>}
              </div>
              {s.status === 'active' && !s.cancelled_at && (
                <button className="mc-cancel-sub-btn" onClick={() => setCancelTarget(s)}>
                  取消续订
                </button>
              )}
              {s.cancelled_at && (
                <p className="mc-cancel-note">已于 {formatDate(s.cancelled_at)} 取消续订，到期前仍可使用</p>
              )}
            </div>
          ))}

          {/* Upgrade with refund */}
          {subscriptions.some((s) => s.status === 'active' && s.plan_key === 'vip_monthly') && (
            <div className="mc-upgrade-note">
              <h4>升级到年卡（比例退款）</h4>
              <p>从月卡升级时，剩余天数按比例折算为钱包余额，差额自动补收。</p>
              <button
                className="mc-upgrade-btn"
                style={{ marginTop: 10 }}
                onClick={() => {
                  const sub = subscriptions.find((s) => s.status === 'active' && s.plan_key === 'vip_monthly');
                  if (sub) setUpgradeTarget(sub);
                }}
              >
                升级年卡并退款剩余天数
              </button>
            </div>
          )}

          {/* Currency selector */}
          <div className="mc-currency-selector">
            <span className="mc-cs-label">显示货币</span>
            <div className="mc-cs-list">
              {CURRENCY_LIST.map((c) => (
                <button
                  key={c}
                  className={`mc-cs-chip ${selectedCurrency === c ? 'active' : ''}`}
                  onClick={() => setSelectedCurrency(c)}
                >
                  {CURRENCY_SYMBOL[c] ?? ''}{c}
                </button>
              ))}
            </div>
            {rateLoading && <span className="mc-rate-loading">汇率加载中…</span>}
            {rateData && !rateLoading && (
              <p className="mc-rate-note">
                实时汇率: 1 USD = {rateData.rate.toFixed(rateData.currency === 'JPY' || rateData.currency === 'KRW' ? 0 : 4)} {rateData.currency}
              </p>
            )}
          </div>

          {/* Real-time price table */}
          {rateData && (
            <div className="mc-price-table">
              <h4 className="mc-price-table-title">套餐定价 · {rateData.currency}</h4>
              {[
                { key: 'vip_monthly', label: '会员月卡' },
                { key: 'vip_yearly',  label: '会员年卡' },
                { key: 'exam_single', label: '单次考试' },
                { key: 'partner_slot',label: '搭子槽位 +1' },
                { key: 'langpack',    label: '高级题库' },
              ].map(({ key, label }) => {
                const p = rateData.prices[key];
                return p ? (
                  <div key={key} className="mc-price-row">
                    <span className="mc-price-label">{label}</span>
                    <span className="mc-price-val">{p.display}</span>
                  </div>
                ) : null;
              })}
            </div>
          )}

          {/* Stripe info */}
          <div className="mc-stripe-info">
            <div className="mc-stripe-row">
              <span className="mc-stripe-icon">🔒</span>
              <div>
                <p className="mc-stripe-title">由 Stripe 提供安全支付</p>
                <p className="mc-stripe-sub">支持 Visa · Mastercard · Amex · Apple Pay · Google Pay · PayPal · 支付宝 · 微信支付</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ORDERS ── */}
      {tab === 'orders' && (
        <div className="mc-section">
          {orders.length === 0 && <div className="mc-empty">暂无消费记录</div>}
          {orders.map((o) => (
            <div className="mc-order-card" key={o.id}>
              <div className="mc-order-left">
                <span className="mc-order-name">{PLAN_LABEL[o.plan_key] ?? o.plan_key}</span>
                <span className="mc-order-date">{o.paid_at ? formatDate(o.paid_at) : formatDate(o.created_at)}</span>
              </div>
              <div className="mc-order-right">
                <span className="mc-order-amount">{formatPrice(o.amount_cents, o.currency)}</span>
                <span className={`mc-order-status ${o.status}`}>{
                  o.status === 'paid' ? '已支付' :
                  o.status === 'refunded' ? '已退款' :
                  o.status === 'failed' ? '失败' : '待支付'
                }</span>
                {o.is_simulated && <span className="mc-sim-tag">模拟</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Upgrade + refund confirm modal ── */}
      {upgradeTarget && (() => {
        const periodStart = new Date(upgradeTarget.started_at).getTime();
        const periodEnd   = new Date(upgradeTarget.current_period_end).getTime();
        const now         = Date.now();
        const totalDays   = Math.max(1, Math.round((periodEnd - periodStart) / 86400000));
        const remainDays  = Math.max(0, Math.ceil((periodEnd - now) / 86400000));
        const usedDays    = totalDays - remainDays;
        // Formula: refund = (remainDays / totalDays) × amountPaid
        const refundCents = Math.round(upgradeTarget.amount_cents * remainDays / totalDays);
        // Yearly price in same currency (approximated from pricing_plans USD $29)
        const yearlyUSD = 2900; // cents
        const yearlyEstCents = upgradeTarget.currency === 'USD' ? yearlyUSD
          : Math.round(yearlyUSD * (upgradeTarget.amount_cents / 390)); // scale by ratio
        // Net charge = yearly price − refund credit
        const netCents = Math.max(0, yearlyEstCents - refundCents);
        return (
          <div className="mc-modal-overlay" onClick={() => setUpgradeTarget(null)}>
            <div className="mc-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="mc-modal-title">升级到年卡 · 差价计算</h3>

              {/* Calculation breakdown */}
              <div className="mc-refund-calc">
                <div className="mc-calc-row">
                  <span className="mc-calc-label">月卡已用天数</span>
                  <span className="mc-calc-val">{usedDays} / {totalDays} 天</span>
                </div>
                <div className="mc-calc-row">
                  <span className="mc-calc-label">月卡剩余天数</span>
                  <span className="mc-calc-val highlight">{remainDays} 天</span>
                </div>
                <div className="mc-calc-divider" />
                <div className="mc-calc-formula">
                  <span className="mc-calc-formula-text">
                    退款 = ({remainDays} / {totalDays}) × {formatPrice(upgradeTarget.amount_cents, upgradeTarget.currency)}
                  </span>
                </div>
                <div className="mc-calc-row refund">
                  <span className="mc-calc-label">按比例退款（入钱包）</span>
                  <span className="mc-calc-val green">+{formatPrice(refundCents, upgradeTarget.currency)}</span>
                </div>
                <div className="mc-calc-row">
                  <span className="mc-calc-label">年卡价格</span>
                  <span className="mc-calc-val">{formatPrice(yearlyEstCents, upgradeTarget.currency)}</span>
                </div>
                <div className="mc-calc-divider" />
                <div className="mc-calc-row total">
                  <span className="mc-calc-label">实际补缴差价</span>
                  <span className="mc-calc-val bold">{formatPrice(netCents, upgradeTarget.currency)}</span>
                </div>
                <p className="mc-calc-note">
                  {/* TODO: Production backend should validate this calculation server-side
                      via POST /api/subscriptions/upgrade-preview before showing to user */}
                  退款金额将自动写入钱包余额，可用于下次订阅抵扣。
                </p>
              </div>

              <div className="mc-modal-actions">
                <button
                  className="mc-modal-confirm"
                  disabled={upgrading}
                  onClick={() => upgradeWithRefund(upgradeTarget)}
                >
                  {upgrading ? '处理中…' : `确认升级 · 补缴 ${formatPrice(netCents, upgradeTarget.currency)}`}
                </button>
                <button className="mc-modal-cancel" onClick={() => setUpgradeTarget(null)}>取消</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Cancel confirm modal ── */}
      {cancelTarget && (
        <div className="mc-modal-overlay" onClick={() => setCancelTarget(null)}>
          <div className="mc-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="mc-modal-title">取消订阅</h3>
            <p className="mc-modal-body">
              确认取消 {PLAN_LABEL[cancelTarget.plan_key]} 的自动续订？<br />
              会员权益将保留至 <strong>{formatDate(cancelTarget.current_period_end)}</strong>。
            </p>
            <div className="mc-modal-actions">
              <button className="mc-modal-confirm" disabled={cancelling}
                onClick={() => cancelSubscription(cancelTarget)}>
                {cancelling ? '处理中…' : '确认取消续订'}
              </button>
              <button className="mc-modal-cancel" onClick={() => setCancelTarget(null)}>返回</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Checkout modal ── */}
      {checkoutPlan && (
        <CheckoutModal
          sessionKey={sessionKey}
          plan={checkoutPlan}
          onSuccess={() => { setCheckoutPlan(null); loadAll(); }}
          onClose={() => setCheckoutPlan(null)}
        />
      )}
    </div>
  );
};
