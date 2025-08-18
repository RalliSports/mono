import { useState } from 'react'
import { CardDetails, PaymentMethodType } from '../components/types'

export const useAddFunds = () => {
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
      await fetch('/api/faucet-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-para-session': session || '',
        },
      })
      // Handle success/error here
    } catch (error) {
      console.error('Add funds error:', error)
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
