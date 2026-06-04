/**
 * 言道 · 学习历史记录管理系统
 * 
 * 功能：
 * 1. 记录用户所有学习活动
 * 2. 支持查看/删除历史记录释放存储
 * 3. 学习统计与成就追踪
 * 4. 自动根据学习进度更新内容
 */

const HISTORY_KEY = 'yandao_learning_history';
const STATS_KEY = 'yandao_learning_stats';
const SETTINGS_KEY = 'yandao_history_settings';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  type: 'vocab' | 'conversation' | 'quiz' | 'reading' | 'listening' | 'speaking' | 'grammar' | 'writing' | 'ai_chat' | 'pronunciation';
  language: string;
  content: string;
  contentId?: string;
  score?: number;
  duration?: number;
  correctCount?: number;
  totalCount?: number;
  details?: Record<string, any>;
}

export interface LearningStats {
  totalStudyMinutes: number;
  totalSessions: number;
  streakDays: number;
  longestStreak: number;
  lastStudyDate: string;
  vocabLearned: number;
  quizzesTaken: number;
  averageScore: number;
  languagesStudied: Record<string, number>;
  typeBreakdown: Record<string, number>;
}

export interface HistorySettings {
  maxHistoryEntries: number;
  autoCleanup: boolean;
  retentionDays: number;
}

const DEFAULT_SETTINGS: HistorySettings = {
  maxHistoryEntries: 2000,
  autoCleanup: true,
  retentionDays: 90,
};

// ==================== 历史记录操作 ====================

export function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
  const history = getHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    timestamp: Date.now(),
  };
  history.unshift(newEntry);
  if (history.length > getSettings().maxHistoryEntries) {
    history.splice(getSettings().maxHistoryEntries);
  }
  saveHistory(history);
  updateStats(entry);
  if (getSettings().autoCleanup) cleanupOldEntries();
}

