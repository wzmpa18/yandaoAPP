import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../data/supabase';
import { UpsellPlan } from '../lib/featureGate';

interface CheckoutModalProps {
  sessionKey: string;
  plan: UpsellPlan;
  onSuccess: (plan: UpsellPlan) => void;
  onClose: () => void;
}

type Currency = 'USD' | 'EUR' | 'JPY' | 'KRW' | 'GBP' | 'CAD' | 'AUD';
type PaymentMethod = 'card' | 'alipay' | 'wechat' | 'link';

const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: '$', EUR: '€', JPY: '¥', KRW: '₩', GBP: '£', CAD: 'CA$', AUD: 'A$',
};
const CURRENCIES: Currency[] = ['USD', 'EUR', 'JPY', 'KRW', 'GBP', 'CAD', 'AUD'];

// Zero-decimal currencies (no cents division needed)
const ZERO_DECIMAL: Set<Currency> = new Set(['JPY', 'KRW']);

// Static fallback rates (USD base) in case live API is unavailable
const FALLBACK_RATES: Record<Currency, number> = {
  USD: 1, EUR: 0.92, JPY: 149.5, KRW: 1320, GBP: 0.79, CAD: 1.36, AUD: 1.52,
};

// Cache live rates for the session to avoid redundant fetches
let _rateCache: { rates: Record<Currency, number>; fetchedAt: number } | null = null;

async function getLiveRates(): Promise<Record<Currency, number>> {
  // Serve from cache if fetched within the last 10 minutes
  if (_rateCache && Date.now() - _rateCache.fetchedAt < 600_000) {
    return _rateCache.rates;
  }
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error('rate fetch failed');
    const json = await res.json() as { rates: Record<string, number> };
    const rates = {} as Record<Currency, number>;
    CURRENCIES.forEach((c) => { rates[c] = json.rates[c] ?? FALLBACK_RATES[c]; });
    _rateCache = { rates, fetchedAt: Date.now() };
    return rates;
  } catch {
    // API unavailable — use static fallback, don't block the user
    return FALLBACK_RATES;
  }
}

// Convert USD cents → local currency cents (or smallest unit for zero-decimal)
function convertFromUSD(usdCents: number, currency: Currency, rate: number): number {
  const usdAmount = usdCents / 100;
  const local = usdAmount * rate;
  return ZERO_DECIMAL.has(currency) ? Math.round(local) : Math.round(local * 100);
}

