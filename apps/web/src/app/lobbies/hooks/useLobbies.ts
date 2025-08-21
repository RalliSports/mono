import { useState, useEffect } from 'react'
import { fetchGames } from '@/hooks/get-games'
import type { Lobby } from '@/hooks/get-games'

export const useLobbies = () => {
  const [lobbiesData, setLobbiesData] = useState<Lobby[]>([])
  const [lobbiesError, setLobbiesError] = useState<string | null>(null)
  const [lobbiesLoading, setLobbiesLoading] = useState(true)

  const loadLobbies = async () => {
    try {
      setLobbiesLoading(true)
      setLobbiesError(null)
      const fetchedLobbies = await fetchGames()
      setLobbiesData(fetchedLobbies)
    } catch (error) {
      console.error('Failed to fetch lobbies:', error)
      setLobbiesError(error instanceof Error ? error.message : 'Failed to fetch lobbies')
    } finally {
      setLobbiesLoading(false)
    }
  }

  useEffect(() => {
    loadLobbies()
  }, [])

  const retryFetch = () => {
    setLobbiesError(null)
    loadLobbies()
  }

  return {
    lobbiesData,
    lobbiesError,
    lobbiesLoading,
    retryFetch,
  }
}
