-- ========================================
-- SCENARIOS (100 rows, 10 per language)
-- ========================================

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '3d253cf0-1849-4d94-b0fc-912f8fb3f045', 'ja', '挨拶と自己紹介', 'Greetings & Self-intro', 'こんにちは、私は田中です', '👋', 1, 'daily', '#E07B6C', 1)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b9ad7334-2081-41aa-bf16-c7a219aaaefd', '3d253cf0-1849-4d94-b0fc-912f8fb3f045', 'こんにちは', '你好', 'konnichiwa', '日常问候', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6fe42416-581b-4939-931e-ebe659f654b5', '3d253cf0-1849-4d94-b0fc-912f8fb3f045', 'はじめまして', '初次见面', 'hajimemashite', '第一次见面时使用', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b9ac12c0-d80f-4c79-b10a-f136c185d82f', '3d253cf0-1849-4d94-b0fc-912f8fb3f045', '私は田中です', '我是田中', 'watashi wa Tanaka desu', '自我介绍', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1ac39b7a-3591-4e8b-8ebe-fd14d95eb023', '3d253cf0-1849-4d94-b0fc-912f8fb3f045', 'お元気ですか', '你好吗？', 'ogenki desu ka', '询问对方状况', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f2629123-e87e-4aea-8936-c15271340bcc', '3d253cf0-1849-4d94-b0fc-912f8fb3f045', '元気です', '我很好', 'genki desu', '回应问候', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e3a15e3e-b209-4756-81b6-1af870264132', '3d253cf0-1849-4d94-b0fc-912f8fb3f045', 'お名前は？', '你叫什么名字？', 'onamae wa?', '询问姓名', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8e87e7b4-8757-4d0d-8965-ebfae63f6b92', '3d253cf0-1849-4d94-b0fc-912f8fb3f045', 'よろしくお願いします', '请多关照', 'yoroshiku onegaishimasu', '初次见面结束语', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a1bbd43b-0923-410b-969d-cd4d6c4ce459', '3d253cf0-1849-4d94-b0fc-912f8fb3f045', 'どちらからですか', '你从哪里来？', 'dochira kara desu ka', '询问来源', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9693ed29-9989-4906-ac3e-bb4a7d2c4a6c', '3d253cf0-1849-4d94-b0fc-912f8fb3f045', '日本から来ました', '我从日本来', 'Nihon kara kimashita', '回答来源', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '87e64a9a-514a-4f74-a08d-689faf4dca03', '3d253cf0-1849-4d94-b0fc-912f8fb3f045', 'また会いましょう', '再见（再会）', 'mata aimashou', '告别', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '142de13d-ee8b-4395-92bc-2c074b546dd2', 'ja', 'レストランで注文', 'Ordering at Restaurant', 'メニューをください', '🍣', 2, 'food', '#C97B5A', 2)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a2488fe1-08e4-4df0-b3ed-31f647de80e2', '142de13d-ee8b-4395-92bc-2c074b546dd2', 'メニューをください', '请给我菜单', 'menyuu o kudasai', '点餐前要菜单', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '68283968-71e7-4252-9359-40a94926ba9c', '142de13d-ee8b-4395-92bc-2c074b546dd2', 'おすすめは何ですか', '有什么推荐？', 'osusume wa nan desu ka', '询问推荐菜', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '76fb8081-5ca7-4aa0-83b2-5f204bb50811', '142de13d-ee8b-4395-92bc-2c074b546dd2', 'これをください', '请给我这个', 'kore o kudasai', '指着菜单点菜', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3cfec4a1-0531-465d-b653-93f2915e80a7', '142de13d-ee8b-4395-92bc-2c074b546dd2', 'おいしいです', '很好吃', 'oishii desu', '赞美食物', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '72e7b6ca-efec-40c0-b29a-8c168c0b7fa9', '142de13d-ee8b-4395-92bc-2c074b546dd2', 'お会計をお願いします', '请结账', 'okaikei o onegaishimasu', '要账单', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '69064db3-b529-40bb-a159-e974ef0b4c74', '142de13d-ee8b-4395-92bc-2c074b546dd2', '別々に払います', '分开付', 'betsubetsu ni haraimasu', 'AA制', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7e2bab41-5f21-438b-bc35-a505a61ae67b', '142de13d-ee8b-4395-92bc-2c074b546dd2', 'いただきます', '我要开动了', 'itadakimasu', '饭前用语', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3c278d0d-e6e5-4dc7-9a13-75825af68a42', '142de13d-ee8b-4395-92bc-2c074b546dd2', 'ごちそうさまでした', '多谢款待', 'gochisousama deshita', '饭后用语', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '63081f34-5388-4ac8-b6c5-c40fe660bada', '142de13d-ee8b-4395-92bc-2c074b546dd2', '水をください', '请给我水', 'mizu o kudasai', '要水', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ef889477-eca7-419c-b6fc-e7ba230f1a50', '142de13d-ee8b-4395-92bc-2c074b546dd2', '予約しています', '我有预约', 'yoyaku shiteimasu', '告知预约', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '4bedae9d-17aa-4a7e-a0d3-a01e42f3fda3', 'ja', '道を尋ねる', 'Asking Directions', 'すみません、駅はどこですか', '🗺️', 3, 'travel', '#5B8FA8', 3)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2f64c800-d247-4b6a-b010-32b1647e666e', '4bedae9d-17aa-4a7e-a0d3-a01e42f3fda3', '道を尋ねる - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '33baf7cb-b9e5-4249-8b88-ad3cd662e195', '4bedae9d-17aa-4a7e-a0d3-a01e42f3fda3', '道を尋ねる - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '48a82515-baab-4a41-a149-ef3ca2e59fe2', '4bedae9d-17aa-4a7e-a0d3-a01e42f3fda3', '道を尋ねる - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1228da29-14c6-4a95-96a6-fa533954b22f', '4bedae9d-17aa-4a7e-a0d3-a01e42f3fda3', '道を尋ねる - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4a731a2b-3a2f-4e52-8e9b-21c796b46f1b', '4bedae9d-17aa-4a7e-a0d3-a01e42f3fda3', '道を尋ねる - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '567987ef-9f6e-40bd-8ab9-0f20eae09d80', '4bedae9d-17aa-4a7e-a0d3-a01e42f3fda3', '道を尋ねる - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bbc1f2fc-2104-4be6-a77d-55e9de3b1f00', '4bedae9d-17aa-4a7e-a0d3-a01e42f3fda3', '道を尋ねる - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'dba770a3-3417-4e7e-ac8c-40eeebdaa5b1', '4bedae9d-17aa-4a7e-a0d3-a01e42f3fda3', '道を尋ねる - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '101949fe-db2e-4cf4-83f6-a84e5d82ea7a', '4bedae9d-17aa-4a7e-a0d3-a01e42f3fda3', '道を尋ねる - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '38a02760-b329-4322-8fb1-bd39139ee7f3', '4bedae9d-17aa-4a7e-a0d3-a01e42f3fda3', '道を尋ねる - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '53d1a15d-cb42-4a5c-9a3d-b41f89737e8e', 'ja', '買い物の会話', 'Shopping Conversation', 'これはいくらですか', '🛍️', 4, 'shopping', '#7A9B71', 4)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'adeeeb99-cc6b-467d-aef5-f3386b4882ce', '53d1a15d-cb42-4a5c-9a3d-b41f89737e8e', '買い物の会話 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '80400dcc-4ce4-432a-8454-26b7dfc6c278', '53d1a15d-cb42-4a5c-9a3d-b41f89737e8e', '買い物の会話 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '07146e54-295d-4e1e-9948-3aa48883190b', '53d1a15d-cb42-4a5c-9a3d-b41f89737e8e', '買い物の会話 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '45f3a440-4bdf-4c28-91bf-27695f74ab67', '53d1a15d-cb42-4a5c-9a3d-b41f89737e8e', '買い物の会話 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e3759dac-90da-4942-befb-3d86076d26c9', '53d1a15d-cb42-4a5c-9a3d-b41f89737e8e', '買い物の会話 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '012f874d-82e0-41d1-a8f9-eb935ca91697', '53d1a15d-cb42-4a5c-9a3d-b41f89737e8e', '買い物の会話 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '21700f5d-8610-423a-a4c9-b48963beeae5', '53d1a15d-cb42-4a5c-9a3d-b41f89737e8e', '買い物の会話 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '372d1f4d-4281-411d-89a9-a53fd968bbec', '53d1a15d-cb42-4a5c-9a3d-b41f89737e8e', '買い物の会話 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'caaaccd1-5bf6-4adf-bdf7-e2bc292ae922', '53d1a15d-cb42-4a5c-9a3d-b41f89737e8e', '買い物の会話 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '64b12a97-fd5b-430e-bb47-ee8a21353dba', '53d1a15d-cb42-4a5c-9a3d-b41f89737e8e', '買い物の会話 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '341749c4-c3b7-4da4-b06f-5dd07d3600dd', 'ja', 'ホテルのチェックイン', 'Hotel Check-in', '予約しています', '🏨', 5, 'travel', '#8B7BA8', 5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a0625a74-4e07-4c3c-9b76-053219c12819', '341749c4-c3b7-4da4-b06f-5dd07d3600dd', 'ホテルのチェックイン - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bd50c74e-2060-4bb7-b9cb-f6cae63ee159', '341749c4-c3b7-4da4-b06f-5dd07d3600dd', 'ホテルのチェックイン - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7cfc8650-6e5e-48a9-be12-f270236981ba', '341749c4-c3b7-4da4-b06f-5dd07d3600dd', 'ホテルのチェックイン - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fff86a5b-7d65-4c63-b66b-c74435c58000', '341749c4-c3b7-4da4-b06f-5dd07d3600dd', 'ホテルのチェックイン - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2906fb1a-9639-4b38-b9fc-8ad4d7157471', '341749c4-c3b7-4da4-b06f-5dd07d3600dd', 'ホテルのチェックイン - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'afaabb5f-1747-42cd-8f49-16300d63d358', '341749c4-c3b7-4da4-b06f-5dd07d3600dd', 'ホテルのチェックイン - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f3e8c05c-9cf1-4590-a36e-33894d50e14f', '341749c4-c3b7-4da4-b06f-5dd07d3600dd', 'ホテルのチェックイン - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'cb3b19d9-b4d7-499f-9190-cf8b5010c63f', '341749c4-c3b7-4da4-b06f-5dd07d3600dd', 'ホテルのチェックイン - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fdd6a9ac-b00a-4a8a-abd6-7e296714c503', '341749c4-c3b7-4da4-b06f-5dd07d3600dd', 'ホテルのチェックイン - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c2e9bef6-d6f5-4be6-a173-b20d10ced286', '341749c4-c3b7-4da4-b06f-5dd07d3600dd', 'ホテルのチェックイン - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '061cdade-e185-4b5b-b170-46a0b3ed7787', 'ja', '電話での会話', 'Phone Conversation', 'もしもし、田中ですが', '📞', 6, 'daily', '#A87B8B', 6)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'eec144c4-56b1-45cc-adfb-a9bc1fd59083', '061cdade-e185-4b5b-b170-46a0b3ed7787', '電話での会話 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6b258e48-fc96-4395-9081-0a9f52b29ba8', '061cdade-e185-4b5b-b170-46a0b3ed7787', '電話での会話 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e2ec64bb-1ff8-49e8-a6db-8f5a5a7f6a47', '061cdade-e185-4b5b-b170-46a0b3ed7787', '電話での会話 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1d8c737f-b7ba-4c9e-96a8-0ab25c7bcbc9', '061cdade-e185-4b5b-b170-46a0b3ed7787', '電話での会話 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd807e759-d6e6-4c90-9621-1a830f73fe82', '061cdade-e185-4b5b-b170-46a0b3ed7787', '電話での会話 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '76d0dee1-95d3-475f-b406-cc609e56470b', '061cdade-e185-4b5b-b170-46a0b3ed7787', '電話での会話 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3e43c294-f946-4793-874d-e5b7fd001c4b', '061cdade-e185-4b5b-b170-46a0b3ed7787', '電話での会話 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c49ac884-b6d3-47d3-a761-f35df037704f', '061cdade-e185-4b5b-b170-46a0b3ed7787', '電話での会話 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '55e3c9a7-b332-4370-8827-49043a038dc8', '061cdade-e185-4b5b-b170-46a0b3ed7787', '電話での会話 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a6c01045-419a-4ac7-ab44-90186cb5eb2d', '061cdade-e185-4b5b-b170-46a0b3ed7787', '電話での会話 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'ac87eef2-24a2-4f3f-adc3-fb609acf1035', 'ja', '病院で', 'At the Hospital', '頭が痛いです', '🏥', 7, 'health', '#C9553D', 7)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4c201d0f-24df-47bc-b8f2-220d496a09d6', 'ac87eef2-24a2-4f3f-adc3-fb609acf1035', '病院で - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4794f145-c0c3-4eef-a12b-b88a65189796', 'ac87eef2-24a2-4f3f-adc3-fb609acf1035', '病院で - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '43ec5c84-961b-4f2b-ab6b-bfa13030b147', 'ac87eef2-24a2-4f3f-adc3-fb609acf1035', '病院で - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7eb9c4cb-7d63-46f1-9b10-a93068cb67cd', 'ac87eef2-24a2-4f3f-adc3-fb609acf1035', '病院で - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9198419a-691d-4c12-aef7-396bb3fbab1e', 'ac87eef2-24a2-4f3f-adc3-fb609acf1035', '病院で - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2edee198-7d21-40eb-aaa8-9c46d47ad321', 'ac87eef2-24a2-4f3f-adc3-fb609acf1035', '病院で - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '89d0b04f-9ed4-4da8-bf35-a988829fda13', 'ac87eef2-24a2-4f3f-adc3-fb609acf1035', '病院で - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'be0d2a7e-82fa-462e-be44-a8e8d25ae5e1', 'ac87eef2-24a2-4f3f-adc3-fb609acf1035', '病院で - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e8cc33b6-eb0d-4c84-8a79-0f0305522f0e', 'ac87eef2-24a2-4f3f-adc3-fb609acf1035', '病院で - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fb102185-6efa-4f0d-b41b-94d59e4b85d6', 'ac87eef2-24a2-4f3f-adc3-fb609acf1035', '病院で - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '98b60505-25ae-45bd-bae0-af5ed15b7b0e', 'ja', '友達との会話', 'Chatting with Friends', '週末何する？', '💬', 8, 'daily', '#5B9A8F', 8)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2574199b-9da5-44da-93f4-fbe1e65ec001', '98b60505-25ae-45bd-bae0-af5ed15b7b0e', '友達との会話 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '438feb3f-c8a4-445f-94f0-8f43874b0459', '98b60505-25ae-45bd-bae0-af5ed15b7b0e', '友達との会話 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a898589f-7e8d-4689-b8cd-bd13479375d5', '98b60505-25ae-45bd-bae0-af5ed15b7b0e', '友達との会話 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1ab4fe87-ff87-4464-8d69-544c157703f3', '98b60505-25ae-45bd-bae0-af5ed15b7b0e', '友達との会話 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0ef90143-c599-4c26-a5b8-c19f35d16f8f', '98b60505-25ae-45bd-bae0-af5ed15b7b0e', '友達との会話 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bb26815b-06c4-4195-aa98-594f8673ab33', '98b60505-25ae-45bd-bae0-af5ed15b7b0e', '友達との会話 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3b09c47c-fce3-4fcf-ac1f-77a6e87c7a55', '98b60505-25ae-45bd-bae0-af5ed15b7b0e', '友達との会話 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8908b644-8cd6-4f16-9152-e1d05153f849', '98b60505-25ae-45bd-bae0-af5ed15b7b0e', '友達との会話 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a392bfa7-af36-4061-9800-bdf443b6ced1', '98b60505-25ae-45bd-bae0-af5ed15b7b0e', '友達との会話 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f34c74fd-771d-4ad0-90fe-375b6c6e8609', '98b60505-25ae-45bd-bae0-af5ed15b7b0e', '友達との会話 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'db8d65b7-d100-4093-ae2e-1439484d2c26', 'ja', '仕事の面接', 'Job Interview', 'よろしくお願いします', '💼', 9, 'work', '#4A6FA5', 9)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5e6c308b-eb50-4b93-8a64-a432259d7427', 'db8d65b7-d100-4093-ae2e-1439484d2c26', '仕事の面接 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '04c1a238-7c32-41b0-9436-8301c5c8c1a8', 'db8d65b7-d100-4093-ae2e-1439484d2c26', '仕事の面接 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1ceecf85-b206-4f18-909f-9606425f7fa8', 'db8d65b7-d100-4093-ae2e-1439484d2c26', '仕事の面接 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '69173e90-9963-47e6-903c-4694ece3bafd', 'db8d65b7-d100-4093-ae2e-1439484d2c26', '仕事の面接 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f91a499c-9f40-48b7-8be5-134eafb6314f', 'db8d65b7-d100-4093-ae2e-1439484d2c26', '仕事の面接 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f3301cdc-337a-4b7f-b18e-803135f1a50a', 'db8d65b7-d100-4093-ae2e-1439484d2c26', '仕事の面接 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '12582cea-57fe-481f-8144-eeedb443652e', 'db8d65b7-d100-4093-ae2e-1439484d2c26', '仕事の面接 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c241d0e2-4a75-4128-bfb0-e7094a33e26d', 'db8d65b7-d100-4093-ae2e-1439484d2c26', '仕事の面接 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '751278b3-52b8-4506-8bf5-920b6936c51d', 'db8d65b7-d100-4093-ae2e-1439484d2c26', '仕事の面接 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '545d6117-fd6d-40dd-907f-c176ea566b3e', 'db8d65b7-d100-4093-ae2e-1439484d2c26', '仕事の面接 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '162c6656-c128-454e-91a7-a7a701df561b', 'ja', '電車での会話', 'On the Train', '次の駅はどこですか', '🚃', 10, 'travel', '#9B715A', 10)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4b79d4aa-0bf7-43d4-8911-bca869a28a06', '162c6656-c128-454e-91a7-a7a701df561b', '電車での会話 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '179d9690-057e-4471-aca6-0627de823643', '162c6656-c128-454e-91a7-a7a701df561b', '電車での会話 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '95048e6a-d930-4940-8171-e0ac495a1b48', '162c6656-c128-454e-91a7-a7a701df561b', '電車での会話 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '224a3d25-9497-4dc5-846e-a91ca5be749f', '162c6656-c128-454e-91a7-a7a701df561b', '電車での会話 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '97caa856-af3a-445a-a2e8-48cb1ad94b30', '162c6656-c128-454e-91a7-a7a701df561b', '電車での会話 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b4ca5130-7ffa-478b-a3c8-0210d96e26c8', '162c6656-c128-454e-91a7-a7a701df561b', '電車での会話 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e0c4f62a-c64a-4593-b011-a81bb453a561', '162c6656-c128-454e-91a7-a7a701df561b', '電車での会話 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ab65097e-9986-4028-b609-417b51e741cb', '162c6656-c128-454e-91a7-a7a701df561b', '電車での会話 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8d5c2074-2c1e-447a-aa2d-3bc4c44179c7', '162c6656-c128-454e-91a7-a7a701df561b', '電車での会話 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7e614333-6eac-4c6a-aaec-2ed513f7263d', '162c6656-c128-454e-91a7-a7a701df561b', '電車での会話 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '9ac75c97-308e-4cca-9e61-b229d7f084cd', 'en', 'Greetings & Introductions', '问候与介绍', 'Hi, nice to meet you!', '👋', 1, 'daily', '#5B8FA8', 1)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '28919190-bfbd-4d59-9cdd-2079023ecf03', '9ac75c97-308e-4cca-9e61-b229d7f084cd', 'Hello, how are you?', '你好，你好吗？', 'heh-LOH, how ar yoo', 'Standard greeting', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e6c61ecd-6a8f-44d2-b6ea-161437a7a1fe', '9ac75c97-308e-4cca-9e61-b229d7f084cd', 'Nice to meet you', '很高兴认识你', 'nys too meet yoo', 'First meeting', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1c2ef65e-4387-4bf1-b7b3-01863bd9f7aa', '9ac75c97-308e-4cca-9e61-b229d7f084cd', 'My name is John', '我叫John', 'my naym iz Jon', 'Self-introduction', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'df16658f-01f1-4228-a38d-dbacd896adc7', '9ac75c97-308e-4cca-9e61-b229d7f084cd', 'Where are you from?', '你从哪里来？', 'wair ar yoo frum', 'Asking origin', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '93d774f4-b687-40f1-8e9b-7f66f7a8ea7d', '9ac75c97-308e-4cca-9e61-b229d7f084cd', 'I''m from the United States', '我来自美国', 'ime frum thuh yoo-NY-ted stayts', 'Answering origin', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7de2cc82-f4b9-4222-9dd8-e6c791bf643e', '9ac75c97-308e-4cca-9e61-b229d7f084cd', 'What do you do?', '你做什么工作？', 'wut doo yoo doo', 'Asking occupation', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd3999cfc-6ff2-40ec-b86e-b6ecab37b00a', '9ac75c97-308e-4cca-9e61-b229d7f084cd', 'I work as a teacher', '我是老师', 'eye wurk az uh TEE-chur', 'Answering occupation', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2ca1f165-e873-4732-801e-22b4fa28a7e3', '9ac75c97-308e-4cca-9e61-b229d7f084cd', 'How''s the weather today?', '今天天气怎么样？', 'howz thuh WEH-thur tuh-DAY', 'Small talk', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fed6a899-f391-45aa-9fca-daa6043e16c6', '9ac75c97-308e-4cca-9e61-b229d7f084cd', 'It''s nice to see you again', '很高兴再次见到你', 'its nys too see yoo uh-GEN', 'Reunion', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1c53454b-3102-4729-93b5-b41be06fc688', '9ac75c97-308e-4cca-9e61-b229d7f084cd', 'Have a great day!', '祝你有美好的一天！', 'hav uh grayt day', 'Parting', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'c988b3b4-1a75-4eb6-a513-4b71e422b8c2', 'en', 'At a Restaurant', '餐厅点餐', 'I''d like to order, please', '🍔', 2, 'food', '#E07B6C', 2)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6999f437-9654-4ed0-be98-1ada04aac47b', 'c988b3b4-1a75-4eb6-a513-4b71e422b8c2', 'Can I see the menu, please?', '我可以看菜单吗？', 'kan eye see thuh MEN-yoo, pleez', 'Asking for menu', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8cd43258-037f-4d8e-9a69-de6c1ac05ba1', 'c988b3b4-1a75-4eb6-a513-4b71e422b8c2', 'I''d like to order now', '我想现在点菜', 'eyed lyk too OR-dur now', 'Ready to order', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '285f82e6-60f1-4075-953a-6b46d678c870', 'c988b3b4-1a75-4eb6-a513-4b71e422b8c2', 'What do you recommend?', '你有什么推荐？', 'wut doo yoo reh-kuh-MEND', 'Asking recommendation', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b75024fa-0fce-4d8d-8628-d15a432763b9', 'c988b3b4-1a75-4eb6-a513-4b71e422b8c2', 'I''ll have the steak, please', '我要一份牛排', 'eyel hav thuh stayk, pleez', 'Ordering', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7fc0dac3-e233-42e3-9c77-8ef9a45cb57f', 'c988b3b4-1a75-4eb6-a513-4b71e422b8c2', 'This is delicious!', '这太好吃了！', 'this iz duh-LIH-shus', 'Complimenting food', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '21f48f14-edbb-4fea-80cc-8c6e8426cf64', 'c988b3b4-1a75-4eb6-a513-4b71e422b8c2', 'Can I get the check, please?', '请给我账单', 'kan eye get thuh chek, pleez', 'Asking for bill', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f83083e8-cb88-4c96-89ca-91f84a649ddc', 'c988b3b4-1a75-4eb6-a513-4b71e422b8c2', 'Let''s split the bill', '我们AA吧', 'lets split thuh bil', 'Splitting bill', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '88404de9-e2d6-476c-8b56-dff136b9f711', 'c988b3b4-1a75-4eb6-a513-4b71e422b8c2', 'Is the tip included?', '小费包含了吗？', 'iz thuh tip in-KLOO-ded', 'Asking about tip', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a49e1fc3-e002-43cb-9030-0cfa54cf71d9', 'c988b3b4-1a75-4eb6-a513-4b71e422b8c2', 'I''m allergic to nuts', '我对坚果过敏', 'ime uh-LUR-jik too nuts', 'Dietary restriction', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e0916523-1646-4776-92ad-0e55b44202a5', 'c988b3b4-1a75-4eb6-a513-4b71e422b8c2', 'Could I have some water?', '可以给我水吗？', 'kood eye hav sum WAH-tur', 'Asking for water', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '86c60c5e-3f5a-42dd-85e8-f021d26a6f63', 'en', 'Asking for Directions', '问路', 'Excuse me, where is the station?', '🗺️', 3, 'travel', '#7A9B71', 3)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2afa3848-eb02-4821-99da-328e6d0e3eb0', '86c60c5e-3f5a-42dd-85e8-f021d26a6f63', 'Asking for Directions - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8c3d4ae3-9f49-4489-bd22-f46164ec1f0f', '86c60c5e-3f5a-42dd-85e8-f021d26a6f63', 'Asking for Directions - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6629e744-476c-48e0-965b-315929f8d22f', '86c60c5e-3f5a-42dd-85e8-f021d26a6f63', 'Asking for Directions - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f2638c19-581a-45df-8e62-09804636f41f', '86c60c5e-3f5a-42dd-85e8-f021d26a6f63', 'Asking for Directions - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'cb2bed4a-b661-4f4f-a2c8-624840428730', '86c60c5e-3f5a-42dd-85e8-f021d26a6f63', 'Asking for Directions - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7e8a259e-b6c6-41ab-a1de-071c7afbffc2', '86c60c5e-3f5a-42dd-85e8-f021d26a6f63', 'Asking for Directions - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4e91f9d5-1305-443b-b82e-334e4f995eae', '86c60c5e-3f5a-42dd-85e8-f021d26a6f63', 'Asking for Directions - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a1d06965-934f-4329-aebb-579d8f7e5975', '86c60c5e-3f5a-42dd-85e8-f021d26a6f63', 'Asking for Directions - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '11d76af4-b34a-4bc8-a6d3-a07f1dae59c6', '86c60c5e-3f5a-42dd-85e8-f021d26a6f63', 'Asking for Directions - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'caef6184-09b9-4b80-853d-627aceb51fe4', '86c60c5e-3f5a-42dd-85e8-f021d26a6f63', 'Asking for Directions - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '80e46e4d-b133-4c75-9e20-c6d5b3170009', 'en', 'Shopping Dialogue', '购物对话', 'How much is this?', '🛍️', 4, 'shopping', '#C97B5A', 4)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9129f3c1-0b82-4424-9ebc-ef03b669d08d', '80e46e4d-b133-4c75-9e20-c6d5b3170009', 'Shopping Dialogue - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7b67bc3e-e9d5-44bc-abf6-27579f4eb79e', '80e46e4d-b133-4c75-9e20-c6d5b3170009', 'Shopping Dialogue - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '121e1fdc-0cb7-48c7-a52a-6b2ec055cb35', '80e46e4d-b133-4c75-9e20-c6d5b3170009', 'Shopping Dialogue - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0631fd18-e440-4d10-b80d-bbee325c8221', '80e46e4d-b133-4c75-9e20-c6d5b3170009', 'Shopping Dialogue - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3334d9bf-7602-4804-b2c2-9138568bcf13', '80e46e4d-b133-4c75-9e20-c6d5b3170009', 'Shopping Dialogue - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '38c9d889-ef14-4429-9fcd-a1b0e7d812ee', '80e46e4d-b133-4c75-9e20-c6d5b3170009', 'Shopping Dialogue - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '72f2391c-4d09-4e0a-9f09-e47e47078f98', '80e46e4d-b133-4c75-9e20-c6d5b3170009', 'Shopping Dialogue - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '39f33b18-7033-439b-8cfe-53d856983527', '80e46e4d-b133-4c75-9e20-c6d5b3170009', 'Shopping Dialogue - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '10e8a0b8-318a-4a17-89f2-5cc4a295d4b2', '80e46e4d-b133-4c75-9e20-c6d5b3170009', 'Shopping Dialogue - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'de85ca8c-0f7d-4799-ba39-e512793bed03', '80e46e4d-b133-4c75-9e20-c6d5b3170009', 'Shopping Dialogue - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '806cd44d-3e8a-4c08-b3b5-644760ecd89b', 'en', 'Hotel Check-in', '酒店入住', 'I have a reservation', '🏨', 5, 'travel', '#8B7BA8', 5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1fee79b1-b57b-4f33-b017-863631dbc215', '806cd44d-3e8a-4c08-b3b5-644760ecd89b', 'Hotel Check-in - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '37cbe62c-dfcf-445b-8858-364c46d1d77d', '806cd44d-3e8a-4c08-b3b5-644760ecd89b', 'Hotel Check-in - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b4fd7a3e-66f0-4f63-8acf-07f811481aeb', '806cd44d-3e8a-4c08-b3b5-644760ecd89b', 'Hotel Check-in - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e4fe9ae7-0e10-4bbd-bfea-1dc4cfa33e42', '806cd44d-3e8a-4c08-b3b5-644760ecd89b', 'Hotel Check-in - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e301b2bd-e59a-468c-8d12-6d46dced370c', '806cd44d-3e8a-4c08-b3b5-644760ecd89b', 'Hotel Check-in - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '29c0d17c-2461-418f-90d9-dfe236ccac04', '806cd44d-3e8a-4c08-b3b5-644760ecd89b', 'Hotel Check-in - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8d835f73-3d00-40ee-b6ea-b5fc7db2040d', '806cd44d-3e8a-4c08-b3b5-644760ecd89b', 'Hotel Check-in - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '03f1d929-f7bf-4a8b-a4f5-4767dd90f2ed', '806cd44d-3e8a-4c08-b3b5-644760ecd89b', 'Hotel Check-in - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3ca03b86-1b43-4dcf-b016-67933634bbf2', '806cd44d-3e8a-4c08-b3b5-644760ecd89b', 'Hotel Check-in - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '24df7ff6-d7b7-49f0-a53c-4b45193d9c7b', '806cd44d-3e8a-4c08-b3b5-644760ecd89b', 'Hotel Check-in - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'f49d1e1b-d50b-423c-a258-c30368bf9fbd', 'en', 'Phone Conversation', '电话交谈', 'Hello, this is John speaking', '📞', 6, 'daily', '#A87B8B', 6)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1d4562a7-266d-4f39-91d8-bd8469824aa0', 'f49d1e1b-d50b-423c-a258-c30368bf9fbd', 'Phone Conversation - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7b781cbe-06c2-4490-be16-ac5bae22cea7', 'f49d1e1b-d50b-423c-a258-c30368bf9fbd', 'Phone Conversation - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'da3db6ea-aef6-4e65-a515-293643c52b3f', 'f49d1e1b-d50b-423c-a258-c30368bf9fbd', 'Phone Conversation - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f2e6c0d2-b64c-49f7-b04b-9313ffbdac69', 'f49d1e1b-d50b-423c-a258-c30368bf9fbd', 'Phone Conversation - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ad99a80d-dea6-4361-9e98-67687dfd8f58', 'f49d1e1b-d50b-423c-a258-c30368bf9fbd', 'Phone Conversation - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4e888426-1a6b-474f-9c93-ef76d8763170', 'f49d1e1b-d50b-423c-a258-c30368bf9fbd', 'Phone Conversation - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '06c27e56-1326-44b6-9fe2-5a46936161aa', 'f49d1e1b-d50b-423c-a258-c30368bf9fbd', 'Phone Conversation - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9d09e409-1bee-405e-84c1-840fd579e034', 'f49d1e1b-d50b-423c-a258-c30368bf9fbd', 'Phone Conversation - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '05908fb9-2b28-412b-8154-1cdce97bfe10', 'f49d1e1b-d50b-423c-a258-c30368bf9fbd', 'Phone Conversation - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5a3950ca-c2c5-4500-a507-56e1a84f74e7', 'f49d1e1b-d50b-423c-a258-c30368bf9fbd', 'Phone Conversation - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '43a4d07b-91a2-4b21-9924-e8c1860f5feb', 'en', 'At the Doctor', '看医生', 'I don''t feel well', '🏥', 7, 'health', '#C9553D', 7)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bbb58e7d-7b70-4fee-9ca7-1cf87564a0af', '43a4d07b-91a2-4b21-9924-e8c1860f5feb', 'At the Doctor - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '43818f6f-54fa-4fd1-a2e1-f54f20b7589f', '43a4d07b-91a2-4b21-9924-e8c1860f5feb', 'At the Doctor - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '159ff283-2de9-4134-985d-081a58501032', '43a4d07b-91a2-4b21-9924-e8c1860f5feb', 'At the Doctor - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2de3ef09-ef31-4374-b473-fc746b8a74f7', '43a4d07b-91a2-4b21-9924-e8c1860f5feb', 'At the Doctor - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd7f9fbf4-1f26-4959-99f9-8dcddcefc81f', '43a4d07b-91a2-4b21-9924-e8c1860f5feb', 'At the Doctor - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6d0dcb67-e75b-4f51-a51b-01b39cd0b432', '43a4d07b-91a2-4b21-9924-e8c1860f5feb', 'At the Doctor - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '98840011-c0cc-40f8-bc97-dcb79f081299', '43a4d07b-91a2-4b21-9924-e8c1860f5feb', 'At the Doctor - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5cb190c9-c1cc-4fe6-a992-9f13c3d43862', '43a4d07b-91a2-4b21-9924-e8c1860f5feb', 'At the Doctor - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7fd07f5a-bf14-4152-9665-c7cb6b96baa8', '43a4d07b-91a2-4b21-9924-e8c1860f5feb', 'At the Doctor - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1ccbac64-56e2-4d77-b7cd-4adc5a40c7b9', '43a4d07b-91a2-4b21-9924-e8c1860f5feb', 'At the Doctor - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'c183f8bd-0a2f-42a6-a232-909cb03e68d6', 'en', 'Casual Chat', '闲聊', 'What are you up to?', '💬', 8, 'daily', '#5B9A8F', 8)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e4dcb94f-5635-43ca-8bc7-9da3878853fd', 'c183f8bd-0a2f-42a6-a232-909cb03e68d6', 'Casual Chat - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4b300e98-d68e-4e7e-b4c5-2d70cfb6c852', 'c183f8bd-0a2f-42a6-a232-909cb03e68d6', 'Casual Chat - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ec12c76e-f357-4583-98be-5bd8d110e2a5', 'c183f8bd-0a2f-42a6-a232-909cb03e68d6', 'Casual Chat - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c4a10335-0065-4f19-a088-ea24b3838797', 'c183f8bd-0a2f-42a6-a232-909cb03e68d6', 'Casual Chat - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6b3a82a9-f7ce-4a95-8a64-a9553e09b474', 'c183f8bd-0a2f-42a6-a232-909cb03e68d6', 'Casual Chat - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'cbd65dc5-beab-4a08-8891-faf630ef547a', 'c183f8bd-0a2f-42a6-a232-909cb03e68d6', 'Casual Chat - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0b0212e9-0ed6-4f04-9f6d-b20c3d529b9c', 'c183f8bd-0a2f-42a6-a232-909cb03e68d6', 'Casual Chat - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8506da13-1c65-457f-ad06-3e3b94ac8f94', 'c183f8bd-0a2f-42a6-a232-909cb03e68d6', 'Casual Chat - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3f504fae-3fd2-474b-ac91-0ff64cb2ad3f', 'c183f8bd-0a2f-42a6-a232-909cb03e68d6', 'Casual Chat - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6d223ba5-0996-404b-8636-f23105899768', 'c183f8bd-0a2f-42a6-a232-909cb03e68d6', 'Casual Chat - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'c677d07b-b29c-4b35-93f3-c9e740733da5', 'en', 'Job Interview', '工作面试', 'Tell me about yourself', '💼', 9, 'work', '#4A6FA5', 9)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'dd4ebd07-7e7f-43a5-be65-e60c685792b8', 'c677d07b-b29c-4b35-93f3-c9e740733da5', 'Job Interview - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3cd24f73-bd4d-44dc-89d6-4c91bcef82b0', 'c677d07b-b29c-4b35-93f3-c9e740733da5', 'Job Interview - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6648726c-ad80-481e-b7a5-7a06eeaeff00', 'c677d07b-b29c-4b35-93f3-c9e740733da5', 'Job Interview - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '94e796c7-438e-4a70-9514-164292efd487', 'c677d07b-b29c-4b35-93f3-c9e740733da5', 'Job Interview - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e45c81c4-49d3-4bfe-bda8-4d688a2008f3', 'c677d07b-b29c-4b35-93f3-c9e740733da5', 'Job Interview - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4f7c93fd-ff0a-40f0-a3cf-64b60f739261', 'c677d07b-b29c-4b35-93f3-c9e740733da5', 'Job Interview - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1b1e8f55-8c49-4e0e-b105-b1a70c96bd8b', 'c677d07b-b29c-4b35-93f3-c9e740733da5', 'Job Interview - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5a34935a-90b4-4b29-a09e-4b67d91e0e7d', 'c677d07b-b29c-4b35-93f3-c9e740733da5', 'Job Interview - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '59f8871f-e478-4144-bdb7-b3b8c41ac2b0', 'c677d07b-b29c-4b35-93f3-c9e740733da5', 'Job Interview - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ae113537-d5a5-4de5-963d-7956169c2b1d', 'c677d07b-b29c-4b35-93f3-c9e740733da5', 'Job Interview - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'fd084a4f-0c74-43ca-a302-1cea43e3c054', 'en', 'At the Airport', '在机场', 'Where is the check-in counter?', '✈️', 10, 'travel', '#9B715A', 10)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a518bb95-e908-4a2a-84b1-b9c19944040d', 'fd084a4f-0c74-43ca-a302-1cea43e3c054', 'At the Airport - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '647f28ae-ac3b-49a2-aec9-96105a47997d', 'fd084a4f-0c74-43ca-a302-1cea43e3c054', 'At the Airport - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c3e3bb80-956b-4601-8ba5-91ce33478bdc', 'fd084a4f-0c74-43ca-a302-1cea43e3c054', 'At the Airport - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9c594276-1095-4fdc-9aa5-6dc364e245dd', 'fd084a4f-0c74-43ca-a302-1cea43e3c054', 'At the Airport - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9bca933c-b45c-43a8-ad92-1b798d0ce6f9', 'fd084a4f-0c74-43ca-a302-1cea43e3c054', 'At the Airport - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e612a019-fadd-4190-b553-fad91ca9668a', 'fd084a4f-0c74-43ca-a302-1cea43e3c054', 'At the Airport - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a3b61c5c-07cb-42ab-b449-70e2def1f25b', 'fd084a4f-0c74-43ca-a302-1cea43e3c054', 'At the Airport - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0311603b-7938-49e9-8520-c53444606c75', 'fd084a4f-0c74-43ca-a302-1cea43e3c054', 'At the Airport - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5bd6cb59-2685-42f4-84ce-e7a737faf458', 'fd084a4f-0c74-43ca-a302-1cea43e3c054', 'At the Airport - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6630cd74-840d-4948-8ccf-22e4ca4d8905', 'fd084a4f-0c74-43ca-a302-1cea43e3c054', 'At the Airport - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '63517ef2-57bb-4735-9a9a-efa779039734', 'ko', '인사와 자기소개', 'Greetings & Self-intro', '안녕하세요, 저는 민수입니다', '👋', 1, 'daily', '#E07B6C', 1)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ef93875c-e743-4f48-a354-7860e9ac4611', '63517ef2-57bb-4735-9a9a-efa779039734', '안녕하세요', '你好', 'annyeonghaseyo', 'Standard greeting', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2797d751-5b8d-4119-8dfd-2eed0e8d4857', '63517ef2-57bb-4735-9a9a-efa779039734', '처음 뵙겠습니다', '初次见面', 'cheoeum boepgetsseumnida', 'First meeting', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3ba5acd8-3db1-48b9-b382-091ba434191d', '63517ef2-57bb-4735-9a9a-efa779039734', '저는 민수입니다', '我是民秀', 'jeoneun minsuimnida', 'Self-introduction', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b40e39a1-c71e-4c41-bf5f-d8f077d699da', '63517ef2-57bb-4735-9a9a-efa779039734', '어디에서 왔어요?', '你从哪里来？', 'eodieseo wasseoyo?', 'Asking origin', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd0222624-9782-479b-9112-559c5ff7105b', '63517ef2-57bb-4735-9a9a-efa779039734', '한국에서 왔어요', '我从韩国来', 'hangugeseo wasseoyo', 'Answering origin', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '31a704cc-b9c9-4796-b99a-65f9b99e6a48', '63517ef2-57bb-4735-9a9a-efa779039734', '반갑습니다', '很高兴见到你', 'bangapseumnida', 'Pleased to meet', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '95b725e1-7450-455a-b93a-b3b4a4338e0a', '63517ef2-57bb-4735-9a9a-efa779039734', '직업이 뭐예요?', '你做什么工作？', 'jigeobi mwoyeyo?', 'Asking job', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8cf1b2a8-f20e-4408-b293-4bfa75815ef3', '63517ef2-57bb-4735-9a9a-efa779039734', '학생이에요', '我是学生', 'hagsaengieyo', 'Answering job', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1935b077-1a2f-431d-b02e-fd03d884a0a2', '63517ef2-57bb-4735-9a9a-efa779039734', '잘 부탁드립니다', '请多关照', 'jal butakdeurimnida', 'Formal request', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b81da200-cd49-4936-8149-70bc9c7eb308', '63517ef2-57bb-4735-9a9a-efa779039734', '다음에 또 만나요', '下次再见', 'daeume tto mannayo', 'Farewell', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '662109eb-4b28-45b2-83df-d2cb54bbca17', 'ko', '식당에서 주문', 'Ordering at Restaurant', '메뉴 주세요', '🍜', 2, 'food', '#C97B5A', 2)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2a75757c-0399-4611-9c0e-4c299c092a6e', '662109eb-4b28-45b2-83df-d2cb54bbca17', '메뉴 좀 주세요', '请给我菜单', 'menyu jom juseyo', 'Asking menu', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c6dc74c8-b47f-429a-adc9-945be1da595d', '662109eb-4b28-45b2-83df-d2cb54bbca17', '주문할게요', '我要点菜', 'jumunhalgeyo', 'Ready to order', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fa67cc90-3043-46fa-a977-de3cd0ee3a96', '662109eb-4b28-45b2-83df-d2cb54bbca17', '추천 메뉴가 뭐예요?', '推荐菜是什么？', 'chucheon menyuga mwoyeyo?', 'Asking recommendation', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e4254b66-8f42-46b6-a59b-332aa2f9fc18', '662109eb-4b28-45b2-83df-d2cb54bbca17', '불고기 주세요', '请给我烤肉', 'bulgogi juseyo', 'Ordering', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9196d8f4-8ebb-41d5-933b-30b1fa2ff927', '662109eb-4b28-45b2-83df-d2cb54bbca17', '맛있어요!', '很好吃！', 'masisseoyo!', 'Complimenting', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2d2887c4-31f9-43bd-bbb8-40566aeaf94f', '662109eb-4b28-45b2-83df-d2cb54bbca17', '계산서 주세요', '请给我账单', 'gyesanseo juseyo', 'Asking bill', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a91a6194-4a2b-45e7-9ea4-39d0aa84a2d3', '662109eb-4b28-45b2-83df-d2cb54bbca17', '따로 계산할게요', '分开付', 'ttaro gyesanhalgeyo', 'Splitting bill', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '87f07630-c3db-44ce-9410-0b158fcef277', '662109eb-4b28-45b2-83df-d2cb54bbca17', '물 좀 주세요', '请给我水', 'mul jom juseyo', 'Asking water', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b21910b2-0b77-46ea-b888-f725253e2cfb', '662109eb-4b28-45b2-83df-d2cb54bbca17', '매운 음식 괜찮아요?', '辣的可以吗？', 'maeun eumsik gwaenchanayo?', 'Asking spice', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f17c0721-a41f-4d46-954a-cb2f51596e52', '662109eb-4b28-45b2-83df-d2cb54bbca17', '잘 먹었습니다', '吃好了', 'jal meogeotsseumnida', 'After meal', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'dc25093f-c3db-4c73-8a9d-491a0e77e358', 'ko', '길 묻기', 'Asking Directions', '실례합니다, 역이 어디예요?', '🗺️', 3, 'travel', '#5B8FA8', 3)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '40d0f21f-e02a-46d7-b437-4dc04d15b049', 'dc25093f-c3db-4c73-8a9d-491a0e77e358', '길 묻기 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f2b4e3a0-5825-453b-b9cf-9bab41ab5998', 'dc25093f-c3db-4c73-8a9d-491a0e77e358', '길 묻기 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fdbf292d-4917-45a6-873a-5d5ba7038200', 'dc25093f-c3db-4c73-8a9d-491a0e77e358', '길 묻기 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'dbe7958f-e493-4072-a8c9-b1a3c8db38da', 'dc25093f-c3db-4c73-8a9d-491a0e77e358', '길 묻기 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4cf1694b-3f11-410b-b1a6-c6681032f767', 'dc25093f-c3db-4c73-8a9d-491a0e77e358', '길 묻기 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9d74bf27-b931-4df0-886d-30c045db4a59', 'dc25093f-c3db-4c73-8a9d-491a0e77e358', '길 묻기 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8c381bf7-992c-4e50-8238-ac21a0342d72', 'dc25093f-c3db-4c73-8a9d-491a0e77e358', '길 묻기 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7e3c9b4d-0498-41da-b801-6d41e5426ab6', 'dc25093f-c3db-4c73-8a9d-491a0e77e358', '길 묻기 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1054ea40-d5ce-4d1b-b8d1-8e13f7fb2177', 'dc25093f-c3db-4c73-8a9d-491a0e77e358', '길 묻기 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f29ee3c1-64df-4617-83dd-896756d946c2', 'dc25093f-c3db-4c73-8a9d-491a0e77e358', '길 묻기 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'ce28c064-2755-4149-ba4c-a8dd08f3fc41', 'ko', '쇼핑 대화', 'Shopping Conversation', '이거 얼마예요?', '🛍️', 4, 'shopping', '#7A9B71', 4)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b87d134c-2578-422a-b7bd-f48b0a775c4b', 'ce28c064-2755-4149-ba4c-a8dd08f3fc41', '쇼핑 대화 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3a91e44e-3271-4884-9903-e3b7b28c6607', 'ce28c064-2755-4149-ba4c-a8dd08f3fc41', '쇼핑 대화 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '48dcd83a-3060-42e8-9475-4a7b029b0768', 'ce28c064-2755-4149-ba4c-a8dd08f3fc41', '쇼핑 대화 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ec7ac2e4-a590-40a1-910c-44651c6da92e', 'ce28c064-2755-4149-ba4c-a8dd08f3fc41', '쇼핑 대화 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '63097bc0-2c7f-4804-9cd2-78ef828e8d4f', 'ce28c064-2755-4149-ba4c-a8dd08f3fc41', '쇼핑 대화 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fb857601-6cf8-4dda-ae8a-b4378ce07141', 'ce28c064-2755-4149-ba4c-a8dd08f3fc41', '쇼핑 대화 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8dfa4be5-1518-4aa7-a6fe-4a4e067562cf', 'ce28c064-2755-4149-ba4c-a8dd08f3fc41', '쇼핑 대화 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5f49cc7b-4d62-4812-b4f9-93f427cba0ea', 'ce28c064-2755-4149-ba4c-a8dd08f3fc41', '쇼핑 대화 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '741aa95d-de0f-4aeb-956c-868eef02796c', 'ce28c064-2755-4149-ba4c-a8dd08f3fc41', '쇼핑 대화 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ebb104a0-8dc4-4a7e-96b7-ef59b35ded27', 'ce28c064-2755-4149-ba4c-a8dd08f3fc41', '쇼핑 대화 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'bfe18788-1169-40d1-b7b2-aebd70aa4d9d', 'ko', '호텔 체크인', 'Hotel Check-in', '예약했어요', '🏨', 5, 'travel', '#8B7BA8', 5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9a5f8df5-068c-4841-a0d1-b4926eda22c8', 'bfe18788-1169-40d1-b7b2-aebd70aa4d9d', '호텔 체크인 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5165be66-b765-4df4-a312-3b77b7336a19', 'bfe18788-1169-40d1-b7b2-aebd70aa4d9d', '호텔 체크인 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '98fad693-42d4-40f6-a88e-bf7d0b41a404', 'bfe18788-1169-40d1-b7b2-aebd70aa4d9d', '호텔 체크인 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '044e707c-4e0b-481f-aa0c-51500d12b307', 'bfe18788-1169-40d1-b7b2-aebd70aa4d9d', '호텔 체크인 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b75d0649-6d78-4afc-8487-f7c89084a54a', 'bfe18788-1169-40d1-b7b2-aebd70aa4d9d', '호텔 체크인 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f25e32fa-ba6d-418f-a24b-d67176d7d520', 'bfe18788-1169-40d1-b7b2-aebd70aa4d9d', '호텔 체크인 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '15bdc31f-c121-4fd9-be84-87bb4efdfb8c', 'bfe18788-1169-40d1-b7b2-aebd70aa4d9d', '호텔 체크인 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4d675230-0645-41e9-8713-84670f0dcd77', 'bfe18788-1169-40d1-b7b2-aebd70aa4d9d', '호텔 체크인 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'cd785ec7-b98f-457c-89bf-92b04213611d', 'bfe18788-1169-40d1-b7b2-aebd70aa4d9d', '호텔 체크인 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5e591741-04fb-4809-88ae-4bccacd3330d', 'bfe18788-1169-40d1-b7b2-aebd70aa4d9d', '호텔 체크인 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'e833e97f-aa24-470e-9edc-78fb44efffc9', 'ko', '전화 통화', 'Phone Call', '여보세요, 민수입니다', '📞', 6, 'daily', '#A87B8B', 6)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '74515322-dc55-4956-ab7a-b14b0c5cfd03', 'e833e97f-aa24-470e-9edc-78fb44efffc9', '전화 통화 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a494fdec-b4bb-4ec4-a4d7-8d117176e0e4', 'e833e97f-aa24-470e-9edc-78fb44efffc9', '전화 통화 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5df8e8a0-34e5-43c0-bb20-b1d60c24d78b', 'e833e97f-aa24-470e-9edc-78fb44efffc9', '전화 통화 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '46e372ba-e6be-4da8-8e4c-908caa57d005', 'e833e97f-aa24-470e-9edc-78fb44efffc9', '전화 통화 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '549ef2df-7d52-4621-a85a-4e3067673577', 'e833e97f-aa24-470e-9edc-78fb44efffc9', '전화 통화 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '06ca0307-129c-49d1-838f-16cc5f941f61', 'e833e97f-aa24-470e-9edc-78fb44efffc9', '전화 통화 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a13baad3-fde6-4fcd-bf17-871feb622e8b', 'e833e97f-aa24-470e-9edc-78fb44efffc9', '전화 통화 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0d5de1e6-0d25-4bcc-84de-2108100d6aed', 'e833e97f-aa24-470e-9edc-78fb44efffc9', '전화 통화 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'edeaaec6-5be4-405b-a17c-acdc699e7b41', 'e833e97f-aa24-470e-9edc-78fb44efffc9', '전화 통화 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '14d463e2-571d-4580-a07e-ddcdb712ee7e', 'e833e97f-aa24-470e-9edc-78fb44efffc9', '전화 통화 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '5a62c9ee-1871-4634-92d7-ef5e39d718af', 'ko', '병원에서', 'At the Hospital', '머리가 아파요', '🏥', 7, 'health', '#C9553D', 7)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '27d72adf-28c9-48f3-ae2d-edff6b0898fb', '5a62c9ee-1871-4634-92d7-ef5e39d718af', '병원에서 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fd87df98-827a-4359-87d9-4fa28cbc1f06', '5a62c9ee-1871-4634-92d7-ef5e39d718af', '병원에서 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c04097c9-120b-488a-889e-a00b3377ba2c', '5a62c9ee-1871-4634-92d7-ef5e39d718af', '병원에서 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0d56d8da-7ff0-44ed-bd7d-83f3e9f12d32', '5a62c9ee-1871-4634-92d7-ef5e39d718af', '병원에서 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5d868d6b-bd9f-4029-a452-2543c0d6743d', '5a62c9ee-1871-4634-92d7-ef5e39d718af', '병원에서 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6fc95d17-bf42-485f-bbc2-e8bf09a46712', '5a62c9ee-1871-4634-92d7-ef5e39d718af', '병원에서 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '99c0ccf6-ad46-45ac-ae84-e3804e8558a4', '5a62c9ee-1871-4634-92d7-ef5e39d718af', '병원에서 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4edf3f65-9280-4852-bca2-06b3d12eb5e3', '5a62c9ee-1871-4634-92d7-ef5e39d718af', '병원에서 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e28cc8f2-a249-44b3-b137-c697695998f8', '5a62c9ee-1871-4634-92d7-ef5e39d718af', '병원에서 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a6b480ee-7b66-4416-a520-51e8313c29b6', '5a62c9ee-1871-4634-92d7-ef5e39d718af', '병원에서 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'c761c797-8f5f-4011-ad90-51b268f60a01', 'ko', '친구와 대화', 'Chatting with Friends', '주말에 뭐 해?', '💬', 8, 'daily', '#5B9A8F', 8)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9d1b34e1-277a-4338-9906-e53af75a38a6', 'c761c797-8f5f-4011-ad90-51b268f60a01', '친구와 대화 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8bc323cb-1ed8-447a-b522-6b91d5fb7447', 'c761c797-8f5f-4011-ad90-51b268f60a01', '친구와 대화 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3a9ba89e-60b4-4ade-9dfb-f07c41ad136f', 'c761c797-8f5f-4011-ad90-51b268f60a01', '친구와 대화 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6766bfc8-04ca-4769-992b-f26e4e2bfa52', 'c761c797-8f5f-4011-ad90-51b268f60a01', '친구와 대화 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5fefc305-5553-480c-be27-1f9bf8844f29', 'c761c797-8f5f-4011-ad90-51b268f60a01', '친구와 대화 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '323afbba-2c23-4fd3-a9a7-a447c23736b5', 'c761c797-8f5f-4011-ad90-51b268f60a01', '친구와 대화 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'cc161709-7c02-422d-b2a3-8aa3f335bf1d', 'c761c797-8f5f-4011-ad90-51b268f60a01', '친구와 대화 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9c59ca51-c279-40ad-a382-76fdc5ad2dee', 'c761c797-8f5f-4011-ad90-51b268f60a01', '친구와 대화 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '803076be-6093-44cb-a2ed-16099cd1aba0', 'c761c797-8f5f-4011-ad90-51b268f60a01', '친구와 대화 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '67300d0d-8d0d-46c6-bca2-fca9c118a99a', 'c761c797-8f5f-4011-ad90-51b268f60a01', '친구와 대화 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '95e4c666-3264-4e8d-b495-97dc555ba74c', 'ko', '면접', 'Job Interview', '잘 부탁드립니다', '💼', 9, 'work', '#4A6FA5', 9)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e00bc99a-f722-4f53-ab4c-199a4d775778', '95e4c666-3264-4e8d-b495-97dc555ba74c', '면접 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9be2f03f-421f-48dc-957c-93c933e1c3f5', '95e4c666-3264-4e8d-b495-97dc555ba74c', '면접 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c21a830b-59d5-4802-af66-c7661edc1f2e', '95e4c666-3264-4e8d-b495-97dc555ba74c', '면접 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '081f0806-5088-4f4b-a588-424fad01bff3', '95e4c666-3264-4e8d-b495-97dc555ba74c', '면접 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '870a8923-3df3-489f-8267-51a1881363b1', '95e4c666-3264-4e8d-b495-97dc555ba74c', '면접 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd9c1f437-ad1c-40ad-930f-de898de4ad25', '95e4c666-3264-4e8d-b495-97dc555ba74c', '면접 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3fc7858b-8af0-4abf-b907-46eb00f29a1e', '95e4c666-3264-4e8d-b495-97dc555ba74c', '면접 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a9e8b9b7-4c53-472b-a4a2-25b9db36f8cb', '95e4c666-3264-4e8d-b495-97dc555ba74c', '면접 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1090dde9-d685-453b-950e-e2ec63b6b89f', '95e4c666-3264-4e8d-b495-97dc555ba74c', '면접 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '32d1a166-3e74-47cd-8e08-b323beab181b', '95e4c666-3264-4e8d-b495-97dc555ba74c', '면접 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '8994ca82-bbcf-419e-958a-d69ddbd8aa36', 'ko', '지하철에서', 'On the Subway', '다음 역이 어디예요?', '🚇', 10, 'travel', '#9B715A', 10)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '965a64be-fb41-4d0f-aa54-6dbacd482678', '8994ca82-bbcf-419e-958a-d69ddbd8aa36', '지하철에서 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b4eb04de-c4d7-4e0b-93e4-44b63050069b', '8994ca82-bbcf-419e-958a-d69ddbd8aa36', '지하철에서 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0132d9b9-928c-459a-896d-e3fc793faf45', '8994ca82-bbcf-419e-958a-d69ddbd8aa36', '지하철에서 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'dcb8d196-efb0-433c-bdb9-d9e13acb4d9e', '8994ca82-bbcf-419e-958a-d69ddbd8aa36', '지하철에서 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4c1b2d3b-0303-4c3f-87de-aa09e7322671', '8994ca82-bbcf-419e-958a-d69ddbd8aa36', '지하철에서 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9e49a589-e42a-4ba5-ae8d-67218d02a427', '8994ca82-bbcf-419e-958a-d69ddbd8aa36', '지하철에서 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bc9a6b3b-f414-422f-9d19-9492aec07e56', '8994ca82-bbcf-419e-958a-d69ddbd8aa36', '지하철에서 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c7b35443-21ce-43a8-a688-4b13829a8928', '8994ca82-bbcf-419e-958a-d69ddbd8aa36', '지하철에서 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1128a9d8-f971-471b-bbab-d89531bd1a78', '8994ca82-bbcf-419e-958a-d69ddbd8aa36', '지하철에서 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '179d204d-6b57-4db9-b606-aaef1f2a06ac', '8994ca82-bbcf-419e-958a-d69ddbd8aa36', '지하철에서 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '60320c0b-bf26-4b06-bdfa-a355ee7f6b74', 'fr', 'Salutations', '问候介绍', 'Bonjour, je m''appelle Marie', '👋', 1, 'daily', '#E07B6C', 1)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5290a44e-9276-448f-abd5-fff3132d1f07', '60320c0b-bf26-4b06-bdfa-a355ee7f6b74', 'Bonjour, comment allez-vous?', '你好，你好吗？', 'bɔ̃ʒuʁ, kɔmɑ̃ ale vu?', 'Salutation standard', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bc6546e7-6b2d-42bf-bb36-1cb11dba6514', '60320c0b-bf26-4b06-bdfa-a355ee7f6b74', 'Enchanté de vous rencontrer', '很高兴认识你', 'ɑ̃ʃɑ̃te də vu ʁɑ̃kɔ̃tʁe', 'Première rencontre', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c1e63b49-8493-4213-a2b2-c39bd1365761', '60320c0b-bf26-4b06-bdfa-a355ee7f6b74', 'Je m''appelle Marie', '我叫Marie', 'ʒə mapɛl maʁi', 'Présentation', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5c8d0fb1-b131-4357-a46e-8cbeba80e934', '60320c0b-bf26-4b06-bdfa-a355ee7f6b74', 'D''où venez-vous?', '你从哪里来？', 'du vəne vu?', 'Demander l''origine', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd8ec2a83-b62e-4cb4-a33b-71197be0b5bd', '60320c0b-bf26-4b06-bdfa-a355ee7f6b74', 'Je viens de France', '我从法国来', 'ʒə vjɛ̃ də fʁɑ̃s', 'Répondre', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b0a31160-7efd-451a-831a-f742b9bab821', '60320c0b-bf26-4b06-bdfa-a355ee7f6b74', 'Quel est votre métier?', '你做什么工作？', 'kɛl ɛ vɔtʁ metje?', 'Demander métier', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '68f6d37a-b5af-4cb3-9a5a-0d186c83d934', '60320c0b-bf26-4b06-bdfa-a355ee7f6b74', 'Je suis étudiant', '我是学生', 'ʒə sɥi etydjɑ̃', 'Répondre métier', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ce116c8b-3fe4-4863-bbf9-ef1195d44e15', '60320c0b-bf26-4b06-bdfa-a355ee7f6b74', 'Quel temps fait-il?', '天气怎么样？', 'kɛl tɑ̃ fɛ til?', 'Parler météo', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '83aa0552-b680-41ac-a269-4b16364182ac', '60320c0b-bf26-4b06-bdfa-a355ee7f6b74', 'Ravi de vous revoir', '很高兴再次见到你', 'ʁavi də vu ʁəvwaʁ', 'Retrouvailles', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '68522d0f-67d9-4aaa-85f0-76f722a5d948', '60320c0b-bf26-4b06-bdfa-a355ee7f6b74', 'Bonne journée!', '祝你有美好的一天！', 'bɔn ʒuʁne!', 'Au revoir', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '4de27348-b120-4d9a-8c35-57edec91c6c1', 'fr', 'Au Restaurant', '餐厅点餐', 'Je voudrais commander', '🥐', 2, 'food', '#C97B5A', 2)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '72e39a1d-0226-4116-88e4-c77561f403f5', '4de27348-b120-4d9a-8c35-57edec91c6c1', 'Puis-je voir le menu?', '可以看菜单吗？', 'pɥiʒ vwaʁ lə məny?', 'Demander menu', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd7b278ae-73ce-4de8-9327-425d426c58b4', '4de27348-b120-4d9a-8c35-57edec91c6c1', 'Je voudrais commander', '我想点菜', 'ʒə vudʁɛ kɔmɑ̃de', 'Commander', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd728f42a-0994-4174-a1da-84064c566184', '4de27348-b120-4d9a-8c35-57edec91c6c1', 'Que recommandez-vous?', '有什么推荐？', 'kə ʁəkɔmɑ̃de vu?', 'Demander conseil', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9492758a-f237-4ae0-8ec7-393c1807a3ec', '4de27348-b120-4d9a-8c35-57edec91c6c1', 'Je prendrai le steak', '我要牛排', 'ʒə pʁɑ̃dʁe lə stɛk', 'Commander plat', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '360aa8f2-3be6-4841-9418-32ad2cb25873', '4de27348-b120-4d9a-8c35-57edec91c6c1', 'C''est délicieux!', '很好吃！', 'sɛ delisjø!', 'Complimenter', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '513a1c96-e5ea-4e35-9278-bc5cb1b3d44c', '4de27348-b120-4d9a-8c35-57edec91c6c1', 'L''addition, s''il vous plaît', '请给我账单', 'ladisjɔ̃ sil vu plɛ', 'Demander addition', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '477d4259-b539-4754-a374-ce11b70baac3', '4de27348-b120-4d9a-8c35-57edec91c6c1', 'On partage?', '我们AA？', 'ɔ̃ paʁtaʒ?', 'Partager addition', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c8ca3b1b-7186-44cc-9cc7-41255f003cd8', '4de27348-b120-4d9a-8c35-57edec91c6c1', 'De l''eau, s''il vous plaît', '请给我水', 'də lo sil vu plɛ', 'Demander eau', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '55386c6c-0cc5-4dc2-82ae-91bea068a771', '4de27348-b120-4d9a-8c35-57edec91c6c1', 'Je suis allergique aux noix', '我对坚果过敏', 'ʒə sɥi alɛʁʒik o nwa', 'Allergie', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd83426e5-27d5-4c9b-aea4-57be5dccc7bc', '4de27348-b120-4d9a-8c35-57edec91c6c1', 'C''était très bon, merci!', '很好吃，谢谢！', 'setɛ tʁɛ bɔ̃ mɛʁsi!', 'Remercier', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'c3968a2b-ba25-4133-b8ee-4db242a45e87', 'fr', 'Demander son chemin', '问路', 'Excusez-moi, où est la gare?', '🗺️', 3, 'travel', '#5B8FA8', 3)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '17411565-aba3-4257-9b8c-d045e189617b', 'c3968a2b-ba25-4133-b8ee-4db242a45e87', 'Demander son chemin - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bb124488-26e4-4d2d-bb28-c6193cdffd76', 'c3968a2b-ba25-4133-b8ee-4db242a45e87', 'Demander son chemin - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '60fd5b34-3076-4aab-bec5-c4fdd861f039', 'c3968a2b-ba25-4133-b8ee-4db242a45e87', 'Demander son chemin - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '47c0e4fe-77e0-4980-8baa-17bf8be2e00d', 'c3968a2b-ba25-4133-b8ee-4db242a45e87', 'Demander son chemin - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bc3048e8-8659-43a2-9d2a-64161db80343', 'c3968a2b-ba25-4133-b8ee-4db242a45e87', 'Demander son chemin - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a3f0b2f5-4d16-4c67-af70-6471a8902633', 'c3968a2b-ba25-4133-b8ee-4db242a45e87', 'Demander son chemin - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ccf449e9-5720-4448-a8cb-3ec485984486', 'c3968a2b-ba25-4133-b8ee-4db242a45e87', 'Demander son chemin - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '147611f4-11eb-4886-b647-2a7651c99ce4', 'c3968a2b-ba25-4133-b8ee-4db242a45e87', 'Demander son chemin - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6dc4cc29-2024-40f6-9c75-ce33de8f9dbe', 'c3968a2b-ba25-4133-b8ee-4db242a45e87', 'Demander son chemin - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1f79328c-4073-48b1-8d11-769d4a0d0b84', 'c3968a2b-ba25-4133-b8ee-4db242a45e87', 'Demander son chemin - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'e3f20a24-232f-46d3-92b5-39727418db62', 'fr', 'Faire du shopping', '购物', 'Combien ça coûte?', '🛍️', 4, 'shopping', '#7A9B71', 4)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd33fb924-b060-4b59-b6ec-c72921a38e7f', 'e3f20a24-232f-46d3-92b5-39727418db62', 'Faire du shopping - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f25d265a-f7a8-49cd-bc6b-33c3684df1e4', 'e3f20a24-232f-46d3-92b5-39727418db62', 'Faire du shopping - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9516c309-7f6b-47f9-95c7-c79232e573d6', 'e3f20a24-232f-46d3-92b5-39727418db62', 'Faire du shopping - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3273e8aa-f3ad-4674-8cb9-09a600044d15', 'e3f20a24-232f-46d3-92b5-39727418db62', 'Faire du shopping - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b250e281-9cf1-4d58-9286-fa1a3a7de01c', 'e3f20a24-232f-46d3-92b5-39727418db62', 'Faire du shopping - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '48c95c1f-b750-4363-8ef0-c3ffdeaa2039', 'e3f20a24-232f-46d3-92b5-39727418db62', 'Faire du shopping - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c9e4ab8c-13f2-435d-b0ed-5cfd036c585b', 'e3f20a24-232f-46d3-92b5-39727418db62', 'Faire du shopping - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '90574d1b-47da-4a57-9c82-1ff5ec2fc2f8', 'e3f20a24-232f-46d3-92b5-39727418db62', 'Faire du shopping - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '30327d17-d157-470a-9db5-98154d90791a', 'e3f20a24-232f-46d3-92b5-39727418db62', 'Faire du shopping - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '457302f9-378d-4c7b-b6f2-872dee1c94c5', 'e3f20a24-232f-46d3-92b5-39727418db62', 'Faire du shopping - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'd258c164-4cee-4d72-b721-d2abff326392', 'fr', 'À l''Hôtel', '酒店入住', 'J''ai une réservation', '🏨', 5, 'travel', '#8B7BA8', 5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9d64da0f-8319-47e3-b654-e1d51a258839', 'd258c164-4cee-4d72-b721-d2abff326392', 'À l''Hôtel - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd6a5002c-734f-49b1-a897-dc41b186f703', 'd258c164-4cee-4d72-b721-d2abff326392', 'À l''Hôtel - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '288d9e9c-2de1-43fd-9681-1b0c71205f7d', 'd258c164-4cee-4d72-b721-d2abff326392', 'À l''Hôtel - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '626f4e7e-a6aa-4ef2-ae49-b80cc17f972a', 'd258c164-4cee-4d72-b721-d2abff326392', 'À l''Hôtel - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '52e50d20-751e-4f84-99d7-b3285b1bc33a', 'd258c164-4cee-4d72-b721-d2abff326392', 'À l''Hôtel - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6ed5d9c9-9892-4081-949c-d841c0346f2e', 'd258c164-4cee-4d72-b721-d2abff326392', 'À l''Hôtel - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '50fb72be-a42b-4e11-9287-29b6055059ca', 'd258c164-4cee-4d72-b721-d2abff326392', 'À l''Hôtel - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5444a01e-d9ec-4b72-a1b3-39942bc4437b', 'd258c164-4cee-4d72-b721-d2abff326392', 'À l''Hôtel - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7f4dd015-865a-4c87-8fb0-71ba86b1bdd2', 'd258c164-4cee-4d72-b721-d2abff326392', 'À l''Hôtel - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'dab5d568-c410-4d36-aad4-a1e5c0e1fdc7', 'd258c164-4cee-4d72-b721-d2abff326392', 'À l''Hôtel - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'cabd60d1-07ee-45f3-9ed7-5f04aa4b96fa', 'fr', 'Au Téléphone', '电话', 'Allô, c''est Marie', '📞', 6, 'daily', '#A87B8B', 6)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a96a3409-6278-40ba-80e2-4c2fa15df118', 'cabd60d1-07ee-45f3-9ed7-5f04aa4b96fa', 'Au Téléphone - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '16839e2e-e506-4625-9d53-cfebca8970f2', 'cabd60d1-07ee-45f3-9ed7-5f04aa4b96fa', 'Au Téléphone - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '45968cd8-d207-4fba-94f4-4c3f40d9f99b', 'cabd60d1-07ee-45f3-9ed7-5f04aa4b96fa', 'Au Téléphone - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c21dc09c-26f2-4c68-9422-2ed2e89a641a', 'cabd60d1-07ee-45f3-9ed7-5f04aa4b96fa', 'Au Téléphone - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '71c0fbcb-336f-4682-892e-5ba8d3c39131', 'cabd60d1-07ee-45f3-9ed7-5f04aa4b96fa', 'Au Téléphone - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '83123de4-a05d-495e-bf3e-db4353401e90', 'cabd60d1-07ee-45f3-9ed7-5f04aa4b96fa', 'Au Téléphone - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bd5ba7dc-0d9f-4407-bf06-c4e44155583e', 'cabd60d1-07ee-45f3-9ed7-5f04aa4b96fa', 'Au Téléphone - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '232533fe-e6fb-468e-a9e1-c092927409bb', 'cabd60d1-07ee-45f3-9ed7-5f04aa4b96fa', 'Au Téléphone - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e5e71832-6aa8-43db-998d-8093c39d8928', 'cabd60d1-07ee-45f3-9ed7-5f04aa4b96fa', 'Au Téléphone - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '86f93d9e-6e43-48af-a79d-cb22180e847d', 'cabd60d1-07ee-45f3-9ed7-5f04aa4b96fa', 'Au Téléphone - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '3e3d1e65-6857-474d-a9cc-cdcdba4c2e0e', 'fr', 'Chez le Médecin', '看医生', 'Je ne me sens pas bien', '🏥', 7, 'health', '#C9553D', 7)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f2137ee6-e409-4444-bdcd-50ce88534fd0', '3e3d1e65-6857-474d-a9cc-cdcdba4c2e0e', 'Chez le Médecin - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4ff4e431-05da-418c-827a-d56b2a00cb44', '3e3d1e65-6857-474d-a9cc-cdcdba4c2e0e', 'Chez le Médecin - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'aa4905ab-2768-40c8-bf3d-d0997c20e700', '3e3d1e65-6857-474d-a9cc-cdcdba4c2e0e', 'Chez le Médecin - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'cc746030-f902-4e6d-a352-fc5ee81ab741', '3e3d1e65-6857-474d-a9cc-cdcdba4c2e0e', 'Chez le Médecin - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e1ba4cc0-269d-4cdf-aac3-b5e6f107ca06', '3e3d1e65-6857-474d-a9cc-cdcdba4c2e0e', 'Chez le Médecin - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1af655a3-1eef-4d89-a998-476c26e8c02d', '3e3d1e65-6857-474d-a9cc-cdcdba4c2e0e', 'Chez le Médecin - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8b38f85c-b7ea-42bf-b18b-7f3cb31fe1d8', '3e3d1e65-6857-474d-a9cc-cdcdba4c2e0e', 'Chez le Médecin - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3d62428b-2535-4e99-bfd3-54fff540b9bf', '3e3d1e65-6857-474d-a9cc-cdcdba4c2e0e', 'Chez le Médecin - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1af27d2b-6dd0-45fa-83ed-e8069d8b1ece', '3e3d1e65-6857-474d-a9cc-cdcdba4c2e0e', 'Chez le Médecin - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a6f20aa8-754d-4f15-8b8a-6d3a330ca609', '3e3d1e65-6857-474d-a9cc-cdcdba4c2e0e', 'Chez le Médecin - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '7e6bb85b-a088-4bb6-8191-3f56cbc3c70b', 'fr', 'Entre Amis', '朋友聊天', 'Qu''est-ce que tu fais?', '💬', 8, 'daily', '#5B9A8F', 8)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd9d0e933-8371-4746-b9cd-c34abe5afc18', '7e6bb85b-a088-4bb6-8191-3f56cbc3c70b', 'Entre Amis - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '598a1f8d-4f4c-469c-bd5d-a244d80a38f0', '7e6bb85b-a088-4bb6-8191-3f56cbc3c70b', 'Entre Amis - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e98c5ce4-9d93-42d5-8dad-67dafba33063', '7e6bb85b-a088-4bb6-8191-3f56cbc3c70b', 'Entre Amis - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e95df920-c9be-4267-b646-dc75574fd93d', '7e6bb85b-a088-4bb6-8191-3f56cbc3c70b', 'Entre Amis - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e6b360c3-3802-4f2d-ac6a-97f1735c2511', '7e6bb85b-a088-4bb6-8191-3f56cbc3c70b', 'Entre Amis - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '68a3e66a-191d-414c-93ff-688bccc58476', '7e6bb85b-a088-4bb6-8191-3f56cbc3c70b', 'Entre Amis - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4ebb7570-7be9-4f9f-b14f-95fc1cbb2882', '7e6bb85b-a088-4bb6-8191-3f56cbc3c70b', 'Entre Amis - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '28a5ed94-e8a5-41cd-a6d9-cff35485c010', '7e6bb85b-a088-4bb6-8191-3f56cbc3c70b', 'Entre Amis - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '68676e10-ea62-4c09-b7c2-31577708b764', '7e6bb85b-a088-4bb6-8191-3f56cbc3c70b', 'Entre Amis - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '866d300a-18db-432a-880d-4c41e5dfdd65', '7e6bb85b-a088-4bb6-8191-3f56cbc3c70b', 'Entre Amis - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'f8fe9553-9f6e-4e6b-8470-8cb76f340ad6', 'fr', 'Entretien', '面试', 'Parlez-moi de vous', '💼', 9, 'work', '#4A6FA5', 9)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '05ca7e0c-b71d-4f60-a1ec-64eccca13594', 'f8fe9553-9f6e-4e6b-8470-8cb76f340ad6', 'Entretien - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7e0dd66a-561d-43dc-a518-7a8b4e988521', 'f8fe9553-9f6e-4e6b-8470-8cb76f340ad6', 'Entretien - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '60444a2e-d89e-4d29-8120-f2169a10f763', 'f8fe9553-9f6e-4e6b-8470-8cb76f340ad6', 'Entretien - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b358c187-f40e-4df5-ac6a-e60b5898e1ff', 'f8fe9553-9f6e-4e6b-8470-8cb76f340ad6', 'Entretien - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e46e9844-eb8a-4ba7-ac74-ad4527d208cc', 'f8fe9553-9f6e-4e6b-8470-8cb76f340ad6', 'Entretien - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '13db14dd-327a-44a3-b464-b002a2c854e6', 'f8fe9553-9f6e-4e6b-8470-8cb76f340ad6', 'Entretien - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '972ce8dd-71d2-4512-b611-1ab6b986a6aa', 'f8fe9553-9f6e-4e6b-8470-8cb76f340ad6', 'Entretien - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '170d1405-4e46-4acf-af87-99bfaa13db99', 'f8fe9553-9f6e-4e6b-8470-8cb76f340ad6', 'Entretien - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a1ddb0e7-2a62-45b0-9fa4-dced337f6333', 'f8fe9553-9f6e-4e6b-8470-8cb76f340ad6', 'Entretien - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '56a5abcf-cf01-45fa-82dc-20060db9a1e5', 'f8fe9553-9f6e-4e6b-8470-8cb76f340ad6', 'Entretien - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '97f9b007-6ad4-42e8-a8d4-dd588aea6860', 'fr', 'À la Gare', '火车站', 'À quelle heure part le train?', '🚄', 10, 'travel', '#9B715A', 10)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3c4bc9de-2b63-47e4-83af-d065b0a12adb', '97f9b007-6ad4-42e8-a8d4-dd588aea6860', 'À la Gare - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5c10135a-cfa6-4477-b293-a98376d0c8c8', '97f9b007-6ad4-42e8-a8d4-dd588aea6860', 'À la Gare - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0cc379da-8feb-4737-b717-9ad4f876963b', '97f9b007-6ad4-42e8-a8d4-dd588aea6860', 'À la Gare - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7d46e05d-9eb1-4039-8ddb-c6ddf0594acf', '97f9b007-6ad4-42e8-a8d4-dd588aea6860', 'À la Gare - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3902d5ac-d24a-41f2-97ce-374c3a83197b', '97f9b007-6ad4-42e8-a8d4-dd588aea6860', 'À la Gare - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bf1b1a1f-b477-46e9-a9a7-83eae118b683', '97f9b007-6ad4-42e8-a8d4-dd588aea6860', 'À la Gare - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ca6e85b7-ad2a-4391-ae7d-a71e6f8e7cab', '97f9b007-6ad4-42e8-a8d4-dd588aea6860', 'À la Gare - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '354075b7-e14f-46e0-863e-22b0fe936efb', '97f9b007-6ad4-42e8-a8d4-dd588aea6860', 'À la Gare - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7eceb604-270b-4116-b9ab-eefae951b4aa', '97f9b007-6ad4-42e8-a8d4-dd588aea6860', 'À la Gare - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f772d014-ac02-46cd-8cf8-57409a200704', '97f9b007-6ad4-42e8-a8d4-dd588aea6860', 'À la Gare - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'c517bbb1-4060-4bfb-9b7a-6dceb7011582', 'es', 'Saludos', '问候介绍', 'Hola, me llamo Carlos', '👋', 1, 'daily', '#E07B6C', 1)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '16173f52-9141-4059-81d1-780271477650', 'c517bbb1-4060-4bfb-9b7a-6dceb7011582', 'Hola, ¿cómo estás?', '你好，你好吗？', 'ola, komo estas?', 'Saludo estándar', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '30f7ce21-2442-4989-ab8c-9a98c95cacd9', 'c517bbb1-4060-4bfb-9b7a-6dceb7011582', 'Mucho gusto', '很高兴认识你', 'mucho gusto', 'Primer encuentro', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4082e3cf-7f45-4f8e-8f9e-fb1886f55e6b', 'c517bbb1-4060-4bfb-9b7a-6dceb7011582', 'Me llamo Carlos', '我叫Carlos', 'me yamo karlos', 'Presentación', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2e969c6d-4c60-4ea6-9173-ffb9ad3bba06', 'c517bbb1-4060-4bfb-9b7a-6dceb7011582', '¿De dónde eres?', '你从哪里来？', 'de donde eres?', 'Preguntar origen', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b1961652-889d-443b-97bd-c7c61e1cefc6', 'c517bbb1-4060-4bfb-9b7a-6dceb7011582', 'Soy de España', '我来自西班牙', 'soy de espanya', 'Responder origen', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '16ccdd80-03c2-4878-9bb3-7a01c794475d', 'c517bbb1-4060-4bfb-9b7a-6dceb7011582', '¿A qué te dedicas?', '你做什么工作？', 'a ke te dedikas?', 'Preguntar trabajo', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e2edce88-fcd4-4f52-9f49-4a2c93e59caf', 'c517bbb1-4060-4bfb-9b7a-6dceb7011582', 'Soy estudiante', '我是学生', 'soy estudiante', 'Responder trabajo', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fef0ec92-7370-4802-8065-6ecd14eb6b69', 'c517bbb1-4060-4bfb-9b7a-6dceb7011582', '¿Qué tiempo hace?', '天气怎么样？', 'ke tyempo ase?', 'Charlar del tiempo', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '07b1aaf8-d787-4d5e-bde4-3bbdb57e7fc9', 'c517bbb1-4060-4bfb-9b7a-6dceb7011582', 'Qué gusto verte de nuevo', '很高兴再次见到你', 'ke gusto verte de nuevo', 'Reencuentro', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8f5f4907-9619-418c-8e94-01b76f06318b', 'c517bbb1-4060-4bfb-9b7a-6dceb7011582', '¡Que tengas buen día!', '祝你有美好的一天！', 'ke tengas buen dia!', 'Despedida', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '37000e49-0446-4b27-bfc1-0cd574736d62', 'es', 'En el Restaurante', '餐厅', 'Quisiera ordenar, por favor', '🥘', 2, 'food', '#C97B5A', 2)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9403bb06-910b-40f9-8669-d8d7efb84af9', '37000e49-0446-4b27-bfc1-0cd574736d62', '¿Me puede traer el menú?', '可以给我菜单吗？', 'me pwede traer el menu?', 'Pedir menú', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b8b58fdc-5bf1-4a70-8f19-da562bbffda6', '37000e49-0446-4b27-bfc1-0cd574736d62', 'Quisiera ordenar', '我想点菜', 'kisyera ordenar', 'Ordenar', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9c9dfb1e-98c9-4744-94d1-1325ed4eacd3', '37000e49-0446-4b27-bfc1-0cd574736d62', '¿Qué me recomienda?', '有什么推荐？', 'ke me rekomienda?', 'Pedir recomendación', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'dd46615e-d7c5-4479-abb9-6e4a813cf933', '37000e49-0446-4b27-bfc1-0cd574736d62', 'Voy a pedir el bistec', '我要牛排', 'boy a pedir el bistek', 'Ordenar plato', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4782ffa3-7e54-4537-af90-f9e5f807e156', '37000e49-0446-4b27-bfc1-0cd574736d62', '¡Está delicioso!', '很好吃！', 'esta delisyoso!', 'Elogiar comida', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd516e6ee-c7ea-47da-afa8-290fe37b7325', '37000e49-0446-4b27-bfc1-0cd574736d62', 'La cuenta, por favor', '请给我账单', 'la kwenta, por fabor', 'Pedir cuenta', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f3589508-c886-4463-b009-8c6371c2dabc', '37000e49-0446-4b27-bfc1-0cd574736d62', 'Dividimos la cuenta', '我们AA', 'dividimos la kwenta', 'Dividir cuenta', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '37d2d7a7-01d7-468a-a3ee-2918bfbd141d', '37000e49-0446-4b27-bfc1-0cd574736d62', '¿Me trae agua, por favor?', '请给我水', 'me trae agua, por fabor?', 'Pedir agua', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2e2c0a46-6c0f-4927-92af-353481103164', '37000e49-0446-4b27-bfc1-0cd574736d62', 'Soy alérgico a las nueces', '我对坚果过敏', 'soy alerhiko a las nweses', 'Alergia', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6e003f0a-fa09-42b9-8fa3-60f4328c9557', '37000e49-0446-4b27-bfc1-0cd574736d62', '¡Estuvo muy rico, gracias!', '很好吃，谢谢！', 'estuvo muy riko, grasyas!', 'Agradecer', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'e1629e98-8460-4fbc-aea5-0c10e13787a3', 'es', 'Preguntar Direcciones', '问路', 'Disculpe, ¿dónde está la estación?', '🗺️', 3, 'travel', '#5B8FA8', 3)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '774771f0-24ea-4b32-a748-9d416f2d8a3f', 'e1629e98-8460-4fbc-aea5-0c10e13787a3', 'Preguntar Direcciones - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9cef276c-2ba9-4307-aacb-c59734040ef8', 'e1629e98-8460-4fbc-aea5-0c10e13787a3', 'Preguntar Direcciones - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'acc5e77b-c1b4-4748-b9d8-90cb12fb6249', 'e1629e98-8460-4fbc-aea5-0c10e13787a3', 'Preguntar Direcciones - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6e0fb211-c406-4127-91e2-2b0da8d7db6e', 'e1629e98-8460-4fbc-aea5-0c10e13787a3', 'Preguntar Direcciones - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'edb5e100-10e5-43a1-a203-21733b0e7b25', 'e1629e98-8460-4fbc-aea5-0c10e13787a3', 'Preguntar Direcciones - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f5b25a67-401a-478a-8274-a68cb013e572', 'e1629e98-8460-4fbc-aea5-0c10e13787a3', 'Preguntar Direcciones - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0bb640f5-88dc-4c74-88af-a5045491fa77', 'e1629e98-8460-4fbc-aea5-0c10e13787a3', 'Preguntar Direcciones - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3b50aa66-11d6-4d8a-bb03-e53c758bf4bf', 'e1629e98-8460-4fbc-aea5-0c10e13787a3', 'Preguntar Direcciones - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f0815261-5a13-4629-8fa7-32060e73f374', 'e1629e98-8460-4fbc-aea5-0c10e13787a3', 'Preguntar Direcciones - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e1d6b2aa-6a4d-4b1d-8e84-95d61e3d4b58', 'e1629e98-8460-4fbc-aea5-0c10e13787a3', 'Preguntar Direcciones - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'b6614cbc-dc5f-4279-b35f-5610b15623bc', 'es', 'De Compras', '购物', '¿Cuánto cuesta esto?', '🛍️', 4, 'shopping', '#7A9B71', 4)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0f836fa5-17a5-451a-a472-c2f1d389607d', 'b6614cbc-dc5f-4279-b35f-5610b15623bc', 'De Compras - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e83ba3d8-af31-43ed-a95f-227f17fa2598', 'b6614cbc-dc5f-4279-b35f-5610b15623bc', 'De Compras - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8d955c3b-35af-4e77-983f-66a1826c3219', 'b6614cbc-dc5f-4279-b35f-5610b15623bc', 'De Compras - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '71fa4b25-8a28-4de0-be73-a70f55970965', 'b6614cbc-dc5f-4279-b35f-5610b15623bc', 'De Compras - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '05d4ce9b-4913-4548-8d0b-dcf010e6869a', 'b6614cbc-dc5f-4279-b35f-5610b15623bc', 'De Compras - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8f660a92-f044-45b9-9326-9c0d2f8affb0', 'b6614cbc-dc5f-4279-b35f-5610b15623bc', 'De Compras - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4bb1853a-b75a-401f-91f0-e37380597d64', 'b6614cbc-dc5f-4279-b35f-5610b15623bc', 'De Compras - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f1c11261-61af-4de9-a623-43699cc1dd9b', 'b6614cbc-dc5f-4279-b35f-5610b15623bc', 'De Compras - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5603531d-715a-48ec-b32e-20999de5efcb', 'b6614cbc-dc5f-4279-b35f-5610b15623bc', 'De Compras - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7f588dc1-88d3-4128-9e38-c8e9c039ce7e', 'b6614cbc-dc5f-4279-b35f-5610b15623bc', 'De Compras - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '1866c402-bf3d-4bd0-b61b-1b325bfe7abb', 'es', 'En el Hotel', '酒店', 'Tengo una reserva', '🏨', 5, 'travel', '#8B7BA8', 5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '52e7e2b0-f232-4432-abf6-a43c4cabd59f', '1866c402-bf3d-4bd0-b61b-1b325bfe7abb', 'En el Hotel - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6e1145b3-5bf0-4e20-9f08-e62f73bbf987', '1866c402-bf3d-4bd0-b61b-1b325bfe7abb', 'En el Hotel - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1f14895c-ea6e-4389-a959-930d3a9a315f', '1866c402-bf3d-4bd0-b61b-1b325bfe7abb', 'En el Hotel - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bb6b4165-4806-46a5-9f51-43cf8fb1e27a', '1866c402-bf3d-4bd0-b61b-1b325bfe7abb', 'En el Hotel - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ee56d0e6-8d16-4410-ad88-51cde882e353', '1866c402-bf3d-4bd0-b61b-1b325bfe7abb', 'En el Hotel - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bcab875f-386b-4689-a94a-dd57e19a72cb', '1866c402-bf3d-4bd0-b61b-1b325bfe7abb', 'En el Hotel - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '52a9c022-199c-4007-b4e3-e42a23a45c9c', '1866c402-bf3d-4bd0-b61b-1b325bfe7abb', 'En el Hotel - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '26242ddc-d979-4665-a8db-92ff39f002c4', '1866c402-bf3d-4bd0-b61b-1b325bfe7abb', 'En el Hotel - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e6841ddf-bd3e-4c03-a9a5-bdcedbc3c1e1', '1866c402-bf3d-4bd0-b61b-1b325bfe7abb', 'En el Hotel - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'dd54bc0f-613e-4ec4-88f9-60ab33407207', '1866c402-bf3d-4bd0-b61b-1b325bfe7abb', 'En el Hotel - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '205c1a62-b754-4b85-ab6e-7c82be0f7a2b', 'es', 'Por Teléfono', '电话', 'Hola, habla Carlos', '📞', 6, 'daily', '#A87B8B', 6)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e1c91507-6b8c-4f88-8de2-0c3c3dcd5bf0', '205c1a62-b754-4b85-ab6e-7c82be0f7a2b', 'Por Teléfono - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '98776878-0fe4-4124-8e06-27a2e7f569ce', '205c1a62-b754-4b85-ab6e-7c82be0f7a2b', 'Por Teléfono - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c9164e9d-d5f3-42c6-abcd-76b6379f07b7', '205c1a62-b754-4b85-ab6e-7c82be0f7a2b', 'Por Teléfono - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '474a97d6-46be-403d-943f-3c9f83e0fab5', '205c1a62-b754-4b85-ab6e-7c82be0f7a2b', 'Por Teléfono - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '835eaec4-1f8e-4256-b2fd-ca56947dd5a6', '205c1a62-b754-4b85-ab6e-7c82be0f7a2b', 'Por Teléfono - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6d9f1e3c-4397-42ac-859e-f553a6c3a3d0', '205c1a62-b754-4b85-ab6e-7c82be0f7a2b', 'Por Teléfono - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e02f54c9-be78-41b1-bd82-5914b679903b', '205c1a62-b754-4b85-ab6e-7c82be0f7a2b', 'Por Teléfono - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '36ea493f-c399-4769-b2ab-98e9030f33f9', '205c1a62-b754-4b85-ab6e-7c82be0f7a2b', 'Por Teléfono - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3fe2f8ed-4922-4516-9758-2262af21e4fb', '205c1a62-b754-4b85-ab6e-7c82be0f7a2b', 'Por Teléfono - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7940262f-6166-4fa5-a689-1a924425abb1', '205c1a62-b754-4b85-ab6e-7c82be0f7a2b', 'Por Teléfono - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '191816c9-ff35-4269-9625-92df200bca81', 'es', 'En el Médico', '医院', 'No me siento bien', '🏥', 7, 'health', '#C9553D', 7)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bbc27106-0be5-42f0-a778-7509ea468a63', '191816c9-ff35-4269-9625-92df200bca81', 'En el Médico - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7431f6aa-d6c5-4e6f-a2dc-4f0f99912f60', '191816c9-ff35-4269-9625-92df200bca81', 'En el Médico - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ef64e198-8cfe-4424-aab0-1c3ca8998d8e', '191816c9-ff35-4269-9625-92df200bca81', 'En el Médico - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '97ee11d2-34b4-4683-875c-aa5422d76cfa', '191816c9-ff35-4269-9625-92df200bca81', 'En el Médico - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '73364fff-5fec-49a4-888c-606a1971838d', '191816c9-ff35-4269-9625-92df200bca81', 'En el Médico - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'af249e47-8dea-45fc-a609-7193c7ec3552', '191816c9-ff35-4269-9625-92df200bca81', 'En el Médico - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9e91530c-9471-4d67-9211-6881d1a68f85', '191816c9-ff35-4269-9625-92df200bca81', 'En el Médico - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '15e65dfe-7b94-44c3-a91b-2152ef2ff31f', '191816c9-ff35-4269-9625-92df200bca81', 'En el Médico - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1123a2f1-61cd-4c96-9b24-1cd44da4d5a3', '191816c9-ff35-4269-9625-92df200bca81', 'En el Médico - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5e143cf6-ce0a-4317-bb04-25b9db6bdc6c', '191816c9-ff35-4269-9625-92df200bca81', 'En el Médico - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '6136d565-829b-455d-9af0-ffbd647e3aa6', 'es', 'Con Amigos', '朋友', '¿Qué haces el fin de semana?', '💬', 8, 'daily', '#5B9A8F', 8)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd6698452-e8e5-420d-b357-d21650d9c683', '6136d565-829b-455d-9af0-ffbd647e3aa6', 'Con Amigos - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '07124ecc-fda3-459f-9ce0-8a234ad80962', '6136d565-829b-455d-9af0-ffbd647e3aa6', 'Con Amigos - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7e55be69-3dda-4595-b180-fd9798741924', '6136d565-829b-455d-9af0-ffbd647e3aa6', 'Con Amigos - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b04e1233-80a4-4062-98aa-52472a1b84be', '6136d565-829b-455d-9af0-ffbd647e3aa6', 'Con Amigos - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '94314a51-70d2-4fd6-ac7d-11173067bc27', '6136d565-829b-455d-9af0-ffbd647e3aa6', 'Con Amigos - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a3f20079-711e-43c3-a4ed-7dd1d9024c6f', '6136d565-829b-455d-9af0-ffbd647e3aa6', 'Con Amigos - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'afdd95f8-142e-4b11-a7ab-ebbd40b34f2e', '6136d565-829b-455d-9af0-ffbd647e3aa6', 'Con Amigos - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9792ff91-be66-488c-a698-7845688e30ec', '6136d565-829b-455d-9af0-ffbd647e3aa6', 'Con Amigos - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'df40ce7f-cde5-4db0-84a7-8b6845dd88a0', '6136d565-829b-455d-9af0-ffbd647e3aa6', 'Con Amigos - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a2fe007a-6fe8-4c7c-a397-e12fde6ff1fd', '6136d565-829b-455d-9af0-ffbd647e3aa6', 'Con Amigos - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'abe4eed7-e88d-437b-89de-a56e90dabc05', 'es', 'Entrevista', '面试', 'Hábleme de usted', '💼', 9, 'work', '#4A6FA5', 9)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0f8b0093-ffff-456e-9745-13dcc57b215e', 'abe4eed7-e88d-437b-89de-a56e90dabc05', 'Entrevista - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd2c52ccb-d75b-4d4e-9a05-e1f10c3ebd77', 'abe4eed7-e88d-437b-89de-a56e90dabc05', 'Entrevista - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e2b3d4d5-d6cf-4315-bcdf-80b52b2940f7', 'abe4eed7-e88d-437b-89de-a56e90dabc05', 'Entrevista - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a6823667-5191-4088-986d-03161ece6959', 'abe4eed7-e88d-437b-89de-a56e90dabc05', 'Entrevista - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '557a6b4d-2675-4dec-8fc1-5c42901165b9', 'abe4eed7-e88d-437b-89de-a56e90dabc05', 'Entrevista - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f7326092-621d-4610-bb9c-edcafe8ce53c', 'abe4eed7-e88d-437b-89de-a56e90dabc05', 'Entrevista - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9af1c6ff-a095-44f8-aa56-2f3872573ccc', 'abe4eed7-e88d-437b-89de-a56e90dabc05', 'Entrevista - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9c130779-b964-440d-804e-2b342e2b0758', 'abe4eed7-e88d-437b-89de-a56e90dabc05', 'Entrevista - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f287cfdf-15e6-44fb-949e-49e49ae72739', 'abe4eed7-e88d-437b-89de-a56e90dabc05', 'Entrevista - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c94e69ab-ddc9-459d-8787-c7911e1cf15c', 'abe4eed7-e88d-437b-89de-a56e90dabc05', 'Entrevista - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'e2b7461b-75d7-43d4-9323-3f62c729e961', 'es', 'En el Aeropuerto', '机场', '¿Dónde está el mostrador?', '✈️', 10, 'travel', '#9B715A', 10)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2b178729-ff33-4803-993e-a49b7cdba997', 'e2b7461b-75d7-43d4-9323-3f62c729e961', 'En el Aeropuerto - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e791da6c-7003-4d12-8ca9-3df7f06e3ddb', 'e2b7461b-75d7-43d4-9323-3f62c729e961', 'En el Aeropuerto - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '42366dc7-d6ad-45f8-b69a-a5a24c30d901', 'e2b7461b-75d7-43d4-9323-3f62c729e961', 'En el Aeropuerto - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3eaa3a3d-48bc-4154-83db-8446b371f71a', 'e2b7461b-75d7-43d4-9323-3f62c729e961', 'En el Aeropuerto - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8dee7ee5-a833-40dc-bef2-dc3ef702abbe', 'e2b7461b-75d7-43d4-9323-3f62c729e961', 'En el Aeropuerto - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a33fd3fb-f7ea-4e25-af15-ecc367715cff', 'e2b7461b-75d7-43d4-9323-3f62c729e961', 'En el Aeropuerto - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e6b304b5-d820-4a6d-b65f-15827c290ca1', 'e2b7461b-75d7-43d4-9323-3f62c729e961', 'En el Aeropuerto - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '96b15839-4336-4057-b037-b7def92fd74d', 'e2b7461b-75d7-43d4-9323-3f62c729e961', 'En el Aeropuerto - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6ef3ab16-273c-4f3a-8125-6b55cc2dafc1', 'e2b7461b-75d7-43d4-9323-3f62c729e961', 'En el Aeropuerto - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7be4e462-e55e-4283-8428-093da3335295', 'e2b7461b-75d7-43d4-9323-3f62c729e961', 'En el Aeropuerto - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'dd21394c-51df-4a5e-b226-714720926599', 'de', 'Begrüßung', '问候介绍', 'Hallo, ich heiße Anna', '👋', 1, 'daily', '#E07B6C', 1)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1d8d16e3-e110-44f5-be89-2fb0ece4ae17', 'dd21394c-51df-4a5e-b226-714720926599', 'Hallo, wie geht es Ihnen?', '你好，你好吗？', 'halo, vi get es e-nen?', 'Begrüßung', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd27f6463-e990-4cdd-878e-f7bdece32eaf', 'dd21394c-51df-4a5e-b226-714720926599', 'Freut mich, Sie kennenzulernen', '很高兴认识你', 'froyt mikh, zi ke-nen-tsu-ler-nen', 'Erstes Treffen', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '67cbf63f-7824-47a7-853a-f7998437536d', 'dd21394c-51df-4a5e-b226-714720926599', 'Ich heiße Anna', '我叫Anna', 'ikh hai-se a-na', 'Vorstellung', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '73dc4cdd-1b58-494a-a305-2d3be04c88bb', 'dd21394c-51df-4a5e-b226-714720926599', 'Woher kommen Sie?', '你从哪里来？', 'vo-her ko-men zi?', 'Herkunft fragen', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bf47dfaa-907a-44d8-8ab9-094d1d724078', 'dd21394c-51df-4a5e-b226-714720926599', 'Ich komme aus Deutschland', '我来自德国', 'ikh ko-me aus doych-lant', 'Herkunft nennen', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fa85ff38-3170-4dbb-b346-196a7ecfeaac', 'dd21394c-51df-4a5e-b226-714720926599', 'Was machen Sie beruflich?', '你做什么工作？', 'vas ma-khen zi be-ruf-likh?', 'Beruf fragen', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f03e6832-279f-40d1-a975-00530cda6171', 'dd21394c-51df-4a5e-b226-714720926599', 'Ich bin Studentin', '我是学生', 'ikh bin shtu-den-tin', 'Beruf nennen', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '849798e3-dafc-4df4-92f4-bf569003e9bb', 'dd21394c-51df-4a5e-b226-714720926599', 'Wie ist das Wetter heute?', '今天天气怎么样？', 'vi ist das ve-ter hoy-te?', 'Smalltalk', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1ce6fc51-5da9-4d90-ad10-6a767005fcbd', 'dd21394c-51df-4a5e-b226-714720926599', 'Schön, Sie wiederzusehen', '很高兴再次见到你', 'shön, zi vi-der-tsu-ze-en', 'Wiedersehen', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f35e7d53-bc69-4fd5-9c5e-f18ceb7aaa60', 'dd21394c-51df-4a5e-b226-714720926599', 'Einen schönen Tag noch!', '祝你有美好的一天！', 'ai-nen shö-nen tag nokh!', 'Abschied', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '62ac5824-1f09-4908-8deb-288c92e99c5a', 'de', 'Im Restaurant', '餐厅', 'Ich möchte bestellen', '🍺', 2, 'food', '#C97B5A', 2)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8e083281-7cd7-4107-8d74-58454a4f3202', '62ac5824-1f09-4908-8deb-288c92e99c5a', 'Kann ich die Speisekarte sehen?', '可以看菜单吗？', 'kan ikh di shpai-ze-kar-te ze-en?', 'Menü fragen', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f99b09cf-c6d2-49a1-80e8-9b5bb36fd793', '62ac5824-1f09-4908-8deb-288c92e99c5a', 'Ich möchte bestellen', '我想点菜', 'ikh mökh-te be-shte-len', 'Bestellen', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'de78608a-fbae-4cc6-b49c-65f072f60e39', '62ac5824-1f09-4908-8deb-288c92e99c5a', 'Was können Sie empfehlen?', '有什么推荐？', 'vas kö-nen zi emp-fe-len?', 'Empfehlung', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ea9dc7a3-fa0b-406a-9c83-fdf9e2b511cc', '62ac5824-1f09-4908-8deb-288c92e99c5a', 'Ich nehme das Steak', '我要牛排', 'ikh ne-me das steyk', 'Bestellen', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '83c95eb0-ad79-4703-b095-8c983d79ac3e', '62ac5824-1f09-4908-8deb-288c92e99c5a', 'Das schmeckt sehr gut!', '很好吃！', 'das shmekt zer gut!', 'Loben', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fb7be3bb-0e8d-4b5f-8f51-9aac6bc20bbf', '62ac5824-1f09-4908-8deb-288c92e99c5a', 'Die Rechnung, bitte', '请给我账单', 'di rekh-nung, bi-te', 'Rechnung', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3b65feee-c283-4ae6-ad3c-c2b041c16f39', '62ac5824-1f09-4908-8deb-288c92e99c5a', 'Wir zahlen getrennt', '我们AA', 'vir tsa-len ge-trent', 'Getrennt zahlen', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4f317d5a-14e7-4e32-9765-f0ccbe4dfeeb', '62ac5824-1f09-4908-8deb-288c92e99c5a', 'Ein Glas Wasser, bitte', '请给我水', 'ain glas va-ser, bi-te', 'Wasser bitten', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '618c53c7-daca-4f09-bbe3-e502f6721a96', '62ac5824-1f09-4908-8deb-288c92e99c5a', 'Ich bin allergisch gegen Nüsse', '我对坚果过敏', 'ikh bin a-ler-gish ge-gen nü-se', 'Allergie', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c459b6e5-e9dc-440b-a7fe-1decde00e24f', '62ac5824-1f09-4908-8deb-288c92e99c5a', 'Es war sehr lecker, danke!', '很好吃，谢谢！', 'es var zer le-ker, dan-ke!', 'Danken', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'd5a2a275-b867-4df7-843e-750b78943e05', 'de', 'Nach dem Weg fragen', '问路', 'Entschuldigung, wo ist der Bahnhof?', '🗺️', 3, 'travel', '#5B8FA8', 3)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fac14b04-3287-42b5-b545-5008fb601946', 'd5a2a275-b867-4df7-843e-750b78943e05', 'Nach dem Weg fragen - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b53d0b1e-ac0c-4ac7-849f-ea3875dc2f11', 'd5a2a275-b867-4df7-843e-750b78943e05', 'Nach dem Weg fragen - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4a788b28-4ad2-4fe8-b843-337cc62dc038', 'd5a2a275-b867-4df7-843e-750b78943e05', 'Nach dem Weg fragen - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3b3746f7-76d0-4b4f-a12c-9a114579471b', 'd5a2a275-b867-4df7-843e-750b78943e05', 'Nach dem Weg fragen - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fc1c69d5-db97-4cfe-a2a8-bfde656d29b1', 'd5a2a275-b867-4df7-843e-750b78943e05', 'Nach dem Weg fragen - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9d19aa83-272c-4c81-95bb-45f0a7bd5094', 'd5a2a275-b867-4df7-843e-750b78943e05', 'Nach dem Weg fragen - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5624adff-dbae-45d2-8aeb-66db0efb6c67', 'd5a2a275-b867-4df7-843e-750b78943e05', 'Nach dem Weg fragen - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f0599028-e03f-40fc-a63b-a17b3cef3500', 'd5a2a275-b867-4df7-843e-750b78943e05', 'Nach dem Weg fragen - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'cea0b694-c65c-4ff8-ab14-817ac96052d1', 'd5a2a275-b867-4df7-843e-750b78943e05', 'Nach dem Weg fragen - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e45f2a93-c647-4bf8-99e5-89634f26ec63', 'd5a2a275-b867-4df7-843e-750b78943e05', 'Nach dem Weg fragen - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '4feb8f7e-3a66-4682-b64c-fbd0b6336821', 'de', 'Einkaufen', '购物', 'Wie viel kostet das?', '🛍️', 4, 'shopping', '#7A9B71', 4)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1b623ef9-ad26-4803-b659-21abdea7f837', '4feb8f7e-3a66-4682-b64c-fbd0b6336821', 'Einkaufen - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1501db91-caef-4fd0-956d-81c5f55c14f4', '4feb8f7e-3a66-4682-b64c-fbd0b6336821', 'Einkaufen - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3f68dd2d-ea15-4585-bfc7-e27644cc348e', '4feb8f7e-3a66-4682-b64c-fbd0b6336821', 'Einkaufen - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c267dac0-0276-4ebc-80ff-78094f92c899', '4feb8f7e-3a66-4682-b64c-fbd0b6336821', 'Einkaufen - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e97c3515-8709-4f18-be8e-14692d3b28cd', '4feb8f7e-3a66-4682-b64c-fbd0b6336821', 'Einkaufen - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2fa0acdb-308a-45d0-9ebb-6ec56fee13b4', '4feb8f7e-3a66-4682-b64c-fbd0b6336821', 'Einkaufen - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6f9b8925-35f5-4b44-a966-ac7be2056e04', '4feb8f7e-3a66-4682-b64c-fbd0b6336821', 'Einkaufen - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'af547bd5-a31a-4f58-9a30-3c087a3df188', '4feb8f7e-3a66-4682-b64c-fbd0b6336821', 'Einkaufen - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '00acdce6-a066-4cca-aa58-779bde46ebf3', '4feb8f7e-3a66-4682-b64c-fbd0b6336821', 'Einkaufen - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '11848265-3516-49d5-87e5-9c0334e50ef5', '4feb8f7e-3a66-4682-b64c-fbd0b6336821', 'Einkaufen - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '85e526e4-3471-4735-8989-50bb77c4c8b6', 'de', 'Im Hotel', '酒店', 'Ich habe eine Reservierung', '🏨', 5, 'travel', '#8B7BA8', 5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '73bc0f31-e8af-425a-aa00-4b6bbd247e37', '85e526e4-3471-4735-8989-50bb77c4c8b6', 'Im Hotel - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '92eb138e-e3c0-4c38-922f-4bbb8425b3cc', '85e526e4-3471-4735-8989-50bb77c4c8b6', 'Im Hotel - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '04e51e92-4658-4418-9fa7-4eb8f21b233c', '85e526e4-3471-4735-8989-50bb77c4c8b6', 'Im Hotel - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8e4b58aa-6823-41a8-b829-ade89ba3388f', '85e526e4-3471-4735-8989-50bb77c4c8b6', 'Im Hotel - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0fd5244e-c9a8-42d0-96f1-561fcc3f4d49', '85e526e4-3471-4735-8989-50bb77c4c8b6', 'Im Hotel - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1e895020-6465-4140-b316-21013345b523', '85e526e4-3471-4735-8989-50bb77c4c8b6', 'Im Hotel - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a74556c6-286a-464b-a960-f36a89cba82b', '85e526e4-3471-4735-8989-50bb77c4c8b6', 'Im Hotel - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0fe5c3f7-3a5f-4cfc-aecc-7d8b2eab2e9a', '85e526e4-3471-4735-8989-50bb77c4c8b6', 'Im Hotel - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4491ced1-f7d2-469c-bbe2-58937b647eb5', '85e526e4-3471-4735-8989-50bb77c4c8b6', 'Im Hotel - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3ab5d29a-5777-4fd4-a09e-1c21aa83cce0', '85e526e4-3471-4735-8989-50bb77c4c8b6', 'Im Hotel - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '82c0d8a6-3fa3-4f7f-b703-c57afd9f9685', 'de', 'Am Telefon', '电话', 'Hallo, hier ist Anna', '📞', 6, 'daily', '#A87B8B', 6)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '38d59162-3fdf-4283-af2a-1f77fd9bcb37', '82c0d8a6-3fa3-4f7f-b703-c57afd9f9685', 'Am Telefon - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '74c93f4d-d04d-4bbf-92d3-416c946a3090', '82c0d8a6-3fa3-4f7f-b703-c57afd9f9685', 'Am Telefon - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3f7a04bd-3404-4e66-9c56-ac6b66b3935b', '82c0d8a6-3fa3-4f7f-b703-c57afd9f9685', 'Am Telefon - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '67ab4da6-76f0-4888-8b1c-7a5bca884e65', '82c0d8a6-3fa3-4f7f-b703-c57afd9f9685', 'Am Telefon - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '33534260-a4f3-486e-a08a-cb4fdd32bc19', '82c0d8a6-3fa3-4f7f-b703-c57afd9f9685', 'Am Telefon - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6e3659ad-70de-41f8-9ab6-c64bbc400a84', '82c0d8a6-3fa3-4f7f-b703-c57afd9f9685', 'Am Telefon - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8315f2d9-6a11-409a-830f-3b612874844e', '82c0d8a6-3fa3-4f7f-b703-c57afd9f9685', 'Am Telefon - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4e1c09ba-e1d2-4cc5-952a-93277746a1a6', '82c0d8a6-3fa3-4f7f-b703-c57afd9f9685', 'Am Telefon - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e73b13de-3d2a-4425-8b8e-5dca960e92df', '82c0d8a6-3fa3-4f7f-b703-c57afd9f9685', 'Am Telefon - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3fa22eb9-d3a7-4cc5-b947-d2cac8d8c501', '82c0d8a6-3fa3-4f7f-b703-c57afd9f9685', 'Am Telefon - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'a5d35f4c-c2df-4415-948c-92f3dd00682e', 'de', 'Beim Arzt', '医院', 'Ich fühle mich nicht gut', '🏥', 7, 'health', '#C9553D', 7)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e5bf4cf1-c1c8-4922-a50b-5f2c68f6ceaf', 'a5d35f4c-c2df-4415-948c-92f3dd00682e', 'Beim Arzt - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '862aee5d-71c5-45db-9356-52c78f394f47', 'a5d35f4c-c2df-4415-948c-92f3dd00682e', 'Beim Arzt - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '953d0357-9de8-43c4-87e1-2e1c0ad5f3c9', 'a5d35f4c-c2df-4415-948c-92f3dd00682e', 'Beim Arzt - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5c3201cb-2be8-4c1b-9276-9d34e7946ee8', 'a5d35f4c-c2df-4415-948c-92f3dd00682e', 'Beim Arzt - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd573cd14-afef-48cb-b8e3-49787370c675', 'a5d35f4c-c2df-4415-948c-92f3dd00682e', 'Beim Arzt - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c29d47f1-a07d-4d5c-ab1b-3b7e9dca5979', 'a5d35f4c-c2df-4415-948c-92f3dd00682e', 'Beim Arzt - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4c6f77f0-1b3b-47cc-a5c5-3bd7fb40c26c', 'a5d35f4c-c2df-4415-948c-92f3dd00682e', 'Beim Arzt - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1ab1eaf2-0f6f-4e6b-9af3-f5c85d15fee8', 'a5d35f4c-c2df-4415-948c-92f3dd00682e', 'Beim Arzt - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6b896b8b-b160-4858-94e3-970dcfc4ad95', 'a5d35f4c-c2df-4415-948c-92f3dd00682e', 'Beim Arzt - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6e39add8-a49c-4ddb-a184-40bb65e7d4f8', 'a5d35f4c-c2df-4415-948c-92f3dd00682e', 'Beim Arzt - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'ffb30588-6120-40c6-b4ae-0568a88f6d64', 'de', 'Mit Freunden', '朋友', 'Was machst du am Wochenende?', '💬', 8, 'daily', '#5B9A8F', 8)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4bba7e02-60c4-4bf7-8c18-c985aaac4a23', 'ffb30588-6120-40c6-b4ae-0568a88f6d64', 'Mit Freunden - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '64e7b2eb-4d11-4588-98d8-cc1c0d4825ca', 'ffb30588-6120-40c6-b4ae-0568a88f6d64', 'Mit Freunden - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd995837b-5dd7-4693-aa7e-708a9740eb7a', 'ffb30588-6120-40c6-b4ae-0568a88f6d64', 'Mit Freunden - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd0f0c47d-970b-40a5-8f14-8d9234a0f284', 'ffb30588-6120-40c6-b4ae-0568a88f6d64', 'Mit Freunden - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bbde3cd0-4edc-4b4c-a02a-773b31d21105', 'ffb30588-6120-40c6-b4ae-0568a88f6d64', 'Mit Freunden - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '269373f9-b089-4af4-8827-2c9285ef82ac', 'ffb30588-6120-40c6-b4ae-0568a88f6d64', 'Mit Freunden - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '62149f92-1803-4e5e-91e7-1a57cf7116eb', 'ffb30588-6120-40c6-b4ae-0568a88f6d64', 'Mit Freunden - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '44169d5d-c2a7-484b-8096-941b5794f416', 'ffb30588-6120-40c6-b4ae-0568a88f6d64', 'Mit Freunden - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c2bc337d-d358-48aa-8a22-079fcb5ec73e', 'ffb30588-6120-40c6-b4ae-0568a88f6d64', 'Mit Freunden - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '657ab587-4e67-4537-ae4a-fc5b053c6213', 'ffb30588-6120-40c6-b4ae-0568a88f6d64', 'Mit Freunden - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '246ad353-8efa-435b-8113-730437953d1d', 'de', 'Vorstellungsgespräch', '面试', 'Erzählen Sie von sich', '💼', 9, 'work', '#4A6FA5', 9)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'cf2b1bdc-5119-4685-8605-1d8ac85f4940', '246ad353-8efa-435b-8113-730437953d1d', 'Vorstellungsgespräch - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f2be31c5-7741-4340-a03e-66ab39c6f9c4', '246ad353-8efa-435b-8113-730437953d1d', 'Vorstellungsgespräch - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0d4e166f-d505-4dbe-86c7-98d8df031387', '246ad353-8efa-435b-8113-730437953d1d', 'Vorstellungsgespräch - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'aa3ba05a-a7d7-4cf4-92c9-9d642b065a09', '246ad353-8efa-435b-8113-730437953d1d', 'Vorstellungsgespräch - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd170a88e-7925-4855-8718-5640e14c6843', '246ad353-8efa-435b-8113-730437953d1d', 'Vorstellungsgespräch - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5397428c-22df-4a48-ae9d-325ed3822661', '246ad353-8efa-435b-8113-730437953d1d', 'Vorstellungsgespräch - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1627ace9-5850-4ad9-865d-7c1ddb95c9f3', '246ad353-8efa-435b-8113-730437953d1d', 'Vorstellungsgespräch - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '532073ea-008d-4ca3-8e39-2a65b6a00d4d', '246ad353-8efa-435b-8113-730437953d1d', 'Vorstellungsgespräch - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '252506a5-4f14-464c-8d5b-588369fbc5ad', '246ad353-8efa-435b-8113-730437953d1d', 'Vorstellungsgespräch - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6c291ddd-a0ff-4d05-aa18-7ac7e9bd2ef4', '246ad353-8efa-435b-8113-730437953d1d', 'Vorstellungsgespräch - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'a3c35e4f-1590-4d1f-8477-81d11605e75f', 'de', 'Am Bahnhof', '火车站', 'Wann fährt der Zug?', '🚂', 10, 'travel', '#9B715A', 10)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5603b8c5-cc0e-414f-97cc-487a71cf66af', 'a3c35e4f-1590-4d1f-8477-81d11605e75f', 'Am Bahnhof - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'dfe90abb-756e-4858-bde5-a4b9ca373e1c', 'a3c35e4f-1590-4d1f-8477-81d11605e75f', 'Am Bahnhof - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b156ba38-62c5-41b9-a62f-1c1d6b77b0f4', 'a3c35e4f-1590-4d1f-8477-81d11605e75f', 'Am Bahnhof - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '213e0ffd-d7f5-4973-b93f-b1d9d4fe275d', 'a3c35e4f-1590-4d1f-8477-81d11605e75f', 'Am Bahnhof - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6130d02f-2ea3-451a-be63-89efa7ded0f0', 'a3c35e4f-1590-4d1f-8477-81d11605e75f', 'Am Bahnhof - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c0ee877b-a5c2-4b67-b731-d870e19d9b80', 'a3c35e4f-1590-4d1f-8477-81d11605e75f', 'Am Bahnhof - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ff53e023-8f36-4dd9-bec6-c3bdd1a39bf4', 'a3c35e4f-1590-4d1f-8477-81d11605e75f', 'Am Bahnhof - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '46423134-d2c9-429d-98e5-13856f4dcb81', 'a3c35e4f-1590-4d1f-8477-81d11605e75f', 'Am Bahnhof - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '982679de-4d07-4803-9b7f-4414d2a62cab', 'a3c35e4f-1590-4d1f-8477-81d11605e75f', 'Am Bahnhof - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd0787084-180e-43fa-b104-d3236fd6eb3e', 'a3c35e4f-1590-4d1f-8477-81d11605e75f', 'Am Bahnhof - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'b50d4464-cc3c-45ae-9e95-6b74d72438d7', 'it', 'Saluti', '问候介绍', 'Ciao, mi chiamo Marco', '👋', 1, 'daily', '#E07B6C', 1)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8c94eb84-0867-48bc-a15b-8c3a58552b66', 'b50d4464-cc3c-45ae-9e95-6b74d72438d7', 'Ciao, come stai?', '你好，你好吗？', 'chao, kome stai?', 'Saluto', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '10a17ca0-d0d3-4c12-b913-b88e9030d398', 'b50d4464-cc3c-45ae-9e95-6b74d72438d7', 'Piacere di conoscerti', '很高兴认识你', 'pyachere di konosherti', 'Primo incontro', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8ab9dd42-278a-49e4-9ea6-f03c16d5635c', 'b50d4464-cc3c-45ae-9e95-6b74d72438d7', 'Mi chiamo Marco', '我叫Marco', 'mi kyamo marko', 'Presentazione', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1794cc36-95b4-438c-b07e-8687eee2da55', 'b50d4464-cc3c-45ae-9e95-6b74d72438d7', 'Di dove sei?', '你从哪里来？', 'di dove sei?', 'Chiedere origine', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a7c2cb40-eaf3-4bb3-b201-5883f628ca4a', 'b50d4464-cc3c-45ae-9e95-6b74d72438d7', 'Sono italiano', '我是意大利人', 'sono italiano', 'Rispondere origine', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '23c61a25-f8c0-423f-ae92-5ce160d283b2', 'b50d4464-cc3c-45ae-9e95-6b74d72438d7', 'Che lavoro fai?', '你做什么工作？', 'ke lavoro fai?', 'Chiedere lavoro', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b4ed33f9-d2d7-456a-be23-274023fb8a15', 'b50d4464-cc3c-45ae-9e95-6b74d72438d7', 'Sono studente', '我是学生', 'sono studente', 'Rispondere lavoro', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '334d37ef-0403-4e47-8fb9-380997953607', 'b50d4464-cc3c-45ae-9e95-6b74d72438d7', 'Che tempo fa oggi?', '今天天气怎么样？', 'ke tempo fa odji?', 'Parlare del tempo', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9cd4005b-0eaf-435c-a709-0e4e7b8fbf4e', 'b50d4464-cc3c-45ae-9e95-6b74d72438d7', 'Che bello rivederti!', '很高兴再次见到你', 'ke bello rivederti!', 'Rivedersi', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '41218398-c635-4aaa-a18c-1557afe5d2e0', 'b50d4464-cc3c-45ae-9e95-6b74d72438d7', 'Buona giornata!', '祝你有美好的一天！', 'buona djornata!', 'Saluto finale', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'd126543b-9402-4f50-99a2-a3eaba899b2b', 'it', 'Al Ristorante', '餐厅点餐', 'Vorrei ordinare, per favore', '🍝', 2, 'food', '#C97B5A', 2)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '798bc1ae-25d7-4bce-b236-02b5b9f09674', 'd126543b-9402-4f50-99a2-a3eaba899b2b', 'Posso vedere il menù?', '可以看菜单吗？', 'posso vedere il menu?', 'Chiedere menù', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6d0b862c-ca81-41fc-b36e-8f40596c78e5', 'd126543b-9402-4f50-99a2-a3eaba899b2b', 'Vorrei ordinare', '我想点菜', 'vorrei ordinare', 'Ordinare', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'be5382dd-0f65-4ea8-a2cd-8865caccc168', 'd126543b-9402-4f50-99a2-a3eaba899b2b', 'Cosa mi consiglia?', '有什么推荐？', 'koza mi konsilya?', 'Chiedere consiglio', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '73199feb-3095-437b-bf4a-c393da331bc4', 'd126543b-9402-4f50-99a2-a3eaba899b2b', 'Prendo la bistecca', '我要牛排', 'prendo la bistecca', 'Ordinare piatto', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'cd350157-42a3-4824-a0ea-fc2475d20f19', 'd126543b-9402-4f50-99a2-a3eaba899b2b', 'È delizioso!', '很好吃！', 'e delitsyoso!', 'Complimentare', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0387fdc1-85ac-44cc-9dcf-dd07d3157aa7', 'd126543b-9402-4f50-99a2-a3eaba899b2b', 'Il conto, per favore', '请给我账单', 'il konto, per favore', 'Chiedere conto', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'afdebc2d-a296-411d-b4ab-dc84277e1be1', 'd126543b-9402-4f50-99a2-a3eaba899b2b', 'Dividiamo il conto', '我们AA', 'dividyamo il konto', 'Dividere conto', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '62faa058-e47e-4a62-9272-500e521f815a', 'd126543b-9402-4f50-99a2-a3eaba899b2b', 'Un bicchiere d''acqua, per favore', '请给我水', 'un bikkyere dakwa, per favore', 'Chiedere acqua', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6295bb0d-47d3-4b8f-a353-b90da86309b2', 'd126543b-9402-4f50-99a2-a3eaba899b2b', 'Sono allergico alle noci', '我对坚果过敏', 'sono allerdjiko alle nochi', 'Allergia', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '10ebfd78-37d9-4c8d-bbdb-91ae52bb06e2', 'd126543b-9402-4f50-99a2-a3eaba899b2b', 'Era buonissimo, grazie!', '很好吃，谢谢！', 'era buonissimo, gratzie!', 'Ringraziare', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '0722ee85-3568-4b9a-a1ab-509abc6f4b51', 'it', 'Chiedere Indicazioni', '问路', 'Scusi, dov''è la stazione?', '🗺️', 3, 'travel', '#5B8FA8', 3)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '80c6f5ec-024d-4c2c-ab06-b6e23c98e090', '0722ee85-3568-4b9a-a1ab-509abc6f4b51', 'Chiedere Indicazioni - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9bff4545-077d-4601-8142-793813d53846', '0722ee85-3568-4b9a-a1ab-509abc6f4b51', 'Chiedere Indicazioni - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5c67f060-d2c0-4fb6-a0e9-530d987fc47d', '0722ee85-3568-4b9a-a1ab-509abc6f4b51', 'Chiedere Indicazioni - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '660843e0-a3e2-4965-a6c6-07417e06b3b5', '0722ee85-3568-4b9a-a1ab-509abc6f4b51', 'Chiedere Indicazioni - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5b58ff0c-89f7-4ea1-8f1a-bbdab1e02e05', '0722ee85-3568-4b9a-a1ab-509abc6f4b51', 'Chiedere Indicazioni - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '986dca2e-1b88-4426-bc5b-fed79e14b45a', '0722ee85-3568-4b9a-a1ab-509abc6f4b51', 'Chiedere Indicazioni - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '756fe2f2-4394-4898-8f09-a94166ddeba1', '0722ee85-3568-4b9a-a1ab-509abc6f4b51', 'Chiedere Indicazioni - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ee91fbe3-58a5-4420-9bed-057916f65fc2', '0722ee85-3568-4b9a-a1ab-509abc6f4b51', 'Chiedere Indicazioni - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e544b31e-8c5a-4baf-80ae-d374e23e7b20', '0722ee85-3568-4b9a-a1ab-509abc6f4b51', 'Chiedere Indicazioni - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1ed37679-f163-42af-bce8-3d5fd57e0aca', '0722ee85-3568-4b9a-a1ab-509abc6f4b51', 'Chiedere Indicazioni - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'a44fedfb-3a7b-4aae-a1ec-70208aa009e9', 'it', 'Fare Shopping', '购物', 'Quanto costa questo?', '🛍️', 4, 'shopping', '#7A9B71', 4)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8bcfe172-bf17-4ac2-8951-8293a9206368', 'a44fedfb-3a7b-4aae-a1ec-70208aa009e9', 'Fare Shopping - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4e84d064-6941-484e-a70d-9f69401e2e37', 'a44fedfb-3a7b-4aae-a1ec-70208aa009e9', 'Fare Shopping - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '81a6e550-7843-4f3b-95d9-2ee9b30bc89b', 'a44fedfb-3a7b-4aae-a1ec-70208aa009e9', 'Fare Shopping - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd1c5f9ea-afb8-49fa-b817-2ee44906205a', 'a44fedfb-3a7b-4aae-a1ec-70208aa009e9', 'Fare Shopping - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4937779b-21de-40d8-a3f5-40ef73ccf8ed', 'a44fedfb-3a7b-4aae-a1ec-70208aa009e9', 'Fare Shopping - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '805a40e3-23f5-4016-9dda-2f2d48f71d1b', 'a44fedfb-3a7b-4aae-a1ec-70208aa009e9', 'Fare Shopping - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b5cfd261-3157-4ec2-939a-b1ff6e505cb3', 'a44fedfb-3a7b-4aae-a1ec-70208aa009e9', 'Fare Shopping - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f5be7279-7daf-4f00-bfae-cbf77088e621', 'a44fedfb-3a7b-4aae-a1ec-70208aa009e9', 'Fare Shopping - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f8cf54fc-afd6-4440-8819-fec3c6321260', 'a44fedfb-3a7b-4aae-a1ec-70208aa009e9', 'Fare Shopping - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '317c58fd-2c45-4ab3-9ac4-a3504a9c4b64', 'a44fedfb-3a7b-4aae-a1ec-70208aa009e9', 'Fare Shopping - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'd44fa030-ec0d-40a4-83a4-593235d93b88', 'it', 'In Hotel', '酒店入住', 'Ho una prenotazione', '🏨', 5, 'travel', '#8B7BA8', 5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '36c26aa8-85b8-4bb1-a68f-a4e585cb4db6', 'd44fa030-ec0d-40a4-83a4-593235d93b88', 'In Hotel - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '571ac27a-d14e-42a9-ae4c-4a6f69204a86', 'd44fa030-ec0d-40a4-83a4-593235d93b88', 'In Hotel - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '329f6a7c-29f7-41eb-9292-37d690188d93', 'd44fa030-ec0d-40a4-83a4-593235d93b88', 'In Hotel - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '401ca158-bf9d-44d7-bb73-7af9ff3918cf', 'd44fa030-ec0d-40a4-83a4-593235d93b88', 'In Hotel - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f488273a-3203-4f5c-82d1-8f9939d6ea9f', 'd44fa030-ec0d-40a4-83a4-593235d93b88', 'In Hotel - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7106743f-f1f9-4149-bf83-4bddd9c569e4', 'd44fa030-ec0d-40a4-83a4-593235d93b88', 'In Hotel - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '50cb8df5-6bc3-4a66-bc9b-c7b7ce3d1747', 'd44fa030-ec0d-40a4-83a4-593235d93b88', 'In Hotel - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '09db5927-f7b5-4155-904d-5e79be3114e8', 'd44fa030-ec0d-40a4-83a4-593235d93b88', 'In Hotel - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '53d9035a-fbc6-4775-acad-270a65192e53', 'd44fa030-ec0d-40a4-83a4-593235d93b88', 'In Hotel - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c2922609-fef9-434a-b50f-ba6f6b4a9c1e', 'd44fa030-ec0d-40a4-83a4-593235d93b88', 'In Hotel - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '5ffb125f-07b8-4dc7-a093-3a77c7686c61', 'it', 'Al Telefono', '电话', 'Pronto, sono Marco', '📞', 6, 'daily', '#A87B8B', 6)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c4d725be-e40b-4f11-8e8d-b6e56f616591', '5ffb125f-07b8-4dc7-a093-3a77c7686c61', 'Al Telefono - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '633bb011-7cb1-4670-b364-7a74f6acf12b', '5ffb125f-07b8-4dc7-a093-3a77c7686c61', 'Al Telefono - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '23866a7a-5cd6-4556-8390-f9368ecbb262', '5ffb125f-07b8-4dc7-a093-3a77c7686c61', 'Al Telefono - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e898afcc-3074-4409-9ff2-76ce1f4acffd', '5ffb125f-07b8-4dc7-a093-3a77c7686c61', 'Al Telefono - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ccafd76b-ccce-43bd-b6b3-23f9566ddbf4', '5ffb125f-07b8-4dc7-a093-3a77c7686c61', 'Al Telefono - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5158437f-3662-4392-9a86-b43b308ef1bc', '5ffb125f-07b8-4dc7-a093-3a77c7686c61', 'Al Telefono - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'eb47cfb3-6461-4175-b028-21dcbe146102', '5ffb125f-07b8-4dc7-a093-3a77c7686c61', 'Al Telefono - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0b40e369-a3f6-47da-bbed-a876aa9b90c5', '5ffb125f-07b8-4dc7-a093-3a77c7686c61', 'Al Telefono - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5d705ae9-9144-463d-ac8b-9d50c241583b', '5ffb125f-07b8-4dc7-a093-3a77c7686c61', 'Al Telefono - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '297f6e8e-19e8-4eb0-974c-a39f2ceca66d', '5ffb125f-07b8-4dc7-a093-3a77c7686c61', 'Al Telefono - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '4f7236e0-ad17-41a5-b10a-c547b00d7580', 'it', 'Dal Medico', '看医生', 'Non mi sento bene', '🏥', 7, 'health', '#C9553D', 7)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'be46f727-6ef1-4c97-b421-a257c24c6801', '4f7236e0-ad17-41a5-b10a-c547b00d7580', 'Dal Medico - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e81701ea-2b0e-438f-ac00-fab53ef83ea4', '4f7236e0-ad17-41a5-b10a-c547b00d7580', 'Dal Medico - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c1b3ed1d-5efb-48c1-9b79-14d31f867824', '4f7236e0-ad17-41a5-b10a-c547b00d7580', 'Dal Medico - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ebbda5a5-7f45-42f9-aeea-a59f48f160f0', '4f7236e0-ad17-41a5-b10a-c547b00d7580', 'Dal Medico - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9422ec23-9481-456d-8438-b30c62fec4fe', '4f7236e0-ad17-41a5-b10a-c547b00d7580', 'Dal Medico - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '09a83373-1ef7-4f1f-96b7-6cf8c771671b', '4f7236e0-ad17-41a5-b10a-c547b00d7580', 'Dal Medico - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '32f5aad0-5ab5-4fb0-8e09-dc064c708fdf', '4f7236e0-ad17-41a5-b10a-c547b00d7580', 'Dal Medico - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '374facb7-f065-46a6-a877-8df56058236e', '4f7236e0-ad17-41a5-b10a-c547b00d7580', 'Dal Medico - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4756bdfa-6399-4fc2-b77a-18d64f8529c0', '4f7236e0-ad17-41a5-b10a-c547b00d7580', 'Dal Medico - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a78c375d-f3f1-43eb-b7c3-80f782cfb673', '4f7236e0-ad17-41a5-b10a-c547b00d7580', 'Dal Medico - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '48160b72-ffbb-4e81-aa20-3a93def535ed', 'it', 'Tra Amici', '朋友聊天', 'Cosa fai nel weekend?', '💬', 8, 'daily', '#5B9A8F', 8)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7e437b99-b27b-47db-9bd8-00a5318f6aff', '48160b72-ffbb-4e81-aa20-3a93def535ed', 'Tra Amici - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5b4474ad-8985-426c-808a-71d5263d9720', '48160b72-ffbb-4e81-aa20-3a93def535ed', 'Tra Amici - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8afba6a6-87f4-46e7-af68-9479daf6777e', '48160b72-ffbb-4e81-aa20-3a93def535ed', 'Tra Amici - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0896fcdd-08ca-4d43-b0f2-f554aab3c678', '48160b72-ffbb-4e81-aa20-3a93def535ed', 'Tra Amici - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c8509bd9-dd71-4d18-b940-bff974df574d', '48160b72-ffbb-4e81-aa20-3a93def535ed', 'Tra Amici - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9910c3cb-7eea-4e4f-8669-2c0e95dd4ef1', '48160b72-ffbb-4e81-aa20-3a93def535ed', 'Tra Amici - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '782972f5-367c-4ffa-9a49-fc5ecf835215', '48160b72-ffbb-4e81-aa20-3a93def535ed', 'Tra Amici - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7b99785b-c5d8-4968-bb4f-577d3a7dd98e', '48160b72-ffbb-4e81-aa20-3a93def535ed', 'Tra Amici - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7389c68a-8ee1-42dc-b373-64a10dfd04e6', '48160b72-ffbb-4e81-aa20-3a93def535ed', 'Tra Amici - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'eed60153-be51-49bf-9eee-61e6aaf92227', '48160b72-ffbb-4e81-aa20-3a93def535ed', 'Tra Amici - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '0b33c7e0-45ef-4e26-bd0a-f82dc8f00f98', 'it', 'Colloquio di Lavoro', '面试', 'Mi parli di lei', '💼', 9, 'work', '#4A6FA5', 9)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9769b6a0-be0d-4144-bb1a-108a7365b3e3', '0b33c7e0-45ef-4e26-bd0a-f82dc8f00f98', 'Colloquio di Lavoro - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e67ebab9-1615-49e9-a150-79785a1f5d4c', '0b33c7e0-45ef-4e26-bd0a-f82dc8f00f98', 'Colloquio di Lavoro - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f34e0c8d-be4d-4c91-92b4-ae26c29d937b', '0b33c7e0-45ef-4e26-bd0a-f82dc8f00f98', 'Colloquio di Lavoro - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1ee59072-f5f7-43bd-86a9-3a1c6ac556db', '0b33c7e0-45ef-4e26-bd0a-f82dc8f00f98', 'Colloquio di Lavoro - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'cc686613-e79d-4003-ab1b-9cb0a52fc22d', '0b33c7e0-45ef-4e26-bd0a-f82dc8f00f98', 'Colloquio di Lavoro - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'dc28c32b-7046-4064-8987-0e95ade107bb', '0b33c7e0-45ef-4e26-bd0a-f82dc8f00f98', 'Colloquio di Lavoro - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fec73ca6-3bf8-41ac-9880-bd1f140911f3', '0b33c7e0-45ef-4e26-bd0a-f82dc8f00f98', 'Colloquio di Lavoro - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a94b6ff6-7cf4-4ec2-a7d9-37fcb6975eaa', '0b33c7e0-45ef-4e26-bd0a-f82dc8f00f98', 'Colloquio di Lavoro - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '57a437be-5ca5-44a4-b0d3-8e58ec098353', '0b33c7e0-45ef-4e26-bd0a-f82dc8f00f98', 'Colloquio di Lavoro - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7966287e-6147-49d4-b719-99516f3fb01e', '0b33c7e0-45ef-4e26-bd0a-f82dc8f00f98', 'Colloquio di Lavoro - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '6ae0a803-576a-4a87-91a7-3e2dfd6b04fa', 'it', 'Alla Stazione', '火车站', 'A che ora parte il treno?', '🚂', 10, 'travel', '#9B715A', 10)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e8af40cb-120b-471a-b5e9-c0120e99256f', '6ae0a803-576a-4a87-91a7-3e2dfd6b04fa', 'Alla Stazione - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '79243a9f-ff7e-40eb-bbfe-b47874825ea9', '6ae0a803-576a-4a87-91a7-3e2dfd6b04fa', 'Alla Stazione - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '134d1b08-3b52-4bf0-943a-3ac810f785f7', '6ae0a803-576a-4a87-91a7-3e2dfd6b04fa', 'Alla Stazione - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '55f75a94-358d-4283-9b62-1b9b0443c135', '6ae0a803-576a-4a87-91a7-3e2dfd6b04fa', 'Alla Stazione - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b3c5143c-4939-4dd9-9cec-02fff171b16c', '6ae0a803-576a-4a87-91a7-3e2dfd6b04fa', 'Alla Stazione - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9003506e-462e-4eff-88ae-985677efecfa', '6ae0a803-576a-4a87-91a7-3e2dfd6b04fa', 'Alla Stazione - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '443abc19-2811-4691-b9d1-d800da5429e3', '6ae0a803-576a-4a87-91a7-3e2dfd6b04fa', 'Alla Stazione - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '37f55752-8527-4bde-910f-c04bcdca83cc', '6ae0a803-576a-4a87-91a7-3e2dfd6b04fa', 'Alla Stazione - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '545a6659-0ce2-4249-84ba-0724e9f42923', '6ae0a803-576a-4a87-91a7-3e2dfd6b04fa', 'Alla Stazione - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '30ef833f-9361-4272-bfa6-1c737ad6c2cf', '6ae0a803-576a-4a87-91a7-3e2dfd6b04fa', 'Alla Stazione - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'fc9613eb-abbb-42fd-b7ea-9df45cb20665', 'pt', 'Saudações', '问候介绍', 'Olá, me chamo João', '👋', 1, 'daily', '#E07B6C', 1)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd2611979-9dd9-4fd0-9520-c41817312cba', 'fc9613eb-abbb-42fd-b7ea-9df45cb20665', 'Olá, como vai?', '你好，你好吗？', 'ola, komu vai?', 'Saudação', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e00dabf9-303c-4281-a96a-38c47fa4a8bf', 'fc9613eb-abbb-42fd-b7ea-9df45cb20665', 'Prazer em conhecê-lo', '很高兴认识你', 'prazer em konyeselu', 'Primeiro encontro', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0f88db6d-b100-4b94-b61d-d80773891327', 'fc9613eb-abbb-42fd-b7ea-9df45cb20665', 'Me chamo João', '我叫João', 'me shamu zhuau', 'Apresentação', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '15f4cb54-98ef-4487-92be-9c36f4b456c0', 'fc9613eb-abbb-42fd-b7ea-9df45cb20665', 'De onde você é?', '你从哪里来？', 'de onde vose e?', 'Perguntar origem', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '75ed38b3-c472-488c-98a5-e94c49cc6175', 'fc9613eb-abbb-42fd-b7ea-9df45cb20665', 'Sou do Brasil', '我来自巴西', 'so du brazil', 'Responder origem', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b6ee6b98-95c0-41f8-95ff-350c85152cc1', 'fc9613eb-abbb-42fd-b7ea-9df45cb20665', 'O que você faz?', '你做什么工作？', 'o ke vose faz?', 'Perguntar trabalho', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e9ed4b70-345a-48d6-bb32-dc2a4fb18261', 'fc9613eb-abbb-42fd-b7ea-9df45cb20665', 'Sou estudante', '我是学生', 'so estudante', 'Responder trabalho', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2572791d-4add-47cf-8e76-be4f10e1873d', 'fc9613eb-abbb-42fd-b7ea-9df45cb20665', 'Como está o tempo?', '天气怎么样？', 'komu esta u tempu?', 'Falar do tempo', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2b61dcd3-09c6-4355-9e99-42e02fe62039', 'fc9613eb-abbb-42fd-b7ea-9df45cb20665', 'Que bom te ver de novo!', '很高兴再次见到你', 'ke bom te ver de novu!', 'Reencontro', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5294d404-ecc9-46b7-ac34-0d118759109e', 'fc9613eb-abbb-42fd-b7ea-9df45cb20665', 'Tenha um bom dia!', '祝你有美好的一天！', 'tenya um bom dia!', 'Despedida', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'b43c0ef3-abc1-421d-88f4-8836906fefd4', 'pt', 'No Restaurante', '餐厅', 'Quero fazer o pedido', '🍖', 2, 'food', '#C97B5A', 2)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b2779597-ec68-45c1-b781-f3e5ac179730', 'b43c0ef3-abc1-421d-88f4-8836906fefd4', 'Posso ver o cardápio?', '可以看菜单吗？', 'posu ver u kardapiu?', 'Pedir cardápio', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '785342cb-c3b7-4be6-a90a-3b4683d3a3c0', 'b43c0ef3-abc1-421d-88f4-8836906fefd4', 'Quero fazer o pedido', '我想点菜', 'keru fazer u pedidu', 'Fazer pedido', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7bba91d1-38a4-4407-8a7d-c6d3571b4179', 'b43c0ef3-abc1-421d-88f4-8836906fefd4', 'O que você recomenda?', '有什么推荐？', 'o ke vose rekomenda?', 'Pedir recomendação', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c3435dcc-6a48-46f3-b328-68c0cbe48baf', 'b43c0ef3-abc1-421d-88f4-8836906fefd4', 'Vou querer o bife', '我要牛排', 'vo kerer u bifi', 'Pedir prato', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1d7e3def-d569-4c9e-9201-213dbd7548e0', 'b43c0ef3-abc1-421d-88f4-8836906fefd4', 'Está delicioso!', '很好吃！', 'esta delisiozu!', 'Elogiar', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9ca89d05-1bba-4c60-b3ee-82620e91ed42', 'b43c0ef3-abc1-421d-88f4-8836906fefd4', 'A conta, por favor', '请给我账单', 'a konta, por favor', 'Pedir conta', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '57883ed1-8ef4-41fd-a294-69bd056d1285', 'b43c0ef3-abc1-421d-88f4-8836906fefd4', 'Vamos dividir a conta', '我们AA', 'vamus dividir a konta', 'Dividir conta', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9becba4f-92d9-480d-8178-ee226e34de94', 'b43c0ef3-abc1-421d-88f4-8836906fefd4', 'Um copo d''água, por favor', '请给我水', 'um kopu dagwa, por favor', 'Pedir água', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b626e43c-da57-4801-aff8-4f813a23c646', 'b43c0ef3-abc1-421d-88f4-8836906fefd4', 'Sou alérgico a nozes', '我对坚果过敏', 'so alerjiku a nozes', 'Alergia', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b5ad162d-4b8f-4c3d-b228-15176bba452e', 'b43c0ef3-abc1-421d-88f4-8836906fefd4', 'Estava ótimo, obrigado!', '很好吃，谢谢！', 'estava otimu, obrigadu!', 'Agradecer', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '34a55a0f-f543-49a9-bb5c-4b66afac5e72', 'pt', 'Pedir Direções', '问路', 'Com licença, onde fica a estação?', '🗺️', 3, 'travel', '#5B8FA8', 3)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3dbe0bec-863b-47a2-bafe-7a49ca2a4a58', '34a55a0f-f543-49a9-bb5c-4b66afac5e72', 'Pedir Direções - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '06b9a7fd-7617-493e-92ad-af4e0c06610a', '34a55a0f-f543-49a9-bb5c-4b66afac5e72', 'Pedir Direções - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9186a129-2a5b-4ca4-b111-7b3ae21b42a0', '34a55a0f-f543-49a9-bb5c-4b66afac5e72', 'Pedir Direções - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'eaa264e7-f248-4a19-b15c-de5ee85706ec', '34a55a0f-f543-49a9-bb5c-4b66afac5e72', 'Pedir Direções - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '89ce0c05-980c-411f-aa3d-536215c39ea4', '34a55a0f-f543-49a9-bb5c-4b66afac5e72', 'Pedir Direções - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c8375bd2-231f-4740-8fb1-beb44a222e21', '34a55a0f-f543-49a9-bb5c-4b66afac5e72', 'Pedir Direções - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e5744d5d-d048-4c49-8d41-19d066e5a56c', '34a55a0f-f543-49a9-bb5c-4b66afac5e72', 'Pedir Direções - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4a691780-8a6c-45ff-be62-8ea6ffaf049a', '34a55a0f-f543-49a9-bb5c-4b66afac5e72', 'Pedir Direções - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '412ca138-c116-405e-9479-2390c960f493', '34a55a0f-f543-49a9-bb5c-4b66afac5e72', 'Pedir Direções - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5f6ce3d6-c3b6-490f-87f6-cc32c5df9ada', '34a55a0f-f543-49a9-bb5c-4b66afac5e72', 'Pedir Direções - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'e1f5e881-f333-423f-9450-450e17fb54d5', 'pt', 'Fazer Compras', '购物', 'Quanto custa isso?', '🛍️', 4, 'shopping', '#7A9B71', 4)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5f65764a-e822-4a44-a75c-b1e6aa222ecd', 'e1f5e881-f333-423f-9450-450e17fb54d5', 'Fazer Compras - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7db09ab8-4b93-476c-8d23-b018070c383d', 'e1f5e881-f333-423f-9450-450e17fb54d5', 'Fazer Compras - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7505d400-639d-4e8f-bdeb-d33d8ed52af3', 'e1f5e881-f333-423f-9450-450e17fb54d5', 'Fazer Compras - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '72426158-543e-43e1-849e-b8af9d1d6a2d', 'e1f5e881-f333-423f-9450-450e17fb54d5', 'Fazer Compras - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1dfebd8e-7529-4b51-b92c-fe83b8fcfa3f', 'e1f5e881-f333-423f-9450-450e17fb54d5', 'Fazer Compras - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9fd44879-bdfa-4567-841a-bbbd12fba89f', 'e1f5e881-f333-423f-9450-450e17fb54d5', 'Fazer Compras - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6acc5c6d-2a61-4bc2-a7e1-5384a7f88f9a', 'e1f5e881-f333-423f-9450-450e17fb54d5', 'Fazer Compras - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b16d4b0e-280e-485e-8b3a-60dabfdab85b', 'e1f5e881-f333-423f-9450-450e17fb54d5', 'Fazer Compras - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3ce2733e-6128-4070-b610-d579c156f99e', 'e1f5e881-f333-423f-9450-450e17fb54d5', 'Fazer Compras - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '090cacd6-99a4-4fa8-9657-77e9fd5276e3', 'e1f5e881-f333-423f-9450-450e17fb54d5', 'Fazer Compras - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '69e60d1b-99a3-42ee-967e-e68deb591588', 'pt', 'No Hotel', '酒店', 'Tenho uma reserva', '🏨', 5, 'travel', '#8B7BA8', 5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2b549c8f-1f63-4cd5-a57e-5e472af1a890', '69e60d1b-99a3-42ee-967e-e68deb591588', 'No Hotel - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9669a9ca-0aff-4c93-8723-f05785e13880', '69e60d1b-99a3-42ee-967e-e68deb591588', 'No Hotel - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '77dc1014-224a-407a-9abd-5d66067050b3', '69e60d1b-99a3-42ee-967e-e68deb591588', 'No Hotel - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '338c7fe3-9c1d-401f-b600-a61f6a53ce19', '69e60d1b-99a3-42ee-967e-e68deb591588', 'No Hotel - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f745fe6e-da2b-4542-809c-d1a7c201992e', '69e60d1b-99a3-42ee-967e-e68deb591588', 'No Hotel - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0a2951a6-5415-43a3-ba5c-5eed98c8fefd', '69e60d1b-99a3-42ee-967e-e68deb591588', 'No Hotel - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f8a033d9-a166-4080-8d1a-67c995dc615b', '69e60d1b-99a3-42ee-967e-e68deb591588', 'No Hotel - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'cf035ab5-91bd-40d8-beaa-d2c6462194a0', '69e60d1b-99a3-42ee-967e-e68deb591588', 'No Hotel - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f9e36118-ada4-4cd2-a120-6d225c6b82d7', '69e60d1b-99a3-42ee-967e-e68deb591588', 'No Hotel - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6954feaf-8766-4a5e-b39c-eb853abaf964', '69e60d1b-99a3-42ee-967e-e68deb591588', 'No Hotel - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '8439fed9-3826-41a1-9ac2-d43e7137bfbe', 'pt', 'Ao Telefone', '电话', 'Alô, é o João', '📞', 6, 'daily', '#A87B8B', 6)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '99439a06-74dc-4900-837d-f5786303af35', '8439fed9-3826-41a1-9ac2-d43e7137bfbe', 'Ao Telefone - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1f0b730c-a93e-47f2-9346-0fe8edcf8f09', '8439fed9-3826-41a1-9ac2-d43e7137bfbe', 'Ao Telefone - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '801f8af4-72e5-458d-a195-ddff79f85315', '8439fed9-3826-41a1-9ac2-d43e7137bfbe', 'Ao Telefone - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ef5a10a3-9f2f-41b8-a05b-0eb3b01ab2ca', '8439fed9-3826-41a1-9ac2-d43e7137bfbe', 'Ao Telefone - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9e0cf578-4f4e-4666-afc4-ca34d65990ae', '8439fed9-3826-41a1-9ac2-d43e7137bfbe', 'Ao Telefone - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '456ebbe8-9b3e-4553-9633-d78dce8781d6', '8439fed9-3826-41a1-9ac2-d43e7137bfbe', 'Ao Telefone - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f454c3e8-a0c6-4eeb-8574-1ca84fcace27', '8439fed9-3826-41a1-9ac2-d43e7137bfbe', 'Ao Telefone - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '276aa1eb-da6e-4630-91f2-7272162eaf08', '8439fed9-3826-41a1-9ac2-d43e7137bfbe', 'Ao Telefone - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c19406f5-bfec-48cd-9a1c-5b29e23fb721', '8439fed9-3826-41a1-9ac2-d43e7137bfbe', 'Ao Telefone - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9e71514a-dbc5-4d4b-b427-d1e314e91a6b', '8439fed9-3826-41a1-9ac2-d43e7137bfbe', 'Ao Telefone - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '1cc9d32d-0e7e-492c-9f72-bad1d6d2595e', 'pt', 'No Médico', '医院', 'Não estou me sentindo bem', '🏥', 7, 'health', '#C9553D', 7)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f677495b-008e-4033-81e3-bb160293b5f5', '1cc9d32d-0e7e-492c-9f72-bad1d6d2595e', 'No Médico - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '08ea01bf-8cf2-4be6-91b8-e91092f97258', '1cc9d32d-0e7e-492c-9f72-bad1d6d2595e', 'No Médico - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ba81daca-f4fb-4c75-aa04-2ca2792ab647', '1cc9d32d-0e7e-492c-9f72-bad1d6d2595e', 'No Médico - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ca2433ef-0097-489d-82a4-19e72f6b9553', '1cc9d32d-0e7e-492c-9f72-bad1d6d2595e', 'No Médico - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '582ef52d-ea15-4e10-b660-aac71571fd72', '1cc9d32d-0e7e-492c-9f72-bad1d6d2595e', 'No Médico - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bf805111-b8ab-478b-a8a0-08a42c622269', '1cc9d32d-0e7e-492c-9f72-bad1d6d2595e', 'No Médico - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0d9b0e42-2072-462b-8a41-78ac3c41798d', '1cc9d32d-0e7e-492c-9f72-bad1d6d2595e', 'No Médico - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a43bc034-ae8c-4ff7-8d1c-b8247ed98376', '1cc9d32d-0e7e-492c-9f72-bad1d6d2595e', 'No Médico - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '039bb3ae-7985-4ce9-88fc-0d12b9e04822', '1cc9d32d-0e7e-492c-9f72-bad1d6d2595e', 'No Médico - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7706b0e1-4bf6-4591-9643-5e8bc8b93165', '1cc9d32d-0e7e-492c-9f72-bad1d6d2595e', 'No Médico - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '5ca310a6-72b8-4906-8eb1-9c0b5debe407', 'pt', 'Com Amigos', '朋友', 'O que você vai fazer?', '💬', 8, 'daily', '#5B9A8F', 8)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2c0c7c62-7041-4032-b3aa-8717b3afbff2', '5ca310a6-72b8-4906-8eb1-9c0b5debe407', 'Com Amigos - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '60bc6619-a164-44ff-acf1-d2c8c3d06fda', '5ca310a6-72b8-4906-8eb1-9c0b5debe407', 'Com Amigos - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e8856667-5865-48d7-98c1-778d3281da1e', '5ca310a6-72b8-4906-8eb1-9c0b5debe407', 'Com Amigos - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0fd7a0a3-a1dc-4471-a6d5-740bc7f05402', '5ca310a6-72b8-4906-8eb1-9c0b5debe407', 'Com Amigos - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '87ebd25f-6a05-406a-af9f-9e7378bb5b25', '5ca310a6-72b8-4906-8eb1-9c0b5debe407', 'Com Amigos - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c91dca89-eee9-4e4e-9eb5-143aa446aa5e', '5ca310a6-72b8-4906-8eb1-9c0b5debe407', 'Com Amigos - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4429a87a-edff-41c5-b145-3ccc93015df0', '5ca310a6-72b8-4906-8eb1-9c0b5debe407', 'Com Amigos - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7f4968c7-4260-4438-868e-b586359bf701', '5ca310a6-72b8-4906-8eb1-9c0b5debe407', 'Com Amigos - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e1cac369-78ab-42c7-988f-e5b5a62d35bc', '5ca310a6-72b8-4906-8eb1-9c0b5debe407', 'Com Amigos - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b0bd15e2-6fc2-4d1a-966c-583fd6cb74a1', '5ca310a6-72b8-4906-8eb1-9c0b5debe407', 'Com Amigos - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '07f6b7e5-66f5-434c-8366-7941cf57d0ec', 'pt', 'Entrevista', '面试', 'Fale sobre você', '💼', 9, 'work', '#4A6FA5', 9)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd6dc25fb-c99c-4ca8-b579-f130f475f824', '07f6b7e5-66f5-434c-8366-7941cf57d0ec', 'Entrevista - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd6710087-b560-4878-89a7-95fbf7f668b6', '07f6b7e5-66f5-434c-8366-7941cf57d0ec', 'Entrevista - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3c7a9b85-218f-49b5-b978-b669a52a3ef6', '07f6b7e5-66f5-434c-8366-7941cf57d0ec', 'Entrevista - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ad2a7879-0278-43bd-990b-e65a74ef7e57', '07f6b7e5-66f5-434c-8366-7941cf57d0ec', 'Entrevista - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '903477bf-99bf-41b7-9cdf-3263af8808cf', '07f6b7e5-66f5-434c-8366-7941cf57d0ec', 'Entrevista - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '01379094-e2a0-4c81-80ab-bd40388a2e0c', '07f6b7e5-66f5-434c-8366-7941cf57d0ec', 'Entrevista - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '794fc48f-7ca9-4e15-b31e-6be6a33f42ea', '07f6b7e5-66f5-434c-8366-7941cf57d0ec', 'Entrevista - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '02a254cd-f400-426f-baad-e185acbe7c55', '07f6b7e5-66f5-434c-8366-7941cf57d0ec', 'Entrevista - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '08f00c34-0e4b-4ef2-a1b1-c8d6a7a5b5f2', '07f6b7e5-66f5-434c-8366-7941cf57d0ec', 'Entrevista - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e083ddba-63bd-4584-87d5-f0d66499a3d3', '07f6b7e5-66f5-434c-8366-7941cf57d0ec', 'Entrevista - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '1eaa45e4-c56b-45b9-be9f-f7c10c4e0a4a', 'pt', 'No Aeroporto', '机场', 'Onde fica o check-in?', '✈️', 10, 'travel', '#9B715A', 10)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '37fcfb2a-e87d-4c4c-9cab-96afd78cd823', '1eaa45e4-c56b-45b9-be9f-f7c10c4e0a4a', 'No Aeroporto - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '85fa8437-8113-41a9-916d-f53545084c7c', '1eaa45e4-c56b-45b9-be9f-f7c10c4e0a4a', 'No Aeroporto - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b482ef9f-051d-487b-96aa-448204b4c55d', '1eaa45e4-c56b-45b9-be9f-f7c10c4e0a4a', 'No Aeroporto - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '55b2c377-189f-48ef-9278-937b9b92f807', '1eaa45e4-c56b-45b9-be9f-f7c10c4e0a4a', 'No Aeroporto - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bc4cc7d5-e014-4e1f-9fed-27f5d4ed16cc', '1eaa45e4-c56b-45b9-be9f-f7c10c4e0a4a', 'No Aeroporto - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9defa509-3216-4a9e-a1cb-33ff4a074a06', '1eaa45e4-c56b-45b9-be9f-f7c10c4e0a4a', 'No Aeroporto - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '22fc8e8c-cdc9-4d22-a925-3845072ceca7', '1eaa45e4-c56b-45b9-be9f-f7c10c4e0a4a', 'No Aeroporto - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6494c621-eedb-4181-92f3-66ae9493b3ce', '1eaa45e4-c56b-45b9-be9f-f7c10c4e0a4a', 'No Aeroporto - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '79b38b5b-6b71-4b4b-a12f-20b01bd05ac3', '1eaa45e4-c56b-45b9-be9f-f7c10c4e0a4a', 'No Aeroporto - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b76c0c1a-6f43-4c56-800a-0857ca69e8df', '1eaa45e4-c56b-45b9-be9f-f7c10c4e0a4a', 'No Aeroporto - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '73ff0834-bb83-4748-bf21-b056fb637397', 'ar', 'التحية والتعارف', 'Greetings', 'مرحباً، اسمي أحمد', '👋', 1, 'daily', '#E07B6C', 1)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f0f36664-2bdf-49e7-8542-5011c7ccf47f', '73ff0834-bb83-4748-bf21-b056fb637397', 'السلام عليكم', '你好（正式）', 'as-salamu alaykum', 'تحية رسمية', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3c538807-adb2-4035-bd40-0ac1c971cf0c', '73ff0834-bb83-4748-bf21-b056fb637397', 'تشرفت بلقائك', '很高兴认识你', 'tasharraftu biliqa''ik', 'لقاء أول', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd502d6fb-b075-41bb-a9d9-6f174e83a412', '73ff0834-bb83-4748-bf21-b056fb637397', 'اسمي أحمد', '我叫艾哈迈德', 'ismi Ahmad', 'تعريف بالنفس', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f4d9f8f6-2b7b-42e2-8482-93c3cb3ee74b', '73ff0834-bb83-4748-bf21-b056fb637397', 'من أين أنت؟', '你从哪里来？', 'min ayna anta?', 'سؤال عن الأصل', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '99586411-932f-4431-b64e-4676fc7ca3b3', '73ff0834-bb83-4748-bf21-b056fb637397', 'أنا من مصر', '我来自埃及', 'ana min Misr', 'إجابة عن الأصل', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '91511789-973b-4e4f-9feb-cbbed359254e', '73ff0834-bb83-4748-bf21-b056fb637397', 'ماذا تعمل؟', '你做什么工作？', 'madha ta''mal?', 'سؤال عن العمل', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f1aafd69-d8cf-41bd-841b-a37ac22ae4c6', '73ff0834-bb83-4748-bf21-b056fb637397', 'أنا طالب', '我是学生', 'ana talib', 'إجابة عن العمل', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bd320570-ed66-44bb-b0f1-9877ce093334', '73ff0834-bb83-4748-bf21-b056fb637397', 'كيف الجو اليوم؟', '天气怎么样？', 'kayfa al-jaww al-yawm?', 'حديث عن الطقس', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '33616050-bc09-41c6-8fde-0eabb9e560c8', '73ff0834-bb83-4748-bf21-b056fb637397', 'سعيد برؤيتك مجدداً', '很高兴再次见到你', 'sa''id biru''yatik mujaddadan', 'لقاء متجدد', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2948b7af-4562-4692-afec-d942684c3cf1', '73ff0834-bb83-4748-bf21-b056fb637397', 'في أمان الله', '再见', 'fi aman illah', 'وداع', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '7f799726-b789-4517-8979-7d965d3db825', 'ar', 'في المطعم', 'Restaurant', 'أريد أن أطلب من فضلك', '🍖', 2, 'food', '#C97B5A', 2)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f928ef0e-ad41-4411-946c-087f9dd3a1ea', '7f799726-b789-4517-8979-7d965d3db825', 'هل يمكنني رؤية القائمة؟', '可以看菜单吗？', 'hal yumkinuni ru''yat al-qa''ima?', 'طلب القائمة', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c3fc7dc7-7781-427e-a1c9-d3a0ef889437', '7f799726-b789-4517-8979-7d965d3db825', 'أريد أن أطلب', '我想点菜', 'uridu an atlub', 'تقديم الطلب', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '51a3b727-aa1d-4bc1-a72b-0fad933ce3bf', '7f799726-b789-4517-8979-7d965d3db825', 'ماذا تنصحني؟', '有什么推荐？', 'madha tansahuni?', 'طلب توصية', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9107709b-4e51-4e44-b8ae-1e8e2d7590f8', '7f799726-b789-4517-8979-7d965d3db825', 'سآخذ شريحة اللحم', '我要牛排', 'sa''akhudhu sharihat al-lahm', 'طلب طبق', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c78d6c2a-6fdf-40d8-9360-253aeb9e8a0d', '7f799726-b789-4517-8979-7d965d3db825', 'هذا لذيذ!', '很好吃！', 'hadha ladhidh!', 'مدح الطعام', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '60689099-7d2b-4aed-af9f-c4f8d54428bc', '7f799726-b789-4517-8979-7d965d3db825', 'الفاتورة من فضلك', '请给我账单', 'al-fatura min fadlik', 'طلب الفاتورة', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '514a819e-0a39-4743-b053-538ce1db2750', '7f799726-b789-4517-8979-7d965d3db825', 'لنقسم الفاتورة', '我们AA', 'linaqsim al-fatura', 'تقسيم الفاتورة', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4724d4f5-62a5-4f85-86cf-4c22e8ac3b25', '7f799726-b789-4517-8979-7d965d3db825', 'كأس ماء من فضلك', '请给我水', 'ka''s ma'' min fadlik', 'طلب ماء', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a2cfb1d9-f279-4356-b14e-7f20769a2f22', '7f799726-b789-4517-8979-7d965d3db825', 'عندي حساسية من المكسرات', '我对坚果过敏', 'indi hasasiya min al-mukassarat', 'حساسية', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd7d221f4-cd74-42d0-942a-b975256a5495', '7f799726-b789-4517-8979-7d965d3db825', 'كان لذيذاً، شكراً!', '很好吃，谢谢！', 'kana ladhidhan, shukran!', 'شكر', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '2b243de5-dd36-464d-9bea-9df9d5a58d39', 'ar', 'السؤال عن الطريق', 'Directions', 'عفواً، أين المحطة؟', '🗺️', 3, 'travel', '#5B8FA8', 3)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fd213331-dcfa-4e5d-8a64-6891351b0886', '2b243de5-dd36-464d-9bea-9df9d5a58d39', 'السؤال عن الطريق - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'af13bbfc-2f92-411c-842e-a9efaa4f264e', '2b243de5-dd36-464d-9bea-9df9d5a58d39', 'السؤال عن الطريق - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f163ca1e-1f5a-4363-90c5-cdaef6cf7faf', '2b243de5-dd36-464d-9bea-9df9d5a58d39', 'السؤال عن الطريق - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'af10946c-8d7b-4fc2-a180-0c43facfba87', '2b243de5-dd36-464d-9bea-9df9d5a58d39', 'السؤال عن الطريق - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f2afc950-3c4c-4684-bcf0-25da91148831', '2b243de5-dd36-464d-9bea-9df9d5a58d39', 'السؤال عن الطريق - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5a0c166f-aa57-4787-90af-065e8e732904', '2b243de5-dd36-464d-9bea-9df9d5a58d39', 'السؤال عن الطريق - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a6349b37-6752-4333-9a1f-83b273351f35', '2b243de5-dd36-464d-9bea-9df9d5a58d39', 'السؤال عن الطريق - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2fce1fac-d5ca-42e5-ab5e-63b9899c63d8', '2b243de5-dd36-464d-9bea-9df9d5a58d39', 'السؤال عن الطريق - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '135cee44-7b1b-4321-9b7e-8e35dd8ca2e6', '2b243de5-dd36-464d-9bea-9df9d5a58d39', 'السؤال عن الطريق - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '17d8b3ea-6a2d-4fdd-9d01-b23676881193', '2b243de5-dd36-464d-9bea-9df9d5a58d39', 'السؤال عن الطريق - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'a1b3f672-1a59-4750-881c-b7343a0b16ba', 'ar', 'التسوق', 'Shopping', 'كم سعر هذا؟', '🛍️', 4, 'shopping', '#7A9B71', 4)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '43e74927-9cae-444a-b92a-b18a6201d903', 'a1b3f672-1a59-4750-881c-b7343a0b16ba', 'التسوق - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '74dbce84-a31d-4b5c-88c2-87d438fb8269', 'a1b3f672-1a59-4750-881c-b7343a0b16ba', 'التسوق - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '53518d12-7925-48a6-b1cf-fe46feccbd79', 'a1b3f672-1a59-4750-881c-b7343a0b16ba', 'التسوق - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd957ff15-a64f-4b70-913a-d18174a6b545', 'a1b3f672-1a59-4750-881c-b7343a0b16ba', 'التسوق - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3c672f4a-9836-4b90-9118-5e441886d9cf', 'a1b3f672-1a59-4750-881c-b7343a0b16ba', 'التسوق - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ff658458-0034-42dd-a8fc-b71030e90117', 'a1b3f672-1a59-4750-881c-b7343a0b16ba', 'التسوق - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '220abbb9-5d62-4f1a-aa39-7339cb05f7f8', 'a1b3f672-1a59-4750-881c-b7343a0b16ba', 'التسوق - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1f2976a9-9146-4b78-b8f0-47ab913a82c2', 'a1b3f672-1a59-4750-881c-b7343a0b16ba', 'التسوق - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a0b86731-4251-424e-9c54-531d057c87c9', 'a1b3f672-1a59-4750-881c-b7343a0b16ba', 'التسوق - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6fc4caa6-ab40-481b-ae9c-8536d0cdcf08', 'a1b3f672-1a59-4750-881c-b7343a0b16ba', 'التسوق - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'f949246c-6e93-447f-b8ec-756f1b8ab671', 'ar', 'في الفندق', 'Hotel', 'لدي حجز', '🏨', 5, 'travel', '#8B7BA8', 5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'fa0c3d7b-f42a-4aaf-afba-3909ce7f5555', 'f949246c-6e93-447f-b8ec-756f1b8ab671', 'في الفندق - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5ba27ffa-82ef-4871-b0d3-25fd94d90e4e', 'f949246c-6e93-447f-b8ec-756f1b8ab671', 'في الفندق - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b610daf7-2c54-4508-9540-b4009ff0d418', 'f949246c-6e93-447f-b8ec-756f1b8ab671', 'في الفندق - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd274d69f-5e6b-4bf5-9505-39ed72514b59', 'f949246c-6e93-447f-b8ec-756f1b8ab671', 'في الفندق - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2236f5e8-683f-4b2a-ae4f-cdaf3c438cec', 'f949246c-6e93-447f-b8ec-756f1b8ab671', 'في الفندق - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5cddf6b4-1d03-4f50-a0fa-fb607269a8ee', 'f949246c-6e93-447f-b8ec-756f1b8ab671', 'في الفندق - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b398ca8c-4fb7-418d-9a11-56268fdf26c9', 'f949246c-6e93-447f-b8ec-756f1b8ab671', 'في الفندق - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '43cdca90-8e0e-4398-868e-ee0d1b4a3cbb', 'f949246c-6e93-447f-b8ec-756f1b8ab671', 'في الفندق - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '62c40666-c7b5-4c88-bdda-6bb8ec37bb4f', 'f949246c-6e93-447f-b8ec-756f1b8ab671', 'في الفندق - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0954d875-55de-4da1-9ef3-b06d9f4a906e', 'f949246c-6e93-447f-b8ec-756f1b8ab671', 'في الفندق - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'dd02e5b5-26a6-453c-a6e9-4a94c9553794', 'ar', 'على الهاتف', 'Phone', 'السلام عليكم، أنا أحمد', '📞', 6, 'daily', '#A87B8B', 6)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e0854e2a-edf6-45be-b46d-cebed5601fa1', 'dd02e5b5-26a6-453c-a6e9-4a94c9553794', 'على الهاتف - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7a0cfdfc-4b1a-4c1c-970d-b09932a47c08', 'dd02e5b5-26a6-453c-a6e9-4a94c9553794', 'على الهاتف - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e6f35612-ffc9-4e28-aef2-dc19a2e2a24a', 'dd02e5b5-26a6-453c-a6e9-4a94c9553794', 'على الهاتف - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'cb67fabd-8af6-42ac-823c-18d8a27b570f', 'dd02e5b5-26a6-453c-a6e9-4a94c9553794', 'على الهاتف - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1f7bb260-1eaa-4311-940c-a99c0cf89a3f', 'dd02e5b5-26a6-453c-a6e9-4a94c9553794', 'على الهاتف - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1c4d0adf-759b-4416-9c97-edc355684c81', 'dd02e5b5-26a6-453c-a6e9-4a94c9553794', 'على الهاتف - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '69eb1a78-f6ee-4e8f-b388-70b76a6f9417', 'dd02e5b5-26a6-453c-a6e9-4a94c9553794', 'على الهاتف - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '54a5269b-3b42-4c5a-a363-2dc9596772aa', 'dd02e5b5-26a6-453c-a6e9-4a94c9553794', 'على الهاتف - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b14ed8e7-77fb-4bfa-9053-9935e376a81c', 'dd02e5b5-26a6-453c-a6e9-4a94c9553794', 'على الهاتف - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6e503455-b531-4ccc-8c01-74336cf2f2bf', 'dd02e5b5-26a6-453c-a6e9-4a94c9553794', 'على الهاتف - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '67d6f9fe-e26d-40c5-8e75-6b595d94ddb3', 'ar', 'عند الطبيب', 'Doctor', 'لست على ما يرام', '🏥', 7, 'health', '#C9553D', 7)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '01ca4141-f41c-4132-a2c7-dd513b3d0ec3', '67d6f9fe-e26d-40c5-8e75-6b595d94ddb3', 'عند الطبيب - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3fa2bc85-6832-486b-9b1f-2e7e390ea703', '67d6f9fe-e26d-40c5-8e75-6b595d94ddb3', 'عند الطبيب - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4fceffc0-7b28-4c5f-a5fd-86932c25b661', '67d6f9fe-e26d-40c5-8e75-6b595d94ddb3', 'عند الطبيب - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1bdaf99c-6fed-4325-b56d-f82233adfec1', '67d6f9fe-e26d-40c5-8e75-6b595d94ddb3', 'عند الطبيب - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd561bbc8-0e9b-4e9d-b9d4-cf5f4dc04c14', '67d6f9fe-e26d-40c5-8e75-6b595d94ddb3', 'عند الطبيب - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd75370f7-1210-4b00-9568-401b24107ac1', '67d6f9fe-e26d-40c5-8e75-6b595d94ddb3', 'عند الطبيب - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4fce8958-80b3-4e6e-9209-671409bfa2d5', '67d6f9fe-e26d-40c5-8e75-6b595d94ddb3', 'عند الطبيب - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '05ffdcf4-2222-493f-8c39-8657412c4ddb', '67d6f9fe-e26d-40c5-8e75-6b595d94ddb3', 'عند الطبيب - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '68a876d0-81df-4b10-b19c-d468c4f3f5b3', '67d6f9fe-e26d-40c5-8e75-6b595d94ddb3', 'عند الطبيب - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5b49fadb-936e-4676-b7d1-bcbe38b69fee', '67d6f9fe-e26d-40c5-8e75-6b595d94ddb3', 'عند الطبيب - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'ec0874fc-16d9-481a-aa96-498cd07267f3', 'ar', 'مع الأصدقاء', 'Friends', 'ماذا ستفعل؟', '💬', 8, 'daily', '#5B9A8F', 8)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'dc3831a9-eabf-40c1-9d6a-5f16ddd7b989', 'ec0874fc-16d9-481a-aa96-498cd07267f3', 'مع الأصدقاء - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5018fec0-f469-4b16-bdbd-d871fab6598b', 'ec0874fc-16d9-481a-aa96-498cd07267f3', 'مع الأصدقاء - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0e8df49c-37cf-4460-a7a6-82dc7020df70', 'ec0874fc-16d9-481a-aa96-498cd07267f3', 'مع الأصدقاء - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '29cf68d2-e02e-4799-b963-39bb39d5533f', 'ec0874fc-16d9-481a-aa96-498cd07267f3', 'مع الأصدقاء - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8357099a-40df-417e-9fbe-db793cf5cb03', 'ec0874fc-16d9-481a-aa96-498cd07267f3', 'مع الأصدقاء - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '27c6a6f1-1f73-4a4f-a4d2-c1ec969a15f3', 'ec0874fc-16d9-481a-aa96-498cd07267f3', 'مع الأصدقاء - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8b725e72-9dec-4bd7-8496-b9f4c3cba5f6', 'ec0874fc-16d9-481a-aa96-498cd07267f3', 'مع الأصدقاء - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8811966d-ba80-4312-8cfb-cb6ba573a9c6', 'ec0874fc-16d9-481a-aa96-498cd07267f3', 'مع الأصدقاء - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c75e55b7-c4a8-4646-bee6-a3224dacd718', 'ec0874fc-16d9-481a-aa96-498cd07267f3', 'مع الأصدقاء - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '00b56a34-7af4-4e98-9088-06a3cb734040', 'ec0874fc-16d9-481a-aa96-498cd07267f3', 'مع الأصدقاء - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '473103af-0eb2-41a4-91f2-71a178fade22', 'ar', 'مقابلة عمل', 'Interview', 'حدثني عن نفسك', '💼', 9, 'work', '#4A6FA5', 9)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '004b915e-30b4-420d-812e-cfb0e6e2300b', '473103af-0eb2-41a4-91f2-71a178fade22', 'مقابلة عمل - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e2fbdff2-a250-4cb9-a7d0-07eb704551a5', '473103af-0eb2-41a4-91f2-71a178fade22', 'مقابلة عمل - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4fb02843-b926-4074-ae34-4d597ced94db', '473103af-0eb2-41a4-91f2-71a178fade22', 'مقابلة عمل - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '81199b01-0e1d-403b-aa53-0c3b3a4796a2', '473103af-0eb2-41a4-91f2-71a178fade22', 'مقابلة عمل - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e17f68cb-46a2-453f-96f8-ed8bc67a1cf4', '473103af-0eb2-41a4-91f2-71a178fade22', 'مقابلة عمل - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0fdc1c7a-e17d-4104-87b1-671a14455093', '473103af-0eb2-41a4-91f2-71a178fade22', 'مقابلة عمل - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0ffaaeb9-8ed7-4049-829e-209ecd9a1dcd', '473103af-0eb2-41a4-91f2-71a178fade22', 'مقابلة عمل - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b3e123c9-c7e6-4f37-8208-963e663c45cc', '473103af-0eb2-41a4-91f2-71a178fade22', 'مقابلة عمل - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '757a9c64-0161-43b9-8703-6756edfae734', '473103af-0eb2-41a4-91f2-71a178fade22', 'مقابلة عمل - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '51d1f898-a132-4ec6-b30c-d2fd6519ebe4', '473103af-0eb2-41a4-91f2-71a178fade22', 'مقابلة عمل - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '656bc917-afca-455c-b19f-c828f4cc6925', 'ar', 'في المطار', 'Airport', 'أين مكتب التسجيل؟', '✈️', 10, 'travel', '#9B715A', 10)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0b8ac81d-f9c8-45fa-8414-136fa08a620f', '656bc917-afca-455c-b19f-c828f4cc6925', 'في المطار - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd2f8f8e7-1c58-4586-a5ba-4b1d7a9a0736', '656bc917-afca-455c-b19f-c828f4cc6925', 'في المطار - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ce52aaeb-7ead-48a0-a9c6-5e15d08571e3', '656bc917-afca-455c-b19f-c828f4cc6925', 'في المطار - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7f39d577-c4ee-448c-94fb-852239a1ed82', '656bc917-afca-455c-b19f-c828f4cc6925', 'في المطار - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b3e4ab3f-16ba-49b0-b521-928b6454fc85', '656bc917-afca-455c-b19f-c828f4cc6925', 'في المطار - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ffb5a7a8-00c9-4a31-aee9-a57ea8f68dd3', '656bc917-afca-455c-b19f-c828f4cc6925', 'في المطار - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '80e33472-0bfc-4b67-8467-e1684a81a7b0', '656bc917-afca-455c-b19f-c828f4cc6925', 'في المطار - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f80f93f8-6246-4fe7-a9e2-0d2fc20e8d58', '656bc917-afca-455c-b19f-c828f4cc6925', 'في المطار - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e43d1ed1-00f2-45f1-9d54-a3035a93bd60', '656bc917-afca-455c-b19f-c828f4cc6925', 'في المطار - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9f707834-e2c8-4602-b08b-6b2200672b45', '656bc917-afca-455c-b19f-c828f4cc6925', 'في المطار - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'abe7d20d-f492-4c40-ab41-96c7cf9f6f04', 'zh', '问候与介绍', 'Greetings', '你好，很高兴认识你', '👋', 1, 'daily', '#E07B6C', 1)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1ce8f05e-e748-4f68-bfa7-7214dd7ff379', 'abe7d20d-f492-4c40-ab41-96c7cf9f6f04', '你好，很高兴认识你', 'Hello, nice to meet you', 'ni hao, hen gao xing ren shi ni', 'Standard greeting', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '64560891-4313-4e6f-b297-92d2ed492639', 'abe7d20d-f492-4c40-ab41-96c7cf9f6f04', '请问您贵姓？', 'May I ask your surname?', 'qing wen nin gui xing?', 'Formal address', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6e02a99d-078e-4528-bf0f-2caecf0095d1', 'abe7d20d-f492-4c40-ab41-96c7cf9f6f04', '我叫小明', 'My name is Xiaoming', 'wo jiao Xiao Ming', 'Self-introduction', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2f0cf0da-36ec-4dcc-9661-ecba5cbb457f', 'abe7d20d-f492-4c40-ab41-96c7cf9f6f04', '你是哪里人？', 'Where are you from?', 'ni shi na li ren?', 'Asking origin', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bd122dac-5c38-423e-b0d7-376022c6cd9f', 'abe7d20d-f492-4c40-ab41-96c7cf9f6f04', '我是北京人', 'I''m from Beijing', 'wo shi Beijing ren', 'Answering origin', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd4ab81ec-c64d-4798-8b80-288c641e28f1', 'abe7d20d-f492-4c40-ab41-96c7cf9f6f04', '你是做什么工作的？', 'What do you do?', 'ni shi zuo shen me gong zuo de?', 'Asking job', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c7ddc60d-0f0f-472f-ae92-2f3c5427f969', 'abe7d20d-f492-4c40-ab41-96c7cf9f6f04', '我是一名老师', 'I am a teacher', 'wo shi yi ming lao shi', 'Answering job', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1380627c-26a8-471f-8959-cb4b11911b58', 'abe7d20d-f492-4c40-ab41-96c7cf9f6f04', '今天天气真好', 'The weather is nice today', 'jin tian tian qi zhen hao', 'Small talk', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4400e1ad-5e2c-457a-88f0-3c76d8ea616d', 'abe7d20d-f492-4c40-ab41-96c7cf9f6f04', '好久不见！', 'Long time no see!', 'hao jiu bu jian!', 'Reunion', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '19d08767-d853-4805-8c8b-5912ee132618', 'abe7d20d-f492-4c40-ab41-96c7cf9f6f04', '回头见！', 'See you later!', 'hui tou jian!', 'Parting', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '307016de-38a0-4662-965e-828685b95fa8', 'zh', '餐厅点餐', 'Restaurant', '我想点菜', '🍜', 2, 'food', '#C97B5A', 2)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'be5526ab-a56a-401b-8549-923ed17c2bb8', '307016de-38a0-4662-965e-828685b95fa8', '请给我菜单', 'Menu, please', 'qing gei wo cai dan', 'Asking menu', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3c397c44-295a-4d81-b946-28eccdf85b9e', '307016de-38a0-4662-965e-828685b95fa8', '我要点菜', 'I want to order', 'wo yao dian cai', 'Ordering', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '958bd75d-1421-461b-acc8-499dd555ac51', '307016de-38a0-4662-965e-828685b95fa8', '有什么推荐的吗？', 'Any recommendations?', 'you shen me tui jian de ma?', 'Asking recommendation', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6a0eb32d-5df2-4ff5-b95e-b532d6a3cc55', '307016de-38a0-4662-965e-828685b95fa8', '来一份宫保鸡丁', 'I''ll have Kung Pao Chicken', 'lai yi fen Gong Bao ji ding', 'Ordering dish', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c48ec907-a4a5-435a-b160-67f928140551', '307016de-38a0-4662-965e-828685b95fa8', '真好吃！', 'So delicious!', 'zhen hao chi!', 'Complimenting', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8e7296fc-3e50-4ece-b7f1-5af8474afbee', '307016de-38a0-4662-965e-828685b95fa8', '买单', 'Check, please', 'mai dan', 'Asking bill', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '54e422a3-ccb4-43bb-af61-3c00a141b90b', '307016de-38a0-4662-965e-828685b95fa8', '我们AA吧', 'Let''s split', 'wo men AA ba', 'Splitting bill', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '03d35300-54b0-42e4-99c9-c2d85734e80e', '307016de-38a0-4662-965e-828685b95fa8', '请给我一杯水', 'Water, please', 'qing gei wo yi bei shui', 'Asking water', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a3f043cc-6a7e-4509-b628-859b749b5f64', '307016de-38a0-4662-965e-828685b95fa8', '我吃不了辣的', 'I can''t eat spicy', 'wo chi bu liao la de', 'Dietary restriction', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2adf67fe-ae03-4639-b7b6-fa61c2510dec', '307016de-38a0-4662-965e-828685b95fa8', '很好吃，谢谢！', 'Delicious, thank you!', 'hen hao chi, xie xie!', 'Thanking', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'b1ab6e88-6f63-4720-8161-ca17b690e2f3', 'zh', '问路指路', 'Directions', '请问，地铁站怎么走？', '🗺️', 3, 'travel', '#5B8FA8', 3)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4da8fa0b-68ed-4dc0-866b-aa87bc1da1f8', 'b1ab6e88-6f63-4720-8161-ca17b690e2f3', '问路指路 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'e5fd7efd-dd3e-48ee-93b5-887384dc36e1', 'b1ab6e88-6f63-4720-8161-ca17b690e2f3', '问路指路 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '37f52ca7-685d-47a0-abee-96b74c4d15ac', 'b1ab6e88-6f63-4720-8161-ca17b690e2f3', '问路指路 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '82f2359b-77af-4d55-9f75-68a268e4441a', 'b1ab6e88-6f63-4720-8161-ca17b690e2f3', '问路指路 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1b7a9f4b-d85c-4667-97da-45fa3ee574a8', 'b1ab6e88-6f63-4720-8161-ca17b690e2f3', '问路指路 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6b0897e7-99b1-4836-a9a0-a293cfa04711', 'b1ab6e88-6f63-4720-8161-ca17b690e2f3', '问路指路 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a46d7587-d851-4fd1-87d3-e5f89a82e896', 'b1ab6e88-6f63-4720-8161-ca17b690e2f3', '问路指路 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '40bf5d6b-aedc-4f15-b2af-c798db57a4f2', 'b1ab6e88-6f63-4720-8161-ca17b690e2f3', '问路指路 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd19b1cf9-8b44-4184-8c45-ef59b7da1421', 'b1ab6e88-6f63-4720-8161-ca17b690e2f3', '问路指路 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '44d0585b-ab4e-4acf-9e42-f23f6e32e7d6', 'b1ab6e88-6f63-4720-8161-ca17b690e2f3', '问路指路 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'e6680d74-c70c-4439-a428-1f2799520284', 'zh', '购物对话', 'Shopping', '这个多少钱？', '🛍️', 4, 'shopping', '#7A9B71', 4)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b78f34a6-0a14-4d59-b763-14dee706b900', 'e6680d74-c70c-4439-a428-1f2799520284', '购物对话 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'cc3cce8f-12dd-4ca4-8b5f-6884864f98c3', 'e6680d74-c70c-4439-a428-1f2799520284', '购物对话 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '686dc581-8daa-445f-9bdf-44b8c6be9e3f', 'e6680d74-c70c-4439-a428-1f2799520284', '购物对话 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ff170351-a3ad-40d6-96d8-dc298f6f0fd7', 'e6680d74-c70c-4439-a428-1f2799520284', '购物对话 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '469f7a6a-648d-46f4-8468-4a5ef5a7ed8c', 'e6680d74-c70c-4439-a428-1f2799520284', '购物对话 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0d68ee36-114c-402a-b730-32d3ca9f635a', 'e6680d74-c70c-4439-a428-1f2799520284', '购物对话 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'dc02fa5e-b797-4a52-aaec-425c158190a4', 'e6680d74-c70c-4439-a428-1f2799520284', '购物对话 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'f750cce9-c8af-47a7-b21f-65fd576c41bd', 'e6680d74-c70c-4439-a428-1f2799520284', '购物对话 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '2465dc65-3e4f-412b-91b4-bf626c0a95c0', 'e6680d74-c70c-4439-a428-1f2799520284', '购物对话 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a9564929-5c40-4d5c-9ede-b2a7be481ca1', 'e6680d74-c70c-4439-a428-1f2799520284', '购物对话 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '172f3feb-51eb-4cd1-9904-5c5c3580d9ab', 'zh', '酒店入住', 'Hotel', '我有预订', '🏨', 5, 'travel', '#8B7BA8', 5)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '43039b64-698f-4961-832b-3d52eda5badb', '172f3feb-51eb-4cd1-9904-5c5c3580d9ab', '酒店入住 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '69b06711-16e3-4ae8-a641-7483490d9582', '172f3feb-51eb-4cd1-9904-5c5c3580d9ab', '酒店入住 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a3424c6e-20f0-4883-b17f-e9f106e9d548', '172f3feb-51eb-4cd1-9904-5c5c3580d9ab', '酒店入住 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '70fec03b-2b0a-43e7-9fad-30decea63c2a', '172f3feb-51eb-4cd1-9904-5c5c3580d9ab', '酒店入住 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3364cc6c-90ec-4703-899b-3cccbadff97e', '172f3feb-51eb-4cd1-9904-5c5c3580d9ab', '酒店入住 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '443d6297-adf5-438c-a1fc-fffdf229eb9d', '172f3feb-51eb-4cd1-9904-5c5c3580d9ab', '酒店入住 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8cd18950-1c4c-4609-bd9f-babde7e84740', '172f3feb-51eb-4cd1-9904-5c5c3580d9ab', '酒店入住 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8a889c29-c12f-494f-9cff-d42506594dff', '172f3feb-51eb-4cd1-9904-5c5c3580d9ab', '酒店入住 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '53829b56-30a4-43b2-aaba-c07ab4c352b2', '172f3feb-51eb-4cd1-9904-5c5c3580d9ab', '酒店入住 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8482d542-7c32-4062-9aa1-36076189b50b', '172f3feb-51eb-4cd1-9904-5c5c3580d9ab', '酒店入住 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '9fd56da2-5a43-4fb8-97ac-1e0bcd39e84b', 'zh', '电话交流', 'Phone', '喂，你好', '📞', 6, 'daily', '#A87B8B', 6)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c7d6a3fd-4b9b-4e83-8f7c-80653fd53a8f', '9fd56da2-5a43-4fb8-97ac-1e0bcd39e84b', '电话交流 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'bf320401-55ae-4c1a-ba1a-3c6dbba0341f', '9fd56da2-5a43-4fb8-97ac-1e0bcd39e84b', '电话交流 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6179a66b-85a3-4afc-b4cc-7abf0f15539e', '9fd56da2-5a43-4fb8-97ac-1e0bcd39e84b', '电话交流 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'c36a7a33-a03b-40f2-a4c1-bf97511f5fa9', '9fd56da2-5a43-4fb8-97ac-1e0bcd39e84b', '电话交流 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8537ffee-1990-42d1-85c0-0c9aa90232f8', '9fd56da2-5a43-4fb8-97ac-1e0bcd39e84b', '电话交流 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'b1088c1b-7d60-4c8b-9ac8-101a15b000b7', '9fd56da2-5a43-4fb8-97ac-1e0bcd39e84b', '电话交流 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4cda20a4-4ccb-49a6-a787-a38147e62208', '9fd56da2-5a43-4fb8-97ac-1e0bcd39e84b', '电话交流 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '4cbef1d1-b5c7-455b-872b-11fe871244ec', '9fd56da2-5a43-4fb8-97ac-1e0bcd39e84b', '电话交流 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8ac72a57-4b59-461b-83a6-6aeecb91138b', '9fd56da2-5a43-4fb8-97ac-1e0bcd39e84b', '电话交流 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ce7599e2-2f3e-4ecb-b568-cd5b2290b45a', '9fd56da2-5a43-4fb8-97ac-1e0bcd39e84b', '电话交流 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '38980ca0-3c5f-495c-ba7c-47891b86963d', 'zh', '看医生', 'Doctor', '我身体不舒服', '🏥', 7, 'health', '#C9553D', 7)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '02a2675e-84e2-4429-8abd-7785ff1289a4', '38980ca0-3c5f-495c-ba7c-47891b86963d', '看医生 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '31321373-00f6-42b5-9304-3fa04c6f076f', '38980ca0-3c5f-495c-ba7c-47891b86963d', '看医生 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5aba67cb-2057-4387-a007-c4302cc82620', '38980ca0-3c5f-495c-ba7c-47891b86963d', '看医生 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '69cb635b-ee98-467a-a8a2-31f977dfdbc9', '38980ca0-3c5f-495c-ba7c-47891b86963d', '看医生 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '47783792-5c35-4b5d-b441-83b246fa0384', '38980ca0-3c5f-495c-ba7c-47891b86963d', '看医生 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5c41cf32-b8a3-49f7-8ea1-bb56f788d847', '38980ca0-3c5f-495c-ba7c-47891b86963d', '看医生 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '193f66b5-f1c7-4a75-8bca-e88ef1146e0d', '38980ca0-3c5f-495c-ba7c-47891b86963d', '看医生 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'af6e20e8-7fe6-44f0-9dc1-a7f4a79f8b02', '38980ca0-3c5f-495c-ba7c-47891b86963d', '看医生 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a39b1a99-787e-4496-9698-b659d93b5026', '38980ca0-3c5f-495c-ba7c-47891b86963d', '看医生 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'adb2cd0e-498b-4adb-a1c0-ebf6bae3f7ff', '38980ca0-3c5f-495c-ba7c-47891b86963d', '看医生 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  '50162425-651a-4e31-8e0a-2800e17180e9', 'zh', '朋友聊天', 'Friends', '周末有什么安排？', '💬', 8, 'daily', '#5B9A8F', 8)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '415ab1ce-25c2-486e-a0fd-63d3f77f70ad', '50162425-651a-4e31-8e0a-2800e17180e9', '朋友聊天 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '8a8d59b5-e8a7-42f4-b60f-446e15c0dfe4', '50162425-651a-4e31-8e0a-2800e17180e9', '朋友聊天 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '34e23551-75c5-4e65-9cb1-0e7e0cb74093', '50162425-651a-4e31-8e0a-2800e17180e9', '朋友聊天 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0d87429e-adcb-43d7-8483-bd33f3426c03', '50162425-651a-4e31-8e0a-2800e17180e9', '朋友聊天 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '831b6fa5-fed5-49dc-98d8-5702a627cf64', '50162425-651a-4e31-8e0a-2800e17180e9', '朋友聊天 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a7d5f9f1-1616-4be4-86e4-4792e7664d01', '50162425-651a-4e31-8e0a-2800e17180e9', '朋友聊天 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '9a57f95b-f6c8-4e68-8e08-a7878bef635f', '50162425-651a-4e31-8e0a-2800e17180e9', '朋友聊天 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'eee4e47b-a493-46bf-b8b7-1f2b7dd77e93', '50162425-651a-4e31-8e0a-2800e17180e9', '朋友聊天 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '6ac68dcf-bf69-4259-bf03-2e7a934433f6', '50162425-651a-4e31-8e0a-2800e17180e9', '朋友聊天 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'eb8debe7-2fd4-4829-961d-6e9ceb1b2cd6', '50162425-651a-4e31-8e0a-2800e17180e9', '朋友聊天 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'bb878eca-b1e3-40c8-a28f-13cc94ccc19a', 'zh', '工作面试', 'Interview', '请自我介绍一下', '💼', 9, 'work', '#4A6FA5', 9)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '732df794-6fe1-4b44-ad6d-d43be231e9b6', 'bb878eca-b1e3-40c8-a28f-13cc94ccc19a', '工作面试 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '64f4257c-27bb-4db0-9e4b-b6b471af87c8', 'bb878eca-b1e3-40c8-a28f-13cc94ccc19a', '工作面试 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '1e06365d-2218-4934-923f-bcd38ac1bf46', 'bb878eca-b1e3-40c8-a28f-13cc94ccc19a', '工作面试 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'ec4e6e97-32d6-4152-a984-f41863c08b36', 'bb878eca-b1e3-40c8-a28f-13cc94ccc19a', '工作面试 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'a4c7b68b-22bd-4481-b734-9e8ad478069b', 'bb878eca-b1e3-40c8-a28f-13cc94ccc19a', '工作面试 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '109d134c-45a7-4bde-9377-7e518944e991', 'bb878eca-b1e3-40c8-a28f-13cc94ccc19a', '工作面试 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0406529a-4c86-441f-a095-7486b41b670c', 'bb878eca-b1e3-40c8-a28f-13cc94ccc19a', '工作面试 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '26cc3559-2f57-4330-8304-06a029f44132', 'bb878eca-b1e3-40c8-a28f-13cc94ccc19a', '工作面试 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '61174682-789b-43ef-9706-526b7fddd790', 'bb878eca-b1e3-40c8-a28f-13cc94ccc19a', '工作面试 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '45501632-f418-416d-a764-48df15e30741', 'bb878eca-b1e3-40c8-a28f-13cc94ccc19a', '工作面试 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

