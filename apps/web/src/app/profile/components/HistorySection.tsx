'use client'

import { useUser } from '@/hooks/api/use-user'
import type { GamesGetMyCompletedGames } from '@repo/server'

export default function HistorySection() {
  const { myCompletedGames, currentUser } = useUser()

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
          <span className="text-lg">📋</span>
        </span>
        Past Payouts
      </h3>

      {myCompletedGames.isLoading ? (
        <div className="text-slate-400 text-center py-8">
          <div className="text-4xl mb-2">⏳</div>
          <div>Loading your game history...</div>
        </div>
      ) : myCompletedGames.data && myCompletedGames.data.length > 0 ? (
        <div className="space-y-4">
          {(myCompletedGames.data as unknown as GamesGetMyCompletedGames).map((game) => {
            const userParticipant = game.participants?.find((p: any) => p.userId === currentUser.data?.id)
            const isWinner = userParticipant?.isWinner
            const amountWon = userParticipant?.amountWon || 0

            return (
              <div key={game.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-white font-semibold">{game.title}</h4>
                    <p className="text-slate-400 text-sm">
                      {game.createdAt ? new Date(game.createdAt).toLocaleDateString() : 'Unknown date'} •{' '}
                      {game.participants?.length || 0} players
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${isWinner ? 'text-green-400' : 'text-red-400'}`}>
                      {isWinner ? '+' : ''}${Number(amountWon).toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500">{isWinner ? 'Won' : 'Lost'}</div>
                  </div>
                </div>
                <div className="text-slate-400 text-sm">Entry: ${Number(game.depositAmount || 0).toFixed(2)}</div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-slate-400 text-center py-8">
          <div className="text-4xl mb-2">🎮</div>
          <div>No completed games found</div>
          <div className="text-sm mt-2">Complete some games to see your payout history!</div>
        </div>
      )}
    </div>
  )
}
