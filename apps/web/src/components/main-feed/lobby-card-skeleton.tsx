import { Skeleton } from '@/components/ui/skeleton'

export default function LobbyCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 min-h-[280px]">
      <div className="h-full flex flex-col">
        {/* Host Info Header Skeleton */}
        <div className="flex items-center space-x-3 mb-6">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        {/* Lobby Content Skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            {/* Title Skeleton */}
            <Skeleton className="h-6 w-3/4 mb-4" />

            {/* Key Stats Grid Skeleton */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-slate-700/80 to-slate-800/60 rounded-xl p-4 border border-slate-600/30"
                >
                  <div className="text-center">
                    <Skeleton className="h-8 w-8 mx-auto mb-1" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </div>
                </div>
              ))}
            </div>

            {/* Prize Pool and Progress Skeleton */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="w-full h-3 rounded-full" />
            </div>
          </div>

          {/* View Button Skeleton - pushed to bottom */}
          <Skeleton className="w-full h-12 rounded-2xl mt-auto" />
        </div>
      </div>
    </div>
  )
}
