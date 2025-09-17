import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui/toast'
import { GamesFindOne } from '@repo/server'

export const useGameData = () => {
  const { addToast } = useToast()
  const searchParams = useSearchParams()
  const [expandedParticipants, setExpandedParticipants] = useState<string[]>([])
  const [lobby, setLobby] = useState<GamesFindOne | null>(null)
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
        if (response.ok) {
          const data = await response.json()
          setLobby(data)
        } else {
          const errorData = await response.json()
          addToast(errorData.error || 'Failed to fetch game', 'error')
        }
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
