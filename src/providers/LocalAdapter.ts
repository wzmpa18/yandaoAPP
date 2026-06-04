/**
 * LocalAdapter — 纯本地存储适配器
 * 
 * 使用 localStorage 作为数据存储，适用于：
 * - 离线模式 / 开发环境
 * - Supabase 未配置时自动降级
 * - 单机 Demo 演示
 * 
 * 所有数据持久化在浏览器 localStorage 中。
 * 
 * 修复：新增 seed() 方法，当表为空时自动预填种子数据，
 * 确保应用在离线模式下有完整的演示内容。
 */

import type {
  IDataProvider, IAuthProvider, IStorageProvider, IRealtimeProvider,
  IAppProvider, QueryFilter, InsertResult, AuthUser,
  RealtimeEvent, RealtimeSubscription,
} from './types';

// ── 本地数据库辅助 ────────────────────────────────────────────────────────────

const DB_PREFIX = 'gendou_db_';

function getTable(table: string): Record<string, unknown>[] {
  try {
    const raw = localStorage.getItem(`${DB_PREFIX}${table}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setTable(table: string, rows: Record<string, unknown>[]): void {
  try {
    localStorage.setItem(`${DB_PREFIX}${table}`, JSON.stringify(rows));
  } catch (e) {
    console.warn(`[LocalAdapter] Failed to write table "${table}":`, e);
  }
}

function matchFilter(row: Record<string, unknown>, filter?: QueryFilter): boolean {
  if (!filter) return true;

  if (filter.eq) {
    for (const [k, v] of Object.entries(filter.eq)) {
      if (row[k] !== v) return false;
    }
  }
  if (filter.neq) {
    for (const [k, v] of Object.entries(filter.neq)) {
      if (row[k] === v) return false;
    }
  }
  if (filter.in) {
    for (const [k, vals] of Object.entries(filter.in)) {
      if (!vals.includes(row[k] as string | number)) return false;
    }
  }
  if (filter.gte) {
    for (const [k, v] of Object.entries(filter.gte)) {
      if ((row[k] as number) < v) return false;
    }
  }
  if (filter.lte) {
    for (const [k, v] of Object.entries(filter.lte)) {
      if ((row[k] as number) > v) return false;
    }
  }
  if (filter.gt) {
    for (const [k, v] of Object.entries(filter.gt)) {
      if ((row[k] as number) <= v) return false;
    }
  }
  if (filter.lt) {
    for (const [k, v] of Object.entries(filter.lt)) {
      if ((row[k] as number) >= v) return false;
    }
  }
  return true;
}

// ── Data ──────────────────────────────────────────────────────────────────────

class LocalDataProvider implements IDataProvider {
  private seeded = false;

  isConnected(): boolean {
    return true; // localStorage is always available
  }

  /**
   * 预填种子数据。仅在表为空时执行，避免覆盖已有数据。
   * 确保应用首次启动时有完整的演示内容。
   */
  async seed(): Promise<void> {
    if (this.seeded) return; // 避免重复填充
    try {
      const seedKey = 'gendou_db_seeded_v1';
      if (localStorage.getItem(seedKey) === 'true') {
        this.seeded = true;
        return;
      }

      // 动态导入种子数据（避免循环依赖）
      const { seedAllTables } = await import('../data/seedData');
      await seedAllTables(this);
      
      localStorage.setItem(seedKey, 'true');
      this.seeded = true;
      console.log('[LocalAdapter] Seed data populated successfully');
    } catch (e) {
      console.warn('[LocalAdapter] Seed data population failed (non-critical):', e);
      // 不阻塞应用启动，后续可以重试
    }
  }

  async select(table: string, filter?: QueryFilter): Promise<Record<string, unknown>[]> {
    // 首次查询时自动填充种子数据
    if (!this.seeded) {
      await this.seed();
    }

    let rows = getTable(table);

    // Apply filter
    if (filter) {
      rows = rows.filter(r => matchFilter(r, filter));
    }

    // Apply ordering
    if (filter?.order) {
      const { column, ascending } = filter.order;
      rows.sort((a, b) => {
        const av = a[column], bv = b[column];
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return ascending ? cmp : -cmp;
      });
    }

    // Apply pagination
    if (filter?.offset !== undefined) {
      rows = rows.slice(filter.offset);
    }
    if (filter?.limit !== undefined) {
      rows = rows.slice(0, filter.limit);
    }

    return rows;
  }

  async selectOne(table: string, filter?: QueryFilter): Promise<Record<string, unknown> | null> {
    if (!this.seeded) await this.seed();
    const rows = await this.select(table, filter);
    return rows[0] ?? null;
  }

  async insert(table: string, rows: Record<string, unknown>[]): Promise<InsertResult[] | null> {
    if (!this.seeded) await this.seed();
    const existing = getTable(table);
    const inserted: InsertResult[] = [];
    for (const row of rows) {
      const withId = { ...row, id: row.id || `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}` };
      existing.push(withId);
      inserted.push(withId);
    }
    setTable(table, existing);
    return inserted;
  }

  async update(table: string, updates: Record<string, unknown>, filter: QueryFilter): Promise<boolean> {
    if (!this.seeded) await this.seed();
    const existing = getTable(table);
    let updated = 0;
    for (const row of existing) {
      if (matchFilter(row, filter)) {
        Object.assign(row, updates);
        updated++;
      }
    }
    if (updated > 0) setTable(table, existing);
    return updated > 0;
  }

  async delete(table: string, filter: QueryFilter): Promise<boolean> {
    if (!this.seeded) await this.seed();
    const existing = getTable(table);
    const before = existing.length;
    const remaining = existing.filter(r => !matchFilter(r, filter));
    setTable(table, remaining);
    return remaining.length < before;
  }

  async rpc(_fn: string, _params?: Record<string, unknown>): Promise<unknown> {
    if (!this.seeded) await this.seed();
    console.warn('[LocalAdapter] RPC not supported in local mode');
    return null;
  }

  async count(table: string, filter?: QueryFilter): Promise<number> {
    if (!this.seeded) await this.seed();
    const rows = await this.select(table, filter);
    return rows.length;
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

class LocalAuthProvider implements IAuthProvider {
  private currentUser: AuthUser | null = null;

  constructor() {
    try {
      const saved = localStorage.getItem('gendou_auth_user');
      if (saved) this.currentUser = JSON.parse(saved);
    } catch { /* ignore */ }
  }

  async getUser(): Promise<AuthUser | null> {
    return this.currentUser;
  }

  async signInWithEmail(email: string, _password: string): Promise<AuthUser | null> {
    const user: AuthUser = {
      id: `local_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email,
    };
    this.currentUser = user;
    localStorage.setItem('gendou_auth_user', JSON.stringify(user));
    return user;
  }

  async signInWithPhone(phone: string): Promise<boolean> {
    // Simulate OTP sending
    console.log(`[LocalAdapter] OTP sent to ${phone}`);
    return true;
  }

  async verifyPhoneOTP(phone: string, _code: string): Promise<AuthUser | null> {
    const user: AuthUser = {
      id: `local_phone_${phone}`,
      phone,
    };
    this.currentUser = user;
    localStorage.setItem('gendou_auth_user', JSON.stringify(user));
    return user;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('gendou_auth_user');
  }
}

