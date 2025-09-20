import { Skeleton } from '@/components/ui/skeleton'
import LobbyCardSkeleton from '@/components/main-feed/lobby-card-skeleton'

interface LobbiesSectionSkeletonProps {
  isMobile?: boolean
}

export default function LobbiesSectionSkeleton({ isMobile = false }: LobbiesSectionSkeletonProps) {
  const CreateLobbyButtonSkeleton = ({ isMobile }: { isMobile: boolean }) => (
    <Skeleton className={`${isMobile ? 'h-8 w-16 rounded-xl' : 'h-12 w-32 rounded-xl'}`} />
  )

  if (isMobile) {
    return (
      <div className="lg:hidden space-y-8">
        {/* Open Lobbies Section */}
        <div className="relative">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center gap-3">
              <CreateLobbyButtonSkeleton isMobile={true} />
              <div className="text-right">
                <Skeleton className="h-6 w-8 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <LobbyCardSkeleton key={index} />
            ))}
          </div>

          {/* View More Button Skeleton */}
          <div className="mt-4">
            <Skeleton className="w-full h-12 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  // Desktop Layout
  return (
    <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
      {/* Open Lobbies Sidebar (1/3 width) */}
      <div className="lg:col-span-3">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-32" />
          <CreateLobbyButtonSkeleton isMobile={false} />
        </div>

        <div className="mb-4 flex items-center justify-center">
          <Skeleton className="h-6 w-24" />
        </div>

        <div className="space-y-3 mb-6">
          {[...Array(5)].map((_, index) => (
            <LobbyCardSkeleton key={index} />
          ))}
        </div>

        {/* View More Button Skeleton */}
        <Skeleton className="w-full h-12 rounded-xl" />
      </div>
    </div>
  )
}
