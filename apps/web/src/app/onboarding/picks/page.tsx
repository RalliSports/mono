'use client'

import type { SelectedPick as ImportedSelectedPick } from '../../picks/components/types'
import { useSearchParams, useRouter } from 'next/navigation'

type SelectedPick = ImportedSelectedPick & {
  statIndex?: number
  betType?: 'over' | 'under'
  athlete?: AthleteType
}

import { Suspense, useEffect, useState } from 'react'

// Components (reuse from picks, or clone if needed)
import { TopNavigation, GameInfoHeader, BottomSelectionCart, PaymentPopup, AthletesList } from '../../picks/components'
import PicksPageSkeleton from '../../picks/components/PicksPageSkeleton'
import { DEFAULT_LEGS_REQUIRED, DEFAULT_BUY_IN, DEFAULT_GAME_NAME } from '../../picks/constants/gameDefaults'

// --- Types matching real components ---
type GameType = {
  id: string
  createdAt: Date | null
  status: string | null
  title: string | null
  creatorId: string | null
  depositAmount: number | null
  maxParticipants: number | null
  numBets: number | null
  participants: any[]
  athletes: any[]
  token: any | null
}

type AthleteType = {
  id: string
  customId: number
  espnAthleteId: string | null
  name: string | null
  position: string | null
  jerseyNumber: number | null
  age: number | null
  picture: string | null
  teamId: string | null
  createdAt: Date | null
  lines: any[]
  team: any | null
}

const mockGame = {
  id: 'mock-game-1',
  createdAt: null,
  status: 'active',
  title: 'Mock Onboarding Game',
  creatorId: 'mock-creator',
  depositAmount: 10,
  maxParticipants: 10,
  numBets: 3,
  participants: [],
  athletes: [],
  token: null,
  gameCode: 'ONBOARDING',
  matchupGroup: null,
  tokenId: null,
  isPrivate: false,
  startTime: null,
  endTime: null,
  payout: null,
  league: null,
  sport: null,
  rules: null,
  description: null,
  // Add any other required fields with mock values
} as any

const mockAthletes: AthleteType[] = [
  {
    id: 'athlete-1',
    customId: 1,
    espnAthleteId: '12345',
    name: 'LeBron James',
    position: 'Forward',
    jerseyNumber: 23,
    age: 39,
    picture: '/images/players/lebron-james.png',
    teamId: 'lal',
    createdAt: new Date('2024-01-01'),
    lines: [
      {
        id: 'line-1',
        stat: { name: 'Points', displayName: 'PTS' },
        predictedValue: 25.5,
        matchup: {
          homeTeam: { abbreviation: 'LAL' },
          awayTeam: { abbreviation: 'GSW' },
        },
      },
      {
        id: 'line-1b',
        stat: { name: 'Rebounds', displayName: 'REB' },
        predictedValue: 10.5,
        matchup: {
          homeTeam: { abbreviation: 'LAL' },
          awayTeam: { abbreviation: 'GSW' },
        },
      },
      {
        id: 'line-1c',
        stat: { name: 'Assists', displayName: 'AST' },
        predictedValue: 7.5,
        matchup: {
          homeTeam: { abbreviation: 'LAL' },
          awayTeam: { abbreviation: 'GSW' },
        },
      },
    ],
    team: {
      id: 'lal',
      name: 'Los Angeles Lakers',
      abbreviation: 'LAL',
      logo: '/images/teams/lal.png',
    },
    // odds removed
  },
  {
    id: 'athlete-2',
    customId: 2,
    espnAthleteId: '67890',
    name: 'Stephen Curry',
    position: 'Guard',
    jerseyNumber: 30,
    age: 36,
    picture: '/images/players/stephen-curry.png',
    teamId: 'gsw',
    createdAt: new Date('2024-01-01'),
    lines: [
      {
        id: 'line-2',
        stat: { name: 'Assists', displayName: 'AST' },
        predictedValue: 8.5,
        matchup: {
          homeTeam: { abbreviation: 'BOS' },
          awayTeam: { abbreviation: 'MIA' },
        },
      },
      {
        id: 'line-2b',
        stat: { name: 'Points', displayName: 'PTS' },
        predictedValue: 22.5,
        matchup: {
          homeTeam: { abbreviation: 'BOS' },
          awayTeam: { abbreviation: 'MIA' },
        },
      },
      {
        id: 'line-2c',
        stat: { name: 'Steals', displayName: 'STL' },
        predictedValue: 1.5,
        matchup: {
          homeTeam: { abbreviation: 'BOS' },
          awayTeam: { abbreviation: 'MIA' },
        },
      },
    ],
    team: {
      id: 'gsw',
      name: 'Golden State Warriors',
      abbreviation: 'GSW',
      logo: '/images/teams/gsw.png',
    },
    // odds removed
  },
  {
    id: 'athlete-3',
    customId: 3,
    espnAthleteId: '54321',
    name: 'Giannis Antetokounmpo',
    position: 'Forward',
    jerseyNumber: 34,
    age: 29,
    picture: '/images/players/giannis.png',
    teamId: 'mil',
    createdAt: new Date('2024-01-01'),
    lines: [
      {
        id: 'line-3',
        stat: { name: 'Blocks', displayName: 'BLK' },
        predictedValue: 2.5,
        matchup: {
          homeTeam: { abbreviation: 'LAL' },
          awayTeam: { abbreviation: 'GSW' },
        },
      },
      {
        id: 'line-3b',
        stat: { name: 'Rebounds', displayName: 'REB' },
        predictedValue: 12.5,
        matchup: {
          homeTeam: { abbreviation: 'LAL' },
          awayTeam: { abbreviation: 'GSW' },
        },
      },
      {
        id: 'line-3c',
        stat: { name: 'Points', displayName: 'PTS' },
        predictedValue: 18.5,
        matchup: {
          homeTeam: { abbreviation: 'LAL' },
          awayTeam: { abbreviation: 'GSW' },
        },
      },
    ],
    team: {
      id: 'mil',
      name: 'Milwaukee Bucks',
      abbreviation: 'MIL',
      logo: '/images/teams/mil.png',
    },
    // odds removed
  },
]

