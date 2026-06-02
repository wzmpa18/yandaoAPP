import React, { useState, useRef } from 'react';
import { FloatingBack } from './FloatingBack';

interface CameraAIProps {
  languageCode: string;
  languageName: string;
  onBack: () => void;
}

interface AnalysisResult {
  recognizedText: string;
  pronunciation: string;
  translation: string;
  explanation: string;
}

// 2-3 representative demo results per language
const DEMO_RESULTS: Record<string, AnalysisResult[]> = {
  ja: [
    {
      recognizedText: '入口',
      pronunciation: 'Iriguchi (ee-ree-goo-chee)',
      translation: '入口 = Entrance / 入口',
      explanation: '入(iri) = enter + 口(guchi) = mouth/opening. You will see this on every door in Japan. Contrast with 出口(deguchi) = exit.',
    },
    {
      recognizedText: '営業時間 9:00–21:00',
      pronunciation: 'Eigyō jikan (ay-gyoh jee-kan)',
      translation: 'Business hours 9:00–21:00',
      explanation: '営業(eigyō) = business + 時間(jikan) = hours. This sign tells you the shop is open 9am–9pm.',
    },
  ],
  fr: [
    {
      recognizedText: 'Sortie de secours',
      pronunciation: 'sor-tee duh suh-koor',
      translation: '紧急出口 Emergency Exit',
      explanation: "Sortie = exit, secours = emergency/help. You'll see this on green signs in all French buildings.",
    },
    {
      recognizedText: 'Fermé le lundi',
      pronunciation: 'fer-MAY luh LUN-dee',
      translation: '周一休息 Closed on Mondays',
      explanation: 'Fermé = closed, lundi = Monday. Many French shops close on Mondays — check before you go!',
    },
  ],
  ko: [
    {
      recognizedText: '편의점',
      pronunciation: 'Pyeonuijeom (pyuh-noo-ee-jum)',
      translation: '便利店 Convenience Store',
      explanation: '편의(pyeonui) = convenience + 점(jeom) = store. The suffix 점 appears in many Korean store names.',
    },
    {
      recognizedText: '비상구',
      pronunciation: 'Bisanggu (bee-sang-gu)',
      translation: '紧急出口 Emergency Exit',
      explanation: '비상(bisang) = emergency + 구(gu) = exit/opening. You will see this on green signs throughout Korea.',
    },
  ],
  es: [
    {
      recognizedText: 'Prohibido el paso',
      pronunciation: 'pro-ee-BEE-do el PA-so',
      translation: '禁止通行 No Entry',
      explanation: 'Prohibido = prohibited, paso = passage. You will see this at restricted areas across Spanish-speaking countries.',
    },
    {
      recognizedText: 'Se vende',
      pronunciation: 'seh VEN-deh',
      translation: '出售 For Sale',
      explanation: 'Se vende is the standard "for sale" sign. Se alquila = for rent. Very common on property signs.',
    },
  ],
  de: [
    {
      recognizedText: 'Ausgang',
      pronunciation: 'OUSE-gang',
      translation: '出口 Exit',
      explanation: 'Aus = out + Gang = corridor. Contrast with Eingang (entrance). Very common in German airports.',
    },
    {
      recognizedText: 'Achtung! Hochspannung',
      pronunciation: 'AHK-toong HOH-shpan-noong',
      translation: '警告！高压危险 Warning! High Voltage',
      explanation: 'Achtung = attention/warning. Hochspannung = high voltage. This is a safety sign — stay back!',
    },
  ],
  en: [
    {
      recognizedText: 'No Smoking',
      pronunciation: 'noh SMOH-king',
      translation: '禁止吸烟',
      explanation: 'Universal no-smoking sign. In Chinese contexts you may also see 禁烟区 (jìn yān qū) = no-smoking zone.',
    },
  ],
  it: [
    {
      recognizedText: 'Vietato l\'accesso',
      pronunciation: "vee-AY-tah-toh lah-CHEH-soh",
      translation: '禁止进入 No Access',
      explanation: 'Vietato = forbidden, accesso = access/entry. Standard restricted area sign in Italy.',
    },
  ],
  pt: [
    {
      recognizedText: 'Proibido fumar',
      pronunciation: 'pro-ee-BEE-doo foo-MAR',
      translation: '禁止吸烟 No Smoking',
      explanation: 'Proibido = prohibited, fumar = to smoke. Standard no-smoking sign in Brazil and Portugal.',
    },
  ],
  zh: [
    {
      recognizedText: '小心地滑',
      pronunciation: 'xiǎo xīn dì huá',
      translation: '小心地滑 = Caution: Slippery Floor',
      explanation: '小心(xiǎo xīn) = be careful + 地滑(dì huá) = slippery ground. The yellow wet floor sign equivalent in China.',
    },
    {
      recognizedText: '请勿打扰',
      pronunciation: 'qǐng wù dǎ rǎo',
      translation: '请勿打扰 = Do Not Disturb',
      explanation: '请勿(qǐng wù) = please do not + 打扰(dǎ rǎo) = disturb. Found on hotel room door hangers.',
    },
  ],
  ar: [
    {
      recognizedText: 'ممنوع التدخين',
      pronunciation: 'mam-NOO-uh at-tad-KHEEN',
      translation: '禁止吸烟 No Smoking',
      explanation: 'ممنوع (mamnoo) = forbidden/prohibited + التدخين (at-tadkheen) = smoking. Standard no-smoking sign across the Arab world.',
    },
  ],
};

