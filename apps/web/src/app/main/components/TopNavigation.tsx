import BalanceDisplay from './BalanceDisplay'

interface TopNavigationProps {
  onMenuClick: () => void
  isConnected: boolean
  balances: {
    sol: number
    ralli: number
  }
  balanceLoading: boolean
  balanceError: any
}

export default function TopNavigation({
  onMenuClick,
  isConnected,
  balances,
  balanceLoading,
  balanceError,
}: TopNavigationProps) {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white">
            <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">Ralli</span>
          </h1>
        </div>

        {/* Right: Balance + Profile */}
        <div className="flex items-center space-x-3">
          <BalanceDisplay
            isConnected={isConnected}
            balances={balances}
            balanceLoading={balanceLoading}
            balanceError={balanceError}
          />
        </div>
      </div>
    </div>
  )
}
