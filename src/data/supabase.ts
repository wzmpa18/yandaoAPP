import { getProviderSync } from '../providers';
import type { ContentItem } from './database';

/**
 * 延迟获取 data provider 实例，避免模块初始化时序问题。
 * 修复：原先 `import { data as dp }` 在模块顶层同步导入，若 provider
 * 尚未初始化（如自动检测 vendor 时），dp 可能为 undefined，
 * 导致 `dp.selectOne is not a function` 崩溃。
 * 现在每次调用时动态获取，确保拿到正确的 provider 实例。
 */
function dp() {
  try {
    return getProviderSync().data;
  } catch {
    // 极端降级：如果 getProviderSync 本身也出错，返回一个最小 fallback
    console.warn('[supabase] getProviderSync failed, using fallback data provider');
    const { createLocalProvider } = require('../providers/LocalAdapter');
    return createLocalProvider().data;
  }
}

/**
 * 创建一个可 then-able 的代理对象。
 * 让链式调用 supabase.from().select().eq()... 的任意位置都能 .then()/.catch()
 */
function makeThenable<T>(value: T): T & PromiseLike<T> {
  const p = Promise.resolve(value) as any;
  // 复制原值的所有属性到 promise 上
  for (const key in value as any) {
    if (!(key in p)) {
      Object.defineProperty(p, key, {
        get: () => (value as any)[key],
        enumerable: true,
      });
    }
  }
  return p;
}

// ── 向后兼容：supabase 导出 ──────────────────────────────────────────────────
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (col: string, val: unknown) => makeThenable({
        neq: (col2: string, val2: unknown) => makeThenable({
          limit: (n: number) => dp().select(table, { eq: { [col]: val }, neq: { [col2]: val2 }, limit: n }),
        }),
        order: (col2: string, opts: { ascending: boolean }) => makeThenable({
          range: (start: number, end: number) => dp().select(table, {
            eq: { [col]: val },
            order: { column: col2, ascending: opts.ascending },
            offset: start,
            limit: end - start + 1,
          }),
        }),
        limit: (n: number) => makeThenable(dp().select(table, { eq: { [col]: val }, limit: n })),
        single: () => dp().selectOne(table, { eq: { [col]: val } }),
        maybeSingle: () => dp().selectOne(table, { eq: { [col]: val } }),
      }),
      order: (col: string, opts: { ascending: boolean }) => makeThenable({
        limit: (n: number) => dp().select(table, { order: { column: col, ascending: opts.ascending }, limit: n }),
        range: (start: number, end: number) => dp().select(table, {
          order: { column: col, ascending: opts.ascending },
          offset: start,
          limit: end - start + 1,
        }),
      }),
      limit: (n: number) => makeThenable(dp().select(table, { limit: n })),
      single: () => dp().selectOne(table),
      maybeSingle: () => dp().selectOne(table),
    }),
    insert: (rows: unknown[]) => ({
      select: () => ({
        single: () => dp().insert(table, rows as Record<string, unknown>[]).then(result =>
          result ? { data: result[0], error: null } : { data: null, error: new Error('Insert failed') }
        ),
      }),
    }),
    update: (updates: Record<string, unknown>) => ({
      eq: (col: string, val: unknown) =>
        dp().update(table, updates, { eq: { [col]: val } }).then(() => ({ error: null })),
    }),
  }),
  rpc: (fn: string, params?: Record<string, unknown>) =>
    dp().rpc(fn, params).then(data => ({ data, error: null })),
  channel: (name: string) => ({
    on: (..._args: unknown[]) => ({
      subscribe: () => ({ unsubscribe: () => {} }),
    }),
  }),
};

export interface DatabaseContent {
  id: string;
  type: string;
  language: string;
  title: string | null;
  content: string;
  translation: string | null;
  level: string | null;
  age_group: string | null;
  source: string;
  created_at: string;
  usage_count: number;
}

