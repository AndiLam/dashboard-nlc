import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard,
  Video,
  Bell,
  Users,
  FileText,
  User,
  ChevronDown,
  ChevronUp,
  LogOut,
} from 'lucide-react';

export default function Sidebar() {
  const { component } = usePage();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menus = [
    {
      name: 'Dashboard',
      href: route('dashboard'),
      icon: <LayoutDashboard size={18} />,
      match: 'Dashboard',
    },
    {
      name: 'Alarm',
      href: route('alarm'),
      icon: <Video size={18} />,
      match: 'Alarm',
    },
    {
      name: 'Log Deteksi',
      href: route('log'),
      icon: <FileText size={18} />,
      match: 'LogDeteksi',
    },
    {
      name: 'Daftar Wajah Dikenal',
      href: route('wajah'),
      icon: <Users size={18} />,
      match: 'DaftarWajah',
    },
    {
      name: 'Notifikasi',
      href: route('notifikasi'),
      icon: <Bell size={18} />,
      match: 'Notifikasi',
    },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed flex flex-col justify-between">
      <div>
        <div className="p-4 text-xl font-bold text-center border-b border-gray-700">
          NLC Farm
        </div>
        <nav className="flex flex-col p-4 space-y-1">
          {menus.map((menu, index) => {
            const isActive = component.includes(menu.match);
            return (
              <Link
                key={index}
                href={menu.href}
                className={`flex items-center px-4 py-2 rounded-md transition-all ${
                  isActive
                    ? 'bg-gray-700 font-semibold'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <span className="mr-3">{menu.icon}</span>
                {menu.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile Menu */}
      <div className="border-t border-gray-700 p-4">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-full flex items-center justify-between px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-md transition-all"
        >
          <div className="flex items-center">
            <User size={18} className="mr-3" />
            <span>Profil</span>
          </div>
          {isProfileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isProfileOpen && (
          <div className="mt-2 ml-6 space-y-2 text-sm">
            <Link
              href={route('profile.edit')}
              className="block text-gray-300 hover:text-white transition"
            >
              Lihat Profil
            </Link>
            <Link
              method="post"
              href={route('logout')}
              className="w-full text-red-400 hover:text-red-600 transition flex items-center"
              as="button"
            >
              <LogOut size={14} className="mr-2" />
              Logout
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
