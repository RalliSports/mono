'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import LoadingSpinner from '../view-game/components/LoadingSpinner'

interface GamePick {
  id: number
  player: string
  betType: string
  target: number
  currentValue: number
  betDirection: 'over' | 'under'
  odds: string
  status: 'not_started' | 'active' | 'won' | 'lost'
  gameTime: string
  athleteImage: string
  sport: string
  gameStatus:
    | 'pregame'
    | '1st_quarter'
    | '2nd_quarter'
    | 'halftime'
    | '3rd_quarter'
    | '4th_quarter'
    | 'overtime'
    | 'final'
  winProbability?: number
}

interface GameParticipant {
  id: number
  name: string
  avatar: string
  isOnline: boolean
  buyIn: number
  picks: GamePick[]
  joinedAt: string
  currentScore: number
  legsWon: number
  legsLost: number
  isEliminated: boolean
}

interface ActivityFeedItem {
  id: number
  type: 'game_start' | 'game_end' | 'pick_won' | 'pick_lost' | 'player_eliminated' | 'pick_added' | 'score_update'
  player: string
  avatar: string
  message: string
  timestamp: string
  data?: any
}

interface AthleteUpdate {
  id: number
  athleteName: string
  athleteImage: string
  sport: string
  updateType: 'score_update' | 'milestone' | 'quarter_end' | 'injury' | 'timeout' | 'game_status'
  currentValue: number
  previousValue?: number
  betType: string
  gameTime: string
  gameStatus: string
  affectedPlayers: string[]
  isPositive: boolean
  timestamp: string
  description: string
}

interface GameInfo {
  id: number
  name: string
  hostName: string
  hostAvatar: string
  currentPlayers: number
  maxPlayers: number
  buyIn: number
  maxPayout: number
  legs: number
  visibility: 'public' | 'private' | 'friends'
  status: 'waiting' | 'active' | 'completed'
  createdAt: string
  participants: GameParticipant[]
  currentUser: string
}

