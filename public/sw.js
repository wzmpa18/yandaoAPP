/**
 * 言道 (Gendou) Service Worker
 * 
 * 功能：
 * 1. 预缓存核心应用资源（HTML/CSS/JS）
 * 2. 运行时缓存动态内容和API响应
 * 3. 离线回退支持
 * 4. 后台内容同步
 */

const CACHE_VERSION = 'yandao-v1.0.1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const CONTENT_CACHE = `${CACHE_VERSION}-content`;
const VOICE_CACHE = `${CACHE_VERSION}-voice`;

// 核心静态资源 — 必须预缓存
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/download.html',
  '/app.html',
  '/contact.html',
  '/feedback.html',
  '/privacy.html',
  '/terms.html',
  '/parrot.jpg',
  '/vite.svg',
  '/icon.svg',
];

// 安装事件：预缓存核心资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets...');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Some assets failed to pre-cache:', err);
      });
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// 激活事件：清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(key => key.startsWith('yandao-') && key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== CONTENT_CACHE && key !== VOICE_CACHE)
          .map(key => caches.delete(key))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 请求拦截：智能缓存策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非GET请求
  if (request.method !== 'GET') return;

  // 策略1：API请求 — Network First
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase.co')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // 策略2：静态资源（JS/CSS/字体）— Cache First
  if (
    url.pathname.match(/\.(js|css|woff2?|ttf|eot)$/) ||
    url.pathname.includes('/assets/')
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // 策略3：图片 — Stale While Revalidate
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // 策略4：语音/音频 — Network First, 大文件缓存
  if (url.pathname.match(/\.(mp3|wav|ogg|m4a|aac)$/) || url.pathname.includes('/audio/')) {
    event.respondWith(networkFirst(request, VOICE_CACHE));
    return;
  }

  // 策略5：HTML/页面 — Network First
  if (request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(networkFirst(request, STATIC_CACHE));
    return;
  }

  // 默认：Network First
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// ============= 缓存策略 =============

// Cache First：优先从缓存读取，缓存未命中才请求网络
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // 离线且无缓存时，返回离线页面
    if (request.mode === 'navigate') {
      const offlineCache = await caches.open(STATIC_CACHE);
      const offlinePage = await offlineCache.match('/offline.html');
      return offlinePage || new Response('您当前处于离线状态，请连接网络后重试', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
    throw err;
  }
}

// Network First：优先请求网络，失败时回退到缓存
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

// Stale While Revalidate：立即返回缓存，同时后台更新
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);

  return cached || fetchPromise;
}

// ============= 后台同步 =============

// 监听消息：允许主线程触发内容预加载
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRECACHE_CONTENT') {
    const urls = event.data.urls || [];
    console.log(`[SW] Pre-caching ${urls.length} content items...`);
    event.waitUntil(
      caches.open(CONTENT_CACHE).then(cache => {
        return Promise.allSettled(
          urls.map(url => 
            fetch(url).then(resp => {
              if (resp.ok) cache.put(url, resp.clone());
              return resp;
            }).catch(() => null)
          )
        );
      })
    );
  }

  if (event.data && event.data.type === 'PRECACHE_VOICE') {
    const voiceUrls = event.data.urls || [];
    console.log(`[SW] Pre-caching ${voiceUrls.length} voice items...`);
    event.waitUntil(
      caches.open(VOICE_CACHE).then(cache => {
        return Promise.allSettled(
          voiceUrls.map(url =>
            fetch(url).then(resp => {
              if (resp.ok) cache.put(url, resp.clone());
              return resp;
            }).catch(() => null)
          )
        );
      })
    );
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    const cacheToClear = event.data.cacheName;
    if (cacheToClear) {
      event.waitUntil(caches.delete(cacheToClear));
    }
  }
});

// 推送通知（未来功能）
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body || '学习时间到！',
    icon: '/parrot.jpg',
    badge: '/icon.svg',
    data: { url: data.url || '/' },
  };
  event.waitUntil(
    self.registration.showNotification(data.title || '言道学外语', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      if (clients.length > 0) {
        clients[0].focus();
        clients[0].navigate(url);
      } else {
        self.clients.openWindow(url);
      }
    })
  );
});
