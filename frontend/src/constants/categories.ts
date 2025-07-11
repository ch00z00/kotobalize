export const THEME_CATEGORIES = [
  'フロントエンド',
  'バックエンド',
  'インフラ',
  'データベース',
  'アルゴリズム',
  '設計',
  'キャリア',
  'その他',
] as const;

export type ThemeCategory = (typeof THEME_CATEGORIES)[number];
