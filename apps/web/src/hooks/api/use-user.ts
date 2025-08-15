'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import type { User, UpdateUserData, Game } from './types'

export function useCurrentUser() {
  const api = useApiWithAuth()

  return useQuery({
    queryKey: ['current-user'],
    queryFn: () => api.get<User>('/api/read-current-user'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  return useMutation({
    mutationFn: (data: UpdateUserData) => api.post<User>('/api/update-user', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    },
  })
}

export function useMyOpenGames() {
  const api = useApiWithAuth()

  return useQuery({
    queryKey: ['my-open-games'],
    queryFn: () => api.get<Game[]>('/api/read-my-open-games'),
    staleTime: 30 * 1000, // 30 seconds
  })
}
