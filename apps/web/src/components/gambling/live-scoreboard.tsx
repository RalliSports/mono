"use client";

import { useState, useEffect } from "react";

export default function LiveScoreboard() {
  const [selectedSport, setSelectedSport] = useState("all");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const liveGames = [
    {
      id: 1,
      sport: "🏈",
      sportName: "NFL",
      homeTeam: "Chiefs",
      awayTeam: "Bills",
      homeScore: 21,
      awayScore: 14,
      quarter: "3rd",
      time: "8:42",
      homeSpread: -3.5,
      total: 54.5,
      status: "live",
      venue: "Arrowhead Stadium",
      temperature: "32°F",
      possession: "home",
      redZone: true,
      trending: "up",
    },
    {
      id: 2,
      sport: "🏀",
      sportName: "NBA",
      homeTeam: "Lakers",
      awayTeam: "Warriors",
      homeScore: 89,
      awayScore: 92,
      quarter: "4th",
      time: "2:15",
      homeSpread: +2.5,
      total: 225.5,
      status: "live",
      venue: "Crypto.com Arena",
      fouls: { home: 8, away: 6 },
      possession: "away",
      clutchTime: true,
      trending: "down",
    },
    {
      id: 3,
      sport: "⚽",
      sportName: "Premier League",
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      homeScore: 1,
      awayScore: 0,
      quarter: "2nd",
      time: "67'",
      homeSpread: -0.5,
      total: 2.5,
      status: "live",
      venue: "Emirates Stadium",
      cards: { home: 2, away: 1 },
      possession: "home",
      trending: "stable",
    },
    {
      id: 4,
      sport: "⚾",
      sportName: "MLB",
      homeTeam: "Yankees",
      awayTeam: "Red Sox",
      homeScore: 4,
      awayScore: 3,
      quarter: "8th",
      time: "Bottom",
      homeSpread: -1.5,
      total: 8.5,
      status: "live",
      venue: "Yankee Stadium",
      runners: ["1st", "3rd"],
      possession: "home",
      trending: "up",
    },
  ];

  const filteredGames =
    selectedSport === "all"
      ? liveGames
      : liveGames.filter((game) => game.sportName === selectedSport);

  const sports = ["all", "NFL", "NBA", "Premier League", "MLB"];

  return (
    <div className="relative overflow-hidden">
      {/* Background with advanced glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 to-slate-800/90 backdrop-blur-xl rounded-3xl border border-white/10"></div>
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 171, 145, 0.15) 0%, transparent 40%),
                           radial-gradient(circle at 75% 75%, rgba(0, 206, 209, 0.15) 0%, transparent 40%)`,
            backgroundSize: "300px 300px",
          }}
        ></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Premium Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-red-500/30">
                <div className="relative">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Live Scoreboard</h3>
              <p className="text-slate-400 text-sm">
                {filteredGames.length} games currently live
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/30 rounded-full px-4 py-2">
              <span className="text-red-400 font-bold text-sm flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                LIVE
              </span>
            </div>{" "}
            <div className="text-slate-400 text-sm font-mono">
              {isClient && currentTime
                ? currentTime.toLocaleTimeString()
                : "--:--:--"}
            </div>
          </div>
        </div>

        {/* Sport Filter Tabs */}
        <div className="mb-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
            <div className="flex space-x-2 overflow-x-auto">
              {sports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                    selectedSport === sport
                      ? "bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {sport === "all" ? "All Sports" : sport}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Games */}
        <div className="space-y-4 mb-6">
          {filteredGames.map((game, index) => (
            <div
              key={game.id}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/10 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Game Status Bar */}
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 px-5 py-2 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{game.sport}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 font-bold text-sm">
                        {game.quarter} {game.time}
                      </span>
                    </div>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-slate-400 text-xs">{game.venue}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {game.trending === "up" && (
                      <div className="text-emerald-400 text-xs flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        Hot
                      </div>
                    )}
                    <span className="text-slate-500 text-xs">
                      {game.sportName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* Teams and Scores */}
                <div className="space-y-4 mb-4">
                  {/* Away Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-600/50 to-slate-700/50 rounded-xl flex items-center justify-center backdrop-blur-sm border border-slate-600/30">
                          <span className="text-white font-bold text-sm">
                            {game.awayTeam.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        {game.possession === "away" && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFAB91] rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-white font-bold text-lg">
                          {game.awayTeam}
                        </span>
                        <div className="text-slate-400 text-xs">Away</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">
                        {game.awayScore}
                      </div>
                      {game.clutchTime && (
                        <div className="text-orange-400 text-xs font-semibold animate-pulse">
                          CLUTCH
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Home Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#00CED1]/30 to-[#FFAB91]/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-[#00CED1]/40">
                          <span className="text-white font-bold text-sm">
                            {game.homeTeam.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        {game.possession === "home" && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00CED1] rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-white font-bold text-lg">
                          {game.homeTeam}
                        </span>
                        <div className="text-slate-400 text-xs">Home</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">
                        {game.homeScore}
                      </div>
                      {game.redZone && (
                        <div className="text-red-400 text-xs font-semibold animate-pulse">
                          RED ZONE
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Game Stats */}
                {game.runners && (
                  <div className="mb-4 bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">
                        Runners on base:
                      </span>
                      <div className="flex space-x-1">
                        {game.runners.map((base, idx) => (
                          <span
                            key={idx}
                            className="bg-[#FFAB91]/20 text-[#FFAB91] px-2 py-1 rounded-lg text-xs font-medium"
                          >
                            {base}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Betting Info */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-slate-400 text-xs mb-1">Spread</div>
                      <div
                        className={`px-3 py-1 rounded-full font-bold text-sm ${
                          game.homeSpread < 0
                            ? "bg-[#00CED1]/20 text-[#00CED1] border border-[#00CED1]/30"
                            : "bg-[#FFAB91]/20 text-[#FFAB91] border border-[#FFAB91]/30"
                        }`}
                      >
                        {game.homeSpread > 0 ? "+" : ""}
                        {game.homeSpread}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400 text-xs mb-1">Total</div>
                      <div className="bg-slate-500/20 text-slate-300 border border-slate-500/30 px-3 py-1 rounded-full font-bold text-sm">
                        {game.homeScore + game.awayScore}/
                        <span className="text-slate-400">{game.total}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400 text-xs mb-1">
                        Progress
                      </div>
                      <div className="w-16 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] h-2 rounded-full transition-all duration-1000"
                          style={{
                            width: `${((game.homeScore + game.awayScore) / game.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-[#00CED1]/20 to-[#FFAB91]/20 hover:from-[#00CED1]/30 hover:to-[#FFAB91]/30 border border-[#00CED1]/30 rounded-xl text-sm text-white transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                      <svg
                        className="w-4 h-4 inline mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM14 9a1 1 0 100 2h2a1 1 0 100-2h-2z"></path>
                      </svg>
                      Bet Live
                    </button>
                    <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/30 rounded-xl text-sm text-slate-300 hover:text-white transition-all duration-300 backdrop-blur-sm">
                      <svg
                        className="w-4 h-4 inline mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Watch
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-bold py-4 rounded-2xl hover:shadow-2xl hover:shadow-[#00CED1]/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span>View All Live Games</span>
          </button>
          <button className="bg-white/5 backdrop-blur-sm border border-white/20 text-white font-bold py-4 rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span>Refresh Scores</span>
          </button>
        </div>
      </div>
    </div>
  );
}
