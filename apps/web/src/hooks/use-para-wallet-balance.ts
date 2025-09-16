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
    enabled: !!walletAddress && !!account?.isConnected,
    refetchInterval: 30000,
  })

  return {
    isConnected: !!account?.isConnected && !!walletAddress,
    walletAddress,
    balances: {
      ralli: ralliBalanceQuery.data || 0,
    },
    isLoading: ralliBalanceQuery.isLoading,
    error: ralliBalanceQuery.error,
    refetch: () => {
      return ralliBalanceQuery.refetch()
    },
  }
}
