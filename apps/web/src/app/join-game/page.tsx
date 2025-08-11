'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

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
}

interface GameParticipant {
  id: number
  name: string
  avatar: string
  isOnline: boolean
  buyIn: number
  picks: GamePick[]
  joinedAt: string
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
}

function JoinGameContent() {
  const searchParams = useSearchParams()
  const [expandedParticipants, setExpandedParticipants] = useState<number[]>([])

  // Get lobby ID from URL (simple approach)
  const lobbyId = searchParams.get('id') || '1'

  // Mock lobby data
  const mockLobbies: { [key: string]: GameInfo } = {
    '1': {
      id: 1,
      name: 'NBA Sunday Showdown',
      hostName: 'Jack Sturt',
      hostAvatar: '🎯',
      currentPlayers: 4,
      maxPlayers: 8,
      buyIn: 25,
      maxPayout: 180,
      legs: 4,
      visibility: 'public',
      status: 'waiting',
      createdAt: '2 hours ago',
      participants: [
        {
          id: 1,
          name: 'Jack Sturt',
          avatar: '🎯',
          isOnline: true,
          buyIn: 25,
          joinedAt: '2 hours ago',
          picks: [
            {
              id: 1,
              player: 'LeBron James',
              betType: 'Points',
              target: 28.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+110',
              status: 'not_started',
              gameTime: 'Tonight 8:00 PM',
              athleteImage: '👑',
              sport: 'NBA',
            },
            {
              id: 2,
              player: 'Steph Curry',
              betType: '3-Pointers',
              target: 4.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+105',
              status: 'not_started',
              gameTime: 'Tonight 8:30 PM',
              athleteImage: '👨‍🦱',
              sport: 'NBA',
            },
            {
              id: 3,
              player: 'Giannis',
              betType: 'Rebounds',
              target: 11.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '-115',
              status: 'not_started',
              gameTime: 'Tonight 9:00 PM',
              athleteImage: '🦌',
              sport: 'NBA',
            },
            {
              id: 4,
              player: 'Luka Dončić',
              betType: 'Assists',
              target: 8.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+105',
              status: 'not_started',
              gameTime: 'Tonight 9:30 PM',
              athleteImage: '🇸🇮',
              sport: 'NBA',
            },
          ],
        },
        {
          id: 2,
          name: 'Emma Chen',
          avatar: '⚡',
          isOnline: true,
          buyIn: 25,
          joinedAt: '1 hour ago',
          picks: [
            {
              id: 5,
              player: 'Jayson Tatum',
              betType: 'Points',
              target: 26.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+115',
              status: 'not_started',
              gameTime: 'Tonight 8:00 PM',
              athleteImage: '☘️',
              sport: 'NBA',
            },
            {
              id: 6,
              player: 'Kevin Durant',
              betType: 'Points',
              target: 25.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+115',
              status: 'not_started',
              gameTime: 'Tonight 8:30 PM',
              athleteImage: '🐍',
              sport: 'NBA',
            },
            {
              id: 7,
              player: 'Kawhi Leonard',
              betType: 'Assists',
              target: 5.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '-115',
              status: 'not_started',
              gameTime: 'Tonight 9:00 PM',
              athleteImage: '🤖',
              sport: 'NBA',
            },
            {
              id: 8,
              player: 'Nikola Jokić',
              betType: 'Triple-Double',
              target: 0.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+180',
              status: 'not_started',
              gameTime: 'Tonight 9:30 PM',
              athleteImage: '🐴',
              sport: 'NBA',
            },
          ],
        },
        {
          id: 3,
          name: 'Carlos Rodriguez',
          avatar: '🌟',
          isOnline: false,
          buyIn: 25,
          joinedAt: '45 minutes ago',
          picks: [
            {
              id: 9,
              player: 'Damian Lillard',
              betType: '3-Pointers',
              target: 3.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+105',
              status: 'not_started',
              gameTime: 'Tonight 8:00 PM',
              athleteImage: '⏰',
              sport: 'NBA',
            },
            {
              id: 10,
              player: 'Anthony Davis',
              betType: 'Blocks',
              target: 2.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+120',
              status: 'not_started',
              gameTime: 'Tonight 8:30 PM',
              athleteImage: '🏠',
              sport: 'NBA',
            },
            {
              id: 11,
              player: 'Joel Embiid',
              betType: 'Rebounds',
              target: 10.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '-110',
              status: 'not_started',
              gameTime: 'Tonight 9:00 PM',
              athleteImage: '🏠',
              sport: 'NBA',
            },
            {
              id: 12,
              player: 'Devin Booker',
              betType: 'Points',
              target: 24.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+110',
              status: 'not_started',
              gameTime: 'Tonight 9:30 PM',
              athleteImage: '☀️',
              sport: 'NBA',
            },
          ],
        },
        {
          id: 4,
          name: 'Matt Zimmermann',
          avatar: '🏆',
          isOnline: true,
          buyIn: 25,
          joinedAt: '30 minutes ago',
          picks: [
            {
              id: 13,
              player: 'Ja Morant',
              betType: 'Assists',
              target: 8.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '-115',
              status: 'not_started',
              gameTime: 'Tonight 8:00 PM',
              athleteImage: '🎪',
              sport: 'NBA',
            },
            {
              id: 14,
              player: 'Trae Young',
              betType: 'Points',
              target: 25.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+110',
              status: 'not_started',
              gameTime: 'Tonight 8:30 PM',
              athleteImage: '🐍',
              sport: 'NBA',
            },
            {
              id: 15,
              player: 'Donovan Mitchell',
              betType: '3-Pointers',
              target: 3.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+105',
              status: 'not_started',
              gameTime: 'Tonight 9:00 PM',
              athleteImage: '🎯',
              sport: 'NBA',
            },
            {
              id: 16,
              player: 'Zion Williamson',
              betType: 'Rebounds',
              target: 7.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '-110',
              status: 'not_started',
              gameTime: 'Tonight 9:30 PM',
              athleteImage: '💪',
              sport: 'NBA',
            },
          ],
        },
      ],
    },
    '2': {
      id: 2,
      name: 'NFL Monday Night',
      hostName: 'Sarah Martinez',
      hostAvatar: '🏈',
      currentPlayers: 3,
      maxPlayers: 6,
      buyIn: 50,
      maxPayout: 270,
      legs: 3,
      visibility: 'public',
      status: 'waiting',
      createdAt: '1 hour ago',
      participants: [
        {
          id: 1,
          name: 'Sarah Martinez',
          avatar: '🏈',
          isOnline: true,
          buyIn: 50,
          joinedAt: '1 hour ago',
          picks: [
            {
              id: 1,
              player: 'Josh Allen',
              betType: 'Passing Yards',
              target: 275.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+110',
              status: 'not_started',
              gameTime: 'Tonight 8:15 PM',
              athleteImage: '🦬',
              sport: 'NFL',
            },
            {
              id: 2,
              player: 'Patrick Mahomes',
              betType: 'Touchdowns',
              target: 2.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+105',
              status: 'not_started',
              gameTime: 'Tonight 8:15 PM',
              athleteImage: '🐸',
              sport: 'NFL',
            },
            {
              id: 3,
              player: 'Travis Kelce',
              betType: 'Receiving Yards',
              target: 85.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '-115',
              status: 'not_started',
              gameTime: 'Tonight 8:15 PM',
              athleteImage: '🎯',
              sport: 'NFL',
            },
          ],
        },
        {
          id: 2,
          name: 'Mike Johnson',
          avatar: '⭐',
          isOnline: true,
          buyIn: 50,
          joinedAt: '45 minutes ago',
          picks: [
            {
              id: 4,
              player: 'Stefon Diggs',
              betType: 'Receptions',
              target: 6.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+110',
              status: 'not_started',
              gameTime: 'Tonight 8:15 PM',
              athleteImage: '⚡',
              sport: 'NFL',
            },
            {
              id: 5,
              player: 'Tyreek Hill',
              betType: 'Receiving Yards',
              target: 95.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+105',
              status: 'not_started',
              gameTime: 'Tonight 8:15 PM',
              athleteImage: '🐆',
              sport: 'NFL',
            },
            {
              id: 6,
              player: 'Derrick Henry',
              betType: 'Rushing Yards',
              target: 75.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '-110',
              status: 'not_started',
              gameTime: 'Tonight 8:15 PM',
              athleteImage: '👑',
              sport: 'NFL',
            },
          ],
        },
        {
          id: 3,
          name: 'Alex Kim',
          avatar: '🔥',
          isOnline: false,
          buyIn: 50,
          joinedAt: '30 minutes ago',
          picks: [
            {
              id: 7,
              player: 'Lamar Jackson',
              betType: 'Rushing Yards',
              target: 55.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+115',
              status: 'not_started',
              gameTime: 'Tonight 8:15 PM',
              athleteImage: '⚡',
              sport: 'NFL',
            },
            {
              id: 8,
              player: 'Cooper Kupp',
              betType: 'Receptions',
              target: 7.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '-105',
              status: 'not_started',
              gameTime: 'Tonight 8:15 PM',
              athleteImage: '🎯',
              sport: 'NFL',
            },
            {
              id: 9,
              player: 'Nick Chubb',
              betType: 'Rushing Yards',
              target: 85.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+110',
              status: 'not_started',
              gameTime: 'Tonight 8:15 PM',
              athleteImage: '🚂',
              sport: 'NFL',
            },
          ],
        },
      ],
    },
    '3': {
      id: 3,
      name: 'Champions League Special',
      hostName: 'Diego Silva',
      hostAvatar: '⚽',
      currentPlayers: 2,
      maxPlayers: 4,
      buyIn: 100,
      maxPayout: 360,
      legs: 5,
      visibility: 'friends',
      status: 'waiting',
      createdAt: '30 minutes ago',
      participants: [
        {
          id: 1,
          name: 'Diego Silva',
          avatar: '⚽',
          isOnline: true,
          buyIn: 100,
          joinedAt: '30 minutes ago',
          picks: [
            {
              id: 1,
              player: 'Lionel Messi',
              betType: 'Goals',
              target: 0.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+120',
              status: 'not_started',
              gameTime: 'Tomorrow 3:00 PM',
              athleteImage: '🐐',
              sport: 'Soccer',
            },
            {
              id: 2,
              player: 'Kylian Mbappé',
              betType: 'Shots on Target',
              target: 3.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+110',
              status: 'not_started',
              gameTime: 'Tomorrow 3:00 PM',
              athleteImage: '🚀',
              sport: 'Soccer',
            },
            {
              id: 3,
              player: 'Erling Haaland',
              betType: 'Goals',
              target: 1.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+150',
              status: 'not_started',
              gameTime: 'Tomorrow 3:00 PM',
              athleteImage: '🤖',
              sport: 'Soccer',
            },
            {
              id: 4,
              player: 'Kevin De Bruyne',
              betType: 'Assists',
              target: 0.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+105',
              status: 'not_started',
              gameTime: 'Tomorrow 3:00 PM',
              athleteImage: '🎯',
              sport: 'Soccer',
            },
            {
              id: 5,
              player: 'Virgil van Dijk',
              betType: 'Tackles',
              target: 2.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '-110',
              status: 'not_started',
              gameTime: 'Tomorrow 3:00 PM',
              athleteImage: '🛡️',
              sport: 'Soccer',
            },
          ],
        },
        {
          id: 2,
          name: 'Marco Rodriguez',
          avatar: '🌟',
          isOnline: true,
          buyIn: 100,
          joinedAt: '15 minutes ago',
          picks: [
            {
              id: 6,
              player: 'Cristiano Ronaldo',
              betType: 'Goals',
              target: 0.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+115',
              status: 'not_started',
              gameTime: 'Tomorrow 3:00 PM',
              athleteImage: '👑',
              sport: 'Soccer',
            },
            {
              id: 7,
              player: 'Neymar Jr.',
              betType: 'Dribbles',
              target: 4.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+100',
              status: 'not_started',
              gameTime: 'Tomorrow 3:00 PM',
              athleteImage: '🎭',
              sport: 'Soccer',
            },
            {
              id: 8,
              player: 'Luka Modrić',
              betType: 'Passes',
              target: 65.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '-105',
              status: 'not_started',
              gameTime: 'Tomorrow 3:00 PM',
              athleteImage: '🧙',
              sport: 'Soccer',
            },
            {
              id: 9,
              player: 'Sadio Mané',
              betType: 'Shots',
              target: 2.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+110',
              status: 'not_started',
              gameTime: 'Tomorrow 3:00 PM',
              athleteImage: '⚡',
              sport: 'Soccer',
            },
            {
              id: 10,
              player: 'Casemiro',
              betType: 'Interceptions',
              target: 1.5,
              currentValue: 0,
              betDirection: 'over',
              odds: '+120',
              status: 'not_started',
              gameTime: 'Tomorrow 3:00 PM',
              athleteImage: '🛡️',
              sport: 'Soccer',
            },
          ],
        },
      ],
    },
  }

  // Get the game info for this lobby
  const gameInfo = mockLobbies[lobbyId] || mockLobbies['1']

  // Debug: Log the lobby ID and available keys
  console.log('Current lobby ID:', lobbyId)
  console.log('Available lobby keys:', Object.keys(mockLobbies))
  console.log('Selected game info:', gameInfo.name, gameInfo.hostName)

  // Helper function to toggle participant expansion
  const toggleParticipant = (participantId: number) => {
    setExpandedParticipants((prev) =>
      prev.includes(participantId) ? prev.filter((id) => id !== participantId) : [...prev, participantId],
    )
  }

  const isParticipantExpanded = (participantId: number) => expandedParticipants.includes(participantId)

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

  const spotsLeft = gameInfo.maxPlayers - gameInfo.currentPlayers

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

          {/* Right: Online Status */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-400">
              {gameInfo.participants.filter((p) => p.isOnline).length}/{gameInfo.currentPlayers} online
            </span>
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
                  {gameInfo.hostName ? (
                    <img
                      src={`/users/${gameInfo.hostName.toLowerCase().replace(/\s+/g, '-')}.png`}
                      alt={gameInfo.hostName}
                      className="w-16 h-16 object-cover rounded-xl"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(gameInfo.hostName)}&background=0D8ABC&color=fff&size=128`
                      }}
                    />
                  ) : (
                    <span className="text-white font-bold text-3xl">{gameInfo.hostAvatar}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 text-lg shadow-lg">👑</div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl truncate">{gameInfo.hostName}</h3>
                <p className="text-slate-400 text-sm">Host • Created {gameInfo.createdAt}</p>
                <div className="mt-2">
                  <h2 className="text-lg font-semibold text-white truncate leading-tight">{gameInfo.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-300 font-medium text-sm">
                      {gameInfo.currentPlayers}/{gameInfo.maxPlayers} players
                    </span>
                    <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                    <span className="text-slate-400 text-sm">{gameInfo.legs} legs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Game Stats - Single Row with 3 Items */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 shadow-2xl hover:shadow-[#00CED1]/10 transition-all duration-300 hover:scale-105">
                <div className="text-slate-400 text-xs">Buy In</div>
                <div className="text-white font-bold text-lg">${gameInfo.buyIn}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105">
                <div className="text-slate-400 text-xs">Max Payout</div>
                <div className="text-emerald-400 font-bold text-lg">${gameInfo.maxPayout}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105">
                <div className="text-slate-400 text-xs">Visibility</div>
                <div
                  className={`text-sm font-medium flex items-center gap-1 ${getVisibilityColor(gameInfo.visibility).split(' ')[0]}`}
                >
                  {getVisibilityIcon(gameInfo.visibility)} {gameInfo.visibility}
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
                <div className="text-2xl font-bold text-white">${gameInfo.buyIn}</div>
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
            <h3 className="text-white font-bold text-lg mb-2">Current Players ({gameInfo.currentPlayers})</h3>
            <p className="text-slate-400 text-sm">See what picks other players have locked in</p>
          </div>

          <div className="space-y-4">
            {gameInfo.participants.map((participant) => (
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
                            {participant.name ? (
                              <img
                                src={`/users/${participant.name.toLowerCase().replace(/\s+/g, '-')}.png`}
                                alt={participant.name}
                                className="w-14 h-14 object-cover rounded-xl"
                                onError={(e) => {
                                  e.currentTarget.onerror = null
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=0D8ABC&color=fff&size=128`
                                }}
                              />
                            ) : (
                              <span className="text-white font-bold text-2xl">{participant.avatar}</span>
                            )}
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                              participant.isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                            }`}
                          ></div>
                          {participant.name === gameInfo.hostName && (
                            <div className="absolute -top-1 -left-1 text-sm">👑</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-white font-bold text-base leading-tight truncate">{participant.name}</h4>
                          <p className="text-slate-400 text-sm mt-1">
                            Joined {participant.joinedAt} • ${participant.buyIn}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm text-slate-300 font-medium">{participant.picks.length} picks</div>
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
                        {participant.picks.slice(0, 4).map((pick, index) => (
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
                      <h5 className="text-white font-bold truncate">{participant.name}'s Picks</h5>
                      <p className="text-slate-400 text-sm">{participant.picks.length} legs selected</p>
                    </div>

                    <div className="divide-y divide-slate-700/30">
                      {participant.picks.map((pick) => (
                        <div key={pick.id} className="p-4 hover:bg-slate-700/20 transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-10 h-10 backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                                {pick.player ? (
                                  <img
                                    src={`/players/${pick.player.toLowerCase().replace(/\s+/g, '-')}.png`}
                                    alt={pick.player}
                                    className="w-10 h-10 object-cover rounded-lg"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null
                                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pick.player)}&background=0D8ABC&color=fff&size=128`
                                    }}
                                  />
                                ) : (
                                  <span className="text-white font-bold text-lg">{pick.athleteImage}</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <h6 className="text-white font-semibold text-sm leading-tight truncate">
                                  {pick.player}
                                </h6>
                                <p className="text-slate-400 text-xs">
                                  {pick.sport} • {pick.gameTime}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-white font-semibold text-sm">
                                {pick.betType} {pick.betDirection} {pick.target}
                              </div>
                              <div className="text-slate-400 text-xs">{pick.odds}</div>
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
