import type { Meta, StoryObj } from '@storybook/react';
import ContributionGraph from './ContributionGraph';
import { type Activity } from 'react-activity-calendar';

const meta: Meta<typeof ContributionGraph> = {
  title: 'Organisms/ContributionGraph',
  component: ContributionGraph,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ContributionGraph>;

const generateRandomData = () => {
  const today = new Date();
  const data: Activity[] = [];
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const count = Math.floor(Math.random() * 8); // 0 to 7 activities
    let level = 0;
    if (count > 0) level = Math.floor(Math.random() * 4) + 1; // 1 to 4

    data.push({
      date: date.toISOString().slice(0, 10),
      count,
      level,
    });
  }
  return data;
};

export const WithData: Story = {
  args: {
    data: generateRandomData(),
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
};

export const Loading: Story = {
  render: () => (
    <div className="h-[160px] w-full animate-pulse rounded-md bg-gray-200" />
  ),
  name: 'Loading State (handled by parent)',
};
