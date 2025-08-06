import { useEffect } from 'react';
import axios from '@/lib/axios';

const publicKey = import.meta.env.VITE_PUSH_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function subscribeUser() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('❌ Push notification not supported in this browser');
    return;
  }

  try {
    console.log('📡 Requesting CSRF cookie...');
    await axios.get('/sanctum/csrf-cookie');
    console.log('✅ CSRF cookie set.');

    const registration = await navigator.serviceWorker.ready;
    console.log('🔧 Service Worker ready:', registration);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
    console.log('📬 Push subscription object created:', subscription.toJSON());

    const payload = {
      endpoint: subscription.endpoint,
      keys: {
        auth: subscription.toJSON().keys.auth,
        p256dh: subscription.toJSON().keys.p256dh,
      },
    };

    console.log('📤 Sending subscription to server:', payload);
    const res = await axios.post('/api/push-subscribe', payload);

    console.log('✅ Push subscription successful:', res.data);
  } catch (error) {
    console.error('❌ Push subscription failed:', error);
    if (error.response) {
      console.error('📥 Server response:', error.response.data);
    }
  }
}
