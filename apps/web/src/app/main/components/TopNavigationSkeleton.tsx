import { Skeleton } from '@/components/ui/skeleton'
import Wordmark from '@/components/wordmark'
import Logo from '@/components/logo'

interface TopNavigationSkeletonProps {
  showBalance?: boolean
}

export default function TopNavigationSkeleton({ showBalance = true }: TopNavigationSkeletonProps) {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center space-x-3">
          <Skeleton className="w-9 h-9 rounded-xl" />
        </div>

        {/* Center: Logo and Wordmark - Keep real ones */}
        <div className="flex flex-row items-center text-xl font-bold text-white">
          <Logo height={50} width={50} />
          <Wordmark fill="#F9AA92" height={20} width={120} />
        </div>

        {/* Right: Balance + Profile Skeletons */}
        <div className="flex items-center space-x-3">
          {showBalance && <Skeleton className="w-32 h-9 rounded-xl" />}
          <Skeleton className="w-9 h-9 rounded-full" />
        </div>
      </div>
    </div>
  )
}
