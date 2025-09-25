'use client'

import { useState, useEffect } from 'react'
import { useSessionToken } from '@/hooks/use-session'
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { useRouter } from 'next/navigation'
import LottieLoading from '@/components/ui/lottie-loading'

// Components
import { LeaderboardHeader, LeaderboardsList, FilterOptions } from './components'

export type LeaderboardFilter = 'overall' | 'wins' | 'earnings' | 'sports'
export type SportFilter = 'all' | 'nfl' | 'nba' | 'mlb' | 'nhl'

export default function LeaderboardsPage() {
  const router = useRouter()
  const { session } = useSessionToken()
  const { isConnected } = useParaWalletBalance()

  const [mounted, setMounted] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<LeaderboardFilter>('overall')
  const [sportFilter, setSportFilter] = useState<SportFilter>('all')

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
    // Simulate page loading time
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Handle wallet connection redirect
  useEffect(() => {
    if (!mounted) return

    const timeoutId = setTimeout(() => {
      if (!isConnected) {
        router.push('/signin')
      }
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [isConnected, mounted, router])

  // Show loading screen while page is loading
  if (!mounted || isPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <LottieLoading message="Loading Leaderboards..." subMessage="Fetching player rankings and stats" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <LeaderboardHeader />

      {/* Main Content */}
      <div className="px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Filter Options */}
          <FilterOptions
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            sportFilter={sportFilter}
            setSportFilter={setSportFilter}
          />

          {/* Leaderboards List */}
          <LeaderboardsList filter={activeFilter} sportFilter={sportFilter} />
        </div>
      </div>
    </div>
  )
}
