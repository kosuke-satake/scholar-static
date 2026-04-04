import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [react(), keystatic()],
  output: 'server',
  adapter: cloudflare(),
  vite: {
    server: {
      fs: {
        allow: ['..']
      }
    }
  }
});