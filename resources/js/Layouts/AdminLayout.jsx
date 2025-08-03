import React, { useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';

// Fungsi dari file lain atau definisikan langsung di sini
const subscribeToPush = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: '<BH2sycRs5sjCKoUXET1DbOV9mHmpW7H7Nh3S8s6QMtftS1-IUdeXRm89fd2Cewn3mRVtAs1PTVK5avsa-ReVG6c>',
    });

    await fetch('/api/push-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });
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
