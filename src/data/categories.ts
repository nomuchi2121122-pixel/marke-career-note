// カテゴリ名と、URLに使う英字スラッグの対応
export const CATEGORIES = [
  { name: 'スクール', slug: 'school' },
  { name: '転職', slug: 'job-change' },
  { name: '補助金・制度', slug: 'subsidy' },
  { name: 'キャリア', slug: 'career' },
  { name: 'ツール', slug: 'tools' },
] as const;

export const categorySlug = (name: string) => CATEGORIES.find((c) => c.name === name)?.slug ?? 'other';

// 写真がない記事のサムネイル
export const FALLBACK_IMAGE = '/og-default.png';