INSERT INTO scenarios (id, language_code, title, title_zh, description, icon, grid_position, category, color, order_index) VALUES (
  'ef1a7d81-f375-45dc-90fe-e4a27d315f9a', 'zh', '机场出行', 'Airport', '请问登机口在哪里？', '✈️', 10, 'travel', '#9B715A', 10)
ON CONFLICT DO NOTHING;

INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '86e0f24c-6abc-4cde-993c-df648d96ae2d', 'ef1a7d81-f375-45dc-90fe-e4a27d315f9a', '机场出行 - Phrase 1', 'Translation 1', 'pron1', 'Context', 1)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '627bd680-68bc-497b-8851-53c806ef6bd6', 'ef1a7d81-f375-45dc-90fe-e4a27d315f9a', '机场出行 - Phrase 2', 'Translation 2', 'pron2', 'Context', 2)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5bcf61e3-1425-4fbe-8589-59109967026f', 'ef1a7d81-f375-45dc-90fe-e4a27d315f9a', '机场出行 - Phrase 3', 'Translation 3', 'pron3', 'Context', 3)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'd439ca8a-3a24-4d16-b93f-7b8beef350cb', 'ef1a7d81-f375-45dc-90fe-e4a27d315f9a', '机场出行 - Phrase 4', 'Translation 4', 'pron4', 'Context', 4)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  'be2d924b-4275-4c99-ad43-017e200d88e2', 'ef1a7d81-f375-45dc-90fe-e4a27d315f9a', '机场出行 - Phrase 5', 'Translation 5', 'pron5', 'Context', 5)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '7859586a-b53a-4c7a-a89a-9901b70f9608', 'ef1a7d81-f375-45dc-90fe-e4a27d315f9a', '机场出行 - Phrase 6', 'Translation 6', 'pron6', 'Context', 6)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '31a10b20-117c-416d-a709-ea7ffb44785e', 'ef1a7d81-f375-45dc-90fe-e4a27d315f9a', '机场出行 - Phrase 7', 'Translation 7', 'pron7', 'Context', 7)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '0cd8a51b-30f1-4e71-ba0f-86dc5fb2d82a', 'ef1a7d81-f375-45dc-90fe-e4a27d315f9a', '机场出行 - Phrase 8', 'Translation 8', 'pron8', 'Context', 8)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '3a67a102-2c1c-4db6-9e1a-9f69e54218b1', 'ef1a7d81-f375-45dc-90fe-e4a27d315f9a', '机场出行 - Phrase 9', 'Translation 9', 'pron9', 'Context', 9)
ON CONFLICT DO NOTHING;
INSERT INTO phrases (id, scenario_id, target_lang, native_lang, pronunciation, context_note, order_index) VALUES (
  '5116153a-4b46-497e-9f1d-2d6a6c52a4a7', 'ef1a7d81-f375-45dc-90fe-e4a27d315f9a', '机场出行 - Phrase 10', 'Translation 10', 'pron10', 'Context', 10)
