'use client'

import { FriendsFollower, FriendsFollowing } from '@repo/server'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, useApiWithAuth } from './base'
import { useSearchParams } from 'next/navigation'

export function useFriends(session: string) {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') ?? ''

  const followerQuery = useQuery({
    queryKey: ['followers'],
    queryFn: () =>
      apiClient.get<FriendsFollower[]>('/api/friends/followers', {
        headers: {
          'x-para-session': session ?? '',
        },
      }),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })

  const followingQuery = useQuery({
    queryKey: ['following'],
    queryFn: () =>
      apiClient.get<FriendsFollowing[]>('/api/friends/following', {
        headers: {
          'x-para-session': session ?? '',
        },
      }),
    staleTime: 30 * 1000, // 30 seconds
  })

  const isFollowingQuery = useQuery({
    queryKey: ['isFollowing'],
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
