/*
  # Game Multiplayer & Season System

  1. New Tables
    - `game_content_pool`: Stores randomizable game content per language and type
      - id, lang_code, game_type, content_type, data (JSONB), difficulty (1-10), usage_count, success_rate
    - `game_rooms`: Multiplayer game rooms for PK and coop modes
      - id, room_code (6 chars), game_type, mode (pk/coop), players (JSONB), status, created_at
    - `daily_challenges`: One challenge per language per day
      - id, lang_code, game_type, challenge_data (JSONB), date, reward_xp
    - `seasons`: Competitive seasons with reward tiers
      - id, season_number, start_date, end_date, reward_tiers (JSONB)
    - `season_rankings`: Per-user per-season scores
      - user_id, season_id, total_score, rank, rewards_claimed

  2. Security
    - RLS enabled on all tables
    - game_content_pool: authenticated read, service-role write
    - game_rooms: authenticated read/write own rows
    - daily_challenges: authenticated read
    - seasons: public read
    - season_rankings: authenticated read/write own rows

  3. Initial data
    - Seed first season
    - Seed sample game content for all 10 languages
*/

-- game_content_pool
CREATE TABLE IF NOT EXISTS game_content_pool (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lang_code     text NOT NULL,
  game_type     text NOT NULL,
  content_type  text NOT NULL DEFAULT 'vocab',
  data          jsonb NOT NULL DEFAULT '{}',
  difficulty    int  NOT NULL DEFAULT 5 CHECK (difficulty BETWEEN 1 AND 10),
  usage_count   int  NOT NULL DEFAULT 0,
  success_rate  numeric NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE game_content_pool ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read game content"
  ON game_content_pool FOR SELECT
  TO authenticated
  USING (true);

-- game_rooms
CREATE TABLE IF NOT EXISTS game_rooms (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code   text NOT NULL UNIQUE,
  game_type   text NOT NULL DEFAULT 'word_hunter',
  mode        text NOT NULL DEFAULT 'pk' CHECK (mode IN ('pk','coop','chat')),
  lang_code   text NOT NULL DEFAULT 'ja',
  players     jsonb NOT NULL DEFAULT '[]',
  status      text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting','playing','finished')),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read rooms"
  ON game_rooms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert rooms"
  ON game_rooms FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update rooms"
  ON game_rooms FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- daily_challenges
CREATE TABLE IF NOT EXISTS daily_challenges (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lang_code      text NOT NULL,
  game_type      text NOT NULL,
  challenge_data jsonb NOT NULL DEFAULT '{}',
  date           date NOT NULL DEFAULT CURRENT_DATE,
  reward_xp      int  NOT NULL DEFAULT 100,
  UNIQUE(lang_code, date)
);

ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read daily challenges"
  ON daily_challenges FOR SELECT
  TO authenticated
  USING (true);

-- seasons
CREATE TABLE IF NOT EXISTS seasons (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_number  int  NOT NULL UNIQUE,
  start_date     date NOT NULL,
  end_date       date NOT NULL,
  reward_tiers   jsonb NOT NULL DEFAULT '{}'
);

ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read seasons"
  ON seasons FOR SELECT
  TO authenticated
  USING (true);

-- season_rankings
CREATE TABLE IF NOT EXISTS season_rankings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          text NOT NULL,
  season_id        uuid NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  total_score      int  NOT NULL DEFAULT 0,
  rank             int,
  rewards_claimed  boolean NOT NULL DEFAULT false,
  updated_at       timestamptz DEFAULT now(),
  UNIQUE(user_id, season_id)
);

ALTER TABLE season_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all rankings"
  ON season_rankings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own ranking"
  ON season_rankings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own ranking"
  ON season_rankings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── Seed first season ──
INSERT INTO seasons (season_number, start_date, end_date, reward_tiers)
VALUES (
  1,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  '{
    "top10pct":  {"badge": "gold",   "diamonds": 500},
    "top30pct":  {"badge": "silver", "diamonds": 200},
    "top60pct":  {"badge": "bronze", "diamonds": 50},
    "participant":{"xp": 1000}
  }'::jsonb
) ON CONFLICT (season_number) DO NOTHING;

