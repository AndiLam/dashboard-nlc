// resources/js/Pages/Admin/DaftarWajah.jsx
import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PencilIcon, Trash2Icon } from 'lucide-react';

export default function DaftarWajah() {
  // Contoh data wajah dikenal (dummy)
  const wajahDikenal = [
    {
      id: 1,
      nama: 'Budi Santoso',
      Posisi: 'Pengelola',
      foto: '/images/budi.jpg', // ganti path sesuai dengan lokasi foto
    },
    {
      id: 2,
      nama: 'Siti Aminah',
      Posisi: 'Peternak',
      foto: '/images/siti.jpg',
    },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Daftar Wajah Dikenal</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">No</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Foto</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Nama</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Posisi</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {wajahDikenal.map((data, index) => (
              <tr key={data.id}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  <img
                    src={data.foto}
                    alt={`Wajah ${data.nama}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-2">{data.nama}</td>
                <td className="px-4 py-2">{data.posisi}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200 flex items-center gap-1 text-xs">
                    <PencilIcon className="w-4 h-4" /> Edit
                  </button>
                  <button className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 flex items-center gap-1 text-xs">
                    <Trash2Icon className="w-4 h-4" /> Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-gray-500 mt-4 text-sm">
        Data wajah yang dikenali dapat diedit atau dihapus sesuai kebutuhan.
      </p>
    </AdminLayout>
  );
}
