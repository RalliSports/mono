"use client";

import { useState } from "react";
import TriColorProgressBar from "./tri-color-progress-bar";

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
  finalScore?: string; // Add final score for completed games
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
          finalScore: "W 127-118",
        },
        {
          id: 3,
          player: "Jayson Tatum",
          betType: "Turnovers",
          target: 3.5,
          currentValue: 2.0,
          betDirection: "under",
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
          betType: "Interceptions",
          target: 1.5,
          currentValue: 0,
          betDirection: "under",
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
          finalScore: "W 114-109",
        },
        {
          id: 7,
          player: "Giannis",
          betType: "Turnovers",
          target: 4.5,
          currentValue: 6.0,
          betDirection: "under",
          odds: "-110",
          status: "lost",
          gameTime: "Final",
          finalScore: "L 102-115",
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
          finalScore: "W 31-24",
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
          betType: "Fumbles",
          target: 0.5,
          currentValue: 0.0,
          betDirection: "under",
          odds: "+110",
          status: "won",
          gameTime: "Final",
          finalScore: "W 28-21",
        },
        {
          id: 12,
          player: "Josh Jacobs",
          betType: "Rushing Yards",
          target: 85.5,
          currentValue: 42.0,
          betDirection: "over",
          odds: "-120",
          status: "lost",
          gameTime: "Final",
          finalScore: "L 17-30",
        },
      ],
    },
    {
      id: 4,
      player: "Alex's Lucky Day",
      totalStake: 20,
      potentialPayout: 240,
      emoji: "🍀",
      sport: "NBA",
      bets: [
        {
          id: 13,
          player: "Kevin Durant",
          betType: "Points",
          target: 25.5,
          currentValue: 28.0,
          betDirection: "over",
          odds: "+115",
          status: "won",
          gameTime: "Final",
          finalScore: "W 116-103",
        },
        {
          id: 14,
          player: "Joel Embiid",
          betType: "Turnovers",
          target: 3.5,
          currentValue: 2.0,
          betDirection: "under",
          odds: "-110",
          status: "won",
          gameTime: "Final",
          finalScore: "W 108-95",
        },
        {
          id: 15,
          player: "Damian Lillard",
          betType: "3-Pointers",
          target: 3.5,
          currentValue: 4.0,
          betDirection: "over",
          odds: "+125",
          status: "won",
          gameTime: "Final",
          finalScore: "W 125-119",
        },
      ],
    },
    {
      id: 5,
      player: "Emma's Bad Beat",
      totalStake: 75,
      potentialPayout: 600,
      emoji: "😢",
      sport: "Mixed",
      bets: [
        {
          id: 16,
          player: "Tom Brady",
          betType: "Passing Yards",
          target: 275.5,
          currentValue: 189.0,
          betDirection: "over",
          odds: "+110",
          status: "lost",
          gameTime: "Final",
          finalScore: "L 14-27",
        },
        {
          id: 17,
          player: "Derrick Henry",
          betType: "Rushing Attempts",
          target: 22.5,
          currentValue: 18.0,
          betDirection: "under",
          odds: "-115",
          status: "won",
          gameTime: "Final",
          finalScore: "W 24-17",
        },
        {
          id: 18,
          player: "Cooper Kupp",
          betType: "Receptions",
          target: 7.5,
          currentValue: 9.0,
          betDirection: "over",
          odds: "+105",
          status: "won",
          gameTime: "Final",
          finalScore: "W 35-21",
        },
        {
          id: 19,
          player: "Keenan Allen",
          betType: "Receiving Yards",
          target: 85.5,
          currentValue: 52.0,
          betDirection: "over",
          odds: "-120",
          status: "lost",
          gameTime: "Final",
          finalScore: "L 20-28",
        },
      ],
    },
    {
      id: 6,
      player: "Live Action Special",
      totalStake: 40,
      potentialPayout: 320,
      emoji: "⚡",
      sport: "Live Games",
      bets: [
        {
          id: 20,
          player: "Nikola Jokić",
          betType: "Points",
          target: 24.5,
          currentValue: 18.0,
          betDirection: "over",
          odds: "+110",
          status: "active",
          gameTime: "Q3 4:30",
        },
        {
          id: 21,
          player: "Ja Morant",
          betType: "Assists",
          target: 8.5,
          currentValue: 6.0,
          betDirection: "over",
          odds: "-115",
          status: "active",
          gameTime: "Q3 4:30",
        },
        {
          id: 22,
          player: "Anthony Davis",
          betType: "Turnovers",
          target: 2.5,
          currentValue: 1.0,
          betDirection: "under",
          odds: "+105",
          status: "active",
          gameTime: "Q3 4:30",
        },
        {
          id: 23,
          player: "De'Aaron Fox",
          betType: "Points",
          target: 22.5,
          currentValue: 15.0,
          betDirection: "over",
          odds: "-110",
          status: "active",
          gameTime: "Q3 4:30",
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

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case "active":
        return "border-blue-400";
      case "won":
        return "border-emerald-400";
      case "lost":
        return "border-red-400";
      default:
        return "border-gray-500";
    }
  };

  const getBetHoverBorderColor = (status: string) => {
    switch (status) {
      case "active":
        return "hover:border-blue-400/50";
      case "won":
        return "hover:border-emerald-400/50";
      case "lost":
        return "hover:border-red-400/50";
      default:
        return "hover:border-slate-600/50";
    }
  };

  const getParlayHoverBorderColor = (parlay: Parlay) => {
    const stats = getParlayStats(parlay);

    // If all bets are won
    if (stats.wonBets === stats.totalBets) {
      return "hover:border-emerald-400/50";
    }

    // If any bets are lost
    if (stats.lostBets > 0) {
      return "hover:border-red-400/50";
    }

    // If there are active bets (in progress)
    if (stats.activeBets > 0) {
      return "hover:border-blue-400/50";
    }

    // Default (pending)
    return "hover:border-[#00CED1]/50";
  };

  const getProgress = (bet: Bet) => {
    if (bet.status === "not_started") return 0;
    if (bet.status === "won") return 100;

    // For lost bets, show the actual progress they made before losing
    if (bet.status === "lost") {
      return Math.min(100, (bet.currentValue / bet.target) * 100);
    }

    return Math.min(100, (bet.currentValue / bet.target) * 100);
  };

  // New function for extended progress bar with 30% buffer
  const getExtendedProgress = (bet: Bet) => {
    if (bet.status === "not_started") return 0;

    if (bet.betDirection === "over") {
      // For "over" bets: calculate progress on extended scale (target = 76.92% of bar, giving 30% buffer)
      const extendedScale = bet.target * 1.3; // 30% more than target
      const progress = (bet.currentValue / extendedScale) * 100;
      return Math.min(100, progress);
    } else {
      // For "under" bets: invert the logic - progress fills as currentValue stays BELOW target
      const extendedScale = bet.target * 1.3; // 30% more than target for scale
      const targetPosition = (bet.target / extendedScale) * 100; // Where target line is (76.92%)

      if (bet.currentValue <= bet.target) {
        // Winning scenario: fill from 0 to target position based on how far below target we are
        const distanceFromTarget = bet.target - bet.currentValue;
        const maxDistance = bet.target; // Maximum distance would be staying at 0
        const progress = Math.min(
          targetPosition,
          (distanceFromTarget / maxDistance) * targetPosition
        );
        return progress;
      } else {
        // Losing scenario: show progress beyond target line
        const excessValue = bet.currentValue - bet.target;
        const maxExcess = extendedScale - bet.target;
        const excessProgress =
          (excessValue / maxExcess) * (100 - targetPosition);
        return Math.min(100, targetPosition + excessProgress);
      }
    }
  };

  // Calculate where the target threshold line should be (at 76.92% of the bar)
  const getTargetThresholdPosition = () => {
    return (1 / 1.3) * 100; // This equals 76.92%
  };

  const getBetStatus = (bet: Bet) => {
    if (bet.status === "not_started") return "Pending";

    // Show final score for completed games (won or lost)
    if ((bet.status === "won" || bet.status === "lost") && bet.finalScore) {
      return bet.finalScore;
    }

    // Fallback for completed games without final score
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
    const lostBets = parlay.bets.filter((bet) => bet.status === "lost").length;
    const totalBets = parlay.bets.length;
    const progress = (wonBets / totalBets) * 100;

    return { activeBets, wonBets, lostBets, totalBets, progress };
  };

  const getParlayGradient = (parlay: Parlay) => {
    const { progress, wonBets } = getParlayStats(parlay);
    const lostBets = parlay.bets.filter((bet) => bet.status === "lost").length;

    // If there are lost bets, use a more subdued gradient
    if (lostBets > 0) return "from-slate-800/95 to-slate-900/95";

    // High success rate - emerald theme like dashboard
    if (progress >= 80) return "from-slate-800/95 to-slate-900/95";

    // Good progress - slate theme like dashboard
    if (progress >= 50) return "from-slate-800/95 to-slate-900/95";

    // Default - slate theme like dashboard
    return "from-slate-800/95 to-slate-900/95";
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
              className={`bg-gradient-to-br ${getParlayGradient(parlay)} backdrop-blur-md border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 group relative`}
            >
              {/* Enhanced Header */}
              <div className="relative p-6 pb-4">
                {/* Background Pattern - Dashboard Style */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-[#FFAB91] to-[#00CED1] rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
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
                      <div className="text-[#00CED1] font-bold text-lg">
                        {stats.wonBets}/{stats.totalBets}
                      </div>
                      <div className="text-[#FFAB91] text-sm">
                        {stats.activeBets} live
                      </div>
                    </div>
                  </div>

                  {/* Payout Info */}
                  <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 hover:border-[#00CED1]/50 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-300 text-sm">
                          Deposit → Payout
                        </div>
                        <div className="text-white font-bold text-xl">
                          ${parlay.totalStake} → ${parlay.potentialPayout}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-300 text-sm">
                          Potential Profit
                        </div>
                        <div className="text-[#00CED1] font-bold text-xl">
                          +${parlay.potentialPayout - parlay.totalStake}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300 text-sm">Progress</span>
                        <span className="text-white font-semibold text-sm">
                          {stats.wonBets}W {stats.activeBets}A {stats.lostBets}L
                        </span>
                      </div>
                      <TriColorProgressBar
                        totalBets={stats.totalBets}
                        wonBets={stats.wonBets}
                        activeBets={stats.activeBets}
                        lostBets={stats.lostBets}
                      />
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
                      className={`bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 ${getBetHoverBorderColor(bet.status)} transition-all duration-200 group/bet`}
                    >
                      {/* Bet Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full bg-gray-600 border-2 ${getStatusBorderColor(bet.status)} flex items-center justify-center text-xs font-bold text-white`}
                          >
                            {bet.player.charAt(0)}
                          </div>
                          <span className="text-white font-semibold text-sm">
                            {bet.player}
                          </span>
                          {/* <span className="text-slate-400 text-xs bg-slate-700/50 px-2 py-1 rounded-lg">
                            {bet.odds}
                          </span> */}
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-xs font-semibold ${getStatusColor(bet.status)}`}
                          >
                            {getBetStatus(bet)}
                          </div>
                          <div className="text-slate-500 text-xs">
                            {bet.gameTime}
                          </div>
                        </div>
                      </div>

                      {/* Bet Details */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-300 text-sm">
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
                        <div className="space-y-2 relative">
                          <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden relative">
                            {/* Progress fill */}
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                bet.status === "won"
                                  ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                  : bet.status === "lost"
                                    ? "bg-gradient-to-r from-red-600 to-red-400"
                                    : "bg-gradient-to-r from-blue-400 to-blue-500"
                              }`}
                              style={{ width: `${getExtendedProgress(bet)}%` }}
                            />
                          </div>

                          {/* Extended target threshold line that goes beyond the bar */}
                          <div
                            className="absolute w-0.5 bg-white/80 shadow-lg"
                            style={{
                              left: `${getTargetThresholdPosition()}%`,
                              top: "-2px",
                              height: "12px", // Extends 2px above and 8px below the bar
                            }}
                          />

                          {/* Target label */}
                          <div
                            className="absolute top-3 text-xs text-slate-300 font-medium transform -translate-x-1/2 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-600/50"
                            style={{ left: `${getTargetThresholdPosition()}%` }}
                          >
                            {bet.target}
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
        <div className="inline-flex items-center gap-6 bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-slate-300 text-sm font-medium">Live</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-500" />
            <span className="text-slate-300 text-sm font-medium">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 text-sm font-medium">Won</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-slate-300 text-sm font-medium">Lost</span>
          </div>
        </div>
      </div>
    </div>
  );
}
