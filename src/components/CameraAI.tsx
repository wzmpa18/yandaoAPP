import React, { useState, useRef } from 'react';
import { FloatingBack } from './FloatingBack';
import { speakWithPreset, stopSpeaking } from '../lib/voiceProfile';
import { callAI } from '../lib/aiClient';

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

const DEMO_RESULTS: Record<string, AnalysisResult[]> = {
  ja: [
    { recognizedText: '入口', pronunciation: 'Iriguchi (ee-ree-goo-chee)', translation: '入口 = Entrance / 入口', explanation: '入(iri) = enter + 口(guchi) = mouth/opening. You will see this on every door in Japan. Contrast with 出口(deguchi) = exit.' },
    { recognizedText: '営業時間 9:00–21:00', pronunciation: 'Eigyō jikan (ay-gyoh jee-kan)', translation: 'Business hours 9:00–21:00', explanation: '営業(eigyō) = business + 時間(jikan) = hours. This sign tells you the shop is open 9am–9pm.' },
  ],
  fr: [
    { recognizedText: 'Sortie de secours', pronunciation: 'sor-tee duh suh-koor', translation: '紧急出口 Emergency Exit', explanation: "Sortie = exit, secours = emergency/help. You'll see this on green signs in all French buildings." },
    { recognizedText: 'Fermé le lundi', pronunciation: 'fer-MAY luh LUN-dee', translation: '周一休息 Closed on Mondays', explanation: 'Fermé = closed, lundi = Monday. Many French shops close on Mondays — check before you go!' },
  ],
  ko: [
    { recognizedText: '편의점', pronunciation: 'Pyeonuijeom (pyuh-noo-ee-jum)', translation: '便利店 Convenience Store', explanation: '편의(pyeonui) = convenience + 점(jeom) = store. The suffix 점 appears in many Korean store names.' },
    { recognizedText: '비상구', pronunciation: 'Bisanggu (bee-sang-gu)', translation: '紧急出口 Emergency Exit', explanation: '비상(bisang) = emergency + 구(gu) = exit/opening. You will see this on green signs throughout Korea.' },
  ],
  es: [
    { recognizedText: 'Prohibido el paso', pronunciation: 'pro-ee-BEE-do el PA-so', translation: '禁止通行 No Entry', explanation: 'Prohibido = prohibited, paso = passage. You will see this at restricted areas across Spanish-speaking countries.' },
    { recognizedText: 'Se vende', pronunciation: 'seh VEN-deh', translation: '出售 For Sale', explanation: 'Se vende is the standard "for sale" sign. Se alquila = for rent. Very common on property signs.' },
  ],
  de: [
    { recognizedText: 'Ausgang', pronunciation: 'OUSE-gang', translation: '出口 Exit', explanation: 'Aus = out + Gang = corridor. Contrast with Eingang (entrance). Very common in German airports.' },
    { recognizedText: 'Achtung! Hochspannung', pronunciation: 'AHK-toong HOH-shpan-noong', translation: '警告！高压危险 Warning! High Voltage', explanation: 'Achtung = attention/warning. Hochspannung = high voltage. This is a safety sign — stay back!' },
  ],
  en: [
    { recognizedText: 'No Smoking', pronunciation: 'noh SMOH-king', translation: '禁止吸烟', explanation: 'Universal no-smoking sign. In Chinese contexts you may also see 禁烟区 (jìn yān qū) = no-smoking zone.' },
    { recognizedText: 'Emergency Exit Only', pronunciation: 'ee-MER-jen-see EG-zit OHN-lee', translation: '紧急出口专用', explanation: 'Emergency = 紧急, Exit = 出口. This sign marks doors that should only be used in emergencies. Alarm will sound is a common addition.' },
    { recognizedText: 'Mind the Gap', pronunciation: 'mynd thuh gap', translation: '小心空隙 / 注意站台间隙', explanation: 'Iconic London Underground warning. Gap = the space between train and platform. Mind = pay attention to / be careful of.' },
  ],
  it: [
    { recognizedText: "Vietato l'accesso", pronunciation: "vee-AY-tah-toh lah-CHEH-soh", translation: '禁止进入 No Access', explanation: 'Vietato = forbidden, accesso = access/entry. Standard restricted area sign in Italy.' },
    { recognizedText: 'Uscita di sicurezza', pronunciation: 'oo-SHEE-tah dee see-koo-REHT-tsah', translation: '安全出口 Emergency Exit', explanation: 'Uscita = exit, sicurezza = safety/security. Green sign in Italian buildings. Similar to the French "Sortie de secours".' },
    { recognizedText: 'Orario di apertura 8:00–20:00', pronunciation: 'oh-RAH-ryoh dee ah-pehr-TOO-rah', translation: '营业时间 8:00–20:00', explanation: 'Orario = schedule/hours, apertura = opening. Italian shops often close for riposo (siesta) 13:00–16:00, so check signs carefully!' },
  ],
  pt: [
    { recognizedText: 'Proibido fumar', pronunciation: 'pro-ee-BEE-doo foo-MAR', translation: '禁止吸烟 No Smoking', explanation: 'Proibido = prohibited, fumar = to smoke. Standard no-smoking sign in Brazil and Portugal.' },
    { recognizedText: 'Saída de emergência', pronunciation: 'sah-EE-dah jee eh-mehr-ZHEN-see-ah', translation: '紧急出口 Emergency Exit', explanation: 'Saída = exit, emergência = emergency. Green signs in Brazilian buildings. In Portugal you may also see "Saída de emergência" with slightly different pronunciation.' },
    { recognizedText: 'Horário de funcionamento 9h–18h', pronunciation: 'oh-RAH-ryoo jee foon-see-oh-nah-MEN-too', translation: '营业时间 9:00–18:00', explanation: 'Horário = schedule, funcionamento = operation/working. Brazilian shops often list "Seg–Sex" (Mon–Fri) and "Sáb" (Sat) separately.' },
  ],
  zh: [
    { recognizedText: '小心地滑', pronunciation: 'xiǎo xīn dì huá', translation: '小心地滑 = Caution: Slippery Floor', explanation: '小心(xiǎo xīn) = be careful + 地滑(dì huá) = slippery ground. The yellow wet floor sign equivalent in China.' },
    { recognizedText: '请勿打扰', pronunciation: 'qǐng wù dǎ rǎo', translation: '请勿打扰 = Do Not Disturb', explanation: '请勿(qǐng wù) = please do not + 打扰(dǎ rǎo) = disturb. Found on hotel room door hangers.' },
  ],
  ar: [
    { recognizedText: 'ممنوع التدخين', pronunciation: 'mam-NOO-uh at-tad-KHEEN', translation: '禁止吸烟 No Smoking', explanation: 'ممنوع (mamnoo) = forbidden/prohibited + التدخين (at-tadkheen) = smoking. Standard no-smoking sign across the Arab world.' },
    { recognizedText: 'مدخل', pronunciation: 'MAD-khal', translation: '入口 Entrance', explanation: 'مدخل (madkhal) = entrance/entry point. From the root د-خ-ل (d-kh-l) meaning "to enter". You\'ll see this at building entrances.' },
    { recognizedText: 'مخرج طوارئ', pronunciation: 'MAKH-raj ta-WA-ri\'', translation: '紧急出口 Emergency Exit', explanation: 'مخرج (makhraj) = exit + طوارئ (tawari\') = emergencies. Green sign in Arabic buildings. The root خ-ر-ج (kh-r-j) means "to exit".' },
  ],
};

