import { Skeleton } from '@/components/ui/skeleton'

export default function TopNavigationSkeleton() {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Back Button + Title Skeleton */}
        <div className="flex items-center space-x-3">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    </div>
  )
}
