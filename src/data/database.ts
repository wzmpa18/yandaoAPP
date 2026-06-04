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
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
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

  const frenchJokes = [
    { content: "Pourquoi les plongeurs plongent-ils toujours en arrière? Parce que sinon ils tombent dans le bateau!", translation: "为什么潜水员总是往后跳水？因为否则他们会掉进船里！" },
    { content: "Quel est le comble pour un électricien? De ne pas être au courant!", translation: "电工最尴尬的事是什么？不知道/不通电！" },
    { content: "Pourquoi le café est-il déprimé? Parce qu'il a été moulu toute la journée!", translation: "为什么咖啡很沮丧？因为它整天被研磨！" },
  ];

  const spanishJokes = [
    { content: "¿Qué le dice un semáforo a otro? ¡No me mires que me estoy cambiando!", translation: "一个红绿灯对另一个说什么？别看我在换衣服！" },
    { content: "¿Por qué los pájaros no usan Facebook? ¡Porque ya tienen Twitter!", translation: "为什么鸟不用Facebook？因为它们已经有Twitter了！" },
    { content: "¿Cuál es el colmo de un libro? ¡Perder las hojas en otoño!", translation: "一本书最倒霉的事是什么？秋天掉页（叶子）！" },
  ];

  const germanJokes = [
    { content: "Was ist gelb und kann nicht schießen? Eine Banane — sie ist krumm!", translation: "什么是黄色的但不能射击？香蕉——它弯了！" },
    { content: "Warum gehen Ameisen nicht in die Kirche? Weil sie in Sekten sind!", translation: "为什么蚂蚁不去教堂？因为它们在教派里！" },
  ];

  const italianJokes = [
    { content: "Perché il libro di matematica è triste? Perché ha troppi problemi!", translation: "为什么数学书很伤心？因为它有太多问题！" },
    { content: "Cosa dice un pomodoro all'altro? Ci vediamo in insalata!", translation: "一个番茄对另一个说什么？沙拉里见！" },
  ];

  const portugueseJokes = [
    { content: "Por que o livro de matemática está triste? Porque tem muitos problemas!", translation: "为什么数学书很伤心？因为它有太多问题！" },
    { content: "O que o zero disse para o oito? Que cinto bonito!", translation: "0对8说了什么？好漂亮的腰带！" },
  ];

  const arabicJokes = [
    { content: "لماذا كتاب الرياضيات حزين؟ لأن لديه مشاكل كثيرة!", translation: "为什么数学书很伤心？因为它有太多问题！" },
    { content: "ماذا قال الصفر للثمانية؟ حزام جميل!", translation: "0对8说了什么？漂亮的腰带！" },
  ];

  const chineseJokes = [
    { content: "为什么数学书总是忧伤？因为它有太多解决不了的问题！", translation: "Why is the math book always sad? Because it has too many unsolvable problems!" },
    { content: "0对8说了什么？兄弟，你这腰带不错啊！", translation: "What did 0 say to 8? Nice belt, bro!" },
    { content: "筷子为什么找不到对象？因为它总是单身（双根）！", translation: "Why can't chopsticks find a partner? Because they're always single (double)!" },
  ];

  const multiLangStories = [
    { language: 'ja', content: "むかしむかし、あるところに、おじいさんとおばあさんが住んでいました。おばあさんが川で洗濯をしていると、大きな桃が流れてきました。", translation: "很久很久以前，老爷爷和老奶奶住在一起。老奶奶在河边洗衣服时，漂来一个大桃子。", level: 'A1', age_group: 'kids' },
    { language: 'fr', content: "Il était une fois un petit prince qui vivait sur une toute petite planète. Un jour, une rose magnifique est apparue sur sa planète.", translation: "从前有一个小王子，住在一颗很小的星球上。有一天，他的星球上出现了一朵美丽的玫瑰。", level: 'A1', age_group: 'kids' },
    { language: 'es', content: "En un pequeño pueblo de España, vivía un joven llamado Miguel que soñaba con viajar por el mundo. Cada día ahorraba un poco de dinero.", translation: "在西班牙的一个小镇上，住着一个叫米格尔的年轻人，他梦想环游世界。他每天都存一点钱。", level: 'A2', age_group: 'teenagers' },
    { language: 'de', content: "Es war einmal ein kleiner Hase, der im Wald lebte. Er war sehr neugierig und wollte immer neue Dinge entdecken.", translation: "从前有一只小兔子住在森林里。他非常好奇，总想发现新事物。", level: 'A1', age_group: 'kids' },
    { language: 'it', content: "C'era una volta un burattino di legno che sognava di diventare un bambino vero. Il suo nome era Pinocchio.", translation: "从前有一个木偶，他梦想成为一个真正的男孩。他的名字叫匹诺曹。", level: 'A1', age_group: 'kids' },
    { language: 'pt', content: "Era uma vez uma menina chamada Ana que adorava explorar a floresta perto de sua casa. Um dia, ela encontrou um mapa antigo.", translation: "从前有一个叫安娜的女孩，她喜欢探索家附近的森林。有一天，她发现了一张古老的地图。", level: 'A2', age_group: 'teenagers' },
    { language: 'ar', content: "كان ياما كان، في قديم الزمان، كان هناك تاجر اسمه سندباد. كان يحب السفر والمغامرة.", translation: "很久很久以前，有一个商人叫辛巴达。他热爱旅行和冒险。", level: 'A2', age_group: 'teenagers' },
    { language: 'zh', content: "从前有一个小男孩，他每天都去河边放牛。有一天，他觉得很无聊，就对着山下大喊：「狼来了！狼来了！」", translation: "Once there was a boy who herded cattle by the river every day. One day, feeling bored, he shouted: 'Wolf! Wolf!'", level: 'A1', age_group: 'kids' },
  ];

  const multiLangNurseryRhymes = [
    { language: 'ja', content: "ぞうさん、ぞうさん、お鼻が長いのね。そうよ、かあさんも長いのよ。", translation: "大象大象，你的鼻子真长呀。是啊，妈妈也长呢。", age_group: 'kids' },
    { language: 'ko', content: "곰 세 마리가 한 집에 있어, 아빠 곰, 엄마 곰, 애기 곰. 아빠 곰은 뚱뚱해.", translation: "三只熊住在一间房子里，熊爸爸，熊妈妈，熊宝宝。熊爸爸胖胖的。", age_group: 'kids' },
    { language: 'fr', content: "Frère Jacques, Frère Jacques, dormez-vous? Dormez-vous? Sonnez les matines, sonnez les matines. Ding ding dong!", translation: "雅克兄弟，雅克兄弟，你在睡觉吗？你在睡觉吗？敲响晨钟，敲响晨钟。叮叮咚！", age_group: 'kids' },
    { language: 'es', content: "Los pollitos dicen pío, pío, pío, cuando tienen hambre, cuando tienen frío.", translation: "小鸡们叫叽叽叽，当它们饿了，当它们冷了。", age_group: 'kids' },
    { language: 'zh', content: "两只老虎，两只老虎，跑得快，跑得快。一只没有耳朵，一只没有尾巴，真奇怪，真奇怪！", translation: "Two tigers, two tigers, running fast. One has no ears, one has no tail. How strange!", age_group: 'kids' },
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

  // Multi-language jokes
  [{ lang: 'fr', data: frenchJokes }, { lang: 'es', data: spanishJokes }, { lang: 'de', data: germanJokes }, { lang: 'it', data: italianJokes }, { lang: 'pt', data: portugueseJokes }, { lang: 'ar', data: arabicJokes }, { lang: 'zh', data: chineseJokes }].forEach(({ lang, data }) => {
    data.forEach((joke, index) => {
      items.push({
        id: `joke_${lang}_${index + 1}`,
        type: 'joke',
        language: lang,
        content: joke.content,
        translation: joke.translation,
        source: 'manual',
        created_at: now - index * 3600000,
        usage_count: Math.floor(Math.random() * 30),
      });
    });
  });

  // Multi-language stories
  multiLangStories.forEach((story, index) => {
    items.push({
      id: `story_${story.language}_${index + 1}`,
      type: 'story',
      language: story.language,
      content: story.content,
      translation: story.translation,
      level: story.level,
      age_group: story.age_group,
      source: 'manual',
      created_at: now - index * 10800000,
      usage_count: Math.floor(Math.random() * 60),
    });
  });

  // Multi-language nursery rhymes
  multiLangNurseryRhymes.forEach((rhyme, index) => {
    items.push({
      id: `nursery_${rhyme.language}_${index + 1}`,
      type: 'nursery_rhyme',
      language: rhyme.language,
      content: rhyme.content,
      translation: rhyme.translation,
      age_group: rhyme.age_group,
      source: 'manual',
      created_at: now - index * 9000000,
      usage_count: Math.floor(Math.random() * 400),
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
