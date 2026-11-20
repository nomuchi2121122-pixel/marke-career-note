// 記事中の [テキスト](aff:サービスID) を src/data/affiliates.json のリンクに置き換える。
// ASPのリンクが未設定なら公式URLを通常リンクとして使う（PR扱いにはしない）。
import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.resolve('src/data/affiliates.json');
const rakutenPath = path.resolve('src/data/rakuten.json');

// 楽天のURLを、A8.net経由の楽天アフィリエイトリンクに変換する
export function rakutenLink(url, cfg) {
  const enc = encodeURIComponent;
  const inner = `${cfg.hgcBase}?pc=${enc(url)}&m=${enc(url)}`;
  return `https://rpx.a8.net/svt/ejp?a8mat=${cfg.a8mat}&rakuten=y&a8ejpredirect=${enc(inner)}`;
}

function walk(node, fn) {
  fn(node);
  if (node.children) node.children.forEach((c) => walk(c, fn));
}

export default function remarkAffiliate() {
  const affiliates = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const rakuten = JSON.parse(fs.readFileSync(rakutenPath, 'utf8'));
  return (tree, file) => {
    walk(tree, (node) => {
      // 本文中の写真は遅延読み込みにして、表示を速くする
      if (node.type === 'image') {
        node.data = node.data || {};
        node.data.hProperties = { loading: 'lazy', decoding: 'async', width: 1200, height: 675 };
        return;
      }
      if (node.type === 'link' && node.url.startsWith('rakuten:')) {
        const target = node.url.slice(8);
        if (!/^https:\/\/([a-z0-9-]+\.)*rakuten\.co\.jp\//.test(target)) {
          throw new Error(`楽天以外のURLです: ${target}（${file.path}）`);
        }
        node.url = rakutenLink(target, rakuten);
        node.data = node.data || {};
        node.data.hProperties = { rel: 'sponsored noopener', target: '_blank', 'data-aff': 'rakuten' };
        return;
      }
      if (node.type !== 'link' || !node.url.startsWith('aff:')) return;
      const id = node.url.slice(4);
      const item = affiliates[id];
      if (!item) {
        throw new Error(`affiliates.json に "${id}" がありません（${file.path}）`);
      }
      const isAffiliate = Boolean(item.affiliateUrl);
      node.url = isAffiliate ? item.affiliateUrl : item.officialUrl;
      node.data = node.data || {};
      node.data.hProperties = {
        rel: isAffiliate ? 'sponsored noopener' : 'noopener',
        target: '_blank',
        'data-aff': id,
      };
    });
  };
}
