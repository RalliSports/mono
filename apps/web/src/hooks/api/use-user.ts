'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import { UserFindOne, UserUpdate, GamesGetMyOpenGames } from '@repo/server'

export function useUser() {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  const currentUserQuery = useQuery({
    queryKey: ['current-user'],
    queryFn: () => api.get<UserFindOne>('/api/read-current-user'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const updateMutation = useMutation({
    mutationFn: (data: UserUpdate) => api.post<UserUpdate>('/api/update-user', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    },
  })

  const myOpenGamesQuery = useQuery({
    queryKey: ['my-open-games'],
    queryFn: () => api.get<GamesGetMyOpenGames[]>('/api/read-my-open-games'),
    staleTime: 30 * 1000, // 30 seconds
  })

  return {
    currentUser: currentUserQuery,
    update: updateMutation,
    myOpenGames: myOpenGamesQuery,
  }
}
