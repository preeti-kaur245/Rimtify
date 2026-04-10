import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './', // Essential for GitHub pages
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5MB
      },
      manifest: {
        name: 'Rimtify Faculty Portal',
        short_name: 'FacultyPortal',
        description: 'Offline-first Faculty Portal System',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '192x192',
            type: 'image/x-icon'
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist'
  }
})
