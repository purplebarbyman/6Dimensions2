// sw.js
const CACHE_NAME = 'wellness-superhero-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/gallery.html',
  '/css/style.css',
  '/js/app.js',
  '/js/gallery.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
