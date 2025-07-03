'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeature from '@/components/landing/LandingFeature';
import LandingCTA from '@/components/landing/LandingCTA';

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
    <>
      <LandingHero />
      <LandingFeature />
      <LandingCTA />
    </>
  );
}
