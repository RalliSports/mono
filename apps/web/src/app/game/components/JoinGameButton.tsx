import Link from 'next/link'
import { GamesFindOne, UserFindOne } from '@repo/server'

interface JoinGameButtonProps {
  game: GamesFindOne
  user: UserFindOne | null
}

export default function JoinGameButton({ game, user }: JoinGameButtonProps) {
  const spotsLeft = game.maxParticipants || 0 - game.participants.length
  const isUserInGame = game.participants.some((participant) => participant.user?.id === user?.id)

  if (isUserInGame) {
    return null
  }

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-[#00CED1]/30 rounded-2xl p-6 shadow-2xl shadow-[#00CED1]/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-xl">Ready to Join?</h3>
            <p className="text-slate-400">
              {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining in this lobby
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">${game.depositAmount}</div>
            <div className="text-sm text-slate-400">Buy-in required</div>
          </div>
        </div>

        <Link
          href={`/picks?id=${game.id}`}
          className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-slate-900 font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-[#00CED1]/30 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 mt-auto"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
          <span className="relative z-10">
            Make Your Picks • {spotsLeft} Spot{spotsLeft !== 1 ? 's' : ''} Left
          </span>
        </Link>

        {spotsLeft <= 3 && (
          <p className="text-amber-400 text-sm text-center mt-3 font-medium">
            ⚡ Filling up fast! Only {spotsLeft} spot
            {spotsLeft !== 1 ? 's' : ''} remaining
          </p>
        )}
      </div>
    </div>
  )
}
