import React, { useState, useEffect, useCallback } from 'react';
import { FloatingBack } from './FloatingBack';
import { callAI, friendlyAIError } from '../lib/aiClient';

interface ReadingMaterial {
  id: string;
  title: string;
  title_zh: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: string;
  length: number;
  estimatedTime: string;
  content: string;
  vocabulary: { word: string; meaning: string; level: string }[];
  grammarPoints: string[];
}

const READING_LEVELS = [
  { key: 'A1', label: '入门级', color: '#22c55e', desc: '简单对话，基础词汇' },
  { key: 'A2', label: '初级', color: '#84cc16', desc: '日常话题，常用表达' },
  { key: 'B1', label: '中级', color: '#eab308', desc: '复杂句子，多种时态' },
  { key: 'B2', label: '中高级', color: '#f97316', desc: '抽象话题，流畅表达' },
  { key: 'C1', label: '高级', color: '#ef4444', desc: '专业内容，深度讨论' },
  { key: 'C2', label: '精通级', color: '#8b5cf6', desc: '学术写作，母语水平' },
];

const READING_MATERIALS: ReadingMaterial[] = [
  {
    id: 'article_001',
    title: 'My Morning Routine',
    title_zh: '我的早晨日常',
    level: 'A1',
    category: '生活',
    length: 120,
    estimatedTime: '3分钟',
    content: `I wake up at 7 o'clock every morning. First, I make the bed and brush my teeth. Then I drink a glass of water. After that, I do some exercise for 15 minutes. I usually eat toast and eggs for breakfast. Sometimes I read the news on my phone. At 8:30, I leave home and walk to work. I enjoy my morning routine because it helps me start the day well.`,
    vocabulary: [
      { word: 'routine', meaning: '日常，常规', level: 'A1' },
      { word: 'brush', meaning: '刷', level: 'A1' },
      { word: 'exercise', meaning: '锻炼', level: 'A1' },
      { word: 'breakfast', meaning: '早餐', level: 'A1' },
      { word: 'enjoy', meaning: '享受', level: 'A1' },
    ],
    grammarPoints: ['一般现在时', '时间顺序连接词'],
  },
  {
    id: 'article_002',
    title: 'A Trip to Kyoto',
    title_zh: '京都之旅',
    level: 'A2',
    category: '旅行',
    length: 250,
    estimatedTime: '5分钟',
    content: `Last summer, I went to Kyoto with my family. We stayed in a traditional ryokan near the famous Fushimi Inari shrine. On the first day, we visited Kinkaku-ji, the Golden Pavilion. The building was covered in gold leaf and reflected beautifully in the pond. We also tried matcha tea and traditional Japanese sweets. In the evening, we walked through the Gion district and saw geisha walking in their beautiful kimono. It was an unforgettable experience.`,
    vocabulary: [
      { word: 'traditional', meaning: '传统的', level: 'A2' },
      { word: 'reflect', meaning: '反射，倒映', level: 'A2' },
      { word: 'experience', meaning: '经历，体验', level: 'A2' },
      { word: 'district', meaning: '地区，街区', level: 'A2' },
      { word: 'unforgettable', meaning: '难忘的', level: 'B1' },
    ],
    grammarPoints: ['一般过去时', '形容词顺序', '被动语态'],
  },
  {
    id: 'article_003',
    title: 'The Benefits of Learning Languages',
    title_zh: '学习语言的好处',
    level: 'B1',
    category: '教育',
    length: 380,
    estimatedTime: '7分钟',
    content: `Learning a second language offers numerous benefits that extend far beyond communication. Studies have shown that bilingual individuals have better cognitive abilities, including improved memory and problem-solving skills. Language learning also enhances cultural understanding and empathy, as learners gain insight into different ways of thinking and living. Furthermore, it can boost career opportunities, as many employers value multilingual employees. Whether for personal growth or professional advancement, investing time in language learning is a valuable endeavor.`,
    vocabulary: [
      { word: 'numerous', meaning: '众多的', level: 'B1' },
      { word: 'cognitive', meaning: '认知的', level: 'B2' },
      { word: 'empathy', meaning: '同理心', level: 'B1' },
      { word: 'endeavor', meaning: '努力，尝试', level: 'B2' },
      { word: 'enhance', meaning: '增强，提升', level: 'B1' },
    ],
    grammarPoints: ['现在完成时', '宾语从句', '条件状语从句'],
  },
  {
    id: 'article_004',
    title: 'Artificial Intelligence in Daily Life',
    title_zh: '日常生活中的人工智能',
    level: 'B2',
    category: '科技',
    length: 450,
    estimatedTime: '8分钟',
    content: `Artificial intelligence has become an integral part of modern life, often operating unseen in the background. From personalized recommendations on streaming platforms to voice assistants that respond to our commands, AI enhances convenience and efficiency. Machine learning algorithms analyze vast amounts of data to predict weather patterns, optimize traffic flow, and even assist in medical diagnoses. While concerns about privacy and job displacement persist, there is no denying that AI continues to transform how we live, work, and interact with the world around us.`,
    vocabulary: [
      { word: 'integral', meaning: '不可或缺的', level: 'B2' },
      { word: 'algorithms', meaning: '算法', level: 'B2' },
      { word: 'optimize', meaning: '优化', level: 'B2' },
      { word: 'displacement', meaning: '取代，替代', level: 'C1' },
      { word: 'transform', meaning: '转变，改变', level: 'B1' },
    ],
    grammarPoints: ['被动语态', '分词作状语', '让步状语从句'],
  },
  {
    id: 'article_005',
    title: 'Climate Change and Its Impact',
    title_zh: '气候变化及其影响',
    level: 'C1',
    category: '环境',
    length: 520,
    estimatedTime: '10分钟',
    content: `Climate change poses one of the most significant challenges of our time. Rising global temperatures, melting polar ice caps, and extreme weather events are just some of the consequences of greenhouse gas emissions. The scientific consensus is clear: human activity, particularly the burning of fossil fuels, is the primary driver of this phenomenon. Addressing climate change requires collective action, from reducing carbon footprints to developing sustainable technologies. The urgency of this issue cannot be overstated, as the decisions we make today will determine the planet's future for generations to come.`,
    vocabulary: [
      { word: 'consequences', meaning: '后果，结果', level: 'C1' },
      { word: 'consensus', meaning: '共识', level: 'C1' },
      { word: 'phenomenon', meaning: '现象', level: 'C1' },
      { word: 'sustainable', meaning: '可持续的', level: 'B2' },
      { word: 'urgency', meaning: '紧迫性', level: 'C1' },
    ],
    grammarPoints: ['分词作定语', '名词性从句', '虚拟语气'],
  },
  // === C2 level ===
  {
    id: 'article_006',
    title: 'The Philosophy of Language',
    title_zh: '语言哲学浅谈',
    level: 'C2',
    category: '哲学',
    length: 580,
    estimatedTime: '12分钟',
    content: `The relationship between language and thought has been a subject of philosophical inquiry for centuries. The Sapir-Whorf hypothesis posits that the structure of a language fundamentally shapes its speakers' cognition and worldview. While the strong version of this hypothesis — linguistic determinism — has been largely discredited, the weaker version, linguistic relativity, continues to garner empirical support. Cross-linguistic studies have demonstrated that speakers of different languages exhibit nuanced differences in color perception, spatial reasoning, and even temporal conceptualization. The implications of these findings extend beyond linguistics, touching upon epistemology, cognitive science, and the very nature of human consciousness.`,
    vocabulary: [
      { word: 'hypothesis', meaning: '假说，假设', level: 'C2' },
      { word: 'cognition', meaning: '认知', level: 'C2' },
      { word: 'determinism', meaning: '决定论', level: 'C2' },
      { word: 'empirical', meaning: '经验主义的，实证的', level: 'C2' },
      { word: 'epistemology', meaning: '认识论', level: 'C2' },
    ],
    grammarPoints: ['同位语从句', '强调句型', '被动语态高级用法'],
  },
  {
    id: 'article_007',
    title: 'Neuroscience of Habit Formation',
    title_zh: '习惯养成的神经科学',
    level: 'C2',
    category: '科学',
    length: 550,
    estimatedTime: '11分钟',
    content: `The neuroscience of habit formation reveals a fascinating interplay between the basal ganglia, prefrontal cortex, and dopamine-mediated reward pathways. When a behavior is repeated consistently, the brain gradually transitions control from the prefrontal cortex — responsible for deliberate, conscious decision-making — to the basal ganglia, which automates the behavior. This neurological shift explains why habits, once established, require remarkably little cognitive effort to maintain. Dopamine, often mischaracterized as merely a "pleasure chemical," actually plays a more nuanced role: it signals reward prediction errors, reinforcing behaviors that lead to unexpectedly positive outcomes. Understanding these mechanisms offers profound insights into breaking detrimental habits and cultivating beneficial ones.`,
    vocabulary: [
      { word: 'interplay', meaning: '相互作用', level: 'C2' },
      { word: 'neurological', meaning: '神经学的', level: 'C2' },
      { word: 'mischaracterize', meaning: '错误描述', level: 'C2' },
      { word: 'detrimental', meaning: '有害的', level: 'C2' },
      { word: 'cultivate', meaning: '培养，培育', level: 'C1' },
    ],
    grammarPoints: ['非限定性定语从句', '倒装句', '插入语'],
  },
  // === Multi-language reading materials ===
  {
    id: 'article_ja_001',
    title: '日本の朝ごはん',
    title_zh: '日本的早餐',
    level: 'A2',
    category: '日本文化',
    length: 180,
    estimatedTime: '4分钟',
    content: `日本の朝ごはんは、ごはん、味噌汁、焼き魚、卵焼き、漬物など、たくさんのおかずがあります。和食の朝ごはんは栄養バランスがとても良いと言われています。最近は、パンとコーヒーだけの簡単な朝ごはんを食べる人も増えていますが、休みの日には家族でゆっくり和食の朝ごはんを楽しむ家庭も多いです。`,
    vocabulary: [
      { word: '味噌汁', meaning: '味噌汤', level: 'A2' },
      { word: '焼き魚', meaning: '烤鱼', level: 'A2' },
      { word: '栄養', meaning: '营养', level: 'B1' },
      { word: 'バランス', meaning: '平衡', level: 'B1' },
      { word: '漬物', meaning: '酱菜，咸菜', level: 'B1' },
    ],
    grammarPoints: ['〜と言われている (被动)', '〜ています (进行时)', '〜ことがある (经历)'],
  },
  {
    id: 'article_ja_002',
    title: '東京の地下鉄',
    title_zh: '东京的地铁',
    level: 'B1',
    category: '日本生活',
    length: 300,
    estimatedTime: '6分钟',
    content: `東京の地下鉄は世界でも最も複雑な交通システムの一つです。13の路線があり、毎日約900万人が利用しています。初めて東京に来た人は、路線図を見て驚くかもしれません。しかし、一度使い方を覚えれば、とても便利です。SuicaやPasmoなどのICカードを使えば、切符を買わなくても簡単に乗り降りできます。ラッシュアワーの時間帯は非常に混雑しますが、それ以外の時間は比較的空いています。`,
    vocabulary: [
      { word: '複雑', meaning: '复杂', level: 'B1' },
      { word: '路線', meaning: '线路', level: 'B1' },
      { word: '利用', meaning: '使用，利用', level: 'B1' },
      { word: '混雑', meaning: '拥挤', level: 'B2' },
      { word: '比較的', meaning: '比较地', level: 'B2' },
    ],
    grammarPoints: ['〜と言われている', '〜ば (条件形)', '使役态'],
  },
  {
    id: 'article_es_001',
    title: 'La siesta española',
    title_zh: '西班牙午睡文化',
    level: 'A2',
    category: '西班牙文化',
    length: 200,
    estimatedTime: '4分钟',
    content: `La siesta es una tradición muy conocida en España. Normalmente, después del almuerzo, muchas personas descansan durante una o dos horas. Las tiendas pequeñas suelen cerrar entre las dos y las cinco de la tarde. Sin embargo, en las grandes ciudades, cada vez menos gente hace la siesta. Hoy en día, muchas personas trabajan en oficinas y no tienen tiempo para dormir por la tarde. Aun así, la siesta sigue siendo un símbolo importante de la cultura española.`,
    vocabulary: [
      { word: 'tradición', meaning: '传统', level: 'A2' },
      { word: 'descansar', meaning: '休息', level: 'A2' },
      { word: 'almuerzo', meaning: '午餐', level: 'A2' },
      { word: 'tienda', meaning: '商店', level: 'A1' },
      { word: 'símbolo', meaning: '象征', level: 'B1' },
    ],
    grammarPoints: ['现在时', '比较级', '转折连接词'],
  },
  {
    id: 'article_fr_001',
    title: 'Le petit-déjeuner français',
    title_zh: '法式早餐',
    level: 'A2',
    category: '法国文化',
    length: 190,
    estimatedTime: '4分钟',
    content: `Le petit-déjeuner français est généralement simple. La plupart des Français prennent un café ou un chocolat chaud avec une tartine de pain beurré ou un croissant. Contrairement au petit-déjeuner anglais, le petit-déjeuner français n\'inclut pas d\'œufs, de bacon ou de saucisses. Le week-end, les familles françaises prennent souvent plus de temps pour le petit-déjeuner et ajoutent parfois des viennoiseries comme des pains au chocolat.`,
    vocabulary: [
      { word: 'généralement', meaning: '通常', level: 'A2' },
      { word: 'tartine', meaning: '面包片（涂黄油）', level: 'A2' },
      { word: 'croissant', meaning: '羊角面包', level: 'A1' },
      { word: 'viennoiserie', meaning: '维也纳式甜酥面包', level: 'B1' },
      { word: 'beurré', meaning: '涂了黄油的', level: 'A2' },
    ],
    grammarPoints: ['副词位置', '否定式', '比较级结构'],
  },
  {
    id: 'article_de_001',
    title: 'Typisch Deutsch: Pünktlichkeit',
    title_zh: '德国特色：准时',
    level: 'A2',
    category: '德国文化',
    length: 200,
    estimatedTime: '4分钟',
    content: `In Deutschland ist Pünktlichkeit sehr wichtig. Wenn man zu einem Termin oder einer Verabredung zu spät kommt, gilt das als unhöflich. Die meisten Deutschen kommen fünf bis zehn Minuten früher. Bei der Arbeit und in der Schule ist Pünktlichkeit besonders wichtig. Die deutsche Bahn wirbt oft mit Pünktlichkeit, obwohl es manchmal Verspätungen gibt. Diese kulturelle Eigenschaft ist ein wichtiger Teil der deutschen Identität.`,
    vocabulary: [
      { word: 'Pünktlichkeit', meaning: '准时', level: 'A2' },
      { word: 'Verabredung', meaning: '约会，约定', level: 'A2' },
      { word: 'unhöflich', meaning: '不礼貌的', level: 'B1' },
      { word: 'Verspätung', meaning: '延迟', level: 'B1' },
      { word: 'Eigenschaft', meaning: '特性，特征', level: 'B1' },
    ],
    grammarPoints: ['wenn 引导的从句', 'obwohl 让步从句', 'als 比较'],
  },
  {
    id: 'article_ko_001',
    title: '한국의 찜질방 문화',
    title_zh: '韩国的汗蒸房文化',
    level: 'A2',
    category: '韩国文化',
    length: 200,
    estimatedTime: '4分钟',
    content: `찜질방은 한국의 독특한 문화 공간입니다. 사람들은 찜질방에서 뜨거운 방과 차가운 방을 오가며 몸을 따뜻하게 하고 땀을 흘립니다. 찜질방에는 보통 여러 가지 온도의 방이 있고, 식당과 수면실도 있습니다. 한국 사람들은 친구나 가족과 함께 찜질방에 자주 갑니다. 특히 주말에는 많은 사람들이 찜질방에서 하룻밤을 보내기도 합니다. 찜질방에 가면 꼭 삶은 계란과 식혜를 먹어야 합니다!`,
    vocabulary: [
      { word: '찜질방', meaning: '汗蒸房', level: 'A2' },
      { word: '독특한', meaning: '独特的', level: 'B1' },
      { word: '오가다', meaning: '来回走动', level: 'B1' },
      { word: '식혜', meaning: '甜米露', level: 'B2' },
      { word: '수면실', meaning: '睡眠室', level: 'B1' },
    ],
    grammarPoints: ['-고 (并列)', '-면 (假设)', '-기도 하다 (有时也)'],
  },
  {
    id: 'article_it_001',
    title: 'Il caffè italiano',
    title_zh: '意大利咖啡文化',
    level: 'A2',
    category: '意大利文化',
    length: 180,
    estimatedTime: '4分钟',
    content: `In Italia, il caffè è più di una bevanda: è un rito sociale. Gli italiani preferiscono l\'espresso, che si beve in pochi secondi al bancone del bar. Il cappuccino si beve solo al mattino, mai dopo pranzo o cena. Ordinare un cappuccino dopo le undici del mattino è considerato un errore da turista! Ogni regione italiana ha le sue tradizioni legate al caffè, ma l\'amore per questa bevanda unisce tutto il paese.`,
    vocabulary: [
      { word: 'bevanda', meaning: '饮料', level: 'A2' },
      { word: 'rito', meaning: '仪式', level: 'B1' },
      { word: 'bancone', meaning: '吧台', level: 'A2' },
      { word: 'considerato', meaning: '被认为', level: 'B1' },
      { word: 'unire', meaning: '团结，连接', level: 'B1' },
    ],
    grammarPoints: ['比较级', '被动语态', '关系代词 che'],
  },
  {
    id: 'article_pt_001',
    title: 'O carnaval brasileiro',
    title_zh: '巴西狂欢节',
    level: 'A2',
    category: '巴西文化',
    length: 200,
    estimatedTime: '4分钟',
    content: `O carnaval é a festa mais famosa do Brasil. Todos os anos, milhões de pessoas participam das comemorações em cidades como Rio de Janeiro, Salvador e Recife. No Rio, as escolas de samba competem no Sambódromo com desfiles incríveis de carros alegóricos, fantasias coloridas e música ao vivo. Em Salvador, o carnaval de rua atrai multidões que dançam atrás dos trios elétricos. O carnaval brasileiro é uma celebração da música, da dança e da alegria de viver.`,
    vocabulary: [
      { word: 'carnaval', meaning: '狂欢节', level: 'A2' },
      { word: 'desfile', meaning: '游行', level: 'B1' },
      { word: 'fantasia', meaning: '服装，化妆服', level: 'A2' },
      { word: 'multidão', meaning: '人群', level: 'B1' },
      { word: 'alegria', meaning: '快乐', level: 'A2' },
    ],
    grammarPoints: ['现在时', '形容词比较级', '地点状语'],
  },
  {
    id: 'article_ar_001',
    title: 'القهوة العربية',
    title_zh: '阿拉伯咖啡',
    level: 'A2',
    category: '阿拉伯文化',
    length: 180,
    estimatedTime: '4分钟',
    content: `القهوة العربية هي جزء مهم من الثقافة العربية. تُقدم القهوة في مناسبات كثيرة مثل الزواج والضيافة. القهوة العربية تُصنع من حبوب البن المحمصة مع الهيل وأحياناً الزعفران. تُقدم القهوة في فنجان صغير يسمى "الفنجان" بدون سكر. شرب القهوة العربية هو رمز للكرم وحسن الضيافة في العالم العربي.`,
    vocabulary: [
      { word: 'قهوة', meaning: '咖啡', level: 'A2' },
      { word: 'ضيافة', meaning: '待客之道', level: 'B1' },
      { word: 'هيل', meaning: '小豆蔻', level: 'B2' },
      { word: 'فنجان', meaning: '小杯子', level: 'A2' },
      { word: 'كرم', meaning: '慷慨', level: 'B1' },
    ],
    grammarPoints: ['被动语态', '名词句', '连接词'],
  },
  {
    id: 'article_zh_001',
    title: '中国的茶文化',
    title_zh: '中国茶文化（给中文学习者）',
    level: 'B1',
    category: '中国文化',
    length: 220,
    estimatedTime: '5分钟',
    content: `中国是茶的故乡，茶文化已经有几千年的历史。中国茶主要分为六大类：绿茶、红茶、乌龙茶、白茶、黄茶和黑茶。每种茶都有独特的香气和味道。中国人喝茶不仅是为了解渴，更是一种生活方式。在茶馆里，朋友们一边喝茶，一边聊天。泡茶的过程也很讲究，水温、时间、茶具都会影响茶的味道。如果你想了解中国文化，从一杯茶开始是最好的选择。`,
    vocabulary: [
      { word: '故乡', meaning: 'hometown, birthplace', level: 'B1' },
      { word: '香气', meaning: 'fragrance, aroma', level: 'B1' },
      { word: '解渴', meaning: 'quench thirst', level: 'B2' },
      { word: '讲究', meaning: 'be particular about', level: 'B2' },
      { word: '茶具', meaning: 'tea set', level: 'B1' },
    ],
    grammarPoints: ['"不仅...更..." 递进结构', '"一边...一边..." 并列结构', '程度补语'],
  },
];

