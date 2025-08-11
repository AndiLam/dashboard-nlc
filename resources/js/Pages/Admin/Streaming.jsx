import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Hls from 'hls.js';
import { Play, Pause, Maximize } from 'lucide-react';

export default function Streaming() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
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
