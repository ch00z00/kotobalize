'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { createWriting } from '@/lib/api/writings.client';
import Button from '../atoms/Button';

interface EditorProps {
  themeId: number;
}

export default function Editor({ themeId }: EditorProps) {
  const router = useRouter();
  const { token } = useAuthStore();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!token) {
      setError('Authentication error. Please log in again.');
      setIsLoading(false);
      return;
    }

    try {
      // 記述内容を記録として保存する
      const newWriting = await createWriting(
        {
          themeId: themeId,
          content: content,
          durationSeconds: 0, // Placeholder for now
        },
        token
      );
      // Redirect to the new writing's detail page with a success indicator
      router.push(`/dashboard/writings/${newWriting.id}?created=true`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          あなたの説明を記述してください
        </h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="ここに説明を入力..."
          className="h-64 w-full rounded-md border border-gray-300 p-4 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
          required
        />
        <div className="mt-2 text-right text-sm text-gray-500">
          {content.length} 文字
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isLoading ? '保存中...' : 'この内容で記録する'}
        </Button>
      </div>
    </form>
  );
}
