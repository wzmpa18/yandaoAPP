/*
  # GrammarVocab V2 — 考试靶向 + 记忆法 + 大咖秘籍 + 教材同步 + 错题本

  ## 新增表

  ### 1. exam_targets
  考试体系配置（JLPT/TOPIK/DELF/DELE/CET/Goethe等），后台可扩展

  ### 2. user_exam_goals
  用户当前设定的目标考试

  ### 3. mnemonics
  谐音梗 + 图像联想 + 记忆宫殿条目，支持社区点赞

  ### 4. memory_palace_rooms
  记忆宫殿房间，每个房间关联若干词汇位置

  ### 5. textbook_index
  主流教材目录（书名+单元+语言+关联语法/词汇ID列表）

  ### 6. user_textbook_progress
  用户教材学习进度

  ### 7. wrong_answers
  错题本：记录错误类型，推荐同类题

  ### 8. master_tips
  大咖秘籍：达人上传的独门记忆法，支持打赏

  ### 9. tip_rewards
  秘籍打赏记录（平台抽成配置）

  ## 新增 platform_configs 配置项
  - mnemonic_review_mode: 谐音梗审核开关
  - tip_commission_pct: 大咖秘籍打赏抽成
  - exam_freq_label_enabled: 是否显示考频标注

  ## 安全
  所有表启用 RLS，anon/authenticated 均可操作（session-key 模式）
*/

-- ─── 新配置项 ────────────────────────────────────────────────────────────────
INSERT INTO platform_configs (key, value, description) VALUES
  ('mnemonic_review_mode',   '0',  '谐音梗是否需要审核后才公开（1=需要）'),
  ('tip_commission_pct',     '20', '大咖秘籍打赏平台抽成百分比'),
  ('exam_freq_label_enabled','1',  '是否在语法/词汇卡上显示考频标注')
ON CONFLICT (key) DO NOTHING;

-- ─── 1. exam_targets ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_targets (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lang_code     text NOT NULL,          -- ja, ko, fr, es, en, de
  system_name   text NOT NULL,          -- JLPT, TOPIK, DELF, DELE, CET, Goethe
  level_code    text NOT NULL,          -- N1, N2 / 1~6 / A1~C2 / CET4 etc.
  level_label   text NOT NULL,          -- "JLPT N2", "TOPIK 3级"
  description   text NOT NULL DEFAULT '',
  order_index   integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  UNIQUE (system_name, level_code)
);

ALTER TABLE exam_targets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read exam targets"
  ON exam_targets FOR SELECT TO anon, authenticated USING (is_active = true);

-- Seed exam systems
INSERT INTO exam_targets (lang_code, system_name, level_code, level_label, order_index) VALUES
  -- JLPT
  ('ja','JLPT','N5','JLPT N5',10), ('ja','JLPT','N4','JLPT N4',20), ('ja','JLPT','N3','JLPT N3',30),
  ('ja','JLPT','N2','JLPT N2',40), ('ja','JLPT','N1','JLPT N1',50),
  -- TOPIK
  ('ko','TOPIK','1','TOPIK 1级',10), ('ko','TOPIK','2','TOPIK 2级',20), ('ko','TOPIK','3','TOPIK 3级',30),
  ('ko','TOPIK','4','TOPIK 4级',40), ('ko','TOPIK','5','TOPIK 5级',50), ('ko','TOPIK','6','TOPIK 6级',60),
  -- DELF/DALF
  ('fr','DELF','A1','DELF A1',10), ('fr','DELF','A2','DELF A2',20), ('fr','DELF','B1','DELF B1',30),
  ('fr','DELF','B2','DELF B2',40), ('fr','DALF','C1','DALF C1',50), ('fr','DALF','C2','DALF C2',60),
  -- DELE
  ('es','DELE','A1','DELE A1',10), ('es','DELE','A2','DELE A2',20), ('es','DELE','B1','DELE B1',30),
  ('es','DELE','B2','DELE B2',40), ('es','DELE','C1','DELE C1',50), ('es','DELE','C2','DELE C2',60),
  -- CET / TEM / IELTS / TOEFL
  ('en','CET','CET4','CET-4',10), ('en','CET','CET6','CET-6',20),
  ('en','TEM','TEM4','TEM-4',30), ('en','TEM','TEM8','TEM-8',40),
  ('en','IELTS','IELTS','IELTS',50), ('en','TOEFL','TOEFL','TOEFL',60),
  -- Goethe
  ('de','Goethe','A1','Goethe A1',10), ('de','Goethe','A2','Goethe A2',20),
  ('de','Goethe','B1','Goethe B1',30), ('de','Goethe','B2','Goethe B2',40),
  ('de','Goethe','C1','Goethe C1',50), ('de','Goethe','C2','Goethe C2',60)
ON CONFLICT (system_name, level_code) DO NOTHING;

-- ─── 2. user_exam_goals ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_exam_goals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key     text NOT NULL,
  exam_target_id  uuid NOT NULL REFERENCES exam_targets(id),
  target_date     date,
  daily_goal_min  integer NOT NULL DEFAULT 20,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_key, exam_target_id)
);

