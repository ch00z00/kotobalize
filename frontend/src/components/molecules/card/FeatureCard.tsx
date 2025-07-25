'use client';

import React from 'react';
import Icon from '@/components/atoms/Icon';
import { type IconName } from '@/types/icon';

interface FeatureCardProps {
  name: string;
  description: string;
  iconName: IconName;
  comingSoon?: boolean;
}

export default function FeatureCard({
  name,
  description,
  iconName,
  comingSoon,
}: FeatureCardProps) {
  return (
    <div
      className={`relative rounded-xl bg-white p-8 border border-gray-200 shadow-md transition-shadow duration-300 ${
        comingSoon ? 'opacity-60' : 'hover:shadow-xl'
      }`}
    >
      {comingSoon && (
        <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-yellow-600 px-2.5 py-0.5 text-xs font-semibold text-white">
          Coming soon
        </span>
      )}
      <div className="relative pl-16">
        <dt className="text-base font-semibold leading-7 text-gray-900">
          <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            {iconName && (
              <Icon
                name={iconName}
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            )}
          </div>
          {name}
        </dt>
        <dd className="mt-2 text-base leading-7 text-gray-600">
          {description}
        </dd>
      </div>
    </div>
  );
}
