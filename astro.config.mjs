import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import remarkAffiliate from './src/lib/remark-affiliate.mjs';

const SITE_URL = 'https://marke-career-note.pages.dev';

// サイトマップに記事の最終更新日（lastmod）を入れるため、記事の frontmatter から日付を読む
const articlesDir = path.resolve('src/content/articles');
const lastmodByPath = {};
for (const file of fs.readdirSync(articlesDir).filter((f) => f.endsWith('.md'))) {
  const text = fs.readFileSync(path.join(articlesDir, file), 'utf8');
  const fm = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const pick = (key) => fm.match(new RegExp(`^${key}:\\s*["']?([0-9-]+)`, 'm'))?.[1];
  const date = pick('updatedDate') ?? pick('pubDate');
  // 日付は日本時間として扱う（UTCにすると未来の日時になり、Googleに無視されることがある）
  if (date) lastmodByPath[`/articles/${file.replace(/\.md$/, '')}/`] = `${date}T00:00:00+09:00`;
}

export default defineConfig({
  site: SITE_URL,
  integrations: [
    sitemap({
      serialize(item) {
        const lastmod = lastmodByPath[new URL(item.url).pathname];
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  markdown: {
    remarkPlugins: [remarkAffiliate],
  },
});
