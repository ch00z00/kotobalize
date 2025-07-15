import type { Meta, StoryObj } from '@storybook/react';
import StatCard from './StatCard';

const meta: Meta<typeof StatCard> = {
  title: 'Molecules/Card/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    unit: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    label: '挑戦したテーマ数',
    value: 28,
  },
};

export const WithUnit: Story = {
  args: {
    label: '平均スコア',
    value: 82,
    unit: '点',
  },
};
