import { GamesServiceFindAll } from '@repo/server'
import type { SelectedPick } from './types'

interface PaymentPopupProps {
  showPaymentPopup: boolean
  paymentSuccess: boolean
  isPaymentProcessing: boolean
  isSubmittingPayment: boolean
  game: GamesServiceFindAll[number]
  selectedPicks: SelectedPick[]
  buyIn: number
  gameName: string
  onPaymentConfirm: () => void
  onPaymentCancel: () => void
}

export default function PaymentPopup({
  showPaymentPopup,
  paymentSuccess,
  isPaymentProcessing,
  isSubmittingPayment,
  game,
  selectedPicks,
  buyIn,
  gameName,
  onPaymentConfirm,
  onPaymentCancel,
}: PaymentPopupProps) {
  if (!showPaymentPopup) return null

  const legsRequired = game?.numBets || 4

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 mx-4 w-full max-w-md shadow-2xl">
        {!paymentSuccess ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00CED1] to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Confirm Your Entry</h3>
              <p className="text-slate-400 text-sm">
                {gameName} • {selectedPicks.length} picks selected
              </p>
            </div>

            <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Buy-in Amount</span>
                <span className="text-white font-bold text-lg">${buyIn}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Picks Selected</span>
                <span className="text-slate-400">
                  {selectedPicks.length} of {legsRequired}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Potential Payout</span>
                <span className="text-emerald-400 font-bold">~${Math.round(buyIn * (game.maxParticipants || 0))}</span>
              </div>
            </div>

            {!isPaymentProcessing ? (
              <div className="flex gap-3">
                <button
                  onClick={onPaymentCancel}
                  className="flex-1 bg-slate-700/50 border border-slate-600/50 text-white font-semibold py-3 px-4 rounded-xl hover:bg-slate-600/50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={onPaymentConfirm}
                  disabled={isSubmittingPayment}
                  className="flex-1 bg-gradient-to-r from-[#00CED1] to-blue-500 text-white font-bold py-3 px-4 rounded-xl hover:from-[#00CED1]/90 hover:to-blue-500/90 transition-all duration-300"
                >
                  {isSubmittingPayment ? 'Processing...' : `Pay $${buyIn}`}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00CED1]"></div>
                <span className="ml-3 text-slate-300">Processing payment...</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Payment Successful!</h3>
            <p className="text-slate-400 text-sm mb-6">Your picks are locked in. Good luck!</p>
          </div>
        )}
      </div>
    </div>
  )
}
