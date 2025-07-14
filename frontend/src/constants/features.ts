import { type IconName } from '@/types/icon';

export interface Feature {
  name: string;
  description: string;
  iconName: IconName;
  comingSoon?: boolean;
}

export const FEATURES: Feature[] = [
  {
    name: '豊富なテーマ',
    description:
      '基本的な技術用語から、システム設計、アルゴリズムまで。幅広いテーマであなたの知識と言語化能力を試せます。',
    iconName: 'MessageSquare',
  },
  {
    name: 'AIの即時レビュー',
    description:
      'あなたの説明をAIが多角的に分析。スコアと具体的なフィードバックで、改善点がすぐに分かります。',
    iconName: 'Sparkles',
    comingSoon: true,
  },
  {
    name: '進捗の可視化',
    description:
      'ダッシュボードであなたの成長を一目で確認。平均スコアや挑戦したテーマ数で、モチベーションを維持できます。',
    iconName: 'TrendingUp',
  },
];
