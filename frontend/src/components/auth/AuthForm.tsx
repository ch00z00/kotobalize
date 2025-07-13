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
  error?: string | null;
  showRememberMe?: boolean;
  rememberMe?: boolean;
  onRememberMeChange?: (checked: boolean) => void;
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
  error,
  showRememberMe = false,
  rememberMe = false,
  onRememberMeChange = () => {},
}: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(email, password);
    } finally {
      // The parent component's onSubmit handles success or failure.
      // We use finally to ensure the loading state is always reset.
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
          {showRememberMe && (
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => onRememberMeChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                ログイン状態を保持する
              </label>
            </div>
          )}
          {error && (
            <p className="text-sm text-center text-red-600 mt-2">{error}</p>
          )}
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
