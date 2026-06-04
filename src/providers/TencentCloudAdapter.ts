/**
 * TencentCloudAdapter — 腾讯云 CloudBase 适配器框架
 * 
 * 接口与 SupabaseAdapter 完全对齐，可无缝切换。
 * 
 * 使用方式：
 * 1. 安装 @cloudbase/js-sdk
 * 2. 在 .env 中设置 VITE_TCB_ENV_ID
 * 3. 设置 VITE_PROVIDER=tencentcloud
 * 
 * 当前为框架代码，需要接入实际的 CloudBase SDK 后启用。
 */

import type {
  IDataProvider, IAuthProvider, IStorageProvider, IRealtimeProvider,
  IAppProvider, QueryFilter, InsertResult, AuthUser,
  RealtimeEvent, RealtimeSubscription,
} from './types';

// ── 占位：接入 CloudBase SDK 后替换 ───────────────────────────────────────────

const TCB_ENV_ID = import.meta.env.VITE_TCB_ENV_ID || '';

class TencentCloudDataProvider implements IDataProvider {
  private connected = false;

  constructor() {
    // TODO: 接入 CloudBase SDK
    // import cloudbase from '@cloudbase/js-sdk';
    // this.app = cloudbase.init({ env: TCB_ENV_ID });
    // this.db = this.app.database();
    console.log('[TencentCloudAdapter] Framework ready, CloudBase SDK pending integration');
  }

  isConnected(): boolean {
    return this.connected && !!TCB_ENV_ID;
  }

  async select(table: string, filter?: QueryFilter): Promise<Record<string, unknown>[]> {
    // TODO: this.db.collection(table).where(filter).get()
    console.warn(`[TencentCloudAdapter] select ${table} — SDK not integrated, returning empty`, filter);
    return [];
  }

  async selectOne(table: string, filter?: QueryFilter): Promise<Record<string, unknown> | null> {
    const rows = await this.select(table, filter);
    return rows[0] ?? null;
  }

  async insert(table: string, rows: Record<string, unknown>[]): Promise<InsertResult[] | null> {
    // TODO: this.db.collection(table).add(rows)
    console.warn(`[TencentCloudAdapter] insert ${table} — SDK not integrated`, rows.length);
    return null;
  }

  async update(table: string, updates: Record<string, unknown>, filter: QueryFilter): Promise<boolean> {
    console.warn(`[TencentCloudAdapter] update ${table} — SDK not integrated`, updates, filter);
    return false;
  }

  async delete(table: string, filter: QueryFilter): Promise<boolean> {
    console.warn(`[TencentCloudAdapter] delete ${table} — SDK not integrated`, filter);
    return false;
  }

  async rpc(fn: string, params?: Record<string, unknown>): Promise<unknown> {
    // TODO: this.app.callFunction({ name: fn, data: params })
    console.warn(`[TencentCloudAdapter] rpc ${fn} — SDK not integrated`, params);
    return null;
  }

  async count(table: string, filter?: QueryFilter): Promise<number> {
    const rows = await this.select(table, filter);
    return rows.length;
  }
}

class TencentCloudAuthProvider implements IAuthProvider {
  async getUser(): Promise<AuthUser | null> {
    // TODO: this.app.auth().getLoginState()
    return null;
  }

  async signInWithEmail(_email: string, _password: string): Promise<AuthUser | null> {
    return null;
  }

  async signInWithPhone(_phone: string): Promise<boolean> {
    return false;
  }

  async verifyPhoneOTP(_phone: string, _code: string): Promise<AuthUser | null> {
    return null;
  }

  async signOut(): Promise<void> {
    // TODO: this.app.auth().signOut()
  }
}

class TencentCloudStorageProvider implements IStorageProvider {
  async upload(_bucket: string, _path: string, _file: File | Blob): Promise<string | null> {
    // TODO: this.app.uploadFile({ cloudPath, filePath })
    return null;
  }

  getPublicUrl(_bucket: string, _path: string): string {
    return '';
  }

  async delete(_bucket: string, _path: string): Promise<boolean> {
    return false;
  }
}

class TencentCloudRealtimeProvider implements IRealtimeProvider {
  subscribe(
    _table: string,
    _filter: { column: string; value: string },
    _onEvent: (event: RealtimeEvent, payload: Record<string, unknown>) => void,
  ): RealtimeSubscription {
    return { unsubscribe: () => {} };
  }
}

export function createTencentCloudProvider(): IAppProvider {
  return {
    data: new TencentCloudDataProvider(),
    auth: new TencentCloudAuthProvider(),
    storage: new TencentCloudStorageProvider(),
    realtime: new TencentCloudRealtimeProvider(),
    vendor: 'tencentcloud',
  };
}
