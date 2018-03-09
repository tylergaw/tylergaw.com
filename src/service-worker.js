const CACHE_KEY = "v5-tylergaw";
const CACHE_URLS = [
  "/",
  "/index.html",
  "/about/index.html",
  "/articles/index.html",
  "/purpose/index.html",
  "/manifest.json",
  "/css/tylergaw.css",
  "/images/the-work-shape-outside.svg",
  "/images/home-intro-bg-tile.svg",
  "/offline.html"
];

self.addEventListener("install", event =>
  event.waitUntil(
    caches.open(CACHE_KEY)
      .then(cache => cache.addAll(CACHE_URLS))
      .then(() => self.skipWaiting())
  )
);

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name.indexOf(CACHE_KEY) !== 0)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  )
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(res => res)
      .catch(err => {
        caches.match(event.request)
          .then(res => res || caches.match("/offline.html"));
      })
  );
});
