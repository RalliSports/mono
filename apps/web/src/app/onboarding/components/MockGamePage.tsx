'use client'

import { TopNavigation } from '@/app/main/components'
import { GameHeader } from '@/app/game/components'
import { GameStats } from '@/app/game/components'
import MockParticipantsList from './MockParticipantsList'
import { WinnersDisplay } from '@/app/game/components'
import { CreateNewGameButton } from '@/app/game/components'
import JoinOnboardingGameButton from './JoinOnboardingGameButton'
import TabNavigation from '@/app/game/components/TabNavigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GameTabType } from '@/app/game/hooks/useGameTabs'

interface MockGamePageProps {
  lobby: any
  onBack?: () => void
}

export default function MockGamePage({ lobby, onBack }: MockGamePageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<GameTabType>('parlays')
  const [expandedParticipants, setExpandedParticipants] = useState<string[]>([])
  const [showFinalPopup, setShowFinalPopup] = useState(false)

  const toggleParticipant = (id: string) => {
    setExpandedParticipants((prev) => (prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]))
  }

  // Show final popup after 3 seconds (only once per lobby)
  useEffect(() => {
    const popupSeenKey = `onboardingLobbyPopupSeen_${lobby.id}`
    const hasSeenPopup = localStorage.getItem(popupSeenKey)

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowFinalPopup(true)
        localStorage.setItem(popupSeenKey, 'true')
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [lobby.id])

  // Mock values for TopNavigation
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const mockBalances = { ralli: 1000 }

  // Ensure lobby.participants is always an array
  const safeLobby = {
    ...lobby,
    participants: Array.isArray(lobby?.participants) ? lobby.participants : [],
  }

  const handleCompleteTutorial = () => {
    // Just close the final popup
    setShowFinalPopup(false)
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <TopNavigation
        onMenuClick={() => setIsSidebarOpen(true)}
        isConnected={true}
        balances={mockBalances}
        balanceLoading={false}
        balanceError={null}
      />
      <div className="px-4 pb-20">
        <GameHeader lobby={safeLobby} />
        <GameStats lobby={safeLobby} />
        <WinnersDisplay lobby={safeLobby} />
        <CreateNewGameButton lobby={safeLobby} size="large" />
        <JoinOnboardingGameButton lobby={safeLobby} />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} isUserInGame={false} />
        {activeTab === 'parlays' && (
          <MockParticipantsList
            lobby={safeLobby}
            expandedParticipants={expandedParticipants}
            toggleParticipant={toggleParticipant}
          />
        )}
        {/* You can add a mock ChatSection here if needed */}
        {activeTab === 'chats' && (
          <div className="bg-slate-800/60 rounded-xl p-6 mt-6 text-white text-center">Mock chat coming soon!</div>
        )}
        {activeTab === 'invite-friends' && (
          <div className="bg-slate-800/60 rounded-xl p-6 mt-6 text-white text-center">
            Invite friends feature coming soon!
          </div>
        )}
        <button
          onClick={() => router.push('/onboarding/game-1')}
          className="mt-8 px-6 py-2 bg-slate-700 text-white rounded-xl"
        >
          Back
        </button>
      </div>

      {/* Final Tutorial Popup */}
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
                <h3 className="text-white font-bold text-xl mb-4">Welcome to the Lobby! 🎮</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  This is the lobby page! Check out the picks from other players below and press "Join Game" whenever
                  you're ready to make your predictions.
                </p>
                <div className="bg-purple-500/20 border border-purple-400/30 rounded-xl p-4 mb-6">
                  <p className="text-purple-200 text-xs">
                    🚀 You're all set to start playing! Join games, make predictions, and win prizes!
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleCompleteTutorial}
                  className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-slate-900 font-bold py-3 px-6 rounded-xl hover:shadow-xl hover:shadow-[#00CED1]/30 transform hover:scale-[1.02] transition-all duration-300"
                >
                  Let's Play! 🎉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
