'use client';

import React from 'react';
import GitHubCalendar, { type Activity as GitHubActivity } from 'react-github-calendar';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import LinkButton from '../atoms/LinkButton';

interface Activity {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

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

  return (
    <div className="contribution-calendar-wrapper">
      <GitHubCalendar
        username="example" // required prop but we'll override with transformData
        transformData={() => data}
        theme={customTheme}
        blockSize={16}
        blockMargin={4}
        fontSize={16}
        showWeekdayLabels={true}
        renderBlock={(block: React.ReactElement, activity: GitHubActivity) => {
          const utcDate = new Date(activity.date + 'T00:00:00Z');
          const jstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

          const formattedJST = jstDate.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            weekday: 'short',
          });

          const tooltipProps = {
            'data-tooltip-id': 'react-tooltip',
            'data-tooltip-html':
              activity.count > 0
                ? `${activity.count} contributions on ${formattedJST}`
                : `No contributions on ${formattedJST}`,
          };

          return React.cloneElement(block, tooltipProps);
        }}
      />
      <ReactTooltip id="react-tooltip" place="top" />
    </div>
  );
}
