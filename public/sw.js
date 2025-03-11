self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('manifest.json')) {
      event.respondWith(fetch(event.request)); // Always fetch fresh
    } else {
      // Handle other caching logic
    }
});