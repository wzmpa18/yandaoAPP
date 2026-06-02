import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const SUPABASE_URL = 'https://mfwvwohgpxgeihmqludt.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'your_supabase_service_key_here';

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const TARGET_LANGS = ['ja', 'en', 'ko', 'fr', 'es', 'de', 'it', 'pt', 'ar', 'zh'];

interface TUFSRow {
  cid: string;
  lang: string;
  wid: string;
  lemma: string;
  comment: string;
  iids: string;
  examples: string;
  is_basic: string;
  scenes: string;
  bunrui: string;
}

function parseTSV(filePath: string): TUFSRow[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  const rows: TUFSRow[] = [];
  
  for (let i = 1; i < lines.length; i++) { // Skip header
    const parts = lines[i].split('\t');
    if (parts.length >= 7) {
      rows.push({
        cid: parts[0]?.trim() || '',
        lang: parts[1]?.trim() || '',
        wid: parts[2]?.trim() || '',
        lemma: parts[3]?.trim() || '',
        comment: parts[4]?.trim() || '',
        iids: parts[5]?.trim() || '',
        examples: parts[6]?.trim() || '',
        is_basic: parts[7]?.trim() || '',
        scenes: parts[8]?.trim() || '',
        bunrui: parts[9]?.trim() || '',
      });
    }
  }
  
  return rows;
}

function extractMeaning(comment: string): string {
  // Remove HTML tags and special characters
  let clean = comment.replace(/<[^>]*>/g, '');
  // Remove Japanese brackets ［］ and content inside
  clean = clean.replace(/［[^］]*］/g, '');
  // Remove \r
  clean = clean.replace(/\r/g, '');
  // Get only Chinese/Japanese meaning before semicolon
  const match = clean.match(/^([\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af\w\s,，。、\-]+)/);
  return match ? match[1].trim() : clean.trim();
}

async function importData(rows: TUFSRow[], batchSize: number = 100) {
  const filtered = rows.filter(row => TARGET_LANGS.includes(row.lang) && row.lemma && row.comment);
  console.log(`📊 Filtered ${filtered.length} rows for target languages`);
  
  let totalImported = 0;
  
  for (let i = 0; i < filtered.length; i += batchSize) {
    const batch = filtered.slice(i, i + batchSize);
    
    const itemsToInsert = batch.map(row => ({
      type: 'vocab',
      language: row.lang,
      title: row.lemma,
      content: row.lemma,
      translation: extractMeaning(row.comment),
      level: row.is_basic === '1' ? '1' : '2',
      source: 'tufs',
      usage_count: 0,
    }));

    try {
      const { error } = await adminClient.from('contents').insert(itemsToInsert);
      
      if (error) {
        console.error(`❌ Batch ${Math.floor(i/batchSize) + 1} failed:`, error.message);
        continue;
      }
      
      totalImported += batch.length;
      console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}: Imported ${batch.length} items (total: ${totalImported})`);
      
    } catch (error) {
      console.error(`❌ Batch ${Math.floor(i/batchSize) + 1} exception:`, error);
    }
  }
  
  return totalImported;
}

async function getStats() {
  const { data, error } = await adminClient.from('contents').select('*');
  
  if (error) {
    console.error('❌ Error getting stats:', error.message);
    return null;
  }
  
  const types: Record<string, number> = {};
  const languages: Record<string, number> = {};
  
  data.forEach((item: any) => {
    types[item.type] = (types[item.type] || 0) + 1;
    languages[item.language] = (languages[item.language] || 0) + 1;
  });
  
  return { total: data.length, types, languages };
}

async function main() {
  console.log('🚀 Starting TUFS vocabulary import...\n');
  
  console.log('🔌 Connecting to Supabase...');
  try {
    const { data } = await adminClient.from('contents').select('id').limit(1);
    console.log('✅ Connected to Supabase');
  } catch (error) {
    console.error('❌ Failed to connect:', error);
    process.exit(1);
  }

  console.log('\n📖 Reading TSV file...');
  const rows = parseTSV('tufs-vocab.tsv');
  console.log(`✅ Read ${rows.length} total rows`);

  console.log('\n📤 Importing data...');
  const imported = await importData(rows, 100);
  console.log(`\n✅ Successfully imported ${imported} vocabulary items from TUFS`);

  const stats = await getStats();
  if (stats) {
    console.log('\n📊 Database Stats After Import:');
    console.log(`Total items: ${stats.total}`);
    console.log('Content Types:', stats.types);
    console.log('Languages:', stats.languages);
  }

  console.log('\n🎉 TUFS vocabulary import complete!');
}

main().catch(console.error);