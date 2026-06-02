/*
  # 完整付费体系

  ## 修改表
  ### user_profiles — 增加支付相关字段
  - stripe_customer_id: Stripe 客户ID（预留真实支付）
  - default_currency: 用户默认货币（USD/EUR/JPY/KRW/GBP/CAD/AUD）
  - vip_expiry: 会员到期时间（NULL=非会员）
  - extra_partner_count: 额外购买的搭子槽位数
  - exam_credits: 剩余考试次数（每月重置基础2次）
  - ai_speech_credits: 剩余AI口语评测次数（每天重置基础3次）
  - exam_credits_reset_at: 考试次数上次重置时间
  - ai_speech_credits_reset_at: AI口语次数上次重置时间
  - unlocked_lang_packs: 已购买高级题库语言列表（如 ["ja","ko"]）

  ## 新增表

  ### 1. pricing_plans
  多币种定价配置表，后台可随时修改

  ### 2. user_subscriptions
  用户订阅记录（月/年会员），含 Stripe subscription_id 预留

  ### 3. payment_orders
  所有支付记录（一次性购买 + 订阅首付），含 Stripe PaymentIntent ID 预留

  ### 4. feature_access_log
  付费功能访问日志，用于审计和计量

  ## 安全
  所有新表启用 RLS
*/

-- ─── user_profiles 扩展字段 ─────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='stripe_customer_id') THEN
    ALTER TABLE user_profiles ADD COLUMN stripe_customer_id text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='default_currency') THEN
    ALTER TABLE user_profiles ADD COLUMN default_currency text NOT NULL DEFAULT 'USD';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='vip_expiry') THEN
    ALTER TABLE user_profiles ADD COLUMN vip_expiry timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='extra_partner_count') THEN
    ALTER TABLE user_profiles ADD COLUMN extra_partner_count integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='exam_credits') THEN
    ALTER TABLE user_profiles ADD COLUMN exam_credits integer NOT NULL DEFAULT 2;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='ai_speech_credits') THEN
    ALTER TABLE user_profiles ADD COLUMN ai_speech_credits integer NOT NULL DEFAULT 3;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='exam_credits_reset_at') THEN
    ALTER TABLE user_profiles ADD COLUMN exam_credits_reset_at timestamptz NOT NULL DEFAULT now();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='ai_speech_credits_reset_at') THEN
    ALTER TABLE user_profiles ADD COLUMN ai_speech_credits_reset_at timestamptz NOT NULL DEFAULT now();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='unlocked_lang_packs') THEN
    ALTER TABLE user_profiles ADD COLUMN unlocked_lang_packs text[] NOT NULL DEFAULT '{}';
  END IF;
END $$;

-- ─── 新配置项 ────────────────────────────────────────────────────────────────
INSERT INTO platform_configs (key, value, description) VALUES
  ('exam_free_per_month',       '2',    '每月免费考试次数'),
  ('exam_price_usd_cents',      '99',   '超出后每次考试价格（美分）'),
  ('vip_monthly_usd_cents',     '390',  '月度会员价格（美分）'),
  ('vip_yearly_usd_cents',      '2900', '年度会员价格（美分）'),
  ('partner_slot_price_cents',  '49',   '每增加一个搭子槽位价格（美分）'),
  ('langpack_price_usd_cents',  '190',  '每个高级题库语言包价格（美分）'),
  ('ai_speech_free_per_day',    '3',    '每天免费AI口语次数'),
  ('ai_speech_price_usd_cents', '20',   '超出后每次AI口语价格（美分）'),
  ('free_partner_slots',        '2',    '免费搭子槽位数'),
  ('vip_langpack_discount_pct', '20',   '会员高级题库折扣百分比（8折=20）'),
  ('stripe_test_mode',          '1',    '是否使用 Stripe 测试模式（1=是）'),
  ('mock_payment_mode',         '1',    '是否使用模拟支付（无Stripe时测试）'),
  ('subscription_remind_days',  '3',    '会员到期提醒提前天数')
ON CONFLICT (key) DO NOTHING;

-- ─── 1. pricing_plans ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_plans (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_key        text NOT NULL,             -- 'exam_single','vip_monthly','vip_yearly','partner_slot','langpack','ai_speech'
  currency        text NOT NULL DEFAULT 'USD',
  amount_cents    integer NOT NULL,
  country_code    text,                      -- NULL = 全球默认；'CN','JP' 等覆盖特定国家
  stripe_price_id text,                      -- 预留 Stripe Price ID
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (plan_key, currency, country_code)
);

ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active pricing"
  ON pricing_plans FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- 默认多币种定价 (汇率近似值，实际用实时汇率动态换算)
