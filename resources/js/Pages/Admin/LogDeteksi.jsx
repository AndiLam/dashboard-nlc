import React, { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from '@/lib/axios';

export default function LogDeteksi() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('/api/log-deteksi').then(res => setLogs(res.data));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Log Deteksi</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">No</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Nama</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Waktu Deteksi</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log, index) => (
              <tr key={log.id}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{log.nama}</td>
                <td className="px-4 py-2">{new Date(log.waktu).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      log.status === 'Dikenal'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
