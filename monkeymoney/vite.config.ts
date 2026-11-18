import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/its-doable/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['monkey.svg', 'favicon.ico'],
      manifest: {
        name: 'MonkeyMoney',
        short_name: 'MonkeyMoney',
        description: 'Gamified budgeting for students',
        theme_color: '#2d6a4f',
        background_color: '#f0fdf4',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'monkey.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,woff}'],
        runtimeCaching: [],
      },
    }),
  ],
})
