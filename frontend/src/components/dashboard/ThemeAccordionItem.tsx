// src/components/dashboard/ThemeAccordionItem.tsx (新規作成)
import React, { memo } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Writing, Theme } from '@/types/generated/api';
import LinkButton from '../atoms/LinkButton';
import Tag from '../atoms/Tag';

interface ThemeAccordionItemProps {
  theme: Theme;
  writings: Writing[];
  isOpen: boolean;
  onToggle: () => void;
}

// React.memoでコンポーネントをラップ
const ThemeAccordionItem = memo(function ThemeAccordionItem({
  theme,
  writings,
  isOpen,
  onToggle,
}: ThemeAccordionItemProps) {
  return (
    <div className="border-t border-gray-200">
      <button
        onClick={onToggle}
        className="flex w-full flex-col p-6 text-left transition-colors hover:bg-gray-50 focus:outline-none sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="w-full flex-1">
          <div className="flex flex-col items-start gap-y-2 sm:flex-row sm:items-center sm:gap-x-3">
            <h2 className="text-xl font-semibold text-gray-800">
              {theme.title}
            </h2>
            <Tag className="flex-shrink-0">{theme.category}</Tag>
          </div>
          <div className="mt-2 text-sm text-gray-500 sm:mt-1">
            回答回数: {writings.length}回
          </div>
        </div>
        <div className="mt-4 flex w-full items-center justify-end space-x-4 sm:mt-0 sm:w-auto sm:flex-shrink-0 sm:space-x-8">
          <LinkButton
            href={`/themes/${theme.id}/write`}
            variant="outline"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            リトライする
          </LinkButton>
          <ChevronDown
            className={`h-6 w-6 transform text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[500px]' : 'max-h-0'
        }`}
      >
        <div className="bg-gray-50/50 px-6 py-4">
          <div className="space-y-2">
            {writings.map((writing) => (
              <Link
                key={writing.id}
                href={`/dashboard/writings/${writing.id}`}
                className="block rounded-md border border-gray-200 bg-white p-3 transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="flex-1 truncate text-sm text-gray-800">
                    {writing.content}
                  </p>
                  <p className="flex-shrink-0 font-mono text-xs text-gray-500">
                    {new Date(writing.createdAt).toLocaleString('ja-JP', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ThemeAccordionItem;
