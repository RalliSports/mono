"use client";

import { useState } from "react";

export default function GameCreation() {
  const [gameSettings, setGameSettings] = useState({
    gameTitle: "",
    buyInAmount: 10,
    playerLimit: 6,
    gameType: "public",
    numberOfLegs: 5,
    gameMode: "standard",
    timeLimit: 60,
    autoStart: false,
    allowChat: true,
    entryDeadline: "24",
    uniqueBets: false,
    lateEntryPenalty: false,
    bonusMultiplier: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customLink, setCustomLink] = useState("");

  const generateCustomLink = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    setCustomLink(`ralli.gg/game/${randomId}`);
  };

  const handleInputChange = (field: string, value: any) => {
    setGameSettings((prev) => ({ ...prev, [field]: value }));
  };

  const betTypeOptions = [
    {
      id: "player-props",
      name: "Player Props",
      icon: "🏃",
      description: "Individual player statistics",
    },
    {
      id: "game-outcomes",
      name: "Game Outcomes",
      icon: "🏆",
      description: "Win/loss, spreads, totals",
    },
    {
      id: "live-events",
      name: "Live Events",
      icon: "⚡",
      description: "In-game occurrences",
    },
    {
      id: "quarter-props",
      name: "Quarter Props",
      icon: "⏱️",
      description: "Period-specific bets",
    },
    {
      id: "exotic-bets",
      name: "Exotic Bets",
      icon: "🎯",
      description: "Unique & creative props",
    },
  ];

  return (
    <>
      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider {
          -webkit-appearance: none;
          appearance: none;
          background: linear-gradient(
            to right,
            #1e293b 0%,
            #ffab91 50%,
            #ff8e53 100%
          );
          border-radius: 8px;
          outline: none;
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .slider:hover {
          background: linear-gradient(
            to right,
            #334155 0%,
            #ff8e53 50%,
            #ff7043 100%
          );
          box-shadow:
            inset 0 2px 4px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 142, 83, 0.3);
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffab91, #ff8e53);
          cursor: pointer;
          border: 4px solid #ffffff;
          box-shadow:
            0 4px 12px rgba(255, 171, 145, 0.4),
            0 0 0 1px rgba(255, 171, 145, 0.6);
          transition: all 0.3s ease;
          position: relative;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow:
            0 6px 20px rgba(255, 171, 145, 0.6),
            0 0 0 2px rgba(255, 171, 145, 0.8);
          background: linear-gradient(135deg, #ff8e53, #ff7043);
          border: 4px solid #ffffff;
        }

        .slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffab91, #ff8e53);
          cursor: pointer;
          border: 4px solid #ffffff;
          box-shadow: 0 4px 12px rgba(255, 171, 145, 0.4);
          transition: all 0.3s ease;
        }

        .contest-legs-slider {
          background: linear-gradient(
            to right,
            #1e293b 0%,
            #34d399 50%,
            #10b981 100%
          );
        }

        .contest-legs-slider:hover {
          background: linear-gradient(
            to right,
            #334155 0%,
            #10b981 50%,
            #059669 100%
          );
          box-shadow:
            inset 0 2px 4px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(16, 185, 129, 0.3);
        }

        .contest-legs-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer;
          border: 4px solid #ffffff;
          box-shadow:
            0 4px 12px rgba(16, 185, 129, 0.4),
            0 0 0 1px rgba(16, 185, 129, 0.6);
          transition: all 0.3s ease;
          position: relative;
        }

        .contest-legs-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          background: linear-gradient(135deg, #34d399, #10b981);
          box-shadow:
            0 6px 20px rgba(16, 185, 129, 0.6),
            0 0 0 2px rgba(16, 185, 129, 0.8);
          border: 4px solid #ffffff;
        }

        .contest-legs-slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer;
          border: 4px solid #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          transition: all 0.3s ease;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-[#FFAB91] to-[#00CED1] rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-full px-8 py-4 mb-8 shadow-lg">
            <div className="w-3 h-3 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Create Contest
            </span>
            <div className="w-3 h-3 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Launch Your{" "}
            <span className="bg-gradient-to-r from-[#00CED1] via-purple-400 to-[#FFAB91] bg-clip-text text-transparent">
              Epic Battle
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Create a multiplayer parlay contest where the best predictions win.
            Set custom rules, invite friends, and compete for glory.
          </p>
        </div>

        {/* Main Creation Form */}
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/50 shadow-2xl relative overflow-hidden">
          {/* Background glow effects */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FFAB91] to-[#00CED1] rounded-full blur-2xl"></div>
          </div>

          {/* Game Title */}
          <div className="mb-10 relative z-10">
            <label className="flex items-center text-white font-bold text-xl mb-4">
              <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-lg mr-3 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </span>
              Contest Title
            </label>
            <input
              type="text"
              value={gameSettings.gameTitle}
              onChange={(e) => handleInputChange("gameTitle", e.target.value)}
              placeholder="Enter an epic contest name..."
              className="w-full bg-slate-800/60 border border-slate-600/50 rounded-2xl px-8 py-5 text-white placeholder-slate-400 focus:border-[#00CED1]/50 focus:ring-2 focus:ring-[#00CED1]/20 transition-all duration-300 text-lg shadow-lg backdrop-blur-sm"
            />
          </div>

          {/* Main Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 relative z-10">
            {/* Buy-in Amount */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-[#00CED1]/50 transition-all duration-300 group hover:transform hover:scale-[1.02] shadow-xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#00CED1]/20 to-[#00CED1]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#00CED1]/30 transition-colors border border-[#00CED1]/20">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">
                    Buy-in Amount
                  </h3>
                  <p className="text-slate-400 text-sm">Entry fee per player</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-[#00CED1] font-bold text-3xl">$</span>
                <input
                  type="number"
                  value={gameSettings.buyInAmount}
                  onChange={(e) =>
                    handleInputChange("buyInAmount", parseInt(e.target.value))
                  }
                  className="flex-1 bg-slate-700/50 border border-slate-600/30 rounded-xl px-5 py-4 text-white text-2xl font-bold focus:border-[#00CED1]/50 focus:ring-2 focus:ring-[#00CED1]/20 transition-all duration-300 shadow-inner"
                  min="1"
                  max="1000"
                />
              </div>
              <div className="flex space-x-3">
                {[5, 10, 25, 50].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleInputChange("buyInAmount", amount)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      gameSettings.buyInAmount === amount
                        ? "bg-gradient-to-r from-[#00CED1] to-[#00CED1]/80 text-white shadow-lg"
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/30"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Player Limit */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-[#FFAB91]/50 transition-all duration-300 group hover:transform hover:scale-[1.02] shadow-xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FFAB91]/20 to-[#FFAB91]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#FFAB91]/30 transition-colors border border-[#FFAB91]/20">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">Player Limit</h3>
                  <p className="text-slate-400 text-sm">Maximum contestants</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="range"
                  value={gameSettings.playerLimit}
                  onChange={(e) =>
                    handleInputChange("playerLimit", parseInt(e.target.value))
                  }
                  min="2"
                  max="20"
                  className="flex-1 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-[#FFAB91] font-bold text-3xl min-w-[4rem] text-center">
                  {gameSettings.playerLimit}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>2 players</span>
                <span>20 players</span>
              </div>
            </div>
          </div>

          {/* Second Row of Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 relative z-10">
            {/* Number of Legs */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-emerald-400/50 transition-all duration-300 group hover:transform hover:scale-[1.02] shadow-xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-400/30 transition-colors border border-emerald-400/20">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">Contest Legs</h3>
                  <p className="text-slate-400 text-sm">
                    Number of bets required
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="range"
                  value={gameSettings.numberOfLegs}
                  onChange={(e) =>
                    handleInputChange("numberOfLegs", parseInt(e.target.value))
                  }
                  min="3"
                  max="15"
                  className="flex-1 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer contest-legs-slider"
                />
                <span className="text-emerald-400 font-bold text-3xl min-w-[4rem] text-center">
                  {gameSettings.numberOfLegs}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>3 legs</span>
                <span>15 legs</span>
              </div>
            </div>

            {/* Game Visibility */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-purple-400/50 transition-all duration-300 group hover:transform hover:scale-[1.02] shadow-xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-400/10 rounded-2xl flex items-center justify-center group-hover:bg-purple-400/30 transition-colors border border-purple-400/20">
                  <span className="text-2xl">🔒</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">Visibility</h3>
                  <p className="text-slate-400 text-sm">
                    Who can join this contest
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => handleInputChange("gameType", "public")}
                  className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 ${
                    gameSettings.gameType === "public"
                      ? "border-[#00CED1] bg-[#00CED1]/10 shadow-lg"
                      : "border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">🌍</span>
                    <div className="text-left">
                      <div className="text-white font-semibold text-lg">
                        Public Contest
                      </div>
                      <div className="text-slate-400 text-sm">
                        Anyone can join
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleInputChange("gameType", "private")}
                  className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 ${
                    gameSettings.gameType === "private"
                      ? "border-[#00CED1] bg-[#00CED1]/10 shadow-lg"
                      : "border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">🔐</span>
                    <div className="text-left">
                      <div className="text-white font-semibold text-lg">
                        Private Contest
                      </div>
                      <div className="text-slate-400 text-sm">
                        Invite-only via link
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Bet Types Selection */}
          <div className="mb-10 relative z-10">
            <h3 className="text-white font-bold text-2xl mb-6 flex items-center">
              <span className="w-10 h-10 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-2xl mr-4 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
              </span>
              Available Bet Types
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {betTypeOptions.map((betType) => (
                <div
                  key={betType.id}
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:border-[#00CED1]/50 transition-all duration-300 cursor-pointer group hover:transform hover:scale-[1.02] shadow-lg"
                >
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                      {betType.icon}
                    </span>
                    <div>
                      <div className="text-white font-semibold text-lg">
                        {betType.name}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {betType.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          <div className="mb-8 relative z-10">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-3 text-[#00CED1] hover:text-[#FFAB91] transition-colors duration-200 bg-slate-800/50 border border-slate-700/30 rounded-2xl px-6 py-4"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-bold text-lg">
                Advanced Battle Settings
              </span>
            </button>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/20 mb-10 relative z-10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-purple-400/20 rounded-2xl flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-white font-bold text-2xl">
                  Advanced Contest Rules
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Time Limit */}
                <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/30">
                  <label className="flex items-center text-white font-bold text-lg mb-4">
                    <span className="text-2xl mr-3">⏱️</span>
                    Contest Duration
                  </label>
                  <select
                    value={gameSettings.timeLimit}
                    onChange={(e) =>
                      handleInputChange("timeLimit", parseInt(e.target.value))
                    }
                    className="w-full bg-slate-800/60 border border-slate-600/30 rounded-xl px-5 py-4 text-white focus:border-[#00CED1]/50 focus:ring-2 focus:ring-[#00CED1]/20 transition-all duration-300 text-lg"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={240}>4 hours</option>
                    <option value={480}>8 hours</option>
                    <option value={1440}>24 hours</option>
                  </select>
                </div>

                {/* Entry Deadline */}
                <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/30">
                  <label className="flex items-center text-white font-bold text-lg mb-4">
                    <span className="text-2xl mr-3">🚪</span>
                    Entry Deadline
                  </label>
                  <select
                    value={gameSettings.entryDeadline}
                    onChange={(e) =>
                      handleInputChange("entryDeadline", e.target.value)
                    }
                    className="w-full bg-slate-800/60 border border-slate-600/30 rounded-xl px-5 py-4 text-white focus:border-[#00CED1]/50 focus:ring-2 focus:ring-[#00CED1]/20 transition-all duration-300 text-lg"
                  >
                    <option value="1">1 hour before start</option>
                    <option value="6">6 hours before start</option>
                    <option value="12">12 hours before start</option>
                    <option value="24">24 hours before start</option>
                    <option value="48">48 hours before start</option>
                  </select>
                </div>
              </div>

              {/* Contest Rules */}
              <div className="space-y-6">
                <h4 className="text-white font-bold text-xl mb-4 flex items-center">
                  <span className="text-2xl mr-3">⚡</span>
                  Special Contest Rules
                </h4>

                {/* Basic Toggle Options */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 p-6 rounded-2xl border border-slate-600/30 hover:border-[#00CED1]/50 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl">🚀</span>
                        <div>
                          <div className="text-white font-semibold text-lg">
                            Auto-Start Contest
                          </div>
                          <div className="text-slate-400 text-sm">
                            Begin automatically when full
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleInputChange(
                            "autoStart",
                            !gameSettings.autoStart
                          )
                        }
                        className={`relative w-16 h-9 rounded-full transition-colors duration-200 ${
                          gameSettings.autoStart
                            ? "bg-gradient-to-r from-[#00CED1] to-[#00CED1]/80"
                            : "bg-slate-600"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-7 h-7 bg-white rounded-full transition-transform duration-200 shadow-lg ${
                            gameSettings.autoStart
                              ? "translate-x-8"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 p-6 rounded-2xl border border-slate-600/30 hover:border-[#FFAB91]/50 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl">💬</span>
                        <div>
                          <div className="text-white font-semibold text-lg">
                            Enable Chat
                          </div>
                          <div className="text-slate-400 text-sm">
                            Allow players to communicate
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleInputChange(
                            "allowChat",
                            !gameSettings.allowChat
                          )
                        }
                        className={`relative w-16 h-9 rounded-full transition-colors duration-200 ${
                          gameSettings.allowChat
                            ? "bg-gradient-to-r from-[#FFAB91] to-[#FFAB91]/80"
                            : "bg-slate-600"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-7 h-7 bg-white rounded-full transition-transform duration-200 shadow-lg ${
                            gameSettings.allowChat
                              ? "translate-x-8"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Advanced Rules */}
                <div className="bg-gradient-to-r from-purple-500/5 to-emerald-500/5 border border-purple-400/20 rounded-2xl p-6">
                  <h5 className="text-white font-bold text-lg mb-6 flex items-center">
                    <span className="text-2xl mr-3">🎮</span>
                    Advanced Battle Rules
                  </h5>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Unique Bets Rule */}
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-600/30 hover:border-purple-400/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">🎯</span>
                          <div>
                            <div className="text-white font-semibold">
                              Unique Bets
                            </div>
                            <div className="text-slate-400 text-xs">
                              No duplicate picks
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleInputChange(
                              "uniqueBets",
                              !gameSettings.uniqueBets
                            )
                          }
                          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                            gameSettings.uniqueBets
                              ? "bg-purple-500"
                              : "bg-slate-600"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                              gameSettings.uniqueBets
                                ? "translate-x-6"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-slate-400 text-sm">
                        Players cannot select the same bets as others
                      </p>
                    </div>

                    {/* Late Entry Penalty */}
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-600/30 hover:border-amber-400/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">⚠️</span>
                          <div>
                            <div className="text-white font-semibold">
                              Late Entry Penalty
                            </div>
                            <div className="text-slate-400 text-xs">
                              Reduced prize share
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleInputChange(
                              "lateEntryPenalty",
                              !gameSettings.lateEntryPenalty
                            )
                          }
                          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                            gameSettings.lateEntryPenalty
                              ? "bg-amber-500"
                              : "bg-slate-600"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                              gameSettings.lateEntryPenalty
                                ? "translate-x-6"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-slate-400 text-sm">
                        Late joiners get reduced winnings based on entry time
                      </p>
                    </div>

                    {/* Bonus Multiplier */}
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-600/30 hover:border-emerald-400/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">🎊</span>
                          <div>
                            <div className="text-white font-semibold">
                              Bonus Multiplier
                            </div>
                            <div className="text-slate-400 text-xs">
                              Perfect score bonus
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleInputChange(
                              "bonusMultiplier",
                              !gameSettings.bonusMultiplier
                            )
                          }
                          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                            gameSettings.bonusMultiplier
                              ? "bg-emerald-500"
                              : "bg-slate-600"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                              gameSettings.bonusMultiplier
                                ? "translate-x-6"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-slate-400 text-sm">
                        Perfect parlay gets 2x prize pool bonus
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom Link Generation */}
          {gameSettings.gameType === "private" && (
            <div className="bg-gradient-to-r from-[#00CED1]/10 to-[#FFAB91]/10 border border-[#00CED1]/30 rounded-3xl p-8 mb-10 relative z-10 shadow-lg">
              <h3 className="text-white font-bold text-xl mb-6 flex items-center">
                <span className="text-3xl mr-4">🔗</span>
                Private Contest Link
              </h3>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={customLink}
                  readOnly
                  placeholder="Click generate to create your custom link"
                  className="flex-1 bg-slate-800/60 border border-slate-600/50 rounded-xl px-6 py-4 text-white placeholder-slate-400 text-lg"
                />
                <button
                  onClick={generateCustomLink}
                  className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-[#00CED1]/30 transition-all duration-300 text-lg"
                >
                  Generate
                </button>
              </div>
              <p className="text-slate-400 text-sm mt-3">
                Share this link with friends to invite them to your private
                contest
              </p>
            </div>
          )}

          {/* Prize Pool Display */}
          <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-emerald-500/10 border border-emerald-400/30 rounded-3xl p-8 mb-10 relative z-10 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-400/20 rounded-2xl flex items-center justify-center border border-emerald-400/30">
                  <span className="text-3xl">🏆</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-2xl mb-2">
                    Estimated Prize Pool
                  </h3>
                  <p className="text-emerald-300 text-sm">
                    Based on current settings
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-bold text-4xl mb-2">
                  ${gameSettings.buyInAmount * gameSettings.playerLimit}
                </div>
                <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-2">
                  <div className="text-emerald-400 text-sm font-semibold">
                    🥇 Winner: 70% • 🥈 2nd: 20% • 🥉 3rd: 10%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-6 relative z-10">
            <button className="flex-1 bg-gradient-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-sm border border-slate-600/50 text-white font-bold py-5 rounded-2xl hover:bg-slate-600/50 transition-all duration-300 hover:transform hover:scale-[1.02] shadow-lg">
              Save as Draft
            </button>
            <button className="flex-1 bg-gradient-to-r from-[#00CED1] via-[#00CED1]/90 to-[#FFAB91] text-white font-bold py-5 rounded-2xl hover:shadow-xl hover:shadow-[#00CED1]/40 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-lg">Create Epic Battle</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
