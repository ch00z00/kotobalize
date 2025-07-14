'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';

import { useAuthStore } from '@/store/auth';
import { getWritings } from '@/lib/api/writings.client';
import { getThemesForClient } from '@/lib/api/themes.client';
import { Writing, Theme } from '@/types/generated/api';

import StatCard from '@/components/molecules/card/StatCard';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import LinkButton from '../atoms/LinkButton';
import SearchInput from '../molecules/SearchInput';
import CategoryFilter from '../organisms/CategoryFilter';
import ThemeAccordionItem from './ThemeAccordionItem';
import { THEME_CATEGORIES } from '@/constants/categories';

interface GroupedWriting {
  theme: Theme;
  writings: Writing[];
}

export default function DashboardClient() {
  const { token } = useAuthStore();
  const [groupedWritings, setGroupedWritings] = useState<GroupedWriting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openThemeId, setOpenThemeId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [stats, setStats] = useState({
    themeCount: 0,
    writingCount: 0,
    averageScore: 0,
  });

  const handleToggle = (themeId: number) => {
    setOpenThemeId((prevId) => (prevId === themeId ? null : themeId));
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

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      // Fetch both writings and themes concurrently
      const [writingsData, themesData] = await Promise.all([
        getWritings(token),
        getThemesForClient(token),
      ]);

      // Create a map for quick theme lookup
      const themesMap = new Map<number, Theme>();
      themesData.forEach((theme) => themesMap.set(theme.id, theme));

      // Group writings by themeId
      const writingsByTheme = new Map<number, Writing[]>();
      writingsData.forEach((writing) => {
        const themeWritings = writingsByTheme.get(writing.themeId) || [];
        themeWritings.push(writing);
        writingsByTheme.set(writing.themeId, themeWritings);
      });

      // Create the final grouped and sorted array
      const grouped = Array.from(writingsByTheme.entries())
        .map(([themeId, writings]) => ({
          theme: themesMap.get(themeId)!,
          writings: writings,
        }))
        .filter((item) => item.theme)
        .sort((a, b) => b.writings.length - a.writings.length);

      setGroupedWritings(grouped);

      // Calculate stats
      const themeCount = grouped.length;
      const writingCount = writingsData.length;
      const scoredWritings = writingsData.filter((w) => w.aiScore != null);
      const totalScore = scoredWritings.reduce(
        (sum, w) => sum + (w.aiScore ?? 0),
        0
      );
      const averageScore =
        scoredWritings.length > 0
          ? Math.round(totalScore / scoredWritings.length)
          : 0;

      setStats({ themeCount, writingCount, averageScore });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load dashboard data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredGroupedWritings = useMemo(() => {
    return groupedWritings.filter(({ theme }) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(theme.category);
      const matchesSearch = theme.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [groupedWritings, searchQuery, selectedCategories]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-168px)] px-4 sm:px-6 lg:px-8 py-12 sm:py-12 lg:py-14">
      {/* Top Section: Title and Stats */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">DASHBOARD</h1>
        <LinkButton href="/themes">言語化に挑戦する</LinkButton>
      </div>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-6">
        <StatCard label="トライしたテーマ数" value={stats.themeCount} />
        <StatCard label="合計回答数" value={stats.writingCount} />
        {/* <StatCard label="平均スコア" value={stats.averageScore} unit="点" /> */}
      </dl>

      {/* History Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Table Header */}
        <div className="p-6">
          <div className="space-y-4">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="履歴をテーマ名で検索..."
            />
            <CategoryFilter
              categories={THEME_CATEGORIES}
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              onSelectAll={handleSelectAll}
            />
          </div>
        </div>

        {/* Table Body */}
        <div>
          {filteredGroupedWritings.length > 0 ? (
            filteredGroupedWritings.map(({ theme, writings }) => (
              <ThemeAccordionItem
                key={theme.id}
                theme={theme}
                writings={writings}
                isOpen={openThemeId === theme.id}
                onToggle={() => handleToggle(theme.id)}
              />
            ))
          ) : (
            <div className="p-16 text-center text-gray-500">
              <p className="text-lg">
                {groupedWritings.length > 0
                  ? '該当する履歴が見つかりませんでした。'
                  : 'まだ記録がありません。'}
              </p>
              <p className="mt-2">
                {groupedWritings.length > 0
                  ? '検索条件を変更してお試しください。'
                  : '右上の「言語化に挑戦する」ボタンから最初のテーマに挑戦しましょう！'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
