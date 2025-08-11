import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Hls from 'hls.js';

export default function Streaming() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hlsRef = React.useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      hlsRef.current = new Hls();

      // Tambah query string timestamp supaya tidak cache
      const playlistUrl = `/stream/playlist.m3u8?ts=${Date.now()}`;
      hlsRef.current.loadSource(playlistUrl);
      hlsRef.current.attachMedia(videoRef.current);

      // Reload playlist secara berkala setiap 3 detik
      const interval = setInterval(() => {
        const newUrl = `/stream/playlist.m3u8?ts=${Date.now()}`;
        hlsRef.current.loadSource(newUrl);
      }, 3000);

      return () => {
        clearInterval(interval);
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
      };
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // Untuk Safari
      videoRef.current.src = `/stream/playlist.m3u8?ts=${Date.now()}`;
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

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
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />

          {/* Custom Controls */}
          <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/50 rounded-lg px-3 py-1">
            <button
              onClick={togglePlay}
              className="text-white hover:text-gray-300"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300"
            >
              Fullscreen
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
