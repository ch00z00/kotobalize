'use client';

import { useRouter } from 'next/navigation';
import { signupUser } from '@/lib/api/auth';
import AuthForm from '@/components/auth/AuthForm';

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (email: string, password: string) => {
    await signupUser({ email, password });
    // On successful signup, redirect to the login page to have the user log in.
    router.push('/login');
  };

  return (
    <AuthForm
      title="新規登録"
      buttonText="登録する"
      loadingButtonText="登録中..."
      onSubmit={handleSignup}
      passwordAutoComplete="new-password"
      bottomLinkHref="/login"
      bottomLinkText="ログイン"
      bottomLinkPrompt="アカウントをお持ちですか？"
    />
  );
}
