export default function TrendingPlayers() {
  const trendingPlayers = [
    {
      id: 1,
      name: "Patrick Mahomes",
      team: "KC",
      position: "QB",
      trendType: "hot",
      percentage: 87,
      reason: "3 TDs in last game",
      odds: -110,
      betType: "Over 2.5 TD passes",
    },
    {
      id: 2,
      name: "Ja'Marr Chase",
      team: "CIN",
      position: "WR",
      trendType: "rising",
      percentage: 72,
      reason: "Favorable matchup",
      odds: +125,
      betType: "Over 85.5 receiving yards",
    },
    {
      id: 3,
      name: "Derrick Henry",
      team: "TEN",
      position: "RB",
      trendType: "hot",
      percentage: 81,
      reason: "Week opponent defense",
      odds: -105,
      betType: "Over 95.5 rushing yards",
    },
    {
      id: 4,
      name: "Cooper Kupp",
      team: "LAR",
      position: "WR",
      trendType: "cooling",
      percentage: 45,
      reason: "Injury concern",
      odds: -125,
      betType: "Under 7.5 receptions",
    },
    {
      id: 5,
      name: "Travis Kelce",
      team: "KC",
      position: "TE",
      trendType: "rising",
      percentage: 68,
      reason: "Red zone target",
      odds: +150,
      betType: "Anytime TD scorer",
    },
    {
      id: 6,
      name: "Josh Allen",
      team: "BUF",
      position: "QB",
      trendType: "hot",
      percentage: 89,
      reason: "Perfect weather forecast",
      odds: -120,
      betType: "Over 275.5 passing yards",
    },
    {
      id: 7,
      name: "Stefon Diggs",
      team: "BUF",
      position: "WR",
      trendType: "rising",
      percentage: 76,
      reason: "High target share",
      odds: +135,
      betType: "Over 6.5 receptions",
    },
    {
      id: 8,
      name: "Christian McCaffrey",
      team: "SF",
      position: "RB",
      trendType: "hot",
      percentage: 84,
      reason: "Weak run defense",
      odds: -105,
      betType: "Over 105.5 rushing yards",
    },
  ];

  const getTrendColor = (type: string) => {
    switch (type) {
      case "hot":
        return "text-red-400";
      case "rising":
        return "text-emerald-400";
      case "cooling":
        return "text-blue-400";
      default:
        return "text-slate-400";
    }
  };

  const getTrendIcon = (type: string) => {
    switch (type) {
      case "hot":
        return "🔥";
      case "rising":
        return "📈";
      case "cooling":
        return "❄️";
      default:
        return "📊";
    }
  };
  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-3xl p-6 border border-slate-700 shadow-2xl h-[1040px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <svg
            className="w-6 h-6 text-[#00CED1] mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
              clipRule="evenodd"
            />
          </svg>
          Trending Players
        </h3>
        <div className="bg-orange-500/20 border border-orange-500/30 rounded-full px-3 py-1">
          <span className="text-orange-400 font-semibold text-sm">
            TRENDING
          </span>
        </div>
      </div>{" "}
      {/* Trending List */}
      <div className="space-y-4 max-h-[800px] overflow-y-auto">
        {trendingPlayers.map((player, index) => (
          <div
            key={player.id}
            className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 group"
          >
            {/* Player Info */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {player.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 text-sm">
                    {getTrendIcon(player.trendType)}
                  </div>
                </div>
                <div>
                  <div className="text-white font-semibold">{player.name}</div>
                  <div className="text-slate-400 text-sm">
                    {player.team} • {player.position}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white">#{index + 1}</div>
                <div
                  className={`text-xs font-semibold ${getTrendColor(player.trendType)}`}
                >
                  {player.trendType.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Trend Percentage */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400 text-sm">Public Interest</span>
                <span className="text-white font-semibold text-sm">
                  {player.percentage}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    player.trendType === "hot"
                      ? "bg-gradient-to-r from-red-500 to-orange-500"
                      : player.trendType === "rising"
                        ? "bg-gradient-to-r from-emerald-500 to-green-500"
                        : "bg-gradient-to-r from-blue-500 to-cyan-500"
                  }`}
                  style={{ width: `${player.percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Reason */}
            <div className="text-slate-300 text-sm mb-3">
              <span className="text-slate-400">Reason:</span> {player.reason}
            </div>

            {/* Bet Option */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
              <div>
                <div className="text-white font-medium text-sm">
                  {player.betType}
                </div>
                <div
                  className={`text-sm font-semibold ${player.odds > 0 ? "text-emerald-400" : "text-slate-300"}`}
                >
                  {player.odds > 0 ? "+" : ""}
                  {player.odds}
                </div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 group-hover:shadow-xl">
                Bet Now
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* View More Button */}
      <button className="w-full mt-6 bg-slate-800/50 border border-slate-600 text-slate-300 font-semibold py-3 rounded-2xl hover:bg-slate-700 hover:text-white transition-all duration-300">
        View All Trending Players
      </button>
    </div>
  );
}
