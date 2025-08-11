"use client";

import { useState } from "react";

interface HostedGame {
  id: number;
  name: string;
  currentPlayers: number;
  maxPlayers: number;
  buyIn: number;
  legs: number;
  status: "waiting" | "active" | "completed";
  createdAt: string;
  visibility: "public" | "private" | "friends";
}

export default function HostGameComponentCompact() {
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create");
  const [gameSettings, setGameSettings] = useState({
    gameTitle: "",
    buyInAmount: 25,
    playerLimit: 6,
    visibility: "public",
    numberOfLegs: 4,
    allowedBetTypes: [] as string[],
  });

  const [hostedGames] = useState<HostedGame[]>([
    {
      id: 1,
      name: "Tennis Masters Cup",
      currentPlayers: 4,
      maxPlayers: 6,
      buyIn: 30,
      legs: 3,
      status: "waiting",
      createdAt: "1 hour ago",
      visibility: "public",
    },
    {
      id: 2,
      name: "Baseball World Series",
      currentPlayers: 8,
      maxPlayers: 8,
      buyIn: 75,
      legs: 5,
      status: "active",
      createdAt: "2 days ago",
      visibility: "friends",
    },
  ]);

  const handleInputChange = (field: string, value: any) => {
    setGameSettings((prev) => ({ ...prev, [field]: value }));
  };

  const toggleBetType = (betType: string) => {
    setGameSettings((prev) => ({
      ...prev,
      allowedBetTypes: prev.allowedBetTypes.includes(betType)
        ? prev.allowedBetTypes.filter((type) => type !== betType)
        : [...prev.allowedBetTypes, betType],
    }));
  };

  const betTypeOptions = [
    { id: "player-props", name: "Player Props", icon: "🎾" },
    { id: "game-outcomes", name: "Game Results", icon: "⚾" },
    { id: "live-events", name: "Live Events", icon: "⚡" },
    { id: "special-bets", name: "Special Bets", icon: "🎯" },
  ];

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "🌍";
      case "private":
        return "🔒";
      case "friends":
        return "👥";
      default:
        return "🌍";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "text-amber-400 bg-amber-400/20";
      case "active":
        return "text-emerald-400 bg-emerald-400/20";
      case "completed":
        return "text-slate-400 bg-slate-400/20";
      default:
        return "text-slate-400 bg-slate-400/20";
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
      <style jsx>{`
        .compact-slider {
          -webkit-appearance: none;
          appearance: none;
          background: linear-gradient(to right, #1e293b 0%, #ff8e53 100%);
          border-radius: 6px;
          outline: none;
          transition: all 0.2s ease;
        }

        .compact-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffab91, #ff8e53);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 8px rgba(255, 171, 145, 0.4);
          transition: all 0.2s ease;
        }

        .compact-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(255, 171, 145, 0.6);
        }

        .legs-slider {
          background: linear-gradient(to right, #1e293b 0%, #10b981 100%);
        }

        .legs-slider::-webkit-slider-thumb {
          background: linear-gradient(135deg, #34d399, #10b981);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
        }

        .legs-slider::-webkit-slider-thumb:hover {
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.6);
        }
      `}</style>

      {/* Header */}
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Host Game 🎯</h2>
            <p className="text-slate-400 text-sm">Create & manage contests</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00CED1] rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400">Ready</span>
          </div>
        </div>

        {/* Compact Tab Navigation */}
        <div className="flex space-x-1 bg-slate-700/30 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-2 px-3 rounded-md transition-all duration-300 font-medium text-sm ${
              activeTab === "create"
                ? "bg-gradient-to-r from-[#00CED1] to-blue-500 text-white shadow-lg"
                : "text-slate-300 hover:text-white hover:bg-slate-600/50"
            }`}
          >
            🎮 Create
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`flex-1 py-2 px-3 rounded-md transition-all duration-300 font-medium text-sm ${
              activeTab === "manage"
                ? "bg-gradient-to-r from-[#00CED1] to-blue-500 text-white shadow-lg"
                : "text-slate-300 hover:text-white hover:bg-slate-600/50"
            }`}
          >
            ⚙️ Manage
          </button>
        </div>
      </div>

      {/* Create Game Tab */}
      {activeTab === "create" && (
        <div className="p-5 space-y-5">
          {/* Game Title */}
          <div className="space-y-2">
            <label className="text-white font-semibold text-sm flex items-center gap-2">
              <span>📝</span>
              Contest Name
            </label>
            <input
              type="text"
              value={gameSettings.gameTitle}
              onChange={(e) => handleInputChange("gameTitle", e.target.value)}
              placeholder="Enter contest name..."
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-[#00CED1]/50 focus:ring-1 focus:ring-[#00CED1]/20 transition-all duration-300 text-sm"
            />
          </div>

          {/* Buy-In & Player Limit */}
          <div className="grid grid-cols-2 gap-4">
            {/* Buy-In */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💰</span>
                <div>
                  <h3 className="text-white font-semibold text-sm">Buy-In</h3>
                  <p className="text-slate-400 text-xs">Entry fee</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="range"
                  value={gameSettings.buyInAmount}
                  onChange={(e) =>
                    handleInputChange("buyInAmount", parseInt(e.target.value))
                  }
                  min="5"
                  max="200"
                  step="5"
                  className="flex-1 h-2 compact-slider"
                />
                <span className="text-[#00CED1] font-bold text-lg min-w-[3rem] text-center">
                  ${gameSettings.buyInAmount}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>$5</span>
                <span>$200</span>
              </div>
            </div>

            {/* Player Limit */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">👥</span>
                <div>
                  <h3 className="text-white font-semibold text-sm">Players</h3>
                  <p className="text-slate-400 text-xs">Max limit</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="range"
                  value={gameSettings.playerLimit}
                  onChange={(e) =>
                    handleInputChange("playerLimit", parseInt(e.target.value))
                  }
                  min="2"
                  max="12"
                  className="flex-1 h-2 compact-slider"
                />
                <span className="text-orange-400 font-bold text-lg min-w-[2rem] text-center">
                  {gameSettings.playerLimit}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>2</span>
                <span>12</span>
              </div>
            </div>
          </div>

          {/* Contest Legs */}
          <div className="bg-slate-700/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🎯</span>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  Contest Legs
                </h3>
                <p className="text-slate-400 text-xs">Required bets</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="range"
                value={gameSettings.numberOfLegs}
                onChange={(e) =>
                  handleInputChange("numberOfLegs", parseInt(e.target.value))
                }
                min="3"
                max="10"
                className="flex-1 h-2 legs-slider"
              />
              <span className="text-emerald-400 font-bold text-lg min-w-[2rem] text-center">
                {gameSettings.numberOfLegs}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>3</span>
              <span>10</span>
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-3">
            <label className="text-white font-semibold text-sm flex items-center gap-2">
              <span>🔒</span>
              Visibility
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleInputChange("visibility", "public")}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  gameSettings.visibility === "public"
                    ? "border-[#00CED1] bg-[#00CED1]/10"
                    : "border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50"
                }`}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">🌍</div>
                  <div className="text-white text-xs font-medium">Public</div>
                </div>
              </button>
              <button
                onClick={() => handleInputChange("visibility", "private")}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  gameSettings.visibility === "private"
                    ? "border-[#00CED1] bg-[#00CED1]/10"
                    : "border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50"
                }`}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">🔒</div>
                  <div className="text-white text-xs font-medium">Private</div>
                </div>
              </button>
              <button
                onClick={() => handleInputChange("visibility", "friends")}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  gameSettings.visibility === "friends"
                    ? "border-[#00CED1] bg-[#00CED1]/10"
                    : "border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50"
                }`}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">👥</div>
                  <div className="text-white text-xs font-medium">Friends</div>
                </div>
              </button>
            </div>
          </div>

          {/* Bet Types */}
          <div className="space-y-3">
            <label className="text-white font-semibold text-sm flex items-center gap-2">
              <span>🎲</span>
              Bet Types
            </label>
            <div className="grid grid-cols-2 gap-2">
              {betTypeOptions.map((betType) => (
                <button
                  key={betType.id}
                  onClick={() => toggleBetType(betType.id)}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    gameSettings.allowedBetTypes.includes(betType.id)
                      ? "border-[#00CED1] bg-[#00CED1]/10"
                      : "border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">{betType.icon}</div>
                    <div className="text-white text-xs font-medium">
                      {betType.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Create Button */}
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-4 border border-[#00CED1]/30">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold text-sm">
                  Ready to Create?
                </h3>
                <p className="text-slate-400 text-xs">Launch your contest</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  ${gameSettings.buyInAmount * gameSettings.playerLimit}
                </div>
                <div className="text-xs text-slate-400">Prize pool</div>
              </div>
            </div>

            <button className="relative w-full bg-gradient-to-r from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <span className="relative z-10 text-sm">🚀 Create Contest</span>
            </button>
          </div>
        </div>
      )}

      {/* Manage Games Tab */}
      {activeTab === "manage" && (
        <div className="p-5">
          <div className="mb-4">
            <h3 className="text-white font-semibold text-sm mb-1">
              Your Games
            </h3>
            <p className="text-slate-400 text-xs">Manage your contests</p>
          </div>

          <div className="space-y-3">
            {hostedGames.map((game) => (
              <div
                key={game.id}
                className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/10 rounded-lg flex items-center justify-center border border-[#00CED1]/20">
                      <span className="text-sm">🎯</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">
                        {game.name}
                      </h4>
                      <p className="text-slate-400 text-xs">{game.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(game.status)}`}
                    >
                      {game.status}
                    </span>
                    <span className="text-slate-400">
                      {getVisibilityIcon(game.visibility)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-3">
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-slate-400 text-xs">Players</div>
                    <div className="text-white font-semibold text-sm">
                      {game.currentPlayers}/{game.maxPlayers}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-slate-400 text-xs">Buy-In</div>
                    <div className="text-white font-semibold text-sm">
                      ${game.buyIn}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-slate-400 text-xs">Prize</div>
                    <div className="text-emerald-400 font-semibold text-sm">
                      ${game.buyIn * game.maxPlayers}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-slate-400 text-xs">Legs</div>
                    <div className="text-white font-semibold text-sm">
                      {game.legs}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {game.status === "waiting" && (
                    <>
                      <button className="flex-1 bg-gradient-to-r from-[#00CED1] to-blue-500 text-white font-medium py-2 px-3 rounded-lg hover:from-[#00CED1]/90 hover:to-blue-500/90 transition-all duration-200 text-xs">
                        Manage
                      </button>
                      <button className="flex-1 bg-slate-600 text-white font-medium py-2 px-3 rounded-lg hover:bg-slate-500 transition-all duration-200 text-xs">
                        Cancel
                      </button>
                    </>
                  )}
                  {game.status === "active" && (
                    <button className="w-full bg-emerald-600 text-white font-medium py-2 px-3 rounded-lg hover:bg-emerald-500 transition-all duration-200 text-xs">
                      View Results
                    </button>
                  )}
                  {game.status === "completed" && (
                    <button className="w-full bg-slate-600 text-white font-medium py-2 px-3 rounded-lg hover:bg-slate-500 transition-all duration-200 text-xs">
                      View Results
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
