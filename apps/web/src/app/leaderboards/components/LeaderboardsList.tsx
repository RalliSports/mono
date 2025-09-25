import Image from 'next/image'
import { LeaderboardFilter, SportFilter } from '../page'

interface LeaderboardPlayer {
  id: string
  username: string
  avatar: string
  rank: number
  totalWins: number
  totalEarnings: number
  winRate: number
  gamesPlayed: number
  favoriteeSport: string
  recentActivity: string
  achievements: string[]
}

// Mock leaderboard data
const mockLeaderboardData: LeaderboardPlayer[] = [
  {
    id: '1',
    username: 'parlayking99',
    avatar: '/images/pfp-1.svg',
    rank: 1,
    totalWins: 287,
    totalEarnings: 45650,
    winRate: 78.3,
    gamesPlayed: 367,
    favoriteeSport: 'NFL',
    recentActivity: '2 hours ago',
    achievements: ['🏆 Top Earner', '🔥 Win Streak Champion'],
  },
  {
    id: '2',
    username: 'sportsguru',
    avatar: '/images/pfp-2.svg',
    rank: 2,
    totalWins: 251,
    totalEarnings: 38920,
    winRate: 74.6,
    gamesPlayed: 336,
    favoriteeSport: 'NBA',
    recentActivity: '5 hours ago',
    achievements: ['🎯 Accuracy Master', '💎 VIP Player'],
  },
  {
    id: '3',
    username: 'betwhisperer',
    avatar: '/images/pfp-3.svg',
    rank: 3,
    totalWins: 234,
    totalEarnings: 35470,
    winRate: 71.2,
    gamesPlayed: 329,
    favoriteeSport: 'MLB',
    recentActivity: '1 day ago',
    achievements: ['📈 Consistent Performer', '⚡ Quick Draw'],
  },
  {
    id: '4',
    username: 'rallipro2024',
    avatar: '/images/pfp-4.svg',
    rank: 4,
    totalWins: 198,
    totalEarnings: 29850,
    winRate: 69.8,
    gamesPlayed: 284,
    favoriteeSport: 'NHL',
    recentActivity: '3 hours ago',
    achievements: ['🥇 Monthly Winner', '🎪 Risk Taker'],
  },
  {
    id: '5',
    username: 'cryptosports',
    avatar: '/images/pfp-1.svg',
    rank: 5,
    totalWins: 189,
    totalEarnings: 27320,
    winRate: 67.5,
    gamesPlayed: 280,
    favoriteeSport: 'NFL',
    recentActivity: '6 hours ago',
    achievements: ['💰 Big Spender', '🏅 Veteran Player'],
  },
  {
    id: '6',
    username: 'gamechangr',
    avatar: '/images/pfp-2.svg',
    rank: 6,
    totalWins: 176,
    totalEarnings: 24890,
    winRate: 65.9,
    gamesPlayed: 267,
    favoriteeSport: 'NBA',
    recentActivity: '4 hours ago',
    achievements: ['🌟 Rising Star', '🔥 Hot Streak'],
  },
  {
    id: '7',
    username: 'statmaster',
    avatar: '/images/pfp-3.svg',
    rank: 7,
    totalWins: 163,
    totalEarnings: 22150,
    winRate: 64.2,
    gamesPlayed: 254,
    favoriteeSport: 'MLB',
    recentActivity: '8 hours ago',
    achievements: ['📊 Analytics Pro', '🎯 Precision Player'],
  },
  {
    id: '8',
    username: 'luckylegend',
    avatar: '/images/pfp-4.svg',
    rank: 8,
    totalWins: 152,
    totalEarnings: 19680,
    winRate: 62.8,
    gamesPlayed: 242,
    favoriteeSport: 'NHL',
    recentActivity: '1 hour ago',
    achievements: ['🍀 Lucky Charm', '⭐ Fan Favorite'],
  },
]

interface LeaderboardsListProps {
  filter: LeaderboardFilter
  sportFilter: SportFilter
}

export default function LeaderboardsList({ filter, sportFilter }: LeaderboardsListProps) {
  // Filter and sort data based on selected filters
  const getSortedData = () => {
    let filteredData = [...mockLeaderboardData]

    // Filter by sport if sports filter is active
    if (filter === 'sports' && sportFilter !== 'all') {
      filteredData = filteredData.filter((player) => player.favoriteeSport.toLowerCase() === sportFilter.toUpperCase())
    }

    // Sort based on filter type
    switch (filter) {
      case 'wins':
        return filteredData.sort((a, b) => b.totalWins - a.totalWins)
      case 'earnings':
        return filteredData.sort((a, b) => b.totalEarnings - a.totalEarnings)
      case 'sports':
      case 'overall':
      default:
        return filteredData.sort((a, b) => a.rank - b.rank)
    }
  }

  const sortedPlayers = getSortedData()

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
      case 'sports':
        return `${sportFilter === 'all' ? 'All Sports' : sportFilter.toUpperCase()} Rankings`
      default:
        return 'Overall Rankings'
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
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
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-slate-600/60 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between">
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
                      {player.favoriteeSport} • {player.recentActivity}
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
                      <div className="text-lg font-bold text-[#00CED1]">{player.totalWins}</div>
                      <div className="text-xs text-slate-400">wins</div>
                    </>
                  )}
                  {filter === 'earnings' && (
                    <>
                      <div className="text-lg font-bold text-emerald-400">${player.totalEarnings.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">earned</div>
                    </>
                  )}
                  {(filter === 'overall' || filter === 'sports') && (
                    <>
                      <div className="text-lg font-bold text-[#FFAB91]">{player.winRate}%</div>
                      <div className="text-xs text-slate-400">win rate</div>
                    </>
                  )}
                </div>

                {/* Secondary stats */}
                <div className="text-right hidden sm:block">
                  <div className="text-sm text-slate-300">
                    <span className="text-emerald-400 font-medium">${player.totalEarnings.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-slate-300">
                    <span className="text-[#00CED1] font-medium">{player.totalWins}</span> wins
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
