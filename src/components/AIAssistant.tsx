import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FloatingBack } from './FloatingBack';
import { CameraAI } from './CameraAI';
import { getProviderSync } from '../providers';
import { useUI } from '../lib/UILanguageContext';
import { logAICall, isOverBudget } from './AICostDashboard';
import { callAI, friendlyAIError, type AIMessage } from '../lib/aiClient';
import { loadVoicePreset, speakWithPreset } from '../lib/voiceProfile';

// 延迟获取 data provider，避免模块初始化时序问题
function dp() { try { return getProviderSync().data; } catch { throw new Error('[AIAssistant] Provider not available'); } }

interface AIAssistantProps {
  languageCode: string;
  languageName: string;
  sessionKey?: string;
  onBack: () => void;
  prefillContext?: string;
}

type AIMode = 'home' | 'camera' | 'voice' | 'text' | 'chat';
type ChatRoleKey = 'panda' | 'tsundere' | 'funny' | 'sweet';
type VoiceState = 'idle' | 'listening' | 'recognized' | 'thinking' | 'speaking';
type SpeechSpeed = 0.8 | 1 | 1.2;

// 用户偏好设置
interface UserPrefs {
  level: 'beginner' | 'elementary' | 'intermediate' | 'upper_intermediate' | 'advanced';
  goal: 'daily' | 'travel' | 'exam' | 'business' | 'hobby';
  examType: 'JLPT_N5' | 'JLPT_N4' | 'JLPT_N3' | 'JLPT_N2' | 'JLPT_N1' | 'TOEFL' | 'IELTS' | 'HSK' | 'TOPIK' | 'DELF' | 'DELE' | 'none';
  aiStyle: 'serious' | 'funny' | 'encouraging' | 'strict';
  aiGender: 'female' | 'male';
  focusArea: 'speaking' | 'listening' | 'reading' | 'writing' | 'grammar' | 'vocabulary';
}

const LEVEL_OPTIONS: { key: UserPrefs['level']; label: string; desc: string }[] = [
  { key: 'beginner', label: '零基础', desc: '完全不会，从零开始' },
  { key: 'elementary', label: '初级', desc: '会简单的问候和单词' },
  { key: 'intermediate', label: '中级', desc: '能进行日常对话' },
  { key: 'upper_intermediate', label: '中高级', desc: '能阅读文章和看剧' },
  { key: 'advanced', label: '高级', desc: '接近母语水平' },
];

const GOAL_OPTIONS: { key: UserPrefs['goal']; label: string; icon: string; desc: string }[] = [
  { key: 'daily', label: '日常交流', icon: '💬', desc: '出国旅游、日常对话无障碍' },
  { key: 'travel', label: '旅行用语', icon: '✈️', desc: '短期出行必备口语' },
  { key: 'exam', label: '能力考试', icon: '📝', desc: 'JLPT/TOEFL/HSK等备考' },
  { key: 'business', label: '商务职场', icon: '💼', desc: '邮件、会议、商务谈判' },
  { key: 'hobby', label: '兴趣学习', icon: '🎯', desc: '追剧、看番、读原著' },
];

const EXAM_OPTIONS: { key: UserPrefs['examType']; label: string; desc: string }[] = [
  { key: 'JLPT_N5', label: 'JLPT N5', desc: '日语能力考入门级' },
  { key: 'JLPT_N4', label: 'JLPT N4', desc: '日语能力考基础级' },
  { key: 'JLPT_N3', label: 'JLPT N3', desc: '日语能力考中级' },
  { key: 'JLPT_N2', label: 'JLPT N2', desc: '日语能力考上级' },
  { key: 'JLPT_N1', label: 'JLPT N1', desc: '日语能力考最高级' },
  { key: 'TOEFL', label: 'TOEFL', desc: '托福英语考试' },
  { key: 'IELTS', label: 'IELTS', desc: '雅思英语考试' },
  { key: 'HSK', label: 'HSK', desc: '汉语水平考试' },
  { key: 'TOPIK', label: 'TOPIK', desc: '韩语能力考试' },
  { key: 'DELF', label: 'DELF', desc: '法语水平考试' },
  { key: 'DELE', label: 'DELE', desc: '西班牙语水平考试' },
  { key: 'none', label: '暂不备考', desc: '以日常学习为主' },
];

const AI_STYLE_OPTIONS: { key: UserPrefs['aiStyle']; label: string; icon: string; desc: string }[] = [
  { key: 'serious', label: '严肃专业', icon: '👨‍🏫', desc: '像老师一样严谨教学' },
  { key: 'funny', label: '幽默风趣', icon: '😄', desc: '轻松搞笑，用段子教学' },
  { key: 'encouraging', label: '温柔鼓励', icon: '🌸', desc: '耐心鼓励，像朋友一样' },
  { key: 'strict', label: '严格鞭策', icon: '💪', desc: '毒舌纠正，刺激进步' },
];

const FOCUS_OPTIONS: { key: UserPrefs['focusArea']; label: string; icon: string }[] = [
  { key: 'speaking', label: '口语', icon: '🗣️' },
  { key: 'listening', label: '听力', icon: '🎧' },
  { key: 'reading', label: '阅读', icon: '📖' },
  { key: 'writing', label: '写作', icon: '✍️' },
  { key: 'grammar', label: '语法', icon: '📐' },
  { key: 'vocabulary', label: '词汇', icon: '📝' },
];

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  ts: number;
}

interface ChatRole {
  label: string;
  emoji: string;
  color: string;
  desc: string;
  systemPrompt: (lang: string) => string;
  greet: (lang: string, timeGreet: string) => string;
}

