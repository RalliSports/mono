'use client'

import React, { createContext, useContext, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAccount, useWallet, useClient } from '@getpara/react-sdk'
import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useMemo } from 'react'
import { RALLI_TOKEN, USDC_MINT } from '@/constants'
import { useUser } from '@/hooks/api/use-user'
import { useLobbies as useLobbiesHook, type Lobby } from '@/hooks/get-games'
import type { Game, UpdateUserData } from '@/hooks/api/types'
import type { User } from '@/app/main/components/types.ts'

interface WalletBalances {
  sol: number
  usdc: number
  ralli: number
  totalUsd: number
}

interface UserData {
  user: User | null
  walletAddress: PublicKey | null
  balances: WalletBalances
  myOpenGames: Game[]
  lobbies: Lobby[]
  isConnected: boolean
  isLoading: boolean
  error: Error | null
  emailAddress: string 
  hasBeenFaucetedSol: boolean
}

interface UserDataContextType extends UserData {
  refetchWalletBalances: () => void
  refetchUserData: () => void
  refetchLobbies: () => void
  refetchMyGames: () => void
  refetchAll: () => void
  updateUser: (data: UpdateUserData) => Promise<User>
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined)

function useSolPrice() {
  return useQuery({
    queryKey: ['sol-price'],
    queryFn: async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
      const data = await response.json()
      return data?.solana?.usd ?? 0
    },
    refetchInterval: 30000,
    staleTime: 30000,
  })
}

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const account = useAccount()
  const { data: wallet } = useWallet()
  const para = useClient()
  const { connection } = useConnection()
  const { data: solPriceUsd = 0 } = useSolPrice()

  // Use existing hooks instead of duplicating logic
  const userHooks = useUser()

  const walletAddress = useMemo(() => {
    if (!wallet || !para) return null
    try {
      const addressString = para.getDisplayAddress(wallet.id, {
        truncate: false,
        addressType: wallet.type,
      })
      return new PublicKey(addressString)
    } catch (error) {
      console.error('Error parsing wallet address:', error)
      return null
    }
  }, [wallet, para])

  const isConnected = !!account?.isConnected && !!walletAddress

  const lobbiesQuery = useLobbiesHook()

  const solBalanceQuery = useQuery({
    queryKey: ['para-sol-balance', walletAddress?.toString()],
    queryFn: async () => {
      if (!walletAddress) return 0
      const balance = await connection.getBalance(walletAddress)
      return balance / LAMPORTS_PER_SOL
    },
    enabled: isConnected,
    refetchInterval: 30000,
    staleTime: 30000,
  })

  const usdcBalanceQuery = useQuery({
    queryKey: ['para-usdc-balance', walletAddress?.toString()],
    queryFn: async () => {
      if (!walletAddress) return 0
      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {
          mint: new PublicKey(USDC_MINT),
        })
        if (tokenAccounts.value.length === 0) return 0
        const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount
        return balance || 0
      } catch (error) {
        console.error('Error fetching USDC balance:', error)
        return 0
      }
    },
    enabled: isConnected,
    refetchInterval: 30000,
    staleTime: 30000,
  })

  const ralliBalanceQuery = useQuery({
    queryKey: ['para-ralli-balance', walletAddress?.toString()],
    queryFn: async () => {
      if (!walletAddress) return 0
      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {
          mint: new PublicKey(RALLI_TOKEN),
        })
        if (tokenAccounts.value.length === 0) return 0
        const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount
        return balance || 0
      } catch (error) {
        console.error('Error fetching RALLI balance:', error)
        return 0
      }
    },
    enabled: isConnected,
    refetchInterval: 30000,
    staleTime: 30000,
  })

  const balances: WalletBalances = useMemo(() => {
    const sol = solBalanceQuery.data || 0
    const usdc = usdcBalanceQuery.data || 0
    const ralli = ralliBalanceQuery.data || 0
    const totalUsd = sol * solPriceUsd + usdc

    return { sol, usdc, ralli, totalUsd }
  }, [solBalanceQuery.data, usdcBalanceQuery.data, ralliBalanceQuery.data, solPriceUsd])

  const isLoading =
    userHooks.currentUser.isLoading ||
    userHooks.myOpenGames.isLoading ||
    lobbiesQuery.isLoading ||
    solBalanceQuery.isLoading ||
    usdcBalanceQuery.isLoading ||
    ralliBalanceQuery.isLoading

  const error =
    userHooks.currentUser.error ||
    userHooks.myOpenGames.error ||
    lobbiesQuery.error ||
    solBalanceQuery.error ||
    usdcBalanceQuery.error ||
    ralliBalanceQuery.error

  const refetchWalletBalances = useCallback(() => {
    solBalanceQuery.refetch()
    usdcBalanceQuery.refetch()
    ralliBalanceQuery.refetch()
  }, [solBalanceQuery, usdcBalanceQuery, ralliBalanceQuery])

  const refetchUserData = useCallback(() => {
    userHooks.currentUser.refetch()
  }, [userHooks.currentUser])

  const refetchLobbies = useCallback(() => {
    lobbiesQuery.refetch()
  }, [lobbiesQuery])

  const refetchMyGames = useCallback(() => {
    userHooks.myOpenGames.refetch()
  }, [userHooks.myOpenGames])

  const refetchAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['current-user'] })
    queryClient.invalidateQueries({ queryKey: ['my-open-games'] })
    queryClient.invalidateQueries({ queryKey: ['lobbies'] })
    queryClient.invalidateQueries({ queryKey: ['para-sol-balance'] })
    queryClient.invalidateQueries({ queryKey: ['para-usdc-balance'] })
    queryClient.invalidateQueries({ queryKey: ['para-ralli-balance'] })
  }, [queryClient])

  const contextValue: UserDataContextType = {
    user: userHooks.currentUser.data || null,
    walletAddress,
    balances,
    myOpenGames: userHooks.myOpenGames.data || [],
    lobbies: lobbiesQuery.data || [],
    isConnected,
    isLoading,
    error: error as Error | null,
    refetchWalletBalances,
    refetchUserData,
    refetchLobbies,
    refetchMyGames,
    refetchAll,
    hasBeenFaucetedSol: userHooks.currentUser.data?.hasBeenFaucetedSol || false,
    updateUser: userHooks.update.mutateAsync,
    emailAddress: userHooks.currentUser.data?.emailAddress || '',
  }

  return <UserDataContext.Provider value={contextValue}>{children}</UserDataContext.Provider>
}

export function useUserData() {
  const context = useContext(UserDataContext)
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider')
  }
  return context
}

export function useWalletBalances() {
  const { balances, refetchWalletBalances, isLoading, error } = useUserData()
  return {
    balances,
    refetch: refetchWalletBalances,
    isLoading,
    error,
  }
}

export function useCurrentUser() {
  const { user, refetchUserData, isLoading, error } = useUserData()
  return {
    user,
    refetch: refetchUserData,
    isLoading,
    error,
  }
}

export function useLobbies() {
  const { lobbies, refetchLobbies, isLoading, error } = useUserData()
  return {
    data: lobbies,
    refetch: refetchLobbies,
    isLoading,
    error,
  }
}

export function useMyGames() {
  const { myOpenGames, refetchMyGames, isLoading, error } = useUserData()
  return {
    data: myOpenGames,
    refetch: refetchMyGames,
    isLoading,
    error,
  }
}
