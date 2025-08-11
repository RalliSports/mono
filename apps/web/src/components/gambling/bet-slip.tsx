"use client";

import { useState } from "react";

export default function BetSlip() {
  const [betType, setBetType] = useState("single");
  const [betSlip, setBetSlip] = useState([
    {
      id: 1,
      type: "stat",
      athlete: "Patrick Mahomes",
      team: "KC",
      position: "QB",
      matchup: "vs BUF",
      statType: "Passing Yards",
      line: 285.5,
      prediction: "HIGHER",
      icon: "🏈",
      stake: 50,
      confidence: 85,
    },
    {
      id: 2,
      type: "stat",
      athlete: "Josh Allen",
      team: "BUF",
      position: "QB",
      matchup: "@ KC",
      statType: "Rushing Yards",
      line: 45.5,
      prediction: "LOWER",
      icon: "🏃",
      stake: 25,
      confidence: 72,
    },
    {
      id: 3,
      type: "stat",
      athlete: "Cooper Kupp",
      team: "LAR",
      position: "WR",
      matchup: "vs SEA",
      statType: "Receiving Yards",
      line: 95.5,
      prediction: "HIGHER",
      icon: "🙌",
      stake: 75,
      confidence: 78,
    },
    {
      id: 4,
      type: "stat",
      athlete: "Derrick Henry",
      team: "TEN",
      position: "RB",
      matchup: "@ JAX",
      statType: "Rushing Yards",
      line: 125.5,
      prediction: "HIGHER",
      icon: "🏃",
      stake: 40,
      confidence: 91,
    },
  ]);

  const totalStake = betSlip.reduce((sum, bet) => sum + bet.stake, 0);

  // Pool-based calculation for stat predictions
  const activePlayersCount = 8; // Number of players currently in each pool
  const requiredDeposit = 25; // Base deposit per prediction
  const potentialPayout = betSlip.reduce((sum, bet) => {
    const totalPool = activePlayersCount * requiredDeposit + bet.stake;
    return sum + totalPool; // If prediction is correct, player wins the entire pool
  }, 0);

  return (
    <div className="relative h-full max-h-[1580px] overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl border border-white/10"></div>
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0, 206, 209, 0.1) 0%, transparent 50%)`,
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>

      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Premium Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00CED1]/20 to-[#FFAB91]/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <svg
                className="w-5 h-5 text-[#00CED1]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>{" "}
            <div>
              <h3 className="text-xl font-bold text-white">Stat Predictions</h3>
              <p className="text-slate-400 text-sm">
                Build your winning predictions
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#00CED1]/20 to-[#FFAB91]/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
            {" "}
            <span className="text-white font-bold text-sm">
              {betSlip.length}{" "}
              {betSlip.length === 1 ? "Prediction" : "Predictions"}
            </span>
          </div>
        </div>
        {/* Bet List - Scrollable */}
        <div className="flex-1 overflow-hidden mb-6">
          {betSlip.length > 0 ? (
            <div
              className="h-full overflow-y-auto pr-2 space-y-3"
              style={{ scrollbarWidth: "thin" }}
            >
              {betSlip.map((bet, index) => (
                <div
                  key={bet.id}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00CED1]/10"
                >
                  {/* Bet Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#00CED1]/20 to-[#FFAB91]/20 rounded-lg flex items-center justify-center">
                          <span className="text-sm">{bet.icon}</span>
                        </div>
                        <div>
                          <span className="text-white font-semibold text-sm">
                            {bet.athlete}
                          </span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-slate-400 text-xs">
                              {bet.team} {bet.position}
                            </span>
                            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                            <span className="text-slate-400 text-xs">
                              {bet.matchup}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setBetSlip(betSlip.filter((b) => b.id !== bet.id));
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all duration-200 p-1 hover:bg-red-500/10 rounded-lg"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* Stat Prediction */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-slate-300 text-xs font-medium">
                        {bet.statType}
                      </div>
                      <div className="text-white font-bold text-sm">
                        {bet.line}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                          bet.prediction === "HIGHER"
                            ? "bg-[#00CED1]/20 border-[#00CED1]/30 text-[#00CED1]"
                            : "bg-red-500/20 border-red-500/30 text-red-400"
                        }`}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d={
                              bet.prediction === "HIGHER"
                                ? "M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z"
                                : "M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 15.586l3.293-3.293a1 1 0 011.414 0z"
                            }
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs font-bold">
                          {bet.prediction}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-emerald-400 text-xs font-medium">
                          {bet.confidence}% confident
                        </span>
                      </div>
                    </div>
                  </div>{" "}
                  {/* Stake Input */}
                  <div className="relative mb-4">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm font-medium">
                      $
                    </div>
                    <input
                      type="number"
                      value={bet.stake}
                      onChange={(e) => {
                        const newSlip = betSlip.map((b) =>
                          b.id === bet.id
                            ? { ...b, stake: Number(e.target.value) || 0 }
                            : b
                        );
                        setBetSlip(newSlip);
                      }}
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl pl-8 pr-4 py-3 text-white font-semibold placeholder-slate-400 focus:outline-none focus:border-[#00CED1] focus:bg-white/10 transition-all duration-200"
                      placeholder="0"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-slate-400 text-xs">Stake</span>
                    </div>
                  </div>
                  {/* Pool Information & Potential Win */}
                  <div className="pt-3 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400">Pool Size:</span>
                        <div className="text-[#00CED1] font-bold">
                          $
                          {(
                            activePlayersCount * requiredDeposit +
                            bet.stake
                          ).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Net Profit:</span>
                        <div className="text-emerald-400 font-bold">
                          +${(activePlayersCount * requiredDeposit).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-700/30 to-slate-600/30 rounded-2xl flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-slate-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>{" "}
              <h4 className="text-white font-semibold mb-2">
                Your predictions are empty
              </h4>
              <p className="text-slate-400 text-sm">
                Add some athlete predictions to get started
              </p>
            </div>
          )}
        </div>{" "}
        {/* Prediction Type Selector */}
        {betSlip.length > 1 && (
          <div className="mb-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "single", name: "Individual", desc: "Separate pools" },
                  { id: "parlay", name: "Combined", desc: "All must hit" },
                  { id: "teaser", name: "Boosted", desc: "Better odds" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setBetType(type.id)}
                    className={`relative p-3 rounded-xl transition-all duration-300 text-center ${
                      betType === type.id
                        ? "bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg"
                        : "text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="font-bold text-sm mb-1">{type.name}</div>
                    <div className="text-xs opacity-80">{type.desc}</div>
                    {betType === type.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00CED1]/20 to-[#FFAB91]/20 rounded-xl blur-sm pointer-events-none"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Summary */}
        {betSlip.length > 0 && (
          <div className="mb-6">
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
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    Bet Summary
                  </h4>
                  <div className="text-right">
                    {" "}
                    <div className="text-sm text-slate-400">
                      {betType === "single"
                        ? `${betSlip.length} Individual Predictions`
                        : betType === "parlay"
                          ? "Combined Predictions"
                          : "Boosted Predictions"}
                    </div>
                    <div className="text-xl font-bold text-white">
                      ${totalStake}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 text-center">
                    <div className="text-slate-400 text-sm mb-1">
                      Total Stake
                    </div>
                    <div className="text-white font-bold text-xl">
                      ${totalStake}
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 text-center">
                    <div className="text-slate-400 text-sm mb-1">
                      Potential Win
                    </div>
                    <div className="text-[#00CED1] font-bold text-xl">
                      ${potentialPayout.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 text-center">
                    <div className="text-slate-400 text-sm mb-1">
                      Net Profit
                    </div>
                    <div className="text-emerald-400 font-bold text-xl">
                      +${(potentialPayout - totalStake).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">
                      Potential Return
                    </span>
                    <span className="text-white font-semibold">
                      {totalStake > 0
                        ? ((potentialPayout / totalStake - 1) * 100).toFixed(0)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{
                        width: `${totalStake > 0 ? Math.min((potentialPayout / totalStake - 1) * 10, 100) : 0}%`,
                      }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Place Bet Button */}
        {betSlip.length > 0 ? (
          <button className="w-full py-4 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-2xl text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#00CED1]/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              ></path>
            </svg>{" "}
            <span>
              Join{" "}
              {betType === "single"
                ? `${betSlip.length} Pool${betSlip.length !== 1 ? "s" : ""}`
                : `${betType.charAt(0).toUpperCase() + betType.slice(1)} Pool`}{" "}
              •{totalStake > 0 ? ` $${totalStake}` : " Enter Stakes"}
            </span>
          </button>
        ) : (
          <button
            disabled
            className="w-full py-4 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-slate-400 font-bold text-lg cursor-not-allowed flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span>Add Predictions to Continue</span>
          </button>
        )}
      </div>
    </div>
  );
}