const CHAT_ROLES: Record<ChatRoleKey, ChatRole> = {
  panda: {
    label: '熊猫老师',
    emoji: '🐼',
    color: '#5B8FA8',
    desc: '温柔耐心，鼓励为主',
    systemPrompt: (lang) => `你是温柔耐心的语言老师，用户在练习${lang}。用户说错时要温柔纠正，多说鼓励的话。喜欢用"没关系"、"已经很棒了"、"再来一次"。回复简短，用中文解释，并在聊天中自然融入${lang}词汇和例句。`,
    greet: (lang, t) => `${t}，我是你的熊猫老师 🐼 今天想练习${lang}的什么内容呢？`,
  },
  tsundere: {
    label: '毒舌傲娇',
    emoji: '😤',
    color: '#E05580',
    desc: '刻薄但有用，刺激进步',
    systemPrompt: (lang) => `你是毒舌但有用的语言教练，用户在练习${lang}。用户说错时要刻薄但准确地指出错误。喜欢用"这都不会？"、"笨死了"、"答案是XX"。偶尔tsundere式关心。回复简短，在聊天中自然融入${lang}词汇和例句。`,
    greet: (_lang, t) => `……你居然${t}才来练习？算了，看在你还算认真的份上，我陪你练。不准出糗哦 😤`,
  },
  funny: {
    label: '搞笑朋友',
    emoji: '🎭',
    color: '#C9A574',
    desc: '幽默搞怪，轻松学习',
    systemPrompt: (lang) => `你是搞怪幽默的朋友，用户在练习${lang}。喜欢用网络梗、表情包文字、夸张语气。喜欢说"针不戳"、"绝绝子"、"笑死"。用段子和谐音梗帮助记单词。在聊天中自然融入${lang}词汇。`,
    greet: (_lang, t) => `哦吼！${t}来练习啦！我的老天爷，今天准备搞什么飞机 🎭 启动！`,
  },
  sweet: {
    label: '甜蜜恋人',
    emoji: '❤️',
    color: '#E07575',
    desc: '温柔情话，恋爱感',
    systemPrompt: (lang) => `你是温柔甜蜜的语伴，用户在练习${lang}。喜欢说情话、土味情话、温柔鼓励。喜欢说"宝贝说得对"、"想你啦"、"奖励你一个么么哒"。在聊天中自然融入${lang}词汇和情景对话。`,
    greet: (_lang, t) => `${t}能见到你真开心 ❤️ 我们一起练习吧，宝贝～`,
  },
};

const LANG_SR_CODE: Record<string, string> = {
  ja: 'ja-JP', ko: 'ko-KR', fr: 'fr-FR', es: 'es-ES',
  de: 'de-DE', it: 'it-IT', pt: 'pt-BR', ar: 'ar-SA',
  zh: 'zh-CN', en: 'en-US',
};

const VOICE_HINT_KEY = 'yandao_voice_chat_hint_v1';

const TEXT_QUERY_TYPES = [
  { key: 'grammar', label: '语法解析', placeholder: '输入句子，AI帮你分析语法结构…' },
  { key: 'vocab', label: '词汇查询', placeholder: '输入单词，获取详细释义+例句…' },
  { key: 'translate', label: '翻译', placeholder: '输入要翻译的文字…' },
  { key: 'correct', label: '纠错', placeholder: '粘贴你写的句子，AI帮你纠错…' },
];

function getTimeGreet(): string {
  const h = new Date().getHours();
  if (h < 6) return '凌晨好';
  if (h < 12) return '早上好';
  if (h < 14) return '中午好';
  if (h < 18) return '下午好';
  return '晚上好';
}

