'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LobbyCard from '@/components/main-feed/lobby-card'
import SelectionBar from '@/components/main-feed/selection-bar'
import AthleteProfilePopup from '@/components/main-feed/athlete-profile-popup'
import SidebarNav from '@/components/ui/sidebar-nav'
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { useAccount } from '@getpara/react-sdk'
import { fetchGames } from '@/hooks/get-games'
import type { Lobby } from '@/hooks/get-games'
import { useSessionToken } from '@/hooks/use-session'

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
    homeTeam: string
    awayTeam: string
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

interface Athlete {
  id: string
  name: string
  team: string
  position: string
  jerseyNumber: number
  age: number
  picture: string
  customId: number
  createdAt: Date

  lines: Line[]
}

interface User {
  id: string
  emailAddress: string

  walletAddress: string
  paraUserId: string

  firstName?: string
  lastName?: string

  username?: string
  avatar?: string
  hasBeenFaucetedSol: boolean
}

export default function MainFeedPage() {
  const router = useRouter()
  const account = useAccount()
  const { session } = useSessionToken()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/read-current-user', {
        headers: {
          'x-para-session': session || '',
        },
      })
      const data: User = await response.json()
      if (!data.username) {
        router.push('/profile')
      }
      setUser(data)
    }
    fetchUser()
  }, [])

  const [lobbiesData, setLobbiesData] = useState<Lobby[]>([])

  useEffect(() => {
    const loadLobbies = async () => {
      const fetchedLobbies = await fetchGames()
      setLobbiesData(fetchedLobbies.filter((lobby) => lobby.participants.length < lobby.maxParticipants))
    }

    loadLobbies()
  }, [])

  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([])
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [isInSelectionMode, setIsInSelectionMode] = useState(false)
  const [requiredSelections, setRequiredSelections] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [hasCheckedConnection, setHasCheckedConnection] = useState(false)
  const [profilePopupAthleteId, setProfilePopupAthleteId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  // Para wallet balance hook
  const { isConnected, balances, isLoading: balanceLoading, error: balanceError } = useParaWalletBalance()

  // Format balance for display
  const formatBalance = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await fetch('/api/read-lines-group-athletes', {
          method: 'GET',
          headers: {
            'x-para-session': session || '',
          },
        })
        console.log('athletes response', response)
        const data = await response.json()
        console.log('athletes data', data)
        setAthletes(data)
      } catch (error) {
        console.error('Error fetching lines:', error)
        setAthletes([])
      }
    }
    fetchAthletes()
  }, [])

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileDropdownOpen) {
        const target = event.target as Element
        if (!target.closest('.profile-dropdown')) {
          setIsProfileDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileDropdownOpen])

  // Handle wallet connection redirect with better logic for Para integration
  useEffect(() => {
    if (!mounted) return

    // If we're connected, mark as checked and clear any pending redirects
    if (isConnected) {
      setHasCheckedConnection(true)
      return
    }

    // Don't check again if we've already performed a connection check
    if (hasCheckedConnection) return

    // Don't redirect if still loading
    if (balanceLoading) return

    // Wait for Para connection to establish - sometimes it takes a moment after signin
    const timeoutId = setTimeout(() => {
      setHasCheckedConnection(true)

      // Only redirect if definitely not connected and not loading
      if (!isConnected && !balanceLoading) {
        console.log('No wallet connection found, redirecting to signin')
        router.push('/signin')
      }
    }, 5000) // Wait 5 seconds to give Para plenty of time to connect

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [mounted, isConnected, balanceLoading, hasCheckedConnection, router])

  // Redirect to /signin if the user is not connected (only after we've checked connection)
  useEffect(() => {
    if (!mounted) return

    // Only redirect if we've completed our connection check and user is still not connected
    if (hasCheckedConnection && !account?.isConnected) {
      router.push('/signin')
    }
  }, [mounted, hasCheckedConnection, account?.isConnected, router])

  // Mock lobby data - showing high activity
  const totalActiveLobbies = lobbiesData.length

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null
  }

  // Show loading state while checking wallet connection
  if (!hasCheckedConnection && (balanceLoading || (!isConnected && !balanceError))) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00CED1]/20 border-t-[#00CED1] rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Connecting to wallet...</h2>
          <p className="text-slate-400">Please wait while we establish your connection</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">
              <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">Ralli</span>
            </h1>
          </div>

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

      {/* Filters and Search */}
      <div className="sticky top-[16px] z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/30 px-4 py-3">
        <div className="flex items-center space-x-3">
          {/* Search Icon */}
          <button className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors">
            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Filter Tabs */}
          <div
            className="flex space-x-2 overflow-x-auto flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {['Popular', 'Trending', 'High Value', 'Low Stakes', 'Ending Soon'].map((filter) => (
              <button
                key={filter}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all duration-200 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50"
              >
                <span>{filter}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile: Single Column Layout */}
        <div className="lg:hidden space-y-8">
          {/* Open Lobbies Section */}
          <div className="relative">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4 flex items-center justify-center">
                  <span className="text-lg">🔥</span>
                </span>
                Open Lobbies
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/create-game')}
                  className="bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-md border border-blue-400/30 hover:border-blue-400/50 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-400/20 flex items-center space-x-2 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg
                    className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300 relative z-10 text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm relative z-10">Create</span>
                </button>
                <div className="text-right">
                  <div className="text-[#FFAB91] font-bold text-lg">{totalActiveLobbies}</div>
                  <div className="text-slate-400 text-xs">Active</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {lobbiesData.slice(0, 3).map((lobby: Lobby) => (
                <LobbyCard
                  key={lobby.id}
                  id={lobby.id}
                  title={lobby.title}
                  participants={lobby.participants}
                  maxParticipants={lobby.maxParticipants}
                  buyIn={lobby.buyIn}
                  prizePool={lobby.prizePool}
                  legs={lobby.legs}
                  timeLeft={lobby.timeLeft}
                  host={lobby.host}
                  isUrgent={lobby.isUrgent}
                  shouldOpenViewGame={lobby.participants.some((participant) => participant.user.id === user?.id)}
                />
              ))}
            </div>

            {/* View More Button */}
            <button
              onClick={() => router.push('/lobbies')}
              className="w-full mt-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white font-semibold hover:bg-slate-700/50 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>View All Lobbies</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop: Two Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Open Lobbies Sidebar (1/3 width) */}
          <div className="lg:col-span-3">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-3 flex items-center justify-center">
                  <span className="text-lg">🔥</span>
                </span>
                Open Lobbies
              </h2>
              <button
                onClick={() => router.push('/create-game')}
                className="bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-md border border-blue-400/30 hover:border-blue-400/50 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-400/20 flex items-center space-x-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg
                  className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 relative z-10 text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="relative z-10">Create Lobby</span>
              </button>
            </div>

            <div className="mb-4 flex items-center justify-center">
              <div className="text-[#FFAB91] font-bold text-xl">{totalActiveLobbies} Active</div>
            </div>

            <div className="space-y-3 mb-6">
              {lobbiesData.slice(0, 4).map((lobby) => (
                <LobbyCard
                  key={lobby.id}
                  id={lobby.id}
                  title={lobby.title}
                  participants={lobby.participants}
                  maxParticipants={lobby.maxParticipants}
                  buyIn={lobby.buyIn}
                  prizePool={lobby.prizePool}
                  legs={lobby.legs}
                  timeLeft={lobby.timeLeft}
                  host={lobby.host}
                  isUrgent={lobby.isUrgent}
                  shouldOpenViewGame={lobby.participants.some((participant) => participant.user.id === user?.id)}
                />
              ))}
            </div>

            {/* View More Button */}
            <button
              onClick={() => router.push('/lobbies')}
              className="w-full py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white font-semibold hover:bg-slate-700/50 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>View All Lobbies</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Selection Bar (when in selection mode) */}
      {isInSelectionMode && (
        <SelectionBar
          selectedAthletes={selectedAthletes}
          requiredSelections={requiredSelections}
          athletes={athletes.map((a) => ({
            id: a.id,
            name: a.name,
            team: a.team,
          }))}
          onCancel={() => setIsInSelectionMode(false)}
          onContinue={() => {
            // Handle continue logic here
            console.log('Selected athletes:', selectedAthletes)
            setIsInSelectionMode(false)
          }}
        />
      )}

      {/* Athlete Profile Popup */}
      {mounted && (
        <AthleteProfilePopup
          athleteId={profilePopupAthleteId || ''}
          isOpen={!!profilePopupAthleteId}
          onClose={() => setProfilePopupAthleteId(null)}
        />
      )}

      {/* Sidebar Navigation */}
      <SidebarNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}
