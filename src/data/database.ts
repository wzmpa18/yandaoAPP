export interface ContentItem {
  id: string;
  type: 'joke' | 'radio' | 'grammar' | 'story' | 'nursery_rhyme';
  language: string;
  title?: string;
  content: string;
  translation?: string;
  level?: string;
  age_group?: 'kids' | 'teenagers' | 'adults';
  source: 'template' | 'ai' | 'manual';
  created_at: number;
  usage_count: number;
}

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const supportedLanguages: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
];

export const generateMockData = (): ContentItem[] => {
  const items: ContentItem[] = [];
  const now = Date.now();

  const englishJokes = [
    { content: "Why did the scarecrow win an award? Because he was outstanding in his field!", translation: "为什么稻草人获奖了？因为他在自己的领域里非常出色！" },
    { content: "I told my wife she should embrace her mistakes. She gave me a hug.", translation: "我告诉我妻子应该拥抱她的错误。她给了我一个拥抱。" },
    { content: "What do you call fake spaghetti? An impasta!", translation: "假意大利面叫什么？Impasta（谐音梗）！" },
    { content: "Why don't scientists trust atoms? Because they make up everything!", translation: "为什么科学家不相信原子？因为它们组成了一切！" },
    { content: "I asked my dog what's two minus two. He said nothing.", translation: "我问我的狗二减二等于多少。它什么也没说。" },
    { content: "Why don't skeletons fight each other? They don't have the guts!", translation: "为什么骷髅不互相打架？因为它们没有胆量（内脏）！" },
    { content: "What do you call a bear with no teeth? A gummy bear!", translation: "没有牙齿的熊叫什么？软糖熊！" },
    { content: "Why did the math book look sad? Because it had too many problems.", translation: "为什么数学书看起来很伤心？因为它有太多问题。" },
    { content: "I used to play piano by ear, but now I use my hands.", translation: "我以前靠耳朵弹钢琴，但现在我用手。" },
    { content: "What do you call a fish wearing a bowtie? Sofishticated!", translation: "戴领结的鱼叫什么？优雅鱼！" },
  ];

  const japaneseJokes = [
    { content: "なぜ数学の本は悲しいのか？問題が多すぎるから！", translation: "为什么数学书很悲伤？因为问题太多了！" },
    { content: "コンピューターに休憩を求めたら、「私も休憩が必要です」と返されました", translation: "我让电脑休息一下，它回复说'我也需要休息'" },
    { content: "カエルがバーに入ったら、バーテンダーが「カエルはお断りです」と言いました", translation: "青蛙走进酒吧，酒保说'我们不接待青蛙'" },
    { content: "なぜサンドイッチは学校に行かないのか？すでにパンですから！", translation: "为什么三明治不上学？因为它已经是面包了！" },
    { content: "時計がけんかをした理由は何ですか？お互いに時間をかけていたから！", translation: "时钟打架的原因是什么？因为它们互相花时间！" },
  ];

  const koreanJokes = [
    { content: "왜 해골이 싸우지 않을까요? guts가 없기 때문입니다!", translation: "为什么骷髅不打架？因为没有胆量！" },
    { content: "컴퓨터에게 휴식을 요청했더니 \"저도 휴식이 필요해요\" 라고 답했어요", translation: "我让电脑休息，它说'我也需要休息'" },
    { content: "개구리가 바에 들어갔을 때 바텐더가 \"개구리는 안 됩니다\" 라고 말했어요", translation: "青蛙走进酒吧，酒保说'不接待青蛙'" },
    { content: "왜 샌드위치가 학교에 안 가나요? 이미 빵이니까요!", translation: "为什么三明治不上学？因为已经是面包了！" },
  ];

  const radioScripts = [
    { content: "Welcome to our language learning podcast! Today we're talking about effective study techniques. Remember, consistency is key! Practice a little every day, and you'll see amazing progress.", translation: "欢迎来到我们的语言学习播客！今天我们谈论有效的学习技巧。记住，坚持是关键！每天练习一点点，你会看到惊人的进步。" },
    { content: "Hello listeners! In today's episode, we explore the culture behind the words. Language is more than just words - it's about connecting with people from different backgrounds.", translation: "听众朋友们好！在今天的节目中，我们探索语言背后的文化。语言不仅仅是单词——它是与不同背景的人建立联系。" },
    { content: "Good morning language learners! Today we have a special guest who will share their journey of learning three languages fluently. Stay tuned for some great tips!", translation: "早上好，语言学习者们！今天我们有一位特别嘉宾，他将分享流利学习三种语言的旅程。敬请期待精彩的技巧！" },
    { content: "Welcome back to our show! Today we're diving into common mistakes learners make and how to avoid them. Let's get started with our first topic: pronunciation.", translation: "欢迎回到我们的节目！今天我们深入探讨学习者常犯的错误以及如何避免。让我们从第一个话题开始：发音。" },
  ];

  const grammarQuestions = [
    { content: "Choose the correct form: He ___ to school every day.", translation: "选择正确形式：He ___ to school every day.", level: 'A1' },
    { content: "Complete the sentence: I have been ___ English for two years.", translation: "完成句子：I have been ___ English for two years.", level: 'A2' },
    { content: "Rewrite in passive: They built this building in 2020.", translation: "改为被动语态：They built this building in 2020.", level: 'B1' },
    { content: "Choose the correct article: She is ___ doctor.", translation: "选择正确冠词：She is ___ doctor.", level: 'A1' },
    { content: "Choose the correct preposition: He arrived ___ the airport.", translation: "选择正确介词：He arrived ___ the airport.", level: 'A2' },
    { content: "Complete with comparative: This book is ___ than that one.", translation: "用比较级完成：This book is ___ than that one.", level: 'B1' },
  ];

  const stories = [
    { content: "Once upon a time, there was a little girl who loved to read. Every day after school, she would go to the library and read for hours. One day, she found a magical book that could talk...", translation: "从前，有一个小女孩非常喜欢阅读。每天放学后，她都会去图书馆读几个小时的书。有一天，她发现了一本会说话的魔法书...", level: 'A1', age_group: 'kids' },
    { content: "In a small village, there lived a young boy who dreamed of becoming a pilot. He worked hard, studied diligently, and never gave up on his dream. Years later, he finally became the captain of an airplane...", translation: "在一个小村庄里，住着一个梦想成为飞行员的小男孩。他努力工作，勤奋学习，从不放弃梦想。多年后，他终于成为了一名飞机机长...", level: 'A2', age_group: 'teenagers' },
    { content: "The old lighthouse keeper had lived on the island for over forty years. Every night, he would light the beacon to guide ships safely home. One stormy night, he noticed something strange in the fog...", translation: "老灯塔看守人已经在岛上生活了四十多年。每天晚上，他都会点亮灯塔指引船只安全回家。一个暴风雨的夜晚，他注意到雾中有什么奇怪的东西...", level: 'B1', age_group: 'adults' },
  ];

  const nurseryRhymes = [
    { content: "Twinkle, twinkle, little star, How I wonder what you are! Up above the world so high, Like a diamond in the sky.", translation: "一闪一闪小星星，我想知道你是什么！高高挂在世界上，像天空中的钻石。", age_group: 'kids' },
    { content: "Row, row, row your boat, Gently down the stream. Merrily, merrily, merrily, merrily, Life is but a dream.", translation: "划呀划，划小船，轻轻顺流而下。快乐呀快乐，生活只是一场梦。", age_group: 'kids' },
    { content: "Mary had a little lamb, Its fleece was white as snow. And everywhere that Mary went, The lamb was sure to go.", translation: "玛丽有一只小羊羔，羊毛白如雪。玛丽走到哪里，小羊羔就跟到哪里。", age_group: 'kids' },
  ];

  englishJokes.forEach((joke, index) => {
    items.push({
      id: `joke_en_${index + 1}`,
      type: 'joke',
      language: 'en',
      content: joke.content,
      translation: joke.translation,
      source: 'manual',
      created_at: now - index * 3600000,
      usage_count: Math.floor(Math.random() * 100),
    });
  });

  japaneseJokes.forEach((joke, index) => {
    items.push({
      id: `joke_ja_${index + 1}`,
      type: 'joke',
      language: 'ja',
      content: joke.content,
      translation: joke.translation,
      source: 'manual',
      created_at: now - index * 3600000,
      usage_count: Math.floor(Math.random() * 50),
    });
  });

  koreanJokes.forEach((joke, index) => {
    items.push({
      id: `joke_ko_${index + 1}`,
      type: 'joke',
      language: 'ko',
      content: joke.content,
      translation: joke.translation,
      source: 'manual',
      created_at: now - index * 3600000,
      usage_count: Math.floor(Math.random() * 30),
    });
  });

  radioScripts.forEach((script, index) => {
    items.push({
      id: `radio_en_${index + 1}`,
      type: 'radio',
      language: 'en',
      content: script.content,
      translation: script.translation,
      source: 'manual',
      created_at: now - index * 7200000,
      usage_count: Math.floor(Math.random() * 200),
    });
  });

  grammarQuestions.forEach((question, index) => {
    items.push({
      id: `grammar_en_${index + 1}`,
      type: 'grammar',
      language: 'en',
      content: question.content,
      translation: question.translation,
      level: question.level,
      source: 'manual',
      created_at: now - index * 5400000,
      usage_count: Math.floor(Math.random() * 150),
    });
  });

  stories.forEach((story, index) => {
    items.push({
      id: `story_en_${index + 1}`,
      type: 'story',
      language: 'en',
      content: story.content,
      translation: story.translation,
      level: story.level,
      age_group: story.age_group,
      source: 'manual',
      created_at: now - index * 10800000,
      usage_count: Math.floor(Math.random() * 80),
    });
  });

  nurseryRhymes.forEach((rhyme, index) => {
    items.push({
      id: `nursery_en_${index + 1}`,
      type: 'nursery_rhyme',
      language: 'en',
      content: rhyme.content,
      translation: rhyme.translation,
      age_group: rhyme.age_group,
      source: 'manual',
      created_at: now - index * 9000000,
      usage_count: Math.floor(Math.random() * 500),
    });
  });

  return items;
};

