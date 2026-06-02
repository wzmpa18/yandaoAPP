import { supabase } from './supabase';

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
    const { data, error } = await supabase
      .from('game_content_pool')
      .select('*')
      .eq('lang_code', langCode)
      .eq('game_type', gameType)
      .lte('difficulty', difficulty + 2)
      .gte('difficulty', Math.max(1, difficulty - 2))
      .order('usage_count', { ascending: true })
      .limit(count * 3); // fetch more, then shuffle

    if (error || !data || data.length === 0) {
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
  }

  static async recordUsage(contentId: string): Promise<void> {
    if (contentId.startsWith('fallback_')) return;
    await supabase.rpc('increment_usage_count', { row_id: contentId }).catch(() => {
      // Fallback: direct update
      supabase
        .from('game_content_pool')
        .update({ usage_count: supabase.rpc('usage_count') })
        .eq('id', contentId)
        .then(() => {});
    });
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
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('lang_code', langCode)
      .eq('date', today)
      .maybeSingle();

    if (data) return data as { id: string; game_type: string; challenge_data: Record<string, unknown>; reward_xp: number };

    // Generate a synthetic daily challenge
    return {
      id: `daily_${langCode}_${today}`,
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
    const { data } = await supabase
      .from('seasons')
      .select('*')
      .order('season_number', { ascending: false })
      .limit(1)
      .maybeSingle();
    return data as typeof data & { id: string; season_number: number; end_date: string; reward_tiers: Record<string, unknown> } | null;
  }

  static async updateSeasonScore(userId: string, scoreToAdd: number): Promise<void> {
    const season = await this.getSeasonInfo();
    if (!season) return;

    const { data: existing } = await supabase
      .from('season_rankings')
      .select('id, total_score')
      .eq('user_id', userId)
      .eq('season_id', season.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('season_rankings')
        .update({ total_score: existing.total_score + scoreToAdd, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('season_rankings')
        .insert({ user_id: userId, season_id: season.id, total_score: scoreToAdd });
    }
  }
}
