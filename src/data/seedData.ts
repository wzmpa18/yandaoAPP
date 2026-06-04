/**
 * 种子数据文件 — 为 LocalAdapter 提供完整的预填数据
 * 
 * 覆盖所有模块：电台、游戏、社交、学习内容、场景、短语、考试、AI配置等。
 * 当 localStorage 表为空时自动填充，确保离线模式下应用有完整演示内容。
 * 
 * 修复原因：原先组件直接依赖 mockData 中的静态数据，但 dp.selectOne 崩溃后
 * 连静态 fallback 都无法到达。现在通过 seed 预填到 localStorage，确保
 * 所有数据查询都能正常返回结果。
 */

import type { IDataProvider } from '../providers/types';

// ── 类型定义 ──────────────────────────────────────────────────────────────────

interface SeedRow {
  id: string;
  [key: string]: unknown;
}

// ── 电台内容 (VirtualRadio) ────────────────────────────────────────────────────
// 5种类型 × 3种语言(ja/en/ko) = 15条

const radioContents: SeedRow[] = [
  // 日语电台
  { id: 'radio_ja_news_1', type: 'radio', language: 'ja', category: 'news', title: 'NHK今日速報', content: '本日のニュースをお伝えします。まずは国内の話題から...', translation: '为您播报今日新闻。首先从国内新闻开始...', duration: 180, source: 'template', created_at: new Date().toISOString() },
  { id: 'radio_ja_music_1', type: 'radio', language: 'ja', category: 'music', title: 'J-POP ヒットチャート', content: '今週のJ-POPランキング、第1位は...', translation: '本周J-POP排行榜，第一名是...', duration: 240, source: 'template', created_at: new Date().toISOString() },
  { id: 'radio_ja_story_1', type: 'radio', language: 'ja', category: 'story', title: '昔話：桃太郎', content: 'むかしむかし、あるところにおじいさんとおばあさんが...', translation: '很久很久以前，有一个老爷爷和老奶奶...', duration: 300, source: 'template', created_at: new Date().toISOString() },
  { id: 'radio_ja_business_1', type: 'radio', language: 'ja', category: 'business', title: 'ビジネス日本語会話', content: '本日の商談では、まず自己紹介から始めましょう...', translation: '今天的商务谈判，让我们先从自我介绍开始...', duration: 200, source: 'template', created_at: new Date().toISOString() },
  { id: 'radio_ja_academic_1', type: 'radio', language: 'ja', category: 'academic', title: '日本語文法：敬語の使い方', content: '敬語には尊敬語、謙譲語、丁寧語の三種類があります...', translation: '敬语有三种类型：尊敬语、谦让语和礼貌语...', duration: 220, source: 'template', created_at: new Date().toISOString() },
  // 英语电台
  { id: 'radio_en_news_1', type: 'radio', language: 'en', category: 'news', title: 'BBC World News Brief', content: 'Welcome to today\'s news briefing. Our top story...', translation: '欢迎收听今日新闻简报。头条新闻...', duration: 180, source: 'template', created_at: new Date().toISOString() },
  { id: 'radio_en_music_1', type: 'radio', language: 'en', category: 'music', title: 'Billboard Hot 100', content: 'This week\'s number one single is...', translation: '本周冠军单曲是...', duration: 240, source: 'template', created_at: new Date().toISOString() },
  { id: 'radio_en_story_1', type: 'radio', language: 'en', category: 'story', title: 'Classic Tales: Cinderella', content: 'Once upon a time, there was a kind girl named Cinderella...', translation: '从前，有一个善良的女孩叫灰姑娘...', duration: 300, source: 'template', created_at: new Date().toISOString() },
  { id: 'radio_en_business_1', type: 'radio', language: 'en', category: 'business', title: 'Business English: Meetings', content: 'Today we\'ll cover how to run an effective business meeting...', translation: '今天我们介绍如何主持高效的商务会议...', duration: 200, source: 'template', created_at: new Date().toISOString() },
  { id: 'radio_en_academic_1', type: 'radio', language: 'en', category: 'academic', title: 'Academic Writing Tips', content: 'When writing an academic paper, structure is key...', translation: '写学术论文时，结构是关键...', duration: 220, source: 'template', created_at: new Date().toISOString() },
  // 韩语电台
  { id: 'radio_ko_news_1', type: 'radio', language: 'ko', category: 'news', title: 'KBS 뉴스', content: '오늘의 주요 뉴스를 전해드립니다. 첫 번째 소식은...', translation: '为您播报今日要闻。第一条消息是...', duration: 180, source: 'template', created_at: new Date().toISOString() },
  { id: 'radio_ko_music_1', type: 'radio', language: 'ko', category: 'music', title: 'K-POP 차트', content: '이번 주 K-POP 차트 1위는...', translation: '本周K-POP榜单第一名是...', duration: 240, source: 'template', created_at: new Date().toISOString() },
  { id: 'radio_ko_story_1', type: 'radio', language: 'ko', category: 'story', title: '전래동화: 흥부와 놀부', content: '옛날 옛적에 흥부와 놀부라는 두 형제가 살았습니다...', translation: '从前有兴夫和诺夫两兄弟...', duration: 300, source: 'template', created_at: new Date().toISOString() },
  { id: 'radio_ko_business_1', type: 'radio', language: 'ko', category: 'business', title: '비즈니스 한국어', content: '오늘 회의에서는 먼저 자기소개부터 시작하겠습니다...', translation: '今天的会议从自我介绍开始...', duration: 200, source: 'template', created_at: new Date().toISOString() },
  { id: 'radio_ko_academic_1', type: 'radio', language: 'ko', category: 'academic', title: '한국어 문법: 조사', content: '한국어의 조사는 크게 주격 조사, 목적격 조사로 나뉩니다...', translation: '韩语助词主要分为主格助词和宾格助词...', duration: 220, source: 'template', created_at: new Date().toISOString() },
];

// ── 游戏题目 (GameArena) ────────────────────────────────────────────────────────
// game_content_pool: 30道各难度题目

