'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ParaButton } from '@/components/para-modal'
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'

interface ActiveParlay {
  id: string
  name: string
  status: 'pending' | 'live' | 'settling'
  buyIn: number
  potentialPayout: number
  legs: number
  completedLegs: number
  picks: Array<{
    id: string
    athleteName: string
    athleteAvatar: string
    propName: string
    propValue: number
    betType: 'over' | 'under'
    odds: string
    status: 'pending' | 'hit' | 'miss' | 'live'
    sport: string
  }>
  timeRemaining: string
  createdAt: string
  participants: number
}

function ProfileContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [editingUsername, setEditingUsername] = useState(false)

  // Fix hydration issues and handle URL params
  useEffect(() => {
    setMounted(true)
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'parlays', 'history', 'achievements', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleUpdateUsername = async () => {
    // TODO: Update username
  }

  // Para wallet balance hook
  const {
    isConnected,
    balances,
    isLoading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useParaWalletBalance()

  // Format balance for display
  const formatBalance = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Mock user data
  const user = {
    name: 'Mike Chen',
    username: '@mikechen',
    avatar: 'MC',
    balance: 1250,
    totalBets: 148,
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'parlays', name: 'Active Parlays', icon: '🎯' },
    { id: 'history', name: 'History', icon: '📈' },
    { id: 'achievements', name: 'Achievements', icon: '🏆' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ]

  // Mock active parlays data
  const activeParlays: ActiveParlay[] = [
    {
      id: 'parlay-1',
      name: 'NBA Sunday Showdown',
      status: 'live',
      buyIn: 25,
      potentialPayout: 180,
      legs: 4,
      completedLegs: 2,
      picks: [
        {
          id: 'pick-1',
          athleteName: 'LeBron James',
          athleteAvatar: 'LJ',
          propName: 'Points',
          propValue: 28.5,
          betType: 'over',
          odds: '+110',
          status: 'hit',
          sport: 'NBA',
        },
        {
          id: 'pick-2',
          athleteName: 'Stephen Curry',
          athleteAvatar: 'SC',
          propName: '3-Pointers',
          propValue: 4.5,
          betType: 'over',
          odds: '+120',
          status: 'hit',
          sport: 'NBA',
        },
        {
          id: 'pick-3',
          athleteName: 'Anthony Davis',
          athleteAvatar: 'AD',
          propName: 'Rebounds',
          propValue: 11.5,
          betType: 'over',
          odds: '-110',
          status: 'live',
          sport: 'NBA',
        },
        {
          id: 'pick-4',
          athleteName: 'Draymond Green',
          athleteAvatar: 'DG',
          propName: 'Assists',
          propValue: 6.5,
          betType: 'under',
          odds: '-105',
          status: 'pending',
          sport: 'NBA',
        },
      ],
      timeRemaining: '2h 15m',
      createdAt: '2 hours ago',
      participants: 12,
    },
    {
      id: 'parlay-2',
      name: 'Monday Night Football',
      status: 'pending',
      buyIn: 50,
      potentialPayout: 365,
      legs: 3,
      completedLegs: 0,
      picks: [
        {
          id: 'pick-5',
          athleteName: 'Josh Allen',
          athleteAvatar: 'JA',
          propName: 'Passing Yards',
          propValue: 285.5,
          betType: 'over',
          odds: '-110',
          status: 'pending',
          sport: 'NFL',
        },
        {
          id: 'pick-6',
          athleteName: 'Travis Kelce',
          athleteAvatar: 'TK',
          propName: 'Receiving Yards',
          propValue: 85.5,
          betType: 'over',
          odds: '-110',
          status: 'pending',
          sport: 'NFL',
        },
        {
          id: 'pick-7',
          athleteName: 'Patrick Mahomes',
          athleteAvatar: 'PM',
          propName: 'Passing TDs',
          propValue: 2.5,
          betType: 'over',
          odds: '+110',
          status: 'pending',
          sport: 'NFL',
        },
      ],
      timeRemaining: '1d 6h',
      createdAt: '4 hours ago',
      participants: 8,
    },
    {
      id: 'parlay-3',
      name: 'Champions League Special',
      status: 'settling',
      buyIn: 100,
      potentialPayout: 750,
      legs: 5,
      completedLegs: 5,
      picks: [
        {
          id: 'pick-8',
          athleteName: 'Lionel Messi',
          athleteAvatar: 'LM',
          propName: 'Goals',
          propValue: 0.5,
          betType: 'over',
          odds: '+120',
          status: 'hit',
          sport: 'Soccer',
        },
        {
          id: 'pick-9',
          athleteName: 'Kylian Mbappe',
          athleteAvatar: 'KM',
          propName: 'Shots on Target',
          propValue: 2.5,
          betType: 'over',
          odds: '-110',
          status: 'hit',
          sport: 'Soccer',
        },
        {
          id: 'pick-10',
          athleteName: 'Erling Haaland',
          athleteAvatar: 'EH',
          propName: 'Goals',
          propValue: 1.5,
          betType: 'under',
          odds: '-105',
          status: 'hit',
          sport: 'Soccer',
        },
        {
          id: 'pick-11',
          athleteName: 'Kevin De Bruyne',
          athleteAvatar: 'KDB',
          propName: 'Assists',
          propValue: 0.5,
          betType: 'over',
          odds: '+105',
          status: 'hit',
          sport: 'Soccer',
        },
        {
          id: 'pick-12',
          athleteName: 'Vinicius Jr',
          athleteAvatar: 'VJ',
          propName: 'Shots',
          propValue: 3.5,
          betType: 'over',
          odds: '-110',
          status: 'hit',
          sport: 'Soccer',
        },
      ],
      timeRemaining: 'Settling',
      createdAt: '1 day ago',
      participants: 15,
    },
  ]

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
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
                <span className="text-white font-bold text-2xl">{user.avatar}</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
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
                      // TODO: Update username
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
                  <p className="text-slate-400">{user.username}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none">
                    <g id="Edit / Edit_Pencil_01">
                      <path
                        id="Vector"
                        d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-xl p-4 text-center border border-slate-700/50">
              <div className="text-2xl font-bold text-white">{user.totalBets}</div>
              <div className="text-slate-400 text-sm">Total Bets</div>
            </div>
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

          <ParaButton />
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
                {activeParlays.slice(0, 2).map((parlay) => (
                  <div
                    key={parlay.id}
                    className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-slate-600/60 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold text-lg">{parlay.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              parlay.status === 'live'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : parlay.status === 'pending'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}
                          >
                            {parlay.status.charAt(0).toUpperCase() + parlay.status.slice(1)}
                          </span>
                          <span className="text-slate-400 text-sm">{parlay.participants} players</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#00CED1] font-bold text-lg">${parlay.potentialPayout}</div>
                        <div className="text-slate-400 text-xs">Potential</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
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
                    </div>

                    {/* Picks Preview */}
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {parlay.picks.slice(0, 4).map((pick) => (
                          <div
                            key={pick.id}
                            className={`w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs font-bold ${
                              pick.status === 'hit'
                                ? 'bg-emerald-500 text-white'
                                : pick.status === 'miss'
                                  ? 'bg-red-500 text-white'
                                  : pick.status === 'live'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-slate-600 text-slate-300'
                            }`}
                          >
                            {pick.athleteAvatar}
                          </div>
                        ))}
                        {parlay.picks.length > 4 && (
                          <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                            +{parlay.picks.length - 4}
                          </div>
                        )}
                      </div>
                      <div className="text-slate-400 text-sm">{parlay.timeRemaining}</div>
                    </div>
                  </div>
                ))}

                {activeParlays.length === 0 && (
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

        {activeTab === 'parlays' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
                  <span className="text-lg">🎯</span>
                </span>
                Active Parlays ({activeParlays.length})
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeParlays.map((parlay) => (
                  <div
                    key={parlay.id}
                    className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-slate-600/60 transition-all duration-300 cursor-pointer"
                    onClick={() => (window.location.href = `/live-game-view?id=${parlay.id}`)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-base mb-1 truncate">{parlay.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              parlay.status === 'live'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : parlay.status === 'pending'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}
                          >
                            {parlay.status === 'live'
                              ? '🔴 Live'
                              : parlay.status === 'pending'
                                ? '⏳ Pending'
                                : '⚖️ Settling'}
                          </span>
                          <span className="text-slate-400 text-xs">{parlay.participants} players</span>
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <div className="text-[#00CED1] font-bold text-base">${parlay.potentialPayout}</div>
                        <div className="text-slate-400 text-xs">Payout</div>
                      </div>
                    </div>

                    {/* Compact Progress Section */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-xs">
                          {parlay.completedLegs}/{parlay.legs} Complete
                        </span>
                        <span className="text-slate-400 text-xs">{parlay.timeRemaining}</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${(parlay.completedLegs / parlay.legs) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Buy-in and Status Footer */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400 text-xs">Buy-in:</span>
                        <span className="text-white font-semibold text-sm">${parlay.buyIn}</span>
                      </div>
                      <div className="text-slate-400 text-xs">Tap to view live →</div>
                    </div>
                  </div>
                ))}

                {activeParlays.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-slate-400">
                      <div className="text-6xl mb-4">🎯</div>
                      <div className="text-xl font-semibold mb-2">No Active Parlays</div>
                      <div className="text-sm mb-6">Join a game to start building your parlay!</div>
                      <Link
                        href="/main"
                        className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Browse Games
                      </Link>
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
