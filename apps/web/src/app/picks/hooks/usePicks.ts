import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSessionToken } from '@/hooks/use-session'
import { useToast } from '@/components/ui/toast'
import type { Game, SelectedPick } from '../components/types'
import { MAX_BOOKMARKS } from '../constants/gameDefaults'
import { AthletesServiceGetActiveAthletesWithUnresolvedLines } from '@repo/server'

export function usePicks() {
  const searchParams = useSearchParams()
  const { addToast } = useToast()
  const { session } = useSessionToken()

  // State
  const [selectedPicks, setSelectedPicks] = useState<SelectedPick[]>([])
  const [bookmarkedAthletes, setBookmarkedAthletes] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const [isConfirming] = useState(false)
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [game, setGame] = useState<Game | null>(null)
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)
  const [athletes, setAthletes] = useState<AthletesServiceGetActiveAthletesWithUnresolvedLines>([])

  // Get game parameters from URL
  const gameId = searchParams.get('id') || undefined

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load athletes
  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await fetch('/api/read-lines-group-athletes', {
          method: 'GET',
          headers: {
            'x-para-session': session || '',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setAthletes(data)
        } else {
          const errorData = await response.json()
          addToast(errorData.error || 'Failed to fetch athletes', 'error')
        }
      } catch (error) {
        console.error('Error fetching lines:', error)
        setAthletes([])
      }
    }
    fetchAthletes()
  }, [session])

  // Load game
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/read-game?id=${gameId}`, {
          method: 'GET',
          headers: {
            'x-para-session': session || '',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setGame(data)
        } else {
          const errorData = await response.json()
          addToast(errorData.error || 'Failed to fetch game', 'error')
        }
      } catch (error) {
        console.error('Error fetching game:', error)
        setGame(null)
      }
    }
    if (gameId) {
      fetchGame()
    }
  }, [gameId, session])

  // Actions
  const toggleBookmark = (athleteId: string) => {
    setBookmarkedAthletes((prev) => {
      if (prev.includes(athleteId)) {
        return prev.filter((id) => id !== athleteId)
      } else if (prev.length < MAX_BOOKMARKS) {
        return [...prev, athleteId]
      }
      return prev
    })
  }

  const handlePickSelection = (athleteId: string, statIndex: number, betType: 'over' | 'under') => {
    const athlete = athletes.find((a) => a.id === athleteId)
    const legsRequired = game?.numBets || 4

    if (!athlete || selectedPicks.length >= legsRequired) return

    const line = athlete.lines[statIndex]

    // Remove any existing pick for this athlete
    const filteredPicks = selectedPicks.filter((pick) => pick.athleteId !== athleteId)

    const newPick: SelectedPick = {
      lineId: line.id,
      athleteId: athlete.id,
      predictedDirection: betType,
      picture: athlete.picture || '',
    }

    setSelectedPicks([...filteredPicks, newPick])
  }

  const removePick = (pickId: string) => {
    setSelectedPicks((prev) => prev.filter((pick) => pick.lineId !== pickId))
  }

  const handleConfirmPicks = () => {
    const legsRequired = game?.numBets || 4
    if (selectedPicks.length !== legsRequired) return
    setShowPaymentPopup(true)
  }

  const handlePaymentConfirm = async () => {
    setIsSubmittingPayment(true)
    const apiData = {
      gameId: gameId,
      bets: selectedPicks,
    }
    const response = await fetch('/api/create-bet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
      body: JSON.stringify(apiData),
    })

    if (response.ok) {
      addToast('Bets submitted successfully!', 'success')

      setTimeout(() => {
        window.location.href = `/game?id=${gameId}`
      }, 1000)
    } else {
      const errorData = await response.json()
      addToast(errorData.error || 'Failed to submit bets', 'error')
      throw new Error(errorData.error || 'Failed to submit bets')
    }
    setIsSubmittingPayment(false)
  }

  const handlePaymentCancel = () => {
    setShowPaymentPopup(false)
    setIsPaymentProcessing(false)
    setPaymentSuccess(false)
  }

  return {
    // State
    selectedPicks,
    bookmarkedAthletes,
    mounted,
    isConfirming,
    showPaymentPopup,
    isPaymentProcessing,
    paymentSuccess,
    game,
    isSubmittingPayment,
    athletes,
    gameId,

    // Actions
    toggleBookmark,
    handlePickSelection,
    removePick,
    handleConfirmPicks,
    handlePaymentConfirm,
    handlePaymentCancel,
  }
}
