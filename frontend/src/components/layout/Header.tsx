'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useEffect, useState } from 'react';
import localFont from 'next/font/local';
import UserMenu from './UserMenu';
import LinkButton from '../atoms/LinkButton';

const monumentExtended = localFont({
  // Next.jsの最適化のため、フォントは`src`ディレクトリ内に配置するのが推奨です
  src: '../../../public/fonts/MonumentExtended-Ultrabold.otf',
  display: 'swap',
});

export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link
          href={isClient && isLoggedIn() ? '/dashboard' : '/'}
          className={`text-2xl tracking-wide text-primary transition-all duration-300 hover:[text-shadow:0_4px_8px_rgba(0,0,0,0.2)] ${monumentExtended.className}`}
        >
          Kotobalize
        </Link>
        <div className="flex h-[48px] items-center space-x-4">
          {isClient &&
            (isLoggedIn() ? (
              <UserMenu />
            ) : (
              <>
                <LinkButton
                  href="/login"
                  variant="outline"
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
