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
        { id: 'ja_9', word: 'はじめまして', meaning: '初次见面', phonetic: 'hajimemashite', example: 'はじめまして、よろしくお願いします' },
        { id: 'ja_10', word: '元気ですか', meaning: '你好吗', phonetic: 'genki desu ka', example: '元気ですか？元気です' },
      ]
    },
    {
      id: 'ja_lesson_2',
      title: '数字入门',
      description: '学习1-100的日语表达',
      words: [
        { id: 'ja_11', word: 'いち', meaning: '一', phonetic: 'ichi', example: 'いち、に、さん...' },
        { id: 'ja_12', word: 'に', meaning: '二', phonetic: 'ni', example: 'にほん - 日本' },
        { id: 'ja_13', word: 'さん', meaning: '三', phonetic: 'san', example: 'さんぽ - 散步' },
        { id: 'ja_14', word: 'よん', meaning: '四', phonetic: 'yon', example: 'よんか - 四号' },
        { id: 'ja_15', word: 'ご', meaning: '五', phonetic: 'go', example: 'ごご - 午后' },
        { id: 'ja_16', word: 'ろく', meaning: '六', phonetic: 'roku', example: 'ろくじ - 六点' },
        { id: 'ja_17', word: 'なな', meaning: '七', phonetic: 'nana', example: 'ななふん - 七分' },
        { id: 'ja_18', word: 'はち', meaning: '八', phonetic: 'hachi', example: 'はちじ - 八点' },
        { id: 'ja_19', word: 'きゅう', meaning: '九', phonetic: 'kyuu', example: 'きゅうがつ - 九月' },
        { id: 'ja_20', word: 'じゅう', meaning: '十', phonetic: 'juu', example: 'じゅうに - 十二' },
        { id: 'ja_21', word: 'ひゃく', meaning: '百', phonetic: 'hyaku', example: 'ひゃくえん - 一百日元' },
        { id: 'ja_22', word: 'せん', meaning: '千', phonetic: 'sen', example: 'せんえん - 一千日元' },
        { id: 'ja_23', word: 'いちまん', meaning: '一万', phonetic: 'ichi man', example: 'いちまんえん - 一万日元' },
      ]
    },
    {
      id: 'ja_lesson_3',
      title: '家庭成员',
      description: '学习家庭成员的称呼',
      words: [
        { id: 'ja_24', word: 'お父さん', meaning: '爸爸', phonetic: 'otousan', example: 'お父さんは仕事に行きました' },
        { id: 'ja_25', word: 'お母さん', meaning: '妈妈', phonetic: 'okaasan', example: 'お母さんは料理をしています' },
        { id: 'ja_26', word: '兄', meaning: '哥哥', phonetic: 'ani', example: '兄は大学生です' },
        { id: 'ja_27', word: '姉', meaning: '姐姐', phonetic: 'ane', example: '姉は教師です' },
        { id: 'ja_28', word: '弟', meaning: '弟弟', phonetic: 'otouto', example: '弟は中学生です' },
        { id: 'ja_29', word: '妹', meaning: '妹妹', phonetic: 'imouto', example: '妹は小学生です' },
        { id: 'ja_30', word: 'おじいさん', meaning: '爷爷', phonetic: 'ojiisan', example: 'おじいさんは元気です' },
        { id: 'ja_31', word: 'おばあさん', meaning: '奶奶', phonetic: 'obaasan', example: 'おばあさんは手芸が得意です' },
        { id: 'ja_32', word: '叔父さん', meaning: '叔叔', phonetic: 'ojisan', example: '叔父さんは医者です' },
        { id: 'ja_33', word: '叔母さん', meaning: '阿姨', phonetic: 'obasan', example: '叔母さんは看護師です' },
      ]
    },
    {
      id: 'ja_lesson_4',
      title: '日常物品',
      description: '学习日常生活中常见物品的日语表达',
      words: [
        { id: 'ja_34', word: '本', meaning: '书', phonetic: 'hon', example: 'この本は面白いです' },
        { id: 'ja_35', word: 'ペン', meaning: '笔', phonetic: 'pen', example: 'ペンを貸してください' },
        { id: 'ja_36', word: 'ノート', meaning: '笔记本', phonetic: 'nooto', example: 'ノートにメモを取ります' },
        { id: 'ja_37', word: '机', meaning: '桌子', phonetic: 'tsukue', example: '机の上に本があります' },
        { id: 'ja_38', word: '椅子', meaning: '椅子', phonetic: 'isu', example: '椅子に座ってください' },
        { id: 'ja_39', word: 'テレビ', meaning: '电视', phonetic: 'terebi', example: 'テレビを見ています' },
        { id: 'ja_40', word: '電話', meaning: '电话', phonetic: 'denwa', example: '電話をかけます' },
        { id: 'ja_41', word: '時計', meaning: '钟表', phonetic: 'tokei', example: '時計を見てください' },
        { id: 'ja_42', word: 'パソコン', meaning: '电脑', phonetic: 'pasokon', example: 'パソコンで仕事をします' },
        { id: 'ja_43', word: 'スマホ', meaning: '手机', phonetic: 'sumaho', example: 'スマホで写真を撮ります' },
      ]
    },
    {
      id: 'ja_lesson_5',
      title: '食物与饮料',
      description: '学习各种食物和饮料的日语表达',
      words: [
        { id: 'ja_44', word: 'ご飯', meaning: '米饭', phonetic: 'gohan', example: 'ご飯を食べます' },
        { id: 'ja_45', word: 'パン', meaning: '面包', phonetic: 'pan', example: 'パンを買いました' },
        { id: 'ja_46', word: '卵', meaning: '鸡蛋', phonetic: 'tamago', example: '卵を2個買いました' },
        { id: 'ja_47', word: '牛乳', meaning: '牛奶', phonetic: 'gyuunyuu', example: '牛乳を飲みます' },
        { id: 'ja_48', word: 'コーヒー', meaning: '咖啡', phonetic: 'koohii', example: 'コーヒーを飲みたい' },
        { id: 'ja_49', word: '紅茶', meaning: '红茶', phonetic: 'koucha', example: '紅茶を淹れます' },
        { id: 'ja_50', word: '水', meaning: '水', phonetic: 'mizu', example: '水を飲みます' },
        { id: 'ja_51', word: '寿司', meaning: '寿司', phonetic: 'sushi', example: '寿司を食べに行きます' },
        { id: 'ja_52', word: 'ラーメン', meaning: '拉面', phonetic: 'raamen', example: 'ラーメンを食べに行きます' },
        { id: 'ja_53', word: '天ぷら', meaning: '天妇罗', phonetic: 'tenpura', example: '天ぷらが好きです' },
      ]
    },
    {
      id: 'ja_lesson_6',
      title: '颜色',
      description: '学习各种颜色的日语表达',
      words: [
        { id: 'ja_54', word: '赤', meaning: '红色', phonetic: 'aka', example: '赤いりんご' },
        { id: 'ja_55', word: '青', meaning: '蓝色', phonetic: 'ao', example: '青い空' },
        { id: 'ja_56', word: '黄色', meaning: '黄色', phonetic: 'kiiro', example: '黄色いバナナ' },
        { id: 'ja_57', word: '緑', meaning: '绿色', phonetic: 'midori', example: '緑の葉' },
        { id: 'ja_58', word: '黒', meaning: '黑色', phonetic: 'kuro', example: '黒い服' },
        { id: 'ja_59', word: '白', meaning: '白色', phonetic: 'shiro', example: '白い紙' },
        { id: 'ja_60', word: 'ピンク', meaning: '粉色', phonetic: 'pinku', example: 'ピンクの花' },
        { id: 'ja_61', word: '紫', meaning: '紫色', phonetic: 'murasaki', example: '紫のゆり' },
        { id: 'ja_62', word: 'オレンジ', meaning: '橙色', phonetic: 'orenji', example: 'オレンジ色のミカン' },
        { id: 'ja_63', word: '茶色', meaning: '茶色', phonetic: 'chairo', example: '茶色の靴' },
      ]
    },
    {
      id: 'ja_lesson_7',
      title: '天气',
      description: '学习天气相关的日语表达',
      words: [
        { id: 'ja_64', word: '晴れ', meaning: '晴天', phonetic: 'hare', example: '今日は晴れです' },
        { id: 'ja_65', word: '曇り', meaning: '阴天', phonetic: 'kumor', example: '明日は曇りです' },
        { id: 'ja_66', word: '雨', meaning: '下雨', phonetic: 'ame', example: '雨が降っています' },
        { id: 'ja_67', word: '雪', meaning: '雪', phonetic: 'yuki', example: '雪が降りました' },
        { id: 'ja_68', word: '風', meaning: '风', phonetic: 'kaze', example: '風が強いです' },
        { id: 'ja_69', word: '曇時々雨', meaning: '阴时有雨', phonetic: 'kumoridokidoki ame', example: '午後は曇時々雨です' },
        { id: 'ja_70', word: '雷', meaning: '雷', phonetic: 'kaminari', example: '雷が鳴っています' },
        { id: 'ja_71', word: '虹', meaning: '彩虹', phonetic: 'niji', example: '雨上がりに虹が出ました' },
      ]
    },
    {
      id: 'ja_lesson_8',
      title: '时间表达',
      description: '学习时间相关的日语表达',
      words: [
        { id: 'ja_72', word: '朝', meaning: '早上', phonetic: 'asa', example: '朝ごはんを食べます' },
        { id: 'ja_73', word: '昼', meaning: '中午', phonetic: 'hiru', example: '昼ご飯を食べます' },
        { id: 'ja_74', word: '夕方', meaning: '傍晚', phonetic: 'yuugata', example: '夕方に散歩します' },
        { id: 'ja_75', word: '夜', meaning: '晚上', phonetic: 'yoru', example: '夜にテレビを見ます' },
        { id: 'ja_76', word: '今日', meaning: '今天', phonetic: 'kyou', example: '今日はいい天気です' },
        { id: 'ja_77', word: '明日', meaning: '明天', phonetic: 'ashita', example: '明日は雨です' },
        { id: 'ja_78', word: '昨日', meaning: '昨天', phonetic: 'kinou', example: '昨日はとても忙しかったです' },
        { id: 'ja_79', word: '先週', meaning: '上周', phonetic: 'senshuu', example: '先週は東京に行きました' },
        { id: 'ja_80', word: '来週', meaning: '下周', phonetic: 'raishuu', example: '来週は旅行に行きます' },
        { id: 'ja_81', word: '今月', meaning: '这个月', phonetic: 'kongetsu', example: '今月は忙しいです' },
      ]
    },
    {
      id: 'ja_lesson_9',
      title: '动词基础',
      description: '学习日语基础动词',
      words: [
        { id: 'ja_82', word: '食べる', meaning: '吃', phonetic: 'taberu', example: 'ご飯を食べます' },
        { id: 'ja_83', word: '飲む', meaning: '喝', phonetic: 'nomu', example: 'コーヒーを飲みます' },
        { id: 'ja_84', word: '行く', meaning: '去', phonetic: 'iku', example: '学校に行きます' },
        { id: 'ja_85', word: '来る', meaning: '来', phonetic: 'kuru', example: '明日来ます' },
        { id: 'ja_86', word: 'する', meaning: '做', phonetic: 'suru', example: '宿題をします' },
        { id: 'ja_87', word: '見る', meaning: '看', phonetic: 'miru', example: 'テレビを見ます' },
        { id: 'ja_88', word: '聞く', meaning: '听', phonetic: 'kiku', example: '音楽を聞きます' },
        { id: 'ja_89', word: '話す', meaning: '说', phonetic: 'hanasu', example: '日本語を話します' },
        { id: 'ja_90', word: '読む', meaning: '读', phonetic: 'yomu', example: '本を読みます' },
        { id: 'ja_91', word: '書く', meaning: '写', phonetic: 'kaku', example: '手紙を書きます' },
      ]
    },
    {
      id: 'ja_lesson_10',
      title: '旅行常用',
      description: '旅行时常用的日语表达',
      words: [
        { id: 'ja_92', word: 'ホテル', meaning: '酒店', phonetic: 'hoteru', example: 'ホテルに泊まります' },
        { id: 'ja_93', word: '駅', meaning: '车站', phonetic: 'eki', example: '駅に行きます' },
        { id: 'ja_94', word: 'バス', meaning: '公交车', phonetic: 'basu', example: 'バスに乗ります' },
        { id: 'ja_95', word: 'タクシー', meaning: '出租车', phonetic: 'takushii', example: 'タクシーで行きます' },
        { id: 'ja_96', word: 'レストラン', meaning: '餐厅', phonetic: 'resutoran', example: 'レストランで食事します' },
        { id: 'ja_97', word: '観光', meaning: '观光', phonetic: 'kankou', example: '東京観光をします' },
        { id: 'ja_98', word: '切符', meaning: '票', phonetic: 'kippu', example: '切符を買います' },
        { id: 'ja_99', word: '予約', meaning: '预约', phonetic: 'yoyaku', example: 'ホテルを予約します' },
        { id: 'ja_100', word: '案内', meaning: '指引', phonetic: 'annai', example: '案内をお願いします' },
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
        { id: 'en_9', word: 'How are you', meaning: '你好吗', phonetic: 'haʊ ɑːr ju', example: 'How are you today?' },
        { id: 'en_10', word: 'Nice to meet you', meaning: '很高兴认识你', phonetic: 'naɪs tu mit ju', example: 'Nice to meet you!' },
        { id: 'en_11', word: 'See you later', meaning: '回头见', phonetic: 'si ju ˈleɪtər', example: 'See you later!' },
        { id: 'en_12', word: 'Have a nice day', meaning: '祝你愉快', phonetic: 'hæv ə naɪs deɪ', example: 'Have a nice day!' },
      ]
    },
    {
      id: 'en_lesson_2',
      title: '常用动词',
      description: '学习最常用的英语动词',
      words: [
        { id: 'en_13', word: 'to be', meaning: '是', phonetic: 'tu bi', example: 'I am a student' },
        { id: 'en_14', word: 'to have', meaning: '有', phonetic: 'tu hæv', example: 'I have a book' },
        { id: 'en_15', word: 'to do', meaning: '做', phonetic: 'tu du', example: 'What do you do?' },
        { id: 'en_16', word: 'to go', meaning: '去', phonetic: 'tu goʊ', example: 'I go to school' },
        { id: 'en_17', word: 'to say', meaning: '说', phonetic: 'tu seɪ', example: 'What did he say?' },
        { id: 'en_18', word: 'to see', meaning: '看', phonetic: 'tu si', example: 'I see you' },
        { id: 'en_19', word: 'to eat', meaning: '吃', phonetic: 'tu iːt', example: 'I eat breakfast' },
        { id: 'en_20', word: 'to drink', meaning: '喝', phonetic: 'tu drɪŋk', example: 'I drink coffee' },
        { id: 'en_21', word: 'to learn', meaning: '学习', phonetic: 'tu lɜːrn', example: 'I want to learn English' },
        { id: 'en_22', word: 'to speak', meaning: '说', phonetic: 'tu spiːk', example: 'I speak English' },
        { id: 'en_23', word: 'to read', meaning: '读', phonetic: 'tu riːd', example: 'I read books every day' },
        { id: 'en_24', word: 'to write', meaning: '写', phonetic: 'tu raɪt', example: 'I write a letter' },
        { id: 'en_25', word: 'to work', meaning: '工作', phonetic: 'tu wɜːrk', example: 'I work in an office' },
        { id: 'en_26', word: 'to study', meaning: '学习', phonetic: 'tu ˈstʌdi', example: 'I study English' },
        { id: 'en_27', word: 'to play', meaning: '玩', phonetic: 'tu pleɪ', example: 'I play football' },
        { id: 'en_28', word: 'to watch', meaning: '观看', phonetic: 'tu wɑːtʃ', example: 'I watch TV' },
      ]
    },
    {
      id: 'en_lesson_3',
      title: '数字',
      description: '学习1-100的英语表达',
      words: [
        { id: 'en_29', word: 'one', meaning: '一', phonetic: 'wʌn', example: 'one apple' },
        { id: 'en_30', word: 'two', meaning: '二', phonetic: 'tu', example: 'two books' },
        { id: 'en_31', word: 'three', meaning: '三', phonetic: 'θri', example: 'three friends' },
        { id: 'en_32', word: 'four', meaning: '四', phonetic: 'fɔːr', example: 'four seasons' },
        { id: 'en_33', word: 'five', meaning: '五', phonetic: 'faɪv', example: 'five fingers' },
        { id: 'en_34', word: 'six', meaning: '六', phonetic: 'sɪks', example: 'six days' },
        { id: 'en_35', word: 'seven', meaning: '七', phonetic: 'ˈsevn', example: 'seven days a week' },
        { id: 'en_36', word: 'eight', meaning: '八', phonetic: 'eɪt', example: 'eight hours' },
        { id: 'en_37', word: 'nine', meaning: '九', phonetic: 'naɪn', example: 'nine oclock' },
        { id: 'en_38', word: 'ten', meaning: '十', phonetic: 'tɛn', example: 'ten years' },
        { id: 'en_39', word: 'eleven', meaning: '十一', phonetic: 'ɪˈlɛvn', example: 'eleven students' },
        { id: 'en_40', word: 'twelve', meaning: '十二', phonetic: 'twelv', example: 'twelve months' },
        { id: 'en_41', word: 'twenty', meaning: '二十', phonetic: 'ˈtwɛnti', example: 'twenty students' },
        { id: 'en_42', word: 'thirty', meaning: '三十', phonetic: 'ˈθɜːrti', example: 'thirty minutes' },
        { id: 'en_43', word: 'forty', meaning: '四十', phonetic: 'ˈfɔːrti', example: 'forty people' },
        { id: 'en_44', word: 'fifty', meaning: '五十', phonetic: 'ˈfɪfti', example: 'fifty dollars' },
        { id: 'en_45', word: 'hundred', meaning: '一百', phonetic: 'ˈhʌndrəd', example: 'one hundred' },
        { id: 'en_46', word: 'thousand', meaning: '一千', phonetic: 'ˈθaʊzənd', example: 'one thousand' },
      ]
    },
    {
      id: 'en_lesson_4',
      title: '家庭成员',
      description: '学习家庭成员的英语称呼',
      words: [
        { id: 'en_47', word: 'father', meaning: '父亲', phonetic: 'ˈfɑːðər', example: 'My father is a doctor' },
        { id: 'en_48', word: 'mother', meaning: '母亲', phonetic: 'ˈmʌðər', example: 'My mother is a teacher' },
        { id: 'en_49', word: 'brother', meaning: '兄弟', phonetic: 'ˈbrʌðər', example: 'I have one brother' },
        { id: 'en_50', word: 'sister', meaning: '姐妹', phonetic: 'ˈsɪstər', example: 'She has two sisters' },
        { id: 'en_51', word: 'son', meaning: '儿子', phonetic: 'sʌn', example: 'He has a son' },
        { id: 'en_52', word: 'daughter', meaning: '女儿', phonetic: 'ˈdɔːtər', example: 'She has a daughter' },
        { id: 'en_53', word: 'grandfather', meaning: '祖父', phonetic: 'ˈɡrændfɑːðər', example: 'My grandfather is retired' },
        { id: 'en_54', word: 'grandmother', meaning: '祖母', phonetic: 'ˈɡrændmʌðər', example: 'My grandmother bakes cookies' },
        { id: 'en_55', word: 'uncle', meaning: '叔叔', phonetic: 'ˈʌŋkl', example: 'My uncle lives in New York' },
        { id: 'en_56', word: 'aunt', meaning: '阿姨', phonetic: 'ænt', example: 'My aunt is a nurse' },
        { id: 'en_57', word: 'cousin', meaning: '堂兄弟姐妹', phonetic: 'ˈkʌzn', example: 'My cousin is coming' },
        { id: 'en_58', word: 'nephew', meaning: '侄子', phonetic: 'ˈnefjuː', example: 'My nephew is five' },
        { id: 'en_59', word: 'niece', meaning: '侄女', phonetic: 'niːs', example: 'My niece is cute' },
      ]
    },
    {
      id: 'en_lesson_5',
      title: '日常物品',
      description: '学习日常物品的英语表达',
      words: [
        { id: 'en_60', word: 'book', meaning: '书', phonetic: 'bʊk', example: 'I am reading a book' },
        { id: 'en_61', word: 'pen', meaning: '笔', phonetic: 'pɛn', example: 'Can I borrow your pen?' },
        { id: 'en_62', word: 'table', meaning: '桌子', phonetic: 'ˈteɪbl', example: 'The book is on the table' },
        { id: 'en_63', word: 'chair', meaning: '椅子', phonetic: 'tʃeər', example: 'Please sit on the chair' },
        { id: 'en_64', word: 'phone', meaning: '电话', phonetic: 'foʊn', example: 'I have a mobile phone' },
        { id: 'en_65', word: 'clock', meaning: '钟表', phonetic: 'klɑːk', example: 'The clock shows 3 oclock' },
        { id: 'en_66', word: 'coffee', meaning: '咖啡', phonetic: 'ˈkɔːfi', example: 'I drink coffee every morning' },
        { id: 'en_67', word: 'water', meaning: '水', phonetic: 'ˈwɔːtər', example: 'Please drink more water' },
        { id: 'en_68', word: 'computer', meaning: '电脑', phonetic: 'kəmˈpjuːtər', example: 'I work on my computer' },
        { id: 'en_69', word: 'laptop', meaning: '笔记本电脑', phonetic: 'ˈlæptɑːp', example: 'I have a laptop' },
        { id: 'en_70', word: 'keyboard', meaning: '键盘', phonetic: 'ˈkiːbɔːrd', example: 'This keyboard is nice' },
        { id: 'en_71', word: 'mouse', meaning: '鼠标', phonetic: 'maʊs', example: 'The mouse is wireless' },
      ]
    },
    {
      id: 'en_lesson_6',
      title: '食物',
      description: '学习食物相关的英语词汇',
      words: [
        { id: 'en_72', word: 'bread', meaning: '面包', phonetic: 'bred', example: 'I eat bread for breakfast' },
        { id: 'en_73', word: 'rice', meaning: '米饭', phonetic: 'raɪs', example: 'I like rice' },
        { id: 'en_74', word: 'egg', meaning: '鸡蛋', phonetic: 'eɡ', example: 'I had an egg for breakfast' },
        { id: 'en_75', word: 'milk', meaning: '牛奶', phonetic: 'mɪlk', example: 'I drink milk every day' },
        { id: 'en_76', word: 'cheese', meaning: '奶酪', phonetic: 'tʃiːz', example: 'I like cheese on pizza' },
        { id: 'en_77', word: 'wine', meaning: '酒', phonetic: 'waɪn', example: 'We drank wine at dinner' },
        { id: 'en_78', word: 'soup', meaning: '汤', phonetic: 'suːp', example: 'The soup is hot' },
        { id: 'en_79', word: 'salad', meaning: '沙拉', phonetic: 'ˈsæləd', example: 'I had a salad for lunch' },
        { id: 'en_80', word: 'meat', meaning: '肉', phonetic: 'miːt', example: 'I eat meat every day' },
        { id: 'en_81', word: 'fish', meaning: '鱼', phonetic: 'fɪʃ', example: 'I like fish' },
        { id: 'en_82', word: 'chicken', meaning: '鸡肉', phonetic: 'ˈtʃɪkɪn', example: 'I had chicken for dinner' },
        { id: 'en_83', word: 'vegetables', meaning: '蔬菜', phonetic: 'ˈvedʒtəblz', example: 'Eat more vegetables' },
        { id: 'en_84', word: 'fruit', meaning: '水果', phonetic: 'fruːt', example: 'I eat fruit every day' },
      ]
    },
    {
      id: 'en_lesson_7',
      title: '颜色',
      description: '学习各种颜色的英语表达',
      words: [
        { id: 'en_85', word: 'red', meaning: '红色', phonetic: 'rɛd', example: 'a red apple' },
        { id: 'en_86', word: 'blue', meaning: '蓝色', phonetic: 'bluː', example: 'a blue sky' },
        { id: 'en_87', word: 'green', meaning: '绿色', phonetic: 'ɡriːn', example: 'green leaves' },
        { id: 'en_88', word: 'yellow', meaning: '黄色', phonetic: 'ˈjeləʊ', example: 'a yellow banana' },
        { id: 'en_89', word: 'black', meaning: '黑色', phonetic: 'blæk', example: 'a black cat' },
        { id: 'en_90', word: 'white', meaning: '白色', phonetic: 'waɪt', example: 'white snow' },
        { id: 'en_91', word: 'pink', meaning: '粉色', phonetic: 'pɪŋk', example: 'a pink flower' },
        { id: 'en_92', word: 'purple', meaning: '紫色', phonetic: 'ˈpɜːrpl', example: 'a purple dress' },
        { id: 'en_93', word: 'orange', meaning: '橙色', phonetic: 'ˈɔːrɪndʒ', example: 'an orange' },
        { id: 'en_94', word: 'brown', meaning: '棕色', phonetic: 'braʊn', example: 'brown hair' },
      ]
    },
    {
      id: 'en_lesson_8',
      title: '时间',
      description: '学习时间相关的英语表达',
      words: [
        { id: 'en_95', word: 'morning', meaning: '早上', phonetic: 'ˈmɔːrnɪŋ', example: 'Good morning' },
        { id: 'en_96', word: 'afternoon', meaning: '下午', phonetic: 'ˌɑːftərˈnuːn', example: 'Good afternoon' },
        { id: 'en_97', word: 'evening', meaning: '傍晚', phonetic: 'ˈiːvnɪŋ', example: 'Good evening' },
        { id: 'en_98', word: 'night', meaning: '晚上', phonetic: 'naɪt', example: 'Good night' },
        { id: 'en_99', word: 'today', meaning: '今天', phonetic: 'təˈdeɪ', example: 'Today is Monday' },
        { id: 'en_100', word: 'yesterday', meaning: '昨天', phonetic: 'ˈjestərdeɪ', example: 'I was busy yesterday' },
        { id: 'en_101', word: 'tomorrow', meaning: '明天', phonetic: 'təˈmɑːroʊ', example: 'Tomorrow is Sunday' },
        { id: 'en_102', word: 'week', meaning: '周', phonetic: 'wiːk', example: 'next week' },
        { id: 'en_103', word: 'month', meaning: '月', phonetic: 'mʌnθ', example: 'last month' },
        { id: 'en_104', word: 'year', meaning: '年', phonetic: 'jɪr', example: 'this year' },
      ]
    },
    {
      id: 'en_lesson_9',
      title: '天气',
      description: '学习天气相关的英语表达',
      words: [
        { id: 'en_105', word: 'sunny', meaning: '晴天', phonetic: 'ˈsʌni', example: 'It is sunny today' },
        { id: 'en_106', word: 'cloudy', meaning: '阴天', phonetic: 'ˈklaʊdi', example: 'It is cloudy' },
        { id: 'en_107', word: 'rainy', meaning: '下雨', phonetic: 'ˈreɪni', example: 'It is rainy today' },
        { id: 'en_108', word: 'snowy', meaning: '下雪', phonetic: 'ˈsnoʊi', example: 'It is snowy outside' },
        { id: 'en_109', word: 'windy', meaning: '刮风', phonetic: 'ˈwɪndi', example: 'It is windy today' },
        { id: 'en_110', word: 'hot', meaning: '热', phonetic: 'hɑːt', example: 'It is hot today' },
        { id: 'en_111', word: 'cold', meaning: '冷', phonetic: 'koʊld', example: 'It is cold outside' },
        { id: 'en_112', word: 'warm', meaning: '温暖', phonetic: 'wɔːrm', example: 'The weather is warm' },
        { id: 'en_113', word: 'cool', meaning: '凉爽', phonetic: 'kuːl', example: 'It is cool in autumn' },
        { id: 'en_114', word: 'weather', meaning: '天气', phonetic: 'ˈweðər', example: 'What is the weather like?' },
      ]
    },
    {
      id: 'en_lesson_10',
      title: '旅行',
      description: '旅行常用英语词汇',
      words: [
        { id: 'en_115', word: 'hotel', meaning: '酒店', phonetic: 'hoʊˈtel', example: 'I stayed at a hotel' },
        { id: 'en_116', word: 'airport', meaning: '机场', phonetic: 'ˈeərpɔːrt', example: 'I go to the airport' },
        { id: 'en_117', word: 'station', meaning: '车站', phonetic: 'ˈsteɪʃn', example: 'train station' },
        { id: 'en_118', word: 'bus', meaning: '公交车', phonetic: 'bʌs', example: 'Take the bus' },
        { id: 'en_119', word: 'taxi', meaning: '出租车', phonetic: 'ˈtæksi', example: 'Take a taxi' },
        { id: 'en_120', word: 'restaurant', meaning: '餐厅', phonetic: 'ˈrestrɑːnt', example: 'Let us eat at a restaurant' },
        { id: 'en_121', word: 'ticket', meaning: '票', phonetic: 'ˈtɪkɪt', example: 'Buy a ticket' },
        { id: 'en_122', word: 'reservation', meaning: '预约', phonetic: 'ˌrezərˈveɪʃn', example: 'Make a reservation' },
        { id: 'en_123', word: 'tourist', meaning: '游客', phonetic: 'ˈtʊrɪst', example: 'I am a tourist' },
        { id: 'en_124', word: 'sightseeing', meaning: '观光', phonetic: 'ˈsaɪtsiːɪŋ', example: 'Go sightseeing' },
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
        { id: 'ko_9', word: '안녕', meaning: '你好/再见', phonetic: 'an-nyeong', example: '친구에게 안녕이라고 말했어요' },
        { id: 'ko_10', word: '잘가', meaning: '再见', phonetic: 'jal-ga', example: '잘가, 다음에 봐' },
        { id: 'ko_11', word: '반갑습니다', meaning: '很高兴', phonetic: 'ban-gap-seum-ni-da', example: '반갑습니다, 처음 뵙겠습니다' },
        { id: 'ko_12', word: '잘 부탁드립니다', meaning: '请多关照', phonetic: 'jal bu-tak-deu-rim-ni-da', example: '잘 부탁드립니다' },
      ]
    },
    {
      id: 'ko_lesson_2',
      title: '数字',
      description: '学习1-100的韩语表达',
      words: [
        { id: 'ko_13', word: '하나', meaning: '一', phonetic: 'ha-na', example: '하나, 둘, 셋...' },
        { id: 'ko_14', word: '둘', meaning: '二', phonetic: 'dul', example: '둘째 아들' },
        { id: 'ko_15', word: '셋', meaning: '三', phonetic: 'set', example: '셋 명의 친구' },
        { id: 'ko_16', word: '넷', meaning: '四', phonetic: 'net', example: '넷 명이 왔어요' },
        { id: 'ko_17', word: '다섯', meaning: '五', phonetic: 'da-seot', example: '다섯 시' },
        { id: 'ko_18', word: '여섯', meaning: '六', phonetic: 'yeo-seot', example: '여섯 명' },
        { id: 'ko_19', word: '일곱', meaning: '七', phonetic: 'il-gop', example: '일곱 살' },
        { id: 'ko_20', word: '여덟', meaning: '八', phonetic: 'yeo-deol', example: '여덟 권의 책' },
        { id: 'ko_21', word: '아홉', meaning: '九', phonetic: 'a-hop', example: '아홉 명이 왔어요' },
        { id: 'ko_22', word: '열', meaning: '十', phonetic: 'yeol', example: '열 살' },
        { id: 'ko_23', word: '스물', meaning: '二十', phonetic: 'seu-mul', example: '스물 명' },
        { id: 'ko_24', word: '서른', meaning: '三十', phonetic: 'seo-reun', example: '서른 살' },
        { id: 'ko_25', word: '마흔', meaning: '四十', phonetic: 'ma-heun', example: '마흔 명' },
        { id: 'ko_26', word: '쉰', meaning: '五十', phonetic: 'swin', example: '쉰 살' },
        { id: 'ko_27', word: '열여섯', meaning: '十六', phonetic: 'yeol-yeo-seot', example: '열여섯 살' },
        { id: 'ko_28', word: '백', meaning: '百', phonetic: 'baek', example: '백 명' },
      ]
    },
    {
      id: 'ko_lesson_3',
      title: '日常物品',
      description: '学习日常生活物品的韩语表达',
      words: [
        { id: 'ko_29', word: '책', meaning: '书', phonetic: 'chaek', example: '책을 읽어요' },
        { id: 'ko_30', word: '펜', meaning: '笔', phonetic: 'pen', example: '펜을 써요' },
        { id: 'ko_31', word: '책상', meaning: '桌子', phonetic: 'chaek-sang', example: '책상에 앉아요' },
        { id: 'ko_32', word: '의자', meaning: '椅子', phonetic: 'ui-ja', example: '의자에 앉아요' },
        { id: 'ko_33', word: '전화', meaning: '电话', phonetic: 'jeon-hwa', example: '전화를 걸어요' },
        { id: 'ko_34', word: '시계', meaning: '钟表', phonetic: 'si-gye', example: '시계를 봐요' },
        { id: 'ko_35', word: '커피', meaning: '咖啡', phonetic: 'keo-pi', example: '커피를 마셔요' },
        { id: 'ko_36', word: '물', meaning: '水', phonetic: 'mul', example: '물을 마셔요' },
        { id: 'ko_37', word: '컴퓨터', meaning: '电脑', phonetic: 'keom-pyu-teo', example: '컴퓨터로 일해요' },
        { id: 'ko_38', word: '스마트폰', meaning: '手机', phonetic: 'seu-ma-teu-pon', example: '스마트폰을 켜요' },
      ]
    },
    {
      id: 'ko_lesson_4',
      title: '家庭成员',
      description: '学习家庭成员的韩语称呼',
      words: [
        { id: 'ko_39', word: '아버지', meaning: '爸爸', phonetic: 'a-beo-ji', example: '아버지가 일하세요' },
        { id: 'ko_40', word: '어머니', meaning: '妈妈', phonetic: 'eo-meo-ni', example: '어머니가 요리해요' },
        { id: 'ko_41', word: '오빠', meaning: '哥哥(女称呼)', phonetic: 'o-ppa', example: '오빠, 같이 가요' },
        { id: 'ko_42', word: '언니', meaning: '姐姐(女称呼)', phonetic: 'eon-ni', example: '언니와 쇼핑해요' },
        { id: 'ko_43', word: '형', meaning: '哥哥(男称呼)', phonetic: 'hyeong', example: '형과 놀아요' },
        { id: 'ko_44', word: '누나', meaning: '姐姐(男称呼)', phonetic: 'nu-na', example: '누나가 좋아해요' },
        { id: 'ko_45', word: '동생', meaning: '弟弟/妹妹', phonetic: 'dong-saeng', example: '동생이 공부해요' },
        { id: 'ko_46', word: '할아버지', meaning: '爷爷', phonetic: 'hal-a-beo-ji', example: '할아버지가 산책해요' },
        { id: 'ko_47', word: '할머니', meaning: '奶奶', phonetic: 'hal-meo-ni', example: '할머니가 요리해요' },
        { id: 'ko_48', word: '삼촌', meaning: '叔叔', phonetic: 'sam-chon', example: '삼촌이 왔어요' },
        { id: 'ko_49', word: '이모', meaning: '阿姨', phonetic: 'i-mo', example: '이모가 왔어요' },
      ]
    },
    {
      id: 'ko_lesson_5',
      title: '食物',
      description: '学习食物相关的韩语词汇',
      words: [
        { id: 'ko_50', word: '밥', meaning: '米饭', phonetic: 'bap', example: '밥을 먹어요' },
        { id: 'ko_51', word: '빵', meaning: '面包', phonetic: 'ppang', example: '빵을 샀어요' },
        { id: 'ko_52', word: '계란', meaning: '鸡蛋', phonetic: 'gye-ran', example: '계란을 삶아요' },
        { id: 'ko_53', word: '우유', meaning: '牛奶', phonetic: 'u-yu', example: '우유를 마셔요' },
        { id: 'ko_54', word: '치즈', meaning: '奶酪', phonetic: 'chi-jeu', example: '치즈 피자를 좋아해요' },
        { id: 'ko_55', word: '술', meaning: '酒', phonetic: 'sul', example: '술을 마셨어요' },
        { id: 'ko_56', word: '국', meaning: '汤', phonetic: 'guk', example: '국을 마셔요' },
        { id: 'ko_57', word: '샐러드', meaning: '沙拉', phonetic: 'sael-leo-deu', example: '샐러드를 먹어요' },
        { id: 'ko_58', word: '고기', meaning: '肉', phonetic: 'go-gi', example: '고기를 구워요' },
        { id: 'ko_59', word: '생선', meaning: '鱼', phonetic: 'saeng-seon', example: '생선을 구워요' },
      ]
    },
    {
      id: 'ko_lesson_6',
      title: '颜色',
      description: '学习各种颜色的韩语表达',
      words: [
        { id: 'ko_60', word: '빨강', meaning: '红色', phonetic: 'ppal-gang', example: '빨간 사과' },
        { id: 'ko_61', word: '파랑', meaning: '蓝色', phonetic: 'pa-rang', example: '파란 하늘' },
        { id: 'ko_62', word: '노랑', meaning: '黄色', phonetic: 'no-rang', example: '노란 바나나' },
        { id: 'ko_63', word: '초록', meaning: '绿色', phonetic: 'cho-rok', example: '초록 잎' },
        { id: 'ko_64', word: '검정', meaning: '黑色', phonetic: 'geom-jeong', example: '검은 옷' },
        { id: 'ko_65', word: '하양', meaning: '白色', phonetic: 'ha-yang', example: '하얀 종이' },
        { id: 'ko_66', word: '분홍', meaning: '粉色', phonetic: 'bun-hong', example: '분홍 꽃' },
        { id: 'ko_67', word: '보라', meaning: '紫色', phonetic: 'bo-ra', example: '보라색 장미' },
      ]
    },
    {
      id: 'ko_lesson_7',
      title: '天气',
      description: '学习天气相关的韩语表达',
      words: [
        { id: 'ko_68', word: '맑음', meaning: '晴天', phonetic: 'mal-geum', example: '오늘 날씨 맑음' },
        { id: 'ko_69', word: '흐림', meaning: '阴天', phonetic: 'heu-rim', example: '내일 흐림' },
        { id: 'ko_70', word: '비', meaning: '雨', phonetic: 'bi', example: '비가 와요' },
        { id: 'ko_71', word: '눈', meaning: '雪', phonetic: 'nun', example: '눈이 왔어요' },
        { id: 'ko_72', word: '바람', meaning: '风', phonetic: 'ba-ram', example: '바람이 세요' },
        { id: 'ko_73', word: '덥다', meaning: '热', phonetic: 'deop-da', example: '오늘 덥다' },
        { id: 'ko_74', word: '춥다', meaning: '冷', phonetic: 'chup-da', example: '밖이 춥다' },
        { id: 'ko_75', word: '따뜻하다', meaning: '温暖', phonetic: 'tta-tteut-ha-da', example: '날씨 따뜻하다' },
      ]
    },
    {
      id: 'ko_lesson_8',
      title: '时间',
      description: '学习时间相关的韩语表达',
      words: [
        { id: 'ko_76', word: '아침', meaning: '早上', phonetic: 'a-chim', example: '아침에 일어나요' },
        { id: 'ko_77', word: '점심', meaning: '中午', phonetic: 'jeom-sim', example: '점심을 먹어요' },
        { id: 'ko_78', word: '저녁', meaning: '晚上', phonetic: 'jeo-nyeok', example: '저녁에 산책해요' },
        { id: 'ko_79', word: '밤', meaning: '夜晚', phonetic: 'bam', example: '밤에 잠을 잡니다' },
        { id: 'ko_80', word: '오늘', meaning: '今天', phonetic: 'o-neul', example: '오늘 좋은 날' },
        { id: 'ko_81', word: '어제', meaning: '昨天', phonetic: 'eo-je', example: '어제 바빴어요' },
        { id: 'ko_82', word: '내일', meaning: '明天', phonetic: 'nae-il', example: '내일 비가 와요' },
        { id: 'ko_83', word: '주', meaning: '周', phonetic: 'ju', example: '다음 주' },
        { id: 'ko_84', word: '달', meaning: '月', phonetic: 'dal', example: '지난 달' },
        { id: 'ko_85', word: '년', meaning: '年', phonetic: 'nyeon', example: '올해' },
      ]
    },
    {
      id: 'ko_lesson_9',
      title: '动词',
      description: '学习基础韩语动词',
      words: [
        { id: 'ko_86', word: '먹다', meaning: '吃', phonetic: 'meok-da', example: '밥을 먹어요' },
        { id: 'ko_87', word: '마시다', meaning: '喝', phonetic: 'ma-si-da', example: '물을 마셔요' },
        { id: 'ko_88', word: '가다', meaning: '去', phonetic: 'ga-da', example: '학교에 가요' },
        { id: 'ko_89', word: '오다', meaning: '来', phonetic: 'o-da', example: '내일 와요' },
        { id: 'ko_90', word: '보다', meaning: '看', phonetic: 'bo-da', example: 'TV를 봐요' },
        { id: 'ko_91', word: '듣다', meaning: '听', phonetic: 'deut-da', example: '음악을 들어요' },
        { id: 'ko_92', word: '말하다', meaning: '说', phonetic: 'mal-ha-da', example: '한국말을 해요' },
        { id: 'ko_93', word: '읽다', meaning: '读', phonetic: 'il-da', example: '책을 읽어요' },
        { id: 'ko_94', word: '쓰다', meaning: '写', phonetic: 'sseu-da', example: '편지를 써요' },
        { id: 'ko_95', word: '일하다', meaning: '工作', phonetic: 'il-ha-da', example: '회사에서 일해요' },
      ]
    },
    {
      id: 'ko_lesson_10',
      title: '旅行',
      description: '旅行常用韩语词汇',
      words: [
        { id: 'ko_96', word: '호텔', meaning: '酒店', phonetic: 'ho-tel', example: '호텔에 묵어요' },
        { id: 'ko_97', word: '공항', meaning: '机场', phonetic: 'gong-hang', example: '공항에 가요' },
        { id: 'ko_98', word: '역', meaning: '车站', phonetic: 'yeok', example: '기차역' },
        { id: 'ko_99', word: '버스', meaning: '公交车', phonetic: 'beo-seu', example: '버스에 타요' },
        { id: 'ko_100', word: '택시', meaning: '出租车', phonetic: 'taek-si', example: '택시를 타요' },
        { id: 'ko_101', word: '식당', meaning: '餐厅', phonetic: 'sig-dang', example: '식당에서 밥을 먹어요' },
        { id: 'ko_102', word: '티켓', meaning: '票', phonetic: 'ti-ket', example: '티켓을 샀어요' },
        { id: 'ko_103', word: '예약', meaning: '预约', phonetic: 'ye-yak', example: '호텔을 예약했어요' },
        { id: 'ko_104', word: '관광', meaning: '观光', phonetic: 'gwan-gwang', example: '서울 관광을 해요' },
        { id: 'ko_105', word: '안내', meaning: '指引', phonetic: 'an-nae', example: '안내를 해 주세요' },
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
        { id: 'fr_6', word: 'S il vous plaît', meaning: '请', phonetic: 'si lu plɛ', example: 'S il vous plaît, donnez-moi...' },
        { id: 'fr_7', word: 'Excusez-moi', meaning: '打扰一下', phonetic: 'ɛkskyze mwa', example: 'Excusez-moi, où est la toilette?' },
        { id: 'fr_8', word: 'De rien', meaning: '不客气', phonetic: 'də ʁjɛ̃', example: 'De rien, ça fait plaisir' },
        { id: 'fr_9', word: 'Comment ça va', meaning: '你好吗', phonetic: 'kɔmɑ̃ sa va', example: 'Comment ça va?' },
        { id: 'fr_10', word: 'Ça va', meaning: '我很好', phonetic: 'sa va', example: 'Ça va, merci' },
        { id: 'fr_11', word: 'Enchanté', meaning: '很高兴认识你', phonetic: 'ɑ̃ʃɑ̃te', example: 'Enchanté, je suis Paul' },
        { id: 'fr_12', word: 'Au revoir', meaning: '再见', phonetic: 'o ʁəvwaʁ', example: 'Au revoir, à bientôt' },
      ]
    },
    {
      id: 'fr_lesson_2',
      title: '数字',
      description: '学习1-100的法语表达',
      words: [
        { id: 'fr_13', word: 'un', meaning: '一', phonetic: 'œ̃', example: 'un chat' },
        { id: 'fr_14', word: 'deux', meaning: '二', phonetic: 'dø', example: 'deux amis' },
        { id: 'fr_15', word: 'trois', meaning: '三', phonetic: 'tʁwa', example: 'trois jours' },
        { id: 'fr_16', word: 'quatre', meaning: '四', phonetic: 'katʁ', example: 'quatre saisons' },
        { id: 'fr_17', word: 'cinq', meaning: '五', phonetic: 'sɛ̃k', example: 'cinq minutes' },
        { id: 'fr_18', word: 'six', meaning: '六', phonetic: 'sis', example: 'six personnes' },
        { id: 'fr_19', word: 'sept', meaning: '七', phonetic: 'sɛt', example: 'sept jours' },
        { id: 'fr_20', word: 'huit', meaning: '八', phonetic: 'ɥit', example: 'huit heures' },
        { id: 'fr_21', word: 'neuf', meaning: '九', phonetic: 'nœf', example: 'neuf enfants' },
        { id: 'fr_22', word: 'dix', meaning: '十', phonetic: 'dis', example: 'dix ans' },
        { id: 'fr_23', word: 'onze', meaning: '十一', phonetic: 'ɔ̃z', example: 'onze heures' },
        { id: 'fr_24', word: 'douze', meaning: '十二', phonetic: 'duz', example: 'douze mois' },
        { id: 'fr_25', word: 'vingt', meaning: '二十', phonetic: 'vɛ̃', example: 'vingt ans' },
        { id: 'fr_26', word: 'trente', meaning: '三十', phonetic: 'tʁɑ̃t', example: 'trente minutes' },
        { id: 'fr_27', word: 'quarante', meaning: '四十', phonetic: 'kaʁɑ̃t', example: 'quarante personnes' },
        { id: 'fr_28', word: 'cinquante', meaning: '五十', phonetic: 'sɛ̃kɑ̃t', example: 'cinquante euros' },
        { id: 'fr_29', word: 'cent', meaning: '一百', phonetic: 'sɑ̃', example: 'cent euros' },
        { id: 'fr_30', word: 'mille', meaning: '一千', phonetic: 'mil', example: 'mille euros' },
      ]
    },
    {
      id: 'fr_lesson_3',
      title: '日常物品',
      description: '学习日常生活物品的法语表达',
      words: [
        { id: 'fr_31', word: 'livre', meaning: '书', phonetic: 'livʁ', example: 'un bon livre' },
        { id: 'fr_32', word: 'stylo', meaning: '笔', phonetic: 'stilɔ', example: 'un stylo bleu' },
        { id: 'fr_33', word: 'table', meaning: '桌子', phonetic: 'tabl', example: 'une table en bois' },
        { id: 'fr_34', word: 'chaise', meaning: '椅子', phonetic: 'ʃɛz', example: 'une chaise confortable' },
        { id: 'fr_35', word: 'téléphone', meaning: '电话', phonetic: 'telefɔn', example: 'un téléphone portable' },
        { id: 'fr_36', word: 'horloge', meaning: '钟表', phonetic: 'ɔʁlɔʒ', example: 'une horloge murale' },
        { id: 'fr_37', word: 'café', meaning: '咖啡', phonetic: 'kafe', example: 'un café noir' },
        { id: 'fr_38', word: 'eau', meaning: '水', phonetic: 'o', example: 'de l eau fraîche' },
        { id: 'fr_39', word: 'ordinateur', meaning: '电脑', phonetic: 'ɔʁdinatœʁ', example: 'un ordinateur portable' },
        { id: 'fr_40', word: 'souris', meaning: '鼠标', phonetic: 'suʁi', example: 'une souris sans fil' },
      ]
    },
    {
      id: 'fr_lesson_4',
      title: '家庭成员',
      description: '学习家庭成员的法语称呼',
      words: [
        { id: 'fr_41', word: 'père', meaning: '父亲', phonetic: 'pɛʁ', example: 'Mon père est médecin' },
        { id: 'fr_42', word: 'mère', meaning: '母亲', phonetic: 'mɛʁ', example: 'Ma mère est professeure' },
        { id: 'fr_43', word: 'frère', meaning: '兄弟', phonetic: 'fʁɛʁ', example: 'J ai un frère' },
        { id: 'fr_44', word: 'sœur', meaning: '姐妹', phonetic: 'sœʁ', example: 'Elle a deux sœurs' },
        { id: 'fr_45', word: 'fils', meaning: '儿子', phonetic: 'fis', example: 'Il a un fils' },
        { id: 'fr_46', word: 'fille', meaning: '女儿', phonetic: 'fij', example: 'Elle a une fille' },
        { id: 'fr_47', word: 'grand-père', meaning: '祖父', phonetic: 'ɡʁɑ̃ pɛʁ', example: 'Mon grand-père est retraité' },
        { id: 'fr_48', word: 'grand-mère', meaning: '祖母', phonetic: 'ɡʁɑ̃ mɛʁ', example: 'Ma grand-mère cuisine bien' },
        { id: 'fr_49', word: 'oncle', meaning: '叔叔', phonetic: 'ɔ̃kl', example: 'Mon oncle habite à Paris' },
        { id: 'fr_50', word: 'tante', meaning: '阿姨', phonetic: 'tɑ̃t', example: 'Ma tante est infirmière' },
      ]
    },
    {
      id: 'fr_lesson_5',
      title: '食物',
      description: '学习食物相关的法语词汇',
      words: [
        { id: 'fr_51', word: 'pain', meaning: '面包', phonetic: 'pɛ̃', example: 'du pain frais' },
        { id: 'fr_52', word: 'riz', meaning: '米饭', phonetic: 'ʁi', example: 'du riz blanc' },
        { id: 'fr_53', word: 'oeuf', meaning: '鸡蛋', phonetic: 'œf', example: 'un oeuf frit' },
        { id: 'fr_54', word: 'lait', meaning: '牛奶', phonetic: 'lɛ', example: 'du lait frais' },
        { id: 'fr_55', word: 'fromage', meaning: '奶酪', phonetic: 'fʁɔmaʒ', example: 'un bon fromage' },
        { id: 'fr_56', word: 'vin', meaning: '酒', phonetic: 'vɛ̃', example: 'du vin rouge' },
        { id: 'fr_57', word: 'soupe', meaning: '汤', phonetic: 'sup', example: 'une soupe chaude' },
        { id: 'fr_58', word: 'salade', meaning: '沙拉', phonetic: 'salad', example: 'une salade verte' },
        { id: 'fr_59', word: 'viande', meaning: '肉', phonetic: 'vjɑ̃d', example: 'de la viande rouge' },
        { id: 'fr_60', word: 'poisson', meaning: '鱼', phonetic: 'pwasɔ̃', example: 'du poisson frais' },
        { id: 'fr_61', word: 'poulet', meaning: '鸡肉', phonetic: 'pulɛ', example: 'du poulet rôti' },
        { id: 'fr_62', word: 'légumes', meaning: '蔬菜', phonetic: 'leɡym', example: 'des légumes frais' },
        { id: 'fr_63', word: 'fruits', meaning: '水果', phonetic: 'fʁɥi', example: 'des fruits de saison' },
      ]
    },
    {
      id: 'fr_lesson_6',
      title: '颜色',
      description: '学习各种颜色的法语表达',
      words: [
        { id: 'fr_64', word: 'rouge', meaning: '红色', phonetic: 'ʁuʒ', example: 'une pomme rouge' },
        { id: 'fr_65', word: 'bleu', meaning: '蓝色', phonetic: 'blø', example: 'le ciel bleu' },
        { id: 'fr_66', word: 'vert', meaning: '绿色', phonetic: 'vɛʁ', example: 'les feuilles vertes' },
        { id: 'fr_67', word: 'jaune', meaning: '黄色', phonetic: 'ʒon', example: 'une banane jaune' },
        { id: 'fr_68', word: 'noir', meaning: '黑色', phonetic: 'nwaʁ', example: 'un chat noir' },
        { id: 'fr_69', word: 'blanc', meaning: '白色', phonetic: 'blɑ̃', example: 'la neige blanche' },
        { id: 'fr_70', word: 'rose', meaning: '粉色', phonetic: 'ʁoz', example: 'une fleur rose' },
        { id: 'fr_71', word: 'violet', meaning: '紫色', phonetic: 'vjɔlɛ', example: 'une robe violette' },
        { id: 'fr_72', word: 'orange', meaning: '橙色', phonetic: 'ɔʁɑ̃ʒ', example: 'une orange' },
        { id: 'fr_73', word: 'marron', meaning: '棕色', phonetic: 'maʁɔ̃', example: 'cheveux marrons' },
      ]
    },
    {
      id: 'fr_lesson_7',
      title: '天气',
      description: '学习天气相关的法语表达',
      words: [
        { id: 'fr_74', word: 'ensoleillé', meaning: '晴天', phonetic: 'ɑ̃sɔlɛje', example: "Aujourd'hui c est ensoleillé" },
        { id: 'fr_75', word: 'nuageux', meaning: '阴天', phonetic: 'nɥaʒø', example: 'Demain sera nuageux' },
        { id: 'fr_76', word: 'pluvieux', meaning: '下雨', phonetic: 'plyvjø', example: "Aujourd'hui c est pluvieux" },
        { id: 'fr_77', word: 'neigeux', meaning: '下雪', phonetic: 'nɛʒø', example: 'Il fait neigeux dehors' },
        { id: 'fr_78', word: 'venteux', meaning: '刮风', phonetic: 'vɑ̃tø', example: "Aujourd'hui c est venteux" },
        { id: 'fr_79', word: 'chaud', meaning: '热', phonetic: 'ʃo', example: "Aujourd'hui c est chaud" },
        { id: 'fr_80', word: 'froid', meaning: '冷', phonetic: 'fʁwa', example: 'Il fait froid dehors' },
        { id: 'fr_81', word: 'chaud', meaning: '温暖', phonetic: 'ʃo', example: 'Le temps est chaud' },
        { id: 'fr_82', word: 'frais', meaning: '凉爽', phonetic: 'fʁɛ', example: "C est frais en automne" },
        { id: 'fr_83', word: 'météo', meaning: '天气', phonetic: 'meteɔ', example: 'Quelle est la météo?' },
      ]
    },
    {
      id: 'fr_lesson_8',
      title: '时间',
      description: '学习时间相关的法语表达',
      words: [
        { id: 'fr_84', word: 'matin', meaning: '早上', phonetic: 'matɛ̃', example: 'Bon matin' },
        { id: 'fr_85', word: 'après-midi', meaning: '下午', phonetic: 'apʁɛ midi', example: 'Bon après-midi' },
        { id: 'fr_86', word: 'soir', meaning: '晚上', phonetic: 'swaʁ', example: 'Bon soir' },
        { id: 'fr_87', word: 'nuit', meaning: '夜晚', phonetic: 'nɥi', example: 'Bon nuit' },
        { id: 'fr_88', word: 'aujourd\'hui', meaning: '今天', phonetic: 'oʒuʁdɥi', example: 'Aujourd hui c est lundi' },
        { id: 'fr_89', word: 'hier', meaning: '昨天', phonetic: 'je', example: 'Hier j étais occupé' },
        { id: 'fr_90', word: 'demain', meaning: '明天', phonetic: 'dəmɛ̃', example: 'Demain c est dimanche' },
        { id: 'fr_91', word: 'semaine', meaning: '周', phonetic: 'səmɛn', example: 'la semaine prochaine' },
        { id: 'fr_92', word: 'mois', meaning: '月', phonetic: 'mwa', example: 'le mois dernier' },
        { id: 'fr_93', word: 'année', meaning: '年', phonetic: 'ane', example: 'cette année' },
      ]
    },
    {
      id: 'fr_lesson_9',
      title: '动词',
      description: '学习基础法语动词',
      words: [
        { id: 'fr_94', word: 'manger', meaning: '吃', phonetic: 'mɑ̃ʒe', example: 'Je mange du pain' },
        { id: 'fr_95', word: 'boire', meaning: '喝', phonetic: 'bwaʁ', example: 'Je bois du café' },
        { id: 'fr_96', word: 'aller', meaning: '去', phonetic: 'ale', example: 'Je vais à l école' },
        { id: 'fr_97', word: 'venir', meaning: '来', phonetic: 'vənir', example: 'Viens demain' },
        { id: 'fr_98', word: 'voir', meaning: '看', phonetic: 'vwaʁ', example: 'Je regarde la télévision' },
        { id: 'fr_99', word: 'écouter', meaning: '听', phonetic: 'ekute', example: 'J écoute de la musique' },
        { id: 'fr_100', word: 'parler', meaning: '说', phonetic: 'paʁle', example: 'Je parle français' },
        { id: 'fr_101', word: 'lire', meaning: '读', phonetic: 'liʁ', example: 'Je lis un livre' },
        { id: 'fr_102', word: 'écrire', meaning: '写', phonetic: 'ekʁiʁ', example: 'J écris une lettre' },
        { id: 'fr_103', word: 'travailler', meaning: '工作', phonetic: 'tʁavaje', example: 'Je travaille dans un bureau' },
      ]
    },
    {
      id: 'fr_lesson_10',
      title: '旅行',
      description: '旅行常用法语词汇',
      words: [
        { id: 'fr_104', word: 'hôtel', meaning: '酒店', phonetic: 'otɛl', example: 'Je suis à l hôtel' },
        { id: 'fr_105', word: 'aéroport', meaning: '机场', phonetic: 'aeʁopɔʁ', example: 'Je vais à l aéroport' },
        { id: 'fr_106', word: 'gare', meaning: '车站', phonetic: 'ɡaʁ', example: 'la gare de Lyon' },
        { id: 'fr_107', word: 'bus', meaning: '公交车', phonetic: 'bys', example: 'Prends le bus' },
        { id: 'fr_108', word: 'taxi', meaning: '出租车', phonetic: 'taksi', example: 'Prends un taxi' },
        { id: 'fr_109', word: 'restaurant', meaning: '餐厅', phonetic: 'ʁɛstɔʁɑ̃', example: 'Allons manger au restaurant' },
        { id: 'fr_110', word: 'billet', meaning: '票', phonetic: 'bije', example: 'Acheter un billet' },
        { id: 'fr_111', word: 'réservation', meaning: '预约', phonetic: 'rezɛʁvasjɔ̃', example: 'Faire une réservation' },
        { id: 'fr_112', word: 'touriste', meaning: '游客', phonetic: 'tuʁist', example: 'Je suis touriste' },
        { id: 'fr_113', word: 'tourisme', meaning: '观光', phonetic: 'tuʁism', example: 'Faire du tourisme' },
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