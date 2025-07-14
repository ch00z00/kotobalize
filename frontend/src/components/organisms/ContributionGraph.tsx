'use client';

import ActivityCalendar, {
  type Activity,
  type Color,
} from 'react-activity-calendar';

interface ContributionGraphProps {
  data: Activity[];
}

const explicitTheme = {
  light: ['#f0f0f0', '#b1b1e9', '#6969d7', '#2a2ac5', '#0606b0'] as Color[],
  dark: ['#f0f0f0', '#b1b1e9', '#6969d7', '#2a2ac5', '#0606b0'] as Color[], // A typo was here, fixed.
};

export default function ContributionGraph({ data }: ContributionGraphProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-full min-h-[160px] items-center justify-center rounded-md border-2 border-dashed border-gray-200 text-sm text-gray-500">
        <p>アクティビティがありません。</p>
      </div>
    );
  }

  return (
    <ActivityCalendar
      data={data}
      theme={explicitTheme}
      blockSize={14}
      blockMargin={4}
      fontSize={16}
      showWeekdayLabels
    />
  );
}
