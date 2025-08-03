import React, { useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';
import { subscribeUser } from '@/hooks/usePushSubscribe';

export default function AdminLayout({ children }) {
  useEffect(() => {
    subscribeUser();
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
