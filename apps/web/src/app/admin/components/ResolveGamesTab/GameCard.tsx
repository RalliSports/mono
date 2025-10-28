import { GamesServiceFindAllInstance } from '@repo/server'

interface GameCardProps {
  game: GamesServiceFindAllInstance
  handleResolveGame: (gameId: string) => void
}

export default function GameCard({ game, handleResolveGame }: GameCardProps) {
  return (
    <div className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {/* <span className="text-lg">{sports.find((s) => s.name === game.sport)?.icon}</span> */}
            <h4 className="text-white font-semibold">{game.title}</h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${game.status === 'in_progress'
                ? 'bg-[#00CED1]/20 text-[#00CED1]'
                : game.status === 'waiting'
                  ? 'bg-yellow-500/20 text-[#FFAB91]'
                  : 'bg-[#FFAB91]/20 text-[#FFAB91]'
                }`}
            >
              {game.status}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-slate-400 mb-2">
            <span>
              Players: {game.participants.length}/{game.maxParticipants}
            </span>
            <span>Buy-in: ${game.depositAmount || 0}</span>
            <span>Pool: ${(game.depositAmount || 0) * game.participants.length}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-slate-300">Host:</span>
            {/* <span className="text-[#FFAB91]">{game.host.name}</span>
            <span className="text-slate-400">• {game.timeLeft} remaining</span> */}
          </div>
        </div>

        {/* {game.status === 'active' && ( */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleResolveGame(game.id)}
            className="px-4 py-2 bg-[#00CED1] hover:bg-[#00CED1]/90 text-white font-semibold rounded-lg transition-colors"
          >
            End Game
          </button>
          {/* <button
              onClick={() => handleResolveGame(game.id, 'cancel')}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button> */}
        </div>
        {/* )} */}
      </div>
    </div>
  )
}
