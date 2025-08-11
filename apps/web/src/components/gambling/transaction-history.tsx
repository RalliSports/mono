"use client";

import { useState } from "react";

export default function TransactionHistory() {
  const [activeTab, setActiveTab] = useState("bets");

  const betHistory = [
    {
      id: 1,
      type: "single",
      game: "Chiefs vs Bills",
      selection: "Chiefs -3.5",
      stake: 100,
      odds: -110,
      result: "win",
      payout: 190.91,
      date: "2024-06-20T14:30:00",
      sport: "🏈",
      status: "settled",
    },
    {
      id: 2,
      type: "parlay",
      games: ["Lakers vs Warriors", "Cowboys vs Giants"],
      selections: ["Lakers ML", "Over 47.5"],
      stake: 50,
      odds: +280,
      result: "loss",
      payout: 0,
      date: "2024-06-19T20:15:00",
      sport: "🏀🏈",
      status: "settled",
    },
    {
      id: 3,
      type: "single",
      game: "Arsenal vs Chelsea",
      selection: "Arsenal Win",
      stake: 75,
      odds: +150,
      result: "win",
      payout: 187.5,
      date: "2024-06-19T15:45:00",
      sport: "⚽",
      status: "settled",
    },
    {
      id: 4,
      type: "single",
      game: "Lakers vs Celtics",
      selection: "Under 215.5",
      stake: 120,
      odds: -105,
      result: "pending",
      payout: 0,
      date: "2024-06-20T21:00:00",
      sport: "🏀",
      status: "pending",
    },
  ];

  const transactions = [
    {
      id: 1,
      type: "deposit",
      method: "Credit Card",
      amount: 500,
      fee: 0,
      status: "completed",
      date: "2024-06-20T10:00:00",
    },
    {
      id: 2,
      type: "withdrawal",
      method: "Bank Transfer",
      amount: 250,
      fee: 5,
      status: "processing",
      date: "2024-06-19T15:30:00",
    },
    {
      id: 3,
      type: "deposit",
      method: "PayPal",
      amount: 200,
      fee: 0,
      status: "completed",
      date: "2024-06-18T09:15:00",
    },
    {
      id: 4,
      type: "bonus",
      method: "Welcome Bonus",
      amount: 50,
      fee: 0,
      status: "completed",
      date: "2024-06-17T09:00:00",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
      {/* Modern Header with Stats */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-2xl flex items-center justify-center shadow-xl">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            {" "}
            <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Transaction History
            </h3>
            <p className="text-slate-400 text-sm">
              Track your bets and payments
            </p>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-4 text-center">
            <div className="text-emerald-400 font-bold text-xl">+$1,247</div>
            <div className="text-slate-400 text-xs">This Month</div>
          </div>
          <div className="bg-gradient-to-br from-[#00CED1]/20 to-[#00CED1]/10 border border-[#00CED1]/30 rounded-2xl p-4 text-center">
            <div className="text-[#00CED1] font-bold text-xl">24</div>
            <div className="text-slate-400 text-xs">Total Bets</div>
          </div>
        </div>
      </div>

      {/* Premium Tab Navigation */}
      <div className="flex space-x-2 bg-slate-800/60 backdrop-blur-sm rounded-2xl p-2 mb-8 border border-slate-700/40">
        <button
          onClick={() => setActiveTab("bets")}
          className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
            activeTab === "bets"
              ? "bg-gradient-to-r from-[#00CED1] to-[#4DD0E1] text-white shadow-xl shadow-[#00CED1]/30 transform scale-105"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <span className="text-2xl">🎯</span>
          <span>Bet History</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
            {betHistory.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
            activeTab === "transactions"
              ? "bg-gradient-to-r from-[#FFAB91] to-[#FF8A65] text-white shadow-xl shadow-[#FFAB91]/30 transform scale-105"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <span className="text-2xl">💰</span>
          <span>Transactions</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
            {transactions.length}
          </span>
        </button>
      </div>

      {/* Enhanced Content Area */}
      <div className="space-y-6 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent pr-2">
        {activeTab === "bets" && (
          <div className="space-y-6">
            {betHistory.map((bet, index) => (
              <div
                key={bet.id}
                className="group relative bg-gradient-to-br from-slate-800/70 to-slate-900/50 backdrop-blur-lg rounded-3xl p-6 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-500 hover:shadow-2xl hover:shadow-black/30 hover:scale-[1.02] transform"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: `fadeInUp 0.6s ease-out forwards`,
                }}
              >
                {/* Glowing Result Indicator */}
                <div
                  className={`absolute top-6 right-6 w-4 h-4 rounded-full shadow-lg ${
                    bet.result === "win"
                      ? "bg-emerald-400 shadow-emerald-400/50 animate-pulse"
                      : bet.result === "loss"
                        ? "bg-red-400 shadow-red-400/50"
                        : "bg-yellow-400 shadow-yellow-400/50 animate-pulse"
                  }`}
                />

                {/* Premium Bet Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-700/80 to-slate-800/60 rounded-3xl flex items-center justify-center border border-slate-600/40 shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">{bet.sport}</span>
                    </div>
                    <div>
                      {bet.type === "single" ? (
                        <>
                          <div className="text-white font-bold text-xl mb-1">
                            {bet.game}
                          </div>
                          <div className="text-slate-300 text-base mb-3">
                            {bet.selection}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-white font-bold text-xl mb-1">
                            Parlay Bet ({bet.games?.length} legs)
                          </div>
                          <div className="text-slate-300 text-sm mb-3 space-y-1">
                            {bet.games?.map((game, i) => (
                              <div
                                key={i}
                                className="flex items-center space-x-2"
                              >
                                <div className="w-2 h-2 bg-[#FFAB91] rounded-full"></div>
                                <span>
                                  {game} - {bet.selections?.[i]}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                            bet.type === "single"
                              ? "bg-gradient-to-r from-[#00CED1]/30 to-[#00CED1]/20 text-[#00CED1] border border-[#00CED1]/40"
                              : "bg-gradient-to-r from-[#FFAB91]/30 to-[#FFAB91]/20 text-[#FFAB91] border border-[#FFAB91]/40"
                          }`}
                        >
                          {bet.type}
                        </span>
                        <span className="text-slate-400 text-sm font-medium">
                          {formatDate(bet.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Stats Grid */}
                <div className="grid grid-cols-3 gap-6 p-6 bg-gradient-to-r from-slate-900/70 to-slate-800/50 rounded-2xl border border-slate-700/40 shadow-inner">
                  <div className="text-center group-hover:scale-110 transition-all duration-300">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      Stake
                    </div>
                    <div className="text-white font-bold text-2xl">
                      ${bet.stake}
                    </div>
                  </div>
                  <div className="text-center group-hover:scale-110 transition-all duration-300 delay-75">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      Odds
                    </div>
                    <div
                      className={`font-bold text-2xl ${
                        bet.odds > 0 ? "text-emerald-400" : "text-slate-300"
                      }`}
                    >
                      {bet.odds > 0 ? "+" : ""}
                      {bet.odds}
                    </div>
                  </div>
                  <div className="text-center group-hover:scale-110 transition-all duration-300 delay-150">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      {bet.result === "pending" ? "Potential" : "Payout"}
                    </div>
                    <div
                      className={`font-bold text-2xl ${
                        bet.result === "win"
                          ? "text-emerald-400"
                          : bet.result === "loss"
                            ? "text-red-400"
                            : "text-yellow-400"
                      }`}
                    >
                      ${bet.payout > 0 ? bet.payout.toFixed(2) : "0.00"}
                    </div>
                  </div>
                </div>

                {/* Enhanced Status Section */}
                <div className="mt-6 flex justify-between items-center">
                  <div
                    className={`px-6 py-3 rounded-2xl text-base font-bold flex items-center space-x-2 ${
                      bet.result === "win"
                        ? "bg-gradient-to-r from-emerald-500/30 to-emerald-600/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/20"
                        : bet.result === "loss"
                          ? "bg-gradient-to-r from-red-500/30 to-red-600/20 text-red-400 border border-red-500/40 shadow-lg shadow-red-500/20"
                          : "bg-gradient-to-r from-yellow-500/30 to-yellow-600/20 text-yellow-400 border border-yellow-500/40 shadow-lg shadow-yellow-500/20"
                    }`}
                  >
                    <span className="text-xl">
                      {bet.result === "pending"
                        ? "⏳"
                        : bet.result === "win"
                          ? "✅"
                          : "❌"}
                    </span>
                    <span>
                      {bet.result === "pending"
                        ? "PENDING"
                        : bet.result === "win"
                          ? "WON"
                          : "LOST"}
                    </span>
                  </div>

                  {bet.result !== "pending" && (
                    <div
                      className={`text-right ${
                        bet.result === "win"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      <div className="text-sm font-bold uppercase tracking-wider">
                        {bet.result === "win" ? "Profit" : "Loss"}
                      </div>
                      <div className="font-bold text-xl">
                        {bet.result === "win" ? "+" : "-"}$
                        {Math.abs(bet.payout - bet.stake).toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="space-y-6">
            {transactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="group relative bg-gradient-to-br from-slate-800/70 to-slate-900/50 backdrop-blur-lg rounded-3xl p-6 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-500 hover:shadow-2xl hover:shadow-black/30 hover:scale-[1.02] transform"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: `fadeInUp 0.6s ease-out forwards`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-5">
                    <div
                      className={`w-16 h-16 rounded-3xl flex items-center justify-center border shadow-xl group-hover:scale-110 transition-transform duration-300 ${
                        transaction.type === "deposit"
                          ? "bg-gradient-to-br from-emerald-600/80 to-emerald-700/60 border-emerald-500/40"
                          : transaction.type === "withdrawal"
                            ? "bg-gradient-to-br from-red-600/80 to-red-700/60 border-red-500/40"
                            : "bg-gradient-to-br from-yellow-600/80 to-yellow-700/60 border-yellow-500/40"
                      }`}
                    >
                      {transaction.type === "deposit" && (
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {transaction.type === "withdrawal" && (
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                            clipRule="evenodd"
                            transform="rotate(180 10 10)"
                          />
                        </svg>
                      )}
                      {transaction.type === "bonus" && (
                        <span className="text-2xl">🎁</span>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-bold text-xl capitalize">
                        {transaction.type}
                      </div>
                      <div className="text-slate-300 text-base">
                        {transaction.method}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {formatDate(transaction.date)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-bold text-3xl ${
                        transaction.type === "deposit" ||
                        transaction.type === "bonus"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.type === "deposit" ||
                      transaction.type === "bonus"
                        ? "+"
                        : "-"}
                      ${transaction.amount}
                    </div>
                    {transaction.fee > 0 && (
                      <div className="text-slate-400 text-sm font-medium">
                        Fee: $${transaction.fee}
                      </div>
                    )}
                    <div
                      className={`mt-2 px-4 py-2 rounded-full text-sm font-bold ${
                        transaction.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : transaction.status === "processing"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                            : "bg-red-500/20 text-red-400 border border-red-500/40"
                      }`}
                    >
                      {transaction.status === "completed"
                        ? "✅ COMPLETED"
                        : transaction.status === "processing"
                          ? "⏳ PROCESSING"
                          : "❌ FAILED"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Premium Footer */}
      <div className="mt-8 pt-6 border-t border-slate-700/40">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-slate-400 text-sm">
            {activeTab === "bets"
              ? "Last 30 days of betting activity"
              : "All payment transactions"}
          </div>
          <div className="flex space-x-4">
            <button className="bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white font-bold px-6 py-3 rounded-xl border border-slate-600/50 transition-all duration-300 hover:scale-105">
              <span className="mr-2">🔍</span>
              Filter
            </button>
            <button className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-bold px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-[#00CED1]/30 transform hover:scale-105 transition-all duration-300">
              <span className="mr-2">📊</span>
              Export History
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
