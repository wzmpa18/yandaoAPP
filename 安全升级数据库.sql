-- ======================================================
-- 言道学外语 - 安全升级数据库脚本
-- 版本: 1.0
-- 创建时间: 2026-05-29
-- 说明: 只添加缺失的表和内容，不删除任何已有数据！
-- ======================================================

-- ======================================================
-- 创建缺失的表（如果表不存在）
-- ======================================================

-- 用户表（如果不存在）
CREATE TABLE IF NOT EXISTS user_profiles (
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

-- 语言配置表（如果不存在）
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name_zh VARCHAR(50) NOT NULL,
    name_native VARCHAR(50) NOT NULL,
    flag_emoji VARCHAR(10) NOT NULL,
    color VARCHAR(20) NOT NULL,
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE
);

-- 单词表（如果不存在）
CREATE TABLE IF NOT EXISTS vocab_words (
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

-- 语法表（如果不存在）
CREATE TABLE IF NOT EXISTS grammar_rules (
    id SERIAL PRIMARY KEY,
    language_code VARCHAR(10) NOT NULL,
    rule_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    example TEXT,
    difficulty INTEGER DEFAULT 1,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 场景表（如果不存在）
CREATE TABLE IF NOT EXISTS scenarios (
    id SERIAL PRIMARY KEY,
    language_code VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 短语表（如果不存在）
CREATE TABLE IF NOT EXISTS phrases (
    id SERIAL PRIMARY KEY,
    language_code VARCHAR(10) NOT NULL,
    scenario_id INTEGER REFERENCES scenarios(id),
    phrase VARCHAR(255) NOT NULL,
    meaning VARCHAR(255),
    pronunciation VARCHAR(255),
    audio_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 成就定义表（如果不存在）
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    achievement_key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(20),
    xp_reward INTEGER DEFAULT 0,
    diamond_reward INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 用户成就表（如果不存在）
CREATE TABLE IF NOT EXISTS user_achievements (
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

-- 手机验证码表（如果不存在）
CREATE TABLE IF NOT EXISTS user_phone_verifications (
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

-- 好友关系表（如果不存在）
CREATE TABLE IF NOT EXISTS friendships (
    id SERIAL PRIMARY KEY,
    requester_session_key VARCHAR(100) NOT NULL,
    addressee_session_key VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (requester_session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    FOREIGN KEY (addressee_session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    UNIQUE(requester_session_key, addressee_session_key)
);

-- 好友共同任务表（如果不存在）
CREATE TABLE IF NOT EXISTS friend_joint_tasks (
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

-- 每周经验值表（如果不存在）
CREATE TABLE IF NOT EXISTS weekly_xp (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    week_start DATE NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    UNIQUE(session_key, week_start)
);

-- 每日任务表（如果不存在）
CREATE TABLE IF NOT EXISTS daily_tasks (
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

-- 月度徽章表（如果不存在）
CREATE TABLE IF NOT EXISTS monthly_badges (
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

-- 用户学习每日记录表（如果不存在）
CREATE TABLE IF NOT EXISTS user_learning_daily (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    checkin_date DATE NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    UNIQUE(session_key, checkin_date)
);

-- 笑话分类表（如果不存在）
CREATE TABLE IF NOT EXISTS joke_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    name_en VARCHAR(50),
    name_ja VARCHAR(50),
    name_ko VARCHAR(50),
    description TEXT,
    emoji VARCHAR(10),
    order_index INTEGER DEFAULT 0
);

-- 笑话表（如果不存在）
CREATE TABLE IF NOT EXISTS jokes (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES joke_categories(id),
    language_code VARCHAR(10) DEFAULT 'zh',
    age_group VARCHAR(20),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    translation TEXT,
    difficulty INTEGER DEFAULT 1,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    audio_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 童谣表（如果不存在）
CREATE TABLE IF NOT EXISTS nursery_rhymes (
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

-- 短篇小说表（如果不存在）
CREATE TABLE IF NOT EXISTS short_stories (
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

-- 电台内容表（如果不存在）
CREATE TABLE IF NOT EXISTS radio_content (
    id SERIAL PRIMARY KEY,
    language_code VARCHAR(10) NOT NULL,
    profession VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    audio_url VARCHAR(255),
    duration INTEGER,
    difficulty INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 商店商品表（如果不存在）
CREATE TABLE IF NOT EXISTS shop_items (
    id SERIAL PRIMARY KEY,
    item_key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    price_type VARCHAR(20) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    image_url VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 订单表（如果不存在）
CREATE TABLE IF NOT EXISTS orders (
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

-- 提现表（如果不存在）
CREATE TABLE IF NOT EXISTS withdraws (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    bank_account VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE
);

-- 充值表（如果不存在）
CREATE TABLE IF NOT EXISTS deposits (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE
);

-- AI对话表（如果不存在）
CREATE TABLE IF NOT EXISTS ai_conversations (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    sender VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE
);

-- AI记忆表（如果不存在）
CREATE TABLE IF NOT EXISTS ai_conversation_memory (
    id SERIAL PRIMARY KEY,
    session_key VARCHAR(100) NOT NULL,
    memory_key VARCHAR(100) NOT NULL,
    memory_value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    UNIQUE(session_key, memory_key)
);

-- AI模型配置表（如果不存在）
CREATE TABLE IF NOT EXISTS ai_model_configs (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(255),
    api_url VARCHAR(255),
    max_tokens INTEGER DEFAULT 1000,
    temperature DECIMAL(3,2) DEFAULT 0.7,
    active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI消费记录表（如果不存在）
CREATE TABLE IF NOT EXISTS ai_cost_logs (
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

-- 学习圈表（如果不存在）
CREATE TABLE IF NOT EXISTS study_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    language_code VARCHAR(10) NOT NULL,
    max_members INTEGER DEFAULT 50,
    owner_session_key VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (owner_session_key) REFERENCES user_profiles(session_key) ON DELETE SET NULL
);

-- 学习圈成员表（如果不存在）
CREATE TABLE IF NOT EXISTS group_members (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES study_groups(id) ON DELETE CASCADE,
    session_key VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    UNIQUE(group_id, session_key)
);

-- 学习圈活动表（如果不存在）
CREATE TABLE IF NOT EXISTS group_activities (
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

-- 赛季排行榜表（如果不存在）
CREATE TABLE IF NOT EXISTS season_ranks (
    id SERIAL PRIMARY KEY,
    season_key VARCHAR(50) NOT NULL,
    session_key VARCHAR(100) NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    rank INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (session_key) REFERENCES user_profiles(session_key) ON DELETE CASCADE,
    UNIQUE(season_key, session_key)
);

-- 用户风格表（如果不存在）
CREATE TABLE IF NOT EXISTS user_styles (
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

-- 用户主题表（如果不存在）
CREATE TABLE IF NOT EXISTS user_themes (
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
-- 插入初始数据（如果数据不存在）
-- ======================================================

-- 插入语言配置（如果不存在）
INSERT INTO languages (code, name_zh, name_native, flag_emoji, color, order_index)
SELECT 'ja', '日语', '日本語', '🇯🇵', '#C9553D', 1
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'ja');

INSERT INTO languages (code, name_zh, name_native, flag_emoji, color, order_index)
SELECT 'en', '英语', 'English', '🇺🇸', '#5B8FA8', 2
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'en');

INSERT INTO languages (code, name_zh, name_native, flag_emoji, color, order_index)
SELECT 'ko', '韩语', '한국어', '🇰🇷', '#C9A574', 3
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'ko');

INSERT INTO languages (code, name_zh, name_native, flag_emoji, color, order_index)
SELECT 'fr', '法语', 'Français', '🇫🇷', '#7A9B71', 4
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'fr');

INSERT INTO languages (code, name_zh, name_native, flag_emoji, color, order_index)
SELECT 'es', '西班牙语', 'Español', '🇪🇸', '#E05580', 5
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'es');

INSERT INTO languages (code, name_zh, name_native, flag_emoji, color, order_index)
SELECT 'de', '德语', 'Deutsch', '🇩🇪', '#8B6A5A', 6
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'de');

INSERT INTO languages (code, name_zh, name_native, flag_emoji, color, order_index)
SELECT 'it', '意大利语', 'Italiano', '🇮🇹', '#4A7FA5', 7
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'it');

INSERT INTO languages (code, name_zh, name_native, flag_emoji, color, order_index)
SELECT 'pt', '葡萄牙语', 'Português', '🇧🇷', '#2D7A4F', 8
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'pt');

INSERT INTO languages (code, name_zh, name_native, flag_emoji, color, order_index)
SELECT 'ar', '阿拉伯语', 'العربية', '🇸🇦', '#7B5EA7', 9
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'ar');

INSERT INTO languages (code, name_zh, name_native, flag_emoji, color, order_index)
SELECT 'zh', '中文进阶', '普通话进阶', '🇨🇳', '#C9553D', 10
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'zh');

-- 插入成就（如果不存在）
INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'first_step', '学习启程', '完成第一次打卡', '🌱', 50, 5
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'first_step');

INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'xp_100', '百题达人', '累计获得100XP', '⚡', 100, 10
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'xp_100');

INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'xp_500', '五百斗士', '累计获得500XP', '🔥', 200, 20
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'xp_500');

INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'xp_1000', '千题精英', '累计获得1000XP', '💎', 500, 50
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'xp_1000');

INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'xp_5000', '万里长征', '累计获得5000XP', '👑', 1000, 100
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'xp_5000');

INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'streak_3', '三日不辍', '连续学习3天', '🔥', 100, 10
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'streak_3');

INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'streak_7', '一周坚持', '连续学习7天', '🌟', 300, 30
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'streak_7');

INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'streak_30', '月度常青', '连续学习30天', '🏆', 1000, 100
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'streak_30');

INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'streak_100', '百日精进', '连续学习100天', '🦅', 5000, 500
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'streak_100');

INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'multilingual', '多语先锋', '更换过目标语言', '🌍', 200, 20
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'multilingual');

INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'game_master', '游戏大师', '玩过所有游戏', '🎮', 300, 30
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'game_master');

INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'social_butterfly', '社交达人', '添加了第一个好友', '🤝', 100, 10
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'social_butterfly');

INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'silver_rank', '白银晋级', '首次达到白银段位', '🥈', 200, 20
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'silver_rank');

INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'gold_rank', '黄金晋级', '首次达到黄金段位', '🥇', 500, 50
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'gold_rank');

INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'diamond_rank', '钻石封神', '首次达到钻石段位', '💎', 1000, 100
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'diamond_rank');

-- 插入笑话分类（如果不存在）
INSERT INTO joke_categories (name, name_en, name_ja, name_ko, description, emoji, order_index)
SELECT '儿童笑话', 'Kids Jokes', '子供向けジョーク', '어린이 농담', '适合小朋友的笑话', '🧒', 1
WHERE NOT EXISTS (SELECT 1 FROM joke_categories WHERE name = '儿童笑话');

INSERT INTO joke_categories (name, name_en, name_ja, name_ko, description, emoji, order_index)
SELECT '青少年笑话', 'Teen Jokes', 'ティーン向けジョーク', '청소년 농담', '适合青少年的笑话', '👨', 2
WHERE NOT EXISTS (SELECT 1 FROM joke_categories WHERE name = '青少年笑话');