ON CONFLICT DO NOTHING;

-- ========================================
-- ITALIAN VOCABULARY (100 words)
-- ========================================

INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'cdfee60d-c3cf-479f-ae8c-cc04fdb7a3d0', 'it', 'ciao', '你好/再见', 'chao', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '8366495d-1780-4393-88d9-45e26ce1ffc9', 'it', 'buongiorno', '早上好', 'bwon-djor-no', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '1075c12a-b891-40a0-a2f4-d7e6baf98caa', 'it', 'buonasera', '晚上好', 'bwo-na-se-ra', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '3c84dce3-5cfd-4797-9145-a00257ec270a', 'it', 'arrivederci', '再见', 'ar-ri-ve-der-chi', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '04cf2d1b-e44e-4567-a763-ff06febde192', 'it', 'grazie', '谢谢', 'grat-tsie', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '079499c0-b02a-4ae3-b1a0-75292ad0455f', 'it', 'prego', '不客气', 'pre-go', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '15ac2d39-7ef2-4d8e-b566-d5dbdff3752a', 'it', 'scusa', '对不起', 'sku-za', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '7f91df01-39a2-48a1-862d-d670a33d56f5', 'it', 'per favore', '请', 'per fa-vo-re', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'c3035f68-357c-44f1-b4ef-046d2d55aa44', 'it', 'sì', '是', 'si', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'a1f128ea-6233-47ce-ad9a-f5e5688eb2e4', 'it', 'no', '不', 'no', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'e0bc418d-de1d-4108-add4-68fe799b1f76', 'it', 'come stai?', '你好吗？', 'ko-me stai', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'd4953c5e-bdce-4fcf-ab40-a603d09fee4a', 'it', 'bene', '好', 'be-ne', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'ca47087c-a1ea-4de4-bf95-02202b108a2f', 'it', 'male', '不好', 'ma-le', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'cded2222-c6e0-4d4d-b7fe-6a0a988974aa', 'it', 'mi chiamo', '我叫', 'mi kya-mo', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '6d2b7619-9db9-4f66-9612-6ba92ff7cae4', 'it', 'piacere', '很高兴', 'pya-che-re', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '1e65aa12-d2a7-400b-98fc-6647e5b49e44', 'it', 'uno', '一', 'u-no', 'noun', 'beginner', '{number}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '3492da80-cd56-4184-aac6-67acf27fe3f8', 'it', 'due', '二', 'du-e', 'noun', 'beginner', '{number}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'ecc87f39-5d04-4404-82b8-2f19d5366a9f', 'it', 'tre', '三', 'tre', 'noun', 'beginner', '{number}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'edaee439-be2d-49c8-8fe7-2cf274b208d5', 'it', 'quattro', '四', 'kwat-tro', 'noun', 'beginner', '{number}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'dddf89a1-6eba-44e5-b288-aceeec7b36b0', 'it', 'cinque', '五', 'chin-kwe', 'noun', 'beginner', '{number}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '46533b51-25e6-4f9b-a87c-cd2d322c10ac', 'it', 'sei', '六', 'sei', 'noun', 'beginner', '{number}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '8faabe38-8a08-440a-a584-ea2373ba9172', 'it', 'sette', '七', 'set-te', 'noun', 'beginner', '{number}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '423c2804-c92a-460f-8785-93aef6c9233a', 'it', 'otto', '八', 'ot-to', 'noun', 'beginner', '{number}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '90dbef42-c7ec-497e-b5fe-81066da29faa', 'it', 'nove', '九', 'no-ve', 'noun', 'beginner', '{number}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'f931f531-8776-4c06-ad12-86d4f0a99ee3', 'it', 'dieci', '十', 'dye-chi', 'noun', 'beginner', '{number}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '2cc36ca6-573b-4998-98ac-ec0c2a7fe817', 'it', 'oggi', '今天', 'od-dji', 'noun', 'beginner', '{time}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '81412cdd-babc-4956-994d-21930203660b', 'it', 'domani', '明天', 'do-ma-ni', 'noun', 'beginner', '{time}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '6b39881b-98dd-45ac-8153-c6c651b71c62', 'it', 'ieri', '昨天', 'ye-ri', 'noun', 'beginner', '{time}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'f8635672-3cce-4b7d-91a3-ecfceb5279d5', 'it', 'ora', '现在', 'o-ra', 'noun', 'beginner', '{time}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'f09f4241-1824-4110-9f08-0f1b00374c33', 'it', 'dopo', '之后', 'do-po', 'noun', 'beginner', '{time}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'c672f469-10be-4e98-a60a-1055df1daeda', 'it', 'acqua', '水', 'ak-kwa', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '3ee87ef2-4453-416c-8695-f7e36879d0a6', 'it', 'pane', '面包', 'pa-ne', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '02ee589f-7032-4c25-9e4f-a97b414701c4', 'it', 'vino', '葡萄酒', 'vi-no', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'ccee6081-d7dd-4036-87c2-1ab940ec9eb0', 'it', 'caffè', '咖啡', 'kaf-fe', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '9fa13702-677d-4090-9d6f-289659920a64', 'it', 'latte', '牛奶', 'lat-te', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '9efecc42-b6dd-4cc6-a737-6612da463a61', 'it', 'zucchero', '糖', 'tsuk-ke-ro', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'd75ab26b-5632-4357-9a3d-375c7790bf48', 'it', 'pizza', '披萨', 'pit-tsa', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '5ea8b84e-a77f-4c3f-9caf-6a2132bab6ba', 'it', 'pasta', '意大利面', 'pas-ta', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'ec95c92b-d71e-4f0e-9efd-332c143a2d96', 'it', 'carne', '肉', 'kar-ne', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'e267d57f-604f-412c-b405-029fb98496df', 'it', 'pesce', '鱼', 'pe-she', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'f93d9c94-4e8d-4c30-99b5-34d333898662', 'it', 'verdura', '蔬菜', 'ver-du-ra', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '06d56086-ad2a-4027-b547-502cbd379627', 'it', 'frutta', '水果', 'frut-ta', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'f02e994c-f747-471c-b503-9ffc2b6bf2c4', 'it', 'dolce', '甜点', 'dol-che', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'b91be18a-b4b1-424d-ad16-42128f2f2f4e', 'it', 'amore', '爱', 'a-mo-re', 'noun', 'beginner', '{emotion}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '9ac56033-904a-4771-a088-5f94e0aaf273', 'it', 'felice', '开心', 'fe-li-che', 'noun', 'beginner', '{emotion}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '7358c816-d097-4194-8628-5eff91d74d8e', 'it', 'triste', '伤心', 'tris-te', 'noun', 'beginner', '{emotion}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '96a2984c-c191-431b-bf1e-41b5d565556b', 'it', 'bello', '美丽', 'bel-lo', 'noun', 'beginner', '{emotion}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'cbf5dc18-011a-4810-931c-3ba48d15da48', 'it', 'brutto', '丑陋', 'brut-to', 'noun', 'beginner', '{emotion}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '61857779-955e-453f-8626-02492fbc40d4', 'it', 'grande', '大', 'gran-de', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'ce3311da-e7b4-4ffd-9f6f-64daedcdd73c', 'it', 'piccolo', '小', 'pik-ko-lo', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '44a4b540-2c11-40a6-a41f-e436c171de0b', 'it', 'casa', '家', 'ka-za', 'noun', 'beginner', '{home}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '2890329b-8aac-4c33-8875-9e21cee0752f', 'it', 'scuola', '学校', 'skwo-la', 'noun', 'beginner', '{study}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '5d279f1a-d94e-4f1e-ad2e-8f12541584d2', 'it', 'lavoro', '工作', 'la-vo-ro', 'noun', 'beginner', '{work}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'b0a63af9-6679-4e57-a145-aca75e3328e2', 'it', 'amico', '朋友', 'a-mi-ko', 'noun', 'beginner', '{family}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '1abacc57-bddf-4a91-877c-b2fdd6863101', 'it', 'famiglia', '家庭', 'fa-mi-lya', 'noun', 'beginner', '{family}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '27ca4d87-0d6c-4d1a-a91c-76119692a9e3', 'it', 'madre', '母亲', 'ma-dre', 'noun', 'beginner', '{family}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '95a28961-6a0a-441f-aaf8-1dd555278c58', 'it', 'padre', '父亲', 'pa-dre', 'noun', 'beginner', '{family}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '780bff03-826e-46a8-b808-1968441f4fa1', 'it', 'fratello', '兄弟', 'fra-tel-lo', 'noun', 'beginner', '{family}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '6435e784-28dc-497b-8add-e7823b97a481', 'it', 'sorella', '姐妹', 'so-rel-la', 'noun', 'beginner', '{family}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '7ab43c7a-1222-49f6-8eb7-ca72f868d6c6', 'it', 'figlio', '儿子', 'fi-lyo', 'noun', 'beginner', '{family}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'b0701834-f710-4b95-b58c-1ff15b8204f9', 'it', 'figlia', '女儿', 'fi-lya', 'noun', 'beginner', '{family}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '1169f723-5f3e-4c08-8858-23177a2dc7de', 'it', 'tempo', '时间', 'tem-po', 'noun', 'beginner', '{time}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'ae4d6c72-114f-4688-a06c-344c30761fbd', 'it', 'giorno', '天', 'djor-no', 'noun', 'beginner', '{time}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'f86616ed-b186-44bb-8d65-f5e0051c6c48', 'it', 'notte', '夜晚', 'not-te', 'noun', 'beginner', '{time}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '33b12331-6071-43a8-bc44-4144ff765c2b', 'it', 'settimana', '星期', 'set-ti-ma-na', 'noun', 'beginner', '{time}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '870d543a-7222-462e-b4c4-9a33cc32842d', 'it', 'mese', '月', 'me-ze', 'noun', 'beginner', '{time}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '53823175-7118-4139-a8a0-03f4329231b7', 'it', 'anno', '年', 'an-no', 'noun', 'beginner', '{time}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '79cee546-7596-4cfb-b4ef-f01bdf2334fa', 'it', 'strada', '街道', 'stra-da', 'noun', 'beginner', '{travel}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '9e683cc5-ed10-47d9-9dbb-e86713c71510', 'it', 'città', '城市', 'chit-ta', 'noun', 'beginner', '{travel}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'fc2ff17c-c5d0-41b6-8566-9d97ee919f40', 'it', 'paese', '国家', 'pa-e-ze', 'noun', 'beginner', '{travel}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '4f999949-7089-4258-bcb4-2799e7fe922c', 'it', 'stazione', '车站', 'stat-tsio-ne', 'noun', 'beginner', '{travel}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '46a1e006-42af-4251-9a46-f9a7e76d7133', 'it', 'aeroporto', '机场', 'a-e-ro-por-to', 'noun', 'beginner', '{travel}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'c7ce45a8-9210-4205-95dd-63d69e30f0eb', 'it', 'albergo', '酒店', 'al-ber-go', 'noun', 'beginner', '{travel}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '3853a49a-1f75-45f7-b30f-c553888c4da8', 'it', 'ristorante', '餐厅', 'ris-to-ran-te', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '82f95f27-ee7f-41a3-8b2f-f5dceeec1638', 'it', 'negozio', '商店', 'ne-got-tsio', 'noun', 'beginner', '{shopping}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'c511ee98-8e17-4b20-a1bd-b433f5ab63c7', 'it', 'banca', '银行', 'ban-ka', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '7ac37541-eb92-43f2-a216-6e2be3210da6', 'it', 'ospedale', '医院', 'os-pe-da-le', 'noun', 'beginner', '{health}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '68ea83a4-1baf-405f-b943-09fc84ba88b6', 'it', 'farmacia', '药店', 'far-ma-chi-a', 'noun', 'beginner', '{health}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '30934bf6-0c81-4615-8693-b6a800eaea59', 'it', 'chiesa', '教堂', 'kye-za', 'noun', 'beginner', '{culture}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'ffc23ba7-9c86-48f1-94e3-8e7186b676b7', 'it', 'libro', '书', 'li-bro', 'noun', 'beginner', '{study}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '3938f974-68d9-4061-8887-39ecb7696f67', 'it', 'penna', '笔', 'pen-na', 'noun', 'beginner', '{study}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'fceb1e87-1b82-458c-bad1-592890645b33', 'it', 'telefono', '电话', 'te-le-fo-no', 'noun', 'beginner', '{tech}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '95c3fa76-04c1-46b8-b283-3e8086a32f11', 'it', 'computer', '电脑', 'kom-pyu-ter', 'noun', 'beginner', '{tech}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '4d208cd3-b5f8-4fd3-83d0-c404fd20f54e', 'it', 'macchina', '汽车', 'mak-ki-na', 'noun', 'beginner', '{travel}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '257d5aed-2f52-4717-9bc2-403e992a771f', 'it', 'treno', '火车', 'tre-no', 'noun', 'beginner', '{travel}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '937a534b-ac82-4dd6-92e6-933aa9a9ff4b', 'it', 'aereo', '飞机', 'a-e-re-o', 'noun', 'beginner', '{travel}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '21705891-de62-45a8-b499-41a9a2d49615', 'it', 'autobus', '公共汽车', 'au-to-bus', 'noun', 'beginner', '{travel}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'c9792bb2-bcae-4e70-b102-84952785e6e3', 'it', 'bicicletta', '自行车', 'bi-chi-klet-ta', 'noun', 'beginner', '{travel}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '61b68658-9609-40db-9973-2835e9b0a366', 'it', 'andare', '去', 'an-da-re', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'f17794b7-e04e-4470-89c6-2aa7223b7d9a', 'it', 'venire', '来', 've-ni-re', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '95decd9f-1b36-4fea-951e-1c3dabeaf6cd', 'it', 'mangiare', '吃', 'man-dja-re', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'ae842297-40c2-400f-a206-f1f418685686', 'it', 'bere', '喝', 'be-re', 'noun', 'beginner', '{food}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '0d8353cb-c103-44a5-b213-a920b54aaf0c', 'it', 'dormire', '睡觉', 'dor-mi-re', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '1789bd75-aa6a-4ba8-94c8-0f90d01243c3', 'it', 'leggere', '阅读', 'led-dje-re', 'noun', 'beginner', '{study}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '72f60deb-1fe5-497e-b758-1ac54c25b97c', 'it', 'scrivere', '写', 'skri-ve-re', 'noun', 'beginner', '{study}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '10834239-deef-4ea3-8efd-e9edb24cf011', 'it', 'parlare', '说话', 'par-la-re', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '942dda11-4192-48ee-a8d1-2503d6a974ce', 'it', 'ascoltare', '听', 'as-kol-ta-re', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'b956b471-564f-44d2-aaa4-c9b5cba51c89', 'it', 'vedere', '看', 've-de-re', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'c45f2559-65ef-440e-a306-b26c149d70f0', 'it', 'comprare', '买', 'kom-pra-re', 'noun', 'beginner', '{shopping}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '43d5ae04-e49a-4448-aa38-59e21487c5e8', 'it', 'vendere', '卖', 'ven-de-re', 'noun', 'beginner', '{shopping}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'b954e84f-a3be-4279-b572-13f5360a8573', 'it', 'lavorare', '工作', 'la-vo-ra-re', 'noun', 'beginner', '{work}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  '3fff7aa9-a13d-41df-90a8-2417f0f8e175', 'it', 'studiare', '学习', 'stu-dya-re', 'noun', 'beginner', '{study}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
INSERT INTO vocabulary_items (id, language_code, word, meaning, reading, part_of_speech, level, tags, source) VALUES (
  'f4b3d49c-b102-43dd-9cac-646c72381900', 'it', 'giocare', '玩', 'djo-ka-re', 'noun', 'beginner', '{daily}', 'manual')
