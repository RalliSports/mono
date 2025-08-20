export default function HowItWorks() {
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <h3 className="text-white font-bold text-lg mb-4">How Referrals Work</h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-purple-400 font-bold">1</span>
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Enter a referral code</div>
            <div className="text-slate-400 text-xs">Get a code from a friend who's already on Rally</div>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-purple-400 font-bold">2</span>
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Make your first deposit</div>
            <div className="text-slate-400 text-xs">Add funds to your account to activate the bonus</div>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-green-400 font-bold">3</span>
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Get your $25 bonus!</div>
            <div className="text-slate-400 text-xs">Both you and your friend receive $25</div>
          </div>
        </div>
      </div>
    </div>
  )
}
