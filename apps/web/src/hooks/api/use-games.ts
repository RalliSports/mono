'use client'

import {
  CreateGameDtoType,
  GamesServiceCreate,
  GamesServiceFindAll,
  GamesServiceFindAllOpen,
  GamesServiceFindOne
} from '@repo/server'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, useApiWithAuth } from './base'

export function useGames() {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  const allGamesQuery = useQuery({
    queryKey: ['games'],
    queryFn: () => apiClient.get<GamesServiceFindAll>('/api/games'),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })

  const openGamesQuery = useQuery({
    queryKey: ['open-games'],
    queryFn: () => apiClient.get<GamesServiceFindAllOpen>('/api/read-open-games'),
    staleTime: 30 * 1000, // 30 seconds
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateGameDtoType) => api.post<GamesServiceCreate>('/api/create-game', data),
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

  const resolveAllPossibleGamesMutation = useMutation({
    mutationFn: () => api.patch(`/api/resolve-all-possible-games`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['open-games'] })
    },
  })

   const gameInviteMutation = useMutation({
    mutationFn: (data:  { userId: string, gameId: string }) => api.post('/api/game-invite', data),
  })

  return {
    all: allGamesQuery,
    open: openGamesQuery,
    create: createMutation,
    resolve: resolveMutation,
    resolveAllPossibleGames: resolveAllPossibleGamesMutation,
    gameInvite: gameInviteMutation
  }
}

export function useCurrentGame(gameId: string) {
  // Public endpoint - no auth required
  return useQuery({
    queryKey: ['game', gameId],
    queryFn: () => apiClient.get<GamesServiceFindOne>(`/api/read-game?id=${gameId}`),
    enabled: !!gameId,
    staleTime: 30 * 1000, // 30 seconds
  })
}
