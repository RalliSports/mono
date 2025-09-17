'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import { LineFindAll, LineResolveInput, MatchupCreateLinesForMatchup } from '@repo/server'

export function useLines() {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  const query = useQuery({
    queryKey: ['lines'],
    queryFn: () => api.get<LineFindAll[]>('/api/read-lines'),
    staleTime: 60 * 1000, // 1 minute
  })

  const createMutation = useMutation({
    mutationFn: (data: Omit<MatchupCreateLinesForMatchup, 'id'>) =>
      api.post<MatchupCreateLinesForMatchup>('/api/create-lines-for-matchup', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lines'] })
      queryClient.invalidateQueries({ queryKey: ['active-athletes'] })
    },
  })

  const resolveMutation = useMutation({
    mutationFn: (data: LineResolveInput) => api.post(`/api/resolve-line`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lines'] })
      queryClient.invalidateQueries({ queryKey: ['active-athletes'] })
    },
  })

  return {
    query,
    create: createMutation,
    resolve: resolveMutation,
  }
}
