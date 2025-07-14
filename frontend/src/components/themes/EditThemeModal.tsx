'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { updateTheme } from '@/lib/api/themes.client';
import { Theme, UpdateThemeRequest } from '@/types/generated/api';
import Button from '../atoms/Button';
import { THEME_CATEGORIES } from '@/constants/categories';
import Modal from '../common/Modal';

interface EditThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeUpdated: (updatedTheme: Theme) => void;
  themeToEdit: Theme | null;
}

export default function EditThemeModal({
  isOpen,
  onClose,
  onThemeUpdated,
  themeToEdit,
}: EditThemeModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(THEME_CATEGORIES[0]);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    if (themeToEdit) {
      setTitle(themeToEdit.title);
      setDescription(themeToEdit.description);
      setCategory(themeToEdit.category);
      // timeLimitInSeconds might be undefined for older themes.
      // Provide a fallback to prevent NaN errors.
      const minutes = themeToEdit.timeLimitInSeconds
        ? themeToEdit.timeLimitInSeconds / 60
        : 5; // Default to 5 minutes if not set
      setTimeLimitMinutes(minutes);
    }
  }, [themeToEdit]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !themeToEdit) {
      setError('認証エラーまたは編集対象のテーマが見つかりません。');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const themeData: UpdateThemeRequest = {
        title,
        description,
        category,
        timeLimitInSeconds: timeLimitMinutes * 60,
      };
      const updatedTheme = await updateTheme(themeToEdit.id, themeData, token);
      onThemeUpdated(updatedTheme);
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[600px] max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">テーマを編集</h2>
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
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                カテゴリ
              </label>
              <select
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full appearance-none rounded-lg border-2 border-gray-300 bg-gray-100 py-2 px-3 sm:text-md"
              >
                {THEME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end space-x-4">
            <Button type="button" onClick={onClose} variant="outline">
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading} variant="primary">
              {isLoading ? '更新中...' : '更新する'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
