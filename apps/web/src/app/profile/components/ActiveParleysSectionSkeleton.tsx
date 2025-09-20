import { Skeleton } from '@/components/ui/skeleton'

export default function ActiveParleysSectionSkeleton() {
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Skeleton className="w-8 h-8 rounded-full mr-4" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <Skeleton className="h-5 w-48 mb-2" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-16 rounded-md" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-6 w-16 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>

            {/* Participants Row */}
            <div className="flex items-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-6 h-6 rounded-full" />
              ))}
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
