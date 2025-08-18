'use client'

import { Suspense } from 'react'
import { TopNavigation, GameHeader, GameStats, ParticipantsList, LoadingSpinner } from './components'
import { useGameData } from './hooks/useGameData'

function ViewGameContent() {
  const { lobby, isLoading, expandedParticipants, toggleParticipant } = useGameData()

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading game...</p>
        </div>
      </div>
    )
  }

  if (!lobby) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Game not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <TopNavigation />

      {/* Main Content */}
      <div className="px-4 pb-20">
        <GameHeader lobby={lobby} />
        <GameStats lobby={lobby} />
        <ParticipantsList
          lobby={lobby}
          expandedParticipants={expandedParticipants}
          toggleParticipant={toggleParticipant}
        />
      </div>
    </div>
  )
}

export default function JoinGamePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ViewGameContent />
    </Suspense>
  )
}
