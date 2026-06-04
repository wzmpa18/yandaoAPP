import { getProviderSync } from '../providers';

// 延迟获取 data provider，避免模块初始化时序问题（与 supabase.ts 修复同理）
function dp() {
  try { return getProviderSync().data; } catch { throw new Error('[InfiniteGameGenerator] Provider not available'); }
}

export interface GameContent {
  id: string;
  lang_code: string;
  game_type: string;
  content_type: string;
  data: Record<string, unknown>;
  difficulty: number;
  usage_count: number;
}

// Local fallback content when DB has < 10 rows
const FALLBACK: Record<string, GameContent[]> = {};

function makeFallback(langCode: string, gameType: string): GameContent[] {
  const key = `${langCode}_${gameType}`;
  if (FALLBACK[key]) return FALLBACK[key];
  const vocab: Record<string, Array<[string,string]>> = {
    ja:[['猫','ねこ'],['犬','いぬ'],['山','やま'],['川','かわ'],['空','そら']],
    en:[['cat','cat'],['dog','dog'],['mountain','mountain'],['river','river'],['sky','sky']],
    ko:[['고양이','고양이'],['강아지','강아지'],['산','산'],['강','강'],['하늘','하늘']],
    fr:[['chat','chat'],['chien','chien'],['montagne','montagne'],['rivière','rivière'],['ciel','ciel']],
    es:[['gato','gato'],['perro','perro'],['montaña','montaña'],['río','río'],['cielo','cielo']],
    de:[['Katze','Katze'],['Hund','Hund'],['Berg','Berg'],['Fluss','Fluss'],['Himmel','Himmel']],
    it:[['gatto','gatto'],['cane','cane'],['montagna','montagna'],['fiume','fiume'],['cielo','cielo']],
    pt:[['gato','gato'],['cão','cão'],['montanha','montanha'],['rio','rio'],['céu','céu']],
    ar:[['قطة','قطة'],['كلب','كلب'],['جبل','جبل'],['نهر','نهر'],['سماء','سماء']],
    zh:[['成功','成功'],['学习','学习'],['努力','努力'],['坚持','坚持'],['进步','进步']],
  };
  const pairs = vocab[langCode] ?? vocab.en;
  FALLBACK[key] = pairs.map(([word, reading], i) => ({
    id: `fallback_${langCode}_${i}`,
    lang_code: langCode,
    game_type: gameType,
    content_type: 'vocab',
    data: { word, reading, meaning: word, theme: 'daily' },
    difficulty: 3,
    usage_count: 0,
  }));
  return FALLBACK[key];
}

export class InfiniteGameGenerator {
  static async getRandomContent(
    gameType: string,
    langCode: string,
    difficulty: number = 5,
    count: number = 10,
  ): Promise<GameContent[]> {
    try {
      const data = await dp().select('game_content_pool', {
        eq: { lang_code: langCode, game_type: gameType },
        lte: { difficulty: difficulty + 2 },
        gte: { difficulty: Math.max(1, difficulty - 2) },
        order: { column: 'usage_count', ascending: true },
        limit: count * 3,
      });

      if (!data || data.length === 0) {
        return this.aiGenerate(gameType, langCode, difficulty, count);
      }

      // Shuffle and slice to desired count
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, count) as GameContent[];

      // Record usage async (fire and forget)
      selected.forEach((c) => this.recordUsage(c.id));

      if (selected.length < count) {
        const extra = await this.aiGenerate(gameType, langCode, difficulty, count - selected.length);
        return [...selected, ...extra];
      }
      return selected;
    } catch {
      // DB query failed, use AI fallback
      return this.aiGenerate(gameType, langCode, difficulty, count);
    }
  }

  static async recordUsage(contentId: string): Promise<void> {
    if (contentId.startsWith('fallback_')) return;
    try {
      await dp().rpc('increment_usage_count', { row_id: contentId }).catch(() => {
        // Fallback: increment locally
        dp().selectOne('game_content_pool', { eq: { id: contentId } }).then(row => {
          if (row) {
            const current = (row.usage_count as number) || 0;
            dp().update('game_content_pool', { usage_count: current + 1 }, { eq: { id: contentId } });
          }
        });
      });
    } catch { /* ignore usage tracking errors */ }
  }

  static async aiGenerate(
    gameType: string,
    langCode: string,
    difficulty: number,
    count: number = 5,
  ): Promise<GameContent[]> {
    // Simulated AI generation — in production, call OpenAI API here
    const fallback = makeFallback(langCode, gameType);
    const shuffled = [...fallback].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((c) => ({ ...c, difficulty }));
  }

  static async getDailyChallenge(langCode: string): Promise<{
    id: string; game_type: string; challenge_data: Record<string, unknown>; reward_xp: number
  } | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await dp().selectOne('daily_challenges', {
        eq: { lang_code: langCode, date: today },
      });

      if (data) return data as { id: string; game_type: string; challenge_data: Record<string, unknown>; reward_xp: number };
    } catch {
      // DB query failed, use synthetic fallback below
    }

    // Generate a synthetic daily challenge
    return {
      id: `daily_${langCode}_${new Date().toISOString().split('T')[0]}`,
      game_type: 'word_hunter',
      challenge_data: {
        title: `今日挑战 · ${langCode.toUpperCase()}`,
        description: '完成3轮单词猎人，连击不断',
        target_score: 300,
        time_limit: 180,
      },
      reward_xp: 100,
    };
  }

  static async getSeasonInfo(): Promise<{
    id: string; season_number: number; end_date: string; reward_tiers: Record<string, unknown>
  } | null> {
    try {
      const data = await dp().selectOne('seasons', {
        order: { column: 'season_number', ascending: false },
      });
      return data as typeof data & { id: string; season_number: number; end_date: string; reward_tiers: Record<string, unknown> } | null;
    } catch {
      return null;
    }
  }

  static async updateSeasonScore(userId: string, scoreToAdd: number): Promise<void> {
    try {
      const season = await this.getSeasonInfo();
      if (!season) return;

      const existing = await dp().selectOne('season_rankings', {
        eq: { user_id: userId, season_id: season.id },
      });

      if (existing) {
        const currentScore = (existing.total_score as number) || 0;
        await dp().update('season_rankings', { total_score: currentScore + scoreToAdd, updated_at: new Date().toISOString() }, { eq: { id: existing.id as string } });
      } else {
        await dp().insert('season_rankings', [{ user_id: userId, season_id: season.id, total_score: scoreToAdd }]);
      }
    } catch { /* ignore season score errors */ }
  }
}