const PLAN_LABEL: Record<string, string> = {
  exam_single:  '单次模拟考试',
  vip_monthly:  '会员月卡',
  vip_yearly:   '会员年卡',
  partner_slot: '搭子槽位 +1',
  langpack:     '高级题库解锁',
  ai_speech:    '单次AI口语评测',
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  sessionKey, plan, onSuccess, onClose,
}) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [price, setPrice] = useState<number | null>(null);
  const [rateLoading, setRateLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [liveRate, setLiveRate] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNum, setCardNum] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // Base USD price from pricing_plans table
  const usdPriceRef = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data: mockCfg } = await supabase.from('platform_configs')
        .select('value').eq('key', 'mock_payment_mode').maybeSingle();
      setIsMockMode(mockCfg?.value === '1');

      // Load USD base price from pricing_plans
      const { data } = await supabase.from('pricing_plans')
        .select('amount_cents')
        .eq('plan_key', plan.planKey)
        .eq('currency', 'USD')
        .maybeSingle();
      usdPriceRef.current = data?.amount_cents ?? null;

      // Fetch live rates and compute initial price in USD
      await applyRateForCurrency('USD');
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function applyRateForCurrency(cur: Currency) {
    setRateLoading(true);
    const prevFallback = usingFallback;
    let rates: Record<Currency, number>;
    try {
      rates = await getLiveRates();
      // Detect if we got back the exact fallback values (means API failed)
      setUsingFallback(rates[cur] === FALLBACK_RATES[cur] && rates['EUR'] === FALLBACK_RATES['EUR']);
    } catch {
      rates = FALLBACK_RATES;
      setUsingFallback(true);
    }
    const rate = rates[cur] ?? FALLBACK_RATES[cur];
    setLiveRate(rate);

    // Convert USD base price using live rate
    if (usdPriceRef.current !== null) {
      setPrice(convertFromUSD(usdPriceRef.current, cur, rate));
    } else {
      // Fallback: try to load from pricing_plans for this currency
      const { data } = await supabase.from('pricing_plans')
        .select('amount_cents')
        .eq('plan_key', plan.planKey)
        .eq('currency', cur)
        .maybeSingle();
      setPrice(data?.amount_cents ?? null);
    }
    void prevFallback; // suppress unused warning
    setRateLoading(false);
  }

  function handleCurrencyChange(cur: Currency) {
    setCurrency(cur);
    applyRateForCurrency(cur);
  }

  function formatPrice(cents: number, cur: Currency): string {
    const sym = CURRENCY_SYMBOL[cur];
    if (ZERO_DECIMAL.has(cur)) return `${sym}${cents}`;
    return `${sym}${(cents / 100).toFixed(2)}`;
  }

  function formatCardNum(v: string): string {
    return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }
  function formatExpiry(v: string): string {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  async function handlePay() {
    if (!isMockMode) {
      // Real Stripe: redirect to Stripe Payment Element / hosted page
      // In production this would create a PaymentIntent via Edge Function
      // and mount @stripe/stripe-js loadStripe(VITE_STRIPE_PUBLISHABLE_KEY)
      setErrorMsg('请先配置 Stripe 密钥。前往 https://bolt.new/setup/stripe 完成配置。');
      return;
    }

    // ── Mock payment flow ──
    if (paymentMethod === 'card') {
      const digits = cardNum.replace(/\s/g, '');
      if (digits.length < 16) { setErrorMsg('请输入完整卡号'); return; }
      if (!cardExpiry.includes('/')) { setErrorMsg('请输入有效到期日'); return; }
      if (cardCvc.length < 3) { setErrorMsg('请输入CVV'); return; }
    }

    setProcessing(true);
    setErrorMsg('');

    // Simulate payment processing delay
    await new Promise((r) => setTimeout(r, 1800));

    // Record payment order in DB
    const amountCents = price ?? 0;
    const { data: order } = await supabase.from('payment_orders').insert({
      session_key: sessionKey,
      plan_key: plan.planKey,
      currency,
      amount_cents: amountCents,
      status: 'paid',
      payment_provider: paymentMethod === 'alipay' ? 'alipay' : paymentMethod === 'wechat' ? 'wechat_pay' : 'mock_stripe',
      is_simulated: true,
      metadata: plan.meta ?? null,
      paid_at: new Date().toISOString(),
    }).select().maybeSingle();

    // Grant the entitlement
    await grantEntitlement(plan.planKey, plan.meta);

    setProcessing(false);
    setDone(true);

    setTimeout(() => { onSuccess(plan); }, 2000);
  }

  async function grantEntitlement(planKey: string, meta?: Record<string, string>) {
    const now = new Date();

    switch (planKey) {
      case 'vip_monthly': {
        const expiry = new Date(now.getTime() + 30 * 86400 * 1000);
        await supabase.from('user_profiles').update({ vip_expiry: expiry.toISOString() }).eq('session_key', sessionKey);
        await supabase.from('user_subscriptions').insert({
          session_key: sessionKey,
          plan_key: planKey,
          currency,
          amount_cents: price ?? 0,
          current_period_end: expiry.toISOString(),
          is_simulated: true,
          payment_provider: 'mock_stripe',
        });
        break;
      }
      case 'vip_yearly': {
        const expiry = new Date(now.getTime() + 365 * 86400 * 1000);
        await supabase.from('user_profiles').update({ vip_expiry: expiry.toISOString() }).eq('session_key', sessionKey);
        await supabase.from('user_subscriptions').insert({
          session_key: sessionKey,
          plan_key: planKey,
          currency,
          amount_cents: price ?? 0,
          current_period_end: expiry.toISOString(),
          is_simulated: true,
          payment_provider: 'mock_stripe',
        });
        break;
      }
      case 'exam_single': {
        const { data: p } = await supabase.from('user_profiles').select('exam_credits').eq('session_key', sessionKey).maybeSingle();
        await supabase.from('user_profiles').update({ exam_credits: (p?.exam_credits ?? 0) + 1 }).eq('session_key', sessionKey);
        break;
      }
      case 'ai_speech': {
        const { data: p } = await supabase.from('user_profiles').select('ai_speech_credits').eq('session_key', sessionKey).maybeSingle();
        await supabase.from('user_profiles').update({ ai_speech_credits: (p?.ai_speech_credits ?? 0) + 5 }).eq('session_key', sessionKey);
        break;
      }
      case 'partner_slot': {
        const { data: p } = await supabase.from('user_profiles').select('extra_partner_count').eq('session_key', sessionKey).maybeSingle();
        await supabase.from('user_profiles').update({ extra_partner_count: (p?.extra_partner_count ?? 0) + 1 }).eq('session_key', sessionKey);
        break;
      }
      case 'langpack': {
        const lang = meta?.lang;
        if (!lang) break;
        const { data: p } = await supabase.from('user_profiles').select('unlocked_lang_packs').eq('session_key', sessionKey).maybeSingle();
        const current: string[] = p?.unlocked_lang_packs ?? [];
        if (!current.includes(lang)) {
          await supabase.from('user_profiles').update({ unlocked_lang_packs: [...current, lang] }).eq('session_key', sessionKey);
        }
        break;
      }
    }
  }

  return (
    <div className="co-overlay" onClick={onClose}>
      <div className="co-modal" onClick={(e) => e.stopPropagation()}>
        <button className="co-close" onClick={onClose}>✕</button>

        {done ? (
          <div className="co-success">
            <span className="co-success-icon">🎉</span>
            <h3 className="co-success-title">支付成功！</h3>
            <p className="co-success-sub">{PLAN_LABEL[plan.planKey] ?? plan.label} 已解锁</p>
          </div>
        ) : (
          <>
            <div className="co-header">
              <h3 className="co-title">安全结账</h3>
              {isMockMode && <span className="co-mock-badge">模拟支付模式</span>}
            </div>

            <div className="co-product">
              <span className="co-product-name">{PLAN_LABEL[plan.planKey] ?? plan.label}</span>
              <div className="co-price-block">
                {rateLoading
                  ? <span className="co-price-loading">换算中…</span>
                  : price !== null
                    ? <span className="co-product-price">{formatPrice(price, currency)}</span>
                    : null
                }
                {!rateLoading && currency !== 'USD' && (
                  <span className={`co-rate-badge ${usingFallback ? 'fallback' : 'live'}`}>
                    {usingFallback ? '估算汇率' : '实时汇率'} 1 USD = {liveRate.toFixed(ZERO_DECIMAL.has(currency) ? 0 : 4)} {currency}
                  </span>
                )}
              </div>
            </div>

            {/* Currency selector */}
            <div className="co-field">
              <label className="co-label">货币</label>
              <div className="co-currency-grid">
                {CURRENCIES.map((c) => (
                  <button key={c} className={`co-currency-btn ${currency === c ? 'active' : ''}`}
                    onClick={() => handleCurrencyChange(c)}>
                    {CURRENCY_SYMBOL[c]} {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment method */}
            <div className="co-field">
              <label className="co-label">支付方式</label>
              <div className="co-methods">
                {[
                  { key: 'card', icon: '💳', label: '信用/借记卡' },
                  { key: 'link', icon: '⚡', label: 'Link' },
                  { key: 'alipay', icon: '🔵', label: '支付宝' },
                  { key: 'wechat', icon: '🟢', label: '微信支付' },
                ].map((m) => (
                  <button key={m.key}
                    className={`co-method-btn ${paymentMethod === m.key ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(m.key as PaymentMethod)}>
                    <span className="co-method-icon">{m.icon}</span>
                    <span className="co-method-label">{m.label}</span>
                  </button>
                ))}
              </div>
              <p className="co-stripe-note">
                通过 Stripe 支持：Visa · Mastercard · Amex · Apple Pay · Google Pay · PayPal
              </p>
            </div>

            {/* Card form (shown for card / link) */}
            {(paymentMethod === 'card' || paymentMethod === 'link') && (
              <div className="co-card-form">
                <div className="co-field">
                  <label className="co-label">持卡人姓名</label>
                  <input className="co-input" value={cardName} placeholder="Name on card"
                    onChange={(e) => setCardName(e.target.value)} />
                </div>
                <div className="co-field">
                  <label className="co-label">卡号</label>
                  <input className="co-input co-card-num" value={cardNum}
                    placeholder={isMockMode ? '4242 4242 4242 4242（测试卡）' : '1234 5678 9012 3456'}
                    onChange={(e) => setCardNum(formatCardNum(e.target.value))} />
                </div>
                <div className="co-field-row">
                  <div className="co-field half">
                    <label className="co-label">到期日</label>
                    <input className="co-input" value={cardExpiry} placeholder="MM/YY"
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} />
                  </div>
                  <div className="co-field half">
                    <label className="co-label">CVV</label>
                    <input className="co-input" value={cardCvc} placeholder="123" maxLength={4}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} />
                  </div>
                </div>
                {isMockMode && (
                  <button className="co-autofill" onClick={() => {
                    setCardNum('4242 4242 4242 4242');
                    setCardExpiry('12/28');
                    setCardCvc('123');
                    setCardName('Test User');
                  }}>
                    自动填入 Stripe 测试卡号
                  </button>
                )}
              </div>
            )}

            {(paymentMethod === 'alipay' || paymentMethod === 'wechat') && (
              <div className="co-qr-placeholder">
                <div className="co-qr-box">
                  <span className="co-qr-icon">{paymentMethod === 'alipay' ? '🔵' : '🟢'}</span>
                  <p className="co-qr-text">
                    {paymentMethod === 'alipay' ? '支付宝' : '微信支付'} 二维码
                  </p>
                  <p className="co-qr-hint">
                    {isMockMode ? '（模拟模式：点击「确认支付」直接完成）' : '请使用手机扫描付款'}
                  </p>
                </div>
              </div>
            )}

            {errorMsg && <p className="co-error">{errorMsg}</p>}

            <button className="co-pay-btn" disabled={processing} onClick={handlePay}>
              {processing ? (
                <span className="co-pay-loading">
                  <span className="co-spinner" />
                  处理中…
                </span>
              ) : (
                `确认支付${price !== null ? ` ${formatPrice(price, currency)}` : ''}`
              )}
            </button>

            <div className="co-security-row">
              <span>🔒 SSL 加密</span>
              <span>·</span>
              <span>由 Stripe 提供安全保障</span>
              <span>·</span>
              <span>随时可取消</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
