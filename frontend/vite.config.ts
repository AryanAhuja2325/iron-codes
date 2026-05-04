import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://23.22.133.168:5000", // 🔥 replace this
        changeOrigin: true,
        secure: false,
      },
    },
  },
})