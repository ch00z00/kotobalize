'use client';

import features from '@/constants/features.json';
import FeatureCard from './FeatureCard';

export default function LandingFeature() {
  return (
    <div className="bg-gray py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Kotobalizeの主な機能
          </h2>
          <p className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            あなたの言語化能力を、次のレベルへ
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            シンプルながらも強力な機能群が、あなたの思考を整理し、言葉にする力を体系的に鍛え上げます。
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <FeatureCard
                key={feature.name}
                name={feature.name}
                description={feature.description}
                iconName={feature.iconName}
              />
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
