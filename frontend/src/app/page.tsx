'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import LandingHero from '@/components/home/LandingHero';
import LandingFeature from '@/components/home/LandingFeature';
import LandingCTA from '@/components/home/LandingCTA';

export default function HomePage() {
  const isLoggedIn = useAuthStore((state) => !!state.token);
  const router = useRouter();
  // isClient is true when the component is mounted on the client side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Redirect to dashboard if logged in
    if (isClient && isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isClient, isLoggedIn, router]);

  if (!isClient || isLoggedIn) {
    return null;
  }

  return (
    <>
      <LandingHero />
      <LandingFeature />
      <LandingCTA />
    </>
  );
}
