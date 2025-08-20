import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Game } from '../components/types'

export const useGameData = () => {
  const searchParams = useSearchParams()
  const [expandedParticipants, setExpandedParticipants] = useState<string[]>([])
  const [lobby, setLobby] = useState<Game | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Get lobby ID from URL
  const lobbyId = searchParams.get('id')

  useEffect(() => {
    const fetchGame = async () => {
      if (!lobbyId) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/read-game?id=${lobbyId}`)
        const data = await response.json()
        setLobby(data)
      } catch (error) {
        console.error('Error fetching game:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGame()
  }, [lobbyId])

  // Helper function to toggle participant expansion
  const toggleParticipant = (participantId: string) => {
    setExpandedParticipants((prev) =>
      prev.includes(participantId) ? prev.filter((id) => id !== participantId) : [...prev, participantId],
    )
  }

  const isParticipantExpanded = (participantId: string) => expandedParticipants.includes(participantId)

  return {
    lobby,
    isLoading,
    expandedParticipants,
    toggleParticipant,
    isParticipantExpanded,
  }
}
