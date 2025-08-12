'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useSessionToken } from '@/hooks/use-session'
import Image from 'next/image'
import { useToast } from '@/components/ui/toast'

interface Line {
  id: string
  createdAt: string
  athleteId: string
  statId: string
  matchupId: string
  predictedValue: number
  actualValue: number
  isHigher: boolean
  sport?: string
  playerName?: string
  value?: number
  stat: {
    id: string
    customId: number
    name: string
    description: string
    createdAt: Date
  }
  matchup: {
    id: string
    homeTeam: string
    awayTeam: string
    gameDate: Date
    status: string
    scoreHome: number
    scoreAway: number
    createdAt: Date
  }
  athlete: {
    id: string
    name: string
    team: string
    position: string
    jerseyNumber: number
    age: number
    picture: string
    createdAt: Date
  }
}

interface Athlete {
  id: string
  name: string
  team: string
  position: string
  jerseyNumber: number
  age: number
  picture: string
  customId: number
  createdAt: Date

  lines: Line[]
}

interface Game {
  id: string

  title: string

  creatorId: string

  depositAmount: number

  currency: string

  createdAt: Date

  status: string

  maxParticipants: number
  maxBet: number

  gameCode: string

  matchupGroup: string

  depositToken: string

  isPrivate: boolean

  type: 'parlay' | 'head_to_head' | 'pool'

  userControlType: 'whitelist' | 'blacklist' | 'none'

  gameModeId: string

  gameMode: GameMode

  creator: User
}

interface User {
  id: string

  emailAddress: string

  walletAddress: string

  paraUserId: string

  // @ApiProperty()
  // role: Role;
}

interface GameMode {
  id: string

  label: string

  description: string

  createdAt: string
}
interface SelectedPick {
  lineId: string
  athleteId: string
  predictedDirection: 'over' | 'under'
  athleteAvatar: string
}

