'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getThemesForClient } from '@/lib/api/themes.client';
import { Theme } from '@/types/generated/models';
import ThemeCard from '@/components/themes/ThemeCard';
import CreateThemeModal from '@/components/themes/CreateThemeModal';
import { useAuthStore } from '@/store/auth';
import Button from '@/components/atoms/Button';

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { token } = useAuthStore();
  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchThemes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!token) {
        setError('テーマの読み込みには認証が必要です。');
        setIsLoading(false);
        return;
      }
      const fetchedThemes = await getThemesForClient(token);
      setThemes(fetchedThemes);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'テーマの読み込みに失敗しました。'
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const handleThemeCreated = () => {
    // 新しく作成されたテーマを表示するために、テーマ一覧を再取得します
    fetchThemes();
  };

  // Filter button用にユニークなカテゴリを取得する
  const categories = useMemo(() => {
    if (themes.length === 0) return [];
    const uniqueCategories = new Set(themes.map((theme) => theme.category));
    return ['すべて', ...Array.from(uniqueCategories)];
  }, [themes]);

  // Search & Filter based on search query and selected category
  const filteredThemes = useMemo(() => {
    return themes.filter((theme) => {
      const matchesCategory =
        !selectedCategory ||
        selectedCategory === 'すべて' ||
        theme.category === selectedCategory;
      const matchesSearch =
        theme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [themes, searchQuery, selectedCategory]);

  return (
    <>
      <div className="container min-h-[calc(100vh-168px)] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-12 lg:py-14">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">THEMES</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            新しいテーマを追加
          </Button>
        </div>

        {/* Search & Filter UI */}
        <div className="mb-8 rounded-lg bg-white p-4 shadow">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label htmlFor="search-theme" className="sr-only">
                テーマを検索
              </label>
              <input
                type="text"
                id="search-theme"
                placeholder="キーワードで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full py-2 px-3 rounded-xl border-2 border-gray-300 bg-gray-100 sm:text-md"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">読み込み中...</p>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : filteredThemes.length > 0 ? (
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
      </div>
      <CreateThemeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onThemeCreated={handleThemeCreated}
      />
    </>
  );
}
