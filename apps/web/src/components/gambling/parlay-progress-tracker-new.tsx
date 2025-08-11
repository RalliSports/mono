"use client";

import { useState } from "react";

interface Bet {
  id: number;
  betType: string;
  target: number;
  currentValue: number;
  betDirection: "over" | "under";
  odds: string;
  status: "not_started" | "active" | "won" | "lost";
  gameTime: string;
  player: string;
}

interface Parlay {
  id: number;
  player: string;
  totalStake: number;
  potentialPayout: number;
  bets: Bet[];
  emoji: string;
  sport: string;
}

export default function ParlayProgressTracker() {
  const [parlays] = useState<Parlay[]>([
    {
      id: 1,
      player: "Jake's Weekend Parlay",
      totalStake: 50,
      potentialPayout: 425,
      emoji: "🔥",
      sport: "Multi-Sport",
      bets: [
        {
          id: 1,
          player: "LeBron James",
          betType: "Points",
          target: 28.5,
          currentValue: 24.0,
          betDirection: "over",
          odds: "+110",
          status: "active",
          gameTime: "Q3 8:15",
        },
        {
          id: 2,
          player: "Luka Dončić",
          betType: "Assists",
          target: 9.5,
          currentValue: 11.0,
          betDirection: "over",
          odds: "-115",
          status: "won",
          gameTime: "Final",
        },
        {
          id: 3,
          player: "Jayson Tatum",
          betType: "Rebounds",
          target: 8.5,
          currentValue: 6.0,
          betDirection: "over",
          odds: "+105",
          status: "active",
          gameTime: "Q2 4:22",
        },
        {
          id: 4,
          player: "Travis Kelce",
          betType: "Receiving Yards",
          target: 75.5,
          currentValue: 0,
          betDirection: "over",
          odds: "-110",
          status: "not_started",
          gameTime: "Tomorrow 1:00 PM",
        },
        {
          id: 5,
          player: "Josh Allen",
          betType: "Passing Yards",
          target: 285.5,
          currentValue: 0,
          betDirection: "over",
          odds: "+120",
          status: "not_started",
          gameTime: "Tomorrow 8:30 PM",
        },
      ],
    },
    {
      id: 2,
      player: "Sarah's NBA Special",
      totalStake: 25,
      potentialPayout: 180,
      emoji: "🏀",
      sport: "NBA",
      bets: [
        {
          id: 6,
          player: "Stephen Curry",
          betType: "3-Pointers",
          target: 4.5,
          currentValue: 5.0,
          betDirection: "over",
          odds: "+105",
          status: "won",
          gameTime: "Final",
        },
        {
          id: 7,
          player: "Giannis",
          betType: "Points",
          target: 32.5,
          currentValue: 28.0,
          betDirection: "over",
          odds: "-110",
          status: "active",
          gameTime: "Q4 5:30",
        },
        {
          id: 8,
          player: "Kawhi Leonard",
          betType: "Rebounds",
          target: 6.5,
          currentValue: 0,
          betDirection: "over",
          odds: "-115",
          status: "not_started",
          gameTime: "Tomorrow 9:00 PM",
        },
      ],
    },
    {
      id: 3,
      player: "Mike's NFL Sunday",
      totalStake: 100,
      potentialPayout: 850,
      emoji: "🏈",
      sport: "NFL",
      bets: [
        {
          id: 9,
          player: "Patrick Mahomes",
          betType: "Passing Yards",
          target: 285.5,
          currentValue: 312.0,
          betDirection: "over",
          odds: "+120",
          status: "won",
          gameTime: "Final",
        },
        {
          id: 10,
          player: "Tyreek Hill",
          betType: "Receiving Yards",
          target: 85.5,
          currentValue: 67.0,
          betDirection: "over",
          odds: "-105",
          status: "active",
          gameTime: "Q3 12:45",
        },
        {
          id: 11,
          player: "CMC",
          betType: "Rushing Yards",
          target: 75.5,
          currentValue: 89.0,
          betDirection: "over",
          odds: "+110",
          status: "won",
          gameTime: "Final",
        },
        {
          id: 12,
          player: "Josh Jacobs",
          betType: "Touchdowns",
          target: 0.5,
          currentValue: 0,
          betDirection: "over",
          odds: "-120",
          status: "not_started",
          gameTime: "Tomorrow 4:25 PM",
        },
      ],
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-blue-400";
      case "won":
        return "text-emerald-400";
      case "lost":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-400";
      case "won":
        return "bg-emerald-400";
      case "lost":
        return "bg-red-400";
      default:
        return "bg-gray-500";
    }
  };

  const getProgress = (bet: Bet) => {
    if (bet.status === "not_started") return 0;
    if (bet.status === "won") return 100;
    if (bet.status === "lost") return 0;

    return Math.min(100, (bet.currentValue / bet.target) * 100);
  };

  const getBetStatus = (bet: Bet) => {
    if (bet.status === "not_started") return "Pending";
    if (bet.status === "won") return "Won";
    if (bet.status === "lost") return "Lost";

    if (bet.betDirection === "over") {
      return bet.currentValue >= bet.target ? "Won" : "In Progress";
    } else {
      return bet.currentValue <= bet.target ? "Won" : "In Progress";
    }
  };

  const getParlayStats = (parlay: Parlay) => {
    const activeBets = parlay.bets.filter(
      (bet) => bet.status === "active"
    ).length;
    const wonBets = parlay.bets.filter((bet) => bet.status === "won").length;
    const totalBets = parlay.bets.length;
    const progress = (wonBets / totalBets) * 100;

    return { activeBets, wonBets, totalBets, progress };
  };

  const getParlayGradient = (parlay: Parlay) => {
    const { progress } = getParlayStats(parlay);
    if (progress >= 80)
      return "from-emerald-500/20 via-emerald-600/10 to-emerald-700/5";
    if (progress >= 50) return "from-blue-500/20 via-blue-600/10 to-blue-700/5";
    if (progress >= 20)
      return "from-orange-500/20 via-orange-600/10 to-orange-700/5";
    return "from-gray-500/20 via-gray-600/10 to-gray-700/5";
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Beautiful Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">
          Live Parlay Tracker
        </h1>
        <p className="text-gray-400 text-lg">
          Track your friends' weekend parlays in real-time
        </p>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {parlays.map((parlay) => {
          const stats = getParlayStats(parlay);

          return (
            <div
              key={parlay.id}
              className={`bg-gradient-to-br ${getParlayGradient(parlay)} backdrop-blur-lg border border-gray-600/40 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 group`}
            >
              {/* Enhanced Header */}
              <div className="relative p-6 pb-4">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-2 right-2 w-20 h-20 bg-white rounded-full blur-2xl"></div>
                  <div className="absolute bottom-2 left-2 w-16 h-16 bg-white rounded-full blur-xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center text-2xl border border-white/20">
                        {parlay.emoji}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight">
                          {parlay.player}
                        </h3>
                        <p className="text-gray-300 text-sm">{parlay.sport}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-emerald-400 font-bold text-lg">
                        {stats.wonBets}/{stats.totalBets}
                      </div>
                      <div className="text-blue-400 text-sm">
                        {stats.activeBets} live
                      </div>
                    </div>
                  </div>

                  {/* Payout Info */}
                  <div className="bg-black/20 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-300 text-sm">
                          Stake → Payout
                        </div>
                        <div className="text-white font-bold text-xl">
                          ${parlay.totalStake} → ${parlay.potentialPayout}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-300 text-sm">
                          Potential Profit
                        </div>
                        <div className="text-emerald-400 font-bold text-xl">
                          +${parlay.potentialPayout - parlay.totalStake}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm">Progress</span>
                        <span className="text-white font-semibold text-sm">
                          {Math.round(stats.progress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700/60 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400 transition-all duration-1000"
                          style={{ width: `${stats.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Bet List */}
              <div className="px-6 pb-6">
                <div className="space-y-3">
                  {parlay.bets.map((bet) => (
                    <div
                      key={bet.id}
                      className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-200 group/bet"
                    >
                      {/* Bet Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${getStatusDot(bet.status)}`}
                          />
                          <span className="text-white font-semibold text-sm">
                            {bet.player}
                          </span>
                          <span className="text-gray-400 text-xs bg-gray-700/50 px-2 py-1 rounded-lg">
                            {bet.odds}
                          </span>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-xs font-semibold ${getStatusColor(bet.status)}`}
                          >
                            {getBetStatus(bet)}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {bet.gameTime}
                          </div>
                        </div>
                      </div>

                      {/* Bet Details */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-300 text-sm">
                          {bet.betType} {bet.betDirection} {bet.target}
                        </span>
                        <span className="text-white font-bold text-lg">
                          {bet.status === "not_started"
                            ? "—"
                            : bet.currentValue}
                        </span>
                      </div>

                      {/* Enhanced Progress Bar */}
                      {bet.status !== "not_started" && (
                        <div className="space-y-2">
                          <div className="w-full bg-gray-700/60 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                bet.status === "won"
                                  ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                  : bet.status === "lost"
                                    ? "bg-gradient-to-r from-red-400 to-red-500"
                                    : "bg-gradient-to-r from-blue-400 to-blue-500"
                              }`}
                              style={{ width: `${getProgress(bet)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Progress</span>
                            <span className="text-gray-400">
                              {Math.round(getProgress(bet))}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Beautiful Legend */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-6 bg-black/40 backdrop-blur-lg border border-gray-600/40 rounded-2xl px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-gray-300 text-sm font-medium">Live</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            <span className="text-gray-300 text-sm font-medium">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-gray-300 text-sm font-medium">Won</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-gray-300 text-sm font-medium">Lost</span>
          </div>
        </div>
      </div>
    </div>
  );
}
