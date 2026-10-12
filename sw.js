// NutriLearn Service Worker - v5.0.0
const CACHE_NAME = 'nutrilearn-v5.0.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './css/components.css',
  './css/admin.css',
  './css/parent.css',
  './js/i18n.js',
  './js/app.js',
  './js/data.js',
  './js/healthWorker.js',
  './js/parentLearning.js',
  './js/mhoDashboard.js',
  './js/announcements.js',
  './js/exportUtils.js',
  './icon/logo.png',
  './icon/Name.png',
  './assets/icons/logo.png',
  './assets/icons/brand-name.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-512.svg',
  './assets/images/module-malnutrition.jpg',
  './assets/images/module-complementary.jpg',
  './assets/images/module-meals.jpg',
  './assets/images/module-habits.jpg'
];

// Install Event - cache core static files immediately and skip waiting
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching NutriLearn app shell v2.3.0');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event - delete all previous caches immediately and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - NETWORK-FIRST with offline cache fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, copy);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
