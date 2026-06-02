-- ======================================================
-- 言道学外语 - 只插数据脚本
-- 跳过已存在的表，只插入缺失的数据
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
