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

export default function HostGameComponent() {
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create");
  const [gameSettings, setGameSettings] = useState({
    gameTitle: "",
    buyInAmount: 25,
    playerLimit: 8,
    visibility: "public",
    numberOfLegs: 4,
    allowedBetTypes: [] as string[],
  });

  const [hostedGames] = useState<HostedGame[]>([
    {
      id: 1,
      name: "NBA Sunday Finals",
      currentPlayers: 6,
      maxPlayers: 8,
      buyIn: 25,
      legs: 4,
      status: "waiting",
      createdAt: "2 hours ago",
      visibility: "public",
    },
    {
      id: 2,
      name: "Private NFL Challenge",
      currentPlayers: 4,
      maxPlayers: 6,
      buyIn: 50,
      legs: 5,
      status: "active",
      createdAt: "1 day ago",
      visibility: "private",
    },
    {
      id: 3,
      name: "March Madness Elite",
      currentPlayers: 12,
      maxPlayers: 12,
      buyIn: 100,
      legs: 6,
      status: "completed",
      createdAt: "3 days ago",
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
        return "text-amber-400 bg-amber-400/20 border-amber-400/30";
      case "active":
        return "text-emerald-400 bg-emerald-400/20 border-emerald-400/30";
      case "completed":
        return "text-slate-400 bg-slate-400/20 border-slate-400/30";
      default:
        return "text-slate-400 bg-slate-400/20 border-slate-400/30";
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
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
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffab91, #ff8e53);
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow:
            0 4px 12px rgba(255, 171, 145, 0.4),
            0 0 0 1px rgba(255, 171, 145, 0.6);
          transition: all 0.3s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow:
            0 6px 20px rgba(255, 171, 145, 0.6),
            0 0 0 2px rgba(255, 171, 145, 0.8);
          background: linear-gradient(135deg, #ff8e53, #ff7043);
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
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow:
            0 4px 12px rgba(16, 185, 129, 0.4),
            0 0 0 1px rgba(16, 185, 129, 0.6);
          transition: all 0.3s ease;
        }

        .contest-legs-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          background: linear-gradient(135deg, #34d399, #10b981);
          box-shadow:
            0 6px 20px rgba(16, 185, 129, 0.6),
            0 0 0 2px rgba(16, 185, 129, 0.8);
        }
      `}</style>

      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Host Game 🎯
              </h2>
              <p className="text-slate-400">Create and manage your contests</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00CED1] rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-400">Ready to host</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-slate-700/30 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${
                activeTab === "create"
                  ? "bg-gradient-to-r from-[#00CED1] to-blue-500 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-600/50"
              }`}
            >
              🎮 Create Contest
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${
                activeTab === "manage"
                  ? "bg-gradient-to-r from-[#00CED1] to-blue-500 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-600/50"
              }`}
            >
              ⚙️ Manage Games
            </button>
          </div>
        </div>

        {/* Create Game Tab */}
        {activeTab === "create" && (
          <div className="p-6 space-y-6">
            {/* Game Title */}
            <div className="space-y-3">
              <label className="text-white font-bold text-lg flex items-center gap-2">
                <span className="text-xl">📝</span>
                Contest Name
              </label>
              <input
                type="text"
                value={gameSettings.gameTitle}
                onChange={(e) => handleInputChange("gameTitle", e.target.value)}
                placeholder="Enter your contest name..."
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-[#00CED1]/50 focus:ring-2 focus:ring-[#00CED1]/20 transition-all duration-300"
              />
            </div>

            {/* Buy-In Amount */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-[#00CED1]/50 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/10 rounded-xl flex items-center justify-center border border-[#00CED1]/20">
                  <span className="text-xl">💰</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    Buy-In Amount
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Entry fee for participants
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-3">
                <input
                  type="range"
                  value={gameSettings.buyInAmount}
                  onChange={(e) =>
                    handleInputChange("buyInAmount", parseInt(e.target.value))
                  }
                  min="5"
                  max="500"
                  step="5"
                  className="flex-1 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-[#00CED1] font-bold text-2xl min-w-[5rem] text-center">
                  ${gameSettings.buyInAmount}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>$5</span>
                <span>$500</span>
              </div>
            </div>

            {/* Player Limit & Contest Legs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Player Limit */}
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-orange-400/50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-400/10 rounded-lg flex items-center justify-center border border-orange-400/20">
                    <span className="text-lg">👥</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Player Limit</h3>
                    <p className="text-slate-400 text-xs">Max contestants</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 mb-2">
                  <input
                    type="range"
                    value={gameSettings.playerLimit}
                    onChange={(e) =>
                      handleInputChange("playerLimit", parseInt(e.target.value))
                    }
                    min="2"
                    max="20"
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-orange-400 font-bold text-xl min-w-[2.5rem] text-center">
                    {gameSettings.playerLimit}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>2</span>
                  <span>20</span>
                </div>
              </div>

              {/* Contest Legs */}
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-400/50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 rounded-lg flex items-center justify-center border border-emerald-400/20">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Contest Legs</h3>
                    <p className="text-slate-400 text-xs">Required bets</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 mb-2">
                  <input
                    type="range"
                    value={gameSettings.numberOfLegs}
                    onChange={(e) =>
                      handleInputChange(
                        "numberOfLegs",
                        parseInt(e.target.value)
                      )
                    }
                    min="3"
                    max="15"
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer contest-legs-slider"
                  />
                  <span className="text-emerald-400 font-bold text-xl min-w-[2.5rem] text-center">
                    {gameSettings.numberOfLegs}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>3</span>
                  <span>15</span>
                </div>
              </div>
            </div>

            {/* Visibility */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-purple-400/50 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-400/10 rounded-xl flex items-center justify-center border border-purple-400/20">
                  <span className="text-xl">🔒</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Visibility</h3>
                  <p className="text-slate-400 text-sm">
                    Who can join this contest
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => handleInputChange("visibility", "public")}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                    gameSettings.visibility === "public"
                      ? "border-[#00CED1] bg-[#00CED1]/10 shadow-lg"
                      : "border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🌍</span>
                    <div className="text-left">
                      <div className="text-white font-semibold">
                        Public Contest
                      </div>
                      <div className="text-slate-400 text-sm">
                        Anyone can join
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleInputChange("visibility", "private")}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                    gameSettings.visibility === "private"
                      ? "border-[#00CED1] bg-[#00CED1]/10 shadow-lg"
                      : "border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🔒</span>
                    <div className="text-left">
                      <div className="text-white font-semibold">
                        Private Contest
                      </div>
                      <div className="text-slate-400 text-sm">Invite only</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleInputChange("visibility", "friends")}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                    gameSettings.visibility === "friends"
                      ? "border-[#00CED1] bg-[#00CED1]/10 shadow-lg"
                      : "border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">👥</span>
                    <div className="text-left">
                      <div className="text-white font-semibold">
                        Friends Only
                      </div>
                      <div className="text-slate-400 text-sm">
                        Friends can join
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Bet Types */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🎲</span>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    Allowed Bet Types
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Select which betting categories are allowed
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {betTypeOptions.map((betType) => (
                  <button
                    key={betType.id}
                    onClick={() => toggleBetType(betType.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      gameSettings.allowedBetTypes.includes(betType.id)
                        ? "border-[#00CED1] bg-[#00CED1]/10 shadow-lg"
                        : "border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{betType.icon}</span>
                      <div className="text-left">
                        <div className="text-white font-semibold">
                          {betType.name}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {betType.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-[#00CED1]/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-xl">
                    Ready to Create?
                  </h3>
                  <p className="text-slate-400">
                    Launch your contest and start inviting players
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    ${gameSettings.buyInAmount * gameSettings.playerLimit}
                  </div>
                  <div className="text-sm text-slate-400">Total prize pool</div>
                </div>
              </div>

              <button className="relative w-full bg-gradient-to-r from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg overflow-hidden group">
                <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <span className="relative z-10">🚀 Create Contest</span>
              </button>
            </div>
          </div>
        )}

        {/* Manage Games Tab */}
        {activeTab === "manage" && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-white font-bold text-lg mb-2">
                Your Hosted Games
              </h3>
              <p className="text-slate-400 text-sm">
                Manage your active and completed contests
              </p>
            </div>

            <div className="space-y-4">
              {hostedGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/10 rounded-xl flex items-center justify-center border border-[#00CED1]/20">
                        <span className="text-xl">🎯</span>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg">
                          {game.name}
                        </h4>
                        <p className="text-slate-400 text-sm">
                          Created {game.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg border text-sm font-medium ${getStatusColor(game.status)}`}
                      >
                        {game.status}
                      </span>
                      <span className="text-slate-400 text-xl">
                        {getVisibilityIcon(game.visibility)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-slate-400 text-xs">Players</div>
                      <div className="text-white font-bold">
                        {game.currentPlayers}/{game.maxPlayers}
                      </div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-slate-400 text-xs">Buy-In</div>
                      <div className="text-white font-bold">${game.buyIn}</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-slate-400 text-xs">Prize Pool</div>
                      <div className="text-emerald-400 font-bold">
                        ${game.buyIn * game.maxPlayers}
                      </div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-slate-400 text-xs">Legs</div>
                      <div className="text-white font-bold">{game.legs}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {game.status === "waiting" && (
                      <>
                        <button className="flex-1 bg-gradient-to-r from-[#00CED1] to-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:from-[#00CED1]/90 hover:to-blue-500/90 transition-all duration-200">
                          Manage
                        </button>
                        <button className="flex-1 bg-slate-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-slate-500 transition-all duration-200">
                          Cancel
                        </button>
                      </>
                    )}
                    {game.status === "active" && (
                      <button className="w-full bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-emerald-500 transition-all duration-200">
                        View Live Results
                      </button>
                    )}
                    {game.status === "completed" && (
                      <button className="w-full bg-slate-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-slate-500 transition-all duration-200">
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
    </div>
  );
}
