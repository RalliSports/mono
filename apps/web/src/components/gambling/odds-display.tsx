"use client";

import { useState } from "react";

export default function OddsDisplay() {
  const [oddsFormat, setOddsFormat] = useState("american");

  const games = [
    {
      id: 1,
      sport: "🏈",
      homeTeam: "Chiefs",
      awayTeam: "Bills",
      homeSpread: { american: -110, decimal: 1.91, fractional: "10/11" },
      awaySpread: { american: -110, decimal: 1.91, fractional: "10/11" },
      homeML: { american: -165, decimal: 1.61, fractional: "20/33" },
      awayML: { american: +140, decimal: 2.4, fractional: "7/5" },
      total: { american: -105, decimal: 1.95, fractional: "20/21" },
      spreadLine: 3.5,
      totalLine: 54.5,
      movement: "up",
    },
    {
      id: 2,
      sport: "🏀",
      homeTeam: "Lakers",
      awayTeam: "Warriors",
      homeSpread: { american: -108, decimal: 1.93, fractional: "25/27" },
      awaySpread: { american: -112, decimal: 1.89, fractional: "25/28" },
      homeML: { american: +120, decimal: 2.2, fractional: "6/5" },
      awayML: { american: -145, decimal: 1.69, fractional: "20/29" },
      total: { american: -110, decimal: 1.91, fractional: "10/11" },
      spreadLine: 2.5,
      totalLine: 225.5,
      movement: "down",
    },
    {
      id: 3,
      sport: "⚽",
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      homeSpread: { american: -115, decimal: 1.87, fractional: "20/23" },
      awaySpread: { american: -105, decimal: 1.95, fractional: "20/21" },
      homeML: { american: +175, decimal: 2.75, fractional: "7/4" },
      awayML: { american: +180, decimal: 2.8, fractional: "9/5" },
      total: { american: -120, decimal: 1.83, fractional: "5/6" },
      spreadLine: 0.5,
      totalLine: 2.5,
      movement: "up",
    },
  ];

  const formatOdds = (odds: any) => {
    switch (oddsFormat) {
      case "decimal":
        return odds.decimal.toFixed(2);
      case "fractional":
        return odds.fractional;
      default:
        return odds.american > 0
          ? `+${odds.american}`
          : odds.american.toString();
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
            <path
              fillRule="evenodd"
              d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11zm0-2a1 1 0 100 2h.01a1 1 0 100-2H11zm-2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm-2 0a1 1 0 100 2h.01a1 1 0 100-2H7zm2-2a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11z"
              clipRule="evenodd"
            />
          </svg>
          Live Odds
        </h3>
        <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1">
          {["american", "decimal", "fractional"].map((format) => (
            <button
              key={format}
              onClick={() => setOddsFormat(format)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-300 ${
                oddsFormat === format
                  ? "bg-[#00CED1] text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {format === "american"
                ? "US"
                : format === "decimal"
                  ? "DEC"
                  : "FRAC"}
            </button>
          ))}
        </div>
      </div>

      {/* Games List */}
      <div className="space-y-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50"
          >
            {/* Game Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{game.sport}</span>
                <div>
                  <div className="text-white font-semibold">
                    {game.awayTeam} @ {game.homeTeam}
                  </div>
                  <div className="text-slate-400 text-sm">
                    Live odds • Auto-refresh
                  </div>
                </div>
              </div>
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                  game.movement === "up"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                <svg
                  className={`w-3 h-3 ${game.movement === "up" ? "" : "rotate-180"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs font-semibold">
                  {game.movement === "up" ? "Rising" : "Falling"}
                </span>
              </div>
            </div>

            {/* Odds Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Spread */}
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-slate-400 text-xs mb-2 text-center">
                  SPREAD
                </div>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-2 bg-slate-800/50 hover:bg-[#00CED1]/20 rounded-lg transition-colors">
                    <span className="text-white text-sm">{game.awayTeam}</span>
                    <div className="text-right">
                      <div className="text-white font-semibold text-sm">
                        +{game.spreadLine}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {formatOdds(game.awaySpread)}
                      </div>
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between p-2 bg-slate-800/50 hover:bg-[#00CED1]/20 rounded-lg transition-colors">
                    <span className="text-white text-sm">{game.homeTeam}</span>
                    <div className="text-right">
                      <div className="text-white font-semibold text-sm">
                        -{game.spreadLine}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {formatOdds(game.homeSpread)}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Moneyline */}
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-slate-400 text-xs mb-2 text-center">
                  MONEYLINE
                </div>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-2 bg-slate-800/50 hover:bg-[#FFAB91]/20 rounded-lg transition-colors">
                    <span className="text-white text-sm">{game.awayTeam}</span>
                    <div className="text-emerald-400 font-semibold text-sm">
                      {formatOdds(game.awayML)}
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between p-2 bg-slate-800/50 hover:bg-[#FFAB91]/20 rounded-lg transition-colors">
                    <span className="text-white text-sm">{game.homeTeam}</span>
                    <div className="text-slate-300 font-semibold text-sm">
                      {formatOdds(game.homeML)}
                    </div>
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-slate-400 text-xs mb-2 text-center">
                  TOTAL
                </div>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-2 bg-slate-800/50 hover:bg-gradient-to-r hover:from-[#00CED1]/20 hover:to-[#FFAB91]/20 rounded-lg transition-colors">
                    <span className="text-white text-sm">Over</span>
                    <div className="text-right">
                      <div className="text-white font-semibold text-sm">
                        {game.totalLine}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {formatOdds(game.total)}
                      </div>
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between p-2 bg-slate-800/50 hover:bg-gradient-to-r hover:from-[#00CED1]/20 hover:to-[#FFAB91]/20 rounded-lg transition-colors">
                    <span className="text-white text-sm">Under</span>
                    <div className="text-right">
                      <div className="text-white font-semibold text-sm">
                        {game.totalLine}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {formatOdds(game.total)}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Refresh Info */}
      <div className="mt-6 flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-slate-300 text-sm">
            Auto-refreshing every 5 seconds
          </span>
        </div>
        <button className="text-slate-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
