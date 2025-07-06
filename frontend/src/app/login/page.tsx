'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { loginUser } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';
import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    try {
      const { token, user } = await loginUser({ email, password });
      login(token, user);
      const callbackUrl = searchParams.get('callbackUrl');
      router.push(callbackUrl || '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました。');
    }
  };

  return (
    <AuthForm
      title="ログイン"
      buttonText="ログイン"
      loadingButtonText="ログイン中..."
      onSubmit={handleLogin}
      error={error}
      passwordAutoComplete="current-password"
      bottomLinkHref="/signup"
      bottomLinkText="新規登録"
      bottomLinkPrompt="アカウントをお持ちでないですか？"
    />
  );
}