const gameContentPool: SeedRow[] = [
  // 简单题 (easy) - 10道
  { id: 'game_q_easy_1', difficulty: 'easy', language: 'en', type: 'vocabulary', question: 'What does "apple" mean?', options: JSON.stringify(['苹果', '香蕉', '橘子', '葡萄']), correct_index: 0, explanation: '"Apple" means 苹果', points: 10, created_at: new Date().toISOString() },
  { id: 'game_q_easy_2', difficulty: 'easy', language: 'en', type: 'vocabulary', question: 'What does "dog" mean?', options: JSON.stringify(['猫', '狗', '鸟', '鱼']), correct_index: 1, explanation: '"Dog" means 狗', points: 10, created_at: new Date().toISOString() },
  { id: 'game_q_easy_3', difficulty: 'easy', language: 'ja', type: 'vocabulary', question: '"ありがとう" 的意思是？', options: JSON.stringify(['你好', '谢谢', '再见', '对不起']), correct_index: 1, explanation: '"ありがとう" 表示谢谢', points: 10, created_at: new Date().toISOString() },
  { id: 'game_q_easy_4', difficulty: 'easy', language: 'ja', type: 'vocabulary', question: '"こんにちは" 的意思是？', options: JSON.stringify(['谢谢', '对不起', '你好', '再见']), correct_index: 2, explanation: '"こんにちは" 表示你好', points: 10, created_at: new Date().toISOString() },
  { id: 'game_q_easy_5', difficulty: 'easy', language: 'ko', type: 'vocabulary', question: '"감사합니다" 的意思是？', options: JSON.stringify(['你好', '再见', '对不起', '谢谢']), correct_index: 3, explanation: '"감사합니다" 表示谢谢', points: 10, created_at: new Date().toISOString() },
  { id: 'game_q_easy_6', difficulty: 'easy', language: 'en', type: 'grammar', question: 'Choose: I ___ a student.', options: JSON.stringify(['am', 'is', 'are', 'be']), correct_index: 0, explanation: '"I am" is correct for first person singular', points: 15, created_at: new Date().toISOString() },
  { id: 'game_q_easy_7', difficulty: 'easy', language: 'en', type: 'grammar', question: 'Choose: She ___ to school.', options: JSON.stringify(['go', 'goes', 'going', 'gone']), correct_index: 1, explanation: 'Third person singular needs "goes"', points: 15, created_at: new Date().toISOString() },
  { id: 'game_q_easy_8', difficulty: 'easy', language: 'ja', type: 'grammar', question: '正しい助詞を選んで：私___学生です。', options: JSON.stringify(['が', 'は', 'を', 'に']), correct_index: 1, explanation: '「私は」で主語を表す', points: 15, created_at: new Date().toISOString() },
  { id: 'game_q_easy_9', difficulty: 'easy', language: 'ko', type: 'grammar', question: '맞는 조사: 저___ 학생입니다.', options: JSON.stringify(['을', '는', '가', '의']), correct_index: 1, explanation: '"저는"이 주어 표시로 맞음', points: 15, created_at: new Date().toISOString() },
  { id: 'game_q_easy_10', difficulty: 'easy', language: 'en', type: 'listening', question: '(Listen) What is the speaker saying? "Hello, how are you?"', options: JSON.stringify(['Goodbye', 'Hello, how are you?', 'Nice to meet you', 'See you later']), correct_index: 1, explanation: 'The speaker is greeting and asking about wellbeing', points: 20, created_at: new Date().toISOString() },
  // 中等题 (medium) - 10道
  { id: 'game_q_med_1', difficulty: 'medium', language: 'en', type: 'vocabulary', question: 'What does "diligent" mean?', options: JSON.stringify(['勤奋的', '懒惰的', '聪明的', '善良的']), correct_index: 0, explanation: '"Diligent" means hardworking', points: 20, created_at: new Date().toISOString() },
  { id: 'game_q_med_2', difficulty: 'medium', language: 'ja', type: 'vocabulary', question: '"いただきます" 什么时候说？', options: JSON.stringify(['吃饭前', '吃饭后', '见面时', '告别时']), correct_index: 0, explanation: '饭前表示感谢', points: 20, created_at: new Date().toISOString() },
  { id: 'game_q_med_3', difficulty: 'medium', language: 'en', type: 'grammar', question: 'Complete: I have ___ to Paris twice.', options: JSON.stringify(['been', 'went', 'gone', 'go']), correct_index: 0, explanation: 'Present perfect "have been" for experience', points: 25, created_at: new Date().toISOString() },
  { id: 'game_q_med_4', difficulty: 'medium', language: 'en', type: 'grammar', question: 'Choose: If I ___ rich, I would travel.', options: JSON.stringify(['am', 'was', 'were', 'be']), correct_index: 2, explanation: 'Subjunctive mood: "If I were"', points: 25, created_at: new Date().toISOString() },
  { id: 'game_q_med_5', difficulty: 'medium', language: 'ja', type: 'grammar', question: '正しい活用：食べ___ (可能形)', options: JSON.stringify(['ます', 'られる', 'たい', 'ない']), correct_index: 1, explanation: '食べるの可能形は「食べられる」', points: 25, created_at: new Date().toISOString() },
  { id: 'game_q_med_6', difficulty: 'medium', language: 'ko', type: 'grammar', question: '맞는 표현: 먹___ (할 수 있다)', options: JSON.stringify(['습니다', '을 수 있다', '고 싶다', '지 않다']), correct_index: 1, explanation: '"먹을 수 있다"가 능력을 표현', points: 25, created_at: new Date().toISOString() },
  { id: 'game_q_med_7', difficulty: 'medium', language: 'en', type: 'reading', question: 'Read: "The quick brown fox jumps over the lazy dog." What animal is lazy?', options: JSON.stringify(['fox', 'dog', 'cat', 'bird']), correct_index: 1, explanation: 'The text says "the lazy dog"', points: 20, created_at: new Date().toISOString() },
  { id: 'game_q_med_8', difficulty: 'medium', language: 'ja', type: 'reading', question: '読解：「今日はとてもいい天気です」— どんな天気？', options: JSON.stringify(['雨', '雪', '晴れ', '曇り']), correct_index: 2, explanation: '「いい天気」は晴れを指す', points: 20, created_at: new Date().toISOString() },
  { id: 'game_q_med_9', difficulty: 'medium', language: 'en', type: 'translation', question: 'Translate: "我很高兴认识你"', options: JSON.stringify(['I\'m happy to meet you', 'I\'m sad to meet you', 'I\'m angry', 'I\'m tired']), correct_index: 0, explanation: 'Correct translation', points: 25, created_at: new Date().toISOString() },
  { id: 'game_q_med_10', difficulty: 'medium', language: 'ja', type: 'translation', question: '翻译：「今日は何をしますか」', options: JSON.stringify(['What did you do yesterday?', 'What will you do today?', 'Where are you?', 'Who are you?']), correct_index: 1, explanation: '今日＝today, 何をしますか＝what will you do', points: 25, created_at: new Date().toISOString() },
  // 困难题 (hard) - 10道
  { id: 'game_q_hard_1', difficulty: 'hard', language: 'en', type: 'vocabulary', question: 'What does "ephemeral" mean?', options: JSON.stringify(['永恒的', '短暂的', '重要的', '美丽的']), correct_index: 1, explanation: '"Ephemeral" means short-lived', points: 30, created_at: new Date().toISOString() },
  { id: 'game_q_hard_2', difficulty: 'hard', language: 'en', type: 'idiom', question: 'What does "break the ice" mean?', options: JSON.stringify(['打破冰块', '打破沉默', '打破纪录', '打破规则']), correct_index: 1, explanation: '"Break the ice" means to relieve tension in social situations', points: 30, created_at: new Date().toISOString() },
  { id: 'game_q_hard_3', difficulty: 'hard', language: 'ja', type: 'idiom', question: '「猫の手も借りたい」の意味は？', options: JSON.stringify(['猫が好き', 'とても忙しい', '猫を飼いたい', '手伝いたい']), correct_index: 1, explanation: '忙しすぎて猫の手も借りたいほど', points: 30, created_at: new Date().toISOString() },
  { id: 'game_q_hard_4', difficulty: 'hard', language: 'ko', type: 'idiom', question: '"그림의 떡" 무슨 뜻?', options: JSON.stringify(['맛있는 떡', '그림 속 떡', '손에 넣을 수 없는 것', '선물']), correct_index: 2, explanation: '볼 수만 있고 가질 수 없는 것', points: 30, created_at: new Date().toISOString() },
  { id: 'game_q_hard_5', difficulty: 'hard', language: 'en', type: 'grammar', question: 'Choose: Not only ___ late, but he also forgot the documents.', options: JSON.stringify(['he was', 'was he', 'did he', 'he did']), correct_index: 1, explanation: 'Inversion after "Not only"', points: 35, created_at: new Date().toISOString() },
  { id: 'game_q_hard_6', difficulty: 'hard', language: 'ja', type: 'grammar', question: '正しい：彼は日本語を話す___、英語も話せる。', options: JSON.stringify(['だけでなく', 'だけ', 'しか', 'ばかり']), correct_index: 0, explanation: '「だけでなく」で「不仅...而且」', points: 35, created_at: new Date().toISOString() },
  { id: 'game_q_hard_7', difficulty: 'hard', language: 'en', type: 'reading', question: 'The author argues that linguistic relativity suggests our perception of reality is shaped by language. What is the main idea?', options: JSON.stringify(['Language is unimportant', 'Language shapes perception', 'Reality is fixed', 'Grammar is hard']), correct_index: 1, explanation: 'Linguistic relativity = language shapes thought', points: 30, created_at: new Date().toISOString() },
  { id: 'game_q_hard_8', difficulty: 'hard', language: 'ja', type: 'reading', question: '読解：筆者は日本語の「わびさび」の概念について説明しています。「わびさび」とは何ですか？', options: JSON.stringify(['派手な美', '不完全の美', '完璧な美', '西洋の美']), correct_index: 1, explanation: 'わびさびは不完全さの中の美しさ', points: 30, created_at: new Date().toISOString() },
  { id: 'game_q_hard_9', difficulty: 'hard', language: 'en', type: 'writing', question: 'Write a sentence using "nevertheless":', options: JSON.stringify(['Correct usage', 'Wrong usage', 'No answer', 'I don\'t know']), correct_index: 0, explanation: '"Nevertheless" means despite that', points: 30, created_at: new Date().toISOString() },
  { id: 'game_q_hard_10', difficulty: 'hard', language: 'en', type: 'culture', question: 'In Japan, what does removing shoes before entering a home signify?', options: JSON.stringify(['Fashion', 'Respect and cleanliness', 'It\'s the law', 'Religious requirement']), correct_index: 1, explanation: 'Removing shoes shows respect and keeps the home clean', points: 30, created_at: new Date().toISOString() },
];

// daily_challenges: 7天每日挑战
const dailyChallenges: SeedRow[] = [];
for (let day = 0; day < 7; day++) {
  const d = new Date();
  d.setDate(d.getDate() - day);
  dailyChallenges.push({
    id: `daily_challenge_${day + 1}`,
    date: d.toISOString().split('T')[0],
    title: day === 0 ? '今日挑战' : `第${day + 1}天挑战`,
    description: `完成${5 - day % 3}道题目获得额外奖励`,
    target_count: 5 - (day % 3),
    reward_xp: 50 + day * 10,
    language: ['en', 'ja', 'ko'][day % 3],
    difficulty: ['easy', 'medium', 'hard'][day % 3],
    created_at: d.toISOString(),
  });
}

// seasons + season_rankings
const seasons: SeedRow[] = [
  { id: 'season_1', name: 'Season 1: Spring Challenge', start_date: '2025-03-01', end_date: '2025-05-31', status: 'ended', created_at: '2025-03-01T00:00:00Z' },
  { id: 'season_2', name: 'Season 2: Summer Sprint', start_date: '2025-06-01', end_date: '2025-08-31', status: 'ended', created_at: '2025-06-01T00:00:00Z' },
  { id: 'season_3', name: 'Season 3: Autumn Cup', start_date: '2025-09-01', end_date: '2025-11-30', status: 'active', created_at: '2025-09-01T00:00:00Z' },
];

const seasonRankings: SeedRow[] = [
  { id: 'sr_1', season_id: 'season_3', user_id: 'user_1', rank: 1, xp: 12500, wins: 45, created_at: new Date().toISOString() },
  { id: 'sr_2', season_id: 'season_3', user_id: 'user_2', rank: 2, xp: 11200, wins: 40, created_at: new Date().toISOString() },
  { id: 'sr_3', season_id: 'season_3', user_id: 'user_3', rank: 3, xp: 10800, wins: 38, created_at: new Date().toISOString() },
  { id: 'sr_4', season_id: 'season_3', user_id: 'user_4', rank: 4, xp: 9500, wins: 33, created_at: new Date().toISOString() },
  { id: 'sr_5', season_id: 'season_3', user_id: 'user_5', rank: 5, xp: 8900, wins: 30, created_at: new Date().toISOString() },
];

// ── 社交数据 (StudyCircle/FriendSystem/PartnerHub) ────────────────────────────

