'use client'

import { Suspense, useEffect, useState } from 'react'
import { TopNavigation, GameHeader, GameStats, ParticipantsList, LoadingSpinner } from './components'
import { useGameData } from './hooks/useGameData'
import JoinGameButton from './components/JoinGameButton'
import { useUserData } from '@/providers/user-data-provider'
import { useAccount } from '@getpara/react-sdk'
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { useRouter } from 'next/navigation'

function ViewGameContent() {
  const { lobby, isLoading, expandedParticipants, toggleParticipant } = useGameData()
  const { user } = useUserData()
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [hasCheckedConnection, setHasCheckedConnection] = useState(false)

  // Use auth hooks
  const account = useAccount()
  const { isConnected, isLoading: balanceLoading } = useParaWalletBalance()

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])
  // Handle wallet connection with callback URL for join-game
  useEffect(() => {
    if (!mounted) return

    // If we're connected, mark as checked
    if (isConnected) {
      setHasCheckedConnection(true)
      return
    }

    // Don't check again if we've already performed a connection check
    if (hasCheckedConnection) return

    // Don't redirect if still loading
    if (balanceLoading) return

    // Wait for connection to establish, then redirect with callback URL if not connected
    const timeoutId = setTimeout(() => {
      setHasCheckedConnection(true)

      if (!isConnected && !balanceLoading && lobby?.id) {
        const callbackUrl = `/game?id=${lobby?.id}`
        router.push(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
      }
    }, 2000) // Same timeout as main page

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [mounted, isConnected, balanceLoading, hasCheckedConnection, router, lobby])

  // Secondary check for account connection
  useEffect(() => {
    if (!mounted) return

    if (hasCheckedConnection && !account?.isConnected && lobby?.id) {
      const callbackUrl = `/game?id=${lobby?.id}`
      router.push(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
    }
  }, [mounted, hasCheckedConnection, account?.isConnected, router, lobby])

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading game...</p>
        </div>
      </div>
    )
  }

  if (!lobby) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Game not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <TopNavigation />

      {/* Main Content */}
      <div className="px-4 pb-20">
        <GameHeader lobby={lobby} />
        <GameStats lobby={lobby} />
        <JoinGameButton game={lobby} user={user ?? null} />

        <ParticipantsList
          lobby={lobby}
          expandedParticipants={expandedParticipants}
          toggleParticipant={toggleParticipant}
        />
      </div>
    </div>
  )
}

export default function JoinGamePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ViewGameContent />
    </Suspense>
  )
}
