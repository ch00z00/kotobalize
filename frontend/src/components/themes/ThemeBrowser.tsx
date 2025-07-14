'use client';

import { useState, useMemo, useEffect, Fragment } from 'react';
import { useAuthStore } from '@/store/auth';
import { ListThemesSortEnum, Theme } from '@/types/generated/api';
import {
  deleteTheme,
  favoriteTheme,
  listThemes,
  unfavoriteTheme,
} from '@/lib/api/themes.client';
import Button from '@/components/atoms/Button';
import CreateThemeModal from '@/components/themes/CreateThemeModal';
import EditThemeModal from '@/components/themes/EditThemeModal';
import ThemeCard from '@/components/themes/ThemeCard';
import SearchInput from '@/components/molecules/SearchInput';
import CategoryFilter from '@/components/organisms/CategoryFilter';
import Banner from '@/components/molecules/Banner';
import { THEME_CATEGORIES } from '@/constants/categories';
import SortDropdown from '@/components/molecules/SortDropdown';
import DeleteModal from '../organisms/DeleteModal';

interface ThemeBrowserProps {
  initialThemes: Theme[];
}

type Tab = 'official' | 'my' | 'favorites';

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
  const [activeTab, setActiveTab] = useState<Tab>('official');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<ListThemesSortEnum>('newest');
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const { token } = useAuthStore();

  useEffect(() => {
    const fetchThemes = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const fetchedThemes = await listThemes(token, sortBy);
        setThemes(fetchedThemes);
      } catch (err) {
        setNotification({
          message:
            err instanceof Error ? err.message : 'テーマの取得に失敗しました。',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchThemes();
  }, [sortBy, token]);

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

  const handleToggleFavorite = async (
    themeId: number,
    isFavorited: boolean
  ) => {
    if (!token) {
      setNotification({ message: 'ログインしてください。', type: 'error' });
      return;
    }

    // Optimistic UI update for instant feedback
    setThemes((prevThemes) =>
      prevThemes.map((t) =>
        t.id === themeId ? { ...t, isFavorited: !t.isFavorited } : t
      )
    );

    try {
      if (isFavorited) {
        await unfavoriteTheme(themeId, token);
      } else {
        await favoriteTheme(themeId, token);
      }
    } catch (err) {
      // Revert on error
      setThemes((prevThemes) =>
        prevThemes.map((t) =>
          t.id === themeId ? { ...t, isFavorited: !t.isFavorited } : t
        )
      );
      setNotification({
        message:
          err instanceof Error
            ? err.message
            : 'お気に入りの更新に失敗しました。',
        type: 'error',
      });
    }
  };

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

  // Divide themes into official and my themes
  const { officialThemes, myThemes, favoritedThemes } = useMemo(() => {
    const official: Theme[] = [];
    const my: Theme[] = [];
    const favorited: Theme[] = [];
    filteredThemes.forEach((theme) => {
      if (theme.isFavorited) {
        favorited.push(theme);
      }
      if (theme.creatorId) {
        my.push(theme);
      } else {
        official.push(theme);
      }
    });
    return {
      officialThemes: official,
      myThemes: my,
      favoritedThemes: favorited,
    };
  }, [filteredThemes]);

  // フィルタリング前のマイテーマの総数を計算
  const totalMyThemesCount = useMemo(
    () => themes.filter((theme) => !!theme.creatorId).length,
    [themes]
  );
  const totalFavoritedThemesCount = useMemo(
    () => themes.filter((theme) => theme.isFavorited).length,
    [themes]
  );

  const EmptyState = ({
    title,
    message,
  }: {
    title: string;
    message: string;
  }) => (
    <div className="mt-16 text-center text-gray-500">
      <p className="text-lg font-semibold">{title}</p>
      <p className="mt-2">{message}</p>
    </div>
  );

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
          マイテーマを追加
        </Button>
      </div>

      <div className="mb-8 rounded-lg bg-white p-4 shadow">
        <div className="space-y-4">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="テーマを検索..."
          />
          <div className="flex items-center justify-between">
            <CategoryFilter
              categories={THEME_CATEGORIES}
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              onSelectAll={handleSelectAll}
            />
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <EmptyState title="読み込み中..." message="テーマを取得しています。" />
      ) : themes.length > 0 ? (
        <>
          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('official')}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-md font-semibold duration-150 ease-in-out transition-colors ${
                  activeTab === 'official'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300'
                }`}
              >
                公式テーマ
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-md font-semibold duration-150 ease-in-out transition-colors ${
                  activeTab === 'my'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300'
                }`}
              >
                マイテーマ
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-md font-semibold duration-150 ease-in-out transition-colors ${
                  activeTab === 'favorites'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300'
                }`}
              >
                お気に入り
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'official' &&
              (officialThemes.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {officialThemes.map((theme) => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      onToggleFavorite={() =>
                        handleToggleFavorite(theme.id, !!theme.isFavorited)
                      }
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="該当する公式テーマがありません"
                  message="検索条件を変更するか、フィルターをクリアしてください。"
                />
              ))}
            {activeTab === 'my' &&
              (myThemes.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {myThemes.map((theme) => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      onEdit={() => handleEditClick(theme)}
                      onDelete={() => handleDeleteClick(theme.id)}
                      onToggleFavorite={() =>
                        handleToggleFavorite(theme.id, !!theme.isFavorited)
                      }
                    />
                  ))}
                </div>
              ) : totalMyThemesCount > 0 ? (
                <EmptyState
                  title="該当するマイテーマがありません"
                  message="検索条件を変更するか、フィルターをクリアしてください。"
                />
              ) : (
                <EmptyState
                  title="マイテーマはまだありません"
                  message="右上の「マイテーマを追加」ボタンから自作のテーマを作成しましょう！"
                />
              ))}
            {activeTab === 'favorites' &&
              (favoritedThemes.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {favoritedThemes.map((theme) => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      onEdit={
                        theme.creatorId
                          ? () => handleEditClick(theme)
                          : undefined
                      }
                      onDelete={
                        theme.creatorId
                          ? () => handleDeleteClick(theme.id)
                          : undefined
                      }
                      onToggleFavorite={() =>
                        handleToggleFavorite(theme.id, !!theme.isFavorited)
                      }
                    />
                  ))}
                </div>
              ) : totalFavoritedThemesCount > 0 ? (
                <EmptyState
                  title="該当するお気に入りテーマがありません"
                  message="検索条件を変更するか、フィルターをクリアしてください。"
                />
              ) : (
                <EmptyState
                  title="お気に入りのテーマはありません"
                  message="テーマカードの星マークを押してお気に入りに追加しましょう。"
                />
              ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="テーマがまだありません"
          message="右上の「新しいテーマを追加」ボタンから最初のテーマを作成しましょう！"
        />
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
        message={'このテーマを本当に削除しますか？\nこの操作は元に戻せません。'}
        isLoading={isLoading}
      />
    </>
  );
}
