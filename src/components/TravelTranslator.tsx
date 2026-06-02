import React, { useState, useRef, useEffect } from 'react';
import { FloatingBack } from './FloatingBack';

interface TravelTranslatorProps {
  languageCode: string;
  languageName: string;
  onBack: () => void;
}

interface BubblePair {
  source: string;
  sourceLang: string;
  target: string;
  targetLang: string;
  timestamp: number;
}

// Representative phrase pairs per language (zh ↔ target)
const PHRASE_BANK: Record<string, Array<[string, string]>> = {
  ja: [
    ['你好', 'こんにちは'], ['谢谢', 'ありがとうございます'],
    ['厕所在哪里', 'トイレはどこですか'], ['多少钱', 'いくらですか'],
    ['帮帮我', '助けてください'], ['我迷路了', '道に迷いました'],
    ['医院在哪里', '病院はどこですか'], ['我不懂', 'わかりません'],
  ],
  fr: [
    ['你好', 'Bonjour'], ['谢谢', 'Merci beaucoup'],
    ['厕所在哪里', 'Où sont les toilettes ?'], ['多少钱', 'Combien ça coûte ?'],
    ['帮帮我', "Aidez-moi, s'il vous plaît !"], ['我迷路了', 'Je suis perdu(e)'],
    ['我不懂', 'Je ne comprends pas'],
  ],
  ko: [
    ['你好', '안녕하세요'], ['谢谢', '감사합니다'],
    ['厕所在哪里', '화장실이 어디에요?'], ['多少钱', '얼마예요?'],
    ['帮帮我', '도와주세요!'], ['我迷路了', '길을 잃었어요'],
  ],
  es: [
    ['你好', 'Hola'], ['谢谢', 'Muchas gracias'],
    ['厕所在哪里', '¿Dónde está el baño?'], ['多少钱', '¿Cuánto cuesta?'],
    ['帮帮我', '¡Ayúdenme, por favor!'], ['我迷路了', 'Estoy perdido/a'],
  ],
  de: [
    ['你好', 'Hallo'], ['谢谢', 'Vielen Dank'],
    ['厕所在哪里', 'Wo ist die Toilette?'], ['多少钱', 'Wie viel kostet das?'],
    ['我不懂', 'Ich verstehe nicht'],
  ],
  en: [
    ['你好', 'Hello'], ['谢谢', 'Thank you'],
    ['多少钱', 'How much is it?'], ['帮帮我', 'Help me please!'],
    ['我迷路了', "I'm lost"], ['医院在哪里', 'Where is the hospital?'],
  ],
  it: [
    ['你好', 'Ciao / Buongiorno'], ['谢谢', 'Grazie mille'],
    ['厕所在哪里', "Dov'è il bagno?"], ['多少钱', 'Quanto costa?'],
  ],
  pt: [
    ['你好', 'Olá'], ['谢谢', 'Muito obrigado/a'],
    ['厕所在哪里', 'Onde fica o banheiro?'], ['多少钱', 'Quanto custa?'],
  ],
  zh: [
    ['Hello', '你好'], ['Thank you', '谢谢'],
    ['Where is it?', '在哪里？'], ['How much?', '多少钱？'],
    ['Help me!', '帮帮我！'],
  ],
  ar: [
    ['你好', 'مرحبا'], ['谢谢', 'شكراً جزيلاً'],
    ['厕所在哪里', 'أين الحمام؟'], ['多少钱', 'بكم هذا؟'],
  ],
};

// Simulated demo phrases heard by mic when Web Speech unavailable
const DEMO_HEARD: Record<string, string[]> = {
  ja: ['こんにちは', 'すみません', 'ありがとう'],
  fr: ['Bonjour', 'Merci', 'Excusez-moi'],
  ko: ['안녕하세요', '감사합니다', '실례합니다'],
  es: ['Hola', 'Gracias', 'Perdón'],
  de: ['Hallo', 'Danke', 'Entschuldigung'],
  en: ['Hello', 'Thank you', 'Excuse me'],
  it: ['Ciao', 'Grazie', 'Scusa'],
  pt: ['Olá', 'Obrigado', 'Com licença'],
  ar: ['مرحبا', 'شكراً', 'عفواً'],
};

