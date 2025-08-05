import { useEffect } from 'react';
import axios from 'axios';

const publicKey = import.meta.env.VITE_PUSH_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function subscribeUser() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    await axios.get('/sanctum/csrf-cookie'); // Penting sebelum POST

    const res = await axios.post('/api/push-subscribe', {
      endpoint: subscription.endpoint,
      keys: {
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh,
      },
    });

    console.log('✅ Push subscription successful:', res.data);
  } catch (error) {
    console.error('❌ Push subscription failed:', error);
  }
}
