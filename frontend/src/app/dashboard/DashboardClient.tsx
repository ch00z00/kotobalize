'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { getWritings } from '@/lib/api/writings';
import { Writing } from '@/types/generated/models';

export default function DashboardClient() {
  const { token } = useAuthStore();
  const [writings, setWritings] = useState<Writing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWritings = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await getWritings(token);
      setWritings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load writings.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWritings();
  }, [fetchWritings]);

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
      <div className="space-y-4">
        {writings.length > 0 ? (
          writings.map((writing) => (
            <Link
              key={writing.id}
              href={`/dashboard/writings/${writing.id}`}
              className="block rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <p className="truncate pr-4 text-gray-700">{writing.content}</p>
                {writing.aiScore != null && (
                  <div className="flex flex-shrink-0 items-center space-x-2">
                    <span className="font-bold text-blue-600">
                      {writing.aiScore}
                    </span>
                    <span className="text-sm text-gray-500">点</span>
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-400">
                作成日時: {new Date(writing.createdAt).toLocaleString('ja-JP')}
              </p>
            </Link>
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
