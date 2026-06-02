import { supabase } from './supabase';

export type FeatureType =
  | 'exam'
  | 'ai_speech'
  | 'partner_slot'
  | 'langpack'
  | 'vip_ad_free';

export interface AccessResult {
  granted: boolean;
  reason: string;
  /** Human-readable block reason shown in paywall */
  blockReason?: string;
  /** Which plan/product to upsell */
  upsellPlan?: UpsellPlan;
  /** Credits remaining (for metered features) */
  creditsLeft?: number;
}

export interface UpsellPlan {
  planKey: string;
  label: string;
  priceLabel: string;
  description: string;
  /** Extra payload (e.g. lang code for langpack) */
  meta?: Record<string, string>;
}

interface ProfilePaymentFields {
  vip_expiry: string | null;
  exam_credits: number;
  exam_credits_reset_at: string;
  ai_speech_credits: number;
  ai_speech_credits_reset_at: string;
  extra_partner_count: number;
  unlocked_lang_packs: string[];
}

async function getProfile(sessionKey: string): Promise<ProfilePaymentFields | null> {
  const { data } = await supabase
    .from('user_profiles')
    .select('vip_expiry,exam_credits,exam_credits_reset_at,ai_speech_credits,ai_speech_credits_reset_at,extra_partner_count,unlocked_lang_packs')
    .eq('session_key', sessionKey)
    .maybeSingle();
  return data as ProfilePaymentFields | null;
}

function isVip(profile: ProfilePaymentFields): boolean {
  if (!profile.vip_expiry) return false;
  return new Date(profile.vip_expiry) > new Date();
}

async function getConfig(key: string, fallback: number): Promise<number> {
  const { data } = await supabase
    .from('platform_configs')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  return data ? parseInt(data.value) || fallback : fallback;
}

/** Count active partner matches for this session */
async function getPartnerCount(sessionKey: string): Promise<number> {
  const { count } = await supabase
    .from('partner_matches')
    .select('*', { count: 'exact', head: true })
    .or(`requester_key.eq.${sessionKey},receiver_key.eq.${sessionKey}`)
    .eq('status', 'accepted');
  return count ?? 0;
}

/** Reset monthly exam credits if a new month has started */
async function maybeResetExamCredits(sessionKey: string, profile: ProfilePaymentFields): Promise<ProfilePaymentFields> {
  const resetAt = new Date(profile.exam_credits_reset_at);
  const now = new Date();
  const monthChanged = now.getFullYear() !== resetAt.getFullYear() || now.getMonth() !== resetAt.getMonth();
  if (!monthChanged) return profile;
  const freePerMonth = await getConfig('exam_free_per_month', 2);
  await supabase.from('user_profiles').update({
    exam_credits: freePerMonth,
    exam_credits_reset_at: now.toISOString(),
  }).eq('session_key', sessionKey);
  return { ...profile, exam_credits: freePerMonth, exam_credits_reset_at: now.toISOString() };
}

/** Reset daily AI speech credits if a new day has started */
async function maybeResetAiSpeechCredits(sessionKey: string, profile: ProfilePaymentFields): Promise<ProfilePaymentFields> {
  const resetAt = new Date(profile.ai_speech_credits_reset_at);
  const now = new Date();
  const dayChanged =
    now.getFullYear() !== resetAt.getFullYear() ||
    now.getMonth() !== resetAt.getMonth() ||
    now.getDate() !== resetAt.getDate();
  if (!dayChanged) return profile;
  const freePerDay = await getConfig('ai_speech_free_per_day', 3);
  await supabase.from('user_profiles').update({
    ai_speech_credits: freePerDay,
    ai_speech_credits_reset_at: now.toISOString(),
  }).eq('session_key', sessionKey);
  return { ...profile, ai_speech_credits: freePerDay, ai_speech_credits_reset_at: now.toISOString() };
}

/**
 * Main feature gate.
 * Call this before rendering any paid feature.
 * If granted=false, show PaywallModal with the returned upsellPlan.
 */
