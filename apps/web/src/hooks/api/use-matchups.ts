'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import { MatchupsFindAll, MatchupsCreate } from '@repo/server'

export function useMatchups() {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  const query = useQuery({
    queryKey: ['matchups'],
    queryFn: () => api.get<MatchupsFindAll>('/api/read-matchups'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const createMutation = useMutation({
    mutationFn: (data: Omit<MatchupsCreate, 'id'>) => api.post<MatchupsCreate>('/api/create-matchup', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matchups'] })
    },
  })

  const resolveMutation = useMutation({
    mutationFn: (data: { matchupId: string }) => api.post<MatchupsCreate>('/api/resolve-matchup', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matchups'] })
    },
  })

  return {
    query,
    create: createMutation,
    resolve: resolveMutation,
  }
}