// ── Storage ───────────────────────────────────────────────────────────────────

class LocalStorageProvider implements IStorageProvider {
  async upload(_bucket: string, path: string, file: File | Blob): Promise<string | null> {
    // In local mode, create a data URL and store it
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const key = `gendou_storage_${path}`;
      localStorage.setItem(key, dataUrl);
      return dataUrl;
    } catch {
      return null;
    }
  }

  getPublicUrl(_bucket: string, path: string): string {
    const key = `gendou_storage_${path}`;
    return localStorage.getItem(key) || '';
  }

  async delete(_bucket: string, path: string): Promise<boolean> {
    const key = `gendou_storage_${path}`;
    const existed = localStorage.getItem(key) !== null;
    localStorage.removeItem(key);
    return existed;
  }
}

// ── Realtime ──────────────────────────────────────────────────────────────────

class LocalRealtimeProvider implements IRealtimeProvider {
  subscribe(
    _table: string,
    _filter: { column: string; value: string },
    _onEvent: (event: RealtimeEvent, payload: Record<string, unknown>) => void,
  ): RealtimeSubscription {
    // Local mode does not support realtime subscriptions
    console.warn('[LocalAdapter] Realtime subscriptions not supported in local mode');
    return { unsubscribe: () => {} };
  }
}

// ── 导出工厂 ──────────────────────────────────────────────────────────────────

export function createLocalProvider(): IAppProvider {
  return {
    data: new LocalDataProvider(),
    auth: new LocalAuthProvider(),
    storage: new LocalStorageProvider(),
    realtime: new LocalRealtimeProvider(),
    vendor: 'local',
  };
}
