import React, { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import { PencilIcon, Trash2Icon, PlusCircle } from 'lucide-react';

export default function DaftarWajah() {
  const [wajahDikenal, setWajahDikenal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nama: '', posisi: '', foto: null });
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchWajah();
  }, []);

  const fetchWajah = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/wajah-dikenal');
      console.log('Data dari API:', res.data); // 👈 tambahkan ini
      setWajahDikenal(res.data.data); // asumsinya `data` array
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nama', form.nama);
    formData.append('posisi', form.posisi);
    if (form.foto instanceof File) {
      formData.append('foto', form.foto);
    }

    try {
      await axios.post('/api/wajah-dikenal', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchWajah();
      closeModal();
    } catch (error) {
      console.error('Gagal menyimpan:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await axios.delete(`/api/wajah-dikenal/${id}`);
      fetchWajah();
    } catch (error) {
      console.error('Gagal menghapus:', error);
    }
  };

  const openModal = () => {
    setForm({ nama: '', posisi: '', foto: null });
    setPreview(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ nama: '', posisi: '', foto: null });
    setPreview(null);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Daftar Wajah Dikenal</h1>
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusCircle size={16} /> Tambah Data
        </button>
      </div>

      {/* Modal Form Tambah */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Tambah Wajah</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Nama</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Posisi</label>
                <input
                  type="text"
                  value={form.posisi}
                  onChange={(e) => setForm({ ...form, posisi: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Foto (opsional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setForm({ ...form, foto: file });
                    setPreview(URL.createObjectURL(file));
                  }}
                />
                {preview && (
                  <img src={preview} alt="Preview" className="w-20 h-20 mt-2 rounded object-cover" />
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabel Wajah */}
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
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : !Array.isArray(wajahDikenal) || wajahDikenal.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  Belum ada data wajah.
                </td>
              </tr>
            ) : (
              wajahDikenal.map((data, index) => (
                <tr key={data.id}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    <img
                      src={`/wajah/${data.foto}`}
                      alt={`Wajah ${data.nama}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">{data.nama}</td>
                  <td className="px-4 py-2">{data.posisi}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200 flex items-center gap-1 text-xs"
                      disabled
                    >
                      <PencilIcon className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(data.id)}
                      className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 flex items-center gap-1 text-xs"
                    >
                      <Trash2Icon className="w-4 h-4" /> Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
