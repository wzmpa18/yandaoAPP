/**
 * 向后兼容层 — 此文件已废弃
 * 
 * 所有 supabase 调用已迁移到统一 Provider 抽象层。
 * 请使用 `import { data, auth, storage, realtime } from '../providers'` 代替。
 * 
 * 保留此文件供旧代码过渡使用，底层已委托给 Provider。
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const IS_PLACEHOLDER = !supabaseUrl || supabaseUrl.includes('your-supabase-url');

// Legacy supabase client — use providers instead
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'public' },
  global: {
    fetch: (...args: Parameters<typeof fetch>) => {
      const controller = new AbortController();
      // 极短超时：Supabase 不可用时快速降级到离线模式，避免页面卡顿
      const timeout = IS_PLACEHOLDER ? 300 : 1500;
      const timer = setTimeout(() => controller.abort(), timeout);
      const [url, init] = args;
      return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
    },
  },
});

export const hasRealSupabase = !IS_PLACEHOLDER;
