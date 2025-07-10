'use client';

import { useState } from 'react';
import LinkButton from '@/components/atoms/LinkButton';
// import { useAuthStore } from '@/store/auth';
// import { requestAiReview } from '@/lib/api/writings.client';
import { Writing } from '@/types/generated/models';
// import Button from '@/components/atoms/Button';
// import ScoreCircle from '@/components/molecules/ScoreCircle';

// Define the structure of the parsed AI feedback
// interface FeedbackDetail {
//   viewpoint: string;
//   score: number;
//   goodPoint: string;
//   badPoint: string;
// }
// interface ParsedFeedback {
//   totalScore: number;
//   scores: Record<string, number>;
//   feedbacks: FeedbackDetail[];
// }

interface WritingDetailClientProps {
  initialWriting: Writing;
}

export default function WritingDetailClient({
  initialWriting,
}: WritingDetailClientProps) {
  // const { token } = useAuthStore();
  const [writing] = useState<Writing>(initialWriting);
  // const [parsedFeedback, setParsedFeedback] = useState<ParsedFeedback | null>(
  //   null
  // );
  // const [error, setError] = useState<string | null>(null);
  // const [isReviewing, setIsReviewing] = useState(false);

  // useEffect(() => {
  //   if (writing.aiFeedback) {
  //     try {
  //       const feedbackData = JSON.parse(writing.aiFeedback);
  //       setParsedFeedback(feedbackData);
  //     } catch {
  //       setError('AIからのフィードバックの解析に失敗しました。');
  //       setParsedFeedback(null);
  //     }
  //   }
  // }, [writing.aiFeedback]);

  // const handleRequestReview = async () => {
  //   if (!token || !writing) return;

  //   setIsReviewing(true);
  //   setError(null);
  //   try {
  //     const updatedWriting = await requestAiReview(
  //       { writingId: writing.id },
  //       token
  //     );
  //     setWriting(updatedWriting);
  //   } catch (err) {
  //     setError(
  //       err instanceof Error ? err.message : 'Failed to request AI review.'
  //     );
  //   } finally {
  //     setIsReviewing(false);
  //   }
  // };

  return (
    <div className="container h-[calc(100vh-168px)] mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-xl bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">あなたの記録</h1>
          <LinkButton href="/themes" variant="primary">
            テーマ一覧に戻る
          </LinkButton>
        </div>
        <div className="prose max-w-none rounded-lg border bg-gray-50 p-6">
          <p className="text-gray-700">{writing.content}</p>
        </div>
      </div>

      {/*
        TODO: AIレビュー機能
        MVPではリリースしないため、以下のブロックはコメントアウトしています。
        AIレビュー機能を実装する際に、このコメントアウトを解除してください。
      */}
      {/*
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            AIレビュー結果
          </h2>
          {error && <p className="mb-4 text-center text-red-500">{error}</p>}

          {parsedFeedback ? (
            <>
              <div className="mb-12 text-center">
                <h3 className="text-lg font-semibold text-gray-600">
                  言語化力スコア
                </h3>
                <ScoreCircle score={parsedFeedback.totalScore} />
              </div>

              <div className="space-y-6">
                {parsedFeedback.feedbacks.map((fb) => (
                  <div key={fb.viewpoint} className="rounded-lg border p-4">
                    <h4 className="text-xl font-semibold text-gray-800">
                      {fb.viewpoint}
                      <span className="ml-3 text-lg font-bold text-primary">
                        {fb.score}点
                      </span>
                    </h4>
                    <div className="mt-4 space-y-3">
                      <div>
                        <h5 className="font-semibold text-green-600">GOOD</h5>
                        <p className="text-gray-600">{fb.goodPoint}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-red-600">
                          IMPROVEMENT
                        </h5>
                        <p className="text-gray-600">{fb.badPoint}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <p className="mb-4 text-gray-600">
                まだAIレビューが実行されていません。
              </p>
              <Button
                onClick={handleRequestReview}
                disabled={isReviewing}
                variant="primary"
              >
                {isReviewing ? 'レビュー中...' : 'AIレビューを実行する'}
              </Button>
            </div>
          )}
        </div>
      */}
    </div>
  );
}
