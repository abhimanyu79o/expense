// Service Worker for Expense Tracker app
const CACHE_NAME = 'expense-tracker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/pages/ExpenseTracker.tsx',
  '/src/components/ExpenseForm.tsx',
  '/src/components/ExpenseList.tsx',
  '/src/components/ExpenseCard.tsx',
  '/src/components/ExpenseSummary.tsx',
  '/src/components/EditExpenseModal.tsx',
  '/src/components/DeleteExpenseModal.tsx',
  '/src/lib/expenseService.ts'
];

// Install service worker and cache all content
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercept fetch requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        // Attempt to fetch from network
        return fetch(fetchRequest).then(
          response => {
            // Invalid response or non-GET requests shouldn't be cached
            if(!response || response.status !== 200 || response.type !== 'basic' || event.request.method !== 'GET') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Add the response to cache
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
  );
});

// Activate event to clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});