export async function canAccessFeature(
  sessionKey: string,
  featureType: FeatureType,
  meta?: Record<string, string>,
): Promise<AccessResult> {
  const profile = await getProfile(sessionKey);
  if (!profile) {
    return { granted: false, reason: 'no_profile', blockReason: '请先完成初始设置', upsellPlan: undefined };
  }

  const vip = isVip(profile);

  switch (featureType) {
    case 'vip_ad_free': {
      if (vip) return { granted: true, reason: 'vip' };
      return {
        granted: false,
        reason: 'not_vip',
        blockReason: '此功能需要会员资格',
        upsellPlan: {
          planKey: 'vip_monthly',
          label: '会员月卡',
          priceLabel: '$3.9/月',
          description: '免广告 · 无限考试 · 不限搭子 · 高级题库8折',
        },
      };
    }

    case 'exam': {
      if (vip) return { granted: true, reason: 'vip_unlimited', creditsLeft: 999 };
      let p = await maybeResetExamCredits(sessionKey, profile);
      if (p.exam_credits > 0) {
        return { granted: true, reason: 'free_credits', creditsLeft: p.exam_credits };
      }
      return {
        granted: false,
        reason: 'no_exam_credits',
        blockReason: '本月免费考试次数已用完',
        creditsLeft: 0,
        upsellPlan: {
          planKey: 'exam_single',
          label: '单次考试',
          priceLabel: '$0.99/次',
          description: '购买单次模拟考试，或升级会员享无限次',
        },
      };
    }

    case 'ai_speech': {
      if (vip) return { granted: true, reason: 'vip_unlimited', creditsLeft: 999 };
      let p = await maybeResetAiSpeechCredits(sessionKey, profile);
      if (p.ai_speech_credits > 0) {
        return { granted: true, reason: 'free_credits', creditsLeft: p.ai_speech_credits };
      }
      return {
        granted: false,
        reason: 'no_ai_speech_credits',
        blockReason: '今日免费AI口语次数已用完',
        creditsLeft: 0,
        upsellPlan: {
          planKey: 'ai_speech',
          label: 'AI口语单次',
          priceLabel: '$0.2/次',
          description: '购买单次AI深度评测，或升级会员享无限次',
        },
      };
    }

    case 'partner_slot': {
      if (vip) return { granted: true, reason: 'vip_unlimited' };
      const freeSlots = await getConfig('free_partner_slots', 2);
      const currentCount = await getPartnerCount(sessionKey);
      const maxSlots = freeSlots + profile.extra_partner_count;
      if (currentCount < maxSlots) {
        return { granted: true, reason: 'within_quota', creditsLeft: maxSlots - currentCount };
      }
      return {
        granted: false,
        reason: 'partner_slot_full',
        blockReason: `最多 ${maxSlots} 个搭子（免费 ${freeSlots} 个）`,
        upsellPlan: {
          planKey: 'partner_slot',
          label: '增加搭子槽位',
          priceLabel: '$0.49/个',
          description: '永久增加1个搭子名额，或升级会员享无限制',
        },
      };
    }

    case 'langpack': {
      const lang = meta?.lang ?? '';
      const unlocked = profile.unlocked_lang_packs ?? [];
      if (vip) {
        // VIP gets 20% discount, not free — still needs purchase but gated separately
        if (unlocked.includes(lang)) return { granted: true, reason: 'purchased' };
      }
      if (unlocked.includes(lang)) return { granted: true, reason: 'purchased' };
      const discountNote = vip ? '（会员8折优惠）' : '';
      return {
        granted: false,
        reason: 'langpack_not_purchased',
        blockReason: `${lang.toUpperCase()} 高级题库未解锁`,
        upsellPlan: {
          planKey: 'langpack',
          label: `${lang.toUpperCase()} 高级题库${discountNote}`,
          priceLabel: vip ? '$1.52/永久' : '$1.9/永久',
          description: '永久解锁该语言所有高级题目和章节',
          meta: { lang },
        },
      };
    }

    default:
      return { granted: true, reason: 'unknown_feature' };
  }
}

/** Consume one credit after access is granted (exam / ai_speech) */
export async function consumeCredit(sessionKey: string, featureType: 'exam' | 'ai_speech'): Promise<void> {
  const col = featureType === 'exam' ? 'exam_credits' : 'ai_speech_credits';
  const profile = await getProfile(sessionKey);
  if (!profile) return;
  const current = featureType === 'exam' ? profile.exam_credits : profile.ai_speech_credits;
  if (current <= 0) return;
  await supabase.from('user_profiles').update({ [col]: current - 1 }).eq('session_key', sessionKey);
}
