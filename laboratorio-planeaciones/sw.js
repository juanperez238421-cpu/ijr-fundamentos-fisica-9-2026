const CACHE='ijr-planning-lab-v2-logo-layout-fix';
const ASSETS=['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./assets/logo-ijr.png','./vendor/pdf.mjs','./vendor/pdf.worker.mjs','./docs/pei-extracto-p41.pdf','./docs/ARQUITECTURA.md','./docs/ON-PREMISE.md','./docs/CONTRATO-DATOS.sql'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ijr-planning-lab-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin||u.pathname.includes('/api/'))return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));});
