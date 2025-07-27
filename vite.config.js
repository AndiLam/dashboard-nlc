import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
            publicDirectory: 'public_html',
        }),
        react(),
    ],
    build: {
        outDir: 'public_html/build', 
        manifest: true,
        rollupOptions: {
            input: 'resources/js/app.jsx',
        },
    },
});
