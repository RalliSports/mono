import type { RecentReferralsProps } from './types'

export default function RecentReferrals({ recentReferrals }: RecentReferralsProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <h3 className="text-white font-bold text-lg mb-4">Recent Referrals</h3>
      <div className="space-y-3">
        {recentReferrals.map((referral) => (
          <div key={referral.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400 text-sm font-bold">{referral.username.charAt(0)}</span>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{referral.username}</div>
                <div className="text-slate-400 text-xs">{referral.date}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-400 font-bold text-sm">+${referral.earnings}</div>
              <div
                className={`text-xs px-2 py-1 rounded ${
                  referral.status === 'confirmed'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-orange-500/20 text-orange-400'
                }`}
              >
                {referral.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
