'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/auth';
import { getWritingById, requestAiReview } from '@/lib/api/writings';
import { Writing } from '@/types/generated/models';

interface WritingDetailClientProps {
  writingId: string;
}

export default function WritingDetailClient({
  writingId,
}: WritingDetailClientProps) {
  const { token } = useAuthStore();
  const [writing, setWriting] = useState<Writing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const fetchWriting = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await getWritingById(writingId, token);
      setWriting(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load writing.');
    } finally {
      setIsLoading(false);
    }
  }, [writingId, token]);

  useEffect(() => {
    fetchWriting();
  }, [fetchWriting]);

  const handleRequestReview = async () => {
    if (!token || !writing) return;

    setIsReviewing(true);
    setError(null);
    try {
      const updatedWriting = await requestAiReview(
        { writingId: writing.id },
        token
      );
      setWriting(updatedWriting);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to request AI review.'
      );
    } finally {
      setIsReviewing(false);
    }
  };

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

  if (!writing) {
    return (
      <div className="container mx-auto p-8 text-center">
        Writing not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">あなたの記録</h1>
        <div className="prose max-w-none rounded-md border border-gray-200 bg-gray-50 p-4">
          <p>{writing.content}</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          AIレビュー結果
        </h2>
        {writing.aiScore != null ? (
          <div className="space-y-6">
            {/* Feedback sections will be rendered here */}
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-gray-600">
              まだAIレビューが実行されていません。
            </p>
            <button
              onClick={handleRequestReview}
              disabled={isReviewing}
              className="rounded-md bg-green-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-green-400"
            >
              {isReviewing ? 'レビュー中...' : 'AIレビューを実行する'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
