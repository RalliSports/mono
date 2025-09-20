import { Skeleton } from '@/components/ui/skeleton'

export default function FilterBarSkeleton() {
  return (
    <div className="sticky top-[16px] z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/30 px-4 py-3">
      <div className="flex items-center space-x-3">
        {/* Search Icon Skeleton */}
        <Skeleton className="w-9 h-9 rounded-xl" />

        {/* Filter Tabs Skeleton */}
        <div className="flex space-x-2 overflow-x-auto flex-1">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="w-20 h-7 rounded-lg flex-shrink-0" />
          ))}
        </div>
      </div>
    </div>
  )
}