const FALLBACK: AnalysisResult = {
  recognizedText: 'EXIT', pronunciation: 'EK-sit', translation: '出口 / Exit',
  explanation: 'EXIT is the universal emergency exit marking. In Chinese buildings you may see 安全出口 (ānquán chūkǒu) = safe exit.',
};

const LANG_NAMES: Record<string, string> = {
  ja: '日语', fr: '法语', ko: '韩语', es: '西班牙语',
  en: '英语', de: '德语', it: '意大利语', pt: '葡萄牙语',
  zh: '中文', ar: '阿拉伯语',
};

export const CameraAI: React.FC<CameraAIProps> = ({ languageCode, languageName, onBack }) => {
  const [phase, setPhase] = useState<'idle' | 'preview' | 'analyzing' | 'result'>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState<'ready' | 'loading' | 'success' | 'error' | 'fallback'>('ready');
  const fileRef = useRef<HTMLInputElement>(null);
  const analyzeProgress = useRef(0);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPhase('preview');
    setOcrStatus('ready');
  }

  /** Convert file to base64 data URL */
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * 真实 OCR 识别：通过 AI Vision API 分析图片中的文字
   * 将图片压缩后完整传给 AI 模型进行 OCR 分析
   */
  async function realOCR(imageBase64: string): Promise<AnalysisResult> {
    // 压缩图片以减少 API 调用大小
    const compressedBase64 = await compressImage(imageBase64, 800);
    const langName = LANG_NAMES[languageCode] || languageName;

    try {
      const response = await callAI([
        {
          role: 'system',
          content: `你是一个专业的多语言 OCR 文字识别和语言分析专家。用户上传了一张包含${langName}文字的图片，请完成以下任务：

1. 识别图片中所有可见的文字（OCR）
2. 提供准确的发音标注（罗马音/拼音）
3. 翻译成中文
4. 提供详细的词义分解和文化背景说明

请严格按以下 JSON 格式返回结果：
{
  "recognizedText": "识别到的原文",
  "pronunciation": "准确发音标注",
  "translation": "中文翻译",
  "explanation": "详细解析，包括每个词的含义、语法结构、使用场景和文化背景"
}

只返回有效的 JSON，不要返回任何其他文字。`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `请对这张图片进行 OCR 识别和语言分析。目标语言是 ${langName} (${languageCode})。请仔细观察图片中的所有文字内容。`,
            },
            {
              type: 'image_url',
              image_url: {
                url: compressedBase64,
              },
            },
          ] as unknown as string,
        }
      ]);

      // 尝试从响应中提取 JSON
      let cleanedResponse = response.trim();
      
      // 移除可能的 markdown 代码块标记
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      }

      // 尝试找到 JSON 对象
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in AI response');

      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.recognizedText) throw new Error('Missing recognizedText field');

      return {
        recognizedText: parsed.recognizedText || '',
        pronunciation: parsed.pronunciation || '',
        translation: parsed.translation || '',
        explanation: parsed.explanation || '',
      };
    } catch (err) {
      console.error('Real OCR failed:', err);
      throw err;
    }
  }

  /** 压缩图片到指定最大宽度 */
  async function compressImage(dataURL: string, maxWidth: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round(height * maxWidth / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        
        // 使用高质量压缩
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataURL = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedDataURL);
      };
      img.onerror = reject;
      img.src = dataURL;
    });
  }

  function handleAnalyze() {
    setPhase('analyzing');
    setProgress(0);
    analyzeProgress.current = 0;

    const tick = setInterval(() => {
      analyzeProgress.current += Math.random() * 10 + 3;
      setProgress(Math.min(analyzeProgress.current, 90));
      if (analyzeProgress.current >= 90) clearInterval(tick);
    }, 120);

    const file = fileRef.current?.files?.[0];
    
    if (file && previewUrl) {
      setOcrStatus('loading');
      
      fileToBase64(file)
        .then(async (base64) => {
          try {
            const ocrResult = await realOCR(base64);
            clearInterval(tick);
            setProgress(100);
            setOcrStatus('success');
            setTimeout(() => {
              setResult(ocrResult);
              setPhase('result');
            }, 400);
          } catch (err) {
            console.warn('Real OCR failed, falling back to demo:', err);
            clearInterval(tick);
            setOcrStatus('fallback');
            finishWithDemo();
          }
        })
        .catch(() => {
          clearInterval(tick);
          setOcrStatus('fallback');
          finishWithDemo();
        });
    } else {
      setOcrStatus('fallback');
      finishWithDemo();
    }
  }

  function finishWithDemo() {
    setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        const pool = DEMO_RESULTS[languageCode] || [FALLBACK];
        setResult(pool[Math.floor(Math.random() * pool.length)]);
        setPhase('result');
      }, 300);
    }, 1500);
  }

  async function speakPronunciation(text: string) {
    if (speaking) { stopSpeaking(); setSpeaking(false); return; }
    setSpeaking(true);
    await speakWithPreset(text, languageCode);
    setSpeaking(false);
  }

  function reset() {
    setPhase('idle');
    setPreviewUrl(null);
    setResult(null);
    setProgress(0);
    setOcrStatus('ready');
    if (fileRef.current) fileRef.current.value = '';
  }

  const statusBadge = (): { icon: string; label: string; cls: string } => {
    switch (ocrStatus) {
      case 'loading': return { icon: '⏳', label: 'AI OCR 分析中...', cls: '' };
      case 'success': return { icon: '✅', label: 'AI 真实识别成功', cls: 'success' };
      case 'error': return { icon: '❌', label: '识别失败', cls: 'error' };
      case 'fallback': return { icon: '📋', label: '演示模式', cls: 'demo' };
      default: return { icon: '', label: '', cls: '' };
    }
  };

  const badge = statusBadge();

  return (
    <div className="cam-wrap">
      <FloatingBack onClick={onBack} />

      <header className="cam-header">
        <div className="cam-header-icon">📷</div>
        <h1 className="cam-title">Camera AI · Scan & Learn</h1>
        <p className="cam-sub">{languageName} · Upload a photo for instant text analysis</p>
        {badge.label && (
          <p className={`cam-ocr-status cam-ocr-${badge.cls}`}>
            {badge.icon} {badge.label}
          </p>
        )}
      </header>

      {phase === 'idle' && (
        <>
          <div className="cam-upload-zone" onClick={() => fileRef.current?.click()}>
            <span className="cam-upload-icon">📸</span>
            <p className="cam-upload-text">Tap to upload photo</p>
            <p className="cam-upload-sub">Signs, menus, textbook pages — AI will read and explain</p>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFile} />
          </div>
          <button className="cam-demo-btn" onClick={() => handleAnalyze()}>
            ✨ Try Demo Analysis
          </button>
        </>
      )}

      {phase === 'preview' && previewUrl && (
        <div className="cam-preview-section">
          <div className="cam-img-wrap">
            <img src={previewUrl} className="cam-preview-img" alt="uploaded" />
          </div>
          <div className="cam-preview-actions">
            <button className="cam-analyze-btn" onClick={handleAnalyze}>🔍 Analyze with AI</button>
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
          <p className="cam-analyzing-text">{ocrStatus === 'loading' ? '🤖 AI Vision 正在识别图片...' : 'Analyzing...'}</p>
          <p className="cam-analyzing-sub">
            {ocrStatus === 'loading' ? 'OCR · 发音标注 · 中文翻译 · 详细解析' : 'OCR · Pronunciation · Translation'}
          </p>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="cam-result-section">
          {previewUrl && (
            <div className="cam-result-img-wrap">
              <img src={previewUrl} className="cam-result-img" alt="analyzed" />
              <div className="cam-result-overlay">
                <span className="cam-result-badge">
                  {ocrStatus === 'success' ? '✓ AI Recognized' : '✓ Analyzed'}
                </span>
              </div>
            </div>
          )}

          <div className="cam-result-cards">
            <div className="cam-result-card ocr">
              <span className="cam-result-card-label">
                🔤 {ocrStatus === 'success' ? 'AI 识别文本' : 'Recognized Text'}
              </span>
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
          <li>Good lighting, avoid shadows on text</li>
          <li>Keep text in focus and upright</li>
          <li>Works with: signs, menus, textbook pages, labels</li>
          <li>AI Vision OCR analyzes real images for accurate results</li>
          <li>Supports 10 languages including CJK, Arabic, European scripts</li>
        </ul>
      </div>
    </div>
  );
};
