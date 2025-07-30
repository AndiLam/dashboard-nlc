import React, { useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Hls from 'hls.js';

export default function Streaming() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource('/stream/playlist.m3u8');
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = '/stream/playlist.m3u8';
    }
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Streaming CCTV</h1>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Live Feed</h2>
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            autoPlay
            muted
          />
        </div>
      </div>
    </AdminLayout>
  );
}
