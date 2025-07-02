'use client';

interface ScoreCircleProps {
  score: number;
}

export default function ScoreCircle({ score }: ScoreCircleProps) {
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600 border-green-500';
    if (score >= 60) return 'text-yellow-600 border-yellow-500';
    return 'text-red-600 border-red-500';
  };

  return (
    <div
      className={`relative flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-full border-4 bg-white shadow-lg ${getScoreColor()}`}
    >
      <span className="text-4xl font-bold">{score}</span>
      <span className="absolute bottom-4 text-sm font-semibold">点</span>
    </div>
  );
}
