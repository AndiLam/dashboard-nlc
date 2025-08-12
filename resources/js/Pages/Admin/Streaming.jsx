import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Hls from 'hls.js';
import { Loader2, Maximize } from 'lucide-react';

export default function Streaming() {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource('/stream/playlist.m3u8');
      hls.attachMedia(videoRef.current);
      videoRef.current.onloadeddata = () => setLoading(false);
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = '/stream/playlist.m3u8';
      videoRef.current.onloadeddata = () => setLoading(false);
    }
  }, []);

  const toggleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setShowControls(false), 2000);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Streaming CCTV</h1>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Live Feed</h2>

        <div
          className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
          onMouseMove={handleMouseMove}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <Loader2 className="text-white animate-spin" size={40} />
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />

          {/* Fullscreen Button */}
          <div
            className={`absolute bottom-2 right-2 bg-black/40 p-2 rounded-lg transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
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
