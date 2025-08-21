import type { CustomCodeCreatorProps } from './types'

export default function CustomCodeCreator({
  customCode,
  isCheckingCode,
  codeStatus,
  onCodeChange,
  onGenerateRandom,
}: CustomCodeCreatorProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">Create Exclusive Code</h3>
        <button
          onClick={onGenerateRandom}
          className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-semibold"
        >
          🎲 Random
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          value={customCode}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="ENTER-YOUR-CODE"
          maxLength={20}
          className="w-full px-4 py-4 pr-12 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 hover:border-slate-600 font-mono text-lg"
        />

        {/* Status Indicator */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {isCheckingCode ? (
            <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          ) : codeStatus === 'available' ? (
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : codeStatus === 'taken' ? (
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          ) : codeStatus === 'invalid' ? (
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Status Messages */}
      {codeStatus && (
        <div
          className={`p-3 rounded-lg text-sm ${
            codeStatus === 'available'
              ? 'bg-green-500/10 border border-green-400/20 text-green-400'
              : codeStatus === 'taken'
                ? 'bg-red-500/10 border border-red-400/20 text-red-400'
                : 'bg-orange-500/10 border border-orange-400/20 text-orange-400'
          }`}
        >
          {codeStatus === 'available' && '✅ This code is available!'}
          {codeStatus === 'taken' && '❌ This code is already taken'}
          {codeStatus === 'invalid' && '⚠️ Use only letters, numbers, hyphens, and underscores'}
        </div>
      )}

      <div className="text-xs text-slate-500 space-y-1">
        <p>• Code must be 3-20 characters</p>
        <p>• Use letters, numbers, hyphens, and underscores only</p>
        <p>• Get $25 for each friend who joins with your code</p>
      </div>

      <button
        disabled={codeStatus !== 'available' || !customCode}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:cursor-not-allowed disabled:transform-none"
      >
        🚀 Create Code
      </button>
    </div>
  )
}
