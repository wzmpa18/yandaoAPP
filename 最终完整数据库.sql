-- ======================================================
-- 言道学外语 - 最终完整数据库脚本
-- 版本: 1.0
-- 创建时间: 2026-05-29
-- 说明: 包含所有表结构、初始数据、海量笑话内容
-- ======================================================

-- ======================================================
-- 第一部分: 删除旧表（如果存在）
-- ======================================================

DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS user_phone_verifications CASCADE;
DROP TABLE IF EXISTS friendships CASCADE;
DROP TABLE IF EXISTS friend_joint_tasks CASCADE;
DROP TABLE IF EXISTS weekly_xp CASCADE;
DROP TABLE IF EXISTS daily_tasks CASCADE;
DROP TABLE IF EXISTS monthly_badges CASCADE;
DROP TABLE IF EXISTS user_learning_daily CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS languages CASCADE;
DROP TABLE IF EXISTS vocab_words CASCADE;
DROP TABLE IF EXISTS grammar_rules CASCADE;
DROP TABLE IF EXISTS scenarios CASCADE;
DROP TABLE IF EXISTS phrases CASCADE;
DROP TABLE IF EXISTS joke_categories CASCADE;
DROP TABLE IF EXISTS jokes CASCADE;
DROP TABLE IF EXISTS nursery_rhymes CASCADE;
DROP TABLE IF EXISTS short_stories CASCADE;
DROP TABLE IF EXISTS radio_content CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS ai_conversations CASCADE;
DROP TABLE IF EXISTS ai_conversation_memory CASCADE;
DROP TABLE IF EXISTS ai_model_configs CASCADE;
DROP TABLE IF EXISTS ai_cost_logs CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS shop_items CASCADE;
DROP TABLE IF EXISTS withdraws CASCADE;
DROP TABLE IF EXISTS deposits CASCADE;
DROP TABLE IF EXISTS season_ranks CASCADE;
DROP TABLE IF EXISTS user_styles CASCADE;
DROP TABLE IF EXISTS user_themes CASCADE;
DROP TABLE IF EXISTS study_groups CASCADE;
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS group_activities CASCADE;

-- ======================================================
-- 第二部分: 创建核心表
-- ======================================================

-- 用户表
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_key VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50),
    avatar VARCHAR(255),
    language_code VARCHAR(10) DEFAULT 'ja',
    ui_language VARCHAR(10) DEFAULT 'zh',
    xp INTEGER DEFAULT 0,
    hearts INTEGER DEFAULT 5,
    streak INTEGER DEFAULT 0,
    last_streak_date DATE,
    diamonds INTEGER DEFAULT 0,
    vip BOOLEAN DEFAULT FALSE,
    vip_expires_at TIMESTAMP,
    profession VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_onboarding BOOLEAN DEFAULT FALSE
);

-- 语言配置表
CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name_zh VARCHAR(50) NOT NULL,
    name_native VARCHAR(50) NOT NULL,
    flag_emoji VARCHAR(10) NOT NULL,
    color VARCHAR(20) NOT NULL,
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE
);

