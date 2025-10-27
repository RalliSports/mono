import { useMatchups } from '@/hooks/api'
import { MatchupsServiceGetAllMatchupsInstance } from '@repo/server'

export default function MatchupsList() {
  const matchupsQuery = useMatchups()
  const matchUps = (matchupsQuery.query.data || []) as MatchupsServiceGetAllMatchupsInstance[]
  return (
    <div className="space-y-4">
      {matchUps.map((matchUp) => (
        <div
          key={matchUp.id}
          className="bg-slate-700/30 rounded-xl p-6 hover:bg-slate-700/50 transition-colors border border-slate-600/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center mb-2">
                  <span className="font-bold text-white text-sm">HOME</span>
                </div>
                <p className="text-xs text-slate-400">Home</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">VS</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-600/50 rounded-full flex items-center justify-center mb-2">
                  <span className="font-bold text-white text-sm">AWAY</span>
                </div>
                <p className="text-xs text-slate-400">Away</p>
              </div>
              <div className="ml-6">
                <h4 className="text-xl font-bold text-white mb-1">
                  {matchUp.homeTeam?.name || 'Home Team'} vs {matchUp.awayTeam?.name || 'Away Team'}
                </h4>
                {/* <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">{sports.find((s) => s.name === matchUp.sport)?.icon}</span>
                  <p className="text-sm text-slate-300 font-medium">{matchUp.sport}</p>
                </div> */}
                <p className="text-xs text-slate-400">
                  {matchUp.gameDate ? new Date(matchUp.gameDate).toLocaleDateString() : 'TBD'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  matchUp.status === 'scheduled'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                    : matchUp.status === 'live'
                      ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
                }`}
              >
                {matchUp.status.charAt(0).toUpperCase() + matchUp.status.slice(1)}
              </span> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
