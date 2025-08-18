export interface CardDetails {
  number: string
  expiry: string
  cvv: string
  name: string
}

export interface PaymentMethod {
  id: string
  name: string
  icon: string
  description: string
  fee: string
}

export interface BalanceData {
  ralli: number
  isLoading: boolean
  error?: string
}

export type PaymentMethodType = 'card' | 'paypal' | 'crypto' | 'bank'

export interface AddFundsState {
  amount: string
  selectedMethod: PaymentMethodType
  isLoading: boolean
  cardDetails: CardDetails
}
