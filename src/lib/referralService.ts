import { supabase } from './supabase';

export interface ReferralInfo {
  id: string;
  user_id: string;
  referral_code: string;
  referral_link: string;
  referred_users: number;
  total_commission: number;
  available_commission: number;
  created_at: string;
  updated_at: string;
}

export interface ReferralRecord {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  commission: number;
  status: 'pending' | 'confirmed' | 'paid';
  created_at: string;
}

export async function getReferralInfo(): Promise<ReferralInfo | null> {
  const { data, error } = await supabase.from('user_referrals').select('*').maybeSingle();
  if (error) return null;
  return data;
}

export async function createReferralCode(): Promise<ReferralInfo | null> {
  const user = await supabase.auth.getUser();
  if (!user.data.user) return null;

  const referralCode = generateReferralCode();
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const { data, error } = await supabase.from('user_referrals').insert([{
    user_id: user.data.user.id,
    referral_code: referralCode,
    referral_link: referralLink,
  }]).select().single();

  if (error) return null;
  return data;
}

export async function getReferralRecords(): Promise<ReferralRecord[]> {
  const { data, error } = await supabase.from('referral_records').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return data;
}

export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function trackReferral(referralCode: string): Promise<boolean> {
  const { data: referral } = await supabase.from('user_referrals').select('user_id').eq('referral_code', referralCode).maybeSingle();
  if (!referral) return false;

  const user = await supabase.auth.getUser();
  if (!user.data.user) return false;

  const { error } = await supabase.from('referral_records').insert([{
    referrer_id: referral.user_id,
    referred_user_id: user.data.user.id,
    commission: 10.00,
    status: 'pending',
  }]);

  return !error;
}