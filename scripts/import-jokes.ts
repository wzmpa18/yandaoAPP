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

interface JokeData {
  language_code: string;
  age_group: string;
  title: string;
  content: string;
  translation: string;
  difficulty: number;
}

function parseSQLFile(filePath: string): JokeData[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const jokes: JokeData[] = [];
  
  const insertMatch = content.match(/INSERT INTO jokes \(.*?\) VALUES\s*([\s\S]*?);/);
  if (insertMatch) {
    const valuesPart = insertMatch[1];
    const valueGroups = valuesPart.match(/\([^)]+\)/g);
    
    if (valueGroups) {
      valueGroups.forEach(group => {
        const cleaned = group.slice(1, -1);
        const parts = cleaned.split(/,(?=(?:[^']*'[^']*')*[^']*$)/);
        
        if (parts.length >= 9) {
          try {
            jokes.push({
              language_code: parts[1].trim().replace(/'/g, ''),
              age_group: parts[2].trim().replace(/'/g, ''),
              title: parts[3].trim().replace(/'/g, ''),
              content: parts[4].trim().replace(/'/g, ''),
              translation: parts[5] ? parts[5].trim().replace(/'/g, '') : '',
              difficulty: parseInt(parts[6].trim()),
            });
          } catch {
            // Skip malformed entries
          }
        }
      });
    }
  }
  
  return jokes;
}

async function importJokes(jokes: JokeData[]) {
  console.log(`📤 Importing ${jokes.length} jokes...`);
  
  const itemsToInsert = jokes.map(joke => ({
    type: 'joke',
    language: joke.language_code,
    title: joke.title,
    content: joke.content,
    translation: joke.translation || null,
    level: joke.difficulty.toString(),
    age_group: joke.age_group as 'kids' | 'teenagers' | 'adults' | undefined,
    source: 'manual',
    usage_count: 0,
  }));

  const { error } = await adminClient.from('contents').insert(itemsToInsert);
  
  if (error) {
    console.error('❌ Error importing jokes:', error.message);
    return 0;
  }
  
  console.log(`✅ Successfully imported ${itemsToInsert.length} jokes`);
  return itemsToInsert.length;
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
  console.log('🚀 Starting joke import...\n');
  
  console.log('📖 Parsing SQL file...');
  const jokes = parseSQLFile('最终完整数据库.sql');
  console.log(`Found ${jokes.length} jokes in SQL file`);
  
  console.log('🔌 Connecting to Supabase...');
  try {
    const { data } = await adminClient.from('contents').select('id').limit(1);
    console.log('✅ Connected to Supabase');
  } catch (error) {
    console.error('❌ Failed to connect:', error);
    process.exit(1);
  }

  const imported = await importJokes(jokes);
  
  const stats = await getStats();
  if (stats) {
    console.log('\n📊 Database Stats After Import:');
    console.log(`Total items: ${stats.total}`);
    console.log('Content Types:', stats.types);
    console.log('Languages:', stats.languages);
  }

  console.log('\n🎉 Joke import complete!');
}

main().catch(console.error);