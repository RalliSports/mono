import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Game, User } from './types'
import { ProfileTabType } from '../hooks/useProfileTabs'

interface PastParlaysSectionProps {
  myCompletedGames: Game[]
  user: User
  setActiveTab: (tab: ProfileTabType) => void
}

export default function PastParlaysSection({ myCompletedGames, user, setActiveTab }: PastParlaysSectionProps) {
  const router = useRouter()

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
            <span className="text-lg">🎯</span>
          </span>
          Past Parlays
        </h3>
        <button
          onClick={() => router.push('/lobbies')}
          className="text-[#00CED1] hover:text-[#FFAB91] transition-colors text-sm font-medium"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {myCompletedGames.length > 0 &&
          myCompletedGames.slice(0, 4).map((game) => (
            <div
              key={game.id}
              onClick={() => {
                router.push(`/game?id=${game.id}`)
              }}
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-slate-600/60 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-white font-semibold text-lg">{game.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        game.status === 'live'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : game.status === 'pending'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}
                    >
                      {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                    </span>
                    <span className="text-slate-400 text-sm">{game.participants.length} players</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#00CED1] font-bold text-lg">
                    ${game.depositAmount * game.participants.length}
                  </div>
                  <div className="text-slate-400 text-xs">Potential</div>
                </div>
              </div>

              {/* Picks Preview */}
              <div className="flex justify-between items-center">
                <div className="flex -space-x-2">
                  {game.participants
                    .find((participant) => participant.user.id === user.id)
                    ?.bets.map((bet, index) => (
                      <Image
                        key={bet.id}
                        src={bet.line.athlete.picture || '/images/pfp-2.svg'}
                        alt={bet.line.athlete.name || ''}
                        width={32}
                        height={32}
                        className={`rounded-full border-2 object-cover bg-slate-800 ${
                          new Date(bet.line.matchup.startsAt) > new Date()
                            ? 'border-slate-600'
                            : !!bet.line.actualValue
                              ? 'border-blue-500'
                              : bet.isCorrect
                                ? 'border-emerald-500'
                                : 'border-red-500'
                        }`}
                        style={{
                          aspectRatio: '1/1',
                          zIndex: index + 1,
                        }}
                      />
                    ))}
                </div>
              </div>
            </div>
          ))}

        {myCompletedGames.length === 0 && (
          <div className="text-center py-8">
            <div className="text-slate-400">
              <div className="text-4xl mb-2">🎯</div>
              <div>No active parlays</div>
              <div className="text-sm mt-1">Join a game to get started!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
