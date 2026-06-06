/**
 * AI 学习监控服务
 * 全局跟踪用户学习行为，自动分析并提供个性化建议和学习路径
 */

interface LearningEvent {
  ts: number;
  type: 'checkin' | 'quiz' | 'game' | 'reading' | 'voice' | 'grammar' | 'vocab' | 'chat' | 'exam';
  langCode: string;
  score?: number;
  duration?: number; // seconds
  details?: string;
}

interface LearningStats {
  totalMinutes: number;
  totalQuizzes: number;
  totalGames: number;
  totalVoiceMinutes: number;
  streakDays: number;
  strongestArea: string;
  weakestArea: string;
  weeklyXP: number;
  level: number;
  suggestedPath: string[];
  recentEvents: LearningEvent[];
}

const MONITOR_KEY = 'yandao_ai_monitor_v1';
const MAX_EVENTS = 500;

function loadEvents(): LearningEvent[] {
  try {
    const raw = localStorage.getItem(MONITOR_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveEvents(events: LearningEvent[]): void {
  localStorage.setItem(MONITOR_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
}

/**
 * 记录学习事件
 */
export function trackLearningEvent(event: Omit<LearningEvent, 'ts'>): void {
  const events = loadEvents();
  events.push({ ...event, ts: Date.now() });
  saveEvents(events);
}

/**
 * 获取过去N天的学习事件
 */
export function getRecentEvents(days: number = 7): LearningEvent[] {
  const cutoff = Date.now() - days * 86400000;
  return loadEvents().filter(e => e.ts >= cutoff);
}

/**
 * 获取学习统计数据
 */
export function getLearningStats(): LearningStats {
  const events = getRecentEvents(7);
  const allEvents = loadEvents();

  const totalMinutes = events.reduce((sum, e) => sum + (e.duration || 5), 0);
  const totalQuizzes = events.filter(e => e.type === 'quiz' || e.type === 'exam').length;
  const totalGames = events.filter(e => e.type === 'game').length;
  const totalVoiceMinutes = events.filter(e => e.type === 'voice' || e.type === 'chat').reduce((s, e) => s + (e.duration || 3), 0);
  const streakDays = countStreakDays(allEvents);

  // Area analysis
  const areaScores: Record<string, { total: number; count: number }> = {
    vocabulary: { total: 0, count: 0 },
    grammar: { total: 0, count: 0 },
    reading: { total: 0, count: 0 },
    speaking: { total: 0, count: 0 },
    listening: { total: 0, count: 0 },
    writing: { total: 0, count: 0 },
  };

  events.forEach(e => {
    const area = eventToArea(e.type);
    if (area && e.score) {
      areaScores[area].total += e.score;
      areaScores[area].count += 1;
    }
  });

  const areas = Object.entries(areaScores).map(([name, data]) => ({
    name,
    avg: data.count > 0 ? data.total / data.count : 0,
    count: data.count,
  }));

  areas.sort((a, b) => b.avg - a.avg);
  const strongestArea = areas[0]?.name || 'vocabulary';
  const weakestArea = areas[areas.length - 1]?.name || 'grammar';

  // Weekly XP
  const weeklyXP = events.reduce((s, e) => s + (e.score || 0), 0);

  // Calculate level
  const level = Math.floor(weeklyXP / 100) + 1;

  // Generate learning path suggestions
  const suggestedPath = generateSuggestions(areas, events);

  return {
    totalMinutes,
    totalQuizzes,
    totalGames,
    totalVoiceMinutes,
    streakDays,
    strongestArea,
    weakestArea,
    weeklyXP,
    level,
    suggestedPath,
    recentEvents: events.slice(-10),
  };
}

function eventToArea(type: string): string | null {
  const map: Record<string, string> = {
    quiz: 'vocabulary', game: 'vocabulary',
    reading: 'reading', grammar: 'grammar',
    voice: 'speaking', chat: 'speaking',
    exam: 'vocabulary', vocab: 'vocabulary',
  };
  return map[type] || null;
}

function countStreakDays(events: LearningEvent[]): number {
  if (events.length === 0) return 0;
  const days = new Set<string>();
  events.forEach(e => {
    const d = new Date(e.ts);
    days.add(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);
  });
  const sortedDays = [...days].sort((a, b) => b.localeCompare(a));
  let streak = 0;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  
  for (let i = 0; i < sortedDays.length; i++) {
    const expected = new Date();
    expected.setDate(today.getDate() - i);
    const expectedStr = `${expected.getFullYear()}-${expected.getMonth() + 1}-${expected.getDate()}`;
    if (sortedDays.includes(expectedStr)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function generateSuggestions(areas: Array<{ name: string; avg: number; count: number }>, events: LearningEvent[]): string[] {
  const suggestions: string[] = [];
  
  const weakest = areas[areas.length - 1];
  if (weakest && weakest.count < 3) {
    suggestions.push(`🔍 你的「${areaNameZh(weakest.name)}」练习偏少，建议每天至少做1次${areaNameZh(weakest.name)}练习`);
  }

  const voiceEvents = events.filter(e => e.type === 'voice' || e.type === 'chat');
  if (voiceEvents.length < 5) {
    suggestions.push('🎤 口语练习次数较少，试试AI语音对话模式练习发音');
  }

  const gameEvents = events.filter(e => e.type === 'game');
  if (gameEvents.length < 3) {
    suggestions.push('🎮 通过游戏学习效果更好！去游戏大厅玩几个单词游戏吧');
  }

  if (events.length < 10) {
    suggestions.push('📖 每天坚持15分钟，一周后你会惊讶自己的进步！');
  }

  const readingEvents = events.filter(e => e.type === 'reading');
  if (readingEvents.length === 0) {
    suggestions.push('📚 建议尝试分级阅读，扩大词汇量最快的途径之一');
  }

  // Always add some positive reinforcement
  if (areas.some(a => a.count > 5)) {
    suggestions.push(`⭐ 你在「${areaNameZh(areas[0]?.name || '')}」方面表现突出，继续保持！`);
  }

  if (suggestions.length === 0) {
    suggestions.push('🎯 学习状态良好！建议挑战更高难度的内容');
    suggestions.push('🏆 试试参加模拟考试，检验你的真实水平');
  }

  return suggestions;
}

function areaNameZh(name: string): string {
  const map: Record<string, string> = {
    vocabulary: '词汇', grammar: '语法', reading: '阅读',
    speaking: '口语', listening: '听力', writing: '写作',
  };
  return map[name] || name;
}

/**
 * 获取学习报告（含AI建议）
 */
export function getLearningReport(): string {
  const stats = getLearningStats();
  const lines = [
    `📊 本周学习报告`,
    `━━━━━━━━━━━━━━━━`,
    `⏱ 学习时长: ${Math.round(stats.totalMinutes)}分钟`,
    `📝 做题数量: ${stats.totalQuizzes}题`,
    `🎮 游戏次数: ${stats.totalGames}次`,
    `🎤 口语练习: ${Math.round(stats.totalVoiceMinutes)}分钟`,
    `🔥 连续天数: ${stats.streakDays}天`,
    `⭐ 本周XP: ${stats.weeklyXP}`,
    `💪 强项: ${areaNameZh(stats.strongestArea)}`,
    `📈 待提升: ${areaNameZh(stats.weakestArea)}`,
    ``,
    `💡 AI建议:`,
    ...stats.suggestedPath.map(s => `  ${s}`),
  ];
  return lines.join('\n');
}

/**
 * 清除监控数据
 */
export function clearMonitorData(): void {
  localStorage.removeItem(MONITOR_KEY);
}

export type { LearningEvent, LearningStats };
