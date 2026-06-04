/**
 * 种子数据同步脚本
 * 
 * 用途：将本地预置数据上传到 Supabase / Cloudflare
 * 运行方式：
 *   node scripts/seed-supabase.js
 *   或在 GitHub Actions 中自动运行
 *
 * 注意：此脚本需要在 Node.js 22+ 环境中运行（支持 ES modules）
 */

import { seedAllTables, getSeedData } from '../src/data/seedData.js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

console.log('=== 言道 (Gendou) 数据同步工具 ===');
console.log(`Supabase URL: ${SUPABASE_URL || '(未配置)'}`);
console.log(`Service Key: ${SUPABASE_KEY ? '✅ 已配置' : '❌ 未配置'}`);
console.log('');

// 获取所有种子数据
const allSeedData = getSeedData();
let totalRows = 0;
for (const [table, rows] of Object.entries(allSeedData)) {
  const arr = Array.isArray(rows) ? rows : [];
  totalRows += arr.length;
  console.log(`📦 ${table}: ${arr.length} 条`);
}
console.log(`\n总计: ${totalRows} 条数据`);

// 上传到 Supabase
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.log('\n⚠️ 未配置 Supabase 凭证，跳过上传。');
  console.log('   数据将通过 LocalAdapter 自动填充到 localStorage。');
  process.exit(0);
}

async function uploadToSupabase() {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Prefer': 'resolution=merge-duplicates',
  };

  let successCount = 0;
  let failCount = 0;

  for (const [table, rawRows] of Object.entries(allSeedData)) {
    const rowData = Array.isArray(rawRows) ? rawRows : [];
    if (rowData.length === 0) continue;

    // 分批上传，每批100条
    for (let i = 0; i < rowData.length; i += 100) {
      const batch = rowData.slice(i, i + 100);
      try {
        const resp = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(batch),
        });
        if (resp.ok) {
          successCount += batch.length;
          console.log(`✅ ${table}: 已上传 ${Math.min(i + 100, rowData.length)}/${rowData.length}`);
        } else {
          const err = await resp.text().catch(() => resp.statusText);
          failCount += batch.length;
          console.error(`❌ ${table}: HTTP ${resp.status} - ${err}`);
        }
      } catch (e) {
        failCount += batch.length;
        console.error(`❌ ${table}: 网络错误`, e instanceof Error ? e.message : String(e));
      }
    }
  }

  console.log(`\n═══ 同步完成 ═══`);
  console.log(`成功: ${successCount} 条`);
  if (failCount > 0) console.log(`失败: ${failCount} 条`);
}

uploadToSupabase()
  .then(() => process.exit(0))
  .catch((e) => { console.error('Fatal:', e); process.exit(1); });
