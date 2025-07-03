'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function Header() {
  const { isLoggedIn, logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link
          href={isLoggedIn() ? '/dashboard' : '/'}
          className="text-2xl font-bold text-primary"
        >
          Kotobalize
        </Link>
        <div className="flex items-center space-x-4">
          {isLoggedIn() ? (
            <>
              <span className="hidden text-gray-700 sm:inline">
                こんにちは, {user?.email} さん
              </span>
              <button
                onClick={handleLogout}
                className="rounded bg-red-500 px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded px-4 py-2 font-medium text-gray-700 transition-colors duration-300 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded bg-primary px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
