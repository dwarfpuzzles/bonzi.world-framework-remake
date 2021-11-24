// This is the "Offline page" service worker

const CACHE = 'bonzi-page';

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = 'offline.html';

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener('install', function (event) {
  console.log('[Bonzi PWA] Install Event processing');

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log('[Bonzi PWA] Cached offline page during install');
      cache.add(offlineFallbackPage);
      return cache.add(offlineFallbackPage);
    })
  );
});

// If any fetch fails, it will show the offline page.
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(function (error) {
      // The following validates that the request was for a navigation to a new document
      if (
        event.request.destination !== 'document' ||
        event.request.mode !== 'navigate'
      ) {
        return;
      }

      console.error('[Bonzi PWA] Network request Failed. Serving offline page ' + error);
      return caches.open(CACHE).then(function (cache) {
        return cache.match(offlineFallbackPage);
      });
    })
  );
});

// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener('refreshOffline', function () {
  const offlinePageRequest = new Request(offlineFallbackPage);

  return fetch(offlineFallbackPage).then(function (response) {
    return caches.open(CACHE).then(function (cache) {
      console.log('[Bonzi PWA] Offline page updated from refreshOffline event: ' + response.url);
      return cache.put(offlinePageRequest, response);
    });
  });
});
self.addEventListener('notificationclick', function (event) {
  console.dir(event);
});
