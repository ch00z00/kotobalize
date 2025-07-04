'use client';

import { useState, useEffect, useCallback } from 'react';
import { getThemesForClient } from '@/lib/api/themes';
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

        {isLoading ? (
          <p className="text-center text-gray-500">読み込み中...</p>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : themes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme) => (
              <ThemeCard key={theme.id} theme={theme} />
            ))}
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
