import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: '/build/',
    plugins: [
      laravel({
        input: ['resources/js/app.jsx'],
        refresh: true,
      }),
      react(),
      VitePWA({
        base: '/build/',
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        // Ganti default service worker dengan custom-sw.js
        srcDir: 'resources/js/', // lokasi folder custom-sw.js
        filename: 'custom-sw.js', // nama file custom
        strategies: 'injectManifest',
        manifestFilename: 'manifest.webmanifest',
        includeAssets: [
          'favicon.ico',
          'robots.txt',
          'public/assets/logo.png',
          'public/assets/logo-192.png',
          'public/assets/logo-512.png',
        ],
        manifest: {
          name: 'Sistem Keamanan Wajah',
          short_name: 'NLC Farm',
          description: 'Dashboard keamanan berbasis pengenalan wajah',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#4f46e5',
          icons: [
            {
              src: 'public/assets/logo-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'public/assets/logo-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        injectManifest: {
          globDirectory: 'public_html/build',
          globPatterns: ['**/*.{js,css,ico,png,svg,webmanifest}'],
        },
      }),
    ],
    build: {
      outDir: '../public_html/build',
      emptyOutDir: true,
      manifest: true,
    },
  };
});
