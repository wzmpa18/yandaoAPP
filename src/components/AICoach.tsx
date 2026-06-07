import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FloatingBack } from './FloatingBack';
import { callAI } from '../lib/aiClient';
import { speakWithPreset, stopSpeaking } from '../lib/voiceProfile';

interface AICoachProps {
  langCode: string;
  langName: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  onBack: () => void;
}

type RoleKey = 'panda' | 'tsundere' | 'funny' | 'sweet';

interface Role {
  key: RoleKey;
  name: string;
  emoji: string;
  color: string;
  desc: string;
  templates: string[];
  greet: string;
}

const ROLES: Role[] = [
  {
    key: 'panda',
    name: '熊猫老师',
    emoji: '🐼',
    color: '#3B82FF',
    desc: '温柔耐心，鼓励为主',
    greet: '你好呀！我是熊猫老师，一起加油吧～有什么不懂的都可以问我哦！',
    templates: [
      '你说得很好！继续保持！加油～',
      '不要气馁，错了也没关系，重要的是你在努力！',
      '这个知识点有点难，我们再来一遍吧！',
      '哇，进步好快！熊猫为你骄傲！',
      '你已经掌握了很多词汇了！',
      '学语言就像种花，需要耐心浇水～',
      '今天学了什么新词？说来听听！',
      '正确！你真的很厉害！',
      '再想想？提示：和昨天学的有点像哦～',
      '每天坚持学习，一定能成功的！',
    ],
  },
  {
    key: 'tsundere',
    name: '毒舌傲娇',
    emoji: '😤',
    color: '#FF3B6B',
    desc: '刻薄但有用，刺激型',
    greet: '……你居然来找我练习？算了，看在你还算认真的份上，我教你吧。不准出糗哦！',
    templates: [
      '就这？连这个都不会？……算了，我再给你解释一遍！',
      '还不错嘛，才刚刚合格而已！',
      '哼，终于答对了，花了你好长时间！',
      '这题你都答错了？真是让人失望……不过我告诉你怎么记！',
      '……还行吧。我承认你最近有进步。就一点点。',
      '别骄傲！这才哪到哪，难的还在后面！',
      '你这么说是不对的，正确的说法是……记住了吗？',
      '我说什么来着？你终于肯听了？',
      '你要是学不好，别说你认识我！加把劲！',
      '……这次发挥不错。就这一次哦！',
    ],
  },
  {
    key: 'funny',
    name: '搞笑朋友',
    emoji: '😂',
    color: '#FF9500',
    desc: '幽默搞怪，网梗风格',
    greet: '嘿！我是你的搞笑陪练！准备好被我整笑了吗？学语言嘛，快乐第一，正确第二！（bushi）',
    templates: [
      '哇你答对了！感动哭了（假的）',
      '这个答案……我只能说，很有创意（不是）',
      '答错了？没事，连我都能学会，你肯定也行（信我）',
      '这个语法点很重要！但先让我讲个笑话……算了不讲了，先学习！',
      '你这个回答让我想到了一个梗……总之是对的！好家伙！',
      '正确！你已经超越了99%的……路人甲（逃）',
      '这道题难度堪比高考……其实不是，正确答案很简单，瞧！',
      '学语言就像打游戏，你刚刚升级了！叮～',
      '哦豁，答错了！没事！来，再来！',
      '就这？就这！就这！……（真的很好了！）',
    ],
  },
  {
    key: 'sweet',
    name: '甜蜜恋人',
    emoji: '💕',
    color: '#E88DC3',
    desc: '土味情话，恋爱感',
    greet: '嗨～你来啦！我等你好久了呢。今天一起学语言吧，有我陪着你，一点都不难～',
    templates: [
      '你说得这么好听，害我都记住了……是词汇哦！',
      '答对了！就知道你最棒了，一直都是～',
      '没关系啦，答错了我陪你再来，反正我哪儿也不去！',
      '你的声音好好听，再读一遍好吗？（不是为了学习）',
      '学语言这件事，因为你才变得甜甜的！',
      '这个词的意思是…… 不告诉你！先给我一个笑容！（才怪，认真学！）',
      '你今天学了好多，我好骄傲！你是我见过最努力的人～',
      '答错了也没关系，你永远是我眼里最棒的！再来一次！',
      '这道题……嗯，就像我们一样，需要配合才能完整！',
      '今天的你又进步了，我喜欢这样的你！',
    ],
  },
];

