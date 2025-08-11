"use client";

import { useState } from "react";

export default function LeaderboardComponent() {
  const [activeTab, setActiveTab] = useState("wins");

  const leaderboardData = {
    wins: [
      {
        id: 1,
        rank: 1,
        name: "Alex Chen",
        username: "@alexc",
        wins: 247,
        avatar: "AC",
        change: "up",
        streak: 12,
      },
      {
        id: 2,
        rank: 2,
        name: "Sarah Johnson",
        username: "@sarahj",
        wins: 235,
        avatar: "SJ",
        change: "down",
        streak: 5,
      },
      {
        id: 3,
        rank: 3,
        name: "Mike Rodriguez",
        username: "@mikerod",
        wins: 228,
        avatar: "MR",
        change: "up",
        streak: 8,
      },
      {
        id: 4,
        rank: 4,
        name: "Emma Davis",
        username: "@emmad",
        wins: 221,
        avatar: "ED",
        change: "stable",
        streak: 3,
      },
      {
        id: 5,
        rank: 5,
        name: "James Wilson",
        username: "@jameswil",
        wins: 218,
        avatar: "JW",
        change: "up",
        streak: 15,
      },
      {
        id: 6,
        rank: 6,
        name: "Lisa Anderson",
        username: "@lisaa",
        wins: 212,
        avatar: "LA",
        change: "down",
        streak: 2,
      },
      {
        id: 7,
        rank: 7,
        name: "Tom Garcia",
        username: "@tomgar",
        wins: 208,
        avatar: "TG",
        change: "up",
        streak: 7,
      },
      {
        id: 8,
        rank: 8,
        name: "Jenny Lee",
        username: "@jennyl",
        wins: 205,
        avatar: "JL",
        change: "stable",
        streak: 4,
      },
    ],
    roi: [
      {
        id: 1,
        rank: 1,
        name: "David Kim",
        username: "@davidk",
        roi: 47.8,
        avatar: "DK",
        change: "up",
        profit: 12450,
      },
      {
        id: 2,
        rank: 2,
        name: "Rachel Green",
        username: "@rachelg",
        roi: 42.3,
        avatar: "RG",
        change: "up",
        profit: 9870,
      },
      {
        id: 3,
        rank: 3,
        name: "Mark Thompson",
        username: "@markt",
        roi: 38.9,
        avatar: "MT",
        change: "down",
        profit: 8920,
      },
      {
        id: 4,
        rank: 4,
        name: "Nicole Brown",
        username: "@nicoleb",
        roi: 35.7,
        avatar: "NB",
        change: "stable",
        profit: 7650,
      },
      {
        id: 5,
        rank: 5,
        name: "Chris Martinez",
        username: "@chrism",
        roi: 33.2,
        avatar: "CM",
        change: "up",
        profit: 6840,
      },
      {
        id: 6,
        rank: 6,
        name: "Amy Taylor",
        username: "@amyt",
        roi: 31.8,
        avatar: "AT",
        change: "down",
        profit: 6230,
      },
      {
        id: 7,
        rank: 7,
        name: "Steve Miller",
        username: "@stevem",
        roi: 29.4,
        avatar: "SM",
        change: "up",
        profit: 5780,
      },
      {
        id: 8,
        rank: 8,
        name: "Kelly White",
        username: "@kellyw",
        roi: 27.9,
        avatar: "KW",
        change: "stable",
        profit: 5320,
      },
    ],
    points: [
      {
        id: 1,
        rank: 1,
        name: "Ryan Cooper",
        username: "@ryanc",
        points: 15847,
        avatar: "RC",
        change: "up",
        level: 87,
      },
      {
        id: 2,
        rank: 2,
        name: "Monica Ross",
        username: "@monicar",
        points: 14962,
        avatar: "MR",
        change: "stable",
        level: 84,
      },
      {
        id: 3,
        rank: 3,
        name: "Tyler Evans",
        username: "@tylere",
        points: 14235,
        avatar: "TE",
        change: "down",
        level: 82,
      },
      {
        id: 4,
        rank: 4,
        name: "Hannah Clark",
        username: "@hannahc",
        points: 13578,
        avatar: "HC",
        change: "up",
        level: 79,
      },
      {
        id: 5,
        rank: 5,
        name: "Jordan Scott",
        username: "@jordans",
        points: 13124,
        avatar: "JS",
        change: "up",
        level: 77,
      },
      {
        id: 6,
        rank: 6,
        name: "Megan Hall",
        username: "@meganh",
        points: 12689,
        avatar: "MH",
        change: "down",
        level: 75,
      },
      {
        id: 7,
        rank: 7,
        name: "Brandon King",
        username: "@brandonk",
        points: 12234,
        avatar: "BK",
        change: "stable",
        level: 73,
      },
      {
        id: 8,
        rank: 8,
        name: "Tiffany Adams",
        username: "@tiffanya",
        points: 11892,
        avatar: "TA",
        change: "up",
        level: 71,
      },
    ],
  };

  const tabs = [
    { id: "wins", name: "Most Wins", icon: "🏆", metric: "Wins" },
    { id: "roi", name: "Best ROI", icon: "📈", metric: "ROI %" },
    { id: "points", name: "Top Points", icon: "⭐", metric: "Points" },
  ];

  const getChangeIcon = (change: string) => {
    switch (change) {
      case "up":
        return (
          <svg
            className="w-4 h-4 text-emerald-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "down":
        return (
          <svg
            className="w-4 h-4 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 15.586l3.293-3.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return <div className="w-4 h-1 bg-slate-400 rounded"></div>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400";
      case 2:
        return "text-gray-300";
      case 3:
        return "text-amber-600";
      default:
        return "text-slate-400";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-3xl p-6 border border-slate-700 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <svg
            className="w-6 h-6 text-[#FFAB91] mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Global Leaderboard
        </h3>
        <div className="bg-gradient-to-r from-[#00CED1]/20 to-[#FFAB91]/20 border border-[#00CED1]/30 rounded-full px-3 py-1">
          <span className="text-[#00CED1] font-semibold text-sm">LIVE</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg"
                : "bg-slate-800/50 text-slate-300 hover:bg-slate-700 border border-slate-600"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="font-semibold">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3 max-h-[1580px] overflow-y-auto">
        {leaderboardData[activeTab as keyof typeof leaderboardData].map(
          (player, index) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 hover:bg-slate-800/70 ${
                player.rank <= 3
                  ? "bg-gradient-to-r from-slate-800/80 to-slate-900/80 border-slate-600 shadow-lg"
                  : "bg-slate-800/50 border-slate-700/50"
              }`}
            >
              {/* Left Side - Rank & Player */}
              <div className="flex items-center space-x-4">
                <div className="text-center min-w-[40px]">
                  <div
                    className={`text-2xl font-bold ${getRankColor(player.rank)}`}
                  >
                    {getRankIcon(player.rank)}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      player.rank <= 3
                        ? "bg-gradient-to-br from-[#00CED1] to-[#FFAB91]"
                        : "bg-gradient-to-br from-slate-600 to-slate-700"
                    }`}
                  >
                    <span className="text-white font-bold text-sm">
                      {player.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {player.name}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {player.username}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Stats & Change */}
              <div className="flex items-center space-x-4">
                {/* Additional Stat */}
                <div className="text-right hidden sm:block">
                  {activeTab === "wins" && (
                    <div>
                      <div className="text-slate-400 text-xs">Streak</div>
                      <div className="text-emerald-400 font-semibold">
                        {(player as any).streak}W
                      </div>
                    </div>
                  )}
                  {activeTab === "roi" && (
                    <div>
                      <div className="text-slate-400 text-xs">Profit</div>
                      <div className="text-emerald-400 font-semibold">
                        ${(player as any).profit.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {activeTab === "points" && (
                    <div>
                      <div className="text-slate-400 text-xs">Level</div>
                      <div className="text-violet-400 font-semibold">
                        {(player as any).level}
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Metric */}
                <div className="text-right">
                  <div className="text-white font-bold text-lg">
                    {activeTab === "wins" && (player as any).wins}
                    {activeTab === "roi" && `${(player as any).roi}%`}
                    {activeTab === "points" &&
                      (player as any).points.toLocaleString()}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {tabs.find((t) => t.id === activeTab)?.metric}
                  </div>
                </div>

                {/* Change Indicator */}
                <div className="flex items-center">
                  {getChangeIcon(player.change)}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-700/30">
        <div className="flex items-center justify-between">
          <div className="text-slate-400 text-sm">Updated every 5 minutes</div>
          <button className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-semibold px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            View Full Rankings
          </button>
        </div>
      </div>
    </div>
  );
}
