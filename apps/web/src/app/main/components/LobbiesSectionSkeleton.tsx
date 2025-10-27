import { Skeleton } from '@/components/ui/skeleton'
import LobbyCardSkeleton from '@/components/main-feed/lobby-card-skeleton'

export default function LobbiesSectionSkeleton() {
  const CreateLobbyButtonSkeleton = ({ isMobile }: { isMobile: boolean }) => (
    <Skeleton className={`${isMobile ? 'h-8 w-16 rounded-xl' : 'h-12 w-32 rounded-xl'}`} />
  )

  return (
    <div className="">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
