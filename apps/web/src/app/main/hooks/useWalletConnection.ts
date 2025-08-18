import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from '@getpara/react-sdk'
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { WALLET_CONNECTION_TIMEOUT } from '../constants/filters'

export function useWalletConnection() {
  const router = useRouter()
  const account = useAccount()
  const [mounted, setMounted] = useState(false)
  const [hasCheckedConnection, setHasCheckedConnection] = useState(false)

  // Para wallet balance hook
  const { isConnected, balances, isLoading: balanceLoading, error: balanceError } = useParaWalletBalance()

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle wallet connection redirect with better logic for Para integration
  useEffect(() => {
    if (!mounted) return

    // If we're connected, mark as checked and clear any pending redirects
    if (isConnected) {
      setHasCheckedConnection(true)
      return
    }

    // Don't check again if we've already performed a connection check
    if (hasCheckedConnection) return

    // Don't redirect if still loading
    if (balanceLoading) return

    // Wait for Para connection to establish - sometimes it takes a moment after signin
    const timeoutId = setTimeout(() => {
      setHasCheckedConnection(true)

      // Only redirect if definitely not connected and not loading
      if (!isConnected && !balanceLoading) {
        console.log('No wallet connection found, redirecting to signin')
        router.push('/signin')
      }
    }, WALLET_CONNECTION_TIMEOUT)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [mounted, isConnected, balanceLoading, hasCheckedConnection, router])

  // Redirect to /signin if the user is not connected (only after we've checked connection)
  useEffect(() => {
    if (!mounted) return

    // Only redirect if we've completed our connection check and user is still not connected
    if (hasCheckedConnection && !account?.isConnected) {
      router.push('/signin')
    }
  }, [mounted, hasCheckedConnection, account?.isConnected, router])

  const shouldShowLoading = !hasCheckedConnection && (balanceLoading || (!isConnected && !balanceError))

  return {
    mounted,
    hasCheckedConnection,
    isConnected,
    balances,
    balanceLoading,
    balanceError,
    shouldShowLoading,
  }
}
