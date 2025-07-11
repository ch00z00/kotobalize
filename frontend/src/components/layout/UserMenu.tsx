'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Image from 'next/image';
import { User } from 'lucide-react';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
    setIsOpen(false);
  };

  // メニューの外側をクリックしたときに閉じる処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { href: '/about', label: 'ABOUT' },
    { href: '/dashboard', label: 'DASHBOARD' },
    { href: '/themes', label: 'THEMES' },
    { href: '/my-page', label: 'PROFILE' },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-gray-200 text-gray-600 transition-colors hover:bg-gray-300"
      >
        {user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            width={32}
            height={32}
            alt="User Avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-7 w-7" />
        )}
      </button>

      <div
        className={`absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-2 ring-gray-200 transition-all duration-300 ease-in-out ${
          isOpen
            ? 'transform opacity-100 scale-100 translate-y-0'
            : 'pointer-events-none transform opacity-0 scale-95 -translate-y-2'
        }`}
      >
        <div className="px-4 py-3">
          <p className="text-sm text-gray-600">Signed in as</p>
          <p className="truncate text-sm font-medium text-gray-900">
            {user?.email}
          </p>
        </div>
        <div className="border-t border-gray-100 py-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="border-t border-gray-100 py-1">
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
