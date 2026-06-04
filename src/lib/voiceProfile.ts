/**
 * Global voice profile system.
 * Stores user's chosen voice preset; used by AI Assistant and game feedback.
 * 
 * v2.0 — Robust TTS with Android WebView fixes, fallback chain, and error recovery.
 * 
 * Key fixes for Android WebView:
 *   1. speechSynthesis.getVoices() returns synchronously now (per spec), but
 *      on older Android WebViews it may still be async. We retry up to 3 times.
 *   2. Android WebView may pause speechSynthesis when the page is backgrounded.
 *      We resume before speaking.
 *   3. Added a "priming" utterance — Android WebView sometimes ignores the first
 *      speak() call unless speechSynthesis has been "warmed up".
 *   4. Fallback: if target-language voice is unavailable, fall back to any voice
 *      (with correct lang tag) so the user at least hears something.
 *   5. TTS readiness state tracked so callers can show a "loading voice" indicator.
 */

export interface VoicePreset {
  id: number;
  name: string;
  group: 'child' | 'student' | 'adult';
  pitch: number;       // 0.5 – 2.0
  rate: number;        // 0.5 – 1.5
  genderHint: 'female' | 'male';
  encouragement: string;  // feedback phrase used in child modes
}

export const VOICE_PRESETS: VoicePreset[] = [
  // ── 儿童 (3–12岁) ──────────────────────────────────────────
  { id: 1, name: '活泼小孩声', group: 'child',   pitch: 1.9, rate: 0.85, genderHint: 'female', encouragement: '哇！超棒的！继续加油！' },
  { id: 2, name: '温柔姐姐声', group: 'child',   pitch: 1.5, rate: 0.80, genderHint: 'female', encouragement: '很好哦！你做到了！' },
  { id: 3, name: '卡通角色声', group: 'child',   pitch: 2.0, rate: 0.90, genderHint: 'male',   encouragement: '哦吼！厉害！' },
  // ── 学生 (13–22岁) ─────────────────────────────────────────
  { id: 4, name: '甜美少女声', group: 'student', pitch: 1.4, rate: 1.00, genderHint: 'female', encouragement: '好耶！答对了！' },
  { id: 5, name: '阳光少年声', group: 'student', pitch: 0.9, rate: 1.05, genderHint: 'male',   encouragement: '牛！继续！' },
  { id: 6, name: '知性学姐声', group: 'student', pitch: 1.2, rate: 0.95, genderHint: 'female', encouragement: '答得不错，再接再厉。' },
  { id: 7, name: '幽默学长声', group: 'student', pitch: 0.85, rate: 1.10, genderHint: 'male',  encouragement: '哈哈，这道题难不倒你！' },
  // ── 青年/成人 (23–50岁) ────────────────────────────────────
  { id: 8, name: '温柔御姐声', group: 'adult',   pitch: 1.1, rate: 0.95, genderHint: 'female', encouragement: '很好，继续保持。' },
  { id: 9, name: '成熟男声',   group: 'adult',   pitch: 0.75, rate: 1.00, genderHint: 'male',  encouragement: '正确，做得好。' },
  { id: 10, name: '治愈系女声', group: 'adult',  pitch: 1.25, rate: 0.90, genderHint: 'female', encouragement: '慢慢来，你很棒。' },
];

const STORAGE_KEY = 'yandao_voice_preset_v1';

export function loadVoicePreset(): VoicePreset {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const id = parseInt(raw, 10);
      return VOICE_PRESETS.find((p) => p.id === id) ?? VOICE_PRESETS[5];
    }
  } catch { /* */ }
  return VOICE_PRESETS[5];
}

export function saveVoicePreset(id: number): void {
  localStorage.setItem(STORAGE_KEY, String(id));
}

// ── Language → BCP-47 tag mapping ──────────────────────────────
const LANG_SR: Record<string, string> = {
  ja: 'ja-JP', ko: 'ko-KR', fr: 'fr-FR', es: 'es-ES',
  de: 'de-DE', it: 'it-IT', pt: 'pt-BR', ar: 'ar-SA',
  zh: 'zh-CN', en: 'en-US',
};

// ── TTS readiness state ─────────────────────────────────────────
let ttsReady = false;
let ttsReadyPromise: Promise<void> | null = null;
let ttsPrimeDone = false;

/**
 * Returns a promise that resolves when the TTS engine is ready.
 * Safe to call multiple times — returns the same promise.
 */
export function waitForTTS(): Promise<void> {
  if (ttsReady) return Promise.resolve();
  if (ttsReadyPromise) return ttsReadyPromise;
  
  ttsReadyPromise = new Promise<void>((resolve) => {
    if (!window.speechSynthesis) {
      ttsReady = true;
      resolve();
      return;
    }
    
    // Some browsers fire voiceschanged; others populate voices synchronously.
    const tryLoad = (attempt: number) => {
      const voices = window.speechSynthesis!.getVoices();
      if (voices.length > 0) {
        ttsReady = true;
        resolve();
        return;
      }
      if (attempt < 6) {
        setTimeout(() => tryLoad(attempt + 1), 200);
      } else {
        // Give up — TTS will work but without voice matching
        console.warn('[TTS] No voices available after 1.2s; using defaults');
        ttsReady = true;
        resolve();
      }
    };
    
    tryLoad(0);
    
    // Also listen for voiceschanged as a backup
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      if (!ttsReady) {
        ttsReady = true;
        resolve();
      }
    }, { once: true });
  });
  
  return ttsReadyPromise;
}

