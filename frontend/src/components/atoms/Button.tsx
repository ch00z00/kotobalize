import { ReactNode, ButtonHTMLAttributes, useCallback } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
}

export default function Button({
  children,
  onClick,
  onKeyDown,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition-colors disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'border-transparent bg-primary text-white hover:bg-primary/90 disabled:bg-primary/70',
    secondary:
      'border-transparent bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400',
    outline:
      'border-gray-500 bg-white text-gray-500 hover:bg-gray-50 disabled:bg-gray-100',
    danger:
      'border-transparent bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick?.();
      }
    },
    [onClick]
  );

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      onKeyDown={onKeyDown || handleKeyDown}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
