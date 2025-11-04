'use client'

import Logo from '@/components/logo'
import Wordmark from '@/components/wordmark'

interface OnboardingWelcomeProps {
  onExperiencedPlayer: () => void
  onNewPlayer: () => void
}

export default function OnboardingWelcome({ onExperiencedPlayer, onNewPlayer }: OnboardingWelcomeProps) {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      {/* Top Navigation Bar - simplified version from main page */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="flex items-center justify-center px-4 py-3">
          <div className="flex flex-row items-center text-xl font-bold text-white">
            <Logo height={50} width={50} />
            <Wordmark fill="#F9AA92" height={20} width={120} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          {/* Welcome Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Welcome to <span className="text-cyan-400">Ralli</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-lg mx-auto">
              Get ready to experience the ultimate sports betting game
            </p>
          </div>

          {/* Experience Question */}
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Have you played Ralli before?</h2>
            <p className="text-gray-400 mb-8">Choose your path to get the best experience</p>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              {/* New Player Button - More Appealing Primary */}
              <button
                onClick={onNewPlayer}
                className="group flex-1 max-w-xs mx-auto md:mx-0 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 border border-cyan-400/20 shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/30"
              >
                <div className="flex flex-col items-center space-y-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>I'm new to Ralli</span>
                  <span className="text-sm text-cyan-200">Start your journey here!</span>
                </div>
              </button>

              {/* Experienced Player Button - Secondary */}
              <button
                onClick={onExperiencedPlayer}
                className="group flex-1 max-w-xs mx-auto md:mx-0 bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 border border-slate-600/50 shadow-lg"
              >
                <div className="flex flex-col items-center space-y-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>I've played before</span>
                  <span className="text-sm text-gray-400">Skip to main game</span>
                </div>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-sm text-gray-500">
            <p>Ready to start your Ralli journey?</p>
            <button
              onClick={() => {
                // Clear all onboarding data
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
                  if (key && key.startsWith('onboardingPicksPopupSeen_')) {
                    keysToRemove.push(key)
                  }
                }
                keysToRemove.forEach((key) => localStorage.removeItem(key))

                alert('Tutorial reset! Refresh the page to see it again.')
              }}
              className="mt-2 text-xs text-slate-400 hover:text-slate-300 underline"
            >
              Reset Tutorial (Debug)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
