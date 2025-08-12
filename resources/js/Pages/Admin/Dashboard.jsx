import React, { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from '@/lib/axios';

export default function Dashboard() {
  const [totalWajahDikenal, setTotalWajahDikenal] = useState(0);
  const [totalWajahTidakDikenal, setTotalWajahTidakDikenal] = useState(0);
  const [logHariIni, setLogHariIni] = useState(0);
  const [aktivitas, setAktivitas] = useState([]);
  const [statusStreaming, setStatusStreaming] = useState('Tidak Aktif');

  useEffect(() => {
    Promise.allSettled([
      axios.get('/api/wajah-dikenal/total'),
      axios.get('/api/wajah-tidak-dikenal/total'),
      axios.get('/api/log-deteksi?today=1'),
      axios.get('/api/log-deteksi?limit=3'),
      axios.get('/api/streaming/status') // ✅ tambahkan request status streaming
    ]).then(results => {
      setTotalWajahDikenal(results[0].status === 'fulfilled' ? results[0].value.data.total : 0);
      setTotalWajahTidakDikenal(results[1].status === 'fulfilled' ? results[1].value.data.total : 0);
      setLogHariIni(results[2].status === 'fulfilled' ? results[2].value.data.total : 0);
      setAktivitas(results[3].status === 'fulfilled' ? (results[3].value.data.data || []) : []);
      setStatusStreaming(results[4].status === 'fulfilled' ? results[4].value.data.status : 'Tidak Aktif');
    });
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Wajah Dikenal</h2>
          <p className="text-2xl">{totalWajahDikenal}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Wajah Tidak Dikenal</h2>
          <p className="text-2xl">{totalWajahTidakDikenal}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Log Deteksi Hari Ini</h2>
          <p className="text-2xl">{logHariIni}</p>
        </div>
        <div className={`p-4 rounded shadow ${statusStreaming === 'Aktif' ? 'bg-green-100' : 'bg-red-100'}`}>
          <h2 className="font-semibold">Status Streaming</h2>
          <p className={`text-2xl font-bold ${statusStreaming === 'Aktif' ? 'text-green-600' : 'text-red-600'}`}>
            {statusStreaming}
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Aktivitas Terbaru</h2>
        <ul>
          {aktivitas.length > 0 ? (
            aktivitas.map((item, idx) => (
              <li key={idx} className="border-b py-2">
                {item.nama || 'Tidak Diketahui'} - {item.waktu}
              </li>
            ))
          ) : (
            <li className="text-gray-500">Tidak ada data</li>
          )}
        </ul>
      </div>
    </AdminLayout>
  );
}