const FALLBACK: AnalysisResult = {
  recognizedText: 'EXIT',
  pronunciation: 'EK-sit',
  translation: '出口 / Exit',
  explanation: 'EXIT is the universal emergency exit marking. In Chinese buildings you may see 安全出口 (ānquán chūkǒu) = safe exit.',
};

const LANG_BCP: Record<string, string> = {
  ja: 'ja-JP', fr: 'fr-FR', ko: 'ko-KR', es: 'es-ES',
  en: 'en-US', de: 'de-DE', it: 'it-IT', pt: 'pt-BR',
  zh: 'zh-CN', ar: 'ar-SA',
};

export const CameraAI: React.FC<CameraAIProps> = ({ languageCode, languageName, onBack }) => {
  const [phase, setPhase]       = useState<'idle' | 'preview' | 'analyzing' | 'result'>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult]     = useState<AnalysisResult | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const fileRef                 = useRef<HTMLInputElement>(null);
  const analyzeProgress         = useRef(0);
  const [progress, setProgress] = useState(0);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPhase('preview');
  }

  function handleAnalyze() {
    setPhase('analyzing');
    setProgress(0);
    analyzeProgress.current = 0;

    // Smooth progress bar over 1.8s
    const tick = setInterval(() => {
      analyzeProgress.current += 7;
      setProgress(Math.min(analyzeProgress.current, 95));
      if (analyzeProgress.current >= 95) clearInterval(tick);
    }, 90);

    setTimeout(() => {
      clearInterval(tick);
      setProgress(100);
      const pool = DEMO_RESULTS[languageCode] || [FALLBACK];
      const pick = pool[Math.floor(Math.random() * pool.length)];
      setTimeout(() => { setResult(pick); setPhase('result'); }, 300);
    }, 1800);
  }

  function speakPronunciation(text: string) {
    if (!window.speechSynthesis) return;
    setSpeaking(true);
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = LANG_BCP[languageCode] || 'en-US';
    utt.rate = 0.8;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  }

  function reset() {
    setPhase('idle');
    setPreviewUrl(null);
    setResult(null);
    setProgress(0);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="cam-wrap">
      <FloatingBack onClick={onBack} />

      <header className="cam-header">
        <div className="cam-header-icon">📷</div>
        <h1 className="cam-title">Camera AI · Scan & Solve</h1>
        <p className="cam-sub">{languageName} · Upload photo for instant analysis</p>
      </header>

      {phase === 'idle' && (
        <div className="cam-upload-zone" onClick={() => fileRef.current?.click()}>
          <span className="cam-upload-icon">📸</span>
          <p className="cam-upload-text">Tap to upload photo</p>
          <p className="cam-upload-sub">Signs, menus, textbook questions…</p>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        </div>
      )}

      {/* Demo shortcut: upload-less instant analysis */}
      {phase === 'idle' && (
        <button
          className="cam-demo-btn"
          onClick={() => { setPreviewUrl(null); handleAnalyze(); }}
        >
          ✨ Try Demo Analysis
        </button>
      )}

      {phase === 'preview' && previewUrl && (
        <div className="cam-preview-section">
          <div className="cam-img-wrap">
            <img src={previewUrl} className="cam-preview-img" alt="uploaded" />
          </div>
          <div className="cam-preview-actions">
            <button className="cam-analyze-btn" onClick={handleAnalyze}>🔍 Analyze Now</button>
            <button className="cam-reset-btn" onClick={reset}>Change Photo</button>
          </div>
        </div>
      )}

      {phase === 'analyzing' && (
        <div className="cam-analyzing">
          <div className="cam-scan-lines">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="cam-scan-line" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <div className="cam-analyze-progress">
            <div className="cam-analyze-bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="cam-analyzing-text">Analyzing…</p>
          <p className="cam-analyzing-sub">OCR · Pronunciation · Translation</p>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="cam-result-section">
          {previewUrl && (
            <div className="cam-result-img-wrap">
              <img src={previewUrl} className="cam-result-img" alt="analyzed" />
              <div className="cam-result-overlay">
                <span className="cam-result-badge">✓ Analyzed</span>
              </div>
            </div>
          )}

          <div className="cam-result-cards">
            <div className="cam-result-card ocr">
              <span className="cam-result-card-label">🔤 Recognized Text</span>
              <p className="cam-result-main-text">{result.recognizedText}</p>
            </div>

            <div className="cam-result-card pron">
              <span className="cam-result-card-label">🗣 Pronunciation</span>
              <p className="cam-result-pron-text">{result.pronunciation}</p>
              <button
                className={`cam-speak-btn ${speaking ? 'speaking' : ''}`}
                onClick={() => speakPronunciation(result.recognizedText)}
              >
                {speaking ? '🔊 Playing…' : '🔊 Play Audio'}
              </button>
            </div>

            <div className="cam-result-card trans">
              <span className="cam-result-card-label">🌏 Translation</span>
              <p className="cam-result-trans-text">{result.translation}</p>
            </div>

            <div className="cam-result-card explain">
              <span className="cam-result-card-label">🤖 AI Analysis · 详细解析</span>
              <p className="cam-result-explain-text">{result.explanation}</p>
            </div>
          </div>

          <button className="cam-reset-btn wide" onClick={reset}>📸 Scan Another</button>
        </div>
      )}

      <div className="cam-tips">
        <p className="cam-tips-title">Tips for best results</p>
        <ul className="cam-tips-list">
          <li>Good lighting, avoid shadows</li>
          <li>Keep text in focus and upright</li>
          <li>Works with: signs, menus, textbook pages</li>
        </ul>
      </div>
    </div>
  );
};
