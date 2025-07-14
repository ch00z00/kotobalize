'use client';

import { ChevronsUpDown } from 'lucide-react';
import { ListThemesSortEnum } from '@/types/generated/api';

interface SortDropdownProps {
  value: ListThemesSortEnum;
  onChange: (value: ListThemesSortEnum) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-by" className="text-sm font-medium text-gray-600">
        並び替え:
      </label>
      <div className="relative">
        <select
          id="sort-by"
          value={value}
          onChange={(e) => onChange(e.target.value as ListThemesSortEnum)}
          className="block w-full appearance-none rounded-md border-2 border-gray-200 bg-white py-1.5 pl-3 pr-10 text-sm font-medium text-gray-700 transition hover:border-gray-300"
        >
          <option value="newest">新着順</option>
          <option value="popular">人気順</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronsUpDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
