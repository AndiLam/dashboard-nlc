// resources/js/Pages/Admin/Notifikasi.jsx
import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BellIcon } from 'lucide-react';

export default function Notifikasi() {
  // Contoh data notifikasi (dummy)
  const notifikasiList = [
    {
      id: 1,
      pesan: 'Wajah tidak dikenal terdeteksi pada kamera 1',
      waktu: '26 Juli 2025, 14:32',
      level: 'Bahaya',
    },
    {
      id: 2,
      pesan: 'Login admin berhasil',
      waktu: '26 Juli 2025, 09:15',
      level: 'Informasi',
    },
    {
      id: 3,
      pesan: 'Data wajah baru berhasil ditambahkan',
      waktu: '25 Juli 2025, 20:07',
      level: 'Sistem',
    },
  ];

  // Warna label berdasarkan level
  const getLevelStyle = (level) => {
    switch (level) {
      case 'Bahaya':
        return 'bg-red-100 text-red-700';
      case 'Informasi':
        return 'bg-blue-100 text-blue-700';
      case 'Sistem':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 mb-6">
        <BellIcon className="w-6 h-6 text-gray-700" />
        <h1 className="text-2xl font-bold">Notifikasi</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {notifikasiList.map((notif) => (
            <li key={notif.id} className="px-4 py-3 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-800">{notif.pesan}</p>
                  <p className="text-xs text-gray-500 mt-1">{notif.waktu}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${getLevelStyle(
                    notif.level
                  )}`}
                >
                  {notif.level}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}
