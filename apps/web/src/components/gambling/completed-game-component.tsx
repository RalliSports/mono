"use client";

import { useState } from "react";
import TriColorProgressBar from "./tri-color-progress-bar";

interface GamePick {
  id: number;
  player: string;
  betType: string;
  target: number;
  currentValue: number;
  betDirection: "over" | "under";
  odds: string;
  status: "not_started" | "active" | "won" | "lost";
  gameTime: string;
  athleteImage: string;
  sport: string;
  gameStatus:
    | "pregame"
    | "1st_quarter"
    | "2nd_quarter"
    | "halftime"
    | "3rd_quarter"
    | "4th_quarter"
    | "overtime"
    | "final";
  winProbability?: number;
}

interface GameParticipant {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  buyIn: number;
  picks: GamePick[];
  joinedAt: string;
  finalScore: number;
  legsWon: number;
  legsLost: number;
  finalPosition: number;
  payout: number;
}

interface GameInfo {
  id: number;
  name: string;
  hostName: string;
  hostAvatar: string;
  totalPlayers: number;
  buyIn: number;
  totalPrizePool: number;
  legs: number;
  visibility: "public" | "private" | "friends";
  status: "completed";
  createdAt: string;
  completedAt: string;
  participants: GameParticipant[];
  currentUser: string;
  winner: string;
}

interface EndGameMessage {
  id: number;
  player: string;
  avatar: string;
  message: string;
  timestamp: string;
  type: "gg" | "congratulations" | "thanks" | "custom";
}

