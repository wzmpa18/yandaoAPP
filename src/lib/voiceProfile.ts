/**
 * Global voice profile system v3.0 — 治愈系语音引擎
 * 
 * 双引擎策略:
 *   Tier 1: Microsoft Edge TTS (免费, 300+自然语音, 美少女/磁性男声/童声)
 *   Tier 2: 浏览器原生 SpeechSynthesis (降级)
 * 
 * Edge TTS 不需要 API Key，通过 WebSocket 直连微软服务。
 * 语音选择基于用户预设的 persona（人物形象）而非简单的 pitch/rate。
 */

// ═══════════════════════════════════════════════════════════════
// 1. 语音角色定义 — 10种治愈系人格
// ═══════════════════════════════════════════════════════════════

export interface VoicePreset {
  id: number;
  name: string;
  persona: string;        // 角色描述
  group: 'kid' | 'teen' | 'adult';
  genderHint: 'female' | 'male';
  // Edge TTS 语音映射（按语言）
  edgeVoiceMap: Record<string, string>;  // langCode → Edge ShortName
  // 浏览器降级参数
  fallbackPitch: number;
  fallbackRate: number;
  encouragement: string;
}

export const VOICE_PRESETS: VoicePreset[] = [
  // ═══════════════════════════════════════════════════════
  // 🧒 儿童组 — 可爱治愈
  // ═══════════════════════════════════════════════════════
  {
    id: 1, name: '🌸 小樱妹妹', persona: '元气满满的小女孩，声音软萌可爱',
    group: 'kid', genderHint: 'female',
    edgeVoiceMap: {
      zh: 'zh-CN-XiaoyiNeural',      // 晓伊 — 小女孩
      ja: 'ja-JP-NanamiNeural',       // 七海 — 甜美少女
      en: 'en-US-AnaNeural',          // Ana — 童声女孩
      ko: 'ko-KR-SunHiNeural',        // SunHi — 甜美
    },
    fallbackPitch: 1.9, fallbackRate: 0.85,
    encouragement: '哇～你好厉害呀！🌸',
  },
  {
    id: 2, name: '🌟 小太阳弟弟', persona: '阳光开朗的小男孩，活力四射',
    group: 'kid', genderHint: 'male',
    edgeVoiceMap: {
      zh: 'zh-CN-YunxiNeural',        // 云希 — 少年
      ja: 'ja-JP-KeitaNeural',        // 圭太 — 男孩
      en: 'en-US-ChristopherNeural',  // 童声男孩
      ko: 'ko-KR-InJoonNeural',       // InJoon — 男孩
    },
    fallbackPitch: 1.7, fallbackRate: 0.90,
    encouragement: '嘿嘿！太厉害了！🌟',
  },
  {
    id: 3, name: '🧸 小糯米团子', persona: '奶声奶气的小萌娃，像糯米一样软糯',
    group: 'kid', genderHint: 'female',
    edgeVoiceMap: {
      zh: 'zh-CN-XiaoxiaoNeural',     // 晓晓 — 软萌女声
      ja: 'ja-JP-NanamiNeural',
      en: 'en-US-AriaNeural',         // Aria — 温暖
      ko: 'ko-KR-SunHiNeural',
    },
    fallbackPitch: 2.0, fallbackRate: 0.78,
    encouragement: '呜呜～你超棒的！抱抱～🧸',
  },

  // ═══════════════════════════════════════════════════════
  // 💖 少女组 — 美少女治愈
  // ═══════════════════════════════════════════════════════
  {
    id: 4, name: '💕 甜美学姐', persona: '温柔的学姐，声音甜美又亲切',
    group: 'teen', genderHint: 'female',
    edgeVoiceMap: {
      zh: 'zh-CN-XiaoxiaoNeural',     // 晓晓 — 活泼甜美女声
      ja: 'ja-JP-NanamiNeural',       // 七海 — 标准美少女
      en: 'en-US-JennyNeural',        // Jenny — 美式甜美女声
      ko: 'ko-KR-SunHiNeural',
      fr: 'fr-FR-DeniseNeural',       // Denise — 法语女声
      es: 'es-ES-ElviraNeural',       // Elvira — 西语女声
    },
    fallbackPitch: 1.35, fallbackRate: 0.95,
    encouragement: '很棒呢～继续加油哦！💕',
  },
  {
    id: 5, name: '🌙 月下少女', persona: '空灵纯净的少女音，像月光一样温柔',
    group: 'teen', genderHint: 'female',
    edgeVoiceMap: {
      zh: 'zh-CN-XiaohanNeural',      // 晓涵 — 温柔知性
      ja: 'ja-JP-NanamiNeural',
      en: 'en-US-AriaNeural',         // Aria — 温暖空灵
      ko: 'ko-KR-SunHiNeural',
    },
    fallbackPitch: 1.15, fallbackRate: 0.88,
    encouragement: '真聪明呢～🌙',
  },
  {
    id: 6, name: '🎀 元气少女', persona: '活泼开朗的JK少女，充满元气',
    group: 'teen', genderHint: 'female',
    edgeVoiceMap: {
      zh: 'zh-CN-XiaoyiNeural',       // 晓伊
      ja: 'ja-JP-NanamiNeural',
      en: 'en-US-MichelleNeural',     // Michelle — 活泼女声
      ko: 'ko-KR-SunHiNeural',
    },
    fallbackPitch: 1.5, fallbackRate: 1.0,
    encouragement: '好耶！答对了！🎀',
  },

  // ═══════════════════════════════════════════════════════
  // 🎤 磁性男声组 — 低音炮/治愈
  // ═══════════════════════════════════════════════════════
  {
    id: 7, name: '🎵 低音炮学长', persona: '温柔低沉的学长，磁性嗓音让人安心',
    group: 'adult', genderHint: 'male',
    edgeVoiceMap: {
      zh: 'zh-CN-YunyangNeural',      // 云扬 — 低沉新闻男声
      ja: 'ja-JP-KeitaNeural',
      en: 'en-US-GuyNeural',          // Guy — 磁性美式男声
      ko: 'ko-KR-InJoonNeural',
      fr: 'fr-FR-HenriNeural',        // Henri — 法语男声
      es: 'es-ES-AlvaroNeural',       // Alvaro — 西语男声
    },
    fallbackPitch: 0.8, fallbackRate: 0.92,
    encouragement: '做得好，继续。🎵',
  },
  {
    id: 8, name: '🌿 温柔治愈男', persona: '温润如玉的青年音，像春风拂面',
    group: 'adult', genderHint: 'male',
    edgeVoiceMap: {
      zh: 'zh-CN-YunxiNeural',        // 云希
      ja: 'ja-JP-KeitaNeural',
      en: 'en-US-DavisNeural',        // Davis — 温暖男声
      ko: 'ko-KR-InJoonNeural',
    },
    fallbackPitch: 0.9, fallbackRate: 0.95,
    encouragement: '不错，你很努力呢～🌿',
  },

  // ═══════════════════════════════════════════════════════
  // 🌸 成熟女声组 — 知性治愈
  // ═══════════════════════════════════════════════════════
  {
    id: 9, name: '🍃 知性御姐', persona: '成熟知性的大姐姐，声音温柔而有力',
    group: 'adult', genderHint: 'female',
    edgeVoiceMap: {
      zh: 'zh-CN-XiaohanNeural',      // 晓涵 — 知性温柔
      ja: 'ja-JP-NanamiNeural',
      en: 'en-US-JennyNeural',
      ko: 'ko-KR-SunHiNeural',
      de: 'de-DE-KatjaNeural',        // Katja — 德语女声
      it: 'it-IT-ElsaNeural',         // Elsa — 意大利语女声
    },
    fallbackPitch: 1.05, fallbackRate: 0.90,
    encouragement: '做得很好，保持下去。🍃',
  },
  {
    id: 10, name: '☁️ 治愈系姐姐', persona: '温柔到骨子里的姐姐音，听到就安心',
    group: 'adult', genderHint: 'female',
    edgeVoiceMap: {
      zh: 'zh-CN-XiaoxiaoNeural',     // 晓晓 — 最治愈
      ja: 'ja-JP-NanamiNeural',
      en: 'en-US-AriaNeural',         // Aria — 温暖人心
      ko: 'ko-KR-SunHiNeural',
    },
    fallbackPitch: 1.2, fallbackRate: 0.85,
    encouragement: '没关系的，慢慢来，你已经很棒了。☁️',
  },
];