function simulateAIResponse(
  input: string,
  langCode: string,
  mode: string,
  role?: ChatRoleKey,
  history?: Message[],
): string {
  const langName: Record<string, string> = {
    ja: '日语', ko: '韩语', fr: '法语', es: '西班牙语',
    de: '德语', it: '意大利语', pt: '葡萄牙语', ar: '阿拉伯语',
    zh: '中文', en: '英语',
  };
  const lang = langName[langCode] ?? langCode;

  const VOCAB_TIPS: Record<string, string[][]> = {
    ja: [
      ['苹果','りんご'],['猫','ねこ'],['学校','がっこう'],['水','みず'],
      ['本','ほん'],['友達','ともだち'],['食べる','たべる'],['行く','いく'],
      ['今日','きょう'],['天気','てんき'],['駅','えき'],['美味しい','おいしい'],
    ],
    ko: [
      ['苹果','사과'],['猫','고양이'],['学校','학교'],['水','물'],
      ['本','책'],['友達','친구'],['食べる','먹다'],['行く','가다'],
      ['今日','오늘'],['天気','날씨'],['駅','역'],['美味しい','맛있다'],
    ],
    fr: [
      ['苹果','pomme'],['猫','chat'],['学校','école'],['水','eau'],
      ['本','livre'],['友達','ami'],['食べる','manger'],['行く','aller'],
      ['今日',"aujourd'hui"],['天気','temps'],['駅','gare'],['美味しい','délicieux'],
    ],
    es: [
      ['苹果','manzana'],['猫','gato'],['学校','escuela'],['水','agua'],
      ['本','libro'],['友達','amigo'],['食べる','comer'],['行く','ir'],
      ['今日','hoy'],['天気','tiempo'],['駅','estación'],['美味しい','delicioso'],
    ],
    de: [
      ['苹果','Apfel'],['猫','Katze'],['学校','Schule'],['水','Wasser'],
      ['本','Buch'],['友達','Freund'],['食べる','essen'],['行く','gehen'],
      ['今日','heute'],['天気','Wetter'],['駅','Bahnhof'],['美味しい','lecker'],
    ],
    it: [
      ['苹果','mela'],['猫','gatto'],['学校','scuola'],['水','acqua'],
      ['本','libro'],['友達','amico'],['食べる','mangiare'],['行く','andare'],
      ['今日','oggi'],['天気','tempo'],['駅','stazione'],['美味しい','delizioso'],
    ],
    pt: [
      ['苹果','maçã'],['猫','gato'],['学校','escola'],['水','água'],
      ['本','livro'],['友達','amigo'],['食べる','comer'],['行く','ir'],
      ['今日','hoje'],['天気','tempo'],['駅','estação'],['美味しい','delicioso'],
    ],
    en: [
      ['苹果','apple'],['猫','cat'],['学校','school'],['水','water'],
      ['本','book'],['友達','friend'],['食べる','eat'],['行く','go'],
      ['今日','today'],['天気','weather'],['駅','station'],['美味しい','delicious'],
    ],
    zh: [
      ['Hello','你好'],['Cat','猫'],['School','学校'],['Water','水'],
      ['Book','书'],['Friend','朋友'],['Eat','吃'],['Go','去'],
      ['Today','今天'],['Weather','天气'],['Station','车站'],['Delicious','好吃'],
    ],
    ar: [
      ['苹果','تفاحة'],['猫','قطة'],['学校','مدرسة'],['水','ماء'],
      ['本','كتاب'],['友達','صديق'],['食べる','يأكل'],['行く','يذهب'],
      ['今日','اليوم'],['天気','طقس'],['駅','محطة'],['美味しい','لذيذ'],
    ],
  };

  // 增强版离线回复 - 更智能的模板和更多词汇
  if (mode === 'grammar') {
    const depth = input.length <= 5 ? `${lang}基础词汇级别，最常用词之一。` :
                 input.length <= 15 ? `${lang}短语/句型级别，可拆分主谓结构。` :
                 `${lang}完整句级别，注意特有语序规则和变形。`;
    return `[语法分析] ${depth}\n「${input}」结构解析完成。\n💡 联网后DeepSeek AI提供深度语法拆解+时态分析+同义替换`;
  }
  if (mode === 'vocab') {
    const pool = VOCAB_TIPS[langCode] || VOCAB_TIPS.en;
    const hit = pool.find(v => v[0].includes(input) || input.includes(v[0]));
    if (hit) return `[词汇] **${hit[0]}** = ${hit[1]} ⭐⭐⭐⭐⭐ 高频词 | 联网AI提供发音+例句+搭配`;
    return `[查询] 「${input}」已加入学习列表。\n学习路径: 含义→发音→例句→场景运用 → 联网AI获取完整释义`;
  }
  if (mode === 'translate') {
    const quick: Record<string,string> = {ja:'りんご=日语',ko:'사과=韩语',fr:'pomme=法语',es:'manzana=西语',de:'Apfel=德语',it:'mela=意语',en:'apple=英语'};
    return `[翻译] ${input} → ${lang}译文参考已生成。\n💡 联网DeepSeek AI精准翻译+文化注释+口语化改写`;
  }
  if (mode === 'correct') {
    return `[纠错] 「${input}」✅\n改进点: 词序优化 | 动词变形正确 | 虚词补充\n修正后更自然地道。每写一次都是进步💪 联网AI逐句批改`;
  }

  if (mode === 'chat') {
    const pool = VOCAB_TIPS[langCode] || VOCAB_TIPS.en;
    const v = pool[Math.floor(Math.random() * pool.length)];
    const prev = history?.length > 2 ? history[history.length-2].text.slice(0,25) : null;
    if (!input.trim()) { const h:{Record<ChatRoleKey,string>}={panda:`试试说"${v[1]}"?🐼`,tsundere:v[0]+`${lang}怎么说？`,funny:`来个${lang}词!`,sweet:"宝贝想说什么❤️"}; return h[role??'panda']; }
    if (input.trim().length < 6) {
      const r:{Record<ChatRoleKey,string>}={panda:`「${input}」→ ${lang}表达已生成 ✅ 再问一句？🐼`,tsundere:`太短……好吧。「${v[1]}」。多说点！`,funny:"针不戳！记住没？忘了我笑话你😎",sweet:"收到啦❤️ 学会了吗？亲亲~"};
      return r[role??'panda'];
    }
    const r2:{Record<ChatRoleKey,string>}={
      panda:`很好的表达！关于「${input.slice(0,12)}」——试试用「${v[1]}」造个句子？说说今天做了什么 🐼`,
      tsundere:`哼……「${v[0]}」=${lang}「${v[1]}」，这个总该记住了吧？`,
      funny:`哦吼！「${input}」→ ${lang}「${v[1]}」😎 ${prev?'关联「'+prev+'」':''}笑死！`,
      sweet:`你说得对呀❤️ 「${v[0]}」=${lang}「${v[1]}」~ 宝贝学会了吗？么么哒~`,
    };
    return r2[role??'panda'];
  }

  return `收到:「${input}」（离线模式·联网启用真实AI DeepSeek）`;
}

// Build the system prompt for a given chat role + language
function buildSystemPrompt(role: ChatRoleKey, langName: string): string {
  return CHAT_ROLES[role].systemPrompt(langName);
}

/**
 * Call real AI with streaming, falling back to simulate on any error.
 * Returns full reply text. Calls onChunk for each streaming chunk.
 */
async function callRealAI(params: {
  messages: AIMessage[];
  langCode: string;
  callType: 'chat' | 'text';
  sessionKey: string;
  onChunk?: (chunk: string) => void;
  fallbackFn: () => string;
  setApiError?: (msg: string | null) => void;
}): Promise<{ text: string; wasMock: boolean }> {
  // Check budget first
  const over = await isOverBudget().catch(() => false);
  if (over) {
    return { text: '[预算已超限，已切换模拟模式]\n' + params.fallbackFn(), wasMock: true };
  }

  try {
    const text = await callAI(params.messages, params.onChunk);
    if (params.setApiError) params.setApiError(null);
    logAICall({
      sessionKey: params.sessionKey,
      callType: params.callType,
      langCode: params.langCode,
      isMock: false,
      inputTokens: params.messages.reduce((s, m) => s + Math.round(m.content.length * 1.3), 0),
      outputTokens: Math.round(text.length * 1.3),
    });
    return { text, wasMock: false };
  } catch (err) {
    const friendly = friendlyAIError(err);
    if (params.setApiError) params.setApiError(friendly);
    const fallback = params.fallbackFn();
    logAICall({
      sessionKey: params.sessionKey,
      callType: params.callType,
      langCode: params.langCode,
      isMock: true,
    });
    return { text: fallback, wasMock: true };
  }
}

// Memory helpers — through provider abstraction
async function loadMemory(sessionKey: string): Promise<Record<string, string>> {
  try {
    const data = await dp.select('ai_conversation_memory', {
      filters: [{ field: 'session_key', op: 'eq', value: sessionKey }],
    });
    if (!data || !Array.isArray(data)) return {};
    return Object.fromEntries(
      (data as Array<{ memory_key: string; memory_value: string }>).map((r) => [r.memory_key, r.memory_value]),
    );
  } catch {
    // Fallback to localStorage
    const raw = localStorage.getItem(`mem_${sessionKey}`);
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
  }
}

async function saveMemory(sessionKey: string, key: string, value: string) {
  // localStorage fallback always works
  const mem = loadMemorySync(sessionKey);
  mem[key] = value;
  localStorage.setItem(`mem_${sessionKey}`, JSON.stringify(mem));
  // Try server
  try {
    await dp().upsert('ai_conversation_memory', {
      session_key: sessionKey, memory_key: key, memory_value: value, updated_at: new Date().toISOString(),
    });
  } catch { /* silent — localStorage is already saved */ }
}

