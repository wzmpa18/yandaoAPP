export interface LangConfig {
  code: string;
  displayZh: string;
  nameNative: string;
  flag: string;
  color: string;
  orderIndex: number;
}

export const LANG_CONFIGS: LangConfig[] = [
  { code: 'ja', displayZh: '日语',      nameNative: '日本語',    flag: '🇯🇵', color: '#C9553D', orderIndex: 1 },
  { code: 'en', displayZh: '英语',      nameNative: 'English',   flag: '🇺🇸', color: '#5B8FA8', orderIndex: 2 },
  { code: 'ko', displayZh: '韩语',      nameNative: '한국어',    flag: '🇰🇷', color: '#C9A574', orderIndex: 3 },
  { code: 'fr', displayZh: '法语',      nameNative: 'Français',  flag: '🇫🇷', color: '#7A9B71', orderIndex: 4 },
  { code: 'es', displayZh: '西班牙语',  nameNative: 'Español',   flag: '🇪🇸', color: '#E05580', orderIndex: 5 },
  { code: 'de', displayZh: '德语',      nameNative: 'Deutsch',   flag: '🇩🇪', color: '#8B6A5A', orderIndex: 6 },
  { code: 'it', displayZh: '意大利语',  nameNative: 'Italiano',  flag: '🇮🇹', color: '#4A7FA5', orderIndex: 7 },
  { code: 'pt', displayZh: '葡萄牙语',  nameNative: 'Português', flag: '🇧🇷', color: '#2D7A4F', orderIndex: 8 },
  { code: 'ar', displayZh: '阿拉伯语',  nameNative: 'العربية',  flag: '🇸🇦', color: '#7B5EA7', orderIndex: 9 },
  { code: 'zh', displayZh: '中文进阶',  nameNative: '普通话进阶', flag: '🇨🇳', color: '#C9553D', orderIndex: 10 },
];

export function getLangConfig(code: string): LangConfig {
  return LANG_CONFIGS.find((l) => l.code === code) ?? LANG_CONFIGS[0];
}

export function getLangDisplayZh(code: string): string {
  return getLangConfig(code).displayZh;
}
