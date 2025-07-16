import type { Meta, StoryObj } from '@storybook/nextjs';
import { icons } from 'lucide-react';
import { type IconName } from '@/types/icon';
import FeatureCard from './FeatureCard';

const meta: Meta<typeof FeatureCard> = {
  title: 'Molecules/Card/FeatureCard',
  component: FeatureCard,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    description: { control: 'text' },
    iconName: {
      control: { type: 'select' },
      options: Object.keys(icons) as IconName[],
    },
    comingSoon: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof FeatureCard>;

export const Default: Story = {
  args: {
    name: '豊富なテーマ',
    description:
      '基本的な技術用語から、システム設計、アルゴリズムまで。幅広いテーマであなたの知識と言語化能力を試せます。',
    iconName: 'MessageSquare',
    comingSoon: false,
  },
};

export const ComingSoon: Story = {
  args: {
    name: 'AIの即時レビュー',
    description:
      'あなたの説明をAIが多角的に分析。スコアと具体的なフィードバックで、改善点がすぐに分かります。',
    iconName: 'Sparkles',
    comingSoon: true,
  },
};
