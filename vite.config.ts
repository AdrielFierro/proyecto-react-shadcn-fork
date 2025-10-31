import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Asegurar que public/ se copie correctamente (incluyendo web.config)
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
