import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // Load all env variables

  return {
    base: './',
    define: {
      'process.env': env, // Map process.env to the loaded environment variables
    },
    plugins: [react()],
    server: {
      port: 3001,
      host: "0.0.0.0"
    }
  };
});