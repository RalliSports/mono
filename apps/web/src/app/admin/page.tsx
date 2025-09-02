/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '../../components/ui/toast'
import { useSessionToken } from '@/hooks/use-session'
import { useAthletes, useGames, useLines, useMatchups, useStats, useTeams } from '@/hooks/api'

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

export default function AdminPage() {
  return <AdminPageContent />
}

function AdminPageContent() {
  const { session } = useSessionToken()
  const router = useRouter()
  const { addToast } = useToast()

  // Hook queries - must be called before any early returns
  const teamsQuery = useTeams()
  const athletesQuery = useAthletes()
  const gamesQuery = useGames()
  const linesQuery = useLines()
  const matchupsQuery = useMatchups()
  const statsQuery = useStats()

  // Active tab state
  const [activeTab, setActiveTab] = useState<TabType>('stats')

  // Form states
  const [newStat, setNewStat] = useState({
    name: '',
    description: '',
    customId: 0,
  })

  const [newPlayer, setNewPlayer] = useState({
    name: '',
    team: '',
    position: '',
    jerseyNumber: 0,
    age: 0,
    picture: '',
  })

  const [newLine, setNewLine] = useState({
    playerId: '',
    statTypeId: '',
    value: 0,
    id: '',
    gameDate: '',
  })

  const [newMatchUp, setNewMatchUp] = useState({
    homeTeam: {
      id: '',
      name: '',
      city: '',
      country: '',
      createdAt: new Date(),
    },
    awayTeam: {
      id: '',
      name: '',
      city: '',
      country: '',
      createdAt: new Date(),
    },
    date: '',
  })

  // UI states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('all')
  const [resolvingLine, setResolvingLine] = useState<string | null>(null)
  const [resolutionData, setResolutionData] = useState({
    actualValue: '',
    resolutionReason: '',
  })

  // Data with proper fallbacks - cast as any to avoid type errors
  const teams = (teamsQuery.data || []) as any
  const players = (athletesQuery.all.data || []) as any
  const matchUps = (matchupsQuery.query.data || []) as any
  const stats = (statsQuery.query.data || []) as any

  // Filtered data using useMemo with proper type casting
  const filteredLines = useMemo(() => {
    const linesData = (linesQuery.query.data || []) as any
    return linesData.filter((line: any) => {
      const matchesSearch =
        line.athlete?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        line.stat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSport = selectedSport === 'all' || line.matchup?.homeTeam?.name === selectedSport
      return matchesSearch && matchesSport
    })
  }, [linesQuery.query.data, searchTerm, selectedSport])

  const filteredGames = useMemo(() => {
    return (gamesQuery.open.data || []) as any
  }, [gamesQuery.open.data])

  // Redirect to signin if not logged in with callback to return to admin
  useEffect(() => {
    if (!session) {
      router.push('/signin?callbackUrl=/admin')
    }
  }, [session, router])

  // Don't render anything if not authenticated
  if (!session) {
    return null
  }

  // Handlers using mutations
  const handleCreateStat = async () => {
    if (!newStat.name || !newStat.description || !newStat.customId) {
      addToast('Please fill in all fields', 'error')
      return
    }

    try {
      await statsQuery.create.mutateAsync({
        customId: newStat.customId,
        name: newStat.name,
        description: newStat.description,
        displayName: newStat.name,
        shortDisplayName: newStat.name,
        abbreviation: newStat.name.substring(0, 3).toUpperCase(),
        statOddsName: newStat.name,
        createdAt: new Date(),
      } as any)

      setNewStat({
        name: '',
        description: '',
        customId: 0,
      })

      addToast('Stat type created successfully!', 'success')
    } catch (error) {
      console.error('Error creating stat:', error)
      addToast('Error creating stat', 'error')
    }
  }

  const handleCreatePlayer = async () => {
    if (!newPlayer.name || !newPlayer.team || !newPlayer.jerseyNumber || !newPlayer.position || !newPlayer.age) {
      addToast('Please fill in all required fields', 'error')
      return
    }

    try {
      await athletesQuery.create.mutateAsync({
        customId: Math.floor(Math.random() * 10000),
        espnAthleteId: null,
        name: newPlayer.name,
        position: newPlayer.position,
        jerseyNumber: newPlayer.jerseyNumber,
        age: newPlayer.age,
        picture: newPlayer.picture || null,
        teamId: newPlayer.team,
        createdAt: new Date(),
      } as any)

      setNewPlayer({
        name: '',
        team: '',
        position: '',
        jerseyNumber: 0,
        age: 0,
        picture: '',
      })

      addToast('Player added successfully!', 'success')
    } catch (error) {
      console.error('Error creating player:', error)
      addToast('Error creating player', 'error')
    }
  }

  const handleCreateLine = async () => {
    if (!newLine.playerId || !newLine.statTypeId || !newLine.value || !newLine.id) {
      addToast('Please fill in all fields', 'error')
      return
    }

    try {
      await linesQuery.create.mutateAsync({
        createdAt: new Date(),
        status: 'open',
        createdTxnSignature: null,
        resolvedTxnSignature: null,
        athleteId: newLine.playerId,
        statId: newLine.statTypeId,
        matchupId: newLine.id,
        predictedValue: newLine.value.toString(),
        actualValue: null,
        isHigher: null,
        startsAt: new Date(newLine.gameDate),
      } as any)

      addToast('Line created successfully!', 'success')
    } catch (error) {
      console.error('Error creating line:', error)
      addToast('Error creating line', 'error')
    }
  }

  const handleResolveLine = async (lineId: string, actualValue: number) => {
    try {
      await linesQuery.resolve.mutateAsync(lineId)
      addToast(`Line resolved successfully! (${actualValue})`, 'success')
    } catch (error) {
      console.error('Error resolving line:', error)
      addToast('Failed to resolve line', 'error')
    }
  }

  const handleResolveGame = async (gameId: string) => {
    try {
      await gamesQuery.resolve.mutateAsync(gameId)
      addToast('Game resolved successfully!', 'success')
    } catch (error) {
      console.error('Error resolving game:', error)
      addToast('Failed to resolve game', 'error')
    }
  }

  const handleCreateMatchUp = async () => {
    if (!newMatchUp.homeTeam || !newMatchUp.awayTeam || !newMatchUp.date) {
      addToast('Please fill in all fields', 'error')
      return
    }

    if (newMatchUp.homeTeam === newMatchUp.awayTeam) {
      addToast('Home and away teams must be different', 'error')
      return
    }

    const matchDate = new Date(newMatchUp.date)
    if (isNaN(matchDate.getTime())) {
      addToast('Please enter a valid date', 'error')
      return
    }

    try {
      await matchupsQuery.create.mutateAsync({
        createdAt: new Date(),
        status: 'scheduled',
        startsAt: matchDate,
        espnEventId: null,
        gameDate: null,
        scoreHome: null,
        scoreAway: null,
        homeTeamId: newMatchUp.homeTeam.id,
        awayTeamId: newMatchUp.awayTeam.id,
      } as any)

      addToast('Match-up created successfully!', 'success')
    } catch (error) {
      console.error('Error creating matchup:', error)
      addToast('Failed to create match-up', 'error')
    }
  }

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
