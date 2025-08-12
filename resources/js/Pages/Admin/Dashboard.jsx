import React, { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from '@/lib/axios';

export default function Dashboard() {
  const [totalWajah, setTotalWajah] = useState(0);
  const [logHariIni, setLogHariIni] = useState(0);
  const [jumlahNotif, setJumlahNotif] = useState(0);
  const [streamingStatus, setStreamingStatus] = useState('Offline');
  const [aktivitas, setAktivitas] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const results = await Promise.allSettled([
        axios.get('/api/wajah-dikenal'),             // [0]
        axios.get('/api/log-deteksi?today=1'),       // [1]
        axios.get('/api/push-count'),                // [2]
        axios.get('/api/log-deteksi?limit=3'),       // [3]
        axios.get('/api/stream-status'),             // [4]
      ]);

      setTotalWajah(results[0].status === 'fulfilled' ? results[0].value.data.length || 0 : 0);
      setLogHariIni(results[1].status === 'fulfilled' ? results[1].value.data.total || 0 : 0);
      setJumlahNotif(results[2].status === 'fulfilled' ? results[2].value.data.total || 0 : 0);
      setAktivitas(results[3].status === 'fulfilled'  ? (results[3].value.data.data || []): []);
      setStreamingStatus(results[4].status === 'fulfilled' ? results[4].value.data.status || 'Offline' : 'Offline');
    } catch (error) {
      console.error('Error memuat data dashboard:', error);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-sm font-medium mb-1">Total Wajah Dikenal</h2>
          <p className="text-2xl font-bold text-blue-600">{totalWajah}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-sm font-medium mb-1">Log Deteksi Hari Ini</h2>
          <p className="text-2xl font-bold text-green-600">{logHariIni}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-sm font-medium mb-1">Notifikasi Terkirim</h2>
          <p className="text-2xl font-bold text-yellow-600">{jumlahNotif}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-sm font-medium mb-1">Status Streaming</h2>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                streamingStatus.toLowerCase() === 'online'
                  ? 'bg-green-500 animate-pulse'
                  : 'bg-red-500'
              }`}
            ></span>
            <p
              className={`text-2xl font-bold ${
                streamingStatus.toLowerCase() === 'online'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {streamingStatus}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h2>
        <ul className="space-y-2 text-sm">
          {aktivitas.map((item, i) => (
            <li key={i}>
              🕒 {new Date(item.waktu).toLocaleDateString('id-ID')} [{new Date(item.waktu).toLocaleTimeString('id-ID')}] {item.status === 'Dikenal' ? (
                <>Wajah dikenali: <strong>{item.nama}</strong></>
              ) : (
                <>Wajah <strong>tidak dikenal</strong> terdeteksi</>
              )}
            </li>
          ))}

          {aktivitas.length === 0 && (
            <li className="text-gray-500">Tidak ada aktivitas terbaru</li>
          )}
        </ul>
      </div>
    </AdminLayout>
  );
}
