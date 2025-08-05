import { useEffect } from 'react';
import axios from 'axios';
useEffect(() => {
  const fetchCSRF = async () => {
    await axios.get("/sanctum/csrf-cookie", { withCredentials: true });
  };
  fetchCSRF();
}, []);


const publicKey = import.meta.env.VITE_PUSH_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function subscribeUser(subscription) {
  try {
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