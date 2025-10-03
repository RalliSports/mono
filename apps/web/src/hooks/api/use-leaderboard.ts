'use client'

import { useQuery } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import { apiClient } from './base'
import { LeaderboardResponse, UserLeaderboardPosition, TopPerformersResponse, LeaderboardSortBy } from './types'

export function useLeaderboard(page = 1, limit = 50, sortBy: LeaderboardSortBy = 'netProfit') {
  return useQuery({
    queryKey: ['leaderboard', page, limit, sortBy],
    queryFn: () => apiClient.get<LeaderboardResponse>(`/api/leaderboard?page=${page}&limit=${limit}&sortBy=${sortBy}`),
    staleTime: 30 * 1000,
  })
}

export function useMyLeaderboardPosition(sortBy: LeaderboardSortBy = 'netProfit', enabled = true) {
  const api = useApiWithAuth()

  return useQuery({
    queryKey: ['my-leaderboard-position', sortBy],
    queryFn: () => api.get<UserLeaderboardPosition>(`/api/leaderboard/my-position?sortBy=${sortBy}`),
    staleTime: 60 * 1000,
    enabled,
  })
}

export function useTopPerformers(limit = 10) {
  return useQuery({
    queryKey: ['top-performers', limit],
    queryFn: () => apiClient.get<TopPerformersResponse>(`/api/leaderboard/top-performers?limit=${limit}`),
    staleTime: 60 * 1000,
  })
}
