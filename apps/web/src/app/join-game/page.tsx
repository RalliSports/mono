'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

interface GameMode {
  id: string
  label: string
  description: string
  createdAt: string
}

interface Creator {
  id: string
  walletAddress: string
  emailAddress: string | null
  paraUserId: string
  createdAt: string
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
  date: string
  startsAt: string
}

interface Stat {
  id: string
  name: string
  description: string
  customId: number
  createdAt: string
}

interface Line {
  id: string
  athleteId: string
  athlete: Athlete
  matchup: Matchup
  stat: Stat
  statId: string
  matchupId: string
  predictedValue: number
  actualValue: number
}
interface Bet {
  id: string
  participantId: string
  lineId: string
  gameId: string
  predictedDirection: string
  isCorrect: boolean
  line: Line
}
interface Participant {
  id: string
  userId: string
  gameId: string
  joinedAt: string
  isWinner: boolean
  txnId: string | null
  user: Creator
  bets: Bet[]
}

interface Game {
  id: string
  title: string
  creatorId: string
  depositAmount: number
  currency: string
  createdAt: string
  status: string
  maxParticipants: number
  maxBet: number | null
  gameCode: string
  matchupGroup: string
  depositToken: string
  isPrivate: boolean
  type: string
  userControlType: string
  gameModeId: string
  txnId: string | null
  gameMode: GameMode
  creator: Creator
  participants: Participant[]
}

