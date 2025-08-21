'use client'

import { Suspense } from 'react'

// Components
import {
  TopNavigation,
  GameInfoHeader,
  AthletePickCard,
  BottomSelectionCart,
  PaymentPopup,
  LoadingStates,
  AthletesList,
} from './components'

// Hooks and Constants
import { usePicks } from './hooks/usePicks'
import { DEFAULT_LEGS_REQUIRED, DEFAULT_BUY_IN, DEFAULT_GAME_NAME } from './constants/gameDefaults'
import { LoadingSpinner } from '../join-game/components'

function PicksContent() {
  const {
    selectedPicks,
    mounted,
    isConfirming,
    showPaymentPopup,
    isPaymentProcessing,
    paymentSuccess,
    game,
    isSubmittingPayment,
    athletes,
    gameId,
    handlePickSelection,
    removePick,
    handleConfirmPicks,
    handlePaymentConfirm,
    handlePaymentCancel,
  } = usePicks()

  const legsRequired = game?.numBets || DEFAULT_LEGS_REQUIRED
  const buyIn = game?.depositAmount || DEFAULT_BUY_IN
  const gameName = game?.title || DEFAULT_GAME_NAME

  if (!game || !mounted) {
    return <LoadingSpinner />
  }
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Top Navigation Bar */}
      <TopNavigation gameId={gameId} selectedCount={selectedPicks.length} legsRequired={legsRequired} />

      {/* Main Content */}
      <div className="px-4 pb-20">
        {/* Game Info Header */}
        <GameInfoHeader game={game} legsRequired={legsRequired} buyIn={buyIn} />

        {/* Athletes Grid */}
        <AthletesList athletes={athletes}>
          {/* Show athletes only when not loading */}
          {athletes
            .filter((athlete, index, array) => array.findIndex((a) => a.id === athlete.id) === index)
            .map((athlete) => (
              <AthletePickCard
                key={athlete.id}
                athlete={athlete}
                onPickSelection={handlePickSelection}
                selectedPick={selectedPicks.find((pick) => pick.athleteId === athlete.id)}
                isSelectionDisabled={
                  selectedPicks.length >= legsRequired && !selectedPicks.find((pick) => pick.athleteId === athlete.id)
                }
              />
            ))}

          {/* Loading indicator for initial load */}
          <LoadingStates athletesCount={athletes.length} />
        </AthletesList>
      </div>

      {/* Bottom Selection Cart - More compact and less obstructive */}
      <BottomSelectionCart
        selectedPicks={selectedPicks}
        legsRequired={legsRequired}
        buyIn={buyIn}
        isConfirming={isConfirming}
        onRemovePick={removePick}
        onConfirmPicks={handleConfirmPicks}
      />

      {/* Payment Popup */}
      <PaymentPopup
        showPaymentPopup={showPaymentPopup}
        paymentSuccess={paymentSuccess}
        isPaymentProcessing={isPaymentProcessing}
        isSubmittingPayment={isSubmittingPayment}
        game={game}
        selectedPicks={selectedPicks}
        buyIn={buyIn}
        gameName={gameName}
        onPaymentConfirm={handlePaymentConfirm}
        onPaymentCancel={handlePaymentCancel}
      />
    </div>
  )
}

export default function PicksPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PicksContent />
    </Suspense>
  )
}
