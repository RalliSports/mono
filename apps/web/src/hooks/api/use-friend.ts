'use client'

import { FriendsServiceGetFollowers, FriendsServiceGetFollowing, GamesServiceFindOne } from '@repo/server'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, useApiWithAuth } from './base'

export function useFriends(session: string, userId: string) {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  const followerQuery = useQuery({
    queryKey: ['followers', userId],
    queryFn: () =>
      apiClient.get<FriendsServiceGetFollowers[]>(`/api/friends/followers?userId=${userId}`),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })

  const followingQuery = useQuery({
    queryKey: ['following', userId],
    queryFn: () =>
      apiClient.get<FriendsServiceGetFollowing[]>(`/api/friends/following?userId=${userId}`, {
        headers: {
          'x-para-session': session ?? '',
        },
      }),
    staleTime: 30 * 1000, // 30 seconds
  })

  const isFollowingQuery = useQuery({
    queryKey: ['isFollowing', userId],
    queryFn: () =>
      apiClient.get<{ isFollowing: boolean }>(`/api/friends/is-following?userId=${userId}`, {
        headers: {
          'x-para-session': session ?? '',
        },
      }),
    staleTime: 30 * 1000, // 30 seconds
  })

  const toggleMutation = useMutation({
    mutationFn: () => api.post<{ message: string }>(`/api/friends/toggle?userId=${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers'] })
      queryClient.invalidateQueries({ queryKey: ['following'] })
      queryClient.invalidateQueries({ queryKey: ['isFollowing'] })
    },
  })

  return {
    followers: followerQuery,
    following: followingQuery,
    toggle: toggleMutation,
    friend: isFollowingQuery,
  }
}
