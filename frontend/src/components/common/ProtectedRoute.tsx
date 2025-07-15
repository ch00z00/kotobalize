'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute is a HOC(higher-order component) that checks if the user is logged in.
 * If the user is not logged in, it redirects to the login page.
 * @param {ProtectedRouteProps} props
 * @returns
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Check if this component is mounted on the client side.
    // This allows the Zustand store to wait for the state to be restored from localStorage.
    setIsClient(true);
  }, []);

  useEffect(() => {
    // If the user is not logged in, redirect to the login page.
    if (isClient && !isLoggedIn()) {
      router.push('/login');
    }
  }, [isClient, isLoggedIn, router]);

  // If the user is logged in, render the children.
  // If the user is not logged in, redirect to the login page.
  return isClient && isLoggedIn() ? <>{children}</> : null;
}
