'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { getWritings } from '@/lib/api/writings';
import { getThemesForClient } from '@/lib/api/themes';
import { Writing, Theme } from '@/types/generated/models';
import StatCard from './StatCard';

// A new interface for our grouped and sorted data structure
interface GroupedWriting {
  theme: Theme;
  writings: Writing[];
}

// A simple chevron icon component for the accordion
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
  const [openThemeId, setOpenThemeId] = useState<number | null>(null); // State for the accordion
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
        getThemesForClient(),
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
          theme: themesMap.get(themeId)!, // Assume theme exists
          writings: writings,
        }))
        .filter((item) => item.theme) // Filter out any cases where theme might be missing
        .sort((a, b) => b.writings.length - a.writings.length); // Sort by number of writings

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

  if (isLoading) {
    return <div className="container mx-auto p-8 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">ダッシュボード</h1>

      {/* Stats Section */}
      <dl className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="トライしたテーマ数" value={stats.themeCount} />
        <StatCard label="合計回答数" value={stats.writingCount} />
        <StatCard label="平均スコア" value={stats.averageScore} unit="点" />
      </dl>

      <div className="space-y-6">
        {groupedWritings.length > 0 ? (
          groupedWritings.map(({ theme, writings }) => (
            <div
              key={theme.id}
              className="overflow-hidden rounded-lg bg-white shadow-md"
            >
              <button
                onClick={() => handleToggle(theme.id)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50 focus:outline-none"
              >
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {theme.title}
                  </h2>
                  <div className="mt-1 text-sm text-gray-500">
                    回答回数: {writings.length}回
                  </div>
                </div>
                <ChevronIcon open={openThemeId === theme.id} />
              </button>
              {openThemeId === theme.id && (
                <div className="border-t border-gray-200 bg-gray-50/50 px-6 py-4">
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
                              <span className="text-sm text-gray-500">点</span>
                            </div>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-400">
                          作成日時:{' '}
                          {new Date(writing.createdAt).toLocaleString('ja-JP')}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            <p>まだ記録がありません。</p>
            <Link
              href="/themes"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              最初のテーマに挑戦する
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
