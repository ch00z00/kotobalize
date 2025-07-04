'use client';

import localFont from 'next/font/local';
import LinkButton from '@/components/atoms/LinkButton';
import ScrollReveal from '../common/ScrollReveal';

const monumentExtended = localFont({
  src: '../../../public/fonts/MonumentExtended-Ultrabold.otf',
  display: 'swap',
});

export default function LandingHero() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-68px)] items-center justify-center text-center">
      <div>
        <ScrollReveal delay={0.1}>
          <h1
            className={`tracking-wide text-primary text-[10vw] ${monumentExtended.className}`}
          >
            Kotobalize
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.4}>
          <h2 className="mt-4 font-bold tracking-tight text-gray-900 text-[4vw]">
            言語化で、差をつけろ。
          </h2>
          <p className="mt-6 text-gray-600 text-[3vw] sm:text-lg">
            Kotobalizeは、エンジニアの「技術を言葉で語る力」を鍛えるための
            <br />
            言語化トレーニングプラットフォームです。
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <LinkButton
              href="/login"
              variant="outline"
              className="text-xl px-6 py-2"
            >
              Login
            </LinkButton>
            <LinkButton
              href="/signup"
              variant="primary"
              className="text-xl px-6 py-2"
            >
              Sign up
            </LinkButton>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
