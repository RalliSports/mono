/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiWithAuth } from './api/base'
import { useReferralCode } from './useReferralCode'

interface ReferralStats {
  totalReferrals: number
  completedReferrals: number
  pendingReferrals: number
  referralCode: string
}

interface ReferralResponse {
  code: string
}

interface ReferredUser {
  id: string
  username: string
  emailAddress: string
  status: 'pending' | 'completed'
  referredAt: string
}

export function useReferral() {
  const { referralCode, setReferralCode, clearReferralCode } = useReferralCode()
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  const generateReferralLink = (userCode: string, baseUrl?: string) => {
    const base = baseUrl || window.location.origin
    return `${base}/signin?ref=${userCode}`
  }

  const generateGameReferralLink = (userCode: string, gameId: string, baseUrl?: string) => {
    const base = baseUrl || window.location.origin
    return `${base}/join-game?id=${gameId}&ref=${userCode}`
  }

  // API Queries - automatically fetch data
  const referralCodeQuery = useQuery<ReferralResponse>({
    queryKey: ['referral-code'],
    queryFn: () => api.get('/referral/code').then((res: any) => res.data),
  })

  const referralStatsQuery = useQuery<ReferralStats>({
    queryKey: ['referral-stats'],
    queryFn: () => api.get('/referral/stats').then((res: any) => res.data),
  })

  const referredUsersQuery = useQuery<ReferredUser[]>({
    queryKey: ['referred-users'],
    queryFn: () => api.get('/referral/referred-users').then((res: any) => res.data),
  })

  // API Mutations
  const generateReferralCodeMutation = useMutation<ReferralResponse, Error, void>({
    mutationFn: () => api.post('/referral/generate').then((res: any) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-code'] })
      queryClient.invalidateQueries({ queryKey: ['referral-stats'] })
    },
  })

  const validateReferralCodeMutation = useMutation<{ isValid: boolean }, Error, { code: string }>({
    mutationFn: (data) => api.post('/referral/validate', data).then((res: any) => res.data),
  })

  return {
    // URL/LocalStorage management
    referralCode,
    setReferralCode,
    clearReferralCode,
    generateReferralLink,
    generateGameReferralLink,

    // API Data (automatically fetched)
    userReferralCode: referralCodeQuery.data?.code,
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
