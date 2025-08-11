"use client";

import { useState } from "react";

export default function CategoryTabs() {
  const [activeTab, setActiveTab] = useState("popular");
  const tabs = [
    {
      id: "popular",
      name: "Popular",
      icon: "🔥",
      gradient: "from-red-500/20 to-orange-500/20",
    },
    {
      id: "passing",
      name: "Passing",
      icon: "🏈",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: "rushing",
      name: "Rushing",
      icon: "🏃",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      id: "receiving",
      name: "Receiving",
      icon: "🙌",
      gradient: "from-yellow-500/20 to-amber-500/20",
    },
    {
      id: "scoring",
      name: "Scoring",
      icon: "🎯",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: "defense",
      name: "Defense",
      icon: "🛡️",
      gradient: "from-indigo-500/20 to-purple-500/20",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-[#FFAB91] to-[#00CED1] rounded-full blur-2xl"></div>
      </div>{" "}
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1]/20 to-[#FFAB91]/20 rounded-xl flex items-center justify-center mr-3 border border-[#00CED1]/30">
            <svg
              className="w-6 h-6 text-[#00CED1]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>{" "}
          Stat Categories
        </h3>
        <div className="flex items-center space-x-3">
          <div className="bg-[#FFAB91]/20 border border-[#FFAB91]/30 rounded-full px-4 py-2 flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#FFAB91] rounded-full animate-pulse"></div>
            <span className="text-[#FFAB91] font-semibold text-sm">
              6 Categories
            </span>
          </div>
          <button className="group p-2 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300">
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>{" "}
      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 relative z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group relative flex items-center space-x-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all duration-300 hover:scale-105 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg shadow-[#00CED1]/30 border border-[#00CED1]/30"
                : "bg-white/5 backdrop-blur-sm text-slate-300 hover:text-white border border-white/20 hover:border-white/40 hover:bg-white/10"
            }`}
          >
            {/* Background glow for active tab */}
            {activeTab === tab.id && (
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.gradient} blur-sm opacity-30`}
              ></div>
            )}

            <div className="relative z-10 flex items-center space-x-2">
              <span
                className={`text-lg transition-transform duration-300 ${
                  activeTab === tab.id ? "scale-105" : "group-hover:scale-105"
                }`}
              >
                {tab.icon}
              </span>
              <span className="font-semibold text-sm">{tab.name}</span>
              {activeTab === tab.id && (
                <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center ml-1">
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
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="min-h-[300px] relative z-10">
        {" "}
        {activeTab === "popular" && (
          <div className="space-y-4">
            <div className="group flex items-center justify-between p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/10 hover:border-white/30 hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                  <span className="text-2xl">🏈</span>
                </div>
                <div>
                  <div className="text-white font-bold text-lg mb-1">
                    Patrick Mahomes - Passing Yards
                  </div>
                  <div className="text-slate-400 text-sm flex items-center space-x-2">
                    <span>KC Chiefs</span>
                    <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                    <span>vs BUF</span>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-2"></div>
                    <span className="text-emerald-400 font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="group/btn relative px-4 py-2 bg-gradient-to-br from-[#00CED1]/20 to-[#00CED1]/10 border border-[#00CED1]/30 rounded-xl text-[#00CED1] font-bold hover:bg-[#00CED1] hover:text-white transition-all duration-300 hover:scale-105">
                  <div className="relative z-10">HIGHER 285.5</div>
                </button>
                <button className="group/btn relative px-4 py-2 bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105">
                  <div className="relative z-10">LOWER 285.5</div>
                </button>
              </div>
            </div>

            <div className="group flex items-center justify-between p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/10 hover:border-white/30 hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                  <span className="text-2xl">🏃</span>
                </div>
                <div>
                  <div className="text-white font-bold text-lg mb-1">
                    Josh Allen - Rushing Yards
                  </div>
                  <div className="text-slate-400 text-sm flex items-center space-x-2">
                    <span>BUF Bills</span>
                    <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                    <span>vs KC</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="group/btn relative px-4 py-2 bg-gradient-to-br from-[#00CED1]/20 to-[#00CED1]/10 border border-[#00CED1]/30 rounded-xl text-[#00CED1] font-bold hover:bg-[#00CED1] hover:text-white transition-all duration-300 hover:scale-105">
                  <div className="relative z-10">HIGHER 45.5</div>
                </button>
                <button className="group/btn relative px-4 py-2 bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105">
                  <div className="relative z-10">LOWER 45.5</div>
                </button>
              </div>
            </div>
          </div>
        )}{" "}
        {activeTab === "passing" && (
          <div className="space-y-4">
            <div className="text-center text-slate-300 py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                <span className="text-4xl">🏈</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">
                Passing Stats
              </h4>
              <p className="text-slate-400 max-w-md mx-auto">
                Predict quarterback passing performance. Choose HIGHER or LOWER
                on yards, completions, and touchdowns.
              </p>
              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl text-blue-400 font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300">
                View All Passing Stats
              </button>
            </div>
          </div>
        )}{" "}
        {activeTab === "rushing" && (
          <div className="space-y-4">
            <div className="text-center text-slate-300 py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <span className="text-4xl">🏃</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">
                Rushing Stats
              </h4>
              <p className="text-slate-400 max-w-md mx-auto">
                Predict running back and quarterback rushing performance. Choose
                HIGHER or LOWER on yards and attempts.
              </p>
              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl text-green-400 font-semibold hover:bg-green-500 hover:text-white transition-all duration-300">
                View All Rushing Stats
              </button>
            </div>
          </div>
        )}{" "}
        {activeTab === "receiving" && (
          <div className="space-y-4">
            <div className="text-center text-slate-300 py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-yellow-500/30">
                <span className="text-4xl">🙌</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">
                Receiving Stats
              </h4>
              <p className="text-slate-400 max-w-md mx-auto">
                Predict wide receiver and tight end performance. Choose HIGHER
                or LOWER on yards, catches, and targets.
              </p>
              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl text-yellow-400 font-semibold hover:bg-yellow-500 hover:text-white transition-all duration-300">
                View Receiving Stats
              </button>
            </div>
          </div>
        )}{" "}
        {activeTab === "scoring" && (
          <div className="space-y-4">
            <div className="text-center text-slate-300 py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                <span className="text-4xl">🎯</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">
                Scoring Stats
              </h4>
              <p className="text-slate-400 max-w-md mx-auto">
                Predict scoring performance. Choose HIGHER or LOWER on
                touchdowns, field goals, and extra points.
              </p>
              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-purple-400 font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300">
                View Scoring Stats
              </button>
            </div>
          </div>
        )}
        {activeTab === "defense" && (
          <div className="space-y-4">
            <div className="text-center text-slate-300 py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
                <span className="text-4xl">🛡️</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">
                Defense Stats
              </h4>
              <p className="text-slate-400 max-w-md mx-auto">
                Predict defensive performance. Choose HIGHER or LOWER on
                tackles, sacks, interceptions, and fumbles.
              </p>
              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl text-indigo-400 font-semibold hover:bg-indigo-500 hover:text-white transition-all duration-300">
                View Defense Stats
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
