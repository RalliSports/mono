import Image from 'next/image'
import { Player } from '../types'

interface PlayersListProps {
  players: Player[]
}

export default function PlayersList({ players }: PlayersListProps) {
  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-3 flex items-center justify-center">
          <span className="text-lg">👥</span>
        </span>
        Existing Players
      </h2>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {players.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">No players found</div>
            <div className="text-sm text-slate-500">Add players using the form on the left</div>
          </div>
        ) : (
          players.map((player) => (
            <div key={player.id} className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center overflow-hidden">
                  {
                    <Image
                      src={player.picture || '/images/pfp-1.svg'}
                      alt={player.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `<span class="text-white font-bold">${player.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}</span>`
                        }
                      }}
                    />
                  }
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{player.name}</h4>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-slate-300">{player.team.name}</span>
                    <span className="text-slate-400">#{player.jerseyNumber}</span>
                    <span className="text-slate-400">{player.position}</span>
                    <span className="text-slate-400">Age: {player.age}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
