import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SortDropdown from './SortDropdown';
import { ListThemesSortEnum } from '@/types/generated/api';

const meta: Meta<typeof SortDropdown> = {
  title: 'Molecules/SortDropdown',
  component: SortDropdown,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SortDropdown>;

const SortDropdownWithState = () => {
  const [value, setValue] = useState<ListThemesSortEnum>('newest');
  return <SortDropdown value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: () => <SortDropdownWithState />,
};
