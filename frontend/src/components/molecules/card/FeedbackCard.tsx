'use client';

interface FeedbackCardProps {
  title: string;
  children: React.ReactNode;
}

export default function FeedbackCard({ title, children }: FeedbackCardProps) {
  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold text-gray-800">{title}</h3>
      <div className="prose prose-sm max-w-none rounded-md border bg-gray-50 p-4 text-gray-700">
        {children}
      </div>
    </div>
  );
}
