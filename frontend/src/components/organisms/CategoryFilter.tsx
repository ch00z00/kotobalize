import React from 'react';
import CategoryButton from '../molecules/CategoryButton';

interface CategoryFilterProps {
  categories: readonly string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  onSelectAll: () => void;
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  onToggleCategory,
  onSelectAll,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CategoryButton
        onClick={onSelectAll}
        isSelected={selectedCategories.length === 0}
      >
        すべて
      </CategoryButton>
      {categories.map((category) => (
        <CategoryButton
          key={category}
          onClick={() => onToggleCategory(category)}
          isSelected={selectedCategories.includes(category)}
        >
          {category}
        </CategoryButton>
      ))}
    </div>
  );
}
