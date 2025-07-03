'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import LandingHero from '@/components/home/LandingHero';
import LandingFeature from '@/components/home/LandingFeature';
import LandingCTA from '@/components/home/LandingCTA';

export default function HomePage() {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if logged in
    if (isLoggedIn()) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  // Display for non-logged-in users
  return (
    <>
      <LandingHero />
      <LandingFeature />
      <LandingCTA />
    </>
  );
}
