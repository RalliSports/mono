import AthletePickCardSkeleton from './AthletePickCardSkeleton'
import PicksPageSkeleton from './PicksPageSkeleton'

interface LoadingStatesProps {
  isLoading?: boolean
  athletesCount: number
}

export default function LoadingStates({ isLoading = false, athletesCount }: LoadingStatesProps) {
  if (athletesCount === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <AthletePickCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return null
}

export function PageLoadingFallback() {
  return <PicksPageSkeleton />
}
