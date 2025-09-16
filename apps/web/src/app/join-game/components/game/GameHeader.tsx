import Image from 'next/image'
import { GamesFindOne } from '@repo/server'

interface GameHeaderProps {
  game: GamesFindOne
}

const getVisibilityIcon = (visibility: string) => {
  switch (visibility) {
    case 'public':
      return '🌍'
    case 'private':
      return '🔒'
    case 'friends':
      return '👥'
    default:
      return '🌍'
  }
}

const getVisibilityColor = (visibility: string) => {
  switch (visibility) {
    case 'public':
      return 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30'
    case 'private':
      return 'text-red-400 bg-red-400/20 border-red-400/30'
    case 'friends':
      return 'text-blue-400 bg-blue-400/20 border-blue-400/30'
    default:
      return 'text-slate-400 bg-slate-400/20 border-slate-400/30'
  }
}

export default function GameHeader({ game }: GameHeaderProps) {
  console.log('game', game)
  return (
    <div className="pt-6 pb-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-xl overflow-hidden">
              <Image
                src={game.creator?.avatar || '/images/pfp-3.svg'}
                alt={game.creator?.username || 'Creator'}
                width={64}
                height={64}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 text-lg shadow-lg">👑</div>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-xl truncate">{game.title}</h3>
            <p className="text-slate-400 text-sm">
              Host • Created {new Date(game.createdAt || '').toLocaleDateString()}
            </p>
            <div>
              <div className="flex items-center gap-2 ">
                <span className="text-slate-300 font-medium text-sm">
                  {game.participants.length}/{game.maxParticipants} players
                </span>
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                <span className="text-slate-400 text-sm">{game.numBets || 0} legs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Game Stats - Single Row with 3 Items */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 shadow-2xl hover:shadow-[#00CED1]/10 transition-all duration-300 hover:scale-105">
            <div className="text-slate-400 text-xs">Buy In</div>
            <div className="text-white font-bold text-lg">${game.depositAmount}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105">
            <div className="text-slate-400 text-xs">Max Payout</div>
            <div className="text-emerald-400 font-bold text-lg">
              ${(game.depositAmount || 0) * (game.maxParticipants || 0)}
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105">
            <div className="text-slate-400 text-xs">Visibility</div>
            <div
              className={`text-sm font-medium flex items-center gap-1 ${getVisibilityColor(game.isPrivate ? 'private' : 'public').split(' ')[0]}`}
            >
              {getVisibilityIcon(game.isPrivate ? 'private' : 'public')} {game.isPrivate ? 'Private' : 'Public'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