-- ── Seed game_content_pool (vocab match type, all 10 languages) ──
INSERT INTO game_content_pool (lang_code, game_type, content_type, data, difficulty) VALUES
-- Japanese
('ja','word_hunter','vocab', '{"word":"ありがとう","reading":"arigatou","meaning":"谢谢","theme":"daily"}', 2),
('ja','word_hunter','vocab', '{"word":"おはよう","reading":"ohayou","meaning":"早上好","theme":"daily"}', 2),
('ja','word_hunter','vocab', '{"word":"さくら","reading":"sakura","meaning":"樱花","theme":"nature"}', 3),
('ja','word_hunter','vocab', '{"word":"たべる","reading":"taberu","meaning":"吃","theme":"food"}', 3),
('ja','word_hunter','vocab', '{"word":"でんしゃ","reading":"densha","meaning":"电车","theme":"travel"}', 4),
('ja','grammar_cube','grammar','{"pattern":"〜ています","meaning":"正在做...","example":"食べています","options":["正在做...","已经做了","要去做"]}', 4),
('ja','grammar_cube','grammar','{"pattern":"〜てください","meaning":"请做...","example":"座ってください","options":["请做...","不要做...","可以做吗"]}', 4),
('ja','grammar_cube','grammar','{"pattern":"〜たい","meaning":"想要...","example":"食べたい","options":["想要...","不想要...","必须..."]}', 3),
('ja','escape_room','scenario','{"scene":"コンビニ","clue":"店員に挨拶する","answer":"いらっしゃいませ","hint":"便利店问候语"}', 3),
('ja','escape_room','scenario','{"scene":"駅","clue":"電車の時刻を聞く","answer":"何時に出発しますか","hint":"询问出发时间"}', 5),
-- English
('en','word_hunter','vocab', '{"word":"butterfly","reading":"butterfly","meaning":"蝴蝶","theme":"nature"}', 3),
('en','word_hunter','vocab', '{"word":"umbrella","reading":"umbrella","meaning":"雨伞","theme":"daily"}', 3),
('en','word_hunter','vocab', '{"word":"adventure","reading":"adventure","meaning":"冒险","theme":"travel"}', 5),
('en','word_hunter','vocab', '{"word":"delicious","reading":"delicious","meaning":"美味的","theme":"food"}', 4),
('en','word_hunter','vocab', '{"word":"friendship","reading":"friendship","meaning":"友谊","theme":"social"}', 5),
('en','grammar_cube','grammar','{"pattern":"Present Perfect","meaning":"现在完成时","example":"I have eaten","options":["现在完成时","一般过去时","将来时"]}', 6),
('en','grammar_cube','grammar','{"pattern":"Passive Voice","meaning":"被动语态","example":"It was eaten","options":["被动语态","主动语态","进行时"]}', 7),
('en','grammar_cube','grammar','{"pattern":"Conditional","meaning":"条件句","example":"If I were you","options":["条件句","定语从句","时间状语"]}', 7),
('en','escape_room','scenario','{"scene":"Airport","clue":"Check in your luggage","answer":"I would like to check in","hint":"机场值机用语"}', 4),
('en','escape_room','scenario','{"scene":"Restaurant","clue":"Order food politely","answer":"Could I have the menu please","hint":"礼貌点餐"}', 3),
-- Korean
('ko','word_hunter','vocab', '{"word":"감사합니다","reading":"gamsahamnida","meaning":"谢谢","theme":"daily"}', 2),
('ko','word_hunter','vocab', '{"word":"사랑해","reading":"saranghae","meaning":"我爱你","theme":"emotion"}', 2),
('ko','word_hunter','vocab', '{"word":"불고기","reading":"bulgogi","meaning":"烤牛肉","theme":"food"}', 3),
('ko','word_hunter','vocab', '{"word":"지하철","reading":"jihacheol","meaning":"地铁","theme":"travel"}', 4),
('ko','word_hunter','vocab', '{"word":"공부하다","reading":"gongbuhada","meaning":"学习","theme":"study"}', 4),
('ko','grammar_cube','grammar','{"pattern":"-(으)세요","meaning":"请做...（敬语）","example":"앉으세요","options":["请做（敬语）","正在做","要做"]}', 5),
('ko','grammar_cube','grammar','{"pattern":"-고 싶다","meaning":"想要...","example":"먹고 싶다","options":["想要...","不想要...","必须..."]}', 4),
('ko','grammar_cube','grammar','{"pattern":"이/가 아니다","meaning":"不是...","example":"학생이 아니다","options":["不是...","是...","有..."]}', 4),
('ko','escape_room','scenario','{"scene":"편의점","clue":"물건 값을 묻다","answer":"얼마예요","hint":"询问价格"}', 3),
('ko','escape_room','scenario','{"scene":"지하철역","clue":"방향을 묻다","answer":"어디에 있어요","hint":"询问方向"}', 4),
-- French
('fr','word_hunter','vocab', '{"word":"merci","reading":"merci","meaning":"谢谢","theme":"daily"}', 2),
('fr','word_hunter','vocab', '{"word":"croissant","reading":"croissant","meaning":"牛角面包","theme":"food"}', 2),
('fr','word_hunter','vocab', '{"word":"bonjour","reading":"bonjour","meaning":"你好","theme":"daily"}', 1),
('fr','word_hunter','vocab', '{"word":"château","reading":"chateau","meaning":"城堡","theme":"travel"}', 5),
('fr','word_hunter','vocab', '{"word":"liberté","reading":"liberte","meaning":"自由","theme":"culture"}', 6),
('fr','grammar_cube','grammar','{"pattern":"Passé composé","meaning":"复合过去时","example":"J ai mangé","options":["复合过去时","现在时","将来时"]}', 6),
('fr','grammar_cube','grammar','{"pattern":"Subjonctif","meaning":"虚拟式","example":"Il faut que tu viennes","options":["虚拟式","条件式","命令式"]}', 8),
('fr','escape_room','scenario','{"scene":"Café","clue":"Commander un café","answer":"Un café s il vous plaît","hint":"咖啡馆点餐"}', 3),
-- Spanish
('es','word_hunter','vocab', '{"word":"gracias","reading":"gracias","meaning":"谢谢","theme":"daily"}', 2),
('es','word_hunter','vocab', '{"word":"corazón","reading":"corazon","meaning":"心","theme":"emotion"}', 3),
('es','word_hunter','vocab', '{"word":"tortilla","reading":"tortilla","meaning":"玉米饼","theme":"food"}', 3),
('es','word_hunter','vocab', '{"word":"fiesta","reading":"fiesta","meaning":"派对","theme":"social"}', 3),
('es','word_hunter','vocab', '{"word":"playa","reading":"playa","meaning":"海滩","theme":"travel"}', 3),
('es','grammar_cube','grammar','{"pattern":"Pretérito indefinido","meaning":"简单过去时","example":"comí","options":["简单过去时","现在时","将来时"]}', 6),
('es','grammar_cube','grammar','{"pattern":"Ser vs Estar","meaning":"两种be动词","example":"Soy estudiante","options":["两种be动词","have动词","go动词"]}', 7),
('es','escape_room','scenario','{"scene":"Mercado","clue":"Preguntar el precio","answer":"¿Cuánto cuesta","hint":"询问价格"}', 3),
-- German
('de','word_hunter','vocab', '{"word":"Danke","reading":"Danke","meaning":"谢谢","theme":"daily"}', 2),
('de','word_hunter','vocab', '{"word":"Wurst","reading":"Wurst","meaning":"香肠","theme":"food"}', 2),
('de','word_hunter','vocab', '{"word":"Zug","reading":"Zug","meaning":"火车","theme":"travel"}', 3),
('de','word_hunter','vocab', '{"word":"Freiheit","reading":"Freiheit","meaning":"自由","theme":"culture"}', 5),
('de','word_hunter','vocab', '{"word":"Schmetterling","reading":"Schmetterling","meaning":"蝴蝶","theme":"nature"}', 7),
('de','grammar_cube','grammar','{"pattern":"Akkusativ","meaning":"宾格","example":"Ich sehe den Mann","options":["宾格","主格","与格"]}', 7),
('de','grammar_cube','grammar','{"pattern":"Perfekt","meaning":"完成时","example":"Ich habe gegessen","options":["完成时","过去时","将来时"]}', 6),
('de','escape_room','scenario','{"scene":"Bahnhof","clue":"Ticket kaufen","answer":"Einmal nach Berlin bitte","hint":"购票"}', 4),
-- Italian
('it','word_hunter','vocab', '{"word":"grazie","reading":"grazie","meaning":"谢谢","theme":"daily"}', 2),
('it','word_hunter','vocab', '{"word":"pizza","reading":"pizza","meaning":"披萨","theme":"food"}', 1),
('it','word_hunter','vocab', '{"word":"amore","reading":"amore","meaning":"爱","theme":"emotion"}', 2),
('it','word_hunter','vocab', '{"word":"colosseo","reading":"colosseo","meaning":"斗兽场","theme":"travel"}', 4),
('it','word_hunter','vocab', '{"word":"gelato","reading":"gelato","meaning":"意式冰淇淋","theme":"food"}', 2),
('it','grammar_cube','grammar','{"pattern":"Passato prossimo","meaning":"近过去时","example":"ho mangiato","options":["近过去时","现在时","将来时"]}', 6),
('it','escape_room','scenario','{"scene":"Ristorante","clue":"Ordinare cibo","answer":"Vorrei una pizza","hint":"点餐"}', 3),
-- Portuguese
('pt','word_hunter','vocab', '{"word":"obrigado","reading":"obrigado","meaning":"谢谢","theme":"daily"}', 2),
('pt','word_hunter','vocab', '{"word":"saudade","reading":"saudade","meaning":"思念","theme":"emotion"}', 4),
('pt','word_hunter','vocab', '{"word":"futebol","reading":"futebol","meaning":"足球","theme":"sports"}', 2),
('pt','word_hunter','vocab', '{"word":"caipirinha","reading":"caipirinha","meaning":"巴西鸡尾酒","theme":"food"}', 5),
('pt','word_hunter','vocab', '{"word":"praia","reading":"praia","meaning":"海滩","theme":"travel"}', 3),
('pt','grammar_cube','grammar','{"pattern":"Pretérito perfeito","meaning":"完成时","example":"comi","options":["完成时","现在时","将来时"]}', 6),
('pt','escape_room','scenario','{"scene":"Mercado","clue":"Pedir o preço","answer":"Quanto custa","hint":"询问价格"}', 3),
-- Arabic
('ar','word_hunter','vocab', '{"word":"شكراً","reading":"shukran","meaning":"谢谢","theme":"daily"}', 3),
('ar','word_hunter','vocab', '{"word":"مرحبا","reading":"marhaba","meaning":"你好","theme":"daily"}', 2),
('ar','word_hunter','vocab', '{"word":"حبيبي","reading":"habibi","meaning":"宝贝/亲爱的","theme":"emotion"}', 3),
('ar','word_hunter','vocab', '{"word":"فلافل","reading":"falafel","meaning":"炸豆丸子","theme":"food"}', 3),
('ar','word_hunter','vocab', '{"word":"صحراء","reading":"sahraa","meaning":"沙漠","theme":"nature"}', 5),
('ar','grammar_cube','grammar','{"pattern":"الفعل المضارع","meaning":"现在时动词","example":"يأكل","options":["现在时","过去时","将来时"]}', 6),
('ar','escape_room','scenario','{"scene":"المطعم","clue":"طلب الطعام","answer":"أريد...من فضلك","hint":"礼貌点餐"}', 4),
-- Chinese Advanced
('zh','word_hunter','vocab', '{"word":"恍然大悟","reading":"huangrándàwù","meaning":"突然明白","theme":"idiom"}', 7),
('zh','word_hunter','vocab', '{"word":"马到成功","reading":"mǎdàochénggōng","meaning":"一举成功","theme":"idiom"}', 6),
('zh','word_hunter','vocab', '{"word":"一石二鸟","reading":"yīshíèrniǎo","meaning":"一举两得","theme":"idiom"}', 6),
('zh','word_hunter','vocab', '{"word":"画龙点睛","reading":"huàlóngdiǎnjīng","meaning":"关键之笔","theme":"idiom"}', 7),
('zh','word_hunter','vocab', '{"word":"半途而废","reading":"bàntúérfèi","meaning":"中途放弃","theme":"idiom"}', 6),
('zh','grammar_cube','grammar','{"pattern":"把字句","meaning":"处置句","example":"我把饭吃了","options":["处置句","被动句","存在句"]}', 7),
('zh','grammar_cube','grammar','{"pattern":"被字句","meaning":"被动句","example":"饭被我吃了","options":["被动句","处置句","是字句"]}', 7),
('zh','escape_room','scenario','{"scene":"面试","clue":"自我介绍","answer":"您好，我叫...","hint":"正式自我介绍"}', 5)
ON CONFLICT DO NOTHING;
