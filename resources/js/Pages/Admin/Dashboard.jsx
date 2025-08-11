import React, { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from '@/lib/axios';

export default function Dashboard() {
  const [totalWajah, setTotalWajah] = useState(0);
  const [logHariIni, setLogHariIni] = useState(0);
  const [jumlahNotif, setJumlahNotif] = useState(0);
  const [streamingStatus, setStreamingStatus] = useState('Offline');
  const [alarmStatus, setAlarmStatus] = useState(false);
  const [aktivitas, setAktivitas] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        wajahRes,
        logHariIniRes,
        notifRes,
        alarmRes,
        logDeteksiRes,
        streamingRes,
      ] = await Promise.all([
        axios.get('/api/wajah-dikenal'),                      // get all wajah dikenal
        axios.get('/api/log-deteksi?today=1'),                // log deteksi hari ini
        axios.get('/api/push-count'),                         // jumlah notifikasi (buat route ini)
        axios.get('/api/log-deteksi?limit=3'),                // aktivitas terbaru
        axios.get('/api/stream-status'),                      // status streaming (buat route dummy sementara)
      ]);

      setTotalWajah(wajahRes.data.length || 0);
      setLogHariIni(logHariIniRes.data.total || 0);
      setJumlahNotif(notifRes.data.total || 0);
      setAlarmStatus(alarmRes.data.alarm_active);
      setAktivitas(logDeteksiRes.data || []);
      setStreamingStatus(streamingRes.data.status || 'Offline');
    } catch (error) {
      console.error('Gagal mengambil data dashboard:', error);
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
          <p className="text-2xl font-bold text-gray-500">{streamingStatus}</p>
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
        </ul>
      </div>
    </AdminLayout>
  );
}
