import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

export default function Alarm() {
  const [triggerLog, setTriggerLog] = useState([]);

  useEffect(() => {
    axios.get('/sanctum/csrf-cookie');
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const trigger = await axios.get('/api/log-alarm');
      setTriggerLog(trigger.data);
    } catch (error) {
      console.error('Gagal memuat log:', error);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Riwayat Alarm Menyala</h1>

      <div className="bg-white shadow rounded-lg p-5">
        <ul className="text-sm space-y-2">
          {triggerLog.length > 0 ? triggerLog.map((item, i) => (
            <li key={i} className="flex justify-between border-b pb-1">
              <span>{item.sumber_trigger ?? 'Sistem'}: Alarm Aktif</span>
              <span className="text-gray-500">
                {new Date(item.created_at).toLocaleString()}
              </span>
            </li>
          )) : (
            <p className="text-gray-500">Belum ada alarm yang menyala.</p>
          )}
        </ul>
      </div>
    </AdminLayout>
  );
}
