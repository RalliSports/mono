'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import { StatsServiceGetAllStats, StatsServiceCreateStat, CreateStatDtoType } from '@repo/server'

export function useStats() {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  const query = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.get<StatsServiceGetAllStats>('/api/read-stats'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateStatDtoType) => api.post<StatsServiceCreateStat>('/api/create-stat', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })

  return {
    query,
    create: createMutation,
  }
}
