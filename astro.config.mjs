import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkAffiliate from './src/lib/remark-affiliate.mjs';

export default defineConfig({
  site: 'https://marke-career-note.pages.dev',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkAffiliate],
  },
});
