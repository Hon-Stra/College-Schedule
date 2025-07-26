const CACHE_NAME = 'college-schedule-app-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/data.js',
    // Updated paths for individual schedule files
    '/schedules/ioa-bsa-1-1st-2025-2026.js',
    '/schedules/eng-ee-1-spring-2026.js',
    // Add any new schedule files here: '/schedules/your-new-schedule-file.js',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50xmMw.woff2',
    '/mainbg.png',
    '/umak-top.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to cache during install:', error);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                    return new Response('<h1>You are offline</h1><p>Please connect to the internet to view this content.</p>', {
                        headers: { 'Content-Type': 'text/html' }
                    });
                });
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
