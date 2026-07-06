const CACHE_NAME = 'cen-temple-explorer-v2-zerubbabel-001';
const CORE = [
  './','./index.html','./manifest.webmanifest',
  './assets/common/ui/app.css',
  './assets/common/icons/icon-192.png','./assets/common/icons/icon-512.png',
  './assets/engine/explorer.js','./assets/engine/gesture.js','./assets/engine/story.js','./assets/engine/transition.js','./assets/engine/ui.js',
  './data/tabernacle.js','./data/solomon.js','./data/zerubbabel.js','./data/herod.js',
  './assets/zerubbabel/scenes/01-drone.jpg','./assets/zerubbabel/scenes/02-temple-front.jpg','./assets/zerubbabel/scenes/03-outer-court.jpg','./assets/zerubbabel/scenes/04-altar.jpg','./assets/zerubbabel/scenes/05-laver.jpg','./assets/zerubbabel/scenes/06-entrance.jpg','./assets/zerubbabel/scenes/07-holy-place.jpg','./assets/zerubbabel/scenes/08-holy-of-holies.jpg'
];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', e => { if(e.request.method !== 'GET') return; e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const copy=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(e.request,copy)); return res; }).catch(()=>caches.match('./index.html')))); });
