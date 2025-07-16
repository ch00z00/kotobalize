import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import { THEME_CATEGORIES } from '@/constants/categories';

const meta: Meta<typeof CategoryFilter> = {
  title: 'Organisms/CategoryFilter',
  component: CategoryFilter,
  tags: ['autodocs'],
  argTypes: {
    // Propsを直接コントロールするのではなく、インタラクションで確認するため無効化
    categories: { table: { disable: true } },
    selectedCategories: { table: { disable: true } },
    onToggleCategory: { table: { disable: true } },
    onSelectAll: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof CategoryFilter>;

const InteractiveCategoryFilter = () => {
  const [selected, setSelected] = useState<string[]>(['バックエンド']);

  const handleToggle = (category: string) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <CategoryFilter
      categories={THEME_CATEGORIES}
      selectedCategories={selected}
      onToggleCategory={handleToggle}
      onSelectAll={() => setSelected([])}
    />
  );
};

export const Default: Story = {
  render: () => <InteractiveCategoryFilter />,
};
