import React from 'react';

export default function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a10 10 0 0 0-4.3 19.1" />
      <path d="M18.4 3.6a10 10 0 0 1 2.1 13.9" />
      <path d="M12 22a10 10 0 0 1-4.3-19.1" />
      <path d="m5.6 20.4 2.8-2.8" />
      <path d="M2 12h4" />
      <path d="M22 12h-4" />
      <path d="m3.6 5.6 2.8 2.8" />
      <path d="m20.4 18.4-2.8-2.8" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
