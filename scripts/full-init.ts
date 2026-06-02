import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mfwvwohgpxgeihmqludt.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'your_supabase_service_key_here';

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function executeSQLDirect(sql: string): Promise<boolean> {
  console.log('📝 Executing SQL...');
  
  try {
    // 使用REST API执行SQL通过存储过程
    const { error } = await adminClient.rpc('execute_sql', { sql });
    
    if (error) {
      console.log(`⚠️ SQL执行失败: ${error.message}`);
      return false;
    }
    
    console.log('✅ SQL执行成功');
    return true;
  } catch (err: any) {
    console.log(`⚠️ 异常: ${err.message || err}`);
    return false;
  }
}

async function ensureExecuteSQLFunction() {
  console.log('🔧 检查execute_sql函数...');
  
  try {
    const { data, error } = await adminClient.rpc('execute_sql', { sql: 'SELECT 1' });
    
    if (!error) {
      console.log('✅ execute_sql函数已存在');
      return true;
    }
    
    console.log('⚠️ execute_sql函数不存在，尝试创建...');
    
    // 创建execute_sql函数
    const createFuncSQL = `
      CREATE OR REPLACE FUNCTION execute_sql(sql TEXT)
      RETURNS VOID AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    // 直接通过REST API创建函数是有限制的，我们需要使用不同的方法
    
    console.log('⚠️ 需要在Supabase控制台手动创建execute_sql函数');
    console.log('请在Supabase SQL Editor中执行以下SQL:');
    console.log(createFuncSQL);
    
    return false;
    
  } catch (err: any) {
    console.log(`⚠️ 检查execute_sql函数时出错: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 开始完整数据库初始化...\n');
  
  // 检查连接
  console.log('🔌 连接到Supabase...');
  try {
    const { data } = await adminClient.from('auth.users').select('id').limit(1);
    console.log('✅ 成功连接到Supabase');
  } catch (error) {
    console.error('❌ 连接失败:', error);
    process.exit(1);
  }
  
  // 检查execute_sql函数
  const hasExecuteSQL = await ensureExecuteSQLFunction();
  
  if (!hasExecuteSQL) {
    console.log('\n❌ 需要先在Supabase控制台创建execute_sql函数');
    console.log('请访问: https://supabase.com/dashboard/project/mfwvwohgpxgeihmqludt/sql');
    console.log('然后执行以下SQL创建函数:');
    console.log(`
CREATE OR REPLACE FUNCTION execute_sql(sql TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
    return;
  }
  
  // 创建所有表和存储过程
  const allSQL = `
-- ========== 创建所有数据库表 ==========

-- 1. AI配置表
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
CREATE POLICY "Allow read access for all users" ON ai_model_config FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to update" ON ai_model_config FOR UPDATE USING (true);

-- 2. 用户货币账户
CREATE TABLE IF NOT EXISTS user_coins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance DECIMAL(12,2) DEFAULT 0.00,
  frozen_balance DECIMAL(12,2) DEFAULT 0.00,
  total_earned DECIMAL(12,2) DEFAULT 0.00,
  total_spent DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_coins_user_id ON user_coins(user_id);
ALTER TABLE user_coins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own coins" ON user_coins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own coins" ON user_coins FOR UPDATE USING (auth.uid() = user_id);

-- 3. 交易记录
CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  balance_before DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL,
  description TEXT,
  related_order_id UUID,
  related_group_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coin_tx_user_id ON coin_transactions(user_id);
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions" ON coin_transactions FOR SELECT USING (auth.uid() = user_id);

-- 4. 内容表
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
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access for all users" ON contents FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert" ON contents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update" ON contents FOR UPDATE USING (true);

-- 5. 用户推广表
CREATE TABLE IF NOT EXISTS user_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referral_link TEXT NOT NULL,
  referred_users INTEGER DEFAULT 0,
  total_commission DECIMAL(10,2) DEFAULT 0.00,
  available_commission DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrals_user_id ON user_referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON user_referrals(referral_code);
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own referrals" ON user_referrals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own referrals" ON user_referrals FOR UPDATE USING (auth.uid() = user_id);

-- 6. 推广记录表
CREATE TABLE IF NOT EXISTS referral_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commission DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_records_referrer ON referral_records(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_records_referred ON referral_records(referred_user_id);
ALTER TABLE referral_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their referral records" ON referral_records FOR SELECT USING (auth.uid() = referrer_id);

-- 7. 用户等级表
CREATE TABLE IF NOT EXISTS user_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level VARCHAR(20) DEFAULT 'basic',
  direct_referrals INTEGER DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  total_commission DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_levels_user_id ON user_levels(user_id);
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own level" ON user_levels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own level" ON user_levels FOR UPDATE USING (auth.uid() = user_id);

-- 8. 群组表
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  language VARCHAR(10) NOT NULL,
  max_members INTEGER DEFAULT 100,
  join_type VARCHAR(20) NOT NULL DEFAULT 'free',
  join_fee DECIMAL(10,2) DEFAULT 0.00,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deposit_amount DECIMAL(10,2) DEFAULT 1000.00,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_groups_creator_id ON groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_groups_language ON groups(language);
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access for all users" ON groups FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert" ON groups FOR INSERT WITH CHECK (true);

-- 9. 群成员表
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- 10. 用户隐私设置
CREATE TABLE IF NOT EXISTS user_privacy_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  allow_nearby_search BOOLEAN DEFAULT true,
  allow_matchmaking BOOLEAN DEFAULT true,
  allow_stranger_messages BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_privacy_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their privacy settings" ON user_privacy_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their privacy settings" ON user_privacy_settings FOR UPDATE USING (auth.uid() = user_id);

-- ========== 创建存储过程 ==========

-- 充值存储过程
CREATE OR REPLACE FUNCTION recharge_coins(p_user_id UUID, p_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE user_coins 
  SET balance = balance + p_amount,
      total_earned = total_earned + p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  INSERT INTO coin_transactions (
    user_id, type, amount, balance_before, balance_after, description
  ) SELECT 
    p_user_id, 'recharge', p_amount,
    balance - p_amount, balance,
    '充值'
  FROM user_coins WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 消费存储过程
CREATE OR REPLACE FUNCTION spend_coins(p_user_id UUID, p_amount DECIMAL, p_description TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance DECIMAL;
BEGIN
  SELECT balance INTO current_balance FROM user_coins WHERE user_id = p_user_id;
  
  IF current_balance < p_amount THEN
    RETURN FALSE;
  END IF;
  
  UPDATE user_coins 
  SET balance = balance - p_amount,
      total_spent = total_spent + p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  INSERT INTO coin_transactions (
    user_id, type, amount, balance_before, balance_after, description
  ) SELECT 
    p_user_id, 'spend', p_amount,
    balance + p_amount, balance,
    p_description
  FROM user_coins WHERE user_id = p_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 入群存储过程
CREATE OR REPLACE FUNCTION join_group(p_user_id UUID, p_group_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  join_fee DECIMAL;
  join_type VARCHAR(20);
  current_balance DECIMAL;
BEGIN
  SELECT join_fee, join_type INTO join_fee, join_type 
  FROM groups WHERE id = p_group_id AND status = 'active';
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  IF join_type IN ('paid', 'paid_approval') THEN
    SELECT balance INTO current_balance FROM user_coins WHERE user_id = p_user_id;
    IF current_balance < join_fee THEN
      RETURN FALSE;
    END IF;
    
    UPDATE user_coins SET balance = balance - join_fee WHERE user_id = p_user_id;
  END IF;
  
  INSERT INTO group_members (group_id, user_id, role) VALUES (p_group_id, p_user_id, 'member');
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 发放佣金存储过程
CREATE OR REPLACE FUNCTION add_commission(p_referrer_id UUID, p_referred_user_id UUID, p_amount DECIMAL, p_level VARCHAR(20), p_is_direct BOOLEAN)
RETURNS VOID AS $$
BEGIN
  INSERT INTO referral_records (
    referrer_id, referred_user_id, amount, level, status
  ) VALUES (p_referrer_id, p_referred_user_id, p_amount, p_level, 'confirmed');
  
  UPDATE user_coins 
  SET balance = balance + p_amount,
      total_earned = total_earned + p_amount
  WHERE user_id = p_referrer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 内容使用次数增加
CREATE OR REPLACE FUNCTION increment_usage(content_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE contents 
  SET usage_count = usage_count + 1 
  WHERE id = content_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 更新推广用户数触发器
CREATE OR REPLACE FUNCTION update_user_referral_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_referrals 
  SET referred_users = referred_users + 1,
      total_commission = total_commission + NEW.amount,
      available_commission = available_commission + NEW.amount,
      updated_at = NOW()
  WHERE user_id = NEW.referrer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER referral_record_created
AFTER INSERT ON referral_records
FOR EACH ROW
EXECUTE FUNCTION update_user_referral_count();

-- ========== 插入AI配置数据 ==========
INSERT INTO ai_model_config (
  id, default_model, doubao_api_key, doubao_endpoint, doubao_model,
  claude_api_key, claude_model, claude_endpoint,
  openai_api_key, openai_model, openai_endpoint,
  max_tokens, temperature, system_prompt_prefix
) VALUES (
  1, 'doubao', 'ark-d751d0e3-08af-4d58-80b9-1e51b6830dd7-0fd5d',
  'https://ark.cn-beijing.volces.com/api/v3/chat/completions', 'ep-20250529145638-8v7r6',
  '', 'claude-3-5-sonnet-20241022', 'https://api.anthropic.com/v1/messages',
  '', 'gpt-4o-mini', 'https://api.openai.com/v1/chat/completions',
  800, 0.8, '你是一个专业的语言学习助手，请用简洁清晰的方式回答用户的问题。'
) ON CONFLICT (id) DO NOTHING;
`;

  console.log('\n📊 开始创建所有表和存储过程...');
  
  const success = await executeSQLDirect(allSQL);
  
  if (success) {
    console.log('\n🎉 数据库初始化完成!');
    console.log('\n📋 创建的表:');
    console.log('1. ai_model_config - AI配置表');
    console.log('2. user_coins - 用户货币账户');
    console.log('3. coin_transactions - 交易记录');
    console.log('4. contents - 内容表');
    console.log('5. user_referrals - 用户推广表');
    console.log('6. referral_records - 推广记录表');
    console.log('7. user_levels - 用户等级表');
    console.log('8. groups - 群组表');
    console.log('9. group_members - 群成员表');
    console.log('10. user_privacy_settings - 用户隐私设置');
    
    console.log('\n⚡ 创建的存储过程:');
    console.log('1. recharge_coins - 充值');
    console.log('2. spend_coins - 消费');
    console.log('3. join_group - 入群');
    console.log('4. add_commission - 发放佣金');
    console.log('5. increment_usage - 增加使用次数');
    
    console.log('\n✅ AI配置数据已插入');
  } else {
    console.log('\n❌ 初始化失败，请在Supabase控制台手动执行SQL');
    console.log('\n📝 请访问: https://supabase.com/dashboard/project/mfwvwohgpxgeihmqludt/sql');
    console.log('然后执行完整的SQL脚本');
  }
}

main().catch(console.error);