'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ParaButton } from '@/components/para-modal'
import { useUserData, useWalletBalances, useCurrentUser, useMyGames } from '@/providers/user-data-provider'
import Image from 'next/image'

// Using types from API instead of duplicating interfaces

function ProfileContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Using the new providers
  const { user: currentUser } = useCurrentUser()
  const { balances, isLoading: balanceLoading, error: balanceError } = useWalletBalances()
  const { data: myOpenGames } = useMyGames()
  const { isConnected, updateUser } = useUserData()

  // Local state for editing
  const [username, setUsername] = useState('')
  const [editingUsername, setEditingUsername] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  // Profile picture upload states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync local state with user data from provider
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || '')
      setAvatar(currentUser.avatar || '')
      setFirstName(currentUser.firstName || '')
      setLastName(currentUser.lastName || '')
    }
  }, [currentUser])

  // Fix hydration issues and handle URL params
  useEffect(() => {
    setMounted(true)
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'parlays', 'history', 'achievements', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleUpdateUser = async () => {
    try {
      await updateUser({
        username,
        avatar: avatar || '/images/avatar-01.jpg',
        firstName,
        lastName,
      })
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  // Profile picture upload functions
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert('File size must be less than 5MB.')
      return
    }

    setIsUploading(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)

      // For now, we'll convert to base64 and store directly
      // In production, you'd upload to a cloud storage service
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string

        // Add delay for better UX
        setTimeout(async () => {
          try {
            await updateUser({
              username,
              avatar: base64,
              firstName,
              lastName,
            })
            setAvatar(base64)
            setIsUploadModalOpen(false)
          } catch (error) {
            console.error('Failed to update avatar:', error)
          }
          setIsUploading(false)
        }, 1000) // 1 second delay as requested
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading file:', error)
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

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
  if (!mounted || !currentUser) {
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
                        ? 'Error'
                        : balances.ralli === 0
                          ? 'Top Up'
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
            {/* Profile Picture with Edit Button */}
            <div className="relative group">
              <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border-2 border-slate-600/50 transition-all duration-300 group-hover:border-[#00CED1]/30">
                {currentUser.avatar && currentUser.avatar !== '/images/avatar-01.jpg' ? (
                  <Image
                    src={currentUser.avatar}
                    alt="Profile Picture"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-600 flex items-center justify-center transition-all duration-300 group-hover:bg-slate-500">
                    <svg
                      className="w-8 h-8 text-slate-400 transition-colors duration-300 group-hover:text-slate-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 border-2 border-slate-800 group"
              >
                <svg
                  className="w-3.5 h-3.5 text-white transition-transform duration-200 group-hover:rotate-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            </div>

            <div className="flex-1">
              {editingUsername ? (
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-800/50 text-white text-xl font-semibold border border-slate-600/50 rounded-xl px-4 py-2 focus:border-[#00CED1]/50 focus:ring-1 focus:ring-[#00CED1]/50 focus:outline-none transition-all duration-200"
                      placeholder="Enter username"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingUsername(false)
                        handleUpdateUser()
                      }}
                      className="p-2 bg-gradient-to-r from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 text-white rounded-xl transition-all duration-200 hover:scale-105"
                      title="Save changes"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setEditingUsername(false)
                        setUsername(currentUser?.username || '')
                      }}
                      className="p-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white rounded-xl transition-all duration-200"
                      title="Cancel"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6m0 12L6 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="group/username cursor-pointer" onClick={() => setEditingUsername(true)}>
                  <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800/30 transition-all duration-200">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white group-hover/username:text-[#00CED1] transition-colors duration-200">
                        {currentUser.username || 'Set username'}
                      </h2>
                      <p className="text-slate-400 text-sm mt-1">Click to edit username</p>
                    </div>
                    <div className="opacity-0 group-hover/username:opacity-100 transition-opacity duration-200">
                      <div className="p-2 bg-slate-700/50 rounded-lg">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
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
                                game.status === 'active'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : game.status === 'pending'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              }`}
                            >
                              {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                            </span>
                            <span className="text-slate-400 text-sm">{game.participants?.length || 0} players</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[#00CED1] font-bold text-lg">
                            ${(game.depositAmount || 0) * (game.participants?.length || 0)}
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
                          {game.participants?.length ||
                            (0 > 0 && (
                              <div className="text-slate-400 text-sm">
                                {game.participants?.length || 0} participants
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

      {/* Profile Picture Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Update Profile Picture</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isUploading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#00CED1]/30 border-t-[#00CED1] rounded-full animate-spin"></div>
                <p className="text-white font-medium">Uploading your photo...</p>
                <p className="text-slate-400 text-sm mt-1">This may take a moment</p>
              </div>
            ) : (
              <>
                {/* Drag and Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    dragActive
                      ? 'border-[#00CED1] bg-[#00CED1]/5'
                      : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/30'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-slate-700/50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Drop your image here</h4>
                  <p className="text-slate-400 text-sm mb-4">or click to browse files</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-gradient-to-r from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 text-white font-medium rounded-lg transition-all duration-200"
                  >
                    Choose File
                  </button>
                  <p className="text-slate-500 text-xs mt-3">PNG, JPG up to 5MB</p>
                </div>

                {/* Hidden File Input */}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

                {/* Current Avatar Preview */}
                {currentUser.avatar && (
                  <div className="mt-6 text-center">
                    <p className="text-slate-400 text-sm mb-3">Current photo:</p>
                    <div className="w-16 h-16 mx-auto bg-slate-700 rounded-xl overflow-hidden">
                      <Image
                        src={currentUser.avatar}
                        alt="Current avatar"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
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
