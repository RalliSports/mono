import GameCard from './GameCard'
import { SportsDropdown } from '../../../../components/ui/dropdown'
import { GamesFindAllInstance } from '@repo/server'
import { useGames } from '@/hooks/api'
import { useState } from 'react'
import { useToast } from '@/components/ui/toast'

export default function ResolveGamesTab() {
  const { addToast } = useToast()
  const gamesQuery = useGames()
  const games = (gamesQuery.all.data || []) as GamesFindAllInstance[]
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('')

  const handleResolveGame = async (gameId: string) => {
    try {
      await gamesQuery.resolve.mutateAsync(gameId)
      addToast('Game resolved successfully!', 'success')
    } catch (error) {
      console.error('Error resolving game:', error)
      addToast('Failed to resolve game', 'error')
    }
  }

  const handleResolveAllPossibleGames = async () => {
    try {
      await gamesQuery.resolveAllPossibleGames.mutateAsync()
      addToast('Game resolved successfully!', 'success')
    } catch (error) {
      console.error('Error resolving game:', error)
      addToast('Failed to resolve game', 'error')
    }
  }
  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
            <span className="text-lg">🎮</span>
          </span>
          Resolve Games
        </h2>
        <button
          onClick={handleResolveAllPossibleGames}
          className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
        >
          Resolve All Possible Games
        </button>
      </div>

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
        {games.map((game) => (
          <GameCard key={game.id} game={game} handleResolveGame={handleResolveGame} />
        ))}
      </div>
    </div>
  )
}
