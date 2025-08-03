import React, { useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';

// Konversi public key dari base64url ke Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

// Fungsi untuk subscribe ke Push
const subscribeToPush = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;

      const publicKey = import.meta.env.PUSH_PUBLIC_KEY;
      const applicationServerKey = urlBase64ToUint8Array(publicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription }),
      });
    } catch (error) {
      console.error('Push subscription failed:', error);
    }
  } else {
    console.warn('Push messaging is not supported');
  }
};

export default function AdminLayout({ children }) {
  useEffect(() => {
    subscribeToPush();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full min-h-screen bg-gray-50 p-6">
        {children}
      </main>
    </div>
  );
}
