'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import { AthletesFindAll, AthletesCreate } from '@repo/server'

export function useAthletes() {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  const allQuery = useQuery({
    queryKey: ['athletes'],
    queryFn: () => api.get<AthletesFindAll[]>('/api/fetch-athletes'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const activeQuery = useQuery({
    queryKey: ['active-athletes'],
    queryFn: () => api.get('/api/read-lines-group-athletes'),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  const createMutation = useMutation({
    mutationFn: (data: Omit<AthletesCreate, 'id'>) => api.post<AthletesCreate>('/api/create-athlete', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] })
      queryClient.invalidateQueries({ queryKey: ['active-athletes'] })
    },
  })

  return {
    all: allQuery,
    active: activeQuery,
    create: createMutation,
  }
}
