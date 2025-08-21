import type { ReferralCodeInputProps } from './types'

export default function ReferralCodeInput({
  referralCode,
  isValidatingReferral,
  referralStatus,
  onReferralChange,
}: ReferralCodeInputProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-4">
      <h3 className="text-white font-bold text-lg">Enter Referral Code</h3>
      <p className="text-slate-400 text-sm">Have a referral code? Enter it below to get your bonus!</p>

      <div className="relative">
        <input
          type="text"
          value={referralCode}
          onChange={(e) => onReferralChange(e.target.value)}
          placeholder="ENTER-REFERRAL-CODE"
          maxLength={20}
          className="w-full px-4 py-4 pr-12 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 hover:border-slate-600 font-mono text-lg"
        />

        {/* Validation Indicator */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {isValidatingReferral ? (
            <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          ) : referralStatus === 'valid' ? (
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : referralStatus === 'invalid' ? (
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          ) : null}
        </div>
      </div>

      {/* Validation Messages */}
      {referralStatus && (
        <div
          className={`p-4 rounded-lg ${
            referralStatus === 'valid'
              ? 'bg-green-500/10 border border-green-400/20'
              : 'bg-red-500/10 border border-red-400/20'
          }`}
        >
          {referralStatus === 'valid' ? (
            <div className="text-green-400">
              <div className="font-semibold mb-1">✅ Valid referral code!</div>
              <div className="text-sm">You'll receive a $25 bonus when you make your first deposit</div>
            </div>
          ) : (
            <div className="text-red-400">
              <div className="font-semibold mb-1">❌ Invalid referral code</div>
              <div className="text-sm">Please check the code and try again</div>
            </div>
          )}
        </div>
      )}

      <button
        disabled={referralStatus !== 'valid' || !referralCode}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:cursor-not-allowed disabled:transform-none"
      >
        🎁 Apply Referral Code
      </button>
    </div>
  )
}
