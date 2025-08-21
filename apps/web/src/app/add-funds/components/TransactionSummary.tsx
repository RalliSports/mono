import { PaymentMethod, PaymentMethodType } from './types'

interface TransactionSummaryProps {
  amount: string
  selectedMethod: PaymentMethodType
  paymentMethods: PaymentMethod[]
  isLoading: boolean
  onAddFunds: () => void
  showSummary?: boolean // Toggle between simple and detailed view
}

export default function TransactionSummary({
  amount,
  selectedMethod,
  paymentMethods,
  isLoading,
  onAddFunds,
  showSummary = false,
}: TransactionSummaryProps) {
  const selectedPaymentMethod = paymentMethods.find((m) => m.id === selectedMethod)

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-emerald-400/30 rounded-2xl p-6 shadow-2xl">
      {showSummary && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold text-lg">Transaction Summary</h3>
              <p className="text-slate-400 text-sm">Review your deposit</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                ${amount || '0'}
              </div>
              <div className="text-xs text-slate-400">Deposit amount</div>
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Amount:</span>
              <span className="text-white">${amount || '0'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Fee:</span>
              <span className="text-emerald-400">{selectedPaymentMethod?.fee || 'Free'}</span>
            </div>
            <div className="border-t border-slate-600 pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-white">Total:</span>
                <span className="text-emerald-400">${amount || '0'}</span>
              </div>
            </div>
          </div>
        </>
      )}

      <button
        onClick={onAddFunds}
        disabled={isLoading}
        className="relative w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg overflow-hidden group disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
        <span className="relative z-10 flex items-center justify-center space-x-2">
          <span>💳</span>
          <span>{isLoading ? 'Processing...' : 'Add Funds'}</span>
        </span>
      </button>
    </div>
  )
}
