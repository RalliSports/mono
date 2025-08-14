'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ParaButton } from '@/components/para-modal'
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { useSessionToken } from '@/hooks/use-session'
import Image from 'next/image'
import { GameMode } from '@repo/db/types'

interface User {
  id: string
  emailAddress: string

  walletAddress: string
  paraUserId: string

  firstName?: string
  lastName?: string

  username?: string
  avatar?: string
}

interface Bet {
  id: string

  userId: string

  participantId: string

  lineId: string

  gameId: string

  predictedDirection: string

  isCorrect: boolean

  createdAt: Date

  user: User

  line: Line
}

interface Line {
  id: string
  createdAt: Date
  athleteId: string
  statId: string
  matchupId: string
  predictedValue: number
  actualValue: number
  matchup: Matchup
  athlete: Athlete
}

interface Athlete {
  id: string
  name: string
  picture: string
}

interface Matchup {
  id: string

  homeTeam: string

  awayTeam: string

  gameDate: Date

  status: string

  scoreHome: number

  scoreAway: number

  createdAt: Date

  startsAt: Date
}

interface Participant {
  id: string
  user: User
  isWinner: boolean
  joinedAt: Date
  bets: Bet[]
}

interface Game {
  id: string

  title: string

  creatorId: string

  depositAmount: number

  currency: string

  createdAt: Date

  status: string

  maxParticipants: number

  numBets: number

  gameCode: string

  matchupGroup: string

  depositToken: string

  createdTxnSignature: string

  resolvedTxnSignature: string

  isPrivate: boolean

  type: 'parlay' | 'head_to_head' | 'pool'

  userControlType: 'whitelist' | 'blacklist' | 'none'

  gameModeId: string

  gameMode: GameMode

  creator: User

  participants: Participant[]
}

function ProfileContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { session } = useSessionToken()

  const [username, setUsername] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [editingUsername, setEditingUsername] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [myOpenGames, setMyOpenGames] = useState<Game[]>([])

  // Fix hydration issues and handle URL params
  useEffect(() => {
    setMounted(true)
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'parlays', 'history', 'achievements', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleUpdateUser = async () => {
    const response = await fetch('/api/update-user', {
      method: 'PATCH',
      headers: {
        'x-para-session': session,
      },
      body: JSON.stringify({
        username,
        avatar: avatar || 'https://static.wikifutbol.com/images/b/b8/AthleteDefault.jpg',
        firstName,
        lastName,
      }),
    })
    const data = await response.json()
    console.log(data)
    setUser(data)
    setUsername(data.username)
    setAvatar(data.avatar)
    setFirstName(data.firstName || '')
    setLastName(data.lastName || '')
  }

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/read-current-user', {
        headers: {
          'x-para-session': session,
        },
      })
      const data = await response.json()
      setUser(data)
      setUsername(data.username)
      setAvatar(data.avatar)
      setFirstName(data.firstName || '')
      setLastName(data.lastName || '')
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchMyOpenGames = async () => {
      const response = await fetch('/api/read-my-open-games', {
        headers: {
          'x-para-session': session,
        },
      })
      const data = await response.json()
      setMyOpenGames(data)
      console.log(data, 'data')
    }
    fetchMyOpenGames()
  }, [])

  // Para wallet balance hook
  const { isConnected, balances, isLoading: balanceLoading, error: balanceError } = useParaWalletBalance()

  // Format balance for display
  const formatBalance = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // const tabs = [
  //   { id: 'overview', name: 'Overview', icon: '📊' },
  //   { id: 'parlays', name: 'Active Parlays', icon: '🎯' },
  //   { id: 'history', name: 'History', icon: '📈' },
  //   { id: 'achievements', name: 'Achievements', icon: '🏆' },
  //   { id: 'settings', name: 'Settings', icon: '⚙️' },
  // ]

  // Don't render until mounted to prevent hydration issues
  if (!mounted || !user) {
    return null
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50">
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
                My Profile
              </span>
            </h1>
          </div>

          {/* Right: Balance */}
          {/* Right: Balance + Profile */}
          <div className="flex items-center space-x-3">
            <div
              className="bg-gradient-to-r from-[#00CED1]/20 to-[#FFAB91]/20 border border-[#00CED1]/30 rounded-xl px-4 py-2 backdrop-blur-sm cursor-pointer hover:from-[#00CED1]/30 hover:to-[#FFAB91]/30 transition-all duration-200"
              onClick={() => {
                router.push('/add-funds')
              }}
              title={
                isConnected
                  ? `Click to refresh balance\nSOL: ${formatBalance(balances.sol)}\nRALLI: $${formatBalance(balances.ralli)}`
                  : 'Connect wallet to view balance'
              }
            >
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-lg flex items-center justify-center">
                  {balanceLoading ? (
                    <div className="w-3 h-3 border-[1.5px] border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                  {isConnected
                    ? balanceLoading
                      ? 'Loading...'
                      : balanceError
                        ? '$0.00'
                        : `$${formatBalance(balances.ralli)}`
                    : '$0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-xl flex items-center justify-center shadow-2xl">
                <Image src={user.avatar || ''} alt="User Avatar" width={80} height={80} />
              </div>
            </div>
            <div className="flex-1">
              {/* <h2 className="text-2xl font-bold text-white">{user.name}</h2> */}
              {editingUsername ? (
                <div className="flex items-center space-x-1">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-transparent text-white border border-white rounded-md p-1"
                  />
                  <button
                    onClick={() => {
                      setEditingUsername(false)
                      handleUpdateUser()
                    }}
                    className="bg-white text-black px-2 py-1 rounded-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" viewBox="0 0 24 24" fill="none">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"
                        fill="#0f172bf2"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1" onClick={() => setEditingUsername(true)}>
                  <p className="text-slate-400 text-2xl">{user.username}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" viewBox="0 0 24 24" fill="none">
                    <g id="Edit / Edit_Pencil_01">
                      <path
                        id="Vector"
                        d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-xl p-4 text-center border border-slate-700/50"
              onClick={() => {
                router.push('/add-funds')
              }}
            >
              <div className="text-2xl font-bold text-[#00CED1]">${formatBalance(balances.ralli)}</div>
              <div className="text-slate-400 text-sm">Balance</div>
            </div>
            <ParaButton />

            {/* <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-xl p-4 text-center border border-slate-700/50">
              <div className="text-2xl font-bold text-white">{user.totalBets}</div>
              <div className="text-slate-400 text-sm">Total Bets</div>
            </div> */}
          </div>

          {/* Current Streak
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 backdrop-blur-sm rounded-xl border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="text-emerald-400 font-bold">
                    {user.currentStreak} {user.streakType} streak
                  </div>
                  <div className="text-emerald-300/70 text-sm">
                    Keep it going!
                  </div>
                </div>
              </div>
              <div className="text-emerald-400 font-bold text-2xl">
                +{user.currentStreak}
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Tab Navigation */}
      {/* <div className="px-4 mb-6">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg'
                  : 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div> */}

      {/* Tab Content */}
      <div className="px-4 pb-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Active Parlays Preview */}
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
                    <span className="text-lg">🎯</span>
                  </span>
                  Active Parlays
                </h3>
                <button
                  onClick={() => setActiveTab('parlays')}
                  className="text-[#00CED1] hover:text-[#FFAB91] transition-colors text-sm font-medium"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {myOpenGames.length > 0 &&
                  myOpenGames.slice(0, 4).map((game) => (
                    <div
                      key={game.id}
                      onClick={() => {
                        router.push(`/view-game?id=${game.id}`)
                      }}
                      className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-slate-600/60 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-white font-semibold text-lg">{game.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium ${
                                game.status === 'live'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : game.status === 'pending'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              }`}
                            >
                              {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                            </span>
                            <span className="text-slate-400 text-sm">{game.participants.length} players</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[#00CED1] font-bold text-lg">
                            ${game.depositAmount * game.participants.length}
                          </div>
                          <div className="text-slate-400 text-xs">Potential</div>
                        </div>
                      </div>

                      {/* Progress Bar
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Progress</span>
                        <span className="text-slate-400 text-sm">
                          {parlay.completedLegs}/{parlay.legs} legs
                        </span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(parlay.completedLegs / parlay.legs) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div> */}

                      {/* Picks Preview */}
                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {game.participants
                            .find((participant) => participant.user.id === user.id)
                            ?.bets.map((bet) => (
                              <div
                                key={bet.id}
                                className={`w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs font-bold ${
                                  new Date(bet.line.matchup.startsAt) > new Date()
                                    ? 'bg-slate-600 text-slate-300'
                                    : !!bet.line.actualValue
                                      ? 'bg-blue-500 text-white'
                                      : bet.isCorrect
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-red-500 text-white'
                                }`}
                              >
                                <Image
                                  src={bet.line.athlete.picture || ''}
                                  alt={bet.line.athlete.name || ''}
                                  width={32}
                                  height={32}
                                />
                              </div>
                            ))}
                          {/* {parlay.picks.length > 4 && (
                          <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                            +{parlay.picks.length - 4}
                          </div>
                        )} */}
                        </div>
                        {/* <div className="text-slate-400 text-sm">{parlay.timeRemaining}</div> */}
                      </div>
                    </div>
                  ))}

                {myOpenGames.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-slate-400">
                      <div className="text-4xl mb-2">🎯</div>
                      <div>No active parlays</div>
                      <div className="text-sm mt-1">Join a game to get started!</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
                <span className="text-lg">📋</span>
              </span>
              Betting History
            </h3>
            <div className="text-slate-400 text-center py-8">
              <div className="text-4xl mb-2">📋</div>
              <div>Detailed betting history coming soon</div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
                <span className="text-lg">🏆</span>
              </span>
              Achievements
            </h3>
            <div className="space-y-4">
              {[
                {
                  name: 'First Win',
                  desc: 'Win your first bet',
                  unlocked: true,
                  icon: '🎯',
                },
                {
                  name: 'Hot Streak',
                  desc: 'Win 5 bets in a row',
                  unlocked: true,
                  icon: '🔥',
                },
                {
                  name: 'Big Winner',
                  desc: 'Win over $500',
                  unlocked: false,
                  icon: '💰',
                },
                {
                  name: 'Social Butterfly',
                  desc: 'Join 10 lobbies',
                  unlocked: true,
                  icon: '🦋',
                },
              ].map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-[#00CED1]/10 to-[#FFAB91]/10 border-[#00CED1]/30'
                      : 'bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        achievement.unlocked ? 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91]' : 'bg-slate-700/50'
                      }`}
                    >
                      <span className="text-xl">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`}>
                        {achievement.name}
                      </div>
                      <div className="text-slate-400 text-sm">{achievement.desc}</div>
                    </div>
                    {achievement.unlocked && (
                      <div className="text-[#00CED1]">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
                <span className="text-lg">⚙️</span>
              </span>
              Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50">
                <div>
                  <div className="text-white font-semibold">Notifications</div>
                  <div className="text-slate-400 text-sm">Get updates on your bets</div>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only" defaultChecked />
                  <div className="w-12 h-6 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full shadow-inner relative">
                    <div className="w-4 h-4 bg-white rounded-full shadow absolute top-1 right-1 transition-transform"></div>
                  </div>
                </div>
              </div>

              <button className="w-full flex items-center justify-between p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-slate-600/60 transition-all duration-300">
                <div>
                  <div className="text-white font-semibold">Privacy Settings</div>
                  <div className="text-slate-400 text-sm">Manage your data and privacy</div>
                </div>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-500/10 to-red-400/10 backdrop-blur-sm rounded-xl border border-red-500/30 hover:border-red-400/40 transition-all duration-300">
                <div>
                  <div className="text-red-400 font-semibold">Sign Out</div>
                  <div className="text-red-300/70 text-sm">Logout of your account</div>
                </div>
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-700 rounded"></div>
                <div className="h-64 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  )
}
