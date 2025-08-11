export default function PlayerCards() {
  const players = [
    {
      id: 1,
      name: "Patrick Mahomes",
      team: "KC",
      position: "QB",
      price: 2.4,
      projection: 24.8,
      ownership: 32,
      trend: "up",
      status: "probable",
      avatar: "PM",
      matchup: "vs BUF",
      statPrediction: {
        type: "Passing Yards",
        line: 285.5,
        icon: "🏈",
      },
    },
    {
      id: 2,
      name: "Josh Allen",
      team: "BUF",
      position: "QB",
      price: 2.8,
      projection: 26.2,
      ownership: 28,
      trend: "up",
      status: "confirmed",
      avatar: "JA",
      matchup: "@ KC",
      statPrediction: {
        type: "Rushing Yards",
        line: 45.5,
        icon: "🏃",
      },
    },
    {
      id: 3,
      name: "Cooper Kupp",
      team: "LAR",
      position: "WR",
      price: 1.9,
      projection: 18.6,
      ownership: 45,
      trend: "down",
      status: "questionable",
      avatar: "CK",
      matchup: "vs SEA",
      statPrediction: {
        type: "Receiving Yards",
        line: 95.5,
        icon: "🙌",
      },
    },
    {
      id: 4,
      name: "Derrick Henry",
      team: "TEN",
      position: "RB",
      price: 2.1,
      projection: 19.4,
      ownership: 38,
      trend: "up",
      status: "confirmed",
      avatar: "DH",
      matchup: "@ JAX",
      statPrediction: {
        type: "Rushing Yards",
        line: 125.5,
        icon: "🏃",
      },
    },
    {
      id: 5,
      name: "Travis Kelce",
      team: "KC",
      position: "TE",
      price: 1.8,
      projection: 16.8,
      ownership: 42,
      trend: "stable",
      status: "probable",
      avatar: "TK",
      matchup: "vs BUF",
      statPrediction: {
        type: "Receiving Yards",
        line: 75.5,
        icon: "🙌",
      },
    },
    {
      id: 6,
      name: "Ja'Marr Chase",
      team: "CIN",
      position: "WR",
      price: 1.7,
      projection: 17.2,
      ownership: 35,
      trend: "up",
      status: "confirmed",
      avatar: "JC",
      matchup: "vs PIT",
      statPrediction: {
        type: "Receiving Yards",
        line: 88.5,
        icon: "🙌",
      },
    },
  ];

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {players.map((player) => (
        <div
          key={player.id}
          className="group relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 shadow-2xl hover:shadow-[#00CED1]/20 transition-all duration-300 hover:scale-105 overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-3xl"></div>
          </div>{" "}
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00CED1]/30 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">
                    {player.avatar}
                  </span>
                </div>
                <div
                  className={`absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-slate-800 flex items-center justify-center ${
                    player.status === "confirmed"
                      ? "bg-emerald-500"
                      : player.status === "probable"
                        ? "bg-yellow-500"
                        : "bg-orange-500"
                  }`}
                >
                  {player.status === "confirmed" ? (
                    <svg
                      className="w-3 h-3 text-white"
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
                      className="w-3 h-3 text-white"
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
                      className="w-3 h-3 text-white"
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
              <div>
                <div className="text-white font-bold text-lg mb-1">
                  {player.name}
                </div>
                <div className="flex items-center space-x-3 mb-1">
                  <span className="text-slate-300 font-semibold">
                    {player.team}
                  </span>
                  <div
                    className={`px-2 py-1 bg-gradient-to-r ${getPositionColor(
                      player.position
                    )} border rounded-full text-xs font-bold`}
                  >
                    {player.position}
                  </div>
                </div>
                <div className="text-slate-400 text-sm">{player.matchup}</div>
              </div>
            </div>
          </div>{" "}
          {/* Stats Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
            <div className="group/stat bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-[#00CED1]/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#00CED1]"
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
              </div>
              <div className="text-[#00CED1] font-bold text-2xl mb-1">
                ${player.price}M
              </div>
              <div className="text-slate-400 text-sm font-medium">Salary</div>
            </div>
            <div className="group/stat bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-[#FFAB91]/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#FFAB91]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-[#FFAB91] font-bold text-2xl mb-1">
                {player.projection}
              </div>
              <div className="text-slate-400 text-sm font-medium">
                Projected
              </div>
            </div>
          </div>{" "}
          {/* Ownership and Trend */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-slate-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                  <path d="M6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
              <div>
                <div className="text-white font-bold text-lg">
                  {player.ownership}%
                </div>
                <div className="text-slate-400 text-sm">Ownership</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl border ${
                  player.trend === "up"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : player.trend === "down"
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : "bg-slate-500/10 border-slate-500/30 text-slate-400"
                }`}
              >
                {player.trend === "up" && (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {player.trend === "down" && (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 15.586l3.293-3.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {player.trend === "stable" && (
                  <div className="w-4 h-1 bg-current rounded"></div>
                )}
                <span className="text-sm font-bold">
                  {player.trend === "up"
                    ? "Rising"
                    : player.trend === "down"
                      ? "Falling"
                      : "Stable"}
                </span>
              </div>
            </div>
          </div>{" "}
          {/* Ownership Bar */}
          <div className="relative z-10 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-300 text-sm font-medium">
                Public Ownership
              </span>
              <span className="text-white font-bold text-sm">
                {player.ownership}%
              </span>
            </div>
            <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] h-3 rounded-full transition-all duration-1000 ease-out shadow-lg relative"
                style={{ width: `${player.ownership}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          {/* Stat Prediction Section */}
          <div className="relative z-10 mb-6">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00CED1]/20 to-[#FFAB91]/20 rounded-xl flex items-center justify-center">
                    <span className="text-lg">
                      {player.statPrediction.icon}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">
                      {player.statPrediction.type}
                    </div>
                    <div className="text-slate-400 text-xs">
                      Stat Prediction
                    </div>
                  </div>
                </div>
                <div className="text-[#00CED1] font-bold text-lg">
                  {player.statPrediction.line}
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="group/btn flex-1 relative px-4 py-3 bg-gradient-to-br from-[#00CED1]/20 to-[#00CED1]/10 border border-[#00CED1]/30 rounded-xl text-[#00CED1] font-bold hover:bg-[#00CED1] hover:text-white transition-all duration-300 hover:scale-105">
                  <div className="relative z-10 flex items-center justify-center space-x-2">
                    <svg
                      className="w-4 h-4"
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
                <button className="group/btn flex-1 relative px-4 py-3 bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105">
                  <div className="relative z-10 flex items-center justify-center space-x-2">
                    <svg
                      className="w-4 h-4"
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
          {/* Action Button */}{" "}
          <div className="relative z-10">
            <button className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-bold py-4 rounded-2xl hover:shadow-2xl hover:shadow-[#00CED1]/30 transform hover:scale-105 transition-all duration-300 group-hover:shadow-xl flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Add Athlete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
