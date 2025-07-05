import React from 'react';

interface CategoryButtonProps {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

export default function CategoryButton({
  children,
  isSelected,
  onClick,
}: CategoryButtonProps) {
  const baseClasses =
    'rounded-full border px-3 py-1 text-sm font-medium transition-colors';

  const selectedClasses = 'border-primary bg-primary/10 text-primary';

  const unselectedClasses =
    'border-gray-300 bg-white text-gray-700 hover:bg-gray-50';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      {children}
    </button>
  );
}