export const mockDatabase = {
  items: generateMockData(),

  async getItems(type?: string, language?: string, limit: number = 20, offset: number = 0): Promise<ContentItem[]> {
    let filtered = [...this.items];
    
    if (type) {
      filtered = filtered.filter(item => item.type === type);
    }
    if (language) {
      filtered = filtered.filter(item => item.language === language);
    }
    
    filtered.sort((a, b) => b.created_at - a.created_at);
    
    return filtered.slice(offset, offset + limit);
  },

  async getItemById(id: string): Promise<ContentItem | undefined> {
    return this.items.find(item => item.id === id);
  },

  async addItem(item: Omit<ContentItem, 'id' | 'created_at' | 'usage_count'>): Promise<ContentItem> {
    const newItem: ContentItem = {
      ...item,
      id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: Date.now(),
      usage_count: 0,
    };
    this.items.push(newItem);
    return newItem;
  },

  async incrementUsage(id: string): Promise<void> {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.usage_count++;
    }
  },

  async getStats(): Promise<{ total: number; types: Record<string, number>; languages: Record<string, number> }> {
    const types: Record<string, number> = {};
    const languages: Record<string, number> = {};
    
    this.items.forEach(item => {
      types[item.type] = (types[item.type] || 0) + 1;
      languages[item.language] = (languages[item.language] || 0) + 1;
    });
    
    return { total: this.items.length, types, languages };
  },
};
