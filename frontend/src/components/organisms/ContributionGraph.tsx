'use client';

import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import LinkButton from '../atoms/LinkButton';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Activity } from '@/types/generated/api';
import type { Activity as CalendarActivity } from 'react-github-calendar';

interface ContributionGraphProps {
  data: Activity[];
}

const customTheme = {
  light: ['#F0F0F0', '#DDF5FF', '#4A90E2', '#9B59B6', '#F73859'],
  dark: ['#F0F0F0', '#DDF5FF', '#4A90E2', '#9B59B6', '#F73859'],
};

export default function ContributionGraph({ data }: ContributionGraphProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col gap-y-4 h-full min-h-[160px] items-center justify-center rounded-md border-2 border-dashed border-gray-200 text-sm text-gray-500">
        <p>アクティビティがありません。</p>
        <LinkButton href="/themes" variant="primary">
          言語化にチャレンジする
        </LinkButton>
      </div>
    );
  }

  // Convert our Activity type to CalendarActivity type
  const calendarData: CalendarActivity[] = data.map(item => ({
    date: item.date,
    count: item.count,
    level: item.level as 0 | 1 | 2 | 3 | 4,
  }));

  return (
    <div className="contribution-calendar-wrapper">
      <GitHubCalendar
        username="example" // required prop but we'll override with transformData
        transformData={() => calendarData}
        theme={customTheme}
        blockSize={16}
        blockMargin={4}
        fontSize={16}
        showWeekdayLabels={true}
        hideColorLegend={false}
        hideTotalCount={false}
      />
      <ReactTooltip id="react-tooltip" place="top" />
    </div>
  );
}