function PicksContent() {
  const searchParams = useSearchParams()
  const { addToast } = useToast()

  const { session } = useSessionToken()
  const [selectedPicks, setSelectedPicks] = useState<SelectedPick[]>([])
  const [bookmarkedAthletes, setBookmarkedAthletes] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const [isConfirming] = useState(false)
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [game, setGame] = useState<Game | null>(null)

  const [athletes, setAthletes] = useState<Athlete[]>([])

  // Get game parameters from URL
  const gameId = searchParams.get('gameId') || undefined

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load initial athletes when component mounts or sport changes

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await fetch('/api/read-lines-group-athletes', {
          method: 'GET',
          headers: {
            'x-para-session': session || '',
          },
        })
        console.log('athletes response', response)
        const data = await response.json()
        console.log('athletes data', data)
        setAthletes(data)
      } catch (error) {
        console.error('Error fetching lines:', error)
        setAthletes([])
      }
    }
    fetchAthletes()
  }, [session])

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/read-game?id=${gameId}`, {
          method: 'GET',
          headers: {
            'x-para-session': session || '',
          },
        })
        console.log('game response', response)
        const data = await response.json()
        console.log('game data', data)
        setGame(data)
      } catch (error) {
        console.error('Error fetching lines:', error)
        setGame(null)
      }
    }
    if (gameId) {
      fetchGame()
    }
  }, [gameId, session])

  const toggleBookmark = (athleteId: string) => {
    setBookmarkedAthletes((prev) => {
      if (prev.includes(athleteId)) {
        return prev.filter((id) => id !== athleteId)
      } else if (prev.length < 50) {
        return [...prev, athleteId]
      }
      return prev
    })
  }

  const handlePickSelection = (athleteId: string, statIndex: number, betType: 'over' | 'under') => {
    const athlete = athletes.find((a) => a.id === athleteId)
    if (!athlete || selectedPicks.length >= legsRequired) return

    const line = athlete.lines[statIndex]

    // Remove any existing pick for this athlete
    const filteredPicks = selectedPicks.filter((pick) => pick.athleteId !== athleteId)

    const newPick: SelectedPick = {
      lineId: line.id,
      athleteId: athlete.id,
      predictedDirection: betType,
      athleteAvatar: athlete.picture,
    }

    setSelectedPicks([...filteredPicks, newPick])
  }

  const removePick = (pickId: string) => {
    setSelectedPicks((prev) => prev.filter((pick) => pick.lineId !== pickId))
  }

  const handleConfirmPicks = () => {
    if (selectedPicks.length !== legsRequired) return

    // Show payment popup instead of immediately confirming
    setShowPaymentPopup(true)
  }

  const handlePaymentConfirm = async () => {
    const apiData = {
      gameId: gameId,
      predictions: selectedPicks,
    }
    const response = await fetch('/api/create-bet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
      body: JSON.stringify(apiData),
    })
    const result = await response.json()
    console.log(result, 'result')
    addToast('Bets submitted successfully!', 'success')
    setTimeout(() => {
      window.location.href = `/view-game?id=${gameId}`
    }, 1000)
  }

  const handlePaymentCancel = () => {
    setShowPaymentPopup(false)
    setIsPaymentProcessing(false)
    setPaymentSuccess(false)
  }

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null
  }

  const legsRequired = game?.maxBet || 4
  const buyIn = game?.depositAmount || 25
  const gameName = game?.title || 'Game'
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back Button + Title */}
          <div className="flex items-center space-x-3">
            <Link
              href={`/join-game?id=${gameId}`}
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-white">
              <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                Make Your Picks
              </span>
            </h1>
          </div>

          {/* Right: Progress Info */}
          <div className="text-right">
            <div className="text-[#00CED1] font-bold text-lg">
              {selectedPicks.length}/{legsRequired}
            </div>
            <div className="text-slate-400 text-xs">Selected</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-20">
        {/* Game Info Header */}
        <div className="pt-6 pb-4">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
            <div className="text-center mb-4">
              <h2 className="text-white font-bold text-xl mb-2">Select Your {legsRequired} Picks</h2>
              <p className="text-slate-400 text-sm">Choose player props to build your ${buyIn} parlay</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 text-center">
                <div className="text-slate-400 text-xs">Buy In</div>
                <div className="text-white font-bold text-lg">${buyIn}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 text-center">
                <div className="text-slate-400 text-xs">Legs</div>
                <div className="text-[#00CED1] font-bold text-lg">{legsRequired}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 text-center">
                <div className="text-slate-400 text-xs">Potential</div>
                <div className="text-emerald-400 font-bold text-lg">
                  ~${Math.round(buyIn * game!.maxParticipants || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Athletes Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
                <span className="text-lg">📈</span>
              </span>
              Available Players
            </h3>
            <div className="text-right">
              <div className="text-[#00CED1] font-bold text-lg">{athletes.length}</div>
              <div className="text-slate-400 text-xs">Showing</div>
            </div>
          </div>

          {/* Show athletes only when not loading */}
          {athletes
            .filter((athlete, index, array) => array.findIndex((a) => a.id === athlete.id) === index)
            .map((athlete) => (
              <AthletePickCard
                key={athlete.id}
                athlete={athlete}
                isBookmarked={bookmarkedAthletes.includes(athlete.id)}
                onBookmarkToggle={toggleBookmark}
                onPickSelection={handlePickSelection}
                selectedPick={selectedPicks.find((pick) => pick.athleteId === athlete.id)}
                isSelectionDisabled={
                  selectedPicks.length >= legsRequired && !selectedPicks.find((pick) => pick.athleteId === athlete.id)
                }
              />
            ))}

          {/* Loading indicator for initial load */}
          {athletes.length === 0 && (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00CED1] mx-auto mb-4"></div>
                <div className="text-slate-400 text-sm">Loading athletes...</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Selection Cart - More compact and less obstructive */}
      {selectedPicks.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-3 shadow-2xl max-w-md mx-auto">
          <div className="flex flex-col space-y-3">
            {/* Compact Avatar Stack */}
            <div className="flex justify-center space-x-1.5 max-w-full overflow-x-auto pb-1">
              {Array.from({ length: legsRequired }).map((_, index) => {
                const pick = selectedPicks[index]

                return (
                  <div key={index} className="text-center min-w-[45px]">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative ${
                        pick
                          ? 'bg-gradient-to-br from-[#00CED1] to-[#FFAB91] border-white text-white shadow-lg'
                          : 'bg-slate-800/50 border-slate-600/50 text-slate-400'
                      }`}
                    >
                      {pick ? (
                        <>
                          <Image
                            src={pick.athleteAvatar}
                            alt={pick.athleteId}
                            className="w-10 h-10 object-cover rounded-lg"
                            width={24}
                            height={24}
                          />
                          <button
                            onClick={() => removePick(pick.lineId)}
                            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <span className="text-sm">?</span>
                      )}
                    </div>
                    {pick && (
                      <div className="text-[#00CED1] text-xs mt-0.5 font-semibold truncate max-w-[45px]">
                        {pick.predictedDirection}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Compact Confirm Button */}
            <button
              onClick={handleConfirmPicks}
              disabled={selectedPicks.length !== legsRequired || isConfirming}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                selectedPicks.length === legsRequired && !isConfirming
                  ? 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  : isConfirming
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-slate-800/50 border border-slate-600/50 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isConfirming ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Selection Confirmed!</span>
                </div>
              ) : selectedPicks.length === legsRequired ? (
                `Confirm Picks • $${buyIn}`
              ) : (
                `${legsRequired - selectedPicks.length} more`
              )}
            </button>
          </div>
        </div>
      )}

      {/* Payment Popup */}
      {showPaymentPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 mx-4 w-full max-w-md shadow-2xl">
            {!paymentSuccess ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00CED1] to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Confirm Your Entry</h3>
                  <p className="text-slate-400 text-sm">
                    {gameName} • {selectedPicks.length} picks selected
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">Buy-in Amount</span>
                    <span className="text-white font-bold text-lg">${buyIn}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">Picks Selected</span>
                    <span className="text-slate-400">
                      {selectedPicks.length} of {legsRequired}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Potential Payout</span>
                    <span className="text-emerald-400 font-bold">
                      ~${Math.round(buyIn * game!.maxParticipants || 0)}
                    </span>
                  </div>
                </div>

                {!isPaymentProcessing ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handlePaymentCancel}
                      className="flex-1 bg-slate-700/50 border border-slate-600/50 text-white font-semibold py-3 px-4 rounded-xl hover:bg-slate-600/50 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePaymentConfirm}
                      className="flex-1 bg-gradient-to-r from-[#00CED1] to-blue-500 text-white font-bold py-3 px-4 rounded-xl hover:from-[#00CED1]/90 hover:to-blue-500/90 transition-all duration-300"
                    >
                      Pay ${buyIn}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00CED1]"></div>
                    <span className="ml-3 text-slate-300">Processing payment...</span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Payment Successful!</h3>
                <p className="text-slate-400 text-sm mb-6">Your picks are locked in. Good luck!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Athlete Pick Card Component
