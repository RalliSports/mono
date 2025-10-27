import { Skeleton } from '@/components/ui/skeleton'

export default function AthletesListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header with title and count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Skeleton className="w-8 h-8 rounded-full mr-4" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="text-right">
          <Skeleton className="h-6 w-8 mb-1" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>

      {/* Skeleton Cards */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-slate-900 rounded-lg p-4 border border-slate-800">
            <div className="flex justify-between items-start mb-4">
              {/* Player Info */}
              <div className="flex items-center space-x-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {Array.from({ length: 3 }).map((_, statIndex) => (
                <div key={statIndex} className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto mb-1" />
                  <Skeleton className="h-6 w-8 mx-auto" />
                </div>
              ))}
            </div>

            {/* Betting Options */}
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Skeleton className="h-12 flex-1 rounded-lg" />
                <Skeleton className="h-12 flex-1 rounded-lg" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-12 flex-1 rounded-lg" />
                <Skeleton className="h-12 flex-1 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
