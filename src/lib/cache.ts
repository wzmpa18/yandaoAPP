interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const STORAGE_PREFIX = 'yandao_cache_';

export function getCache<T>(key: string, ttlMs: number = 300000): T | null {
  const memoryEntry = memoryCache.get(key);
  if (memoryEntry && Date.now() - memoryEntry.timestamp < ttlMs) {
    return memoryEntry.data as T;
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.timestamp < ttlMs) {
        memoryCache.set(key, parsed);
        return parsed.data as T;
      }
      localStorage.removeItem(STORAGE_PREFIX + key);
    }
  } catch {
    console.warn('LocalStorage access failed');
  }
  
  return null;
}

export function setCache<T>(key: string, data: T): void {
  const entry: CacheEntry<T> = { data, timestamp: Date.now() };
  memoryCache.set(key, entry);
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry));
  } catch {
    console.warn('LocalStorage write failed');
  }
}

export function clearCache(key?: string): void {
  if (key) {
    memoryCache.delete(key);
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {}
  } else {
    memoryCache.clear();
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(k);
        }
      });
    } catch {}
  }
}

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = 300000,
): Promise<T> {
  const cached = getCache<T>(key, ttlMs);
  if (cached !== null) {
    return cached;
  }
  
  const data = await fetcher();
  setCache(key, data);
  return data;
}