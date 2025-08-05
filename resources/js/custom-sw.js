import { precacheAndRoute } from 'workbox-precaching';

// Precache files injected by VitePWA
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', function (event) {
  let data = {};

  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'Notification',
      body: event.data.text(),
    };
  }

  const options = {
    body: data.body || 'You have a new notification',
    icon: 'public/assets/logo-192.png',  // ⬅️ gunakan path relatif dari public root
    badge: 'public/assets/logo-192.png',
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Notification', options)
  );
});
