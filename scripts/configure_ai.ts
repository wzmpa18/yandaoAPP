import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mfwvwohgpxgeihmqludt.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'your_supabase_service_key_here';

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const DOUBAO_CONFIG = {
  id: 1,
  default_model: 'doubao' as const,
  doubao_api_key: process.env.DOUBAO_API_KEY || '',
  doubao_endpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
  doubao_model: 'ep-20250529145638-8v7r6',
  claude_api_key: '',
  claude_model: 'claude-3-5-sonnet-20241022',
  claude_endpoint: 'https://api.anthropic.com/v1/messages',
  openai_api_key: '',
  openai_model: 'gpt-4o-mini',
  openai_endpoint: 'https://api.openai.com/v1/chat/completions',
  max_tokens: 800,
  temperature: 0.8,
  system_prompt_prefix: '你是一个专业的语言学习助手，请用简洁清晰的方式回答用户的问题。',
};

async function configureAI() {
  console.log('🔧 Configuring AI settings...');
  
  const { data: existing } = await adminClient.from('ai_model_config').select('*').eq('id', 1).maybeSingle();
  
  if (existing) {
    console.log('Updating existing AI configuration...');
    const { error } = await adminClient.from('ai_model_config').update(DOUBAO_CONFIG).eq('id', 1);
    if (error) {
      console.error('❌ Failed to update:', error.message);
      return;
    }
  } else {
    console.log('Creating new AI configuration...');
    const { error } = await adminClient.from('ai_model_config').insert([DOUBAO_CONFIG]);
    if (error) {
      console.error('❌ Failed to insert:', error.message);
      return;
    }
  }
  
  console.log('✅ AI configuration updated successfully!');
  
  const { data: config } = await adminClient.from('ai_model_config').select('*').eq('id', 1).maybeSingle();
  if (config) {
    console.log('\n📊 Current AI Configuration:');
    console.log(`Default Model: ${config.default_model}`);
    console.log(`Doubao API Key: ${config.doubao_api_key ? '✓ Configured' : '✗ Not set'}`);
    console.log(`Doubao Endpoint: ${config.doubao_endpoint}`);
    console.log(`Doubao Model: ${config.doubao_model}`);
  }
}

configureAI().catch(console.error);