export const supabaseDatabase = {
  async getItems(type?: string, language?: string, limit: number = 20, offset: number = 0): Promise<ContentItem[]> {
    try {
      const filter: Record<string, unknown> = {};
      if (type) filter.type = type;
      if (language) filter.language = language;

      const data = await dp().select('contents', {
        ...(Object.keys(filter).length > 0 ? { eq: filter as Record<string, string | number | boolean> } : {}),
        order: { column: 'created_at', ascending: false },
        offset,
        limit,
      });

      return (data ?? []).map((item: Record<string, unknown>) => ({
        id: item.id as string,
        type: item.type as ContentItem['type'],
        language: item.language as string,
        title: item.title as string | undefined,
        content: item.content as string,
        translation: item.translation as string | undefined,
        level: item.level as string | undefined,
        age_group: item.age_group as ContentItem['age_group'] | undefined,
        source: item.source as ContentItem['source'],
        created_at: item.created_at ? new Date(item.created_at as string).getTime() : Date.now(),
        usage_count: item.usage_count as number,
      }));
    } catch (e) {
      console.warn('[supabaseDatabase] getItems failed, returning empty:', e);
      return [];
    }
  },

  async getItemById(id: string): Promise<ContentItem | undefined> {
    try {
      const data = await dp().selectOne('contents', { eq: { id } });
      if (!data) return undefined;
      return {
        id: data.id as string,
        type: data.type as ContentItem['type'],
        language: data.language as string,
        title: data.title as string | undefined,
        content: data.content as string,
        translation: data.translation as string | undefined,
        level: data.level as string | undefined,
        age_group: data.age_group as ContentItem['age_group'] | undefined,
        source: data.source as ContentItem['source'],
        created_at: data.created_at ? new Date(data.created_at as string).getTime() : Date.now(),
        usage_count: data.usage_count as number,
      };
    } catch (e) {
      console.warn('[supabaseDatabase] getItemById failed:', e);
      return undefined;
    }
  },

  async addItem(item: Omit<ContentItem, 'id' | 'created_at' | 'usage_count'>): Promise<ContentItem | null> {
    try {
      const result = await dp().insert('contents', [{
        type: item.type,
        language: item.language,
        title: item.title || null,
        content: item.content,
        translation: item.translation || null,
        level: item.level || null,
        age_group: item.age_group || null,
        source: item.source,
      }]);
      if (!result || result.length === 0) return null;
      return this.getItemById(result[0].id as string) ?? null;
    } catch (e) {
      console.warn('[supabaseDatabase] addItem failed:', e);
      return null;
    }
  },

  async addItems(items: Omit<ContentItem, 'id' | 'created_at' | 'usage_count'>[]): Promise<number> {
    try {
      const dbItems = items.map(item => ({
        type: item.type,
        language: item.language,
        title: item.title || null,
        content: item.content,
        translation: item.translation || null,
        level: item.level || null,
        age_group: item.age_group || null,
        source: item.source,
      }));
      const result = await dp().insert('contents', dbItems);
      return result ? items.length : 0;
    } catch (e) {
      console.warn('[supabaseDatabase] addItems failed:', e);
      return 0;
    }
  },

  async incrementUsage(id: string): Promise<void> {
    try {
      await dp().rpc('increment_usage', { content_id: id });
    } catch (e) {
      console.warn('[supabaseDatabase] incrementUsage failed:', e);
    }
  },

  async getStats(): Promise<{ total: number; types: Record<string, number>; languages: Record<string, number> }> {
    try {
      const total = await dp().count('contents');
      
      const typeData = await dp().select('contents', { limit: 1000 });
      const types: Record<string, number> = {};
      (typeData ?? []).forEach((item: Record<string, unknown>) => {
        const t = item.type as string;
        types[t] = (types[t] || 0) + 1;
      });
      
      const langData = await dp().select('contents', { limit: 1000 });
      const languages: Record<string, number> = {};
      (langData ?? []).forEach((item: Record<string, unknown>) => {
        const l = item.language as string;
        languages[l] = (languages[l] || 0) + 1;
      });
      
      return { total, types, languages };
    } catch (e) {
      console.warn('[supabaseDatabase] getStats failed:', e);
      return { total: 0, types: {}, languages: {} };
    }
  },

  async checkConnection(): Promise<boolean> {
    try {
      return dp().isConnected();
    } catch {
      return false;
    }
  },

  mapToContentItem(data: DatabaseContent): ContentItem {
    return {
      id: data.id,
      type: data.type as ContentItem['type'],
      language: data.language,
      title: data.title || undefined,
      content: data.content,
      translation: data.translation || undefined,
      level: data.level || undefined,
      age_group: data.age_group as ContentItem['age_group'] || undefined,
      source: data.source as ContentItem['source'],
      created_at: new Date(data.created_at).getTime(),
      usage_count: data.usage_count,
    };
  },
};
