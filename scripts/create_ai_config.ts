import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mfwvwohgpxgeihmqludt.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'your_supabase_service_key_here';

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const sql = `
CREATE TABLE IF NOT EXISTS ai_model_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  default_model VARCHAR(20) NOT NULL,
  doubao_api_key TEXT,
  doubao_endpoint TEXT,
  doubao_model TEXT,
  claude_api_key TEXT,
  claude_model TEXT,
  claude_endpoint TEXT,
  openai_api_key TEXT,
  openai_model TEXT,
  openai_endpoint TEXT,
  max_tokens INTEGER DEFAULT 800,
  temperature REAL DEFAULT 0.8,
  system_prompt_prefix TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_config_id ON ai_model_config(id);

ALTER TABLE ai_model_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for all users" ON ai_model_config
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to update" ON ai_model_config
FOR UPDATE USING (true);

INSERT INTO ai_model_config (
  id,
  default_model,
  doubao_api_key,
  doubao_endpoint,
  doubao_model,
  claude_api_key,
  claude_model,
  claude_endpoint,
  openai_api_key,
  openai_model,
  openai_endpoint,
  max_tokens,
  temperature,
  system_prompt_prefix
) VALUES (
  1,
  'doubao',
  'ark-d751d0e3-08af-4d58-80b9-1e51b6830dd7-0fd5d',
  'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
  'ep-20250529145638-8v7r6',
  '',
  'claude-3-5-sonnet-20241022',
  'https://api.anthropic.com/v1/messages',
  '',
  'gpt-4o-mini',
  'https://api.openai.com/v1/chat/completions',
  800,
  0.8,
  '你是一个专业的语言学习助手，请用简洁清晰的方式回答用户的问题。'
) ON CONFLICT (id) DO NOTHING;
`;

async function createTable() {
  console.log('📊 Creating AI configuration table...');
  
  try {
    const { error } = await adminClient.rpc('execute_sql', { sql });
    
    if (error) {
      console.error('❌ Failed:', error.message);
      return;
    }
    
    console.log('✅ AI configuration table created successfully!');
    
    const { data } = await adminClient.from('ai_model_config').select('*').eq('id', 1).maybeSingle();
    if (data) {
      console.log('\n📊 AI Configuration:');
      console.log(`Default Model: ${data.default_model}`);
      console.log(`Doubao API Key: ${data.doubao_api_key ? '✓ Configured' : '✗ Not set'}`);
    }
  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

createTable().catch(console.error);