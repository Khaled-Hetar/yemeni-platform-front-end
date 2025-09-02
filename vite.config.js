import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'; // 1. قم باستيراد هذه الدالة

// 2. احصل على المسار الحالي بالطريقة الحديثة
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react( ), tailwindcss()],
  resolve: {
    alias: {
      // 3. الآن سيعمل __dirname بشكل صحيح
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    watch: {
      // لا تنسَ أن هذا السطر هو الحل للمشكلة الأصلية
      ignored: ['**/*.json'],
    }
  }
})
