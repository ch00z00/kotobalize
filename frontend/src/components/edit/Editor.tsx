'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { createWriting } from '@/lib/api/writings.client';
import Button from '../atoms/Button';

interface EditorProps {
  themeId: number;
  // NOTE: This should be passed from the theme data.
  // A default value is used here for demonstration.
  timeLimitInSeconds: number;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSecs).padStart(
    2,
    '0'
  )}`;
};

export default function Editor({
  themeId,
  timeLimitInSeconds = 300,
}: EditorProps) {
  const router = useRouter();
  const { token } = useAuthStore();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timerState, setTimerState] = useState<
    'idle' | 'running' | 'paused' | 'finished'
  >('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

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
          durationSeconds: elapsedSeconds,
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

  // Timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (timerState === 'running') {
      intervalId = setInterval(() => {
        setElapsedSeconds((prev) => {
          const newElapsed = prev + 1;
          if (newElapsed >= timeLimitInSeconds) {
            setTimerState('finished');
            return timeLimitInSeconds;
          }
          return newElapsed;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerState, timeLimitInSeconds]);

  const remainingSeconds = timeLimitInSeconds - elapsedSeconds;

  const handleStart = () => setTimerState('running');
  const handlePause = () => setTimerState('paused');
  const handleResume = () => setTimerState('running');
  const handleReset = () => {
    setTimerState('idle');
    setElapsedSeconds(0);
  };

  const renderTimerControls = () => {
    switch (timerState) {
      case 'running':
        return (
          <Button onClick={handlePause} variant="secondary">
            一時停止
          </Button>
        );
      case 'paused':
        return (
          <div className="flex items-center space-x-2">
            <Button onClick={handleResume} variant="primary">
              再開
            </Button>
            <Button onClick={handleReset} variant="outline">
              リセット
            </Button>
          </div>
        );
      case 'finished':
        return (
          <Button onClick={handleReset} variant="outline">
            リセット
          </Button>
        );
      default: // idle
        return (
          <Button onClick={handleStart} variant="primary">
            開始
          </Button>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6">
        {/* Editor Pane */}
        <div className="flex flex-col rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              Let&apos;s kotobalize!
            </h2>
            <div className="flex items-center space-x-4">
              <span
                className={`text-2xl font-mono font-semibold ${
                  remainingSeconds < 60 && remainingSeconds > 0
                    ? 'text-red-500'
                    : 'text-gray-700'
                }`}
              >
                {formatTime(remainingSeconds)}
              </span>
              {renderTimerControls()}
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="ここに説明を入力..."
            className="h-96 w-full flex-grow rounded-md border border-gray-300 p-4 font-mono text-sm text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            disabled={timerState === 'idle' || timerState === 'finished'}
          />
          <div className="mt-2 flex items-center justify-end text-sm text-gray-500">
            <span>{content.length} 文字</span>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          disabled={isLoading || !content.trim() || timerState === 'running'}
          className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isLoading ? '保存中...' : 'この内容で記録する'}
        </Button>
      </div>
    </form>
  );
}
