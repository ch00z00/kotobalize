'use client';

import React from 'react'; // React is required for React.cloneElement
import ActivityCalendar, {
  type Activity,
  type Color,
} from 'react-activity-calendar';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import LinkButton from '../atoms/LinkButton';

interface ContributionGraphProps {
  data: Activity[];
}

const explicitTheme = {
  light: ['#F0F0F0', '#DDF5FF', '#4A90E2', '#9B59B6', '#F73859'] as Color[],
  dark: ['#F0F0F0', '#DDF5FF', '#4A90E2', '#9B59B6', '#F73859'] as Color[],
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

  // Get today's date in 'YYYY-MM-DD' format, respecting the local timezone.
  const today = new Date();
  const todayString = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 10);

  return (
    <div className="contribution-calendar-wrapper">
      <ActivityCalendar
        data={data}
        theme={explicitTheme}
        renderBlock={(block, activity) => {
          // Tooltip content changes based on activity count
          const tooltipProps = {
            'data-tooltip-id': 'react-tooltip',
            'data-tooltip-html':
              activity.count > 0
                ? `${activity.count} contributions on ${activity.date}`
                : `No contributions on ${activity.date}`,
          };

          // For future dates, add a border to indicate they are upcoming.
          if (activity.date > todayString) {
            return React.cloneElement(block, {
              ...tooltipProps,
              stroke: 'rgba(27, 31, 35, 0.12)',
              strokeWidth: 1,
            });
          }

          return React.cloneElement(block, tooltipProps);
        }}
        blockSize={16}
        blockRadius={2}
        blockMargin={4}
        fontSize={16}
        showWeekdayLabels
      />
      <ReactTooltip id="react-tooltip" place="top" />
    </div>
  );
}
