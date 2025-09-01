'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUserData } from '@/providers/user-data-provider'
import { useAccount } from '@getpara/react-sdk'
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { JoinGameLayout, GameHeader, JoinGameButton, ParticipantsList, LoadingSpinner } from './components'
import { useToast } from '@/components/ui/toast'
import { GamesFindOne } from '@repo/server'

function JoinGameContent() {
  const { addToast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [expandedParticipants, setExpandedParticipants] = useState<string[]>([])
  const [game, setGame] = useState<GamesFindOne | null>(null)
  const [mounted, setMounted] = useState(false)
  const [hasCheckedConnection, setHasCheckedConnection] = useState(false)

  // Use auth hooks
  const account = useAccount()
  const { isConnected, isLoading: balanceLoading } = useParaWalletBalance()
  const { user } = useUserData()

  // Get lobby ID from URL
  const lobbyId = searchParams.get('id')

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

      if (!isConnected && !balanceLoading && lobbyId) {
        const callbackUrl = `/join-game?id=${lobbyId}`
        router.push(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
      }
    }, 2000) // Same timeout as main page

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [mounted, isConnected, balanceLoading, hasCheckedConnection, router, lobbyId])

  // Secondary check for account connection
  useEffect(() => {
    if (!mounted) return

    if (hasCheckedConnection && !account?.isConnected && lobbyId) {
      const callbackUrl = `/join-game?id=${lobbyId}`
      router.push(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
    }
  }, [mounted, hasCheckedConnection, account?.isConnected, router, lobbyId])

  // Fetch game data
  useEffect(() => {
    const fetchGame = async () => {
      const response = await fetch(`/api/read-game?id=${lobbyId}`)
      if (response.ok) {
        const data = await response.json()
        setGame(data)
      } else {
        const errorData = await response.json()
        addToast(errorData.error || 'Failed to fetch game', 'error')
      }
    }
    if (lobbyId) {
      fetchGame()
    }
  }, [lobbyId, addToast])

  // Helper function to toggle participant expansion
  const toggleParticipant = (participantId: string) => {
    setExpandedParticipants((prev) =>
      prev.includes(participantId) ? prev.filter((id) => id !== participantId) : [...prev, participantId],
    )
  }

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null
  }

  // Show loading state while checking wallet connection
  const shouldShowLoading = !hasCheckedConnection && (balanceLoading || !isConnected)
  if (shouldShowLoading) {
    return <LoadingSpinner />
  }

  // Show loading while fetching game
  if (!game) return <LoadingSpinner />

  return (
    <JoinGameLayout>
      <GameHeader game={game} />

      <JoinGameButton game={game} user={user ?? null} />

      <ParticipantsList
        game={game}
        expandedParticipants={expandedParticipants}
        onToggleParticipant={toggleParticipant}
      />
    </JoinGameLayout>
  )
}

export default function JoinGamePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <JoinGameContent />
    </Suspense>
  )
}
