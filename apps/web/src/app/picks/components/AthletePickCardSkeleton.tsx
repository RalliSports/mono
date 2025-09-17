import { Skeleton } from '@/components/ui/skeleton'

export default function AthletePickCardSkeleton() {
  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
      <div className="flex justify-between items-start mb-4">
        {/* Player Info */}
        <div className="flex items-center space-x-3">
          {/* Player Avatar */}
          <Skeleton className="w-12 h-12 rounded-full" />

          {/* Player Name and Info */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Status Badge */}
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Player Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <Skeleton className="h-4 w-12 mx-auto mb-1" />
          <Skeleton className="h-6 w-8 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-4 w-12 mx-auto mb-1" />
          <Skeleton className="h-6 w-8 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-4 w-12 mx-auto mb-1" />
          <Skeleton className="h-6 w-8 mx-auto" />
        </div>
      </div>

      {/* Betting Options */}
      <div className="space-y-3">
        {/* Over/Under buttons */}
        <div className="flex space-x-2">
          <Skeleton className="h-12 flex-1 rounded-lg" />
          <Skeleton className="h-12 flex-1 rounded-lg" />
        </div>

        {/* Additional betting line if exists */}
        <div className="flex space-x-2">
          <Skeleton className="h-12 flex-1 rounded-lg" />
          <Skeleton className="h-12 flex-1 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
