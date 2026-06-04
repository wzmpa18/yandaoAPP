/**
 * SupabaseAdapter — Supabase 后端适配器
 * 
 * 将 Supabase SDK 封装为 IDataProvider / IAuthProvider / IStorageProvider / IRealtimeProvider 接口。
 * 业务代码只依赖接口，不直接 import supabase。
 */

import { createClient } from '@supabase/supabase-js';
import type {
  IDataProvider, IAuthProvider, IStorageProvider, IRealtimeProvider,
  IAppProvider, QueryFilter, InsertResult, AuthUser,
  RealtimeEvent, RealtimeSubscription,
} from './types';

// ── 配置 ──────────────────────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mfwvwohgpxgeihmqludt.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__ZE0j5B6kx6sVEGVcfrkIw_Q6kkGmsbN1dU';
const IS_PLACEHOLDER = !SUPABASE_URL || SUPABASE_URL.includes('your-supabase-url');

// ── Data ──────────────────────────────────────────────────────────────────────

class SupabaseDataProvider implements IDataProvider {
  private client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: { schema: 'public' },
    global: {
      fetch: (...args: Parameters<typeof fetch>) => {
        const controller = new AbortController();
        const timeout = IS_PLACEHOLDER ? 500 : 8000;
        const timer = setTimeout(() => controller.abort(), timeout);
        const [url, init] = args;
        return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
      },
    },
  });

  private connected = false;

  async checkConnection(): Promise<void> {
    if (IS_PLACEHOLDER) {
      this.connected = false;
      return;
    }
    try {
      const { data, error } = await this.client.from('contents').select('id').limit(1);
      this.connected = !error && data !== null;
    } catch {
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected && !IS_PLACEHOLDER;
  }

  private buildQuery(table: string, filter?: QueryFilter) {
    let query = this.client.from(table).select('*');

    if (filter?.eq) {
      for (const [k, v] of Object.entries(filter.eq)) query = query.eq(k, v);
    }
    if (filter?.neq) {
      for (const [k, v] of Object.entries(filter.neq)) query = query.neq(k, v);
    }
    if (filter?.gte) {
      for (const [k, v] of Object.entries(filter.gte)) query = query.gte(k, v);
    }
    if (filter?.lte) {
      for (const [k, v] of Object.entries(filter.lte)) query = query.lte(k, v);
    }
    if (filter?.gt) {
      for (const [k, v] of Object.entries(filter.gt)) query = query.gt(k, v);
    }
    if (filter?.lt) {
      for (const [k, v] of Object.entries(filter.lt)) query = query.lt(k, v);
    }
    if (filter?.or) {
      query = query.or(filter.or);
    }
    if (filter?.order) {
      query = query.order(filter.order.column, { ascending: filter.order.ascending });
    }
    if (filter?.limit !== undefined) {
      query = query.limit(filter.limit);
    }
    if (filter?.offset !== undefined) {
      query = query.range(filter.offset, filter.offset + (filter.limit || 20) - 1);
    }

    return query;
  }

  async select(table: string, filter?: QueryFilter): Promise<Record<string, unknown>[]> {
    if (!this.isConnected()) return [];
    try {
      const query = this.buildQuery(table, filter);
      const { data, error } = await query;
      if (error) { console.error(`[SupabaseAdapter] select ${table}:`, error); return []; }
      return (data as Record<string, unknown>[]) ?? [];
    } catch (e) {
      console.error(`[SupabaseAdapter] select ${table}:`, e);
      return [];
    }
  }

  async selectOne(table: string, filter?: QueryFilter): Promise<Record<string, unknown> | null> {
    if (!this.isConnected()) return null;
    try {
      const query = this.buildQuery(table, filter).limit(1);
      const { data, error } = await query;
      if (error || !data || data.length === 0) return null;
      return data[0] as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  async insert(table: string, rows: Record<string, unknown>[]): Promise<InsertResult[] | null> {
    if (!this.isConnected()) return null;
    try {
      const { data, error } = await this.client.from(table).insert(rows).select();
      if (error) { console.error(`[SupabaseAdapter] insert ${table}:`, error); return null; }
      return (data as InsertResult[]) ?? null;
    } catch (e) {
      console.error(`[SupabaseAdapter] insert ${table}:`, e);
      return null;
    }
  }

  async update(table: string, updates: Record<string, unknown>, filter: QueryFilter): Promise<boolean> {
    if (!this.isConnected()) return false;
    try {
      let query = this.client.from(table).update(updates);
      if (filter.eq) for (const [k, v] of Object.entries(filter.eq)) query = query.eq(k, v);
      const { error } = await query;
      return !error;
    } catch {
      return false;
    }
  }

  async delete(table: string, filter: QueryFilter): Promise<boolean> {
    if (!this.isConnected()) return false;
    try {
      let query = this.client.from(table).delete();
      if (filter.eq) for (const [k, v] of Object.entries(filter.eq)) query = query.eq(k, v);
      const { error } = await query;
      return !error;
    } catch {
      return false;
    }
  }

  async rpc(fn: string, params?: Record<string, unknown>): Promise<unknown> {
    if (!this.isConnected()) return null;
    try {
      const { data, error } = await this.client.rpc(fn, params ?? {});
      if (error) { console.error(`[SupabaseAdapter] rpc ${fn}:`, error); return null; }
      return data;
    } catch {
      return null;
    }
  }

  async count(table: string, filter?: QueryFilter): Promise<number> {
    if (!this.isConnected()) return 0;
    try {
      let query = this.client.from(table).select('*', { count: 'exact', head: true });
      if (filter?.eq) for (const [k, v] of Object.entries(filter.eq)) query = query.eq(k, v);
      const { count, error } = await query;
      return error ? 0 : (count ?? 0);
    } catch {
      return 0;
    }
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

class SupabaseAuthProvider implements IAuthProvider {
  private client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async getUser(): Promise<AuthUser | null> {
    try {
      const { data } = await this.client.auth.getUser();
      if (!data.user) return null;
      return {
        id: data.user.id,
        email: data.user.email,
        phone: data.user.phone,
        metadata: data.user.user_metadata as Record<string, unknown>,
      };
    } catch {
      return null;
    }
  }

  async signInWithEmail(email: string, password: string): Promise<AuthUser | null> {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error || !data.user) return null;
    return { id: data.user.id, email: data.user.email };
  }

  async signInWithPhone(phone: string): Promise<boolean> {
    const { error } = await this.client.auth.signInWithOtp({ phone });
    return !error;
  }

  async verifyPhoneOTP(phone: string, code: string): Promise<AuthUser | null> {
    const { data, error } = await this.client.auth.verifyOtp({ phone, token: code, type: 'sms' });
    if (error || !data.user) return null;
    return { id: data.user.id, phone: data.user.phone };
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
  }
}

// ── Storage ───────────────────────────────────────────────────────────────────

class SupabaseStorageProvider implements IStorageProvider {
  private client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async upload(bucket: string, path: string, file: File | Blob): Promise<string | null> {
    try {
      const { data, error } = await this.client.storage.from(bucket).upload(path, file, { upsert: true });
      if (error) { console.error(`[SupabaseAdapter] upload:`, error); return null; }
      return data?.path ?? null;
    } catch {
      return null;
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl ?? '';
  }

  async delete(bucket: string, path: string): Promise<boolean> {
    try {
      const { error } = await this.client.storage.from(bucket).remove([path]);
      return !error;
    } catch {
      return false;
    }
  }
}

// ── Realtime ──────────────────────────────────────────────────────────────────

class SupabaseRealtimeProvider implements IRealtimeProvider {
  private client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  subscribe(
    table: string,
    filter: { column: string; value: string },
    onEvent: (event: RealtimeEvent, payload: Record<string, unknown>) => void,
  ): RealtimeSubscription {
    const channel = this.client
      .channel(`realtime:${table}:${filter.value}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter: `${filter.column}=eq.${filter.value}` },
        (payload) => {
          const eventMap: Record<string, RealtimeEvent> = {
            INSERT: 'INSERT',
            UPDATE: 'UPDATE',
            DELETE: 'DELETE',
          };
          const event = eventMap[payload.eventType] ?? 'UPDATE';
          onEvent(event, payload.new as Record<string, unknown>);
        },
      )
      .subscribe();

    return { unsubscribe: () => channel.unsubscribe() };
  }
}

// ── 导出工厂 ──────────────────────────────────────────────────────────────────

let instance: SupabaseAppProvider | null = null;

class SupabaseAppProvider implements IAppProvider {
  data: SupabaseDataProvider;
  auth: SupabaseAuthProvider;
  storage: SupabaseStorageProvider;
  realtime: SupabaseRealtimeProvider;
  vendor = 'supabase';

  constructor() {
    this.data = new SupabaseDataProvider();
    this.auth = new SupabaseAuthProvider();
    this.storage = new SupabaseStorageProvider();
    this.realtime = new SupabaseRealtimeProvider();
  }

  async init(): Promise<void> {
    await this.data.checkConnection();
  }
}

export async function createSupabaseProvider(): Promise<IAppProvider> {
  if (!instance) {
    instance = new SupabaseAppProvider();
    await instance.init();
  }
  return instance;
}

/** 重置实例（切换 provider 时调用） */
export function resetSupabaseInstance(): void {
  instance = null;
}