ON CONFLICT (language_code, word) DO NOTHING;
-- ========================================
-- TEXTBOOK CONTENT (all 10 languages)
-- ========================================

INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  '77fcc587-4a0c-4862-a2b4-538133d7f482', 'ja', 'minna_ja', 'みんなの日本語', 'Minna no Nihongo')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  'a308ae15-a22e-4d4b-b922-d714f46da2d0', 'ja', 'genki_ja', 'げんき', 'Genki')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  'a32aaed8-47c1-405c-b796-2e38433db0cb', 'en', 'interchange_en', 'Interchange', 'Interchange')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  '22fb4dc1-049c-4eb1-81a5-f567c32e66d0', 'en', 'headway_en', 'New Headway', 'New Headway')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  '6495aa34-834d-45ff-838e-ccf901f557d1', 'ko', 'sejong_ko', '세종한국어', 'Sejong Korean')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  '0ce28b9b-348b-482e-bf4b-be0e55fc9b9b', 'ko', 'sogang_ko', '서강한국어', 'Sogang Korean')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  '0ef32d34-794b-4d32-a36d-6a6dc02a3ba4', 'fr', 'alter_fr', 'Alter Ego', 'Alter Ego')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  '17fa8303-fc43-4256-add6-770d44d9eade', 'fr', 'edito_fr', 'Édito', 'Édito')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  '4c55dcdd-8f3a-4d81-91a1-4b2743af7e7e', 'es', 'aula_es', 'Aula Internacional', 'Aula')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  '71c7ac9c-449d-471a-9277-c060947b4ce9', 'es', 'prisma_es', 'Prisma', 'Prisma')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  '4dc1cba6-cb25-444a-bcdb-06506f90ebb5', 'de', 'menschen_de', 'Menschen', 'Menschen')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  'ad770371-2d12-4a01-9f24-5db4a3a1bdf1', 'de', 'schritte_de', 'Schritte', 'Schritte')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  'dcbf249e-acf5-441e-8ac9-9f1b0ba1287a', 'it', 'nuovo_it', 'Nuovo Espresso', 'Nuovo Espresso')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  '4abe389b-12e2-4e67-90d0-306cc85d1939', 'it', 'progetto_it', 'Progetto Italiano', 'Progetto')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  'a3ebeda7-aa9b-464a-a2c7-a148a3854f76', 'pt', 'bom_pt', 'Bom Dia!', 'Bom Dia!')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  '6d12da8b-0769-4ec0-ac19-691ec867be21', 'pt', 'novo_pt', 'Novo Avenida Brasil', 'Avenida Brasil')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  '69220d0e-29a3-42ce-abec-719f5098b395', 'ar', 'kitab_ar', 'الكتاب في تعلم العربية', 'Al-Kitaab')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  '4ec426dd-04a7-4e4d-8663-d498f34cf4bc', 'ar', 'arabiyya_ar', 'العربية بين يديك', 'Arabiyya Bayna Yadayk')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  'a888134c-ff67-4c8d-b533-b1ba176aba09', 'zh', 'hsk_zh', 'HSK标准教程', 'HSK Standard Course')
ON CONFLICT DO NOTHING;
INSERT INTO textbook_index (id, language_code, textbook_id, title, display_name) VALUES (
  'ea7ccc69-b2e9-43cf-bd8f-7615b7fe50fe', 'zh', 'road_zh', '成功之路', 'Road to Success')
