import Skeleton from '@/components/atoms/Skeleton';

export default function WritingDetailSkeleton() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* User's Writing Skeleton */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <Skeleton className="mb-4 h-9 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>

      {/* AI Review Skeleton */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <Skeleton className="mb-4 h-8 w-1/4" />
        <div className="space-y-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <Skeleton className="h-32 w-32 flex-shrink-0 rounded-full" />
            <div className="w-full flex-1 space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