const userProfiles: SeedRow[] = [
  { id: 'user_1', nickname: '日语达人Tanaka', avatar: '/avatars/avatar1.png', location: 'Tokyo, Japan', location_code: 'JP', interests: JSON.stringify(['anime', 'manga', 'ramen']), learning_languages: JSON.stringify(['en', 'ko']), level: 25, xp: 12500, streak: 67, bio: 'こんにちは！日本語を勉強している方、一緒に頑張りましょう！', privacy: JSON.stringify({ allowDiscover: true, showLocation: true, showInterests: true }), created_at: new Date().toISOString() },
  { id: 'user_2', nickname: 'EnglishPro_Sarah', avatar: '/avatars/avatar2.png', location: 'New York, USA', location_code: 'US', interests: JSON.stringify(['travel', 'cooking', 'movies']), learning_languages: JSON.stringify(['ja', 'fr']), level: 30, xp: 15800, streak: 120, bio: 'Language lover! Let\'s exchange English for Japanese!', privacy: JSON.stringify({ allowDiscover: true, showLocation: true, showInterests: true }), created_at: new Date().toISOString() },
  { id: 'user_3', nickname: 'K-popFAN_민수', avatar: '/avatars/avatar3.png', location: 'Seoul, Korea', location_code: 'KR', interests: JSON.stringify(['kpop', 'kdrama', 'food']), learning_languages: JSON.stringify(['en', 'ja', 'zh']), level: 22, xp: 10200, streak: 45, bio: '한국어 배우고 싶은 분들 환영합니다!', privacy: JSON.stringify({ allowDiscover: true, showLocation: true, showInterests: true }), created_at: new Date().toISOString() },
  { id: 'user_4', nickname: 'FrenchLover_Pierre', avatar: '/avatars/avatar4.png', location: 'Paris, France', location_code: 'FR', interests: JSON.stringify(['art', 'wine', 'philosophy']), learning_languages: JSON.stringify(['ja', 'zh']), level: 18, xp: 7800, streak: 30, bio: 'Bonjour! Je peux vous aider avec le français!', privacy: JSON.stringify({ allowDiscover: true, showLocation: true, showInterests: false }), created_at: new Date().toISOString() },
  { id: 'user_5', nickname: '西语小哥Carlos', avatar: '/avatars/avatar5.png', location: 'Barcelona, Spain', location_code: 'ES', interests: JSON.stringify(['football', 'music', 'dance']), learning_languages: JSON.stringify(['en', 'ja']), level: 20, xp: 9100, streak: 55, bio: '¡Hola! Aprendamos idiomas juntos!', privacy: JSON.stringify({ allowDiscover: true, showLocation: true, showInterests: true }), created_at: new Date().toISOString() },
  { id: 'user_6', nickname: '德语学霸Hans', avatar: '/avatars/avatar6.png', location: 'Berlin, Germany', location_code: 'DE', interests: JSON.stringify(['technology', 'cars', 'beer']), learning_languages: JSON.stringify(['ja', 'ko']), level: 28, xp: 13400, streak: 90, bio: 'Deutsch lernen macht Spaß!', privacy: JSON.stringify({ allowDiscover: true, showLocation: false, showInterests: true }), created_at: new Date().toISOString() },
  { id: 'user_7', nickname: '中文老师李华', avatar: '/avatars/avatar7.png', location: 'Beijing, China', location_code: 'CN', interests: JSON.stringify(['calligraphy', 'tea', 'poetry']), learning_languages: JSON.stringify(['en', 'ja', 'ko']), level: 35, xp: 18500, streak: 200, bio: '大家好！我可以帮助大家学习中文！', privacy: JSON.stringify({ allowDiscover: true, showLocation: true, showInterests: true }), created_at: new Date().toISOString() },
  { id: 'user_8', nickname: 'ItalianoMarco', avatar: '/avatars/avatar8.png', location: 'Rome, Italy', location_code: 'IT', interests: JSON.stringify(['pizza', 'history', 'fashion']), learning_languages: JSON.stringify(['en', 'ja']), level: 15, xp: 5600, streak: 20, bio: 'Ciao! Impariamo insieme!', privacy: JSON.stringify({ allowDiscover: true, showLocation: true, showInterests: true }), created_at: new Date().toISOString() },
  { id: 'user_9', nickname: 'PortugueseAna', avatar: '/avatars/avatar9.png', location: 'Lisbon, Portugal', location_code: 'PT', interests: JSON.stringify(['surfing', 'photography', 'coffee']), learning_languages: JSON.stringify(['en', 'es']), level: 12, xp: 4200, streak: 15, bio: 'Olá! Vamos aprender português!', privacy: JSON.stringify({ allowDiscover: true, showLocation: true, showInterests: true }), created_at: new Date().toISOString() },
  { id: 'user_10', nickname: 'ArabLearner_Fatima', avatar: '/avatars/avatar10.png', location: 'Dubai, UAE', location_code: 'AE', interests: JSON.stringify(['calligraphy', 'poetry', 'desert']), learning_languages: JSON.stringify(['en', 'fr', 'ja']), level: 19, xp: 8300, streak: 40, bio: 'مرحباً! تعالوا نتعلم معاً!', privacy: JSON.stringify({ allowDiscover: true, showLocation: false, showInterests: true }), created_at: new Date().toISOString() },
  { id: 'user_11', nickname: 'LinguaMaster_Tom', avatar: '/avatars/avatar1.png', location: 'London, UK', location_code: 'GB', interests: JSON.stringify(['reading', 'hiking', 'chess']), learning_languages: JSON.stringify(['ja', 'zh', 'ar']), level: 40, xp: 22000, streak: 365, bio: 'Polyglot in training! 6 languages and counting!', privacy: JSON.stringify({ allowDiscover: true, showLocation: true, showInterests: true }), created_at: new Date().toISOString() },
  { id: 'user_12', nickname: '한류팬_지수', avatar: '/avatars/avatar3.png', location: 'Busan, Korea', location_code: 'KR', interests: JSON.stringify(['kdrama', 'beauty', 'fashion']), learning_languages: JSON.stringify(['en', 'zh', 'ja']), level: 16, xp: 6200, streak: 25, bio: '한국어 같이 공부해요!', privacy: JSON.stringify({ allowDiscover: true, showLocation: true, showInterests: false }), created_at: new Date().toISOString() },
  { id: 'user_13', nickname: 'NinjaLearner_Ken', avatar: '/avatars/avatar1.png', location: 'Osaka, Japan', location_code: 'JP', interests: JSON.stringify(['gaming', 'anime', 'tech']), learning_languages: JSON.stringify(['en', 'ko', 'zh']), level: 14, xp: 4900, streak: 18, bio: 'ゲームで言語を学ぼう！', privacy: JSON.stringify({ allowDiscover: true, showLocation: true, showInterests: true }), created_at: new Date().toISOString() },
  { id: 'user_14', nickname: 'GlobalNomad_Lisa', avatar: '/avatars/avatar2.png', location: 'Sydney, Australia', location_code: 'AU', interests: JSON.stringify(['surfing', 'yoga', 'vegan']), learning_languages: JSON.stringify(['ja', 'es', 'it']), level: 27, xp: 12800, streak: 85, bio: 'Traveling the world one language at a time!', privacy: JSON.stringify({ allowDiscover: true, showLocation: true, showInterests: true }), created_at: new Date().toISOString() },
  { id: 'user_15', nickname: '学霸小明', avatar: '/avatars/avatar7.png', location: 'Shanghai, China', location_code: 'CN', interests: JSON.stringify(['history', 'science', 'badminton']), learning_languages: JSON.stringify(['en', 'ja', 'de']), level: 33, xp: 17200, streak: 150, bio: '学无止境！一起进步！', privacy: JSON.stringify({ allowDiscover: true, showLocation: true, showInterests: true }), created_at: new Date().toISOString() },
];

// 社区帖子
const posts: SeedRow[] = [
  { id: 'post_1', user_id: 'user_1', title: '日语学习心得分享', content: '学了三年日语，最大的感受是...坚持最重要！每天30分钟比周末狂学6小时更有效。', language: 'ja', likes: 45, comments_count: 12, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'post_2', user_id: 'user_2', title: 'Best way to learn Kanji?', content: 'I\'ve been struggling with Kanji. Any tips from experienced learners?', language: 'ja', likes: 32, comments_count: 18, created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 'post_3', user_id: 'user_3', title: '한국어 발음 팁', content: '한국어 발음이 어려운 분들을 위한 팁을 공유합니다!', language: 'ko', likes: 28, comments_count: 8, created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: 'post_4', user_id: 'user_4', title: 'Pourquoi apprendre le japonais?', content: 'Le japonais est une langue fascinante. Voici pourquoi j\'ai commencé...', language: 'ja', likes: 15, comments_count: 5, created_at: new Date(Date.now() - 345600000).toISOString() },
  { id: 'post_5', user_id: 'user_7', title: '中文成语学习技巧', content: '成语是中文的精华，掌握它们让你的中文更地道！分享几个常用的成语...', language: 'zh', likes: 38, comments_count: 15, created_at: new Date(Date.now() - 432000000).toISOString() },
  { id: 'post_6', user_id: 'user_5', title: '¡Aprender idiomas es divertido!', content: 'Comparto mi método para aprender 3 idiomas al mismo tiempo.', language: 'es', likes: 20, comments_count: 7, created_at: new Date(Date.now() - 518400000).toISOString() },
  { id: 'post_7', user_id: 'user_11', title: 'My 365-day streak journey', content: 'Today marks 365 days of continuous language learning! Here\'s what I learned...', language: 'en', likes: 67, comments_count: 25, created_at: new Date(Date.now() - 604800000).toISOString() },
  { id: 'post_8', user_id: 'user_6', title: 'Deutsche Grammatik Tipps', content: 'Die deutsche Grammatik muss nicht schwer sein! Hier sind meine besten Tipps.', language: 'de', likes: 18, comments_count: 6, created_at: new Date(Date.now() - 691200000).toISOString() },
  { id: 'post_9', user_id: 'user_14', title: 'Language Exchange Partner Needed!', content: 'Looking for a Japanese speaker to practice with. I can offer English in return!', language: 'ja', likes: 22, comments_count: 14, created_at: new Date(Date.now() - 777600000).toISOString() },
  { id: 'post_10', user_id: 'user_15', title: '如何高效背单词', content: '分享我用Anki+场景记忆法背单词的经验，三个月词汇量翻倍！', language: 'zh', likes: 55, comments_count: 20, created_at: new Date(Date.now() - 864000000).toISOString() },
  { id: 'post_11', user_id: 'user_8', title: 'Imparare il giapponese con gli anime', content: 'Guardo anime per imparare il giapponese. Funziona davvero!', language: 'ja', likes: 25, comments_count: 9, created_at: new Date(Date.now() - 950400000).toISOString() },
  { id: 'post_12', user_id: 'user_12', title: '드라마로 배우는 한국어', content: '한국 드라마로 자연스럽게 한국어를 배우는 방법!', language: 'ko', likes: 30, comments_count: 11, created_at: new Date(Date.now() - 1036800000).toISOString() },
  { id: 'post_13', user_id: 'user_2', title: 'JLPT N1 passed!', content: 'Just got my results! After 2 years of hard work, I passed JLPT N1!', language: 'ja', likes: 89, comments_count: 35, created_at: new Date(Date.now() - 1123200000).toISOString() },
  { id: 'post_14', user_id: 'user_13', title: 'ゲームで英語を学ぶ方法', content: 'RPGゲームを英語でプレイすると、自然に単語が覚えられます！', language: 'en', likes: 35, comments_count: 12, created_at: new Date(Date.now() - 1209600000).toISOString() },
  { id: 'post_15', user_id: 'user_10', title: 'تعلم اللغة العربية', content: 'نصائح لتعلم اللغة العربية بطريقة سهلة وممتعة', language: 'ar', likes: 12, comments_count: 4, created_at: new Date(Date.now() - 1296000000).toISOString() },
  { id: 'post_16', user_id: 'user_9', title: 'Portuguese pronunciation guide', content: 'Here\'s a quick guide to Portuguese pronunciation for beginners!', language: 'pt', likes: 16, comments_count: 5, created_at: new Date(Date.now() - 1382400000).toISOString() },
  { id: 'post_17', user_id: 'user_1', title: 'おすすめの日本語学習アプリ', content: '今まで使った日本語学習アプリの中で一番良かったものを紹介します！', language: 'ja', likes: 42, comments_count: 16, created_at: new Date(Date.now() - 1468800000).toISOString() },
  { id: 'post_18', user_id: 'user_3', title: 'K-drama recommendations for learners', content: 'Here are the best K-dramas to learn Korean, sorted by difficulty level!', language: 'ko', likes: 33, comments_count: 10, created_at: new Date(Date.now() - 1555200000).toISOString() },
  { id: 'post_19', user_id: 'user_7', title: '中国旅游必备中文', content: '来中国旅游？这些中文短语你一定要学会！', language: 'zh', likes: 40, comments_count: 18, created_at: new Date(Date.now() - 1641600000).toISOString() },
  { id: 'post_20', user_id: 'user_11', title: 'How I learn 10 words a day', content: 'My simple but effective method for vocabulary building. Consistency is key!', language: 'en', likes: 50, comments_count: 22, created_at: new Date(Date.now() - 1728000000).toISOString() },
];

