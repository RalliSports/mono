"use client";

export default function UserProfileDrawer() {
  const userStats = {
    name: "Mike Chen",
    username: "@mikethebet",
    balance: 2847.5,
    rank: 12,
    totalUsers: 15647,
    winRate: 68.4,
    totalBets: 247,
    avgBet: 75.5,
    biggestWin: 1250,
    currentStreak: 5,
  };

  const recentActivity = [
    {
      id: 1,
      type: "win",
      game: "Chiefs vs Bills",
      amount: 245,
      time: "2 min ago",
      sport: "🏈",
    },
    {
      id: 2,
      type: "loss",
      game: "Lakers vs Warriors",
      amount: -120,
      time: "15 min ago",
      sport: "🏀",
    },
    {
      id: 3,
      type: "win",
      game: "Arsenal vs Chelsea",
      amount: 85,
      time: "1 hour ago",
      sport: "⚽",
    },
    {
      id: 4,
      type: "win",
      game: "Yankees vs Red Sox",
      amount: 150,
      time: "3 hours ago",
      sport: "⚾",
    },
    {
      id: 5,
      type: "loss",
      game: "Cowboys vs Giants",
      amount: -200,
      time: "1 day ago",
      sport: "🏈",
    },
  ];
  return (
    <div className="w-full max-w-lg bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700 rounded-3xl shadow-2xl h-[1100px]">
      {/* Header */}
      <div className="flex items-center justify-between p-8 border-b border-slate-700/50">
        <h2 className="text-2xl font-bold text-white">User Profile</h2>
        <div className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full"></div>
      </div>{" "}
      {/* Scrollable Content */}
      <div className="max-h-[1100px] overflow-y-auto">
        {" "}
        {/* User Info */}
        <div className="p-8 border-b border-slate-700/30">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">MC</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                {userStats.name}
              </h3>
              <p className="text-slate-300 text-lg mb-2">
                {userStats.username}
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 text-base font-semibold">
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="bg-gradient-to-r from-[#00CED1]/10 to-[#FFAB91]/10 rounded-3xl p-6 border border-[#00CED1]/20 shadow-inner">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-3">
                ${userStats.balance.toLocaleString()}
              </div>
              <div className="text-slate-400 text-lg">Available Balance</div>
            </div>
          </div>
        </div>{" "}
        {/* Rank Section */}
        <div className="p-8 border-b border-slate-700/30">
          <h4 className="text-xl font-semibold text-white mb-6 flex items-center">
            <svg
              className="w-6 h-6 text-[#FFAB91] mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Global Ranking
          </h4>
          <div className="bg-slate-800/50 rounded-3xl p-6 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-300 text-lg">Current Rank:</span>
              <span className="text-[#00CED1] font-bold text-2xl">
                #{userStats.rank}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-300 text-lg">Out of:</span>
              <span className="text-white font-semibold text-lg">
                {userStats.totalUsers.toLocaleString()} players
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] h-3 rounded-full shadow-lg"
                style={{
                  width: `${((userStats.totalUsers - userStats.rank) / userStats.totalUsers) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-slate-400 text-base">
              Top {((userStats.rank / userStats.totalUsers) * 100).toFixed(1)}%
            </div>
          </div>
        </div>{" "}
        {/* Quick Stats */}
        <div className="p-8 border-b border-slate-700/30">
          <h4 className="text-xl font-semibold text-white mb-6">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-2xl p-5 text-center shadow-inner">
              <div className="text-[#00CED1] font-bold text-2xl mb-2">
                {userStats.winRate}%
              </div>
              <div className="text-slate-400 text-sm">Win Rate</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-5 text-center shadow-inner">
              <div className="text-[#FFAB91] font-bold text-2xl mb-2">
                {userStats.totalBets}
              </div>
              <div className="text-slate-400 text-sm">Total Bets</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-5 text-center shadow-inner">
              <div className="text-emerald-400 font-bold text-2xl mb-2">
                ${userStats.avgBet}
              </div>
              <div className="text-slate-400 text-sm">Avg Bet</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-5 text-center shadow-inner">
              <div className="text-violet-400 font-bold text-2xl mb-2">
                {userStats.currentStreak}
              </div>
              <div className="text-slate-400 text-sm">Win Streak</div>
            </div>
          </div>
        </div>
        {/* Recent Activity */}
        {/* <div className="p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <svg
              className="w-5 h-5 text-[#00CED1] mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Recent Activity
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{activity.sport}</span>
                  <div>
                    <div className="text-white text-sm font-medium">
                      {activity.game}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {activity.time}
                    </div>
                  </div>
                </div>
                <div
                  className={`font-bold text-sm ${
                    activity.type === "win"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {activity.amount > 0 ? "+" : ""}${Math.abs(activity.amount)}
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
