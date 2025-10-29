import Image from 'next/image'
import { LeaderboardFilter } from '../client'
import { useLeaderboard, LeaderboardSortBy } from '@/hooks/api/use-leaderboard'
import LottieLoading from '@/components/ui/lottie-loading'

interface LeaderboardsListProps {
  filter: LeaderboardFilter
}

export default function LeaderboardsList({ filter }: LeaderboardsListProps) {
  const getSortBy = (): LeaderboardSortBy => {
    switch (filter) {
      case 'wins':
        return 'totalWins'
      case 'earnings':
        return 'topEarners'
      default:
        return 'winRate'
    }
  }

  const sortBy = getSortBy()
  const { data, isLoading, error } = useLeaderboard(1, 50, sortBy)

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-center py-12">
          <LottieLoading message="Loading leaderboard..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">Error loading leaderboard</h3>
          <p className="text-slate-400">Please try again later.</p>
        </div>
      </div>
    )
  }

  const sortedPlayers = data?.users || []

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getFilterTitle = () => {
    switch (filter) {
      case 'wins':
        return 'Top Winners'
      case 'earnings':
        return 'Highest Earners'
      default:
        return 'Overall Rankings'
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 sm:p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
            <span className="text-lg">🏆</span>
          </span>
          {getFilterTitle()}
        </h3>
        <div className="text-slate-400 text-sm">{sortedPlayers.length} players ranked</div>
      </div>

      <div className="space-y-4">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-3 sm:p-4 hover:border-slate-600/60 transition-all duration-300 cursor-pointer"
          >
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="flex items-center justify-between w-full">
                {/* Left Side - Rank & Player */}
                <div className="flex items-center space-x-2 flex-1 min-w-0 overflow-hidden">
                  <div className="text-center w-10 flex-shrink-0">
                    <span className={`text-base font-bold ${index < 3 ? 'text-lg' : 'text-[#00CED1]'}`}>
                      {getRankDisplay(filter === 'overall' ? player.rank : index + 1)}
                    </span>
                  </div>

                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center overflow-hidden">
                      <Image
                        src={player.avatar}
                        alt={player.username}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {index < 3 && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border border-slate-800" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="text-white font-medium text-sm truncate">{player.username}</div>
                    <div className="text-slate-400 text-xs truncate">
                      {player.gamesWon}/{player.gamesPlayed} wins
                    </div>
                  </div>
                </div>

                {/* Right Side - Primary Stat */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <div className="text-right">
                    {filter === 'wins' && (
                      <>
                        <div className="text-sm font-bold text-[#00CED1]">{player.gamesWon}</div>
                        <div className="text-xs text-slate-400">wins</div>
                      </>
                    )}
                    {filter === 'earnings' && (
                      <>
                        <div className="text-sm font-bold text-emerald-400">
                          ${player.totalAmountWon.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">earned</div>
                      </>
                    )}
                    {filter === 'overall' && (
                      <>
                        <div className="text-sm font-bold text-[#FFAB91]">{player.winPercentage.toFixed(1)}%</div>
                        <div className="text-xs text-slate-400">win rate</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Rank */}
                <div className="text-2xl font-bold min-w-[60px] text-center">
                  <span className={`${index < 3 ? 'text-2xl' : 'text-[#00CED1]'}`}>
                    {getRankDisplay(filter === 'overall' ? player.rank : index + 1)}
                  </span>
                </div>

                {/* Avatar */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center overflow-hidden">
                    <Image
                      src={player.avatar}
                      alt={player.username}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Online indicator for top 3 */}
                  {index < 3 && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-800" />
                  )}
                </div>

                {/* Player info */}
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-white font-semibold text-lg">{player.username}</h4>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-slate-400 text-sm">
                      {player.gamesPlayed} games played • {player.winPercentage.toFixed(1)}% win rate
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6">
                {/* Primary stat based on filter */}
                <div className="text-right">
                  {filter === 'wins' && (
                    <>
                      <div className="text-lg font-bold text-[#00CED1]">{player.gamesWon}</div>
                      <div className="text-xs text-slate-400">wins</div>
                    </>
                  )}
                  {filter === 'earnings' && (
                    <>
                      <div className="text-lg font-bold text-emerald-400">
                        ${player.totalAmountWon.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400">earned</div>
                    </>
                  )}
                  {filter === 'overall' && (
                    <>
                      <div className="text-lg font-bold text-[#FFAB91]">{player.winPercentage.toFixed(1)}%</div>
                      <div className="text-xs text-slate-400">win rate</div>
                    </>
                  )}
                </div>

                {/* Secondary stats */}
                <div className="text-right">
                  <div className="text-sm text-slate-300">
                    <span className="text-emerald-400 font-medium">${player.totalAmountWon.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-slate-300">
                    <span className="text-[#00CED1] font-medium">{player.gamesWon}</span> wins
                  </div>
                </div>

                {/* Action button */}
                <div className="flex space-x-2">
                  <button className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-700/50 transition-colors">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {sortedPlayers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No rankings found</h3>
            <p className="text-slate-400">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  )
}
