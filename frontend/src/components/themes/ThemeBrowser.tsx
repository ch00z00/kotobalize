'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { Theme } from '@/types/generated/api';
import { deleteTheme } from '@/lib/api/themes.client';
import Button from '@/components/atoms/Button';
import CreateThemeModal from '@/components/themes/CreateThemeModal';
import EditThemeModal from '@/components/themes/EditThemeModal';
import ThemeCard from '@/components/themes/ThemeCard';
import SearchInput from '@/components/molecules/SearchInput';
import CategoryFilter from '@/components/organisms/CategoryFilter';
import Banner from '@/components/molecules/Banner';
import { THEME_CATEGORIES } from '@/constants/categories';
import DeleteModal from '../organisms/DeleteModal';

interface ThemeBrowserProps {
  initialThemes: Theme[];
}

export default function ThemeBrowser({ initialThemes }: ThemeBrowserProps) {
  // サーバーから渡された初期テーマをstateとして保持
  const [themes, setThemes] = useState<Theme[]>(initialThemes);
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [deletingThemeId, setDeletingThemeId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // 新しいテーマが作成されたら、ページ全体を再読み込みする代わりに
  // ローカルのstateに追加して即時反映させる
  const handleThemeCreated = (newTheme: Theme) => {
    setThemes((prevThemes) => [newTheme, ...prevThemes]);
    setNotification({
      message: '新しいテーマが作成されました。',
      type: 'success',
    });
  };

  const handleThemeUpdated = (updatedTheme: Theme) => {
    setThemes((prevThemes) =>
      prevThemes.map((theme) =>
        theme.id === updatedTheme.id ? updatedTheme : theme
      )
    );
    setNotification({ message: 'テーマが更新されました。', type: 'success' });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const { token } = useAuthStore();

  const handleEditClick = (theme: Theme) => {
    setEditingTheme(theme);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (themeId: number) => {
    setDeletingThemeId(themeId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingThemeId || !token) return;

    setIsLoading(true);
    try {
      await deleteTheme(deletingThemeId, token);
      setThemes((prev) => prev.filter((theme) => theme.id !== deletingThemeId));
      setNotification({ message: 'テーマを削除しました。', type: 'success' });
    } catch (err) {
      setNotification({
        message:
          err instanceof Error ? err.message : '削除中にエラーが発生しました。',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
      setDeleteModalOpen(false);
      setDeletingThemeId(null);
    }
  };

  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSelectAll = () => {
    setSelectedCategories([]);
  };

  const filteredThemes = useMemo(() => {
    return themes.filter((theme) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(theme.category);
      const matchesSearch =
        theme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [themes, searchQuery, selectedCategories]);

  return (
    <>
      {notification && (
        <Banner
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">THEMES</h1>
        <Button onClick={() => setCreateModalOpen(true)}>
          新しいテーマを追加
        </Button>
      </div>

      <div className="mb-8 rounded-lg bg-white p-4 shadow">
        <div className="space-y-4">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="テーマを検索..."
          />
          <CategoryFilter
            categories={THEME_CATEGORIES}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            onSelectAll={handleSelectAll}
          />
        </div>
      </div>

      {filteredThemes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              onEdit={() => handleEditClick(theme)}
              onDelete={() => handleDeleteClick(theme.id)}
            />
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
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onThemeCreated={handleThemeCreated}
      />
      <EditThemeModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onThemeUpdated={handleThemeUpdated}
        themeToEdit={editingTheme}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="テーマの削除"
        message="このテーマを本当に削除しますか？この操作は元に戻せません。"
        isLoading={isLoading}
      />
    </>
  );
}
