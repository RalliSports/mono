/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useToast } from '../../components/ui/toast'
import { Dropdown, SportsDropdown } from '../../components/ui/dropdown'
import { useSessionToken } from '@/hooks/use-session'

// Types for the admin panel
interface Stat {
  id: string
  name: string
  description: string
  customId: number
  createdAt: string
}

interface Team {
  id: string
  name: string
  city: string
  country: string
  createdAt: Date
}

interface Player {
  id: string
  name: string
  team: {
    name: string
  }
  jerseyNumber: number
  position: string
  age: number
  picture?: string
}

interface Line {
  id: string
  createdAt: string
  athleteId: string
  statId: string
  matchupId: string
  predictedValue: number
  actualValue: number
  isHigher: boolean
  sport?: string
  playerName?: string
  value?: number
  stat: {
    id: string
    customId: number
    name: string
    description: string
    createdAt: Date
  }
  matchup: {
    id: string
    homeTeam: Team
    awayTeam: Team
    gameDate: Date
    status: string
    scoreHome: number
    scoreAway: number
    createdAt: Date
  }
  athlete: {
    id: string
    name: string
    team: string
    position: string
    jerseyNumber: number
    age: number
    picture: string
    createdAt: Date
  }
}

interface GameMode {
  id: string
  label: string

  description: string

  createdAt: string
}

interface User {
  id: string

  emailAddress: string

  walletAddress: string

  paraUserId: string

  // @ApiProperty()
  // role: Role;
}

interface Participant {
  id: string
  userId: string
  gameId: string
  joinedAt: string
  isWinner: boolean
  txnId: string | null
}

interface Game {
  id: string
  title: string
  participants: Participant[]
  creatorId: string
  depositAmount: number

  currency: string
  createdAt: Date

  status: string
  maxParticipants: number

  maxBet: number
  gameCode: string

  matchupGroup: string
  depositToken: string

  isPrivate: boolean
  type: 'parlay' | 'head_to_head' | 'pool'

  userControlType: 'whitelist' | 'blacklist' | 'none'
  gameModeId: string

  gameMode: GameMode

  creator: User
}

interface MatchUp {
  id: string
  homeTeam: Team
  awayTeam: Team
  date: Date
}

export default function AdminPage() {
  return <AdminPageContent />
}

