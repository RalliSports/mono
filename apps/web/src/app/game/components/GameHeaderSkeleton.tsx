import { Skeleton } from '@/components/ui/skeleton'

export default function GameHeaderSkeleton() {
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 mb-6 shadow-2xl">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Host Avatar Skeleton */}
          <Skeleton className="w-12 h-12 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        {/* Share Button Skeleton */}
        <Skeleton className="w-9 h-9 rounded-xl" />
      </div>

      {/* Game Title Skeleton */}
      <Skeleton className="h-8 w-64 mb-4" />

      {/* Game Info Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div>
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div>
          <Skeleton className="h-3 w-12 mb-2" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div>
          <Skeleton className="h-3 w-18 mb-2" />
          <Skeleton className="h-5 w-22" />
        </div>
      </div>

      {/* Progress Bar Skeleton */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="w-full h-3 rounded-full" />
      </div>
    </div>
  )
}
