'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { createTheme, NewThemeRequest } from '@/lib/api/themes.client';
import { Theme } from '@/types/generated/models';
import Button from '../atoms/Button';

interface CreateThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeCreated: (newTheme: Theme) => void;
}

export default function CreateThemeModal({
  isOpen,
  onClose,
  onThemeCreated,
}: CreateThemeModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(5);
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
      const themeData: NewThemeRequest = {
        title,
        description,
        category,
        timeLimitInSeconds: timeLimitMinutes * 60,
      };
      const newTheme = await createTheme(themeData, token);
      onThemeCreated(newTheme);
      setTitle('');
      setDescription('');
      setCategory('');
      setTimeLimitMinutes(5);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '予期せぬエラーが発生しました。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
        isOpen ? 'bg-black/50 opacity-100' : 'pointer-events-none opacity-0'
      }`}
      // 背景のオーバーレイをクリックしたときにモーダルを閉じる
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-lg bg-white p-8 shadow-xl transition-all duration-300 ease-in-out ${
          isOpen
            ? 'translate-y-0 scale-100 opacity-100'
            : '-translate-y-4 scale-95 opacity-0'
        }`}
        // モーダル内部のクリックで閉じてしまわないようにする
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          新しいテーマを作成
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                タイトル
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full py-2 px-3 rounded-lg border-2 border-gray-300 bg-gray-100 sm:text-md"
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
                className="mt-1 block w-full py-2 px-3 rounded-lg border-2 border-gray-300 bg-gray-100 sm:text-md"
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
                className="mt-1 block w-full py-2 px-3 rounded-lg border-2 border-gray-300 bg-gray-100 sm:text-md"
                placeholder="例: ステートレス性、統一インターフェースなどの主要な原則を含めて説明してください。"
              />
            </div>
            <div>
              <label
                htmlFor="timeLimit"
                className="block text-sm font-medium text-gray-700"
              >
                制限時間 (分)
              </label>
              <input
                id="timeLimit"
                type="number"
                required
                min="1"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                className="mt-1 block w-full py-2 px-3 rounded-lg border-2 border-gray-300 bg-gray-100 sm:text-md"
                placeholder="例: 5"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end space-x-4">
            <Button type="button" onClick={onClose} variant="outline">
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading} variant="primary">
              {isLoading ? '作成中...' : '作成する'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