// Practice sentences for pronunciation scoring
const PRACTICE_SENTENCES: Record<string, { text: string; keywords: string[] }[]> = {
  ja: [
    { text: 'ありがとうございます', keywords: ['ありがとう', 'ございます'] },
    { text: 'よろしくお願いします', keywords: ['よろしく', 'お願い'] },
    { text: 'すみません、電車はどこですか', keywords: ['すみません', '電車', 'どこ'] },
  ],
  ko: [
    { text: '안녕하세요, 반갑습니다', keywords: ['안녕', '반갑'] },
    { text: '감사합니다', keywords: ['감사'] },
    { text: '어디에 화장실이 있어요?', keywords: ['어디', '화장실'] },
  ],
  fr: [
    { text: 'Bonjour, comment allez-vous?', keywords: ['bonjour', 'comment', 'allez'] },
    { text: 'Merci beaucoup', keywords: ['merci', 'beaucoup'] },
    { text: 'Où est la gare?', keywords: ['gare', 'est'] },
  ],
  es: [
    { text: 'Hola, ¿cómo estás?', keywords: ['hola', 'como', 'estas'] },
    { text: 'Muchas gracias', keywords: ['gracias'] },
    { text: '¿Dónde está el baño?', keywords: ['donde', 'bano', 'baño'] },
  ],
  de: [
    { text: 'Guten Morgen, wie geht es Ihnen?', keywords: ['guten', 'morgen', 'wie', 'geht'] },
    { text: 'Danke schön', keywords: ['danke'] },
    { text: 'Wo ist der Bahnhof?', keywords: ['bahnhof', 'wo'] },
  ],
  en: [
    { text: 'Nice to meet you!', keywords: ['nice', 'meet'] },
    { text: 'Thank you very much', keywords: ['thank', 'much'] },
    { text: 'Where is the nearest subway station?', keywords: ['where', 'subway', 'station'] },
  ],
  it: [
    { text: 'Buongiorno, come stai?', keywords: ['buongiorno', 'come'] },
    { text: 'Grazie mille', keywords: ['grazie'] },
    { text: 'Dov\'è la stazione?', keywords: ['dove', 'stazione'] },
  ],
  pt: [
    { text: 'Bom dia, tudo bem?', keywords: ['bom', 'dia', 'tudo', 'bem'] },
    { text: 'Muito obrigado', keywords: ['obrigado'] },
    { text: 'Onde fica a estação?', keywords: ['onde', 'estacao', 'estação'] },
  ],
  zh: [
    { text: '你好，很高兴认识你', keywords: ['你好', '高兴', '认识'] },
    { text: '非常感谢', keywords: ['感谢', '谢谢'] },
    { text: '请问地铁站在哪里', keywords: ['地铁', '哪里'] },
  ],
  ar: [
    { text: 'السلام عليكم', keywords: ['السلام', 'عليكم'] },
    { text: 'شكراً جزيلاً', keywords: ['شكراً', 'جزيلاً'] },
    { text: 'أين محطة القطار؟', keywords: ['أين', 'محطة'] },
  ],
};

const LANG_SR_CODE: Record<string, string> = {
  ja: 'ja-JP', ko: 'ko-KR', fr: 'fr-FR', es: 'es-ES',
  de: 'de-DE', it: 'it-IT', pt: 'pt-BR', ar: 'ar-SA',
  zh: 'zh-CN', en: 'en-US',
};

const MIC_HINT_KEY = 'yandao_mic_hint_v1';

type VoiceStatus = 'idle' | 'recording' | 'recognized' | 'failed';
type PronScore = 'accurate' | 'ok' | 'retry' | null;

interface Message {
  from: 'user' | 'ai';
  text: string;
  ts: number;
  score?: PronScore;
}

function scorePronunciation(transcript: string, keywords: string[]): PronScore {
  const t = transcript.toLowerCase();
  const matched = keywords.filter((kw) => t.includes(kw.toLowerCase())).length;
  const ratio = matched / keywords.length;
  if (ratio >= 0.8) return 'accurate';
  if (ratio >= 0.4) return 'ok';
  return 'retry';
}

function pickTemplate(role: Role, input: string): string {
  if (input.length === 0) return role.greet;
  const idx = Math.floor(Math.random() * role.templates.length);
  return role.templates[idx];
}

