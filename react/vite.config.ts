import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: '/mom/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [{ src: 'photos/*', dest: 'photos' }]
    })
  ],
  build: {
    outDir: '../mom',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        photos: resolve(__dirname, 'photos/index.html')
      }
    }
  }
})
