'use client';

import Link from 'next/link';

export default function LandingCTA() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          さあ、言語化トレーニングを始めよう。
          <br />
          新しい自分に出会う準備はできましたか？
        </h2>
        <div className="mt-10 flex items-center gap-x-6">
          <Link
            href="/themes"
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            今すぐ始める
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            新規登録はこちら <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
