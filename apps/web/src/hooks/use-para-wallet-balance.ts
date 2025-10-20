'use client'

import { useAccount, useWallet, useClient } from '@getpara/react-sdk'
import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { RALLI_TOKEN } from '@/constants'

export function useParaWalletBalance() {
  const account = useAccount()
  const { data: wallet } = useWallet()
  const para = useClient()
  const { connection } = useConnection()

  // ✅ Only compute walletAddress when stable
  const walletAddress = useMemo(() => {
    if (!wallet || !para) return null
    try {
      const addressString = para.getDisplayAddress(wallet.id, {
        truncate: false,
        addressType: wallet.type,
      })
      if (!addressString) return null
      return new PublicKey(addressString)
    } catch (error) {
      console.warn('Failed to parse wallet address:', error)
      return null
    }
  }, [wallet?.id, wallet?.type, para])

  // ✅ Stable query key and conditional fetching
  const ralliBalanceQuery = useQuery({
    queryKey: ['para-ralli-balance', walletAddress?.toBase58() || 'no-wallet'],
    queryFn: async () => {
      if (!walletAddress) return 0
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {
        mint: new PublicKey(RALLI_TOKEN),
      })
      if (tokenAccounts.value.length === 0) return 0
      return tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0
    },
    enabled: !!walletAddress && !!account?.isConnected,
    refetchInterval: 30000,
    staleTime: 10000,
  })

  return {
    isConnected: !!account?.isConnected && !!walletAddress,
    walletAddress,
    balances: {
      ralli: ralliBalanceQuery.data ?? 0,
    },
    isLoading: ralliBalanceQuery.isFetching,
    error: ralliBalanceQuery.error,
    refetch: ralliBalanceQuery.refetch,
  }
}
