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
  athleteImage?: string;
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

interface OtherPlayer {
  id: number;
  name: string;
  avatar: string;
  lobbyRank: number;
  totalParlays: number;
  activeParlays: number;
  weeklyWins: number;
  weeklyLosses: number;
  winRate: number;
  parlays: Parlay[];
}

export default function OtherPlayersParlays() {
  const [expandedPlayers, setExpandedPlayers] = useState<number[]>([]);
  const [expandedParlays, setExpandedParlays] = useState<number[]>([]);

  // Helper functions to toggle expansion
  const togglePlayer = (playerId: number) => {
    setExpandedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const toggleParlay = (parlayId: number) => {
    setExpandedParlays((prev) =>
      prev.includes(parlayId)
        ? prev.filter((id) => id !== parlayId)
        : [...prev, parlayId]
    );
  };

  const isPlayerExpanded = (playerId: number) =>
    expandedPlayers.includes(playerId);
  const isParlayExpanded = (parlayId: number) =>
    expandedParlays.includes(parlayId);

  const [otherPlayers] = useState<OtherPlayer[]>([
    {
      id: 1,
      name: "Jack Sturt",
      avatar: "🎯",
      lobbyRank: 2,
      totalParlays: 8,
      activeParlays: 3,
      weeklyWins: 12,
      weeklyLosses: 4,
      winRate: 75,
      parlays: [
        {
          id: 1,
          player: "Jack's Live Picks",
          totalStake: 100,
          potentialPayout: 850,
          emoji: "⚡",
          sport: "NBA",
          bets: [
            {
              id: 1,
              player: "Steph Curry",
              betType: "Points",
              target: 27.5,
              currentValue: 31.0,
              betDirection: "over",
              odds: "+110",
              status: "won",
              gameTime: "Final",
              athleteImage: "👨‍🦱",
            },
            {
              id: 2,
              player: "LeBron James",
              betType: "Assists",
              target: 7.5,
              currentValue: 6.0,
              betDirection: "over",
              odds: "-115",
              status: "active",
              gameTime: "Q3 8:15",
              athleteImage: "👑",
            },
            {
              id: 3,
              player: "Giannis",
              betType: "Turnovers",
              target: 3.5,
              currentValue: 5.0,
              betDirection: "under",
              odds: "+105",
              status: "lost",
              gameTime: "Final",
              athleteImage: "🦌",
            },
          ],
        },
        {
          id: 2,
          player: "Jack's NFL Sunday",
          totalStake: 75,
          potentialPayout: 600,
          emoji: "🏈",
          sport: "NFL",
          bets: [
            {
              id: 4,
              player: "Josh Allen",
              betType: "Passing Yards",
              target: 285.5,
              currentValue: 312.0,
              betDirection: "over",
              odds: "+120",
              status: "won",
              gameTime: "Final",
              athleteImage: "🎯",
            },
            {
              id: 5,
              player: "Travis Kelce",
              betType: "Receiving Yards",
              target: 85.5,
              currentValue: 67.0,
              betDirection: "over",
              odds: "-105",
              status: "active",
              gameTime: "Q3 12:45",
              athleteImage: "🔥",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Matt Zimmermann",
      avatar: "🏆",
      lobbyRank: 1,
      totalParlays: 12,
      activeParlays: 5,
      weeklyWins: 18,
      weeklyLosses: 2,
      winRate: 90,
      parlays: [
        {
          id: 3,
          player: "Matt's Lock",
          totalStake: 200,
          potentialPayout: 1600,
          emoji: "🔒",
          sport: "Multi-Sport",
          bets: [
            {
              id: 6,
              player: "Mahomes",
              betType: "Passing TDs",
              target: 2.5,
              currentValue: 3.0,
              betDirection: "over",
              odds: "+115",
              status: "won",
              gameTime: "Final",
              athleteImage: "🐐",
            },
            {
              id: 7,
              player: "Jayson Tatum",
              betType: "Points",
              target: 28.5,
              currentValue: 24.0,
              betDirection: "over",
              odds: "-110",
              status: "active",
              gameTime: "Q2 4:22",
              athleteImage: "☘️",
            },
            {
              id: 8,
              player: "Luka Dončić",
              betType: "Triple Double",
              target: 0.5,
              currentValue: 1.0,
              betDirection: "over",
              odds: "+125",
              status: "won",
              gameTime: "Final",
              athleteImage: "🇸🇮",
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Sulaiman",
      avatar: "🎲",
      lobbyRank: 4,
      totalParlays: 15,
      activeParlays: 2,
      weeklyWins: 8,
      weeklyLosses: 12,
      winRate: 40,
      parlays: [
        {
          id: 4,
          player: "Sulaiman's Dumb Picks",
          totalStake: 50,
          potentialPayout: 2500,
          emoji: "🚀",
          sport: "NBA",
          bets: [
            {
              id: 9,
              player: "Dame Lillard",
              betType: "3-Pointers",
              target: 4.5,
              currentValue: 2.0,
              betDirection: "over",
              odds: "+150",
              status: "lost",
              gameTime: "Final",
              athleteImage: "🕐",
            },
            {
              id: 10,
              player: "Joel Embiid",
              betType: "Rebounds",
              target: 11.5,
              currentValue: 8.0,
              betDirection: "over",
              odds: "-110",
              status: "active",
              gameTime: "Q3 2:30",
              athleteImage: "🏀",
            },
          ],
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

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400 bg-yellow-400/20";
      case 2:
        return "text-slate-300 bg-slate-300/20";
      case 3:
        return "text-orange-400 bg-orange-400/20";
      default:
        return "text-slate-400 bg-slate-400/20";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "👑";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "🎮";
    }
  };

  const getPlayerStats = (player: OtherPlayer) => {
    let totalWonBets = 0;
    let totalActiveBets = 0;
    let totalLostBets = 0;
    let totalBets = 0;

    player.parlays.forEach((parlay) => {
      parlay.bets.forEach((bet) => {
        totalBets++;
        if (bet.status === "won") totalWonBets++;
        else if (bet.status === "active") totalActiveBets++;
        else if (bet.status === "lost") totalLostBets++;
      });
    });

    return { totalWonBets, totalActiveBets, totalLostBets, totalBets };
  };

  const getParlayStats = (parlay: Parlay) => {
    const activeBets = parlay.bets.filter(
      (bet) => bet.status === "active"
    ).length;
    const wonBets = parlay.bets.filter((bet) => bet.status === "won").length;
    const lostBets = parlay.bets.filter((bet) => bet.status === "lost").length;
    const totalBets = parlay.bets.length;

    return { activeBets, wonBets, lostBets, totalBets };
  };

  const getExtendedProgress = (bet: Bet) => {
    if (bet.status === "not_started") return 0;

    if (bet.betDirection === "over") {
      const extendedScale = bet.target * 1.3;
      const progress = (bet.currentValue / extendedScale) * 100;
      return Math.min(100, progress);
    } else {
      const extendedScale = bet.target * 1.3;
      const targetPosition = (bet.target / extendedScale) * 100;

      if (bet.currentValue <= bet.target) {
        const distanceFromTarget = bet.target - bet.currentValue;
        const maxDistance = bet.target;
        const progress = Math.min(
          targetPosition,
          (distanceFromTarget / maxDistance) * targetPosition
        );
        return progress;
      } else {
        const excessValue = bet.currentValue - bet.target;
        const maxExcess = extendedScale - bet.target;
        const excessProgress =
          (excessValue / maxExcess) * (100 - targetPosition);
        return Math.min(100, targetPosition + excessProgress);
      }
    }
  };

  const getTargetThresholdPosition = () => {
    return (1 / 1.3) * 100;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">Lobby Players 🏆</h1>
        <p className="text-gray-400 text-lg">
          Track other players' parlays and see who's dominating the lobby
        </p>
      </div>

      {/* Players List */}
      <div className="space-y-4">
        {otherPlayers.map((player) => {
          const playerStats = getPlayerStats(player);
          const isExpanded = isPlayerExpanded(player.id);

          return (
            <div
              key={player.id}
              className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300"
            >
              {/* Player Header - Always Visible */}
              <div
                className="p-6 cursor-pointer hover:bg-slate-700/20 transition-all duration-200"
                onClick={() => togglePlayer(player.id)}
              >
                <div className="flex items-center justify-between">
                  {/* Left: Avatar and Name */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-2xl">
                      {player.avatar}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl leading-tight">
                        {player.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-slate-300 text-sm">
                          {player.totalParlays} parlays • {player.activeParlays}{" "}
                          active
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${player.winRate >= 70 ? "text-emerald-400 bg-emerald-400/20" : player.winRate >= 50 ? "text-blue-400 bg-blue-400/20" : "text-red-400 bg-red-400/20"}`}
                        >
                          {player.winRate}% WR
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Rank and Expand Icon */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`px-4 py-2 rounded-xl font-bold text-sm border ${getRankColor(player.lobbyRank)}`}
                    >
                      {getRankIcon(player.lobbyRank)} #{player.lobbyRank}
                    </div>
                    <div
                      className={`transform transition-transform duration-300 text-slate-400 ${isExpanded ? "rotate-180" : ""}`}
                    >
                      ▼
                    </div>
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 text-sm">
                      Overall Progress
                    </span>
                    <span className="text-white font-semibold text-sm">
                      {playerStats.totalWonBets}W {playerStats.totalActiveBets}A{" "}
                      {playerStats.totalLostBets}L
                    </span>
                  </div>
                  <TriColorProgressBar
                    totalBets={playerStats.totalBets}
                    wonBets={playerStats.totalWonBets}
                    activeBets={playerStats.totalActiveBets}
                    lostBets={playerStats.totalLostBets}
                  />
                </div>
              </div>

              {/* Expanded Content - Parlays */}
              {isExpanded && (
                <div className="border-t border-slate-700/50 bg-slate-800/30">
                  <div className="p-6 space-y-4">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-emerald-400">
                          {player.weeklyWins}
                        </div>
                        <div className="text-xs text-slate-400">
                          Weekly Wins
                        </div>
                      </div>
                      <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-red-400">
                          {player.weeklyLosses}
                        </div>
                        <div className="text-xs text-slate-400">
                          Weekly Losses
                        </div>
                      </div>
                      <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {player.activeParlays}
                        </div>
                        <div className="text-xs text-slate-400">
                          Active Parlays
                        </div>
                      </div>
                      <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-[#00CED1]">
                          {player.totalParlays}
                        </div>
                        <div className="text-xs text-slate-400">
                          Total Parlays
                        </div>
                      </div>
                    </div>

                    {/* Individual Parlays */}
                    <div className="space-y-3">
                      {player.parlays.map((parlay) => {
                        const parlayStats = getParlayStats(parlay);
                        const parlayExpanded = isParlayExpanded(parlay.id);

                        return (
                          <div
                            key={parlay.id}
                            className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden"
                          >
                            {/* Parlay Header */}
                            <div
                              className="p-4 cursor-pointer hover:bg-slate-700/20 transition-all duration-200"
                              onClick={() => toggleParlay(parlay.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-lg">
                                    {parlay.emoji}
                                  </div>
                                  <div>
                                    <h4 className="text-white font-semibold text-sm">
                                      {parlay.player}
                                    </h4>
                                    <p className="text-slate-400 text-xs">
                                      {parlay.sport}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <div className="text-[#00CED1] font-bold text-sm">
                                      ${parlay.totalStake} → $
                                      {parlay.potentialPayout}
                                    </div>
                                    <div className="text-slate-400 text-xs">
                                      {parlayStats.wonBets}W{" "}
                                      {parlayStats.activeBets}A{" "}
                                      {parlayStats.lostBets}L
                                    </div>
                                  </div>
                                  <div
                                    className={`transform transition-transform duration-300 text-slate-400 ${parlayExpanded ? "rotate-180" : ""}`}
                                  >
                                    ▼
                                  </div>
                                </div>
                              </div>

                              {/* Parlay Progress */}
                              <div className="mt-3">
                                <TriColorProgressBar
                                  totalBets={parlayStats.totalBets}
                                  wonBets={parlayStats.wonBets}
                                  activeBets={parlayStats.activeBets}
                                  lostBets={parlayStats.lostBets}
                                />
                              </div>
                            </div>

                            {/* Expanded Parlay Content - Individual Bets */}
                            {parlayExpanded && (
                              <div className="border-t border-slate-700/50 p-4 space-y-3">
                                {parlay.bets.map((bet) => (
                                  <div
                                    key={bet.id}
                                    className="bg-slate-700/40 rounded-xl p-3 hover:bg-slate-700/60 transition-all duration-200"
                                  >
                                    {/* Bet Header */}
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-lg">
                                          {bet.athleteImage}
                                        </div>
                                        <div>
                                          <span className="text-white font-medium text-sm">
                                            {bet.player}
                                          </span>
                                          <div className="text-slate-400 text-xs">
                                            {bet.betType} {bet.betDirection}{" "}
                                            {bet.target}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div
                                          className={`text-xs font-semibold ${getStatusColor(bet.status)}`}
                                        >
                                          {bet.status === "won"
                                            ? "Won"
                                            : bet.status === "lost"
                                              ? "Lost"
                                              : bet.status === "active"
                                                ? "Live"
                                                : "Pending"}
                                        </div>
                                        <div className="text-slate-500 text-xs">
                                          {bet.gameTime}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Current Value */}
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-slate-300 text-xs">
                                        Current
                                      </span>
                                      <span className="text-white font-bold">
                                        {bet.status === "not_started"
                                          ? "—"
                                          : bet.currentValue}
                                      </span>
                                    </div>

                                    {/* Progress Bar */}
                                    {bet.status !== "not_started" && (
                                      <div className="relative">
                                        <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden relative">
                                          <div
                                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                              bet.status === "won"
                                                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                                : bet.status === "lost"
                                                  ? "bg-gradient-to-r from-red-600 to-red-400"
                                                  : "bg-gradient-to-r from-blue-400 to-blue-500"
                                            }`}
                                            style={{
                                              width: `${getExtendedProgress(bet)}%`,
                                            }}
                                          />
                                        </div>
                                        {/* Enhanced target line with label */}
                                        <div
                                          className="absolute w-0.5 bg-white/80 shadow-lg"
                                          style={{
                                            left: `${getTargetThresholdPosition()}%`,
                                            top: "-1px",
                                            height: "8px",
                                          }}
                                        />
                                        {/* Target label */}
                                        <div
                                          className="absolute -top-5 text-xs text-slate-300 font-medium transform -translate-x-1/2 bg-slate-800/80 px-1 py-0.5 rounded border border-slate-600/50"
                                          style={{
                                            left: `${getTargetThresholdPosition()}%`,
                                          }}
                                        >
                                          {bet.target}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
