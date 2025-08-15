'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import type { Matchup } from './types'

export function useMatchups() {
  const api = useApiWithAuth()

  return useQuery({
    queryKey: ['matchups'],
    queryFn: () => api.get<Matchup[]>('/api/read-matchups'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useCreateMatchup() {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  return useMutation({
    mutationFn: (data: Omit<Matchup, 'id'>) => api.post<Matchup>('/api/create-matchup', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matchups'] })
    },
  })
}
