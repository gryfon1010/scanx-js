import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '10.10.0.6',  // Your specific IP address
    port: 3000,
    strictPort: true,
    cors: true,
    hmr: {
      clientPort: 3000,
      host: '10.10.0.6'  // Your specific IP address
    },
  },
});
