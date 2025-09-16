'use client'

import { useState, useCallback } from 'react'
import { triggerSideCannons, triggerCelebrationBurst } from '@/components/ui/confetti'

interface User {
  name: string
  username: string
  avatar: string
  isVerified?: boolean
  level?: number
}

interface Comment {
  id: number
  user: User
  text: string
  time: string
  likes: number
  isLiked?: boolean
}

interface Bet {
  player: string
  stat: string
  prediction: string
  value: string
  opponent: string
  game: string
  odds: string
  potential: string
}

interface FeedItem {
  id: number
  type: 'lobby' | 'friend-bet' | 'big-win' | 'perfect-parlay'
  user: User
  title?: string
  description?: string
  time: string
  action: string
  category: string
  prize?: string
  participants?: number
  maxParticipants?: number
  urgent?: boolean
  bet?: Bet
  confidence?: string
  winAmount?: string
  originalBet?: string
  multiplier?: string
  legs?: string[]
  achievement?: string
  likes?: number
  comments?: Comment[]
  isLiked?: boolean
}

export default function SocialActivityFeed() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [showDropdown, setShowDropdown] = useState<string | null>(null)
  const [showComments, setShowComments] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')

  const filters = [
    { id: 'all', name: 'All Activity', icon: '🌟', count: 12 },
    { id: 'lobbies', name: 'Public Lobbies', icon: '🏟️', count: 3 },
    { id: 'friends', name: 'Friends', icon: '👥', count: 5 },
    { id: 'big-wins', name: 'Big Wins', icon: '💰', count: 2 },
    { id: 'perfect', name: 'Perfect Parlays', icon: '🎯', count: 2 },
  ]

  const feedItems: FeedItem[] = [
    {
      id: 1,
      type: 'lobby',
      user: {
        name: 'Mike Chen',
        username: '@mikethebet',
        avatar: 'MC',
        isVerified: true,
        level: 12,
      },
      title: '🔥 Sunday NFL Championship Battle',
      description: '5-leg parlay showdown • Premium contest with guaranteed prizes',
      time: '2 minutes ago',
      action: 'created a public lobby',
      category: 'lobbies',
      prize: '$1,200',
      participants: 9,
      maxParticipants: 12,
      likes: 8,
      isLiked: false,
      comments: [
        {
          id: 1,
          user: { name: 'Sarah W', username: '@sarahbets', avatar: 'SW' },
          text: "Finally a good contest! I'm in 🔥",
          time: '1 min ago',
          likes: 3,
        },
        {
          id: 2,
          user: { name: 'Alex R', username: '@alexwins', avatar: 'AR' },
          text: 'That prize pool looking juicy 💰',
          time: '2 min ago',
          likes: 1,
        },
      ],
    },
    {
      id: 2,
      type: 'friend-bet',
      user: {
        name: 'Sarah Wilson',
        username: '@sarahbets',
        avatar: 'SW',
        isVerified: false,
        level: 8,
      },
      bet: {
        player: 'Lamar Jackson',
        stat: 'Passing Yards',
        prediction: 'Higher',
        value: '275.5',
        opponent: 'vs Ravens',
        game: 'July 31, 6:00 PM',
        odds: '+110',
        potential: '$55.00',
      },
      time: '5 minutes ago',
      action: 'placed a high-confidence bet',
      category: 'friends',
      confidence: '🔥 Max Confidence',
      likes: 12,
      isLiked: true,
      comments: [
        {
          id: 1,
          user: { name: 'Mike C', username: '@mikethebet', avatar: 'MC' },
          text: "Lamar's been throwing 🔥 lately, good pick!",
          time: '3 min ago',
          likes: 5,
          isLiked: true,
        },
        {
          id: 2,
          user: { name: 'Jordan L', username: '@jlee_bets', avatar: 'JL' },
          text: 'Ravens defense been suspect, might go under 👀',
          time: '4 min ago',
          likes: 2,
        },
        {
          id: 3,
          user: { name: 'Emma D', username: '@emmaparlay', avatar: 'ED' },
          text: 'Following this one! 📈',
          time: '2 min ago',
          likes: 1,
        },
      ],
    },
    {
      id: 3,
      type: 'big-win',
      user: {
        name: 'Alex Rivera',
        username: '@alexwins',
        avatar: 'AR',
        isVerified: true,
        level: 15,
      },
      title: '🚀 INSANE 9-Leg Parlay CRUSHES! 🚀',
      winAmount: '$4,847',
      originalBet: '$25',
      multiplier: '193.9x',
      time: '15 minutes ago',
      action: 'hit a massive parlay',
      category: 'big-wins',
      likes: 47,
      isLiked: false,
      legs: [
        'Chiefs -3.5 ✅',
        'Over 49.5 ✅',
        'Mahomes 3+ TDs ✅',
        'Kelce 85+ Yards ✅',
        'Bills ML ✅',
        'Allen 275+ Yards ✅',
        'Under 52.5 ✅',
        '49ers -7 ✅',
        'McCaffrey 2+ TDs ✅',
      ],
      comments: [
        {
          id: 1,
          user: { name: 'Emma D', username: '@emmaparlay', avatar: 'ED' },
          text: 'BRO WHAT?! 🤯🤯 Congrats!',
          time: '12 min ago',
          likes: 15,
        },
        {
          id: 2,
          user: { name: 'Sarah W', username: '@sarahbets', avatar: 'SW' },
          text: '193x multiplier is absolutely INSANE! 🔥',
          time: '10 min ago',
          likes: 8,
        },
        {
          id: 3,
          user: { name: 'Ryan M', username: '@ryanm_sports', avatar: 'RM' },
          text: 'Teach me your ways master 🙏',
          time: '8 min ago',
          likes: 5,
        },
      ],
    },
    {
      id: 4,
      type: 'perfect-parlay',
      user: {
        name: 'Emma Davis',
        username: '@emmaparlay',
        avatar: 'ED',
        isVerified: true,
        level: 18,
      },
      title: '🎯 PERFECT 12-LEG PARLAY! LEGENDARY! 🎯',
      winAmount: '$28,450',
      originalBet: '$100',
      multiplier: '284.5x',
      time: '1 hour ago',
      action: 'achieved perfection',
      category: 'perfect',
      achievement: 'First Perfect 12-Legger of the Season! 👑',
      likes: 156,
      isLiked: true,
      comments: [
        {
          id: 1,
          user: { name: 'Alex R', username: '@alexwins', avatar: 'AR' },
          text: 'EMMA IS THE GOAT! 🐐👑',
          time: '45 min ago',
          likes: 28,
        },
        {
          id: 2,
          user: { name: 'Sarah W', username: '@sarahbets', avatar: 'SW' },
          text: "284x... I can't even... 🤯💀",
          time: '50 min ago',
          likes: 22,
        },
        {
          id: 3,
          user: { name: 'Jordan L', username: '@jlee_bets', avatar: 'JL' },
          text: 'Absolutely legendary Emma! Teaching a masterclass 📚',
          time: '35 min ago',
          likes: 18,
        },
        {
          id: 4,
          user: { name: 'Ryan M', username: '@ryanm_sports', avatar: 'RM' },
          text: "This is why you're the queen 👸💎",
          time: '30 min ago',
          likes: 12,
        },
      ],
    },
  ]

  const filteredItems = feedItems.filter((item) => activeFilter === 'all' || item.category === activeFilter)

  const handleDropdownToggle = (itemId: string) => {
    setShowDropdown(showDropdown === itemId ? null : itemId)
  }

  const handleAction = (action: string, itemId: string) => {
    console.log(`Action: ${action} for item ${itemId}`)
    setShowDropdown(null)
  }

  const handleJoinBattle = () => {
    // Trigger exciting join confetti
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00CED1', '#FFAB91', '#a786ff', '#fd8bbc'],
      })

      setTimeout(() => {
        confetti.default({
          particleCount: 25,
          angle: 60,
          spread: 30,
          origin: { x: 0.3, y: 0.8 },
          colors: ['#00CED1', '#FFAB91'],
        })
      }, 150)

      setTimeout(() => {
        confetti.default({
          particleCount: 25,
          angle: 120,
          spread: 30,
          origin: { x: 0.7, y: 0.8 },
          colors: ['#FFAB91', '#a786ff'],
        })
      }, 300)
    })
  }

  const handleCopyBet = () => {
    // Trigger quick copy success confetti
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.75 },
        colors: ['#10b981', '#34d399', '#6ee7b7'],
      })
    })
  }

  const handleCongratulate = () => {
    // Trigger epic confetti celebration
    triggerCelebrationBurst()
    setTimeout(() => {
      triggerSideCannons()
    }, 300)
  }

  const handleCommentsToggle = (itemId: string) => {
    setShowComments(showComments === itemId ? null : itemId)
  }

  const handleLike = (itemId: number) => {
    const item = feedItems.find((item) => item.id === itemId)
    console.log(`Liked item ${itemId}`)

    // Add confetti for big wins and perfect parlays
    if (item && (item.type === 'big-win' || item.type === 'perfect-parlay')) {
      // Small celebration burst for likes on epic wins
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 20,
          spread: 45,
          origin: { y: 0.7 },
          colors: ['#00CED1', '#FFAB91', '#a786ff'],
        })
      })
    }
  }

  const handleAddComment = (itemId: string) => {
    if (newComment.trim()) {
      console.log(`Added comment "${newComment}" to item ${itemId}`)
      setNewComment('')
    }
  }

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-[#FFAB91] to-[#00CED1] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-purple-400 to-emerald-400 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-full px-8 py-4 mb-8 shadow-lg">
          <div className="w-3 h-3 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Live Social Feed</span>
          <div className="w-3 h-3 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Community{' '}
          <span className="bg-gradient-to-r from-[#00CED1] via-purple-400 to-[#FFAB91] bg-clip-text text-transparent">
            Activity
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Stay connected with friends, discover hot lobbies, celebrate big wins, and follow the pulse of the community.
        </p>
      </div>

      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/50 shadow-2xl relative overflow-hidden">
        {/* Inner background glow effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FFAB91] to-[#00CED1] rounded-full blur-2xl"></div>
        </div>

        {/* Enhanced Filter Tabs */}
        <div className="flex flex-wrap gap-4 mb-10 relative z-10">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 relative group ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-xl transform scale-105'
                  : 'bg-gradient-to-br from-slate-700/60 to-slate-800/60 text-slate-300 hover:bg-slate-600/60 border border-slate-600/30 hover:border-slate-500/50'
              }`}
            >
              <span className="text-xl">{filter.icon}</span>
              <span className="text-base">{filter.name}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeFilter === filter.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-600/50 text-slate-400 group-hover:bg-slate-500/50'
                }`}
              >
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Enhanced Feed Items with Live Updates */}
        <div className="space-y-8 relative z-10">
          {/* Live Activity Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-semibold text-sm">Live Updates Active</span>
            </div>
            <div className="text-slate-400 text-sm">{filteredItems.length} activities • Updated now</div>
          </div>

          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group hover:transform hover:scale-[1.01] shadow-xl relative overflow-hidden ${
                index === 0 ? 'ring-2 ring-[#00CED1]/20 animate-pulse' : ''
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: index < 3 ? `slideInUp 0.6s ease-out ${index * 100}ms both` : undefined,
              }}
            >
              {/* Item background glow */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-xl"></div>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute top-6 right-6 z-20">
                <button
                  onClick={() => handleDropdownToggle(item.id.toString())}
                  className="w-10 h-10 bg-slate-700/50 hover:bg-slate-600/50 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-slate-600/30"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                  </svg>
                </button>

                {showDropdown === item.id.toString() && (
                  <div className="absolute top-12 right-0 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl py-2 min-w-[200px] shadow-2xl z-50">
                    <button
                      onClick={() => handleAction('follow', item.id.toString())}
                      className="w-full px-6 py-3 text-left text-white hover:bg-slate-700/50 transition-colors flex items-center space-x-3"
                    >
                      <span className="text-lg">👥</span>
                      <span>Follow {item.user.name}</span>
                    </button>
                    <button
                      onClick={() => handleAction('hide', item.id.toString())}
                      className="w-full px-6 py-3 text-left text-white hover:bg-slate-700/50 transition-colors flex items-center space-x-3"
                    >
                      <span className="text-lg">👁️‍🗨️</span>
                      <span>Hide This Post</span>
                    </button>
                    <button
                      onClick={() => handleAction('report', item.id.toString())}
                      className="w-full px-6 py-3 text-left text-red-400 hover:bg-slate-700/50 transition-colors flex items-center space-x-3"
                    >
                      <span className="text-lg">🚨</span>
                      <span>Report</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Enhanced User Info Header */}
              <div className="flex items-center space-x-4 mb-8 relative z-10">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center shadow-xl border-2 border-slate-700/50">
                    <span className="text-white font-bold text-lg">{item.user.avatar}</span>
                  </div>
                  {item.user.level && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full border-2 border-slate-800 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{item.user.level}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-white font-bold text-xl">{item.user.name}</h4>
                    {item.user.isVerified && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    )}
                    <span className="text-slate-400 text-sm">{item.user.username}</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    <span className="text-[#00CED1] font-semibold">{item.action}</span> • {item.time}
                  </p>
                </div>
              </div>

              {/* Content based on type */}
              {item.type === 'lobby' && (
                <div className="relative z-10">
                  <div className="mb-6">
                    <h3 className="text-white font-bold text-2xl mb-3 flex items-center">
                      {item.title}
                      {item.urgent && (
                        <span className="ml-3 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-xs font-bold animate-pulse">
                          FILLING FAST
                        </span>
                      )}
                    </h3>
                    <p className="text-slate-400 text-base mb-4">{item.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-slate-700/30 rounded-2xl p-4 border border-slate-600/30">
                        <span className="text-slate-400 text-sm">Prize Pool</span>
                        <div className="text-[#00CED1] font-bold text-2xl">{item.prize}</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-2xl p-4 border border-slate-600/30">
                        <span className="text-slate-400 text-sm">Participants</span>
                        <div className="text-white font-bold text-2xl">
                          {item.participants}/{item.maxParticipants}
                        </div>
                      </div>
                      <div className="bg-slate-700/30 rounded-2xl p-4 border border-slate-600/30">
                        <span className="text-slate-400 text-sm">Progress</span>
                        <div className="mt-2">
                          <div className="w-full bg-slate-600 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] h-3 rounded-full transition-all duration-500"
                              style={{
                                width: `${((item.participants || 0) / (item.maxParticipants || 1)) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleJoinBattle}
                    className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-[#00CED1]/30 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 text-lg"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>Join Battle ({item.maxParticipants! - item.participants!} spots left)</span>
                  </button>
                </div>
              )}

              {item.type === 'friend-bet' && item.bet && (
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 rounded-3xl p-8 border border-slate-600/30 mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-white font-bold text-2xl">{item.bet.player}</h3>
                      <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm font-bold">
                        {item.confidence}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div>
                          <span className="text-slate-400 text-sm">Prediction</span>
                          <div className="flex items-center space-x-3 mt-2">
                            <span
                              className={`text-2xl font-bold ${item.bet.prediction === 'Higher' ? 'text-emerald-400' : 'text-red-400'}`}
                            >
                              {item.bet.prediction === 'Higher' ? '📈' : '📉'}
                            </span>
                            <span className="text-white font-bold text-xl">{item.bet.prediction}</span>
                            <span className="text-[#00CED1] font-bold text-xl">{item.bet.value}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm">Stat Category</span>
                          <div className="text-white font-bold text-lg mt-1">{item.bet.stat}</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-slate-400 text-sm">Odds & Potential</span>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="text-[#FFAB91] font-bold text-lg">{item.bet.odds}</span>
                            <span className="text-emerald-400 font-bold text-lg">{item.bet.potential}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm">Game Info</span>
                          <div className="text-white font-semibold mt-1">{item.bet.opponent}</div>
                          <div className="text-[#FFAB91] font-semibold text-sm">{item.bet.game}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(item.type === 'big-win' || item.type === 'perfect-parlay') && (
                <div className="relative z-10">
                  <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-400/10 border border-emerald-400/30 rounded-3xl p-8 mb-6">
                    <h3 className="text-white font-bold text-2xl mb-6 flex items-center">
                      {item.title}
                      {item.type === 'perfect-parlay' && (
                        <span className="ml-4 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm font-bold">
                          LEGENDARY
                        </span>
                      )}
                    </h3>
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div className="text-center">
                        <span className="text-slate-400 text-sm">Won</span>
                        <div className="text-emerald-400 font-bold text-3xl">{item.winAmount}</div>
                      </div>
                      <div className="text-center">
                        <span className="text-slate-400 text-sm">Original Bet</span>
                        <div className="text-white font-bold text-2xl">{item.originalBet}</div>
                      </div>
                      <div className="text-center">
                        <span className="text-slate-400 text-sm">Multiplier</span>
                        <div className="text-[#FFAB91] font-bold text-2xl">{item.multiplier}</div>
                      </div>
                    </div>
                    {item.legs && (
                      <div className="mb-6">
                        <span className="text-slate-400 text-sm mb-3 block">Winning Legs</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {item.legs.map((leg, index) => (
                            <div
                              key={index}
                              className="text-white text-sm bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-700/30"
                            >
                              {leg}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.achievement && (
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4">
                        <span className="text-purple-400 font-semibold">🏆 {item.achievement}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Interaction Bar */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-700/50 relative z-10">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      item.isLiked
                        ? 'text-red-400 bg-red-500/10 border border-red-500/20'
                        : 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                    }`}
                  >
                    <span className="text-lg">{item.isLiked ? '❤️' : '🤍'}</span>
                    <span className="font-semibold">{item.likes}</span>
                  </button>
                  <button
                    onClick={() => handleCommentsToggle(item.id.toString())}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-400 hover:text-[#00CED1] hover:bg-[#00CED1]/10 transition-all duration-200"
                  >
                    <span className="text-lg">💬</span>
                    <span className="font-semibold">{item.comments?.length || 0}</span>
                  </button>
                </div>
                <div className="flex space-x-3">
                  {item.type === 'friend-bet' && (
                    <button
                      onClick={handleCopyBet}
                      className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold px-6 py-3 rounded-xl hover:bg-emerald-500/30 transition-all duration-300"
                    >
                      🎯 Copy Bet
                    </button>
                  )}
                  {(item.type === 'big-win' || item.type === 'perfect-parlay') && (
                    <button
                      onClick={handleCongratulate}
                      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400 font-semibold px-6 py-3 rounded-xl hover:bg-purple-500/30 transition-all duration-300"
                    >
                      🎉 Congratulate
                    </button>
                  )}
                  <button className="bg-[#00CED1]/20 border border-[#00CED1]/30 text-[#00CED1] font-semibold px-6 py-3 rounded-xl hover:bg-[#00CED1]/30 transition-all duration-300">
                    📤 Share
                  </button>
                </div>
              </div>

              {/* Enhanced Comments Section */}
              {showComments === item.id.toString() && item.comments && (
                <div className="mt-6 pt-6 border-t border-slate-700/50 relative z-10">
                  <div className="space-y-4 mb-6">
                    {item.comments.map((comment) => (
                      <div key={comment.id} className="bg-slate-700/30 rounded-2xl p-4 border border-slate-600/30">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">{comment.user.avatar}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-white font-semibold">{comment.user.name}</span>
                              <span className="text-slate-400 text-xs">{comment.time}</span>
                            </div>
                            <p className="text-slate-300 mb-2">{comment.text}</p>
                            <button
                              className={`flex items-center space-x-1 text-xs ${
                                comment.isLiked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
                              }`}
                            >
                              <span>{comment.isLiked ? '❤️' : '🤍'}</span>
                              <span>{comment.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-[#00CED1]/50 focus:ring-2 focus:ring-[#00CED1]/20 transition-all duration-300"
                    />
                    <button
                      onClick={() => handleAddComment(item.id.toString())}
                      className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-10 relative z-10">
          <button className="bg-gradient-to-br from-slate-700/60 to-slate-800/60 border border-slate-600/50 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-slate-600/60 transition-all duration-300 shadow-lg">
            Load More Activity
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(0, 206, 209, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 206, 209, 0.6);
          }
        }
      `}</style>
    </div>
  )
}
