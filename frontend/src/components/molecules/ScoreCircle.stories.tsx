import type { Meta, StoryObj } from '@storybook/react';
import ScoreCircle from './ScoreCircle';

const meta: Meta<typeof ScoreCircle> = {
  title: 'Molecules/ScoreCircle',
  component: ScoreCircle,
  tags: ['autodocs'],
  argTypes: {
    score: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof ScoreCircle>;

export const HighScore: Story = {
  args: {
    score: 85,
  },
};

export const MediumScore: Story = {
  args: {
    score: 65,
  },
};

export const LowScore: Story = {
  args: {
    score: 45,
  },
};
