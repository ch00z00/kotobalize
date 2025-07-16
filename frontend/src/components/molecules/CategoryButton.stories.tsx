import type { Meta, StoryObj } from '@storybook/nextjs';
import CategoryButton from './CategoryButton';

const meta: Meta<typeof CategoryButton> = {
  title: 'Molecules/CategoryButton',
  component: CategoryButton,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    isSelected: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof CategoryButton>;

export const Selected: Story = {
  args: {
    children: 'バックエンド',
    isSelected: true,
  },
};

export const Unselected: Story = {
  args: {
    children: 'フロントエンド',
    isSelected: false,
  },
};
