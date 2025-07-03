'use client';

import Link from 'next/link';

export default function LandingHero() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-68px)] items-center justify-center text-center">
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          言語化で、差をつけろ。
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Kotobalizeは、エンジニアの「技術を言葉で語る力」を鍛えるための
          <br />
          言語化トレーニングプラットフォームです。
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/themes"
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            トレーニングを始める
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            新規登録 <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