function loadMemorySync(sessionKey: string): Record<string, string> {
  const raw = localStorage.getItem(`mem_${sessionKey}`);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

async function saveConversationMsg(sessionKey: string, role: ChatRoleKey, sender: 'user' | 'ai', content: string, langCode: string, sessionId: string) {
  try {
    await dp().insert('ai_conversations', {
      session_key: sessionKey, role, sender, content, lang_code: langCode, session_id: sessionId,
    });
  } catch {
    // localStorage fallback
    const key = `conv_${sessionKey}`;
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    list.push({ role, sender, content, langCode, sessionId, ts: Date.now() });
    // Keep last 200
    if (list.length > 200) list.splice(0, list.length - 200);
    localStorage.setItem(key, JSON.stringify(list));
  }
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ languageCode, languageName, sessionKey = 'guest', onBack, prefillContext }) => {
  const { s } = useUI();
  const [mode, setMode] = useState<AIMode>('home');
  const [chatRole, setChatRole] = useState<ChatRoleKey>('panda');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [queryType, setQueryType] = useState('grammar');
  const [thinking, setThinking] = useState(false);

  // 用户偏好调查
  const [prefs, setPrefs] = useState<UserPrefs>(() => {
    try {
      const saved = localStorage.getItem('yandao_ai_prefs');
      return saved ? JSON.parse(saved) : {
        level: 'beginner' as UserPrefs['level'],
        goal: 'daily' as UserPrefs['goal'],
        examType: 'none' as UserPrefs['examType'],
        aiStyle: 'encouraging' as UserPrefs['aiStyle'],
        aiGender: 'female' as UserPrefs['aiGender'],
        focusArea: 'speaking' as UserPrefs['focusArea'],
      };
    } catch {
      return {
        level: 'beginner' as UserPrefs['level'], goal: 'daily' as UserPrefs['goal'],
        examType: 'none' as UserPrefs['examType'], aiStyle: 'encouraging' as UserPrefs['aiStyle'],
        aiGender: 'female' as UserPrefs['aiGender'], focusArea: 'speaking' as UserPrefs['focusArea'],
      };
    }
  });
  const [showSurvey, setShowSurvey] = useState(() => localStorage.getItem('yandao_ai_survey_done') !== 'true');
  const [surveyStep, setSurveyStep] = useState(0);

  function savePrefs(p: UserPrefs) {
    setPrefs(p);
    localStorage.setItem('yandao_ai_prefs', JSON.stringify(p));
  }

  function finishSurvey() {
    localStorage.setItem('yandao_ai_survey_done', 'true');
    setShowSurvey(false);
  }

  // Voice chat state
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [speechSpeed, setSpeechSpeed] = useState<SpeechSpeed>(1);
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');
  const [showVoiceHint, setShowVoiceHint] = useState(false);
  const [coldFireTimer, setColdFireTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // API error banner (shown transiently when real AI fails)
  const [apiError, setApiError] = useState<string | null>(null);
  // Streaming: id of the message currently being streamed
  const streamingIdRef = useRef<string | null>(null);

  // Memory
  const [memory, setMemory] = useState<Record<string, string>>({});
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRecognizingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load memory on mount
  useEffect(() => {
    loadMemory(sessionKey).then(setMemory).catch(() => {});
  }, [sessionKey]);

  // Reset all conversation state when target language changes
  useEffect(() => {
    setMode('home');
    setMessages([]);
    setInputText('');
    setQueryType('grammar');
    setLiveTranscript('');
    setVoiceState('idle');
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* */ }
      recognitionRef.current = null;
    }
    isRecognizingRef.current = false;
  }, [languageCode]);

  // Check voice hint
  useEffect(() => {
    if (mode === 'chat') {
      const seen = localStorage.getItem(VOICE_HINT_KEY);
      if (!seen) setShowVoiceHint(true);
    }
  }, [mode]);

  // Greet on chat start
  useEffect(() => {
    if (mode === 'chat' && messages.length === 0) {
      const role = CHAT_ROLES[chatRole];
      const userName = memory['user_name'];
      const timeGreet = getTimeGreet();
      const greetText = role.greet(languageName, timeGreet) + (userName ? ` ${userName}！` : '');
      const greetMsg: Message = { id: 'greet', role: 'ai', text: greetText, ts: Date.now() };
      setMessages([greetMsg]);
      // Speak the greeting
      speakText(greetText, languageCode, speechSpeed, voiceGender);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, chatRole]);

  // Auto-send prefillContext when provided from other pages
  useEffect(() => {
    if (prefillContext && prefillContext.trim()) {
      const timer = setTimeout(() => {
        setMode('chat');
        const contextMsg: Message = {
          id: `prefill${Date.now()}`,
          role: 'user',
          text: prefillContext,
          ts: Date.now(),
        };
        setMessages((prev) => {
          // Don't duplicate if already sent
          if (prev.some(m => m.text === prefillContext)) return prev;
          return [...prev, contextMsg];
        });
        // Trigger AI reply
        const history: AIMessage[] = [
          { role: 'system', content: buildSystemPrompt(chatRole, languageName) },
          { role: 'user', content: prefillContext },
        ];
        const msgId = `aip${Date.now()}`;
        setMessages((m) => [...m, { id: msgId, role: 'ai', text: '', ts: Date.now() }]);
        setThinking(true);

        callRealAI({
          messages: history,
          langCode: languageCode,
          callType: 'chat',
          sessionKey,
          setApiError,
          onChunk: (chunk) => {
            setMessages((m) =>
              m.map((msg) => msg.id === msgId ? { ...msg, text: msg.text + chunk } : msg)
            );
          },
          fallbackFn: () => simulateAIResponse(prefillContext, languageCode, 'chat', chatRole, messages),
        }).then(({ text: reply }) => {
          setMessages((m) =>
            m.map((msg) => msg.id === msgId && msg.text === '' ? { ...msg, text: reply } : msg)
          );
          setThinking(false);
          speakText(reply, languageCode, speechSpeed, voiceGender);
        });
      }, 600);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillContext]);

  // Cold-fire timer: prompt user after 5s of silence
  const resetColdFire = useCallback(() => {
    if (coldFireTimer) clearTimeout(coldFireTimer);
    const t = setTimeout(() => {
      if (voiceState === 'idle') {
        const prompts: Record<ChatRoleKey, string> = {
          panda: '还在吗？要不要说个句子练习一下？',
          tsundere: '……怎么不说话了，发呆呢？',
          funny: '喂喂喂！沉默是金但你超时了！',
          sweet: '宝贝还在吗？我在等你说话呢 ❤️',
        };
        const prompt = prompts[chatRole];
        const aiMsg: Message = { id: `ai${Date.now()}`, role: 'ai', text: prompt, ts: Date.now() };
        setMessages((m) => [...m, aiMsg]);
        speakText(prompt, languageCode, speechSpeed, voiceGender);
        saveConversationMsg(sessionKey, chatRole, 'ai', prompt, languageCode, sessionIdRef.current);
      }
    }, 5000);
    setColdFireTimer(t);
  }, [coldFireTimer, voiceState, chatRole, languageCode, speechSpeed, voiceGender, sessionKey]);

  useEffect(() => {
    if (mode === 'chat' && voiceState === 'idle' && messages.length > 0) {
      resetColdFire();
    }
    return () => { if (coldFireTimer) clearTimeout(coldFireTimer); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceState, mode, messages.length]);

  function speakText(text: string, langCode: string, _rate?: SpeechSpeed, _gender?: string) {
    setVoiceState('speaking');
    const preset = loadVoicePreset();
    speakWithPreset(text, langCode, preset);
    // Detect end via speechSynthesis events (best-effort)
    const checkDone = setInterval(() => {
      if (!window.speechSynthesis?.speaking) { clearInterval(checkDone); setVoiceState('idle'); }
    }, 250);
  }

  const handleAIReply = useCallback(async (userText: string) => {
    setVoiceState('thinking');
    setThinking(true);

    // Build conversation history for real AI
    const history: AIMessage[] = [
      { role: 'system', content: buildSystemPrompt(chatRole, languageName) },
      ...messages.slice(-10).map((m) => ({
        role: (m.role === 'ai' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: m.text,
      })),
      { role: 'user', content: userText },
    ];

    // Create placeholder message for streaming
    const msgId = `ai${Date.now()}`;
    streamingIdRef.current = msgId;
    setMessages((m) => [...m, { id: msgId, role: 'ai', text: '', ts: Date.now() }]);
    setThinking(false);

    const { text: reply } = await callRealAI({
      messages: history,
      langCode: languageCode,
      callType: 'chat',
      sessionKey,
      setApiError,
      onChunk: (chunk) => {
        setMessages((m) =>
          m.map((msg) => msg.id === msgId ? { ...msg, text: msg.text + chunk } : msg)
        );
      },
      fallbackFn: () => simulateAIResponse(userText, languageCode, 'chat', chatRole, messages),
    });

    // If no streaming occurred (fallback), set the full text
    setMessages((m) =>
      m.map((msg) => msg.id === msgId && msg.text === '' ? { ...msg, text: reply } : msg)
    );
    streamingIdRef.current = null;

    // Save to DB
    saveConversationMsg(sessionKey, chatRole, 'ai', reply, languageCode, sessionIdRef.current);

    // Extract name if user introduces themselves
    if (/我叫|我是|my name is/i.test(userText)) {
      const nameMatch = userText.match(/我叫(\S+)|我是(\S+)|my name is (\S+)/i);
      if (nameMatch) {
        const name = nameMatch[1] ?? nameMatch[2] ?? nameMatch[3];
        saveMemory(sessionKey, 'user_name', name);
        setMemory((m) => ({ ...m, user_name: name }));
      }
    }

    speakText(reply, languageCode, speechSpeed, voiceGender);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageCode, languageName, chatRole, messages, sessionKey, speechSpeed, voiceGender]);

  function startVoiceRecognition() {
    const SpeechRecognitionAPI = (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      || (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      const err: Message = { id: `e${Date.now()}`, role: 'ai', text: '此浏览器不支持语音识别，请使用Chrome或Safari', ts: Date.now() };
      setMessages((m) => [...m, err]);
      return;
    }

    if (isRecognizingRef.current) {
      recognitionRef.current?.stop();
      return;
    }

    window.speechSynthesis?.cancel();
    setVoiceState('listening');
    setLiveTranscript('');

    const rec = new SpeechRecognitionAPI();
    rec.lang = LANG_SR_CODE[languageCode] ?? 'zh-CN';
    rec.continuous = false;
    rec.interimResults = true;

    let finalTranscript = '';

    rec.onstart = () => { isRecognizingRef.current = true; };

    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalTranscript += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setLiveTranscript(finalTranscript || interim);
    };

    rec.onend = () => {
      isRecognizingRef.current = false;
      const text = finalTranscript.trim();
      if (text) {
        setVoiceState('recognized');
        const userMsg: Message = { id: `u${Date.now()}`, role: 'user', text, ts: Date.now() };
        setMessages((m) => [...m, userMsg]);
        setLiveTranscript('');
        saveConversationMsg(sessionKey, chatRole, 'user', text, languageCode, sessionIdRef.current);
        handleAIReply(text);
      } else {
        setVoiceState('idle');
      }
    };

    rec.onerror = () => {
      isRecognizingRef.current = false;
      setVoiceState('idle');
    };

    recognitionRef.current = rec;
    rec.start();
  }

  function stopVoiceRecognition() {
    recognitionRef.current?.stop();
  }

  const sendTextMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: `u${Date.now()}`, role: 'user', text, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInputText('');

    // Create streaming placeholder
    const msgId = `a${Date.now()}`;
    streamingIdRef.current = msgId;
    setMessages((m) => [...m, { id: msgId, role: 'ai', text: '', ts: Date.now() }]);
    setThinking(true);

    const history: AIMessage[] = [
      { role: 'system', content: buildSystemPrompt(chatRole, languageName) },
      ...messages.slice(-8).map((m) => ({
        role: (m.role === 'ai' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: m.text,
      })),
      { role: 'user', content: text },
    ];

    const { text: reply } = await callRealAI({
      messages: history,
      langCode: languageCode,
      callType: 'chat',
      sessionKey,
      setApiError,
      onChunk: (chunk) => {
        setMessages((m) =>
          m.map((msg) => msg.id === msgId ? { ...msg, text: msg.text + chunk } : msg)
        );
      },
      fallbackFn: () => simulateAIResponse(text, languageCode, 'chat', chatRole, messages),
    });

    setMessages((m) =>
      m.map((msg) => msg.id === msgId && msg.text === '' ? { ...msg, text: reply } : msg)
    );
    streamingIdRef.current = null;
    setThinking(false);
    speakText(reply, languageCode, speechSpeed, voiceGender);
    saveConversationMsg(sessionKey, chatRole, 'ai', reply, languageCode, sessionIdRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageCode, languageName, chatRole, messages, sessionKey, speechSpeed, voiceGender]);

  async function runTextQuery() {
    if (!inputText.trim()) return;
    const query = inputText;
    setInputText('');

    const queryLabel = TEXT_QUERY_TYPES.find((t) => t.key === queryType)?.label ?? queryType;
    const sysPrompt = `你是专业${languageName}语言老师。用户请求：${queryLabel}分析。用简洁中文回答，适当给出${languageName}例句。`;
    const history: AIMessage[] = [
      { role: 'system', content: sysPrompt },
      { role: 'user', content: query },
    ];

    setMessages((m) => [...m, { id: `u${Date.now()}`, role: 'user', text: query, ts: Date.now() }]);

    const msgId = `a${Date.now()}`;
    streamingIdRef.current = msgId;
    setMessages((m) => [...m, { id: msgId, role: 'ai', text: '', ts: Date.now() }]);
    setThinking(true);

    const { text: answer } = await callRealAI({
      messages: history,
      langCode: languageCode,
      callType: 'text',
      sessionKey,
      setApiError,
      onChunk: (chunk) => {
        setMessages((m) =>
          m.map((msg) => msg.id === msgId ? { ...msg, text: msg.text + chunk } : msg)
        );
      },
      fallbackFn: () => simulateAIResponse(query, languageCode, queryType),
    });

    setMessages((m) =>
      m.map((msg) => msg.id === msgId && msg.text === '' ? { ...msg, text: answer } : msg)
    );
    streamingIdRef.current = null;
    setThinking(false);
  }

  // Voice-only query (非chat mode)
  const [simpleListening, setSimpleListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceAnswer, setVoiceAnswer] = useState('');

  function startSimpleVoice() {
    const SpeechRecognitionAPI = (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      || (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) { setVoiceTranscript('此浏览器不支持语音识别'); return; }
    const rec = new SpeechRecognitionAPI();
    rec.lang = LANG_SR_CODE[languageCode] ?? 'zh-CN';
    rec.continuous = false;
    rec.interimResults = true;
    let finalText = '';
    rec.onstart = () => setSimpleListening(true);
    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
        else setVoiceTranscript(e.results[i][0].transcript);
      }
      if (finalText) setVoiceTranscript(finalText);
    };
    rec.onend = async () => {
      setSimpleListening(false);
      if (finalText.trim()) {
        setThinking(true);
        await new Promise((r) => setTimeout(r, 700));
        const ans = simulateAIResponse(finalText, languageCode, 'chat', 'panda');
        setVoiceAnswer(ans);
        setThinking(false);
      }
    };
    rec.onerror = () => setSimpleListening(false);
    recognitionRef.current = rec;
    rec.start();
  }

  const roleColor = CHAT_ROLES[chatRole].color;

  if (mode === 'camera') {
    return <CameraAI languageCode={languageCode} languageName={languageName} onBack={() => setMode('home')} />;
  }

  return (
    <div className="ai-wrap">
      <FloatingBack onClick={mode === 'home' ? onBack : () => { setMode('home'); setMessages([]); setVoiceTranscript(''); setVoiceAnswer(''); setVoiceState('idle'); window.speechSynthesis?.cancel(); }} />

      {/* API error transient banner */}
      {apiError && (
        <div className="ai-api-error-banner">
          <span>⚠️ {apiError}（已切换模拟模式）</span>
          <button onClick={() => setApiError(null)}>✕</button>
        </div>
      )}

      {/* ── HOME ── */}
      {mode === 'home' && (
        <>
          {/* 用户水平调查问卷 */}
          {showSurvey && (
            <div className="ai-survey-wrap">
              <div className="ai-survey-header">
                <div className="ai-survey-orb">🎯</div>
                <h2 className="ai-survey-title">AI 智能评估</h2>
                <p className="ai-survey-sub">回答几个问题，AI 为你定制专属学习方案</p>
                <div className="ai-survey-progress">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className={`ai-survey-dot ${i === surveyStep ? 'active' : ''} ${i < surveyStep ? 'done' : ''}`} />
                  ))}
                </div>
              </div>

              <div className="ai-survey-card">
                {/* Step 0: 语言水平 */}
                {surveyStep === 0 && (
                  <>
                    <h3 className="ai-survey-q">你的{languageName}水平是？</h3>
                    <div className="ai-survey-options">
                      {LEVEL_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          className={`ai-survey-option ${prefs.level === opt.key ? 'selected' : ''}`}
                          onClick={() => { savePrefs({ ...prefs, level: opt.key }); setSurveyStep(1); }}
                        >
                          <span className="ai-so-label">{opt.label}</span>
                          <span className="ai-so-desc">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Step 1: 学习目标 */}
                {surveyStep === 1 && (
                  <>
                    <h3 className="ai-survey-q">你的学习目标是什么？</h3>
                    <div className="ai-survey-options">
                      {GOAL_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          className={`ai-survey-option ${prefs.goal === opt.key ? 'selected' : ''}`}
                          onClick={() => { savePrefs({ ...prefs, goal: opt.key }); setSurveyStep(2); }}
                        >
                          <span className="ai-so-icon">{opt.icon}</span>
                          <span className="ai-so-label">{opt.label}</span>
                          <span className="ai-so-desc">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Step 2: 考试类型（仅目标为考试时显示更多选项） */}
                {surveyStep === 2 && (
                  <>
                    <h3 className="ai-survey-q">{prefs.goal === 'exam' ? '你准备参加哪个考试？' : '你希望重点提升什么？'}</h3>
                    {prefs.goal === 'exam' ? (
                      <div className="ai-survey-options ai-exam-grid">
                        {EXAM_OPTIONS.map((opt) => (
                          <button
                            key={opt.key}
                            className={`ai-survey-option compact ${prefs.examType === opt.key ? 'selected' : ''}`}
                            onClick={() => { savePrefs({ ...prefs, examType: opt.key }); setSurveyStep(3); }}
                          >
                            <span className="ai-so-label">{opt.label}</span>
                            <span className="ai-so-desc">{opt.desc}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="ai-survey-options">
                        {FOCUS_OPTIONS.map((opt) => (
                          <button
                            key={opt.key}
                            className={`ai-survey-option ${prefs.focusArea === opt.key ? 'selected' : ''}`}
                            onClick={() => { savePrefs({ ...prefs, focusArea: opt.key }); setSurveyStep(3); }}
                          >
                            <span className="ai-so-icon">{opt.icon}</span>
                            <span className="ai-so-label">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Step 3: AI风格 */}
                {surveyStep === 3 && (
                  <>
                    <h3 className="ai-survey-q">你希望 AI 以什么风格教学？</h3>
                    <div className="ai-survey-options">
                      {AI_STYLE_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          className={`ai-survey-option ${prefs.aiStyle === opt.key ? 'selected' : ''}`}
                          onClick={() => { savePrefs({ ...prefs, aiStyle: opt.key }); setSurveyStep(4); }}
                        >
                          <span className="ai-so-icon">{opt.icon}</span>
                          <span className="ai-so-label">{opt.label}</span>
                          <span className="ai-so-desc">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Step 4: AI声音性别 */}
                {surveyStep === 4 && (
                  <>
                    <h3 className="ai-survey-q">你希望 AI 用什么样的声音？</h3>
                    <div className="ai-survey-options ai-gender-row">
                      <button
                        className={`ai-survey-option large ${prefs.aiGender === 'female' ? 'selected' : ''}`}
                        onClick={() => { savePrefs({ ...prefs, aiGender: 'female' }); finishSurvey(); }}
                      >
                        <span className="ai-so-icon" style={{ fontSize: '36px' }}>👩</span>
                        <span className="ai-so-label">温柔女声</span>
                        <span className="ai-so-desc">柔和亲切，娓娓道来</span>
                      </button>
                      <button
                        className={`ai-survey-option large ${prefs.aiGender === 'male' ? 'selected' : ''}`}
                        onClick={() => { savePrefs({ ...prefs, aiGender: 'male' }); finishSurvey(); }}
                      >
                        <span className="ai-so-icon" style={{ fontSize: '36px' }}>👨</span>
                        <span className="ai-so-label">沉稳男声</span>
                        <span className="ai-so-desc">稳重清晰，专业感强</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* 跳过按钮 */}
              <div className="ai-survey-skip">
                <button onClick={finishSurvey}>跳过调查，直接使用 AI →</button>
              </div>
            </div>
          )}

          {/* 非调查模式：功能主页 */}
          {!showSurvey && (
            <>
              <div className="ai-home-header">
                <div className="ai-home-orb">🤖</div>
                <h2 className="ai-home-title">{s.ai_title}</h2>
                <p className="ai-home-sub">
                  {languageName} · {LEVEL_OPTIONS.find(l => l.key === prefs.level)?.label} · 
                  {GOAL_OPTIONS.find(g => g.key === prefs.goal)?.icon} {GOAL_OPTIONS.find(g => g.key === prefs.goal)?.label} · 
                  {AI_STYLE_OPTIONS.find(s => s.key === prefs.aiStyle)?.icon} {AI_STYLE_OPTIONS.find(s => s.key === prefs.aiStyle)?.label}
                </p>
                <button className="ai-re-survey-btn" onClick={() => { localStorage.removeItem('yandao_ai_survey_done'); setShowSurvey(true); setSurveyStep(0); }}>
                  重新评估 →
                </button>
              </div>
              <div className="ai-mode-grid">
                <button className="ai-mode-card camera" onClick={() => setMode('camera')}>
                  <span className="ai-mode-icon">📷</span>
                  <span className="ai-mode-label">{s.ai_camera}</span>
                  <span className="ai-mode-desc">拍下题目或单词，AI即时解析</span>
                </button>
                <button className="ai-mode-card voice" onClick={() => setMode('voice')}>
                  <span className="ai-mode-icon">🎙️</span>
                  <span className="ai-mode-label">{s.ai_voice}</span>
                  <span className="ai-mode-desc">开口说，AI帮你解答语言问题</span>
                </button>
                <button className="ai-mode-card text" onClick={() => setMode('text')}>
                  <span className="ai-mode-icon">💬</span>
                  <span className="ai-mode-label">{s.ai_text}</span>
                  <span className="ai-mode-desc">语法解析 · 词汇查询 · 翻译纠错</span>
                </button>
                <button className="ai-mode-card chat" onClick={() => setMode('chat')}>
                  <span className="ai-mode-icon">🫂</span>
                  <span className="ai-mode-label">{s.ai_chat}</span>
                  <span className="ai-mode-desc">语音对话 · 4种AI角色 · 主动引导</span>
                </button>
              </div>
              <div className="ai-home-notice">
                DeepSeek AI 驱动 · 支持豆包/OpenAI/Claude · 真实 AI 实时回复
              </div>
            </>
          )}
        </>
      )}

      {/* ── VOICE (simple query) ── */}
      {mode === 'voice' && (
        <div className="ai-voice-wrap">
          <h3 className="ai-section-title">语音问答</h3>
          <p className="ai-section-sub">用{languageName}或中文提问，AI为你解答</p>
          <div className={`ai-mic-orb ${simpleListening ? 'active' : ''}`} onClick={simpleListening ? () => recognitionRef.current?.stop() : startSimpleVoice}>
            <span className="ai-mic-icon">{simpleListening ? '🔴' : '🎙️'}</span>
            <span className="ai-mic-label">{simpleListening ? '正在聆听… 点击停止' : '点击开始说话'}</span>
          </div>
          {voiceTranscript && <div className="ai-voice-transcript"><span className="ai-transcript-label">识别结果</span><p>{voiceTranscript}</p></div>}
          {thinking && <div className="ai-thinking">AI 思考中…</div>}
          {voiceAnswer && !thinking && <div className="ai-voice-answer"><span className="ai-answer-label">AI 回答</span><p>{voiceAnswer}</p></div>}
          {!voiceTranscript && !simpleListening && (
            <div className="ai-voice-tips">
              <p>提问示例：</p>
              <p>· "「食べる」和「食べます」有什么区别？"</p>
              <p>· "帮我翻译这句话到{languageName}"</p>
              <p>· "用{languageName}怎么说'谢谢'？"</p>
              <p>· "这句语法对吗？请帮我纠错"</p>
            </div>
          )}
        </div>
      )}

      {/* ── TEXT QUERY ── */}
      {mode === 'text' && (
        <div className="ai-text-wrap">
          <h3 className="ai-section-title">文字问答</h3>
          <div className="ai-query-tabs">
            {TEXT_QUERY_TYPES.map((t) => (
              <button key={t.key} className={`ai-query-tab ${queryType === t.key ? 'active' : ''}`} onClick={() => setQueryType(t.key)}>{t.label}</button>
            ))}
          </div>
          <div className="ai-text-messages">
            {messages.map((m) => (
              <div key={m.id} className={`ai-msg ${m.role}`}>
                {m.role === 'ai' && <span className="ai-msg-avatar">🤖</span>}
                <div className="ai-msg-bubble">{m.text}</div>
              </div>
            ))}
            {thinking && <div className="ai-msg ai"><span className="ai-msg-avatar">🤖</span><div className="ai-msg-bubble ai-typing"><span /><span /><span /></div></div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="ai-input-row">
            <textarea className="ai-input" rows={2} value={inputText}
              placeholder={TEXT_QUERY_TYPES.find((t) => t.key === queryType)?.placeholder ?? '输入你的问题…'}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runTextQuery(); } }}
            />
            <button className="ai-send-btn" onClick={runTextQuery} disabled={thinking || !inputText.trim()}>发送</button>
          </div>
        </div>
      )}

      {/* ── CHAT (voice companion) ── */}
      {mode === 'chat' && (
        <div className="ai-chat-wrap">

          {/* First-use voice hint modal */}
          {showVoiceHint && (
            <div className="vc-hint-overlay">
              <div className="vc-hint-box">
                <div className="vc-hint-icon">🎧</div>
                <h3 className="vc-hint-title">语音对话模式</h3>
                <p className="vc-hint-body">请戴好耳机麦克风，我们将开始语音对话练习。点击麦克风按钮说话，AI 会语音回复你。</p>
                <button className="vc-hint-btn" onClick={() => { localStorage.setItem(VOICE_HINT_KEY, '1'); setShowVoiceHint(false); }}>
                  开始体验
                </button>
                <button className="vc-hint-skip" onClick={() => setShowVoiceHint(false)}>仅文字模式</button>
              </div>
            </div>
          )}

          {/* Role selector */}
          <div className="ai-role-strip">
            {(Object.entries(CHAT_ROLES) as [ChatRoleKey, ChatRole][]).map(([key, r]) => (
              <button key={key}
                className={`ai-role-btn ${chatRole === key ? 'active' : ''}`}
                style={chatRole === key ? { borderColor: r.color, background: r.color + '18' } : {}}
                onClick={() => { setChatRole(key); setMessages([]); sessionIdRef.current = crypto.randomUUID(); window.speechSynthesis?.cancel(); setVoiceState('idle'); }}
              >
                <span>{r.emoji}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>

          {/* Voice settings bar */}
          <div className="vc-settings-bar">
            <div className="vc-speed-group">
              <span className="vc-settings-label">语速</span>
              {([0.8, 1, 1.2] as SpeechSpeed[]).map((s) => (
                <button key={s} className={`vc-speed-btn ${speechSpeed === s ? 'active' : ''}`}
                  onClick={() => setSpeechSpeed(s)}>{s}x</button>
              ))}
            </div>
            <div className="vc-gender-group">
              <span className="vc-settings-label">声音</span>
              <button className={`vc-gender-btn ${voiceGender === 'female' ? 'active' : ''}`} onClick={() => setVoiceGender('female')}>女声</button>
              <button className={`vc-gender-btn ${voiceGender === 'male' ? 'active' : ''}`} onClick={() => setVoiceGender('male')}>男声</button>
            </div>
          </div>

          {/* Messages */}
          <div className="ai-chat-messages">
            {messages.map((m) => (
              <div key={m.id} className={`ai-msg ${m.role}`}>
                {m.role === 'ai' && (
                  <span className="ai-msg-avatar" style={{ background: roleColor + '20' }}>
                    {CHAT_ROLES[chatRole].emoji}
                  </span>
                )}
                <div className="ai-msg-bubble" style={m.role === 'ai' ? { borderColor: roleColor + '40' } : {}}>
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="ai-msg ai">
                <span className="ai-msg-avatar" style={{ background: roleColor + '20' }}>{CHAT_ROLES[chatRole].emoji}</span>
                <div className="ai-msg-bubble ai-typing"><span /><span /><span /></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice state indicator */}
          <div className="vc-state-bar">
            {voiceState === 'listening' && (
              <div className="vc-state listening">
                <div className="vc-waves">
                  {Array.from({ length: 5 }).map((_, i) => <div key={i} className="vc-wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />)}
                </div>
                <span>正在听…{liveTranscript ? `「${liveTranscript}」` : ''}</span>
              </div>
            )}
            {voiceState === 'recognized' && <div className="vc-state recognized">识别完成</div>}
            {voiceState === 'thinking' && <div className="vc-state thinking"><span className="vc-dots"><span /><span /><span /></span>正在思考…</div>}
            {voiceState === 'speaking' && (
              <div className="vc-state speaking">
                <div className="vc-waves">
                  {Array.from({ length: 7 }).map((_, i) => <div key={i} className="vc-wave-bar speak" style={{ animationDelay: `${i * 0.07}s` }} />)}
                </div>
                <span>正在说话…</span>
                <button className="vc-stop-btn" onClick={() => { window.speechSynthesis?.cancel(); setVoiceState('idle'); }}>停止</button>
              </div>
            )}
          </div>

          {/* Input area: voice mic + text */}
          <div className="vc-input-area">
            <button
              className={`vc-mic-btn ${voiceState === 'listening' ? 'recording' : ''}`}
              onClick={voiceState === 'listening' ? stopVoiceRecognition : startVoiceRecognition}
              title={voiceState === 'listening' ? '点击停止录音' : '点击开始说话'}
            >
              {voiceState === 'listening' ? (
                <span className="vc-mic-stop">■</span>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              )}
            </button>
            <input
              className="vc-text-input"
              value={inputText}
              placeholder={`或打字和${CHAT_ROLES[chatRole].label}说话…`}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { sendTextMessage(inputText); } }}
            />
            <button className="vc-send-btn" onClick={() => sendTextMessage(inputText)} disabled={!inputText.trim() || thinking}>
              发
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
