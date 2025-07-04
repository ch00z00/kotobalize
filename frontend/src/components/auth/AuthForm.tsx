'use client';

import { useState } from 'react';
import LinkButton from '@/components/atoms/LinkButton';
import Button from '../atoms/Button';

interface AuthFormProps {
  title: string;
  buttonText: string;
  loadingButtonText: string;
  onSubmit: (email: string, password: string) => Promise<void>;
  passwordAutoComplete: 'current-password' | 'new-password';
  bottomLinkHref: string;
  bottomLinkText: string;
  bottomLinkPrompt: string;
}

export default function AuthForm({
  title,
  buttonText,
  loadingButtonText,
  onSubmit,
  passwordAutoComplete,
  bottomLinkHref,
  bottomLinkText,
  bottomLinkPrompt,
}: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await onSubmit(email, password);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (err as any)?.response?.status;
      if (status === 401) {
        setError('メールアドレスまたはパスワードが正しくありません。');
      } else if (err instanceof Error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apiMessage = (err as any)?.response?.data?.message;
        setError(apiMessage || 'ログイン中にエラーが発生しました。');
      } else {
        setError('予期せぬエラーが発生しました。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-168px)] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          {title}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="メールアドレス"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full py-2 px-3 rounded-lg border-2 border-gray-300 bg-gray-100 sm:text-md"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="パスワード"
                autoComplete={passwordAutoComplete}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full py-2 px-3 rounded-lg border-2 border-gray-300 bg-gray-100 sm:text-md"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex w-full mx-auto justify-center px-4 py-3 text-lg font-semibold text-white shadow-sm hover:bg-primary/80 disabled:cursor-not-allowed disabled:bg-primary/60"
            >
              {isLoading ? loadingButtonText : buttonText}
            </Button>
          </div>
        </form>
        <p className="w-[85%] mx-auto flex items-center justify-between mt-6 text-sm text-gray-600">
          <span>{bottomLinkPrompt}</span>
          <LinkButton href={bottomLinkHref} variant="outline">
            {bottomLinkText}
          </LinkButton>
        </p>
      </div>
    </div>
  );
}
