"use client";

import { useState } from "react";
import TriColorProgressBar from "./tri-color-progress-bar";

interface Pick {
  id: number;
  player: string;
  betType: string;
  target: number;
  currentValue: number;
  betDirection: "over" | "under";
  odds: string;
  status: "not_started" | "active" | "won" | "lost";
  gameTime: string;
  athleteImage: string;
  sport: string;
}

interface LobbyPlayer {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  picks: Pick[];
}

export default function LobbyPicksViewer() {
  const [expandedPlayers, setExpandedPlayers] = useState<number[]>([]);

  // Helper function to toggle player expansion
  const togglePlayer = (playerId: number) => {
    setExpandedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const isPlayerExpanded = (playerId: number) =>
    expandedPlayers.includes(playerId);

  const [lobbyPlayers] = useState<LobbyPlayer[]>([
    {
      id: 1,
      name: "Jack Sturt",
      avatar: "🎯",
      isOnline: true,
      picks: [
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
          athleteImage: "👑",
          sport: "NBA",
        },
        {
          id: 2,
          player: "Steph Curry",
          betType: "3-Pointers",
          target: 4.5,
          currentValue: 6.0,
          betDirection: "over",
          odds: "+105",
          status: "won",
          gameTime: "Final",
          athleteImage: "👨‍🦱",
          sport: "NBA",
        },
        {
          id: 3,
          player: "Travis Kelce",
          betType: "Receiving Yards",
          target: 85.5,
          currentValue: 92.0,
          betDirection: "over",
          odds: "-110",
          status: "won",
          gameTime: "Final",
          athleteImage: "🔥",
          sport: "NFL",
        },
        {
          id: 4,
          player: "Josh Allen",
          betType: "Interceptions",
          target: 1.5,
          currentValue: 0,
          betDirection: "under",
          odds: "+120",
          status: "not_started",
          gameTime: "Tomorrow 8:30 PM",
          athleteImage: "🎯",
          sport: "NFL",
        },
      ],
    },
    {
      id: 2,
      name: "Matt Zimmermann",
      avatar: "🏆",
      isOnline: true,
      picks: [
        {
          id: 5,
          player: "Giannis",
          betType: "Rebounds",
          target: 11.5,
          currentValue: 14.0,
          betDirection: "over",
          odds: "-115",
          status: "won",
          gameTime: "Final",
          athleteImage: "🦌",
          sport: "NBA",
        },
        {
          id: 6,
          player: "Luka Dončić",
          betType: "Turnovers",
          target: 4.5,
          currentValue: 6.0,
          betDirection: "under",
          odds: "+105",
          status: "lost",
          gameTime: "Final",
          athleteImage: "🇸🇮",
          sport: "NBA",
        },
        {
          id: 7,
          player: "Patrick Mahomes",
          betType: "Passing Yards",
          target: 285.5,
          currentValue: 312.0,
          betDirection: "over",
          odds: "+120",
          status: "won",
          gameTime: "Final",
          athleteImage: "🐸",
          sport: "NFL",
        },
        {
          id: 24,
          player: "Ja Morant",
          betType: "Assists",
          target: 8.5,
          currentValue: 6.0,
          betDirection: "over",
          odds: "-115",
          status: "active",
          gameTime: "Q3 4:30",
          athleteImage: "🎪",
          sport: "NBA",
        },
      ],
    },
    {
      id: 3,
      name: "Sulaiman",
      avatar: "🎲",
      isOnline: false,
      picks: [
        {
          id: 8,
          player: "Jayson Tatum",
          betType: "Points",
          target: 26.5,
          currentValue: 31.0,
          betDirection: "over",
          odds: "+115",
          status: "won",
          gameTime: "Final",
          athleteImage: "☘️",
          sport: "NBA",
        },
        {
          id: 9,
          player: "Derrick Henry",
          betType: "Rushing Yards",
          target: 95.5,
          currentValue: 78.0,
          betDirection: "over",
          odds: "-110",
          status: "active",
          gameTime: "Q4 6:22",
          athleteImage: "👑",
          sport: "NFL",
        },
        {
          id: 25,
          player: "Kevin Durant",
          betType: "Points",
          target: 25.5,
          currentValue: 28.0,
          betDirection: "over",
          odds: "+115",
          status: "won",
          gameTime: "Final",
          athleteImage: "🐍",
          sport: "NBA",
        },
        {
          id: 26,
          player: "Cooper Kupp",
          betType: "Receptions",
          target: 7.5,
          currentValue: 0,
          betDirection: "over",
          odds: "+105",
          status: "not_started",
          gameTime: "Sunday 4:25 PM",
          athleteImage: "🔥",
          sport: "NFL",
        },
      ],
    },
    {
      id: 4,
      name: "Emma Chen",
      avatar: "⚡",
      isOnline: true,
      picks: [
        {
          id: 10,
          player: "Kawhi Leonard",
          betType: "Assists",
          target: 5.5,
          currentValue: 0,
          betDirection: "over",
          odds: "-115",
          status: "not_started",
          gameTime: "Tomorrow 9:00 PM",
          athleteImage: "🤖",
          sport: "NBA",
        },
        {
          id: 11,
          player: "Tyreek Hill",
          betType: "Receiving Yards",
          target: 75.5,
          currentValue: 89.0,
          betDirection: "over",
          odds: "+110",
          status: "won",
          gameTime: "Final",
          athleteImage: "💨",
          sport: "NFL",
        },
        {
          id: 12,
          player: "Nikola Jokić",
          betType: "Triple-Double",
          target: 0.5,
          currentValue: 1.0,
          betDirection: "over",
          odds: "+180",
          status: "won",
          gameTime: "Final",
          athleteImage: "🐴",
          sport: "NBA",
        },
        {
          id: 27,
          player: "Joel Embiid",
          betType: "Rebounds",
          target: 10.5,
          currentValue: 12.0,
          betDirection: "over",
          odds: "-110",
          status: "won",
          gameTime: "Final",
          athleteImage: "🏠",
          sport: "NBA",
        },
      ],
    },
    {
      id: 5,
      name: "Carlos Rodriguez",
      avatar: "🌟",
      isOnline: true,
      picks: [
        {
          id: 13,
          player: "Damian Lillard",
          betType: "3-Pointers",
          target: 3.5,
          currentValue: 2.0,
          betDirection: "over",
          odds: "+105",
          status: "active",
          gameTime: "Q2 4:22",
          athleteImage: "⏰",
          sport: "NBA",
        },
        {
          id: 14,
          player: "Lamar Jackson",
          betType: "Rushing Yards",
          target: 65.5,
          currentValue: 45.0,
          betDirection: "over",
          odds: "-110",
          status: "active",
          gameTime: "Q3 11:30",
          athleteImage: "⚡",
          sport: "NFL",
        },
        {
          id: 28,
          player: "Russell Wilson",
          betType: "Passing TDs",
          target: 2.5,
          currentValue: 1.0,
          betDirection: "over",
          odds: "+120",
          status: "active",
          gameTime: "Q2 8:45",
          athleteImage: "🎯",
          sport: "NFL",
        },
        {
          id: 29,
          player: "Anthony Davis",
          betType: "Blocks",
          target: 2.5,
          currentValue: 4.0,
          betDirection: "over",
          odds: "+120",
          status: "won",
          gameTime: "Final",
          athleteImage: "🏠",
          sport: "NBA",
        },
      ],
    },
    {
      id: 6,
      name: "Zoe Walker",
      avatar: "🎪",
      isOnline: false,
      picks: [
        {
          id: 15,
          player: "Anthony Davis",
          betType: "Blocks",
          target: 2.5,
          currentValue: 4.0,
          betDirection: "over",
          odds: "+120",
          status: "won",
          gameTime: "Final",
          athleteImage: "🏠",
          sport: "NBA",
        },
        {
          id: 16,
          player: "Aaron Rodgers",
          betType: "Turnovers",
          target: 1.5,
          currentValue: 0,
          betDirection: "under",
          odds: "+110",
          status: "not_started",
          gameTime: "Sunday 4:25 PM",
          athleteImage: "🧙‍♂️",
          sport: "NFL",
        },
        {
          id: 30,
          player: "Saquon Barkley",
          betType: "Rushing Yards",
          target: 85.5,
          currentValue: 0,
          betDirection: "over",
          odds: "-115",
          status: "not_started",
          gameTime: "Sunday 1:00 PM",
          athleteImage: "💫",
          sport: "NFL",
        },
        {
          id: 31,
          player: "Devin Booker",
          betType: "Points",
          target: 24.5,
          currentValue: 0,
          betDirection: "over",
          odds: "+110",
          status: "not_started",
          gameTime: "Tonight 10:30 PM",
          athleteImage: "☀️",
          sport: "NBA",
        },
      ],
    },
  ]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "text-emerald-400 bg-emerald-400/20 border-emerald-400/30";
      case "lost":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      case "active":
        return "text-blue-400 bg-blue-400/20 border-blue-400/30";
      default:
        return "text-slate-400 bg-slate-400/20 border-slate-400/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "won":
        return "✓";
      case "lost":
        return "✗";
      case "active":
        return "📊";
      default:
        return "⏳";
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case "won":
        return "border-emerald-400/50";
      case "lost":
        return "border-red-400/50";
      case "active":
        return "border-blue-400/50";
      default:
        return "border-slate-600/50";
    }
  };

  const calculateProgress = (pick: Pick) => {
    if (pick.status === "not_started") return 0;

    if (pick.betDirection === "over") {
      // For "over" bets: calculate progress on extended scale (target = 76.92% of bar, giving 30% buffer)
      const extendedScale = pick.target * 1.3; // 30% more than target
      const progress = (pick.currentValue / extendedScale) * 100;
      return Math.min(100, progress);
    } else {
      // For "under" bets: invert the logic - progress fills as currentValue stays BELOW target
      const extendedScale = pick.target * 1.3; // 30% more than target for scale
      const targetPosition = (pick.target / extendedScale) * 100; // Where target line is (76.92%)

      if (pick.currentValue <= pick.target) {
        // Winning scenario: fill from 0 to target position based on how far below target we are
        const distanceFromTarget = pick.target - pick.currentValue;
        const maxDistance = pick.target; // Maximum distance would be staying at 0
        const progress = Math.min(
          targetPosition,
          (distanceFromTarget / maxDistance) * targetPosition
        );
        return progress;
      } else {
        // Losing scenario: show progress beyond target line
        const excessValue = pick.currentValue - pick.target;
        const maxExcess = extendedScale - pick.target;
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

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Lobby Live Picks 🎯
            </h2>
            <p className="text-slate-400">
              Check out what other players are betting on right now
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>
              {lobbyPlayers.filter((p) => p.isOnline).length}/6 online
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {lobbyPlayers.map((player) => (
          <div key={player.id} className="space-y-4">
            {/* Player Header */}
            <div
              className={`bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer ${
                isPlayerExpanded(player.id)
                  ? "border-[#00CED1]"
                  : "hover:border-slate-600"
              }`}
              onClick={() => togglePlayer(player.id)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-2xl shadow-xl">
                        {player.avatar}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                          player.isOnline ? "bg-emerald-400" : "bg-slate-500"
                        }`}
                      ></div>
                    </div>
                    <div>
                      <h3
                        className={`text-white font-bold text-lg leading-tight ${
                          player.name === "Carlos Rodriguez"
                            ? "sm:truncate sm:max-w-[120px]"
                            : ""
                        }`}
                      >
                        {player.name}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {player.picks.length} pick
                        {player.picks.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm text-slate-300">
                        {player.picks.filter((p) => p.status === "won").length}
                        W-
                        {player.picks.filter((p) => p.status === "lost").length}
                        L
                      </div>
                      <div className="text-xs text-slate-500">
                        {
                          player.picks.filter((p) => p.status === "active")
                            .length
                        }{" "}
                        active
                      </div>
                    </div>
                    <div
                      className={`transform transition-transform duration-300 text-slate-400 ${
                        isPlayerExpanded(player.id) ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </div>
                  </div>
                </div>

                {/* Quick Progress Overview */}
                <div className="mt-3">
                  <TriColorProgressBar
                    totalBets={player.picks.length}
                    wonBets={
                      player.picks.filter((p) => p.status === "won").length
                    }
                    activeBets={
                      player.picks.filter((p) => p.status === "active").length
                    }
                    lostBets={
                      player.picks.filter((p) => p.status === "lost").length
                    }
                  />
                </div>
              </div>
            </div>

            {/* Expanded Picks List - Single Component */}
            {isPlayerExpanded(player.id) && (
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                <div className="p-4 border-b border-slate-700/50">
                  <h4 className="text-white font-bold text-lg">
                    {player.name}'s Live Picks
                  </h4>
                  <p className="text-slate-400 text-sm">
                    {player.picks.length} active bet
                    {player.picks.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="divide-y divide-slate-700/50">
                  {player.picks.map((pick) => (
                    <div
                      key={pick.id}
                      className="p-4 hover:bg-slate-700/20 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-lg">
                            {pick.athleteImage}
                          </div>
                          <div>
                            <h5 className="text-white font-semibold text-sm leading-tight">
                              {pick.player}
                            </h5>
                            <p className="text-slate-400 text-xs">
                              {pick.sport} • {pick.gameTime}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`px-2 py-1 rounded-lg border text-xs font-medium ${getStatusColor(pick.status)}`}
                        >
                          {getStatusIcon(pick.status)}{" "}
                          {pick.status.replace("_", " ").toUpperCase()}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-300">
                            {pick.betType} {pick.betDirection} {pick.target}
                          </span>
                          <span className="text-white font-semibold">
                            {pick.currentValue}
                          </span>
                        </div>

                        {/* Enhanced Progress Bar with Target Line */}
                        <div className="relative">
                          <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ${
                                pick.status === "won"
                                  ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                  : pick.status === "lost"
                                    ? "bg-gradient-to-r from-red-600 to-red-400"
                                    : pick.status === "active"
                                      ? "bg-gradient-to-r from-blue-400 to-blue-500"
                                      : "bg-slate-600"
                              }`}
                              style={{
                                width: `${calculateProgress(pick)}%`,
                              }}
                            />
                          </div>

                          {/* Target threshold line */}
                          {pick.status !== "not_started" && (
                            <>
                              <div
                                className="absolute w-0.5 bg-white/80 shadow-lg"
                                style={{
                                  left: `${getTargetThresholdPosition()}%`,
                                  top: "-1px",
                                  height: "10px", // Extends above and below the bar
                                }}
                              />

                              {/* Target label */}
                              <div
                                className="absolute -top-6 text-xs text-slate-300 font-medium transform -translate-x-1/2 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-600/50"
                                style={{
                                  left: `${getTargetThresholdPosition()}%`,
                                }}
                              >
                                {pick.target}
                              </div>
                            </>
                          )}
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
  );
}
