'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import type { Line } from './types'

export function useLines() {
  const api = useApiWithAuth()

  return useQuery({
    queryKey: ['lines'],
    queryFn: () => api.get<Line[]>('/api/read-lines'),
    staleTime: 60 * 1000, // 1 minute
  })
}

export function useCreateLine() {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  return useMutation({
    mutationFn: (data: Omit<Line, 'id'>) => api.post<Line>('/api/create-line', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lines'] })
      queryClient.invalidateQueries({ queryKey: ['active-athletes'] })
    },
  })
}

export function useResolveLine() {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  return useMutation({
    mutationFn: (lineId: string) => api.post(`/api/resolve-line`, { lineId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lines'] })
      queryClient.invalidateQueries({ queryKey: ['active-athletes'] })
    },
  })
}
