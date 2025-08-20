/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useToast } from '../../components/ui/toast'
import { useSessionToken } from '@/hooks/use-session'

// Import modular components
import {
  AdminHeader,
  TabNavigation,
  StatsTab,
  PlayersTab,
  LinesTab,
  ResolveLinesTab,
  ResolveGamesTab,
  MatchupsTab,
  TabType,
} from './components'

// Import custom hook
import { useAdminData } from './hooks/useAdminData'

export default function AdminPage() {
  return <AdminPageContent />
}

function AdminPageContent() {
  const { session } = useSessionToken()
  const { addToast } = useToast()

  // Active tab state
  const [activeTab, setActiveTab] = useState<TabType>('stats')

  // Use our custom hook to get all data and handlers
  const {
    // Data
    teams,
    players,
    lines,
    games,
    matchUps,
    stats,

    // Form states
    newStat,
    setNewStat,
    newPlayer,
    setNewPlayer,
    newLine,
    setNewLine,
    newMatchUp,
    setNewMatchUp,

    // UI states
    searchTerm,
    setSearchTerm,
    selectedSport,
    setSelectedSport,
    resolvingLine,
    setResolvingLine,
    resolutionData,
    setResolutionData,

    // Handlers
    handleCreateStat,
    handleCreatePlayer,
    handleCreateLine,
    handleResolveLine,
    handleResolveGame,
    handleCreateMatchUp,

    // Filtered data
    filteredLines,
    filteredGames,
  } = useAdminData(session || null)

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Enhanced Top Navigation Bar */}
      <AdminHeader />

      {/* Main Content */}
      <div className="px-4 pb-20">
        <div className="max-w-6xl mx-auto pt-6">
          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Tab Content */}
          {activeTab === 'stats' && (
            <StatsTab
              stats={stats}
              newStat={newStat}
              setNewStat={setNewStat}
              handleCreateStat={handleCreateStat}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}

          {activeTab === 'players' && (
            <PlayersTab
              players={players}
              newPlayer={newPlayer}
              setNewPlayer={setNewPlayer}
              handleCreatePlayer={handleCreatePlayer}
            />
          )}

          {activeTab === 'lines' && (
            <LinesTab
              newLine={newLine}
              setNewLine={setNewLine}
              handleCreateLine={handleCreateLine}
              players={players}
              stats={stats}
              matchUps={matchUps}
            />
          )}

          {activeTab === 'resolve-lines' && (
            <ResolveLinesTab
              filteredLines={filteredLines}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedSport={selectedSport}
              setSelectedSport={setSelectedSport}
              resolvingLine={resolvingLine}
              setResolvingLine={setResolvingLine}
              resolutionData={resolutionData}
              setResolutionData={setResolutionData}
              handleResolveLine={handleResolveLine}
              addToast={addToast}
            />
          )}

          {activeTab === 'resolve-games' && (
            <ResolveGamesTab
              filteredGames={filteredGames}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedSport={selectedSport}
              setSelectedSport={setSelectedSport}
              handleResolveGame={handleResolveGame}
            />
          )}

          {activeTab === 'matchups' && (
            <MatchupsTab
              matchUps={matchUps}
              newMatchUp={newMatchUp}
              setNewMatchUp={setNewMatchUp}
              handleCreateMatchUp={handleCreateMatchUp}
              teams={teams}
            />
          )}
        </div>
      </div>
    </div>
  )
}
