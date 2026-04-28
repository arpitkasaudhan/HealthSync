const CACHE_NAME = 'healthsync-v3';

self.addEventListener('install', (event) => {
  // Don't pre-cache index.html — it must always be fetched fresh
  // so new deployments with new asset hashes are never blocked by stale cache
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Wipe every old cache version on activation
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // HTML navigation requests → network first, never cache
  // This prevents stale index.html serving wrong asset hashes after a redeploy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Hashed asset files (/assets/*.js, /assets/*.css) → cache first
  // Safe to cache forever because the hash changes with every build
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Everything else → network, no caching
  event.respondWith(fetch(event.request));
});

// Push notification from server
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const options = {
    body:    data.body    ?? 'You have a new notification.',
    icon:    data.icon    ?? '/raga-icon.svg',
    badge:   '/raga-icon.svg',
    tag:     data.tag     ?? 'healthsync',
    vibrate: [200, 100, 200],
    data:    { url: data.url ?? '/' },
  };
  event.waitUntil(self.registration.showNotification(data.title ?? 'HealthSync Alert', options));
});

// Notification click → focus existing window or open new one
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data?.url ?? '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(target);
    })
  );
});
