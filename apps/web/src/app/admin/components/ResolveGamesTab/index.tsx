import GameCard from './GameCard'
import { SportsDropdown } from '../../../../components/ui/dropdown'
import { Game } from '../types'

interface ResolveGamesTabProps {
  filteredGames: Game[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedSport: string
  setSelectedSport: (sport: string) => void
  handleResolveGame: (gameId: string) => void
}

export default function ResolveGamesTab({
  filteredGames,
  searchTerm,
  setSearchTerm,
  selectedSport,
  setSelectedSport,
  handleResolveGame,
}: ResolveGamesTabProps) {
  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
          <span className="text-lg">🎮</span>
        </span>
        Resolve Games
      </h2>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by game title..."
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
          />
        </div>

        <div>
          <SportsDropdown
            value={selectedSport}
            onChange={setSelectedSport}
            includeAll={true}
            placeholder="Filter by sport"
          />
        </div>
      </div>

      {/* Games List */}
      <div className="space-y-4">
        {filteredGames.map((game) => (
          <GameCard key={game.id} game={game} handleResolveGame={handleResolveGame} />
        ))}
      </div>
    </div>
  )
}
