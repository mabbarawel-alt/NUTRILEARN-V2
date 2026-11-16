// NutriLearn Service Worker - v7.8.0
const CACHE_NAME = 'nutrilearn-v7.8.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './css/components.css',
  './css/admin.css',
  './css/parent.css',
  './css/bhw.css',
  './css/mobile.css',
  './css/mobile-fixes.css',
  './js/config.js',
  './js/supabaseClient.js',
  './js/apiClient.js',
  './js/mobileUX.js',
  './js/i18n.js',
  './js/app.js',
  './js/data.js',
  './js/healthWorker.js',
  './js/parentLearning.js',
  './js/mealGuide.js',
  './js/mhoDashboard.js',
  './js/announcements.js',
  './js/security.js',
  './js/exportUtils.js',
  './js/reports.js',
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
  // API calls always go to the network. The app keeps its own offline copy in
  // localStorage and an outbox for writes; a cached /api/health would make an
  // offline phone think it is online.
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) return;

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
        // Scripts are requested with ?v= cache-busting; fall back to the precached file
        return caches.match(event.request).then((exact) => exact || caches.match(event.request, { ignoreSearch: true })).then((cachedResponse) => {
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
