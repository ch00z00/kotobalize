import type { Meta, StoryObj } from '@storybook/react';
import { icons } from 'lucide-react';
import Icon from './Icon';
import { type IconName } from '@/types/icon';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: Object.keys(icons) as IconName[],
    },
    color: { control: 'color' },
    size: { control: { type: 'range', min: 16, max: 80, step: 2 } },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'MessageSquare',
    size: 48,
  },
};

export const Gallery: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Icon name="MessageSquare" />
      <Icon name="Sparkles" color="orange" />
      <Icon name="TrendingUp" size={32} />
      <Icon name="User" strokeWidth={1} />
      <Icon name="Save" className="text-blue-500" />
    </div>
  ),
};
