'use client'

import { useState, useEffect } from 'react'
import { useSessionToken } from '@/hooks/use-session'
import { toast, ToastContainer } from 'react-toastify'
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { useRouter, useSearchParams } from 'next/navigation'
import LottieLoading from '@/components/ui/lottie-loading'
import { CreateGameDtoType } from '@repo/server'

// Components
import {
  PageHeader,
  GameTitleInput,
  DepositAmountSelector,
  ParticipantsSelector,
  BetsSelector,
  TokenSelector,
  ContestSummary,
  sliderStyles,
  CreatingGameState,
  FormErrors,
  PrivateGameToggle,
} from './components'

// Types and Hooks
import { useGameValidation } from './hooks/useGameValidation'
import GamePictureUpload from './components/GamePictureUpload'

//check if para is connected else kick back to /signin

export default function CreateGame() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { validateForm } = useGameValidation()

  // Para wallet balance hook
  const { isConnected } = useParaWalletBalance()
  const { session } = useSessionToken()
  const [mounted, setMounted] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [creatingGameState, setCreatingGameState] = useState<CreatingGameState>('idle')

  // Get pre-selected participants from URL
  const preSelectedParticipants = searchParams.get('participants')?.split(',') || []
  const fromGameId = searchParams.get('fromGame')

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
    // Simulate page loading time
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 1500) // Back to 1.5 seconds
    return () => clearTimeout(timer)
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

  const [, setFormErrors] = useState<FormErrors>({})
  const [selectedToken, setSelectedToken] = useState({
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '🪙',
    address: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  })
  const [gameSettings, setGameSettings] = useState<CreateGameDtoType>({
    title: '',
    depositAmount: 25,
    maxParticipants: 4,
    matchupGroup: 'TEST',
    isPrivate: false,
    type: 'limited',
    userControlType: 'none',
    numBets: 4, // Default Number of Bets
    imageUrl: '/images/pfp-2.svg',
  })

  // Update game settings when pre-selected participants are detected
  useEffect(() => {
    if (preSelectedParticipants.length > 0) {
      setGameSettings((prev) => ({
        ...prev,
        isPrivate: true,
        title: fromGameId ? `New Game - Group ${fromGameId.slice(-4)}` : 'New Game with Same Group',
      }))
    }
  }, [preSelectedParticipants.length, fromGameId])

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setGameSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleTokenChange = (token: { symbol: string; name: string; icon: string; address: string }) => {
    setSelectedToken(token)
    handleInputChange('depositToken', token.address)
  }

  const handleCreateContest = async () => {
    setCreatingGameState('loading')
    const errors = validateForm(gameSettings)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([, message]) => {
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
      isPrivate: gameSettings.isPrivate,
      type: gameSettings.type,
      userControlType: gameSettings.userControlType,
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

        // Send invitations to pre-selected participants
        if (preSelectedParticipants.length > 0) {
          try {
            // Send invitations to each participant
            const invitePromises = preSelectedParticipants.map(async (userId) => {
              return fetch('/api/game-invite', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-para-session': session || '',
                },
                body: JSON.stringify({
                  userId: userId.trim(),
                  gameId: result.id,
                }),
              })
            })

            await Promise.all(invitePromises)
            toast.success(
              `Invitations sent to ${preSelectedParticipants.length} player${preSelectedParticipants.length !== 1 ? 's' : ''}!`,
            )
          } catch (inviteError) {
            console.error('Error sending invitations:', inviteError)
            toast.warning('Game created but some invitations failed to send')
          }
        }

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

  // Show loading screen while page is loading
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <LottieLoading
          size="xl"
          message="Setting up Create Game..."
          subMessage="Please wait while we prepare everything for you"
        />
      </div>
    )
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
              avatar={gameSettings.imageUrl || ''}
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

            <TokenSelector selectedToken={selectedToken} onChange={handleTokenChange} />

            <PrivateGameToggle
              isPrivate={gameSettings.isPrivate}
              onChange={(isPrivate) => handleInputChange('isPrivate', isPrivate)}
            />
          </div>

          <ContestSummary
            maxParticipants={gameSettings.maxParticipants}
            depositAmount={gameSettings.depositAmount}
            numberOfLegs={gameSettings.numBets}
            creatingGameState={creatingGameState}
            onCreateContest={handleCreateContest}
            isPrivate={gameSettings.isPrivate}
          />

          {/* Show who will be invited if coming from an existing game */}
          {preSelectedParticipants.length > 0 && (
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">👥</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Same Group Game</h3>
                  <p className="text-blue-400 text-xs">Previous players will be automatically invited</p>
                </div>
              </div>
              <div className="text-blue-300 text-sm">
                <span className="font-semibold">
                  {preSelectedParticipants.length} player{preSelectedParticipants.length !== 1 ? 's' : ''}
                </span>{' '}
                from your previous game will receive an invitation when this game is created.
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
//this took me like 4 hours of not ending it all to make this
