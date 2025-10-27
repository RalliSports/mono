import { Skeleton } from '@/components/ui/skeleton'

export default function ParticipantsListSkeleton() {
  return (
    <div className="mb-6">
      <div className="mb-4">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Participant Avatar */}
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Status/Score Skeleton */}
                <Skeleton className="h-6 w-16 rounded-md" />
                {/* Expand Button Skeleton */}
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
