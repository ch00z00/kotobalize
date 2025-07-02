import Skeleton from '@/components/Skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Skeleton className="mb-6 h-9 w-48" />

      {/* Stats Skeleton */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>

      {/* Accordion List Skeleton */}
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-3/5" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <Skeleton className="mt-2 h-4 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
