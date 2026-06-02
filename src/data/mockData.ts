export interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string;
  flag: string;
  order_index: number;
}

export interface WordItem {
  id: string;
  word: string;
  meaning: string;
  phonetic?: string;
  example?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  words: WordItem[];
  completed?: boolean;
}

export interface AICharacter {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
}

export interface GameLevel {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: GameQuestion[];
}

export interface GameQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface RadioStation {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
}

export interface UserProfile {
  id: string;
  nickname: string;
  avatar: string;
  location: string;
  locationCode: string;
  interests: string[];
  learningLanguages: string[];
  level: number;
  xp: number;
  streak: number;
  privacy: {
    allowDiscover: boolean;
    showLocation: boolean;
    showInterests: boolean;
  };
  bio: string;
}

export interface FriendRequest {
  id: string;
  fromId: string;
  toId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Conversation {
  id: string;
  speaker: string;
  text: string;
  isAI: boolean;
  timestamp?: number;
}

export interface UserProgress {
  totalWords: number;
  completedLessons: number;
  totalLessons: number;
  streak: number;
  xp: number;
  level: number;
}

export const mockLanguages: Language[] = [
  { id: '1', code: 'ja', name: '日语', native_name: '日本語', flag: 'JP', order_index: 1 },
  { id: '2', code: 'en', name: '英语', native_name: 'English', flag: 'US', order_index: 2 },
  { id: '3', code: 'ko', name: '韩语', native_name: '한국어', flag: 'KR', order_index: 3 },
  { id: '4', code: 'fr', name: '法语', native_name: 'Français', flag: 'FR', order_index: 4 },
  { id: '5', code: 'es', name: '西班牙语', native_name: 'Español', flag: 'ES', order_index: 5 },
  { id: '6', code: 'de', name: '德语', native_name: 'Deutsch', flag: 'DE', order_index: 6 },
  { id: '7', code: 'it', name: '意大利语', native_name: 'Italiano', flag: 'IT', order_index: 7 },
  { id: '8', code: 'pt', name: '葡萄牙语', native_name: 'Português', flag: 'PT', order_index: 8 },
  { id: '9', code: 'ar', name: '阿拉伯语', native_name: 'العربية', flag: 'SA', order_index: 9 },
  { id: '10', code: 'zh', name: '中文', native_name: '中文', flag: 'CN', order_index: 10 },
];

export const mockLessons: Record<string, Lesson[]> = {
  ja: [
    {
      id: 'ja_lesson_1',
      title: '日常问候',
      description: '学习日语中最常用的问候语',
      words: [
        { id: 'ja_1', word: 'こんにちは', meaning: '你好', phonetic: 'konnichiwa', example: 'こんにちは、元気ですか？' },
        { id: 'ja_2', word: 'ありがとう', meaning: '谢谢', phonetic: 'arigatou', example: 'ありがとうございます' },
        { id: 'ja_3', word: 'さようなら', meaning: '再见', phonetic: 'sayounara', example: 'さようなら、また明日' },
        { id: 'ja_4', word: 'おはよう', meaning: '早上好', phonetic: 'ohayou', example: 'おはようございます' },
        { id: 'ja_5', word: 'こんばんは', meaning: '晚上好', phonetic: 'konbanwa', example: 'こんばんは、遅くなってすみません' },
        { id: 'ja_6', word: 'お休みなさい', meaning: '晚安', phonetic: 'oyasuminasai', example: 'お休みなさい、いい夢を' },
        { id: 'ja_7', word: 'すみません', meaning: '对不起/打扰一下', phonetic: 'sumimasen', example: 'すみません、ちょっといいですか？' },
        { id: 'ja_8', word: 'どういたしまして', meaning: '不客气', phonetic: 'douitashimashite', example: 'どういたしまして、お役に立てて嬉しいです' },
      ]
    },
    {
      id: 'ja_lesson_2',
      title: '数字入门',
      description: '学习1-100的日语表达',
      words: [
        { id: 'ja_9', word: 'いち', meaning: '一', phonetic: 'ichi', example: 'いち、に、さん...' },
        { id: 'ja_10', word: 'に', meaning: '二', phonetic: 'ni', example: 'にほん - 日本' },
        { id: 'ja_11', word: 'さん', meaning: '三', phonetic: 'san', example: 'さんぽ - 散步' },
        { id: 'ja_12', word: 'よん', meaning: '四', phonetic: 'yon', example: 'よんか - 四号' },
        { id: 'ja_13', word: 'ご', meaning: '五', phonetic: 'go', example: 'ごご - 午后' },
        { id: 'ja_14', word: 'ろく', meaning: '六', phonetic: 'roku', example: 'ろくじ - 六点' },
        { id: 'ja_15', word: 'なな', meaning: '七', phonetic: 'nana', example: 'ななふん - 七分' },
        { id: 'ja_16', word: 'はち', meaning: '八', phonetic: 'hachi', example: 'はちじ - 八点' },
        { id: 'ja_17', word: 'きゅう', meaning: '九', phonetic: 'kyuu', example: 'きゅうがつ - 九月' },
        { id: 'ja_18', word: 'じゅう', meaning: '十', phonetic: 'juu', example: 'じゅうに - 十二' },
        { id: 'ja_19', word: 'ひゃく', meaning: '百', phonetic: 'hyaku', example: 'ひゃくえん - 一百日元' },
      ]
    },
    {
      id: 'ja_lesson_3',
      title: '家庭成员',
      description: '学习家庭成员的称呼',
      words: [
        { id: 'ja_20', word: 'お父さん', meaning: '爸爸', phonetic: 'otousan', example: 'お父さんは仕事に行きました' },
        { id: 'ja_21', word: 'お母さん', meaning: '妈妈', phonetic: 'okaasan', example: 'お母さんは料理をしています' },
        { id: 'ja_22', word: '兄', meaning: '哥哥', phonetic: 'ani', example: '兄は大学生です' },
        { id: 'ja_23', word: '姉', meaning: '姐姐', phonetic: 'ane', example: '姉は教師です' },
        { id: 'ja_24', word: '弟', meaning: '弟弟', phonetic: 'otouto', example: '弟は中学生です' },
        { id: 'ja_25', word: '妹', meaning: '妹妹', phonetic: 'imouto', example: '妹は小学生です' },
        { id: 'ja_26', word: 'おじいさん', meaning: '爷爷', phonetic: 'ojiisan', example: 'おじいさんは元気です' },
        { id: 'ja_27', word: 'おばあさん', meaning: '奶奶', phonetic: 'obaasan', example: 'おばあさんは手芸が得意です' },
      ]
    },
    {
      id: 'ja_lesson_4',
      title: '日常物品',
      description: '学习日常生活中常见物品的日语表达',
      words: [
        { id: 'ja_28', word: '本', meaning: '书', phonetic: 'hon', example: 'この本は面白いです' },
        { id: 'ja_29', word: 'ペン', meaning: '笔', phonetic: 'pen', example: 'ペンを貸してください' },
        { id: 'ja_30', word: 'ノート', meaning: '笔记本', phonetic: 'nooto', example: 'ノートにメモを取ります' },
        { id: 'ja_31', word: '机', meaning: '桌子', phonetic: 'tsukue', example: '机の上に本があります' },
        { id: 'ja_32', word: '椅子', meaning: '椅子', phonetic: 'isu', example: '椅子に座ってください' },
        { id: 'ja_33', word: 'テレビ', meaning: '电视', phonetic: 'terebi', example: 'テレビを見ています' },
        { id: 'ja_34', word: '電話', meaning: '电话', phonetic: 'denwa', example: '電話をかけます' },
        { id: 'ja_35', word: '時計', meaning: '钟表', phonetic: 'tokei', example: '時計を見てください' },
      ]
    },
    {
      id: 'ja_lesson_5',
      title: '食物与饮料',
      description: '学习各种食物和饮料的日语表达',
      words: [
        { id: 'ja_36', word: 'ご飯', meaning: '米饭', phonetic: 'gohan', example: 'ご飯を食べます' },
        { id: 'ja_37', word: 'パン', meaning: '面包', phonetic: 'pan', example: 'パンを買いました' },
        { id: 'ja_38', word: '卵', meaning: '鸡蛋', phonetic: 'tamago', example: '卵を2個買いました' },
        { id: 'ja_39', word: '牛乳', meaning: '牛奶', phonetic: 'gyuunyuu', example: '牛乳を飲みます' },
        { id: 'ja_40', word: 'コーヒー', meaning: '咖啡', phonetic: 'koohii', example: 'コーヒーを飲みたい' },
        { id: 'ja_41', word: '紅茶', meaning: '红茶', phonetic: 'koucha', example: '紅茶を淹れます' },
        { id: 'ja_42', word: '水', meaning: '水', phonetic: 'mizu', example: '水を飲みます' },
        { id: 'ja_43', word: '寿司', meaning: '寿司', phonetic: 'sushi', example: '寿司を食べに行きます' },
      ]
    },
    {
      id: 'ja_lesson_6',
      title: '颜色',
      description: '学习各种颜色的日语表达',
      words: [
        { id: 'ja_44', word: '赤', meaning: '红色', phonetic: 'aka', example: '赤いりんご' },
        { id: 'ja_45', word: '青', meaning: '蓝色', phonetic: 'ao', example: '青い空' },
        { id: 'ja_46', word: '黄色', meaning: '黄色', phonetic: 'kiiro', example: '黄色いバナナ' },
        { id: 'ja_47', word: '緑', meaning: '绿色', phonetic: 'midori', example: '緑の葉' },
        { id: 'ja_48', word: '黒', meaning: '黑色', phonetic: 'kuro', example: '黒い服' },
        { id: 'ja_49', word: '白', meaning: '白色', phonetic: 'shiro', example: '白い紙' },
        { id: 'ja_50', word: 'ピンク', meaning: '粉色', phonetic: 'pinku', example: 'ピンクの花' },
        { id: 'ja_51', word: '紫', meaning: '紫色', phonetic: 'murasaki', example: '紫のゆり' },
      ]
    },
  ],
  en: [
    {
      id: 'en_lesson_1',
      title: '基础问候',
      description: '学习英语中最常用的问候语',
      words: [
        { id: 'en_1', word: 'Hello', meaning: '你好', phonetic: 'heˈloʊ', example: 'Hello, how are you?' },
        { id: 'en_2', word: 'Thank you', meaning: '谢谢', phonetic: 'θæŋk ju', example: 'Thank you very much' },
        { id: 'en_3', word: 'Goodbye', meaning: '再见', phonetic: 'gʊdˈbaɪ', example: 'Goodbye, see you tomorrow' },
        { id: 'en_4', word: 'Good morning', meaning: '早上好', phonetic: 'gʊd ˈmɔːrnɪŋ', example: 'Good morning, everyone' },
        { id: 'en_5', word: 'Good evening', meaning: '晚上好', phonetic: 'gʊd ˈiːvnɪŋ', example: 'Good evening, sir' },
        { id: 'en_6', word: 'Good night', meaning: '晚安', phonetic: 'gʊd naɪt', example: 'Good night, sweet dreams' },
        { id: 'en_7', word: 'Excuse me', meaning: '打扰一下', phonetic: 'ɪkˈskjuːz mi', example: 'Excuse me, can you help?' },
        { id: 'en_8', word: 'Youre welcome', meaning: '不客气', phonetic: 'jʊr ˈwɛlkəm', example: 'Youre welcome, happy to help' },
      ]
    },
    {
      id: 'en_lesson_2',
      title: '常用动词',
      description: '学习最常用的英语动词',
      words: [
        { id: 'en_9', word: 'to be', meaning: '是', phonetic: 'tu bi', example: 'I am a student' },
        { id: 'en_10', word: 'to have', meaning: '有', phonetic: 'tu hæv', example: 'I have a book' },
        { id: 'en_11', word: 'to do', meaning: '做', phonetic: 'tu du', example: 'What do you do?' },
        { id: 'en_12', word: 'to go', meaning: '去', phonetic: 'tu goʊ', example: 'I go to school' },
        { id: 'en_13', word: 'to say', meaning: '说', phonetic: 'tu seɪ', example: 'What did he say?' },
        { id: 'en_14', word: 'to see', meaning: '看', phonetic: 'tu si', example: 'I see you' },
        { id: 'en_15', word: 'to eat', meaning: '吃', phonetic: 'tu iːt', example: 'I eat breakfast' },
        { id: 'en_16', word: 'to drink', meaning: '喝', phonetic: 'tu drɪŋk', example: 'I drink coffee' },
      ]
    },
    {
      id: 'en_lesson_3',
      title: '数字',
      description: '学习1-100的英语表达',
      words: [
        { id: 'en_17', word: 'one', meaning: '一', phonetic: 'wʌn', example: 'one apple' },
        { id: 'en_18', word: 'two', meaning: '二', phonetic: 'tu', example: 'two books' },
        { id: 'en_19', word: 'three', meaning: '三', phonetic: 'θri', example: 'three friends' },
        { id: 'en_20', word: 'four', meaning: '四', phonetic: 'fɔːr', example: 'four seasons' },
        { id: 'en_21', word: 'five', meaning: '五', phonetic: 'faɪv', example: 'five fingers' },
        { id: 'en_22', word: 'ten', meaning: '十', phonetic: 'tɛn', example: 'ten years' },
        { id: 'en_23', word: 'twenty', meaning: '二十', phonetic: 'ˈtwɛnti', example: 'twenty students' },
        { id: 'en_24', word: 'hundred', meaning: '一百', phonetic: 'ˈhʌndrəd', example: 'one hundred' },
      ]
    },
    {
      id: 'en_lesson_4',
      title: '家庭成员',
      description: '学习家庭成员的英语称呼',
      words: [
        { id: 'en_25', word: 'father', meaning: '父亲', phonetic: 'ˈfɑːðər', example: 'My father is a doctor' },
        { id: 'en_26', word: 'mother', meaning: '母亲', phonetic: 'ˈmʌðər', example: 'My mother is a teacher' },
        { id: 'en_27', word: 'brother', meaning: '兄弟', phonetic: 'ˈbrʌðər', example: 'I have one brother' },
        { id: 'en_28', word: 'sister', meaning: '姐妹', phonetic: 'ˈsɪstər', example: 'She has two sisters' },
        { id: 'en_29', word: 'son', meaning: '儿子', phonetic: 'sʌn', example: 'He has a son' },
        { id: 'en_30', word: 'daughter', meaning: '女儿', phonetic: 'ˈdɔːtər', example: 'She has a daughter' },
        { id: 'en_31', word: 'grandfather', meaning: '祖父', phonetic: 'ˈɡrændfɑːðər', example: 'My grandfather is retired' },
        { id: 'en_32', word: 'grandmother', meaning: '祖母', phonetic: 'ˈɡrændmʌðər', example: 'My grandmother bakes cookies' },
      ]
    },
  ],
  ko: [
    {
      id: 'ko_lesson_1',
      title: '基础问候',
      description: '学习韩语中最常用的问候语',
      words: [
        { id: 'ko_1', word: '안녕하세요', meaning: '你好', phonetic: 'an-nyeong-ha-se-yo', example: '안녕하세요, 반갑습니다' },
        { id: 'ko_2', word: '감사합니다', meaning: '谢谢', phonetic: 'gam-sa-ham-ni-da', example: '감사합니다, 잘했어요' },
        { id: 'ko_3', word: '안녕히가세요', meaning: '再见', phonetic: 'an-nyeong-hi-ga-se-yo', example: '안녕히가세요, 내일 봐요' },
        { id: 'ko_4', word: '안녕히주무세요', meaning: '晚安', phonetic: 'an-nyeong-hi-ju-mu-se-yo', example: '안녕히주무세요, 꿈에서 만나요' },
        { id: 'ko_5', word: '죄송합니다', meaning: '对不起', phonetic: 'joe-song-ham-ni-da', example: '죄송합니다, 지각했어요' },
        { id: 'ko_6', word: '천만에요', meaning: '不客气', phonetic: 'cheon-man-e-yo', example: '천만에요, 도와줘서 기뻐요' },
        { id: 'ko_7', word: '잘 지냈어요', meaning: '过得好吗', phonetic: 'jal ji-nae-sseo-yo', example: '오랜만이에요, 잘 지냈어요?' },
        { id: 'ko_8', word: '네', meaning: '是的', phonetic: 'ne', example: '네, 그래요' },
      ]
    },
    {
      id: 'ko_lesson_2',
      title: '数字',
      description: '学习1-10的韩语表达',
      words: [
        { id: 'ko_9', word: '하나', meaning: '一', phonetic: 'ha-na', example: '하나, 둘, 셋...' },
        { id: 'ko_10', word: '둘', meaning: '二', phonetic: 'dul', example: '둘째 아들' },
        { id: 'ko_11', word: '셋', meaning: '三', phonetic: 'set', example: '셋 명의 친구' },
        { id: 'ko_12', word: '넷', meaning: '四', phonetic: 'net', example: '넷 명이 왔어요' },
        { id: 'ko_13', word: '다섯', meaning: '五', phonetic: 'da-seot', example: '다섯 시' },
        { id: 'ko_14', word: '여섯', meaning: '六', phonetic: 'yeo-seot', example: '여섯 명' },
        { id: 'ko_15', word: '일곱', meaning: '七', phonetic: 'il-gop', example: '일곱 살' },
        { id: 'ko_16', word: '여덟', meaning: '八', phonetic: 'yeo-deol', example: '여덟 권의 책' },
      ]
    },
  ],
  fr: [
    {
      id: 'fr_lesson_1',
      title: '基础问候',
      description: '学习法语中最常用的问候语',
      words: [
        { id: 'fr_1', word: 'Bonjour', meaning: '你好', phonetic: 'bɔ̃ʒuʁ', example: 'Bonjour, comment ça va?' },
        { id: 'fr_2', word: 'Merci', meaning: '谢谢', phonetic: 'mɛʁsi', example: 'Merci beaucoup' },
        { id: 'fr_3', word: 'Au revoir', meaning: '再见', phonetic: 'o ʁəvwaʁ', example: 'Au revoir, à demain' },
        { id: 'fr_4', word: 'Bonsoir', meaning: '晚上好', phonetic: 'bɔ̃swaʁ', example: 'Bonsoir, comment allez-vous?' },
        { id: 'fr_5', word: 'Bon nuit', meaning: '晚安', phonetic: 'bɔ̃ nɥi', example: 'Bon nuit, fais de beaux rêves' },
      ]
    },
  ],
  es: [
    {
      id: 'es_lesson_1',
      title: '基础问候',
      description: '学习西班牙语中最常用的问候语',
      words: [
        { id: 'es_1', word: 'Hola', meaning: '你好', phonetic: 'ˈola', example: 'Hola, ¿cómo estás?' },
        { id: 'es_2', word: 'Gracias', meaning: '谢谢', phonetic: 'ˈgɾaθjas', example: 'Gracias mucho' },
        { id: 'es_3', word: 'Adiós', meaning: '再见', phonetic: 'aˈðjos', example: 'Adiós, hasta mañana' },
        { id: 'es_4', word: 'Buenos días', meaning: '早上好', phonetic: 'ˈbwenos ˈdi.as', example: 'Buenos días, señor' },
        { id: 'es_5', word: 'Buenas noches', meaning: '晚上好', phonetic: 'ˈbwenas ˈnotʃes', example: 'Buenas noches, descansa' },
      ]
    },
  ],
};

export const mockAICharacters: AICharacter[] = [
  {
    id: 'ai_1',
    name: '小樱老师',
    role: '日语外教',
    description: '温柔耐心的日语老师，擅长用故事帮助记忆',
    avatar: '🌸'
  },
  {
    id: 'ai_2',
    name: 'Mike老师',
    role: '英语外教',
    description: '风趣幽默的英语老师，让学习变得有趣',
    avatar: '👨‍🏫'
  },
  {
    id: 'ai_3',
    name: '韩语欧尼',
    role: '韩语外教',
    description: '可爱活泼的韩语老师，教你地道韩语',
    avatar: '💖'
  },
  {
    id: 'ai_4',
    name: '旅行达人',
    role: '旅行伴侣',
    description: '陪你练习旅行场景对话，轻松出国游',
    avatar: '✈️'
  },
  {
    id: 'ai_5',
    name: '美食家',
    role: '美食向导',
    description: '教你各国美食相关词汇，边吃边学',
    avatar: '🍜'
  },
  {
    id: 'ai_6',
    name: '商务精英',
    role: '商务顾问',
    description: '专业商务用语教学，助你职场进阶',
    avatar: '💼'
  },
];

export const mockDailyTasks = [
  { id: 'task_1', title: '学习10个单词', description: '完成今日单词学习', reward: 10, completed: false },
  { id: 'task_2', title: '完成1节课', description: '完成任意一节课的学习', reward: 15, completed: false },
  { id: 'task_3', title: 'AI对话练习', description: '与AI角色对话练习', reward: 20, completed: false },
  { id: 'task_4', title: '连续打卡', description: '连续学习3天', reward: 30, completed: true },
  { id: 'task_5', title: '分享学习', description: '分享学习成果到社交平台', reward: 25, completed: false },
  { id: 'task_6', title: '游戏挑战', description: '完成一个游戏关卡', reward: 15, completed: false },
  { id: 'task_7', title: '听力练习', description: '收听电台节目', reward: 10, completed: false },
  { id: 'task_8', title: '复习旧词', description: '复习20个已学单词', reward: 20, completed: false },
];

export const mockAchievements = [
  { id: 'ach_1', title: '初学者', description: '完成第一次学习', icon: '🌟', unlocked: true },
  { id: 'ach_2', title: '坚持者', description: '连续学习7天', icon: '🔥', unlocked: true },
  { id: 'ach_3', title: '词汇达人', description: '累计学习100个单词', icon: '📚', unlocked: true },
  { id: 'ach_4', title: '会话高手', description: '完成50次AI对话', icon: '💬', unlocked: false },
  { id: 'ach_5', title: '多语种学习者', description: '学习3种以上语言', icon: '🌍', unlocked: false },
  { id: 'ach_6', title: '学霸', description: '累计学习1000个单词', icon: '👑', unlocked: false },
  { id: 'ach_7', title: '游戏达人', description: '通过所有游戏关卡', icon: '🎮', unlocked: false },
  { id: 'ach_8', title: '听力专家', description: '收听100小时音频', icon: '🎧', unlocked: false },
  { id: 'ach_9', title: '分享达人', description: '分享学习成果10次', icon: '📤', unlocked: false },
  { id: 'ach_10', title: '全勤奖', description: '连续学习30天', icon: '🏆', unlocked: false },
];

export const mockLeaderboard = [
  { rank: 1, name: '学霸小明', xp: 12500, streak: 30, avatar: '👑' },
  { rank: 2, name: '语言达人', xp: 11800, streak: 25, avatar: '🌟' },
  { rank: 3, name: '努力学习者', xp: 10500, streak: 20, avatar: '💪' },
  { rank: 4, name: '快乐学外语', xp: 9200, streak: 18, avatar: '😄' },
  { rank: 5, name: '坚持就是胜利', xp: 8700, streak: 15, avatar: '🔥' },
  { rank: 6, name: '你', xp: 5200, streak: 7, avatar: '🦜', isMe: true },
  { rank: 7, name: '日语爱好者', xp: 4800, streak: 10, avatar: '🌸' },
  { rank: 8, name: '英语学习者', xp: 4200, streak: 8, avatar: '📖' },
  { rank: 9, name: '韩语新手', xp: 3500, streak: 5, avatar: '💖' },
  { rank: 10, name: '法语初学者', xp: 2800, streak: 3, avatar: '🇫🇷' },
];

export const mockGrammarRules = [
  {
    id: 'grammar_1',
    title: '日语基本语序',
    rule: '日语的基本语序是「主语-宾语-谓语」(SOV)',
    example: '私は ご飯を 食べます (我 饭 吃)',
    explanation: '在日语中，动词总是放在句子的末尾'
  },
  {
    id: 'grammar_2',
    title: '助词的使用',
    rule: 'は(wa)表示主题，を(o)表示宾语，が(ga)表示主语',
    example: '私は学生です。本を読みます。',
    explanation: '助词在日语中非常重要，不同的助词表达不同的语法关系'
  },
  {
    id: 'grammar_3',
    title: 'ます形动词',
    rule: '动词ます形是礼貌形式，用于正式场合',
    example: '食べる → 食べます，行く → 行きます',
    explanation: '将动词词尾的「る」去掉，加上「ます」'
  },
  {
    id: 'grammar_4',
    title: 'です/ます体',
    rule: 'です用于名词和形容词后，ます用于动词后',
    example: '学生です、元気です、食べます',
    explanation: '这是日语中最基本的礼貌表达方式'
  },
  {
    id: 'grammar_5',
    title: '否定形',
    rule: '动词ます形去ます+ません表示否定',
    example: '食べます → 食べません',
    explanation: 'ません是ですます体的否定形式'
  },
  {
    id: 'grammar_6',
    title: '过去形',
    rule: '动词ます形去ます+ました表示过去',
    example: '食べます → 食べました',
    explanation: 'ました是ですます体的过去形式'
  },
];

export const mockGameLevels: GameLevel[] = [
  {
    id: 'game_1',
    title: '初级挑战',
    description: '测试你对基础单词的掌握程度',
    difficulty: 'easy',
    questions: [
      { id: 'q1', question: '「こんにちは」的意思是？', options: ['再见', '你好', '谢谢', '对不起'], correctIndex: 1, explanation: '「こんにちは」是日语中最常用的问候语，意思是"你好"' },
      { id: 'q2', question: '「ありがとう」的意思是？', options: ['谢谢', '你好', '再见', '对不起'], correctIndex: 0, explanation: '「ありがとう」是表示感谢的常用语' },
      { id: 'q3', question: '「いち」是数字几？', options: ['二', '三', '一', '四'], correctIndex: 2, explanation: '「いち」是数字1的日语读法' },
      { id: 'q4', question: '「さようなら」的意思是？', options: ['你好', '谢谢', '再见', '早上好'], correctIndex: 2, explanation: '「さようなら」是正式的告别用语' },
      { id: 'q5', question: '「ご飯」的意思是？', options: ['面包', '米饭', '水', '牛奶'], correctIndex: 1, explanation: '「ご飯」是日语中米饭的意思' },
    ]
  },
  {
    id: 'game_2',
    title: '中级挑战',
    description: '测试你对日常词汇的掌握',
    difficulty: 'medium',
    questions: [
      { id: 'q6', question: '「お父さん」的意思是？', options: ['妈妈', '爸爸', '哥哥', '姐姐'], correctIndex: 1, explanation: '「お父さん」是对父亲的尊称' },
      { id: 'q7', question: '「電話」的意思是？', options: ['电视', '电话', '电脑', '手机'], correctIndex: 1, explanation: '「電話」是电话的意思' },
      { id: 'q8', question: '「赤」的意思是？', options: ['蓝色', '红色', '黄色', '绿色'], correctIndex: 1, explanation: '「赤」是红色的意思' },
      { id: 'q9', question: '「パン」的意思是？', options: ['米饭', '面条', '面包', '蛋糕'], correctIndex: 2, explanation: '「パン」是从葡萄牙语pão来的外来词' },
      { id: 'q10', question: '「十」的日语读音是？', options: ['ichi', 'ni', 'juu', 'san'], correctIndex: 2, explanation: '「十」读作「じゅう」' },
    ]
  },
  {
    id: 'game_3',
    title: '高级挑战',
    description: '测试你对语法和句型的理解',
    difficulty: 'hard',
    questions: [
      { id: 'q11', question: '日语的基本语序是什么？', options: ['主-谓-宾', '主-宾-谓', '谓-主-宾', '宾-主-谓'], correctIndex: 1, explanation: '日语是SOV语言，动词放在句末' },
      { id: 'q12', question: '「は」的作用是？', options: ['表示宾语', '表示主题', '表示主语', '表示方向'], correctIndex: 1, explanation: '「は」是主题助词，用来提示句子的主题' },
      { id: 'q13', question: '「食べます」的否定形是？', options: ['食べました', '食べません', '食べない', '食べる'], correctIndex: 1, explanation: 'ます形的否定是去ます+ません' },
      { id: 'q14', question: '「私は学生です」的意思是？', options: ['我去学校', '我是学生', '学生是我', '学校是我的'], correctIndex: 1, explanation: '这是最基本的自我介绍句型' },
      { id: 'q15', question: '「を」的作用是？', options: ['表示主题', '表示主语', '表示宾语', '表示时间'], correctIndex: 2, explanation: '「を」是宾格助词，用来提示宾语' },
    ]
  },
];

export const mockRadioStations: RadioStation[] = [
  { id: 'radio_1', title: '日语入门', description: '适合初学者的日语听力练习', category: '日语', duration: 1800 },
  { id: 'radio_2', title: '英语新闻', description: 'BBC英语新闻精选', category: '英语', duration: 1200 },
  { id: 'radio_3', title: '韩语流行音乐', description: '最新K-pop歌曲', category: '韩语', duration: 2400 },
  { id: 'radio_4', title: '法语浪漫歌曲', description: '经典法语情歌', category: '法语', duration: 1800 },
  { id: 'radio_5', title: '西班牙语对话', description: '日常西班牙语对话练习', category: '西班牙语', duration: 1500 },
  { id: 'radio_6', title: '日语会话', description: '日常生活场景对话', category: '日语', duration: 2100 },
  { id: 'radio_7', title: '英语会话', description: '商务英语对话练习', category: '英语', duration: 1800 },
  { id: 'radio_8', title: '韩语学习', description: '韩语基础课程', category: '韩语', duration: 1500 },
];

export const mockTravelPhrases = [
  { id: 'travel_1', phrase: 'すみません、トイレはどこですか？', meaning: '请问，洗手间在哪里？', lang: 'ja' },
  { id: 'travel_2', phrase: 'これはいくらですか？', meaning: '这个多少钱？', lang: 'ja' },
  { id: 'travel_3', phrase: '英語を話せますか？', meaning: '你会说英语吗？', lang: 'ja' },
  { id: 'travel_4', phrase: '予約しています', meaning: '我有预约', lang: 'ja' },
  { id: 'travel_5', phrase: '助けてください', meaning: '请帮帮我', lang: 'ja' },
  { id: 'travel_6', phrase: '駅はどこですか？', meaning: '车站在哪里？', lang: 'ja' },
  { id: 'travel_7', phrase: 'バス停はどこですか？', meaning: '公交站在哪里？', lang: 'ja' },
  { id: 'travel_8', phrase: 'レストランを紹介してください', meaning: '请推荐一家餐厅', lang: 'ja' },
];

export const mockUserProgress: UserProgress = {
  totalWords: 45,
  completedLessons: 3,
  totalLessons: 15,
  streak: 7,
  xp: 5200,
  level: 8,
};

export const getMockData = {
  languages: () => mockLanguages,
  lessons: (langCode: string) => mockLessons[langCode] || mockLessons['ja'],
  characters: () => mockAICharacters,
  dailyTasks: () => mockDailyTasks,
  achievements: () => mockAchievements,
  leaderboard: () => mockLeaderboard,
  grammarRules: () => mockGrammarRules,
  travelPhrases: (langCode: string) => travelPhrases.filter(p => p.lang === langCode),
  gameLevels: () => mockGameLevels,
  radioStations: () => mockRadioStations,
  userProgress: () => mockUserProgress,
};

export const travelPhrases = mockTravelPhrases;

export const mockUserProfiles: UserProfile[] = [
  {
    id: 'user_1',
    nickname: '日语爱好者',
    avatar: '🌸',
    location: '北京',
    locationCode: 'BJ',
    interests: ['日语学习', '动漫', '日本文化', '旅行'],
    learningLanguages: ['ja', 'en'],
    level: 12,
    xp: 8500,
    streak: 15,
    privacy: {
      allowDiscover: true,
      showLocation: true,
      showInterests: true,
    },
    bio: '正在学习日语N2，喜欢看动漫和日剧，希望能找到学习伙伴一起进步！'
  },
  {
    id: 'user_2',
    nickname: '英语学霸',
    avatar: '📚',
    location: '上海',
    locationCode: 'SH',
    interests: ['英语学习', '商务英语', '电影', '阅读'],
    learningLanguages: ['en', 'ja'],
    level: 18,
    xp: 15200,
    streak: 28,
    privacy: {
      allowDiscover: true,
      showLocation: true,
      showInterests: true,
    },
    bio: '英语专业毕业，目前在做外贸工作，希望能提升日语能力开拓日本市场'
  },
  {
    id: 'user_3',
    nickname: '韩语小达人',
    avatar: '💖',
    location: '广州',
    locationCode: 'GZ',
    interests: ['K-pop', '韩剧', '韩语学习', '美妆'],
    learningLanguages: ['ko', 'en'],
    level: 10,
    xp: 6800,
    streak: 12,
    privacy: {
      allowDiscover: true,
      showLocation: true,
      showInterests: true,
    },
    bio: 'K-pop爱好者，正在学习韩语，目标是明年去韩国旅行！'
  },
  {
    id: 'user_4',
    nickname: '法语初学者',
    avatar: '🇫🇷',
    location: '深圳',
    locationCode: 'SZ',
    interests: ['法国文化', '红酒', '旅行', '美食'],
    learningLanguages: ['fr', 'en'],
    level: 5,
    xp: 2300,
    streak: 5,
    privacy: {
      allowDiscover: true,
      showLocation: false,
      showInterests: true,
    },
    bio: '计划去法国留学，正在努力学习法语中！'
  },
  {
    id: 'user_5',
    nickname: '德语学习者',
    avatar: '🇩🇪',
    location: '成都',
    locationCode: 'CD',
    interests: ['德国足球', '哲学', '啤酒', '汽车'],
    learningLanguages: ['de', 'en'],
    level: 8,
    xp: 4500,
    streak: 8,
    privacy: {
      allowDiscover: true,
      showLocation: true,
      showInterests: true,
    },
    bio: '拜仁球迷，正在学习德语，希望有一天能去安联球场看球！'
  },
  {
    id: 'user_6',
    nickname: '西语爱好者',
    avatar: '🌶️',
    location: '杭州',
    locationCode: 'HZ',
    interests: ['西班牙美食', '弗拉明戈', '足球', '旅行'],
    learningLanguages: ['es', 'en'],
    level: 7,
    xp: 3800,
    streak: 7,
    privacy: {
      allowDiscover: true,
      showLocation: true,
      showInterests: false,
    },
    bio: '喜欢西班牙文化，正在学习西班牙语，想去巴塞罗那！'
  },
  {
    id: 'user_7',
    nickname: '意大利迷',
    avatar: '🍕',
    location: '南京',
    locationCode: 'NJ',
    interests: ['意大利美食', '歌剧', '艺术', '咖啡'],
    learningLanguages: ['it', 'en'],
    level: 6,
    xp: 3200,
    streak: 6,
    privacy: {
      allowDiscover: false,
      showLocation: false,
      showInterests: true,
    },
    bio: '意大利美食爱好者，正在学习意大利语'
  },
  {
    id: 'user_8',
    nickname: '葡语学习者',
    avatar: '🍷',
    location: '武汉',
    locationCode: 'WH',
    interests: ['巴西文化', '足球', '桑巴', '咖啡'],
    learningLanguages: ['pt', 'en'],
    level: 4,
    xp: 1800,
    streak: 3,
    privacy: {
      allowDiscover: true,
      showLocation: true,
      showInterests: true,
    },
    bio: '喜欢巴西文化，正在学习葡萄牙语'
  },
  {
    id: 'user_9',
    nickname: '阿语初学者',
    avatar: '🏜️',
    location: '西安',
    locationCode: 'XA',
    interests: ['中东文化', '历史', '旅行', '美食'],
    learningLanguages: ['ar', 'en'],
    level: 3,
    xp: 1200,
    streak: 2,
    privacy: {
      allowDiscover: true,
      showLocation: false,
      showInterests: false,
    },
    bio: '对中东文化感兴趣，正在学习阿拉伯语'
  },
  {
    id: 'user_10',
    nickname: '中文老师',
    avatar: '🇨🇳',
    location: '重庆',
    locationCode: 'CQ',
    interests: ['中国文化', '书法', '诗词', '茶道'],
    learningLanguages: ['zh', 'en', 'ja'],
    level: 20,
    xp: 20000,
    streak: 365,
    privacy: {
      allowDiscover: true,
      showLocation: true,
      showInterests: true,
    },
    bio: '对外汉语老师，正在学习日语和英语，希望能更好地和外国学生交流'
  },
  {
    id: 'user_11',
    nickname: '语言探险家',
    avatar: '🌍',
    location: '苏州',
    locationCode: 'SZ',
    interests: ['旅行', '摄影', '美食', '语言学习'],
    learningLanguages: ['ja', 'ko', 'en', 'fr'],
    level: 15,
    xp: 12000,
    streak: 20,
    privacy: {
      allowDiscover: true,
      showLocation: true,
      showInterests: true,
    },
    bio: '环球旅行者，正在学习多种语言，目标是走遍世界！'
  },
  {
    id: 'user_12',
    nickname: '游戏玩家',
    avatar: '🎮',
    location: '天津',
    locationCode: 'TJ',
    interests: ['游戏', '动漫', '日语学习', '电竞'],
    learningLanguages: ['ja', 'en'],
    level: 9,
    xp: 5100,
    streak: 10,
    privacy: {
      allowDiscover: true,
      showLocation: true,
      showInterests: true,
    },
    bio: '喜欢玩日系游戏，正在学习日语，希望能看懂原版游戏剧情！'
  },
];

export const mockFriendRequests: FriendRequest[] = [
  { id: 'req_1', fromId: 'user_2', toId: 'current_user', status: 'pending', createdAt: '2024-01-15T10:30:00Z' },
  { id: 'req_2', fromId: 'user_5', toId: 'current_user', status: 'pending', createdAt: '2024-01-15T09:15:00Z' },
  { id: 'req_3', fromId: 'current_user', toId: 'user_1', status: 'accepted', createdAt: '2024-01-14T14:20:00Z' },
];

export const interestTags = [
  '日语学习', '英语学习', '韩语学习', '法语学习', '西班牙语学习',
  '德语学习', '意大利语学习', '葡萄牙语学习', '阿拉伯语学习',
  '动漫', 'K-pop', '电影', '阅读', '旅行', '美食', '音乐',
  '商务英语', '考试备考', '留学准备', '职场英语', '翻译'
];

export const locationTags = [
  { code: 'BJ', name: '北京' },
  { code: 'SH', name: '上海' },
  { code: 'GZ', name: '广州' },
  { code: 'SZ', name: '深圳' },
  { code: 'CD', name: '成都' },
  { code: 'HZ', name: '杭州' },
  { code: 'NJ', name: '南京' },
  { code: 'WH', name: '武汉' },
  { code: 'XA', name: '西安' },
  { code: 'CQ', name: '重庆' },
  { code: 'TJ', name: '天津' },
  { code: 'SZ', name: '苏州' },
];

export const mockCloudStoragePlans = [
  { id: 'plan_1', name: '基础版', description: '适合个人学习使用', storageGB: 5, duration: 'monthly', price: 9.9 },
  { id: 'plan_2', name: '标准版', description: '适合学习达人', storageGB: 20, duration: 'monthly', price: 19.9 },
  { id: 'plan_3', name: '高级版', description: '适合专业学习者', storageGB: 100, duration: 'monthly', price: 49.9 },
  { id: 'plan_4', name: '基础版年付', description: '一年基础服务', storageGB: 5, duration: 'yearly', price: 99 },
  { id: 'plan_5', name: '标准版年付', description: '一年标准服务', storageGB: 20, duration: 'yearly', price: 199 },
  { id: 'plan_6', name: '高级版年付', description: '一年高级服务', storageGB: 100, duration: 'yearly', price: 499 },
  { id: 'plan_7', name: '季度基础', description: '三个月基础服务', storageGB: 5, duration: 'quarterly', price: 25 },
  { id: 'plan_8', name: '季度标准', description: '三个月标准服务', storageGB: 20, duration: 'quarterly', price: 49 },
];

export const mockKnowledgeBase = {
  hotItems: [
    { id: 'kb_1', title: '日语N2语法总结', views: 15600, likes: 890, category: 'grammar', quality: 'high' },
    { id: 'kb_2', title: '英语雅思写作模板', views: 12400, likes: 720, category: 'writing', quality: 'high' },
    { id: 'kb_3', title: '韩语TOPIK高频词汇', views: 9800, likes: 560, category: 'vocabulary', quality: 'high' },
    { id: 'kb_4', title: '法语动词变位表', views: 8500, likes: 480, category: 'grammar', quality: 'medium' },
    { id: 'kb_5', title: '商务英语邮件模板', views: 7200, likes: 410, category: 'business', quality: 'high' },
  ],
  coldItems: [
    { id: 'kb_6', title: '日语敬语详解', views: 2300, likes: 150, category: 'grammar', quality: 'medium' },
    { id: 'kb_7', title: '英语音标发音指南', views: 1800, likes: 120, category: 'pronunciation', quality: 'medium' },
    { id: 'kb_8', title: '韩语惯用表达', views: 1500, likes: 95, category: 'phrases', quality: 'low' },
  ],
};

export const mockMyNotes = [
  { id: 'note_1', title: '日语动词分类笔记', content: '自动词和他动词的区别...', createdAt: '2024-01-15T09:00:00Z', syncStatus: 'synced' },
  { id: 'note_2', title: '英语时态总结', content: '一般现在时、一般过去时...', createdAt: '2024-01-14T16:30:00Z', syncStatus: 'synced' },
  { id: 'note_3', title: '韩语TOPIK备考计划', content: '第一周：词汇背诵...', createdAt: '2024-01-13T10:00:00Z', syncStatus: 'local' },
];

export const mockCustomWordList = [
  { id: 'wl_1', name: '日语N2核心词汇', wordCount: 300, createdAt: '2024-01-10T08:00:00Z', syncStatus: 'synced' },
  { id: 'wl_2', name: '商务英语高频词', wordCount: 150, createdAt: '2024-01-08T14:00:00Z', syncStatus: 'synced' },
  { id: 'wl_3', name: '旅游常用韩语', wordCount: 80, createdAt: '2024-01-05T11:00:00Z', syncStatus: 'local' },
];