const QUICK_PHRASES = ['你好', '谢谢', '多少钱', '厕所在哪里', '帮帮我', '我迷路了'];

const LANG_BCP: Record<string, string> = {
  ja: 'ja-JP', fr: 'fr-FR', ko: 'ko-KR', es: 'es-ES',
  en: 'en-US', de: 'de-DE', it: 'it-IT', pt: 'pt-BR',
  zh: 'zh-CN', ar: 'ar-SA',
};

function findTranslation(text: string, targetLang: string): string {
  const bank = PHRASE_BANK[targetLang] || [];
  const lower = text.toLowerCase().trim();
  const fwd = bank.find(([zh]) => zh === text || zh.toLowerCase() === lower);
  if (fwd) return fwd[1];
  const rev = bank.find(([, tgt]) => tgt.toLowerCase() === lower);
  if (rev) return rev[0];
  return `[${text}]`;
}

export const TravelTranslator: React.FC<TravelTranslatorProps> = ({ languageCode, languageName, onBack }) => {
  const [inputText, setInputText]  = useState('');
  const [direction, setDirection]  = useState<'zh→target' | 'target→zh'>('zh→target');
  const [bubbles, setBubbles]      = useState<BubblePair[]>([]);
  const [micState, setMicState]    = useState<'idle' | 'listening' | 'processing'>('idle');
  const [speaking, setSpeaking]    = useState(false);
  const recognitionRef             = useRef<SpeechRecognition | null>(null);
  const bubblesEndRef              = useRef<HTMLDivElement>(null);
  const waveTimerRef               = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      window.speechSynthesis?.cancel();
      if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    bubblesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bubbles]);

  function doTranslate(text: string) {
    const raw = text.trim();
    if (!raw) return;
    const tgtLang = direction === 'zh→target' ? languageCode : 'zh';
    const srcLang = direction === 'zh→target' ? 'zh' : languageCode;
    const translated = findTranslation(raw, tgtLang);
    setBubbles((b) => [...b.slice(-19), {
      source: raw, sourceLang: srcLang,
      target: translated, targetLang: tgtLang,
      timestamp: Date.now(),
    }]);
    setInputText('');
    speakText(translated, tgtLang);
  }

  function speakText(text: string, lang: string) {
    if (!window.speechSynthesis) return;
    setSpeaking(true);
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = LANG_BCP[lang] || 'en-US';
    utt.rate = 0.85;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  }

  function startListening() {
    type SpeechRecognitionCtor = new () => SpeechRecognition;
    const SR: SpeechRecognitionCtor | undefined =
      (window as unknown as Record<string, unknown>).SpeechRecognition as SpeechRecognitionCtor ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition as SpeechRecognitionCtor;

    setMicState('listening');

    if (!SR) {
      // Demo mode: simulate waveform → auto-fill a phrase after 1.8s
      waveTimerRef.current = setTimeout(() => {
        setMicState('processing');
        const pool = direction === 'zh→target'
          ? QUICK_PHRASES
          : (DEMO_HEARD[languageCode] || DEMO_HEARD.en || ['Hello']);
        const heard = pool[Math.floor(Math.random() * pool.length)];
        setTimeout(() => { setInputText(heard); setMicState('idle'); }, 500);
      }, 1800);
      return;
    }

    const rec = new SR();
    rec.lang = direction === 'zh→target' ? 'zh-CN' : (LANG_BCP[languageCode] || 'en-US');
    rec.interimResults = false;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      setMicState('processing');
      const text = e.results[0][0].transcript;
      setTimeout(() => { setInputText(text); setMicState('idle'); }, 400);
    };
    rec.onerror = () => setMicState('idle');
    rec.onend = () => setMicState((s) => s === 'listening' ? 'idle' : s);
    recognitionRef.current = rec;
    rec.start();
  }

  function stopListening() {
    if (waveTimerRef.current) { clearTimeout(waveTimerRef.current); waveTimerRef.current = null; }
    if (recognitionRef.current) recognitionRef.current.stop();
    setMicState('idle');
  }

  return (
    <div className="tt-wrap">
      <FloatingBack onClick={onBack} />

      <header className="tt-header">
        <div className="tt-header-icon">🌐</div>
        <h1 className="tt-title">Travel Translator</h1>
        <p className="tt-sub">中文 ⇄ {languageName} · Real-time</p>
      </header>

      {/* Direction toggle */}
      <div className="tt-direction-toggle">
        <button
          className={`tt-dir-btn ${direction === 'zh→target' ? 'active' : ''}`}
          onClick={() => setDirection('zh→target')}
        >
          🇨🇳 中文 → {languageName}
        </button>
        <span className="tt-dir-swap" onClick={() => setDirection(d => d === 'zh→target' ? 'target→zh' : 'zh→target')}>
          ⇄
        </span>
        <button
          className={`tt-dir-btn ${direction === 'target→zh' ? 'active' : ''}`}
          onClick={() => setDirection('target→zh')}
        >
          {languageName} → 🇨🇳 中文
        </button>
      </div>

      {/* Bilingual bubble conversation */}
      {bubbles.length > 0 && (
        <div className="tt-bubbles">
          {bubbles.map((pair) => (
            <div key={pair.timestamp} className="tt-bubble-pair">
              <div className="tt-bubble tt-bubble-source">
                <span className="tt-bubble-lang">{pair.sourceLang.toUpperCase()}</span>
                <p className="tt-bubble-text">{pair.source}</p>
              </div>
              <div className="tt-bubble tt-bubble-target">
                <div className="tt-bubble-target-inner">
                  <span className="tt-bubble-lang target">{pair.targetLang.toUpperCase()}</span>
                  <p className="tt-bubble-text target">{pair.target}</p>
                </div>
                <button
                  className={`tt-bubble-speak ${speaking ? 'speaking' : ''}`}
                  onClick={() => speakText(pair.target, pair.targetLang)}
                >🔊</button>
              </div>
            </div>
          ))}
          <div ref={bubblesEndRef} />
        </div>
      )}

      {/* Waveform while listening */}
      {micState === 'listening' && (
        <div className="tt-waveform-wrap">
          <div className="tt-waveform">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="tt-wave-bar" style={{ animationDelay: `${i * 0.09}s` }} />
            ))}
          </div>
          <p className="tt-waveform-label">
            Listening… speak {direction === 'zh→target' ? '中文' : languageName}
          </p>
          <button className="tt-stop-btn" onClick={stopListening}>Stop</button>
        </div>
      )}

      {/* Processing dots */}
      {micState === 'processing' && (
        <div className="tt-processing-row">
          {[0, 1, 2].map((i) => (
            <div key={i} className="tt-processing-dot" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
          <span className="tt-processing-label">Processing…</span>
        </div>
      )}

      {/* Input area (hidden while mic is active) */}
      {micState === 'idle' && (
        <div className="tt-input-area">
          <div className="tt-input-wrap">
            <textarea
              className="tt-textarea"
              placeholder={direction === 'zh→target' ? '输入中文...' : `Type in ${languageName}…`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doTranslate(inputText); } }}
              rows={3}
            />
            <button className="tt-mic-btn" onClick={startListening} title="Voice input">🎤</button>
          </div>
          <button
            className="tt-translate-btn"
            disabled={!inputText.trim()}
            onClick={() => doTranslate(inputText)}
          >
            {speaking ? '🔊 Playing…' : 'Translate & Speak 翻译'}
          </button>
        </div>
      )}

      {/* Quick phrases */}
      <div className="tt-quick-section">
        <p className="tt-quick-label">Quick Phrases</p>
        <div className="tt-quick-chips">
          {QUICK_PHRASES.map((phrase) => (
            <button
              key={phrase}
              className="tt-quick-chip"
              onClick={() => { setDirection('zh→target'); doTranslate(phrase); }}
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
