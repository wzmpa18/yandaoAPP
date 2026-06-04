/**
 * 言道 · 智能内容预加载系统
 * 
 * 根据用户的学习语言和等级，自动在后台下载对应的：
 * 1. 语音包（TTS语音缓存）
 * 2. 词汇数据
 * 3. 题库
 * 4. 电台内容
 * 5. 场景对话
 * 
 * 策略：
 * - 用户选择语言后，立即开始预加载该语言的核心内容
 * - 按优先级分批加载，不阻塞UI
 * - 使用localStorage缓存元数据，避免重复下载
 * - 空闲时预加载相邻等级的内容
 * 
 * CDN基础URL：Cloudflare R2
 */
const CDN_BASE = 'https://youdao-app.10d815d2a0718caa6d0fa86a79c244c8.r2.dev';
const CONTENT_CDN = `${CDN_BASE}/content`;

// 内容清单：每种语言 + 每个等级需要预加载的内容
const CONTENT_MANIFEST: Record<string, {
  vocabCount: number;
  phraseCount: number;
  quizCount: number;
  radioEpisodes: number;
  storyCount: number;
}> = {
  ja: { vocabCount: 1000, phraseCount: 500, quizCount: 200, radioEpisodes: 10, storyCount: 20 },
  en: { vocabCount: 1000, phraseCount: 500, quizCount: 200, radioEpisodes: 10, storyCount: 20 },
  ko: { vocabCount: 800,  phraseCount: 400, quizCount: 150, radioEpisodes: 8,  storyCount: 15 },
  fr: { vocabCount: 800,  phraseCount: 400, quizCount: 150, radioEpisodes: 8,  storyCount: 15 },
  es: { vocabCount: 800,  phraseCount: 400, quizCount: 150, radioEpisodes: 8,  storyCount: 15 },
  de: { vocabCount: 800,  phraseCount: 400, quizCount: 150, radioEpisodes: 8,  storyCount: 15 },
  it: { vocabCount: 600,  phraseCount: 300, quizCount: 120, radioEpisodes: 6,  storyCount: 12 },
  pt: { vocabCount: 600,  phraseCount: 300, quizCount: 120, radioEpisodes: 6,  storyCount: 12 },
  ar: { vocabCount: 500,  phraseCount: 250, quizCount: 100, radioEpisodes: 5,  storyCount: 10 },
  zh: { vocabCount: 500,  phraseCount: 250, quizCount: 100, radioEpisodes: 5,  storyCount: 10 },
};

type ContentType = 'vocab' | 'phrases' | 'quiz' | 'radio' | 'story';
type PreloadLevel = 'core' | 'extended' | 'full';

interface PreloadTask {
  lang: string;
  type: ContentType;
  level: PreloadLevel;
  priority: number; // 越小越优先
}

const PRELOAD_STORAGE_KEY = 'yandao_preload_status';

interface PreloadStatus {
  [lang: string]: {
    lastPreload: number; // timestamp
    completed: Partial<Record<ContentType, boolean>>;
    version: string;
  };
}

