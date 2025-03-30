import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';
import glsl from 'vite-plugin-glsl';
import * as config from './config';

// https://astro.build/config
export default defineConfig({
  base: config.pathPrefix,
  outDir: `./dist${config.pathPrefix}`,
  site: 'https://example.com',
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en', 'sc', 'kr'],
  },
  integrations: [mdx(), sitemap(), tailwind({ nesting: true })],
  vite: {
    define: {
      'import.meta.vitest': 'undefined',
    },
    plugins: [visualizer(), glsl()],
  },
});
