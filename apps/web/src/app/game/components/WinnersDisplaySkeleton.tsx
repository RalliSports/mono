import { Skeleton } from '@/components/ui/skeleton'

export default function WinnersDisplaySkeleton() {
  return (
    <div className="mb-6">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          <div className="flex gap-3 min-w-max">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-700/80 to-slate-800/60 rounded-xl p-3 border border-slate-600/30 min-w-[200px]"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
