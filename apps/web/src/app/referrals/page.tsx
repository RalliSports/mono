"use client";

import { useState } from "react";
import Link from "next/link";

export default function Referrals() {
  const [activeTab, setActiveTab] = useState<"create" | "enter">("create");
  const [customCode, setCustomCode] = useState("");
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeStatus, setCodeStatus] = useState<
    "available" | "taken" | "invalid" | null
  >(null);
  const [referralCode, setReferralCode] = useState("");
  const [isValidatingReferral, setIsValidatingReferral] = useState(false);
  const [referralStatus, setReferralStatus] = useState<
    "valid" | "invalid" | null
  >(null);

  const [userStats] = useState({
    totalReferrals: 12,
    totalEarnings: 340.5,
    pendingRewards: 75.0,
    activeCode: "RALLY-JOHN123",
  });

  const [recentReferrals] = useState([
    {
      id: 1,
      username: "Mike_B",
      earnings: 25.0,
      date: "2 days ago",
      status: "confirmed",
    },
    {
      id: 2,
      username: "Sarah_K",
      earnings: 25.0,
      date: "1 week ago",
      status: "confirmed",
    },
    {
      id: 3,
      username: "Alex_M",
      earnings: 25.0,
      date: "2 weeks ago",
      status: "pending",
    },
  ]);

  const checkCodeAvailability = async (code: string) => {
    if (code.length < 3) {
      setCodeStatus(null);
      return;
    }

    setIsCheckingCode(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation logic
    const takenCodes = ["RALLY-TAKEN", "JOHN123", "POPULAR"];
    const invalidChars = /[^A-Z0-9-_]/;

    if (invalidChars.test(code)) {
      setCodeStatus("invalid");
    } else if (takenCodes.includes(code.toUpperCase())) {
      setCodeStatus("taken");
    } else {
      setCodeStatus("available");
    }

    setIsCheckingCode(false);
  };

  const validateReferralCode = async (code: string) => {
    if (code.length < 3) {
      setReferralStatus(null);
      return;
    }

    setIsValidatingReferral(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock validation logic
    const validCodes = ["RALLY-FRIEND", "WELCOME25", "NEWUSER"];

    if (validCodes.includes(code.toUpperCase()) || code.length >= 6) {
      setReferralStatus("valid");
    } else {
      setReferralStatus("invalid");
    }

    setIsValidatingReferral(false);
  };

  const handleCodeChange = (code: string) => {
    const formattedCode = code.toUpperCase().replace(/[^A-Z0-9-_]/g, "");
    setCustomCode(formattedCode);
    checkCodeAvailability(formattedCode);
  };

  const handleReferralChange = (code: string) => {
    const formattedCode = code.toUpperCase().replace(/[^A-Z0-9-_]/g, "");
    setReferralCode(formattedCode);
    validateReferralCode(formattedCode);
  };

  const generateRandomCode = () => {
    const adjectives = ["EPIC", "LEGENDARY", "ELITE", "CHAMPION", "VICTORY"];
    const numbers = Math.floor(Math.random() * 999) + 1;
    const randomCode = `${adjectives[Math.floor(Math.random() * adjectives.length)]}-${numbers}`;
    setCustomCode(randomCode);
    checkCodeAvailability(randomCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-2xl">🎁</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Referrals
          </h1>
          <p className="text-slate-400 text-lg">
            Earn rewards by inviting friends
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab("create")}
              className={`py-3 px-4 rounded-xl transition-all duration-200 font-semibold ${
                activeTab === "create"
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Create Code
            </button>
            <button
              onClick={() => setActiveTab("enter")}
              className={`py-3 px-4 rounded-xl transition-all duration-200 font-semibold ${
                activeTab === "enter"
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Enter Code
            </button>
          </div>
        </div>

        {/* Create Tab */}
        {activeTab === "create" && (
          <>
            {/* Current Stats */}
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-white font-bold text-lg mb-4">Your Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-purple-400 font-bold text-xl">
                    {userStats.totalReferrals}
                  </div>
                  <div className="text-slate-400 text-xs">Total Referrals</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-green-400 font-bold text-xl">
                    ${userStats.totalEarnings}
                  </div>
                  <div className="text-slate-400 text-xs">Total Earned</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">
                      Your Active Code
                    </div>
                    <div className="text-purple-400 font-mono text-lg">
                      {userStats.activeCode}
                    </div>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300 transition-colors">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Create Custom Code */}
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">
                  Create Exclusive Code
                </h3>
                <button
                  onClick={generateRandomCode}
                  className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-semibold"
                >
                  🎲 Random
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="ENTER-YOUR-CODE"
                  maxLength={20}
                  className="w-full px-4 py-4 pr-12 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 hover:border-slate-600 font-mono text-lg"
                />

                {/* Status Indicator */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {isCheckingCode ? (
                    <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : codeStatus === "available" ? (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : codeStatus === "taken" ? (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  ) : codeStatus === "invalid" ? (
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Status Messages */}
              {codeStatus && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    codeStatus === "available"
                      ? "bg-green-500/10 border border-green-400/20 text-green-400"
                      : codeStatus === "taken"
                        ? "bg-red-500/10 border border-red-400/20 text-red-400"
                        : "bg-orange-500/10 border border-orange-400/20 text-orange-400"
                  }`}
                >
                  {codeStatus === "available" && "✅ This code is available!"}
                  {codeStatus === "taken" && "❌ This code is already taken"}
                  {codeStatus === "invalid" &&
                    "⚠️ Use only letters, numbers, hyphens, and underscores"}
                </div>
              )}

              <div className="text-xs text-slate-500 space-y-1">
                <p>• Code must be 3-20 characters</p>
                <p>• Use letters, numbers, hyphens, and underscores only</p>
                <p>• Get $25 for each friend who joins with your code</p>
              </div>

              <button
                disabled={codeStatus !== "available" || !customCode}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:cursor-not-allowed disabled:transform-none"
              >
                🚀 Create Code
              </button>
            </div>

            {/* Recent Referrals */}
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-white font-bold text-lg mb-4">
                Recent Referrals
              </h3>
              <div className="space-y-3">
                {recentReferrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-purple-400 text-sm font-bold">
                          {referral.username.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">
                          {referral.username}
                        </div>
                        <div className="text-slate-400 text-xs">
                          {referral.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-sm">
                        +${referral.earnings}
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded ${
                          referral.status === "confirmed"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-orange-500/20 text-orange-400"
                        }`}
                      >
                        {referral.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Enter Tab */}
        {activeTab === "enter" && (
          <>
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="text-white font-bold text-lg">
                Enter Referral Code
              </h3>
              <p className="text-slate-400 text-sm">
                Have a referral code? Enter it below to get your bonus!
              </p>

              <div className="relative">
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => handleReferralChange(e.target.value)}
                  placeholder="ENTER-REFERRAL-CODE"
                  maxLength={20}
                  className="w-full px-4 py-4 pr-12 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 hover:border-slate-600 font-mono text-lg"
                />

                {/* Validation Indicator */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {isValidatingReferral ? (
                    <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : referralStatus === "valid" ? (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : referralStatus === "invalid" ? (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Validation Messages */}
              {referralStatus && (
                <div
                  className={`p-4 rounded-lg ${
                    referralStatus === "valid"
                      ? "bg-green-500/10 border border-green-400/20"
                      : "bg-red-500/10 border border-red-400/20"
                  }`}
                >
                  {referralStatus === "valid" ? (
                    <div className="text-green-400">
                      <div className="font-semibold mb-1">
                        ✅ Valid referral code!
                      </div>
                      <div className="text-sm">
                        You'll receive a $25 bonus when you make your first
                        deposit
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-400">
                      <div className="font-semibold mb-1">
                        ❌ Invalid referral code
                      </div>
                      <div className="text-sm">
                        Please check the code and try again
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                disabled={referralStatus !== "valid" || !referralCode}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:cursor-not-allowed disabled:transform-none"
              >
                🎁 Apply Referral Code
              </button>
            </div>

            {/* How It Works */}
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-white font-bold text-lg mb-4">
                How Referrals Work
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-400 font-bold">1</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      Enter a referral code
                    </div>
                    <div className="text-slate-400 text-xs">
                      Get a code from a friend who's already on Rally
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-400 font-bold">2</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      Make your first deposit
                    </div>
                    <div className="text-slate-400 text-xs">
                      Add funds to your account to activate the bonus
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 font-bold">3</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      Get your $25 bonus!
                    </div>
                    <div className="text-slate-400 text-xs">
                      Both you and your friend receive $25
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Back Navigation */}
        <div className="text-center">
          <Link
            href="/main"
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-purple-400 transition-colors duration-200"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
