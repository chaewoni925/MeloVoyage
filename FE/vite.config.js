import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { 
    host: '127.0.0.1', // 추가
    port: 5173, // 프론트엔드 포트
    proxy: {
      // '/api'로 시작하는 요청은 백엔드 서버로 가도록 프록시 설정
      '/api': {
        target: 'http://localhost:5001', // 백엔드 로컬 서버 주소 (실제 백엔드 포트로 변경 필요)
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/destinations': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/onboarding': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/recommend': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/storage': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/spotify': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})