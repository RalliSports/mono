'use client'

import { useState, useEffect } from 'react'
import { useSessionToken } from '@/hooks/use-session'
import { toast, ToastContainer } from 'react-toastify'
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { useRouter } from 'next/navigation'
import { RALLI_TOKEN } from '@/constants'

// Components
import {
  PageHeader,
  GameTitleInput,
  DepositAmountSelector,
  ParticipantsSelector,
  BetsSelector,
  ContestSummary,
  sliderStyles,
  GameSettings,
  CreatingGameState,
  FormErrors,
} from './components'

// Types and Hooks
import { useGameValidation } from './hooks/useGameValidation'
import GamePictureUpload from './components/GamePictureUpload'

//check if para is connected else kick back to /signin

export default function CreateGame() {
  const router = useRouter()
  const { validateForm } = useGameValidation()

  // Para wallet balance hook
  const { isConnected } = useParaWalletBalance()
  const { session } = useSessionToken()
  const [mounted, setMounted] = useState(false)
  const [creatingGameState, setCreatingGameState] = useState<CreatingGameState>('idle')

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle wallet connection redirect with better logic for Para integration
  useEffect(() => {
    if (!mounted) return

    // Wait for Para connection to establish - sometimes it takes a moment after signin
    const timeoutId = setTimeout(() => {
      // Only redirect if definitely not connected and not loading
      if (!isConnected) {
        router.push('/signin')
      }
    }, 1000) // Wait 5 seconds to give Para plenty of time to connect

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [mounted, isConnected, router])

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    title: '',
    depositAmount: 25,
    maxParticipants: 8,
    matchupGroup: 'TEST',
    isPrivate: false,
    //TODO: Update depositToken when live
    depositToken: RALLI_TOKEN,
    type: 'limited',
    userControlType: 'none',
    gameMode: '550e8400-e29b-41d4-a716-446655440020',
    numBets: 10, // Default Number of Bets
    tokenId: '6028ea26-9f12-40ca-9333-2250b4524670',
    imageUrl: '/images/pfp-2.svg',
  })

  const handleInputChange = (field: string, value: any) => {
    setGameSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateContest = async () => {
    setCreatingGameState('loading')
    const errors = validateForm(gameSettings)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        toast.error(message)
      })
      return
    }

    const apiData = {
      title: gameSettings.title,
      depositAmount: gameSettings.depositAmount,
      currency: 'USD',
      maxParticipants: gameSettings.maxParticipants,
      numBets: gameSettings.numBets,
      matchupGroup: gameSettings.matchupGroup,
      //TODO: Update depositToken when live
      depositToken: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
      isPrivate: gameSettings.isPrivate,
      type: gameSettings.type,
      userControlType: gameSettings.userControlType,
      gameModeId: gameSettings.gameMode,
      tokenId: gameSettings.tokenId,
      imageUrl: gameSettings.imageUrl,
    }

    try {
      const response = await fetch('/api/create-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-para-session': session || '',
        },
        body: JSON.stringify(apiData),
      })

      const result = await response.json()

      if (response.ok) {
        setCreatingGameState('success')
        toast.success(
          <div>
            Contest created successfully! Transaction ID:
            <a
              href={`https://explorer.solana.com/tx/${result.txnId}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#00CED1', textDecoration: 'underline', marginLeft: '5px' }}
            >
              View Transaction
            </a>
          </div>,
        )
        setTimeout(() => {
          router.push(`/picks?id=${result.id}`)
        }, 1000)
      } else {
        setCreatingGameState('error')
        if (Array.isArray(result.message)) {
          result.message.forEach((msg: string) => toast.error(msg))
        } else {
          toast.error(result.message || 'Failed to create contest.')
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('Unexpected error. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <style jsx>{sliderStyles}</style>

      <PageHeader />

      {/* Main Content */}
      <div className="px-4 pb-20">
        <div className="max-w-md mx-auto space-y-6">
          {/* Main Form Container */}
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-6">
            <GameTitleInput title={gameSettings.title} onChange={(title) => handleInputChange('title', title)} />

          <GamePictureUpload
            avatar={gameSettings.imageUrl}
            setAvatar={(imageUrl: string) => handleInputChange('imageUrl', imageUrl)}
            session={session || ''}
          />

            <DepositAmountSelector
              depositAmount={gameSettings.depositAmount}
              onChange={(amount) => handleInputChange('depositAmount', amount)}
            />

            <ParticipantsSelector
              maxParticipants={gameSettings.maxParticipants}
              onChange={(participants) => handleInputChange('maxParticipants', participants)}
            />

            <BetsSelector numBets={gameSettings.numBets} onChange={(bets) => handleInputChange('numBets', bets)} />
          </div>

          <ContestSummary
            maxParticipants={gameSettings.maxParticipants}
            depositAmount={gameSettings.depositAmount}
            numberOfLegs={gameSettings.numBets}
            creatingGameState={creatingGameState}
            onCreateContest={handleCreateContest}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
//this took me like 4 hours of not ending it all to make this
