'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Image from 'next/image';

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-7 w-7"
    >
      <path
        fillRule="evenodd"
        d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
        clipRule="evenodd"
      />
    </svg>
  );
}

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
    { href: '/profile', label: 'PROFILE' },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-600 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
          <UserIcon />
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
