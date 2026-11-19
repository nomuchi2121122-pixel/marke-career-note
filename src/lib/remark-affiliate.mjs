// 記事中の [テキスト](aff:サービスID) を src/data/affiliates.json のリンクに置き換える。
// ASPのリンクが未設定なら公式URLを通常リンクとして使う（PR扱いにはしない）。
import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.resolve('src/data/affiliates.json');

function walk(node, fn) {
  fn(node);
  if (node.children) node.children.forEach((c) => walk(c, fn));
}

export default function remarkAffiliate() {
  const affiliates = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  return (tree, file) => {
    walk(tree, (node) => {
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