export function getHistory(): HistoryEntry[] {
  try { const raw = localStorage.getItem(HISTORY_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
export function getHistoryByType(type: HistoryEntry['type']): HistoryEntry[] { return getHistory().filter(h => h.type === type); }
export function getHistoryByLanguage(lang: string): HistoryEntry[] { return getHistory().filter(h => h.language === lang); }
export function getRecentHistory(count = 20): HistoryEntry[] { return getHistory().slice(0, count); }

export function deleteHistoryEntry(id: string): boolean {
  const history = getHistory();
  const idx = history.findIndex(h => h.id === id);
  if (idx !== -1) { history.splice(idx, 1); saveHistory(history); return true; }
  return false;
}

export function deleteHistoryEntries(ids: string[]): number {
  const history = getHistory(); const set = new Set(ids);
  const before = history.length; saveHistory(history.filter(h => !set.has(h.id)));
  return before - history.filter(h => !set.has(h.id)).length;
}

export function deleteHistoryByType(type: HistoryEntry['type']): number {
  const h = getHistory(); const before = h.length;
  saveHistory(h.filter(x => x.type !== type)); return before - h.filter(x => x.type !== type).length;
}

export function clearAllHistory(): number {
  const c = getHistory().length;
  localStorage.removeItem(HISTORY_KEY); return c;
}

export function getStorageSize(): { entries: number; sizeKB: number } {
  const raw = localStorage.getItem(HISTORY_KEY) || '';
  return { entries: getHistory().length, sizeKB: Math.round((new Blob([raw]).size / 1024) * 100) / 100 };
}

// ==================== 清理功能 ====================

export function cleanupOldEntries(): number {
  const cutoff = Date.now() - getSettings().retentionDays * 86400000;
  return deleteHistoryBefore(cutoff);
}

export function deleteHistoryBefore(date: number): number {
  const h = getHistory(); const before = h.length;
  saveHistory(h.filter(x => x.timestamp >= date)); return before - h.filter(x => x.timestamp >= date).length;
}

export function compressHistory(): number {
  // 只保留必要字段，移除details等大数据
  const h = getHistory().map(({ id, timestamp, type, language, content, score }) =>
    ({ id, timestamp, type, language, content: content.slice(0, 100), score })
  );
  saveHistory(h as HistoryEntry[]);
  return getStorageSize().entries;
}

// ==================== 统计功能 ====================

function getStats(): LearningStats {
  try { const r = localStorage.getItem(STATS_KEY); return r ? JSON.parse(r) : getDefaultStats(); } catch { return getDefaultStats(); }
}

function getDefaultStats(): LearningStats {
  return {
    totalStudyMinutes: 0, totalSessions: 0, streakDays: 0, longestStreak: 0,
    lastStudyDate: '', vocabLearned: 0, quizzesTaken: 0, averageScore: 0,
    languagesStudied: {}, typeBreakdown: {},
  };
}

function saveStats(s: LearningStats): void { localStorage.setItem(STATS_KEY, JSON.stringify(s)); }

function updateStats(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
  const stats = getStats();
  stats.totalSessions++;
  stats.totalStudyMinutes += (entry.duration || 0) / 60;
  stats.languagesStudied[entry.language] = (stats.languagesStudied[entry.language] || 0) + 1;
  stats.typeBreakdown[entry.type] = (stats.typeBreakdown[entry.type] || 0) + 1;

  if (entry.type === 'quiz' && entry.score) {
    stats.quizzesTaken++;
    stats.averageScore = ((stats.averageScore * (stats.quizzesTaken - 1)) + entry.score) / stats.quizzesTaken;
  }
  if (entry.type === 'vocab') stats.vocabLearned++;

  // 连续学习天数
  const today = new Date().toISOString().split('T')[0];
  if (stats.lastStudyDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (stats.lastStudyDate === yesterday) {
      stats.streakDays++;
      if (stats.streakDays > stats.longestStreak) stats.longestStreak = stats.streakDays;
    } else if (stats.lastStudyDate && stats.lastStudyDate !== today) {
      stats.streakDays = 1;
    } else {
      stats.streakDays = 1;
    }
    stats.lastStudyDate = today;
  }

  saveStats(stats);
}

export function getLearningStats(): LearningStats { return getStats(); }

// ==================== 设置 ====================

export function getSettings(): HistorySettings {
  try { const r = localStorage.getItem(SETTINGS_KEY); return r ? { ...DEFAULT_SETTINGS, ...JSON.parse(r) } : DEFAULT_SETTINGS; }
  catch { return DEFAULT_SETTINGS; }
}

export function updateSettings(s: Partial<HistorySettings>): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...getSettings(), ...s }));
}

// ==================== 快捷方法 ====================

/** 记录词汇学习 */
export function recordVocabStudy(language: string, word: string, correct: boolean): void {
  addHistoryEntry({ type: 'vocab', language, content: `学习了单词: ${word}`, score: correct ? 100 : 0 });
}

/** 记录测验 */
export function recordQuiz(language: string, quizId: string, score: number, total: number, durationSec: number): void {
  addHistoryEntry({ type: 'quiz', language, contentId: quizId, content: `完成测验 #${quizId.slice(-6)}`, score: Math.round((score / total) * 100), duration: durationSec, correctCount: score, totalCount: total });
}

/** 记录AI对话 */
export function recordAIChat(language: string, messageCount: number, durationSec: number): void {
  addHistoryEntry({ type: 'ai_chat', language, content: `AI对话 ${messageCount}轮`, duration: durationSec });
}

/** 记录阅读 */
export function recordReading(language: string, storyId: string, title: string, durationSec: number): void {
  addHistoryEntry({ type: 'reading', language, contentId: storyId, content: `阅读: ${title}`, duration: durationSec });
}

/** 记录听力练习 */
export function recordListening(language: string, programId: string, title: string, durationSec: number): void {
  addHistoryEntry({ type: 'listening', language, contentId: programId, content: `听力: ${title}`, duration: durationSec });
}