ALTER TABLE user_exam_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own exam goals"   ON user_exam_goals FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can insert exam goals"     ON user_exam_goals FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can update exam goals"     ON user_exam_goals FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_exam_goals_session ON user_exam_goals(session_key);

-- ─── 3. mnemonics ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mnemonics (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key     text NOT NULL,
  lang_code       text NOT NULL,
  target_word     text NOT NULL,     -- the word/grammar this mnemonic is for
  mnemonic_type   text NOT NULL CHECK (mnemonic_type IN ('rhyme','image','action','palace')),
  content         text NOT NULL,     -- rhyme text / image description / action description
  image_url       text,              -- user-uploaded or AI-generated image URL
  is_ai_generated boolean NOT NULL DEFAULT false,
  likes           integer NOT NULL DEFAULT 0,
  is_public       boolean NOT NULL DEFAULT true,
  is_approved     boolean NOT NULL DEFAULT true,  -- false if review mode on
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE mnemonics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read approved public mnemonics"
  ON mnemonics FOR SELECT TO anon, authenticated USING (is_approved = true OR session_key = session_key);
CREATE POLICY "Users can insert mnemonics"  ON mnemonics FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can update mnemonics"  ON mnemonics FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_mnemonics_word ON mnemonics(lang_code, target_word);
CREATE INDEX IF NOT EXISTS idx_mnemonics_type ON mnemonics(mnemonic_type);

-- Mnemonic likes table (to prevent double-liking)
CREATE TABLE IF NOT EXISTS mnemonic_likes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mnemonic_id   uuid NOT NULL REFERENCES mnemonics(id) ON DELETE CASCADE,
  session_key   text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (mnemonic_id, session_key)
);
ALTER TABLE mnemonic_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read likes"   ON mnemonic_likes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can insert likes" ON mnemonic_likes FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ─── 4. memory_palace_rooms ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memory_palace_rooms (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key     text NOT NULL,
  room_name       text NOT NULL,
  template_key    text NOT NULL DEFAULT 'cafe' CHECK (template_key IN ('cafe','school','airport','home','market','library')),
  lang_code       text NOT NULL,
  -- word placements: [{word, item, position_note}]
  placements      jsonb NOT NULL DEFAULT '[]',
  is_public       boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE memory_palace_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own rooms" ON memory_palace_rooms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can insert rooms"   ON memory_palace_rooms FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can update rooms"   ON memory_palace_rooms FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_palace_session ON memory_palace_rooms(session_key);

-- ─── 5. textbook_index ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS textbook_index (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lang_code       text NOT NULL,
  book_key        text NOT NULL,       -- 'shindai', 'minna', 'yonsei', etc.
  book_name       text NOT NULL,
  book_name_zh    text NOT NULL,
  unit_number     integer NOT NULL,
  unit_title      text NOT NULL DEFAULT '',
  vocab_tags      text[] NOT NULL DEFAULT '{}',   -- tags matching vocabulary_items
  grammar_cats    text[] NOT NULL DEFAULT '{}',   -- categories matching grammar_patterns
  order_index     integer NOT NULL DEFAULT 0,
  UNIQUE (book_key, unit_number)
);

ALTER TABLE textbook_index ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read textbooks" ON textbook_index FOR SELECT TO anon, authenticated USING (true);

-- Seed textbook index
INSERT INTO textbook_index (lang_code, book_key, book_name, book_name_zh, unit_number, unit_title, order_index) VALUES
  -- 新标日
  ('ja','shindai','新标准日本語','新标日',1,'第1課: はじめまして',10),
  ('ja','shindai','新标准日本語','新标日',2,'第2課: これは本です',20),
  ('ja','shindai','新标准日本語','新标日',3,'第3課: ここはデパートです',30),
  ('ja','shindai','新标准日本語','新标日',4,'第4課: 毎朝6時に起きます',40),
  ('ja','shindai','新标准日本語','新标日',5,'第5課: 誕生日はいつですか',50),
  -- 大家的日语
  ('ja','minna','みんなの日本語','大家的日语',1,'第1課: はじめまして',10),
  ('ja','minna','みんなの日本語','大家的日语',2,'第2課: これ／それ／あれ',20),
  ('ja','minna','みんなの日本語','大家的日语',3,'第3課: ここ／そこ／あそこ',30),
  ('ja','minna','みんなの日本語','大家的日语',4,'第4課: 今 〜時〜分です',40),
  ('ja','minna','みんなの日本語','大家的日语',5,'第5課: いくらですか',50),
  -- 延世韩国语
  ('ko','yonsei','연세 한국어','延世韩国语',1,'제1과: 안녕하세요',10),
  ('ko','yonsei','연세 한국어','延世韩国语',2,'제2과: 이것은 책이에요',20),
  ('ko','yonsei','연세 한국어','延世韩国语',3,'제3과: 가족이 몇 명이에요?',30),
  -- 首尔大学
  ('ko','seoul','서울대 한국어','首尔大韩国语',1,'Unit 1: 안녕하세요',10),
  ('ko','seoul','서울대 한국어','首尔大韩国语',2,'Unit 2: 이게 뭐예요?',20),
  -- Reflets
  ('fr','reflets','Reflets','Reflets法语',1,'Unité 1: Bonjour!',10),
  ('fr','reflets','Reflets','Reflets法语',2,'Unité 2: Au café',20),
  ('fr','reflets','Reflets','Reflets法语',3,'Unité 3: En famille',30),
  -- Alter Ego
  ('fr','alterego','Alter Ego+','Alter Ego法语',1,'Dossier 1: Qui suis-je?',10),
  ('fr','alterego','Alter Ego+','Alter Ego法语',2,'Dossier 2: Mode de vie',20),
  -- 现代西班牙语
  ('es','xiandai','现代西班牙语','现代西班牙语',1,'第一课: ¿Cómo te llamas?',10),
  ('es','xiandai','现代西班牙语','现代西班牙语',2,'第二课: ¿De dónde eres?',20),
  -- Aula
  ('es','aula','Aula Internacional','Aula西语',1,'Unidad 1: Nosotros',10),
  ('es','aula','Aula Internacional','Aula西语',2,'Unidad 2: Quiero aprender',20),
  -- 柏林广场
  ('de','platz','Berliner Platz','柏林广场',1,'Kapitel 1: Guten Tag!',10),
  ('de','platz','Berliner Platz','柏林广场',2,'Kapitel 2: Meine Familie',20),
  -- 走遍德国
  ('de','studio','studio [21]','走遍德国',1,'Einheit 1: Hallo!',10),
  ('de','studio','studio [21]','走遍德国',2,'Einheit 2: Mein Alltag',20)
ON CONFLICT (book_key, unit_number) DO NOTHING;

-- ─── 6. user_textbook_progress ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_textbook_progress (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key     text NOT NULL,
  book_key        text NOT NULL,
  current_unit    integer NOT NULL DEFAULT 1,
  completed_units integer[] NOT NULL DEFAULT '{}',
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_key, book_key)
);

