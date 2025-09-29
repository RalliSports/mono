import Link from 'next/link'
import { GamesServiceFindOne } from '@repo/server'

interface CreateNewGameButtonProps {
  lobby: GamesServiceFindOne
  size?: 'large' | 'small'
}

export default function CreateNewGameButton({ lobby, size = 'large' }: CreateNewGameButtonProps) {
  const winners = lobby.participants.filter((p) => p.isWinner)
  const isGameCompleted = winners.length > 0
  const isGameFull = lobby.participants.length >= (lobby.maxParticipants || 0)
  const isGameOngoing = lobby.participants.length > 0 && !isGameCompleted

  // Show large button when game is completed or full
  if (size === 'large' && (isGameCompleted || isGameFull)) {
    return (
      <div className="mb-8">
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-[#00CED1]/30 rounded-2xl p-6 shadow-2xl shadow-[#00CED1]/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold text-xl">{isGameCompleted ? 'Game Completed!' : 'Game Full!'}</h3>
              <p className="text-slate-400">
                {isGameCompleted ? 'Ready to start a new challenge?' : 'Want to create your own game?'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#00CED1]">🎮</div>
              <div className="text-sm text-slate-400">Create New</div>
            </div>
          </div>

          <Link
            href="/create-game"
            className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-slate-900 font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-[#00CED1]/30 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 group relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            <span className="relative z-10 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H8c-.55 0-1-.45-1-1s.45-1 1-1h3V8c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z" />
              </svg>
              <span>Create New Game</span>
            </span>
          </Link>

          {isGameCompleted && (
            <p className="text-emerald-400 text-sm text-center mt-3 font-medium">
              🏆 Congratulations to the winners! Start your next challenge
            </p>
          )}
        </div>
      </div>
    )
  }

  // Show small button when game is ongoing
  if (size === 'small' && isGameOngoing && !isGameCompleted) {
    return (
      <Link
        href="/create-game"
        className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#00CED1]/20 to-blue-500/20 border border-[#00CED1]/30 text-[#00CED1] hover:text-white hover:bg-gradient-to-r hover:from-[#00CED1]/30 hover:to-blue-500/30 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H8c-.55 0-1-.45-1-1s.45-1 1-1h3V8c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z" />
        </svg>
        <span>New Game</span>
      </Link>
    )
  }

  return null
}
