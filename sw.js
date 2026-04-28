const CACHE_NAME = 'mjh-studio-v2';
const urlsToCache = [
  '/mjh-studio/index.html',
  '/mjh-studio/manifest.json',
  '/mjh-studio/icons/icon-72x72.png',
  '/mjh-studio/icons/icon-96x96.png',
  '/mjh-studio/icons/icon-128x128.png',
  '/mjh-studio/icons/icon-144x144.png',
  '/mjh-studio/icons/icon-152x152.png',
  '/mjh-studio/icons/icon-192x192.png',
  '/mjh-studio/icons/icon-256x256.png',
  '/mjh-studio/icons/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/blockly/12.3.1/blockly.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/blockly/12.3.1/blocks.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/blockly/12.3.1/javascript.min.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage-compat.js',
  'https://unpkg.com/@ffmpeg/ffmpeg@0.12.6/dist/umd/ffmpeg.min.js'
];

// Install - Cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache for MJH Studio');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Fetch - Offline support
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
            return networkResponse;
          });
      })
      .catch(() => caches.match('/mjh-studio/index.html'))
  );
});

// Activate - Clean old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
