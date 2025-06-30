'use client';

import { useState } from 'react';

interface EditorProps {
  themeId: number;
}

// TODO: Move to components directory

export default function Editor({ themeId }: EditorProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Submitting writing:', {
      themeId,
      content,
    });

    // TODO: Implement API call to POST /writings
    // For now, we'll just simulate a network delay.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Submission complete.');
    setIsLoading(false);
    // TODO: Redirect to the review page or dashboard.
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
          className="h-64 w-full rounded-md border border-gray-300 p-4 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isLoading ? '送信中...' : 'AIレビューをリクエスト'}
        </button>
      </div>
    </form>
  );
}
