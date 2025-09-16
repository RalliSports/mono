import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/toast'
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { CardDetails, PaymentMethodType } from '../components/types'

export const useAddFunds = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const { refetch } = useParaWalletBalance()
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card')
  const [isLoading, setIsLoading] = useState(false)
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  })

  const handleCardDetailsChange = (field: keyof CardDetails, value: string) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddFunds = async (session?: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      const res = await fetch('/api/faucet-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-para-session': session || '',
        },
      })

      if (!res.ok) throw new Error('Failed to add funds')

      // Small delay to ensure the faucet transaction is processed
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Invalidate all ralli balance queries for any wallet address
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'para-ralli-balance',
      })

      // Force immediate refetch to update the balance display
      await refetch()

      // Notify user the operation finished
      addToast('Funds added successfully!', 'success')
    } catch (error) {
      console.error('Add funds error:', error)
      addToast(`Add funds failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    amount,
    setAmount,
    selectedMethod,
    setSelectedMethod,
    isLoading,
    cardDetails,
    handleCardDetailsChange,
    handleAddFunds,
  }
}
