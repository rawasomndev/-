/* offline cache for mufradati */
const CACHE = "mufradati-37bcb4e0e1";
const FILES = [
"./",
"fonts/bricolage-grotesque-latin-ext-opsz-normal.woff2",
"fonts/bricolage-grotesque-latin-opsz-normal.woff2",
"fonts/fonts.css",
"fonts/readex-pro-arabic-300-normal.woff2",
"fonts/readex-pro-arabic-400-normal.woff2",
"fonts/readex-pro-arabic-500-normal.woff2",
"fonts/readex-pro-arabic-600-normal.woff2",
"fonts/readex-pro-arabic-700-normal.woff2",
"fonts/readex-pro-latin-300-normal.woff2",
"fonts/readex-pro-latin-400-normal.woff2",
"fonts/readex-pro-latin-500-normal.woff2",
"fonts/readex-pro-latin-600-normal.woff2",
"fonts/readex-pro-latin-700-normal.woff2",
"fonts/readex-pro-latin-ext-300-normal.woff2",
"fonts/readex-pro-latin-ext-400-normal.woff2",
"fonts/readex-pro-latin-ext-500-normal.woff2",
"fonts/readex-pro-latin-ext-600-normal.woff2",
"fonts/readex-pro-latin-ext-700-normal.woff2",
"icons/apple-touch-icon.png",
"icons/icon-192.png",
"icons/icon-512.png",
"icons/maskable-512.png",
"index.html",
"manifest.webmanifest"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("mufradati-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then(res => res.ok ? res : caches.match("./index.html")).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r).then(res => {
    if (res.ok && res.type === "basic") { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); }
    return res;
  })));
});