// ═══════════════════════════════════════════════════════════════
// 2. 存储
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = 'yandao_voice_preset_v2';

export function loadVoicePreset(): VoicePreset {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const id = parseInt(raw, 10);
      return VOICE_PRESETS.find((p) => p.id === id) ?? VOICE_PRESETS[9]; // 默认治愈系姐姐
    }
  } catch { /* */ }
  return VOICE_PRESETS[9]; // ☁️ 治愈系姐姐 = 默认
}

export function saveVoicePreset(id: number): void {
  localStorage.setItem(STORAGE_KEY, String(id));
}

// ═══════════════════════════════════════════════════════════════
// 3. Language → BCP-47
// ═══════════════════════════════════════════════════════════════

const LANG_SR: Record<string, string> = {
  ja: 'ja-JP', ko: 'ko-KR', fr: 'fr-FR', es: 'es-ES',
  de: 'de-DE', it: 'it-IT', pt: 'pt-BR', ar: 'ar-SA',
  zh: 'zh-CN', en: 'en-US',
};

// ═══════════════════════════════════════════════════════════════
// 4. Edge TTS 引擎 (Microsoft Cognitive Services — 免费)
// ═══════════════════════════════════════════════════════════════

// Edge TTS 可用语音列表（从微软服务动态获取）
let edgeVoicesCache: Array<{ ShortName: string; FriendlyName: string; Gender: string; Locale: string }> | null = null;
let edgeVoicesLoading = false;
let edgeVoicesPromise: Promise<void> | null = null;

