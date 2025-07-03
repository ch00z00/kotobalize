'use client';

import React from 'react';

const features = [
  {
    name: '豊富なテーマ',
    description:
      '基本的な技術用語から、システム設計、アルゴリズムまで。幅広いテーマであなたの知識と言語化能力を試せます。',
    icon: (
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
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M13 8H7" />
        <path d="M17 12H7" />
      </svg>
    ),
  },
  {
    name: 'AIによる即時レビュー',
    description:
      'あなたの説明をAIが多角的に分析。スコアと具体的なフィードバックで、改善点がすぐに分かります。',
    icon: (
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
    ),
  },
  {
    name: '進捗の可視化',
    description:
      'ダッシュボードであなたの成長を一目で確認。平均スコアや挑戦したテーマ数で、モチベーションを維持できます。',
    icon: (
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
      >
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
];

export default function LandingFeature() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Kotobalizeの主な機能
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            あなたの言語化能力を、次のレベルへ
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            シンプルながらも強力な機能群が、あなたの思考を整理し、言葉にする力を体系的に鍛え上げます。
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    {React.cloneElement(feature.icon, {
                      className: 'h-6 w-6 text-white',
                      'aria-hidden': 'true',
                    })}
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
