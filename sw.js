/* Kervano : hors ligne. Le jeu se recharge depuis Internet quand c'est possible (pour avoir les mises à jour), sinon depuis le cache. */
const CACHE = "kervano-v4";
const CORE = ["./", "index.html", "three.module.min.js", "manifest.json", "icon-192.png", "icon-512.png", "icon-180.png",
  "lang/en.json", "lang/ar.json", "lang/nl.json", "lang/de.json", "lang/tr.json"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    /* réseau d'abord, cache en secours */
    e.respondWith(fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || (req.mode === "navigate" ? caches.match("index.html") : Response.error()))));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    /* polices : cache d'abord, mise à jour en arrière-plan */
    e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => { const net = fetch(req).then(res => { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }).catch(() => hit); return hit || net; })));
  }
  /* le reste (Firebase, en ligne) passe directement par le réseau */
});
