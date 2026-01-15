import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    VitePWA({
      workbox: {
        maximumFileSizeToCacheInBytes: 3000000,
      },
      manifest: {
        name: 'Anamorphic Desqueezer',
        short_name: 'Anamorphic Desqueezer',
        description:
          'Anamorphic Desqueezer is a tool for desqueezing anamorphic images',
        theme_color: '#B10047',
        icons: [
          {
            src: 'anamorph_logo_1024.png',
            sizes: '1024x1024',
            type: 'image/png',
          },
          {
            src: 'anamorph_logo_180.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['@metools/web-image-converter'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
});
