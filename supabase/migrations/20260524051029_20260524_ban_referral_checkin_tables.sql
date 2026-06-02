/*
  # Ban Group / Referral Freeze / Daily Checkin Tables + Exam Seeds

  Creates: user_learning_daily, referral_earnings, user_phone_verifications
  Alters: study_groups (ban columns)
  Seeds: exam_targets for 9 languages
  Seeds: platform_configs for ban/referral
*/

-- ── 1. study_groups ban columns ───────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='study_groups' AND column_name='deposit_forfeited') THEN
    ALTER TABLE study_groups ADD COLUMN deposit_forfeited boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='study_groups' AND column_name='banned_at') THEN
    ALTER TABLE study_groups ADD COLUMN banned_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='study_groups' AND column_name='ban_reason') THEN
    ALTER TABLE study_groups ADD COLUMN ban_reason text NOT NULL DEFAULT '';
  END IF;
END $$;

-- ── 2. user_learning_daily ────────────────────────────
CREATE TABLE IF NOT EXISTS user_learning_daily (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key  text NOT NULL,
  checkin_date date NOT NULL DEFAULT CURRENT_DATE,
  lang_code    text NOT NULL DEFAULT '',
  xp_earned    int  NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_key, checkin_date)
);
ALTER TABLE user_learning_daily ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own checkins"   ON user_learning_daily FOR SELECT TO anon USING (true);
CREATE POLICY "Insert own checkins" ON user_learning_daily FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Update own checkins" ON user_learning_daily FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_uld_session_key ON user_learning_daily(session_key);
CREATE INDEX IF NOT EXISTS idx_uld_date        ON user_learning_daily(checkin_date);

-- ── 3. referral_earnings ─────────────────────────────
CREATE TABLE IF NOT EXISTS referral_earnings (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_key         text NOT NULL,
  invitee_key          text NOT NULL,
  amount_cents         int  NOT NULL DEFAULT 200,
  currency             text NOT NULL DEFAULT 'USD',
  is_frozen            boolean NOT NULL DEFAULT true,
  invitee_checkin_days int  NOT NULL DEFAULT 0,
  unfreeze_at          timestamptz,
  paid_out             boolean NOT NULL DEFAULT false,
  created_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referrer_key, invitee_key)
);
ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read referral earnings"   ON referral_earnings FOR SELECT TO anon USING (true);
CREATE POLICY "Insert referral earnings" ON referral_earnings FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Update referral earnings" ON referral_earnings FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_re_referrer ON referral_earnings(referrer_key);
CREATE INDEX IF NOT EXISTS idx_re_invitee  ON referral_earnings(invitee_key);

-- ── 4. user_phone_verifications ──────────────────────
CREATE TABLE IF NOT EXISTS user_phone_verifications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key   text UNIQUE NOT NULL,
  phone_masked  text NOT NULL DEFAULT '',
  verify_code   text NOT NULL DEFAULT '',
  is_verified   boolean NOT NULL DEFAULT false,
  attempts      int  NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  verified_at   timestamptz
);
ALTER TABLE user_phone_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own verification"   ON user_phone_verifications FOR SELECT TO anon USING (true);
CREATE POLICY "Insert own verification" ON user_phone_verifications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Update own verification" ON user_phone_verifications FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_upv_session ON user_phone_verifications(session_key);