function useMockPicks(router: any, lobbyId: string) {
  const [selectedPicks, setSelectedPicks] = useState<SelectedPick[]>([])
  const [isConfirming, setIsConfirming] = useState<boolean>(false)

  const [showPaymentPopup, setShowPaymentPopup] = useState<boolean>(false)
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false)
  const [isPaymentProcessing, setIsPaymentProcessing] = useState<boolean>(false)
  const [isSubmittingPayment, setIsSubmittingPayment] = useState<boolean>(false)

  // Handler matches expected signature
  const handlePickSelection = (athleteId: string, statIndex: number, betType: 'over' | 'under') => {
    const athlete = mockAthletes.find((a) => a.id === athleteId)
    if (!athlete) return
    const pickId = `${athleteId}-${statIndex}-${betType}`
    setSelectedPicks((prev: SelectedPick[]) => {
      if (prev.find((p) => p.lineId === pickId)) {
        return prev.filter((p) => p.lineId !== pickId)
      }
      return [
        ...prev,
        {
          lineId: pickId,
          athleteId,
          predictedDirection: betType,
          picture: athlete.picture ?? '',
          statIndex,
          betType,
          athlete,
        },
      ]
    })
  }

  const removePick = (lineId: string) => {
    setSelectedPicks((prev: SelectedPick[]) => prev.filter((p) => p.lineId !== lineId))
  }

  const handleConfirmPicks = () => {
    setIsConfirming(true)
    setShowPaymentPopup(true)
  }

  const handlePaymentConfirm = () => {
    setIsPaymentProcessing(true)
    setTimeout(() => {
      setIsPaymentProcessing(false)
      setPaymentSuccess(true)
      setIsSubmittingPayment(false)

      // Store picks data for the game detail page
      const picksData = {
        lobbyId,
        selectedPicks,
        joinedAt: new Date().toISOString(),
      }
      localStorage.setItem('onboardingUserPicks', JSON.stringify(picksData))

      // Navigate back to the appropriate game detail page
      const gameRoute = lobbyId === '1' ? '/onboarding/game-1' : '/onboarding/game-2'
      router.push(gameRoute)
    }, 1500)
  }

  const handlePaymentCancel = () => {
    setShowPaymentPopup(false)
    setIsConfirming(false)
    setPaymentSuccess(false)
    setIsPaymentProcessing(false)
    setIsSubmittingPayment(false)
  }

  return {
    selectedPicks,
    mounted: true,
    isConfirming,
    showPaymentPopup,
    isPaymentProcessing,
    paymentSuccess,
    game: mockGame,
    isSubmittingPayment,
    athletes: mockAthletes,
    gameId: mockGame.id,
    handlePickSelection,
    removePick,
    handleConfirmPicks,
    handlePaymentConfirm,
    handlePaymentCancel,
  }
}

function PicksContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lobbyId = searchParams.get('id') || '1'
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
  } = useMockPicks(router, lobbyId)
  const [showFinalPopup, setShowFinalPopup] = useState(false)

  const legsRequired = game?.numBets || DEFAULT_LEGS_REQUIRED
  const buyIn = game?.depositAmount || DEFAULT_BUY_IN
  const gameName = game?.title || DEFAULT_GAME_NAME

  useEffect(() => {
    console.log('lobby.id', lobbyId)
    const popupSeenKey = `onboardingPicksPopupSeen_${lobbyId}`
    // const hasSeenPopup = localStorage.getItem(popupSeenKey)
    const hasSeenPopup = false

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        console.log('showing final popup')
        setShowFinalPopup(true)
        localStorage.setItem(popupSeenKey, 'true')
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [lobbyId])

  if (!game || !mounted) {
    return <PicksPageSkeleton />
  }
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Top Navigation Bar */}
      <TopNavigation gameId={gameId} selectedCount={selectedPicks.length} legsRequired={legsRequired} />
      {showFinalPopup && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

          {/* Tutorial Content - centered */}
          <div className="relative z-10 w-full max-w-md mx-4 pointer-events-auto">
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-4">Time to make your picks! 🎮</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  Select your picks from the list of athletes below. You can select up to {legsRequired} picks, and for
                  each athlete you can click between different stats and press "Confirm Picks" when you're ready to
                  submit your predictions.
                </p>

                {/* Action Button */}
                <button
                  onClick={() => setShowFinalPopup(false)}
                  className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-slate-900 font-bold py-3 px-6 rounded-xl hover:shadow-xl hover:shadow-[#00CED1]/30 transform hover:scale-[1.02] transition-all duration-300"
                >
                  Make My Picks! 🎉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Main Content */}
      <div className={`px-4 ${selectedPicks.length > 0 ? 'pb-48' : 'pb-20'}`}>
        {/* Game Info Header */}
        <GameInfoHeader game={game} legsRequired={legsRequired} buyIn={buyIn} />

        {/* Athletes Grid */}
        <AthletesList
          athletes={athletes}
          handlePickSelection={handlePickSelection}
          selectedPicks={selectedPicks}
          legsRequired={legsRequired}
        />
      </div>

      {/* Bottom Selection Cart */}
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

export default function OnboardingPicksPage() {
  return (
    <Suspense fallback={<PicksPageSkeleton />}>
      <PicksContent />
    </Suspense>
  )
}
