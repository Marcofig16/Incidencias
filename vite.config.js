import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
//import dotenv from 'dotenv';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno basadas en el modo
  // const env = dotenv.config({ path: `.env.${mode}` }).parsed;

  console.log(`Building for mode: ${mode}`);
  // console.log('Environment variables:', env);

  return {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'PWA-SPA-Firebase',
          short_name: 'PWA',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
    build: {
      outDir: mode === 'test' ? 'dist-test' : 'dist',
    },
    server: {
      port: mode === 'test' ? 5174 : 5173, // Cambia el puerto según el modo
    },
  };
});
