import React from 'react';
import CategoryButton from '../molecules/CategoryButton';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((category) => (
        <CategoryButton
          key={category}
          onClick={() => onSelectCategory(category)}
          isSelected={selectedCategory === category}
        >
          {category}
        </CategoryButton>
      ))}
    </div>
  );
}
