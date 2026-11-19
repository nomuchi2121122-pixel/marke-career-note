// 提携状況の一覧を表示する（週次レポートで使う）
import fs from 'node:fs';
const a = JSON.parse(fs.readFileSync('src/data/affiliates.json', 'utf8'));
for (const [id, v] of Object.entries(a)) {
  console.log(`${v.affiliateUrl ? '提携済' : '未提携'}\t${id}\t${v.name}`);
}
