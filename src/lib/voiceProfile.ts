/**
 * Global voice profile system.
 * Stores user's chosen voice preset; used by AI Assistant and game feedback.
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
      return VOICE_PRESETS.find((p) => p.id === id) ?? VOICE_PRESETS[5]; // default: 知性学姐
    }
  } catch { /* */ }
  return VOICE_PRESETS[5];
}

export function saveVoicePreset(id: number): void {
  localStorage.setItem(STORAGE_KEY, String(id));
}

/** Speak text using the user's active voice preset and the target language. */
export function speakWithPreset(
  text: string,
  langCode: string,
  preset?: VoicePreset,
): void {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const p = preset ?? loadVoicePreset();
  const LANG_SR: Record<string, string> = {
    ja: 'ja-JP', ko: 'ko-KR', fr: 'fr-FR', es: 'es-ES',
    de: 'de-DE', it: 'it-IT', pt: 'pt-BR', ar: 'ar-SA', zh: 'zh-CN', en: 'en-US',
  };

  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = LANG_SR[langCode] ?? 'zh-CN';
  utt.pitch = p.pitch;
  utt.rate = p.rate;

  const voices = window.speechSynthesis.getVoices();
  const langPrefix = (LANG_SR[langCode] ?? 'zh').split('-')[0];
  const genderRe = p.genderHint === 'female' ? /female|woman|girl/i : /male|man|guy/i;
  const match =
    voices.find((v) => v.lang.startsWith(langPrefix) && genderRe.test(v.name)) ??
    voices.find((v) => v.lang.startsWith(langPrefix));
  if (match) utt.voice = match;

  window.speechSynthesis.speak(utt);
}
