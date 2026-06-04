import { data as dp, auth as ap } from '../providers';

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
  const data = await dp.selectOne('user_referrals');
  if (!data) return null;
  return data as ReferralInfo;
}

export async function createReferralCode(): Promise<ReferralInfo | null> {
  const user = await ap.getUser();
  if (!user) return null;

  const referralCode = generateReferralCode();
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const result = await dp.insert('user_referrals', [{
    user_id: user.id,
    referral_code: referralCode,
    referral_link: referralLink,
  }]);

  if (!result || result.length === 0) return null;
  return result[0] as ReferralInfo;
}

export async function getReferralRecords(): Promise<ReferralRecord[]> {
  const data = await dp.select('referral_records', {
    order: { column: 'created_at', ascending: false },
  });
  return data as ReferralRecord[];
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
  const referral = await dp.selectOne('user_referrals', {
    eq: { referral_code: referralCode },
  });
  if (!referral) return false;

  const user = await ap.getUser();
  if (!user) return false;

  return dp.insert('referral_records', [{
    referrer_id: referral.user_id as string,
    referred_user_id: user.id,
    commission: 10.00,
    status: 'pending',
  }]) !== null;
}