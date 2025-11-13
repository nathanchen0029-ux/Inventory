// 给你的缓存起个名字，改版本时可以改这个字符串
const CACHE_NAME = 'milk-tea-inventory-v1';

// 哪些文件需要离线缓存
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './service-worker.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png'
];

// 安装阶段：预缓存上述文件
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 激活阶段：清理旧版本缓存（如果你之后改了 CACHE_NAME）
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 请求拦截：优先走缓存，缓存里没有再去网络拉
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