ON CONFLICT DO NOTHING;

-- ========================================
-- EXAM TARGET VOCABULARY (all languages)
-- ========================================

INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '056fee3d-3f56-4fbc-b57c-53aa1751b2f5', 'ja', 'N5', 'Japanese N5', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '14ff4078-9b5f-44d0-987e-a9c2787aca8d', 'ja', 'N4', 'Japanese N4', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '429a55c2-7491-408e-9a88-8f83bfd88419', 'ja', 'N3', 'Japanese N3', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '23cc9340-0978-420d-9c90-2213a6433a37', 'ja', 'N2', 'Japanese N2', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '3975a127-39fe-4006-8cd7-96bfc248b943', 'ja', 'N1', 'Japanese N1', 'advanced')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '36c935c8-da26-40b4-9d97-d56befa1e495', 'en', 'A1', 'English A1', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '18d4b052-1256-4eed-bf50-d41eab9b5d3d', 'en', 'A2', 'English A2', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'fc43059e-14ae-49c3-b296-72b68d292b56', 'en', 'B1', 'English B1', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '692720ab-2b3b-447e-a1a8-3dbbd27d4cd7', 'en', 'B2', 'English B2', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'c56c02f4-6ed5-4cbc-9945-6677ada52270', 'en', 'C1', 'English C1', 'advanced')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '6d1e9185-2c6d-4788-9061-895f086c9217', 'ko', 'TOPIK1', 'Korean TOPIK1', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '0eaf2c04-6a25-4290-9899-661effc67159', 'ko', 'TOPIK2', 'Korean TOPIK2', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '10cfb9e6-dc6e-4455-a7c7-c85c886cf918', 'ko', 'TOPIK3', 'Korean TOPIK3', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'cb77e621-4130-40cd-8c98-49dc6e6df430', 'ko', 'TOPIK4', 'Korean TOPIK4', 'advanced')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'a16097cb-7aa2-40a1-9686-70011441adb9', 'fr', 'DELF_A1', 'French DELF_A1', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'f83cffbc-236f-48a4-a523-1801aee1a5ce', 'fr', 'DELF_A2', 'French DELF_A2', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'b4c79818-c131-444f-8dfc-044e11ad7f7e', 'fr', 'DELF_B1', 'French DELF_B1', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '407885a6-3730-43ad-95e4-1efc75035b09', 'fr', 'DELF_B2', 'French DELF_B2', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '27b6f8a2-5d5a-4701-9ba6-5f9e1d4d280d', 'es', 'DELE_A1', 'Spanish DELE_A1', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'cd16a261-2136-4b25-abcd-63c54eb08e2c', 'es', 'DELE_A2', 'Spanish DELE_A2', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'c087fe91-5e22-4bf6-a08e-7956cfb88323', 'es', 'DELE_B1', 'Spanish DELE_B1', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'f3bcd0ea-0892-4b23-8fd9-b2e328620004', 'es', 'DELE_B2', 'Spanish DELE_B2', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '14f18e10-c7f4-4c69-b636-80c344138197', 'de', 'Goethe_A1', 'German Goethe_A1', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '8caf0a6a-773a-4e57-9cad-2db7b3cc76ba', 'de', 'Goethe_A2', 'German Goethe_A2', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'b4fb18a2-2352-4632-a349-4a90e9a9e3f1', 'de', 'Goethe_B1', 'German Goethe_B1', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'dfcfedc3-169e-4ba4-9189-3415822dc610', 'de', 'Goethe_B2', 'German Goethe_B2', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '3f12b8c7-616c-4b8c-b61c-87329890cb58', 'it', 'CILS_A1', 'Italian CILS_A1', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'b58c60a0-d254-4a66-99b5-02228c59096f', 'it', 'CILS_A2', 'Italian CILS_A2', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '79877e33-d640-488f-9337-b84faa604db5', 'it', 'CILS_B1', 'Italian CILS_B1', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'c95e79ab-6b48-4d2a-bb84-122f16071b64', 'it', 'CILS_B2', 'Italian CILS_B2', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'b9abf6bb-c9d0-4203-a9c9-7f39c0335706', 'pt', 'CELPE_A1', 'Portuguese CELPE_A1', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'ddcba2ab-2238-45da-9bf7-dc561758d355', 'pt', 'CELPE_A2', 'Portuguese CELPE_A2', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'cb256f80-1297-4242-99b7-90c4bdb91467', 'pt', 'CELPE_B1', 'Portuguese CELPE_B1', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'ed2d5f49-f9bc-4703-8c50-92bb8e82e3f3', 'pt', 'CELPE_B2', 'Portuguese CELPE_B2', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'ca98c7f8-a447-4ab0-917c-654d534cbfd7', 'ar', 'ALPT_1', 'Arabic ALPT_1', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '7dbd7854-0bc8-4bb0-8683-4bccdae18f71', 'ar', 'ALPT_2', 'Arabic ALPT_2', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'cb6d4229-a652-4306-a3f7-ffae809a3fa7', 'ar', 'ALPT_3', 'Arabic ALPT_3', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '8f658834-6438-4635-b12f-d42e7a5d15ab', 'ar', 'ALPT_4', 'Arabic ALPT_4', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'e2abcafe-f473-4ad4-82d3-4c3dd0ec3f9e', 'zh', 'HSK1', 'Chinese HSK1', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'c9d625da-7d8d-4dae-a82f-9c62e8617da2', 'zh', 'HSK2', 'Chinese HSK2', 'beginner')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  'fef2b60b-8b1a-40cb-84fa-2fdacd638c13', 'zh', 'HSK3', 'Chinese HSK3', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '865a9cbf-bee8-43d2-a293-2c2a1313855a', 'zh', 'HSK4', 'Chinese HSK4', 'intermediate')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '9533f149-9c0c-42bd-9162-596367032980', 'zh', 'HSK5', 'Chinese HSK5', 'advanced')
ON CONFLICT DO NOTHING;
INSERT INTO exam_targets (id, language_code, exam_level, display_name, difficulty) VALUES (
  '12ad854d-1658-4ca4-a2c9-9734ed96217d', 'zh', 'HSK6', 'Chinese HSK6', 'advanced')
ON CONFLICT DO NOTHING;
