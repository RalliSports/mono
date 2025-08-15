'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import type { Stat } from './types'

export function useStats() {
  const api = useApiWithAuth()

  return useQuery({
    queryKey: ['stats'],
    queryFn: () => api.get<Stat[]>('/api/read-stats'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateStat() {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  return useMutation({
    mutationFn: (data: Omit<Stat, 'id'>) => api.post<Stat>('/api/create-stat', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}