-- ── 5. exam_targets: 9 languages ─────────────────────
INSERT INTO exam_targets (lang_code, system_name, level_code, level_label, description, is_active, order_index) VALUES
  ('en','IELTS','Band5','IELTS 5.0','中等英语水平，满足部分海外院校要求',true,10),
  ('en','IELTS','Band6','IELTS 6.0','良好英语水平，主流留学门槛',true,11),
  ('en','IELTS','Band7','IELTS 7.0','优秀英语水平，精英院校要求',true,12),
  ('en','TOEFL','iBT80','TOEFL 80+','基础学术英语，申请门槛分',true,13),
  ('en','TOEFL','iBT100','TOEFL 100+','优秀学术英语，顶校要求',true,14),
  ('ko','TOPIK','TOPIK1','TOPIK I 1级','入门韩语，基础日常表达',true,20),
  ('ko','TOPIK','TOPIK2','TOPIK I 2级','初级韩语，简单读写能力',true,21),
  ('ko','TOPIK','TOPIK3','TOPIK II 3级','中级韩语，日常会话流利',true,22),
  ('ko','TOPIK','TOPIK4','TOPIK II 4级','中高级韩语，多数工作要求',true,23),
  ('ko','TOPIK','TOPIK6','TOPIK II 6级','高级韩语，母语水平',true,24),
  ('fr','DELF','A1','DELF A1','法语入门，能理解简单句',true,30),
  ('fr','DELF','A2','DELF A2','法语基础，能进行简单交流',true,31),
  ('fr','DELF','B1','DELF B1','法语中级，能处理日常情境',true,32),
  ('fr','DELF','B2','DELF B2','法语中高级，大学录取要求',true,33),
  ('fr','DALF','C1','DALF C1','法语高级，精通水平',true,34),
  ('es','DELE','A1','DELE A1','西班牙语入门',true,40),
  ('es','DELE','A2','DELE A2','西班牙语基础',true,41),
  ('es','DELE','B1','DELE B1','西班牙语中级',true,42),
  ('es','DELE','B2','DELE B2','西班牙语中高级',true,43),
  ('es','DELE','C1','DELE C1','西班牙语高级',true,44),
  ('de','Goethe','A1','Goethe A1','德语入门，Fit in Deutsch',true,50),
  ('de','Goethe','A2','Goethe A2','德语基础，Start Deutsch',true,51),
  ('de','Goethe','B1','Goethe B1','德语中级，Zertifikat B1',true,52),
  ('de','Goethe','B2','Goethe B2','德语中高级，TestDaF准备',true,53),
  ('de','Goethe','C1','Goethe C1','德语高级，TestDaF等效',true,54),
  ('it','CILS','A1','CILS A1','意大利语入门',true,60),
  ('it','CILS','A2','CILS A2','意大利语基础',true,61),
  ('it','CILS','B1','CILS B1','意大利语中级',true,62),
  ('it','CILS','B2','CILS B2','意大利语中高级',true,63),
  ('it','CILS','C1','CILS C1','意大利语高级',true,64),
  ('pt','CELPE','Intermediario','中级','葡语中级，日常交流流利',true,70),
  ('pt','CELPE','IntermedioSuperior','中高级','葡语中高级',true,71),
  ('pt','CELPE','Avancado','高级','葡语高级',true,72),
  ('pt','CIPLE','A2','CIPLE A2','葡语基础（欧洲）',true,73),
  ('pt','CIPLE','B1','CIPLE B1','葡语中级（欧洲）',true,74),
  ('ar','ALPT','Beginner','初级阿语','基础问候与日常词汇',true,80),
  ('ar','ALPT','Elementary','初中级阿语','简单读写与对话',true,81),
  ('ar','ALPT','Intermediate','中级阿语','日常会话与新闻理解',true,82),
  ('ar','ALPT','UpperIntermediate','中高级阿语','正式场合与书面表达',true,83),
  ('ar','ALPT','Advanced','高级阿语','文学阅读与演讲能力',true,84),
  ('zh','HSK','HSK4','HSK 4级','汉语中级，掌握1200词',true,90),
  ('zh','HSK','HSK5','HSK 5级','汉语中高级，掌握2500词',true,91),
  ('zh','HSK','HSK6','HSK 6级','汉语高级，接近母语水平',true,92),
  ('zh','HSKK','HSKK_Mid','HSKK 中级口试','汉语口语中级认证',true,93),
  ('zh','HSKK','HSKK_High','HSKK 高级口试','汉语口语高级认证',true,94)
ON CONFLICT DO NOTHING;

-- ── 6. platform_configs ───────────────────────────────
INSERT INTO platform_configs (key, value, description) VALUES
  ('ban_confiscate_pct', '100', '群被封禁时保证金没收比例(%)'),
  ('referral_checkin_days_required', '3', '邀请佣金解冻所需被邀请人打卡天数'),
  ('referral_reward_cents', '200', '每次成功邀请奖励(美分)')
ON CONFLICT (key) DO NOTHING;
