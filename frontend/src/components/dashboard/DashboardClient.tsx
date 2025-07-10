'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';

import { useAuthStore } from '@/store/auth';
import { getWritings } from '@/lib/api/writings.client';
import { getThemesForClient } from '@/lib/api/themes.client';
import { Writing, Theme } from '@/types/generated/models';

import StatCard from '@/components/molecules/card/StatCard';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import LinkButton from '../atoms/LinkButton';
import SearchInput from '../molecules/SearchInput';
import CategoryFilter from '../organisms/CategoryFilter';
import Tag from '../atoms/Tag';

interface GroupedWriting {
  theme: Theme;
  writings: Writing[];
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-6 w-6 transform text-gray-500 transition-transform duration-200 ${
        open ? 'rotate-180' : ''
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

export default function DashboardClient() {
  const { token } = useAuthStore();
  const [groupedWritings, setGroupedWritings] = useState<GroupedWriting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openThemeId, setOpenThemeId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [stats, setStats] = useState({
    themeCount: 0,
    writingCount: 0,
    averageScore: 0,
  });

  const handleToggle = (themeId: number) => {
    setOpenThemeId((prevId) => (prevId === themeId ? null : themeId));
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

  const categories = useMemo(() => {
    if (groupedWritings.length === 0) return ['すべて'];
    const uniqueCategories = new Set(
      groupedWritings.map(({ theme }) => theme.category)
    );
    return ['すべて', ...Array.from(uniqueCategories)];
  }, [groupedWritings]);

  const filteredGroupedWritings = useMemo(() => {
    return groupedWritings.filter(({ theme }) => {
      const matchesCategory =
        selectedCategory === 'すべて' || theme.category === selectedCategory;
      const matchesSearch = theme.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [groupedWritings, searchQuery, selectedCategory]);

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
        <LinkButton href="/themes">新しい言語化に挑戦する</LinkButton>
      </div>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <StatCard label="トライしたテーマ数" value={stats.themeCount} />
        <StatCard label="合計回答数" value={stats.writingCount} />
        <StatCard label="平均スコア" value={stats.averageScore} unit="点" />
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
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>

        {/* Table Body */}
        <div>
          {filteredGroupedWritings.length > 0 ? (
            filteredGroupedWritings.map(({ theme, writings }, index) => (
              <div
                key={theme.id}
                className={`${index > 0 ? 'border-t border-gray-200' : ''}`}
              >
                <button
                  onClick={() => handleToggle(theme.id)}
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
                      href={`/themes/${theme.id}`}
                      variant="outline"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                      }}
                    >
                      リトライする
                    </LinkButton>
                    <ChevronIcon open={openThemeId === theme.id} />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openThemeId === theme.id ? 'max-h-[500px]' : 'max-h-0'
                  }`}
                >
                  <div className="bg-gray-50/50 px-6 py-4">
                    <div className="space-y-2">
                      {writings.map((writing) => (
                        <Link
                          key={writing.id}
                          href={`/dashboard/writings/${writing.id}`}
                          className="block rounded-md p-3 transition-colors hover:bg-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <p className="truncate pr-4 text-sm text-gray-700">
                              {writing.content}
                            </p>
                            {writing.aiScore != null && (
                              <div className="flex flex-shrink-0 items-center space-x-2">
                                <span className="font-bold text-blue-600">
                                  {writing.aiScore}
                                </span>
                                <span className="text-sm text-gray-500">
                                  点
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-gray-400">
                            作成日時:{' '}
                            {new Date(writing.createdAt).toLocaleString(
                              'ja-JP'
                            )}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
                  : '右上の「新しい言語化に挑戦する」ボタンから最初のテーマに挑戦しましょう！'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
