import { Stat } from '../types'

interface StatsListProps {
  stats: Stat[]
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export default function StatsList({ stats, searchTerm, setSearchTerm }: StatsListProps) {
  const filteredStats = stats.filter((stat) => {
    const matchesSearch =
      stat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.customId.toString().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-3 flex items-center justify-center">
          <span className="text-lg">📋</span>
        </span>
        Existing Stats
      </h2>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stat types..."
            className="w-full px-4 py-3 pl-11 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
          />
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredStats.map((stat) => (
          <div
            key={stat.id}
            className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/20 hover:border-[#00CED1]/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-lg">{stat.name}</h4>
                    <div className="flex items-center space-x-2">
                      {/* <span className="text-[#00CED1] text-sm font-medium">{stat.sport}</span> */}
                      <span className="text-slate-400">•</span>
                      <span className="text-[#FFAB91] font-mono text-sm">{stat.customId}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-3 pl-13">{stat.description}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <button className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors group">
                  <svg
                    className="w-4 h-4 text-slate-400 group-hover:text-[#00CED1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button className="p-2 bg-slate-800/50 hover:bg-red-500/20 rounded-lg transition-colors group">
                  <svg
                    className="w-4 h-4 text-slate-400 group-hover:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredStats.length === 0 && (
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2"></div>
            <p className="text-slate-400">No stat types found matching your criteria</p>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