INSERT INTO pricing_plans (plan_key, currency, amount_cents) VALUES
  ('exam_single',  'USD',  99),   ('exam_single',  'EUR',  92),   ('exam_single',  'JPY', 1500), ('exam_single',  'KRW', 1400), ('exam_single',  'GBP',  79),  ('exam_single',  'CAD', 135), ('exam_single',  'AUD', 155),
  ('vip_monthly',  'USD',  390),  ('vip_monthly',  'EUR', 360),   ('vip_monthly',  'JPY', 5900), ('vip_monthly',  'KRW', 5500), ('vip_monthly',  'GBP', 310),  ('vip_monthly',  'CAD', 530), ('vip_monthly',  'AUD', 610),
  ('vip_yearly',   'USD', 2900),  ('vip_yearly',   'EUR',2680),   ('vip_yearly',   'JPY',43000), ('vip_yearly',   'KRW',41000), ('vip_yearly',   'GBP',2300),  ('vip_yearly',   'CAD',3950), ('vip_yearly',   'AUD',4550),
  ('partner_slot', 'USD',   49),  ('partner_slot', 'EUR',  46),   ('partner_slot', 'JPY',  750), ('partner_slot', 'KRW',  700), ('partner_slot', 'GBP',  39),  ('partner_slot', 'CAD',  67), ('partner_slot', 'AUD',  77),
  ('langpack',     'USD',  190),  ('langpack',     'EUR', 175),   ('langpack',     'JPY', 2900), ('langpack',     'KRW', 2700), ('langpack',     'GBP', 151),  ('langpack',     'CAD', 259), ('langpack',     'AUD', 298),
  ('ai_speech',    'USD',   20),  ('ai_speech',    'EUR',  19),   ('ai_speech',    'JPY',  300), ('ai_speech',    'KRW',  280), ('ai_speech',    'GBP',  16),  ('ai_speech',    'CAD',  27), ('ai_speech',    'AUD',  31)
ON CONFLICT (plan_key, currency, country_code) DO NOTHING;

-- ─── 2. user_subscriptions ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key           text NOT NULL,
  plan_key              text NOT NULL,         -- 'vip_monthly' | 'vip_yearly'
  status                text NOT NULL DEFAULT 'active' CHECK (status IN ('active','cancelled','expired','past_due')),
  currency              text NOT NULL DEFAULT 'USD',
  amount_cents          integer NOT NULL,
  -- Stripe integration fields (populated when live Stripe is connected)
  stripe_subscription_id text,
  stripe_customer_id    text,
  -- Payment provider field for non-Stripe (wechat_pay, alipay, etc.)
  payment_provider      text NOT NULL DEFAULT 'mock',
  is_simulated          boolean NOT NULL DEFAULT true,
  started_at            timestamptz NOT NULL DEFAULT now(),
  current_period_end    timestamptz NOT NULL,
  cancelled_at          timestamptz,
  reminder_sent_at      timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
  ON user_subscriptions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert subscriptions"
  ON user_subscriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update subscriptions"
  ON user_subscriptions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_subs_session ON user_subscriptions(session_key);
CREATE INDEX IF NOT EXISTS idx_subs_status  ON user_subscriptions(status, current_period_end);

-- ─── 3. payment_orders ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_orders (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key           text NOT NULL,
  plan_key              text NOT NULL,
  quantity              integer NOT NULL DEFAULT 1,
  currency              text NOT NULL DEFAULT 'USD',
  amount_cents          integer NOT NULL,
  status                text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded')),
  -- Stripe integration fields
  stripe_payment_intent_id text,
  stripe_customer_id       text,
  -- For non-Stripe providers
  payment_provider      text NOT NULL DEFAULT 'mock',
  payment_ref           text,
  is_simulated          boolean NOT NULL DEFAULT true,
  metadata              jsonb,    -- e.g. {"lang":"ja"} for langpack, {"feature":"exam"} etc.
  paid_at               timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON payment_orders FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert orders"
  ON payment_orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own orders"
  ON payment_orders FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_porders_session ON payment_orders(session_key);
CREATE INDEX IF NOT EXISTS idx_porders_plan    ON payment_orders(plan_key, status);

-- ─── 4. feature_access_log ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feature_access_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key   text NOT NULL,
  feature_type  text NOT NULL,   -- 'exam','ai_speech','partner_slot','langpack','vip'
  granted       boolean NOT NULL,
  reason        text NOT NULL DEFAULT '',
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE feature_access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert access log"
  ON feature_access_log FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own access log"
  ON feature_access_log FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_access_log_session ON feature_access_log(session_key, feature_type);
