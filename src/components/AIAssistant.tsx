import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FloatingBack } from './FloatingBack';
import { CameraAI } from './CameraAI';
import { supabase } from '../lib/supabase';
import { useUI } from '../lib/UILanguageContext';
import { logAICall, isOverBudget } from './AICostDashboard';
import { callAI, friendlyAIError, type AIMessage } from '../lib/aiClient';
import { loadVoicePreset, speakWithPreset } from '../lib/voiceProfile';

interface AIAssistantProps {
  languageCode: string;
  languageName: string;
  sessionKey?: string;
  onBack: () => void;
}

type AIMode = 'home' | 'camera' | 'voice' | 'text' | 'chat';
type ChatRoleKey = 'panda' | 'tsundere' | 'funny' | 'sweet';
type VoiceState = 'idle' | 'listening' | 'recognized' | 'thinking' | 'speaking';
type SpeechSpeed = 0.8 | 1 | 1.2;

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
    ja: [['苹果','りんご'],['猫','ねこ'],['学校','がっこう'],['水','みず']],
    ko: [['苹果','사과'],['猫','고양이'],['学校','학교'],['水','물']],
    fr: [['苹果','pomme'],['猫','chat'],['学校','école'],['水','eau']],
    es: [['苹果','manzana'],['猫','gato'],['学校','escuela'],['水','agua']],
    de: [['苹果','Apfel'],['猫','Katze'],['学校','Schule'],['水','Wasser']],
    it: [['苹果','mela'],['猫','gatto'],['学校','scuola'],['水','acqua']],
    pt: [['苹果','maçã'],['猫','gato'],['学校','escola'],['水','água']],
    en: [['苹果','apple'],['猫','cat'],['学校','school'],['水','water']],
    zh: [['Hello','你好'],['Cat','猫'],['School','学校'],['Water','水']],
    ar: [['苹果','تفاحة'],['猫','قطة'],['学校','مدرسة'],['水','ماء']],
  };

  if (mode === 'grammar') return `【语法分析】「${input}」\n\n结构拆解：主语 + 谓语 + 宾语\n时态：一般现在时\n关键词「${input.slice(0,4)}」属于${lang}核心词汇\n\n建议：尝试加入形容词让表达更丰富。`;
  if (mode === 'vocab') return `【词汇解析】「${input}」\n\n${lang}常用词，日常对话高频\n\n例句1：在日常场景中「${input}」使用很自然。\n例句2：可以搭配不同形容词扩展表达。\n\n记忆技巧：用场景联想法记忆。`;
  if (mode === 'translate') return `【翻译结果】\n\n原文：${input}\n\n${lang}译文：「${input}」在${lang}中表达自然，含义明确。\n\n注意：接入真实翻译API后将提供精准译文。`;
  if (mode === 'correct') return `【纠错建议】\n\n你的句子：「${input}」\n\n改进点：词序可以调整，更符合${lang}语感；动词形式建议使用礼貌体。\n\n修正后：「${input}（已优化）」\n\n继续加油！`;

  if (mode === 'chat') {
    const vocab = (VOCAB_TIPS[langCode] ?? VOCAB_TIPS.en)[Math.floor(Math.random() * 4)];
    const prevContext = history && history.length > 2
      ? history[history.length - 2].text.slice(0, 30)
      : null;

    const roleResponses: Record<ChatRoleKey, string[]> = {
      panda: [
        `很好！你说的「${input}」让我想到了一个练习～「${vocab[0]}」用${lang}说是「${vocab[1]}」哦，没关系慢慢来！`,
        `已经很棒了！${prevContext ? `你之前提到「${prevContext}」，` : ''}今天我们来练习一个常用表达：「${vocab[1]}」，你能造个句子吗？`,
        `再来一次！「${input}」的表达可以更自然～试试用「${vocab[1]}」造个句子吧 🐼`,
        `注意语序哦！${lang}里「${vocab[0]}」说成「${vocab[1]}」，你掌握了吗？`,
      ],
      tsundere: [
        `这都不会？「${input}」明显有问题！「${vocab[0]}」的${lang}说法是「${vocab[1]}」，记住了吗！`,
        `笨死了……${prevContext ? `你刚说「${prevContext}」，` : ''}连「${vocab[1]}」都说不好，赶快练！`,
        `答案是「${vocab[1]}」，还要我说几遍？「${input}」这种错误下次不能再犯了！`,
        `……勉强说得过去吧。不过「${vocab[0]}」要说「${vocab[1]}」，这个你得记住！`,
      ],
      funny: [
        `哦吼！「${input}」？绝绝子！话说「${vocab[0]}」用${lang}说是「${vocab[1]}」，谐音记忆法：${vocab[1].slice(0,3)}→"${['针不戳','嗷嗷踹','嗯嗯哈'][Math.floor(Math.random()*3)]}"，笑死！`,
        `针不戳！不过「${vocab[0]}」是「${vocab[1]}」，这个冷知识你知道吗！${prevContext ? `（跟你说的「${prevContext}」有关）` : ''}笑死本人了！`,
        `我的老天爷！「${input}」来了！快用「${vocab[1]}」造个句子，造不出来罚你转圈圈！`,
        `哈哈哈！今日份谐音梗：「${vocab[1]}」≈"${['我爱你','吃饭了吗','你好棒棒'][Math.floor(Math.random()*3)]}"，绝绝子！`,
      ],
      sweet: [
        `宝贝说得对❤️ 对了，「${vocab[0]}」用${lang}说是「${vocab[1]}」哦，学会了奖励你一个么么哒~`,
        `想你啦！${prevContext ? `你刚才说「${prevContext}」，` : ''}我们来练习「${vocab[1]}」好不好，宝贝？`,
        `你真的好棒❤️ 「${input}」已经很好了～「${vocab[0]}」还可以说「${vocab[1]}」，你知道吗～`,
        `么么哒！今天的${lang}练习：「${vocab[1]}」。宝贝学会了吗？我超喜欢陪你练习的❤️`,
      ],
    };
    const arr = roleResponses[role ?? 'panda'];
    return arr[Math.floor(Math.random() * arr.length)];
  }

  return `收到：「${input}」。（AI回复模拟中）`;
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

