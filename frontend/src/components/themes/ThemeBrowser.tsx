'use client';

import { useState, useMemo } from 'react';
import { Theme } from '@/types/generated/models';
import Button from '@/components/atoms/Button';
import CreateThemeModal from '@/components/themes/CreateThemeModal';
import ThemeCard from '@/components/themes/ThemeCard';
import SearchInput from '@/components/molecules/SearchInput';
import CategoryFilter from '@/components/organisms/CategoryFilter';

interface ThemeBrowserProps {
  initialThemes: Theme[];
}

export default function ThemeBrowser({ initialThemes }: ThemeBrowserProps) {
  // サーバーから渡された初期テーマをstateとして保持
  const [themes, setThemes] = useState<Theme[]>(initialThemes);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('すべて');

  // 新しいテーマが作成されたら、ページ全体を再読み込みする代わりに
  // ローカルのstateに追加して即時反映させる
  const handleThemeCreated = (newTheme: Theme) => {
    setThemes((prevThemes) => [newTheme, ...prevThemes]);
  };

  const categories = useMemo(() => {
    // 初期表示時やテーマが追加された時にカテゴリを動的に生成
    if (themes.length === 0) return ['すべて'];
    const uniqueCategories = new Set(themes.map((theme) => theme.category));
    return ['すべて', ...Array.from(uniqueCategories)];
  }, [themes]);

  const filteredThemes = useMemo(() => {
    return themes.filter((theme) => {
      const matchesCategory =
        selectedCategory === 'すべて' || theme.category === selectedCategory;
      const matchesSearch =
        theme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [themes, searchQuery, selectedCategory]);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">THEMES</h1>
        <Button onClick={() => setIsModalOpen(true)}>新しいテーマを追加</Button>
      </div>

      <div className="mb-8 rounded-lg bg-white p-4 shadow">
        <div className="space-y-4">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="テーマを検索..."
          />
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </div>

      {filteredThemes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredThemes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>
      ) : themes.length > 0 ? (
        <div className="mt-16 text-center text-gray-500">
          <p className="text-lg">該当するテーマが見つかりませんでした。</p>
          <p className="mt-2">検索条件を変更してお試しください。</p>
        </div>
      ) : (
        <div className="mt-16 text-center text-gray-500">
          <p className="text-lg">テーマがまだありません。</p>
          <p className="mt-2">
            右上の「新しいテーマを追加」ボタンから最初のテーマを作成しましょう！
          </p>
        </div>
      )}
      <CreateThemeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onThemeCreated={handleThemeCreated}
      />
    </>
  );
}
