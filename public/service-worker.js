const STATIC_CACHE = "static-cache-v1";
const DATA_CACHE = "data-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.js",
  "/indexedDB.js",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// install service worker:
// 1. cache static files
// 2. cache data data
self.addEventListener("install", function (event) {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(function (cache) {
        return cache.addAll(FILES_TO_CACHE);
      }),
      caches.open(DATA_CACHE).then(function (cache) {
        return cache.add("/api/transaction");
      }),
    ])
  );
});
