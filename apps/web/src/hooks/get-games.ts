'use client'

import { useQuery } from '@tanstack/react-query'

//send api request to /api/games
export const fetchGames = async () => {
  const response = await fetch(`/api/games`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: 60, // Revalidate every 60 seconds
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch games')
  }

  const games = await response.json()

  return games
}

// New hook version
export function useLobbies() {
  return useQuery({
    queryKey: ['lobbies'],
    queryFn: fetchGames,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}
