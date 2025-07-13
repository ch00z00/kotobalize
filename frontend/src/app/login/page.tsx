'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { loginUser } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';
import AuthForm from '@/components/auth/AuthForm';
import Banner from '@/components/molecules/Banner';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    const fromSignup = searchParams.get('from');
    if (fromSignup === 'signup') {
      setNotification({
        message: '新規登録が完了しました。ログインしてください。',
        type: 'success',
      });
      // URLからクエリパラメータを削除
      router.replace('/login', { scroll: false });
    }
  }, [searchParams, router]);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setNotification(null);
    try {
      const { token, user } = await loginUser({
        email,
        password,
        rememberMe,
      });
      login(token, user, rememberMe);
      const callbackUrl = searchParams.get('callbackUrl');
      router.push(callbackUrl || '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました。');
    }
  };

  return (
    <>
      {notification && (
        <Banner
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <AuthForm
        title="ログイン"
        buttonText="ログイン"
        loadingButtonText="ログイン中..."
        onSubmit={handleLogin}
        error={error}
        passwordAutoComplete="current-password"
        showRememberMe={true}
        rememberMe={rememberMe}
        onRememberMeChange={setRememberMe}
        bottomLinkHref="/signup"
        bottomLinkText="新規登録"
        bottomLinkPrompt="アカウントをお持ちでないですか？"
      />
    </>
  );
}
