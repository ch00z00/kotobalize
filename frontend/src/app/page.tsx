'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';

export default function HomePage() {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // クライアント側でログイン状態を確認し、ログイン済みならダッシュボードへリダイレクト
    if (isLoggedIn()) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  // 未ログインユーザー向けの表示
  return (
    <div className="container mx-auto flex h-[calc(100vh-68px)] items-center justify-center text-center">
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          言語化で、差をつけろ。
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Kotobalizeは、エンジニアの「技術を言葉で語る力」を鍛えるための
          <br />
          言語化トレーニングプラットフォームです。
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/themes"
            className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            トレーニングを始める
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            新規登録 <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
