'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { useSessionToken } from '@/hooks/use-session'

export default function AddFunds() {
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [isLoading, setIsLoading] = useState(false)
  const { session } = useSessionToken()
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  })

  // Para wallet balance hook
  const { isConnected, balances, isLoading: balanceLoading, error: balanceError } = useParaWalletBalance()

  // Format balance for display
  const formatBalance = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const quickAmounts = [10, 25, 50, 100, 250, 500]

  const paymentMethods = [
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

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString())
  }

  const handleCardInputChange = (field: string, value: string) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleAddFunds = async () => {
    setIsLoading(true)
    // Simulate API call
    await fetch('/api/faucet-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
    })
    setIsLoading(false)
    // Handle success/error here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/main"
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-emerald-400 transition-colors duration-200 group"
          >
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-x-[-2px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Main</span>
          </Link>
        </div>

        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-3">
            Add Funds
          </h1>
          <p className="text-slate-400 text-lg">Top up your account balance</p>
        </div>

        {/* Current Balance */}
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">Current Balance</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              {isConnected
                ? balanceLoading
                  ? 'Loading...'
                  : balanceError
                    ? '$0.00'
                    : `$${formatBalance(balances.ralli)}`
                : '$0.00'}
            </p>
          </div>
        </div>

        {/* Amount Selection */}
        {/* <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-6">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Select Amount</h3> */}

        {/* Quick Amount Buttons */}
        {/* <div className="grid grid-cols-3 gap-3 mb-4">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => handleQuickAmount(quickAmount)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    amount === quickAmount.toString()
                      ? 'border-emerald-400 bg-emerald-400/10 shadow-lg'
                      : 'border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50'
                  }`}
                >
                  <span className="text-white font-semibold">${quickAmount}</span>
                </button>
              ))}
            </div> */}

        {/* Custom Amount Input */}
        {/* <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 font-bold text-lg">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter custom amount"
                className="w-full pl-10 pr-4 py-4 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 hover:border-slate-600"
              />
            </div> */}
        {/* </div>
        </div> */}

        {/* Payment Methods */}
        {/* <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-white font-bold text-lg mb-4">Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedMethod === method.id
                    ? 'border-emerald-400 bg-emerald-400/10 shadow-lg'
                    : 'border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div className="text-left">
                      <div className="text-white font-semibold text-sm">{method.name}</div>
                      <div className="text-slate-400 text-xs">{method.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 text-xs font-semibold">{method.fee}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div> */}

        {/* Card Details (only show if card is selected) */}
        {/* {selectedMethod === 'card' && (
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-white font-bold text-lg mb-4">Card Details</h3>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Card Number</label>
              <input
                type="text"
                value={cardDetails.number}
                onChange={(e) => handleCardInputChange('number', formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-4 py-3 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 hover:border-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Expiry Date</label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={(e) => handleCardInputChange('expiry', formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-3 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 hover:border-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">CVV</label>
                <input
                  type="text"
                  value={cardDetails.cvv}
                  onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-4 py-3 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 hover:border-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Cardholder Name</label>
              <input
                type="text"
                value={cardDetails.name}
                onChange={(e) => handleCardInputChange('name', e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 hover:border-slate-600"
              />
            </div>
          </div>
        )} */}

        {/* Summary and Add Funds Button */}
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-emerald-400/30 rounded-2xl p-6 shadow-2xl">
          {/* <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold text-lg">Transaction Summary</h3>
              <p className="text-slate-400 text-sm">Review your deposit</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                ${amount || '0'}
              </div>
              <div className="text-xs text-slate-400">Deposit amount</div>
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Amount:</span>
              <span className="text-white">${amount || '0'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Fee:</span>
              <span className="text-emerald-400">
                {paymentMethods.find((m) => m.id === selectedMethod)?.fee || 'Free'}
              </span>
            </div>
            <div className="border-t border-slate-600 pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-white">Total:</span>
                <span className="text-emerald-400">${amount || '0'}</span>
              </div>
            </div>
          </div> */}

          <button
            onClick={handleAddFunds}
            disabled={isLoading}
            className="relative w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg overflow-hidden group disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span>💳</span>
              <span>{isLoading ? 'Processing...' : 'Add Funds'}</span>
            </span>
          </button>
        </div>

        {/* Security Notice */}
        {/* <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 backdrop-blur-sm border border-emerald-700/30 rounded-xl p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-emerald-300 font-medium">
                Your payment is secured with 256-bit SSL encryption
              </p>
              <p className="text-xs text-emerald-400 mt-1">We never store your payment information</p>
            </div>
          </div>
        </div> */}

        {/* Back Navigation */}
        <div className="text-center">
          <Link
            href="/main"
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-emerald-400 transition-colors duration-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
