export type ThemeKey = 'classic' | 'kawaii' | 'anime' | 'cyber' | 'minimal' | 'dark';

export interface Theme {
  key: ThemeKey;
  label: string;
  emoji: string;
  desc: string;
  previewColors: string[]; // 4 swatch hex values for the picker UI
}

export const THEMES: Theme[] = [
  {
    key: 'classic',
    label: '水墨经典',
    emoji: '🖋',
    desc: '默认东方水墨风',
    previewColors: ['#C9A574', '#7A9B71', '#5B8FA8', '#C9553D'],
  },
  {
    key: 'kawaii',
    label: '萌宠乐园',
    emoji: '🐱',
    desc: '粉嫩可爱，小学生最爱',
    previewColors: ['#E88DC3', '#8DD4A8', '#7DC4E0', '#E05580'],
  },
  {
    key: 'anime',
    label: '二次元疾走',
    emoji: '⚡',
    desc: '高饱和度动漫风',
    previewColors: ['#FF9500', '#36CC8A', '#3B82FF', '#FF3B6B'],
  },
  {
    key: 'cyber',
    label: '赛博朋克',
    emoji: '🤖',
    desc: '深色霓虹科技感',
    previewColors: ['#00FFCC', '#39D353', '#58A6FF', '#FF3B6B'],
  },
  {
    key: 'minimal',
    label: '极简职场',
    emoji: '💼',
    desc: '专业干净，商务白领',
    previewColors: ['#0066CC', '#228833', '#0055AA', '#CC3300'],
  },
  {
    key: 'dark',
    label: '暗夜模式',
    emoji: '🌙',
    desc: '护眼深色，夜间学习',
    previewColors: ['#FFD700', '#6BCB77', '#74B9FF', '#FF6B6B'],
  },
];

const THEME_STORAGE_KEY = 'yandao_theme_v1';

export function getStoredTheme(): ThemeKey {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY) as ThemeKey | null;
    if (v && THEMES.find((t) => t.key === v)) return v;
  } catch { /* */ }
  return 'classic';
}

export function applyTheme(key: ThemeKey) {
  document.documentElement.setAttribute('data-theme', key);
  try { localStorage.setItem(THEME_STORAGE_KEY, key); } catch { /* */ }
}

export function initTheme() {
  applyTheme(getStoredTheme());
}
