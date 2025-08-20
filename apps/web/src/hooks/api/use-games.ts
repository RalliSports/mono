'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiWithAuth, apiClient } from './base'
import type { Game, CreateGameData } from './types'

export function useGames() {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  const allGamesQuery = useQuery({
    queryKey: ['games'],
    queryFn: () => apiClient.get<Game[]>('/api/games'),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })

  const openGamesQuery = useQuery({
    queryKey: ['open-games'],
    queryFn: () => apiClient.get<Game[]>('/api/read-open-games'),
    staleTime: 30 * 1000, // 30 seconds
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateGameData) => api.post<Game>('/api/create-game', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['open-games'] })
      queryClient.invalidateQueries({ queryKey: ['my-open-games'] })
    },
  })

  const resolveMutation = useMutation({
    mutationFn: (gameId: string) => api.post(`/api/resolve-game`, { gameId }),
    onSuccess: (_, gameId) => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['game', gameId] })
      queryClient.invalidateQueries({ queryKey: ['open-games'] })
    },
  })

  return {
    all: allGamesQuery,
    open: openGamesQuery,
    create: createMutation,
    resolve: resolveMutation,
  }
}

export function useCurrentGame(gameId: string) {
  // Public endpoint - no auth required
  return useQuery({
    queryKey: ['game', gameId],
    queryFn: () => apiClient.get<Game>(`/api/read-game?id=${gameId}`),
    enabled: !!gameId,
    staleTime: 30 * 1000, // 30 seconds
  })
}
