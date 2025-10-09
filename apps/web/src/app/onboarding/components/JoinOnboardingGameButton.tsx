import Link from 'next/link'
import { useEffect, useState } from 'react'

interface JoinOnboardingGameButtonProps {
  lobby: any
}

export default function JoinOnboardingGameButton({ lobby }: JoinOnboardingGameButtonProps) {
  const [hasJoined, setHasJoined] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has already joined this lobby
    const storedPicks = localStorage.getItem('onboardingUserPicks')
    if (storedPicks) {
      const picksData = JSON.parse(storedPicks)
      if (picksData.lobbyId === lobby.id) {
        setHasJoined(true)
      }
    }

    // Check if user has completed onboarding
    const completed = localStorage.getItem('onboardingCompleted')
    if (completed === 'true') {
      setHasCompletedOnboarding(true)
      // Show completion modal for completed users
      setShowCompletionModal(true)
    }
  }, [lobby.id])

  const handleCompleteOnboarding = () => {
    // Mark onboarding as completed
    localStorage.setItem('onboardingCompleted', 'true')
    setHasCompletedOnboarding(true)
    setShowCompletionModal(true)
  }

  const handleResetOnboarding = () => {
    // Clear onboarding data
    localStorage.removeItem('onboardingUserPicks')
    localStorage.removeItem('onboardingCompleted')
    localStorage.removeItem('onboardingTutorialSeen')

    // Clear all lobby popup seen states
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('onboardingLobbyPopupSeen_')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))

    setHasJoined(false)
    setHasCompletedOnboarding(false)
    setShowCompletionModal(false)
    // Reload the page to reset the flow
    window.location.reload()
  }

  if (hasJoined && !hasCompletedOnboarding) {
    return (
      <div className="mb-8">
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-emerald-400/30 rounded-2xl p-6 shadow-2xl shadow-emerald-400/10">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">You're In! 🎉</h3>
            <p className="text-emerald-200 text-sm mb-4">Your picks are locked in. Good luck!</p>
            <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-3 mb-4">
              <p className="text-emerald-100 text-xs">Check the participants list above to see your entry</p>
            </div>
            <button
              onClick={handleCompleteOnboarding}
              className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-slate-900 font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-[#00CED1]/30 transform hover:scale-[1.02] transition-all duration-300"
            >
              Continue Forward
            </button>
          </div>
        </div>
      </div>
    )
  }

  const spotsLeft = lobby.maxParticipants - (lobby.participants?.length || 0)

  return (
    <>
      {/* Completion Modal */}
      {(showCompletionModal || hasCompletedOnboarding) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 mx-4 w-full max-w-md shadow-2xl">
            <div className="text-center">
              {hasCompletedOnboarding ? (
                <>
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-4">Onboarding Complete! 🏆</h3>
                  <p className="text-slate-300 text-sm mb-6">
                    You've successfully completed the onboarding tutorial! Now you know how to play Ralli.
                  </p>
                  <div className="space-y-3">
                    <Link
                      href="/main"
                      className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-slate-900 font-bold py-3 px-6 rounded-xl hover:shadow-xl hover:shadow-[#00CED1]/30 transform hover:scale-[1.02] transition-all duration-300 inline-block text-center"
                    >
                      Go to Main Page
                    </Link>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="flex-1 bg-slate-700/50 border border-slate-600/50 text-white font-semibold py-2 px-4 rounded-xl hover:bg-slate-600/50 transition-all duration-300"
                      >
                        Stay Here
                      </button>
                      <button
                        onClick={handleResetOnboarding}
                        className="flex-1 bg-red-600/50 border border-red-500/50 text-red-200 font-semibold py-2 px-4 rounded-xl hover:bg-red-500/50 transition-all duration-300"
                      >
                        Reset Onboarding
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-4">Congratulations! You Won! 🎉</h3>
                  <p className="text-slate-300 text-sm mb-6">
                    This is what you need to know: Now you can go ahead and try it out for real! Create your own games,
                    join real lobbies, and start winning actual prizes.
                  </p>
                  <div className="space-y-3">
                    <Link
                      href="/main"
                      className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-slate-900 font-bold py-3 px-6 rounded-xl hover:shadow-xl hover:shadow-[#00CED1]/30 transform hover:scale-[1.02] transition-all duration-300 inline-block text-center"
                    >
                      Try It Out For Real!
                    </Link>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="flex-1 bg-slate-700/50 border border-slate-600/50 text-white font-semibold py-2 px-4 rounded-xl hover:bg-slate-600/50 transition-all duration-300"
                      >
                        Stay Here
                      </button>
                      <button
                        onClick={handleResetOnboarding}
                        className="flex-1 bg-red-600/50 border border-red-500/50 text-red-200 font-semibold py-2 px-4 rounded-xl hover:bg-red-500/50 transition-all duration-300"
                      >
                        Reset Onboarding
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-[#00CED1]/30 rounded-2xl p-6 shadow-2xl shadow-[#00CED1]/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold text-xl">Ready to Join?</h3>
              <p className="text-slate-400">
                {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining in this lobby
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">${lobby.depositAmount}</div>
              <div className="text-sm text-slate-400">Buy-in required</div>
            </div>
          </div>
          <Link
            href={`/onboarding/picks?id=${lobby.id}`}
            className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-slate-900 font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-[#00CED1]/30 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 mt-auto"
          >
            <span className="relative z-10">
              Make Your Picks • {spotsLeft} Spot{spotsLeft !== 1 ? 's' : ''} Left
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}
