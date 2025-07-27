// resources/js/Pages/Admin/Dashboard.jsx
import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Total Wajah Dikenal</h2>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Log Deteksi Hari Ini</h2>
          <p className="text-3xl font-bold text-green-600">27</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Notifikasi Terkirim</h2>
          <p className="text-3xl font-bold text-yellow-600">5</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Status Streaming</h2>
          <p className="text-3xl font-bold text-red-500">Offline</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h2>
        <ul className="space-y-2">
          <li>🕒 [07:20] Wajah tidak dikenal terdeteksi</li>
          <li>🕒 [06:50] Wajah dikenali: <strong>Pak Budi</strong></li>
          <li>🕒 [06:45] Wajah dikenali: <strong>Bu Sari</strong></li>
        </ul>
      </div>
    </AdminLayout>
  );
}
