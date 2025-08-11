"use client";

import { useState, useEffect } from "react";
import MiniProgressBar from "./mini-progress-bar";

interface LiveGame {
  id: number;
  sport: string;
  emoji: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: string;
  timeRemaining: string;
  yourBet: {
    type: string;
    selection: string;
    amount: number;
    odds: string;
    status: "winning" | "losing" | "neutral";
    potential: number;
    // Progress tracking data
    target?: number;
    currentValue?: number;
    betDirection?: "over" | "under";
  };
  lastUpdate: string;
}

interface PlayerStats {
  balance: number;
  globalRank: number;
  currentStreak: number;
  longestStreak: number;
  winRate: number;
  totalBets: number;
  monthlyChange: string;
  rankChange: number;
}

export default function LivePlayerDashboard() {
  const [activeTab, setActiveTab] = useState<"recent" | "live">("live");
  const [notifications, setNotifications] = useState<string[]>([]);

  const [playerStats] = useState<PlayerStats>({
    balance: 5247,
    globalRank: 12,
    currentStreak: 7,
    longestStreak: 15,
    winRate: 68,
    totalBets: 247,
    monthlyChange: "+12.4%",
    rankChange: 8,
  });

  const [liveGames, setLiveGames] = useState<LiveGame[]>([
    {
      id: 1,
      sport: "NBA",
      emoji: "🏀",
      homeTeam: "Lakers",
      awayTeam: "Warriors",
      homeScore: 94,
      awayScore: 92,
      quarter: "Q4",
      timeRemaining: "3:42",
      yourBet: {
        type: "Total Points",
        selection: "Over 210.5",
        amount: 150,
        odds: "+110",
        status: "winning",
        potential: 315,
        target: 210.5,
        currentValue: 186.0,
        betDirection: "over",
      },
      lastUpdate: "5s ago",
    },
    {
      id: 2,
      sport: "NFL",
      emoji: "🏈",
      homeTeam: "Chiefs",
      awayTeam: "Bills",
      homeScore: 21,
      awayScore: 14,
      quarter: "Q3",
      timeRemaining: "8:15",
      yourBet: {
        type: "Total Points",
        selection: "Over 49.5",
        amount: 200,
        odds: "-110",
        status: "losing",
        potential: 381,
        target: 49.5,
        currentValue: 35.0,
        betDirection: "over",
      },
      lastUpdate: "12s ago",
    },
    {
      id: 3,
      sport: "NHL",
      emoji: "🏒",
      homeTeam: "Rangers",
      awayTeam: "Bruins",
      homeScore: 2,
      awayScore: 2,
      quarter: "3rd Period",
      timeRemaining: "5:28",
      yourBet: {
        type: "Moneyline",
        selection: "Rangers ML",
        amount: 100,
        odds: "+125",
        status: "neutral",
        potential: 225,
      },
      lastUpdate: "8s ago",
    },
    {
      id: 4,
      sport: "NBA",
      emoji: "🏀",
      homeTeam: "Celtics",
      awayTeam: "Heat",
      homeScore: 78,
      awayScore: 83,
      quarter: "Q3",
      timeRemaining: "11:23",
      yourBet: {
        type: "Player Points",
        selection: "Tatum Over 25.5",
        amount: 75,
        odds: "-120",
        status: "winning",
        potential: 137,
        target: 25.5,
        currentValue: 22.0,
        betDirection: "over",
      },
      lastUpdate: "3s ago",
    },
    {
      id: 5,
      sport: "MLB",
      emoji: "⚾",
      homeTeam: "Yankees",
      awayTeam: "Red Sox",
      homeScore: 4,
      awayScore: 2,
      quarter: "7th Inning",
      timeRemaining: "Top",
      yourBet: {
        type: "Total Runs",
        selection: "Under 8.5",
        amount: 120,
        odds: "+105",
        status: "winning",
        potential: 246,
        target: 8.5,
        currentValue: 6.0,
        betDirection: "under",
      },
      lastUpdate: "1m ago",
    },
  ]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveGames((prev) =>
        prev.map((game) => {
          const updatedGame = {
            ...game,
            // Randomly update scores
            homeScore: game.homeScore + (Math.random() > 0.95 ? 1 : 0),
            awayScore: game.awayScore + (Math.random() > 0.95 ? 1 : 0),
            lastUpdate: `${Math.floor(Math.random() * 15)}s ago`,
          };

          // Update progress values for bets with targets
          if (game.yourBet.target && game.yourBet.currentValue !== undefined) {
            const changeAmount = (Math.random() - 0.5) * 2; // Random change between -1 and 1
            const newValue = Math.max(
              0,
              game.yourBet.currentValue + changeAmount
            );

            // Update bet status based on progress
            let newStatus: "winning" | "losing" | "neutral" =
              game.yourBet.status;
            if (game.yourBet.betDirection === "over") {
              newStatus =
                newValue >= game.yourBet.target
                  ? "winning"
                  : newValue >= game.yourBet.target * 0.8
                    ? "neutral"
                    : "losing";
            } else if (game.yourBet.betDirection === "under") {
              newStatus =
                newValue <= game.yourBet.target
                  ? "winning"
                  : newValue <= game.yourBet.target * 1.2
                    ? "neutral"
                    : "losing";
            }

            updatedGame.yourBet = {
              ...game.yourBet,
              currentValue: Number(newValue.toFixed(1)),
              status: newStatus,
            };
          }

          return updatedGame;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const recentActivity = [
    {
      id: 1,
      sport: "NFL",
      emoji: "🏈",
      bet: "Chiefs -3.5",
      result: "Chiefs 24-17 Bills",
      status: "won",
      amount: 245,
      time: "2 minutes ago",
    },
    {
      id: 2,
      sport: "EPL",
      emoji: "⚽",
      bet: "Arsenal Win",
      result: "Arsenal 1-2 Chelsea",
      status: "lost",
      amount: -120,
      time: "15 minutes ago",
    },
    {
      id: 3,
      sport: "MLB",
      emoji: "⚾",
      bet: "Yankees ML",
      result: "Yankees 8-3 Red Sox",
      status: "won",
      amount: 85,
      time: "1 hour ago",
    },
    {
      id: 4,
      sport: "NBA",
      emoji: "🏀",
      bet: "Warriors +5.5",
      result: "Warriors 112-108 Nuggets",
      status: "won",
      amount: 190,
      time: "3 hours ago",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-[#FFAB91] to-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-purple-500 to-[#00CED1] rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-3xl">MK</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-3 border-slate-800 flex items-center justify-center shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-white mb-2">Mike Chen</h3>
            <p className="text-slate-300 text-xl">@mikethebet</p>
            <div className="flex items-center space-x-3 mt-3">
              <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                <span className="text-emerald-400 font-bold text-sm">
                  PREMIUM
                </span>
              </div>
              <div className="px-4 py-2 bg-[#00CED1]/20 border border-[#00CED1]/30 rounded-full">
                <span className="text-[#00CED1] font-bold text-sm">LVL 12</span>
              </div>
              <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full">
                <span className="text-purple-400 font-bold text-sm">
                  {playerStats.currentStreak} WIN STREAK
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-400 text-sm">Last Active</div>
          <div className="text-white font-semibold text-lg">2 min ago</div>
          <div className="flex items-center justify-end space-x-2 mt-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 font-bold text-sm">
              LIVE TRACKING
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center justify-center space-x-4 mb-8 relative z-10">
        <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-xl text-emerald-400 font-semibold hover:from-emerald-500/30 hover:to-emerald-600/30 hover:border-emerald-500/50 transition-all duration-300 group">
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Place Bet</span>
        </button>

        <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#00CED1]/20 to-cyan-600/20 border border-[#00CED1]/30 rounded-xl text-[#00CED1] font-semibold hover:from-[#00CED1]/30 hover:to-cyan-600/30 hover:border-[#00CED1]/50 transition-all duration-300 group">
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z" />
            <path d="M6 6a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V6z" />
          </svg>
          <span>Deposit</span>
        </button>

        <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl text-purple-400 font-semibold hover:from-purple-500/30 hover:to-purple-600/30 hover:border-purple-500/50 transition-all duration-300 group">
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Analytics</span>
        </button>

        <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl text-orange-400 font-semibold hover:from-orange-500/30 hover:to-orange-600/30 hover:border-orange-500/50 transition-all duration-300 group">
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          <span>Settings</span>
        </button>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-10 relative z-10">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-[#00CED1]/50 transition-all duration-300 group hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-[#00CED1]/20 rounded-xl flex items-center justify-center group-hover:bg-[#00CED1]/30 transition-colors">
              <svg
                className="w-6 h-6 text-[#00CED1]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div className="text-emerald-400 text-xs font-semibold">
              {playerStats.monthlyChange}
            </div>
          </div>
          <div className="text-3xl font-bold text-[#00CED1] mb-2">
            ${playerStats.balance.toLocaleString()}
          </div>
          <div className="text-slate-300 text-sm">Current Balance</div>
          <div className="text-slate-400 text-xs mt-1">available</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-violet-400/50 transition-all duration-300 group hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-violet-400/20 rounded-xl flex items-center justify-center group-hover:bg-violet-400/30 transition-colors">
              <svg
                className="w-6 h-6 text-violet-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <div className="text-emerald-400 text-xs font-semibold">
              ↑ {playerStats.rankChange}
            </div>
          </div>
          <div className="text-3xl font-bold text-violet-400 mb-2">
            #{playerStats.globalRank}
          </div>
          <div className="text-slate-300 text-sm">Global Rank</div>
          <div className="text-slate-400 text-xs mt-1">positions up</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-400/50 transition-all duration-300 group hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-400/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-400/30 transition-colors">
              <svg
                className="w-6 h-6 text-emerald-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div className="text-emerald-400 text-xs font-semibold">ACTIVE</div>
          </div>
          <div className="text-3xl font-bold text-emerald-400 mb-2">
            {playerStats.currentStreak}
          </div>
          <div className="text-slate-300 text-sm">Current Streak</div>
          <div className="text-slate-400 text-xs mt-1">consecutive wins</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-orange-400/50 transition-all duration-300 group hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-400/20 rounded-xl flex items-center justify-center group-hover:bg-orange-400/30 transition-colors">
              <svg
                className="w-6 h-6 text-orange-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div className="text-orange-400 text-xs font-semibold">RECORD</div>
          </div>
          <div className="text-3xl font-bold text-orange-400 mb-2">
            {playerStats.longestStreak}
          </div>
          <div className="text-slate-300 text-sm">Longest Streak</div>
          <div className="text-slate-400 text-xs mt-1">personal best</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-[#FFAB91]/50 transition-all duration-300 group hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-[#FFAB91]/20 rounded-xl flex items-center justify-center group-hover:bg-[#FFAB91]/30 transition-colors">
              <svg
                className="w-6 h-6 text-[#FFAB91]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div className="text-emerald-400 text-xs font-semibold">+3.2%</div>
          </div>
          <div className="text-3xl font-bold text-[#FFAB91] mb-2">
            {playerStats.winRate}%
          </div>
          <div className="text-slate-300 text-sm">Win Rate</div>
          <div className="text-slate-400 text-xs mt-1">this month</div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center space-x-2 bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-2 border border-slate-700/40 shadow-xl">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 relative overflow-hidden ${
              activeTab === "live"
                ? "bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg transform scale-105"
                : "text-slate-400 hover:text-white hover:bg-slate-700/30"
            }`}
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>Live Updates</span>
            <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-bold">
              {liveGames.length}
            </span>
            {activeTab === "live" && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#00CED1]/20 to-[#FFAB91]/20 animate-pulse"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("recent")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 relative overflow-hidden ${
              activeTab === "recent"
                ? "bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg transform scale-105"
                : "text-slate-400 hover:text-white hover:bg-slate-700/30"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>Recent Activity</span>
            {activeTab === "recent" && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#00CED1]/20 to-[#FFAB91]/20 animate-pulse"></div>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {/* Filter Dropdown for Live bets */}
          {activeTab === "live" && (
            <select className="px-4 py-2 bg-slate-800/60 border border-slate-700/40 rounded-xl text-slate-300 text-sm font-semibold focus:outline-none focus:border-[#00CED1]/50 transition-colors">
              <option value="all">All Sports</option>
              <option value="nba">NBA</option>
              <option value="nfl">NFL</option>
              <option value="nhl">NHL</option>
              <option value="mlb">MLB</option>
            </select>
          )}

          <button className="px-6 py-3 bg-gradient-to-r from-[#00CED1]/20 to-cyan-600/20 border border-[#00CED1]/30 rounded-xl text-[#00CED1] text-sm font-semibold hover:from-[#00CED1]/30 hover:to-cyan-600/30 hover:border-[#00CED1]/50 transition-all duration-300 group">
            <span className="group-hover:scale-105 transition-transform inline-block">
              View All
            </span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30 relative z-10">
        {activeTab === "live" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-white flex items-center">
                <div className="w-10 h-10 bg-emerald-400/20 rounded-xl flex items-center justify-center mr-3">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
                Live Game Updates
              </h4>
              <div className="text-emerald-400 text-sm font-semibold flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Auto-refreshing</span>
              </div>
            </div>

            {liveGames.map((game) => (
              <div
                key={game.id}
                className={`p-6 rounded-2xl border transition-all duration-300 group hover:transform hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm relative overflow-hidden ${
                  game.yourBet.status === "winning"
                    ? "bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 border-emerald-500/40 hover:border-emerald-400/60 shadow-emerald-500/10"
                    : game.yourBet.status === "losing"
                      ? "bg-gradient-to-br from-red-500/15 to-red-600/10 border-red-500/40 hover:border-red-400/60 shadow-red-500/10"
                      : "bg-gradient-to-br from-amber-500/15 to-amber-600/10 border-amber-500/40 hover:border-amber-400/60 shadow-amber-500/10"
                }`}
              >
                {/* Status Glow Effect */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    game.yourBet.status === "winning"
                      ? "bg-gradient-to-br from-emerald-500/5 to-transparent"
                      : game.yourBet.status === "losing"
                        ? "bg-gradient-to-br from-red-500/5 to-transparent"
                        : "bg-gradient-to-br from-amber-500/5 to-transparent"
                  }`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-all duration-300 group-hover:scale-110 ${
                          game.yourBet.status === "winning"
                            ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30"
                            : game.yourBet.status === "losing"
                              ? "bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30"
                              : "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30"
                        }`}
                      >
                        {game.emoji}
                      </div>
                      <div>
                        <div className="text-white font-bold text-xl mb-1 group-hover:text-[#00CED1] transition-colors">
                          {game.awayTeam} @ {game.homeTeam}
                        </div>
                        <div className="text-slate-400 text-sm flex items-center space-x-2">
                          <span className="px-2 py-1 bg-slate-700/50 rounded-md text-xs font-semibold">
                            {game.sport}
                          </span>
                          <span>•</span>
                          <span>
                            {game.quarter} {game.timeRemaining}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform">
                        {game.awayScore} - {game.homeScore}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center justify-end space-x-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span>{game.lastUpdate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/30 group-hover:border-slate-600/50 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="text-white font-bold text-lg mb-1">
                          {game.yourBet.selection}
                        </div>
                        <div className="text-slate-400 text-sm flex items-center space-x-3">
                          <span className="px-2 py-1 bg-slate-700/40 rounded-md text-xs font-semibold">
                            {game.yourBet.type}
                          </span>
                          <span>•</span>
                          <span className="font-semibold">
                            ${game.yourBet.amount}
                          </span>
                          <span>@</span>
                          <span className="font-semibold text-[#00CED1]">
                            {game.yourBet.odds}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold text-2xl mb-1 transition-all duration-300 group-hover:scale-105 ${
                          game.yourBet.status === "winning"
                            ? "text-emerald-400 group-hover:text-emerald-300"
                            : game.yourBet.status === "losing"
                              ? "text-red-400 group-hover:text-red-300"
                              : "text-amber-400 group-hover:text-amber-300"
                        }`}
                      >
                        ${game.yourBet.potential}
                      </div>
                      <div
                        className={`text-sm font-bold flex items-center justify-end space-x-2 ${
                          game.yourBet.status === "winning"
                            ? "text-emerald-400"
                            : game.yourBet.status === "losing"
                              ? "text-red-400"
                              : "text-amber-400"
                        }`}
                      >
                        <span>
                          {game.yourBet.status === "winning"
                            ? "✅ WINNING"
                            : game.yourBet.status === "losing"
                              ? "❌ LOSING"
                              : "⏳ TRACKING"}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            game.yourBet.status === "winning"
                              ? "bg-emerald-400 animate-pulse"
                              : game.yourBet.status === "losing"
                                ? "bg-red-400 animate-pulse"
                                : "bg-amber-400 animate-pulse"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mini Progress Bar for trackable bets */}
                  {game.yourBet.target &&
                    game.yourBet.currentValue !== undefined &&
                    game.yourBet.betDirection && (
                      <div className="mt-5 px-2">
                        <MiniProgressBar
                          betType={game.yourBet.type}
                          target={game.yourBet.target}
                          currentValue={game.yourBet.currentValue}
                          betDirection={game.yourBet.betDirection}
                          status={game.yourBet.status}
                          className="opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-white flex items-center">
                <div className="w-10 h-10 bg-[#00CED1]/20 rounded-xl flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-[#00CED1]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                Recent Activity
              </h4>
            </div>

            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 group hover:transform hover:scale-[1.01] hover:shadow-xl backdrop-blur-sm relative overflow-hidden ${
                  activity.status === "won"
                    ? "bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-400/50 shadow-emerald-500/10"
                    : "bg-gradient-to-br from-red-500/15 to-red-600/10 border-red-500/30 hover:border-red-400/50 shadow-red-500/10"
                }`}
              >
                {/* Status Glow Effect */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    activity.status === "won"
                      ? "bg-gradient-to-br from-emerald-500/5 to-transparent"
                      : "bg-gradient-to-br from-red-500/5 to-transparent"
                  }`}
                />

                <div className="flex items-center space-x-4 relative z-10">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg ${
                      activity.status === "won"
                        ? "bg-gradient-to-br from-emerald-500/25 to-emerald-600/15 border border-emerald-500/40"
                        : "bg-gradient-to-br from-red-500/25 to-red-600/15 border border-red-500/40"
                    }`}
                  >
                    <span className="text-2xl">{activity.emoji}</span>
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg mb-1 group-hover:text-[#00CED1] transition-colors">
                      {activity.bet}
                    </div>
                    <div className="text-slate-400 text-sm flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-slate-700/50 rounded-md text-xs font-semibold">
                        {activity.sport}
                      </span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          activity.status === "won"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {activity.status === "won" ? "✅ WON" : "❌ LOST"}
                      </div>
                      <span className="text-slate-500 text-sm">
                        {activity.result}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <div
                    className={`font-bold text-2xl mb-1 transition-all duration-300 group-hover:scale-105 ${
                      activity.status === "won"
                        ? "text-emerald-400 group-hover:text-emerald-300"
                        : "text-red-400 group-hover:text-red-300"
                    }`}
                  >
                    {activity.status === "won" ? "+" : ""}$
                    {Math.abs(activity.amount)}
                  </div>
                  <div
                    className={`text-sm font-bold flex items-center justify-end space-x-2 ${
                      activity.status === "won"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    <span>FINAL</span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.status === "won"
                          ? "bg-emerald-400"
                          : "bg-red-400"
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
// this component has given me eternal pain so if someone is to mess around have fun but save a copy of this because it breaks every chance it gets because fuck this shit thats why like holy shit what the hell was i writing
