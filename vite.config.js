import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.lottie'],
  server: {
    proxy: {
      // String shorthand for simple cases
      '/api': {
        target: 'http://wezume.in:8081',
        changeOrigin: true,
        secure: false,      
      }
    }
  }
})