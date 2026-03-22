// Abuelitos Contentos — Service Worker
// Versión del caché — cámbiala cuando actualices el código
const CACHE_NAME = 'abuelitos-v1.0.0';

// Archivos que se guardan offline
const OFFLINE_ASSETS = [
  '/',
  '/app.html',
  '/capsulas.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400&family=Nunito:wght@400;600;700;800&display=swap'
];

// Página offline de respaldo
const OFFLINE_PAGE = '/app.html';

// ── INSTALL ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Guardando assets offline...');
      return cache.addAll(OFFLINE_ASSETS).catch(err => {
        console.warn('[SW] Algunos assets no se pudieron guardar:', err);
      });
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Limpiando caché antiguo:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ── FETCH — Estrategia: Network First, caché de respaldo ──
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Las llamadas a la API nunca van al caché
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Sin conexión. Los datos se sincronizarán cuando vuelvas a conectarte.' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Para el resto: Network First con caché de respaldo
  event.respondWith(
    fetch(request)
      .then(response => {
        // Guardar en caché si la respuesta es buena
        if (response.ok && request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        // Sin red — intentar desde caché
        return caches.match(request).then(cached => {
          if (cached) return cached;
          // Si no hay caché, mostrar app principal como fallback
          if (request.destination === 'document') {
            return caches.match(OFFLINE_PAGE);
          }
          return new Response('Sin conexión', { status: 503 });
        });
      })
  );
});

// ── PUSH NOTIFICATIONS (preparado para el futuro) ──
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body || '¡Tienes una notificación!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/app.html' },
    actions: [
      { action: 'open', title: 'Abrir app' },
      { action: 'close', title: 'Cerrar' }
    ]
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'Abuelitos Contentos', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'close') return;
  const url = event.notification.data?.url || '/app.html';
  event.waitUntil(clients.openWindow(url));
});