INSERT INTO joke_categories (name, name_en, name_ja, name_ko, description, emoji, order_index)
SELECT '成人笑话', 'Adult Jokes', '大人向けジョーク', '성인 농담', '适合成年人的笑话', '👨', 3
WHERE NOT EXISTS (SELECT 1 FROM joke_categories WHERE name = '成人笑话');

INSERT INTO joke_categories (name, name_en, name_ja, name_ko, description, emoji, order_index)
SELECT '老年笑话', 'Senior Jokes', 'シニア向けジョーク', '노인 농담', '适合老年人的笑话', '👴', 4
WHERE NOT EXISTS (SELECT 1 FROM joke_categories WHERE name = '老年笑话');

-- 插入笑话示例（如果不存在）
INSERT INTO jokes (category_id, language_code, age_group, title, content, translation, difficulty, likes, views)
SELECT 1, 'zh', 'kids', '苹果', '小明：妈妈，苹果为什么一边红一边绿？妈妈：因为太阳晒到的一边红，没晒到的一边绿。小明：那西瓜为什么皮是绿的，瓤是红的？妈妈：...', 'Apple - Xiaoming: Mom, why is the apple red on one side and green on the other? Mom: Because the side exposed to the sun is red, and the side not exposed is green. Xiaoming: Then why is the watermelon green on the skin and red inside? Mom: ...', 1, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM jokes WHERE title = '苹果');

-- ======================================================
-- 安全升级完成！
-- 说明：
-- 1. 所有表都是用 CREATE TABLE IF NOT EXISTS 创建的，不会影响已有表
-- 2. 所有数据都是用 INSERT ... WHERE NOT EXISTS 插入的，不会影响已有数据
-- 3. 可以放心执行！
-- ======================================================
