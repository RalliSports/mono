"use client";

import { useState, useEffect } from "react";

interface BetProgress {
  id: number;
  player: string;
  sport: string;
  emoji: string;
  betType: string;
  target: number;
  currentValue: number;
  betDirection: "over" | "under";
  odds: string;
  stake: number;
  potential: number;
  status: "active" | "won" | "lost";
  gameTime: string;
  lastUpdate: string;
}

export default function DynamicBetProgress() {
  const [bets, setBets] = useState<BetProgress[]>([
    {
      id: 1,
      player: "Luka Dončić",
      sport: "NBA",
      emoji: "🏀",
      betType: "Points",
      target: 28.5,
      currentValue: 24.0,
      betDirection: "over",
      odds: "+110",
      stake: 150,
      potential: 315,
      status: "active",
      gameTime: "Q3 8:42",
      lastUpdate: "2s ago",
    },
    {
      id: 2,
      player: "Travis Kelce",
      sport: "NFL",
      emoji: "🏈",
      betType: "Receiving Yards",
      target: 75.5,
      currentValue: 68.0,
      betDirection: "over",
      odds: "-120",
      stake: 200,
      potential: 367,
      status: "active",
      gameTime: "Q2 6:15",
      lastUpdate: "5s ago",
    },
    {
      id: 3,
      player: "Connor McDavid",
      sport: "NHL",
      emoji: "🏒",
      betType: "Points",
      target: 1.5,
      currentValue: 2.0,
      betDirection: "over",
      odds: "+125",
      stake: 100,
      potential: 225,
      status: "won",
      gameTime: "Final",
      lastUpdate: "2m ago",
    },
    {
      id: 4,
      player: "Giannis Antetokounmpo",
      sport: "NBA",
      emoji: "🏀",
      betType: "Rebounds",
      target: 11.5,
      currentValue: 7.0,
      betDirection: "over",
      odds: "-110",
      stake: 120,
      potential: 229,
      status: "active",
      gameTime: "Q4 2:15",
      lastUpdate: "8s ago",
    },
  ]);

  // Simple live updates for active bets
  useEffect(() => {
    const interval = setInterval(() => {
      setBets((prev) =>
        prev.map((bet) => {
          if (bet.status === "active") {
            // Randomly update current value
            const change = (Math.random() - 0.5) * 2; // -1 to +1
            let newValue = Math.max(0, bet.currentValue + change);

            // Check if bet should be completed
            let newStatus: "active" | "won" | "lost" = bet.status;
            if (bet.betDirection === "over" && newValue > bet.target + 2) {
              newStatus = "won";
            } else if (
              bet.betDirection === "under" &&
              newValue < bet.target - 2
            ) {
              newStatus = "won";
            }

            return {
              ...bet,
              currentValue: Number(newValue.toFixed(1)),
              status: newStatus,
              lastUpdate: `${Math.floor(Math.random() * 10)}s ago`,
            };
          }
          return bet;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const simulateWin = (betId: number) => {
    setBets((prev) =>
      prev.map((bet) => {
        if (bet.id === betId && bet.status === "active") {
          const winningValue =
            bet.betDirection === "over"
              ? bet.target + Math.random() * 5 + 1
              : bet.target - Math.random() * 3 - 1;
          return {
            ...bet,
            currentValue: Number(winningValue.toFixed(1)),
            status: "won",
            lastUpdate: "now",
          };
        }
        return bet;
      })
    );
  };

  const simulateLoss = (betId: number) => {
    setBets((prev) =>
      prev.map((bet) => {
        if (bet.id === betId && bet.status === "active") {
          const losingValue =
            bet.betDirection === "over"
              ? bet.target - Math.random() * 3 - 1
              : bet.target + Math.random() * 5 + 1;
          return {
            ...bet,
            currentValue: Number(Math.max(0, losingValue).toFixed(1)),
            status: "lost",
            lastUpdate: "now",
          };
        }
        return bet;
      })
    );
  };

  const resetBet = (betId: number) => {
    setBets((prev) =>
      prev.map((bet) => {
        if (bet.id === betId) {
          return {
            ...bet,
            currentValue: bet.target * 0.7, // Reset to 70% of target
            status: "active",
            lastUpdate: "now",
          };
        }
        return bet;
      })
    );
  };

  const getProgressPercentage = (bet: BetProgress) => {
    if (bet.betDirection === "over") {
      // For over bets, progress is how close we are to the target
      const maxValue = bet.target * 2; // Assume max is 2x the target
      return Math.min(100, (bet.currentValue / maxValue) * 100);
    } else {
      // For under bets, progress is inverse
      const maxValue = bet.target * 2;
      return Math.min(100, ((maxValue - bet.currentValue) / maxValue) * 100);
    }
  };

  const getTargetPosition = (bet: BetProgress) => {
    // Target position as percentage of the progress bar
    const maxValue = bet.target * 2;
    return (bet.target / maxValue) * 100;
  };

  const getWinningZone = (bet: BetProgress) => {
    const targetPos = getTargetPosition(bet);
    if (bet.betDirection === "over") {
      return { left: targetPos, width: 100 - targetPos };
    } else {
      return { left: 0, width: targetPos };
    }
  };

  const getBetStatus = (bet: BetProgress) => {
    if (bet.status !== "active") return bet.status;

    if (bet.betDirection === "over") {
      return bet.currentValue >= bet.target ? "winning" : "trailing";
    } else {
      return bet.currentValue <= bet.target ? "winning" : "trailing";
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-[#FFAB91] to-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-purple-500 to-[#00CED1] rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Live Bet{" "}
            <span className="bg-gradient-to-r from-[#00CED1] via-purple-400 to-[#FFAB91] bg-clip-text text-transparent">
              Progress
            </span>
          </h2>
          <p className="text-slate-300 text-lg">
            Real-time tracking of individual picks with dynamic progress
            visualization
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-emerald-400 font-semibold">Live Updates</span>
        </div>
      </div>

      {/* Bets Grid */}
      <div className="space-y-8 relative z-10">
        {bets.map((bet) => {
          const betStatus = getBetStatus(bet);
          const targetPos = getTargetPosition(bet);
          const winningZone = getWinningZone(bet);

          return (
            <div
              key={bet.id}
              className={`p-8 rounded-3xl border transition-all duration-500 group ${
                bet.status === "won"
                  ? "bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/30"
                  : bet.status === "lost"
                    ? "bg-gradient-to-r from-red-500/10 to-red-500/5 border-red-500/30"
                    : betStatus === "winning"
                      ? "bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/30"
                      : "bg-gradient-to-r from-red-500/10 to-red-500/5 border-red-500/30"
              }`}
            >
              {/* Bet Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center text-3xl">
                    {bet.emoji}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {bet.player}
                    </h3>
                    <p className="text-slate-300 text-lg">
                      {bet.betType} {bet.betDirection} {bet.target}
                    </p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="px-3 py-1 bg-slate-700/50 rounded-full text-slate-300 text-sm">
                        {bet.sport}
                      </span>
                      <span className="px-3 py-1 bg-slate-700/50 rounded-full text-slate-300 text-sm">
                        {bet.odds}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          bet.status === "active"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : bet.status === "won"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {bet.status === "active"
                          ? "LIVE"
                          : bet.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white mb-1">
                    {bet.currentValue}
                  </div>
                  <div className="text-slate-400 text-sm">{bet.gameTime}</div>
                  <div className="text-slate-500 text-xs mt-1">
                    {bet.lastUpdate}
                  </div>
                </div>
              </div>

              {/* Multi-Level Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-400 text-sm">
                    Progress to Target ({bet.target})
                  </span>
                  <span className="text-slate-300 text-sm font-semibold">
                    ${bet.stake} → ${bet.potential}
                  </span>
                </div>

                {/* Progress Container */}
                <div className="relative h-8 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/30">
                  {/* Winning Zone Background */}
                  <div
                    className={`absolute top-0 h-full transition-all duration-1000 ${
                      bet.betDirection === "over"
                        ? "bg-emerald-500/20"
                        : "bg-emerald-500/20"
                    }`}
                    style={{
                      left: `${winningZone.left}%`,
                      width: `${winningZone.width}%`,
                    }}
                  />

                  {/* Target Line */}
                  <div
                    className="absolute top-0 w-1 h-full bg-white/80 z-20"
                    style={{ left: `${targetPos}%` }}
                  />

                  {/* Current Progress Bar */}
                  <div
                    className={`absolute top-0 h-full transition-all duration-1000 ${
                      bet.status === "won"
                        ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                        : bet.status === "lost"
                          ? "bg-gradient-to-r from-red-400 to-red-600"
                          : betStatus === "winning"
                            ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                            : "bg-gradient-to-r from-red-400 to-red-600"
                    }`}
                    style={{
                      width: `${Math.min(100, (bet.currentValue / (bet.target * 2)) * 100)}%`,
                    }}
                  />

                  {/* Progress Text Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-sm z-30">
                      {bet.currentValue} / {bet.target}
                    </span>
                  </div>
                </div>

                {/* Progress Labels */}
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-slate-500">0</span>
                  <span className="text-white font-bold">{bet.target}</span>
                  <span className="text-slate-500">{bet.target * 2}</span>
                </div>
              </div>

              {/* Action Buttons for Active Bets */}
              {bet.status === "active" && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => simulateWin(bet.id)}
                    className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/30 transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>✅</span>
                    <span>Simulate Win</span>
                  </button>
                  <button
                    onClick={() => simulateLoss(bet.id)}
                    className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 font-semibold rounded-xl hover:bg-red-500/30 transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>❌</span>
                    <span>Simulate Loss</span>
                  </button>
                  <button
                    onClick={() => resetBet(bet.id)}
                    className="px-6 py-3 bg-slate-700/50 border border-slate-600/30 text-slate-300 font-semibold rounded-xl hover:bg-slate-600/50 transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>🔄</span>
                    <span>Reset</span>
                  </button>
                </div>
              )}

              {/* Completed Bet Info */}
              {bet.status !== "active" && (
                <div className="flex items-center justify-between">
                  <div
                    className={`text-lg font-bold ${
                      bet.status === "won" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {bet.status === "won"
                      ? `+$${bet.potential - bet.stake}`
                      : `-$${bet.stake}`}
                  </div>
                  <button
                    onClick={() => resetBet(bet.id)}
                    className="px-4 py-2 bg-slate-700/50 border border-slate-600/30 text-slate-400 text-sm font-semibold rounded-lg hover:bg-slate-600/50 transition-all duration-300"
                  >
                    Reset for Demo
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Enhanced Legend */}
      <div className="mt-10 p-8 bg-slate-800/30 rounded-2xl border border-slate-700/30 relative z-10">
        <h4 className="text-white font-semibold mb-6 text-lg">
          Progress System
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-lg shadow-lg"></div>
            <div>
              <div className="text-slate-300 font-semibold">
                Winning Progress
              </div>
              <div className="text-slate-500 text-xs">
                On track to hit target
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-red-600 rounded-lg shadow-lg"></div>
            <div>
              <div className="text-slate-300 font-semibold">
                Losing Progress
              </div>
              <div className="text-slate-500 text-xs">Behind target pace</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-6 bg-white/80 rounded-full shadow-lg"></div>
            <div>
              <div className="text-slate-300 font-semibold">Target Line</div>
              <div className="text-slate-500 text-xs">Goal to reach</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-emerald-500/20 rounded-lg shadow-lg"></div>
            <div>
              <div className="text-slate-300 font-semibold">Winning Zone</div>
              <div className="text-slate-500 text-xs">Target area</div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/20">
          <div className="text-slate-300 text-sm">
            <span className="font-semibold text-[#00CED1]">How it works:</span>{" "}
            The white line shows your target. Green areas indicate winning
            zones, progress bars show current value relative to the target.
          </div>
        </div>
      </div>
    </div>
  );
}
