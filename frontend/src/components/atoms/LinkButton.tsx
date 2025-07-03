'use client';

import Link from 'next/link';
import type { LinkProps } from 'next/link';

type LinkButtonProps = LinkProps & {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
};

export default function LinkButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: LinkButtonProps) {
  const baseClasses =
    'inline-block rounded-xl text-sm transition-colors duration-300';

  const variantClasses = {
    primary:
      'bg-primary px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    secondary: 'font-semibold leading-6 text-primary hover:text-primary/90',
    ghost: 'px-4 py-2 font-medium text-gray-700 hover:bg-gray-100',
  };

  return (
    <Link
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
