import TopNavigationSkeleton from './TopNavigationSkeleton'
import GameHeaderSkeleton from './GameHeaderSkeleton'
import GameStatsSkeleton from './GameStatsSkeleton'
import WinnersDisplaySkeleton from './WinnersDisplaySkeleton'
import JoinGameButtonSkeleton from './JoinGameButtonSkeleton'
import ParticipantsListSkeleton from './ParticipantsListSkeleton'

export default function GamePageSkeleton() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <TopNavigationSkeleton />

      {/* Main Content */}
      <div className="px-4 pb-20">
        <GameHeaderSkeleton />
        <GameStatsSkeleton />
        <WinnersDisplaySkeleton />
        <JoinGameButtonSkeleton />
        <ParticipantsListSkeleton />
      </div>
    </div>
  )
}
