'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { createTheme, NewThemeRequest } from '@/lib/api/themes';

interface CreateThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeCreated: () => void;
}

export default function CreateThemeModal({
  isOpen,
  onClose,
  onThemeCreated,
}: CreateThemeModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setError('認証が必要です。再度ログインしてください。');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const themeData: NewThemeRequest = { title, description, category };
      await createTheme(themeData, token);
      onThemeCreated();
      setTitle('');
      setDescription('');
      setCategory('');
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '予期せぬエラーが発生しました。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          新しいテーマを作成
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              テーマタイトル
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              placeholder="例: RESTful APIの設計原則"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              カテゴリ
            </label>
            <input
              id="category"
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              placeholder="例: バックエンド"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              説明
            </label>
            <textarea
              id="description"
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              placeholder="例: ステートレス性、統一インターフェースなどの主要な原則を含めて説明してください。"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-primary/70"
            >
              {isLoading ? '作成中...' : '作成する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
