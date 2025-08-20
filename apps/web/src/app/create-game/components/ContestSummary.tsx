import { CreatingGameState } from './types'

interface ContestSummaryProps {
  maxParticipants: number
  depositAmount: number
  creatingGameState: CreatingGameState
  onCreateContest: () => void
}

export default function ContestSummary({
  maxParticipants,
  depositAmount,
  creatingGameState,
  onCreateContest,
}: ContestSummaryProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-[#00CED1]/30 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-lg">Contest Summary</h3>
          <p className="text-slate-400 text-sm">Total prize pool and details</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#00CED1] to-orange-400 bg-clip-text text-transparent">
            {maxParticipants}
          </div>
          <div className="text-xs text-slate-400">Max Participants</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#00CED1] to-blue-400 bg-clip-text text-transparent">
            ${depositAmount * maxParticipants}
          </div>
          <div className="text-xs text-slate-400">Total prize pool</div>
        </div>
      </div>

      <button
        onClick={onCreateContest}
        className="relative w-full bg-gradient-to-r from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg overflow-hidden group"
      >
        <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
        <span className="relative z-10 flex items-center justify-center space-x-2">
          <span>🚀</span>
          <span>
            {creatingGameState === 'loading'
              ? 'Creating Contest...'
              : creatingGameState === 'success'
                ? 'Contest Created!'
                : creatingGameState === 'error'
                  ? 'Error Creating Contest'
                  : 'Create Contest'}
          </span>
        </span>
      </button>
    </div>
  )
}