/**
 * Prime the TTS engine with a silent utterance.
 * Required on some Android WebViews where the first speak() is ignored.
 */
function primeTTS(): void {
  if (ttsPrimeDone || !window.speechSynthesis) return;
  ttsPrimeDone = true;
  try {
    const u = new SpeechSynthesisUtterance('');
    u.volume = 0;
    u.rate = 1.5;
    window.speechSynthesis.speak(u);
  } catch { /* ignore */ }
}

/**
 * Find the best matching voice for a given language code and gender hint.
 * Returns null if no match found (caller will use default).
 */
function findVoice(langCode: string, genderHint: 'female' | 'male'): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  if (voices.length === 0) return null;
  
  const langTag = LANG_SR[langCode] ?? 'zh-CN';
  const langPrefix = langTag.split('-')[0];
  const genderRe = genderHint === 'female' ? /female|woman|girl/i : /male|man|guy/i;
  
  // Tier 1: exact language + gender match
  let match = voices.find((v) => v.lang.startsWith(langPrefix) && genderRe.test(v.name));
  if (match) return match;
  
  // Tier 2: exact language, any gender
  match = voices.find((v) => v.lang.startsWith(langPrefix));
  if (match) return match;
  
  // Tier 3: any voice with matching gender
  match = voices.find((v) => genderRe.test(v.name));
  if (match) return match;
  
  // Tier 4: first available voice
  return voices[0] ?? null;
}

// ── Track current utterance for cancellation ─────────────────────
let currentUtterance: SpeechSynthesisUtterance | null = null;

/** Speak text using the user's active voice preset and the target language. */
export async function speakWithPreset(
  text: string,
  langCode: string,
  preset?: VoicePreset,
): Promise<void> {
  if (!window.speechSynthesis) {
    console.warn('[TTS] speechSynthesis not available');
    return;
  }
  
  // Resume synthesis if paused (Android WebView quirk)
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
  
  await waitForTTS();
  primeTTS();
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  currentUtterance = null;
  
  const p = preset ?? loadVoicePreset();
  const langTag = LANG_SR[langCode] ?? 'zh-CN';
  
  // Split long text into sentences for better Android compatibility
  const chunks = splitIntoSentences(text, 200);
  
  for (let i = 0; i < chunks.length; i++) {
    const utt = new SpeechSynthesisUtterance(chunks[i]);
    utt.lang = langTag;
    utt.pitch = p.pitch;
    utt.rate = p.rate;
    utt.volume = 1.0;
    
    const voice = findVoice(langCode, p.genderHint);
    if (voice) utt.voice = voice;
    
    // For the last chunk, set up the completion promise
    if (i === chunks.length - 1) {
      await new Promise<void>((resolve) => {
        utt.onend = () => resolve();
        utt.onerror = (e) => {
          console.warn('[TTS] Utterance error:', e.error);
          resolve(); // Don't block on error
        };
        // Timeout safety: max 15s per chunk
        const timeout = setTimeout(() => {
          console.warn('[TTS] Utterance timeout');
          window.speechSynthesis?.cancel();
          resolve();
        }, 15000);
        utt.onend = () => { clearTimeout(timeout); resolve(); };
        utt.onerror = () => { clearTimeout(timeout); resolve(); };
        
        currentUtterance = utt;
        try {
          window.speechSynthesis!.speak(utt);
        } catch (err) {
          console.warn('[TTS] speak() threw:', err);
          clearTimeout(timeout);
          resolve();
        }
      });
    } else {
      // Intermediate chunks: fire and wait via onend
      await new Promise<void>((resolve) => {
        utt.onend = () => resolve();
        utt.onerror = () => resolve();
        const timeout = setTimeout(() => resolve(), 10000);
        utt.onend = () => { clearTimeout(timeout); resolve(); };
        utt.onerror = () => { clearTimeout(timeout); resolve(); };
        try {
          window.speechSynthesis!.speak(utt);
        } catch {
          clearTimeout(timeout);
          resolve();
        }
      });
    }
  }
}

/** Stop any ongoing TTS immediately. */
export function stopSpeaking(): void {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

/** Check if TTS is currently speaking. */
export function isSpeaking(): boolean {
  return window.speechSynthesis?.speaking ?? false;
}

/**
 * Check if TTS is supported on this device.
 * Returns: 'full' | 'basic' | 'none'
 */
export function getTTSSupportLevel(): 'full' | 'basic' | 'none' {
  if (!window.speechSynthesis) return 'none';
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return 'basic';
  return 'full';
}

/** Split text into sentences, keeping each chunk under maxChars. */
function splitIntoSentences(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];
  
  const chunks: string[] = [];
  // Split on sentence boundaries for CJK and Latin scripts
  const parts = text.split(/(?<=[。！？.!?\n])/);
  let current = '';
  
  for (const part of parts) {
    if (current.length + part.length > maxChars && current.length > 0) {
      chunks.push(current.trim());
      current = part;
    } else {
      current += part;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  
  return chunks.length > 0 ? chunks : [text];
}