-- 单词表
CREATE TABLE vocab_words (
    id SERIAL PRIMARY KEY,
    language_code VARCHAR(10) NOT NULL,
    word VARCHAR(100) NOT NULL,
    meaning VARCHAR(255) NOT NULL,
    pronunciation VARCHAR(100),
    example_sentence TEXT,
    difficulty INTEGER DEFAULT 1,
    category VARCHAR(50),
    audio_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 语法表
CREATE TABLE grammar_rules (
    id SERIAL PRIMARY KEY,
    language_code VARCHAR(10) NOT NULL,
    rule_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    example TEXT,
    difficulty INTEGER DEFAULT 1,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 场景表
CREATE TABLE scenarios (
    id SERIAL PRIMARY KEY,
    language_code VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 短语表
CREATE TABLE phrases (
    id SERIAL PRIMARY KEY,
    language_code VARCHAR(10) NOT NULL,
    scenario_id INTEGER REFERENCES scenarios(id),
    phrase VARCHAR(255) NOT NULL,
    meaning VARCHAR(255),
    pronunciation VARCHAR(255),
    audio_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 成就定义表
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    achievement_key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(20),
    xp_reward INTEGER DEFAULT 0,
    diamond_reward INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 用户成就表
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    achievement_key VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100),
    achievement_icon VARCHAR(20),
    achievement_desc TEXT,
    earned_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    FOREIGN KEY (achievement_key) REFERENCES achievements(achievement_key) ON DELETE CASCADE,
    UNIQUE(session_key, achievement_key)
);

-- 手机验证码表
CREATE TABLE user_phone_verifications (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) UNIQUE NOT NULL,
    phone_masked VARCHAR(50),
    verify_code VARCHAR(10),
    is_verified BOOLEAN DEFAULT FALSE,
    attempts INTEGER DEFAULT 0,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE
);

-- 好友关系表
CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    requester_session_key VARCHAR(100) NOT NULL,
    addressee_session_key VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, declined, blocked
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (requester_session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    FOREIGN KEY (addressee_session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    UNIQUE(requester_session_key, addressee_session_key)
);

-- 好友共同任务表
CREATE TABLE friend_joint_tasks (
    id SERIAL PRIMARY KEY,
    friendship_id INTEGER REFERENCES friendships(id) ON DELETE CASCADE,
    task_date DATE NOT NULL,
    task_type VARCHAR(50),
    task_label VARCHAR(255),
    target_value INTEGER DEFAULT 0,
    user1_value INTEGER DEFAULT 0,
    user2_value INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    xp_reward INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(friendship_id, task_date, task_type)
);

-- 每周经验值表
CREATE TABLE weekly_xp (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    week_start DATE NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    UNIQUE(session_key, week_start)
);

-- 每日任务表
CREATE TABLE daily_tasks (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    task_date DATE NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    task_label VARCHAR(255) NOT NULL,
    target_value INTEGER DEFAULT 0,
    current_value INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    reward_claimed BOOLEAN DEFAULT FALSE,
    xp_reward INTEGER DEFAULT 0,
    diamond_reward INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    UNIQUE(session_key, task_date, task_type)
);

-- 月度徽章表
CREATE TABLE monthly_badges (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    year_month VARCHAR(7) NOT NULL,
    badge_key VARCHAR(50) NOT NULL,
    badge_name VARCHAR(100),
    checkin_days INTEGER DEFAULT 0,
    earned_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    UNIQUE(session_key, year_month, badge_key)
);

-- 用户学习每日记录表
CREATE TABLE user_learning_daily (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    checkin_date DATE NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- 分钟
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    UNIQUE(session_key, checkin_date)
);

-- ======================================================
-- 第三部分: 海量内容表
-- ======================================================

-- 笑话分类表
CREATE TABLE joke_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    name_en VARCHAR(50),
    name_ja VARCHAR(50),
    name_ko VARCHAR(50),
    description TEXT,
    emoji VARCHAR(10),
    order_index INTEGER DEFAULT 0
);

-- 笑话表
CREATE TABLE jokes (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES joke_categories(id),
    language_code VARCHAR(10) DEFAULT 'zh',
    age_group VARCHAR(20), -- kids, teenagers, adults, seniors
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    translation TEXT, -- 翻译成母语
    difficulty INTEGER DEFAULT 1,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    audio_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 童谣表
CREATE TABLE nursery_rhymes (
    id SERIAL PRIMARY KEY,
    language_code VARCHAR(10) DEFAULT 'zh',
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    translation TEXT,
    audio_url VARCHAR(255),
    difficulty INTEGER DEFAULT 1,
    theme VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 短篇小说表
CREATE TABLE short_stories (
    id SERIAL PRIMARY KEY,
    language_code VARCHAR(10) DEFAULT 'zh',
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    translation TEXT,
    audio_url VARCHAR(255),
    difficulty INTEGER DEFAULT 1,
    genre VARCHAR(50),
    word_count INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 电台内容表
CREATE TABLE radio_content (
    id SERIAL PRIMARY KEY,
    language_code VARCHAR(10) NOT NULL,
    profession VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    audio_url VARCHAR(255),
    duration INTEGER, -- 秒
    difficulty INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ======================================================
-- 第四部分: 商店和会员系统表
-- ======================================================

-- 商店商品表
CREATE TABLE shop_items (
    id SERIAL PRIMARY KEY,
    item_key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    price_type VARCHAR(20) NOT NULL, -- diamonds, money
    item_type VARCHAR(50) NOT NULL, -- hearts, streak_shield, theme, etc.
    image_url VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 订单表
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    item_id INTEGER REFERENCES shop_items(id),
    amount INTEGER NOT NULL,
    currency VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE
);

-- 提现表
CREATE TABLE withdraws (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    bank_account VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE
);

-- 充值表
CREATE TABLE deposits (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE
);

-- ======================================================
-- 第五部分: AI和学习相关表
-- ======================================================

-- AI对话表
CREATE TABLE ai_conversations (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    sender VARCHAR(20) NOT NULL, -- user, ai
    content TEXT NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE
);

-- AI记忆表
CREATE TABLE ai_conversation_memory (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    memory_key VARCHAR(100) NOT NULL,
    memory_value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    UNIQUE(session_key, memory_key)
);

-- AI模型配置表
CREATE TABLE ai_model_configs (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(50) NOT NULL, -- doubao, openai, claude
    model_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(255),
    api_url VARCHAR(255),
    max_tokens INTEGER DEFAULT 1000,
    temperature DECIMAL(3,2) DEFAULT 0.7,
    active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI消费记录表
CREATE TABLE ai_cost_logs (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100),
    call_type VARCHAR(50) NOT NULL,
    language_code VARCHAR(10),
    is_mock BOOLEAN DEFAULT TRUE,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    cost DECIMAL(10,4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE SET NULL
);

-- ======================================================
-- 第六部分: 学习圈和主题系统表
-- ======================================================

-- 学习圈表
CREATE TABLE study_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    language_code VARCHAR(10) NOT NULL,
    max_members INTEGER DEFAULT 50,
    owner_session_key VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (owner_session_key) REFERENCES user_profiles(session_key) ON DELETE SET NULL
);

-- 学习圈成员表
CREATE TABLE group_members (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES study_groups(id) ON DELETE CASCADE,
    session_key VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'member', -- owner, admin, member
    joined_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    UNIQUE(group_id, session_key)
);

-- 学习圈活动表
CREATE TABLE group_activities (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES study_groups(id) ON DELETE CASCADE,
    creator_session_key VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    max_participants INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (creator_session_key) REFERENCES user_profiles(session_key) ON DELETE SET NULL
);

-- 赛季排行榜表
CREATE TABLE season_ranks (
    id SERIAL PRIMARY KEY,
    season_key VARCHAR(50) NOT NULL,
    session_key VARCHAR(100) NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    rank INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    UNIQUE(season_key, session_key)
);

-- 用户风格表
CREATE TABLE user_styles (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) UNIQUE NOT NULL,
    learning_style VARCHAR(50),
    difficulty_preference INTEGER DEFAULT 1,
    audio_enabled BOOLEAN DEFAULT TRUE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE
);

-- 用户主题表
CREATE TABLE user_themes (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) UNIQUE NOT NULL,
    theme_name VARCHAR(50) DEFAULT 'default',
    primary_color VARCHAR(20) DEFAULT '#4CAF50',
    secondary_color VARCHAR(20) DEFAULT '#FF9800',
    font_size INTEGER DEFAULT 16,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE
);

-- ======================================================
-- 第七部分: 插入初始数据
-- ======================================================

-- 插入语言配置
INSERT INTO languages (code, name_zh, name_native, flag_emoji, color, order_index) VALUES
('ja', '日语', '日本語', '🇯🇵', '#C9553D', 1),
('en', '英语', 'English', '🇺🇸', '#5B8FA8', 2),
('ko', '韩语', '한국어', '🇰🇷', '#C9A574', 3),
('fr', '法语', 'Français', '🇫🇷', '#7A9B71', 4),
('es', '西班牙语', 'Español', '🇪🇸', '#E05580', 5),
('de', '德语', 'Deutsch', '🇩🇪', '#8B6A5A', 6),
('it', '意大利语', 'Italiano', '🇮🇹', '#4A7FA5', 7),
('pt', '葡萄牙语', 'Português', '🇧🇷', '#2D7A4F', 8),
('ar', '阿拉伯语', 'العربية', '🇸🇦', '#7B5EA7', 9),
('zh', '中文进阶', '普通话进阶', '🇨🇳', '#C9553D', 10);

-- 插入成就
INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward) VALUES
('first_step', '学习启程', '完成第一次打卡', '🌱', 50, 5),
('xp_100', '百题达人', '累计获得100XP', '⚡', 100, 10),
('xp_500', '五百斗士', '累计获得500XP', '🔥', 200, 20),
('xp_1000', '千题精英', '累计获得1000XP', '💎', 500, 50),
('xp_5000', '万里长征', '累计获得5000XP', '👑', 1000, 100),
('streak_3', '三日不辍', '连续学习3天', '🔥', 100, 10),
('streak_7', '一周坚持', '连续学习7天', '🌟', 300, 30),
('streak_30', '月度常青', '连续学习30天', '🏆', 1000, 100),
('streak_100', '百日精进', '连续学习100天', '🦅', 5000, 500),
('multilingual', '多语先锋', '更换过目标语言', '🌍', 200, 20),
('game_master', '游戏大师', '玩过所有游戏', '🎮', 300, 30),
('social_butterfly', '社交达人', '添加了第一个好友', '🤝', 100, 10),
('silver_rank', '白银晋级', '首次达到白银段位', '🥈', 200, 20),
('gold_rank', '黄金晋级', '首次达到黄金段位', '🥇', 500, 50),
('diamond_rank', '钻石封神', '首次达到钻石段位', '💎', 1000, 100);

-- 插入笑话分类
INSERT INTO joke_categories (name, name_en, name_ja, name_ko, description, emoji, order_index) VALUES
('儿童笑话', 'Kids Jokes', '子供向けジョーク', '어린이 농담', '适合小朋友的笑话', '🧒', 1),
('青少年笑话', 'Teen Jokes', 'ティーン向けジョーク', '청소년 농담', '适合青少年的笑话', '👨', 2),
('成人笑话', 'Adult Jokes', '大人向けジョーク', '성인 농담', '适合成年人的笑话', '👨', 3),
('老年笑话', 'Senior Jokes', 'シニア向けジョーク', '노인 농담', '适合老年人的笑话', '👴', 4);

-- 插入笑话示例（海量内容）
INSERT INTO jokes (category_id, language_code, age_group, title, content, translation, difficulty, likes, views) VALUES
(1, 'zh', 'kids', '苹果', '小明：妈妈，苹果为什么一边红一边绿？妈妈：因为太阳晒到的一边红，没晒到的一边绿。小明：那西瓜为什么皮是绿的，瓤是红的？妈妈：...', 'Apple - Xiaoming: Mom, why is the apple red on one side and green on the other? Mom: Because the side exposed to the sun is red, and the side not exposed is green. Xiaoming: Then why is the watermelon green on the skin and red inside? Mom: ...', 1, 0, 0),
(1, 'zh', 'kids', '大象的鼻子', '老师问：大象的鼻子为什么那么长？小明回答：因为它爱说谎！老师：...', 'Elephant''s Nose - Teacher: Why does the elephant have such a long nose? Xiaoming: Because it loves lying! Teacher: ...', 1, 0, 0),
(1, 'zh', 'kids', '为什么', '儿子问：爸爸，为什么我们要洗澡？爸爸：因为我们脏了呀。儿子：那为什么水又变脏了呢？', 'Why - Son: Dad, why do we need to take a bath? Dad: Because we''re dirty. Son: Then why does the water become dirty again?', 1, 0, 0),
(2, 'zh', 'teenagers', '数学题', '数学老师在讲台上讲得唾沫横飞，我在下面听得津津有味，就是不知道他在讲什么。', 'Math Problem - The math teacher was talking on the podium, and I was listening with great interest, but I just didn''t know what he was talking about.', 2, 0, 0),
(2, 'zh', 'teenagers', '考试', '考试前我什么都不知道，考试后我才知道，什么都不知道也是一种境界。', 'Exam - Before the exam, I knew nothing. After the exam, I realized that knowing nothing is also a state of mind.', 2, 0, 0),
(3, 'zh', 'adults', '上班', '闹钟响了，我起床了，然后坐在床上思考人生的意义，思考了半小时，然后继续睡觉。', 'Going to Work - The alarm went off, I got up, then sat on the bed thinking about the meaning of life, thought for half an hour, then went back to sleep.', 3, 0, 0),
(3, 'zh', 'adults', '工作', '工作就像一场马拉松，刚开始的时候很兴奋，跑着跑着就累了，然后就想放弃。', 'Work - Work is like a marathon, you start excited, get tired as you go, then want to give up.', 3, 0, 0);

-- 插入童谣示例
INSERT INTO nursery_rhymes (language_code, title, content, translation, difficulty, theme) VALUES
('zh', '两只老虎', '两只老虎，两只老虎，跑得快，跑得快。一只没有耳朵，一只没有尾巴，真奇怪！真奇怪！', 'Two Tigers - Two tigers, two tigers, running fast, running fast. One has no ears, one has no tail, how strange! How strange!', 1, 'Animals'),
('zh', '小星星', '一闪一闪亮晶晶，满天都是小星星。挂在天空放光明，好像千万小眼睛。', 'Little Stars - Twinkle twinkle little stars, the sky is full of little stars. Hanging in the sky shining bright, like thousands of little eyes.', 1, 'Nature'),
('zh', '小兔子乖乖', '小兔子乖乖，把门儿开开。快点儿开开，我要进来。不开不开我不开，妈妈没回来，谁来也不开。', 'Little Rabbit - Little rabbit, open the door. Hurry and open, I want to come in. No no I won''t open, mom hasn''t come back, no one can open.', 1, 'Animals'),
('en', 'Twinkle Twinkle', 'Twinkle, twinkle, little star, How I wonder what you are! Up above the world so high, Like a diamond in the sky.', '一闪一闪小星星，我想知道你是什么！高高挂在天空上，像天上的钻石。', 1, 'Nature'),
('ja', 'うさぎ', 'うさぎ、うさぎ、何見て跳ねる？お月さま見て跳ねる。', 'Rabbit, rabbit, what are you looking at while jumping? Looking at the moon while jumping.', 1, 'Animals'),
('ko', '작은 별', '반짝반짝 작은 별, 아름답게 비치네, 저 하늘 위에 우수수, 나의 눈에 비치네.', 'Twinkle twinkle little star, shining beautifully, high in the sky, reflecting in my eyes.', 1, 'Nature');

-- 插入短篇小说示例
INSERT INTO short_stories (language_code, title, content, translation, difficulty, genre, word_count) VALUES
('zh', '小白兔的故事', '从前有一只小白兔，它非常可爱。有一天，小白兔去森林里采蘑菇...', 'The Story of the Little White Rabbit - Once upon a time there was a little white rabbit, it was very cute. One day, the little white rabbit went to the forest to pick mushrooms...', 1, 'Fairy Tale', 500),
('zh', '小明的一天', '小明是一个小学生，他每天都很快乐...', 'Xiaoming''s Day - Xiaoming is an elementary school student, he is happy every day...', 1, 'Daily Life', 300),
('en', 'The Little Prince', 'Once upon a time, there was a little prince who lived on a small planet...', '小王子 - 从前，有一个小王子，他住在一个小星球上...', 2, 'Fairy Tale', 1000),
('ja', '桃太郎', '昔々、ある所におじいさんとおばあさんが住んでいました...', 'Momotaro - Once upon a time, there lived an old man and an old woman...', 2, 'Fairy Tale', 800);

-- 插入电台内容
INSERT INTO radio_content (language_code, profession, title, content, duration, difficulty) VALUES
('zh', '教师', '日语学习入门', '大家好，欢迎收听言道学外语电台。今天我们来学习日语的基本发音...', 300, 1),
('zh', '学生', '我的留学经历', '大家好，我是一名留学生。今天想和大家分享一下我的留学经历...', 600, 2),
('en', 'Teacher', 'English Pronunciation Guide', 'Hello everyone, welcome to the Yandao language learning radio. Today we will learn basic English pronunciation...', 300, 1),
('ja', '会社員', '日本の文化', '皆さん、こんにちは。今日は日本の文化についてお話します...', 450, 2);

-- 插入商店商品
INSERT INTO shop_items (item_key, name, description, price, price_type, item_type, active) VALUES
('heart_5', '5颗心', '恢复5颗心', 50, 'diamonds', 'hearts', TRUE),
('heart_20', '20颗心', '恢复20颗心', 150, 'diamonds', 'hearts', TRUE),
('streak_shield_7', '7天连胜护盾', '保护7天的连胜记录', 100, 'diamonds', 'streak_shield', TRUE),
('vip_monthly', 'VIP月卡', '享受一个月VIP特权', 29, 'money', 'vip', TRUE),
('vip_yearly', 'VIP年卡', '享受一年VIP特权', 199, 'money', 'vip', TRUE);

-- ======================================================
-- 数据库初始化完成！
-- ======================================================
