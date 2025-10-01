'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import OnboardingWelcome from './OnboardingWelcome'
import MockMainPage from './MockMainPage'

type OnboardingStep = 'welcome' | 'tutorial-main'

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if onboarding has been completed
    const completed = localStorage.getItem('onboardingCompleted')
    if (completed === 'true') {
      setOnboardingCompleted(true)
    }

    // Listen for storage changes to update progress in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'onboardingCompleted' && e.newValue === 'true') {
        setOnboardingCompleted(true)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleExperiencedPlayer = () => {
    router.push('/main')
  }

  const handleNewPlayer = () => {
    setCurrentStep('tutorial-main')
  }

  const handleBackToWelcome = () => {
    setCurrentStep('welcome')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Content */}
      <div>
        {(() => {
          switch (currentStep) {
            case 'welcome':
              return <OnboardingWelcome onExperiencedPlayer={handleExperiencedPlayer} onNewPlayer={handleNewPlayer} />
            case 'tutorial-main':
              return <MockMainPage />
            default:
              return null
          }
        })()}
      </div>
    </div>
  )
}
