import Image from 'next/image'
import type { SelectedPick } from './types'

interface BottomSelectionCartProps {
  selectedPicks: SelectedPick[]
  legsRequired: number
  buyIn: number
  isConfirming: boolean
  onRemovePick: (pickId: string) => void
  onConfirmPicks: () => void
}

export default function BottomSelectionCart({
  selectedPicks,
  legsRequired,
  buyIn,
  isConfirming,
  onRemovePick,
  onConfirmPicks,
}: BottomSelectionCartProps) {
  if (selectedPicks.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-3 shadow-2xl max-w-md mx-auto">
      <div className="flex flex-col space-y-3">
        {/* Compact Avatar Stack */}
        <div className="flex justify-center space-x-1.5 max-w-full overflow-x-auto pb-1">
          {Array.from({ length: legsRequired }).map((_, index) => {
            const pick = selectedPicks[index]

            return (
              <div key={index} className="text-center min-w-[45px]">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative ${
                    pick
                      ? 'bg-gradient-to-br from-[#00CED1] to-[#FFAB91] border-white text-white shadow-lg'
                      : 'bg-slate-800/50 border-slate-600/50 text-slate-400'
                  }`}
                >
                  {pick ? (
                    <>
                      <Image
                        src={pick.picture}
                        alt={pick.athleteId}
                        className="w-10 h-10 object-cover rounded-lg"
                        width={24}
                        height={24}
                      />
                      <button
                        onClick={() => onRemovePick(pick.lineId)}
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <span className="text-sm">?</span>
                  )}
                </div>
                {pick && (
                  <div className="text-[#00CED1] text-xs mt-0.5 font-semibold truncate max-w-[45px]">
                    {pick.predictedDirection}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Compact Confirm Button */}
        <button
          onClick={onConfirmPicks}
          disabled={selectedPicks.length !== legsRequired || isConfirming}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
            selectedPicks.length === legsRequired && !isConfirming
              ? 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
              : isConfirming
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                : 'bg-slate-800/50 border border-slate-600/50 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isConfirming ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Selection Confirmed!</span>
            </div>
          ) : selectedPicks.length === legsRequired ? (
            `Confirm Picks • $${buyIn}`
          ) : (
            `${legsRequired - selectedPicks.length} more`
          )}
        </button>
      </div>
    </div>
  )
}
