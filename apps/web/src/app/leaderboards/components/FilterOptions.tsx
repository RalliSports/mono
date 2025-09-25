import { LeaderboardFilter, SportFilter } from '../page'

interface FilterOptionsProps {
  activeFilter: LeaderboardFilter
  setActiveFilter: (filter: LeaderboardFilter) => void
  sportFilter: SportFilter
  setSportFilter: (sport: SportFilter) => void
}

export default function FilterOptions({
  activeFilter,
  setActiveFilter,
  sportFilter,
  setSportFilter,
}: FilterOptionsProps) {
  const mainFilters = [
    { id: 'overall', name: 'Overall', icon: '🌟' },
    { id: 'wins', name: 'Most Wins', icon: '🏅' },
    { id: 'earnings', name: 'Top Earners', icon: '💰' },
    { id: 'sports', name: 'By Sport', icon: '⚽' },
  ] as const

  const sportFilters = [
    { id: 'all', name: 'All Sports' },
    { id: 'nfl', name: 'NFL' },
    { id: 'nba', name: 'NBA' },
    { id: 'mlb', name: 'MLB' },
    { id: 'nhl', name: 'NHL' },
  ] as const

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-2xl">
      {/* Main Filter Tabs */}
      <div className={activeFilter === 'sports' ? 'mb-4' : ''}>
        <div className="flex justify-center flex-wrap gap-3">
          {mainFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 min-w-[120px] ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg transform hover:scale-105'
                  : 'bg-gradient-to-br from-slate-800/80 to-slate-900/60 text-slate-300 hover:text-white border border-slate-700/50 hover:border-slate-600/60 hover:from-slate-700/80 hover:to-slate-800/60'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sport Filter (shown when 'sports' filter is active) */}
      {activeFilter === 'sports' && (
        <div className="border-t border-slate-700/50 pt-3">
          <div className="flex justify-center flex-wrap gap-2">
            {sportFilters.map((sport) => (
              <button
                key={sport.id}
                onClick={() => setSportFilter(sport.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  sportFilter === sport.id
                    ? 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-md'
                    : 'bg-gradient-to-br from-slate-800/60 to-slate-900/40 text-slate-400 hover:text-white border border-slate-700/40 hover:border-slate-600/50 hover:from-slate-700/60 hover:to-slate-800/40'
                }`}
              >
                {sport.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
