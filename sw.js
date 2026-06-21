// Minimal service worker — just enough to satisfy PWA installability
// requirements (Chrome/Android needs an active service worker to show
// the "Add to Home Screen" / install prompt). No real offline caching
// logic yet — that can be added later if offline support matters.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Pass-through — just network fetch as normal for now.
  event.respondWith(fetch(event.request));
});
