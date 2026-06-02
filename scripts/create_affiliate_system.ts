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
-- 创建用户推广表
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

-- 创建推广记录表
CREATE TABLE IF NOT EXISTS referral_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commission DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, paid
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_referrals_user_id ON user_referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON user_referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_records_referrer ON referral_records(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_records_referred ON referral_records(referred_user_id);

-- 启用 RLS
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_records ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "Users can view their own referrals" ON user_referrals
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own referrals" ON user_referrals
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their referral records" ON referral_records
FOR SELECT USING (auth.uid() = referrer_id);

-- 创建触发器更新用户表
CREATE OR REPLACE FUNCTION update_user_referral_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_referrals 
  SET referred_users = referred_users + 1,
      total_commission = total_commission + NEW.commission,
      available_commission = available_commission + NEW.commission
  WHERE user_id = NEW.referrer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER referral_record_created
AFTER INSERT ON referral_records
FOR EACH ROW
EXECUTE FUNCTION update_user_referral_count();
`;

async function createAffiliateSystem() {
  console.log('🚀 Creating affiliate system tables...');
  
  try {
    // Create tables using direct insert approach via API
    console.log('Creating user_referrals table...');
    const { error: err1 } = await adminClient.from('user_referrals').select('id').limit(1);
    if (err1 && err1.code === '42P01') {
      // Table doesn't exist, need to create via SQL editor
      console.log('⚠️ Tables need to be created in Supabase SQL Editor');
      console.log('Please execute the following SQL in your Supabase console:');
      console.log('\n' + sql);
      return;
    }
    
    console.log('✅ Affiliate system tables already exist!');
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

createAffiliateSystem().catch(console.error);