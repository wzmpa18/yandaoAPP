/**
 * 统一数据提供者接口 (DataProvider)
 * 
 * 所有数据访问、文件存储、用户认证、实时订阅都通过此抽象接口实现。
 * 业务代码不直接依赖 Supabase 或任何云服务商的 SDK。
 * 切换后端只需替换适配器，业务代码零改动。
 * 
 * 支持的适配器：
 * - SupabaseAdapter  (生产环境 - Supabase)
 * - LocalAdapter      (开发/离线 - localStorage)
 * - TencentCloudAdapter (腾讯云 CloudBase)
 * - 未来可扩展：AWS, 阿里云, 自建服务器...
 */

// ── 通用类型 ──────────────────────────────────────────────────────────────────

export interface QueryFilter {
  eq?: Record<string, string | number | boolean>;
  neq?: Record<string, string | number | boolean>;
  in?: Record<string, (string | number)[]>;
  gte?: Record<string, number>;
  lte?: Record<string, number>;
  gt?: Record<string, number>;
  lt?: Record<string, number>;
  or?: string; // e.g. "field1.eq.val1,field2.eq.val2"
  order?: { column: string; ascending: boolean };
  limit?: number;
  offset?: number;
}

export interface InsertResult {
  id?: string;
  [key: string]: unknown;
}

// ── 数据查询接口 ──────────────────────────────────────────────────────────────

export interface IDataProvider {
  /** 连接状态检查 */
  isConnected(): boolean;

  /** 查询数据 */
  select(table: string, filter?: QueryFilter): Promise<Record<string, unknown>[]>;

  /** 查询单条 */
  selectOne(table: string, filter?: QueryFilter): Promise<Record<string, unknown> | null>;

  /** 插入数据 */
  insert(table: string, rows: Record<string, unknown>[]): Promise<InsertResult[] | null>;

  /** 更新数据 */
  update(table: string, updates: Record<string, unknown>, filter: QueryFilter): Promise<boolean>;

  /** 删除数据 */
  delete(table: string, filter: QueryFilter): Promise<boolean>;

  /** 调用 RPC / 存储过程 */
  rpc(fn: string, params?: Record<string, unknown>): Promise<unknown>;

  /** 统计行数 */
  count(table: string, filter?: QueryFilter): Promise<number>;
}

// ── 认证接口 ──────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
}

export interface IAuthProvider {
  /** 获取当前用户 */
  getUser(): Promise<AuthUser | null>;

  /** 邮箱登录 */
  signInWithEmail(email: string, password: string): Promise<AuthUser | null>;

  /** 手机号登录 */
  signInWithPhone(phone: string): Promise<boolean>;

  /** 验证手机验证码 */
  verifyPhoneOTP(phone: string, code: string): Promise<AuthUser | null>;

  /** 退出登录 */
  signOut(): Promise<void>;
}

// ── 文件存储接口 ──────────────────────────────────────────────────────────────

export interface IStorageProvider {
  /** 上传文件 */
  upload(bucket: string, path: string, file: File | Blob): Promise<string | null>;

  /** 获取公开 URL */
  getPublicUrl(bucket: string, path: string): string;

  /** 删除文件 */
  delete(bucket: string, path: string): Promise<boolean>;
}

// ── 实时订阅接口 ──────────────────────────────────────────────────────────────

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

export interface RealtimeSubscription {
  unsubscribe: () => void;
}

export interface IRealtimeProvider {
  /** 订阅表的实时变更 */
  subscribe(
    table: string,
    filter: { column: string; value: string },
    onEvent: (event: RealtimeEvent, payload: Record<string, unknown>) => void,
  ): RealtimeSubscription;
}

// ── 统一 Provider 聚合接口 ────────────────────────────────────────────────────

export interface IAppProvider {
  data: IDataProvider;
  auth: IAuthProvider;
  storage: IStorageProvider;
  realtime: IRealtimeProvider;
  /** 供应商名称，用于日志/调试 */
  vendor: string;
}

// ── Provider 工厂配置 ─────────────────────────────────────────────────────────

export type ProviderVendor = 'supabase' | 'local' | 'tencentcloud' | 'custom';

export interface ProviderConfig {
  vendor: ProviderVendor;
  /** 自定义 Provider 实例（vendor='custom' 时使用） */
  customProvider?: IAppProvider;
  /** 供应商特定配置 */
  options?: Record<string, string>;
}

// Ensure this file has a runtime value export so Vite/ESM doesn't drop it
export const _providerTypesMarker = true;
