import Sidebar from '@/Components/Sidebar';
import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { subscribeUser } from '@/hooks/usePushSubscribe';

export default function AdminLayout({ children }) {
  const { props } = usePage();

  useEffect(() => {
    if (props?.auth?.user) {
      subscribeUser();
    }
  }, [props?.auth?.user]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full min-h-screen bg-gray-50 p-6">
        {children}
      </main>
    </div>
  );
}
