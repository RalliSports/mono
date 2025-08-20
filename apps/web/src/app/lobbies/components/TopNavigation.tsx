import { useRouter } from 'next/navigation'
import { ParaButton } from '@/components/para-modal'
import BalanceDisplay from './BalanceDisplay'
import ProfileDropdown from './ProfileDropdown'
import type { User } from './types'

interface TopNavigationProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
  isProfileDropdownOpen: boolean
  setIsProfileDropdownOpen: (open: boolean) => void
  user: User | null
  balanceProps: {
    isConnected: boolean
    balances: {
      sol: number
      ralli: number
      totalUsd: number
    }
    isLoading: boolean
    error: any
    refetch: () => void
  }
}

export default function TopNavigation({
  isSidebarOpen,
  setIsSidebarOpen,
  isProfileDropdownOpen,
  setIsProfileDropdownOpen,
  user,
  balanceProps,
}: TopNavigationProps) {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Back Button + Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push('/main')}
            className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors lg:hidden"
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
            <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
              All Lobbies
            </span>
          </h1>
        </div>

        {/* Right: Balance + Profile */}
        <div className="flex items-center space-x-3">
          {/* Balance Display */}
          <BalanceDisplay {...balanceProps} />

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            <ParaButton />
            <ProfileDropdown
              isOpen={isProfileDropdownOpen}
              onClose={() => setIsProfileDropdownOpen(false)}
              user={user}
              onNavigateToProfile={() => router.push('/profile')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