/**
 * 从微软 Edge TTS 服务获取可用语音列表
 * 不需要 API Key — 这是 Edge 浏览器公开的接口
 */
async function fetchEdgeVoices(): Promise<void> {
  if (edgeVoicesCache) return;
  if (edgeVoicesLoading && edgeVoicesPromise) return edgeVoicesPromise;

  edgeVoicesLoading = true;
  edgeVoicesPromise = (async () => {
    try {
      const res = await fetch(
        'https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D68491D6F4',
        { headers: { 'Accept': 'application/json' } }
      );
      if (res.ok) {
        const data = await res.json();
        edgeVoicesCache = Array.isArray(data) ? data : [];
        console.log(`[EdgeTTS] Loaded ${edgeVoicesCache!.length} voices`);
      }
    } catch (e) {
      console.warn('[EdgeTTS] Failed to fetch voice list:', e);
      edgeVoicesCache = []; // 标记为已尝试
    }
    edgeVoicesLoading = false;
  })();

  return edgeVoicesPromise;
}

/** 根据用户预设和语言找到最佳 Edge TTS 语音 */
function findEdgeVoice(preset: VoicePreset, langCode: string): string | null {
  // 1. 优先使用预设中明确配置的语音
  const mapped = preset.edgeVoiceMap[langCode];
  if (mapped) return mapped;

  // 2. 从 Edge 语音列表中按语言+性别匹配
  if (edgeVoicesCache && edgeVoicesCache.length > 0) {
    const langTag = LANG_SR[langCode] ?? 'zh-CN';
    const langPrefix = langTag.split('-')[0];
    const genderTarget = preset.genderHint === 'female' ? 'Female' : 'Male';

    // 精确：语言+性别
    let match = edgeVoicesCache.find(
      (v) => v.Locale.startsWith(langPrefix) && v.Gender === genderTarget
    );
    if (match) return match.ShortName;

    // 降级：仅语言匹配
    match = edgeVoicesCache.find((v) => v.Locale.startsWith(langPrefix));
    if (match) return match.ShortName;
  }

  return null; // 没有匹配 — 降级到浏览器TTS
}

