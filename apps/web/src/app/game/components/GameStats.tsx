import { GamesFindOne } from '@repo/server'
import { getVisibilityIcon, getVisibilityColor } from '../utils/gameHelpers'

interface GameStatsProps {
  lobby: GamesFindOne
}

export default function GameStats({ lobby }: GameStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 shadow-2xl hover:shadow-[#00CED1]/10 transition-all duration-300 hover:scale-105">
        <div className="text-slate-400 text-xs">Buy In</div>
        <div className="text-white font-bold text-lg">${lobby.depositAmount}</div>
      </div>
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105">
        <div className="text-slate-400 text-xs">Max Payout</div>
        <div className="text-emerald-400 font-bold text-lg">
          ${(lobby.depositAmount || 0) * (lobby.maxParticipants || 0)}
        </div>
      </div>
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105">
        <div className="text-slate-400 text-xs">Visibility</div>
        <div
          className={`text-sm font-medium flex items-center gap-1 ${getVisibilityColor(lobby.isPrivate ? 'private' : 'public').split(' ')[0]}`}
        >
          {getVisibilityIcon(lobby.isPrivate ? 'private' : 'public')} {lobby.isPrivate ? 'Private' : 'Public'}
        </div>
      </div>
    </div>
  )
}