export default function CompletedGameComponent() {
  const [activeTab, setActiveTab] = useState<
    "final_results" | "my_performance"
  >("final_results");
  const [sidebarTab, setSidebarTab] = useState<"final_chat" | "leaderboard">(
    "final_chat"
  );
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [expandedParticipants, setExpandedParticipants] = useState<number[]>(
    []
  );

  // Helper function to toggle participant expansion
  const toggleParticipant = (participantId: number) => {
    setExpandedParticipants((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    );
  };

  const isParticipantExpanded = (participantId: number) =>
    expandedParticipants.includes(participantId);

  // Sample completed game data
  const [gameInfo] = useState<GameInfo>({
    id: 1,
    name: "NBA Sunday Showdown",
    hostName: "Jack Sturt",
    hostAvatar: "🎯",
    totalPlayers: 5,
    buyIn: 25,
    totalPrizePool: 125,
    legs: 4,
    visibility: "public",
    status: "completed",
    createdAt: "3 days ago",
    completedAt: "2 hours ago",
    currentUser: "Emma Chen",
    winner: "Jack Sturt",
    participants: [
      {
        id: 1,
        name: "Jack Sturt",
        avatar: "🎯",
        isOnline: true,
        buyIn: 25,
        joinedAt: "3 days ago",
        finalScore: 4,
        legsWon: 4,
        legsLost: 0,
        finalPosition: 1,
        payout: 62.5,
        picks: [
          {
            id: 1,
            player: "LeBron James",
            betType: "Points",
            target: 28.5,
            currentValue: 32,
            betDirection: "over",
            odds: "+110",
            status: "won",
            gameTime: "Final",
            athleteImage: "👑",
            sport: "NBA",
            gameStatus: "final",
          },
          {
            id: 2,
            player: "Steph Curry",
            betType: "3-Pointers",
            target: 4.5,
            currentValue: 6,
            betDirection: "over",
            odds: "+105",
            status: "won",
            gameTime: "Final",
            athleteImage: "👨‍🦱",
            sport: "NBA",
            gameStatus: "final",
          },
          {
            id: 3,
            player: "Giannis",
            betType: "Rebounds",
            target: 11.5,
            currentValue: 14,
            betDirection: "over",
            odds: "-115",
            status: "won",
            gameTime: "Final",
            athleteImage: "🦌",
            sport: "NBA",
            gameStatus: "final",
          },
          {
            id: 4,
            player: "Luka Dončić",
            betType: "Assists",
            target: 8.5,
            currentValue: 12,
            betDirection: "over",
            odds: "+105",
            status: "won",
            gameTime: "Final",
            athleteImage: "🇸🇮",
            sport: "NBA",
            gameStatus: "final",
          },
        ],
      },
      {
        id: 2,
        name: "Emma Chen",
        avatar: "⚡",
        isOnline: true,
        buyIn: 25,
        joinedAt: "3 days ago",
        finalScore: 3,
        legsWon: 3,
        legsLost: 1,
        finalPosition: 2,
        payout: 37.5,
        picks: [
          {
            id: 5,
            player: "Jayson Tatum",
            betType: "Points",
            target: 26.5,
            currentValue: 29,
            betDirection: "over",
            odds: "+115",
            status: "won",
            gameTime: "Final",
            athleteImage: "☘️",
            sport: "NBA",
            gameStatus: "final",
          },
          {
            id: 6,
            player: "Kevin Durant",
            betType: "Points",
            target: 25.5,
            currentValue: 28,
            betDirection: "over",
            odds: "+115",
            status: "won",
            gameTime: "Final",
            athleteImage: "🐍",
            sport: "NBA",
            gameStatus: "final",
          },
          {
            id: 7,
            player: "Kawhi Leonard",
            betType: "Assists",
            target: 5.5,
            currentValue: 3,
            betDirection: "over",
            odds: "-115",
            status: "lost",
            gameTime: "Final",
            athleteImage: "🤖",
            sport: "NBA",
            gameStatus: "final",
          },
          {
            id: 8,
            player: "Nikola Jokić",
            betType: "Triple-Double",
            target: 0.5,
            currentValue: 1,
            betDirection: "over",
            odds: "+180",
            status: "won",
            gameTime: "Final",
            athleteImage: "🐴",
            sport: "NBA",
            gameStatus: "final",
          },
        ],
      },
      {
        id: 3,
        name: "Sarah Johnson",
        avatar: "🚀",
        isOnline: true,
        buyIn: 25,
        joinedAt: "3 days ago",
        finalScore: 2,
        legsWon: 2,
        legsLost: 2,
        finalPosition: 3,
        payout: 25.0,
        picks: [
          {
            id: 17,
            player: "Jimmy Butler",
            betType: "Points",
            target: 22.5,
            currentValue: 25,
            betDirection: "over",
            odds: "+105",
            status: "won",
            gameTime: "Final",
            athleteImage: "🔥",
            sport: "NBA",
            gameStatus: "final",
          },
          {
            id: 18,
            player: "Kyrie Irving",
            betType: "Assists",
            target: 6.5,
            currentValue: 8,
            betDirection: "over",
            odds: "+115",
            status: "won",
            gameTime: "Final",
            athleteImage: "🎭",
            sport: "NBA",
            gameStatus: "final",
          },
          {
            id: 19,
            player: "Pascal Siakam",
            betType: "Rebounds",
            target: 8.5,
            currentValue: 6,
            betDirection: "over",
            odds: "-110",
            status: "lost",
            gameTime: "Final",
            athleteImage: "🌪️",
            sport: "NBA",
            gameStatus: "final",
          },
          {
            id: 20,
            player: "Russell Westbrook",
            betType: "Assists",
            target: 7.5,
            currentValue: 5,
            betDirection: "over",
            odds: "+120",
            status: "lost",
            gameTime: "Final",
            athleteImage: "⚡",
            sport: "NBA",
            gameStatus: "final",
          },
        ],
      },
      {
        id: 4,
        name: "Matt Zimmermann",
        avatar: "🏆",
        isOnline: false,
        buyIn: 25,
        joinedAt: "3 days ago",
        finalScore: 1,
        legsWon: 1,
        legsLost: 3,
        finalPosition: 4,
        payout: 0,
        picks: [
          {
            id: 13,
            player: "Ja Morant",
            betType: "Assists",
            target: 8.5,
            currentValue: 11,
            betDirection: "over",
            odds: "-115",
            status: "won",
            gameTime: "Final",
            athleteImage: "🎪",
            sport: "NBA",
            gameStatus: "final",
          },
          {
            id: 14,
            player: "Trae Young",
            betType: "Points",
            target: 25.5,
            currentValue: 22,
            betDirection: "over",
            odds: "+110",
            status: "lost",
            gameTime: "Final",
            athleteImage: "🐍",
            sport: "NBA",
            gameStatus: "final",
          },
          {
            id: 15,
            player: "Donovan Mitchell",
            betType: "3-Pointers",
            target: 3.5,
            currentValue: 2,
            betDirection: "over",
            odds: "+105",
            status: "lost",
            gameTime: "Final",
            athleteImage: "🎯",
            sport: "NBA",
            gameStatus: "final",
          },
          {
            id: 16,
            player: "Zion Williamson",
            betType: "Rebounds",
            target: 7.5,
            currentValue: 6,
            betDirection: "over",
            odds: "-110",
            status: "lost",
            gameTime: "Final",
            athleteImage: "💪",
            sport: "NBA",
            gameStatus: "final",
          },
        ],
      },
      {
        id: 5,
        name: "Carlos Rodriguez",
        avatar: "🌟",
        isOnline: false,
        buyIn: 25,
        joinedAt: "3 days ago",
        finalScore: 0,
        legsWon: 0,
        legsLost: 4,
        finalPosition: 5,
        payout: 0,
        picks: [
          {
            id: 9,
            player: "Damian Lillard",
            betType: "3-Pointers",
            target: 3.5,
            currentValue: 2,
            betDirection: "over",
            odds: "+105",
            status: "lost",
            gameTime: "Final",
            athleteImage: "⏰",
            sport: "NBA",
            gameStatus: "final",
          },
          {
            id: 10,
            player: "Anthony Davis",
            betType: "Blocks",
            target: 2.5,
            currentValue: 1,
            betDirection: "over",
            odds: "+120",
            status: "lost",
            gameTime: "Final",
            athleteImage: "🏠",
            sport: "NBA",
            gameStatus: "final",
          },
          {
            id: 11,
            player: "Joel Embiid",
            betType: "Rebounds",
            target: 10.5,
            currentValue: 7,
            betDirection: "over",
            odds: "-110",
            status: "lost",
            gameTime: "Final",
            athleteImage: "🏠",
            sport: "NBA",
            gameStatus: "final",
          },
          {
            id: 12,
            player: "Devin Booker",
            betType: "Points",
            target: 24.5,
            currentValue: 19,
            betDirection: "over",
            odds: "+110",
            status: "lost",
            gameTime: "Final",
            athleteImage: "☀️",
            sport: "NBA",
            gameStatus: "final",
          },
        ],
      },
    ],
  });

  // Sample end game messages
  const [endGameMessages, setEndGameMessages] = useState<EndGameMessage[]>([
    {
      id: 1,
      player: "Jack Sturt",
      avatar: "🎯",
      message: "GG everyone! That was an amazing weekend of picks! 🏆",
      timestamp: "2 mins ago",
      type: "gg",
    },
    {
      id: 2,
      player: "Emma Chen",
      avatar: "⚡",
      message: "Congrats Jack! You absolutely crushed it this weekend 👏",
      timestamp: "3 mins ago",
      type: "congratulations",
    },
    {
      id: 3,
      player: "Sarah Johnson",
      avatar: "🚀",
      message: "Great picks everyone! Already excited for next week 🔥",
      timestamp: "5 mins ago",
      type: "gg",
    },
    {
      id: 4,
      player: "Matt Zimmermann",
      avatar: "🏆",
      message: "Thanks for the fun weekend guys! See you next time 👋",
      timestamp: "8 mins ago",
      type: "thanks",
    },
    {
      id: 5,
      player: "Carlos Rodriguez",
      avatar: "🌟",
      message: "Rough weekend for me but congrats to the winners! 💪",
      timestamp: "10 mins ago",
      type: "congratulations",
    },
  ]);

  const getCurrentUserParticipant = () => {
    return gameInfo.participants.find((p) => p.name === gameInfo.currentUser);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "text-emerald-400 bg-emerald-400/20 border-emerald-400/30";
      case "lost":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      default:
        return "text-slate-400 bg-slate-400/20 border-slate-400/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "won":
        return "✅";
      case "lost":
        return "❌";
      default:
        return "⏳";
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "text-amber-400 bg-amber-400/20 border-amber-400/30";
      case 2:
        return "text-slate-300 bg-slate-300/20 border-slate-300/30";
      case 3:
        return "text-amber-600 bg-amber-600/20 border-amber-600/30";
      default:
        return "text-slate-500 bg-slate-500/20 border-slate-500/30";
    }
  };

  const getPositionEmoji = (position: number) => {
    switch (position) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${position}`;
    }
  };

  const currentUser = getCurrentUserParticipant();
  const sortedPlayers = [...gameInfo.participants].sort(
    (a, b) => a.finalPosition - b.finalPosition
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: EndGameMessage = {
        id: endGameMessages.length + 1,
        player: gameInfo.currentUser,
        avatar: currentUser?.avatar || "⚡",
        message: newMessage.trim(),
        timestamp: "now",
        type: "custom",
      };
      setEndGameMessages([message, ...endGameMessages]);
      setNewMessage("");
      setShowMessageModal(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">COMPLETED</h2>
              <span className="text-lg font-semibold text-white">
                {gameInfo.name}
              </span>
            </div>
            <p className="text-slate-400">
              Game finished {gameInfo.completedAt} • {gameInfo.totalPlayers}{" "}
              players participated
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-400">
              🏆 {gameInfo.winner}
            </div>
            <div className="text-sm text-slate-400">Champion</div>
          </div>
        </div>

        {/* Winner Celebration */}
        <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-md border border-amber-400/30 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 backdrop-blur-lg bg-amber-400/20 border border-amber-400/40 rounded-xl flex items-center justify-center text-3xl shadow-xl">
                {
                  gameInfo.participants.find((p) => p.name === gameInfo.winner)
                    ?.avatar
                }
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                👑
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-amber-400 font-bold text-xl">
                🎉 {gameInfo.winner} Wins!
              </h3>
              <p className="text-slate-300 text-sm">
                Perfect score •{" "}
                {
                  gameInfo.participants.find((p) => p.name === gameInfo.winner)
                    ?.legsWon
                }
                /{gameInfo.legs} legs won
              </p>
              <div className="mt-2">
                <h4 className="text-lg font-semibold text-white">
                  Final Prize: $
                  {
                    gameInfo.participants.find(
                      (p) => p.name === gameInfo.winner
                    )?.payout
                  }
                </h4>
              </div>
            </div>
            <div className="text-6xl animate-pulse">🥇</div>
          </div>
        </div>
      </div>

      {/* Your Results Section */}
      {currentUser && (
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-white font-bold text-lg mb-4">
            Your Final Results
          </h3>
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-2xl">
                  {currentUser.avatar}
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">
                    {currentUser.name}
                  </h4>
                  <p className="text-slate-400 text-sm">
                    {currentUser.legsWon}/{gameInfo.legs} legs won
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`px-3 py-1 rounded-lg font-bold text-lg border ${getPositionColor(currentUser.finalPosition)}`}
                >
                  {getPositionEmoji(currentUser.finalPosition)}
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  Final Position
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  ${currentUser.payout}
                </div>
                <div className="text-sm text-slate-400">Payout</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {currentUser.finalScore}
                </div>
                <div className="text-sm text-slate-400">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-300">
                  {Math.round((currentUser.legsWon / gameInfo.legs) * 100)}%
                </div>
                <div className="text-sm text-slate-400">Win Rate</div>
              </div>
            </div>

            {/* TriColor Progress Bar */}
            <div className="mt-4">
              <TriColorProgressBar
                totalBets={currentUser.picks.length}
                wonBets={
                  currentUser.picks.filter((p) => p.status === "won").length
                }
                activeBets={0}
                lostBets={
                  currentUser.picks.filter((p) => p.status === "lost").length
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Results Views */}
          <div className="lg:col-span-2">
            {/* Enhanced Glassmorphic Tab Navigation */}
            <div className="mb-6">
              <div className="relative bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl">
                <div className="flex relative">
                  {/* Animated Background Slider */}
                  <div
                    className={`absolute top-1.5 h-[calc(100%-12px)] bg-gradient-to-r from-[#00CED1]/80 to-blue-500/80 backdrop-blur-sm rounded-xl transition-all duration-300 ease-out shadow-lg shadow-[#00CED1]/20 ${
                      activeTab === "final_results"
                        ? "left-1.5 w-[calc(50%-6px)]"
                        : "left-[calc(50%+1.5px)] w-[calc(50%-6px)]"
                    }`}
                  />

                  <button
                    onClick={() => setActiveTab("final_results")}
                    className={`relative z-10 flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-out ${
                      activeTab === "final_results"
                        ? "text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>🏁</span>
                      <span>Final Results</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("my_performance")}
                    className={`relative z-10 flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-out ${
                      activeTab === "my_performance"
                        ? "text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>📊</span>
                      <span>My Performance</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Final Results Tab */}
            {activeTab === "final_results" && (
              <div className="space-y-4">
                {sortedPlayers.map((participant, index) => (
                  <div key={participant.id} className="space-y-3">
                    <div
                      className={`bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 ${
                        isParticipantExpanded(participant.id)
                          ? "border-[#00CED1] shadow-[#00CED1]/20"
                          : "hover:border-slate-600 hover:shadow-slate-600/10"
                      }`}
                      onClick={() => toggleParticipant(participant.id)}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-2xl shadow-xl">
                                {participant.avatar}
                              </div>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                                  participant.isOnline
                                    ? "bg-emerald-400"
                                    : "bg-slate-500"
                                }`}
                              ></div>
                              {participant.finalPosition === 1 && (
                                <div className="absolute -top-1 -left-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs">
                                  👑
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="text-white font-bold leading-tight">
                                {participant.name}
                              </h4>
                              <p className="text-slate-400 text-sm">
                                {participant.legsWon}W/{participant.legsLost}L •
                                Score: {participant.finalScore}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div
                                className={`px-3 py-1 rounded-lg font-bold border ${getPositionColor(participant.finalPosition)}`}
                              >
                                {getPositionEmoji(participant.finalPosition)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-emerald-400">
                                ${participant.payout}
                              </div>
                              <div className="text-sm text-slate-400">
                                Payout
                              </div>
                            </div>
                            <div
                              className={`transform transition-transform duration-300 text-slate-400 ${
                                isParticipantExpanded(participant.id)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            >
                              ▼
                            </div>
                          </div>
                        </div>

                        {/* Performance Bar */}
                        <div className="mt-3">
                          <div className="flex gap-1">
                            {participant.picks.map((pick, pickIndex) => (
                              <div
                                key={pick.id}
                                className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden"
                              >
                                <div
                                  className={`h-full ${
                                    pick.status === "won"
                                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                      : "bg-gradient-to-r from-red-400 to-red-500"
                                  }`}
                                  style={{ width: "100%" }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Picks Details */}
                    {isParticipantExpanded(participant.id) && (
                      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300 shadow-2xl shadow-[#00CED1]/10">
                        <div className="p-4 border-b border-slate-700/50">
                          <h5 className="text-white font-bold">
                            {participant.name}'s Final Picks
                          </h5>
                          <p className="text-slate-400 text-sm">
                            {
                              participant.picks.filter(
                                (p) => p.status === "won"
                              ).length
                            }{" "}
                            wins •{" "}
                            {
                              participant.picks.filter(
                                (p) => p.status === "lost"
                              ).length
                            }{" "}
                            losses
                          </p>
                        </div>

                        <div className="divide-y divide-slate-700/30">
                          {participant.picks.map((pick) => (
                            <div
                              key={pick.id}
                              className="p-4 hover:bg-slate-700/20 transition-all duration-200"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-lg">
                                    {pick.athleteImage}
                                  </div>
                                  <div>
                                    <h6 className="text-white font-semibold text-sm leading-tight">
                                      {pick.player}
                                    </h6>
                                    <p className="text-slate-400 text-xs">
                                      {pick.betType} {pick.betDirection}{" "}
                                      {pick.target} • {pick.odds}
                                    </p>
                                    <p className="text-slate-500 text-xs">
                                      {pick.sport} • Final Result
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span
                                      className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(pick.status)}`}
                                    >
                                      {getStatusIcon(pick.status)}{" "}
                                      {pick.status.toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="text-white font-semibold text-sm">
                                    {pick.currentValue} / {pick.target}
                                  </div>
                                  <div
                                    className={`text-xs ${pick.status === "won" ? "text-emerald-400" : "text-red-400"}`}
                                  >
                                    {pick.status === "won"
                                      ? "+1 Point"
                                      : "No Points"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* My Performance Tab */}
            {activeTab === "my_performance" && currentUser && (
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-700/50">
                  <h3 className="text-white font-bold text-lg mb-4">
                    Detailed Performance Breakdown
                  </h3>
                </div>

                <div className="divide-y divide-slate-700/30">
                  {currentUser.picks.map((pick) => (
                    <div
                      key={pick.id}
                      className="p-4 hover:bg-slate-700/20 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl">
                            {pick.athleteImage}
                          </div>
                          <div>
                            <h6 className="text-white font-semibold leading-tight">
                              {pick.player}
                            </h6>
                            <p className="text-slate-400 text-sm">
                              {pick.betType} {pick.betDirection} {pick.target} •{" "}
                              {pick.odds}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {pick.sport} • Final Result
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(pick.status)}`}
                            >
                              {getStatusIcon(pick.status)}{" "}
                              {pick.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-white font-semibold">
                            {pick.currentValue} / {pick.target}
                          </div>
                          <div
                            className={`text-xs ${pick.status === "won" ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {pick.status === "won" ? "+1 Point" : "No Points"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Glassmorphic Sidebar Tab Navigation */}
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <div className="relative bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-inner">
                <div className="flex relative">
                  {/* Animated Background Slider */}
                  <div
                    className={`absolute top-1.5 h-[calc(100%-12px)] bg-gradient-to-r from-[#00CED1]/80 to-blue-500/80 backdrop-blur-sm rounded-xl transition-all duration-300 ease-out shadow-lg shadow-[#00CED1]/20 ${
                      sidebarTab === "final_chat"
                        ? "left-1.5 w-[calc(50%-6px)]"
                        : "left-[calc(50%+1.5px)] w-[calc(50%-6px)]"
                    }`}
                  />

                  <button
                    onClick={() => setSidebarTab("final_chat")}
                    className={`relative z-10 flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ease-out ${
                      sidebarTab === "final_chat"
                        ? "text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>💬</span>
                      <span>Final Chat</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSidebarTab("leaderboard")}
                    className={`relative z-10 flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ease-out ${
                      sidebarTab === "leaderboard"
                        ? "text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>🏆</span>
                      <span>Leaderboard</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Final Chat */}
            {sidebarTab === "final_chat" && (
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        Final Messages
                      </h3>
                      <p className="text-slate-400 text-sm">Post-game chat</p>
                    </div>
                    <button
                      onClick={() => setShowMessageModal(true)}
                      className="bg-gradient-to-r from-[#00CED1]/80 to-blue-500/80 hover:from-[#00CED1] hover:to-blue-500 text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 text-sm"
                    >
                      💬 Message
                    </button>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {endGameMessages.map((message) => (
                    <div
                      key={message.id}
                      className="p-4 border-b border-slate-700/30 hover:bg-slate-700/20 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-sm">
                          {message.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm">
                            <span className="font-semibold">
                              {message.player}
                            </span>
                          </div>
                          <div className="text-slate-300 text-sm mt-1">
                            {message.message}
                          </div>
                          <div className="text-slate-500 text-xs mt-1">
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Leaderboard */}
            {sidebarTab === "leaderboard" && (
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-slate-700/50">
                  <h3 className="text-white font-bold text-lg">
                    Final Standings
                  </h3>
                  <p className="text-slate-400 text-sm">Complete results</p>
                </div>

                <div className="divide-y divide-slate-700/30">
                  {sortedPlayers.map((participant, index) => (
                    <div
                      key={participant.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0
                              ? "bg-amber-500 text-white"
                              : index === 1
                                ? "bg-slate-400 text-white"
                                : index === 2
                                  ? "bg-amber-600 text-white"
                                  : "bg-slate-600 text-white"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="w-8 h-8 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-sm">
                          {participant.avatar}
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm">
                            {participant.name}
                          </div>
                          <div className="text-slate-400 text-xs">
                            ${participant.payout}
                          </div>
                        </div>
                      </div>
                      <div className="text-white font-bold">
                        {participant.finalScore}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700">
            <h3 className="text-white font-bold text-xl mb-4">
              Send Final Message
            </h3>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your thoughts about the game..."
              className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 resize-none h-24 mb-4"
              maxLength={200}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="flex-1 bg-gradient-to-r from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
