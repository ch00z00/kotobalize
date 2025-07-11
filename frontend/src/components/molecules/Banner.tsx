'use client';

import React from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface BannerProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Banner({ message, type, onClose }: BannerProps) {
  const baseClasses =
    'fixed bottom-8 right-8 z-50 flex items-center p-4 w-full max-w-sm rounded-lg shadow-lg';
  const typeClasses = {
    success: 'bg-green-50 text-green-800',
    error: 'bg-red-50 text-red-800',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
        {type === 'success' ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <XCircle className="h-5 w-5" />
        )}
      </div>
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button
        type="button"
        className="ml-auto -my-1.5 inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 focus:ring-2"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
