'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import localFont from 'next/font/local';
import { useAuthStore } from '@/store/auth';
import LinkButton from '../atoms/LinkButton';

const monumentExtended = localFont({
  // Next.jsの最適化のため、フォントは`src`ディレクトリ内に配置するのが推奨です
  src: '../../../public/fonts/MonumentExtended-Ultrabold.otf',
  display: 'swap',
});

export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const { isLoggedIn, logout, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link
          href={isClient && isLoggedIn() ? '/dashboard' : '/'}
          className={`text-2xl font-bold text-primary transition-all duration-300 hover:[text-shadow:0_4px_8px_rgba(0,0,0,0.2)] ${monumentExtended.className}`}
        >
          Kotobalize
        </Link>
        <div className="flex h-[40px] items-center space-x-4">
          {isClient &&
            (isLoggedIn() ? (
              <>
                <span className="hidden text-gray-700 sm:inline">
                  こんにちは, {user?.email} さん
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-gray-600 px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-gray-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <LinkButton
                  href="/login"
                  variant="ghost"
                  className="rounded-xl"
                >
                  Login
                </LinkButton>
                <LinkButton
                  href="/signup"
                  variant="primary"
                  className="rounded-xl"
                >
                  Sign up
                </LinkButton>
              </>
            ))}
        </div>
      </nav>
    </header>
  );
}
