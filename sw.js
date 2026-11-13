'use strict';
const CACHE_NAME = 'dinesan-andisa-shell-20261113-v7-handover-camera';
const SHELL_FILES = [
  './', './index.html', './style.css?v=20261113-handover-camera', './app.js?v=20261113-handover-camera',
  './duty-schedule.js?v=20261113-handover-camera', './duty-planner.js?v=20261113-handover-camera',
  './duty-reminders.js?v=20261113-handover-camera', './monthly.js?v=20261113-handover-camera',
  './duty-groups.js?v=20261113-handover-camera', './daily-camera.js?v=20261113-handover-camera', './leave.js', './zip.js',
  './manifest.webmanifest', './manifest.webmanifest?v=20261113-handover-camera', './favicon.ico', './favicon.ico?v=20261006-kai', './apple-touch-icon.png',
  './icons/favicon-kai.svg', './icons/favicon-kai-16.png', './icons/favicon-kai-32.png', './icons/favicon-kai-48.png',
  './icons/apple-touch-icon-kai.png', './icons/kai-icon-192.png', './icons/kai-icon-512.png', './icons/kai-maskable-512.png',
  './assets/kai.png', './assets/libur-template.jpg', './vendor/pdf-lib.min.js',
  './report-logos.js?v=20261113-handover-camera', './monthly-report.js?v=20261113-handover-camera', './handover-camera.js?v=20261113-handover-camera'
];
self.addEventListener('install', event => event.waitUntil(
  caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting())
));
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const key of await caches.keys()) if (key.startsWith('dinesan-andisa-shell-') && key !== CACHE_NAME) await caches.delete(key);
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      if (event.request.mode === 'navigate') {
        const fallback = await cache.match('./index.html');
        if (fallback) return fallback;
      }
      return Response.error();
    }
  })());
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const date = event.notification.data?.date;
  const group = event.notification.data?.group;
  const url = new URL('./', self.registration.scope);
  if (/^\d{4}-\d{2}-\d{2}$/.test(date || '')) url.searchParams.set('tanggal', date);
  if (/^[ABCD]$/.test(group || '')) url.searchParams.set('grup', group);
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if (client.url.startsWith(self.registration.scope)) {
        await client.focus(); client.postMessage({ type: 'open-duty-date', date, group }); return;
      }
    }
    await self.clients.openWindow(url.href);
  })());
});
