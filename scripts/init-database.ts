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

async function createTable() {
  console.log('📦 Creating contents table...');
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS contents (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      type VARCHAR(50) NOT NULL,
      language VARCHAR(10) NOT NULL,
      title TEXT,
      content TEXT NOT NULL,
      translation TEXT,
      level VARCHAR(10),
      age_group VARCHAR(20),
      source VARCHAR(20) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      usage_count INTEGER DEFAULT 0
    );
    
    CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type);
    CREATE INDEX IF NOT EXISTS idx_contents_language ON contents(language);
    CREATE INDEX IF NOT EXISTS idx_contents_type_language ON contents(type, language);
  `;

  const { error } = await adminClient.rpc('execute_sql', { sql: createTableSQL });
  if (error) {
    console.error('❌ Error creating table:', error.message);
    return false;
  }
  
  console.log('✅ Table created successfully');
  return true;
}

async function createFunction() {
  console.log('⚡ Creating increment_usage function...');
  
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION increment_usage(content_id UUID)
    RETURNS VOID AS $$
    BEGIN
      UPDATE contents 
      SET usage_count = usage_count + 1 
      WHERE id = content_id;
    END;
    $$ LANGUAGE plpgsql;
  `;

  const { error } = await adminClient.rpc('execute_sql', { sql: createFunctionSQL });
  if (error) {
    console.error('❌ Error creating function:', error.message);
    return false;
  }
  
  console.log('✅ Function created successfully');
  return true;
}

async function enableRLS() {
  console.log('🔒 Enabling Row Level Security...');
  
  const enableRLSSQL = `
    ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Allow read access for all users" ON contents
    FOR SELECT USING (true);
    
    CREATE POLICY "Allow authenticated users to insert" ON contents
    FOR INSERT WITH CHECK (true);
    
    CREATE POLICY "Allow authenticated users to update" ON contents
    FOR UPDATE USING (true);
  `;

  const { error } = await adminClient.rpc('execute_sql', { sql: enableRLSSQL });
  if (error) {
    console.error('❌ Error enabling RLS:', error.message);
    return false;
  }
  
  console.log('✅ RLS enabled successfully');
  return true;
}

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
  
  const { data, error } = await adminClient.from('contents').select('*', { count: 'exact' });
  
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
  console.log('🚀 Starting database initialization...\n');
  
  console.log('🔌 Connecting to Supabase...');
  try {
    const { data } = await adminClient.from('contents').select('id').limit(1);
    console.log('✅ Connected to Supabase');
  } catch (error) {
    console.error('❌ Failed to connect:', error);
    process.exit(1);
  }

  await createTable();
  await createFunction();
  await enableRLS();
  await uploadMockData();
  
  const stats = await getStats();
  if (stats) {
    console.log('\n📊 Final Database Stats:');
    console.log(`Total items: ${stats.total}`);
    console.log('Content Types:', stats.types);
    console.log('Languages:', stats.languages);
  }

  console.log('\n🎉 Database initialization complete!');
}

main().catch(console.error);