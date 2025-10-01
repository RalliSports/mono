'use client'

import { useState } from 'react'

interface Friend {
  id: string
  name: string
  username: string
  avatar: string
  isOnline: boolean
  lastInvited?: Date
}

interface GameInviteFriendsProps {
  gameId: string
}

// Mock data for friends - same as create game for consistency
const mockFriends: Friend[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    username: '@alexj',
    avatar: '/images/pfp-1.svg',
    isOnline: true,
    lastInvited: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '2',
    name: 'Sarah Chen',
    username: '@sarahc',
    avatar: '/images/pfp-2.svg',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    username: '@miker',
    avatar: '/images/pfp-3.svg',
    isOnline: false,
    lastInvited: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '4',
    name: 'Emma Wilson',
    username: '@emmaw',
    avatar: '/images/pfp-4.svg',
    isOnline: true,
  },
  {
    id: '5',
    name: 'David Kim',
    username: '@davidk',
    avatar: '/images/pfp-1.svg',
    isOnline: false,
  },
  {
    id: '6',
    name: 'Lisa Thompson',
    username: '@lisat',
    avatar: '/images/pfp-2.svg',
    isOnline: true,
    lastInvited: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
]

// Mock searchable users (only appear in search)
const searchableUsers: Friend[] = [
  {
    id: 'search-1',
    name: 'ImmortalSul',
    username: '@immortalsul',
    avatar: '/images/pfp-1.svg',
    isOnline: true,
  },
  {
    id: 'search-2',
    name: 'Sturt',
    username: '@sturt',
    avatar: '/images/pfp-2.svg',
    isOnline: false,
  },
  {
    id: 'search-3',
    name: 'Dave',
    username: '@dave',
    avatar: '/images/pfp-3.svg',
    isOnline: true,
  },
]

export default function GameInviteFriends({ gameId }: GameInviteFriendsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'recent' | 'all' | 'search'>('recent')
  const [onlineFilter, setOnlineFilter] = useState<'all' | 'online' | 'offline'>('all')
  const [invitedFriends, setInvitedFriends] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const recentlyInvited = mockFriends.filter((friend) => friend.lastInvited)
  const allFriends = mockFriends.filter((friend) => {
    if (onlineFilter === 'online') return friend.isOnline
    if (onlineFilter === 'offline') return !friend.isOnline
    return true
  })

  // Search functionality
  const searchResults = searchQuery.trim()
    ? searchableUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  const handleInvite = (friendId: string) => {
    setInvitedFriends((prev) => new Set([...prev, friendId]))
    // Here you would make the API call to invite the friend to the game
    console.log(`Inviting friend ${friendId} to game ${gameId}`)
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-slate-700/20 transition-all duration-300"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-400/10 rounded-lg flex items-center justify-center border border-green-400/20">
            <span className="text-lg">👥</span>
          </div>
          <div className="text-left">
            <h3 className="text-white font-bold">Invite Friends</h3>
            <p className="text-slate-400 text-xs">Bring more players to the game</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {invitedFriends.size > 0 && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-400 text-xs px-3 py-1 rounded-lg font-semibold">
              {invitedFriends.size} invited
            </div>
          )}
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expandable Content */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 space-y-4">
          {/* Tabs */}
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveTab('recent')}
                className={`py-3 px-4 rounded-xl transition-all duration-200 font-semibold ${
                  activeTab === 'recent'
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border border-green-400/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-3 px-4 rounded-xl transition-all duration-200 font-semibold ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border border-green-400/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Friends
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`py-3 px-4 rounded-xl transition-all duration-200 font-semibold ${
                  activeTab === 'search'
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border border-green-400/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Search
              </button>
            </div>
          </div>

          {/* Search Bar (only for "Search" tab) */}
          {activeTab === 'search' && (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username..."
                className="w-full px-4 py-3 pr-10 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300 hover:border-slate-600"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Online Filter (only for "All Friends" tab) */}
          {activeTab === 'all' && (
            <div className="flex space-x-2">
              {(['all', 'online', 'offline'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setOnlineFilter(filter)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-200 font-medium ${
                    onlineFilter === filter
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-400/30'
                      : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/70'
                  }`}
                >
                  {filter === 'all' && '🌐 All'}
                  {filter === 'online' && '🟢 Online'}
                  {filter === 'offline' && '🔴 Offline'}
                </button>
              ))}
            </div>
          )}

          {/* Friends List */}
          <div
            className="max-h-40 overflow-y-auto space-y-2 pr-2"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#475569 transparent',
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 6px;
              }
              div::-webkit-scrollbar-track {
                background: transparent;
              }
              div::-webkit-scrollbar-thumb {
                background: #475569;
                border-radius: 3px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: #64748b;
              }
            `}</style>
            {(activeTab === 'recent' ? recentlyInvited : activeTab === 'all' ? allFriends : searchResults).map(
              (friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full" />
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 ${
                          friend.isOnline ? 'bg-green-400' : 'bg-slate-500'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{friend.name}</div>
                      <div className="text-slate-400 text-xs">{friend.username}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleInvite(friend.id)}
                    disabled={invitedFriends.has(friend.id)}
                    className={`px-4 py-2 rounded-xl transition-all duration-200 font-semibold ${
                      invitedFriends.has(friend.id)
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-400/30 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-400/30 hover:from-blue-500/30 hover:to-cyan-500/30 transform hover:scale-[1.02]'
                    }`}
                  >
                    {invitedFriends.has(friend.id) ? '✓ Invited' : 'Invite'}
                  </button>
                </div>
              ),
            )}

            {/* Search empty state */}
            {activeTab === 'search' && searchQuery.trim() && searchResults.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <div className="text-3xl mb-2">🔍</div>
                <div className="font-medium">No users found</div>
                <div className="text-sm">Try searching for ImmortalSul, Sturt, or Dave</div>
              </div>
            )}

            {/* Search initial state */}
            {activeTab === 'search' && !searchQuery.trim() && (
              <div className="text-center py-8 text-slate-400">
                <div className="text-3xl mb-2">👋</div>
                <div className="font-medium">Search for users</div>
                <div className="text-sm">Enter a username to find new players</div>
              </div>
            )}
          </div>

          {/* Copy Link Button */}
          <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg">
            <span className="flex items-center justify-center space-x-2">
              <span>🔗</span>
              <span>Copy Game Link</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
