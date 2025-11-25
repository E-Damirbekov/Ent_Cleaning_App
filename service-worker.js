const CACHE_NAME = 'recycling-app-v' + new Date().getTime();
// NOTE: we intentionally do not pre-cache styles.css here. CSS is frequently
// updated during development and can be cached aggressively by the SW. We
// rely on network-first for styles so the browser fetches the latest file.
const urlsToCache = [
  '/',
  '/index.html',
  '/script.js',
  '/qr-generator.html'
];

// Install event - cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event - delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, then cache
self.addEventListener('fetch', event => {
  const req = event.request;

  // Do not cache CSS files (or CSS requests with query-string). Serve
  // network-first and don't write CSS into the SW cache to avoid stale styles.
  const isStyleRequest = req.url.includes('styles.css') || req.destination === 'style';

  if (isStyleRequest) {
    event.respondWith(
      fetch(req)
        .then(response => response)
        .catch(() => caches.match(req))
    );
    return;
  }

  // For other resources, network-first and then cache the response.
  event.respondWith(
    fetch(req)
      .then(response => {
        // Clone and cache non-style responses
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          // Only cache GET requests
          if (req.method === 'GET') cache.put(req, responseToCache);
        });
        return response;
      })
      .catch(() => caches.match(req))
  );
});
