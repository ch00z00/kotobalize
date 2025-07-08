import React from 'react';

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export default function Tag({ children, className = '' }: TagProps) {
  const baseClasses =
    'inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary';

  return <span className={`${baseClasses} ${className}`}>{children}</span>;
}
