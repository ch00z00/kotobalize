'use client';

import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';
import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    const { token, user } = await loginUser({ email, password });
    login(token, user);
    router.push('/dashboard');
  };

  return (
    <AuthForm
      title="ログイン"
      buttonText="ログイン"
      loadingButtonText="ログイン中..."
      onSubmit={handleLogin}
      passwordAutoComplete="current-password"
      bottomLinkHref="/signup"
      bottomLinkText="新規登録"
      bottomLinkPrompt="アカウントをお持ちでないですか？"
    />
  );
}
