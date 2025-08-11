"use client";

import { useState } from "react";

export default function CompactPlayerCards() {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {players.map((player) => {
        const currentIndex = currentStatIndex[player.id] || 0;
        const currentStat = player.stats[currentIndex];

        return (
          <div
            key={player.id}
            className="group relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 shadow-xl hover:shadow-[#00CED1]/20 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-3xl"></div>
            </div>

            {/* Compact Header */}
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-xl flex items-center justify-center shadow-lg shadow-[#00CED1]/30 group-hover:scale-105 transition-transform duration-300">
                    <span className="text-white font-bold text-sm">
                      {player.avatar}
                    </span>
                  </div>
                  <div
                    className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 flex items-center justify-center ${
                      player.status === "confirmed"
                        ? "bg-emerald-500"
                        : player.status === "probable"
                          ? "bg-yellow-500"
                          : "bg-orange-500"
                    }`}
                  >
                    {player.status === "confirmed" ? (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : player.status === "probable" ? (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm truncate">
                    {player.name}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-300 font-medium text-xs">
                      {player.team}
                    </span>
                    <div
                      className={`px-2 py-0.5 bg-gradient-to-r ${getPositionColor(
                        player.position
                      )} border rounded-full text-xs font-bold`}
                    >
                      {player.position}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-slate-400 text-xs text-right">
                {player.matchup}
              </div>
            </div>

            {/* Swipeable Stat Prediction Section */}
            <div className="relative z-10 mb-4">
              <div
                className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-3 border border-slate-700/30 cursor-pointer touch-pan-y"
                onTouchStart={(e) => handleTouchStart(e, player.id)}
                onTouchEnd={(e) => handleTouchEnd(e, player.id, player.stats)}
              >
                {/* Stat Navigation */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => prevStat(player.id, player.stats)}
                    className="w-7 h-7 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 text-slate-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#00CED1]/20 to-[#FFAB91]/20 rounded-lg flex items-center justify-center">
                      <span className="text-base">{currentStat.icon}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold text-sm">
                        {currentStat.type}
                      </div>
                      <div className="text-[#00CED1] font-bold text-lg">
                        {currentStat.line}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => nextStat(player.id, player.stats)}
                    className="w-7 h-7 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 text-slate-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Stat Indicator Dots */}
                <div className="flex justify-center space-x-1 mb-3">
                  {player.stats.map((_, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setCurrentStatIndex((prev) => ({
                          ...prev,
                          [player.id]: index,
                        }))
                      }
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentIndex
                          ? "bg-[#00CED1]"
                          : "bg-slate-600 hover:bg-slate-500"
                      }`}
                    />
                  ))}
                </div>

                {/* Higher/Lower Buttons */}
                <div className="flex space-x-2">
                  <button className="group/btn flex-1 relative px-3 py-2 bg-gradient-to-br from-[#00CED1]/20 to-[#00CED1]/10 border border-[#00CED1]/30 rounded-lg text-[#00CED1] font-bold text-sm hover:bg-[#00CED1] hover:text-white transition-all duration-300 hover:scale-105">
                    <div className="relative z-10 flex items-center justify-center space-x-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>HIGHER</span>
                    </div>
                  </button>
                  <button className="group/btn flex-1 relative px-3 py-2 bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/30 rounded-lg text-red-400 font-bold text-sm hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105">
                    <div className="relative z-10 flex items-center justify-center space-x-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 15.586l3.293-3.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>LOWER</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Compact Action Button */}
            <div className="relative z-10">
              <button className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-[#00CED1]/20 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Add Player</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
