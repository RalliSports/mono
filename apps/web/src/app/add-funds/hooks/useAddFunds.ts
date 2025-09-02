import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/toast'
import { CardDetails, PaymentMethodType } from '../components/types'

export const useAddFunds = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
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

      // Invalidate relevant balance queries so UI re-fetches updated balances
      // This covers ralli, sol and usdc balance queries used by useParaWalletBalance
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['para-ralli-balance'] }),
        queryClient.invalidateQueries({ queryKey: ['para-sol-balance'] }),
        queryClient.invalidateQueries({ queryKey: ['para-usdc-balance'] }),
      ])

      // Notify user the operation finished
      addToast('Funds added — balances will update shortly', 'success')
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
