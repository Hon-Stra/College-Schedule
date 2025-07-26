// Increment the CACHE_NAME to force the service worker to fetch new assets
const CACHE_NAME = 'college-schedule-app-v4'; // Increment cache name to ensure update
// IMPORTANT: Replace 'College-Schedule' with your actual repository name.
const REPO_NAME = '/College-Schedule';

const urlsToCache = [
    `${REPO_NAME}/`,
    `${REPO_NAME}/index.html`,
    `${REPO_NAME}/style.css`,
    `${REPO_NAME}/script.js`,
    `${REPO_NAME}/data.js`,
    // Updated paths for individual schedule files
    `${REPO_NAME}/schedules/ioa-bsa-1-1st-2025-2026.js`,
    `${REPO_NAME}/schedules/eng-ee-1-spring-2026.js`,
    // Add any new schedule files here, remembering to prepend REPO_NAME
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50xmMw.woff2',
    `${REPO_NAME}/mainbg.png`,
    `${REPO_NAME}/umak-top.png`,
    `${REPO_NAME}/manifest.json`, // Added manifest to cache
    // Add all icon paths here, prepending REPO_NAME
    `${REPO_NAME}/umak-app-icon-48.png`,
    `${REPO_NAME}/umak-app-icon-72.png`,
    `${REPO_NAME}/umak-app-icon-96.png`,
    `${REPO_NAME}/umak-app-icon-144.png`,
    `${REPO_NAME}/umak-app-icon-168.png`,
    `${REPO_NAME}/umak-app-icon-192.png`,
    `${REPO_NAME}/umak-app-icon-512.png`,
    `${REPO_NAME}/umak-app-icon-maskable.png`
];

self.addEventListener('install', (event) => {
    console.log('Service Worker: Install event triggered.');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Opened cache. Adding URLs to cache...');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Failed to cache during install:', error);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('Service Worker: Serving from cache:', event.request.url);
                    return response;
                }
                console.log('Service Worker: Fetching from network:', event.request.url);
                return fetch(event.request).catch(() => {
                    // Fallback for offline pages, consider a more robust offline page
                    console.log('Service Worker: Fetch failed, serving offline fallback.');
                    return new Response('<h1>You are offline</h1><p>Please connect to the internet to view this content.</p>', {
                        headers: { 'Content-Type': 'text/html' }
                    });
                });
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activate event triggered.');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Delete old caches
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Ensure the service worker takes control of all clients immediately after activation.
    event.waitUntil(self.clients.claim());
});
