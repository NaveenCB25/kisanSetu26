importScripts('https://www.gstatic.com/firebasejs/11.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.2.0/firebase-messaging-compat.js');
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil((async () => {
  const config = await fetch('/api/firebase-config').then((response) => response.json());
  if (config.apiKey && !firebase.apps.length) { firebase.initializeApp(config); firebase.messaging(); }
})()));