/** AI 生成的总结数据结构 */
interface AISummaryData {
  summary: string;           // 文章总结
  mainPoints: string[];     // 主要观点
  keyVocabulary: string[];  // 重点词汇解析
  difficulty: string;       // 难度评估
  readingTips: string[];    // 阅读建议
}

export const AIBookReader: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<ReadingMaterial | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useState(0);
  const [bookmarkedWords, setBookmarkedWords] = useState<Set<string>>(new Set());
  
  // AI 总结相关状态
  const [aiSummary, setAiSummary] = useState<AISummaryData | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const filteredMaterials = selectedLevel === 'all'
    ? READING_MATERIALS
    : READING_MATERIALS.filter(m => m.level === selectedLevel);

  const handleWordClick = useCallback((word: string) => {
    setActiveWord(activeWord === word ? null : word);
  }, [activeWord]);

  useEffect(() => {
    if (selectedMaterial) {
      const contentLength = selectedMaterial.content.length;
      const interval = setInterval(() => {
        setReadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + (100 / (contentLength / 5));
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [selectedMaterial]);

  /** 调用真实 AI 生成文章总结 */
  async function fetchAISummary() {
    if (!selectedMaterial || aiSummary) return; // 已有缓存则不再请求

    setAiLoading(true);
    setAiError('');
    
    try {
      const vocabList = selectedMaterial.vocabulary.map(v => `${v.word}: ${v.meaning}`).join('、');
      
      const response = await callAI([
        {
          role: 'system',
          content: `你是一个专业的语言学习阅读助手。请对用户提供的英语文章进行智能分析，生成详细的中文学习总结。

请严格按照以下 JSON 格式返回：
{
  "summary": "用中文对全文进行200字以内的精炼总结",
  "mainPoints": ["要点1", "要点2", "要点3", "要点4"],
  "keyVocabulary": ["词汇1及其用法说明", "词汇2及其用法说明"],
  "difficulty": "难度评估（适合什么水平的学习者）",
  "readingTips": ["阅读技巧建议1", "阅读技巧建议2"]
}

要求：
- summary 要抓住文章主旨，用中文流畅表达
- mainPoints 提取 3-5 个关键信息点
- keyVocabulary 从文章中选取最值得学习的 2-3 个词汇，给出用法示例
- difficulty 说明这篇文章适合哪个级别（A1-C2）的学习者
- readingTips 给出 2 条实用的阅读理解建议

只返回有效 JSON，不要包含其他文字。`,
        },
        {
          role: 'user',
          content: `请分析以下英语文章：

标题：${selectedMaterial.title}
中文标题：${selectedMaterial.title_zh}
难度等级：${selectedMaterial.level}
分类：${selectedMaterial.category}
核心词汇：${vocabList}
语法要点：${selectedMaterial.grammarPoints.join('、')}

正文内容：
${selectedMaterial.content}`,
        }
      ]);

      // 清理响应中的 markdown 标记等
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      }

      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setAiSummary({
          summary: parsed.summary || '',
          mainPoints: Array.isArray(parsed.mainPoints) ? parsed.mainPoints : [],
          keyVocabulary: Array.isArray(parsed.keyVocabulary) ? parsed.keyVocabulary : [],
          difficulty: parsed.difficulty || selectedMaterial.level,
          readingTips: Array.isArray(parsed.readingTips) ? parsed.readingTips : [],
        });
      } else {
        throw new Error('AI 返回格式异常');
      }
    } catch (err) {
      console.error('AI Summary error:', err);
      setAiError(friendlyAIError(err));
    } finally {
      setAiLoading(false);
    }
  }

  /** 切换 AI 总结面板 */
  function handleToggleSummary() {
    if (!showSummary && !aiSummary && !aiError) {
      // 首次打开，触发 AI 调用
      fetchAISummary();
    }
    setShowSummary(!showSummary);
  }

  const toggleBookmark = useCallback((word: string) => {
    setBookmarkedWords(prev => {
      const next = new Set(prev);
      if (next.has(word)) {
        next.delete(word);
      } else {
        next.add(word);
      }
      return next;
    });
  }, []);

  if (!selectedMaterial) {
    return (
      <div className="book-reader">
        <FloatingBack onClick={onBack} />
        
        <div className="reader-header">
          <h1 className="reader-title">📚 AI 选词阅读</h1>
          <p className="reader-sub">根据你的词汇量，智能推荐分级读物</p>
        </div>

        <div className="reader-level-filter">
          <button
            className={`level-btn ${selectedLevel === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedLevel('all')}
          >
            全部
          </button>
          {READING_LEVELS.map(l => (
            <button
              key={l.key}
              className={`level-btn ${selectedLevel === l.key ? 'active' : ''}`}
              onClick={() => setSelectedLevel(l.key)}
              style={{ 
                backgroundColor: selectedLevel === l.key ? l.color + '20' : 'transparent',
                borderColor: selectedLevel === l.key ? l.color : undefined
              }}
              title={l.desc}
            >
              {l.key}
            </button>
          ))}
        </div>

        <div className="reader-library">
          {filteredMaterials.map(material => (
            <div 
              key={material.id}
              className="book-card"
              onClick={() => {
                setSelectedMaterial(material);
                setShowSummary(false);
                setReadProgress(0);
                setAiSummary(null);
                setAiError('');
                setAiLoading(false);
              }}
            >
              <div className="book-card-header">
                <span 
                  className="book-level-badge"
                  style={{ backgroundColor: READING_LEVELS.find(l => l.key === material.level)?.color }}
                >
                  {material.level}
                </span>
                <span className="book-category">{material.category}</span>
              </div>
              <h3 className="book-title">{material.title}</h3>
              <p className="book-title-zh">{material.title_zh}</p>
              <div className="book-meta">
                <span className="book-meta-item">📖 {material.length} 词</span>
                <span className="book-meta-item">⏱️ {material.estimatedTime}</span>
              </div>
              <div className="book-preview">
                {material.content.slice(0, 80)}...
              </div>
              <div className="book-words-preview">
                {material.vocabulary.slice(0, 3).map(v => (
                  <span key={v.word} className="book-word-tag">{v.word}</span>
                ))}
                {material.vocabulary.length > 3 && (
                  <span className="book-word-more">+{material.vocabulary.length - 3}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="reader-stats">
          <div className="stat-item">
            <span className="stat-value">5</span>
            <span className="stat-label">精选文章</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">20+</span>
            <span className="stat-label">核心词汇</span>
            <span className="stat-label">每篇</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">3</span>
            <span className="stat-label">语法要点</span>
            <span className="stat-label">每篇</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-reader-detail">
      <FloatingBack onClick={() => {
        setSelectedMaterial(null);
        setShowSummary(false);
        setReadProgress(0);
        setAiSummary(null);
        setAiError('');
        setAiLoading(false);
      }} />

      <div className="reader-detail-header">
        <div className="detail-level-row">
          <span 
            className="detail-level-badge"
            style={{ backgroundColor: READING_LEVELS.find(l => l.key === selectedMaterial.level)?.color }}
          >
            {selectedMaterial.level}
          </span>
          <span className="detail-category">{selectedMaterial.category}</span>
        </div>
        <h1 className="detail-title">{selectedMaterial.title}</h1>
        <p className="detail-title-zh">{selectedMaterial.title_zh}</p>
        <div className="detail-meta">
          <span className="detail-meta-item">📖 {selectedMaterial.length} 词</span>
          <span className="detail-meta-item">⏱️ {selectedMaterial.estimatedTime}</span>
        </div>
      </div>

      <div className="reader-progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${readProgress}%` }}
        />
        <span className="progress-text">{Math.round(readProgress)}%</span>
      </div>

      <div className="reader-content">
        {selectedMaterial.content.split(/\s+/).map((word, idx) => {
          const vocabItem = selectedMaterial.vocabulary.find(v => v.word.toLowerCase() === word.toLowerCase().replace(/[.,!?]/g, ''));
          return (
            <span key={idx}>
              {vocabItem ? (
                <span 
                  className={`reader-word vocab-word ${activeWord === vocabItem.word ? 'active' : ''}`}
                  onClick={() => handleWordClick(vocabItem.word)}
                >
                  {word}
                </span>
              ) : (
                <span className="reader-word">{word}</span>
              )}
              {' '}
            </span>
          );
        })}
      </div>

      {activeWord && (
        <div className="word-popup">
          {(() => {
            const vocab = selectedMaterial.vocabulary.find(v => v.word.toLowerCase() === activeWord.toLowerCase());
            if (!vocab) return null;
            return (
              <div className="word-popup-content">
                <div className="word-popup-header">
                  <span className="word-popup-word">{vocab.word}</span>
                  <span 
                    className="word-popup-level"
                    style={{ backgroundColor: READING_LEVELS.find(l => l.key === vocab.level)?.color }}
                  >
                    {vocab.level}
                  </span>
                  <button 
                    className="word-popup-bookmark"
                    onClick={() => toggleBookmark(vocab.word)}
                  >
                    {bookmarkedWords.has(vocab.word) ? '★' : '☆'}
                  </button>
                </div>
                <p className="word-popup-meaning">{vocab.meaning}</p>
              </div>
            );
          })()}
        </div>
      )}

      <div className="reader-vocab-section">
        <h3 className="vocab-section-title">📝 核心词汇</h3>
        <div className="vocab-grid">
          {selectedMaterial.vocabulary.map(v => (
            <div 
              key={v.word}
              className={`vocab-card ${bookmarkedWords.has(v.word) ? 'bookmarked' : ''}`}
            >
              <div className="vocab-word-row">
                <span className="vocab-word">{v.word}</span>
                <span 
                  className="vocab-level"
                  style={{ backgroundColor: READING_LEVELS.find(l => l.key === v.level)?.color }}
                >
                  {v.level}
                </span>
                <button 
                  className="vocab-bookmark"
                  onClick={() => toggleBookmark(v.word)}
                >
                  {bookmarkedWords.has(v.word) ? '★' : '☆'}
                </button>
              </div>
              <p className="vocab-meaning">{v.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="reader-grammar-section">
        <h3 className="grammar-section-title">📚 语法要点</h3>
        <ul className="grammar-list">
          {selectedMaterial.grammarPoints.map((point, idx) => (
            <li key={idx} className="grammar-item">
              <span className="grammar-bullet">✓</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* AI 总结区域 - 真实 AI 接入 */}
      <div className="reader-summary-section">
        <button 
          className={`summary-btn ${showSummary ? 'active' : ''}`}
          onClick={handleToggleSummary}
          disabled={aiLoading}
        >
          🤖 {showSummary ? '收起' : (aiLoading ? 'AI 分析中...' : 'AI 智能总结')}
        </button>
        
        {/* 加载状态 */}
        {aiLoading && (
          <div className="summary-loading">
            <div className="ai-spinner"></div>
            <p>AI 正在分析文章内容...</p>
            <p className="summary-loading-hint">正在调用 AI 模型生成总结、重点和阅读建议</p>
          </div>
        )}

        {/* 错误状态 */}
        {!aiLoading && aiError && !aiSummary && showSummary && (
          <div className="summary-error">
            <p>⚠️ {aiError}</p>
            <button className="summary-retry" onClick={fetchAISummary}>重试</button>
          </div>
        )}

        {/* AI 总结结果 */}
        {showSummary && aiSummary && (
          <div className="summary-content">
            <h4 className="summary-title">🤖 AI 文章分析</h4>
            
            {/* 文章总结 */}
            <div className="summary-block summary-main">
              <h5>📌 文章总结</h5>
              <p>{aiSummary.summary}</p>
            </div>

            {/* 难度评估 */}
            <div className="summary-block summary-difficulty">
              <span className="difficulty-label">🎯 难度评估：</span>
              <span 
                className="difficulty-value"
                style={{ 
                  color: READING_LEVELS.find(l => l.key === aiSummary.difficulty?.toUpperCase())?.color || '#666'
                }}
              >
                {READING_LEVELS.find(l => l.key === aiSummary.difficulty?.toUpperCase())?.label || aiSummary.difficulty || selectedMaterial.level}
              </span>
              <span className="difficulty-desc">
                {READING_LEVELS.find(l => l.key === aiSummary.difficulty?.toUpperCase())?.desc}
              </span>
            </div>

            {/* 主要观点 */}
            {aiSummary.mainPoints.length > 0 && (
              <div className="summary-block summary-points">
                <h5>💡 主要观点</h5>
                <ul>
                  {aiSummary.mainPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 重点词汇解析 */}
            {aiSummary.keyVocabulary.length > 0 && (
              <div className="summary-block summary-vocab">
                <h5>🔑 重点词汇解析</h5>
                <div className="summary-vocab-list">
                  {aiSummary.keyVocabulary.map((item, idx) => (
                    <span key={idx} className="summary-vocab-tag">{item}</span>
                  ))}
                </div>
              </div>
            )}

            {/* 阅读建议 */}
            {aiSummary.readingTips.length > 0 && (
              <div className="summary-block summary-tips">
                <h5>📖 阅读技巧建议</h5>
                <ul className="tips-list">
                  {aiSummary.readingTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 原始词汇列表作为补充 */}
            <div className="summary-highlights">
              <h5>📋 文章核心词汇：</h5>
              {selectedMaterial.vocabulary.map(v => (
                <span key={v.word} className="summary-word" style={{
                  borderLeftColor: READING_LEVELS.find(l => l.key === v.level)?.color,
                }}>
                  {v.word} ({v.meaning})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 未打开时的模板提示 */}
        {showSummary && !aiSummary && !aiLoading && !aiError && (
          <div className="summary-placeholder">
            <p>点击上方按钮获取 AI 智能分析</p>
          </div>
        )}
      </div>

      <div className="reader-footer">
        <button className="footer-btn" onClick={() => {
          setSelectedMaterial(null);
          setShowSummary(false);
          setReadProgress(0);
          setAiSummary(null);
          setAiError('');
          setAiLoading(false);
        }}>
          返回书架
        </button>
      </div>
    </div>
  );
};
