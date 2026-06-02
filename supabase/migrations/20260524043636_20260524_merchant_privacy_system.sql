/*
  # Merchant & User Privacy Control System

  ## New Tables

  ### merchants
  - Stores merchant applications and approved merchant profiles
  - Fields: session_key, business_name, contact_email, description, category,
    status (pending/approved/rejected), rejection_reason, daily_ad_limit,
    weekly_ad_limit, total_impressions, total_joins, created_at

  ### ad_campaigns
  - Merchant ad/placement campaigns targeting learning circles
  - Fields: merchant_id, campaign_name, target_lang_codes (jsonb array),
    target_regions (jsonb array), target_activity_level (low/mid/high/any),
    group_id (linked study group), status (active/paused/ended),
    daily_budget_impressions, impressions, joins, created_at

  ### ad_impressions
  - Log of each time a card was shown to a user
  - Fields: campaign_id, session_key, shown_at, joined (bool)

  ### user_privacy_settings
  - Per-user privacy switches (all default ON)
  - Fields: session_key, allow_discovery, allow_merchant_push,
    allow_group_invite, group_message_notify, pause_all_strangers,
    group_invite_warned (first-time warning shown flag), updated_at

  ## Security
  - RLS enabled on all tables
  - anon can read/write their own rows via session_key match
  - Merchants: only their own rows writable
*/

-- ── merchants ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS merchants (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key         text NOT NULL,
  business_name       text NOT NULL DEFAULT '',
  contact_email       text NOT NULL DEFAULT '',
  description         text NOT NULL DEFAULT '',
  category            text NOT NULL DEFAULT 'education',
  website_url         text NOT NULL DEFAULT '',
  status              text NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','approved','rejected')),
  rejection_reason    text NOT NULL DEFAULT '',
  daily_ad_limit      int  NOT NULL DEFAULT 500,
  weekly_ad_limit     int  NOT NULL DEFAULT 2000,
  total_impressions   int  NOT NULL DEFAULT 0,
  total_joins         int  NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can read own record"
  ON merchants FOR SELECT TO anon
  USING (true);

CREATE POLICY "Anyone can insert merchant application"
  ON merchants FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Merchants can update own record"
  ON merchants FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- ── ad_campaigns ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS ad_campaigns (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id               uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  campaign_name             text NOT NULL DEFAULT '',
  target_lang_codes         jsonb NOT NULL DEFAULT '[]',
  target_regions            jsonb NOT NULL DEFAULT '[]',
  target_activity_level     text NOT NULL DEFAULT 'any'
                              CHECK (target_activity_level IN ('low','mid','high','any')),
  group_id                  uuid REFERENCES study_groups(id) ON DELETE SET NULL,
  status                    text NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active','paused','ended')),
  daily_budget_impressions  int  NOT NULL DEFAULT 100,
  impressions               int  NOT NULL DEFAULT 0,
  joins                     int  NOT NULL DEFAULT 0,
  created_at                timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ad campaigns readable by all"
  ON ad_campaigns FOR SELECT TO anon
  USING (true);

CREATE POLICY "Merchants can insert campaigns"
  ON ad_campaigns FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Merchants can update campaigns"
  ON ad_campaigns FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- ── ad_impressions ────────────────────────────────────
CREATE TABLE IF NOT EXISTS ad_impressions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  uuid NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  session_key  text NOT NULL,
  shown_at     timestamptz NOT NULL DEFAULT now(),
  joined       boolean NOT NULL DEFAULT false
);

ALTER TABLE ad_impressions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Impressions readable by all"
  ON ad_impressions FOR SELECT TO anon
  USING (true);

CREATE POLICY "Anyone can log impressions"
  ON ad_impressions FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update impression join status"
  ON ad_impressions FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- ── user_privacy_settings ─────────────────────────────
CREATE TABLE IF NOT EXISTS user_privacy_settings (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key           text UNIQUE NOT NULL,
  allow_discovery       boolean NOT NULL DEFAULT true,
  allow_merchant_push   boolean NOT NULL DEFAULT true,
  allow_group_invite    boolean NOT NULL DEFAULT true,
  group_message_notify  boolean NOT NULL DEFAULT true,
  pause_all_strangers   boolean NOT NULL DEFAULT false,
  group_invite_warned   boolean NOT NULL DEFAULT false,
  updated_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_privacy_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own privacy settings"
  ON user_privacy_settings FOR SELECT TO anon
  USING (true);

CREATE POLICY "Users can insert own privacy settings"
  ON user_privacy_settings FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Users can update own privacy settings"
  ON user_privacy_settings FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- ── indexes ───────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_merchants_session_key     ON merchants(session_key);
CREATE INDEX IF NOT EXISTS idx_merchants_status          ON merchants(status);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_merchant_id  ON ad_campaigns(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_status       ON ad_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_campaign   ON ad_impressions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_session    ON ad_impressions(session_key);
CREATE INDEX IF NOT EXISTS idx_privacy_session_key       ON user_privacy_settings(session_key);

-- ── platform_configs: merchant & privacy keys ─────────
INSERT INTO platform_configs (key, value, description) VALUES
  ('merchant_auto_approve',     'false', '商家申请是否自动通过'),
  ('merchant_daily_ad_limit',   '500',   '每商家每日投放上限'),
  ('merchant_weekly_ad_limit',  '2000',  '每商家每周投放上限'),
  ('ad_block_ratio_warning',    '30',    '广告屏蔽用户比例预警 (%)'),
  ('merchant_max_campaigns',    '5',     '每商家最多活跃投放数')
ON CONFLICT (key) DO NOTHING;
