# マーケキャリアノート

マーケ職向けキャリア（スクール・転職・補助金）のアフィリエイトサイト。Astro製の静的サイトで、Cloudflare Pagesで無料公開する。

- 記事：`src/content/articles/*.md`（`draft: true` は公開されない）
- 広告リンク：`src/data/affiliates.json`（ASPで提携したら `affiliateUrl` を入れる）
- 運営者情報：`src/data/site.ts` の【要入力】を埋める
- AIの作業ルール：`AGENTS.md`

## Cloudflare Pages の設定
- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
