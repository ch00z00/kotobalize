'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

export default function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 text-center shadow-md">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
        {value}
        {unit && <span className="ml-1 text-xl font-medium">{unit}</span>}
      </dd>
    </div>
  );
}
