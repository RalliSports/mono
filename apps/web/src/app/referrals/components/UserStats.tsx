import type { UserStatsProps } from './types'

export default function UserStats({ userStats }: UserStatsProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <h3 className="text-white font-bold text-lg mb-4">Your Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/30 rounded-lg p-3 text-center">
          <div className="text-purple-400 font-bold text-xl">{userStats.totalReferrals}</div>
          <div className="text-slate-400 text-xs">Total Referrals</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-3 text-center">
          <div className="text-green-400 font-bold text-xl">${userStats.totalEarnings}</div>
          <div className="text-slate-400 text-xs">Total Earned</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-semibold">Your Active Code</div>
            <div className="text-purple-400 font-mono text-lg">{userStats.activeCode}</div>
          </div>
          <button className="text-purple-400 hover:text-purple-300 transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
