import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { version } = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf8'),
);

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'favicon.svg'],
      manifest: {
        name: 'z-ha-buttons',
        short_name: 'z-ha-buttons',
        description: 'PWA de pilotage Home Assistant',
        theme_color: '#0f172a',
        background_color: '#0b1020',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,png,woff2}'],
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  server: {
    host: '0.0.0.0',
    port: 4173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
});
