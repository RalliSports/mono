'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import type { Athlete } from './types'

export function useAthletes() {
  const api = useApiWithAuth()

  return useQuery({
    queryKey: ['athletes'],
    queryFn: () => api.get<Athlete[]>('/api/fetch-athletes'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useActiveAthletes() {
  const api = useApiWithAuth()

  return useQuery({
    queryKey: ['active-athletes'],
    queryFn: () => api.get('/api/read-lines-group-athletes'),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useCreateAthlete() {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  return useMutation({
    mutationFn: (data: Omit<Athlete, 'id'>) => api.post<Athlete>('/api/create-athlete', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] })
      queryClient.invalidateQueries({ queryKey: ['active-athletes'] })
    },
  })
}
