'use client'

import { useQuery } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import type { Team } from './types'

export function useTeams() {
  // Protected endpoint - auth required
  const api = useApiWithAuth()

  return useQuery({
    queryKey: ['teams'],
    queryFn: () => api.get<Team[]>('/api/read-teams'),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}
