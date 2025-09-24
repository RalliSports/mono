import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useReferralCode } from './useReferralCode'
import { useSessionToken } from './use-session'
import { apiClient } from './api/base'
import {
  ReferralServiceGetReferralCode,
  ReferralServiceGetReferralStats,
  ReferralServiceGenerateReferralCode,
  ReferralServiceFindAllReferredUsers,
} from '@repo/server'

export function useReferral() {
  const { referralCode, setReferralCode, clearReferralCode } = useReferralCode()
  const queryClient = useQueryClient()
  const { session } = useSessionToken()

  // Create a separate API client for fetching user's own referral code
  // This avoids circular dependency since we don't need to include referral codes in headers
  const fetchUserReferralCode = async () => {
    if (!session) throw new Error('No session')

    console.log('Fetching user referral code with session:', session.substring(0, 10) + '...')

    const response = await apiClient.request<ReferralServiceGetReferralCode>('/api/referral/code', {
      method: 'GET',
      headers: {
        'x-para-session': session,
      },
    })

    console.log('Referral code response:', response)
    return response
  }

  const generateReferralLink = (userCode: string, baseUrl?: string) => {
    const base = baseUrl || window.location.origin
    return `${base}/signin?ref=${userCode}`
  }

  const generateGameReferralLink = (userCode: string, gameId: string, baseUrl?: string) => {
    const base = baseUrl || window.location.origin
    return `${base}/join-game?id=${gameId}&ref=${userCode}`
  }

  // API Queries - automatically fetch data
  const referralCodeQuery = useQuery<ReferralServiceGetReferralCode>({
    queryKey: ['referral-code'],
    queryFn: fetchUserReferralCode,
    enabled: !!session, // Only run when we have a session
  })

  const referralStatsQuery = useQuery<ReferralServiceGetReferralStats>({
    queryKey: ['referral-stats'],
    queryFn: async () => {
      if (!session) throw new Error('No session')
      return apiClient.request<ReferralServiceGetReferralStats>('/api/referral/stats', {
        method: 'GET',
        headers: {
          'x-para-session': session,
        },
      })
    },
    enabled: !!session,
  })

  const referredUsersQuery = useQuery<ReferralServiceFindAllReferredUsers[]>({
    queryKey: ['referred-users'],
    queryFn: async () => {
      if (!session) throw new Error('No session')
      return apiClient.request<ReferralServiceFindAllReferredUsers[]>('/api/referral/referred-users', {
        method: 'GET',
        headers: {
          'x-para-session': session,
        },
      })
    },
    enabled: !!session,
  })

  // API Mutations
  const generateReferralCodeMutation = useMutation<ReferralServiceGenerateReferralCode, Error, void>({
    mutationFn: async () => {
      if (!session) throw new Error('No session')
      return apiClient.request<ReferralServiceGenerateReferralCode>('/api/referral/generate', {
        method: 'POST',
        headers: {
          'x-para-session': session,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-code'] })
      queryClient.invalidateQueries({ queryKey: ['referral-stats'] })
    },
  })

  const validateReferralCodeMutation = useMutation<{ isValid: boolean }, Error, { code: string }>({
    mutationFn: async (data) => {
      if (!session) throw new Error('No session')
      return apiClient.request<{ isValid: boolean }>('/api/referral/validate', {
        method: 'POST',
        headers: {
          'x-para-session': session,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    },
  })

  return {
    // URL/LocalStorage management
    referralCode,
    setReferralCode,
    clearReferralCode,
    generateReferralLink,
    generateGameReferralLink,

    // API Data (automatically fetched)
    userReferralCode: referralCodeQuery.data,
    referralStats: referralStatsQuery.data,
    referredUsers: referredUsersQuery.data,

    // API Loading States
    isLoadingCode: referralCodeQuery.isLoading,
    isLoadingStats: referralStatsQuery.isLoading,
    isLoadingUsers: referredUsersQuery.isLoading,

    // API Error States
    codeError: referralCodeQuery.error,
    statsError: referralStatsQuery.error,
    usersError: referredUsersQuery.error,

    // API Actions
    generateReferralCode: generateReferralCodeMutation.mutate,
    isGeneratingCode: generateReferralCodeMutation.isPending,
    validateReferralCode: validateReferralCodeMutation.mutate,
    isValidatingCode: validateReferralCodeMutation.isPending,

    // Refetch functions
    refetchCode: referralCodeQuery.refetch,
    refetchStats: referralStatsQuery.refetch,
    refetchUsers: referredUsersQuery.refetch,
  }
}
