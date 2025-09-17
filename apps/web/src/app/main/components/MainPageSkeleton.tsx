import TopNavigationSkeleton from './TopNavigationSkeleton'
import FilterBarSkeleton from './FilterBarSkeleton'
import LobbiesSectionSkeleton from './LobbiesSectionSkeleton'

export default function MainPageSkeleton() {
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Top Navigation Bar Skeleton */}
      <TopNavigationSkeleton />

      {/* Filters and Search Skeleton */}
      <FilterBarSkeleton />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile and Desktop Layouts Skeleton */}
        <LobbiesSectionSkeleton isMobile={false} />
        <LobbiesSectionSkeleton isMobile={true} />
      </div>
    </div>
  )
}