const ROLE_SYSTEM_PROMPTS: Record<RoleKey, string> = {
  panda: '你是一只温柔的熊猫老师，教用户学习外语。你总是鼓励、耐心、正面积极。回答要简短（2-3句），使用表情符号。',
  tsundere: '你是一个毒舌傲娇的语言陪练。表面上很刻薄但其实很关心用户。回答要简短毒舌但有帮助（2-3句），可以带一点傲娇语气。',
  funny: '你是一个搞笑的语伴朋友。说话幽默，喜欢用网络梗。回答要简短有趣（2-3句），让人开心。',
  sweet: '你是一个甜蜜的语伴，说话温柔像恋人一样。回答要甜蜜温暖（2-3句），给人鼓励和爱意。',
};

async function aiGenerateResponse(role: RoleKey, input: string, langCode: string, level: string): Promise<string> {
  if (!input.trim()) return ROLES.find(r => r.key === role)?.greet || '你好！';
  
  try {
    const systemPrompt = ROLE_SYSTEM_PROMPTS[role];
    const levelLabel = level === 'beginner' ? '初级' : level === 'intermediate' ? '中级' : '高级';
    const response = await callAI([
      { role: 'system', content: `${systemPrompt}\n[用户语言]: ${langCode}\n[用户水平]: ${levelLabel}` },
      { role: 'user', content: input }
    ], { max_tokens: 200 });
    if (response && response.trim()) return response.trim();
  } catch (e) {
    // AI 不可用，降级到模板
    console.warn('AICoach: AI调用失败，使用模板回复', e);
  }
  const roleData = ROLES.find(r => r.key === role);
  return roleData ? pickTemplate(roleData, input) : '抱歉，我暂时无法回答。';
}

