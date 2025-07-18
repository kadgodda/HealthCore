import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@anteacore/shared': path.resolve(__dirname, '../../AnteaCore/anteacore-shared/typescript/src'),
      '@anteacore/shared/widgets': path.resolve(__dirname, '../../AnteaCore/anteacore-shared/typescript/src/widgets')
    }
  },
  server: {
    port: 5173,
    host: true
  }
})