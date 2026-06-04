import React, { useState, useRef, useEffect, useCallback } from 'react';
import { callAI, type AIMessage } from '../lib/aiClient';
import { speakWithPreset, stopSpeaking } from '../lib/voiceProfile';

interface GlobalAIChatProps {
  languageCode: string;
  languageName: string;
  initialContext?: string;
  onClose?: () => void;
}

interface QuickAction {
  icon: string;
  label: string;
  prompt: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: '🔤', label: '翻译这句话', prompt: '请帮我翻译成学习语言：' },
  { icon: '📝', label: '解释语法', prompt: '请帮我分析这句话的语法结构：' },
  { icon: '💬', label: '对话练习', prompt: '我们来做一个简短的对话练习吧！你先开始' },
  { icon: '📖', label: '单词查询', prompt: '请解释这个单词的含义和用法：' },
  { icon: '🎯', label: '出练习题', prompt: '根据我的水平出5道练习题' },
  { icon: '✍️', label: '帮我纠错', prompt: '请帮我检查这段话有没有错误：' },
];

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  ts: number;
}

const LANG_NAMES: Record<string, string> = {
  ja: '日语', ko: '韩语', fr: '法语', es: '西班牙语',
  de: '德语', it: '意大利语', pt: '葡萄牙语', ar: '阿拉伯语',
  zh: '中文', en: '英语',
};

export const GlobalAIChat: React.FC<GlobalAIChatProps> = ({
  languageCode,
  languageName,
  initialContext,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const lang = LANG_NAMES[languageCode] || languageName;

  // Open panel and auto-send initial context
  useEffect(() => {
    if (initialContext) {
      setIsOpen(true);
      const userMsg: Message = {
        id: `gc${Date.now()}`,
        role: 'user',
        text: initialContext,
        ts: Date.now(),
      };
      setMessages([userMsg]);
      sendToAI(initialContext, [userMsg]);
    }
  }, [initialContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendToAI = useCallback(async (text: string, currentMessages: Message[]) => {
    setLoading(true);

    const systemPrompt = `你是"言道 Gendou"语言学习助手中的全局AI助手。用户正在学习${lang}(${languageCode})。
你的任务是用简洁、友好的中文回复用户问题，并在适当的时候给出${lang}的例句。
回复要简明扼要，一般不超过200字。如果用户想练习对话，用${lang}回复并附中文翻译。`;

    const history: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ];

    try {
      const reply = await callAI(history);
      const aiMsg: Message = {
        id: `gai${Date.now()}`,
        role: 'ai',
        text: reply || `抱歉，AI暂时不可用。试试在"AI助手"页面获取更好的体验~\n\n关于"${text.slice(0, 30)}"：建议通过聊天模式练习${lang}表达。`,
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // Fallback responses
      const fallbacks: Record<string, string> = {
        '翻译': `[翻译建议] 输入要翻译的内容，我可以帮你翻译成${lang}。\n比如试试："你好怎么说？"`,
        '语法': `[语法助手] 输入你想分析的句子，我会拆解它的语法结构。\n比如试试："分析'私\u306f学生です'的语法"`,
        '练习': `[对话练习] 好的！用${lang}回复我吧：\n「こんにちは！元気ですか？」（你好！你还好吗？）`,
        '单词': `[单词查询] 输入你想查的单词，我给你释义+例句。\n比如试试："apple是什么意思？"`,
        '题': `[出题模式] 我可以生成${lang}的选择题、填空题、连线题。\n告诉我想练什么类型～`,
        '错': `[纠错模式] 把你写的句子发给我，我会逐句批改。\n别怕犯错，每次错误都是进步的机会！`,
      };
      const matchKey = Object.keys(fallbacks).find(k => text.includes(k));
      const fallback = matchKey
        ? fallbacks[matchKey]
        : `收到你的问题：「${text.slice(0, 40)}${text.length > 40 ? '...' : ''}」\n\n这是个好问题！$\{lang}表达可以参考相关词汇和场景练习。在"AI助手"页面有更多功能：语法解析、词汇查询、翻译纠错、AI对话陪练～`;

      const aiMsg: Message = {
        id: `gai${Date.now()}`,
        role: 'ai',
        text: fallback,
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }
    setLoading(false);
  }, [lang, languageCode]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || loading) return;
    const userMsg: Message = {
      id: `gu${Date.now()}`,
      role: 'user',
      text,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    sendToAI(text, messages);
  }, [inputText, loading, messages, sendToAI]);

  const handleQuickAction = useCallback((prompt: string) => {
    const fullPrompt = prompt + (inputText.trim() || '');
    const userMsg: Message = {
      id: `gu${Date.now()}`,
      role: 'user',
      text: fullPrompt,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    sendToAI(fullPrompt, messages);
  }, [inputText, messages, sendToAI]);

  const handleSpeak = async (text: string) => {
    if (speaking) { stopSpeaking(); setSpeaking(false); return; }
    setSpeaking(true);
    await speakWithPreset(text, languageCode);
    setSpeaking(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          className="gai-float-btn"
          onClick={() => setIsOpen(true)}
          title="AI 助手"
        >
          <span className="gai-float-orb">🤖</span>
          <span className="gai-float-label">AI</span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="gai-panel">
          <div className="gai-panel-header">
            <div className="gai-panel-title">
              <span>🤖</span>
              <span>AI 助手</span>
              <span className="gai-panel-lang">{lang}</span>
            </div>
            <button className="gai-panel-close" onClick={handleClose}>✕</button>
          </div>

          <div className="gai-panel-body">
            {messages.length === 0 ? (
              <div className="gai-welcome">
                <p className="gai-welcome-icon">🤖</p>
                <p className="gai-welcome-title">你好！我是你的{lang}学习助手</p>
                <p className="gai-welcome-sub">可以问我任何关于{lang}的问题</p>
                <div className="gai-quick-actions">
                  {QUICK_ACTIONS.map((action, i) => (
                    <button
                      key={i}
                      className="gai-quick-btn"
                      onClick={() => handleQuickAction(action.prompt)}
                    >
                      <span>{action.icon}</span>
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="gai-messages">
                {messages.map((m) => (
                  <div key={m.id} className={`gai-msg ${m.role}`}>
                    {m.role === 'ai' && <span className="gai-msg-avatar">🤖</span>}
                    <div className="gai-msg-content">
                      <div className="gai-msg-bubble">{m.text}</div>
                      {m.role === 'ai' && (
                        <button
                          className={`gai-speak-btn ${speaking ? 'active' : ''}`}
                          onClick={() => handleSpeak(m.text)}
                        >
                          {speaking ? '⏹' : '🔊'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="gai-msg ai">
                    <span className="gai-msg-avatar">🤖</span>
                    <div className="gai-msg-bubble gai-typing">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="gai-panel-footer">
            <div className="gai-quick-bar">
              {QUICK_ACTIONS.slice(0, 4).map((action, i) => (
                <button
                  key={i}
                  className="gai-quick-mini"
                  onClick={() => handleQuickAction(action.prompt)}
                  title={action.label}
                >
                  {action.icon}
                </button>
              ))}
            </div>
            <div className="gai-input-row">
              <input
                className="gai-input"
                value={inputText}
                placeholder={`问关于${lang}的问题...`}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                className="gai-send-btn"
                onClick={handleSend}
                disabled={!inputText.trim() || loading}
              >
                发送
              </button>
            </div>
            <button className="gai-open-full" onClick={handleClose}>
              打开完整AI助手 →
            </button>
          </div>
        </div>
      )}
    </>
  );
};
