import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const htmlEntry = (path: string) => new URL(path, import.meta.url).pathname

// https://vite.dev/config/
export default defineConfig({
  base: '/ECP3/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: htmlEntry('index.html'),
        widgetLibrary: htmlEntry('widget-library.html'),
      },
    },
  },
})