function AdminPageContent() {
  const { session } = useSessionToken()

  const { addToast } = useToast()
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch('/api/read-teams', {
        method: 'GET',
        headers: {
          'x-para-session': session || '',
        },
      })
      const data = await response.json()
      setTeams(data)
    }
    fetchTeams()
  }, [session])
  const [activeTab, setActiveTab] = useState<
    'stats' | 'lines' | 'players' | 'resolve-lines' | 'resolve-games' | 'matchups'
  >('stats')

  // Sport configurations
  const sports = [
    {
      name: 'NBA',
      code: '03XXXX',
      icon: '🏀',
      color: 'from-[#00CED1] to-[#FFAB91]',
    },
    {
      name: 'NFL',
      code: '01XXXX',
      icon: '🏈',
      color: 'from-[#FFAB91] to-[#00CED1]',
    },
    {
      name: 'Soccer',
      code: '04XXXX',
      icon: '⚽',
      color: 'from-[#00CED1] to-[#FFAB91]',
    },
    {
      name: 'Baseball',
      code: '02XXXX',
      icon: '⚾',
      color: 'from-[#FFAB91] to-[#00CED1]',
    },
  ]

  // Players data from API
  const [players, setPlayers] = useState<Player[]>([])

  // Fetch players from API
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('/api/fetch-athletes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-para-session': session || '',
          },
        })

        if (response.ok) {
          const fetchedPlayers = await response.json()
          setPlayers(fetchedPlayers)
        } else {
          console.error('Failed to fetch players:', response.statusText)
          addToast('Failed to fetch players', 'error')
        }
      } catch (error) {
        console.error('Error fetching players:', error)
        addToast('Error fetching players', 'error')
      }
    }

    if (session) {
      fetchPlayers()
    }
  }, [session])

  // Mock data for lines
  const [lines, setLines] = useState<Line[]>([])

  useEffect(() => {
    const fetchLines = async () => {
      try {
        const response = await fetch('/api/read-lines', {
          method: 'GET',
          headers: {
            'x-para-session': session || '',
          },
        })
        const data = await response.json()
        setLines(data)
      } catch (error) {
        console.error('Error fetching lines:', error)
        setLines([])
      }
    }
    fetchLines()
  }, [session])

  // Mock data for games (using existing lobby structure)
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/read-open-games', {
          method: 'GET',
          headers: {
            'x-para-session': session || '',
          },
        })
        const data = await response.json()

        setGames(data)
      } catch (error) {
        console.error('Error fetching matchups:', error)
        setGames([])
      }
    }
    fetchGames()
  }, [session])

  const timeNow = new Date()

  // Mock data for matchups
  const [matchUps, setMatchUps] = useState<MatchUp[]>([])

  useEffect(() => {
    const fetchMatchups = async () => {
      try {
        const response = await fetch('/api/read-matchups', {
          method: 'GET',
          headers: {
            'x-para-session': session || '',
          },
        })
        const data = await response.json()

        setMatchUps(data)
      } catch (error) {
        console.error('Error fetching matchups:', error)
        setMatchUps([])
      }
    }
    fetchMatchups()
  }, [session])

  const [stats, setStats] = useState<Stat[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/read-stats', {
          method: 'GET',
          headers: {
            'x-para-session': session || '',
          },
        })
        const data = await response.json()

        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats([])
      }
    }
    fetchStats()
  }, [session])

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
    gameId: '',
    gameDate: '',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('all')

  // New matchup form state
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

  // Resolution state for lines
  const [resolvingLine, setResolvingLine] = useState<string | null>(null)
  const [resolutionData, setResolutionData] = useState({
    actualValue: '',
    resolutionReason: '',
  })

  const handleCreateStat = async () => {
    if (!newStat.name || !newStat.description || !newStat.customId) {
      addToast('Please fill in all fields', 'error')
      return
    }

    setNewStat({
      name: '',
      description: '',
      customId: 0,
    })

    const apiData = {
      name: newStat.name,
      description: newStat.description,
      customId: newStat.customId,
    }
    await fetch('/api/create-stat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
      body: JSON.stringify(apiData),
    })
    addToast('Stat type created successfully!', 'success')
  }

  const handleCreatePlayer = async () => {
    if (!newPlayer.name || !newPlayer.team || !newPlayer.jerseyNumber || !newPlayer.position || !newPlayer.age) {
      addToast('Please fill in all required fields', 'error')
      return
    }

    try {
      const apiData = {
        name: newPlayer.name,
        team: newPlayer.team,
        position: newPlayer.position,
        jerseyNumber: newPlayer.jerseyNumber,
        age: newPlayer.age,
        picture: newPlayer.picture || undefined, // optional field
      }

      const response = await fetch('/api/create-athlete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-para-session': session || '',
        },
        body: JSON.stringify(apiData),
      })

      if (response.ok) {
        const newPlayerData = await response.json()

        // Add the new player to the local state
        setPlayers([...players, newPlayerData])

        // Reset the form
        setNewPlayer({
          name: '',
          team: '',
          position: '',
          jerseyNumber: 0,
          age: 0,
          picture: '',
        })

        addToast('Player added successfully!', 'success')
      } else {
        const errorData = await response.json()
        addToast(errorData.error || 'Failed to create player', 'error')
      }
    } catch (error) {
      console.error('Error creating player:', error)
      addToast('Error creating player', 'error')
    }
  }

  const handleCreateLine = async () => {
    if (!newLine.playerId || !newLine.statTypeId || !newLine.value || !newLine.gameId) {
      addToast('Please fill in all fields', 'error')
      return
    }

    const apiData = {
      athleteId: newLine.playerId,
      statId: newLine.statTypeId,
      matchupId: newLine.gameId,
      predictedValue: newLine.value,
      startsAtTimestamp: new Date(newLine.gameDate).getTime(),
    }

    const response = await fetch('/api/create-line', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
      body: JSON.stringify(apiData),
    })

    const result = await response.json()

    if (result.error) {
      addToast(result.error, 'error')
      return
    }

    addToast('Line created successfully!', 'success')
  }

  const handleResolveLine = async (lineId: string, actualValue: number) => {
    const apiData = {
      lineId: lineId,
      actualValue: actualValue,
    }
    await fetch('/api/resolve-line', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
      body: JSON.stringify(apiData),
    })

    addToast(`Line resolved successfully! (${actualValue})`, 'success')
  }

  const handleResolveGame = async (gameId: string) => {
    const apiData = {
      gameId: gameId,
    }
    await fetch('/api/resolve-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
      body: JSON.stringify(apiData),
    })

    addToast('Game resolved successfully!', 'success')
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

    const apiData = {
      homeTeamId: newMatchUp.homeTeam.id,
      awayTeamId: newMatchUp.awayTeam.id,
      startsAtTimestamp: matchDate.getTime(),
    }

    const response = await fetch('/api/create-matchup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
      body: JSON.stringify(apiData),
    })

    const result = await response.json()
    console.log('result', result)

    addToast('Match-up created successfully!', 'success')
  }

  // Filter functions
  const filteredLines = lines.filter((line) => {
    const matchesSearch =
      line.athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.stat.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = selectedSport === 'all' || line.matchup.homeTeam.name === selectedSport
    return matchesSearch && matchesSport
  })

  const filteredGames = games
  // .filter((game) => {
  //   const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase())
  //   const matchesSport = selectedSport === 'all' || game.sport === selectedSport
  //   return matchesSearch && matchesSport
  // })

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Enhanced Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back Button + Title */}
          <div className="flex items-center space-x-3">
            <Link
              href="/main"
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-white">
              <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                Admin Panel
              </span>
            </h1>
          </div>

          {/* Right: Status or Info */}
          <div className="flex items-center space-x-3">
            {/* Connect Wallet Button */}

            {/* Admin Access Indicator */}
            {/* <div className="bg-gradient-to-r from-[#00CED1]/20 to-[#FFAB91]/20 border border-[#00CED1]/30 rounded-xl px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-bold text-sm bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                  Admin Access
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-20">
        <div className="max-w-6xl mx-auto pt-6">
          {/* Tab Navigation */}
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-3 shadow-2xl mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'stats', name: 'Stat Types', icon: '📊' },
                { id: 'players', name: 'Players', icon: '👤' },
                { id: 'lines', name: 'Create Lines', icon: '📈' },
                { id: 'resolve-lines', name: 'Resolve Lines', icon: '✅' },
                { id: 'resolve-games', name: 'Resolve Games', icon: '🎮' },
                { id: 'matchups', name: 'Match Up', icon: '⚔️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>{' '}
          {/* Tab Content */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create New Stat Type Form */}
              <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                    <span className="text-lg">➕</span>
                  </span>
                  Create Stat Type
                </h2>{' '}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Stat Name</label>
                    <input
                      type="text"
                      value={newStat.name}
                      onChange={(e) => setNewStat({ ...newStat, name: e.target.value })}
                      placeholder="e.g., Points, Assists, Goals"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Description</label>
                    <textarea
                      value={newStat.description}
                      onChange={(e) =>
                        setNewStat({
                          ...newStat,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe what this stat measures..."
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Custom ID</label>
                    <input
                      type="text"
                      value={newStat.customId}
                      onChange={(e) =>
                        setNewStat({
                          ...newStat,
                          customId: parseInt(e.target.value),
                        })
                      }
                      placeholder="e.g., 00001-00001"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all font-mono"
                    />
                    <p className="text-slate-400 text-xs mt-1">
                      Enter the specific numerical ID (e.g., 00001-00001) or leave blank to auto-generate
                    </p>
                  </div>

                  <button
                    onClick={handleCreateStat}
                    className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  >
                    Create Stat Type
                  </button>
                </div>
              </div>

              {/* Existing Stat Types */}
              <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-3 flex items-center justify-center">
                    <span className="text-lg">📋</span>
                  </span>
                  Existing Stats
                </h2>

                {/* Search and Filter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search stat types..."
                      className="w-full px-4 py-3 pl-11 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {stats
                    .filter((stat) => {
                      const matchesSearch =
                        stat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        stat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        stat.customId.toString().includes(searchTerm.toLowerCase())
                      return matchesSearch
                    })
                    .map((stat) => (
                      <div
                        key={stat.id}
                        className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/20 hover:border-[#00CED1]/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="flex-1">
                                <h4 className="text-white font-semibold text-lg">{stat.name}</h4>
                                <div className="flex items-center space-x-2">
                                  {/* <span className="text-[#00CED1] text-sm font-medium">{stat.sport}</span> */}
                                  <span className="text-slate-400">•</span>
                                  <span className="text-[#FFAB91] font-mono text-sm">{stat.customId}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-3 pl-13">{stat.description}</p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <button className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors group">
                              <svg
                                className="w-4 h-4 text-slate-400 group-hover:text-[#00CED1]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button className="p-2 bg-slate-800/50 hover:bg-red-500/20 rounded-lg transition-colors group">
                              <svg
                                className="w-4 h-4 text-slate-400 group-hover:text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {stats.filter((stat) => {
                    const matchesSearch =
                      stat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      stat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      stat.customId.toString().includes(searchTerm.toLowerCase())
                    return matchesSearch
                  }).length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-slate-400 mb-2"></div>
                      <p className="text-slate-400">No stat types found matching your criteria</p>
                      <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filter</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'players' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add New Player Form */}
              <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </span>
                  Add New Player
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Player Name</label>
                    <input
                      type="text"
                      value={newPlayer.name}
                      onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                      placeholder="e.g., LeBron James"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Team</label>
                      <input
                        type="text"
                        value={newPlayer.team}
                        onChange={(e) => setNewPlayer({ ...newPlayer, team: e.target.value })}
                        placeholder="e.g., LAL"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Jersey #</label>
                      <input
                        type="number"
                        value={newPlayer.jerseyNumber}
                        onChange={(e) =>
                          setNewPlayer({
                            ...newPlayer,
                            jerseyNumber: parseInt(e.target.value),
                          })
                        }
                        placeholder="e.g., 23"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Position</label>
                      <input
                        type="text"
                        value={newPlayer.position}
                        onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                        placeholder="e.g., SF, QB, FW"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Age</label>
                      <input
                        type="number"
                        value={newPlayer.age}
                        onChange={(e) => setNewPlayer({ ...newPlayer, age: parseInt(e.target.value) })}
                        placeholder="e.g., 25"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Picture URL (Optional)</label>
                    <input
                      type="url"
                      value={newPlayer.picture}
                      onChange={(e) => setNewPlayer({ ...newPlayer, picture: e.target.value })}
                      placeholder="e.g., https://example.com/player-image.jpg"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>

                  <button
                    onClick={handleCreatePlayer}
                    className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  >
                    Add Player
                  </button>
                </div>
              </div>

              {/* Existing Players */}
              <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-3 flex items-center justify-center">
                    <span className="text-lg">👥</span>
                  </span>
                  Existing Players
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {players.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-slate-400 mb-2">No players found</div>
                      <div className="text-sm text-slate-500">Add players using the form on the left</div>
                    </div>
                  ) : (
                    players.map((player) => (
                      <div
                        key={player.id}
                        className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center overflow-hidden">
                            {player.picture ? (
                              <Image
                                src={player.picture}
                                alt={player.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback to initials if image fails to load
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  const parent = target.parentElement
                                  if (parent) {
                                    parent.innerHTML = `<span class="text-white font-bold">${player.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')
                                      .toUpperCase()}</span>`
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-white font-bold">
                                {player.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{player.name}</h4>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-slate-300">{player.team.name}</span>
                              <span className="text-slate-400">#{player.jerseyNumber}</span>
                              <span className="text-slate-400">{player.position}</span>
                              <span className="text-slate-400">Age: {player.age}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'lines' && (
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                  <span className="text-lg">📈</span>
                </span>
                Create New Line
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Select Player</label>
                    <Dropdown
                      value={newLine.playerId}
                      onChange={(value) => setNewLine({ ...newLine, playerId: value })}
                      placeholder="Select a player"
                      options={[
                        { value: '', label: 'Select a player', disabled: true },
                        ...players.map((player) => ({
                          value: player.id,
                          label: `${player.name} (${player.team.name})`,
                          icon: '👤',
                        })),
                      ]}
                      searchable={true}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Select Stat Type</label>
                    <Dropdown
                      value={newLine.statTypeId}
                      onChange={(value) => setNewLine({ ...newLine, statTypeId: value })}
                      placeholder="Select stat type"
                      options={[
                        {
                          value: '',
                          label: 'Select stat type',
                          disabled: true,
                        },
                        ...stats.map((stat) => ({
                          value: stat.id,
                          label: `${stat.name} (${stat.customId})`,
                          icon: '📊',
                        })),
                      ]}
                      searchable={true}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Line Value</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newLine.value}
                      onChange={(e) => setNewLine({ ...newLine, value: parseFloat(e.target.value) })}
                      placeholder="e.g., 28.5"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-70  0/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Select Game</label>
                    <select
                      value={newLine.gameId}
                      onChange={(e) => setNewLine({ ...newLine, gameId: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    >
                      <option value="">Select a game</option>
                      {matchUps.map((matchUp) => (
                        <option key={matchUp.id} value={matchUp.id}>
                          {matchUp.homeTeam.name} vs {matchUp.awayTeam.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Create Line Button - Full Width at Bottom */}
              <div className="mt-6">
                <button
                  onClick={handleCreateLine}
                  className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  Create Line
                </button>
              </div>
            </div>
          )}
          {activeTab === 'resolve-lines' && (
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                  <span className="text-lg">✅</span>
                </span>
                Resolve Lines
              </h2>

              {/* Search and Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by player or stat name..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                  />
                </div>

                <div>
                  <SportsDropdown
                    value={selectedSport}
                    onChange={setSelectedSport}
                    includeAll={true}
                    placeholder="Filter by sport"
                  />
                </div>
              </div>

              {/* Lines List */}
              <div className="space-y-4">
                {filteredLines.map((line) => (
                  <div
                    key={line.id}
                    className="bg-slate-700/30 rounded-xl p-6 hover:bg-slate-700/50 transition-colors border border-slate-600/20"
                  >
                    <div className="space-y-4">
                      {/* Line Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{sports.find((s) => s.name === line.sport)?.icon}</span>
                          <h4 className="text-white font-semibold text-lg">{line.playerName}</h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              line.createdAt > timeNow.toISOString()
                                ? 'bg-[#00CED1]/20 text-[#00CED1] border border-[#00CED1]/30'
                                : !!line.actualValue
                                  ? 'bg-[#FFAB91]/20 text-[#FFAB91] border border-[#FFAB91]/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-400/30'
                            }`}
                          >
                            {line.createdAt > timeNow.toISOString()
                              ? 'Pending'
                              : !!line.actualValue
                                ? 'Resolved'
                                : 'Cancelled'}
                          </span>
                        </div>
                        <div
                          key={line.athlete.id}
                          className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center overflow-hidden">
                              <Image
                                src={line.athlete.picture}
                                alt={line.athlete.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold">{line.athlete.name}</h4>
                              <div className="flex items-center space-x-2 text-sm">
                                <span className="text-slate-300">{line.athlete.team}</span>
                                <span className="text-slate-400">#{line.athlete.jerseyNumber}</span>
                                <span className="text-slate-400">{line.athlete.position}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-400">Line Value</div>
                          <div className="text-xl font-bold text-[#FFAB91]">{line.predictedValue}</div>
                        </div>
                      </div>

                      {/* Line Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-800/30 rounded-lg">
                        <div>
                          <div className="text-sm text-slate-400">Stat Type</div>
                          <div className="text-white font-semibold">{line.stat.name}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400">Game</div>
                          <div className="text-white font-semibold">
                            {line.matchup.homeTeam.name} vs {line.matchup.awayTeam.name}
                          </div>
                        </div>
                      </div>

                      {/* Resolution Status or Input */}
                      {!!line.actualValue && (
                        <div className="p-4 bg-gradient-to-r from-[#FFAB91]/10 to-[#00CED1]/10 border border-[#FFAB91]/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-slate-300">Resolved Value</div>
                              <div className="text-lg font-bold text-[#FFAB91]">
                                {line.actualValue} (Line was {line.predictedValue})
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-300">Result</div>
                              <div
                                className={`font-bold ${
                                  line.actualValue! > line.predictedValue ? 'text-[#00CED1]' : 'text-[#FFAB91]'
                                }`}
                              >
                                {line.actualValue! > line.predictedValue
                                  ? 'OVER'
                                  : line.actualValue! < line.predictedValue
                                    ? 'UNDER'
                                    : 'PUSH'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {!line.actualValue && (
                        <div className="border-t border-slate-600/30 pt-4">
                          {resolvingLine === line.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-white font-semibold mb-2">
                                    Actual {line.stat.name} Value
                                  </label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={resolutionData.actualValue}
                                    onChange={(e) =>
                                      setResolutionData({
                                        ...resolutionData,
                                        actualValue: e.target.value,
                                      })
                                    }
                                    placeholder={`e.g., ${line.predictedValue}`}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                                  />
                                  <div className="mt-1 text-sm text-slate-400">Line value: {line.value}</div>
                                </div>
                                <div>
                                  <label className="block text-white font-semibold mb-2">
                                    Resolution Reason (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={resolutionData.resolutionReason}
                                    onChange={(e) =>
                                      setResolutionData({
                                        ...resolutionData,
                                        resolutionReason: e.target.value,
                                      })
                                    }
                                    placeholder="e.g., Official stats, injury, etc."
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-3">
                                <button
                                  onClick={() => {
                                    const actualValue = parseFloat(resolutionData.actualValue)
                                    if (isNaN(actualValue)) {
                                      addToast('Please enter a valid actual value', 'error')
                                      return
                                    }
                                    handleResolveLine(line.id, actualValue)
                                    setResolvingLine(null)
                                    setResolutionData({
                                      actualValue: '',
                                      resolutionReason: '',
                                    })
                                  }}
                                  disabled={!resolutionData.actualValue}
                                  className="px-6 py-3 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Auto Resolve
                                </button>
                                <button
                                  onClick={() => {
                                    handleResolveLine(line.id, 0)
                                    setResolvingLine(null)
                                    setResolutionData({
                                      actualValue: '',
                                      resolutionReason: '',
                                    })
                                  }}
                                  className="px-4 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-xl transition-colors"
                                >
                                  Cancel Line
                                </button>
                                <button
                                  onClick={() => {
                                    setResolvingLine(null)
                                    setResolutionData({
                                      actualValue: '',
                                      resolutionReason: '',
                                    })
                                  }}
                                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => setResolvingLine(line.id)}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                              >
                                Resolve Line
                              </button>
                              <button
                                onClick={() => {
                                  handleResolveLine(line.id, 0)
                                }}
                                className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-xl transition-colors"
                              >
                                Quick Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'resolve-games' && (
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                  <span className="text-lg">🎮</span>
                </span>
                Resolve Games
              </h2>

              {/* Search and Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by game title..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                  />
                </div>

                <div>
                  <SportsDropdown
                    value={selectedSport}
                    onChange={setSelectedSport}
                    includeAll={true}
                    placeholder="Filter by sport"
                  />
                </div>
              </div>

              {/* Games List */}
              <div className="space-y-4">
                {filteredGames.map((game) => (
                  <div key={game.id} className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {/* <span className="text-lg">{sports.find((s) => s.name === game.sport)?.icon}</span> */}
                          <h4 className="text-white font-semibold">{game.title}</h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              game.status === 'active'
                                ? 'bg-[#00CED1]/20 text-[#00CED1]'
                                : game.status === 'waiting'
                                  ? 'bg-yellow-500/20 text-[#FFAB91]'
                                  : 'bg-[#FFAB91]/20 text-[#FFAB91]'
                            }`}
                          >
                            {game.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-400 mb-2">
                          <span>
                            Players: {game.participants.length}/{game.maxParticipants}
                          </span>
                          <span>Buy-in: ${game.depositAmount}</span>
                          <span>Pool: ${game.depositAmount * game.participants.length}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-slate-300">Host:</span>
                          {/* <span className="text-[#FFAB91]">{game.host.name}</span>
                          <span className="text-slate-400">• {game.timeLeft} remaining</span> */}
                        </div>
                      </div>

                      {/* {game.status === 'active' && ( */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleResolveGame(game.id)}
                          className="px-4 py-2 bg-[#00CED1] hover:bg-[#00CED1]/90 text-white font-semibold rounded-lg transition-colors"
                        >
                          End Game
                        </button>
                        {/* <button
                            onClick={() => handleResolveGame(game.id, 'cancel')}
                            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors"
                          >
                            Cancel
                          </button> */}
                      </div>
                      {/* )} */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Match Up Tab */}
          {activeTab === 'matchups' && (
            <div className="space-y-6">
              {/* Match-ups Section */}
              <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                    <span className="text-lg">⚔️</span>
                  </span>
                  Match-ups
                </h2>

                {/* Create Match-up Form */}
                <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Create New Match-up</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Select Player</label>
                      <Dropdown
                        value={newMatchUp.homeTeam.id}
                        onChange={(value) =>
                          setNewMatchUp({ ...newMatchUp, homeTeam: { ...newMatchUp.homeTeam, id: value } })
                        }
                        placeholder="Select the home team"
                        options={[
                          { value: '', label: 'Select the home team', disabled: true },
                          ...teams.map((team) => ({
                            value: team.id,
                            label: `${team.name}`,
                            icon: '👤',
                          })),
                        ]}
                        searchable={true}
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Select Player</label>
                      <Dropdown
                        value={newMatchUp.awayTeam.id}
                        onChange={(value) =>
                          setNewMatchUp({ ...newMatchUp, awayTeam: { ...newMatchUp.awayTeam, id: value } })
                        }
                        placeholder="Select the away team"
                        options={[
                          { value: '', label: 'Select the away team', disabled: true },
                          ...teams.map((team) => ({
                            value: team.id,
                            label: `${team.name}`,
                            icon: '👤',
                          })),
                        ]}
                        searchable={true}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                      <input
                        type="datetime-local"
                        value={newMatchUp.date}
                        onChange={(e) => setNewMatchUp({ ...newMatchUp, date: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleCreateMatchUp}
                    className="mt-6 w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  >
                    Create Match-up
                  </button>
                </div>

                {/* Match-ups List */}
                <div className="space-y-4">
                  {matchUps.map((matchUp) => (
                    <div
                      key={matchUp.id}
                      className="bg-slate-700/30 rounded-xl p-6 hover:bg-slate-700/50 transition-colors border border-slate-600/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center mb-2">
                              <span className="font-bold text-white text-sm">HOME</span>
                            </div>
                            <p className="text-xs text-slate-400">Home</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">VS</p>
                          </div>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-slate-600/50 rounded-full flex items-center justify-center mb-2">
                              <span className="font-bold text-white text-sm">AWAY</span>
                            </div>
                            <p className="text-xs text-slate-400">Away</p>
                          </div>
                          <div className="ml-6">
                            <h4 className="text-xl font-bold text-white mb-1">
                              {matchUp.homeTeam.name} vs {matchUp.awayTeam.name}
                            </h4>
                            {/* <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg">{sports.find((s) => s.name === matchUp.sport)?.icon}</span>
                              <p className="text-sm text-slate-300 font-medium">{matchUp.sport}</p>
                            </div> */}
                            <p className="text-xs text-slate-400">{new Date(matchUp.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              matchUp.status === 'scheduled'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                                : matchUp.status === 'live'
                                  ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                                  : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
                            }`}
                          >
                            {matchUp.status.charAt(0).toUpperCase() + matchUp.status.slice(1)}
                          </span> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
