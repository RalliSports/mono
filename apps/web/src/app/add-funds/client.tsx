'use client'

import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { useSessionToken } from '@/hooks/use-session'

// Components
import { PageHeader, CurrentBalance, TransactionSummary, BackNavigation } from './components'

// Hooks and Constants
import { useAddFunds } from './hooks/useAddFunds'
import { PAYMENT_METHODS } from './constants/paymentMethods'

export default function AddFunds() {
  const { session } = useSessionToken()
  const { isConnected, balances, isLoading: balanceLoading, error: balanceError } = useParaWalletBalance()

  const {
    amount,
    setAmount,
    selectedMethod,
    setSelectedMethod,
    isLoading,
    cardDetails,
    handleCardDetailsChange,
    handleAddFunds,
  } = useAddFunds()

  const handleAddFundsClick = () => {
    handleAddFunds(session)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <PageHeader />

        <CurrentBalance
          isConnected={isConnected}
          isLoading={balanceLoading}
          error={balanceError?.message}
          balance={balances.ralli}
        />

        {/* Commented out components - ready to enable when payment features are needed */}
        {/* 
        <AmountSelector 
          amount={amount} 
          onAmountChange={setAmount} 
        />

        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onMethodChange={setSelectedMethod}
          paymentMethods={PAYMENT_METHODS}
        />

        {selectedMethod === 'card' && (
          <CardDetailsForm
            cardDetails={cardDetails}
            onCardDetailsChange={handleCardDetailsChange}
          />
        )}

        <SecurityNotice />
        */}

        <TransactionSummary
          amount={amount}
          selectedMethod={selectedMethod}
          paymentMethods={PAYMENT_METHODS}
          isLoading={isLoading}
          onAddFunds={handleAddFundsClick}
          showSummary={false} // Set to true when enabling payment features
        />

        <BackNavigation />
      </div>
    </div>
  )
}

//holy shit it works omg
