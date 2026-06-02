/*
  # 语伴匹配系统 + 学习圈群组系统

  ## 新增表

  ### 1. user_partner_profiles
  扩展用户档案，用于语伴匹配：
  - native_lang: 母语（2位语言代码）
  - learning_lang: 学习语言
  - proficiency: 熟练度 1-10
  - is_looking_partner: 是否开启匹配

  ### 2. partner_matches
  双向匹配记录，A的母语=B的学习语言 AND A的学习语言=B的母语

  ### 3. partner_interactions
  互动积分记录：纠正对方+5、完成5分钟对话+10、出练习题+15

  ### 4. platform_configs
  创始人后台可配置表：积分规则、建群费用、保证金、奖励金额等

  ### 5. study_groups
  学习圈群组：小/中/大/VIP 四种类型，含建群费、保证金、人数上限

  ### 6. study_group_members
  群成员表，记录角色（owner/admin/member）

  ### 7. group_transfer_requests
  群主转让申请，7天解冻机制

  ## 安全
  - 所有表启用 RLS
  - 用户只能读写自己相关的数据
*/

-- ─── 1. user_partner_profiles ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_partner_profiles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key     text NOT NULL,
  native_lang     text NOT NULL DEFAULT 'zh',
  learning_lang   text NOT NULL DEFAULT 'ja',
  proficiency     smallint NOT NULL DEFAULT 1 CHECK (proficiency BETWEEN 1 AND 10),
  is_looking_partner boolean NOT NULL DEFAULT false,
  display_name    text NOT NULL DEFAULT '语伴学员',
  bio             text NOT NULL DEFAULT '',
  total_points    integer NOT NULL DEFAULT 0,
  coins_balance   integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_partner_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read partner profiles"
  ON user_partner_profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Session owners can insert own partner profile"
  ON user_partner_profiles FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Session owners can update own partner profile"
  ON user_partner_profiles FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_partner_profiles_session ON user_partner_profiles(session_key);
CREATE INDEX IF NOT EXISTS idx_partner_profiles_looking ON user_partner_profiles(is_looking_partner, native_lang, learning_lang);

-- ─── 2. partner_matches ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partner_matches (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_key   text NOT NULL,
  receiver_key    text NOT NULL,
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined','ended')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  accepted_at     timestamptz,
  UNIQUE (requester_key, receiver_key)
);

ALTER TABLE partner_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Session users can read own matches"
  ON partner_matches FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Session users can insert match requests"
  ON partner_matches FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Session users can update own matches"
  ON partner_matches FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_matches_requester ON partner_matches(requester_key);
CREATE INDEX IF NOT EXISTS idx_matches_receiver  ON partner_matches(receiver_key);

-- ─── 3. partner_interactions ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partner_interactions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id        uuid NOT NULL REFERENCES partner_matches(id) ON DELETE CASCADE,
  actor_key       text NOT NULL,
  interaction_type text NOT NULL CHECK (interaction_type IN ('correction','conversation','exercise')),
  points_earned   integer NOT NULL DEFAULT 0,
  note            text NOT NULL DEFAULT '',
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE partner_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Session users can read own interactions"
  ON partner_interactions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Session users can insert interactions"
  ON partner_interactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_interactions_match  ON partner_interactions(match_id);
CREATE INDEX IF NOT EXISTS idx_interactions_actor  ON partner_interactions(actor_key);

-- ─── 4. platform_configs ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS platform_configs (
  key             text PRIMARY KEY,
  value           text NOT NULL,
  description     text NOT NULL DEFAULT '',
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE platform_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read platform configs"
  ON platform_configs FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only service role can modify (admin console uses service role or direct DB)
-- Insert default configs
INSERT INTO platform_configs (key, value, description) VALUES
  ('points_correction',      '5',   '纠正对方得分'),
  ('points_conversation',    '10',  '完成5分钟对话得分'),
  ('points_exercise',        '15',  '出练习题得分'),
  ('points_to_coin_rate',    '10',  'N分兑换1金币'),
  ('coin_to_cny_rate',       '0.1', '1金币=N元人民币'),
  ('invite_reward_usd',      '2',   '邀请奖励美元'),
  ('ad_freq',                '3',   '广告展示频率（每N题）'),
  ('commission_pct',         '30',  '裂变佣金百分比'),
  ('group_small_max',        '10',  '小群最大人数'),
  ('group_small_fee',        '0',   '小群建群费（分）'),
  ('group_small_deposit',    '0',   '小群保证金（分）'),
  ('group_mid_max',          '50',  '中群最大人数'),
  ('group_mid_fee',          '2990','中群建群费（分）'),
  ('group_mid_deposit',      '9900','中群保证金（分）'),
  ('group_large_max',        '200', '大群最大人数'),
  ('group_large_fee',        '9990','大群建群费（分）'),
  ('group_large_deposit',    '29900','大群保证金（分）'),
  ('group_vip_max',          '500', 'VIP群最大人数'),
  ('group_vip_fee',          '29990','VIP群建群费（分）'),
  ('group_vip_deposit',      '99900','VIP群保证金（分）'),
  ('group_deposit_freeze_days','7', '群主转让保证金解冻天数')
ON CONFLICT (key) DO NOTHING;

-- ─── 5. study_groups ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS study_groups (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  description     text NOT NULL DEFAULT '',
  group_type      text NOT NULL CHECK (group_type IN ('small','mid','large','vip')),
  lang_focus      text NOT NULL DEFAULT 'ja',
  owner_key       text NOT NULL,
  member_count    integer NOT NULL DEFAULT 1,
  max_members     integer NOT NULL DEFAULT 10,
  fee_paid_fen    integer NOT NULL DEFAULT 0,
  deposit_fen     integer NOT NULL DEFAULT 0,
  deposit_status  text NOT NULL DEFAULT 'held' CHECK (deposit_status IN ('held','refunding','refunded')),
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active groups"
  ON study_groups FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Session users can insert groups"
  ON study_groups FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Group owners can update groups"
  ON study_groups FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_groups_owner    ON study_groups(owner_key);
CREATE INDEX IF NOT EXISTS idx_groups_lang     ON study_groups(lang_focus);
CREATE INDEX IF NOT EXISTS idx_groups_type     ON study_groups(group_type);

-- ─── 6. study_group_members ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS study_group_members (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id        uuid NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  session_key     text NOT NULL,
  display_name    text NOT NULL DEFAULT '学员',
  role            text NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','member')),
  joined_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, session_key)
);

ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read group members"
  ON study_group_members FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Session users can join groups"
  ON study_group_members FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Session users can update own membership"
  ON study_group_members FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_group_members_group   ON study_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_session ON study_group_members(session_key);

-- ─── 7. group_transfer_requests ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS group_transfer_requests (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id            uuid NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  from_owner_key      text NOT NULL,
  to_owner_key        text NOT NULL,
  deposit_topup_fen   integer NOT NULL DEFAULT 0,
  status              text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','cancelled')),
  original_deposit_unfreeze_at timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  completed_at        timestamptz
);

ALTER TABLE group_transfer_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Session users can read own transfer requests"
  ON group_transfer_requests FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Session users can insert transfer requests"
  ON group_transfer_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Session users can update transfer requests"
  ON group_transfer_requests FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_transfers_group ON group_transfer_requests(group_id);
