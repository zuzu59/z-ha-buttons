import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

const BASE_URL = '/z-ha-buttons/'

export default defineConfig({
  base: BASE_URL,
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['app-icon.png'],
      manifest: {
        name: 'z-ha-buttons',
        short_name: 'HA Buttons',
        description: 'Piloter vos appareils Home Assistant',
        theme_color: '#0b1020',
        background_color: '#0b1020',
        display: 'standalone',
        start_url: `${BASE_URL}index.html`,
        scope: BASE_URL,
        icons: [
          {
            src: 'app-icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true
  }
})
