/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from '@getpara/react-sdk'
import { useSessionToken } from '@/hooks/use-session'
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { Button } from '@/components/ui/button'

// Import modular components
import {
  AdminHeader,
  TabNavigation,
  StatsTab,
  PlayersTab,
  LinesTab,
  ResolveLinesTab,
  ResolveGamesTab,
  MatchupsTab,
  TabType,
} from './components'
import ManualResolveLinesTab from './components/ManualResolveLinesTab'

export default function AdminPage() {
  return <AdminPageContent />
}

function AdminPageContent() {
  const { session } = useSessionToken()
  const router = useRouter()
  const account = useAccount()
  const { isConnected, walletAddress } = useParaWalletBalance()
  const ADMIN_WALLET = '2oNQCTWsVdx8Hxis1Aq6kJhfgh8cdo6Biq6m9nxRTVuk'

  // Hook queries - must be called before any early returns

  // Active tab state
  const [activeTab, setActiveTab] = useState<TabType>('stats')

  // Track authentication state
  const [authState, setAuthState] = useState<'checking' | 'authorized' | 'no-session' | 'no-wallet' | 'unauthorized'>(
    'checking',
  )

  // Add timeout for email loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (authState === 'checking' && session && (account?.isConnected || isConnected)) {
        setAuthState('unauthorized')
      }
    }, 2000) // 5 second timeout

    return () => clearTimeout(timeout)
  }, [authState, session, account?.isConnected, isConnected, walletAddress])

  // Authentication and authorization logic
  useEffect(() => {
    // First check: session
    if (!session) {
      setAuthState('no-session')
      router.push('/signin?callbackUrl=/admin')
      return
    }

    // Second check: wallet connection
    if (!account?.isConnected && !isConnected) {
      setAuthState('no-wallet')
      return
    }

    // Third check: admin wallet address authorization
    if (walletAddress?.toString() !== ADMIN_WALLET) {
      setAuthState('unauthorized')
      return
    }

    // All checks passed
    setAuthState('authorized')
  }, [session, account?.isConnected, isConnected, walletAddress, router, authState])

  // Handle different authentication states
  if (authState === 'checking') {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-medium">Checking if admin...</h2>
        </div>
      </div>
    )
  }

  if (authState === 'no-session') {
    return null // Will redirect to signin
  }

  if (authState === 'no-wallet') {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-medium">Checking wallet connection...</h2>
        </div>
      </div>
    )
  }

  if (authState === 'unauthorized') {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-6">🚫</div>
          <h2 className="text-white text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">You aren&apos;t an admin. Only authorized users can access this page.</p>
          <div className="items-center">
            <Button
              className="mx-auto bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-semibold text-xs sm:text-sm hover:opacity-90 transition-all duration-200 shadow-lg shadow-[#00CED1]/25 hover:shadow-[#00CED1]/40 hover:scale-105 block text-center"
              onClick={() => router.push('/main')}
            >
              Return to Main
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (authState !== 'authorized') {
    return null
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Enhanced Top Navigation Bar */}
      <AdminHeader />

      {/* Main Content */}
      <div className="px-4 pb-20">
        <div className="max-w-6xl mx-auto pt-6">
          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Tab Content */}
          {activeTab === 'stats' && <StatsTab />}

          {activeTab === 'players' && <PlayersTab />}

          {activeTab === 'lines' && <LinesTab />}

          {activeTab === 'resolve-lines' && <ResolveLinesTab />}

          {activeTab === 'manual-resolve-lines' && <ManualResolveLinesTab />}

          {activeTab === 'resolve-games' && <ResolveGamesTab />}

          {activeTab === 'matchups' && <MatchupsTab />}
        </div>
      </div>
    </div>
  )
}
