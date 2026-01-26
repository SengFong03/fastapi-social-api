import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // 允许 Docker 外部访问
    port: 5173,
    proxy: {
      // 👇 意思是：凡是 "/api" 或者直接 "/" 开头的请求，都转发给后端
      '/posts': {
        target: 'http://api:8000', // 这里用 Docker 内部的后端服务名 'api'
        changeOrigin: true,
      },
      '/users': {
        target: 'http://api:8000',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://api:8000',
        changeOrigin: true,
      },
      '/ai': {
        target: 'http://api:8000',
        changeOrigin: true,
      }
      // 如果你的后端都在 /api 下，那只需要配置一个 '/api' 就行了
    }
  }
})