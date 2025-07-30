import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-sm font-medium mb-1">Total Wajah Dikenal</h2>
          <p className="text-2xl font-bold text-blue-600">5</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-sm font-medium mb-1">Log Deteksi Hari Ini</h2>
          <p className="text-2xl font-bold text-green-600">27</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-sm font-medium mb-1">Notifikasi Terkirim</h2>
          <p className="text-2xl font-bold text-yellow-600">5</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-sm font-medium mb-1">Status Streaming</h2>
          <p className="text-2xl font-bold text-gray-500">Offline</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-sm font-medium mb-1">Status Alarm</h2>
          <p className="text-2xl font-bold text-red-500">Nonaktif</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h2>
        <ul className="space-y-2 text-sm">
          <li>🕒 30 Juli 2025 [07:20] Wajah tidak dikenal terdeteksi</li>
          <li>🕒 30 Juli 2025 [06:50] Wajah dikenali: <strong>Akbar</strong></li>
          <li>🕒 30 Juli 2025 [06:45] Wajah dikenali: <strong>Hadi</strong></li>
        </ul>
      </div>
    </AdminLayout>
  );
}
