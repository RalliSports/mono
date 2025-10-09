'use client'

import { useState, useEffect } from 'react'
import LottieLoading from '@/components/ui/lottie-loading'

// Components
import { LeaderboardHeader, LeaderboardsList, FilterOptions } from './components'

export type LeaderboardFilter = 'overall' | 'wins' | 'earnings'

export default function LeaderboardsPage() {
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<LeaderboardFilter>('overall')

  // Fix hydration issues
  useEffect(() => {
    // Simulate page loading time
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Show loading screen while page is loading
  if (isPageLoading) {
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
          <FilterOptions activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

          {/* Leaderboards List */}
          <LeaderboardsList filter={activeFilter} />
        </div>
      </div>
    </div>
  )
}
