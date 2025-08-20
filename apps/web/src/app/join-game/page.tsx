'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSessionToken } from '@/hooks/use-session'
import { User } from '@repo/db/types'
import { JoinGameLayout, GameHeader, JoinGameButton, ParticipantsList, LoadingSpinner } from './components'
import { Game } from './types'

function JoinGameContent() {
  const searchParams = useSearchParams()
  const [expandedParticipants, setExpandedParticipants] = useState<string[]>([])
  const { session } = useSessionToken()
  const [user, setUser] = useState<User | null>(null)
  const [game, setGame] = useState<Game | null>(null)

  // Get lobby ID from URL
  const lobbyId = searchParams.get('id')

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/read-current-user', {
        headers: {
          'x-para-session': session || '',
        },
      })
      const data = await response.json()
      setUser(data)
    }
    fetchUser()
  }, [session])

  // Fetch game data
  useEffect(() => {
    const fetchGame = async () => {
      const response = await fetch(`/api/read-game?id=${lobbyId}`)
      const data = await response.json()
      setGame(data)
    }
    if (lobbyId) {
      fetchGame()
    }
  }, [lobbyId])

  // Helper function to toggle participant expansion
  const toggleParticipant = (participantId: string) => {
    setExpandedParticipants((prev) =>
      prev.includes(participantId) ? prev.filter((id) => id !== participantId) : [...prev, participantId],
    )
  }

  if (!game) return <LoadingSpinner />

  return (
    <JoinGameLayout>
      <GameHeader game={game} />

      <JoinGameButton game={game} user={user} />

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
