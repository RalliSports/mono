'use client'

import { useQuery } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import { TeamGetAll } from '@repo/server'

export function useTeams() {
  // Protected endpoint - auth required
  const api = useApiWithAuth()

  return useQuery({
    queryKey: ['teams'],
    queryFn: () => api.get<TeamGetAll>('/api/read-teams'),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}
