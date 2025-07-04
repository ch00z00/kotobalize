import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition-colors disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'border-transparent bg-primary text-white hover:bg-primary/90 disabled:bg-primary/70',
    secondary:
      'border-transparent bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400',
    outline:
      'border-gray-500 bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
