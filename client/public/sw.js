const CACHE_NAME = "quizforge-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/src/main.jsx",
  "/src/App.jsx",
  "/src/components/Navbar.jsx",
  "/src/components/Logo.jsx",
  "/src/pages/Auth.jsx",
  "/src/pages/Dashboard.jsx",
  "/src/pages/QuizMenu.jsx",
  "/src/pages/Difficulty.jsx",
  "/src/pages/QuizPage.jsx",
  "/src/pages/ScorePage.jsx",
  "/src/pages/Leaderboard.jsx",
  "/src/pages/Profile.jsx",
  "/src/pages/Statistics.jsx",
  "/src/styles/globals.css",
  "/src/styles/Auth.css",
  "/src/styles/Dashboard.css",
  "/src/styles/QuizMenu.css",
  "/src/styles/Difficulty.css",
  "/src/styles/QuizPage.css",
  "/src/styles/ScorePage.css",
  "/src/styles/Leaderboard.css",
  "/src/styles/Profile.css",
  "/src/styles/Statistics.css",
  "/src/styles/Navbar.css",
  "/src/assets/Logo.png"
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
    }).catch(() => {
      // Offline fallback: render index.html if navigating to a page route
      if (event.request.mode === "navigate") {
        return caches.match("/index.html");
      }
    })
  );
});
