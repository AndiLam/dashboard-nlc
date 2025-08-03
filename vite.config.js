import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'robots.txt', 'assets/icon.png'],
            manifest: {
                name: 'Sistem Keamanan Wajah',
                short_name: 'Keamanan',
                description: 'Aplikasi keamanan berbasis pengenalan wajah',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#4f46e5',
                icons: [
                    {
                        src: '/assets/icon.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/assets/icon.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    build: {
        outDir: '../public_html/build',
        emptyOutDir: true,
        manifest: true
    },
});
