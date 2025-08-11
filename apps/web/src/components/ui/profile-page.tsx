"use client";

import { useState } from "react";

interface ProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePage({ isOpen, onClose }: ProfilePageProps) {
  if (!isOpen) return null;

  // Mock user data
  const user = {
    name: "Mike Chen",
    username: "@mikechen",
    level: 47,
    balance: 1250,
    winRate: 68.4,
    totalBets: 342,
    globalRank: 1847,
    currentStreak: 7,
    streakType: "win" as "win" | "loss",
    joinedDate: "March 2024",
  };

  const recentActivity = [
    {
      id: 1,
      type: "win",
      amount: 125,
      game: "NBA 4-Leg Parlay",
      date: "2 hours ago",
      players: ["LeBron James", "Steph Curry", "Luka Dončić", "Jayson Tatum"],
    },
    {
      id: 2,
      type: "loss",
      amount: 50,
      game: "NFL Monday Night",
      date: "1 day ago",
      players: ["Josh Allen", "Patrick Mahomes", "Travis Kelce"],
    },
    {
      id: 3,
      type: "win",
      amount: 75,
      game: "Soccer Special",
      date: "2 days ago",
      players: ["Lionel Messi", "Kylian Mbappé"],
    },
  ];

  const achievements = [
    { name: "Hot Streak", description: "Win 5 games in a row", unlocked: true },
    {
      name: "Big Winner",
      description: "Win $500+ in a single game",
      unlocked: true,
    },
    {
      name: "Consistent Player",
      description: "Place 100 bets",
      unlocked: true,
    },
    {
      name: "Elite Trader",
      description: "Reach 70% win rate",
      unlocked: false,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md rounded-3xl border border-slate-700/50 shadow-2xl mt-4 mb-4">
        {/* Header */}
        <div className="relative p-6 pb-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-slate-800/50 rounded-full flex items-center justify-center hover:bg-slate-700/50 transition-colors"
          >
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Profile Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <span className="text-white font-bold text-2xl">MC</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
            <p className="text-[#00CED1] font-semibold">{user.username}</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <span className="bg-gradient-to-r from-[#FFAB91] to-[#00CED1] px-3 py-1 rounded-full text-xs font-bold text-white">
                Level {user.level}
              </span>
              <span className="text-slate-400 text-xs">
                Member since {user.joinedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Total Balance */}
            <div className="bg-gradient-to-br from-[#00CED1]/10 to-[#00CED1]/5 rounded-2xl p-4 border border-[#00CED1]/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00CED1] mb-1">
                  ${user.balance}
                </div>
                <div className="text-slate-400 text-xs">Total Balance</div>
              </div>
            </div>

            {/* Win Rate */}
            <div className="bg-gradient-to-br from-emerald-400/10 to-emerald-400/5 rounded-2xl p-4 border border-emerald-400/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-1">
                  {user.winRate}%
                </div>
                <div className="text-slate-400 text-xs">Win Rate</div>
              </div>
            </div>

            {/* Total Bets */}
            <div className="bg-gradient-to-br from-[#FFAB91]/10 to-[#FFAB91]/5 rounded-2xl p-4 border border-[#FFAB91]/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FFAB91] mb-1">
                  {user.totalBets}
                </div>
                <div className="text-slate-400 text-xs">Total Bets</div>
              </div>
            </div>

            {/* Global Rank */}
            <div className="bg-gradient-to-br from-purple-400/10 to-purple-400/5 rounded-2xl p-4 border border-purple-400/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  #{user.globalRank}
                </div>
                <div className="text-slate-400 text-xs">Global Rank</div>
              </div>
            </div>
          </div>

          {/* Current Streak */}
          <div
            className={`rounded-2xl p-4 border mb-6 ${
              user.streakType === "win"
                ? "bg-gradient-to-br from-emerald-400/10 to-emerald-400/5 border-emerald-400/20"
                : "bg-gradient-to-br from-red-400/10 to-red-400/5 border-red-400/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-semibold mb-1">
                  Current Streak
                </div>
                <div className="text-slate-400 text-sm">
                  {user.currentStreak}{" "}
                  {user.streakType === "win" ? "wins" : "losses"} in a row
                </div>
              </div>
              <div
                className={`text-3xl font-bold ${
                  user.streakType === "win"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {user.currentStreak}
                <span className="text-lg ml-1">
                  {user.streakType === "win" ? "🔥" : "💔"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
              <span className="text-xs">📊</span>
            </span>
            Recent Activity
          </h3>

          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          activity.type === "win"
                            ? "bg-emerald-400"
                            : "bg-red-400"
                        }`}
                      ></span>
                      <span className="text-white font-semibold text-sm">
                        {activity.game}
                      </span>
                    </div>
                    <div className="text-slate-400 text-xs mb-2">
                      {activity.date}
                    </div>
                  </div>
                  <div
                    className={`font-bold text-sm ${
                      activity.type === "win"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {activity.type === "win" ? "+" : "-"}${activity.amount}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {activity.players.map((player, index) => (
                    <span
                      key={index}
                      className="bg-slate-700/50 px-2 py-1 rounded-md text-xs text-slate-300"
                    >
                      {player}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-3 flex items-center justify-center">
              <span className="text-xs">🏆</span>
            </span>
            Achievements
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`rounded-xl p-3 border ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-[#FFAB91]/10 to-[#FFAB91]/5 border-[#FFAB91]/20"
                    : "bg-slate-800/30 border-slate-700/30"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`text-lg mb-1 ${
                      achievement.unlocked ? "text-[#FFAB91]" : "text-slate-500"
                    }`}
                  >
                    {achievement.unlocked ? "🏆" : "🔒"}
                  </div>
                  <div
                    className={`font-semibold text-xs mb-1 ${
                      achievement.unlocked ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {achievement.name}
                  </div>
                  <div className="text-slate-400 text-xs leading-tight">
                    {achievement.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
