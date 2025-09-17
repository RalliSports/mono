import { Skeleton } from '@/components/ui/skeleton'
import GameInfoHeaderSkeleton from './GameInfoHeaderSkeleton'
import AthletesListSkeleton from './AthletesListSkeleton'

export default function PicksPageSkeleton() {
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Top Navigation Bar */}
      <div className="bg-slate-900 border-b border-slate-800 p-4">
        <div className="flex items-center justify-between">
          {/* Back button and title */}
          <div className="flex items-center space-x-3">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="h-6 w-32" />
          </div>

          {/* Selection status */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-20">
        {/* Game Info Header */}
        <GameInfoHeaderSkeleton />

        {/* Athletes List */}
        <AthletesListSkeleton />
      </div>
    </div>
  )
}
