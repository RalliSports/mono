/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from '@getpara/react-sdk'
import { useToast } from '../../components/ui/toast'
import { useSessionToken } from '@/hooks/use-session'
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { Button } from '@/components/ui/button'
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
import ManualResolveLinesTab from './components/ManualResolveLinesTab'

export default function AdminPage() {
  return <AdminPageContent />
}

function AdminPageContent() {
  const { session } = useSessionToken()
  const router = useRouter()
  const { addToast } = useToast()
  const account = useAccount()
  const { isConnected, walletAddress } = useParaWalletBalance()
  const ADMIN_WALLET = '2oNQCTWsVdx8Hxis1Aq6kJhfgh8cdo6Biq6m9nxRTVuk'

  // Hook queries - must be called before any early returns
  const teamsQuery = useTeams()
  const athletesQuery = useAthletes()
  const gamesQuery = useGames()
  const linesQuery = useLines()
  const matchupsQuery = useMatchups()
  const statsQuery = useStats()

  // Active tab state
  const [activeTab, setActiveTab] = useState<TabType>('stats')

  // Track authentication state
  const [authState, setAuthState] = useState<'checking' | 'authorized' | 'no-session' | 'no-wallet' | 'unauthorized'>(
    'checking',
  )

  // Add timeout for email loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (authState === 'checking' && session && (account?.isConnected || isConnected)) {
        setAuthState('unauthorized')
      }
    }, 5000) // 5 second timeout

    return () => clearTimeout(timeout)
  }, [authState, session, account?.isConnected, isConnected, walletAddress])

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
    homeTeamId: '',
    awayTeamId: '',
    date: '',
  })

  // UI states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('all')

  const [resolvingLine, setResolvingLine] = useState<string | null>(null)
  const [resolutionData, setResolutionData] = useState({
    actualValue: 0,
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
      const lineAlreadyResolved = line.actualValue !== null
      return matchesSearch && !lineAlreadyResolved
    })
  }, [linesQuery.query.data, searchTerm, selectedSport])

  // Filtered data using useMemo with proper type casting
  const filteredMatchups = useMemo(() => {
    const matchupsData = matchupsQuery.query.data || []
    return matchupsData
  }, [matchupsQuery.query.data, searchTerm])

  const filteredGames = useMemo(() => {
    return (gamesQuery.open.data || []) as any
  }, [gamesQuery.open.data])

  // Authentication and authorization logic
  useEffect(() => {
    // First check: session
    if (!session) {
      setAuthState('no-session')
      router.push('/signin?callbackUrl=/admin')
      return
    }

    // Second check: wallet connection
    if (!account?.isConnected && !isConnected) {
      setAuthState('no-wallet')
      return
    }

    // Third check: admin wallet address authorization
    if (walletAddress?.toString() !== ADMIN_WALLET) {
      setAuthState('unauthorized')
      return
    }

    // All checks passed
    setAuthState('authorized')
  }, [session, account?.isConnected, isConnected, walletAddress, router, authState])

  // Handle different authentication states
  if (authState === 'checking') {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-medium">Checking if admin...</h2>
        </div>
      </div>
    )
  }

  if (authState === 'no-session') {
    return null // Will redirect to signin
  }

  if (authState === 'no-wallet') {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-medium">Checking wallet connection...</h2>
        </div>
      </div>
    )
  }

  if (authState === 'unauthorized') {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-6">🚫</div>
          <h2 className="text-white text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">You aren&apos;t an admin. Only authorized users can access this page.</p>
          <div className="items-center">
            <Button
              className="mx-auto bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-semibold text-xs sm:text-sm hover:opacity-90 transition-all duration-200 shadow-lg shadow-[#00CED1]/25 hover:shadow-[#00CED1]/40 hover:scale-105 block text-center"
              onClick={() => router.push('/main')}
            >
              Return to Main
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (authState !== 'authorized') {
    return null
  }

  // Handlers using mutations
  const handleCreateStat = async () => {
    // Check wallet authorization before proceeding
    if (walletAddress?.toString() !== ADMIN_WALLET) {
      addToast('Unauthorized: Admin wallet required', 'error')
      return
    }

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
    // Check wallet authorization before proceeding
    if (walletAddress?.toString() !== ADMIN_WALLET) {
      addToast('Unauthorized: Admin wallet required', 'error')
      return
    }

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
  const handleResolveLine = async (lineId: string, actualValue: number) => {
    // Check wallet authorization before proceeding
    if (walletAddress?.toString() !== ADMIN_WALLET) {
      addToast('Unauthorized: Admin wallet required', 'error')
      return
    }

    try {
      await linesQuery.resolve.mutateAsync({ lineId, actualValue })
      addToast(`Line resolved successfully! (${actualValue})`, 'success')
    } catch (error) {
      console.error('Error resolving line:', error)
      addToast('Failed to resolve line', 'error')
    }
  }

  const handleCreateLine = async () => {
    // Check wallet authorization before proceeding
    if (walletAddress?.toString() !== ADMIN_WALLET) {
      addToast('Unauthorized: Admin wallet required', 'error')
      return
    }

    try {
      await linesQuery.create.mutateAsync({
        matchupId: newLine.id,
      } as any)

      addToast('Lines created successfully!', 'success')
    } catch (error) {
      console.error('Error creating line:', error)
      addToast('Error creating line', 'error')
    }
  }

  const handleResolveLinesForMatchup = async (matchupId: string) => {
    // Check wallet authorization before proceeding
    if (walletAddress?.toString() !== ADMIN_WALLET) {
      addToast('Unauthorized: Admin wallet required', 'error')
      return
    }

    try {
      await matchupsQuery.resolve.mutateAsync({ matchupId })
      addToast(`Lines resolved successfully!`, 'success')
    } catch (error) {
      console.error('Error resolving line:', error)
      addToast('Failed to resolve line', 'error')
    }
  }

  const handleResolveGame = async (gameId: string) => {
    // Check wallet authorization before proceeding
    if (walletAddress?.toString() !== ADMIN_WALLET) {
      addToast('Unauthorized: Admin wallet required', 'error')
      return
    }

    try {
      await gamesQuery.resolve.mutateAsync(gameId)
      addToast('Game resolved successfully!', 'success')
    } catch (error) {
      console.error('Error resolving game:', error)
      addToast('Failed to resolve game', 'error')
    }
  }

  const handleCreateMatchUp = async () => {
    // Check wallet authorization before proceeding
    if (walletAddress?.toString() !== ADMIN_WALLET) {
      addToast('Unauthorized: Admin wallet required', 'error')
      return
    }

    if (!newMatchUp.homeTeamId || !newMatchUp.awayTeamId || !newMatchUp.date) {
      addToast('Please fill in all fields', 'error')
      return
    }

    if (newMatchUp.homeTeamId === newMatchUp.awayTeamId) {
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
        homeTeamId: newMatchUp.homeTeamId,
        awayTeamId: newMatchUp.awayTeamId,
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
              setNewLine={(line: any) => setNewLine(line)}
              handleCreateLine={handleCreateLine}
              matchUps={matchUps}
            />
          )}

          {activeTab === 'resolve-lines' && (
            <ResolveLinesTab handleResolveLinesForMatchup={handleResolveLinesForMatchup} matchUps={filteredMatchups} />
          )}

          {activeTab === 'manual-resolve-lines' && (
            <ManualResolveLinesTab
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
