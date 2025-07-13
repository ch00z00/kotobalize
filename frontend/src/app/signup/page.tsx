'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signupUser } from '@/lib/api/auth';
import AuthForm from '@/components/auth/AuthForm';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (email: string, password: string) => {
    setError(null);
    try {
      await signupUser({ email, password });
      // On successful signup, redirect to the login page with a success message.
      router.push('/login?from=signup');
    } catch (err) {
      setError(err instanceof Error ? err.message : '新規登録に失敗しました。');
    }
  };

  return (
    <AuthForm
      title="新規登録"
      buttonText="登録する"
      loadingButtonText="登録中..."
      onSubmit={handleSignup}
      error={error}
      passwordAutoComplete="new-password"
      bottomLinkHref="/login"
      bottomLinkText="ログイン"
      bottomLinkPrompt="アカウントをお持ちですか？"
    />
  );
}
