'use client'

import { useQuery } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import { apiClient } from './base'
import {
  LeaderboardServiceGetLeaderboard,
  LeaderboardServiceGetUserLeaderboardPosition,
  LeaderboardServiceGetTopPerformers,
} from '@repo/server'

export type LeaderboardSortBy = 'winRate' | 'totalWinnings' | 'netProfit' | 'bettingAccuracy'

export function useLeaderboard(page = 1, limit = 50, sortBy: LeaderboardSortBy = 'netProfit') {
  return useQuery({
    queryKey: ['leaderboard', page, limit, sortBy],
    queryFn: () =>
      apiClient.get<LeaderboardServiceGetLeaderboard>(`/api/leaderboard?page=${page}&limit=${limit}&sortBy=${sortBy}`),
    staleTime: 30 * 1000,
  })
}

export function useMyLeaderboardPosition(sortBy: LeaderboardSortBy = 'netProfit', enabled = true) {
  const api = useApiWithAuth()

  return useQuery({
    queryKey: ['my-leaderboard-position', sortBy],
    queryFn: () =>
      api.get<LeaderboardServiceGetUserLeaderboardPosition>(`/api/leaderboard/my-position?sortBy=${sortBy}`),
    staleTime: 60 * 1000,
    enabled,
  })
}

export function useTopPerformers(limit = 10) {
  return useQuery({
    queryKey: ['top-performers', limit],
    queryFn: () => apiClient.get<LeaderboardServiceGetTopPerformers>(`/api/leaderboard/top-performers?limit=${limit}`),
    staleTime: 60 * 1000,
  })
}