// Memory helpers
async function loadMemory(sessionKey: string): Promise<Record<string, string>> {
  const { data } = await supabase
    .from('ai_conversation_memory')
    .select('memory_key, memory_value')
    .eq('session_key', sessionKey);
  if (!data) return {};
  return Object.fromEntries(data.map((r: { memory_key: string; memory_value: string }) => [r.memory_key, r.memory_value]));
}

async function saveMemory(sessionKey: string, key: string, value: string) {
  await supabase.from('ai_conversation_memory').upsert(
    { session_key: sessionKey, memory_key: key, memory_value: value, updated_at: new Date().toISOString() },
    { onConflict: 'session_key,memory_key' },
  );
}

async function saveConversationMsg(sessionKey: string, role: ChatRoleKey, sender: 'user' | 'ai', content: string, langCode: string, sessionId: string) {
  await supabase.from('ai_conversations').insert({
    session_key: sessionKey, role, sender, content, lang_code: langCode, session_id: sessionId,
  });
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ languageCode, languageName, sessionKey = 'guest', onBack }) => {
  const { s } = useUI();
  const [mode, setMode] = useState<AIMode>('home');
  const [chatRole, setChatRole] = useState<ChatRoleKey>('panda');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [queryType, setQueryType] = useState('grammar');
  const [thinking, setThinking] = useState(false);

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
    loadMemory(sessionKey).then(setMemory);
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
          <div className="ai-home-header">
            <div className="ai-home-orb">🤖</div>
            <h2 className="ai-home-title">{s.ai_title}</h2>
            <p className="ai-home-sub">{languageName} · 智能问答 · 全天候陪伴</p>
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
            支持豆包 / Claude / OpenAI · 在创始人后台「AI配置」中填写密钥即可启用真实回复
          </div>
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
              <p>· "帮我翻译这句话"</p>
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
