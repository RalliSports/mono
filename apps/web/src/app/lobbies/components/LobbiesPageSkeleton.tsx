import TopNavigation from './TopNavigation'
import FilterTabsSkeleton from './FilterTabsSkeleton'
import SearchBarSkeleton from './SearchBarSkeleton'
import PageHeaderSkeleton from './PageHeaderSkeleton'
import LobbiesGridSkeleton from './LobbiesGridSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function LobbiesPageSkeleton() {
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Top Navigation Bar - Show actual component with loading states */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back Button + Logo */}
          <div className="flex items-center space-x-3">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <Skeleton className="w-9 h-9 rounded-xl lg:hidden" />
            <Skeleton className="w-24 h-6" />
          </div>

          {/* Right: Balance + Profile */}
          <div className="flex items-center space-x-4">
            <Skeleton className="w-32 h-9 rounded-xl" />
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
        </div>
      </div>

      {/* Filter Tabs Skeleton */}
      <FilterTabsSkeleton />

      {/* Search Bar Skeleton */}
      <SearchBarSkeleton />

      <div className="max-w-none mx-auto px-6 py-6">
        {/* Page Header Skeleton */}
        <PageHeaderSkeleton />

        {/* Results Summary Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Lobbies Grid Skeleton */}
        <LobbiesGridSkeleton count={8} />
      </div>
    </div>
  )
}
