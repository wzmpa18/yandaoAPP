import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { ContentItem } from './database';

const SUPABASE_URL = 'https://mfwvwohgpxgeihmqludt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__ZE0j5B6kx6sVEGVcfrkIw_Q6kkGmsbN1dU';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'your_supabase_service_key_here';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    let query = supabase.from('contents').select('*');
    
    if (type) {
      query = query.eq('type', type);
    }
    if (language) {
      query = query.eq('language', language);
    }
    
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching items:', error);
      return [];
    }
    
    return data.map(this.mapToContentItem);
  },

  async getItemById(id: string): Promise<ContentItem | undefined> {
    const { data, error } = await supabase.from('contents').select('*').eq('id', id).single();
    
    if (error) {
      console.error('Error fetching item:', error);
      return undefined;
    }
    
    return this.mapToContentItem(data);
  },

  async addItem(item: Omit<ContentItem, 'id' | 'created_at' | 'usage_count'>): Promise<ContentItem | null> {
    const newItem: Omit<DatabaseContent, 'id' | 'created_at' | 'usage_count'> = {
      type: item.type,
      language: item.language,
      title: item.title || null,
      content: item.content,
      translation: item.translation || null,
      level: item.level || null,
      age_group: item.age_group || null,
      source: item.source,
    };
    
    const { data, error } = await supabase.from('contents').insert([newItem]).select().single();
    
    if (error) {
      console.error('Error adding item:', error);
      return null;
    }
    
    return this.mapToContentItem(data);
  },

  async addItems(items: Omit<ContentItem, 'id' | 'created_at' | 'usage_count'>[]): Promise<number> {
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
    
    const { error } = await supabase.from('contents').insert(dbItems);
    
    if (error) {
      console.error('Error adding items:', error);
      return 0;
    }
    
    return items.length;
  },

  async incrementUsage(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_usage', { content_id: id });
    
    if (error) {
      console.error('Error incrementing usage:', error);
    }
  },

  async getStats(): Promise<{ total: number; types: Record<string, number>; languages: Record<string, number> }> {
    const { data: totalData, error: totalError } = await supabase.from('contents').select('id', { count: 'exact' }).limit(0);
    const total = totalError ? 0 : (totalData as unknown as { count: number }[])[0]?.count || 0;
    
    const { data: typeData, error: typeError } = await supabase.from('contents').select('type').limit(1000);
    const types: Record<string, number> = {};
    if (!typeError && typeData) {
      typeData.forEach(item => {
        types[(item as DatabaseContent).type] = (types[(item as DatabaseContent).type] || 0) + 1;
      });
    }
    
    const { data: langData, error: langError } = await supabase.from('contents').select('language').limit(1000);
    const languages: Record<string, number> = {};
    if (!langError && langData) {
      langData.forEach(item => {
        languages[(item as DatabaseContent).language] = (languages[(item as DatabaseContent).language] || 0) + 1;
      });
    }
    
    return { total, types, languages };
  },

  async checkConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('contents').select('id').limit(1);
      return !error && data !== null;
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
