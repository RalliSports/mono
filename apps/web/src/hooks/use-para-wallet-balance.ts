'use client'

import { useAccount, useWallet, useClient } from '@getpara/react-sdk'
import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { USDC_MINT } from '@/constants'

function useSolPrice() {
  return useQuery({
    queryKey: ['sol-price'],
    queryFn: async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
      const data = await response.json()
      return data?.solana?.usd ?? 0
    },
    refetchInterval: 30000,
  })
}

export function useParaWalletBalance() {
  const account = useAccount()
  const { data: wallet } = useWallet()
  const para = useClient()
  const { connection } = useConnection()
  const { data: solPriceUsd = 0, isLoading: isPriceLoading, error: priceError } = useSolPrice()

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

  const solBalanceQuery = useQuery({
    queryKey: ['para-sol-balance', walletAddress?.toString()],
    queryFn: async () => {
      if (!walletAddress) return 0
      const balance = await connection.getBalance(walletAddress)
      return balance / LAMPORTS_PER_SOL
    },
    enabled: !!walletAddress && !!account?.isConnected,
    refetchInterval: 30000,
  })

  const usdcBalanceQuery = useQuery({
    queryKey: ['para-usdc-balance', walletAddress?.toString()],
    queryFn: async () => {
      if (!walletAddress) return 0
      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {
          mint: new PublicKey(USDC_MINT),
        })

        console.log('tokenAccounts', tokenAccounts)

        if (tokenAccounts.value.length === 0) return 0

        const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount
        return balance || 0
      } catch (error) {
        console.error('Error fetching USDC balance:', error)
        return 0
      }
    },
    enabled: !!walletAddress && !!account?.isConnected,
    refetchInterval: 30000,
  })

  const totalUsdBalance = useMemo(() => {
    const solBalance = solBalanceQuery.data || 0
    const usdcBalance = usdcBalanceQuery.data || 0
    return solBalance * solPriceUsd + usdcBalance
  }, [solBalanceQuery.data, usdcBalanceQuery.data, solPriceUsd])

  return {
    isConnected: !!account?.isConnected && !!walletAddress,
    walletAddress,
    balances: {
      sol: solBalanceQuery.data || 0,
      usdc: usdcBalanceQuery.data || 0,
      totalUsd: totalUsdBalance,
    },
    isLoading: solBalanceQuery.isLoading || usdcBalanceQuery.isLoading || isPriceLoading,
    error: solBalanceQuery.error || usdcBalanceQuery.error || priceError,
    refetch: () => {
      solBalanceQuery.refetch()
      usdcBalanceQuery.refetch()
    },
  }
}
