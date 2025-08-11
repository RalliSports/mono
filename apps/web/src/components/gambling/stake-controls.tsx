"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useParaWalletBalance } from "@/hooks/use-para-wallet-balance";

export default function StakeControls() {
  const [stake, setStake] = useState(50);
  const [multiplier, setMultiplier] = useState(1.5);

  // Para wallet balance hook
  const { isConnected, balances, isLoading: balanceLoading, error: balanceError } = useParaWalletBalance();
  
  // Format balance for display
  const formatBalance = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Pool-based calculation variables
  const activePlayersCount = 12; // Number of players currently in the game
  const requiredDeposit = 25; // Required deposit per player to join the game
  const totalPool = activePlayersCount * requiredDeposit + stake; // Total prize pool
  const winnerPayout = totalPool; // Winner takes the entire pool (or could be split)

  const quickStakes = [10, 25, 50, 100, 250, 500];
  const quickMultipliers = [1.2, 1.5, 2.0, 3.0, 5.0];

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FFAB91] to-[#00CED1] rounded-full blur-2xl"></div>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1]/20 to-[#FFAB91]/20 rounded-xl flex items-center justify-center mr-3 border border-[#00CED1]/30">
            <svg
              className="w-6 h-6 text-[#00CED1]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          Stake Controls
        </h3>
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-2 flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 font-semibold text-sm">Live</span>
          </div>
          <div className="bg-[#FFAB91]/20 border border-[#FFAB91]/30 rounded-full px-4 py-2">
            <span className="text-[#FFAB91] font-semibold text-sm">
              Balance: {isConnected ? 
                (balanceLoading ? "Loading..." : 
                 balanceError ? "$0.00" : 
                 `$${formatBalance(balances.totalUsd)}`) : 
                "$0.00"}
            </span>
          </div>
        </div>
      </div>{" "}
      {/* Stake Amount */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <label className="text-white text-lg font-bold flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00CED1]/20 to-[#FFAB91]/20 rounded-lg flex items-center justify-center mr-2">
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
            Stake Amount
          </label>
          <div className="text-right">
            <div className="text-xs text-slate-400">Current Stake</div>
            <div className="text-[#00CED1] font-bold text-lg">${stake}</div>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setStake(Math.max(1, stake - 10))}
            className="group w-14 h-14 bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:from-slate-700/80 hover:to-slate-800/80 rounded-2xl border border-slate-600/50 hover:border-[#00CED1]/50 flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <svg
              className="w-5 h-5 group-hover:text-[#00CED1] transition-colors"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>{" "}
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00CED1]/10 to-[#FFAB91]/5 rounded-2xl blur-xl"></div>
            <input
              type="number"
              value={stake}
              onChange={(e) => setStake(Number(e.target.value))}
              className="relative w-full bg-white/5 backdrop-blur-xl border-2 border-white/20 rounded-2xl px-8 py-5 text-white text-center text-3xl font-bold focus:outline-none focus:border-[#00CED1]/60 focus:bg-white/10 focus:shadow-2xl focus:shadow-[#00CED1]/20 transition-all duration-300 hover:border-white/30 hover:bg-white/8"
              placeholder="0"
            />
            <span className="absolute left-8 top-1/2 transform -translate-y-1/2 text-[#00CED1] text-2xl font-bold">
              $
            </span>
          </div>
          <button
            onClick={() => setStake(stake + 10)}
            className="group w-14 h-14 bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:from-slate-700/80 hover:to-slate-800/80 rounded-2xl border border-slate-600/50 hover:border-[#00CED1]/50 flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <svg
              className="w-5 h-5 group-hover:text-[#00CED1] transition-colors"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Quick Stakes */}
        <div className="grid grid-cols-3 gap-3">
          {quickStakes.map((amount) => (
            <button
              key={amount}
              onClick={() => setStake(amount)}
              className={`group relative py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 ${
                stake === amount
                  ? "bg-gradient-to-r from-[#00CED1] to-[#00CED1]/80 text-white shadow-lg shadow-[#00CED1]/30 border border-[#00CED1]/50"
                  : "bg-gradient-to-br from-slate-800/60 to-slate-900/60 text-slate-300 hover:text-white border border-slate-600/50 hover:border-slate-500/70 hover:from-slate-700/60 hover:to-slate-800/60"
              }`}
            >
              <div className="relative z-10">${amount}</div>
              {stake === amount && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#00CED1]/20 to-transparent rounded-xl animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>{" "}
      {/* Multiplier */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <label className="text-white text-lg font-bold flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FFAB91]/20 to-[#00CED1]/20 rounded-lg flex items-center justify-center mr-2">
              <svg
                className="w-4 h-4 text-[#FFAB91]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
              </svg>
            </div>
            Risk Multiplier
          </label>
          <div className="text-right">
            <div className="text-xs text-slate-400">Current Multiplier</div>
            <div className="text-[#FFAB91] font-bold text-lg">
              {multiplier}x
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() =>
              setMultiplier(
                Math.max(1.1, Number((multiplier - 0.1).toFixed(1)))
              )
            }
            className="group w-14 h-14 bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:from-slate-700/80 hover:to-slate-800/80 rounded-2xl border border-slate-600/50 hover:border-[#FFAB91]/50 flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <svg
              className="w-5 h-5 group-hover:text-[#FFAB91] transition-colors"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>{" "}
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFAB91]/10 to-[#00CED1]/5 rounded-2xl blur-xl"></div>
            <input
              type="number"
              step="0.1"
              value={multiplier}
              onChange={(e) => setMultiplier(Number(e.target.value))}
              className="relative w-full bg-white/5 backdrop-blur-xl border-2 border-white/20 rounded-2xl px-8 py-5 text-white text-center text-3xl font-bold focus:outline-none focus:border-[#FFAB91]/60 focus:bg-white/10 focus:shadow-2xl focus:shadow-[#FFAB91]/20 transition-all duration-300 hover:border-white/30 hover:bg-white/8"
              placeholder="1.0"
            />
            <span className="absolute right-8 top-1/2 transform -translate-y-1/2 text-[#FFAB91] text-2xl font-bold">
              x
            </span>
          </div>
          <button
            onClick={() => setMultiplier(Number((multiplier + 0.1).toFixed(1)))}
            className="group w-14 h-14 bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:from-slate-700/80 hover:to-slate-800/80 rounded-2xl border border-slate-600/50 hover:border-[#FFAB91]/50 flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <svg
              className="w-5 h-5 group-hover:text-[#FFAB91] transition-colors"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Quick Multipliers */}
        <div className="grid grid-cols-5 gap-2">
          {quickMultipliers.map((mult) => (
            <button
              key={mult}
              onClick={() => setMultiplier(mult)}
              className={`group relative py-3 px-3 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 ${
                multiplier === mult
                  ? "bg-gradient-to-r from-[#FFAB91] to-[#FFAB91]/80 text-white shadow-lg shadow-[#FFAB91]/30 border border-[#FFAB91]/50"
                  : "bg-gradient-to-br from-slate-800/60 to-slate-900/60 text-slate-300 hover:text-white border border-slate-600/50 hover:border-slate-500/70 hover:from-slate-700/60 hover:to-slate-800/60"
              }`}
            >
              <div className="relative z-10">{mult}x</div>
              {multiplier === mult && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFAB91]/20 to-transparent rounded-xl animate-pulse"></div>
              )}
              {mult >= 3.0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-slate-800 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Risk Warning */}
        {multiplier >= 3.0 && (
          <div className="mt-4 flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <svg
              className="w-5 h-5 text-red-400 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-400 text-sm font-medium">
              High risk multiplier selected
            </span>
          </div>
        )}
      </div>{" "}
      {/* Potential Payout */}
      <div className="relative z-10">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00CED1]/5 to-[#FFAB91]/5 rounded-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-white flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-[#00CED1]/20 rounded-lg flex items-center justify-center mr-2">
                  <svg
                    className="w-4 h-4 text-emerald-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
                  </svg>
                </div>
                Payout Calculator
              </h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 text-sm font-semibold">
                  Live
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl border border-slate-700/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#00CED1]/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[#00CED1]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>{" "}
                  <div>
                    <div className="text-slate-300 text-sm">
                      Total Prize Pool
                    </div>
                    <div className="text-white text-xs">Winner takes all</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#00CED1] font-bold text-2xl">
                    ${totalPool.toFixed(2)}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {activePlayersCount} players × ${requiredDeposit} + ${stake}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl border border-slate-700/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>{" "}
                  <div>
                    <div className="text-slate-300 text-sm">
                      Your Net Profit
                    </div>
                    <div className="text-white text-xs">If you win</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold text-2xl">
                    +${(totalPool - stake).toFixed(2)}
                  </div>
                  <div className="text-slate-400 text-sm">Profit margin</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl border border-slate-700/30">
                <div className="flex items-center space-x-3">
                  {" "}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activePlayersCount <= 5
                        ? "bg-emerald-500/20"
                        : activePlayersCount <= 10
                          ? "bg-yellow-500/20"
                          : "bg-red-500/20"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        activePlayersCount <= 5
                          ? "text-emerald-400"
                          : activePlayersCount <= 10
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-300 text-sm">
                      Competition Level
                    </div>
                    <div className="text-white text-xs">Win probability</div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold text-2xl ${
                      activePlayersCount <= 5
                        ? "text-emerald-400"
                        : activePlayersCount <= 10
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {activePlayersCount <= 5
                      ? "Low"
                      : activePlayersCount <= 10
                        ? "Medium"
                        : "High"}
                  </div>
                  <div className="text-slate-400 text-sm">
                    ~{(100 / activePlayersCount).toFixed(1)}% chance
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <button className="w-full py-4 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-[#00CED1]/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Join Game</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
