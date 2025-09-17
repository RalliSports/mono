import { Skeleton } from '@/components/ui/skeleton'

export default function GameInfoHeaderSkeleton() {
  return (
    <div className="mb-6">
      {/* Game Title */}
      <div className="text-center mb-4">
        <Skeleton className="h-8 w-48 mx-auto mb-2" />
        <Skeleton className="h-5 w-32 mx-auto" />
      </div>

      {/* Game Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Legs Required */}
        <div className="bg-slate-900 rounded-lg p-4 text-center border border-slate-800">
          <Skeleton className="h-4 w-16 mx-auto mb-2" />
          <Skeleton className="h-6 w-8 mx-auto" />
        </div>

        {/* Buy In */}
        <div className="bg-slate-900 rounded-lg p-4 text-center border border-slate-800">
          <Skeleton className="h-4 w-12 mx-auto mb-2" />
          <Skeleton className="h-6 w-12 mx-auto" />
        </div>

        {/* Prize Pool or Players */}
        <div className="bg-slate-900 rounded-lg p-4 text-center border border-slate-800">
          <Skeleton className="h-4 w-16 mx-auto mb-2" />
          <Skeleton className="h-6 w-8 mx-auto" />
        </div>
      </div>
    </div>
  )
}
