import Image from 'next/image'
import { useState } from 'react'

interface Friend {
  id: string
  username: string
  firstName: string
  lastName: string
  avatar: string
  isOnline: boolean
  mutualFriends: number
  gamesPlayed: number
  winRate: number
  lastSeen: string
}

// Mock friends data
const mockFriends: Friend[] = [
  {
    id: '1',
    username: 'cryptokid23',
    firstName: 'Alex',
    lastName: 'Johnson',
    avatar: '/users/user1.jpg',
    isOnline: true,
    mutualFriends: 5,
    gamesPlayed: 127,
    winRate: 68.5,
    lastSeen: 'Online now',
  },
  {
    id: '2',
    username: 'parlaymaster',
    firstName: 'Sarah',
    lastName: 'Chen',
    avatar: '/users/user2.jpg',
    isOnline: true,
    mutualFriends: 12,
    gamesPlayed: 89,
    winRate: 72.1,
    lastSeen: 'Online now',
  },
  {
    id: '3',
    username: 'sportsfan99',
    firstName: 'Mike',
    lastName: 'Williams',
    avatar: '/users/user3.jpg',
    isOnline: false,
    mutualFriends: 8,
    gamesPlayed: 234,
    winRate: 61.2,
    lastSeen: '2 hours ago',
  },
  {
    id: '4',
    username: 'betqueen',
    firstName: 'Emma',
    lastName: 'Davis',
    avatar: '/users/user4.jpg',
    isOnline: true,
    mutualFriends: 3,
    gamesPlayed: 45,
    winRate: 77.8,
    lastSeen: 'Online now',
  },
  {
    id: '5',
    username: 'ralliking',
    firstName: 'David',
    lastName: 'Martinez',
    avatar: '/users/user5.jpg',
    isOnline: false,
    mutualFriends: 15,
    gamesPlayed: 312,
    winRate: 64.7,
    lastSeen: '1 day ago',
  },
  {
    id: '6',
    username: 'luckystreak',
    firstName: 'Jessica',
    lastName: 'Taylor',
    avatar: '/users/user6.jpg',
    isOnline: false,
    mutualFriends: 7,
    gamesPlayed: 156,
    winRate: 59.6,
    lastSeen: '3 days ago',
  },
]

const pendingRequests = [
  {
    id: '7',
    username: 'newplayer22',
    firstName: 'Ryan',
    lastName: 'Smith',
    avatar: '/users/user7.jpg',
    mutualFriends: 2,
    gamesPlayed: 12,
    winRate: 50.0,
  },
  {
    id: '8',
    username: 'cryptowhale',
    firstName: 'Lisa',
    lastName: 'Brown',
    avatar: '/users/user8.jpg',
    mutualFriends: 9,
    gamesPlayed: 78,
    winRate: 81.4,
  },
]

export default function FriendsSection() {
  const [activeSubTab, setActiveSubTab] = useState<'friends' | 'requests'>('friends')

  return (
    <div className="space-y-6">
      {/* Friends/Requests Toggle */}
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
              <span className="text-lg">👥</span>
            </span>
            Friends
          </h3>
          <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
            <button
              onClick={() => setActiveSubTab('friends')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeSubTab === 'friends'
                  ? 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Friends ({mockFriends.length})
            </button>
            <button
              onClick={() => setActiveSubTab('requests')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 relative ${
                activeSubTab === 'requests'
                  ? 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Requests
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Friends List */}
        {activeSubTab === 'friends' && (
          <div className="space-y-3">
            {mockFriends.map((friend) => (
              <div
                key={friend.id}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-slate-600/60 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar with online status */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center overflow-hidden">
                        {friend.avatar ? (
                          <Image
                            src={friend.avatar}
                            alt={friend.username}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-lg">
                            {friend.firstName[0]}
                            {friend.lastName[0]}
                          </span>
                        )}
                      </div>
                      {/* Online status indicator */}
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                          friend.isOnline ? 'bg-emerald-500' : 'bg-slate-500'
                        }`}
                      />
                    </div>

                    {/* Friend info */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-white font-semibold">{friend.username}</h4>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-slate-400 text-sm">{friend.lastSeen}</span>
                        <span className="text-slate-400 text-sm">{friend.mutualFriends} mutual friends</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats and actions */}
                  <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm text-slate-300">
                        <span className="text-[#00CED1] font-medium">{friend.gamesPlayed}</span> games
                      </div>
                      <div className="text-sm text-slate-300">
                        <span
                          className={`font-medium ${
                            friend.winRate >= 70
                              ? 'text-emerald-400'
                              : friend.winRate >= 60
                                ? 'text-yellow-400'
                                : 'text-red-400'
                          }`}
                        >
                          {friend.winRate}%
                        </span>{' '}
                        win rate
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex space-x-2">
                      <button className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-700/50 transition-colors">
                        <span className="text-lg">💬</span>
                      </button>
                      <button className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-700/50 transition-colors">
                        <span className="text-lg">🎮</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {mockFriends.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">No friends yet</h3>
                <p className="text-slate-400">Start playing games to connect with other players!</p>
              </div>
            )}
          </div>
        )}

        {/* Friend Requests */}
        {activeSubTab === 'requests' && (
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-slate-600/60 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center overflow-hidden">
                        {request.avatar ? (
                          <Image
                            src={request.avatar}
                            alt={request.username}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-lg">
                            {request.firstName[0]}
                            {request.lastName[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Request info */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-white font-semibold">{request.username}</h4>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-slate-400 text-sm">{request.mutualFriends} mutual friends</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats and actions */}
                  <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm text-slate-300">
                        <span className="text-[#00CED1] font-medium">{request.gamesPlayed}</span> games
                      </div>
                      <div className="text-sm text-slate-300">
                        <span
                          className={`font-medium ${
                            request.winRate >= 70
                              ? 'text-emerald-400'
                              : request.winRate >= 60
                                ? 'text-yellow-400'
                                : 'text-red-400'
                          }`}
                        >
                          {request.winRate}%
                        </span>{' '}
                        win rate
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex space-x-2">
                      <button className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-700/50 transition-colors text-emerald-400 hover:text-emerald-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-700/50 transition-colors text-red-400 hover:text-red-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6m0 12L6 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {pendingRequests.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📬</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">No pending requests</h3>
                <p className="text-slate-400">You're all caught up!</p>
              </div>
            )}
          </div>
        )}

        {/* Add Friends Button */}
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <button className="w-full py-3 bg-gradient-to-r from-slate-800/80 to-slate-900/60 hover:from-slate-700/80 hover:to-slate-800/60 text-white font-medium rounded-xl border border-slate-700/50 transition-all duration-300 flex items-center justify-center space-x-2">
            <span className="text-lg">➕</span>
            <span>Add Friends</span>
          </button>
        </div>
      </div>
    </div>
  )
}
