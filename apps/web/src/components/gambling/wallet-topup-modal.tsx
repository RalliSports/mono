'use client'

import { useState } from 'react'
import { useWalletBalances } from '@/providers/user-data-provider'

export default function WalletTopUpModalRefactored() {
  const [amount, setAmount] = useState(100)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [processing, setProcessing] = useState(false)

  const { balances, isLoading: balanceLoading, error: balanceError } = useWalletBalances()

  const formatBalance = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const quickAmounts = [25, 50, 100, 250, 500, 1000]

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      fee: 0,
      instant: true,
    },
    { id: 'paypal', name: 'PayPal', icon: '🔵', fee: 2.9, instant: true },
    { id: 'crypto', name: 'Cryptocurrency', icon: '₿', fee: 0, instant: false },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦', fee: 0, instant: false },
  ]

  const handleTopUp = async () => {
    setProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setProcessing(false)
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-3xl p-8 border border-slate-700 shadow-2xl max-w-lg w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <svg className="w-6 h-6 text-[#00CED1] mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          Top Up Wallet
        </h2>
      </div>

      {/* Current Balance - Refactored to use UserDataProvider */}
      <div className="mb-6 p-4 bg-gradient-to-r from-[#00CED1]/10 to-[#FFAB91]/10 rounded-2xl border border-[#00CED1]/20">
        <div className="text-center">
          <div className="text-slate-400 text-sm mb-1">Current Balance</div>
          <div className="text-2xl font-bold text-white">
            {balanceLoading ? 'Loading...' : balanceError ? '$0.00' : `$${formatBalance(balances?.totalUsd || 0)}`}
          </div>
          {/* Additional balance breakdown available from provider */}
          <div className="text-xs text-slate-400 mt-2 space-x-2">
            <span>SOL: {balances?.sol.toFixed(4) || '0.0000'}</span>
            <span>•</span>
            <span>USDC: ${balances?.usdc.toFixed(2) || '0.00'}</span>
            <span>•</span>
            <span>RALLI: {balances?.ralli.toFixed(0) || '0'}</span>
          </div>
        </div>
      </div>

      {/* Amount Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Select Amount</h3>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => setAmount(quickAmount)}
              className={`py-2 px-3 rounded-xl font-semibold transition-all duration-300 ${
                amount === quickAmount
                  ? 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              ${quickAmount}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg font-semibold">
            $
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-[#00CED1] focus:ring-2 focus:ring-[#00CED1]/20 transition-all duration-300"
            placeholder="Enter custom amount"
            min="10"
            max="10000"
          />
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Payment Method</h3>
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`w-full p-4 rounded-2xl border transition-all duration-300 ${
                paymentMethod === method.id
                  ? 'bg-gradient-to-r from-[#00CED1]/10 to-[#FFAB91]/10 border-[#00CED1] text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{method.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{method.name}</div>
                    <div className="text-xs text-slate-400 flex items-center space-x-2">
                      <span>{method.instant ? 'Instant' : '1-3 days'}</span>
                      {method.fee > 0 && <span>• {method.fee}% fee</span>}
                    </div>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    paymentMethod === method.id ? 'border-[#00CED1] bg-[#00CED1]' : 'border-slate-500'
                  }`}
                >
                  {paymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleTopUp}
        disabled={processing}
        className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-bold py-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
      >
        {processing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          'Add Funds'
        )}
      </button>

      {/* Security Note */}
      <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
        <div className="flex items-center space-x-2 text-slate-400 text-xs">
          <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>All transactions are secured with 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  )
}
