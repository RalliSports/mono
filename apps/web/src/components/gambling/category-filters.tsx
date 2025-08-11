"use client";

import { useState } from "react";

export default function CategoryFilters() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    {
      id: "all",
      name: "All Sports",
      icon: "🏆",
      count: 247,
      gradient: "from-[#00CED1]/20 to-[#FFAB91]/20",
    },
    {
      id: "nfl",
      name: "NFL",
      icon: "🏈",
      count: 64,
      gradient: "from-orange-500/20 to-red-500/20",
    },
    {
      id: "nba",
      name: "NBA",
      icon: "🏀",
      count: 89,
      gradient: "from-blue-500/20 to-purple-500/20",
    },
    {
      id: "soccer",
      name: "Soccer",
      icon: "⚽",
      count: 56,
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      id: "baseball",
      name: "MLB",
      icon: "⚾",
      count: 38,
      gradient: "from-yellow-500/20 to-orange-500/20",
    },
    {
      id: "live",
      name: "Live Now",
      icon: "🔴",
      count: 12,
      gradient: "from-red-500/20 to-pink-500/20",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#FFAB91] to-[#00CED1] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-2xl"></div>
      </div>{" "}
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FFAB91]/20 to-[#00CED1]/20 rounded-xl flex items-center justify-center mr-3 border border-[#FFAB91]/30">
            <svg
              className="w-6 h-6 text-[#FFAB91]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          Category Filters
        </h3>
        <div className="flex items-center space-x-3">
          <div className="bg-[#00CED1]/20 border border-[#00CED1]/30 rounded-full px-4 py-2 flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#00CED1] rounded-full animate-pulse"></div>
            <span className="text-[#00CED1] font-semibold text-sm">
              Updated
            </span>
          </div>
          <button className="group p-2 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300">
            <svg
              className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>{" "}
      {/* Filter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 relative z-10 mb-8">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`group relative p-5 rounded-2xl border transition-all duration-300 text-left hover:scale-105 ${
              activeFilter === filter.id
                ? `bg-gradient-to-br ${filter.gradient} border-[#00CED1]/50 shadow-xl shadow-[#00CED1]/20`
                : "bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 hover:border-white/30"
            }`}
          >
            {/* Background glow for active filter */}
            {activeFilter === filter.id && (
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${filter.gradient} opacity-50 blur-sm`}
              ></div>
            )}

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`text-3xl transition-transform duration-300 ${
                    activeFilter === filter.id
                      ? "scale-110"
                      : "group-hover:scale-105"
                  }`}
                >
                  {filter.icon}
                </div>
                {filter.id === "live" && (
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-red-400/60 rounded-full animate-pulse animation-delay-200"></div>
                  </div>
                )}
                {activeFilter === filter.id && (
                  <div className="w-8 h-8 bg-[#00CED1]/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#00CED1]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="text-white font-bold text-lg mb-2">
                {filter.name}
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-semibold ${
                    activeFilter === filter.id
                      ? "text-[#00CED1]"
                      : "text-slate-400"
                  }`}
                >
                  {filter.count} games
                </span>
                {activeFilter === filter.id && (
                  <div className="px-2 py-1 bg-[#00CED1]/20 border border-[#00CED1]/30 rounded-full">
                    <span className="text-[#00CED1] text-xs font-bold">
                      ACTIVE
                    </span>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>{" "}
      {/* Advanced Filters */}
      <div className="relative z-10">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFAB91]/5 to-[#00CED1]/5 rounded-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-white flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-[#00CED1]/20 to-[#FFAB91]/20 rounded-lg flex items-center justify-center mr-2">
                  <svg
                    className="w-4 h-4 text-[#00CED1]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                Advanced Filters
              </h4>
              <div className="text-slate-400 text-sm">4 available</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "High Odds", icon: "📈", color: "emerald" },
                { name: "Trending", icon: "🔥", color: "orange" },
                { name: "Favorites", icon: "⭐", color: "yellow" },
                { name: "Player Props", icon: "🎯", color: "purple" },
              ].map((filter, index) => (
                <button
                  key={filter.name}
                  className={`group relative p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300 text-left`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 bg-${filter.color}-500/20 rounded-lg flex items-center justify-center`}
                    >
                      <span className="text-lg">{filter.icon}</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">
                        {filter.name}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {filter.name === "High Odds"
                          ? "2.5x+ odds"
                          : filter.name === "Trending"
                            ? "Popular picks"
                            : filter.name === "Favorites"
                              ? "Your picks"
                              : "Individual stats"}
                      </div>
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-${filter.color}-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  ></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
