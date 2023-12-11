import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import cssnano from 'cssnano'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; img-src 'self' https://img.shields.io;"
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      react(),
      cssnano({
        preset: 'default'
      })
    ]
  }
})
