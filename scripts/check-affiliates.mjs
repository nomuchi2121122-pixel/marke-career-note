// 提携状況の一覧を表示する（月次レポートで使う）
import fs from 'node:fs';
const a = JSON.parse(fs.readFileSync('src/data/affiliates.json', 'utf8'));
for (const [id, v] of Object.entries(a)) {
  if (v.category === '公的制度') continue;
  console.log([v.status || (v.affiliateUrl ? '提携済み' : '未提携'), id, v.name, v.reward || ''].join('\t'));
}
