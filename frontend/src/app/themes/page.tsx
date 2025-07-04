'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getThemesForClient } from '@/lib/api/themes.client';
import { Theme } from '@/types/generated/models';
import ThemeCard from '@/components/themes/ThemeCard';
import CreateThemeModal from '@/components/themes/CreateThemeModal';
import { useAuthStore } from '@/store/auth';

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuthStore();
  // フィルタリングと検索のための新しいstate
  const [searchQuery, setSearchQuery] = useState('');
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

  // フィルターボタン用にユニークなカテゴリを取得する
  const categories = useMemo(() => {
    if (themes.length === 0) return [];
    const uniqueCategories = new Set(themes.map((theme) => theme.category));
    return ['すべて', ...Array.from(uniqueCategories)];
  }, [themes]);

  // 検索クエリと選択されたカテゴリに基づいてテーマをフィルタリングする
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
      <div className="container min-h-[calc(100vh-168px)] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">テーマを選択</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-primary px-4 py-2 font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            新しいテーマを追加
          </button>
        </div>

        {/* 検索とフィルタUI */}
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
                className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
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
