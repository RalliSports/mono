import LobbyCardSkeleton from '@/components/main-feed/lobby-card-skeleton'

interface LobbiesGridSkeletonProps {
  count?: number
}

export default function LobbiesGridSkeleton({ count = 8 }: LobbiesGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(count)].map((_, index) => (
        <LobbyCardSkeleton key={index} />
      ))}
    </div>
  )
}
