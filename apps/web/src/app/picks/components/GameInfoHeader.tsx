import { GamesServiceFindAll } from '@repo/server'

interface GameInfoHeaderProps {
  game: GamesServiceFindAll[number]
  legsRequired: number
  buyIn: number
}

export default function GameInfoHeader({ game, legsRequired, buyIn }: GameInfoHeaderProps) {
  return (
    <div className="pt-6 pb-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
        <div className="text-center mb-4">
          <h2 className="text-white font-bold text-xl mb-2">Select Your {legsRequired} Picks</h2>
          <p className="text-slate-400 text-sm">Choose player props to build your ${buyIn} parlay</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 text-center">
            <div className="text-slate-400 text-xs">Buy In</div>
            <div className="text-white font-bold text-lg">${buyIn}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 text-center">
            <div className="text-slate-400 text-xs">Legs</div>
            <div className="text-[#00CED1] font-bold text-lg">{legsRequired}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 text-center">
            <div className="text-slate-400 text-xs">Potential</div>
            <div className="text-emerald-400 font-bold text-lg">
              ~${Math.round(buyIn * (game.maxParticipants || 0))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
