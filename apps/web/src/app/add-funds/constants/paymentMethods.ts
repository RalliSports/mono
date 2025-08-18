import { PaymentMethod } from '../components/types'

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Instant deposit',
    fee: 'Free',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🔵',
    description: 'Secure payment',
    fee: '2.9%',
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: '₿',
    description: 'Bitcoin/Ethereum',
    fee: '1%',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: '🏦',
    description: '2-3 business days',
    fee: 'Free',
  },
]

export const QUICK_AMOUNTS = [10, 25, 50, 100, 250, 500]
