import TopNavigationSkeleton from './TopNavigationSkeleton'
import ProfileHeaderSkeleton from './ProfileHeaderSkeleton'
import ActiveParleysSectionSkeleton from './ActiveParleysSectionSkeleton'
import PastParleysSectionSkeleton from './PastParleysSectionSkeleton'

export default function ProfileContentSkeleton() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <TopNavigationSkeleton />

      <ProfileHeaderSkeleton />

      {/* Tab Content Skeleton */}
      <div className="px-4 pb-8">
        <div className="space-y-6">
          <ActiveParleysSectionSkeleton />
          <PastParleysSectionSkeleton />
        </div>
      </div>
    </div>
  )
}
