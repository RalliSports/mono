'use client'

import { useState, useEffect } from 'react'

interface OnboardingTutorialProps {
  onComplete: () => void
  onStepChange?: (step: TutorialStep) => void
}

type TutorialStep = 'explain-lobbies' | 'highlight-lobby' | 'click-view-button'

export default function OnboardingTutorial({ onComplete, onStepChange }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState<TutorialStep>('explain-lobbies')
  const [showTutorial, setShowTutorial] = useState(true)
  const [tutorialHidden, setTutorialHidden] = useState(false)

  useEffect(() => {
    // Check if user has already seen this tutorial
    const tutorialSeen = localStorage.getItem('onboardingTutorialSeen')
    if (tutorialSeen === 'true') {
      setShowTutorial(false)
      onComplete()
    }
  }, [onComplete])

  const handleNextStep = () => {
    switch (currentStep) {
      case 'explain-lobbies':
        setCurrentStep('highlight-lobby')
        onStepChange?.('highlight-lobby')
        break
      case 'highlight-lobby':
        setCurrentStep('click-view-button')
        onStepChange?.('click-view-button')
        break
      case 'click-view-button':
        localStorage.setItem('onboardingTutorialSeen', 'true')
        setShowTutorial(false)
        onComplete()
        break
    }
  }

  const handleSkipTutorial = () => {
    localStorage.setItem('onboardingTutorialSeen', 'true')
    setShowTutorial(false)
    onComplete()
  }

  if (!showTutorial) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

      {/* Tutorial Content - centered */}
      <div className="relative z-10 w-full max-w-md mx-4 pointer-events-auto">
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="text-center">
            {/* Tutorial Content */}
            {currentStep === 'explain-lobbies' && (
              <>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏟️</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-4">Welcome to Lobbies! 🎯</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  Lobbies are game rooms where people gather to make sports predictions together. Each lobby has a
                  buy-in amount, number of picks required, and a prize pool that everyone shares.
                </p>
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-6">
                  <p className="text-blue-200 text-xs">
                    💡 Think of it like a fantasy sports league, but with real money prizes!
                  </p>
                </div>
              </>
            )}

            {currentStep === 'highlight-lobby' && (
              <>
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👀</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-4">Check Out This Lobby</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  Here's an example lobby: "NBA Night Showdown". You can see the creator, buy-in amount ($10), number of
                  picks needed (3), and how many spots are filled.
                </p>
                <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-4 mb-6">
                  <p className="text-emerald-200 text-xs">
                    📊 The progress bar shows how full the lobby is - join before it fills up!
                  </p>
                </div>
              </>
            )}

            {currentStep === 'click-view-button' && (
              <>
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎮</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-4">Time to Join! 🚀</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  Now press the "View Lobby" button on the highlighted lobby to continue with the tutorial. This will
                  take you to the picks page where you can make your predictions.
                </p>
                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4 mb-6">
                  <p className="text-yellow-200 text-xs">🎯 Click the pulsing "View Lobby" button to proceed!</p>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSkipTutorial}
                className="flex-1 bg-slate-700/50 border border-slate-600/50 text-slate-300 font-semibold py-2 px-4 rounded-xl hover:bg-slate-600/50 transition-all duration-300 text-sm"
              >
                Skip Tutorial
              </button>
              <button
                onClick={handleNextStep}
                className="flex-1 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-slate-900 font-bold py-3 px-6 rounded-xl hover:shadow-xl hover:shadow-[#00CED1]/30 transform hover:scale-[1.02] transition-all duration-300"
              >
                {currentStep === 'click-view-button' ? 'Got it!' : 'Next'}
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${currentStep === 'explain-lobbies' ? 'bg-[#00CED1]' : 'bg-slate-600'}`}
              ></div>
              <div
                className={`w-2 h-2 rounded-full ${currentStep === 'highlight-lobby' ? 'bg-[#00CED1]' : 'bg-slate-600'}`}
              ></div>
              <div
                className={`w-2 h-2 rounded-full ${currentStep === 'click-view-button' ? 'bg-[#00CED1]' : 'bg-slate-600'}`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
