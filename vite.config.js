import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // In development, send /employees requests to the Node server
    proxy: { '/employees': 'http://localhost:3000' },
  },
});