function AthletePickCard({
  athlete,
  isBookmarked,
  onBookmarkToggle,
  onPickSelection,
  selectedPick,
  isSelectionDisabled,
}: {
  athlete: Athlete
  isBookmarked: boolean
  onBookmarkToggle: (id: string) => void
  onPickSelection: (athleteId: string, statIndex: number, betType: 'over' | 'under') => void
  selectedPick?: SelectedPick
  isSelectionDisabled: boolean
}) {
  const [currentStatIndex, setCurrentStatIndex] = useState(0)

  const nextStat = () => {
    setCurrentStatIndex((prev) => (prev + 1) % athlete.lines.length)
  }

  const prevStat = () => {
    setCurrentStatIndex((prev) => (prev === 0 ? athlete.lines.length - 1 : prev - 1))
  }

  const currentLine = athlete.lines[currentStatIndex]
  const currentStat = currentLine.stat
  const isThisStatSelected = selectedPick && selectedPick.lineId === currentLine.id

  return (
    <div
      className={`group relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-xl border shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
        selectedPick ? 'border-[#00CED1] shadow-[#00CED1]/20' : 'border-slate-700/50 hover:border-slate-600/60'
      }`}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00CED1]/3 via-transparent to-[#FFAB91]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 p-5">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            {/* Player Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
                <Image
                  src={athlete.picture}
                  alt={athlete.name}
                  className="w-12 h-12 object-cover rounded-lg"
                  width={48}
                  height={48}
                />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 bg-emerald-500"></div>
            </div>

            {/* Player Details */}
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-bold text-lg mb-1 truncate">{athlete.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-slate-300 font-semibold text-sm">{athlete.team}</span>
                <div className="text-slate-400 font-medium text-sm">
                  {athlete.lines[currentStatIndex].matchup.homeTeam} vs{' '}
                  {athlete.lines[currentStatIndex].matchup.awayTeam}
                </div>
              </div>
            </div>
          </div>

          {/* Star Bookmark Button */}
          <button
            onClick={() => onBookmarkToggle(athlete.id)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isBookmarked
                ? 'text-[#FFAB91] bg-[#FFAB91]/20 border border-[#FFAB91]/40'
                : 'text-slate-400 bg-slate-700/50 border border-slate-600/50 hover:text-[#FFAB91] hover:bg-[#FFAB91]/10 hover:border-[#FFAB91]/30'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={isBookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        </div>

        {/* Horizontal Layout with Stats and Buttons */}
        <div className="flex items-center gap-4">
          {/* Stats Section */}
          <div className="flex-1 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5">
            {/* Stat Navigation Header */}
            <div className="flex flex-col mb-3">
              <div className="text-slate-200 font-bold text-base mb-3 tracking-wide text-center">
                {currentStat.name}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={prevStat}
                  className="w-8 h-8 bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-[#00CED1]/30 hover:to-[#00CED1]/20 rounded-lg flex items-center justify-center transition-all duration-300 border border-slate-600/40 hover:border-[#00CED1]/50"
                >
                  <svg
                    className="w-4 h-4 text-slate-300 hover:text-[#00CED1] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="text-[#00CED1] font-black text-3xl tracking-tight drop-shadow-lg">
                  {currentLine.predictedValue}
                </div>

                <button
                  onClick={nextStat}
                  className="w-8 h-8 bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-[#00CED1]/30 hover:to-[#00CED1]/20 rounded-lg flex items-center justify-center transition-all duration-300 border border-slate-600/40 hover:border-[#00CED1]/50"
                >
                  <svg
                    className="w-4 h-4 text-slate-300 hover:text-[#00CED1] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center space-x-2">
              {athlete.lines.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStatIndex(index)}
                  className={`transition-all duration-500 rounded-full ${
                    index === currentStatIndex
                      ? 'w-6 h-1.5 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] shadow-lg shadow-[#00CED1]/30'
                      : 'w-1.5 h-1.5 bg-slate-600/60 hover:bg-slate-500/80 hover:scale-150 shadow-md'
                  }`}
                ></button>
              ))}
            </div>
          </div>

          {/* Over/Under Buttons */}
          <div className="flex flex-col space-y-2 min-w-[100px] flex-shrink-0">
            <button
              onClick={() => onPickSelection(athlete.id, currentStatIndex, 'over')}
              disabled={isSelectionDisabled}
              className={`rounded-xl py-2 px-4 transition-all duration-300 group shadow-lg ${
                isThisStatSelected && selectedPick?.predictedDirection === 'over'
                  ? 'bg-gradient-to-r from-emerald-500/50 to-emerald-600/40 border-2 border-emerald-300 shadow-emerald-500/40'
                  : isSelectionDisabled
                    ? 'bg-gradient-to-r from-slate-600/25 to-slate-700/15 border-2 border-slate-500/20 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-emerald-500/25 to-emerald-600/15 border-2 border-emerald-400/40 hover:from-emerald-500/35 hover:to-emerald-600/25 hover:border-emerald-400/60 hover:shadow-emerald-500/20'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isThisStatSelected && selectedPick?.predictedDirection === 'over'
                      ? 'text-emerald-300 scale-110'
                      : isSelectionDisabled
                        ? 'text-slate-500'
                        : 'text-emerald-400 group-hover:scale-110'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                </svg>
              </div>
              <div
                className={`font-bold text-sm transition-colors ${
                  isThisStatSelected && selectedPick?.predictedDirection === 'over'
                    ? 'text-emerald-200'
                    : isSelectionDisabled
                      ? 'text-slate-500'
                      : 'text-emerald-300 group-hover:text-emerald-200'
                }`}
              >
                OVER
              </div>
            </button>

            <button
              onClick={() => onPickSelection(athlete.id, currentStatIndex, 'under')}
              disabled={isSelectionDisabled}
              className={`rounded-xl py-2 px-4 transition-all duration-300 group shadow-lg ${
                isThisStatSelected && selectedPick?.predictedDirection === 'under'
                  ? 'bg-gradient-to-r from-red-500/50 to-red-600/40 border-2 border-red-300 shadow-red-500/40'
                  : isSelectionDisabled
                    ? 'bg-gradient-to-r from-slate-600/25 to-slate-700/15 border-2 border-slate-500/20 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-red-500/25 to-red-600/15 border-2 border-red-400/40 hover:from-red-500/35 hover:to-red-600/25 hover:border-red-400/60 hover:shadow-red-500/20'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isThisStatSelected && selectedPick?.predictedDirection === 'under'
                      ? 'text-red-300 scale-110'
                      : isSelectionDisabled
                        ? 'text-slate-500'
                        : 'text-red-400 group-hover:scale-110'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div
                className={`font-bold text-sm transition-colors ${
                  isThisStatSelected && selectedPick?.predictedDirection === 'under'
                    ? 'text-red-200'
                    : isSelectionDisabled
                      ? 'text-slate-500'
                      : 'text-red-300 group-hover:text-red-200'
                }`}
              >
                UNDER
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PicksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-700 rounded"></div>
                <div className="h-64 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <PicksContent />
    </Suspense>
  )
}