// 好友请求
const friendRequests: SeedRow[] = [
  { id: 'fr_1', from_id: 'user_2', to_id: 'user_1', status: 'pending', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'fr_2', from_id: 'user_3', to_id: 'user_1', status: 'accepted', created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 'fr_3', from_id: 'user_5', to_id: 'user_1', status: 'pending', created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: 'fr_4', from_id: 'user_1', to_id: 'user_4', status: 'accepted', created_at: new Date(Date.now() - 345600000).toISOString() },
  { id: 'fr_5', from_id: 'user_7', to_id: 'user_1', status: 'accepted', created_at: new Date(Date.now() - 432000000).toISOString() },
  { id: 'fr_6', from_id: 'user_11', to_id: 'user_1', status: 'pending', created_at: new Date(Date.now() - 518400000).toISOString() },
];

// 语伴匹配
const partnerMatches: SeedRow[] = [
  { id: 'pm_1', user_id: 'user_1', partner_id: 'user_2', language_exchange: JSON.stringify({ teach: 'ja', learn: 'en' }), compatibility_score: 92, status: 'matched', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'pm_2', user_id: 'user_1', partner_id: 'user_7', language_exchange: JSON.stringify({ teach: 'ja', learn: 'zh' }), compatibility_score: 85, status: 'matched', created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 'pm_3', user_id: 'user_1', partner_id: 'user_14', language_exchange: JSON.stringify({ teach: 'ja', learn: 'en' }), compatibility_score: 78, status: 'pending', created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: 'pm_4', user_id: 'user_3', partner_id: 'user_1', language_exchange: JSON.stringify({ teach: 'ko', learn: 'ja' }), compatibility_score: 88, status: 'pending', created_at: new Date(Date.now() - 345600000).toISOString() },
  { id: 'pm_5', user_id: 'user_1', partner_id: 'user_11', language_exchange: JSON.stringify({ teach: 'ja', learn: 'en' }), compatibility_score: 95, status: 'matched', created_at: new Date(Date.now() - 432000000).toISOString() },
];

// ── 学习内容 (contents表) ─────────────────────────────────────────────────────
// 100条多语言内容：笑话/故事/语法/儿歌

