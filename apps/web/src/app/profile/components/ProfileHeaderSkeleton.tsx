import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileHeaderSkeleton() {
  return (
    <div className="px-4 pt-6 pb-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
        <div className="flex items-center space-x-4 mb-6">
          {/* Profile Picture Skeleton */}
          <Skeleton className="w-16 h-16 rounded-full" />

          <div className="flex-1">
            {/* Username Skeleton */}
            <Skeleton className="h-6 w-32 mb-2" />
            {/* Notifications Button Skeleton */}
            <Skeleton className="h-8 w-24" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-700/80 to-slate-800/60 rounded-xl p-4 border border-slate-600/30"
            >
              <div className="text-center">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Refer Friends Section Skeleton */}
        <div className="mt-4">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
