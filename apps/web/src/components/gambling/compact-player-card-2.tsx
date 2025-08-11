"use client";

import { useState } from "react";

export default function CompactPlayerCard2() {
  const players = [
    {
      id: 1,
      name: "Patrick Mahomes",
      team: "KC",
      position: "QB",
      status: "probable",
      avatar: "PM",
      matchup: "vs BUF",
      stats: [
        {
          type: "Passing Yards",
          line: 285.5,
          icon: "🏈",
        },
        {
          type: "Passing TDs",
          line: 2.5,
          icon: "🎯",
        },
        {
          type: "Completions",
          line: 24.5,
          icon: "✅",
        },
        {
          type: "Interceptions",
          line: 0.5,
          icon: "❌",
        },
      ],
    },
    {
      id: 2,
      name: "Josh Allen",
      team: "BUF",
      position: "QB",
      status: "confirmed",
      avatar: "JA",
      matchup: "@ KC",
      stats: [
        {
          type: "Passing Yards",
          line: 275.5,
          icon: "🏈",
        },
        {
          type: "Rushing Yards",
          line: 45.5,
          icon: "🏃",
        },
        {
          type: "Total TDs",
          line: 2.5,
          icon: "🎯",
        },
        {
          type: "Completions",
          line: 22.5,
          icon: "✅",
        },
      ],
    },
    {
      id: 3,
      name: "Cooper Kupp",
      team: "LAR",
      position: "WR",
      status: "questionable",
      avatar: "CK",
      matchup: "vs SEA",
      stats: [
        {
          type: "Receiving Yards",
          line: 95.5,
          icon: "🙌",
        },
        {
          type: "Receptions",
          line: 7.5,
          icon: "🤝",
        },
        {
          type: "Receiving TDs",
          line: 0.5,
          icon: "🎯",
        },
        {
          type: "Longest Reception",
          line: 28.5,
          icon: "📏",
        },
      ],
    },
    {
      id: 4,
      name: "Derrick Henry",
      team: "TEN",
      position: "RB",
      status: "confirmed",
      avatar: "DH",
      matchup: "@ JAX",
      stats: [
        {
          type: "Rushing Yards",
          line: 125.5,
          icon: "🏃",
        },
        {
          type: "Rushing TDs",
          line: 1.5,
          icon: "🎯",
        },
        {
          type: "Carries",
          line: 22.5,
          icon: "⚡",
        },
        {
          type: "Receiving Yards",
          line: 15.5,
          icon: "🙌",
        },
      ],
    },
    {
      id: 5,
      name: "Travis Kelce",
      team: "KC",
      position: "TE",
      status: "probable",
      avatar: "TK",
      matchup: "vs BUF",
      stats: [
        {
          type: "Receiving Yards",
          line: 75.5,
          icon: "🙌",
        },
        {
          type: "Receptions",
          line: 6.5,
          icon: "🤝",
        },
        {
          type: "Receiving TDs",
          line: 0.5,
          icon: "🎯",
        },
        {
          type: "Targets",
          line: 8.5,
          icon: "🎪",
        },
      ],
    },
    {
      id: 6,
      name: "Ja'Marr Chase",
      team: "CIN",
      position: "WR",
      status: "confirmed",
      avatar: "JC",
      matchup: "vs PIT",
      stats: [
        {
          type: "Receiving Yards",
          line: 88.5,
          icon: "🙌",
        },
        {
          type: "Receptions",
          line: 6.5,
          icon: "🤝",
        },
        {
          type: "Receiving TDs",
          line: 0.5,
          icon: "🎯",
        },
        {
          type: "Longest Reception",
          line: 32.5,
          icon: "📏",
        },
      ],
    },
  ];

  const [currentStatIndex, setCurrentStatIndex] = useState<{
    [key: number]: number;
  }>({});

  const getPositionColor = (position: string) => {
    switch (position) {
      case "QB":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400";
      case "RB":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400";
      case "WR":
        return "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400";
      case "TE":
        return "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400";
      default:
        return "from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-400";
    }
  };

  const nextStat = (playerId: number, stats: any[]) => {
    const current = currentStatIndex[playerId] || 0;
    const next = (current + 1) % stats.length;
    setCurrentStatIndex((prev) => ({ ...prev, [playerId]: next }));
  };

  const prevStat = (playerId: number, stats: any[]) => {
    const current = currentStatIndex[playerId] || 0;
    const prevIndex = current === 0 ? stats.length - 1 : current - 1;
    setCurrentStatIndex((prev) => ({ ...prev, [playerId]: prevIndex }));
  };

  const handleTouchStart = (e: React.TouchEvent, playerId: number) => {
    const touch = e.touches[0];
    (e.target as any).startX = touch.clientX;
  };

  const handleTouchEnd = (
    e: React.TouchEvent,
    playerId: number,
    stats: any[]
  ) => {
    const touch = e.changedTouches[0];
    const startX = (e.target as any).startX;
    const endX = touch.clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      // Minimum swipe distance
      if (diff > 0) {
        nextStat(playerId, stats);
      } else {
        prevStat(playerId, stats);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {players.map((player) => {
        const currentIndex = currentStatIndex[player.id] || 0;
        const currentStat = player.stats[currentIndex];

        return (
          <div
            key={player.id}
            className="group relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-slate-600/60 overflow-hidden"
          >
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00CED1]/3 via-transparent to-[#FFAB91]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 p-5">
              {/* Header Section */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3">
                  {/* Player Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg tracking-tight">
                        {player.avatar}
                      </span>
                    </div>
                    <div
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 ${
                        player.status === "confirmed"
                          ? "bg-emerald-500"
                          : player.status === "probable"
                            ? "bg-yellow-500"
                            : "bg-orange-500"
                      }`}
                    ></div>
                  </div>

                  {/* Player Details */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-bold text-lg mb-1 truncate">
                      {player.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-300 font-semibold text-sm">
                        {player.team}
                      </span>
                      <div
                        className={`px-2 py-1 bg-gradient-to-r ${getPositionColor(
                          player.position
                        )} border rounded text-xs font-bold`}
                      >
                        {player.position}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Matchup */}
                <div className="text-slate-400 font-medium text-sm">
                  {player.matchup}
                </div>
              </div>

              {/* Horizontal Layout with Stats and Buttons */}
              <div className="flex items-center gap-4">
                {/* Improved Stats Section */}
                <div
                  className="flex-1 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5 cursor-pointer touch-pan-y"
                  onTouchStart={(e) => handleTouchStart(e, player.id)}
                  onTouchEnd={(e) => handleTouchEnd(e, player.id, player.stats)}
                >
                  {/* Stat Navigation Header */}
                  <div className="flex flex-col mb-3">
                    <div className="text-slate-200 font-bold text-base mb-3 tracking-wide text-center">
                      {currentStat.type}
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => prevStat(player.id, player.stats)}
                        className="w-8 h-8 bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-[#00CED1]/30 hover:to-[#00CED1]/20 rounded-lg flex items-center justify-center transition-all duration-300 border border-slate-600/40 hover:border-[#00CED1]/50"
                      >
                        <svg
                          className="w-4 h-4 text-slate-300 hover:text-[#00CED1] transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      <div className="text-[#00CED1] font-black text-3xl tracking-tight drop-shadow-lg">
                        {currentStat.line}
                      </div>

                      <button
                        onClick={() => nextStat(player.id, player.stats)}
                        className="w-8 h-8 bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-[#00CED1]/30 hover:to-[#00CED1]/20 rounded-lg flex items-center justify-center transition-all duration-300 border border-slate-600/40 hover:border-[#00CED1]/50"
                      >
                        <svg
                          className="w-4 h-4 text-slate-300 hover:text-[#00CED1] transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Progress Indicators */}
                  <div className="flex justify-center space-x-2">
                    {player.stats.map((_, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setCurrentStatIndex((prev) => ({
                            ...prev,
                            [player.id]: index,
                          }))
                        }
                        className={`transition-all duration-500 rounded-full ${
                          index === currentIndex
                            ? "w-6 h-1.5 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] shadow-lg shadow-[#00CED1]/30"
                            : "w-1.5 h-1.5 bg-slate-600/60 hover:bg-slate-500/80 hover:scale-150 shadow-md"
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>

                {/* Over/Under Buttons on Right (Vertical Stack) */}
                <div className="flex flex-col space-y-3 min-w-[120px] flex-shrink-0 h-full">
                  <button className="bg-gradient-to-r from-emerald-500/25 to-emerald-600/15 border-2 border-emerald-400/40 rounded-xl py-5 px-7 hover:from-emerald-500/35 hover:to-emerald-600/25 hover:border-emerald-400/60 transition-all duration-300 group shadow-lg hover:shadow-emerald-500/20 flex-1">
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-7 h-7 text-emerald-400 group-hover:scale-125 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                    </div>
                  </button>

                  <button className="bg-gradient-to-r from-red-500/25 to-red-600/15 border-2 border-red-400/40 rounded-xl py-5 px-7 hover:from-red-500/35 hover:to-red-600/25 hover:border-red-400/60 transition-all duration-300 group shadow-lg hover:shadow-red-500/20 flex-1">
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-7 h-7 text-red-400 group-hover:scale-125 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
