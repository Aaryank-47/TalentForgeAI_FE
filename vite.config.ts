import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Force restart: 4
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
})
