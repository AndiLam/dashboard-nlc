import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Hls from 'hls.js';
import { Maximize } from 'lucide-react';

export default function Streaming() {
  const videoRef = useRef(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let hls;
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource('/stream/playlist.m3u8');
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsOnline(true);
        videoRef.current.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setIsOnline(false);
        }
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = '/stream/playlist.m3u8';
      videoRef.current.addEventListener('loadeddata', () => setIsOnline(true));
      videoRef.current.addEventListener('error', () => setIsOnline(false));
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, []);

  const toggleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Streaming CCTV</h1>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Live Feed</h2>

        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          {/* Video */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />

          {/* Label LIVE di kiri bawah */}
          <div
            className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-bold ${
              isOnline ? 'bg-red-600 text-white' : 'bg-gray-500 text-gray-200'
            }`}
          >
            LIVE
          </div>

          {/* Fullscreen Button di kanan bawah */}
          <div className="absolute bottom-2 right-2 bg-black/50 rounded-lg p-2">
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