function LiveGameViewContent() {
  const searchParams = useSearchParams()
  const gameId = searchParams.get('id') || '1'

  const [activeTab, setActiveTab] = useState<'my_picks' | 'all_players'>('my_picks')
  const [sidebarTab, setSidebarTab] = useState<'live_feed' | 'leaderboard' | 'athlete_updates'>('live_feed')
  const [athleteUpdatesTab, setAthleteUpdatesTab] = useState<'my_picks' | 'lobby_picks'>('my_picks')
  const [expandedParticipants, setExpandedParticipants] = useState<number[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock game data - enhanced with rich profiles
  const gameInfo: GameInfo = {
    id: parseInt(gameId),
    name: 'NBA Sunday Showdown',
    hostName: 'GameMaster',
    hostAvatar: '🎮',
    currentPlayers: 12,
    maxPlayers: 20,
    buyIn: 25,
    maxPayout: 875,
    legs: 4,
    visibility: 'public',
    status: 'active',
    createdAt: '2 hours ago',
    participants: [
      {
        id: 1,
        name: 'You',
        avatar: '🎯',
        isOnline: true,
        buyIn: 25,
        currentScore: 2,
        legsWon: 2,
        legsLost: 0,
        isEliminated: false,
        joinedAt: '2 hours ago',
        picks: [
          {
            id: 1,
            player: 'LeBron James',
            betType: 'Points',
            target: 28.5,
            currentValue: 24,
            betDirection: 'over',
            odds: '+110',
            status: 'active',
            gameTime: '3rd Quarter',
            athleteImage: '👑',
            sport: 'NBA',
            gameStatus: '3rd_quarter',
            winProbability: 75,
          },
          {
            id: 2,
            player: 'Stephen Curry',
            betType: '3-Pointers',
            target: 4.5,
            currentValue: 6,
            betDirection: 'over',
            odds: '+120',
            status: 'won',
            gameTime: 'Final',
            athleteImage: '🔥',
            sport: 'NBA',
            gameStatus: 'final',
          },
          {
            id: 3,
            player: 'Anthony Davis',
            betType: 'Rebounds',
            target: 11.5,
            currentValue: 13,
            betDirection: 'over',
            odds: '-110',
            status: 'won',
            gameTime: 'Final',
            athleteImage: '🏀',
            sport: 'NBA',
            gameStatus: 'final',
          },
          {
            id: 4,
            player: 'Draymond Green',
            betType: 'Assists',
            target: 6.5,
            currentValue: 4,
            betDirection: 'under',
            odds: '-105',
            status: 'active',
            gameTime: '3rd Quarter',
            athleteImage: '🛡️',
            sport: 'NBA',
            gameStatus: '3rd_quarter',
            winProbability: 85,
          },
        ],
      },
      {
        id: 2,
        name: 'SportsBettingPro',
        avatar: '💰',
        isOnline: true,
        buyIn: 25,
        currentScore: 1,
        legsWon: 1,
        legsLost: 1,
        isEliminated: false,
        joinedAt: '2 hours ago',
        picks: [
          {
            id: 5,
            player: 'Joel Embiid',
            betType: 'Points',
            target: 30.5,
            currentValue: 28,
            betDirection: 'over',
            odds: '-110',
            status: 'active',
            gameTime: '3rd Quarter',
            athleteImage: '📈',
            sport: 'NBA',
            gameStatus: '3rd_quarter',
            winProbability: 45,
          },
          {
            id: 6,
            player: 'Jayson Tatum',
            betType: 'Rebounds',
            target: 8.5,
            currentValue: 11,
            betDirection: 'over',
            odds: '+105',
            status: 'won',
            gameTime: 'Final',
            athleteImage: '🔥',
            sport: 'NBA',
            gameStatus: 'final',
          },
          {
            id: 7,
            player: 'Luka Dončić',
            betType: 'Assists',
            target: 8.5,
            currentValue: 6,
            betDirection: 'under',
            odds: '-115',
            status: 'lost',
            gameTime: 'Final',
            athleteImage: '⭐',
            sport: 'NBA',
            gameStatus: 'final',
          },
          {
            id: 8,
            player: 'Giannis Antetokounmpo',
            betType: 'Points',
            target: 29.5,
            currentValue: 22,
            betDirection: 'under',
            odds: '+120',
            status: 'active',
            gameTime: '3rd Quarter',
            athleteImage: '🦌',
            sport: 'NBA',
            gameStatus: '3rd_quarter',
            winProbability: 70,
          },
        ],
      },
      {
        id: 3,
        name: 'RookiePlayer',
        avatar: '🌟',
        isOnline: false,
        buyIn: 25,
        currentScore: 0,
        legsWon: 0,
        legsLost: 2,
        isEliminated: true,
        joinedAt: '2 hours ago',
        picks: [
          {
            id: 9,
            player: 'Kevin Durant',
            betType: 'Points',
            target: 26.5,
            currentValue: 24,
            betDirection: 'over',
            odds: '-110',
            status: 'lost',
            gameTime: 'Final',
            athleteImage: '🐍',
            sport: 'NBA',
            gameStatus: 'final',
          },
          {
            id: 10,
            player: 'Nikola Jokić',
            betType: 'Assists',
            target: 9.5,
            currentValue: 8,
            betDirection: 'over',
            odds: '-110',
            status: 'lost',
            gameTime: 'Final',
            athleteImage: '🃏',
            sport: 'NBA',
            gameStatus: 'final',
          },
        ],
      },
      {
        id: 4,
        name: 'HighRoller',
        avatar: '🎲',
        isOnline: true,
        buyIn: 25,
        currentScore: 3,
        legsWon: 3,
        legsLost: 1,
        isEliminated: false,
        joinedAt: '1 hour ago',
        picks: [
          {
            id: 11,
            player: 'Damian Lillard',
            betType: 'Points',
            target: 25.5,
            currentValue: 28,
            betDirection: 'over',
            odds: '+105',
            status: 'won',
            gameTime: 'Final',
            athleteImage: '⏰',
            sport: 'NBA',
            gameStatus: 'final',
          },
          {
            id: 12,
            player: 'Jimmy Butler',
            betType: 'Steals',
            target: 1.5,
            currentValue: 2,
            betDirection: 'over',
            odds: '+120',
            status: 'won',
            gameTime: 'Final',
            athleteImage: '🔥',
            sport: 'NBA',
            gameStatus: 'final',
          },
          {
            id: 13,
            player: 'Paolo Banchero',
            betType: 'Rebounds',
            target: 7.5,
            currentValue: 9,
            betDirection: 'over',
            odds: '+110',
            status: 'won',
            gameTime: 'Final',
            athleteImage: '🆕',
            sport: 'NBA',
            gameStatus: 'final',
          },
          {
            id: 14,
            player: 'Kawhi Leonard',
            betType: 'Points',
            target: 22.5,
            currentValue: 18,
            betDirection: 'under',
            odds: '+100',
            status: 'lost',
            gameTime: 'Final',
            athleteImage: '🤖',
            sport: 'NBA',
            gameStatus: 'final',
          },
        ],
      },
    ],
    currentUser: 'You',
  }

  // Mock activity feed
  const activityFeed: ActivityFeedItem[] = [
    {
      id: 1,
      type: 'score_update',
      player: 'LeBron James',
      avatar: '👑',
      message: 'scored 2 points - now at 24 points',
      timestamp: '2 min ago',
    },
    {
      id: 2,
      type: 'pick_won',
      player: 'You',
      avatar: '🎯',
      message: 'won Anthony Davis Rebounds Over 11.5!',
      timestamp: '5 min ago',
    },
    {
      id: 3,
      type: 'score_update',
      player: 'Draymond Green',
      avatar: '🛡️',
      message: 'recorded an assist - now at 4 assists',
      timestamp: '7 min ago',
    },
    {
      id: 4,
      type: 'pick_won',
      player: 'You',
      avatar: '🎯',
      message: 'won Stephen Curry 3-Pointers Over 4.5!',
      timestamp: '12 min ago',
    },
    {
      id: 5,
      type: 'player_eliminated',
      player: 'RookiePlayer',
      avatar: '🌟',
      message: 'was eliminated from the game',
      timestamp: '15 min ago',
    },
    {
      id: 6,
      type: 'pick_won',
      player: 'HighRoller',
      avatar: '🎲',
      message: 'won Paolo Banchero Rebounds Over 7.5!',
      timestamp: '18 min ago',
    },
  ]

  // Mock athlete updates
  const athleteUpdates: AthleteUpdate[] = [
    {
      id: 1,
      athleteName: 'LeBron James',
      athleteImage: '👑',
      sport: 'NBA',
      updateType: 'score_update',
      currentValue: 24,
      previousValue: 22,
      betType: 'Points',
      gameTime: '8:32 3rd',
      gameStatus: '3rd Quarter',
      affectedPlayers: ['You'],
      isPositive: true,
      timestamp: '2 min ago',
      description: 'Made a layup for 2 points',
    },
    {
      id: 2,
      athleteName: 'Anthony Davis',
      athleteImage: '🏀',
      sport: 'NBA',
      updateType: 'milestone',
      currentValue: 13,
      previousValue: 11,
      betType: 'Rebounds',
      gameTime: 'Final',
      gameStatus: 'Final',
      affectedPlayers: ['You'],
      isPositive: true,
      timestamp: '5 min ago',
      description: 'Secured final rebound of the game',
    },
    {
      id: 3,
      athleteName: 'Joel Embiid',
      athleteImage: '📈',
      sport: 'NBA',
      updateType: 'score_update',
      currentValue: 28,
      previousValue: 26,
      betType: 'Points',
      gameTime: '7:45 3rd',
      gameStatus: '3rd Quarter',
      affectedPlayers: ['SportsBettingPro'],
      isPositive: true,
      timestamp: '4 min ago',
      description: 'Hit a 3-pointer for 3 points',
    },
  ]

  const getCurrentUserParticipant = () => {
    return gameInfo.participants.find((p) => p.name === gameInfo.currentUser)
  }

  const toggleParticipant = (participantId: number) => {
    setExpandedParticipants((prev) =>
      prev.includes(participantId) ? prev.filter((id) => id !== participantId) : [...prev, participantId],
    )
  }

  const isParticipantExpanded = (participantId: number) => {
    return expandedParticipants.includes(participantId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30'
      case 'lost':
        return 'text-red-400 bg-red-400/20 border-red-400/30'
      case 'active':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/30'
      default:
        return 'text-slate-400 bg-slate-400/20 border-slate-400/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won':
        return '✅'
      case 'lost':
        return '❌'
      case 'active':
        return '🔄'
      default:
        return '⏳'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'pick_won':
        return '🎉'
      case 'pick_lost':
        return '💔'
      case 'player_eliminated':
        return '⚡'
      case 'game_start':
        return '🏀'
      case 'game_end':
        return '🏁'
      case 'score_update':
        return '📊'
      case 'pick_added':
        return '➕'
      default:
        return '📢'
    }
  }

  const currentUser = getCurrentUserParticipant()
  const allPlayers = gameInfo.participants
  const sortedPlayers = [...allPlayers].sort((a, b) => b.currentScore - a.currentScore)

  if (!mounted) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-gray-900 min-h-screen">
      {/* Header - Compact for mobile */}
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border-b border-slate-700/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/profile?tab=parlays"
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-bold text-white">LIVE</h2>
              </div>
              <p className="text-slate-400 text-sm">{allPlayers.length} players competing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-400">
              {gameInfo.participants.filter((p) => p.isOnline).length}/{gameInfo.participants.length} online
            </span>
          </div>
        </div>

        {/* Enhanced Host Info - Mobile First */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-2xl shadow-xl">
                {gameInfo.hostAvatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center text-xs shadow-lg">
                👑
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-lg truncate">{gameInfo.hostName}</h3>
              <p className="text-slate-400 text-sm">Host • Started {gameInfo.createdAt}</p>
              <h4 className="text-base font-semibold text-white mt-1 truncate">{gameInfo.name}</h4>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xl font-bold text-emerald-400">${gameInfo.maxPayout}</div>
              <div className="text-xs text-slate-400">Prize Pool</div>
            </div>
          </div>
        </div>

        {/* Enhanced Game Details - Mobile Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 shadow-lg hover:shadow-[#00CED1]/10 transition-all duration-300">
            <div className="text-slate-400 text-xs">Players</div>
            <div className="text-white font-bold text-lg">
              {allPlayers.length}/{gameInfo.maxPlayers}
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
            <div className="text-slate-400 text-xs">Buy-in</div>
            <div className="text-emerald-400 font-bold text-lg">${gameInfo.buyIn}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <div className="text-slate-400 text-xs">Total Legs</div>
            <div className="text-white font-bold text-lg">{gameInfo.legs}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 shadow-lg hover:shadow-slate-500/10 transition-all duration-300">
            <div className="text-slate-400 text-xs">Visibility</div>
            <div className="text-slate-300 font-bold text-lg capitalize">{gameInfo.visibility}</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4">
        {/* Player Views Section */}
        <div className="mb-6">
          {/* Enhanced Glassmorphic Tab Navigation */}
          <div className="mb-4">
            <div className="relative bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl">
              <div className="flex relative">
                {/* Animated Background Slider */}
                <div
                  className={`absolute top-1.5 h-[calc(100%-12px)] bg-gradient-to-r from-[#00CED1]/80 to-blue-500/80 backdrop-blur-sm rounded-xl transition-all duration-300 ease-out shadow-lg shadow-[#00CED1]/20 ${
                    activeTab === 'my_picks' ? 'left-1.5 w-[calc(50%-6px)]' : 'left-[calc(50%+1.5px)] w-[calc(50%-6px)]'
                  }`}
                />

                <button
                  onClick={() => setActiveTab('my_picks')}
                  className={`relative z-10 flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-out ${
                    activeTab === 'my_picks' ? 'text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>My Picks</span>
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
                        activeTab === 'my_picks' ? 'bg-white/20 text-white' : 'bg-slate-700/50 text-slate-300'
                      }`}
                    >
                      {currentUser?.picks.length || 0}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('all_players')}
                  className={`relative z-10 flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-out ${
                    activeTab === 'all_players' ? 'text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>All Players</span>
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
                        activeTab === 'all_players' ? 'bg-white/20 text-white' : 'bg-slate-700/50 text-slate-300'
                      }`}
                    >
                      {gameInfo.participants.length}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* My Picks Tab */}
          {activeTab === 'my_picks' && currentUser && (
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-2xl">
                      {currentUser.avatar}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{currentUser.name}</h3>
                      <p className="text-slate-400 text-sm">
                        {currentUser.legsWon}/{gameInfo.legs} legs won
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{currentUser.currentScore}</div>
                    <div className="text-sm text-slate-400">Score</div>
                  </div>
                </div>

                {/* TriColor Progress Bar */}
                <div className="mt-4">
                  <div className="flex gap-1">
                    {currentUser.picks.map((pick, index) => (
                      <div key={pick.id} className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            pick.status === 'won'
                              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                              : pick.status === 'lost'
                                ? 'bg-gradient-to-r from-red-400 to-red-500'
                                : pick.status === 'active'
                                  ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                                  : 'bg-gradient-to-r from-slate-500 to-slate-600'
                          }`}
                          style={{ width: '100%' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-700/30">
                {currentUser.picks.map((pick) => (
                  <div key={pick.id} className="p-4 hover:bg-slate-700/20 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl">
                          {pick.athleteImage}
                        </div>
                        <div>
                          <h6 className="text-white font-semibold leading-tight">{pick.player}</h6>
                          <p className="text-slate-400 text-sm">
                            {pick.betType} {pick.betDirection} {pick.target} • {pick.odds}
                          </p>
                          <p className="text-slate-500 text-xs">
                            {pick.sport} • {pick.gameTime}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(pick.status)}`}
                          >
                            {getStatusIcon(pick.status)} {pick.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="text-white font-semibold">
                          {pick.currentValue} / {pick.target}
                        </div>
                        {pick.status === 'active' && pick.winProbability !== undefined && (
                          <div className="text-xs text-slate-400">{pick.winProbability}% win chance</div>
                        )}
                      </div>
                    </div>

                    {/* Progress indicator for active picks */}
                    {pick.status === 'active' && (
                      <div className="mt-3">
                        <div className="flex gap-1">
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                pick.betDirection === 'over'
                                  ? pick.currentValue >= pick.target
                                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                    : 'bg-gradient-to-r from-blue-400 to-blue-500'
                                  : pick.currentValue <= pick.target
                                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                    : 'bg-gradient-to-r from-blue-400 to-blue-500'
                              }`}
                              style={{
                                width: `${Math.min(100, Math.max(10, (pick.currentValue / pick.target) * 100))}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Players Tab */}
          {activeTab === 'all_players' && (
            <div className="space-y-3">
              {sortedPlayers.map((participant, index) => (
                <div key={participant.id} className="space-y-2">
                  {/* Enhanced Participant Header */}
                  <div
                    className={`bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer shadow-2xl ${
                      isParticipantExpanded(participant.id)
                        ? 'border-[#00CED1] shadow-[#00CED1]/20'
                        : 'hover:border-slate-600 hover:shadow-slate-600/10'
                    }`}
                    onClick={() => toggleParticipant(participant.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-2xl shadow-xl">
                              {participant.avatar}
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                                participant.isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                              }`}
                            ></div>
                            {index === 0 && (
                              <div className="absolute -top-1 -left-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs">
                                👑
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-white font-bold leading-tight">{participant.name}</h4>
                            <p className="text-slate-400 text-sm">
                              Score: {participant.currentScore} • {participant.legsWon}W/{participant.legsLost}L
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="text-sm text-slate-300">#{index + 1}</div>
                            <div className="text-xs text-slate-500">
                              {participant.isEliminated ? 'Eliminated' : 'Active'}
                            </div>
                          </div>
                          <div
                            className={`transform transition-transform duration-300 text-slate-400 ${
                              isParticipantExpanded(participant.id) ? 'rotate-180' : ''
                            }`}
                          >
                            ▼
                          </div>
                        </div>
                      </div>

                      {/* Quick Picks Preview */}
                      <div className="mt-3">
                        <div className="flex gap-1">
                          {participant.picks.slice(0, 4).map((pick, pickIndex) => (
                            <div key={pick.id} className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  pick.status === 'won'
                                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                    : pick.status === 'lost'
                                      ? 'bg-gradient-to-r from-red-400 to-red-500'
                                      : pick.status === 'active'
                                        ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                                        : 'bg-gradient-to-r from-slate-500 to-slate-600'
                                }`}
                                style={{ width: '100%' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Picks List */}
                  {isParticipantExpanded(participant.id) && (
                    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300 shadow-2xl shadow-[#00CED1]/10">
                      <div className="p-4 border-b border-slate-700/50">
                        <h5 className="text-white font-bold">{participant.name}'s Picks</h5>
                        <p className="text-slate-400 text-sm">{participant.picks.length} legs selected</p>
                      </div>

                      <div className="divide-y divide-slate-700/30">
                        {participant.picks.map((pick) => (
                          <div key={pick.id} className="p-4 hover:bg-slate-700/20 transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-lg">
                                  {pick.athleteImage}
                                </div>
                                <div>
                                  <h6 className="text-white font-semibold text-sm leading-tight">{pick.player}</h6>
                                  <p className="text-slate-400 text-xs">
                                    {pick.sport} • {pick.gameTime}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-white font-semibold text-sm">
                                  {pick.betType} {pick.betDirection} {pick.target}
                                </div>
                                <div className="text-slate-400 text-xs">
                                  {pick.currentValue} / {pick.target} • {pick.odds}
                                </div>
                                <span
                                  className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(pick.status)}`}
                                >
                                  {getStatusIcon(pick.status)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feed and Leaderboard Section */}
        <div className="space-y-6">
          {/* Enhanced Glassmorphic Sidebar Tab Navigation */}
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-2xl">
            <div className="relative bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-inner">
              <div className="flex relative">
                {/* Animated Background Slider */}
                <div
                  className={`absolute top-1.5 h-[calc(100%-12px)] bg-gradient-to-r from-[#00CED1]/80 to-blue-500/80 backdrop-blur-sm rounded-xl transition-all duration-300 ease-out shadow-lg shadow-[#00CED1]/20 ${
                    sidebarTab === 'live_feed'
                      ? 'left-1.5 w-[calc(33.33%-4px)]'
                      : sidebarTab === 'leaderboard'
                        ? 'left-[calc(33.33%+1.5px)] w-[calc(33.33%-4px)]'
                        : 'left-[calc(66.66%+1.5px)] w-[calc(33.33%-4px)]'
                  }`}
                />

                <button
                  onClick={() => setSidebarTab('live_feed')}
                  className={`relative z-10 flex-1 px-3 py-3 rounded-xl font-semibold transition-all duration-300 ease-out ${
                    sidebarTab === 'live_feed' ? 'text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        sidebarTab === 'live_feed' ? 'bg-white animate-pulse' : 'bg-slate-500'
                      }`}
                    ></div>
                    <span className="text-xs">Feed</span>
                  </div>
                </button>

                <button
                  onClick={() => setSidebarTab('leaderboard')}
                  className={`relative z-10 flex-1 px-3 py-3 rounded-xl font-semibold transition-all duration-300 ease-out ${
                    sidebarTab === 'leaderboard' ? 'text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>🏆</span>
                    <span className="text-xs">Board</span>
                  </div>
                </button>

                <button
                  onClick={() => setSidebarTab('athlete_updates')}
                  className={`relative z-10 flex-1 px-3 py-3 rounded-xl font-semibold transition-all duration-300 ease-out ${
                    sidebarTab === 'athlete_updates' ? 'text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>🏃‍♂️</span>
                    <span className="text-xs">Athletes</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Live Activity Feed */}
            {sidebarTab === 'live_feed' && (
              <div className="mt-4">
                <div className="mb-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    Live Feed
                  </h3>
                  <p className="text-slate-400 text-sm">Real-time updates</p>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2">
                  {activityFeed.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border border-slate-700/30 rounded-xl hover:bg-slate-700/20 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-sm">
                          {item.player === 'System' ? getActivityIcon(item.type) : item.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm">
                            <span className="font-semibold">{item.player}</span> {item.message}
                          </div>
                          <div className="text-slate-500 text-xs mt-1">{item.timestamp}</div>
                        </div>
                        <div className="text-lg">{getActivityIcon(item.type)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard */}
            {sidebarTab === 'leaderboard' && (
              <div className="mt-4">
                <div className="mb-4">
                  <h3 className="text-white font-bold text-lg">Leaderboard</h3>
                  <p className="text-slate-400 text-sm">Current standings</p>
                </div>

                <div className="space-y-2">
                  {sortedPlayers.slice(0, 5).map((participant, index) => (
                    <div
                      key={participant.id}
                      className="p-3 border border-slate-700/30 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0
                              ? 'bg-amber-500 text-white'
                              : index === 1
                                ? 'bg-slate-400 text-white'
                                : index === 2
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-slate-600 text-white'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="w-8 h-8 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-sm">
                          {participant.avatar}
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm">{participant.name}</div>
                          <div className="text-slate-400 text-xs">
                            {participant.legsWon}W / {participant.legsLost}L
                          </div>
                        </div>
                      </div>
                      <div className="text-white font-bold">{participant.currentScore}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Athlete Updates */}
            {sidebarTab === 'athlete_updates' && (
              <div className="mt-4">
                <div className="mb-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span>🏃‍♂️</span>
                    Athlete Updates
                  </h3>
                  <p className="text-slate-400 text-sm">Live performance tracking</p>

                  {/* Sub-tabs for My Picks vs Lobby Picks */}
                  <div className="mt-4">
                    <div className="relative bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-white/10 rounded-xl p-1 shadow-inner">
                      <div className="flex relative">
                        {/* Animated Background Slider */}
                        <div
                          className={`absolute top-1 h-[calc(100%-8px)] bg-gradient-to-r from-[#00CED1]/60 to-blue-500/60 backdrop-blur-sm rounded-lg transition-all duration-300 ease-out ${
                            athleteUpdatesTab === 'my_picks'
                              ? 'left-1 w-[calc(50%-4px)]'
                              : 'left-[calc(50%+1px)] w-[calc(50%-4px)]'
                          }`}
                        />

                        <button
                          onClick={() => setAthleteUpdatesTab('my_picks')}
                          className={`relative z-10 flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 ease-out text-xs ${
                            athleteUpdatesTab === 'my_picks' ? 'text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          My Picks
                        </button>

                        <button
                          onClick={() => setAthleteUpdatesTab('lobby_picks')}
                          className={`relative z-10 flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 ease-out text-xs ${
                            athleteUpdatesTab === 'lobby_picks' ? 'text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Lobby Picks
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2">
                  {athleteUpdatesTab === 'my_picks' && (
                    <div>
                      {athleteUpdates
                        .filter((update) => currentUser && update.affectedPlayers.includes(currentUser.name))
                        .map((update) => (
                          <div
                            key={update.id}
                            className="p-3 border border-slate-700/30 rounded-xl hover:bg-slate-700/20 transition-all duration-200"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-lg">
                                {update.athleteImage}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h6 className="text-white font-semibold text-sm">{update.athleteName}</h6>
                                  <div
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                                      update.isPositive
                                        ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30'
                                        : 'bg-red-400/20 text-red-400 border border-red-400/30'
                                    }`}
                                  >
                                    {update.isPositive ? '✅ Good' : '❌ Behind'}
                                  </div>
                                </div>
                                <p className="text-slate-400 text-xs mb-1">
                                  {update.betType}: {update.currentValue}
                                  {update.previousValue && ` (was ${update.previousValue})`}
                                </p>
                                <p className="text-slate-300 text-xs mb-2">{update.description}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500 text-xs">
                                    {update.gameTime} • {update.timestamp}
                                  </span>
                                  <span
                                    className={`text-xs ${update.isPositive ? 'text-emerald-400' : 'text-red-400'}`}
                                  >
                                    {update.sport}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {athleteUpdatesTab === 'lobby_picks' && (
                    <div>
                      {athleteUpdates.map((update) => (
                        <div
                          key={update.id}
                          className="p-3 border border-slate-700/30 rounded-xl hover:bg-slate-700/20 transition-all duration-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-lg">
                              {update.athleteImage}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h6 className="text-white font-semibold text-sm">{update.athleteName}</h6>
                                <div
                                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    update.isPositive
                                      ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30'
                                      : 'bg-red-400/20 text-red-400 border border-red-400/30'
                                  }`}
                                >
                                  {update.isPositive ? '✅ Hit' : '❌ Miss'}
                                </div>
                              </div>
                              <p className="text-slate-400 text-xs mb-1">
                                {update.betType}: {update.currentValue}
                                {update.previousValue && ` (was ${update.previousValue})`}
                              </p>
                              <p className="text-slate-300 text-xs mb-2">{update.description}</p>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-500 text-xs">
                                  {update.gameTime} • {update.timestamp}
                                </span>
                                <span className={`text-xs ${update.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {update.sport}
                                </span>
                              </div>
                              {/* Affected Players */}
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-slate-500 text-xs">Affects:</span>
                                {update.affectedPlayers.map((playerName, index) => {
                                  const player = gameInfo.participants.find((p) => p.name === playerName)
                                  return (
                                    <div key={index} className="flex items-center gap-1">
                                      <div className="w-4 h-4 backdrop-blur-lg bg-white/10 border border-white/20 rounded text-xs flex items-center justify-center">
                                        {player?.avatar || '👤'}
                                      </div>
                                      <span className="text-slate-400 text-xs">{playerName}</span>
                                      {index < update.affectedPlayers.length - 1 && (
                                        <span className="text-slate-600 text-xs">•</span>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LiveGameView() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LiveGameViewContent />
    </Suspense>
  )
}
