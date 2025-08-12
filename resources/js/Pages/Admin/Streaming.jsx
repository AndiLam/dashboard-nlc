import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Hls from 'hls.js';
import { Play, Pause, Maximize, Minimize } from 'lucide-react';

export default function Streaming() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource('/stream/playlist.m3u8');
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = '/stream/playlist.m3u8';
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
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
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
            controls={false} // no default controls
          />

          {/* Label LIVE di kiri bawah */}
          <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            LIVE
          </div>

          {/* Custom Controls */}
          <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-black/50 rounded-lg px-3 py-1">
            <button
              onClick={togglePlay}
              className="text-white hover:text-gray-300"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300"
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
