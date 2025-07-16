import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import SearchInput from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Molecules/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

const SearchInputWithState = () => {
  const [value, setValue] = useState('');
  return (
    <SearchInput value={value} onChange={(e) => setValue(e.target.value)} />
  );
};

export const Default: Story = {
  render: () => <SearchInputWithState />,
  args: {
    placeholder: 'テーマを検索...',
  },
};
