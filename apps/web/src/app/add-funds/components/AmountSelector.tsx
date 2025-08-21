interface AmountSelectorProps {
  amount: string
  onAmountChange: (amount: string) => void
  quickAmounts?: number[]
}

export default function AmountSelector({
  amount,
  onAmountChange,
  quickAmounts = [10, 25, 50, 100, 250, 500],
}: AmountSelectorProps) {
  const handleQuickAmount = (quickAmount: number) => {
    onAmountChange(quickAmount.toString())
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-6">
      <div>
        <h3 className="text-white font-bold text-lg mb-4">Select Amount</h3>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => handleQuickAmount(quickAmount)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                amount === quickAmount.toString()
                  ? 'border-emerald-400 bg-emerald-400/10 shadow-lg'
                  : 'border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50'
              }`}
            >
              <span className="text-white font-semibold">${quickAmount}</span>
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 font-bold text-lg">
            $
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="Enter custom amount"
            className="w-full pl-10 pr-4 py-4 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 hover:border-slate-600"
          />
        </div>
      </div>
    </div>
  )
}