const contentItems: SeedRow[] = [
  // 英语笑话 20条
  { id: 'content_en_joke_1', type: 'joke', language: 'en', title: 'Scarecrow Award', content: 'Why did the scarecrow win an award? Because he was outstanding in his field!', translation: '为什么稻草人获奖了？因为他在自己的领域里非常出色！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 120 },
  { id: 'content_en_joke_2', type: 'joke', language: 'en', title: 'Fake Spaghetti', content: 'What do you call fake spaghetti? An impasta!', translation: '假意大利面叫什么？冒牌面！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 95 },
  { id: 'content_en_joke_3', type: 'joke', language: 'en', title: 'Skeleton Fight', content: 'Why don\'t skeletons fight each other? They don\'t have the guts!', translation: '为什么骷髅不互相打架？因为它们没有胆量！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 80 },
  { id: 'content_en_joke_4', type: 'joke', language: 'en', title: 'Math Book Sadness', content: 'Why did the math book look sad? Because it had too many problems.', translation: '为什么数学书看起来很伤心？因为它有太多问题。', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 110 },
  { id: 'content_en_joke_5', type: 'joke', language: 'en', title: 'Gummy Bear', content: 'What do you call a bear with no teeth? A gummy bear!', translation: '没有牙齿的熊叫什么？软糖熊！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 75 },
  { id: 'content_en_joke_6', type: 'joke', language: 'en', title: 'Atom Trust', content: 'Why don\'t scientists trust atoms? Because they make up everything!', translation: '为什么科学家不相信原子？因为它们组成了一切！', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 65 },
  { id: 'content_en_joke_7', type: 'joke', language: 'en', title: 'Dog Math', content: 'I asked my dog what\'s two minus two. He said nothing.', translation: '我问我的狗二减二等于多少。它什么也没说。', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 90 },
  { id: 'content_en_joke_8', type: 'joke', language: 'en', title: 'Piano Player', content: 'I used to play piano by ear, but now I use my hands.', translation: '我以前靠耳朵弹钢琴，但现在我用手。', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 55 },
  { id: 'content_en_joke_9', type: 'joke', language: 'en', title: 'Sophisticated Fish', content: 'What do you call a fish wearing a bowtie? Sofishticated!', translation: '戴领结的鱼叫什么？优雅鱼！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 70 },
  { id: 'content_en_joke_10', type: 'joke', language: 'en', title: 'Embrace Mistakes', content: 'I told my wife she should embrace her mistakes. She gave me a hug.', translation: '我告诉我妻子应该拥抱她的错误。她给了我一个拥抱。', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 85 },
  { id: 'content_en_joke_11', type: 'joke', language: 'en', title: 'Parallel Lines', content: 'Parallel lines have so much in common. It\'s a shame they\'ll never meet.', translation: '平行线有很多共同点。可惜它们永远不会相遇。', level: 'B1', source: 'template', created_at: new Date().toISOString(), usage_count: 45 },
  { id: 'content_en_joke_12', type: 'joke', language: 'en', title: 'Time Travel', content: 'I\'m reading a book on anti-gravity. It\'s impossible to put down!', translation: '我在读一本关于反重力的书。根本放不下来！', level: 'B1', source: 'template', created_at: new Date().toISOString(), usage_count: 60 },
  { id: 'content_en_joke_13', type: 'joke', language: 'en', title: 'Broken Pencil', content: 'A broken pencil is pointless.', translation: '断掉的铅笔毫无意义（没有笔尖）。', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 40 },
  { id: 'content_en_joke_14', type: 'joke', language: 'en', title: 'Cookie Complaint', content: 'Why was the cookie sad? Because its mom was a wafer so long!', translation: '为什么饼干很伤心？因为它的妈妈离开（威化）太久了！', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 50 },
  { id: 'content_en_joke_15', type: 'joke', language: 'en', title: 'Bicycle Fall', content: 'Why couldn\'t the bicycle stand up by itself? It was two tired!', translation: '为什么自行车自己站不起来？因为它太累了（两个轮胎）！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 100 },
  { id: 'content_en_joke_16', type: 'joke', language: 'en', title: 'Photographic Memory', content: 'I have a photographic memory, but I always forget to bring the film.', translation: '我有照相机般的记忆力，但总是忘记带胶卷。', level: 'B1', source: 'template', created_at: new Date().toISOString(), usage_count: 35 },
  { id: 'content_en_joke_17', type: 'joke', language: 'en', title: 'Elevator Business', content: 'I got a job at an elevator company. It has its ups and downs.', translation: '我在电梯公司找到了工作。这份工作有起有落。', level: 'B1', source: 'template', created_at: new Date().toISOString(), usage_count: 48 },
  { id: 'content_en_joke_18', type: 'joke', language: 'en', title: 'Calendar Theft', content: 'Someone stole my calendar. I\'m going to have a bad year.', translation: '有人偷了我的日历。我这一年都会很糟糕。', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 55 },
  { id: 'content_en_joke_19', type: 'joke', language: 'en', title: 'Baker Hands', content: 'What does a baker say when he needs a hand? Dough!', translation: '面包师需要帮手时说什么？面团（钱）！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 42 },
  { id: 'content_en_joke_20', type: 'joke', language: 'en', title: 'Clock Hungry', content: 'Why did the clock go to the principal\'s office? It was ticking too much!', translation: '为什么时钟被叫去校长办公室？它一直在滴答（惹麻烦）！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 68 },
  // 日语笑话 10条
  { id: 'content_ja_joke_1', type: 'joke', language: 'ja', title: '数学の本', content: 'なぜ数学の本は悲しいのか？問題が多すぎるから！', translation: '为什么数学书很悲伤？因为问题太多了！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 90 },
  { id: 'content_ja_joke_2', type: 'joke', language: 'ja', title: 'コンピューターの休憩', content: 'コンピューターに休憩を求めたら、「私も休憩が必要です」と返されました', translation: '我让电脑休息一下，它回复说"我也需要休息"', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 75 },
  { id: 'content_ja_joke_3', type: 'joke', language: 'ja', title: 'カエルのバー', content: 'カエルがバーに入ったら、バーテンダーが「カエルはお断りです」と言いました', translation: '青蛙走进酒吧，酒保说"不接待青蛙"', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 60 },
  { id: 'content_ja_joke_4', type: 'joke', language: 'ja', title: 'サンドイッチと学校', content: 'なぜサンドイッチは学校に行かないのか？すでにパンですから！', translation: '为什么三明治不上学？因为它已经是面包了！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 55 },
  { id: 'content_ja_joke_5', type: 'joke', language: 'ja', title: '時計のけんか', content: '時計がけんかをした理由は何ですか？お互いに時間をかけていたから！', translation: '时钟打架的原因是什么？因为它们互相花时间！', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 48 },
  { id: 'content_ja_joke_6', type: 'joke', language: 'ja', title: '鉛筆の悲しみ', content: '折れた鉛筆は役に立たない（先がない）', translation: '断掉的铅笔毫无意义（没有笔尖）', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 40 },
  { id: 'content_ja_joke_7', type: 'joke', language: 'ja', title: 'パン屋の悩み', content: 'パン屋が悩んでいる理由は？毎日パン（パン＝面包/パンク）しているから！', translation: '面包师为什么烦恼？因为每天都在爆胎（面包）！', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 35 },
  { id: 'content_ja_joke_8', type: 'joke', language: 'ja', title: '魚の服装', content: '蝶ネクタイをした魚を何と呼ぶ？ソフィスティケイテッド（洒落た魚）！', translation: '戴领结的鱼叫什么？优雅鱼！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 52 },
  { id: 'content_ja_joke_9', type: 'joke', language: 'ja', title: 'クマの歯', content: '歯のないクマを何と呼ぶ？グミベア！', translation: '没有牙齿的熊叫什么？软糖熊！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 44 },
  { id: 'content_ja_joke_10', type: 'joke', language: 'ja', title: '原子の信用', content: 'なぜ科学者は原子を信じないのか？何でも作り上げる（作り話をする）から！', translation: '为什么科学家不相信原子？因为它们组成（编造）了一切！', level: 'B1', source: 'template', created_at: new Date().toISOString(), usage_count: 30 },
  // 韩语笑话 5条
  { id: 'content_ko_joke_1', type: 'joke', language: 'ko', title: '수학책의 슬픔', content: '왜 수학책이 슬퍼요? 문제가 너무 많아서!', translation: '为什么数学书很伤心？因为问题太多了！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 55 },
  { id: 'content_ko_joke_2', type: 'joke', language: 'ko', title: '해골의 싸움', content: '왜 해골이 싸우지 않을까요? guts가 없기 때문입니다!', translation: '为什么骷髅不打架？因为没有胆量！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 48 },
  { id: 'content_ko_joke_3', type: 'joke', language: 'ko', title: '개구리와 바', content: '개구리가 바에 들어갔을 때 바텐더가 "개구리는 안 됩니다" 라고 말했어요', translation: '青蛙走进酒吧，酒保说"不接待青蛙"', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 40 },
  { id: 'content_ko_joke_4', type: 'joke', language: 'ko', title: '샌드위치와 학교', content: '왜 샌드위치가 학교에 안 가나요? 이미 빵이니까요!', translation: '为什么三明治不上学？因为已经是面包了！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 35 },
  { id: 'content_ko_joke_5', type: 'joke', language: 'ko', title: '0과 8', content: '0이 8에게 뭐라고 했을까요? 멋진 벨트네!', translation: '0对8说了什么？好漂亮的腰带！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 42 },
  // 多语言故事 20条
  { id: 'content_en_story_1', type: 'story', language: 'en', title: 'The Little Reader', content: 'Once upon a time, there was a little girl who loved to read. Every day after school, she would go to the library and read for hours. One day, she found a magical book that could talk...', translation: '从前，有一个小女孩非常喜欢阅读。每天放学后，她都会去图书馆读几个小时的书。有一天，她发现了一本会说话的魔法书...', level: 'A1', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 150 },
  { id: 'content_en_story_2', type: 'story', language: 'en', title: 'The Dreamer Pilot', content: 'In a small village, there lived a young boy who dreamed of becoming a pilot. He worked hard, studied diligently, and never gave up on his dream. Years later, he finally became the captain of an airplane...', translation: '在一个小村庄里，住着一个梦想成为飞行员的小男孩。他努力工作，勤奋学习，从不放弃梦想。多年后，他终于成为了一名飞机机长...', level: 'A2', age_group: 'teenagers', source: 'template', created_at: new Date().toISOString(), usage_count: 120 },
  { id: 'content_en_story_3', type: 'story', language: 'en', title: 'The Lighthouse Keeper', content: 'The old lighthouse keeper had lived on the island for over forty years. Every night, he would light the beacon to guide ships safely home. One stormy night, he noticed something strange in the fog...', translation: '老灯塔看守人已经在岛上生活了四十多年。每天晚上，他都会点亮灯塔指引船只安全回家。一个暴风雨的夜晚，他注意到雾中有什么奇怪的东西...', level: 'B1', age_group: 'adults', source: 'template', created_at: new Date().toISOString(), usage_count: 95 },
  { id: 'content_ja_story_1', type: 'story', language: 'ja', title: '桃太郎', content: 'むかしむかし、あるところに、おじいさんとおばあさんが住んでいました。おばあさんが川で洗濯をしていると、大きな桃が流れてきました。', translation: '很久很久以前，老爷爷和老奶奶住在一起。老奶奶在河边洗衣服时，漂来一个大桃子。', level: 'A1', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 200 },
  { id: 'content_ja_story_2', type: 'story', language: 'ja', title: 'かぐや姫', content: '昔々、竹取の翁というおじいさんがいました。ある日、竹を切っていると、中から小さな女の子が出てきました。', translation: '很久以前，有个叫竹取翁的老爷爷。有一天，他砍竹子时，从里面出来了一个小女孩。', level: 'A2', age_group: 'teenagers', source: 'template', created_at: new Date().toISOString(), usage_count: 180 },
  { id: 'content_ko_story_1', type: 'story', language: 'ko', title: '흥부와 놀부', content: '옛날 옛적에 흥부와 놀부라는 두 형제가 살았습니다. 놀부는 부자였지만 마음이 나빴고, 흥부는 가난했지만 마음이 착했습니다.', translation: '从前有兴夫和诺夫两兄弟。诺夫富有但心肠不好，兴夫贫穷但心地善良。', level: 'A1', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 160 },
  { id: 'content_fr_story_1', type: 'story', language: 'fr', title: 'Le Petit Prince', content: 'Il était une fois un petit prince qui vivait sur une toute petite planète. Un jour, une rose magnifique est apparue sur sa planète.', translation: '从前有一个小王子，住在一颗很小的星球上。有一天，他的星球上出现了一朵美丽的玫瑰。', level: 'A1', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 140 },
  { id: 'content_es_story_1', type: 'story', language: 'es', title: 'El Viajero Miguel', content: 'En un pequeño pueblo de España, vivía un joven llamado Miguel que soñaba con viajar por el mundo. Cada día ahorraba un poco de dinero.', translation: '在西班牙的一个小镇上，住着一个叫米格尔的年轻人，他梦想环游世界。他每天都存一点钱。', level: 'A2', age_group: 'teenagers', source: 'template', created_at: new Date().toISOString(), usage_count: 110 },
  { id: 'content_de_story_1', type: 'story', language: 'de', title: 'Der neugierige Hase', content: 'Es war einmal ein kleiner Hase, der im Wald lebte. Er war sehr neugierig und wollte immer neue Dinge entdecken.', translation: '从前有一只小兔子住在森林里。他非常好奇，总想发现新事物。', level: 'A1', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 90 },
  { id: 'content_it_story_1', type: 'story', language: 'it', title: 'Pinocchio', content: 'C\'era una volta un burattino di legno che sognava di diventare un bambino vero. Il suo nome era Pinocchio.', translation: '从前有一个木偶，他梦想成为一个真正的男孩。他的名字叫匹诺曹。', level: 'A1', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 130 },
  { id: 'content_zh_story_1', type: 'story', language: 'zh', title: '狼来了', content: '从前有一个小男孩，他每天都去河边放牛。有一天，他觉得很无聊，就对着山下大喊：「狼来了！狼来了！」', translation: 'Once there was a boy who herded cattle by the river every day. One day, feeling bored, he shouted: "Wolf! Wolf!"', level: 'A1', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 170 },
  { id: 'content_zh_story_2', type: 'story', language: 'zh', title: '守株待兔', content: '宋国有个农夫，他的田里有一棵树。有一天，一只兔子跑过来撞在树上，折断了脖子死了。农夫很高兴，从此不再种田，每天守在树下等兔子。', translation: 'A farmer in Song had a tree in his field. One day a rabbit ran into it and died. He stopped farming and waited by the tree every day.', level: 'A2', age_group: 'teenagers', source: 'template', created_at: new Date().toISOString(), usage_count: 100 },
  { id: 'content_en_story_4', type: 'story', language: 'en', title: 'The Wise Owl', content: 'Deep in the forest lived a wise old owl. All the animals would come to him for advice. One day, a young squirrel asked him the secret to wisdom...', translation: '在森林深处住着一只聪明的老猫头鹰。所有的动物都来找他寻求建议。一天，一只小松鼠问他智慧的秘诀...', level: 'A2', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 85 },
  { id: 'content_en_story_5', type: 'story', language: 'en', title: 'The Kind Stranger', content: 'On a cold winter evening, an old man was walking home when he saw a shivering puppy by the roadside. He wrapped it in his scarf and took it home...', translation: '一个寒冷的冬夜，一位老人走回家时看到路边有一只发抖的小狗。他用围巾把它包起来带回了家...', level: 'B1', age_group: 'adults', source: 'template', created_at: new Date().toISOString(), usage_count: 75 },
  { id: 'content_ja_story_3', type: 'story', language: 'ja', title: '鶴の恩返し', content: '昔々、ある若者が罠にかかった鶴を助けました。その夜、美しい女性が彼の家を訪ねてきて...', translation: '很久以前，一个年轻人救了一只被困的鹤。那天晚上，一位美丽的女子来到他家...', level: 'A2', age_group: 'teenagers', source: 'template', created_at: new Date().toISOString(), usage_count: 155 },
  { id: 'content_ja_story_4', type: 'story', language: 'ja', title: '一寸法師', content: '昔、小さな小さな男の子が生まれました。名前は一寸法師。大きさはたったの一寸しかありませんでした。', translation: '从前，有一个非常小的男孩出生了。名叫一寸法师。他只有一寸高。', level: 'A1', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 145 },
  { id: 'content_ko_story_2', type: 'story', language: 'ko', title: '토끼와 거북이', content: '옛날에 토끼와 거북이가 달리기 시합을 했습니다. 토끼는 자신이 너무 빨라서 중간에 낮잠을 잤습니다.', translation: '从前兔子和乌龟赛跑。兔子觉得自己太快了，半路睡着了。', level: 'A1', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 125 },
  { id: 'content_en_story_6', type: 'story', language: 'en', title: 'The Magic Paintbrush', content: 'A poor artist was given a magic paintbrush. Whatever he painted would come to life. He used it to help the poor people in his village...', translation: '一个贫穷的画家得到了一支神奇的画笔。他画什么，什么就会变成真的。他用它来帮助村里的穷人...', level: 'A2', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 105 },
  { id: 'content_en_story_7', type: 'story', language: 'en', title: 'The Curious Cat', content: 'There was a cat who was curious about everything. One day, she decided to explore beyond her garden fence and discovered a whole new world...', translation: '有一只对一切都好奇的猫。有一天，她决定探索花园篱笆之外的地方，发现了一个全新的世界...', level: 'A1', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 88 },
  { id: 'content_en_story_8', type: 'story', language: 'en', title: 'The Baker\'s Secret', content: 'In a small French village, a baker had a secret recipe that made the best bread in the region. People traveled from far and wide to taste it...', translation: '在法国一个小村庄里，一个面包师有一个秘方，做出了当地最好的面包。人们远道而来品尝...', level: 'B1', age_group: 'adults', source: 'template', created_at: new Date().toISOString(), usage_count: 70 },
  // 儿歌 10条
  { id: 'content_en_nursery_1', type: 'nursery_rhyme', language: 'en', title: 'Twinkle Twinkle', content: 'Twinkle, twinkle, little star, How I wonder what you are! Up above the world so high, Like a diamond in the sky.', translation: '一闪一闪小星星，我想知道你是什么！高高挂在世界上，像天空中的钻石。', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 300 },
  { id: 'content_en_nursery_2', type: 'nursery_rhyme', language: 'en', title: 'Row Your Boat', content: 'Row, row, row your boat, Gently down the stream. Merrily, merrily, merrily, merrily, Life is but a dream.', translation: '划呀划，划小船，轻轻顺流而下。快乐呀快乐，生活只是一场梦。', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 250 },
  { id: 'content_en_nursery_3', type: 'nursery_rhyme', language: 'en', title: 'Mary Had a Lamb', content: 'Mary had a little lamb, Its fleece was white as snow. And everywhere that Mary went, The lamb was sure to go.', translation: '玛丽有一只小羊羔，羊毛白如雪。玛丽走到哪里，小羊羔就跟到哪里。', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 220 },
  { id: 'content_ja_nursery_1', type: 'nursery_rhyme', language: 'ja', title: 'ぞうさん', content: 'ぞうさん、ぞうさん、お鼻が長いのね。そうよ、かあさんも長いのよ。', translation: '大象大象，你的鼻子真长呀。是啊，妈妈也长呢。', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 280 },
  { id: 'content_ko_nursery_1', type: 'nursery_rhyme', language: 'ko', title: '곰 세 마리', content: '곰 세 마리가 한 집에 있어, 아빠 곰, 엄마 곰, 애기 곰. 아빠 곰은 뚱뚱해.', translation: '三只熊住在一间房子里，熊爸爸，熊妈妈，熊宝宝。熊爸爸胖胖的。', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 200 },
  { id: 'content_fr_nursery_1', type: 'nursery_rhyme', language: 'fr', title: 'Frère Jacques', content: 'Frère Jacques, Frère Jacques, dormez-vous? Dormez-vous? Sonnez les matines, sonnez les matines. Ding ding dong!', translation: '雅克兄弟，雅克兄弟，你在睡觉吗？你在睡觉吗？敲响晨钟，敲响晨钟。叮叮咚！', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 190 },
  { id: 'content_es_nursery_1', type: 'nursery_rhyme', language: 'es', title: 'Los Pollitos', content: 'Los pollitos dicen pío, pío, pío, cuando tienen hambre, cuando tienen frío.', translation: '小鸡们叫叽叽叽，当它们饿了，当它们冷了。', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 160 },
  { id: 'content_zh_nursery_1', type: 'nursery_rhyme', language: 'zh', title: '两只老虎', content: '两只老虎，两只老虎，跑得快，跑得快。一只没有耳朵，一只没有尾巴，真奇怪，真奇怪！', translation: 'Two tigers, two tigers, running fast. One has no ears, one has no tail. How strange!', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 350 },
  { id: 'content_en_nursery_4', type: 'nursery_rhyme', language: 'en', title: 'Old MacDonald', content: 'Old MacDonald had a farm, E-I-E-I-O! And on his farm he had a cow, E-I-E-I-O! With a moo-moo here and a moo-moo there...', translation: '老麦克唐纳有个农场，咿呀咿呀哟！农场里有一头牛，咿呀咿呀哟！这里哞哞叫，那里哞哞叫...', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 310 },
  { id: 'content_en_nursery_5', type: 'nursery_rhyme', language: 'en', title: 'Baa Baa Black Sheep', content: 'Baa, baa, black sheep, have you any wool? Yes sir, yes sir, three bags full!', translation: '咩咩黑羊，你有羊毛吗？是的先生，有三袋满满！', age_group: 'kids', source: 'template', created_at: new Date().toISOString(), usage_count: 230 },
  // 语法题 20条
  { id: 'content_en_grammar_1', type: 'grammar', language: 'en', title: 'Present Simple', content: 'Choose the correct form: He ___ to school every day.', translation: '选择正确形式：He ___ to school every day.', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 200 },
  { id: 'content_en_grammar_2', type: 'grammar', language: 'en', title: 'Present Perfect', content: 'Complete: I have been ___ English for two years.', translation: '完成：I have been ___ English for two years.', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 180 },
  { id: 'content_en_grammar_3', type: 'grammar', language: 'en', title: 'Passive Voice', content: 'Rewrite in passive: They built this building in 2020.', translation: '改为被动语态：They built this building in 2020.', level: 'B1', source: 'template', created_at: new Date().toISOString(), usage_count: 150 },
  { id: 'content_en_grammar_4', type: 'grammar', language: 'en', title: 'Articles', content: 'Choose the correct article: She is ___ doctor.', translation: '选择正确冠词：She is ___ doctor.', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 220 },
  { id: 'content_en_grammar_5', type: 'grammar', language: 'en', title: 'Prepositions', content: 'Choose the correct preposition: He arrived ___ the airport.', translation: '选择正确介词：He arrived ___ the airport.', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 190 },
  { id: 'content_en_grammar_6', type: 'grammar', language: 'en', title: 'Comparatives', content: 'Complete with comparative: This book is ___ than that one.', translation: '用比较级完成：This book is ___ than that one.', level: 'B1', source: 'template', created_at: new Date().toISOString(), usage_count: 160 },
  { id: 'content_en_grammar_7', type: 'grammar', language: 'en', title: 'Conditionals', content: 'Complete: If it rains tomorrow, I ___ at home.', translation: '完成条件句：If it rains tomorrow, I ___ at home.', level: 'B1', source: 'template', created_at: new Date().toISOString(), usage_count: 140 },
  { id: 'content_en_grammar_8', type: 'grammar', language: 'en', title: 'Relative Clauses', content: 'Combine: The man is my neighbor. He drives a red car.', translation: '合并句子：The man is my neighbor. He drives a red car.', level: 'B1', source: 'template', created_at: new Date().toISOString(), usage_count: 130 },
  { id: 'content_en_grammar_9', type: 'grammar', language: 'en', title: 'Modal Verbs', content: 'Choose: You ___ smoke in this building. (prohibition)', translation: '选择正确的情态动词：You ___ smoke in this building. (禁止)', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 170 },
  { id: 'content_en_grammar_10', type: 'grammar', language: 'en', title: 'Reported Speech', content: 'Convert: She said, "I am tired."', translation: '转换间接引语：She said, "I am tired."', level: 'B1', source: 'template', created_at: new Date().toISOString(), usage_count: 120 },
  { id: 'content_ja_grammar_1', type: 'grammar', language: 'ja', title: '助詞「は」と「が」', content: '正しい助詞を選んで：私___学生です。', translation: '选择正确助词：我___学生。', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 180 },
  { id: 'content_ja_grammar_2', type: 'grammar', language: 'ja', title: '動詞の活用', content: '正しい活用形：食べ___ (て形)', translation: '选择正确的活用形式：吃___ (て形)', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 160 },
  { id: 'content_ja_grammar_3', type: 'grammar', language: 'ja', title: '敬語', content: '「言う」の尊敬語は？', translation: '"说"的尊敬语是？', level: 'B1', source: 'template', created_at: new Date().toISOString(), usage_count: 140 },
  { id: 'content_ja_grammar_4', type: 'grammar', language: 'ja', title: '条件形', content: '正しい条件形：雨が降れ___、試合は中止です。', translation: '正确条件形：如果下雨___，比赛取消。', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 130 },
  { id: 'content_ja_grammar_5', type: 'grammar', language: 'ja', title: '使役形', content: '「食べる」の使役形は？', translation: '"吃"的使役形是？', level: 'B1', source: 'template', created_at: new Date().toISOString(), usage_count: 110 },
  { id: 'content_ko_grammar_1', type: 'grammar', language: 'ko', title: '조사', content: '맞는 조사: 저___ 학생입니다.', translation: '正确助词：我___学生。', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 150 },
  { id: 'content_ko_grammar_2', type: 'grammar', language: 'ko', title: '존댓말', content: '"먹다"의 존댓말은?', translation: '"吃"的敬语是？', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 130 },
  { id: 'content_ko_grammar_3', type: 'grammar', language: 'ko', title: '과거형', content: '"가다"의 과거형은?', translation: '"去"的过去式是？', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 140 },
  { id: 'content_ko_grammar_4', type: 'grammar', language: 'ko', title: '미래형', content: '"공부하다"의 미래형은?', translation: '"学习"的将来式是？', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 120 },
  { id: 'content_ko_grammar_5', type: 'grammar', language: 'ko', title: '연결어미', content: '"먹___ 자러 갔다" 빈칸에 알맞은 말은?', translation: '"吃___去睡了" 空白处正确的词是？', level: 'B1', source: 'template', created_at: new Date().toISOString(), usage_count: 100 },
  // 法语笑话 3条
  { id: 'content_fr_joke_1', type: 'joke', language: 'fr', title: 'Plongeurs', content: 'Pourquoi les plongeurs plongent-ils toujours en arrière? Parce que sinon ils tombent dans le bateau!', translation: '为什么潜水员总是往后跳水？因为否则他们会掉进船里！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 60 },
  { id: 'content_fr_joke_2', type: 'joke', language: 'fr', title: 'Électricien', content: 'Quel est le comble pour un électricien? De ne pas être au courant!', translation: '电工最尴尬的事是什么？不知道/不通电！', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 50 },
  { id: 'content_fr_joke_3', type: 'joke', language: 'fr', title: 'Café Déprimé', content: 'Pourquoi le café est-il déprimé? Parce qu\'il a été moulu toute la journée!', translation: '为什么咖啡很沮丧？因为它整天被研磨！', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 45 },
  // 德语 2条
  { id: 'content_de_joke_1', type: 'joke', language: 'de', title: 'Banane', content: 'Was ist gelb und kann nicht schießen? Eine Banane — sie ist krumm!', translation: '什么是黄色的但不能射击？香蕉——它弯了！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 55 },
  { id: 'content_de_joke_2', type: 'joke', language: 'de', title: 'Ameisen', content: 'Warum gehen Ameisen nicht in die Kirche? Weil sie in Sekten sind!', translation: '为什么蚂蚁不去教堂？因为它们在教派里！', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 40 },
  // 西班牙语 2条
  { id: 'content_es_joke_1', type: 'joke', language: 'es', title: 'Semáforo', content: '¿Qué le dice un semáforo a otro? ¡No me mires que me estoy cambiando!', translation: '一个红绿灯对另一个说什么？别看我在换衣服！', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 50 },
  { id: 'content_es_joke_2', type: 'joke', language: 'es', title: 'Pájaros', content: '¿Por qué los pájaros no usan Facebook? ¡Porque ya tienen Twitter!', translation: '为什么鸟不用Facebook？因为它们已经有Twitter了！', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 45 },
  // 中文 3条
  { id: 'content_zh_joke_1', type: 'joke', language: 'zh', title: '数学书的忧伤', content: '为什么数学书总是忧伤？因为它有太多解决不了的问题！', translation: 'Why is the math book always sad? Because it has too many unsolvable problems!', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 100 },
  { id: 'content_zh_joke_2', type: 'joke', language: 'zh', title: '0和8', content: '0对8说了什么？兄弟，你这腰带不错啊！', translation: 'What did 0 say to 8? Nice belt, bro!', level: 'A1', source: 'template', created_at: new Date().toISOString(), usage_count: 90 },
  { id: 'content_zh_joke_3', type: 'joke', language: 'zh', title: '筷子的烦恼', content: '筷子为什么找不到对象？因为它总是单身（双根）！', translation: 'Why can\'t chopsticks find a partner? Because they\'re always single (double)!', level: 'A2', source: 'template', created_at: new Date().toISOString(), usage_count: 85 },
];

// ── 场景数据 (scenarios) ─────────────────────────────────────────────────────
// 9个场景

const scenarioData: SeedRow[] = [
  { id: 'scenario_ja_1', title: 'Café & Ordering', title_zh: '咖啡馆点单', description: '用外语点一杯喜欢的咖啡', icon: '☕', grid_position: 1, category: 'daily', color: '#D4A574', language_code: 'ja', order_index: 1, phrase_count: 10 },
  { id: 'scenario_ja_2', title: 'Restaurant', title_zh: '餐厅用餐', description: '从预订到结账全流程', icon: '🍜', grid_position: 2, category: 'food', color: '#C9553D', language_code: 'ja', order_index: 2, phrase_count: 10 },
  { id: 'scenario_ja_3', title: 'Taxi & Transit', title_zh: '打车与交通', description: '问路、打车、买票', icon: '🚕', grid_position: 3, category: 'travel', color: '#5B8FA8', language_code: 'ja', order_index: 3, phrase_count: 10 },
  { id: 'scenario_ja_4', title: 'Hotel Check-in', title_zh: '酒店入住', description: '入住、退房、客房服务', icon: '🏨', grid_position: 4, category: 'travel', color: '#7A9B71', language_code: 'ja', order_index: 4, phrase_count: 10 },
  { id: 'scenario_ja_5', title: 'Shopping', title_zh: '购物逛街', description: '砍价、试穿、付款', icon: '🛍', grid_position: 5, category: 'daily', color: '#C9A574', language_code: 'ja', order_index: 5, phrase_count: 10 },
  { id: 'scenario_ja_6', title: 'Pharmacy & Hospital', title_zh: '药店医院', description: '描述症状、买药', icon: '🏥', grid_position: 6, category: 'emergency', color: '#E06060', language_code: 'ja', order_index: 6, phrase_count: 10 },
  { id: 'scenario_ja_7', title: 'Office Talk', title_zh: '职场交流', description: '会议、邮件、电话', icon: '💼', grid_position: 7, category: 'work', color: '#4A7FA5', language_code: 'ja', order_index: 7, phrase_count: 10 },
  { id: 'scenario_ja_8', title: 'Party & Social', title_zh: '聚会社交', description: '介绍自己、闲聊', icon: '🎉', grid_position: 8, category: 'social', color: '#D4A574', language_code: 'ja', order_index: 8, phrase_count: 10 },
  { id: 'scenario_ja_9', title: 'Campus Life', title_zh: '校园生活', description: '选课、图书馆、交友', icon: '🎓', grid_position: 9, category: 'study', color: '#7A9B71', language_code: 'ja', order_index: 9, phrase_count: 10 },
];

// ── 短语数据 (phrases) ────────────────────────────────────────────────────────
// 每场景10条 = 90条短语

const phraseData: SeedRow[] = [];
const phraseTexts: Record<string, Array<[string, string, string, string]>> = {
  scenario_ja_1: [
    ['コーヒーをください', '请给我一杯咖啡', 'koohii o kudasai', '点单时使用'],
    ['メニューを見せてください', '请让我看看菜单', 'menyuu o misete kudasai', '进店后询问菜单'],
    ['これは何ですか', '这是什么？', 'kore wa nan desu ka', '指着物品提问'],
    ['いくらですか', '多少钱？', 'ikura desu ka', '询问价格'],
    ['お会計お願いします', '请结账', 'okaikei onegaishimasu', '用餐结束后'],
    ['ホットでお願いします', '请给我热的', 'hotto de onegaishimasu', '指定温度'],
    ['砂糖は入っていますか', '加糖了吗？', 'satou wa haitteimasu ka', '确认成分'],
    ['テイクアウトできますか', '可以外带吗？', 'teikuauto dekimasu ka', '询问外带'],
    ['おすすめは何ですか', '有什么推荐？', 'osusume wa nan desu ka', '请店员推荐'],
    ['また来ます', '我还会再来', 'mata kimasu', '离店时说'],
  ],
  scenario_ja_2: [
    ['予約しています', '我有预约', 'yoyaku shiteimasu', '前台确认'],
    ['メニューをください', '请给我菜单', 'menyuu o kudasai', '入座后'],
    ['注文をお願いします', '我要点菜', 'chuumon o onegaishimasu', '叫服务员'],
    ['これは辛いですか', '这个辣吗？', 'kore wa karai desu ka', '询问口味'],
    ['お水をください', '请给我水', 'omizu o kudasai', '要水'],
    ['取り皿をください', '请给我小盘子', 'torizara o kudasai', '需要分餐'],
    ['とても美味しいです', '非常好吃', 'totemo oishii desu', '表达满意'],
    ['もう十分です', '已经够了', 'mou juubun desu', '拒绝更多'],
    ['別々に払えますか', '可以分开付吗？', 'betsubetsu ni haraemasu ka', 'AA制'],
    ['ごちそうさまでした', '多谢款待', 'gochisousama deshita', '吃完后'],
  ],
  scenario_ja_3: [
    ['ここはどこですか', '这是哪里？', 'koko wa doko desu ka', '迷路时'],
    ['駅までどうやって行きますか', '去车站怎么走？', 'eki made douyatte ikimasu ka', '问路'],
    ['タクシーを呼んでください', '请帮我叫出租车', 'takushii o yonde kudasai', '叫车'],
    ['ここに行ってください', '请到这里', 'koko ni itte kudasai', '给司机看地址'],
    ['いくらですか', '多少钱？', 'ikura desu ka', '问价格'],
    ['ここで止めてください', '请在这里停', 'koko de tomete kudasai', '下车时'],
    ['次のバスは何時ですか', '下一班巴士几点？', 'tsugi no basu wa nanji desu ka', '等车时'],
    ['切符はどこで買えますか', '在哪里买票？', 'kippu wa doko de kaemasu ka', '买票'],
    ['終電は何時ですか', '末班车几点？', 'shuuden wa nanji desu ka', '赶末班车'],
    ['すみません、道に迷いました', '不好意思我迷路了', 'sumimasen michi ni mayoimashita', '求助'],
  ],
  scenario_ja_4: [
    ['チェックインをお願いします', '请帮我办理入住', 'chekkuin o onegaishimasu', '前台'],
    ['予約しています', '我有预约', 'yoyaku shiteimasu', '确认预订'],
    ['Wi-Fiのパスワードは何ですか', 'WiFi密码是多少？', 'waifai no pasuwaado wa nan desu ka', '询问网络'],
    ['朝食は何時からですか', '早餐几点开始？', 'choushoku wa nanji kara desu ka', '询问用餐时间'],
    ['部屋を替えてもらえますか', '可以换房间吗？', 'heya o kaete moraemasu ka', '不满意房间'],
    ['鍵を部屋に忘れました', '钥匙忘在房间了', 'kagi o heya ni wasuremashita', '忘带钥匙'],
    ['チェックアウトは何時ですか', '退房时间是几点？', 'chekkuauto wa nanji desu ka', '确认退房时间'],
    ['荷物を預かってもらえますか', '可以寄存行李吗？', 'nimotsu o azukatte moraemasu ka', '寄存行李'],
    ['タオルを追加してください', '请加毛巾', 'taoru o tsuika shite kudasai', '客房服务'],
    ['お風呂はどこですか', '浴室在哪里？', 'ofuro wa doko desu ka', '询问设施'],
  ],
};

// 为每个场景填充短语
for (const [scenarioId, phrases] of Object.entries(phraseTexts)) {
  phrases.forEach(([target, native, pron, note], i) => {
    phraseData.push({
      id: `phrase_${scenarioId}_${i + 1}`,
      scenario_id: scenarioId,
      target_lang: target,
      native_lang: native,
      pronunciation: pron,
      context_note: note,
      order_index: i + 1,
    });
  });
}

// ── 用户资料 (user_profiles) ──────────────────────────────────────────────────

const defaultUserProfile: SeedRow[] = [
  {
    id: 'default_user',
    nickname: '语言学习者',
    avatar: '/avatars/default.png',
    location: '中国',
    location_code: 'CN',
    interests: JSON.stringify(['语言学习', '旅行', '阅读']),
    learning_languages: JSON.stringify(['ja', 'en', 'ko']),
    level: 1,
    xp: 0,
    streak: 0,
    bio: '正在努力学习新语言！',
    privacy: JSON.stringify({ allowDiscover: true, showLocation: false, showInterests: true }),
    created_at: new Date().toISOString(),
  },
];

// ── AI模型配置 ────────────────────────────────────────────────────────────────

const aiModelConfig: SeedRow[] = [
  {
    id: 'ai_config_default',
    model_name: 'gpt-4o-mini',
    provider: 'openai',
    temperature: 0.7,
    max_tokens: 2000,
    is_default: true,
    supported_features: JSON.stringify(['translation', 'grammar', 'conversation', 'writing', 'reading']),
    created_at: new Date().toISOString(),
  },
];

// ── 考试题目 (ExamEngine) ─────────────────────────────────────────────────────

const examQuestions: SeedRow[] = [
  { id: 'exam_q_1', type: 'multiple_choice', language: 'en', difficulty: 'beginner', question: 'What is the plural of "child"?', options: JSON.stringify(['childs', 'children', 'childes', 'childrens']), correct_index: 1, explanation: '"Children" is the irregular plural of "child"', points: 5, created_at: new Date().toISOString() },
  { id: 'exam_q_2', type: 'multiple_choice', language: 'en', difficulty: 'beginner', question: 'Choose the correct sentence:', options: JSON.stringify(['He don\'t like it', 'He doesn\'t like it', 'He not like it', 'He no like it']), correct_index: 1, explanation: 'Third person singular uses "doesn\'t"', points: 5, created_at: new Date().toISOString() },
  { id: 'exam_q_3', type: 'multiple_choice', language: 'en', difficulty: 'intermediate', question: 'What does "ubiquitous" mean?', options: JSON.stringify(['Rare', 'Everywhere', 'Underground', 'Unique']), correct_index: 1, explanation: '"Ubiquitous" means present everywhere', points: 10, created_at: new Date().toISOString() },
  { id: 'exam_q_4', type: 'multiple_choice', language: 'en', difficulty: 'intermediate', question: 'Choose the correct conditional:', options: JSON.stringify(['If I was you', 'If I were you', 'If I am you', 'If I be you']), correct_index: 1, explanation: 'Subjunctive mood uses "were"', points: 10, created_at: new Date().toISOString() },
  { id: 'exam_q_5', type: 'multiple_choice', language: 'en', difficulty: 'advanced', question: 'Identify the literary device: "The wind whispered through the trees"', options: JSON.stringify(['Metaphor', 'Simile', 'Personification', 'Hyperbole']), correct_index: 2, explanation: 'Giving human qualities to wind is personification', points: 15, created_at: new Date().toISOString() },
  { id: 'exam_q_6', type: 'multiple_choice', language: 'ja', difficulty: 'beginner', question: '「猫」の読み方は？', options: JSON.stringify(['いぬ', 'ねこ', 'とり', 'さかな']), correct_index: 1, explanation: '「猫」は「ねこ」と読む', points: 5, created_at: new Date().toISOString() },
  { id: 'exam_q_7', type: 'multiple_choice', language: 'ja', difficulty: 'beginner', question: '正しい助詞：私___日本人です。', options: JSON.stringify(['が', 'を', 'は', 'に']), correct_index: 2, explanation: '主語の後は「は」', points: 5, created_at: new Date().toISOString() },
  { id: 'exam_q_8', type: 'multiple_choice', language: 'ja', difficulty: 'intermediate', question: '「食べる」の可能形は？', options: JSON.stringify(['食べます', '食べられる', '食べたい', '食べない']), correct_index: 1, explanation: '一段動詞の可能形は「〜られる」', points: 10, created_at: new Date().toISOString() },
  { id: 'exam_q_9', type: 'multiple_choice', language: 'ja', difficulty: 'intermediate', question: '「先生が学生に日本語を___」正しいのは？', options: JSON.stringify(['教えます', '教わります', '習います', '学びます']), correct_index: 0, explanation: '先生が教える側', points: 10, created_at: new Date().toISOString() },
  { id: 'exam_q_10', type: 'multiple_choice', language: 'ja', difficulty: 'advanced', question: '「さすが」の正しい使い方は？', options: JSON.stringify(['さすがに疲れた', 'さすが美味しい', 'さすが、プロですね', 'さすが行こう']), correct_index: 2, explanation: '「さすが」は感心した時に使う', points: 15, created_at: new Date().toISOString() },
  { id: 'exam_q_11', type: 'multiple_choice', language: 'ko', difficulty: 'beginner', question: '"감사합니다"의 의미는?', options: JSON.stringify(['안녕하세요', '감사합니다', '미안합니다', '사랑합니다']), correct_index: 1, explanation: '"감사합니다"는 "谢谢"라는 뜻', points: 5, created_at: new Date().toISOString() },
  { id: 'exam_q_12', type: 'multiple_choice', language: 'ko', difficulty: 'beginner', question: '올바른 조사: 저___ 학생입니다.', options: JSON.stringify(['을', '를', '는', '가']), correct_index: 2, explanation: '"저는"이 맞는 표현', points: 5, created_at: new Date().toISOString() },
  { id: 'exam_q_13', type: 'multiple_choice', language: 'ko', difficulty: 'intermediate', question: '"먹다"의 높임말은?', options: JSON.stringify(['먹어요', '먹습니다', '드시다', '잡수시다']), correct_index: 2, explanation: '"먹다"의 높임말은 "드시다"', points: 10, created_at: new Date().toISOString() },
  { id: 'exam_q_14', type: 'multiple_choice', language: 'ko', difficulty: 'intermediate', question: '"비가 오___ 우산을 가져가세요" 빈칸에 알맞은 말은?', options: JSON.stringify(['면', '서', '고', '니까']), correct_index: 0, explanation: '조건을 나타내는 "~(으)면"', points: 10, created_at: new Date().toISOString() },
  { id: 'exam_q_15', type: 'multiple_choice', language: 'ko', difficulty: 'advanced', question: '"그림의 떡"의 의미는?', options: JSON.stringify(['맛있는 떡', '보기만 하고 가질 수 없는 것', '선물', '음식']), correct_index: 1, explanation: '볼 수만 있고 가질 수 없는 것을 비유', points: 15, created_at: new Date().toISOString() },
  { id: 'exam_q_16', type: 'multiple_choice', language: 'en', difficulty: 'beginner', question: 'Choose: There ___ many people at the party.', options: JSON.stringify(['is', 'are', 'was', 'be']), correct_index: 1, explanation: '"People" is plural, use "are"', points: 5, created_at: new Date().toISOString() },
  { id: 'exam_q_17', type: 'multiple_choice', language: 'en', difficulty: 'beginner', question: 'Opposite of "hot":', options: JSON.stringify(['Warm', 'Cold', 'Cool', 'Mild']), correct_index: 1, explanation: '"Cold" is the direct opposite of "hot"', points: 5, created_at: new Date().toISOString() },
  { id: 'exam_q_18', type: 'multiple_choice', language: 'en', difficulty: 'intermediate', question: 'Which is correct?', options: JSON.stringify(['I have went', 'I have gone', 'I have goed', 'I have going']), correct_index: 1, explanation: 'Past participle of "go" is "gone"', points: 10, created_at: new Date().toISOString() },
  { id: 'exam_q_19', type: 'multiple_choice', language: 'en', difficulty: 'intermediate', question: 'Synonym of "happy":', options: JSON.stringify(['Sad', 'Angry', 'Joyful', 'Tired']), correct_index: 2, explanation: '"Joyful" means feeling great happiness', points: 10, created_at: new Date().toISOString() },
  { id: 'exam_q_20', type: 'multiple_choice', language: 'en', difficulty: 'advanced', question: 'Which sentence uses "whom" correctly?', options: JSON.stringify(['Whom is at the door?', 'To whom should I address this?', 'Whom are you?', 'Whom did that?']), correct_index: 1, explanation: '"Whom" is the object form, used after prepositions', points: 15, created_at: new Date().toISOString() },
  { id: 'exam_q_21', type: 'multiple_choice', language: 'ja', difficulty: 'advanced', question: '「一期一会」の意味は？', options: JSON.stringify(['一度だけの人生', '一度の出会いを大切に', '一期の間に一度', '一度のチャンス']), correct_index: 1, explanation: '茶道から来た言葉で、出会いの大切さを表す', points: 15, created_at: new Date().toISOString() },
  { id: 'exam_q_22', type: 'multiple_choice', language: 'ko', difficulty: 'advanced', question: '다음 중 맞춤법이 틀린 것은?', options: JSON.stringify(['되어', '돼', '되', '됀']), correct_index: 3, explanation: '"됀"은 표준어가 아님', points: 15, created_at: new Date().toISOString() },
  { id: 'exam_q_23', type: 'multiple_choice', language: 'en', difficulty: 'advanced', question: 'What is the term for a word that sounds like what it describes?', options: JSON.stringify(['Metaphor', 'Onomatopoeia', 'Alliteration', 'Oxymoron']), correct_index: 1, explanation: 'Onomatopoeia = words that imitate sounds (buzz, hiss)', points: 15, created_at: new Date().toISOString() },
  { id: 'exam_q_24', type: 'multiple_choice', language: 'en', difficulty: 'intermediate', question: 'Choose: Neither John nor Mary ___ coming.', options: JSON.stringify(['is', 'are', 'were', 'have']), correct_index: 0, explanation: 'With "neither...nor", the verb agrees with the nearer subject (Mary = singular)', points: 10, created_at: new Date().toISOString() },
  { id: 'exam_q_25', type: 'multiple_choice', language: 'ja', difficulty: 'intermediate', question: '「〜てしまう」の意味は？', options: JSON.stringify(['完了・後悔', '命令', '否定', '疑問']), correct_index: 0, explanation: '動作の完了や後悔を表す', points: 10, created_at: new Date().toISOString() },
  { id: 'exam_q_26', type: 'multiple_choice', language: 'ko', difficulty: 'intermediate', question: '"-고 있다"의 의미는?', options: JSON.stringify(['과거', '현재진행', '미래', '부정']), correct_index: 1, explanation: '현재 진행 중인 동작을 나타냄', points: 10, created_at: new Date().toISOString() },
  { id: 'exam_q_27', type: 'multiple_choice', language: 'en', difficulty: 'beginner', question: 'What time is it? (3:15)', options: JSON.stringify(['Three fifteen', 'Three fifty', 'Two fifteen', 'Three thirty']), correct_index: 0, explanation: '3:15 = three fifteen or quarter past three', points: 5, created_at: new Date().toISOString() },
  { id: 'exam_q_28', type: 'multiple_choice', language: 'ja', difficulty: 'beginner', question: '「今日」の読み方は？', options: JSON.stringify(['あした', 'きのう', 'きょう', 'あさって']), correct_index: 2, explanation: '「今日」は「きょう」', points: 5, created_at: new Date().toISOString() },
  { id: 'exam_q_29', type: 'multiple_choice', language: 'ko', difficulty: 'beginner', question: '"사랑해요"의 의미는?', options: JSON.stringify(['你好', '谢谢', '我爱你', '再见']), correct_index: 2, explanation: '"사랑해요"는 "我爱你"라는 뜻', points: 5, created_at: new Date().toISOString() },
  { id: 'exam_q_30', type: 'multiple_choice', language: 'en', difficulty: 'advanced', question: 'Choose the correct subjunctive:', options: JSON.stringify(['I suggest that he goes', 'I suggest that he go', 'I suggest that he going', 'I suggest that he went']), correct_index: 1, explanation: 'Subjunctive after "suggest" uses the base form "go"', points: 15, created_at: new Date().toISOString() },
];

// ── 种子数据填充函数 ──────────────────────────────────────────────────────────

/**
 * 将所有种子数据写入 LocalDataProvider。
 * 每张表先检查是否已有数据，为空时才填充。
 */
export async function seedAllTables(dataProvider: IDataProvider): Promise<void> {
  const tables: Record<string, SeedRow[]> = {
    contents: contentItems,
    scenarios: scenarioData,
    phrases: phraseData,
    user_profiles: [...userProfiles, ...defaultUserProfile],
    radio_contents: radioContents,
    game_content_pool: gameContentPool,
    daily_challenges: dailyChallenges,
    seasons: seasons,
    season_rankings: seasonRankings,
    posts: posts,
    friend_requests: friendRequests,
    partner_matches: partnerMatches,
    exam_questions: examQuestions,
    ai_model_config: aiModelConfig,
  };

  for (const [tableName, rows] of Object.entries(tables)) {
    try {
      // 检查表是否已有数据，避免重复填充
      const existingCount = await dataProvider.count(tableName);
      if (existingCount > 0) {
        console.log(`[seedData] Table "${tableName}" already has ${existingCount} rows, skipping`);
        continue;
      }

      // 分批插入（避免一次插入太多）
      const batchSize = 50;
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        await dataProvider.insert(tableName, batch);
      }
      console.log(`[seedData] Table "${tableName}" seeded with ${rows.length} rows`);
    } catch (e) {
      console.warn(`[seedData] Failed to seed table "${tableName}":`, e);
    }
  }
}

/**
 * 获取种子数据用于 fallback 场景。
 * 当组件无法从数据库获取数据时，可直接使用这些数据。
 */
export function getSeedData() {
  return {
    contents: contentItems,
    scenarios: scenarioData,
    phrases: phraseData,
    userProfiles: [...userProfiles, ...defaultUserProfile],
    radioContents,
    gameContentPool,
    dailyChallenges,
    seasons,
    seasonRankings,
    posts,
    friendRequests,
    partnerMatches,
    examQuestions,
    aiModelConfig,
  };
}