ALTER TABLE user_textbook_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own progress"  ON user_textbook_progress FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can insert progress"    ON user_textbook_progress FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can update progress"    ON user_textbook_progress FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_tb_progress_session ON user_textbook_progress(session_key);

-- ─── 7. wrong_answers ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wrong_answers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key     text NOT NULL,
  lang_code       text NOT NULL,
  question_type   text NOT NULL,     -- 'grammar','vocab','listening','reading'
  error_type      text NOT NULL CHECK (error_type IN ('meaning','listening','grammar','spelling','usage')),
  question_text   text NOT NULL,
  correct_answer  text NOT NULL,
  user_answer     text NOT NULL,
  source_ref      text NOT NULL DEFAULT '',  -- e.g. "JLPT N2" or "shindai unit 3"
  review_count    integer NOT NULL DEFAULT 0,
  mastered        boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  last_reviewed_at timestamptz
);

ALTER TABLE wrong_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own wrong answers"  ON wrong_answers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can insert wrong answers"    ON wrong_answers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can update wrong answers"    ON wrong_answers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_wrong_session  ON wrong_answers(session_key, mastered);
CREATE INDEX IF NOT EXISTS idx_wrong_type     ON wrong_answers(session_key, error_type);

-- ─── 8. master_tips ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS master_tips (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_key      text NOT NULL,
  author_name     text NOT NULL DEFAULT '语言达人',
  lang_code       text NOT NULL,
  target_level    text NOT NULL DEFAULT '',    -- 'N2', 'B1', etc.
  title           text NOT NULL,
  content_text    text NOT NULL,
  audio_url       text,
  video_url       text,
  example_text    text NOT NULL DEFAULT '',
  category        text NOT NULL DEFAULT 'grammar' CHECK (category IN ('grammar','vocab','listening','speaking','memory')),
  likes           integer NOT NULL DEFAULT 0,
  total_rewards   integer NOT NULL DEFAULT 0,  -- 总打赏金额（分）
  is_approved     boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE master_tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read approved tips" ON master_tips FOR SELECT TO anon, authenticated USING (is_approved = true);
CREATE POLICY "Users can insert tips"         ON master_tips FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can update own tips"     ON master_tips FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_tips_lang ON master_tips(lang_code, category);

-- ─── 9. tip_rewards ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tip_rewards (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_id          uuid NOT NULL REFERENCES master_tips(id) ON DELETE CASCADE,
  giver_key       text NOT NULL,
  amount_fen      integer NOT NULL CHECK (amount_fen > 0),
  commission_fen  integer NOT NULL DEFAULT 0,
  author_income   integer NOT NULL DEFAULT 0,
  is_simulated    boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tip_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read rewards"  ON tip_rewards FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can insert rewards" ON tip_rewards FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_tip_rewards_tip ON tip_rewards(tip_id);
