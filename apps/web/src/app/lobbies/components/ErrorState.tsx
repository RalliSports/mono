import type { ErrorStateProps } from './types'

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Failed to load lobbies</h2>
        <p className="text-slate-400 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
