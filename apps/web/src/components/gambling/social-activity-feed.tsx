"use client";

import { useState, useCallback } from "react";

interface User {
  name: string;
  username: string;
  avatar: string;
  isVerified?: boolean;
  level?: number;
}

interface Comment {
  id: number;
  user: User;
  text: string;
  time: string;
  likes: number;
  isLiked?: boolean;
}

interface Bet {
  player: string;
  stat: string;
  prediction: string;
  value: string;
  opponent: string;
  game: string;
  odds: string;
  potential: string;
}

interface FeedItem {
  id: number;
  type: "lobby" | "friend-bet" | "big-win" | "perfect-parlay";
  user: User;
  title?: string;
  description?: string;
  time: string;
  action: string;
  category: string;
  prize?: string;
  participants?: number;
  maxParticipants?: number;
  urgent?: boolean;
  bet?: Bet;
  confidence?: string;
  winAmount?: string;
  originalBet?: string;
  multiplier?: string;
  legs?: string[];
  achievement?: string;
  likes?: number;
  comments?: Comment[];
  isLiked?: boolean;
}

// Confetti effect component
const ConfettiEffect = ({
  show,
  onComplete,
}: {
  show: boolean;
  onComplete: () => void;
}) => {
  if (!show) return null;

  // Auto-complete after animation
  setTimeout(onComplete, 2000);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        >
          <div
            className={`w-3 h-3 rotate-45 ${
              [
                "bg-[#00CED1]",
                "bg-[#FFAB91]",
                "bg-emerald-400",
                "bg-purple-400",
                "bg-yellow-400",
              ][Math.floor(Math.random() * 5)]
            }`}
            style={{
              transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`,
              transition: "transform 3s ease-out",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default function SocialActivityFeed() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newComment, setNewComment] = useState("");

  const filters = [
    { id: "all", name: "All Activity", icon: "🌟", count: 12 },
    { id: "lobbies", name: "Public Lobbies", icon: "🏟️", count: 3 },
    { id: "friends", name: "Friends", icon: "👥", count: 5 },
    { id: "big-wins", name: "Big Wins", icon: "💰", count: 2 },
    { id: "perfect", name: "Perfect Parlays", icon: "🎯", count: 2 },
  ];

  const feedItems = [
    {
      id: 1,
      type: "lobby",
      user: { name: "Mike Chen", username: "@mikethebet", avatar: "MC" },
      title: "Sunday NFL Showdown",
      description: "5-leg parlay battle • $25 buy-in • 8/12 slots filled",
      time: "2 minutes ago",
      action: "created a public lobby",
      category: "lobbies",
      prize: "$300",
      participants: 8,
      maxParticipants: 12,
    },
    {
      id: 2,
      type: "friend-bet",
      user: { name: "Sarah Wilson", username: "@sarahbets", avatar: "SW" },
      bet: {
        player: "Lamar Jackson",
        stat: "Passing Yards",
        prediction: "Higher",
        value: "275.5",
        opponent: "vs Ravens",
        game: "July 31, 6:00 PM",
      },
      time: "5 minutes ago",
      action: "placed a bet",
      category: "friends",
      confidence: "🔥 High Confidence",
    },
    {
      id: 3,
      type: "big-win",
      user: { name: "Alex Rivera", username: "@alexwins", avatar: "AR" },
      title: "Massive 7-Leg Parlay Hit!",
      winAmount: "$2,847",
      originalBet: "$50",
      multiplier: "56.9x",
      time: "15 minutes ago",
      action: "won big",
      category: "big-wins",
      legs: [
        "Chiefs -3.5 ✅",
        "Over 47.5 ✅",
        "Mahomes 2+ TDs ✅",
        "Kelce 80+ Yards ✅",
        "Bills ML ✅",
        "Allen 250+ Yards ✅",
        "Under 52.5 ✅",
      ],
    },
    {
      id: 4,
      type: "friend-bet",
      user: { name: "Jordan Lee", username: "@jlee_bets", avatar: "JL" },
      bet: {
        player: "Ja'Marr Chase",
        stat: "Receiving Yards",
        prediction: "Lower",
        value: "84.5",
        opponent: "vs Steelers",
        game: "August 2, 8:15 PM",
      },
      time: "22 minutes ago",
      action: "placed a bet",
      category: "friends",
      confidence: "📈 Medium Confidence",
    },
    {
      id: 5,
      type: "perfect-parlay",
      user: { name: "Emma Davis", username: "@emmaparlay", avatar: "ED" },
      title: "Perfect 10-Leg Parlay! 🎯",
      winAmount: "$15,200",
      originalBet: "$100",
      multiplier: "152x",
      time: "1 hour ago",
      action: "hit a perfect parlay",
      category: "perfect",
      achievement: "First Perfect 10-Legger of the Season!",
    },
    {
      id: 6,
      type: "lobby",
      user: { name: "Chris Thompson", username: "@cthompson", avatar: "CT" },
      title: "NBA Finals Finale",
      description: "3-leg battle • $50 buy-in • 2/6 slots filled",
      time: "1 hour ago",
      action: "created a public lobby",
      category: "lobbies",
      prize: "$300",
      participants: 2,
      maxParticipants: 6,
      urgent: true,
    },
    {
      id: 7,
      type: "friend-bet",
      user: { name: "Ryan Martinez", username: "@ryanm_sports", avatar: "RM" },
      bet: {
        player: "Saquon Barkley",
        stat: "Rushing Yards",
        prediction: "Higher",
        value: "112.5",
        opponent: "vs Cowboys",
        game: "August 5, 1:00 PM",
      },
      time: "2 hours ago",
      action: "placed a bet",
      category: "friends",
      confidence: "🚀 Max Confidence",
    },
  ];

  const filteredItems = feedItems.filter(
    (item) => activeFilter === "all" || item.category === activeFilter
  );

  const handleDropdownToggle = (itemId: string) => {
    setShowDropdown(showDropdown === itemId ? null : itemId);
  };

  const handleAction = (action: string, itemId: string) => {
    console.log(`Action: ${action} for item ${itemId}`);
    setShowDropdown(null);
  };

  const handleCongratulate = () => {
    setShowConfetti(true);
  };

  const handleCommentsToggle = (itemId: string) => {
    setShowComments(showComments === itemId ? null : itemId);
  };

  const handleLike = (itemId: number) => {
    // Toggle like logic here
    console.log(`Liked item ${itemId}`);
  };

  const handleAddComment = (itemId: string) => {
    if (newComment.trim()) {
      // Add comment logic here
      console.log(`Added comment "${newComment}" to item ${itemId}`);
      setNewComment("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-full px-8 py-4 mb-8 shadow-lg">
          <div className="w-3 h-3 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Social Feed
          </span>
          <div className="w-3 h-3 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Community{" "}
          <span className="bg-gradient-to-r from-[#00CED1] via-purple-400 to-[#FFAB91] bg-clip-text text-transparent">
            Activity
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Stay connected with your friends, discover hot lobbies, and celebrate
          big wins together.
        </p>
      </div>

      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/50 shadow-2xl relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FFAB91] to-[#00CED1] rounded-full blur-2xl"></div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 relative z-10">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg transform scale-105"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/30"
              }`}
            >
              <span className="text-lg">{filter.icon}</span>
              <span>{filter.name}</span>
            </button>
          ))}
        </div>

        {/* Feed Items */}
        <div className="space-y-6 relative z-10">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group hover:transform hover:scale-[1.01] shadow-xl relative"
            >
              {/* Dropdown Menu */}
              <div className="absolute top-6 right-6">
                <button
                  onClick={() => handleDropdownToggle(item.id.toString())}
                  className="w-10 h-10 bg-slate-700/50 hover:bg-slate-600/50 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                  </svg>
                </button>

                {showDropdown === item.id.toString() && (
                  <div className="absolute top-12 right-0 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl py-2 min-w-[200px] shadow-xl z-50">
                    <button
                      onClick={() => handleAction("follow", item.id.toString())}
                      className="w-full px-4 py-3 text-left text-white hover:bg-slate-700/50 transition-colors flex items-center space-x-3"
                    >
                      <span className="text-lg">👥</span>
                      <span>Follow User</span>
                    </button>
                    <button
                      onClick={() => handleAction("hide", item.id.toString())}
                      className="w-full px-4 py-3 text-left text-white hover:bg-slate-700/50 transition-colors flex items-center space-x-3"
                    >
                      <span className="text-lg">👁️‍🗨️</span>
                      <span>Hide This Post</span>
                    </button>
                    <button
                      onClick={() => handleAction("report", item.id.toString())}
                      className="w-full px-4 py-3 text-left text-red-400 hover:bg-slate-700/50 transition-colors flex items-center space-x-3"
                    >
                      <span className="text-lg">🚨</span>
                      <span>Report</span>
                    </button>
                  </div>
                )}
              </div>

              {/* User Info Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {item.user.avatar}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-white font-bold text-lg">
                      {item.user.name}
                    </h4>
                    <span className="text-slate-400 text-sm">
                      {item.user.username}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    <span className="text-[#00CED1]">{item.action}</span> •{" "}
                    {item.time}
                  </p>
                </div>
              </div>

              {/* Content based on type */}
              {item.type === "lobby" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-2 flex items-center">
                        {item.title}
                        {item.urgent && (
                          <span className="ml-3 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-xs font-bold animate-pulse">
                            FILLING FAST
                          </span>
                        )}
                      </h3>
                      <p className="text-slate-400 text-sm mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-[#00CED1] font-bold text-lg">
                            {item.prize}
                          </span>
                          <span className="text-slate-400 text-sm">
                            prize pool
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-slate-700 rounded-full h-2 min-w-[100px]">
                            <div
                              className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${((item.participants || 0) / (item.maxParticipants || 1)) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-slate-300 text-sm font-semibold">
                            {item.participants || 0}/{item.maxParticipants || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-[#00CED1]/30 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>Join Lobby</span>
                  </button>
                </div>
              )}

              {item.type === "friend-bet" && item.bet && (
                <div>
                  <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/30 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-bold text-lg">
                        {item.bet.player}
                      </h3>
                      <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm font-bold">
                        {item.confidence}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-slate-400 text-sm">
                          Prediction
                        </span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`text-lg font-bold ${item.bet.prediction === "Higher" ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {item.bet.prediction === "Higher" ? "📈" : "📉"}
                          </span>
                          <span className="text-white font-bold">
                            {item.bet.prediction}
                          </span>
                          <span className="text-[#00CED1] font-bold">
                            {item.bet.value}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">Stat</span>
                        <div className="text-white font-bold mt-1">
                          {item.bet.stat}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        {item.bet.opponent}
                      </span>
                      <span className="text-[#FFAB91] font-semibold">
                        {item.bet.game}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-slate-700/50 border border-slate-600/50 text-white font-semibold py-3 rounded-xl hover:bg-slate-600/50 transition-all duration-300">
                      💬 Comment
                    </button>
                    <button className="flex-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold py-3 rounded-xl hover:bg-emerald-500/30 transition-all duration-300">
                      🎯 Copy Bet
                    </button>
                  </div>
                </div>
              )}

              {(item.type === "big-win" || item.type === "perfect-parlay") && (
                <div>
                  <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-400/10 border border-emerald-400/30 rounded-2xl p-6 mb-4">
                    <h3 className="text-white font-bold text-xl mb-4 flex items-center">
                      {item.title}
                      {item.type === "perfect-parlay" && (
                        <span className="ml-3 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-xs font-bold">
                          LEGENDARY
                        </span>
                      )}
                    </h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-slate-400 text-sm">Won</span>
                        <div className="text-emerald-400 font-bold text-2xl">
                          {item.winAmount}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">
                          Original Bet
                        </span>
                        <div className="text-white font-bold text-lg">
                          {item.originalBet}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">
                          Multiplier
                        </span>
                        <div className="text-[#FFAB91] font-bold text-lg">
                          {item.multiplier}
                        </div>
                      </div>
                    </div>
                    {item.legs && (
                      <div className="mb-4">
                        <span className="text-slate-400 text-sm mb-2 block">
                          Winning Legs
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {item.legs.map((leg, index) => (
                            <div
                              key={index}
                              className="text-white text-sm bg-slate-800/50 rounded-lg px-3 py-2"
                            >
                              {leg}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.achievement && (
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
                        <span className="text-purple-400 font-semibold text-sm">
                          🏆 {item.achievement}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-slate-700/50 border border-slate-600/50 text-white font-semibold py-3 rounded-xl hover:bg-slate-600/50 transition-all duration-300">
                      🎉 Congratulate
                    </button>
                    <button className="flex-1 bg-[#00CED1]/20 border border-[#00CED1]/30 text-[#00CED1] font-semibold py-3 rounded-xl hover:bg-[#00CED1]/30 transition-all duration-300">
                      📤 Share
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8 relative z-10">
          <button className="bg-slate-700/50 border border-slate-600/50 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-slate-600/50 transition-all duration-300">
            Load More Activity
          </button>
        </div>
      </div>
    </div>
  );
}
