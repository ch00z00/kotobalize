import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'キーワードで検索...',
}: SearchInputProps) {
  return (
    <div>
      <label htmlFor="search-input" className="sr-only">
        検索
      </label>
      <input
        type="text"
        id="search-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="block w-full py-2 px-3 rounded-xl border-2 border-gray-300 bg-gray-100 sm:text-md"
      />
    </div>
  );
}
