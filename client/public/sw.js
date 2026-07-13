const CACHE_NAME = "quizforge-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/favicon.png",
  "/favicon_io/site.webmanifest",
  "/favicon_io/favicon-32x32.png",
  "/favicon_io/favicon-16x16.png",
  "/favicon_io/favicon.ico",
  "/favicon_io/apple-touch-icon.png",
  "/favicon_io/android-chrome-192x192.png",
  "/favicon_io/android-chrome-512x512.png"
];

// Install Service Worker and cache core static shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching core shell assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate and remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker: Clearing legacy cache", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch events interceptor
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests and non-GET requests (e.g. POST api calls)
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // If calling local/remote backend APIs, run a Network-First strategy
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If successful response, clone and cache it
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, resClone);
          });
          return response;
        })
        .catch(() => {
          // If offline, check cache for the API response
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            
            // Fallback for API failure if not cached
            return new Response(
              JSON.stringify({
                success: false,
                message: "You are offline, and this resource is not cached.",
                offline: true
              }),
              { headers: { "Content-Type": "application/json" } }
            );
          });
        })
    );
    return;
  }

  // Standard static assets: Cache-First strategy (with network fallback)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Cache newly requested local assets dynamically
        if (response.status === 200 && url.origin === self.location.origin) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, resClone);
          });
        }
        return response;
      });
    }).catch((err) => {
      // Offline fallback: render index.html if navigating to a page route
      if (event.request.mode === "navigate") {
        return caches.match("/index.html");
      }
      // Propagate the network error so the browser knows the asset load failed
      throw err;
    })
  );
});
