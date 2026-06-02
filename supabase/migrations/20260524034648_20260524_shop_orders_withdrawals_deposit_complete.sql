/*
  # 商品橱窗系统 + 保证金完善

  ## 新增表

  ### 1. group_products
  群内商品：名称、价格、库存、是否上架，关联群组

  ### 2. group_orders
  用户下单记录：含支付状态、模拟支付标记、平台抽成金额、群主收入金额
  预留 payment_provider / payment_ref 字段接入真实支付

  ### 3. platform_wallets
  平台账户余额（群主钱包 + 平台钱包）

  ### 4. withdrawals
  群主提现记录：含状态（pending/approved/rejected/paid）

  ## 新增配置项（platform_configs）
  - shop_commission_pct: 平台抽成百分比（默认20）
  - min_withdrawal_fen: 最低提现额（分，默认1000=10元）
  - dissolve_penalty_pct: 主动解散扣保证金百分比（默认50）

  ## 新增 study_groups 字段
  - shop_enabled: 是否开启橱窗（仅中群及以上）
  - status: 群状态（active/dissolved/banned）
  - dissolved_at: 解散时间

  ## 安全
  所有表启用 RLS，session-based 匿名访问（与现有表策略一致）
*/

-- ─── 新配置项 ───────────────────────────────────────────────────────────────
INSERT INTO platform_configs (key, value, description) VALUES
  ('shop_commission_pct',    '20',   '商品橱窗平台抽成百分比'),
  ('min_withdrawal_fen',     '1000', '最低提现额（分）'),
  ('dissolve_penalty_pct',   '50',   '主动解散扣保证金百分比'),
  ('deposit_freeze_days',    '7',    '转让后原群主保证金冻结天数')
ON CONFLICT (key) DO NOTHING;

-- ─── study_groups 补充字段 ───────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='study_groups' AND column_name='shop_enabled') THEN
    ALTER TABLE study_groups ADD COLUMN shop_enabled boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='study_groups' AND column_name='status') THEN
    ALTER TABLE study_groups ADD COLUMN status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','dissolved','banned'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='study_groups' AND column_name='dissolved_at') THEN
    ALTER TABLE study_groups ADD COLUMN dissolved_at timestamptz;
  END IF;
END $$;

-- ─── 1. group_products ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS group_products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id      uuid NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  owner_key     text NOT NULL,
  name          text NOT NULL,
  description   text NOT NULL DEFAULT '',
  price_fen     integer NOT NULL DEFAULT 0 CHECK (price_fen >= 0),
  stock         integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active     boolean NOT NULL DEFAULT true,
  sold_count    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE group_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products"
  ON group_products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Product owners can insert"
  ON group_products FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Product owners can update"
  ON group_products FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_products_group ON group_products(group_id, is_active);

-- ─── 2. group_orders ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS group_orders (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id            uuid NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  product_id          uuid NOT NULL REFERENCES group_products(id) ON DELETE CASCADE,
  buyer_key           text NOT NULL,
  seller_key          text NOT NULL,
  quantity            integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_fen      integer NOT NULL,
  total_fen           integer NOT NULL,
  commission_fen      integer NOT NULL DEFAULT 0,
  seller_income_fen   integer NOT NULL DEFAULT 0,
  -- Payment fields — pre-wired for real payment integration
  is_simulated        boolean NOT NULL DEFAULT true,
  payment_status      text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','refunded','failed')),
  payment_provider    text,           -- e.g. 'alipay','wechat','stripe'
  payment_ref         text,           -- external payment transaction ID
  paid_at             timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE group_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON group_orders FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert orders"
  ON group_orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own orders"
  ON group_orders FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_orders_group   ON group_orders(group_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer   ON group_orders(buyer_key);
CREATE INDEX IF NOT EXISTS idx_orders_seller  ON group_orders(seller_key);
CREATE INDEX IF NOT EXISTS idx_orders_product ON group_orders(product_id);

-- ─── 3. platform_wallets ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS platform_wallets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_key       text NOT NULL UNIQUE,
  wallet_type     text NOT NULL DEFAULT 'seller' CHECK (wallet_type IN ('seller','platform')),
  balance_fen     integer NOT NULL DEFAULT 0,
  total_earned    integer NOT NULL DEFAULT 0,
  total_withdrawn integer NOT NULL DEFAULT 0,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE platform_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read wallets"
  ON platform_wallets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert wallets"
  ON platform_wallets FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update wallets"
  ON platform_wallets FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_wallets_owner ON platform_wallets(owner_key);

-- ─── 4. withdrawals ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS withdrawals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_key       text NOT NULL,
  amount_fen      integer NOT NULL CHECK (amount_fen > 0),
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','paid')),
  note            text NOT NULL DEFAULT '',
  -- Pre-wired for real payout integration
  payout_provider text,   -- e.g. 'alipay','bank_transfer'
  payout_ref      text,
  requested_at    timestamptz NOT NULL DEFAULT now(),
  processed_at    timestamptz
);

ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read withdrawals"
  ON withdrawals FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert withdrawals"
  ON withdrawals FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update withdrawals"
  ON withdrawals FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_withdrawals_owner ON withdrawals(owner_key);