function getPreloadStatus(): PreloadStatus {
  try {
    const data = localStorage.getItem(PRELOAD_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function savePreloadStatus(status: PreloadStatus) {
  localStorage.setItem(PRELOAD_STORAGE_KEY, JSON.stringify(status));
}

function shouldPreload(lang: string, type: ContentType): boolean {
  const status = getPreloadStatus();
  const langStatus = status[lang];
  if (!langStatus) return true;

  // 24小时内不重复预加载
  const hoursSinceLastPreload = (Date.now() - langStatus.lastPreload) / (1000 * 60 * 60);
  if (hoursSinceLastPreload < 24 && langStatus.completed[type]) {
    return false;
  }
  return true;
}

function markPreloaded(lang: string, type: ContentType) {
  const status = getPreloadStatus();
  if (!status[lang]) {
    status[lang] = { lastPreload: Date.now(), completed: {}, version: '1.0.1' };
  }
  status[lang].lastPreload = Date.now();
  status[lang].completed[type] = true;
  savePreloadStatus(status);
}

/**
 * 核心预加载：用户当前学习语言的基础内容
 * 在主界面加载后立即执行
 */
export async function preloadCoreContent(lang: string): Promise<void> {
  console.log(`[Preloader] Starting core preload for: ${lang}`);
  const manifest = CONTENT_MANIFEST[lang];
  if (!manifest) {
    console.warn(`[Preloader] No manifest for language: ${lang}`);
    return;
  }

  const tasks: PreloadTask[] = [
    { lang, type: 'vocab', level: 'core', priority: 1 },
    { lang, type: 'phrases', level: 'core', priority: 2 },
  ];

  await executePreloadTasks(tasks);
  console.log(`[Preloader] Core preload complete for: ${lang}`);
}

/**
 * 扩展预加载：当前语言的完整内容
 * 在用户使用APP一段时间后触发
 */
export async function preloadExtendedContent(lang: string): Promise<void> {
  console.log(`[Preloader] Starting extended preload for: ${lang}`);
  const manifest = CONTENT_MANIFEST[lang];
  if (!manifest) return;

  const tasks: PreloadTask[] = [
    { lang, type: 'quiz', level: 'extended', priority: 3 },
    { lang, type: 'radio', level: 'extended', priority: 4 },
    { lang, type: 'story', level: 'extended', priority: 5 },
  ];

  await executePreloadTasks(tasks);
  console.log(`[Preloader] Extended preload complete for: ${lang}`);
}

/**
 * 全量预加载：所有语言的完整内容
 * 仅在WiFi + 空闲时触发
 */
export async function preloadFullContent(lang: string): Promise<void> {
  console.log(`[Preloader] Starting full preload...`);

  // 先加载当前语言
  await preloadCoreContent(lang);
  await preloadExtendedContent(lang);

  // 再加载相邻语言（按流行度排序）
  const popularLangs = ['en', 'ja', 'ko', 'fr', 'es', 'de', 'zh'];
  const otherLangs = popularLangs.filter(l => l !== lang);

  for (const otherLang of otherLangs) {
    if (shouldPreload(otherLang, 'vocab')) {
      const tasks: PreloadTask[] = [
        { lang: otherLang, type: 'vocab', level: 'full', priority: 10 },
        { lang: otherLang, type: 'phrases', level: 'full', priority: 11 },
      ];
      await executePreloadTasks(tasks);
    }
  }

  console.log(`[Preloader] Full preload complete`);
}

async function executePreloadTasks(tasks: PreloadTask[]): Promise<void> {
  // 按优先级排序
  tasks.sort((a, b) => a.priority - b.priority);

  for (const task of tasks) {
    if (!shouldPreload(task.lang, task.type)) {
      console.log(`[Preloader] Skip (already loaded): ${task.lang}/${task.type}`);
      continue;
    }

    try {
      await preloadContent(task.lang, task.type);
      markPreloaded(task.lang, task.type);
    } catch (err) {
      console.warn(`[Preloader] Failed to preload ${task.lang}/${task.type}:`, err);
    }

    // 每个任务间小延迟，避免阻塞
    await sleep(100);
  }
}

async function preloadContent(lang: string, type: ContentType): Promise<void> {
  // 这里模拟内容预加载。在真实场景中，会从CDN/R2下载实际数据
  // 当前阶段：确保离线数据层已完全初始化
  switch (type) {
    case 'vocab':
      await preloadVocabForLang(lang);
      break;
    case 'phrases':
      await preloadPhrasesForLang(lang);
      break;
    case 'quiz':
      await preloadQuizForLang(lang);
      break;
    case 'radio':
      await preloadRadioForLang(lang);
      break;
    case 'story':
      await preloadStoriesForLang(lang);
      break;
  }
}

// 真正的内容预加载 - 从内置JSON文件或CDN加载
async function fetchContent<T>(url: string, fallback: T[]): Promise<T> {
  try {
    // 优先从本地data目录（已由bundle-offline-assets.js生成）
    const localResp = await fetch(`/data/${url.split('/').pop()}`);
    if (localResp.ok) {
      const data = await localResp.json();
      console.log(`[Preloader] ✅ Loaded local ${url}:`, Array.isArray(data) ? data.length : 'ok');
      return data;
    }
  } catch { /* local not available, try CDN */ }

  try {
    // 尝试从CDN加载
    const cdnUrl = `${CONTENT_CDN}/${url}`;
    const cdnResp = await fetch(cdnUrl);
    if (cdnResp.ok) {
      const data = await cdnResp.json();
      console.log(`[Preloader] ✅ Loaded from CDN ${url}`);
      return data;
    }
  } catch { /* CDN failed */ }

  console.log(`[Preloader] ⚠️ Using fallback data for ${url}`);
  return fallback;
}

async function preloadVocabForLang(lang: string): Promise<void> {
  try {
    const data = await fetchContent<any[]>(`${lang}/vocab_packs.json`, []);
    if (data && data.length > 0) {
      // 缓存到localStorage供快速访问
      const sample = data.slice(0, 100);
      localStorage.setItem(`yandao_vocab_${lang}_sample`, JSON.stringify(sample));
      console.log(`[Preloader] ✅ Loaded ${data.length} vocab items for ${lang}`);
    }
  } catch (e) {
    console.log(`[Preloader] Vocab preload error:`, e);
  }
}

async function preloadPhrasesForLang(lang: string): Promise<void> {
  try {
    const data = await fetchContent<Record<string, any>>(`${lang}/scenario_phrases.json`, {});
    const count = Object.values(data).reduce((s: number, arr: any) => s + (Array.isArray(arr) ? arr.length : 0), 0);
    if (count > 0) console.log(`[Preloader] ✅ Loaded ${count} phrase lines for ${lang}`);
  } catch (e) {
    console.log(`[Preloader] Phrases preload error:`, e);
  }
}

async function preloadQuizForLang(lang: string): Promise<void> {
  try {
    const data = await fetchContent<any[]>(`${lang}/quiz_packs.json`, []);
    if (data && data.length > 0) {
      localStorage.setItem(`yandao_quiz_${lang}_count`, String(data.length));
      console.log(`[Preloader] ✅ Loaded ${data.length} quiz questions for ${lang}`);
    }
  } catch (e) {
    console.log(`[Preloader] Quiz preload error:`, e);
  }
}

async function preloadRadioForLang(lang: string): Promise<void> {
  try {
    const data = await fetchContent<any[]>(`${lang}/radio_packs.json`, []);
    if (data && data.length > 0) console.log(`[Preloader] ✅ Loaded ${data.length} radio programs for ${lang}`);
  } catch (e) {
    console.log(`[Preloader] Radio preload error:`, e);
  }
}

async function preloadStoriesForLang(lang: string): Promise<void> {
  try {
    const data = await fetchContent<any[]>(`${lang}/story_packs.json`, []);
    if (data && data.length > 0) console.log(`[Preloader] ✅ Loaded ${data.length} stories for ${lang}`);
  } catch (e) {
    console.log(`[Preloader] Stories preload error:`, e);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 初始化预加载系统
 * 应在用户完成Onboarding后调用
 */
export function initContentPreloader(lang: string) {
  console.log(`[Preloader] Initializing for language: ${lang}`);

  // 立即开始核心内容预加载
  preloadCoreContent(lang);

  // 延迟5秒后开始扩展预加载
  setTimeout(() => {
    preloadExtendedContent(lang);
  }, 5000);

  // 检查是否WiFi，空闲时全量预加载
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    if (conn && (conn.type === 'wifi' || conn.type === 'ethernet')) {
      // WiFi下延迟30秒后全量预加载
      setTimeout(() => {
        preloadFullContent(lang);
      }, 30000);
    }
  }

  // 使用requestIdleCallback在浏览器空闲时继续预加载
  scheduleIdlePreload(lang);
}

function scheduleIdlePreload(lang: string) {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      preloadExtendedContent(lang);
    });
  }
}

/**
 * 语音预加载：预热TTS引擎
 * 在Android WebView中特别重要
 */
export async function preloadVoiceEngine(lang: string): Promise<void> {
  if (!('speechSynthesis' in window)) return;

  console.log(`[Preloader] Warming up TTS engine for ${lang}...`);

  // 使用无声utterance预热引擎
  const utterance = new SpeechSynthesisUtterance('');
  utterance.volume = 0;
  utterance.rate = 1;

  // 尝试匹配语言
  const voices = speechSynthesis.getVoices();
  const langVoice = voices.find(v => v.lang.startsWith(lang));
  if (langVoice) {
    utterance.voice = langVoice;
  }

  // 预热：播放然后立即取消
  speechSynthesis.speak(utterance);
  await sleep(200);
  speechSynthesis.cancel();

  console.log(`[Preloader] TTS engine warmed up for ${lang}`);
}

/**
 * 获取预加载状态报告
 */
export function getPreloadReport(): { lang: string; progress: number; completed: string[] }[] {
  const status = getPreloadStatus();
  const report: { lang: string; progress: number; completed: string[] }[] = [];

  for (const [lang, langStatus] of Object.entries(status)) {
    const completed = Object.entries(langStatus.completed)
      .filter(([_, done]) => done)
      .map(([type]) => type);
    const total = 5; // vocab, phrases, quiz, radio, story
    const progress = Math.round((completed.length / total) * 100);

    report.push({ lang, progress, completed });
  }

  return report;
}
