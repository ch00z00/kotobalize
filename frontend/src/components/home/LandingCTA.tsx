'use client';

import LinkButton from '@/components/atoms/LinkButton';
import ScrollReveal from '@/components/common/ScrollReveal';

export default function LandingCTA() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 text-center sm:py-32 lg:px-8">
        <ScrollReveal delay={0.1}>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            さあ、言語化トレーニングを始めましょう。
            <br />
            新しい自分に出会う準備はできましたか？
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
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