function JoinGameContent() {
  const searchParams = useSearchParams()
  const [expandedParticipants, setExpandedParticipants] = useState<string[]>([])

  // Get lobby ID from URL (simple approach)
  const lobbyId = searchParams.get('id')

  const [lobby, setLobby] = useState<Game | null>(null)

  useEffect(() => {
    const fetchGame = async () => {
      const response = await fetch(`/api/read-game?id=${lobbyId}`)
      const data = await response.json()
      console.log('data', data)
      setLobby(data)
    }
    if (lobbyId) {
      fetchGame()
    }
  }, [lobbyId])

  // Helper function to toggle participant expansion
  const toggleParticipant = (participantId: string) => {
    setExpandedParticipants((prev) =>
      prev.includes(participantId) ? prev.filter((id) => id !== participantId) : [...prev, participantId],
    )
  }

  const isParticipantExpanded = (participantId: string) => expandedParticipants.includes(participantId)

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return '🌍'
      case 'private':
        return '🔒'
      case 'friends':
        return '👥'
      default:
        return '🌍'
    }
  }

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30'
      case 'private':
        return 'text-red-400 bg-red-400/20 border-red-400/30'
      case 'friends':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/30'
      default:
        return 'text-slate-400 bg-slate-400/20 border-slate-400/30'
    }
  }

  if (!lobby) return <div>Loading...</div>

  const spotsLeft = lobby?.maxParticipants - lobby?.participants.length

  // Handle join game flow - go directly to picks
  const handleJoinGame = () => {
    // Navigate directly to picks page with game parameters
    window.location.href = `/picks?gameId=${lobbyId}`
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      {/* Enhanced Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back Button + Title */}
          <div className="flex items-center space-x-3">
            <Link
              href="/main"
              className="p-2 rounded-xl bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-white">Join Game 🎮</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-20">
        {/* Enhanced Game Header */}
        <div className="pt-6 pb-4">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-16 h-16 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-xl overflow-hidden">
                  {lobby.title ? (
                    <img
                      src={`/users/${lobby.title.toLowerCase().replace(/\s+/g, '-')}.png`}
                      alt={lobby.title}
                      className="w-16 h-16 object-cover rounded-xl"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(lobby.creator.walletAddress)}&background=0D8ABC&color=fff&size=128`
                      }}
                    />
                  ) : (
                    <span className="text-white font-bold text-3xl">{lobby.title}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 text-lg shadow-lg">👑</div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl truncate">{lobby.title}</h3>
                <p className="text-slate-400 text-sm">
                  Host • Created {new Date(lobby.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  <h2 className="text-lg font-semibold text-white truncate leading-tight">{lobby.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-300 font-medium text-sm">
                      {lobby.participants.length}/{lobby.maxParticipants} players
                    </span>
                    <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                    <span className="text-slate-400 text-sm">{lobby.maxBet} legs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Game Stats - Single Row with 3 Items */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 shadow-2xl hover:shadow-[#00CED1]/10 transition-all duration-300 hover:scale-105">
                <div className="text-slate-400 text-xs">Buy In</div>
                <div className="text-white font-bold text-lg">${lobby.depositAmount}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105">
                <div className="text-slate-400 text-xs">Max Payout</div>
                <div className="text-emerald-400 font-bold text-lg">${lobby.depositAmount * lobby.maxParticipants}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105">
                <div className="text-slate-400 text-xs">Visibility</div>
                <div
                  className={`text-sm font-medium flex items-center gap-1 ${getVisibilityColor(lobby.isPrivate ? 'private' : 'public').split(' ')[0]}`}
                >
                  {getVisibilityIcon(lobby.isPrivate ? 'private' : 'public')} {lobby.isPrivate ? 'Private' : 'Public'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Join Button Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-[#00CED1]/30 rounded-2xl p-6 shadow-2xl shadow-[#00CED1]/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-xl">Ready to Join?</h3>
                <p className="text-slate-400">
                  {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining in this lobby
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">${lobby.depositAmount}</div>
                <div className="text-sm text-slate-400">Buy-in required</div>
              </div>
            </div>

            <button
              onClick={handleJoinGame}
              className="relative w-full bg-gradient-to-r from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg overflow-hidden group"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <span className="relative z-10">
                Make Your Picks • {spotsLeft} Spot{spotsLeft !== 1 ? 's' : ''} Left
              </span>
            </button>

            {spotsLeft <= 3 && (
              <p className="text-amber-400 text-sm text-center mt-3 font-medium">
                ⚡ Filling up fast! Only {spotsLeft} spot
                {spotsLeft !== 1 ? 's' : ''} remaining
              </p>
            )}
          </div>
        </div>

        {/* Enhanced Players Section */}
        <div className="mb-6">
          <div className="mb-4">
            <h3 className="text-white font-bold text-lg mb-2">Current Players ({lobby.participants.length})</h3>
            <p className="text-slate-400 text-sm">See what picks other players have locked in</p>
          </div>

          <div className="space-y-4">
            {lobby.participants.map((participant) => (
              <div key={participant.id} className="space-y-3">
                {/* Enhanced Participant Card */}
                <div
                  className={`bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer shadow-2xl ${
                    isParticipantExpanded(participant.id)
                      ? 'border-[#00CED1] shadow-[#00CED1]/20'
                      : 'hover:border-slate-600 hover:shadow-slate-600/10'
                  }`}
                  onClick={() => toggleParticipant(participant.id)}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-14 h-14 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-xl overflow-hidden">
                            {participant.user.walletAddress ? (
                              <img
                                src={`/users/${participant.user.walletAddress.toLowerCase().replace(/\s+/g, '-')}.png`}
                                alt={participant.user.walletAddress}
                                className="w-14 h-14 object-cover rounded-xl"
                                onError={(e) => {
                                  e.currentTarget.onerror = null
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.user.walletAddress)}&background=0D8ABC&color=fff&size=128`
                                }}
                              />
                            ) : (
                              <span className="text-white font-bold text-2xl">{participant.user.walletAddress}</span>
                            )}
                          </div>
                          {participant.user.walletAddress === lobby.creator.walletAddress && (
                            <div className="absolute -top-1 -left-1 text-sm">👑</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-white font-bold text-base leading-tight truncate">
                            {participant.user.walletAddress}
                          </h4>
                          <p className="text-slate-400 text-sm mt-1">
                            Joined {new Date(participant.joinedAt).toLocaleDateString()} • ${lobby.depositAmount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm text-slate-300 font-medium">{participant.bets.length} picks</div>
                          <div className="text-xs text-slate-500">Ready to play</div>
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

                    {/* Enhanced Quick Picks Preview */}
                    <div className="mt-4">
                      <div className="flex gap-1.5">
                        {participant.bets.slice(0, 4).map((pick) => (
                          <div key={pick.id} className="flex-1 h-2.5 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-500"
                              style={{ width: '100%' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Expanded Picks */}
                {isParticipantExpanded(participant.id) && (
                  <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300 shadow-2xl shadow-[#00CED1]/10">
                    <div className="p-4 border-b border-slate-700/50">
                      <h5 className="text-white font-bold truncate">{participant.user.walletAddress}&apos;s Picks</h5>
                      <p className="text-slate-400 text-sm">{participant.bets.length} legs selected</p>
                    </div>

                    <div className="divide-y divide-slate-700/30">
                      {participant.bets.map((pick) => (
                        <div key={pick.id} className="p-4 hover:bg-slate-700/20 transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-10 h-10 backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                                {pick.line.athleteId ? (
                                  <Image
                                    src={pick.line.athlete.picture}
                                    alt={pick.line.athlete.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // Fallback to initials if image fails to load
                                      const target = e.target as HTMLImageElement
                                      target.style.display = 'none'
                                      const parent = target.parentElement
                                      if (parent) {
                                        parent.innerHTML = `<span class="text-white font-bold">${pick.line.athlete.name
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')
                                          .toUpperCase()}</span>`
                                      }
                                    }}
                                  />
                                ) : (
                                  <span className="text-white font-bold text-lg">{pick.line.athleteId}</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <h6 className="text-white font-semibold text-sm leading-tight truncate">
                                  {pick.line.athlete.name}
                                </h6>
                                <p className="text-slate-400 text-xs">
                                  {new Date(pick.line.matchup.startsAt).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-white font-semibold text-sm">
                                {pick.line.stat.name} {pick.predictedDirection} {pick.line.predictedValue}
                              </div>
                              <div className="text-slate-400 text-xs">{pick.line.actualValue}</div>
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
        </div>
      </div>
    </div>
  )
}

export default function JoinGamePage() {
  return (
    <Suspense
      fallback={
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading game...</p>
          </div>
        </div>
      }
    >
      <JoinGameContent />
    </Suspense>
  )
}
