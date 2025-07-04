'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import type { LinkProps } from 'next/link';

type LinkButtonProps = LinkProps & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
};

export default function LinkButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: LinkButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition-colors disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'border-transparent bg-primary text-white hover:bg-primary/90 disabled:bg-primary/70',
    secondary:
      'border-transparent bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400',
    outline:
      'border-gray-500 bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100',
  };

  const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <Link {...props} className={combinedClassName}>
      {children}
    </Link>
  );
}
