import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TopNavigationProps {
  isConnected: boolean
  balances: { ralli: number }
  balanceLoading: boolean
  balanceError?: string
  formatBalance: (amount: number) => string
}

export default function TopNavigation({
  isConnected,
  balances,
  balanceLoading,
  balanceError,
  formatBalance,
}: TopNavigationProps) {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Back Button + Title */}
        <div className="flex items-center space-x-3">
          <Link
            href="/main"
            className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-white">
            <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
              My Profile
            </span>
          </h1>
        </div>

        {/* Right: Balance + Profile */}
        <div className="flex items-center space-x-3">
          <div
            className="bg-gradient-to-r from-[#00CED1]/20 to-[#FFAB91]/20 border border-[#00CED1]/30 rounded-xl px-4 py-2 backdrop-blur-sm cursor-pointer hover:from-[#00CED1]/30 hover:to-[#FFAB91]/30 transition-all duration-200"
            onClick={() => {
              router.push('/add-funds')
            }}
            title={
              isConnected
                ? `Click to refresh balance\nRALLI: $${formatBalance(balances.ralli)}`
                : 'Connect wallet to view balance'
            }
          >
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-lg flex items-center justify-center">
                {balanceLoading ? (
                  <div className="w-3 h-3 border-[1.5px] border-white/20 border-t-white rounded-full animate-spin"></div>
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
                      ? 'Error'
                      : balances.ralli === 0
                        ? 'Top Up'
                        : `$${formatBalance(balances.ralli)}`
                  : '$0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
