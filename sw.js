const CACHE = 'veil-vault-assets-v2'
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(['/', '/manifest.webmanifest', '/icon-192.png'])).then(() => self.skipWaiting()))
})
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((names) => Promise.all(names.filter((name) => name !== CACHE).map((name) => caches.delete(name)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return
  event.respondWith(caches.match(req).then((cached) => {
    const fresh = fetch(req).then((response) => {
      if (response.ok && response.type === 'basic') {
        const copy = response.clone()
        caches.open(CACHE).then((cache) => cache.put(req, copy))
      }
      return response
    }).catch(() => cached || (req.mode === 'navigate' ? caches.match('/') : Response.error()))
    return cached || fresh
  }))
})
