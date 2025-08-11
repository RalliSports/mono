"use client";

import { useState } from "react";

interface ReferralBonusPopupProps {
  type: "referral" | "bonus";
}

export default function ReferralBonusPopup({ type }: ReferralBonusPopupProps) {
  const [copied, setCopied] = useState(false);
  const [bonusClaimed, setBonusClaimed] = useState(false);

  const referralCode = "RALLY_MIKE2024";
  const referralLink = `https://ralli.app/join/${referralCode}`;

  const bonuses = [
    {
      id: 1,
      title: "Welcome Bonus",
      amount: 50,
      claimed: false,
      expires: "7 days",
    },
    {
      id: 2,
      title: "First Bet Bonus",
      amount: 25,
      claimed: true,
      expires: "Claimed",
    },
    {
      id: 3,
      title: "Weekend Warrior",
      amount: 100,
      claimed: false,
      expires: "2 days",
    },
    {
      id: 4,
      title: "Streak Master",
      amount: 75,
      claimed: false,
      expires: "5 days",
    },
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const claimBonus = (bonusId: number) => {
    setBonusClaimed(true);
    setTimeout(() => setBonusClaimed(false), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-3xl p-8 border border-slate-700 shadow-2xl max-w-lg w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          {type === "referral" ? (
            <>
              <svg
                className="w-6 h-6 text-[#00CED1] mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Refer & Earn
            </>
          ) : (
            <>
              <svg
                className="w-6 h-6 text-[#FFAB91] mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z"
                  clipRule="evenodd"
                />
              </svg>
              Bonus Rewards
            </>
          )}
        </h2>
      </div>

      {type === "referral" ? (
        <div className="space-y-6">
          {/* Referral Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-[#00CED1]">12</div>
              <div className="text-slate-400 text-sm">Referrals</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-[#FFAB91]">$420</div>
              <div className="text-slate-400 text-sm">Earned</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">8</div>
              <div className="text-slate-400 text-sm">Active</div>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-gradient-to-r from-[#00CED1]/5 to-[#FFAB91]/5 rounded-2xl p-6 border border-[#00CED1]/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              How it Works
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#00CED1] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <span className="text-slate-300">Share your referral link</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#FFAB91] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <span className="text-slate-300">
                  Friend signs up and bets $50+
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <span className="text-slate-300">You both get $25 bonus</span>
              </div>
            </div>
          </div>

          {/* Referral Code */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Your Referral Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={referralCode}
                  readOnly
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
                <button
                  onClick={() => copyToClipboard(referralCode)}
                  className="px-4 py-3 bg-[#00CED1] hover:bg-[#00CED1]/80 text-white rounded-xl transition-colors"
                >
                  {copied ? "✓" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Referral Link
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                />
                <button
                  onClick={() => copyToClipboard(referralLink)}
                  className="px-4 py-3 bg-[#FFAB91] hover:bg-[#FFAB91]/80 text-white rounded-xl transition-colors"
                >
                  {copied ? "✓" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
              <span>📘</span>
              <span>Facebook</span>
            </button>
            <button className="flex items-center justify-center space-x-2 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-colors">
              <span>🐦</span>
              <span>Twitter</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Available Bonuses */}
          <div className="space-y-4">
            {bonuses.map((bonus) => (
              <div
                key={bonus.id}
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  bonus.claimed
                    ? "bg-slate-800/30 border-slate-700/50"
                    : "bg-gradient-to-r from-[#FFAB91]/5 to-[#00CED1]/5 border-[#FFAB91]/20 hover:border-[#FFAB91]/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        bonus.claimed
                          ? "bg-slate-700"
                          : "bg-gradient-to-r from-[#FFAB91] to-[#00CED1]"
                      }`}
                    >
                      <span className="text-white font-bold">
                        ${bonus.amount}
                      </span>
                    </div>
                    <div>
                      <h4
                        className={`font-semibold ${bonus.claimed ? "text-slate-400" : "text-white"}`}
                      >
                        {bonus.title}
                      </h4>
                      <p
                        className={`text-sm ${bonus.claimed ? "text-slate-500" : "text-slate-300"}`}
                      >
                        {bonus.claimed
                          ? "Already claimed"
                          : `Expires in ${bonus.expires}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => claimBonus(bonus.id)}
                    disabled={bonus.claimed}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      bonus.claimed
                        ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#FFAB91] to-[#00CED1] text-white hover:shadow-lg transform hover:scale-105"
                    }`}
                  >
                    {bonus.claimed ? "Claimed" : "Claim"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bonus Rules */}
          <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/30">
            <h4 className="font-semibold text-white mb-3">Bonus Terms</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Bonuses must be used within expiry period</li>
              <li>• Minimum bet requirement applies</li>
              <li>• Wagering requirement: 3x bonus amount</li>
              <li>• Cannot be combined with other offers</li>
            </ul>
          </div>
        </div>
      )}

      {/* Success Message */}
      {(copied || bonusClaimed) && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {copied ? "Copied to clipboard!" : "Bonus claimed successfully!"}
        </div>
      )}
    </div>
  );
}
