export default function PlayerDashboard() {
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-[#FFAB91] to-[#00CED1] rounded-full blur-3xl"></div>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-2xl">MK</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-1">Mike Chen</h3>
            <p className="text-slate-300 text-lg">@mikethebet</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                <span className="text-emerald-400 font-semibold text-sm">
                  PREMIUM
                </span>
              </div>
              <div className="px-3 py-1 bg-[#00CED1]/20 border border-[#00CED1]/30 rounded-full">
                <span className="text-[#00CED1] font-semibold text-sm">
                  LVL 12
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-400 text-sm">Last Active</div>
          <div className="text-white font-semibold">2 min ago</div>
          <div className="flex items-center justify-end space-x-1 mt-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 font-semibold text-sm">
              ONLINE
            </span>
          </div>
        </div>
      </div>{" "}
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-[#00CED1]/50 transition-all duration-300 group hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-[#00CED1]/20 rounded-xl flex items-center justify-center group-hover:bg-[#00CED1]/30 transition-colors">
              <svg
                className="w-6 h-6 text-[#00CED1]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div className="text-emerald-400 text-xs font-semibold">+12.4%</div>
          </div>{" "}
          <div className="text-3xl font-bold text-[#00CED1] mb-2">$5,247</div>
          <div className="text-slate-300 text-sm">Total Balance</div>
          <div className="text-slate-400 text-xs mt-1">available</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-[#FFAB91]/50 transition-all duration-300 group hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-[#FFAB91]/20 rounded-xl flex items-center justify-center group-hover:bg-[#FFAB91]/30 transition-colors">
              <svg
                className="w-6 h-6 text-[#FFAB91]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div className="text-emerald-400 text-xs font-semibold">+3.2%</div>
          </div>
          <div className="text-3xl font-bold text-[#FFAB91] mb-2">68%</div>
          <div className="text-slate-300 text-sm">Win Rate</div>
          <div className="text-slate-400 text-xs mt-1">this month</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-white/50 transition-all duration-300 group hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div className="text-slate-400 text-xs">30 days</div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">247</div>
          <div className="text-slate-300 text-sm">Total Bets</div>
          <div className="text-slate-400 text-xs mt-1">last month</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-violet-400/50 transition-all duration-300 group hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-violet-400/20 rounded-xl flex items-center justify-center group-hover:bg-violet-400/30 transition-colors">
              <svg
                className="w-6 h-6 text-violet-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <div className="text-emerald-400 text-xs font-semibold">↑ 8</div>
          </div>
          <div className="text-3xl font-bold text-violet-400 mb-2">#12</div>
          <div className="text-slate-300 text-sm">Global Rank</div>
          <div className="text-slate-400 text-xs mt-1">positions up</div>
        </div>
      </div>{" "}
      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-semibold text-white flex items-center">
            <div className="w-10 h-10 bg-[#00CED1]/20 rounded-xl flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-[#00CED1]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            Recent Activity
          </h4>
          <button className="px-4 py-2 bg-[#00CED1]/20 border border-[#00CED1]/30 rounded-full text-[#00CED1] text-sm font-semibold hover:bg-[#00CED1]/30 transition-colors">
            View All
          </button>
        </div>{" "}
        <div className="space-y-4">
          {/* FINAL - WIN */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <span className="text-2xl">🏈</span>
              </div>
              <div>
                <div className="text-white font-semibold">Chiefs -3.5</div>
                <div className="text-slate-400 text-sm">
                  NFL • 2 minutes ago
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="px-2 py-1 bg-emerald-500/20 rounded-full">
                    <span className="text-emerald-400 text-xs font-bold">
                      FINAL
                    </span>
                  </div>
                  <span className="text-slate-500 text-xs">
                    Chiefs 24-17 Bills
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-bold text-lg">+$245</div>
              <div className="text-emerald-400 text-xs font-bold">✅ WON</div>
            </div>
          </div>

          {/* IN PROGRESS */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-colors group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                <span className="text-2xl">🏀</span>
              </div>
              <div>
                <div className="text-white font-semibold">Lakers +2.5</div>
                <div className="text-slate-400 text-sm">NBA • Q3 8:42</div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="px-2 py-1 bg-yellow-500/20 rounded-full">
                    <span className="text-yellow-400 text-xs font-bold animate-pulse">
                      LIVE
                    </span>
                  </div>
                  <span className="text-slate-500 text-xs">
                    Lakers 89-92 Warriors
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg">$150</div>
              <div className="text-yellow-400 text-xs font-bold">
                ⏳ IN PROGRESS
              </div>
            </div>
          </div>

          {/* FINAL - LOSS */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-500/10 to-red-500/5 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-colors group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                <span className="text-2xl">⚽</span>
              </div>
              <div>
                <div className="text-white font-semibold">Arsenal Win</div>
                <div className="text-slate-400 text-sm">
                  EPL • 15 minutes ago
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="px-2 py-1 bg-red-500/20 rounded-full">
                    <span className="text-red-400 text-xs font-bold">
                      FINAL
                    </span>
                  </div>
                  <span className="text-slate-500 text-xs">
                    Arsenal 1-2 Chelsea
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-red-400 font-bold text-lg">-$120</div>
              <div className="text-red-400 text-xs font-bold">❌ LOST</div>
            </div>
          </div>

          {/* UPCOMING */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-colors group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <span className="text-2xl">🏈</span>
              </div>
              <div>
                <div className="text-white font-semibold">Cowboys -7</div>
                <div className="text-slate-400 text-sm">
                  NFL • Tomorrow 8:15 PM
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="px-2 py-1 bg-blue-500/20 rounded-full">
                    <span className="text-blue-400 text-xs font-bold">
                      UPCOMING
                    </span>
                  </div>
                  <span className="text-slate-500 text-xs">
                    Cowboys vs Giants
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg">$200</div>
              <div className="text-blue-400 text-xs font-bold">
                📅 SCHEDULED
              </div>
            </div>
          </div>

          {/* FINAL - WIN */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <span className="text-2xl">⚾</span>
              </div>
              <div>
                <div className="text-white font-semibold">Yankees ML</div>
                <div className="text-slate-400 text-sm">MLB • 1 hour ago</div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="px-2 py-1 bg-emerald-500/20 rounded-full">
                    <span className="text-emerald-400 text-xs font-bold">
                      FINAL
                    </span>
                  </div>
                  <span className="text-slate-500 text-xs">
                    Yankees 8-3 Red Sox
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-bold text-lg">+$85</div>
              <div className="text-emerald-400 text-xs font-bold">✅ WON</div>
            </div>
          </div>

          {/* IN PROGRESS - PARLAY */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-colors group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <div className="text-white font-semibold">3-Leg Parlay</div>
                <div className="text-slate-400 text-sm">Mixed • 2/3 Won</div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="px-2 py-1 bg-purple-500/20 rounded-full">
                    <span className="text-purple-400 text-xs font-bold animate-pulse">
                      LIVE
                    </span>
                  </div>
                  <span className="text-slate-500 text-xs">
                    1 game remaining
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg">$75</div>
              <div className="text-purple-400 text-xs font-bold">
                🎯 TRACKING
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
