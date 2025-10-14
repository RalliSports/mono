import { LeaderboardFilter } from '../client'

interface FilterOptionsProps {
  activeFilter: LeaderboardFilter
  setActiveFilter: (filter: LeaderboardFilter) => void
}

export default function FilterOptions({ activeFilter, setActiveFilter }: FilterOptionsProps) {
  const mainFilters = [
    { id: 'overall', name: 'Overall', icon: '🌟' },
    { id: 'wins', name: 'Most Wins', icon: '🏅' },
    { id: 'earnings', name: 'Top Earners', icon: '💰' },
  ] as const

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-2xl">
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
  )
}
