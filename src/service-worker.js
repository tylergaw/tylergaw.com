const CACHE_KEY = "30-tylergaw";
const CACHE_URLS = [
  "/",
  "/index.html",
  "/about/",
  "/articles/",
  "/purpose/",
  "/resume/",
  "/library/",
  "/manifest.json",
  "/css/tylergaw.css",
  "/images/the-work-shape-outside.svg",
  "/images/portrait-shape-outside.svg",
  "/images/article-thanks.svg",
  "/images/limbo-owl.png",
  "/images/limbo-owl.webp",
  "/images/jxa-chip.png",
  "/images/jxa-chip.webp",
  "/offline.html",
  "manifest.json"
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
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(res => res)
      .catch(err => {
        return caches.match(event.request)
          .then(res => res || caches.match("/offline.html"));
      })
  );
});
