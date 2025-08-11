import Sidebar from '@/Components/Sidebar';
import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { subscribeUser } from '@/hooks/usePushSubscribe';
import { Menu } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { props } = usePage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (props?.auth?.user) {
      subscribeUser();
    }
  }, [props?.auth?.user]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:shadow-none flex-shrink-0`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar (Mobile) */}
        <header className="bg-white shadow-md p-4 flex items-center md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-4 font-bold text-lg">Admin Panel</h1>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