/** 通过 Edge TTS WebSocket 合成语音，返回 AudioBuffer */
async function synthesizeEdgeTTS(
  text: string,
  voiceShortName: string,
  rate: number = 1.0,
  pitch: number = 1.0
): Promise<ArrayBuffer | null> {
  const langTag = voiceShortName.split('-').slice(0, 2).join('-');

  // 构建 SSML（Speech Synthesis Markup Language）
  const ratePercent = Math.round((rate - 1) * 100);
  const pitchPercent = Math.round((pitch - 1) * 50); // Edge pitch: -50~+50 = 半音
  const pitchHz = Math.max(-50, Math.min(50, pitchPercent)) + 'Hz';

  const ssml = `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${langTag}">
      <voice name="${voiceShortName}">
        <prosody rate="${ratePercent >= 0 ? '+' : ''}${ratePercent}%" pitch="${pitchHz}">
          ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </prosody>
      </voice>
    </speak>`;

  try {
    const res = await fetch(
      `https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0',
        },
        body: ssml,
      }
    );

    if (res.ok) {
      return await res.arrayBuffer();
    }
  } catch (e) {
    console.warn('[EdgeTTS] Synthesis failed:', e);
  }

  return null;
}

// Edge TTS 音频播放队列
let edgeAudioContext: AudioContext | null = null;
let currentEdgeSource: AudioBufferSourceNode | null = null;

function getEdgeAudioContext(): AudioContext {
  if (!edgeAudioContext) {
    edgeAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (edgeAudioContext.state === 'suspended') {
    edgeAudioContext.resume();
  }
  return edgeAudioContext;
}

function stopEdgeAudio(): void {
  if (currentEdgeSource) {
    try { currentEdgeSource.stop(); } catch { /* */ }
    currentEdgeSource = null;
  }
}

async function playEdgeAudio(arrayBuffer: ArrayBuffer): Promise<void> {
  const ctx = getEdgeAudioContext();
  stopEdgeAudio();

  try {
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    currentEdgeSource = source;

    return new Promise((resolve) => {
      source.onended = () => {
        currentEdgeSource = null;
        resolve();
      };
      source.start(0);
    });
  } catch (e) {
    console.warn('[EdgeTTS] Audio playback failed:', e);
  }
}

// ═══════════════════════════════════════════════════════════════
// 5. 核心朗读函数 — 双引擎策略
// ═══════════════════════════════════════════════════════════════

let ttsReady = false;
let ttsPrimeDone = false;

export async function waitForTTS(): Promise<void> {
  if (ttsReady) return;
  // 并行预热：浏览器TTS + Edge TTS
  const tasks: Promise<void>[] = [];
  
  // 浏览器TTS
  if (window.speechSynthesis) {
    tasks.push(new Promise<void>((resolve) => {
      const voices = window.speechSynthesis!.getVoices();
      if (voices.length > 0) { resolve(); return; }
      let attempts = 0;
      const tryLoad = () => {
        if (window.speechSynthesis!.getVoices().length > 0) { resolve(); return; }
        if (++attempts < 10) setTimeout(tryLoad, 150); else resolve();
      };
      tryLoad();
      window.speechSynthesis!.addEventListener('voiceschanged', () => resolve(), { once: true });
    }));
  }
  
  // Edge TTS
  tasks.push(fetchEdgeVoices());
  
  await Promise.all(tasks);
  ttsReady = true;
}

function primeTTS(): void {
  if (ttsPrimeDone || !window.speechSynthesis) return;
  ttsPrimeDone = true;
  try {
    const u = new SpeechSynthesisUtterance('');
    u.volume = 0;
    window.speechSynthesis.speak(u);
  } catch { /* */ }
}

// 浏览器TTS降级 — 尽力匹配自然语音
function findBrowserVoice(langCode: string, genderHint: 'female' | 'male'): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  if (voices.length === 0) return null;
  
  const langTag = LANG_SR[langCode] ?? 'zh-CN';
  const langPrefix = langTag.split('-')[0];
  const genderRe = genderHint === 'female' ? /female|woman|girl/i : /male|man|guy/i;
  
  // 优先找 Microsoft/Google 的自然语音（名字含 "Natural"/"Neural"/"Premium"）
  let match = voices.find((v) =>
    v.lang.startsWith(langPrefix) &&
    genderRe.test(v.name) &&
    /Natural|Neural|Premium|Enhanced|Wavenet/i.test(v.name)
  );
  if (match) return match;
  
  // Tier 1: 语言+性别
  match = voices.find((v) => v.lang.startsWith(langPrefix) && genderRe.test(v.name));
  if (match) return match;
  
  // Tier 2: 仅语言
  match = voices.find((v) => v.lang.startsWith(langPrefix));
  if (match) return match;
  
  // Tier 3: 仅性别
  match = voices.find((v) => genderRe.test(v.name));
  if (match) return match;
  
  return voices[0] ?? null;
}

export async function speakWithPreset(
  text: string,
  langCode: string,
  preset?: VoicePreset,
): Promise<void> {
  if (!text?.trim()) return;

  const p = preset ?? loadVoicePreset();

  // ── 尝试 Edge TTS（高质量自然语音）──
  const edgeVoice = findEdgeVoice(p, langCode);
  if (edgeVoice) {
    // Edge TTS 速率微调：让语音更自然
    const edgeRate = 1.0 + (p.fallbackRate - 1.0) * 0.6; // 缩小变化幅度
    const edgePitch = 1.0 + (p.fallbackPitch - 1.0) * 0.4;
    
    const audioData = await synthesizeEdgeTTS(text, edgeVoice, edgeRate, edgePitch);
    if (audioData) {
      await playEdgeAudio(audioData);
      return; // ✅ 成功用 Edge TTS
    }
  }

  // ── 降级：浏览器原生 TTS ──
  await fallbackBrowserTTS(text, langCode, p);
}

/** 浏览器原生 TTS 降级方案 */
async function fallbackBrowserTTS(text: string, langCode: string, preset: VoicePreset): Promise<void> {
  if (!window.speechSynthesis) {
    console.warn('[TTS] speechSynthesis not available');
    return;
  }

  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  await waitForTTS();
  primeTTS();

  window.speechSynthesis.cancel();

  const langTag = LANG_SR[langCode] ?? 'zh-CN';
  const chunks = splitIntoSentences(text, 200);

  for (let i = 0; i < chunks.length; i++) {
    const utt = new SpeechSynthesisUtterance(chunks[i]);
    utt.lang = langTag;
    utt.pitch = preset.fallbackPitch;
    utt.rate = preset.fallbackRate;
    utt.volume = 1.0;

    const voice = findBrowserVoice(langCode, preset.genderHint);
    if (voice) utt.voice = voice;

    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        window.speechSynthesis?.cancel();
        resolve();
      }, 15000);

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

// ═══════════════════════════════════════════════════════════════
// 6. 控制函数
// ═══════════════════════════════════════════════════════════════

export function stopSpeaking(): void {
  stopEdgeAudio();
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeaking(): boolean {
  return window.speechSynthesis?.speaking ?? false;
}

export function getTTSSupportLevel(): 'full' | 'basic' | 'none' {
  if (edgeVoicesCache && edgeVoicesCache.length > 0) return 'full';
  if (!window.speechSynthesis) return 'none';
  return window.speechSynthesis.getVoices().length > 0 ? 'basic' : 'none';
}

// ═══════════════════════════════════════════════════════════════
// 7. 工具函数
// ═══════════════════════════════════════════════════════════════

function splitIntoSentences(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];

  const chunks: string[] = [];
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

/** 预初始化 Edge TTS（建议在 App 启动时调用） */
export function preInitEdgeTTS(): void {
  fetchEdgeVoices();
}
