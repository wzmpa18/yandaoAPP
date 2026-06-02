import { createClient } from '@supabase/supabase-js';
import { generateMockData } from '../src/data/database';

const SUPABASE_URL = 'https://mfwvwohgpxgeihmqludt.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'your_supabase_service_key_here';

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function uploadMockData() {
  console.log('📤 Uploading mock data...');
  
  const mockItems = generateMockData();
  console.log(`Generated ${mockItems.length} mock items`);
  
  const itemsToInsert = mockItems.map(item => ({
    type: item.type,
    language: item.language,
    title: item.title || null,
    content: item.content,
    translation: item.translation || null,
    level: item.level || null,
    age_group: item.age_group || null,
    source: item.source,
    usage_count: item.usage_count,
  }));

  const { error } = await adminClient.from('contents').insert(itemsToInsert);
  
  if (error) {
    console.error('❌ Error uploading data:', error.message);
    return false;
  }
  
  console.log(`✅ Successfully uploaded ${itemsToInsert.length} items`);
  return true;
}

async function getStats() {
  console.log('📊 Getting stats...');
  
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

async function testQueries() {
  console.log('🔍 Testing queries...');
  
  const { data: jokes, error: jokeError } = await adminClient
    .from('contents')
    .select('*')
    .eq('type', 'joke')
    .eq('language', 'en')
    .limit(5);
  
  if (jokeError) {
    console.error('❌ Error querying jokes:', jokeError.message);
    return;
  }
  
  console.log('✅ Query test successful!');
  console.log('Sample jokes:');
  jokes.forEach((joke: any) => {
    console.log(`  - ${joke.content.slice(0, 50)}...`);
  });
}

async function main() {
  console.log('🚀 Starting data upload...\n');
  
  console.log('🔌 Connecting to Supabase...');
  try {
    const { data } = await adminClient.from('contents').select('id').limit(1);
    console.log('✅ Connected to Supabase');
  } catch (error) {
    console.error('❌ Failed to connect:', error);
    process.exit(1);
  }

  await uploadMockData();
  
  const stats = await getStats();
  if (stats) {
    console.log('\n📊 Database Stats:');
    console.log(`Total items: ${stats.total}`);
    console.log('Content Types:', stats.types);
    console.log('Languages:', stats.languages);
  }

  await testQueries();

  console.log('\n🎉 Data upload complete!');
}

main().catch(console.error);