// resources/js/Pages/Admin/Streaming.jsx
import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Streaming() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Streaming CCTV</h1>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Live Feed</h2>
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          {/* Ganti URL src berikut dengan endpoint streaming yang sesuai */}
          <iframe
            src="http://localhost:5000/video_feed"
            title="Live CCTV Stream"
            className="w-full h-full"
            allow="autoplay"
            frameBorder="0"
          ></iframe>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Jika video tidak muncul, pastikan server streaming aktif dan dapat diakses dari browser.
        </p>
      </div>
    </AdminLayout>
  );
}
