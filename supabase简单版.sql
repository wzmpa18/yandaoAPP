-- ======================================================
-- 言道学外语 - 最简数据库脚本
-- 只创建核心表，跳过有外键冲突的表
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

-- ======================================================
-- 插入初始数据
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
SELECT 'streak_7', '一周坚持', '连续学习7天', '🌟', 300, 30
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'streak_7');

INSERT INTO achievements (achievement_key, name, description, icon, xp_reward, diamond_reward)
SELECT 'streak_30', '月度常青', '连续学习30天', '🏆', 1000, 100
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_key = 'streak_30');

-- ======================================================
-- 完成！
-- ======================================================
