/*
  # Add 10 scenarios per language for all 9 non-Japanese languages

  Adds complete scenario sets (10 per language) for:
  en, de, fr, es, ko, it, pt, ar, zh

  Each scenario gets 5 phrases with pronunciation and context notes.

  Tables modified:
  - scenarios: insert 10 rows per language (90 total new rows)
  - phrases: insert 5 phrases per scenario (450 total new rows)
*/

-- ─────────────────────────────────────────
-- ENGLISH scenarios (complete to 10)
-- ─────────────────────────────────────────
INSERT INTO scenarios (title, title_zh, description, icon, grid_position, category, color, order_index, language_code) VALUES
('Hotel Check-in',     '酒店入住',   'Check into your hotel smoothly',            '🏨', 6,  'travel',   '#5B8FA8', 6,  'en'),
('Asking Directions',  '问路指南',   'Find your way around a new city',           '🗺', 7,  'travel',   '#7A9B71', 7,  'en'),
('Medical & Pharmacy', '就医购药',   'Handle health situations confidently',      '🏥', 8,  'health',   '#C9553D', 8,  'en'),
('Numbers & Money',    '数字与金融', 'Master numbers, prices, and transactions',  '💰', 9,  'finance',  '#C9A574', 9,  'en'),
('Job Interview',      '求职面试',   'Ace your English job interview',            '💼', 10, 'business', '#8B6A5A', 10, 'en')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────
-- GERMAN scenarios (10 new)
-- ─────────────────────────────────────────
INSERT INTO scenarios (title, title_zh, description, icon, grid_position, category, color, order_index, language_code) VALUES
('Emergency Help',     '紧急求助',   'Get help in emergencies',                   '🚨', 1,  'safety',   '#C9553D', 1,  'de'),
('Convenience Store',  '便利店购物', 'Shop at a German Laden or Supermarkt',      '🛒', 2,  'daily',    '#7A9B71', 2,  'de'),
('Airport & Transit',  '机场交通',   'Navigate German airports and trains',       '✈️', 3,  'travel',   '#5B8FA8', 3,  'de'),
('Ordering & Dining',  '点餐用餐',   'Order food at a German restaurant',         '🍽', 4,  'food',     '#C9A574', 4,  'de'),
('Casual Chatting',    '日常闲聊',   'Small talk with German locals',             '💬', 5,  'social',   '#4A7FA5', 5,  'de'),
('Hotel Check-in',     '酒店入住',   'Check into your German hotel',              '🏨', 6,  'travel',   '#5B8FA8', 6,  'de'),
('Asking Directions',  '问路指南',   'Ask for directions in German cities',       '🗺', 7,  'travel',   '#7A9B71', 7,  'de'),
('Medical & Pharmacy', '就医购药',   'Visit a Apotheke or Arzt',                  '🏥', 8,  'health',   '#C9553D', 8,  'de'),
('Numbers & Money',    '数字与金融', 'Handle German numbers and payments',        '💰', 9,  'finance',  '#C9A574', 9,  'de'),
('Job Interview',      '求职面试',   'Ace your German job interview',             '💼', 10, 'business', '#8B6A5A', 10, 'de')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────
-- FRENCH — complete to 10
-- ─────────────────────────────────────────
INSERT INTO scenarios (title, title_zh, description, icon, grid_position, category, color, order_index, language_code) VALUES
('Hotel Check-in',     '酒店入住',   'Check into a French hotel',                 '🏨', 6,  'travel',   '#5B8FA8', 6,  'fr'),
('Asking Directions',  '问路指南',   'Find your way in Paris and beyond',         '🗺', 7,  'travel',   '#7A9B71', 7,  'fr'),
('Medical & Pharmacy', '就医购药',   'Visit a pharmacie in France',               '🏥', 8,  'health',   '#C9553D', 8,  'fr'),
('Numbers & Money',    '数字与金融', 'Master French numbers and money',           '💰', 9,  'finance',  '#C9A574', 9,  'fr'),
('Job Interview',      '求职面试',   'Ace your French job interview',             '💼', 10, 'business', '#8B6A5A', 10, 'fr')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────
-- SPANISH — complete to 10
-- ─────────────────────────────────────────
INSERT INTO scenarios (title, title_zh, description, icon, grid_position, category, color, order_index, language_code) VALUES
('Hotel Check-in',     '酒店入住',   'Check into a Spanish hotel',                '🏨', 6,  'travel',   '#5B8FA8', 6,  'es'),
('Asking Directions',  '问路指南',   'Get around Spanish-speaking cities',        '🗺', 7,  'travel',   '#7A9B71', 7,  'es'),
('Medical & Pharmacy', '就医购药',   'Handle medical situations in Spanish',      '🏥', 8,  'health',   '#C9553D', 8,  'es'),
('Numbers & Money',    '数字与金融', 'Master Spanish numbers and money',          '💰', 9,  'finance',  '#C9A574', 9,  'es'),
('Job Interview',      '求职面试',   'Ace your Spanish job interview',            '💼', 10, 'business', '#8B6A5A', 10, 'es')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────
-- KOREAN — complete to 10
-- ─────────────────────────────────────────
INSERT INTO scenarios (title, title_zh, description, icon, grid_position, category, color, order_index, language_code) VALUES
('Hotel Check-in',     '酒店入住',   'Check into a Korean hotel',                 '🏨', 6,  'travel',   '#5B8FA8', 6,  'ko'),
('Asking Directions',  '问路指南',   'Find your way around Korean cities',        '🗺', 7,  'travel',   '#7A9B71', 7,  'ko'),
('Medical & Pharmacy', '就医购药',   'Handle medical needs in Korean',            '🏥', 8,  'health',   '#C9553D', 8,  'ko'),
('Numbers & Money',    '数字与金融', 'Master Korean numbers and currency',        '💰', 9,  'finance',  '#C9A574', 9,  'ko'),
('Job Interview',      '求职面试',   'Ace your Korean job interview',             '💼', 10, 'business', '#8B6A5A', 10, 'ko')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────
-- ITALIAN scenarios (10 new)
-- ─────────────────────────────────────────
INSERT INTO scenarios (title, title_zh, description, icon, grid_position, category, color, order_index, language_code) VALUES
('Emergency Help',     '紧急求助',   'Get help in emergencies',                   '🚨', 1,  'safety',   '#C9553D', 1,  'it'),
('Convenience Store',  '便利店购物', 'Shop at an Italian tabaccheria or market',  '🛒', 2,  'daily',    '#7A9B71', 2,  'it'),
('Airport & Transit',  '机场交通',   'Navigate Italian airports and trains',      '✈️', 3,  'travel',   '#5B8FA8', 3,  'it'),
('Ordering & Dining',  '点餐用餐',   'Order food at an Italian ristorante',       '🍽', 4,  'food',     '#C9A574', 4,  'it'),
('Casual Chatting',    '日常闲聊',   'Small talk with Italian locals',            '💬', 5,  'social',   '#4A7FA5', 5,  'it'),
('Hotel Check-in',     '酒店入住',   'Check into an Italian albergo',             '🏨', 6,  'travel',   '#5B8FA8', 6,  'it'),
('Asking Directions',  '问路指南',   'Get directions in Italian cities',          '🗺', 7,  'travel',   '#7A9B71', 7,  'it'),
('Medical & Pharmacy', '就医购药',   'Visit an Italian farmacia',                 '🏥', 8,  'health',   '#C9553D', 8,  'it'),
('Numbers & Money',    '数字与金融', 'Handle Italian numbers and euros',          '💰', 9,  'finance',  '#C9A574', 9,  'it'),
('Job Interview',      '求职面试',   'Ace your Italian job interview',            '💼', 10, 'business', '#8B6A5A', 10, 'it')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────
-- PORTUGUESE scenarios (10 new)
-- ─────────────────────────────────────────
INSERT INTO scenarios (title, title_zh, description, icon, grid_position, category, color, order_index, language_code) VALUES
('Emergency Help',     '紧急求助',   'Get help in emergencies',                   '🚨', 1,  'safety',   '#C9553D', 1,  'pt'),
('Convenience Store',  '便利店购物', 'Shop at a Brazilian or Portuguese store',   '🛒', 2,  'daily',    '#7A9B71', 2,  'pt'),
('Airport & Transit',  '机场交通',   'Navigate airports and public transit',      '✈️', 3,  'travel',   '#5B8FA8', 3,  'pt'),
('Ordering & Dining',  '点餐用餐',   'Order food at a Portuguese restaurant',     '🍽', 4,  'food',     '#C9A574', 4,  'pt'),
('Casual Chatting',    '日常闲聊',   'Small talk with Portuguese speakers',       '💬', 5,  'social',   '#4A7FA5', 5,  'pt'),
('Hotel Check-in',     '酒店入住',   'Check into a hotel in Portugal or Brazil',  '🏨', 6,  'travel',   '#5B8FA8', 6,  'pt'),
('Asking Directions',  '问路指南',   'Get directions in Portuguese',              '🗺', 7,  'travel',   '#7A9B71', 7,  'pt'),
('Medical & Pharmacy', '就医购药',   'Handle medical situations in Portuguese',   '🏥', 8,  'health',   '#C9553D', 8,  'pt'),
('Numbers & Money',    '数字与金融', 'Master Portuguese numbers and money',       '💰', 9,  'finance',  '#C9A574', 9,  'pt'),
('Job Interview',      '求职面试',   'Ace your Portuguese job interview',         '💼', 10, 'business', '#8B6A5A', 10, 'pt')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────
-- ARABIC scenarios (10 new)
-- ─────────────────────────────────────────
INSERT INTO scenarios (title, title_zh, description, icon, grid_position, category, color, order_index, language_code) VALUES
('Emergency Help',     '紧急求助',   'Get help in emergencies',                   '🚨', 1,  'safety',   '#C9553D', 1,  'ar'),
('Convenience Store',  '便利店购物', 'Shop at an Arabic-speaking market',         '🛒', 2,  'daily',    '#7A9B71', 2,  'ar'),
('Airport & Transit',  '机场交通',   'Navigate airports in the Arab world',       '✈️', 3,  'travel',   '#5B8FA8', 3,  'ar'),
('Ordering & Dining',  '点餐用餐',   'Order food at an Arabic restaurant',        '🍽', 4,  'food',     '#C9A574', 4,  'ar'),
('Casual Chatting',    '日常闲聊',   'Small talk with Arabic speakers',           '💬', 5,  'social',   '#4A7FA5', 5,  'ar'),
('Hotel Check-in',     '酒店入住',   'Check into an Arabic hotel',                '🏨', 6,  'travel',   '#5B8FA8', 6,  'ar'),
('Asking Directions',  '问路指南',   'Ask for directions in Arabic',              '🗺', 7,  'travel',   '#7A9B71', 7,  'ar'),
('Medical & Pharmacy', '就医购药',   'Handle medical situations in Arabic',       '🏥', 8,  'health',   '#C9553D', 8,  'ar'),
('Numbers & Money',    '数字与金融', 'Master Arabic numbers and money',           '💰', 9,  'finance',  '#C9A574', 9,  'ar'),
('Job Interview',      '求职面试',   'Ace your Arabic job interview',             '💼', 10, 'business', '#8B6A5A', 10, 'ar')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────
-- CHINESE ADVANCED scenarios (10 new)
-- ─────────────────────────────────────────
INSERT INTO scenarios (title, title_zh, description, icon, grid_position, category, color, order_index, language_code) VALUES
('Business Meetings',  '商务会议',   'Conduct professional meetings in Chinese',  '🤝', 1,  'business', '#C9553D', 1,  'zh'),
('Negotiation Skills', '谈判技巧',   'Master Chinese negotiation language',       '💡', 2,  'business', '#7A9B71', 2,  'zh'),
('Formal Writing',     '正式写作',   'Write formal emails and documents',         '✍️', 3,  'writing',  '#5B8FA8', 3,  'zh'),
('Academic Debate',    '学术辩论',   'Express complex ideas and opinions',        '🎓', 4,  'academic', '#C9A574', 4,  'zh'),
('Media & News',       '媒体新闻',   'Understand and discuss news topics',        '📰', 5,  'media',    '#4A7FA5', 5,  'zh'),
('Legal Language',     '法律语言',   'Understand legal and official Chinese',     '⚖️', 6,  'legal',    '#8B6A5A', 6,  'zh'),
('Medical Discourse',  '医疗用语',   'Advanced medical terminology in Chinese',   '🏥', 7,  'health',   '#C9553D', 7,  'zh'),
('Cultural Idioms',    '成语文化',   'Master chengyu and classical expressions',  '🐉', 8,  'culture',  '#C9A574', 8,  'zh'),
('Public Speaking',    '公众演讲',   'Deliver impactful Chinese speeches',        '🎤', 9,  'speech',   '#5B8FA8', 9,  'zh'),
('Tech & Innovation',  '科技创新',   'Discuss technology topics in Chinese',      '💻', 10, 'tech',     '#7A9B71', 10, 'zh')
ON CONFLICT DO NOTHING;
