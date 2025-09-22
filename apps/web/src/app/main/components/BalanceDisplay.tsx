import { formatBalance } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import LottieLoading from '@/components/ui/lottie-loading'

interface BalanceDisplayProps {
  isConnected: boolean
  balances: {
    ralli: number
  }
  balanceLoading: boolean
  balanceError: any
}

export default function BalanceDisplay({ isConnected, balances, balanceLoading, balanceError }: BalanceDisplayProps) {
  const router = useRouter()

  return (
    <div
      className="bg-gradient-to-r from-[#00CED1]/20 to-[#FFAB91]/20 border border-[#00CED1]/30 rounded-xl px-4 py-2 backdrop-blur-sm cursor-pointer hover:from-[#00CED1]/30 hover:to-[#FFAB91]/30 transition-all duration-200"
      onClick={() => {
        router.push('/add-funds')
      }}
      title={
        isConnected
          ? `Click to refresh balance\nRALLI: $${formatBalance(balances.ralli)}`
          : 'Connect account to view balance'
      }
    >
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-lg flex items-center justify-center">
          {balanceLoading ? (
            <LottieLoading size="sm" className="w-8 h-8" />
          ) : (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <span className="font-bold text-lg bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
          {isConnected
            ? balanceLoading
              ? 'Loading...'
              : balanceError
                ? '$0.00'
                : `$${formatBalance(balances.ralli)}`
            : '$0.00'}
        </span>
      </div>
    </div>
  )
}
