'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface BannerProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Banner({ message, type, onClose }: BannerProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const baseClasses =
    'fixed bottom-8 right-8 z-50 flex items-center p-4 w-full max-w-sm rounded-lg shadow-lg transition-all duration-300 ease-in-out';
  const typeClasses = {
    success: 'bg-green-50 text-green-800 border-green-200 border-2',
    error: 'bg-red-50 text-red-800 border-red-200 border-2',
  };
  const visibilityClasses = show
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-2';

  return (
    <div
      className={`${baseClasses} ${typeClasses[type]} ${visibilityClasses}`}
      role="alert"
    >
      <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
        {type === 'success' ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <XCircle className="h-5 w-5" />
        )}
      </div>
      <div className="ml-3 text-md font-medium message">{message}</div>
      <button
        type="button"
        className="ml-auto -my-1.5 inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 focus:ring-2"
        onClick={handleClose}
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
