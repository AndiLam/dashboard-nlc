import React, { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

useEffect(() => {
  const fetchCSRF = async () => {
    await axios.get("/sanctum/csrf-cookie", { withCredentials: true });
  };
  fetchCSRF();
}, []);


import { PencilIcon, Trash2Icon, PlusCircle } from 'lucide-react';

export default function DaftarWajah() {
  const [wajahDikenal, setWajahDikenal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nama: '', posisi: '', foto: null });
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null); // NEW

  const fetchWajah = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/wajah-dikenal');
      setWajahDikenal(response.data);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWajah();
  }, []);

  const openModal = () => {
    setForm({ nama: '', posisi: '', foto: null });
    setPreview(null);
    setEditingId(null); // Reset mode edit
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPreview(null);
    setForm({ nama: '', posisi: '', foto: null });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto') {
      const file = files[0];
      setForm((prev) => ({ ...prev, foto: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
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
      if (editingId) {
        await axios.post(`/api/wajah-dikenal/${editingId}?_method=PUT`, formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/api/wajah-dikenal', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchWajah();
      closeModal();
    } catch (error) {
      console.error('Gagal menyimpan data:', error);
    }
  };

  const handleEdit = (data) => {
    setForm({ nama: data.nama, posisi: data.posisi, foto: null });
    setPreview(`/wajah/${data.foto}`);
    setEditingId(data.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      try {
        await axios.delete(`/api/wajah-dikenal/${id}`);
        fetchWajah();
      } catch (error) {
        console.error('Gagal menghapus:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Daftar Wajah Dikenal</h1>
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 text-sm"
        >
          <PlusCircle className="w-5 h-5" /> Tambah Wajah
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {wajahDikenal.map((data) => (
            <div key={data.id} className="bg-white rounded shadow p-2">
              <img
                src={`/wajah/${data.foto}`}
                alt={data.nama}
                className="w-full h-40 object-cover rounded"
              />
              <div className="mt-2">
                <p className="font-semibold">{data.nama}</p>
                <p className="text-sm text-gray-500">{data.posisi}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(data)}
                  className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200 flex items-center gap-1 text-xs"
                >
                  <PencilIcon className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(data.id)}
                  className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 flex items-center gap-1 text-xs"
                >
                  <Trash2Icon className="w-4 h-4" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button onClick={closeModal} className="absolute top-2 right-3 text-gray-400 text-xl">×</button>
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Wajah' : 'Tambah Wajah'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Posisi</label>
                <input
                  type="text"
                  name="posisi"
                  value={form.posisi}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Foto</label>
                <input
                  type="file"
                  name="foto"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  {...(editingId ? {} : { required: true })}
                />
              </div>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded mx-auto"
                />
              )}
              <div className="text-right">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
