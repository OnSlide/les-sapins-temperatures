const CACHE='les-sapins-temp-v2-2-20260814';
const CORE=['./index.html','./styles.css','./mobile-v2.css','./app.js','./mobile-v2.js','./manifest.webmanifest','./assets/logo-sapins.webp','./assets/logo-sapins.png','./assets/logo-sapins-pdf.png','./assets/icon-192.png','./assets/icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Toujours chercher la dernière version d'une page HTML sur le réseau.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => response)
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Les ressources statiques restent disponibles hors ligne.
  event.respondWith(
    caches.match(event.request).then(cached => cached ||
      fetch(event.request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
    )
  );
});
