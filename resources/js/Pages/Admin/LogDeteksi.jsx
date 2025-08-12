import React, { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from '@/lib/axios';

export default function LogDeteksi() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/api/log-deteksi').then(res => {
      if (Array.isArray(res.data.data)) {
        setLogs(res.data.data);
      } else {
        setLogs([]);
      }
    });
  }, []);


  // Filter logs berdasarkan searchTerm
  const filteredLogs = logs.filter(log =>
    log.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Log Deteksi</h1>

      {/* Search Input */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Cari nama atau status..."
          className="border rounded-lg px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset ke halaman pertama saat search
          }}
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">No</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Nama</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Waktu Deteksi</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentLogs.map((log, index) => (
              <tr
                key={log.id}
                className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}
              >
                <td className="px-4 py-2">{indexOfFirstLog + index + 1}</td>
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

            {currentLogs.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Tidak ada data ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Previous
            </button>

            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
