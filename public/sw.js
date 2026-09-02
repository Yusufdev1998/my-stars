// Service Worker for Yulduzlar Osmoni PWA
const CACHE_NAME = "yulduzlar-osmoni-v1";
const STATIC_ASSETS = [
  "/",
  "/login",
  "/offline",
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Silently fail if some assets can't be cached
      });
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Cache first, then network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip API calls to external services
  if (url.pathname.startsWith("/api/") && request.method === "POST") {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            error: "Offline - API requests not available",
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
    return;
  }

  // For navigation requests, use network first, fall back to cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          return caches
            .match(request)
            .then((response) => response || new Response("Offline"));
        })
    );
    return;
  }

  // For other requests, use cache first, fall back to network
  event.respondWith(
    caches
      .match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          // Cache successful responses
          if (response.ok && request.method === "GET") {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        });
      })
      .catch(() => {
        // Return offline page or error response
        return new Response("Offline - Resource not available", {
          status: 503,
        });
      })
  );
});

// Background Sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-stars") {
    event.waitUntil(syncStars());
  }
});

async function syncStars() {
  try {
    // Get pending star updates from IndexedDB
    const db = await openIndexedDB();
    const pending = await getPendingUpdates(db);

    for (const update of pending) {
      try {
        await fetch(`/api/stars`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(update),
        });
        await removePendingUpdate(db, update.id);
      } catch (error) {
        console.error("Sync failed for update:", update.id);
      }
    }
  } catch (error) {
    console.error("Background sync error:", error);
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("yulduzlar-osmoni");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getPendingUpdates(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pending"], "readonly");
    const store = transaction.objectStore("pending");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removePendingUpdate(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