export const AICoach: React.FC<AICoachProps> = ({ langCode, langName, userLevel, onBack }) => {
  const [selectedRole, setSelectedRole] = useState<RoleKey>('panda');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionStart] = useState(Date.now());
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [ttsSpeaking, setTtsSpeaking] = useState(false);

  // Voice state
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [voiceText, setVoiceText] = useState('');
  const [showMicHint, setShowMicHint] = useState(false);
  const [micHintDismissed, setMicHintDismissed] = useState(
    () => localStorage.getItem(MIC_HINT_KEY) === 'dismissed'
  );

  // Pronunciation practice
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceSentenceIdx, setPracticeSentenceIdx] = useState(0);
  const [pronScore, setPronScore] = useState<PronScore>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const role = ROLES.find((r) => r.key === selectedRole)!;
  const sentences = PRACTICE_SENTENCES[langCode] ?? PRACTICE_SENTENCES['en'];
  const currentSentence = sentences[practiceSentenceIdx];

  useEffect(() => {
    setMessages([{ from: 'ai', text: role.greet, ts: Date.now() }]);
  }, [selectedRole, role.greet]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    const userMsg: Message = { from: 'user', text: msg, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setVoiceText('');
    setVoiceStatus('idle');
    setLoading(true);
    const reply = await aiGenerateResponse(selectedRole, msg, langCode, userLevel);
    setMessages((m) => [...m, { from: 'ai', text: reply, ts: Date.now() }]);
    setLoading(false);
    // TTS 朗读 AI 回复
    if (ttsEnabled && reply) {
      setTtsSpeaking(true);
      speakWithPreset(reply, langCode).finally(() => setTtsSpeaking(false));
    }
  }

  const startVoiceInput = useCallback(() => {
    // Show first-use hint
    if (!micHintDismissed) {
      setShowMicHint(true);
      return;
    }
    beginRecognition(false);
  }, [micHintDismissed]); // eslint-disable-line react-hooks/exhaustive-deps

  function beginRecognition(forPronunciation: boolean) {
    const SRClass = (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      || (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SRClass) {
      setVoiceStatus('failed');
      setVoiceText('此浏览器不支持语音识别，请使用 Chrome 或 Safari');
      return;
    }

    if (voiceStatus === 'recording') {
      recognitionRef.current?.stop();
      return;
    }

    const rec = new SRClass();
    rec.lang = LANG_SR_CODE[langCode] ?? 'en-US';
    rec.continuous = false;
    rec.interimResults = true;

    rec.onstart = () => {
      setVoiceStatus('recording');
      setVoiceText('');
      setPronScore(null);
    };

    rec.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results).map((r) => r[0].transcript).join('');
      setVoiceText(transcript);
    };

    rec.onend = () => {
      setVoiceStatus((prev) => {
        if (prev === 'recording') {
          // Will be set to recognized/failed after text check
        }
        return prev;
      });
      // Use a ref snapshot via setTimeout to read latest voiceText
      setTimeout(() => {
        setVoiceText((t) => {
          if (t.trim()) {
            setVoiceStatus('recognized');
            if (forPronunciation && currentSentence) {
              const score = scorePronunciation(t, currentSentence.keywords);
              setPronScore(score);
            } else {
              setInput(t);
            }
          } else {
            setVoiceStatus('failed');
          }
          return t;
        });
      }, 100);
    };

    rec.onerror = () => {
      setVoiceStatus('failed');
      setVoiceText('');
    };

    recognitionRef.current = rec;
    rec.start();
  }

  function stopRecording() {
    recognitionRef.current?.stop();
  }

  function dismissMicHint(permanently: boolean) {
    setShowMicHint(false);
    if (permanently) {
      localStorage.setItem(MIC_HINT_KEY, 'dismissed');
      setMicHintDismissed(true);
    }
    beginRecognition(false);
  }

  function startPronunciationPractice() {
    setPracticeMode(true);
    setPronScore(null);
    setVoiceStatus('idle');
    setVoiceText('');
  }

  function nextSentence() {
    setPracticeSentenceIdx((i) => (i + 1) % sentences.length);
    setPronScore(null);
    setVoiceStatus('idle');
    setVoiceText('');
  }

  function endSession() {
    const dur = Math.round((Date.now() - sessionStart) / 1000);
    setSessionDuration(dur);
    setShowBadge(true);
  }

  const scoreLabel: Record<NonNullable<PronScore>, string> = {
    accurate: '🎯 准确！发音很棒',
    ok: '📖 还行，继续练习',
    retry: '🔄 再试一次，更清晰一点',
  };

  return (
    <div className="aic-shell">
      <FloatingBack onClick={onBack} />

      <div className="aic-header">
        <h2 className="aic-title">AI 陪练</h2>
        <p className="aic-sub">{langName} · {userLevel === 'beginner' ? '初级' : userLevel === 'intermediate' ? '中级' : '高级'}</p>
      </div>

      {/* Role selector */}
      <div className="aic-roles">
        {ROLES.map((r) => (
          <button
            key={r.key}
            className={`aic-role-btn ${selectedRole === r.key ? 'active' : ''}`}
            style={{ borderColor: selectedRole === r.key ? r.color : undefined }}
            onClick={() => setSelectedRole(r.key)}
          >
            <span className="aic-role-emoji">{r.emoji}</span>
            <span className="aic-role-name">{r.name}</span>
          </button>
        ))}
      </div>

      <div className="aic-role-desc">{role.emoji} {role.name}：{role.desc}</div>

      {/* Pronunciation practice panel */}
      {practiceMode && (
        <div className="aic-pron-panel">
          <div className="aic-pron-header">
            <span className="aic-pron-label">跟读练习</span>
            <button className="aic-pron-close" onClick={() => { setPracticeMode(false); setVoiceStatus('idle'); }}>✕</button>
          </div>
          <div className="aic-pron-sentence">{currentSentence.text}</div>
          <div className="aic-pron-actions">
            <button
              className={`aic-pron-mic ${voiceStatus === 'recording' ? 'recording' : ''}`}
              onClick={() => voiceStatus === 'recording' ? stopRecording() : beginRecognition(true)}
            >
              {voiceStatus === 'recording' ? (
                <><span className="aic-mic-wave" /><span className="aic-mic-wave" /><span className="aic-mic-wave" /></>
              ) : '🎤'}
            </button>
            <button className="aic-pron-next" onClick={nextSentence}>换一句 →</button>
          </div>
          {voiceStatus === 'recording' && (
            <div className="aic-voice-status recording">正在聆听… 请跟读上面的句子</div>
          )}
          {voiceStatus === 'recognized' && voiceText && (
            <div className="aic-voice-status recognized">✓ 已识别：{voiceText}</div>
          )}
          {voiceStatus === 'failed' && (
            <div className="aic-voice-status failed">😅 没听清，请再说一遍</div>
          )}
          {pronScore && (
            <div className={`aic-pron-score ${pronScore}`}>{scoreLabel[pronScore]}</div>
          )}
        </div>
      )}

      {/* Chat area */}
      <div className="aic-chat">
        {messages.map((m, i) => (
          <div key={i} className={`aic-msg ${m.from}`}>
            {m.from === 'ai' && <span className="aic-msg-avatar">{role.emoji}</span>}
            <div className="aic-msg-bubble">{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="aic-msg ai">
            <span className="aic-msg-avatar">{role.emoji}</span>
            <div className="aic-msg-bubble aic-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Voice status bar */}
      {voiceStatus !== 'idle' && !practiceMode && (
        <div className={`aic-voice-bar ${voiceStatus}`}>
          {voiceStatus === 'recording' && (
            <span className="aic-voice-bar-text">
              <span className="aic-rec-dot" />
              正在录音…
              <span className="aic-wave-group">
                <span className="aic-mic-wave" /><span className="aic-mic-wave" /><span className="aic-mic-wave" />
              </span>
            </span>
          )}
          {voiceStatus === 'recognized' && voiceText && (
            <span className="aic-voice-bar-text recognized">✓ 已识别：{voiceText}</span>
          )}
          {voiceStatus === 'failed' && (
            <span className="aic-voice-bar-text failed">😅 没听清，请再说一遍</span>
          )}
        </div>
      )}

      {/* Input area */}
      <div className="aic-input-row">
        <button
          className={`aic-mic-btn ${voiceStatus === 'recording' ? 'recording' : ''}`}
          onClick={voiceStatus === 'recording' ? stopRecording : startVoiceInput}
          title={voiceStatus === 'recording' ? '点击停止录音' : '语音输入'}
        >
          {voiceStatus === 'recording'
            ? <span className="aic-mic-active" />
            : '🎤'}
        </button>
        <input
          className="aic-input"
          value={input}
          placeholder={`用${langName}说点什么…`}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="aic-send-btn" onClick={() => sendMessage()} disabled={!input.trim()}>发送</button>
      </div>

      <div className="aic-bottom-actions">
        <button className={`aic-tts-toggle ${ttsEnabled ? 'on' : ''}`}
          onClick={() => { setTtsEnabled(!ttsEnabled); if (ttsEnabled) stopSpeaking(); }}
          title={ttsEnabled ? '关闭语音朗读' : '开启语音朗读'}>
          {ttsEnabled ? '🔊 语音开' : '🔇 语音关'}
        </button>
        {!practiceMode && (
          <button className="aic-pron-trigger" onClick={startPronunciationPractice}>🎯 发音跟读练习</button>
        )}
        <button className="aic-end-btn" onClick={endSession}>结束对话 →</button>
      </div>

      {/* First-use mic hint modal */}
      {showMicHint && (
        <div className="aic-overlay" onClick={() => setShowMicHint(false)}>
          <div className="aic-mic-hint" onClick={(e) => e.stopPropagation()}>
            <div className="aic-hint-icon">🎧</div>
            <h3 className="aic-hint-title">语音对话练习提示</h3>
            <p className="aic-hint-body">
              请戴好耳机／麦克风，我们将开始语音对话练习。<br />
              请对着麦克风清晰说出你的答案或问题。
            </p>
            <div className="aic-hint-actions">
              <button className="aic-hint-confirm" onClick={() => dismissMicHint(true)}>我知道了</button>
              <button className="aic-hint-later" onClick={() => { setShowMicHint(false); beginRecognition(false); }}>稍后提醒</button>
            </div>
          </div>
        </div>
      )}

      {/* Session summary */}
      {showBadge && (
        <div className="aic-overlay" onClick={() => setShowBadge(false)}>
          <div className="aic-summary" onClick={(e) => e.stopPropagation()}>
            <span className="aic-summary-icon">🏅</span>
            <h3>今日对话完成！</h3>
            <p>对话时长：{sessionDuration} 秒</p>
            <p>消息数：{messages.filter((m) => m.from === 'user').length} 条</p>
            <div className="aic-courage-badge">🦁 勇气勋章 × 1</div>
            <button className="aic-close-btn" onClick={onBack}>返回</button>
          </div>
        </div>
      )}
    </div>
  );
};
