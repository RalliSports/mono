'use client'

import { useToast } from '@/components/ui/toast'
import { useGames, useUser } from '@/hooks/api'
import { useFriends } from '@/hooks/api/use-friend'
import { useSessionToken } from '@/hooks/use-session'
import { useReferral } from '@/hooks/useReferral'
import { GamesServiceFindOne } from '@repo/server'
import { useState } from 'react'

interface InviteFriendsProps {
  game: GamesServiceFindOne
}

export default function InviteFriends({ game }: InviteFriendsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'recent' | 'all' | 'search'>('recent')
  const [onlineFilter, setOnlineFilter] = useState<'all' | 'online' | 'offline'>('all')
  const [invitedFriends, setInvitedFriends] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const { currentUser } = useUser()
  const { gameInvite } = useGames()
  const { session } = useSessionToken()
  const { userReferralCode } = useReferral()
  const { addToast } = useToast()

  const { followers, following } = useFriends(session as string, currentUser.data?.id as string)

  const allFriends = [...(followers.data?.flat() ?? []), ...(following.data?.flat() ?? [])]
  const recentlyInvited = allFriends.filter((friend) => friend.createdAt)

  const inviteLink = `${window.location.origin}/game?id=${game.id}&ref=${userReferralCode}&code=${game.gameCode}`

  // Search functionality
  const searchResults = searchQuery.trim()
    ? allFriends?.filter(
        (user) =>
          user?.follower?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.follower?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.following?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.following?.username?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  const handleInvite = async (friendId: string) => {
    try {
      await gameInvite.mutateAsync({
        userId: friendId,
        gameId: game.id,
      })

      setInvitedFriends((prev) => new Set([...prev, friendId]))
      addToast(`Invite sent`, 'success')
    } catch (error) {
      console.log(error, 'error sending invite')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    addToast(`Invite link copied`, 'success')
  }

  if (!game.isPrivate && !(game.creatorId === currentUser.data?.id)) {
    return null // Only show for private games
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md mb-3 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
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
            <p className="text-slate-400 text-xs">Share your private game</p>
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
            {(activeTab === 'recent'
              ? (recentlyInvited ?? [])
              : activeTab === 'all'
                ? (allFriends ?? [])
                : searchResults
            ).map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={friend.follower.avatar ?? ''}
                      alt={friend.follower.firstName ?? ''}
                      className="w-8 h-8 rounded-full"
                    />
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 ${
                        friend.follower ? 'bg-green-400' : 'bg-slate-500'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{friend.follower.firstName}</div>
                    <div className="text-slate-400 text-xs">{friend.follower.username}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleInvite(friend.follower.id)}
                  disabled={invitedFriends.has(friend.follower.id) || gameInvite.isPending}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 font-semibold ${
                    invitedFriends.has(friend.id)
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-400/30 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-400/30 hover:from-blue-500/30 hover:to-cyan-500/30 transform hover:scale-[1.02]'
                  }`}
                >
                  {invitedFriends.has(friend.id) ? '✓ Invited' : gameInvite.isPending ? "Sending...": 'Invite'}
                </button>
              </div>
            ))}

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
          <button
            onClick={() => copyToClipboard(inviteLink)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>🔗</span>
              <span>Copy Invite Link</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
