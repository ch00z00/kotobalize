'use client';

import React from 'react';
import ChatIcon from '@/components/atoms/icons/ChatIcon';
import SparkleIcon from '@/components/atoms/icons/SparkleIcon';
import TrendingUpIcon from '@/components/atoms/icons/TrendingUpIcon';

const iconMap: { [key: string]: React.ElementType } = {
  chat: ChatIcon,
  sparkle: SparkleIcon,
  trendingUp: TrendingUpIcon,
};

interface FeatureCardProps {
  name: string;
  description: string;
  iconName: string;
}

export default function FeatureCard({
  name,
  description,
  iconName,
}: FeatureCardProps) {
  const Icon = iconMap[iconName];

  return (
    <div className="rounded-xl bg-white p-8 border border-gray-200 shadow-md transition-shadow duration-300 hover:shadow-xl">
      <div className="relative pl-16">
        <dt className="text-base font-semibold leading-7 text-gray-900">
          <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            {Icon && <Icon className="h-6 w-6 text-white" aria-hidden="true" />}
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
