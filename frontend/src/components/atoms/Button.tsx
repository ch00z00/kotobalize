import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
}: ButtonProps) {
  const baseStyle =
    'rounded-md px-4 py-2 font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';

  const buttonStyle =
    variant === 'primary'
      ? `bg-primary hover:bg-primary/90 ${baseStyle}`
      : `bg-gray-500 hover:bg-gray-400 ${baseStyle}`;

  if (href) {
    return (
      <Link href={href} className={buttonStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
}
