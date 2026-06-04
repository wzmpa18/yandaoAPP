/**
 * Provider 工厂 — 全局单例入口
 * 
 * 整个应用通过此文件获取数据提供者。
 * 业务代码统一 import { provider } from 'providers'。
 * 
 * 切换后端方式（二选一）：
 * 1. 环境变量：VITE_PROVIDER=supabase|local|tencentcloud
 * 2. 代码配置：直接修改下方 DEFAULT_VENDOR
 * 
 * 双源共存：Supabase 和腾讯云可同时配置，通过 provider 切换，
 * 数据互不影响。
 */

import type { IAppProvider, ProviderVendor } from './types';
import { createLocalProvider } from './LocalAdapter';
import { createSupabaseProvider, resetSupabaseInstance } from './SupabaseAdapter';
import { createTencentCloudProvider } from './TencentCloudAdapter';

// ── 配置 ──────────────────────────────────────────────────────────────────────

/** 默认供应商：通过环境变量切换，未设置时自动检测 */
const DEFAULT_VENDOR: ProviderVendor =
  (import.meta.env.VITE_PROVIDER as ProviderVendor) || 'auto';

/** 当前活动的 Provider 实例 */
let currentProvider: IAppProvider | null = null;

/** 初始化中标志 */
let initializing = false;
let initPromise: Promise<IAppProvider> | null = null;

// ── 自动检测逻辑 ──────────────────────────────────────────────────────────────

function detectVendor(): ProviderVendor {
  const envVendor = import.meta.env.VITE_PROVIDER as ProviderVendor | undefined;
  if (envVendor && envVendor !== 'auto') return envVendor;

  // 检查 Supabase 配置
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes('your-supabase-url')) {
    return 'supabase';
  }

  // 检查腾讯云配置
  const tcbEnvId = import.meta.env.VITE_TCB_ENV_ID;
  if (tcbEnvId) return 'tencentcloud';

  // 默认降级到本地
  return 'local';
}

// ── 初始化 ────────────────────────────────────────────────────────────────────

async function createProvider(vendor: ProviderVendor): Promise<IAppProvider> {
  switch (vendor) {
    case 'supabase':
      return createSupabaseProvider();
    case 'tencentcloud':
      return createTencentCloudProvider();
    case 'local':
    default:
      return createLocalProvider();
  }
}

/** 初始化 Provider（自动检测或使用配置） */
export async function initProvider(vendor?: ProviderVendor): Promise<IAppProvider> {
  if (initializing && initPromise) return initPromise;

  const targetVendor = vendor ?? DEFAULT_VENDOR;
  const actualVendor = targetVendor === 'auto' ? detectVendor() : targetVendor;

  initializing = true;
  initPromise = createProvider(actualVendor).then(p => {
    currentProvider = p;
    initializing = false;
    console.log(`[Provider] Initialized with vendor: ${p.vendor}`);
    return p;
  });

  return initPromise;
}

/**
 * 运行时切换 Provider。
 * 会重置 Supabase 实例（如果之前用过），然后创建新的。
 */
export async function switchProvider(vendor: ProviderVendor): Promise<IAppProvider> {
  resetSupabaseInstance();
  currentProvider = null;
  initializing = false;
  initPromise = null;
  return initProvider(vendor);
}

/** 获取当前 Provider（需先调用 initProvider 或 getProvider） */
export async function getProvider(): Promise<IAppProvider> {
  if (currentProvider) return currentProvider;
  return initProvider();
}

/**
 * 同步获取 Provider（不初始化）。
 * 如果尚未初始化，返回本地 Provider 作为 fallback。
 */
export function getProviderSync(): IAppProvider {
  if (currentProvider) return currentProvider;
  return createLocalProvider();
}

/** 当前 Provider 供应商名称 */
export function getVendorName(): string {
  return currentProvider?.vendor ?? 'local';
}

/** 是否已初始化 */
export function isProviderReady(): boolean {
  return currentProvider !== null;
}

// ── 便捷导出：同步访问（推荐在组件挂载后使用）─────────────────────────────────

/**
 * 获取当前 Provider 的 data 层。
 * 若尚未异步初始化，返回 LocalAdapter 确保组件不会崩溃。
 */
export function data(): IAppProvider['data'] {
  return getProviderSync().data;
}

/** Alias for backward compatibility with code using `import { dp }` */
export { data as dp };

export function auth(): IAppProvider['auth'] {
  return getProviderSync().auth;
}

export function storage(): IAppProvider['storage'] {
  return getProviderSync().storage;
}

export function realtime(): IAppProvider['realtime'] {
  return getProviderSync().realtime;
}
