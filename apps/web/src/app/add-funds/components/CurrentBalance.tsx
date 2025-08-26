import { formatBalance } from '@/lib/utils'

interface CurrentBalanceProps {
  isConnected: boolean
  isLoading: boolean
  error?: string
  balance: number
}

export default function CurrentBalance({ isConnected, isLoading, error, balance }: CurrentBalanceProps) {
  const getDisplayBalance = () => {
    if (!isConnected) return '$0.00'
    if (isLoading) return 'Loading...'
    if (error) return '$0.00'
    return `$${formatBalance(balance)}`
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="text-center">
        <p className="text-slate-400 text-sm mb-2">Current Balance</p>
        <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
          {getDisplayBalance()}
        </p>
      </div>
    </div>
  )
}
