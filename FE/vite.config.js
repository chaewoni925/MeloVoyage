import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 프론트엔드 포트
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // 백엔드 로컬 서버 주소
        changeOrigin: true,
        
      },
    },
  }
})
